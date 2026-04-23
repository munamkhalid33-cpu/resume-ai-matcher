from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer("all-MiniLM-L6-v2")

def match_resume_to_job(resume_text, job_description):
    emb_resume = model.encode(resume_text, convert_to_tensor=True)
    emb_job    = model.encode(job_description, convert_to_tensor=True)
    score = float(util.cos_sim(emb_resume, emb_job)[0][0])
    feedback = generate_feedback(resume_text, job_description, score)
    return {"score": round(score * 100, 2), "feedback": feedback}

def generate_feedback(resume, jd, score):
    jd_keywords = set(jd.lower().split())
    resume_words = set(resume.lower().split())
    missing = [w for w in jd_keywords if w not in resume_words and len(w) > 5][:5]
    tips = [f"Add keyword: '{w}'" for w in missing]
    if score < 0.5:
        tips.insert(0, "Low match. Tailor resume more to job description.")
    return tips