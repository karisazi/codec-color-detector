# pylint: disable=no-member

"""Test with Postman"""
import pickle
from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
import cv2

app = Flask(__name__)


with open("model.pkl", "rb") as input_file:
    model = pickle.load(input_file)

@app.route('/',methods=['GET'])
def home():
    '''create'''
    return "Hello world"

@app.route('/predict',methods=['POST'])
def predict():
    '''create'''
    imagefile = request.files['imagefile']
    image_path = "./images/" + imagefile.filename
    imagefile.save(image_path)
    rgb2 = []
    image = cv2.cvtColor(cv2.imread(image_path), cv2.COLOR_BGR2RGB)
    rgb2.append(image[0][0])
    
    rgb_df2 = pd.DataFrame(np.array(rgb2), columns=['red', 'green', 'blue'])
    y_pred2 = model.predict(rgb_df2)
    
    return jsonify(y_pred2[0])

if __name__ == "__main__":
    app.run(debug=False,host='0.0.0.0')
