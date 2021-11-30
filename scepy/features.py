import time 

def get_day_time() :
    day_time = time.localtime(time.time())
    day_time = day_time.tm_hour
    if 5<=day_time<11 :
        return '早上'
    elif 11<=day_time<14 :
        return '中午'
    elif 14<=day_time<19 :
        return '下午'
    elif 19<=day_time<=24 or 0<=day_time<5 :
        return '晚上'