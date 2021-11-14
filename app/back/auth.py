from pprint import pprint
import requests
from flask import request, redirect, jsonify, url_for
from flask_dance.contrib.github import github
from app_models import User, SecretKeys
from github_auth import github_data

SECRET_KEY = "moevm"


def authenticate(login, password):
    user = User.objects(login=login).first()
    print(user.githubID, password)
    if user and (user.password == password) or (password == "github" and user.githubID):
        return user


def identity(payload):
    user_id = payload['identity']
    return User.objects(id=user_id)


def customized_response_handler(access_token, identity):
    print(access_token)
    print(str(identity.id))
    return jsonify({
        'access_token': access_token.decode('utf-8'),
        'id': str(identity.id),
        'login': identity.login,
        'role': identity.role,
        'isAuth': True
    })


def github_login():
    if not github.authorized:
        return redirect(url_for('github.login'))

    account_info = github.get('/user')

    if account_info.ok:
        account_info_json = account_info.json()

        print(account_info_json)
        if User.objects(githubID=account_info_json['id']).count() == 0:
            return jsonify(
                isAuth=False,
                GitID=account_info_json['login']
            )
        else:
            user = User.objects(githubID=account_info_json['id']).first()
            return jsonify(
                isAuth=True,
                login=user.login,
                role=user.role,
                id=str(user.id)
            )
    return jsonify(
        isReg=False
    )


def onSignIn():
    data_dict = request.get_json()
    pprint(data_dict)
    pprint(User.objects())
    if User.objects(login=data_dict["login"], password=data_dict["password"]).count() == 0:
        return jsonify(
            isAuth=False,  # or false
            causeOfError="Неверный логин и/или пароль"
        )
    else:
        find = User.objects(login=data_dict["login"], password=data_dict["password"]).first()
        return jsonify(
            isAuth=True,
            login=data_dict["login"],
            role=find.role,
            id=str(find.id)
        )


def onSignUp():
    data_dict = request.get_json()
    pprint(data_dict)
    if User.objects(login=data_dict["login"]).count():
        return jsonify(
            isReg=False,
            causeOfError="Пользователь с таким логином уже существует"
        )
    if User.objects(githubLogin=data_dict["GithubLogin"]).count():
        return jsonify(
            isReg=False,
            causeOfError="Пользователь с таким логином от GitHub уже существует"
        )
    add = User(login=data_dict["login"])
    if data_dict.get("password1"):
        if data_dict["password1"] == data_dict["password2"]:
            add.password = data_dict["password1"]
        else:
            return jsonify(
                isReg=False,
                causeOfError="Пароли не совпадают"
            )
    if data_dict.get("GithubId"):
        add.githubID = str(data_dict.get("GithubId"))
    add.name = data_dict["name"]
    add.surname = data_dict["surname"]
    add.githubLogin = data_dict["GithubLogin"]
    add.moodleLogin = data_dict["MoodleLogin"]
    add.email = data_dict["email"]
    if data_dict["role"] == "Студент":
        if SecretKeys.objects(key = data_dict["secretKey"]).count():
            key_d = SecretKeys.objects(key = data_dict["secretKey"]).first()
            key_d.delete()
            add.group = data_dict["group"]
            add.role = "student"
        else:
            return jsonify(
                isReg=False,
                causeOfError="Неверный секретный код"
            )
    else:
        if (data_dict["role"] == "Преподаватель" or data_dict["role"] == "Администратор") \
                and data_dict["secretKey"] == "moevm":
            if data_dict["role"] == "Преподаватель":
                add.role = "teacher"
            else:
                add.role = "admin"
        else:
            return jsonify(
                isReg=False,
                causeOfError="Неверный секретный код"
            )
    add.save()
    return jsonify(
        isReg=True
    )


def ongithub_auth():
    response_type = "code"
    client_id = github_data["client_id"]
    redirect_uri = github_data["redirect_uri"]
    return jsonify(
        auth_url="https://github.com/login/oauth/authorize?response_type={}&client_id={}&redirect_uri={}".format(
            response_type, client_id, redirect_uri)
    ), 302


def ongithub_auth_next():
    data_dict = request.get_json()
    pprint(data_dict)

    # can be stored in a file
    client_id = github_data["client_id"]
    client_secret = github_data["client_secret"]
    redirect_uri = github_data["redirect_uri"]
    code = data_dict["code"]

    response = requests.post(
        'https://github.com/login/oauth/access_token',
        data={
            "client_id": client_id,
            "client_secret": client_secret,
            "code": code,
            "redirect_uri": redirect_uri
        })
    param_dict = {}
    for param in response.text.split("&"):
        key = param.split('=')[0]
        value = param.split('=')[1]
        param_dict[key] = value

    if "error" in param_dict:
        return jsonify(
            isAuth=False,
            error=param_dict.get("error")
        )
    else:
        response = requests.get(
            "https://api.github.com/user?access_token={}&scope={}&token_type={}".format(param_dict["access_token"],
                                                                                        param_dict["scope"],
                                                                                        param_dict["token_type"]))
        # return response.json()
        git_json = response.json()
        user = User.objects(
            githubID=str(response.json().get("id")))
        print(user)
        if user.count() > 0:
            user = user.first()
            return jsonify(
                needReg=False,
                isAuth=True,
                login=user.login,
                role=user.role,
                id=str(user.id)
            )
        else:
            return jsonify(
                needReg=True,
                isAuth=False,
                gitLogin=git_json.get("login"),
                gitId=git_json.get("id")
            )
