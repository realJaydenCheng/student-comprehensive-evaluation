import decimal

class Check_Info():
    def __init__(self , uid , name , mor , gpa , cet ,
    sprt , my , ld , dis , re , all , note , mjcl = ''):
        self.uid = uid 
        self.name = name 
        self.mor = mor 
        self.gpa = gpa
        self.cet = cet 
        self.sprt = sprt
        self.my = my
        self.ld = ld
        self.dis = dis 
        self.re = re 
        self.all = all 
        self.note = note
        self.mjcl = mjcl
    mjcl = ''
    uid = ''
    name = ''
    mor = ''
    gpa = ''
    cet = ''
    sprt = ''
    my = ''
    ld = ''
    dis = ''
    re = ''
    all = ''
    note = ''
    index = 0

class Conditions() :
    def __init__(self ,year,major,cl) :
        self.year = year
        self.major = major 
        self.cl= cl
    year = ''
    major = ''
    cl = ''

def remove_exponent(num):
    return num.to_integral() if num == num.to_integral() else num.normalize()

def sprt_v(v) :
    if v >= 90 :
        return 2
    elif v >= 80 :
        return decimal.Decimal('1.5')
    elif v >= 60 :
        return 1
    else :
        return 0

def output_infos(class_mates,Info,Reward) :
    infos = [] 
    for class_mate in class_mates :
        uid = class_mate.uid
        info = Info.query.filter_by(uid=uid).first()
        if not info :
            continue
        re_note = ''
        rewards = Reward.query.filter_by(uid=uid).all()
        re_v = 0
        if rewards :
            for reward in rewards :
                re_v += reward.value
                re_note += f"[{remove_exponent(reward.value)}]{reward.note}, "
        gpa = ((info.gpa - 1) * 10 + 60) * decimal.Decimal('0.7')
        all = info.mor + gpa + sprt_v(info.c1) + info.c2 + info.my + info.ld - info.dis + re_v
        infos.append(Check_Info(
            uid = uid,
            name = class_mate.name ,
            mor = remove_exponent(info.mor) ,
            gpa = remove_exponent(gpa) ,
            cet = info.cet ,
            sprt = sprt_v(info.c1) + info.c2 ,
            my = remove_exponent(info.my) ,
            ld = remove_exponent(info.ld) ,
            re = remove_exponent(decimal.Decimal(re_v)) ,
            dis = remove_exponent(info.dis) ,
            all = remove_exponent(decimal.Decimal(all)) ,
            note = re_note
            ))
    infos.sort(key=lambda x:x.all , reverse= 1)
    i = 1
    for info in infos :
        info.index = i 
        i += 1
    return infos

