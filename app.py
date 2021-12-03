from flask import Flask,redirect,session,url_for
from flask.globals import request
from flask.helpers import flash
from flask.templating import render_template
from flask_sqlalchemy import SQLAlchemy
import pymysql
import random
import string
from scepy.reg import check_reg_form
from scepy.login import check_login_form
from scepy.features import get_day_time
import time

levels = {0:"学生",1:"学生干部",2:"辅导员"}

pymysql.install_as_MySQLdb()
app = Flask(__name__) 
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql://root:42289062awsdfG@localhost/sce_db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = 0
Flask.secret_key = ''.join(random.sample(string.ascii_letters + string.digits, 8))
db  = SQLAlchemy(app)
app.jinja_env.globals['levels'] = levels


class User(db.Model) : 
    __tablename__ = "user"
    uid = db.Column(db.CHAR(13), primary_key=1)
    name = db.Column(db.VARCHAR(20), nullable=0)
    major = db.Column(db.VARCHAR(4) , nullable=0)
    grClass = db.Column(db.CHAR(4) , nullable=0)
    pwd = db.Column(db.CHAR(32) , nullable=0)
    level = db.Column(db.CHAR(1) , nullable=0 , default= '0')
    def keys(self):
        return ('uid','name', 'major', 'grClass' , 'pwd' , 'level')

    def __getitem__(self, item):
        return getattr(self, item)

@app.route('/sce')
@app.route('/sce/index')
def index() :
    if session.get('is_log',0) :
        day_time = get_day_time()
        board_txt = open('./scepy/board.txt','r',encoding='utf-8').read()
        level = eval(session['level'])
        return render_template(
            'index_.html' , 
            day_time = day_time , 
            level=level , 
            infomation=board_txt
            )
    else :
        return redirect(url_for('login'))

@app.route('/sce/login', methods=['GET', 'POST'])
def login() :
    if request.method == 'GET' :
        if session.get('is_log',0) == 1 :
            is_exit = request.args.get('exit')
            if is_exit == '1' :
                session['is_log'] = 0
                return redirect(url_for('login'))
            return redirect(url_for('index'))
        else :
            return render_template('login.html')
    elif request.method == 'POST' :
        form = request.form
        if check_login_form(form , User.query) :
            user = User.query.filter_by(uid=form.get('codetxt')).first()
            session['uid'] = form.get('codetxt') # 获取表单数据
            session['is_log'] = 1
            session['level'] = user.level
            session['name'] = user.name
            flash('登陆成功！')
            return redirect(url_for('index'))
        else :
            flash('账号或密码输入不正确，请重试！')
            return redirect(url_for('login'))


@app.route('/sce/reg' , methods = ['GET','POST'])
def reg() :
    if request.method == 'GET' : 
        return render_template('reg.html')
    elif request.method == 'POST' :
        form = request.form
        uid = form.get('codetxt')
        if User.query.filter_by(uid=uid).first() :
            flash('该学号已经注册过，请更换学号或者直接登录。')
            return redirect(url_for('reg'))
        if check_reg_form(form) :
            reg_user = User(
                uid = uid ,
                name =  form.get('nametxt') ,
                major =  form.get('mjtxt') ,
                grClass =  form.get('yrtxt') +  form.get('cltxt') ,
                pwd =  form.get('pwdtxt')
            )
            db.session.add(reg_user)
            db.session.commit()
            session['is_log'] = 0
            flash('注册成功！')
            return redirect(url_for('login'))
        else :
            flash('注册信息填写有误，请检查后重试。')
            return redirect(url_for('reg'))

@app.route('/sce/license')
def license() :
    return render_template('license.html')

@app.route('/sce/about')
def about() :
    return render_template('about.html')

@app.route('/sce/modify')
def modify() :
    info_dict = dict(User.query.filter_by(uid=session['uid']).first())
    return render_template('modify_.html' , infomation=info_dict)