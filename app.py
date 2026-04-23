from flask import Flask, request, jsonify
from flask_cors import CORS
import os, tempfile
from parser import extract_resume_text
from matcher import match_resume_to_job

app = Flask(__name__)
CORS(app, origins="*", supports_credentials=True)  # ← change this line

@app.route("/match", methods=["POST", "OPTIONS"])  # ← add OPTIONS
def match():
    if request.method == "OPTIONS":                # ← add this block
        return jsonify({"status": "ok"}), 200

    file = request.files.get("resume")
    jd   = request.form.get("job_description", "")
    if not file or not jd:
        return jsonify({"error": "Missing resume or job description"}), 400
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=file.filename[-5:]) as tmp:
        file.save(tmp.name)
        text = extract_resume_text(tmp.name)
    os.unlink(tmp.name)
    
    result = match_resume_to_job(text, jd)
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True, port=5000)