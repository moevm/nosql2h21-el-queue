sudo apt-get install python3-venv
python3 -m venv venv
source venv/bin/activate
python -m pip install --upgrade pip
pip install flask
pip install mongoengine
pip install flask-socketio
pip install Flask-JWT
pip install python-socketio
pip install flask-dance
pip install selenium
export FLASK_APP=../app.py
export DOCKER=false
flask run --port=8091
