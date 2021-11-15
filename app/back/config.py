from flask import jsonify
from app_models import User, Discipline


def sendTeacher():
    users = []
    for user in User.objects():
        if user.role == "teacher" or user.role == "admin":
            teacher = user.name + " " + user.surname
            users.append(teacher)
    return jsonify(users)


def sendDiscipline():
    disciplines = []
    for disc in Discipline.objects:
        disciplines.append(disc.short)
    print(disciplines)
    return jsonify(disciplines)
