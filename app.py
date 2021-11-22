from flask import Flask,redirect,session,url_for
from flask.globals import request
from flask.templating import render_template

app = Flask(__name__) 
Flask.secret_key = "temp"

@app.route('/sce')
@app.route('/home')
@app.route('/index')
def sec_index() :
    if session['is_log'] :
        return render_template('/license.html')
    else :
        return redirect('/sce/login')

@app.route('/sce/login', methods=['GET', 'POST'])
def login() :
    if request.method == 'GET' :
        return render_template('login.html',loginUrl = url_for('login'))
    elif request.method == 'POST' :
        session['user'] = request.args.get('codetxt')
        session['is_log'] = 1
        return render_template('license.html')

@app.route('/sce/reg')
def reg() :
    return render_template('reg.html')

@app.route('/sce/license')
def license() :
    return render_template('license.html')