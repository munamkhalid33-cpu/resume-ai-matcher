from pdfminer.high_level import extract_text
from docx import Document

def extract_resume_text(filepath):
    if filepath.endswith(".pdf"):
        return extract_text(filepath)
    elif filepath.endswith(".docx"):
        doc = Document(filepath)
        return "\n".join([p.text for p in doc.paragraphs])
    return ""