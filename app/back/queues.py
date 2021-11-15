from flask import request, jsonify
from app_models import User, Queue, Record, Comment, Telemetry
from operator import itemgetter
from app import socketio
from datetime import datetime


def onAddNewQueue():
    data_dict = request.get_json()
    print(data_dict)
    groups = data_dict["groups"].split(",")
    teacher = ""
    user = User.objects(id=data_dict["user_id"]).first()
    if data_dict.get("teacher"):
        teacher = data_dict["teacher"]
    else:
        teacher = user.name + " " + user.surname
    format_date = datetime.strftime(datetime.strptime(data_dict["date"], "%Y-%m-%d"), "%d-%m-%Y")
    format_start_date = datetime.strftime(datetime.strptime(data_dict["start_date"], "%Y-%m-%d"), "%d-%m-%Y")
    queue = Queue(discipline=data_dict["discipline"], author=user, groups=groups, date=format_date,
                  time=data_dict["time"], custom_start=data_dict["custom_start"], start_date=format_start_date,
                  start_time=data_dict["start_time"], teacher=teacher, description=data_dict["description"])
    queue.save()
    date = datetime.strftime(datetime.now(), "%d-%m-%Y %H:%M")
    telemetry = Telemetry(timestamp=date, relatedQueueId=queue.id,
                          actionType=1, description="Created Queue " + str(queue.id))
    user.telemetry.append(telemetry)
    user.save()
    return jsonify(success=True)  # or false


def onAllQueues():
    data_dict = request.get_json()
    print(data_dict)
    user = User.objects(id=data_dict["user_id"]).first()
    # Список очередей
    queues = []
    info = {}
    for queue in Queue.objects(archived=False):
        if queue.custom_start:
            q_time = datetime.strptime(queue.start_date + " " + queue.start_time, "%d-%m-%Y %H:%M")
        else:
            q_time = datetime.strptime(queue.date + " " + queue.time, "%d-%m-%Y %H:%M")
        if ((user.role == "student" and (
                user.group in queue.groups)) or user.role == "admin" or user.role == "teacher"):
            info["discipline"] = queue.discipline
            info["description"] = queue.description
            info["id"] = str(queue.id)
            info["teacher"] = queue.teacher
            info["author"] = str(queue.author.id)
            info["task"] = queue.description
            info["date"] = queue.date
            info["time"] = queue.time
            info["groups"] = queue.groups
            info["custom_start"] = queue.custom_start
            info["start_time"] = queue.start_time
            info["start_date"] = queue.start_date
            info["started"] = datetime.now() >= q_time
            queues.append(info)
            info = {}
    return jsonify(sorted(queues, key=lambda x: x['started'], reverse=True))


def onqueueStudents():
    data_dict = request.get_json()
    print(data_dict)
    records = []
    info = {}
    q = Queue.objects(id=data_dict["id"]).first()
    if q.custom_start:
        q_time = datetime.strptime(q.start_date + " " + q.start_time, "%d-%m-%Y %H:%M")
    else:
        q_time = datetime.strptime(q.date + " " + q.time, "%d-%m-%Y %H:%M")
    for record in q.records:
        info["id"] = str(record.id)
        info["name"] = record.student.name
        info["surname"] = record.student.surname
        info["author"] = str(record.student.id)
        info["group"] = record.student.group
        info["login"] = record.student.login
        info["task"] = record.task
        info["index"] = record.index
        info["count"] = q.students[str(record.student.id)]
        info["date"] = record.date
        records.append(info)
        info = {}
    records.sort(key=itemgetter('index'))
    data = {
        'list': records,
        'started': datetime.now() >= q_time
    }
    return jsonify(data)


def onqueueInfo():
    data_dict = request.get_json()
    print(data_dict)
    queue = Queue.objects(id=data_dict["id"]).first()
    if queue.custom_start:
        q_time = datetime.strptime(queue.start_date + " " + queue.start_time, "%d-%m-%Y %H:%M")
    else:
        q_time = datetime.strptime(queue.date + " " + queue.time, "%d-%m-%Y %H:%M")
    return jsonify(
        discipline=queue.discipline,
        groups=queue.groups,
        date=queue.date,
        time=queue.time,
        teacher=queue.teacher,
        description=queue.description,
        custom_start=queue.custom_start,
        start_time=queue.start_time,
        start_date=queue.start_date,
        started=datetime.now() >= q_time
    )


