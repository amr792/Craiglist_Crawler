from flask import Flask, flash, redirect, render_template, request, session, abort
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)

db = SQLAlchemy(app)


@app.route('/')
def home():
    if not session.get('logged_in'):
        return render_template('login.html')
    return 'test already logged in'

@app.route('/login', methods=['POST'])
def login():
    if request.form['password'] == 'password' and request.form['username'] == 'admin':
        session['logged_in'] = True
    else:
        flash('Invalid log-in')
    return home()

@app.route('/logout')
def logout():
    session['logged_in'] = False
    return home()

if __name__ == '__main__':
    app.secret_key = os.urandom(12)
    app.run(debug=True)
