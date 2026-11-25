# AI Simplified Learning Agent

A Python agent built with Google's Agent Development Kit (ADK) and Gemini.

## 1. Requirements

- Python 3.11+
- A Google AI Studio API key
- Internet access

## 2. Create a virtual environment

### Windows PowerShell

```powershell
cd agent-backend
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
```

If PowerShell blocks activation, use Command Prompt and run:
```bat
.venv\Scripts\activate.bat
```

## 3. Configure Gemini

Copy `.env.example` to `.env`, then add your Google AI Studio API key to `GOOGLE_API_KEY`.

Get a key from https://aistudio.google.com/apikey. Keep it private. Do not put it in the React app or commit the `.env` file.

## 4. Run the agent locally

From the `agent-backend` directory, run:

```powershell
adk web --port 8000
```

Open http://localhost:8000, select `ai_simplified_agent`, and try:
- Find beginner courses about Python.
- Explain embeddings with a practical example.
- Create a 5-question intermediate quiz about RAG.

## 5. Deployment

After local testing, deploy the ADK agent to Cloud Run. The frontend will call the deployed backend; Gemini credentials remain in the backend environment.

See Google's current ADK deployment guide:
https://google.github.io/adk-docs/deploy/cloud-run/
