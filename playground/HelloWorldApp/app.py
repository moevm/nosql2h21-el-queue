from flask import Flask
from mongoengine import connect
from mongoengine import Document, StringField


# creating class for HelloWorld document
class HelloWorld(Document):
    hello_world = StringField(required=True)


app = Flask(__name__)
# connect to the DB and write test message
connect("HelloWorldDB")
HelloWorld(hello_world='hello world from MongoDB').save()


# send test message by route
@app.route('/')
def hello_world():
    response = HelloWorld.objects.first().hello_world
    return response


if __name__ == '__main__':
    app.run()
