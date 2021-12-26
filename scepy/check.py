import decimal


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