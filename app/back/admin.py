from pprint import pprint
from flask import request, jsonify, send_file
from app_models import User, Discipline, SecretKeys, Queue
import string
import json
import random
import datetime
import csv
import os

def sendUsers():
    columns = [
        {
            'title': 'Роль',
            'field': 'role'
        },
        {
            'title': 'Логин',
            'field': 'login',
        },
        {
            'title': 'Имя',
            'field': 'name',
        },
        {
            'title': 'Фамилия',
            'field': 'surname',
        },
        {
            'title': 'Группа',
            'field': 'group',
        },
        {
            'title': 'Почта',
            'field': 'email',
        },
        {
            'title': 'Github',
            'field': 'githubLogin',
        },
        {
            'title': 'Moodle',
            'field': 'moodleLogin',
        },
    ]

    data = []
    for user in User.objects():
        if user.role == "Преподаватель" or user.role == "Администратор":
            user.group = "-"
        data.append(
            {
                'login': user.login,
                'name': user.name,
                'surname': user.surname,
                'group': user.group,
                'role': user.role,
                'email': user.email,
                'githubLogin': user.githubLogin,
                'moodleLogin': user.moodleLogin,
                'id': str(user.id)
            }
        )
    output = {
        'success': 'true',
        'table': {
            'columns': columns,
            'data': data
        }
    }
    return jsonify(output)


def responseUsers():
    data_dict = request.get_json()
    pprint(data_dict)
    info = data_dict['data']
    if data_dict['task'] == 'DEL_RECORD':
        # удаление пользователя
        user = User.objects(id=info['id']).first()
        user.delete()
        return jsonify({'success': 'true'})
    elif data_dict['task'] == 'UPD_RECORD':
        # обновление информации пользователя
        user = User.objects(id=data_dict['data'].get('id')).first()
        if info['role'] != "admin" and info['role'] != "teacher" and info['role'] != "student":
            return jsonify({'success': 'false',
                            'causeOfError': 'Неверная роль пользователя (допустимы "teacher", "student", "admin"'})
        # проверка, что логин уникальный
        for u in User.objects():
            if info['login'] == u.login and u != user:
                return jsonify({'success': 'false', 'causeOfError': 'Пользователь с таким логином уже существует'})
        user.name = info["name"]
        user.surname = info["surname"]
        user.githubLogin = info["githubLogin"]
        user.moodleLogin = info["moodleLogin"]
        user.email = info["email"]
        user.login = info["login"]
        user.save()
        return jsonify({'success': 'true'})
    else:
        # добавление нового пользователя
        for u in User.objects():
            if info['login'] == u.login:
                return jsonify({'success': 'false', 'causeOfError': 'Пользователь с таким логином уже существует'})
        if info['role'] != "admin" and info['role'] != "teacher" and info['role'] != "student":
            return jsonify({'success': 'false',
                            'causeOfError': 'Неверная роль пользователя (допустимы "teacher", "student", "admin"'})
        user = User(login=info['login'])
        user.role = info["role"]
        user.name = info["name"]
        user.surname = info["surname"]
        user.githubLogin = info["githubLogin"]
        user.moodleLogin = info["moodleLogin"]
        user.email = info["email"]
        user.save()
    return jsonify({'success': 'true'})


def sendTeachers():
    columns = [
        {
            'title': 'Роль',
            'field': 'role'
        },
        {
            'title': 'Логин',
            'field': 'login',
        },
        {
            'title': 'Имя',
            'field': 'name',
        },
        {
            'title': 'Фамилия',
            'field': 'surname',
        },
        {
            'title': 'Почта',
            'field': 'email',
        },
        {
            'title': 'Github',
            'field': 'githubLogin',
        },
        {
            'title': 'Moodle',
            'field': 'moodleLogin',
        },
    ]

    data = []
    for user in User.objects():
        if user.role == "teacher":
            data.append(
                {
                    'login': user.login,
                    'name': user.name,
                    'surname': user.surname,
                    'role': user.role,
                    'email': user.email,
                    'githubLogin': user.githubLogin,
                    'moodleLogin': user.moodleLogin,
                    'id': str(user.id)
                }
            )
    output = {
        'success': 'true',
        'table': {
            'columns': columns,
            'data': data
        }
    }
    return jsonify(output)


