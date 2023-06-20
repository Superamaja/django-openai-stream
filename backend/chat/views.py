from django.http import HttpResponse
from .settings import OPENAI_KEY

# Create your views here.

def chat(request):
    return HttpResponse("Hello, world. Your OpenAI key is: " + OPENAI_KEY)