import { useState, useRef, useEffect } from "react";

const EMOTIONS = {
  joy: { color: "#639922", bg: "#EAF3DE", icon: "😊" },
  sadness: { color: "#185FA5", bg: "#E6F1FB", icon: "😔" },
  anxiety: { color: "#BA7517", bg: "#FAEEDA", icon: "😰" },
  anger: { color: "#A32D2D", bg: "#FCEBEB", icon: "😤" },
  fear: { color: "#534AB7", bg: "#EEEDFE", icon: "😨" },
  calm: { color: "#0F6E56", bg: "#E1F5EE", icon: "😌" },
  neutral: { color: "#5F5E5A", bg: "#F1EFE8", icon: "😐" },
};

const PROMPTS = [
  "Today I felt...",
  "Something that made me smile was...",
  "I struggled with...",
  "I'm grateful for...",
  "Right now I feel...",
];

function EmotionBar({ label, value, color, bg }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
        <span style={{ color: "var(--color-text-secondary)", textTransform: "capitalize" }}>{label}</span>
        <span style={{ fontWeight: 500, color }}>{Math.round(value)}%</span>
      </div>
      <div style={{ height: 6, borderRadius: 99, background: "var(--color-background-secondary)", overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${value}%`,
            background: color,
            borderRadius: 99,
            transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      </div>
    </div>
  );
}

function Chip({ text, color, bg }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: 99,
        fontSize: 12,
        fontWeight: 500,
        background: bg,
        color,
        marginRight: 6,
        marginBottom: 6,
        border: `0.5px solid ${color}40`,
      }}
    >
      {text}
    </span>
  );
}

function InsightCard({ icon, label, value, sub, color, bg }) {
  return (
    <div
      style={{
        background: bg,
        border: `0.5px solid ${color}30`,
        borderRadius: "var(--border-radius-lg)",
        padding: "12px 14px",
        flex: 1,
        minWidth: 0,
      }}
    >
      <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>
      <div style={{ fontSize: 11, color, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500, marginBottom: 2 }}>
        {label}
      </div>
      <div style={{ fontSize: 18, fontWeight: 500, color, lineHeight: 1.2 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color, opacity: 0.7, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

const POSITIVE_ICONS = ["🌟", "💪", "🌱"];
const POSITIVE_LABELS = ["Your strength", "Silver lining", "Keep going"];

function PositiveComments({ comments }) {
  if (!comments || comments.length === 0) return null;
  return (
    <div
      style={{
        marginTop: 14,
        background: "linear-gradient(135deg, #EAF3DE 0%, #E1F5EE 100%)",
        border: "0.5px solid #9FE1CB",
        borderRadius: "var(--border-radius-lg)",
        padding: "14px 16px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
        <span style={{ fontSize: 16 }}>✨</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: "#0F6E56", letterSpacing: "0.04em", textTransform: "uppercase" }}>
          Positive comments for you
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {comments.map((comment, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
              background: "rgba(255,255,255,0.6)",
              borderRadius: "var(--border-radius-md)",
              padding: "10px 12px",
            }}
          >
            <span style={{ fontSize: 18, lineHeight: 1.4, flexShrink: 0 }}>{POSITIVE_ICONS[i] || "💚"}</span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 500, color: "#0F6E56", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {POSITIVE_LABELS[i] || "Note"}
              </div>
              <p style={{ margin: 0, fontSize: 13, color: "#085041", lineHeight: 1.6 }}>{comment}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
  const dom = EMOTIONS[entry.analysis?.dominant_emotion?.toLowerCase()] || EMOTIONS.neutral;
  return (
    <div
      style={{
        background: "var(--color-background-primary)",
        border: "0.5px solid var(--color-border-tertiary)",
        borderRadius: "var(--border-radius-lg)",
        padding: "14px 16px",
        marginBottom: 10,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 6 }}>
            {new Date(entry.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
            {" · "}
            <span
              style={{
                background: dom.bg,
                color: dom.color,
                padding: "1px 8px",
                borderRadius: 99,
                fontSize: 12,
                fontWeight: 500,
                marginLeft: 4,
              }}
            >
              {dom.icon} {entry.analysis?.dominant_emotion || "—"}
            </span>
          </div>
          <p style={{ fontSize: 14, color: "var(--color-text-primary)", margin: "0 0 8px", lineHeight: 1.6 }}>
            {entry.text.length > 160 ? entry.text.slice(0, 160) + "…" : entry.text}
          </p>
          {entry.analysis?.themes?.length > 0 && (
            <div>
              {entry.analysis.themes.slice(0, 4).map((t) => (
                <Chip key={t} text={t} color={dom.color} bg={dom.bg} />
              ))}
            </div>
          )}
        </div>
        <button
          onClick={() => onDelete(entry.id)}
          aria-label="delete entry"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--color-text-tertiary)",
            fontSize: 16,
            padding: "0 0 0 10px",
            lineHeight: 1,
          }}
        >
          ✕
        </button>
      </div>
      {entry.analysis?.affirmation && (
        <div
          style={{
            marginTop: 8,
            padding: "8px 12px",
            background: "var(--color-background-secondary)",
            borderRadius: "var(--border-radius-md)",
            fontSize: 13,
            color: "var(--color-text-secondary)",
            borderLeft: `3px solid ${dom.color}`,
          }}
        >
          💬 {entry.analysis.affirmation}
        </div>
      )}
      <PositiveComments comments={entry.analysis?.positive_comments} />
    </div>
  );
}

async function analyzeEntry(text) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1200,
      messages: [
        {
          role: "user",
          content: `You are a warm, empathetic mental health journal NLP analyzer. Analyze this journal entry and respond ONLY with valid JSON, no markdown, no preamble.

Journal entry: "${text}"

Return exactly this structure:
{
  "dominant_emotion": "joy|sadness|anxiety|anger|fear|calm|neutral",
  "emotions": {
    "joy": <0-100>,
    "sadness": <0-100>,
    "anxiety": <0-100>,
    "anger": <0-100>,
    "fear": <0-100>,
    "calm": <0-100>
  },
  "sentiment_score": <-1.0 to 1.0>,
  "themes": ["theme1","theme2","theme3"],
  "cognitive_patterns": ["pattern1","pattern2"],
  "wellbeing_score": <1-10>,
  "affirmation": "a brief supportive, empathetic sentence (max 20 words)",
  "word_count": <number>,
  "key_phrases": ["phrase1","phrase2","phrase3"],
  "positive_comments": [
    "A specific strength or courage you noticed in this entry (1–2 sentences, warm and personal)",
    "A reframe or silver lining tailored to what they wrote (1–2 sentences)",
    "An encouraging forward-looking comment celebrating their growth or effort (1–2 sentences)"
  ]
}

For positive_comments: always write 3 items. Be genuine and specific to what they actually wrote — avoid generic platitudes. If the entry is sad or hard, still find real positives like their honesty, self-awareness, or resilience in writing it down.`,
        },
      ],
    }),
  });
  const data = await response.json();
  const raw = data.content?.map((c) => c.text || "").join("");
  try {
    return JSON.parse(raw.replace(/```json|```/g, "").trim());
  } catch {
    return null;
  }
}

export default function App() {
  const [entries, setEntries] = useState(() => {
    try { return JSON.parse(localStorage.getItem("mhj_entries") || "[]"); } catch { return []; }
  });
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("write");
  const [promptIdx, setPromptIdx] = useState(0);
  const [error, setError] = useState("");
  const [lastEntry, setLastEntry] = useState(null);
  const textRef = useRef();

  useEffect(() => {
    localStorage.setItem("mhj_entries", JSON.stringify(entries));
  }, [entries]);

  const avgWellbeing = entries.length
    ? (entries.reduce((s, e) => s + (e.analysis?.wellbeing_score || 5), 0) / entries.length).toFixed(1)
    : null;

  const emotionFreq = {};
  entries.forEach((e) => {
    const em = e.analysis?.dominant_emotion;
    if (em) emotionFreq[em] = (emotionFreq[em] || 0) + 1;
  });
  const topEmotion = Object.entries(emotionFreq).sort((a, b) => b[1] - a[1])[0];

  const avgEmotions = {};
  Object.keys(EMOTIONS).forEach((k) => {
    const vals = entries.map((e) => e.analysis?.emotions?.[k] || 0);
    avgEmotions[k] = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
  });

  const allThemes = {};
  entries.forEach((e) =>
    (e.analysis?.themes || []).forEach((t) => {
      allThemes[t] = (allThemes[t] || 0) + 1;
    })
  );
  const topThemes = Object.entries(allThemes).sort((a, b) => b[1] - a[1]).slice(0, 8);

  const handleSubmit = async () => {
    if (!text.trim() || text.trim().length < 20) {
      setError("Please write at least 20 characters.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const analysis = await analyzeEntry(text.trim());
      const entry = {
        id: Date.now(),
        date: new Date().toISOString(),
        text: text.trim(),
        analysis,
      };
      setEntries((prev) => [entry, ...prev]);
      setLastEntry(entry);
      setText("");
    } catch {
      setError("Analysis failed. Check your API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => setEntries((prev) => prev.filter((e) => e.id !== id));

  const tabStyle = (t) => ({
    padding: "8px 18px",
    border: "0.5px solid var(--color-border-tertiary)",
    borderRadius: "var(--border-radius-md)",
    background: activeTab === t ? "var(--color-text-primary)" : "transparent",
    color: activeTab === t ? "var(--color-background-primary)" : "var(--color-text-secondary)",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 500,
    transition: "all 0.15s",
  });

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "1.5rem 1rem 3rem" }}>
      <h2 aria-label="Mental Health Journal Analyzer" style={{ fontSize: 22, fontWeight: 500, margin: "0 0 4px" }}>
        🧠 Mental health journal
      </h2>
      <p style={{ color: "var(--color-text-secondary)", fontSize: 14, margin: "0 0 1.5rem", lineHeight: 1.6 }}>
        Write freely. AI analyzes emotions, themes, and wellbeing patterns over time.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["write", "insights", "history"].map((t) => (
          <button key={t} onClick={() => setActiveTab(t)} style={tabStyle(t)}>
            {{ write: "✍️ Write", insights: "📊 Insights", history: "📖 History" }[t]}
          </button>
        ))}
      </div>

      {activeTab === "write" && (
        <div>
          <div
            style={{
              background: "var(--color-background-secondary)",
              borderRadius: "var(--border-radius-md)",
              padding: "8px 14px",
              fontSize: 13,
              color: "var(--color-text-secondary)",
              marginBottom: 10,
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            onClick={() => {
              setText((prev) => (prev ? prev : PROMPTS[promptIdx]));
              setPromptIdx((i) => (i + 1) % PROMPTS.length);
              textRef.current?.focus();
            }}
          >
            <span>💡 Prompt: <em>{PROMPTS[promptIdx]}</em></span>
            <span style={{ opacity: 0.5 }}>tap to use</span>
          </div>

          <textarea
            ref={textRef}
            value={text}
            onChange={(e) => { setText(e.target.value); if (lastEntry) setLastEntry(null); }}
            placeholder="How are you feeling today? Write anything on your mind…"
            rows={8}
            style={{
              width: "100%",
              borderRadius: "var(--border-radius-lg)",
              border: "0.5px solid var(--color-border-secondary)",
              padding: "14px 16px",
              fontSize: 15,
              lineHeight: 1.7,
              resize: "vertical",
              fontFamily: "var(--font-sans)",
              color: "var(--color-text-primary)",
              background: "var(--color-background-primary)",
              boxSizing: "border-box",
            }}
          />

          {error && (
            <p style={{ color: "#A32D2D", fontSize: 13, margin: "6px 0 0" }}>{error}</p>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
            <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>
              {text.trim().split(/\s+/).filter(Boolean).length} words
            </span>
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                background: loading ? "var(--color-background-secondary)" : "var(--color-text-primary)",
                color: loading ? "var(--color-text-secondary)" : "var(--color-background-primary)",
                border: "none",
                borderRadius: "var(--border-radius-md)",
                padding: "10px 24px",
                fontSize: 14,
                fontWeight: 500,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.15s",
              }}
            >
              {loading ? "Analyzing…" : "Analyze entry ✨"}
            </button>
          </div>

          {lastEntry && !loading && (
            <div style={{ marginTop: 20 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 10,
                  padding: "10px 14px",
                  background: "var(--color-background-secondary)",
                  borderRadius: "var(--border-radius-md)",
                }}
              >
                <span style={{ fontSize: 22 }}>
                  {EMOTIONS[lastEntry.analysis?.dominant_emotion?.toLowerCase()]?.icon || "😐"}
                </span>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 14, color: "var(--color-text-primary)", textTransform: "capitalize" }}>
                    Feeling: {lastEntry.analysis?.dominant_emotion || "—"}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
                    Wellbeing score: {lastEntry.analysis?.wellbeing_score ?? "—"}/10
                    {" · "}Sentiment: {lastEntry.analysis?.sentiment_score >= 0 ? "+" : ""}{lastEntry.analysis?.sentiment_score?.toFixed(2) ?? "—"}
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab("insights")}
                  style={{
                    marginLeft: "auto",
                    fontSize: 12,
                    padding: "5px 12px",
                    borderRadius: "var(--border-radius-md)",
                    border: "0.5px solid var(--color-border-secondary)",
                    background: "transparent",
                    cursor: "pointer",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  Full insights →
                </button>
              </div>
              {lastEntry.analysis?.affirmation && (
                <div
                  style={{
                    padding: "8px 14px",
                    background: "var(--color-background-secondary)",
                    borderRadius: "var(--border-radius-md)",
                    fontSize: 13,
                    color: "var(--color-text-secondary)",
                    borderLeft: `3px solid ${EMOTIONS[lastEntry.analysis?.dominant_emotion?.toLowerCase()]?.color || "#888"}`,
                    marginBottom: 4,
                  }}
                >
                  💬 {lastEntry.analysis.affirmation}
                </div>
              )}
              <PositiveComments comments={lastEntry.analysis?.positive_comments} />
            </div>
          )}
        </div>
      )}

      {activeTab === "insights" && (
        <div>
          {entries.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 0", color: "var(--color-text-tertiary)" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📓</div>
              <p>Write your first journal entry to see insights.</p>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                <InsightCard
                  icon="📝"
                  label="Entries"
                  value={entries.length}
                  color="#185FA5"
                  bg="#E6F1FB"
                />
                <InsightCard
                  icon="❤️"
                  label="Avg wellbeing"
                  value={`${avgWellbeing}/10`}
                  color="#0F6E56"
                  bg="#E1F5EE"
                />
                <InsightCard
                  icon={topEmotion ? EMOTIONS[topEmotion[0]]?.icon : "—"}
                  label="Top emotion"
                  value={topEmotion ? topEmotion[0] : "—"}
                  sub={topEmotion ? `${topEmotion[1]} times` : ""}
                  color="#534AB7"
                  bg="#EEEDFE"
                />
              </div>

              <div
                style={{
                  background: "var(--color-background-primary)",
                  border: "0.5px solid var(--color-border-tertiary)",
                  borderRadius: "var(--border-radius-lg)",
                  padding: "16px",
                  marginBottom: 14,
                }}
              >
                <h3 style={{ fontSize: 14, fontWeight: 500, margin: "0 0 14px", color: "var(--color-text-secondary)" }}>
                  Average emotion profile
                </h3>
                {Object.entries(avgEmotions)
                  .sort((a, b) => b[1] - a[1])
                  .map(([k, v]) => (
                    <EmotionBar key={k} label={k} value={v} color={EMOTIONS[k]?.color} bg={EMOTIONS[k]?.bg} />
                  ))}
              </div>

              {topThemes.length > 0 && (
                <div
                  style={{
                    background: "var(--color-background-primary)",
                    border: "0.5px solid var(--color-border-tertiary)",
                    borderRadius: "var(--border-radius-lg)",
                    padding: "16px",
                  }}
                >
                  <h3 style={{ fontSize: 14, fontWeight: 500, margin: "0 0 12px", color: "var(--color-text-secondary)" }}>
                    Recurring themes
                  </h3>
                  <div>
                    {topThemes.map(([theme, count]) => {
                      const em = Object.keys(EMOTIONS)[Math.floor(Math.random() * 5)];
                      return (
                        <Chip
                          key={theme}
                          text={`${theme} ×${count}`}
                          color={EMOTIONS[em].color}
                          bg={EMOTIONS[em].bg}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {activeTab === "history" && (
        <div>
          {entries.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 0", color: "var(--color-text-tertiary)" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📖</div>
              <p>No journal entries yet.</p>
            </div>
          ) : (
            entries.map((entry) => (
              <JournalCard key={entry.id} entry={entry} onDelete={handleDelete} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
