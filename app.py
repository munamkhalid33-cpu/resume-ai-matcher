from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import tempfile
from parser import extract_resume_text
from matcher import match_resume_to_job

app = Flask(__name__, static_folder='static', static_url_path='')
CORS(app)

# API endpoint - stays the same
@app.route('/match', methods=['POST', 'OPTIONS'])
def match():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200
    
    file = request.files.get('resume')
    jd = request.form.get('job_description', '')
    
    if not file or not jd:
        return jsonify({'error': 'Missing resume or job description'}), 400
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=file.filename[-5:]) as tmp:
        file.save(tmp.name)
        text = extract_resume_text(tmp.name)
        os.unlink(tmp.name)
    
    result = match_resume_to_job(text, jd)
    return jsonify(result)

# Serve React frontend
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True, port=5000)