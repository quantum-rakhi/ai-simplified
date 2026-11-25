import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight, ArrowUpRight, BrainCircuit, Sparkles, Compass, Zap, BookOpen,
  Gamepad2, Search, Menu, X, CheckCircle2, CircleHelp, Lightbulb, Target,
  Trophy, ChevronRight, RotateCcw, WandSparkles, Layers3, ShieldCheck,
  Bot, Network, FlaskConical, GraduationCap, Play, Star
} from "lucide-react";
import "./styles.css";

const lessons = [
  { id:"ai", tag:"START HERE", title:"What is AI?", desc:"Meet the technology that helps machines perform tasks that usually need human intelligence.", time:"4 min", level:"Beginner", icon:BrainCircuit, color:"violet", body:"Artificial Intelligence (AI) is the field of building computer systems that can perform tasks associated with human intelligence — such as recognising patterns, understanding language, making predictions and solving problems.", analogy:"Think of AI as a very capable pattern-finder. Show it enough examples of cats and dogs, and it can learn patterns that help it tell the two apart.", points:["AI systems find patterns in information.","AI can make predictions or generate new content.","AI does not automatically understand the world like a human does."] },
  { id:"ml", tag:"THE BIG IDEA", title:"Machine Learning", desc:"Discover how computers learn patterns from examples instead of following only fixed instructions.", time:"5 min", level:"Beginner", icon:Network, color:"pink", body:"Machine Learning (ML) is a part of AI. Instead of writing every rule by hand, we give a model examples and a learning method. The model adjusts its internal parameters to make better predictions.", analogy:"Like learning to recognise fruit: you see many apples and oranges, notice their colour, shape and texture, and gradually get better at identifying a new one.", points:["Data provides examples for learning.","A model is the system that learns patterns.","Training improves a model; testing checks how well it generalises."] },
  { id:"dl", tag:"GO DEEPER", title:"Deep Learning", desc:"Explore neural networks inspired loosely by the way connected neurons process information.", time:"6 min", level:"Beginner", icon:Layers3, color:"orange", body:"Deep Learning is a type of machine learning that uses neural networks with many layers. These layers transform information step by step, helping the model learn complex patterns in images, audio, text and more.", analogy:"Imagine a team passing a message through several specialists. Each layer notices a different kind of detail, and together they build a useful representation.", points:["Neural networks contain connected computational units.","Layers learn increasingly useful representations.","Deep learning often benefits from large datasets and substantial computing power."] },
  { id:"genai", tag:"CREATE WITH AI", title:"Generative AI", desc:"Understand how tools can create text, images, audio, code and other content.", time:"5 min", level:"Beginner", icon:WandSparkles, color:"blue", body:"Generative AI creates new content based on patterns learned during training. A text model can generate a response, an image model can create a picture, and a code model can suggest a function.", analogy:"Think of a creative assistant that has studied many examples and can produce a new draft from your instructions. It can be useful, but its output still needs human review.", points:["Generative models produce new outputs.","Prompts guide the output you receive.","Generated content can be incorrect, biased or misleading."] },
  { id:"llm", tag:"LANGUAGE & AI", title:"What is an LLM?", desc:"Get to know the language models behind many popular AI assistants.", time:"5 min", level:"Beginner", icon:Bot, color:"green", body:"A Large Language Model (LLM) is a model trained on large amounts of text to predict and generate language. It processes your input and produces a likely continuation, one token at a time.", analogy:"Imagine an extremely advanced autocomplete system. It can produce surprisingly useful explanations and drafts, but fluent wording does not guarantee factual accuracy.", points:["LLMs work with tokens, not human thoughts.","Context and clear instructions shape responses.","Always verify important facts and decisions."] },
  { id:"prompt", tag:"PRACTICAL SKILL", title:"Prompt Engineering", desc:"Learn how context, role, task and format can make AI responses more useful.", time:"4 min", level:"Beginner", icon:Sparkles, color:"yellow", body:"A prompt is the instruction or context you give an AI system. A useful prompt clearly states the task, provides relevant context, describes constraints and specifies the desired output.", analogy:"Giving an AI a vague request is like asking a colleague to 'do the thing'. A clear brief explains what success looks like.", points:["State the goal clearly.","Add relevant context and constraints.","Specify the format and audience."] }
];

