build:
	docker build -t garbage-collector-web-app:dev .

run:
	docker run --name garbage_collector_web_app -p 8080:8080 -p 9000:9000 garbage-collector-web-app:dev

deploy:
	gcloud init
	gcloud app deploy
