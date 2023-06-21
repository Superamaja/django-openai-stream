# django-openai-stream

This React app uses Django's StreamingHttpResponse to stream data from the API to the frontend, mimicking ChatGPT's typing animation.

I built this app to people how they can recreate the typing animation in their own apps with OpenAI.

## Installation

Start by cloning the repository.

### Backend

Change your directory to the backend folder.

```bash
cd backend
```

Install the required packages.

```bash
pip install -r requirements.txt
```

Copy the `.env.example` file as `.env` and fill in the `OPENAI_KEY` variable with your OpenAI API key.

```bash
cp .env.example .env
```

Run the Django server.

```bash
python manage.py runserver
```

### Frontend

Change your directory to the frontend folder.

```bash
cd frontend
```

Install the required packages.

```bash
npm install
```

Run the React app.

```bash
npm run dev
```