const quiz = [
  { q:"Which statement best describes Artificial Intelligence?", a:["A computer that is always connected to the internet","Systems designed to perform tasks associated with human intelligence","A faster type of computer processor"], correct:1, explain:"AI is the broader field of building systems that can perform tasks such as recognising patterns, understanding language and making predictions." },
  { q:"Machine Learning is…", a:["A subset of AI that learns patterns from data","Another name for a database","A programming language"], correct:0, explain:"Machine Learning is one approach within AI. Models learn patterns from examples rather than relying only on hand-written rules." },
  { q:"What does Generative AI do?", a:["Only stores information","Creates new content such as text, images or code","Guarantees that every answer is true"], correct:1, explain:"Generative AI creates new outputs. Those outputs can still contain errors, so human review matters." },
  { q:"What is a prompt?", a:["The instruction or context given to an AI system","The AI model's password","A type of computer screen"], correct:0, explain:"A prompt is the input that guides the AI system's response." },
  { q:"Can a fluent AI response still be wrong?", a:["No, fluent means verified","Only if the internet is off","Yes — always verify important information"], correct:2, explain:"Language models can produce confident-sounding errors, sometimes called hallucinations." }
];

const promptExamples = [
  { name:"Vague prompt", prompt:"Explain AI.", result:"AI is technology that enables machines to perform tasks that typically require human intelligence.", note:"The request has no audience, depth or format." },
  { name:"Clear prompt", prompt:"Explain artificial intelligence to a 12-year-old in 3 simple bullet points. Use one everyday example and avoid technical jargon.", result:"• AI helps computers do tasks that usually need human-like skills, such as recognising pictures or understanding words.\n• It learns patterns from examples.\n• Example: a music app suggesting songs you may enjoy based on what you listen to.", note:"Audience, format, example and language are all specified." }
];

