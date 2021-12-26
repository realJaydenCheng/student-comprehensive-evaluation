import pymysql
from flask import Flask, redirect, session, url_for
from flask.globals import request
from flask.helpers import flash
from flask.templating import render_template
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import and_

from scepy.features import check_modify, get_day_time, tran_reward
from scepy.login import check_login_form
from scepy.reg import check_reg_form
from scepy.check import output_infos, output_apprv, Conditions, remove0


levels = {0: "学生", 1: "学生干部", 2: "辅导员"}
majors = {
    'mis': '信管', 'bmc': '工商管理类', 'bm': '工商', 'gj': '工商gj', '%': '全部',
    'ac': '会计', 'acca': '会计acca', 'fm': '财务', 'hr': '人力', 'mk': '营销'
}
status = {0: "待班干审核", 1: "待导员审核", 2: "已完成审核",
          '0': "待班干审核", '1': "待导员审核", '2': "已完成审核", '%': "全部"}

pymysql.install_as_MySQLdb()
app = Flask(__name__)
app.config.from_object("settings.Debug")
db = SQLAlchemy(app)
app.jinja_env.globals['levels'] = levels
app.jinja_env.globals['majors'] = majors
app.jinja_env.globals['status'] = status
app.add_template_global(remove0)
app.add_template_global(str)


class User(db.Model):
    __tablename__ = "user"
    uid = db.Column(db.CHAR(13), primary_key=1)
    name = db.Column(db.VARCHAR(20), nullable=0)
    major = db.Column(db.VARCHAR(4), nullable=0)
    grClass = db.Column(db.CHAR(4), nullable=0)
    pwd = db.Column(db.CHAR(32), nullable=0)
    level = db.Column(db.CHAR(1), nullable=0, default='0')

    def keys(self):
        return ('uid', 'name', 'major', 'grClass', 'pwd', 'level')

    def __getitem__(self, item):
        return getattr(self, item)


class Info(db.Model):
    __tablename__ = 'info'
    uid = db.Column(db.CHAR(13), primary_key=1)
    job = db.Column(db.VARCHAR(50), nullable=0, default='无')
    mor = db.Column(db.DECIMAL(4, 2), nullable=0)
    gpa = db.Column(db.DECIMAL(5, 4), nullable=0)
    cet = db.Column(db.CHAR(1), nullable=1)
    c1 = db.Column(db.DECIMAL(3, 2), nullable=0)
    c2 = db.Column(db.DECIMAL(3, 2), nullable=0)
    my = db.Column(db.DECIMAL(3, 2), nullable=0)
    ld = db.Column(db.DECIMAL(3, 2), nullable=0)
    dis = db.Column(db.DECIMAL(4, 2), nullable=0)
    low = db.Column(db.DECIMAL(5, 4), nullable=0)
    cre = db.Column(db.DECIMAL(7, 4), nullable=0)
    checked = db.Column(db.INT, nullable=0, default=0)
    notes = db.Column(db.VARCHAR(200), nullable=1)

    def keys(self):
        return ('uid', 'job', 'mor', 'gpa', 'cet', 'c1', 'c2', 'my', 'ld', 'dis', 'low', 'cre', 'checked', 'notes')

    def __getitem__(self, item):
        return getattr(self, item)


class Reward(db.Model):
    __tablename__ = "reward"
    id = db.Column(db.INT, primary_key=1)
    uid = db.Column(db.CHAR(13), primary_key=1)
    note = db.Column(db.VARCHAR(50), nullable=1)
    value = db.Column(db.DECIMAL(5, 4), nullable=1)

    def keys(self):
        return ('id', 'uid', 'note', 'value')

    def __getitem__(self, item):
        return getattr(self, item)


@app.route('/sce')
@app.route('/sce/')
@app.route('/sce/index')
def index():
    if session.get('is_log', 0):
        day_time = get_day_time()
        board_txt = open('./scepy/board.txt', 'r', encoding='utf-8').read()
        level = eval(session['level'])
        info = Info.query.filter_by(uid=session.get('uid')).first()
        if info:
            info = dict(info)
        else:
            info = {'checked': 0}
        info_status = status[info.get('checked')]
        if session.get('level', 0) == '2':
            gr = User.query.filter_by(uid=session.get('uid'))[0].grClass[:2]
            users = db.session.query(User).filter(
                User.grClass.like(gr + '%')).all()
            submit_n = 0
            for user in users:
                if Info.query.filter_by(uid=user.uid).first():
                    submit_n += 1
        else:
            gr = User.query.filter_by(uid=session.get('uid'))[0].grClass
            users = db.session.query(User).filter(User.grClass == gr).all()
            submit_n = 0
            for user in users:
                if Info.query.filter_by(uid=user.uid).first():
                    submit_n += 1
        return render_template(
            'index_.html',
            day_time=day_time,
            level=level,
            infomation=board_txt,
            submit_n=submit_n,
            info_status=info_status
        )
    else:
        return redirect(url_for('login'))


