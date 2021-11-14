from flask import request, jsonify
from app_models import User, Queue
from datetime import datetime
import operator


def onProfileView():
    data_dict = request.get_json()
    print(data_dict)
    log = data_dict["login"]
    find = User.objects(login=log).first()
    return jsonify(
        login=find.login,
        role=find.role,
        name=find.name,
        surname=find.surname,
        GitID=find.githubLogin,
        moodleID=find.moodleLogin,
        group=find.group
    )


def onProfileQueues():
    data_dict = request.get_json()
    print(data_dict)
    queues = []
    info = {}
    for queue in Queue.objects(archived=False):
        if queue.custom_start:
            q_time = datetime.strptime(queue.start_date + " " + queue.start_time, "%d-%m-%Y %H:%M")
        else:
            q_time = datetime.strptime(queue.date + " " + queue.time, "%d-%m-%Y %H:%M")
        if data_dict["role"] == "student":
            for record in queue.records:
                if record.student["login"] == data_dict["login"]:
                    info["discipline"] = queue.discipline
                    info["id"] = str(queue.id)
                    info["teacher"] = queue.teacher
                    info["description"] = queue.description
                    info["date"] = queue.date
                    info["time"] = queue.time
                    info["groups"] = queue.groups
                    info["index"] = len(queues) + 1
                    info["custom_start"] = queue.custom_start
                    info["start_time"] = queue.start_time
                    info["start_date"] = queue.start_date
                    info["started"] = datetime.now() >= q_time
                    queues.append(info)
                    info = {}
                    break
        else:
            info["discipline"] = queue.discipline
            info["id"] = str(queue.id)
            info["teacher"] = queue.teacher
            info["description"] = queue.description
            info["author"] = str(queue.author.id)
            info["date"] = queue.date
            info["time"] = queue.time
            info["index"] = len(queues) + 1
            info["custom_start"] = queue.custom_start
            info["start_time"] = queue.start_time
            info["start_date"] = queue.start_date
            info["started"] = datetime.now() >= q_time
            queues.append(info)
            info = {}
    return jsonify(sorted(queues, key=lambda x: x['started'], reverse=True))


def onupeditProfile():
    data_dict = request.get_json()
    print(data_dict)
    info = {}
    user = User.objects(id=data_dict["user_id"]).first()
    info["email"] = user.email
    info["login"] = user.login
    info["name"] = user.name
    info["surname"] = user.surname
    info["GithubLogin"] = user.githubLogin
    info["MoodleLogin"] = user.moodleLogin
    user_info = {"userInfo": info}
    return jsonify(user_info)


def oneditProfile():
    data_dict = request.get_json()
    print(data_dict)
    user = User.objects(id=data_dict["user_id"]).first()
    dict = data_dict["newData"]
    if dict["email"] != "":
        user.email = dict["email"]
    if dict["login"] != "":
        user.login = dict["login"]
    if dict["name"] != "":
        user.name = dict["name"]
    if dict["surname"] != "":
        user.surname = dict["surname"]
    if dict["GithubLogin"] != "":
        user.githubLogin = dict["GithubLogin"]
    if dict["MoodleLogin"] != "":
        user.moodleLogin = dict["MoodleLogin"]
    user.save()
    return jsonify()
