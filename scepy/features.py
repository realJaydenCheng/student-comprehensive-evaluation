import time


def get_day_time():
    day_time = time.localtime(time.time())
    day_time = day_time.tm_hour
    if 5 <= day_time < 11:
        return '早上'
    elif 11 <= day_time < 14:
        return '中午'
    elif 14 <= day_time < 19:
        return '下午'
    elif 19 <= day_time <= 24 or 0 <= day_time < 5:
        return '晚上'


def check_modify():
    return 1


def tran_reward(txt):
    rewards_dict = {}
    if txt:
        cl = txt.split('/*a_new_line*/')
        if len(cl) != 3:
            return None
        cl = list(map(lambda x: x.split('|next_item_is|'), cl))
        ids = cl[0]
        values = cl[1]
        notes = cl[2]
        if len(ids) != len(values) != len(notes):
            return None
        for i in range(len(ids)):
            rewards_dict[ids[i]] = (values[i], notes[i])
        return rewards_dict
    else:
        return None
