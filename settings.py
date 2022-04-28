
class Debug(object):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = "mysql://root:000000@localhost/yj"
    SQLALCHEMY_TRACK_MODIFICATIONS = 0
    SECRET_KEY = 'temp'


# TESTING = False
# DATABASE_URI = 'sqlite://:memory:'

# app.config['SQLALCHEMY_DATABASE_URI'] = "mysql://root:42289062awsdfG@localhost/sce_db"
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = 0
# Flask.secret_key = ''.join(random.sample(
#     string.ascii_letters + string.digits, 8))
# Flask.secret_key = 'temp'