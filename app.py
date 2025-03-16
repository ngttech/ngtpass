from flask import Flask, render_template, jsonify, request, send_from_directory
from password_generator import generate_strong_password, generate_passphrase
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/favicon.ico')
def favicon_ico():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.png', mimetype='image/png')

@app.route('/favicon.png')
def favicon_png():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.png', mimetype='image/png')

@app.route('/strong_password')
def strong_password():
    min_length = request.args.get('min_length', 8, type=int)
    
    # Validate min_length
    if min_length < 6:
        min_length = 6
    elif min_length > 16:
        min_length = 16
        
    password = generate_strong_password(min_length=min_length)
    return jsonify({'password': password})

@app.route('/passphrase')
def passphrase():
    num_words = request.args.get('num_words', 3, type=int)
    separator = request.args.get('separator', '-')
    
    # Validate num_words
    if num_words < 2:
        num_words = 2
    elif num_words > 5:
        num_words = 5
        
    # Validate separator
    if separator not in ['-', '.', '_']:
        separator = '-'
        
    passphrase = generate_passphrase(num_words=num_words, separator=separator)
    return jsonify({'passphrase': passphrase})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False) 