'''
Author: Jayden Cheng
Date: 2022-04-28 22:59:32
LastEditors: Jayden Cheng
LastEditTime: 2022-04-28 23:18:25
FilePath: \Student_Comprehensive_Evaluation - 副本\settings.py
Description: 

Copyright (c) 2022 by Jayden Cheng, All Rights Reserved. 
'''

class Debug(object):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = "mysql://root:42289062awsdfG@localhost/sce_db"
    SQLALCHEMY_TRACK_MODIFICATIONS = 0
    SECRET_KEY = 'temp'


# TESTING = False
# DATABASE_URI = 'sqlite://:memory:'

# app.config['SQLALCHEMY_DATABASE_URI'] = "mysql://root:42289062awsdfG@localhost/sce_db"
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = 0
# Flask.secret_key = ''.join(random.sample(
#     string.ascii_letters + string.digits, 8))
# Flask.secret_key = 'temp'