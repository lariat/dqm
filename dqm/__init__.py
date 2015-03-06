from flask import Flask

app = Flask(__name__)

from dqm import views
