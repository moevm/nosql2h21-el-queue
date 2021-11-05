docker rmi -f app_elqueue_web:latest
docker rmi -f mongo:3.2
docker rm app_elqueue_web_1
docker rm app_elqueue_db_1
docker-compose up --build -d
