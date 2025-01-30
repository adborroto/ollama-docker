from fastapi import FastAPI, HTTPException, Request
import ollama
import os
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import time


class RequestBody(BaseModel):
    prompt: str


PORT = os.environ.get("PORT", 8000)
MODEL_NAME = os.environ.get("MODEL_NAME", "deepseek-r1:1.5b")
API_KEY = os.environ.get("API_KEY", "test")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Ollama API is running for model: " + MODEL_NAME}


@app.post("/api/generate/")
def generate_response(body: RequestBody, request: Request):
    try:
        start_time = time.time()
        if API_KEY:
            request_api_key = request.headers.get("X-API-KEY")
            if not request_api_key or request_api_key != API_KEY:
                raise HTTPException(
                    status_code=401, detail="Invalid or missing API key"
                )
        response = ollama.chat(
            model=MODEL_NAME,
            messages=[{"role": "user", "content": body.prompt}],
        )
        elapsed_time = time.time() - start_time
        return {
            "generated_text": response["message"]["content"],
            "model": MODEL_NAME,
            "elapsed_time": elapsed_time,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


print("Starting API server...")
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=PORT)