def onjoinqueue():
    data_dict = request.get_json()
    print(data_dict)
    q = Queue.objects(id=data_dict["queue_id"]).first()
    user = User.objects(id=data_dict["user_id"]).first()
    new_user = False
    if str(user.id) in q.students:
        q.students[str(user.id)] += 1
    else:
        q.students[str(user.id)] = 1
    # ограничение на запись в очередь до начала открытия
    if q.custom_start:
        q_time = datetime.strptime(q.start_date + " " + q.start_time, "%d-%m-%Y %H:%M")
    else:
        q_time = datetime.strptime(q.date + " " + q.time, "%d-%m-%Y %H:%M")
    if datetime.now() < q_time:
        return jsonify({
            'success': 'false',
            'causeOfError': 'Запись в очередь еще не открыта'
        })
    for r in q.records:  # запрет на запись, если позиция ниже второй
        if r.student == user:
            socketio.emit('notification', {
                'head': 'Запись отклонена',
                'message': 'Вы уже записаны в эту очередь'
            })
            return jsonify({
            })
    date = datetime.strftime(datetime.now(), "%d-%m-%Y %H:%M")
    record = Record(student=user, task=data_dict["task"],
                    index=(len(q.records) + 1), date=date)
    q.records.append(record)
    q.save()
    telemetry = Telemetry(timestamp=date, relatedQueueId=q.id,
                          actionType=3, description="Created record in Queue " + str(q.id))
    user.telemetry.append(telemetry)
    user.save()
    # socket.to(data_dict["queue_id"]).emit()
    return jsonify()


def onupRecord():
    data_dict = request.get_json()
    print(data_dict)
    queue = Queue.objects(id=data_dict["queue_id"]).first()
    index = 0
    for rec in queue.records:
        if str(rec.id) == data_dict["record_id"]:
            index = rec.index
            break
    if data_dict["action"] == 1:
        for rec in queue.records:
            if rec.index < index:
                rec.index += 1
            elif rec.index == index:
                rec.index = 1
    if data_dict["action"] == 2:
        for rec in queue.records:
            if rec.index == (index - 1):
                rec.index += 1
            elif rec.index == index:
                rec.index -= 1
    if data_dict["action"] == 3:
        for rec in queue.records:
            if rec.index == (index + 1):
                rec.index -= 1
            elif rec.index == index:
                rec.index += 1
    if data_dict["action"] == 4:
        for rec in queue.records:
            if rec.index > index:
                rec.index -= 1
            elif rec.index == index:
                rec.index = len(queue.records)
    if data_dict["action"] == 5:
        queue.records.sort(key=itemgetter('index'))
        to_archive = queue.records.pop(index - 1)
        queue.archive.append(to_archive)
        for rec in queue.records:
            if rec.index > index:
                rec.index -= 1
    if data_dict["action"] == 6:
        data_dict["to"] += 1
        queue.records.sort(key=itemgetter('index'))
        for rec in queue.records:
            print(data_dict["to"], rec.index)
            if index < data_dict["to"]:
                if index < rec.index <= data_dict["to"]:
                    rec.index -= 1
            else:
                if data_dict["to"] <= rec.index < index:
                    rec.index += 1
        for rec in queue.records:
            if str(rec.id) == data_dict["record_id"]:
                rec.index = data_dict["to"]
    queue.save()
    return jsonify({'success': 'true'})


def onComments():
    data_dict = request.get_json()
    print(data_dict)
    q = Queue.objects(id=data_dict["queue_id"]).first()
    comments = []
    for rec in q.records:
        if str(rec.id) == data_dict["record_id"]:
            for com in rec.comments:
                comments.append(
                    {
                        'id': str(com.id),
                        'text': com.text,
                        'date': com.date,
                        "author": com.author.name + " " + com.author.surname
                    }
                )
    return jsonify(comments)


def onQueueComment():
    data_dict = request.get_json()
    print(data_dict)
    if not data_dict["value"]:
        return jsonify()
    q = Queue.objects(id=data_dict["queue_id"]).first()
    user = User.objects(id=data_dict["author"]).first()
    e_rec = q.records[0]
    for rec in q.records:
        if str(rec.id) == data_dict["record_id"]:
            e_rec = rec
            date = datetime.strftime(datetime.now(), "%d-%m %H:%M")
            comment = Comment(text=data_dict["value"], date=date, author=user)
            rec.comments.append(comment)
    q.save()
    date = datetime.strftime(datetime.now(), "%d-%m-%Y %H:%M")
    telemetry = Telemetry(timestamp=date, relatedQueueId=q.id,
                          actionType=4, description="Commented Record " + str(e_rec.id) + " of Queue " + str(q.id))
    user.telemetry.append(telemetry)
    user.save()
    return jsonify()


def deleteQueue():
    data_dict = request.get_json()
    print(data_dict)
    q = Queue.objects(id=data_dict["queue_id"]).first()
    q.archived = True
    q.save()
    return jsonify()
