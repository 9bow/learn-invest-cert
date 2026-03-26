import { useState, useEffect } from 'react';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

interface QuizProps {
  section: string;
}

export default function Quiz({ section }: QuizProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<Set<number>>(new Set());
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const base = import.meta.env.BASE_URL.replace(/\/$/, '');
    fetch(`${base}/data/quiz/${section}.json`)
      .then((res) => res.json())
      .then((data: QuizQuestion[]) => setQuestions(data))
      .catch(() => setQuestions([]));
  }, [section]);

  if (questions.length === 0) {
    return <p style={{ padding: '1rem', color: 'var(--sl-color-gray-3)' }}>퀴즈를 불러오는 중...</p>;
  }

  const q = questions[current];

  const handleSelect = (idx: number) => {
    if (answered.has(current)) return;
    setSelected(idx);
    setShowResult(true);
    const newAnswered = new Set(answered);
    newAnswered.add(current);
    setAnswered(newAnswered);
    if (idx === q.answer) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      setFinished(true);
    }
  };

  const handleReset = () => {
    setCurrent(0);
    setSelected(null);
    setShowResult(false);
    setScore(0);
    setAnswered(new Set());
    setFinished(false);
  };

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div style={{ padding: '1.5rem', border: '1px solid var(--sl-color-gray-5)', borderRadius: '0.5rem', background: 'var(--sl-color-gray-7)' }}>
        <h3 style={{ margin: '0 0 1rem', color: 'var(--sl-color-white)' }}>결과</h3>
        <p style={{ fontSize: '1.5rem', fontWeight: 700, color: pct >= 70 ? '#22c55e' : '#ef4444' }}>
          {score} / {questions.length} ({pct}%)
        </p>
        <p style={{ color: 'var(--sl-color-gray-3)' }}>
          {pct >= 70 ? '합격 기준(70%)을 충족했습니다!' : '합격 기준(70%)에 미달합니다. 복습이 필요합니다.'}
        </p>
        <button onClick={handleReset} style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: 'var(--sl-color-accent)', color: 'var(--sl-color-black)', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', fontWeight: 600 }}>
          다시 풀기
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '1.5rem', border: '1px solid var(--sl-color-gray-5)', borderRadius: '0.5rem', background: 'var(--sl-color-gray-7)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--sl-color-gray-3)' }}>
        <span>문제 {current + 1} / {questions.length}</span>
        <span>정답: {score}개</span>
      </div>
      <p style={{ fontWeight: 600, marginBottom: '1rem', color: 'var(--sl-color-white)', lineHeight: 1.6 }}>{q.question}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {q.options.map((opt, idx) => {
          let bg = 'var(--sl-color-gray-6)';
          let border = '1px solid var(--sl-color-gray-5)';
          if (showResult) {
            if (idx === q.answer) {
              bg = 'rgba(34,197,94,0.15)';
              border = '1px solid #22c55e';
            } else if (idx === selected && idx !== q.answer) {
              bg = 'rgba(239,68,68,0.15)';
              border = '1px solid #ef4444';
            }
          } else if (idx === selected) {
            bg = 'var(--sl-color-gray-5)';
          }
          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              style={{ textAlign: 'left', padding: '0.75rem 1rem', background: bg, border, borderRadius: '0.375rem', cursor: answered.has(current) ? 'default' : 'pointer', color: 'var(--sl-color-white)', lineHeight: 1.5 }}
            >
              {idx + 1}. {opt}
            </button>
          );
        })}
      </div>
      {showResult && (
        <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: '0.375rem', background: 'var(--sl-color-gray-6)', lineHeight: 1.6 }}>
          <p style={{ color: selected === q.answer ? '#22c55e' : '#ef4444', fontWeight: 600, marginBottom: '0.5rem' }}>
            {selected === q.answer ? '정답입니다!' : '오답입니다.'}
          </p>
          <p style={{ color: 'var(--sl-color-gray-2)' }}>{q.explanation}</p>
        </div>
      )}
      {showResult && (
        <button onClick={handleNext} style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: 'var(--sl-color-accent)', color: 'var(--sl-color-black)', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', fontWeight: 600 }}>
          {current < questions.length - 1 ? '다음 문제' : '결과 보기'}
        </button>
      )}
    </div>
  );
}
