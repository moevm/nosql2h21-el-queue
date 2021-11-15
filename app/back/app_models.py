from mongoengine import Document, EmbeddedDocument, StringField, ReferenceField, IntField, ListField, \
    EmbeddedDocumentField, ObjectIdField, BooleanField, DictField
from bson.objectid import ObjectId


class Telemetry(EmbeddedDocument):
    id = ObjectIdField(default=ObjectId)
    timestamp = StringField(required=True)
    description = StringField(required=True)
    actionType = IntField(required=True)
    relatedQueueId = ObjectIdField(default=ObjectId)


class User(Document):
    login = StringField(required=True)
    password = StringField(max_length=50)
    email = StringField(max_length=50)
    name = StringField(required=True, max_length=50)
    surname = StringField(required=True, max_length=50)
    patronymic = StringField(max_length=50)
    role = StringField(required=True, max_length=50)
    githubID = StringField(max_length=50)
    githubLogin = StringField(max_length=50)
    moodleID = StringField(max_length=50)
    moodleLogin = StringField(max_length=50)
    group = StringField(max_length=50)
    telemetry = ListField(EmbeddedDocumentField(Telemetry))


class RefToUser(Document):
    users = ListField(ReferenceField(User))


class Class(Document):
    disciplineName = StringField(required=True)
    datetime = StringField(required=True)
    repeatTime = IntField()
    author = ReferenceField(User)
    description = StringField()
    type = StringField(required=True)
    groups = ListField(StringField(), required=True)


class Comment(EmbeddedDocument):
    id = ObjectIdField(default=ObjectId)
    author = ReferenceField(User)
    date = StringField()
    text = StringField()


class Record(EmbeddedDocument):
    id = ObjectIdField(default=ObjectId)
    student = ReferenceField(User)
    index = IntField()
    date = StringField()
    archiveDate = StringField()
    task = StringField()
    comments = ListField(EmbeddedDocumentField(Comment))


class Queue(Document):
    discipline = StringField(required=True)
    students = DictField()
    classRef = ReferenceField(Class)
    groups = ListField(StringField(), required=True)
    date = StringField(required=True)
    time = StringField(required=True)
    teacher = StringField(required=True)
    author = ReferenceField(User)
    # teacher = ListField(ReferenceField(User))
    description = StringField()
    custom_start = BooleanField()
    start_date = StringField(required=True)
    start_time = StringField(required=True)
    records = ListField(EmbeddedDocumentField(Record))
    archive = ListField(EmbeddedDocumentField(Record))
    archived = BooleanField(default=False)


class Discipline(Document):
    name = StringField(required=True)
    short = StringField()


class SecretKeys(Document):
    key = StringField(required=True)
    date = StringField(required=True)
