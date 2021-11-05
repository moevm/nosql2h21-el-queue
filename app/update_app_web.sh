docker rmi -f app_elqueue_web:latest
docker rm -f app_elqueue_web_1
docker-compose up --build -d
