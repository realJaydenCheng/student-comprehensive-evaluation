import xlrd
import decimal
from xlutils.copy import copy
from scepy.check import remove0,sprt_v

majors = {
    'mis': '信管', 'bmc': '工商类', 'bm': '工商', 'gj': '工商gj', '%': '全部',
    'ac': '会计', 'acca': '会计acca', 'fm': '财务', 'hr': '人力', 'mk': '营销'
}


def str_mor(mor):
    if mor>=13 :
        return '优'
    elif mor>=11 :
        return '良'
    elif mor >=9 :
        return '合格' 
    else :
        return '不合格'

def creat_info_list(uids,User,Info,Reward) :
    datas = []
    index = 1
    mor , index_gpa , gpa , re_sum , all_sum , index_sum , re_note = 0,0,0,0,0,0,0
    for uid in uids :
        user = User.query.filter_by(uid=uid).first()
        info = Info.query.filter_by(uid=uid).first()
        if info == None :
            continue
        data = [
            index , user.name , uid , '管理学院' , '20'+user.grClass[:2],
            majors[user.major] , majors[user.major] + '20'+user.grClass ,
            info.job , info.mor , mor , 
            info.gpa , gpa , info.cet , index_gpa ,
            sprt_v(info.c1)+info.c2 , sprt_v(info.c1) , info.c2 ,
            info.my , info.ld , re_sum , info.dis ,
            all_sum , index_sum , info.low , info.cre ,
            43 , re_note 
        ]
        rewards = Reward.query.filter_by(uid=uid).all()
        if rewards:
            for reward in rewards:
                re_sum += reward.value
                re_note += f"[{remove0(reward.value)}]{reward.note}, "
        else :
            re_note = ''
            re_sum = 0
        data[-8] , data[-1] = re_sum , re_note

        gpa = ((info.gpa - 1) * 10 + 60) * decimal.Decimal('0.7')
        mor = str_mor(info.mor)
        data[9] , data[11] = mor , gpa
        all_sum = data[8] + data[11] + data[14] +data[17] + data[18] + data[19]
        data[-6] = all_sum
        datas.append(data)

    sort_by_gpa = sorted([info[11] for info in datas],reverse = 1)
    sort_by_sum = sorted([info[-6] for info in datas],reverse = 1)
    for i in range(1,len(datas)+1) :
        datas[i-1][0] = i
        datas[i-1][13] = sort_by_gpa.index(datas[i-1][11])
        datas[i-1][-5] = sort_by_sum.index(datas[i-1][-6])

    return datas

def creat_excel(path,tem_name,datas) :
    workbook = xlrd.open_workbook(path+tem_name)
    rows_old = 3  
    new_workbook = copy(workbook)  
    new_worksheet = new_workbook.get_sheet(0)  
    for i in range(0, len(datas)):
        for j in range(0, len(datas[i])):
            new_worksheet.write(i+rows_old, j, datas[i][j]) 
    new_workbook.save(path+tem_name)

