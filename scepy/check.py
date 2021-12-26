import decimal


class Check_Info():
    def __init__(self, uid, name, mor, gpa, cet,
                 sprt, my, ld, dis, re, all, note, mjcl='',
                 statu='', full=None, rewards=[]):
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
        self.statu = statu
        self.full = full
        self.rewards = rewards
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
    statu = ''
    index = 0
    full = None
    rewards = []


class Conditions():
    def __init__(self, year, major, cl, checked=''):
        self.year = year
        self.major = major
        self.cl = cl
        self.checked = checked
    year = ''
    major = ''
    cl = ''
    checked = ''


def remove0(num):
    return num.to_integral() if num == num.to_integral() else num.normalize()


def sprt_v(v):
    if v >= 90:
        return 2
    elif v >= 80:
        return decimal.Decimal('1.5')
    elif v >= 60:
        return 1
    else:
        return 0


def output_infos(class_mates, Info, Reward, User):
    infos = []
    for class_mate in class_mates:
        info = Info.query.filter_by(uid=class_mate).first()
        user = User.query.filter_by(uid=class_mate).first()
        if not info:
            continue
        re_note = ''
        rewards = Reward.query.filter_by(uid=class_mate).all()
        re_v = 0
        if rewards:
            for reward in rewards:
                re_v += reward.value
                re_note += f"[{remove0(reward.value)}]{reward.note}, "
        gpa = ((info.gpa - 1) * 10 + 60) * decimal.Decimal('0.7')
        all = info.mor + gpa + \
            sprt_v(info.c1) + info.c2 + info.my + info.ld - info.dis + re_v
        infos.append(Check_Info(
            uid=class_mate,
            name=user.name,
            mor=remove0(info.mor),
            gpa=remove0(gpa),
            cet=info.cet,
            sprt=sprt_v(info.c1) + info.c2,
            my=remove0(info.my),
            ld=remove0(info.ld),
            re=remove0(decimal.Decimal(re_v)),
            dis=remove0(info.dis),
            all=remove0(decimal.Decimal(all)),
            note=re_note
        ))
    infos.sort(key=lambda x: x.all, reverse=1)
    i = 1
    for info in infos:
        info.index = i
        i += 1
    return infos


def output_apprv(infos, Info, Reward, User, majors, status):
    for info in infos:
        user = User.query.filter_by(uid=info.uid).first()
        user_i = Info.query.filter_by(uid=info.uid).first()
        user_r = Reward.query.filter_by(uid=info.uid).all()
        info.mjcl = majors[user.major] + user.grClass
        info.statu = status[user_i.checked]
        info.full = user_i
        info.note = '' if user_i.notes == None else user_i.notes
        info.rewards = user_r
    return infos
