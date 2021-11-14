import os
import uuid
from datetime import datetime
from datetime import timedelta

from flask import Flask, render_template, request, jsonify
from flask_jwt import JWT, jwt_required
from flask_socketio import SocketIO
from mongoengine import connect

from admin import sendUsers, responseUsers, sendDisciplines, responseDisciplines, responseTeachers, sendTeachers, \
    sendSecretkeys, responseSecretkeys
from auth import github_login, onSignIn, onSignUp, ongithub_auth_next, ongithub_auth, authenticate, identity, \
    customized_response_handler
from beta_docker import testDB, resetDB
from config import sendTeacher, sendDiscipline
from profile import onProfileQueues, onProfileView, onupeditProfile, oneditProfile
from queues import onAllQueues, onAddNewQueue, onjoinqueue, onqueueInfo, onqueueStudents, deleteQueue, onupRecord

os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
SECRET_KEY = str(uuid.uuid4())
app = Flask(__name__)
app.secret_key = SECRET_KEY
app.config['UPLOAD_FOLDER'] = '../data/'
app.config['JWT_AUTH_URL_RULE'] = '/signin'
app.config['JWT_AUTH_USERNAME_KEY'] = 'login'
app.config['JWT_EXPIRATION_DELTA'] = timedelta(seconds=604800)
socketio = SocketIO(app)


def connectToMongo(name):
    connect(name, host="db")


connectToMongo("Based")
resetDB()
testDB()

jwt = JWT(app, authenticate, identity)


@jwt.jwt_payload_handler
def _custom_jwt_payload_handler(identity):
    iat = datetime.utcnow()
    exp = iat + app.config.get('JWT_EXPIRATION_DELTA')
    nbf = iat + app.config.get('JWT_NOT_BEFORE_DELTA')
    identity = str(getattr(identity, 'id')) or str(identity['id'])
    print(identity)
    return {'exp': exp, 'iat': iat, 'nbf': nbf, 'identity': identity}


@jwt.auth_response_handler
def auth_response_handler(access_token, identity):
    return customized_response_handler(access_token, identity)


@jwt.jwt_error_handler
def customized_error_handler(error):
    return jsonify({
        'message': error.description,
        'code': error.status_code
    }), error.status_code


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'GET':
        return render_template("/index.html")


@app.route('/github')
def github():
    return github_login()


@app.route('/signin', methods=['POST'])
def signin():
    return onSignIn()


@app.route('/signup', methods=['POST'])
def signup():
    return onSignUp()


@app.route('/profile', methods=['POST'])
@jwt_required()
def profile():
    return onProfileView()


@app.route('/profilequeues', methods=['POST'])
@jwt_required()
def profilequeues():
    return onProfileQueues()


@app.route('/config/teachers/', methods=['GET'])
def configTeachers():
    return sendTeacher()


@app.route('/config/disciplines/', methods=['GET'])
def configDisciplines():
    return sendDiscipline()


@app.route('/addNewQueue', methods=['POST'])
@jwt_required()
def addNewQueue():
    return onAddNewQueue()


@app.route('/allqueues', methods=['POST'])
@jwt_required()
def allqueues():
    return onAllQueues()


@app.route('/deletequeue', methods=['POST'])
@jwt_required()
def deletequeue():
    return deleteQueue()


@app.route('/queuestudents', methods=['POST'])
@jwt_required()
def queuestudents():
    return onqueueStudents()


@app.route('/queueInfo', methods=['POST'])
@jwt_required()
def queueInfo():
    return onqueueInfo()


@app.route('/joinqueue', methods=['POST'])
@jwt_required()
def joinqueue():
    return onjoinqueue()


@app.route('/queue/action/', methods=['POST'])
@jwt_required()
def upRecord():
    return onupRecord()


@app.route('/profile/editor/needinfo', methods=['POST'])
@jwt_required()
def upeditProfile():
    return onupeditProfile()


@app.route('/profile/editor/updateinfo', methods=['POST'])
@jwt_required()
def editProfile():
    return oneditProfile()


@app.route('/db/users', methods=['GET', 'POST'])
@jwt_required()
def db_users():
    if request.method == 'GET':
        return sendUsers()
    else:
        return responseUsers()


@app.route('/db/disciplines', methods=['GET', 'POST'])
@jwt_required()
def db_disciplines():
    if request.method == 'GET':
        return sendDisciplines()
    else:
        return responseDisciplines()


@app.route('/db/secretkeys/', methods=['GET', 'POST'])
@jwt_required()
def configSecretKeys():
    if request.method == 'GET':
        return sendSecretkeys()
    else:
        return responseSecretkeys()


@app.route('/db/teachers', methods=['GET', 'POST'])
@jwt_required()
def db_teachers():
    if request.method == 'GET':
        return sendTeachers()
    else:
        return responseTeachers()


@app.route('/githubauth')
def github_auth():
    return ongithub_auth()


@app.route('/authenticate', methods=['POST'])
def github_auth_next():
    return ongithub_auth_next()


def main():
    app.run(host='0.0.0.0', port=8086)


if __name__ == '__main__':
    socketio.run(app)