@app.route('/sce/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        if session.get('is_log', 0) == 1:
            is_exit = request.args.get('exit')
            if is_exit == '1':
                session['is_log'] = 0
                return redirect(url_for('login'))
            return redirect(url_for('index'))
        else:
            return render_template('login.html')
    elif request.method == 'POST':
        form = request.form
        if check_login_form(form, User.query):
            user = User.query.filter_by(uid=form.get('codetxt')).first()
            session['uid'] = form.get('codetxt')  # 获取表单数据
            session['is_log'] = 1
            session['level'] = user.level
            session['name'] = user.name
            session['major'] = user.major
            session['grClass'] = user.grClass
            flash('登陆成功! ')
            return redirect(url_for('index'))
        else:
            flash('账号或密码输入不正确，请重试! ')
            return redirect(url_for('login'))


@app.route('/sce/reg', methods=['GET', 'POST'])
def reg():
    if request.method == 'GET':
        return render_template('reg.html')
    elif request.method == 'POST':
        form = request.form
        uid = form.get('codetxt')
        if User.query.filter_by(uid=uid).first():
            flash('该学号已经注册过，请更换学号或者直接登录。')
            return redirect(url_for('reg'))
        if check_reg_form(form):
            reg_user = User(
                uid=uid,
                name=form.get('nametxt'),
                major=form.get('mjtxt'),
                grClass=form.get('yrtxt') + form.get('cltxt'),
                pwd=form.get('pwdtxt')
            )
            db.session.add(reg_user)
            db.session.commit()
            session['is_log'] = 0
            flash('注册成功! ')
            return redirect(url_for('login'))
        else:
            flash('注册信息填写有误，请检查后重试。')
            return redirect(url_for('reg'))


@app.route('/sce/license')
def license():
    return render_template('license.html')


@app.route('/sce/about')
def about():
    return render_template('about.html')


@app.route('/sce/modify', methods=['GET', 'POST'])
def modify():
    if session.get('is_log', 0) == 1:
        if request.method == 'GET':
            if session.get('level', 0) == '2':
                flash('辅导员无需填写信息! ')
                return redirect(url_for('index'))
            info_dict = dict(User.query.filter_by(uid=session['uid']).first())
            infos = Info.query.filter_by(uid=session['uid']).first()
            if infos:
                infos = dict(infos)
                info_dict.update(infos)
            rewards = Reward.query.filter_by(uid=session['uid']).all()
            return render_template('modify_.html', infomation=info_dict, rewards=rewards)
        if request.method == 'POST':
            if session.get('level', 0) == '2':
                flash('辅导员无需填写信息! ')
                return redirect(url_for('index'))
            form = request.form
            form_get = form.get
            if check_login_form(form, User.query) and check_modify():
                user_info = Info.query.filter_by(uid=session['uid']).first()
                if user_info:
                    user_info.job = form_get('jobtxt')
                    user_info.mor = form_get('mortxt')
                    user_info.gpa = form_get('gpatxt')
                    user_info.cet = form_get('cet')
                    user_info.c1 = form_get('c1txt')
                    user_info.c2 = form_get('c2txt')
                    user_info.my = form_get('mytxt')
                    user_info.ld = form_get('ldtxt')
                    user_info.dis = form_get('distxt')
                    user_info.cre = form_get('cretxt')
                    user_info.low = form_get('lowtxt')
                    user_info.checked = 0
                else:
                    user_info = Info(
                        uid=form_get('codetxt'),
                        job=form_get('jobtxt'),
                        mor=form_get('mortxt'),
                        gpa=form_get('gpatxt'),
                        cet=form_get('cet'),
                        c1=form_get('c1txt'),
                        c2=form_get('c2txt'),
                        my=form_get('mytxt'),
                        ld=form_get('ldtxt'),
                        dis=form_get('distxt'),
                        cre=form_get('cretxt'),
                        low=form_get('lowtxt'),
                        checked=0
                    )
                    db.session.add(user_info)
                rewards = Reward.query.filter_by(uid=session['uid']).all()
                rewards_txt = form_get('rewards', None)
                new_reward = tran_reward(rewards_txt)
                if rewards:
                    for reward in rewards:
                        db.session.delete(reward)
                        db.session.commit()
                if new_reward:
                    for id in new_reward:
                        reward = Reward(
                            uid=session['uid'],
                            id=id,
                            value=new_reward[id][0],
                            note=new_reward[id][1]
                        )
                        db.session.add(reward)
                db.session.commit()
                flash('提交成功! ')
                return redirect(url_for('modify'))
            else:
                flash("密码错误或者信息不合法，请重新输入! ")
                return redirect(url_for('modify'))
    else:
        flash("请先登录~")
        return redirect(url_for('login'))


@app.route('/sce/check', methods=['GET', 'POST'])
def check():
    if session.get('is_log', None):
        if request.method == "GET":
            if session.get("level", None) == "2":
                condition = Conditions(session['grClass'][:2], '%', '%', '%')
                class_mates = db.session.query(User).filter(
                    User.grClass.like(session['grClass'][:2] + '%')).all()
                if not class_mates:
                    flash("没有相关数据! ")
                    return render_template("check_tch.html")
                class_mates = list(map(lambda x: x.uid, class_mates))
                infos = output_infos(class_mates, Info, Reward, User)
                for info in infos:
                    user = User.query.filter_by(uid=info.uid).first()
                    info.mjcl = majors[user.major] + user.grClass
                return render_template("check_tch.html", infos=infos, session=session, n=len(infos), condition=condition)
            else:  # 查找符合条件的User对象，存入列表，交给output_infos()函数格式化输出。
                class_mates = db.session.query(User).filter(
                    User.grClass == session["grClass"]).all()
                if not class_mates:
                    flash("没有相关数据! ")
                    return render_template("check_stu.html")
                class_mates = list(map(lambda x: x.uid, class_mates))
                infos = output_infos(class_mates, Info, Reward, User)
                return render_template("check_stu.html", infos=infos, session=session, n=len(infos))
        elif request.method == "POST":
            if session.get("level", None) == "2":
                condition = Conditions(
                    session['grClass'][:2],
                    request.form.get('mj'),
                    request.form.get('cl')
                )
                class_mates = db.session.query(User).filter(and_(
                    User.grClass.like(condition.year + '%'),
                    User.grClass.like('%' + condition.cl)
                )).all()
                class_mates2 = db.session.query(Info).filter(
                    User.major.like(condition.major)).all()
                class_mates = list(set(map(lambda x: x.uid, class_mates)) & set(
                    map(lambda x: x.uid, class_mates2)))
                if not class_mates:
                    flash("没有相关数据! ")
                    return render_template("check_tch.html", infos=[], session=session, n=0, condition=condition)
                infos = output_infos(class_mates, Info, Reward, User)
                for info in infos:
                    user = User.query.filter_by(uid=info.uid).first()
                    info.mjcl = majors[user.major] + user.grClass
                return render_template("check_tch.html", infos=infos, session=session, n=len(infos), condition=condition)
            else:
                flash("同学是不是哪里点错了捏？")
                return redirect(url_for('index'))
    else:
        flash("请先登录~")
        return redirect(url_for('login'))


@app.route('/sce/apprv', methods=['GET', 'POST'])
def apprv():
    if session.get('is_log', None):
        if request.method == 'GET':
            if session.get("level", None) in ("2", "1"):
                condition = Conditions(session['grClass'][:2], '%', '%', '%')
                class_mates = db.session.query(User).filter(
                    User.grClass.like(session['grClass'][:2] + '%')).all()
                if not class_mates:
                    flash("没有相关数据! ")
                    return render_template('apprv_.html', infos=[], session=session, n=len([]), condition=condition)
                class_mates = list(map(lambda x: x.uid, class_mates))
                infos = output_infos(class_mates, Info, Reward, User)
                infos = output_apprv(infos, Info, Reward, User, majors, status)
                return render_template('apprv_.html', infos=infos, session=session, n=len(infos), condition=condition)
            else:
                flash("这是给辅导员和班干用的功能哦~")
                return redirect(url_for('index'))
        elif request.method == "POST":
            if session.get("level", None) in ("2", "1"):
                condition = Conditions(
                    session['grClass'][:2],
                    request.form.get('mj'),
                    request.form.get('cl'),
                    request.form.get('ischeck')
                )
                class_mates = db.session.query(User).filter(and_(
                    User.grClass.like(condition.year + '%'),
                    User.grClass.like('%' + condition.cl),
                    User.major.like(condition.major),
                    Info.checked.like(condition.checked)
                )).all()
                class_mates2 = db.session.query(Info).filter(
                    Info.checked.like(condition.checked)
                ).all()
                class_mates = list(set(map(lambda x: x.uid, class_mates)) & set(
                    map(lambda x: x.uid, class_mates2)))
                if not class_mates:
                    flash("没有相关数据! ")
                    return render_template('apprv_.html', infos=[], session=session, n=len([]), condition=condition)
                infos = output_infos(class_mates, Info, Reward, User)
                infos = output_apprv(infos, Info, Reward, User, majors, status)
                return render_template('apprv_.html', infos=infos, session=session, n=len(infos), condition=condition)
            else:
                flash("这是给辅导员和班干用的功能哦~")
                return redirect(url_for('index'))
    else:
        flash("请先登录~")
        return redirect(url_for('login'))


@app.route('/sce/apprving', methods=['POST'])
def apprving():
    if session.get('is_log', 0) == 1:
        if session.get('level', None) in ('1', '2'):
            uids = list(request.form.keys())
            for uid in uids:
                if uid[-1] == 'c':
                    continue
                info = Info.query.filter_by(uid=uid).first()
                info.checked = request.form.get(uid+'c', 0)
                info.notes = request.form.get(uid, 0)
            db.session.commit()
            return redirect(url_for('apprv'))
        else:
            flash("这是给辅导员和班干用的功能哦~")
            return redirect(url_for('index'))
    else:
        flash("请先登录~")
        return redirect(url_for('login'))
