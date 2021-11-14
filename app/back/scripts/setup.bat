py -m venv venv
cmd /k "venv\Scripts\activate & python -m pip install --upgrade pip & pip install flask & pip install mongoengine & pip install flask-socketio & pip install Flask-JWT & pip install python-socketio & pip install Flask-Dance & pip install selenium & set FLASK_APP=..\app.py & set DOCKER=false& flask run --port=8091"
pause
