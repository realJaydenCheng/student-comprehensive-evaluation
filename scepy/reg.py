import re 

majors = {'bms','mis','ac','fm','hr','mk','bm','gj','acca'}

def check_reg_form(form) :
    uid = form.get('codetxt')
    name = form.get('nametxt') 
    major =  form.get('mjtxt') 
    grClass = form.get('yrtxt') + form.get('cltxt') 
    pwd =  form.get('pwdtxt')
    if check_uid(uid) == 0 :
        return 0
    if name == '' :
        return 0
    if check_class(major , grClass) == 0:
        return 0
    if len(pwd) != 32 :
        return 0
    return 1

def check_uid(uid) :
    if len(uid) != 13 :
        return 0
    if re.match(r'012\d{10}' , uid) == None :
        return 0
    return 1

def check_class(mj , cl):
    if (len(cl) != 4) :
        return 0
    if (mj == 'bmc') and (cl[:2] != '21') :
        return 0
    return 1
    