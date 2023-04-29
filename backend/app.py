# pylint: disable=no-member

"""Test with Postman"""
import pickle
from flask import Flask, request, jsonify
import numpy as np
import cv2
import base64
from PIL import Image
from io import BytesIO

app = Flask(__name__)


with open("/home/CodecApp/.virtualenvs/venv/codec/model.pkl", "rb") as input_file:
    model = pickle.load(input_file)

@app.route('/',methods=['GET'])
def home():
    '''create homepage'''
    return "Hello world"

@app.route('/predict-imagestring',methods=['POST'])
def predict():
    '''request color of image as string'''
    data = request.form.get('imagestring')
    im = Image.open(BytesIO(base64.b64decode(data)))
    image_path = "/home/CodecApp/.virtualenvs/venv/codec/images/" + 'image.png'
    im.save(image_path)
    rgb2 = []
    image = cv2.cvtColor(cv2.imread(image_path), cv2.COLOR_BGR2RGB)
    rgb2.append(image[0][0])

    y_pred2 = model.predict(rgb2)

    return jsonify({'color':str(y_pred2[0])})


@app.route('/predict-imagefile',methods=['POST'])
def predict_imagefile():
    '''request color of image as file'''
    imagefile = request.files['imagefile']
    image_path = "/home/CodecApp/.virtualenvs/venv/codec/images/" + 'image.png'
    imagefile.save(image_path)
    rgb2 = []
    image = cv2.cvtColor(cv2.imread(image_path), cv2.COLOR_BGR2RGB)
    rgb2.append(image[0][0])

    y_pred2 = model.predict(rgb2)

    return jsonify({'color':str(y_pred2[0])})


if __name__ == "__main__":
    app.run(debug=False,host='0.0.0.0')
