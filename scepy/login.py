def check_login_form(form, db):
    login_id = form.get('codetxt')
    login_pwd = form.get('pwdtxt')
    true_pwd = db.filter_by(uid=login_id).first()
    true_pwd = true_pwd.pwd
    if true_pwd == login_pwd:
        return 1
    return 0
