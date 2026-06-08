import { useState, useEffect, useRef } from "react";
import { useAuth } from "./hooks/useAuth";
import { useLeaderboard } from "./hooks/useLeaderboard";

const CANDIES = ['🍓','🍊','⭐','🍀','💎','🍇'];
const CANDY_BG = ['#FF4D6D','#FF9500','#FFE600','#4ADE80','#00D4FF','#B44FFF'];
const COLS = 6, ROWS = 3;

const QS = [
  {q:'מי שר "Blinding Lights"?',s:'פופ עולמי',o:['Drake','The Weeknd','Bieber','Post Malone'],c:1,d:'קל'},
  {q:'באיזה שנה קמה מדינת ישראל?',s:'היסטוריה',o:['1946','1947','1948','1949'],c:2,d:'קל'},
  {q:'כמה עונות יש ל-Friends?',s:'סדרות',o:['8','9','10','11'],c:2,d:'קל'},
  {q:'מי יצרה את ChatGPT?',s:'טכנולוגיה',o:['Google','Meta','OpenAI','Apple'],c:2,d:'קל'},
  {q:'מה הכינוי של תל אביב?',s:'ישראל',o:['עיר הנמל','עיר הלבנה','עיר ללא הפסקה','עיר הגנים'],c:2,d:'קל'},
  {q:'איזו ארץ המציאה סושי?',s:'אוכל',o:['סין','קוריאה','יפן','תאילנד'],c:2,d:'קל'},
  {q:'מי שר "Despacito"?',s:'מוזיקה',o:['Shakira','Bad Bunny','Luis Fonsi','J Balvin'],c:2,d:'קל'},
  {q:'כמה שחקנים בכדורגל?',s:'ספורט',o:['9','10','11','12'],c:2,d:'קל'},
  {q:'מי המציא את הטלפון?',s:'היסטוריה',o:['אדיסון','גרהם בל','טסלה','מרקוני'],c:1,d:'בינוני'},
  {q:'כמה מדינות ב-NBA?',s:'ספורט',o:['1','2','3','4'],c:1,d:'בינוני'},
  {q:'מה הפרי הלאומי של ישראל?',s:'תרבות',o:['תפוז','תמר','זית','רימון'],c:1,d:'בינוני'},
  {q:'מאיזה ארץ נטפליקס?',s:'טכנולוגיה',o:['בריטניה','קנדה','ארה"ב','אוסטרליה'],c:2,d:'קל'},
  {q:'מי כתב "הארי פוטר"?',s:'ספרות',o:['רולד דאל','J.K. Rowling','סטיבן קינג','טולקין'],c:1,d:'קל'},
  {q:'כמה עצמות יש בגוף האדם?',s:'ביולוגיה',o:['156','186','206','226'],c:2,d:'בינוני'},
  {q:'מי ניצח במונדיאל 2022?',s:'כדורגל',o:['ברזיל','צרפת','ארגנטינה','גרמניה'],c:2,d:'קל'},
  {q:'מי מסי לפי אזרחות?',s:'כדורגל',o:['ברזילאי','ארגנטינאי','פורטוגלי','ספרדי'],c:1,d:'קל'},
  {q:'מה שם הנהר הארוך בישראל?',s:'גאוגרפיה',o:['ירקון','ירדן','קישון','אלכסנדר'],c:1,d:'בינוני'},
  {q:'מי המציא הדיסק-און-קי?',s:'ישראל טק',o:['דב מורן','עמוס גל','יצחק לבנה','שי אגסי'],c:0,d:'בינוני'},
  {q:'כמה שחקנים בכדורסל?',s:'ספורט',o:['4','5','6','7'],c:1,d:'קל'},
  {q:'מאיזה שנה אינסטגרם?',s:'טכנולוגיה',o:['2008','2009','2010','2011'],c:2,d:'בינוני'},
];

function mkBoard() {
  return Array.from({length:ROWS}, () =>
    Array.from({length:COLS}, () => Math.floor(Math.random()*CANDIES.length))
  );
}