def responseTeachers():
    data_dict = request.get_json()
    pprint(data_dict)
    info = data_dict['data']
    if data_dict['task'] == 'DEL_RECORD':
        # удаление пользователя
        user = User.objects(id=info['id']).first()
        user.delete()
        return jsonify({'success': 'true'})
    elif data_dict['task'] == 'UPD_RECORD':
        # обновление информации пользователя
        user = User.objects(id=data_dict['data'].get('id')).first()
        if info['role'] != "admin" and info['role'] != "teacher" and info['role'] != "student":
            return jsonify({'success': 'false',
                            'causeOfError': 'Неверная роль пользователя (допустимы "teacher", "student", "admin"'})
        # проверка, что логин уникальный
        for u in User.objects():
            if info['login'] == u.login and u != user:
                return jsonify({'success': 'false', 'causeOfError': 'Пользователь с таким логином уже существует'})
        user.name = info["name"]
        user.surname = info["surname"]
        user.githubLogin = info["githubLogin"]
        user.moodleLogin = info["moodleLogin"]
        user.email = info["email"]
        user.login = info["login"]
        user.save()
        return jsonify({'success': 'true'})
    else:
        # добавление нового пользователя
        for u in User.objects():
            if info['login'] == u.login:
                return jsonify({'success': 'false', 'causeOfError': 'Пользователь с таким логином уже существует'})
        if info['role'] != "admin" and info['role'] != "teacher" and info['role'] != "student":
            return jsonify({'success': 'false',
                            'causeOfError': 'Неверная роль пользователя (допустимы "teacher", "student", "admin"'})
        user = User(login=info['login'])
        user.role = info["role"]
        user.name = info["name"]
        user.surname = info["surname"]
        user.githubLogin = info["githubLogin"]
        user.moodleLogin = info["moodleLogin"]
        user.email = info["email"]
        user.save()
    return jsonify({'success': 'true'})


def sendDisciplines():
    columns = [
        {
            'title': 'Название',
            'field': 'name'
        },
        {
            'title': 'Сокращение',
            'field': 'short',
        },
    ]

    data = []
    for disc in Discipline.objects():
        data.append(
            {
                'name': disc.name,
                'short': disc.short,
                'id': str(disc.id)
            }
        )
    output = {
        'success': 'true',
        'table': {
            'columns': columns,
            'data': data
        }
    }
    return jsonify(output)


def responseDisciplines():
    data_dict = request.get_json()
    pprint(data_dict)
    info = data_dict['data']
    if data_dict['task'] == 'DEL_RECORD':
        # удаление дисциплины
        disc = Discipline.objects(id=info['id']).first()
        disc.delete()
        return jsonify({'success': 'true'})

    # редактирование дисциплины
    if data_dict['task'] == 'UPD_RECORD':
        disc = Discipline.objects(id=info['id']).first()
        disc.name = info['name']
        disc.short = info['short']
        disc.save()
        return jsonify({'success': 'true'})

    # добавление дисциплины
    if data_dict['task'] == 'ADD_RECORD':
        Discipline(name=info['name'], short=info['short']).save()
        return jsonify({'success': 'true'})
    return jsonify({'success': 'true'})


def sendSecretkeys():
    columns = [
        {
            'title': 'Ключ',
            'field': 'key'
        },
        {
            'title': 'Дата',
            'field': 'date',
        }
    ]
    data = []
    for secret in SecretKeys.objects():
        data.append(
            {
                'key': secret.key,
                'id': str(secret.id),
                'date': secret.date
            }
        )
    output = {
        'success': 'true',
        'table': {
            'columns': columns,
            'data': data
        }
    }
    return jsonify(output)


def responseSecretkeys():
    data_dict = request.get_json()
    pprint(data_dict)
    if data_dict["task"] == "GEN_RECORD":
        data = data_dict["data"]
        for i in range(int(data["num"])):
            date_now = str(datetime.datetime.now())
            SecretKeys(key=''.join(random.choices(string.ascii_letters, k=10)), date=date_now[:19]).save()
    if data_dict["task"] == "DEL_RECORD":
        data = data_dict["data"]
        key = SecretKeys.objects(id=data['id']).first()
        key.delete()
    return jsonify({'success': 'true'})


def dbDownload():
    users = json.loads(User.objects.to_json())
    queues = json.loads(Queue.objects.to_json())
    disciplines = json.loads(Discipline.objects.to_json())
    secret_keys = json.loads(SecretKeys.objects.to_json())
    output = {
        'users': users,
        'queues': queues,
        'disciplines': disciplines,
        'secret_keys': secret_keys
    }
    print(output)
    return json.dumps(output, indent=2)

def uploadDisciplines(target):
    file = request.files['file']
    filename = "disciplines.csv"
    destination = "".join([target, filename])
    file.save(destination)
    csv_file = open("".join([target, filename]), encoding='utf-8')
    csv_reader = csv.reader(csv_file, delimiter=',')
    for row in csv_reader:
        print(row[0], row[1])
        Discipline(name=row[1], short=row[0]).save()
    return jsonify(True)
