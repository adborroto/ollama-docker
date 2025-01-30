build:
	docker build -t ollama-api .    
	# docker build -t ollama-api-llama --build-arg API_KEY=XXX --build-arg MODEL_NAME=llama3.1 .
build-no-cache:
	docker build --no-cache -t ollama-api .     
run:
	docker run -p 8000:8000 ollama-api
	# docker run -p 8000:8000 ollama-api-llama
stop:
	docker ps -q --filter ancestor=ollama-api | xargs -r docker stop