// ─── Login Screen ───
function LoginScreen({ onLogin }) {
  const [loading, setLoading] = useState(false);
  return (
    <div style={{minHeight:'100vh',background:'#0D0D0D',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:24,fontFamily:"'Heebo',sans-serif",direction:'rtl'}}>
      <div style={{fontSize:56,fontWeight:900,color:'#fff',letterSpacing:-3,lineHeight:1,marginBottom:4}}>
        BUZZ<span style={{color:'#FFE600'}}>IT</span>
      </div>
      <div style={{color:'#444',fontSize:11,letterSpacing:3,marginBottom:32}}>CANDY MODE</div>
      <div style={{fontSize:48,marginBottom:24}}>🍬</div>
      <p style={{color:'#666',fontSize:14,marginBottom:32,textAlign:'center'}}>ענה נכון. פוצץ שורות. שבור את הרשת.</p>
      <button onClick={async()=>{setLoading(true);await onLogin();setLoading(false);}} style={{background:'#fff',border:'none',borderRadius:16,padding:'16px 32px',display:'flex',alignItems:'center',gap:12,cursor:'pointer',fontSize:16,fontWeight:800,fontFamily:"'Heebo',sans-serif",width:300,justifyContent:'center'}}>
        <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-4z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5.1l-6.2-5.2C29.4 35.5 26.8 36 24 36c-5.3 0-9.6-2.9-11.3-7L6.1 34c3.3 6.5 10 11 17.9 11z"/><path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.5-2.6 4.6-4.8 6l6.2 5.2C40.9 35.7 44 30.2 44 24c0-1.3-.1-2.7-.4-4z"/></svg>
        {loading ? 'מתחבר...' : 'כניסה עם Google'}
      </button>
    </div>
  );
}

// ─── Board ───
function Board({ board, blasting }) {
  return (
    <div style={{display:'grid',gridTemplateColumns:`repeat(${COLS},1fr)`,gap:4,background:'#161616',borderRadius:14,padding:10,marginBottom:12}}>
      {board.map((row,r) => row.map((ci,c) => {
        const key = `${r}-${c}`;
        const isBlasting = blasting === r;
        return (
          <div key={key} style={{
            width:'100%',aspectRatio:'1',borderRadius:10,
            display:'flex',alignItems:'center',justifyContent:'center',
            fontSize:'clamp(16px,4vw,24px)',
            background: CANDY_BG[ci],
            transform: isBlasting ? 'scale(0)' : 'scale(1)',
            opacity: isBlasting ? 0 : 1,
            transition: isBlasting ? 'transform 0.25s,opacity 0.25s' : 'transform 0.2s',
          }}>
            {CANDIES[ci]}
          </div>
        );
      }))}
    </div>
  );
}

