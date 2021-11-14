import json
from app_models import User, Queue, RefToUser


def resetDB():
    for user in User.objects:
        user.delete()
    for ref in RefToUser.objects:
        ref.delete()
    for queue in Queue.objects:
        queue.delete()


def testDB():
    User(login='ross@example.com', password='12', name='Ross', surname='Lawley', role='admin', group='34',
         githubLogin="rossexample", moodleLogin="83518473").save()
    User(login='ol@example.com', password='12', name='Olesya', surname='Ivleva', role='student', group='81').save()
    User(login='olfg@example.com', password='12d', name='Olya', surname='Ikfld', role='student', group='82').save()
    User(login='olfg@example.com', password='12d', name='Olesya', surname='Is', role='student', group='82').save()
    ref = RefToUser(users=User.objects()).save()
    listID = []
    for userID in ref.users:
        listID.append(json.loads(userID.to_json()))
