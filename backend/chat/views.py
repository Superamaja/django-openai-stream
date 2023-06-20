import openai
from django.http import JsonResponse, StreamingHttpResponse
from rest_framework.decorators import api_view

from .settings import OPENAI_KEY

# Create your views here.

openai.api_key = OPENAI_KEY


@api_view(["POST"])
def chat(request):
    try:
        prompt = request.data["prompt"]
    except KeyError:
        return JsonResponse({"error": "No prompt provided."}, status=400)

    def generate_response():
        for resp in openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            stream=True,
        ):
            content = resp["choices"][0]["delta"]

            if content is not None and "content" in content:
                yield content["content"]

    return StreamingHttpResponse(generate_response(), content_type="text/event-stream")