// ─── Game Screen ───
function GameScreen({ user, onEnd }) {
  const [board, setBoard] = useState(mkBoard());
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [maxCombo, setMaxCombo] = useState(1);
  const [hearts, setHearts] = useState(3);
  const [qi, setQi] = useState(0);
  const [questions] = useState([...QS].sort(() => Math.random() - 0.5));
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [timeLeft, setTimeLeft] = useState(8);
  const [locked, setLocked] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [blasting, setBlasting] = useState(null);
  const [results, setResults] = useState([]);
  const [answered, setAnswered] = useState(null);
  const timerRef = useRef(null);
  const scoreRef = useRef(0);
  const comboRef = useRef(1);
  const heartsRef = useRef(3);

  const q = questions[qi];
  const total = Math.min(questions.length, 20);

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [qi]);

  function startTimer() {
    setTimeLeft(8);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 0.1) { clearInterval(timerRef.current); handleTimeout(); return 0; }
        return t - 0.1;
      });
    }, 100);
  }

  function handleTimeout() {
    if (locked) return;
    setLocked(true);
    setAnswered({ idx: -1, correct: q.c });
    loseHeart();
    comboRef.current = 1;
    setCombo(1);
    setFeedback('⏱ פג הזמן! -לב');
    setResults(r => [...r, false]);
    setTimeout(goNext, 1200);
  }

  function loseHeart() {
    heartsRef.current = Math.max(0, heartsRef.current - 1);
    setHearts(heartsRef.current);
    if (heartsRef.current === 0) setTimeout(() => onEnd({ score: scoreRef.current, correct, wrong: wrong+1, maxCombo: comboRef.current, results }), 800);
  }

  function answer(idx) {
    if (locked) return;
    setLocked(true);
    clearInterval(timerRef.current);
    setAnswered({ idx, correct: q.c });

    if (idx === q.c) {
      const timeBonus = Math.round((timeLeft / 8) * 30);
      const newCombo = Math.min(comboRef.current + 1, 4);
      const pts = (100 + timeBonus) * comboRef.current;
      scoreRef.current += pts;
      comboRef.current = newCombo;
      const newMax = Math.max(comboRef.current, maxCombo);
      setScore(scoreRef.current);
      setCombo(newCombo);
      setMaxCombo(newMax);
      setCorrect(c => c + 1);
      const row = qi % ROWS;
      setBlasting(row);
      setTimeout(() => {
        setBoard(b => {
          const nb = b.map(r => [...r]);
          nb[row] = Array.from({length:COLS}, () => Math.floor(Math.random()*CANDIES.length));
          return nb;
        });
        setBlasting(null);
      }, 300);
      setFeedback(`+${pts} pts${newCombo > 1 ? ` COMBO x${newCombo} 🔥` : ' ✓'}`);
      setResults(r => [...r, true]);
    } else {
      loseHeart();
      comboRef.current = 1;
      setCombo(1);
      setWrong(w => w + 1);
      setFeedback('טעות! -לב 💔');
      setResults(r => [...r, false]);
    }
    setTimeout(goNext, 1100);
  }

  function goNext() {
    if (heartsRef.current === 0) return;
    const nextQi = qi + 1;
    if (nextQi >= total) {
      onEnd({ score: scoreRef.current, correct, wrong, maxCombo: comboRef.current, results });
      return;
    }
    setQi(nextQi);
    setLocked(false);
    setAnswered(null);
    setFeedback('');
  }

  const diffC = {קל:'#4ADE80',בינוני:'#FFE600',קשה:'#FF4444'};
  const hearts_display = ['💔','❤️','❤️❤️','❤️❤️❤️'][hearts] || '💔';
  const pct = Math.max(0, timeLeft / 8 * 100);
  const timerColor = pct > 50 ? '#FFE600' : pct > 25 ? '#FF9500' : '#FF4444';

  return (
    <div style={{padding:'14px 16px',maxWidth:480,margin:'0 auto'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
        <div style={{fontSize:22}}>{hearts_display}</div>
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:26,fontWeight:900,color:'#FFE600',lineHeight:1}}>{score.toLocaleString()}</div>
          <div style={{color:'#444',fontSize:10}}>pts</div>
        </div>
        <div style={{background:'#161616',border:'1px solid #222',borderRadius:20,padding:'4px 12px'}}>
          <span style={{color:'#FFE600',fontSize:15,fontWeight:900}}>x{combo}</span>
        </div>
      </div>

      <div style={{height:5,background:'#1A1A1A',borderRadius:3,marginBottom:12,overflow:'hidden'}}>
        <div style={{height:'100%',background:timerColor,width:`${pct}%`,transition:'width 0.1s linear',borderRadius:3}} />
      </div>

      <Board board={board} blasting={blasting} />

      <div style={{display:'flex',gap:3,justifyContent:'center',marginBottom:12}}>
        {Array.from({length:total},(_,i) => (
          <div key={i} style={{width:18,height:18,borderRadius:4,background: i < qi ? (results[i] ? '#FFE600' : '#FF4444') : '#222'}} />
        ))}
      </div>

      <div style={{background:'#161616',border:'2px solid #222',borderRadius:14,padding:16,textAlign:'center',minHeight:80,display:'flex',flexDirection:'column',justifyContent:'center',marginBottom:12,position:'relative'}}>
        <div style={{position:'absolute',top:10,right:10,fontSize:10,fontWeight:800,padding:'2px 8px',borderRadius:20,background:(diffC[q.d]||'#555')+'22',color:diffC[q.d]||'#555'}}>
          {q.d}
        </div>
        <div style={{fontSize:q.q.length > 20 ? 15 : 17,fontWeight:900,color:'#fff',lineHeight:1.4}}>{q.q}</div>
        <div style={{fontSize:11,color:'#555',marginTop:4}}>{q.s}</div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
        {q.o.map((opt,i) => {
          let bg='#1E1E1E', border='#333', color='#ccc';
          if (answered) {
            if (i === q.c) { bg='rgba(74,222,128,0.2)'; border='#4ADE80'; color='#4ADE80'; }
            else if (i === answered.idx) { bg='rgba(255,68,68,0.2)'; border='#FF4444'; color='#FF4444'; }
          }
          return (
            <button key={i} onClick={() => answer(i)} disabled={!!answered} style={{background:bg,border:`2px solid ${border}`,borderRadius:12,padding:'12px 8px',fontSize:14,fontWeight:800,color,cursor:answered?'default':'pointer',fontFamily:"'Heebo',sans-serif",transition:'all 0.15s'}}>
              {opt}
            </button>
          );
        })}
      </div>

      <div style={{textAlign:'center',height:24,fontSize:13,marginTop:8,color: feedback.includes('✓') || feedback.includes('🔥') ? '#4ADE80' : '#FF4444',fontWeight:900}}>
        {feedback}
      </div>
    </div>
  );
}

