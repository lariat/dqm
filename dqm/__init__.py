from flask import Flask
app = Flask(__name__)
from dqm import views

# not really a secret, but you are not to be told what this is so shush
app.secret_key = 'tU1Yqx7DTZCP2vVw2qHbj57x8dQJRn9sWmYMyQgjdwPLm5Zp84UImJoS4Tg0COR'
