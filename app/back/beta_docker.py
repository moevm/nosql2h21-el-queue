from app_models import User, Discipline, SecretKeys
import string
import random


def resetDB():
    return


def testDB():
    if not User.objects():
        User(login='elqadmin', password='beta', email='elqadmin@etu.ru', name='Росс', surname='Лоули', role='admin',
             githubLogin='githubexample', moodleLogin='moodleexample').save()
        User(login='elqstudent', password='beta', email='elqstudent@etu.ru', name='Олеся', surname='Ивлева',
             role='student', group='8382', githubLogin='studgithub', moodleLogin='studmoodle').save()
        User(login='elqteacher', password='beta', email='elqteacher@etu.ru', name='Иван', surname='Федоров',
             role='teacher', githubLogin='teachergithub', moodleLogin='teachermoodle').save()
    if not Discipline.objects():
        Discipline(name='Объектно-ориентированное программирование', short='ООП').save()
        Discipline(name='Построение и анализ алгоритмов', short='ПиАА').save()
        Discipline(name='Организация ЭВМ', short='ОЭВМ').save()
        Discipline(name='Информатика', short='Инф').save()
    if not SecretKeys.objects():
        SecretKeys(key = ''.join(random.choices(string.ascii_letters, k=10)), date = '09.08.2020').save()