// ─── Result Screen ───
function ResultScreen({ result, user, onReplay, onHome }) {
  const { saveScore } = useLeaderboard();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user && !saved) {
      saveScore(user.uid, result.score);
      setSaved(true);
    }
  }, []);

  const { players } = useLeaderboard();
  const pct = result.correct / Math.max(1, result.correct + result.wrong);
  const emojis = ['😬','😅','😎','🏆'];
  const labels = ['תנסו שוב!','לא רע!','מדהים! 🔥','אלופים! שתפו!'];
  const li = pct < 0.4 ? 0 : pct < 0.65 ? 1 : pct < 0.85 ? 2 : 3;
  const sq = result.results.map(r => r ? '🟨' : '⬛').join('');
  const shareText = `🍬 BUZZIT CANDY 🍬\nניקוד: ${result.score.toLocaleString()}\nנכון: ${result.correct} | מכפיל מקס: x${result.maxCombo}\n${sq}\n\nתשברו את השיא שלי? 🔥`;

  return (
    <div style={{padding:'24px 16px',maxWidth:480,margin:'0 auto',textAlign:'center',fontFamily:"'Heebo',sans-serif",direction:'rtl'}}>
      <div style={{fontSize:52,marginBottom:8}}>{emojis[li]}</div>
      <div style={{fontSize:58,fontWeight:900,color:'#FFE600',letterSpacing:-3,lineHeight:1,marginBottom:4}}>{result.score.toLocaleString()}</div>
      <div style={{color:'#666',fontSize:14,marginBottom:18}}>{labels[li]}</div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginBottom:16}}>
        <div style={{background:'#161616',border:'1px solid #222',borderRadius:12,padding:12}}><div style={{color:'#4ADE80',fontSize:20,fontWeight:900}}>{result.correct}</div><div style={{color:'#444',fontSize:10,fontWeight:800}}>נכון</div></div>
        <div style={{background:'#161616',border:'1px solid #222',borderRadius:12,padding:12}}><div style={{color:'#FF4444',fontSize:20,fontWeight:900}}>{result.wrong}</div><div style={{color:'#444',fontSize:10,fontWeight:800}}>טעות</div></div>
        <div style={{background:'#161616',border:'1px solid #222',borderRadius:12,padding:12}}><div style={{color:'#FFE600',fontSize:20,fontWeight:900}}>x{result.maxCombo}</div><div style={{color:'#444',fontSize:10,fontWeight:800}}>מכפיל מקס</div></div>
      </div>

      <div style={{background:'#161616',border:'1px solid #222',borderRadius:14,padding:14,fontSize:12,color:'#555',fontFamily:'monospace',lineHeight:2,textAlign:'right',marginBottom:14,whiteSpace:'pre'}}>
        {shareText}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:20}}>
        <button onClick={() => navigator.clipboard.writeText(shareText).catch(()=>{})} style={{background:'#FFE600',border:'none',borderRadius:12,padding:14,fontSize:13,fontWeight:900,color:'#0D0D0D',cursor:'pointer',fontFamily:"'Heebo',sans-serif"}}>העתק לטיקטוק</button>
        <button onClick={onReplay} style={{background:'#161616',border:'2px solid #222',borderRadius:12,padding:14,fontSize:13,fontWeight:900,color:'#fff',cursor:'pointer',fontFamily:"'Heebo',sans-serif"}}>שחק שוב</button>
      </div>

      <div style={{color:'#444',fontSize:11,fontWeight:800,marginBottom:10,textAlign:'right'}}>לידר בורד עולמי</div>
      {players.map((p,i) => {
        const isMe = p.uid === user?.uid;
        return (
          <div key={p.uid||i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 12px',background:'#161616',border:`1px solid ${isMe?'#FFE60033':'#1E1E1E'}`,borderRadius:10,marginBottom:6}}>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <span style={{color:'#444',fontSize:12,fontWeight:800}}>{['🥇','🥈','🥉'][i]||`#${i+1}`}</span>
              {p.photoURL && <img src={p.photoURL} style={{width:24,height:24,borderRadius:'50%'}} alt="" />}
              <span style={{color:isMe?'#FFE600':'#888',fontSize:13,fontWeight:800}}>{isMe?`⭐ ${p.displayName}`:p.displayName}</span>
            </div>
            <span style={{color:'#FFE600',fontWeight:900,fontSize:14}}>{(p.bestScore||0).toLocaleString()}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Home Screen ───
function HomeScreen({ user, onPlay, onLogout }) {
  const { players } = useLeaderboard();
  const myRank = players.findIndex(p => p.uid === user?.uid) + 1;
  const myScore = players.find(p => p.uid === user?.uid)?.bestScore || 0;

  return (
    <div style={{padding:'28px 16px',maxWidth:480,margin:'0 auto',textAlign:'center',fontFamily:"'Heebo',sans-serif",direction:'rtl'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          {user?.photoURL && <img src={user.photoURL} style={{width:32,height:32,borderRadius:'50%'}} alt="" />}
          <span style={{color:'#888',fontSize:13,fontWeight:800}}>{user?.displayName}</span>
        </div>
        <button onClick={onLogout} style={{background:'#161616',border:'1px solid #222',borderRadius:20,padding:'4px 12px',color:'#555',fontSize:12,cursor:'pointer',fontFamily:"'Heebo',sans-serif"}}>יציאה</button>
      </div>

      <div style={{fontSize:54,fontWeight:900,color:'#fff',letterSpacing:-3,lineHeight:1,marginBottom:2}}>BUZZ<span style={{color:'#FFE600'}}>IT</span></div>
      <div style={{color:'#444',fontSize:11,letterSpacing:3,marginBottom:24}}>CANDY MODE</div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:4,background:'#161616',borderRadius:14,padding:10,marginBottom:20}}>
        {Array.from({length:18},(_,i) => {
          const ci = i % CANDIES.length;
          return <div key={i} style={{aspectRatio:'1',borderRadius:8,background:CANDY_BG[ci],display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>{CANDIES[ci]}</div>;
        })}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:20}}>
        <div style={{background:'#161616',border:'1px solid #222',borderRadius:14,padding:14}}>
          <div style={{color:'#FFE600',fontSize:22,fontWeight:900}}>{myScore.toLocaleString()}</div>
          <div style={{color:'#444',fontSize:11,fontWeight:800}}>השיא שלי</div>
        </div>
        <div style={{background:'#161616',border:'1px solid #222',borderRadius:14,padding:14}}>
          <div style={{color:'#fff',fontSize:22,fontWeight:900}}>{myRank > 0 ? `#${myRank}` : '-'}</div>
          <div style={{color:'#444',fontSize:11,fontWeight:800}}>דירוג עולמי</div>
        </div>
      </div>

      <button onClick={onPlay} style={{width:'100%',background:'#FFE600',border:'none',borderRadius:14,padding:18,fontSize:20,fontWeight:900,color:'#0D0D0D',cursor:'pointer',fontFamily:"'Heebo',sans-serif",marginBottom:16}}>
        PLAY NOW ▶
      </button>

      <div style={{color:'#444',fontSize:11,fontWeight:800,marginBottom:10,textAlign:'right'}}>לידר בורד עולמי</div>
      {players.slice(0,5).map((p,i) => {
        const isMe = p.uid === user?.uid;
        return (
          <div key={p.uid||i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 12px',background:'#161616',border:`1px solid ${isMe?'#FFE60033':'#1E1E1E'}`,borderRadius:10,marginBottom:6}}>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <span style={{color:'#444',fontSize:12,fontWeight:800}}>{['🥇','🥈','🥉'][i]||`#${i+1}`}</span>
              {p.photoURL && <img src={p.photoURL} style={{width:24,height:24,borderRadius:'50%'}} alt="" />}
              <span style={{color:isMe?'#FFE600':'#888',fontSize:13,fontWeight:800}}>{isMe?`⭐ ${p.displayName}`:p.displayName}</span>
            </div>
            <span style={{color:'#FFE600',fontWeight:900}}>{(p.bestScore||0).toLocaleString()}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── App Root ───
export default function App() {
  const { user, loading, login, logout } = useAuth();
  const [screen, setScreen] = useState('home');
  const [lastResult, setLastResult] = useState(null);

  if (loading) return <div style={{minHeight:'100vh',background:'#0D0D0D',display:'flex',alignItems:'center',justifyContent:'center',fontSize:32}}>🍬</div>;
  if (!user) return <LoginScreen onLogin={login} />;

  return (
    <div style={{minHeight:'100vh',background:'#0D0D0D'}}>
      {screen === 'home' && <HomeScreen user={user} onPlay={() => setScreen('game')} onLogout={logout} />}
      {screen === 'game' && <GameScreen user={user} onEnd={(r) => { setLastResult(r); setScreen('result'); }} />}
      {screen === 'result' && <ResultScreen result={lastResult} user={user} onReplay={() => setScreen('game')} onHome={() => setScreen('home')} />}
    </div>
  );
}
