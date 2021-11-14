py -m venv venv
cmd /k "venv\Scripts\activate & set FLASK_APP=..\app.py & set DOCKER=false& flask run --port=8091"
pause
