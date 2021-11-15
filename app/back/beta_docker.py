from app_models import User, Discipline, SecretKeys, Class
import string
import random


def resetDB():
    return


def testDB():
    if not User.objects():
        User(login='elqadmin', password='beta', email='elqadmin@etu.ru', name='Росс', surname='Лоули',
             patronymic='Элович', role='admin', githubLogin='githubexample', moodleLogin='moodleexample').save()
        User(login='elqstudent', password='beta', email='elqstudent@etu.ru', name='Олеся', surname='Ивлева',
             patronymic='Андреевна', role='student', group='8382',
             githubLogin='studgithub', moodleLogin='studmoodle').save()
        User(login='elqteacher', password='beta', email='elqteacher@etu.ru', name='Иван', surname='Федоров',
             patronymic='Александрович', role='teacher',
             githubLogin='teachergithub', moodleLogin='teachermoodle').save()
    if not Discipline.objects():
        Discipline(name='Объектно-ориентированное программирование', short='ООП').save()
        Discipline(name='Построение и анализ алгоритмов', short='ПиАА').save()
        Discipline(name='Организация ЭВМ', short='ОЭВМ').save()
        Discipline(name='Информатика', short='Инф').save()
    if not SecretKeys.objects():
        SecretKeys(key=''.join(random.choices(string.ascii_letters, k=10)), date='09.08.2021').save()
    if not Class.objects():
        Class(disciplineName="ООП", datetime="08/11/2021 13:40", repeatTime=14,
              description="Test class", type="Практика", groups=["all"]).save()
        Class(disciplineName="ПиАА", datetime="08/11/2021 13:40", repeatTime=14,
              description="Test class 2", type="Лабораторная", groups=["all"]).save()
        Class(disciplineName="ОЭВМ", datetime="08/11/2021 13:40", repeatTime=14,
              description="Test class 3", type="Лекция", groups=["all"]).save()

