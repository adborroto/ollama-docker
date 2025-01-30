# Use official Ollama image
FROM ollama/ollama:latest

COPY requirements.txt .

ARG MODEL_NAME=deepseek-r1:1.5b
ARG API_KEY=
ENV MODEL_NAME=${MODEL_NAME}
ENV API_KEY=${API_KEY}

# Install Python and dependencies
RUN apt update && apt install -y python3 python3-pip && \
    pip3 install -r requirements.txt

# Set work directory
WORKDIR /app

# Copy the FastAPI app and entrypoint script
COPY app.py .
COPY entrypoint.sh /entrypoint.sh

# Make entrypoint script executable
RUN chmod +x /entrypoint.sh

# Expose the API port
EXPOSE 8000

# Run Ollama in background and pull model
RUN ollama serve > /dev/null 2>&1 & \
    sleep 5 && \
    ollama pull ${MODEL_NAME} && \
    pkill ollama

ENTRYPOINT ["/entrypoint.sh"]
