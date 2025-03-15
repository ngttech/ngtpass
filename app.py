from flask import Flask, render_template, jsonify
import random
import string
from password_generator import generate_simple_password, generate_strong_password

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate/simple')
def simple_password():
    password = generate_simple_password()
    return jsonify({'password': password})

@app.route('/generate/strong')
def strong_password():
    password = generate_strong_password()
    return jsonify({'password': password})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False) 