function App() {
  const [active, setActive] = useState("home");
  const [selectedLesson, setSelectedLesson] = useState("ai");
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizDone, setQuizDone] = useState(false);
  const [promptMode, setPromptMode] = useState(1);
  const [demoCount, setDemoCount] = useState(0);
  const [x1, setX1] = useState(0.8);
  const [x2, setX2] = useState(0.3);
  const [w1, setW1] = useState(2);
  const [w2, setW2] = useState(-1);
  const [bias, setBias] = useState(0);

  const completed = useMemo(() => Object.keys(answers).length, [answers]);
  const score = quiz.reduce((n, q, i) => n + (answers[i] === q.correct ? 1 : 0), 0);
  const currentLesson = lessons.find(x => x.id === selectedLesson) || lessons[0];
  const filteredLessons = lessons.filter(x => (x.title + " " + x.desc + " " + x.tag).toLowerCase().includes(query.toLowerCase()));
  const z = x1*w1 + x2*w2 + bias;
  const probability = 1 / (1 + Math.exp(-z));

  const go = (section) => { setActive(section); setMenuOpen(false); window.scrollTo({top:0,behavior:"smooth"}); };
  const openLesson = (id) => { setSelectedLesson(id); go("lesson"); };
  const answerQuiz = (index) => {
    if (answers[quizIndex] !== undefined) return;
    setAnswers(prev => ({...prev, [quizIndex]:index}));
  };
  const nextQuestion = () => {
    if (quizIndex === quiz.length - 1) setQuizDone(true);
    else setQuizIndex(v => v + 1);
  };
  const restartQuiz = () => { setAnswers({}); setQuizIndex(0); setQuizDone(false); };

  return <div className="app-shell">
    <div className="announcement"><Sparkles size={14}/> YOUR FRIENDLY FIRST STEP INTO AI <span>·</span> FREE FOREVER</div>
    <header className="topbar">
      <button className="brand" onClick={() => go("home")} aria-label="AI Simplified home">
        <span className="brand-mark"><BrainCircuit size={22}/></span>
        <span>AI <b>SIMPLIFIED</b><small>MAKE AI MAKE SENSE</small></span>
      </button>
      <nav className={menuOpen ? "nav-links open" : "nav-links"}>
        <button className={active==="home"?"nav-active":""} onClick={()=>go("home")}>Home</button>
        <button className={active==="explore"?"nav-active":""} onClick={()=>go("explore")}>Explore AI</button>
        <button className={active==="playground"?"nav-active":""} onClick={()=>go("playground")}>Playground</button>
        <button className={active==="visual-lab"?"nav-active":""} onClick={()=>go("visual-lab")}>Visual AI Lab</button>
        <button className={active==="quiz"?"nav-active":""} onClick={()=>go("quiz")}>Quiz</button>
      </nav>
      <button className="top-cta" onClick={()=>go("explore")}>Start learning <ArrowUpRight size={16}/></button>
      <button className="mobile-menu" onClick={()=>setMenuOpen(v=>!v)} aria-label="Toggle menu">{menuOpen?<X/>:<Menu/>}</button>
    </header>

    {active==="home" && <main>
      <section className="hero section-wrap">
        <div className="hero-copy">
          <div className="eyebrow"><span className="pulse-dot"/> AI LEARNING FOR EVERY CURIOUS MIND</div>
          <h1>AI feels complex.<br/><span>Let's unlock it.</span></h1>
          <p className="hero-lede">No jargon. No coding. No confusion. Just bite-sized lessons and playful experiments that make artificial intelligence click.</p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={()=>go("explore")}>Explore AI <ArrowRight size={18}/></button>
            <button className="btn-ghost" onClick={()=>go("playground")}><Play size={16}/> Try the playground</button>
          </div>
          <div className="hero-proof"><div className="avatar-stack"><i>🧑‍🎓</i><i>👩‍💻</i><i>🧑‍🚀</i></div><span><b>Curious minds welcome.</b><br/>Start from absolute zero.</span></div>
        </div>
        <div className="hero-art">
          <div className="orbit orbit-one"></div><div className="orbit orbit-two"></div>
          <div className="float-card float-top"><span className="mini-icon purple"><Sparkles size={16}/></span><span><b>Generative AI</b><small>Creates something new</small></span><span className="tiny-live">LIVE</span></div>
          <div className="brain-glow"><div className="brain-core"><BrainCircuit size={104} strokeWidth={1.25}/><span className="core-spark">✦</span></div></div>
          <div className="float-card float-bottom"><span className="mini-icon orange"><Zap size={16}/></span><span><b>Machine Learning</b><small>Finds patterns in data</small></span><span className="float-arrow">↗</span></div>
          <div className="orbit-label label-a">LEARN</div><div className="orbit-label label-b">EXPLORE</div>
          <span className="art-star star-a">✳</span><span className="art-star star-b">✦</span>
        </div>
      </section>

      <section className="stats-strip section-wrap">
        <div><b>06</b><span>Beginner lessons</span></div><div><b>01</b><span>Interactive playground</span></div><div><b>05</b><span>Quick quiz questions</span></div><div><b>∞</b><span>Curiosity encouraged</span></div>
      </section>

      <section className="section-wrap learn-section">
        <div className="section-heading"><div><div className="eyebrow">YOUR LEARNING PATH</div><h2>Small steps. <span>Big aha moments.</span></h2><p>Start with the basics and build your AI confidence one idea at a time.</p></div><button className="text-link" onClick={()=>go("explore")}>View all lessons <ArrowRight size={16}/></button></div>
        <div className="lesson-grid">
          {lessons.slice(0,3).map((lesson,i)=><LessonCard key={lesson.id} lesson={lesson} index={i} onClick={()=>openLesson(lesson.id)}/>)}
        </div>
      </section>

      <section className="play-banner section-wrap">
        <div className="banner-icon"><FlaskConical size={31}/></div>
        <div><div className="eyebrow">LEARNING BY DOING</div><h2>Curiosity looks good on you.</h2><p>Play with a tiny AI-inspired classifier and see how examples shape predictions.</p></div>
        <button className="btn-light" onClick={()=>go("playground")}>Enter playground <ArrowRight size={17}/></button>
        <div className="banner-decoration">✳</div>
      </section>
      <section className="visual-lab-promo section-wrap">
        <div className="promo-orb"><Network size={30}/></div>
        <div className="promo-copy"><div className="eyebrow">NEW · VERSION 1.1</div><h2>See a neural network think.</h2><p>Change inputs, adjust weights and watch a tiny neural model update its prediction in real time.</p></div>
        <button className="btn-light" onClick={()=>go("visual-lab")}>Explore Visual AI Lab <ArrowRight size={17}/></button>
      </section>
      <section className="section-wrap bottom-cta"><div className="cta-emoji">🧠</div><h2>Ready to see what you know?</h2><p>Take a quick quiz. No pressure — learning is the win.</p><button className="btn-primary" onClick={()=>go("quiz")}>Take the 2-minute quiz <ArrowRight size={17}/></button></section>
    </main>}

    {active==="explore" && <main className="section-wrap page-main">
      <div className="page-intro"><div className="eyebrow">THE AI STARTER PACK</div><h1>Explore the <span>building blocks.</span></h1><p>Learn at your level — whether you're a student, a professional, a creator or a developer.</p></div>
      <div className="search-box"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search lessons, topics or concepts..."/><span>{filteredLessons.length} LESSONS</span></div>
      <div className="lesson-grid all-lessons">{filteredLessons.map((lesson,i)=><LessonCard key={lesson.id} lesson={lesson} index={i} onClick={()=>openLesson(lesson.id)}/>)}</div>
      {filteredLessons.length===0 && <div className="empty-state">No lessons found. Try another keyword.</div>}
    </main>}

    {active==="lesson" && <main className="section-wrap page-main lesson-page">
      <button className="back-link" onClick={()=>go("explore")}>← Back to all lessons</button>
      <div className="lesson-detail">
        <div className="lesson-main">
          <div className="eyebrow">{currentLesson.tag} · {currentLesson.time.toUpperCase()} READ</div>
          <h1>{currentLesson.title}</h1><p className="lesson-intro">{currentLesson.desc}</p>
          <div className="definition-card"><div className={`lesson-icon ${currentLesson.color}`}><currentLesson.icon size={27}/></div><h3>In simple words</h3><p>{currentLesson.body}</p></div>
          <div className="analogy-card"><div className="analogy-label"><Lightbulb size={17}/> THE EVERYDAY ANALOGY</div><p>{currentLesson.analogy}</p></div>
          <h2>Remember these 3 things</h2><div className="point-list">{currentLesson.points.map((p,i)=><div key={p}><span>{i+1}</span>{p}</div>)}</div>
          <button className="btn-primary" onClick={()=>go("quiz")}>Check what you learned <ArrowRight size={17}/></button>
        </div>
        <aside className="lesson-aside"><div className="aside-kicker">YOUR LEARNING PATH</div>{lessons.map((l,i)=><button key={l.id} className={l.id===selectedLesson?"path-item selected":"path-item"} onClick={()=>setSelectedLesson(l.id)}><span className="path-number">0{i+1}</span><span>{l.title}</span><ChevronRight size={16}/></button>)}<div className="aside-tip"><Star size={17}/><b>Beginner tip</b><p>You don't need to memorise everything. Focus on understanding the big idea.</p></div></aside>
      </div>
    </main>}

    {active==="visual-lab" && <main className="section-wrap page-main visual-lab-page">
      <div className="page-intro"><div className="eyebrow">VERSION 1.1 · INTERACTIVE EXPERIMENT</div><h1>See how a <span>neural network thinks.</span></h1><p>Change the inputs and connection weights. Watch the weighted sum and prediction update instantly — no maths degree required.</p></div>
      <div className="lab-layout">
        <section className="lab-main-card">
          <div className="lab-card-heading"><div><div className="eyebrow">YOUR TINY NEURAL NETWORK</div><h2>One neuron. Two signals. One prediction.</h2></div><span className="lab-live"><i/> LIVE MODEL</span></div>
          <div className="network-stage">
            <svg className="network-svg" viewBox="0 0 720 300" role="img" aria-label="Two input nodes connect to one output neuron">
              <defs>
                <linearGradient id="edgeOne" x1="0" x2="1"><stop offset="0%" stopColor="#7c6be8"/><stop offset="100%" stopColor="#e78bc2"/></linearGradient>
                <filter id="nodeGlow"><feGaussianBlur stdDeviation="5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              </defs>
              <path d="M155 85 C300 85 365 115 520 150" stroke="url(#edgeOne)" strokeWidth={Math.max(2,Math.abs(2.5*w1))} opacity=".9" fill="none"/>
              <path d="M155 215 C300 215 365 185 520 150" stroke="#77d8d1" strokeWidth={Math.max(2,Math.abs(2.5*w2))} opacity=".9" fill="none"/>
              <text x="330" y="83" fill="#c4b5fd" fontSize="13" textAnchor="middle">w₁ = {w1.toFixed(1)}</text>
              <text x="330" y="229" fill="#8ce5dc" fontSize="13" textAnchor="middle">w₂ = {w2.toFixed(1)}</text>
              <circle cx="105" cy="85" r="43" fill="#32265c" stroke="#a78bfa" strokeWidth="2" filter="url(#nodeGlow)"/>
              <circle cx="105" cy="215" r="43" fill="#1e4c55" stroke="#72d9d1" strokeWidth="2" filter="url(#nodeGlow)"/>
              <text x="105" y="80" fill="#fff" fontSize="12" textAnchor="middle">INPUT 1</text><text x="105" y="99" fill="#fff" fontSize="18" fontWeight="700" textAnchor="middle">{x1.toFixed(1)}</text>
              <text x="105" y="210" fill="#fff" fontSize="12" textAnchor="middle">INPUT 2</text><text x="105" y="229" fill="#fff" fontSize="18" fontWeight="700" textAnchor="middle">{x2.toFixed(1)}</text>
              <circle cx="570" cy="150" r="61" fill="#4a367c" stroke="#d1baff" strokeWidth="3" filter="url(#nodeGlow)"/>
              <text x="570" y="141" fill="#e9ddff" fontSize="12" textAnchor="middle">NEURON</text><text x="570" y="165" fill="#fff" fontSize="20" fontWeight="700" textAnchor="middle">{(probability*100).toFixed(0)}%</text>
              <text x="570" y="239" fill="#aaa4c7" fontSize="12" textAnchor="middle">prediction</text>
              <text x="365" y="151" fill="#aaa4c7" fontSize="12" textAnchor="middle">weighted signals</text>
            </svg>
          </div>
          <div className="model-output">
            <div><span className="output-label">WEIGHTED SUM (z)</span><strong>{z.toFixed(2)}</strong></div>
            <div className="output-arrow">→</div>
            <div><span className="output-label">SIGMOID OUTPUT</span><strong className="output-percent">{(probability*100).toFixed(1)}%</strong></div>
            <div className="output-meter"><div style={{width:`${probability*100}%`}}/></div>
          </div>
          <div className="lab-explainer"><Lightbulb size={18}/><p><b>What just happened?</b> Each input is multiplied by its weight. We add those values and the bias, then pass the result through a sigmoid function to get a value between 0 and 1.</p></div>
        </section>

        <aside className="lab-controls">
          <div className="controls-heading"><div className="eyebrow">EXPERIMENT CONTROLS</div><button className="reset-button" onClick={()=>{setX1(.8);setX2(.3);setW1(2);setW2(-1);setBias(0)}}><RotateCcw size={14}/> Reset</button></div>
          <div className="control-group"><div className="control-title"><label htmlFor="x1">Input 1</label><output>{x1.toFixed(1)}</output></div><input id="x1" type="range" min="0" max="1" step=".1" value={x1} onChange={e=>setX1(Number(e.target.value))}/><small>Signal strength · 0 to 1</small></div>
          <div className="control-group"><div className="control-title"><label htmlFor="x2">Input 2</label><output>{x2.toFixed(1)}</output></div><input id="x2" type="range" min="0" max="1" step=".1" value={x2} onChange={e=>setX2(Number(e.target.value))}/><small>Signal strength · 0 to 1</small></div>
          <div className="control-group"><div className="control-title"><label htmlFor="w1">Weight 1</label><output>{w1.toFixed(1)}</output></div><input id="w1" type="range" min="-3" max="3" step=".1" value={w1} onChange={e=>setW1(Number(e.target.value))}/><small>Influence of input 1 · −3 to +3</small></div>
          <div className="control-group"><div className="control-title"><label htmlFor="w2">Weight 2</label><output>{w2.toFixed(1)}</output></div><input id="w2" type="range" min="-3" max="3" step=".1" value={w2} onChange={e=>setW2(Number(e.target.value))}/><small>Influence of input 2 · −3 to +3</small></div>
          <div className="control-group"><div className="control-title"><label htmlFor="bias">Bias</label><output>{bias.toFixed(1)}</output></div><input id="bias" type="range" min="-3" max="3" step=".1" value={bias} onChange={e=>setBias(Number(e.target.value))}/><small>Extra adjustment · −3 to +3</small></div>
          <div className="prediction-callout"><span>MODEL PREDICTION</span><strong>{probability>=.5?"Higher signal":"Lower signal"}</strong><small>{(probability*100).toFixed(1)}% sigmoid output · illustrative threshold 50%</small></div>
        </aside>
      </div>
      <section className="lab-formula">
        <div><div className="eyebrow">THE SIMPLE MATHS</div><h2>From inputs to output</h2><p>Neurons combine incoming signals using weights and a bias. The activation function transforms the combined value.</p></div>
        <div className="formula-box"><code>z = (x₁ × w₁) + (x₂ × w₂) + b</code><code>output = 1 ÷ (1 + e<sup>−z</sup>)</code><span>Here, sigmoid keeps the output between 0 and 1.</span></div>
      </section>
      <div className="lab-caveat"><CircleHelp size={17}/><p><b>Learning model, not a trained AI.</b> This is a single-neuron mathematical simulation with manually adjustable parameters. Real neural networks usually contain many neurons and learn weights from training data through optimisation.</p></div>
    </main>}

    {active==="playground" && <main className="section-wrap page-main">
      <div className="page-intro"><div className="eyebrow">THE AI PLAYGROUND</div><h1>Learn by <span>experimenting.</span></h1><p>This tiny demo is a simplified, rule-based illustration of classification — not a trained AI model.</p></div>
      <div className="playground-card">
        <div className="playground-header"><div className="play-icon"><FlaskConical size={22}/></div><div><h2>Meet the mini classifier</h2><p>Can you guess what kind of fruit this could be?</p></div><span className="demo-tag">INTERACTIVE DEMO</span></div>
        <div className="fruit-stage"><div className="fruit-orb">{demoCount%3===0?"🍎":demoCount%3===1?"🍌":"🍊"}</div><div><span className="stage-label">SAMPLE #{demoCount+1}</span><h3>{demoCount%3===0?"Red · Round · Crisp":demoCount%3===1?"Yellow · Long · Soft":"Orange · Round · Juicy"}</h3><p>Look at the sample features, then reveal the prediction.</p></div></div>
        <div className="feature-row"><span>COLOUR</span><b>{demoCount%3===0?"Red":demoCount%3===1?"Yellow":"Orange"}</b><span>SHAPE</span><b>{demoCount%3===1?"Long":"Round"}</b><span>TEXTURE</span><b>{demoCount%3===1?"Soft":"Firm"}</b></div>
        <div className="prediction-area"><div><div className="eyebrow">THE MODEL'S GUESS</div><h3>{demoCount%3===0?"🍎 Apple":demoCount%3===1?"🍌 Banana":"🍊 Orange"}</h3><p>It matches the sample's simple feature rules.</p></div><div className="confidence"><strong>{demoCount%3===1?"96":"92"}%</strong><span>illustrative match</span></div></div>
        <button className="btn-primary" onClick={()=>setDemoCount(v=>v+1)}>Try another sample <RotateCcw size={16}/></button>
        <div className="disclaimer"><CircleHelp size={16}/> Real machine-learning models learn patterns from training data. This demo uses fixed rules to help explain the idea.</div>
      </div>
      <div className="concept-note"><div className="note-icon"><Target size={22}/></div><div><b>What's the AI concept here?</b><p>Classification is a machine-learning task where a system assigns an item to a category based on its features. Examples include filtering spam emails or recognising objects in photos.</p></div></div>
    </main>}

    {active==="quiz" && <main className="section-wrap page-main quiz-page">
      <div className="page-intro"><div className="eyebrow">THE KNOWLEDGE ARENA</div><h1>Ready, curious <span>mind?</span></h1><p>Five quick questions to check your AI basics. Every answer teaches you something.</p></div>
      <div className="quiz-card">
        {!quizDone ? <>
          <div className="quiz-top"><span>QUESTION {quizIndex+1} OF {quiz.length}</span><span>{completed}/{quiz.length} ANSWERED</span></div>
          <div className="progress-track"><div style={{width:`${(quizIndex/quiz.length)*100}%`}}/></div>
          <div className="quiz-question"><span className="question-number">0{quizIndex+1}</span><h2>{quiz[quizIndex].q}</h2></div>
          <div className="answer-list">{quiz[quizIndex].a.map((a,i)=><button key={a} onClick={()=>answerQuiz(i)} className={`answer-option ${answers[quizIndex]===i?(i===quiz[quizIndex].correct?"correct":"incorrect"):""} ${answers[quizIndex]!==undefined&&i===quiz[quizIndex].correct?"correct":""}`}><span className="answer-letter">{String.fromCharCode(65+i)}</span>{a}{answers[quizIndex]===i&&<CheckCircle2 size={19}/>}</button>)}</div>
          {answers[quizIndex]!==undefined&&<div className="answer-explain"><b>{answers[quizIndex]===quiz[quizIndex].correct?"That's right! 🎉":"Good try — here's the idea."}</b><p>{quiz[quizIndex].explain}</p></div>}
          <div className="quiz-footer"><span>{answers[quizIndex]!==undefined?"Answer locked in":"Choose the best answer"}</span><button className="btn-primary" disabled={answers[quizIndex]===undefined} onClick={nextQuestion}>{quizIndex===quiz.length-1?"See my score":"Next question"} <ArrowRight size={16}/></button></div>
        </> : <div className="quiz-result"><div className="trophy-icon"><Trophy size={42}/></div><div className="eyebrow">YOU SHOWED UP. THAT'S A WIN.</div><h2>{score===5?"AI superstar!":score>=3?"You're getting the hang of it!":"A curious mind is a growing mind!"}</h2><div className="score-big">{score}<span> / 5</span></div><p>You got {score} out of 5 correct. Revisit a lesson and give it another go.</p><button className="btn-primary" onClick={restartQuiz}><RotateCcw size={16}/> Try again</button><button className="text-link" onClick={()=>go("explore")}>Explore lessons <ArrowRight size={16}/></button></div>}
        </div>
    </main>}

    <footer className="footer"><div className="footer-inner"><button className="brand footer-brand" onClick={()=>go("home")}><span className="brand-mark"><BrainCircuit size={21}/></span><span>AI <b>SIMPLIFIED</b><small>MAKE AI MAKE SENSE</small></span></button><p>Making artificial intelligence practical and understandable for students, professionals, creators and developers.</p><div className="footer-bottom"><span>© 2026 AI Simplified · An open learning project</span><span>Built with curiosity <span className="heart">♥</span> by <a href="https://github.com/quantum-rakhi" target="_blank" rel="noreferrer">Rakhi Thakur</a></span></div></div></footer>
  </div>;
}

function LessonCard({lesson,index,onClick}) {
  const Icon=lesson.icon;
  return <button className="lesson-card" onClick={onClick}>
    <div className="card-topline"><span className={`lesson-icon ${lesson.color}`}><Icon size={23}/></span><span className="card-number">0{index+1}</span></div>
    <div className="card-tag">{lesson.tag}</div><h3>{lesson.title}</h3><p>{lesson.desc}</p>
    <div className="card-bottom"><span><BookOpen size={14}/> {lesson.time}</span><span className="card-arrow"><ArrowUpRight size={18}/></span></div>
  </button>;
}

createRoot(document.getElementById("root")).render(<App />);