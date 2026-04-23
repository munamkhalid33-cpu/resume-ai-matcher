import { useState } from "react";

export default function App() {
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleMatch = async () => {
    if (!file || !jd) {
      setError("Please upload a resume and enter a job description.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);

    const form = new FormData();
    form.append("resume", file);
    form.append("job_description", jd);

    try {
      const res = await fetch("http://127.0.0.1:5000/match", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError("Could not connect to server. Make sure Flask is running.");
    }
    setLoading(false);
  };

  const getScoreColor = (score) => {
    if (score >= 70) return "#16a34a";
    if (score >= 40) return "#d97706";
    return "#dc2626";
  };

  return (
    <div style={{ maxWidth: 680, margin: "40px auto", padding: "0 20px", fontFamily: "sans-serif" }}>
      
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 6 }}>
          AI Resume Matcher
        </h1>
        <p style={{ color: "#6b7280", fontSize: 14 }}>
          Upload your resume and paste a job description to get your match score.
        </p>
      </div>

      {/* Upload Resume */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 8 }}>
          Resume (PDF or DOCX)
        </label>
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={(e) => setFile(e.target.files[0])}
          style={{
            display: "block", width: "100%", padding: "10px 12px",
            border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14,
            background: "#f9fafb", cursor: "pointer"
          }}
        />
        {file && (
          <p style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>
            Selected: {file.name}
          </p>
        )}
      </div>

      {/* Job Description */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 8 }}>
          Job Description
        </label>
        <textarea
          rows={6}
          placeholder="Paste the job description here..."
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          style={{
            width: "100%", padding: "10px 12px", border: "1px solid #d1d5db",
            borderRadius: 8, fontSize: 14, resize: "vertical",
            fontFamily: "sans-serif", boxSizing: "border-box"
          }}
        />
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: "#fef2f2", border: "1px solid #fca5a5",
          borderRadius: 8, padding: "10px 14px", marginBottom: 16,
          color: "#dc2626", fontSize: 14
        }}>
          {error}
        </div>
      )}

      {/* Button */}
      <button
        onClick={handleMatch}
        disabled={loading}
        style={{
          width: "100%", padding: "12px", background: loading ? "#a78bfa" : "#7c3aed",
          color: "white", border: "none", borderRadius: 8, fontSize: 15,
          fontWeight: 500, cursor: loading ? "not-allowed" : "pointer"
        }}
      >
        {loading ? "Analyzing..." : "Match Resume →"}
      </button>

      {/* Results */}
      {result && (
        <div style={{
          marginTop: 32, border: "1px solid #e5e7eb",
          borderRadius: 12, overflow: "hidden"
        }}>
          {/* Score */}
          <div style={{ padding: "24px", textAlign: "center", background: "#fafafa" }}>
            <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>Match Score</p>
            <div style={{
              fontSize: 56, fontWeight: 700,
              color: getScoreColor(result.score)
            }}>
              {result.score}%
            </div>
            {/* Score bar */}
            <div style={{
              marginTop: 12, height: 10, background: "#e5e7eb",
              borderRadius: 99, overflow: "hidden"
            }}>
              <div style={{
                height: "100%", width: `${result.score}%`,
                background: getScoreColor(result.score),
                borderRadius: 99, transition: "width 0.8s ease"
              }} />
            </div>
            <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 8 }}>
              {result.score >= 70 ? "Strong match!" : result.score >= 40 ? "Moderate match" : "Low match — tailor your resume"}
            </p>
          </div>

          {/* Feedback */}
          {result.feedback?.length > 0 && (
            <div style={{ padding: "20px 24px", borderTop: "1px solid #e5e7eb" }}>
              <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 12 }}>
                Suggestions to improve
              </p>
              {result.feedback.map((tip, i) => (
                <div key={i} style={{
                  display: "flex", gap: 10, alignItems: "flex-start",
                  marginBottom: 10
                }}>
                  <span style={{
                    width: 20, height: 20, background: "#ede9fe", borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, color: "#7c3aed", fontWeight: 600, flexShrink: 0
                  }}>
                    {i + 1}
                  </span>
                  <p style={{ fontSize: 13, color: "#374151", margin: 0 }}>{tip}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}