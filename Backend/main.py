from flask import Flask, request,jsonify,render_template
from flask_cors import CORS
import etl 
import pandas as pd
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_jwt_extended import JWTManager
import random
import json
import predict

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'FFF'
jwt = JWTManager(app)
etl_pre = None

CORS(app)


##Train Model
@app.route('/train',methods=["POST"])
def train_model():
    global etl_pre
    file = request.files['file']
    etl_pre = etl.EtlAnalytics(file)
    etl_pre.transformation_var()
    etl_pre.creation_model()
    
    return jsonify({
        "score_model":etl_pre.get_score(),
        "describe_data" : etl_pre.get_describe()
    })

@app.route('/get_model_train/<model>',methods=["POST"])
def get_model_train(model):
    global etl_pre
    etl_pre.load_model_presave(model)
    
    return jsonify({
        "score_model":etl_pre.get_score(),
        "describe_data" : etl_pre.get_describe()
    })

@app.route('/get_model_predict',methods=["POST"])
def get_model_predict_new():
    data = json.loads(request.data, strict=False)
    
    predict_get = predict.PredictModel("XGBClassifier")
    
    if predict_get.check_values(data):
        return jsonify({"Value":predict_get.predict_model(data)})
    
@app.route('/get_prueba',methods=["POST"])
def query_example():

    file = request.files['file']
    etl_pre = etl.EtlAnalytics(file)
    etl_pre.transformation_var()
    etl_pre.creation_model()
    
    return jsonify({"data":1})


@app.route('/protected')
@jwt_required( )
def protected():
    current_user = get_jwt_identity()
    
    return jsonify(logged_in_as=current_user), 200

@app.route('/login', methods=['POST'])
def login():
    username = request.json.get("username", None)
    password = request.json.get("password", None)
    
    access_token = create_access_token(identity=username)

    return jsonify(access_token=access_token)

if __name__ == '__main__':
    app.run(debug=True, port=5000)