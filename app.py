from flask import Flask,redirect,session,url_for
from flask.globals import request
from flask.templating import render_template
from flask_sqlalchemy import SQLAlchemy
import pymysql

pymysql.install_as_MySQLdb()
app = Flask(__name__) 
Flask.secret_key = "87859158897599400jaydenwutisimsom"
db  = SQLAlchemy(app)
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql://root:42289062awsdfG@localhost/sce_db"

class User(db.Model) : 
    uid = db.Column(db.CHAR(13), primary_key=1)
    name = db.Column(db.VARCHAR(20), nullable=0)
    major = db.Column(db.VARCHAR(4) , nullable=0)
    grClass = db.Column(db.CHAR(4) , nullable=0)
    pwd = db.Column(db.VARCHAR(255) , nullable=0)
    level = db.Column(db.CHAR(1) , nullable=0 , default= '0')

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
        session['uid'] = request.form.get('codetxt') # 获取表单数据
        session['is_log'] = 1
        return render_template('license.html')

@app.route('/sce/reg' , methods = ['GET','POST'])
def reg() :
    if request.method == 'GET' : 
        return render_template('reg.html', regUrl = url_for('reg'),loginUrl = url_for('login'))
    elif request.method == 'POST' :
        uid = request.form.get('codetxt')
        if User.query.get(uid) :
            return redirect('/sce/login')
        reg_user = User(
            uid = uid ,
            name =  request.form.get('nametxt') ,
            major =  request.form.get('mjtxt') ,
            grClass =  request.form.get('yrtxt') +  request.form.get('cltxt') ,
            pwd =  request.form.get('pwdtxt')
        )
        db.session.add(reg_user)
        db.session.commit()
        return redirect('/sce/login')

@app.route('/sce/license')
def license() :
    return render_template('license.html')