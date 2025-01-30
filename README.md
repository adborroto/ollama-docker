# `ollama`-docker

A Docker image for running `Ollama`, an open-source framework for running large language models locally.

## Features

- Easy deployment of `Ollama` in a containerized environment
- Support for various LLM models
- FastAPI integration for API access
- Python-based client interactions

## Prerequisites

- Docker installed on your system
- Basic understanding of Docker commands
- At least 8GB RAM recommended for running models

## Run image

To build the Docker image, use the following command:

```
docker build --build-arg MODEL_NAME=llama2 -t your-image-name .
```

By default uses the `deepseek-r1:1.5b`
