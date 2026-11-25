import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight, ArrowUpRight, BrainCircuit, Sparkles, Compass, Zap, BookOpen,
  Gamepad2, Search, Menu, X, CheckCircle2, CircleHelp, Lightbulb, Target,
  Trophy, ChevronRight, RotateCcw, WandSparkles, Layers3, ShieldCheck,
  Bot, Network, FlaskConical, GraduationCap, Play, Star,
  SlidersHorizontal, GitBranch, Scale, Gauge
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


const xorTrainingSet = [
  { input:[0,0], target:0, label:"0 XOR 0" },
  { input:[0,1], target:1, label:"0 XOR 1" },
  { input:[1,0], target:1, label:"1 XOR 0" },
  { input:[1,1], target:0, label:"1 XOR 1" }
];

function createNetwork() {
  // Deterministic starting weights make the learning demonstration repeatable.
  return {
    hiddenWeights:[[0.35,-0.25],[-0.4,0.2],[0.15,0.5],[-0.3,-0.35]],
    hiddenBiases:[0.1,-0.1,0.05,0.15],
    outputWeights:[0.3,-0.25,0.2,-0.15],
    outputBias:0.05
  };
}
const sigmoid = value => 1/(1+Math.exp(-Math.max(-30,Math.min(30,value))));
function forwardNetwork(network, input) {
  const hidden = network.hiddenWeights.map((weights,i) =>
    sigmoid(weights[0]*input[0] + weights[1]*input[1] + network.hiddenBiases[i])
  );
  const output = sigmoid(hidden.reduce((sum,value,i)=>sum+value*network.outputWeights[i],network.outputBias));
  return {hidden,output};
}
function networkLoss(network) {
  return xorTrainingSet.reduce((sum,sample)=>{
    const prediction=forwardNetwork(network,sample.input).output;
    return sum + Math.pow(sample.target-prediction,2)/2;
  },0)/xorTrainingSet.length;
}
function trainNetworkEpoch(network, learningRate=1.25) {
  const next={
    hiddenWeights:network.hiddenWeights.map(row=>[...row]),
    hiddenBiases:[...network.hiddenBiases],
    outputWeights:[...network.outputWeights],
    outputBias:network.outputBias
  };
  // Online backpropagation: one update for each labelled XOR example.
  xorTrainingSet.forEach(sample=>{
    const {hidden,output}=forwardNetwork(next,sample.input);
    const outputDelta=(output-sample.target)*output*(1-output);
    const oldOutputWeights=[...next.outputWeights];
    const hiddenDeltas=hidden.map((activation,i)=>
      outputDelta*oldOutputWeights[i]*activation*(1-activation)
    );
    next.outputWeights=next.outputWeights.map((weight,i)=>weight-learningRate*outputDelta*hidden[i]);
    next.outputBias-=learningRate*outputDelta;
    next.hiddenWeights=next.hiddenWeights.map((weights,i)=>[
      weights[0]-learningRate*hiddenDeltas[i]*sample.input[0],
      weights[1]-learningRate*hiddenDeltas[i]*sample.input[1]
    ]);
    next.hiddenBiases=next.hiddenBiases.map((bias,i)=>bias-learningRate*hiddenDeltas[i]);
  });
  return next;
}


const playgroundDatasets = [
  {id:"circle",name:"Circle",desc:"Learn an inside-versus-outside boundary."},
  {id:"xor",name:"XOR",desc:"Discover why hidden layers matter."},
  {id:"gaussian",name:"Clusters",desc:"Separate two groups of points."},
  {id:"spiral",name:"Spiral",desc:"Try a more challenging curved pattern."}
];
const activationNames=["tanh","relu","sigmoid"];
const activate=(x,name)=>name==="relu"?Math.max(0,x):name==="sigmoid"?1/(1+Math.exp(-Math.max(-25,Math.min(25,x)))):Math.tanh(x);
const activationDerivative=(z,a,name)=>name==="relu"?(z>0?1:0):name==="sigmoid"?a*(1-a):1-a*a;
function makeSamples(dataset,noise=0) {
  const samples=[];
  const count=160;
  const jitter=(i,axis)=>Math.sin((i+1)*12.9898+(axis+1)*78.233)*0.5;
  for(let i=0;i<count;i++){
    let x=0,y=0,label=0;
    if(dataset==="circle"){
      const angle=i*2.3999632297, radius= i%2===0 ? .22+((i*17)%25)/100 : .62+((i*13)%27)/100;
      x=Math.cos(angle)*radius; y=Math.sin(angle)*radius; label=radius<.5?1:0;
    } else if(dataset==="xor"){
      x=(i%4<2?-1:1)*(.18+((i*7)%65)/100);
      y=(i%4%2===0?-1:1)*(.18+((i*11)%65)/100);
      label=(x*y<0)?1:0;
    } else if(dataset==="gaussian"){
      const group=i%2;
      x=(group?-.48:.48)+jitter(i,0)*.5;
      y=(group?.42:-.42)+jitter(i,1)*.5;
      label=group;
    } else {
      const group=i%2, t=(Math.floor(i/2)/80)*Math.PI*3+group*Math.PI;
      const radius=.08+(Math.floor(i/2)/80)*.75;
      x=Math.cos(t)*radius+jitter(i,0)*.08;
      y=Math.sin(t)*radius+jitter(i,1)*.08;
      label=group;
    }
    x=Math.max(-1,Math.min(1,x+jitter(i,2)*noise*.45));
    y=Math.max(-1,Math.min(1,y+jitter(i,3)*noise*.45));
    samples.push({x,y,label,id:i});
  }
  return samples;
}
function buildDenseNetwork(shape=[4,2],seed=17) {
  const sizes=[2,...shape,1];
  let n=seed;
  const rand=()=>{n=(n*9301+49297)%233280;return n/233280-.5;};
  return sizes.slice(1).map((size,layer)=>Array.from({length:size},()=>({
    weights:Array.from({length:sizes[layer]},()=>rand()*1.4),
    bias:rand()*.3
  })));
}
function denseForward(layers,input,activation) {
  const activations=[input], zs=[];
  let current=input;
  layers.forEach((layer,index)=>{
    const z=layer.map(neuron=>neuron.weights.reduce((sum,w,i)=>sum+w*current[i],neuron.bias));
    const a=z.map((value,i)=>index===layers.length-1?1/(1+Math.exp(-Math.max(-25,Math.min(25,value)))):activate(value,activation));
    zs.push(z); activations.push(a); current=a;
  });
  return {activations,zs,output:activations[activations.length-1][0]};
}
function denseTrainEpoch(layers,samples,activation,learningRate,batchSize=10) {
  const next=layers.map(layer=>layer.map(neuron=>({weights:[...neuron.weights],bias:neuron.bias})));
  const shuffled=[...samples].sort((a,b)=>((a.id*17+3)%97)-((b.id*17+3)%97));
  for(let start=0;start<shuffled.length;start+=batchSize){
    const batch=shuffled.slice(start,start+batchSize);
    const weightGrads=next.map(layer=>layer.map(neuron=>neuron.weights.map(()=>0)));
    const biasGrads=next.map(layer=>layer.map(()=>0));
    batch.forEach(sample=>{
      const {activations,zs}=denseForward(next,[sample.x,sample.y],activation);
      const deltas=next.map(layer=>layer.map(()=>0));
      const last=next.length-1;
      deltas[last][0]=activations[last+1][0]-sample.label;
      for(let layer=last-1;layer>=0;layer--){
        next[layer].forEach((neuron,j)=>{
          let propagated=0;
          next[layer+1].forEach((nextNeuron,k)=>{propagated+=nextNeuron.weights[j]*deltas[layer+1][k];});
          const a=activations[layer+1][j];
          deltas[layer][j]=propagated*activationDerivative(zs[layer][j],a,activation);
        });
      }
      next.forEach((layer,l)=>layer.forEach((neuron,j)=>{
        biasGrads[l][j]+=deltas[l][j];
        neuron.weights.forEach((w,k)=>{weightGrads[l][j][k]+=deltas[l][j]*activations[l][k];});
      }));
    });
    next.forEach((layer,l)=>layer.forEach((neuron,j)=>{
      neuron.bias-=learningRate*biasGrads[l][j]/batch.length;
      neuron.weights=neuron.weights.map((w,k)=>w-learningRate*weightGrads[l][j][k]/batch.length);
    }));
  }
  return next;
}
function denseLoss(layers,samples,activation) {
  if(!samples.length)return 0;
  return samples.reduce((sum,sample)=>{
    const p=Math.max(1e-7,Math.min(1-1e-7,denseForward(layers,[sample.x,sample.y],activation).output));
    return sum-(sample.label*Math.log(p)+(1-sample.label)*Math.log(1-p));
  },0)/samples.length;
}

function NeuralNetworkPlayground() {
  const [dataset,setDataset]=useState("circle");
  const [activation,setActivation]=useState("tanh");
  const [learningRate,setLearningRate]=useState(.03);
  const [noise,setNoise]=useState(0);
  const [trainPercent,setTrainPercent]=useState(50);
  const [batchSize,setBatchSize]=useState(10);
  const [shape,setShape]=useState([4,2]);
  const [layers,setLayers]=useState(()=>buildDenseNetwork([4,2]));
  const [epoch,setEpoch]=useState(0);
  const [history,setHistory]=useState([]);
  const [running,setRunning]=useState(false);
  const samples=useMemo(()=>makeSamples(dataset,noise),[dataset,noise]);
  const split=Math.round(samples.length*trainPercent/100);
  const train=samples.slice(0,split), test=samples.slice(split);
  const trainLoss=denseLoss(layers,train,activation);
  const testLoss=denseLoss(layers,test,activation);
  const trainOne=async(count=1)=>{
    if(running || !train.length) return;
    setRunning(true);
    let model=layers;
    let currentEpoch=epoch;
    const points=history.length ? [...history] : [{
      epoch,
      train:denseLoss(model,train,activation),
      test:denseLoss(model,test,activation)
    }];
    setHistory(points);
    try {
      for(let i=0;i<count;i++){
        model=denseTrainEpoch(model,train,activation,learningRate,batchSize);
        currentEpoch+=1;
        points.push({
          epoch:currentEpoch,
          train:denseLoss(model,train,activation),
          test:denseLoss(model,test,activation)
        });
        // Publish progress regularly so the counter and chart visibly advance.
        if(i%2===0 || i===count-1){
          setLayers(model);
          setEpoch(currentEpoch);
          setHistory(points.slice(-80));
          await new Promise(resolve=>setTimeout(resolve,12));
        }
      }
    } finally {
      setLayers(model);
      setEpoch(currentEpoch);
      setHistory(points.slice(-80));
      setRunning(false);
    }
  };
  const reset=()=>{if(running)return;setLayers(buildDenseNetwork(shape,17+epoch));setEpoch(0);setHistory([]);};
  const changeDataset=value=>{if(running)return;setDataset(value);setLayers(buildDenseNetwork(shape,17));setEpoch(0);setHistory([]);};
  const changeShape=(index,value)=>{
    if(running)return;
    const updated=[...shape];updated[index]=Number(value);setShape(updated);setLayers(buildDenseNetwork(updated,17));setEpoch(0);setHistory([]);
  };
  const addLayer=()=>{if(!running&&shape.length<3){const next=[...shape,3];setShape(next);setLayers(buildDenseNetwork(next,17));setEpoch(0);setHistory([]);}};
  const removeLayer=()=>{if(!running&&shape.length>1){const next=shape.slice(0,-1);setShape(next);setLayers(buildDenseNetwork(next,17));setEpoch(0);setHistory([]);}};
  const cells=[];
  const grid=22;
  for(let gy=0;gy<grid;gy++)for(let gx=0;gx<grid;gx++){
    const x=(gx/(grid-1))*2-1,y=(gy/(grid-1))*2-1;
    const value=denseForward(layers,[x,y],activation).output;
    cells.push({x:gx*100/grid,y:gy*100/grid,value});
  }
  const svgPoints=samples.map(sample=>({x:(sample.x+1)*50,y:(1-sample.y)*50,label:sample.label,isTest:sample.id>=split}));
  const maxLoss=Math.max(1,...history.map(h=>Math.max(h.train,h.test)));
  return <main className="section-wrap page-main nn-playground-page">
    <div className="page-intro"><div className="eyebrow">VERSION 1.3 · INTERACTIVE MACHINE LEARNING</div><h1>Build it. Train it. <span>See it learn.</span></h1><p>Experiment with a real browser-based neural network. Change the data, architecture and training settings — then watch the decision boundary adapt.</p></div>
    <div className="nn-welcome"><Lightbulb size={19}/><p><b>First time here?</b> The coloured dots are examples. The network learns a boundary that separates the two groups. Start with Circle, keep the default settings and press <b>Train 100</b>.</p></div>
    <div className="nn-workspace">
      <section className="nn-visual-card">
        <div className="nn-card-heading"><div><span className="eyebrow">LIVE DECISION BOUNDARY</span><h2>{playgroundDatasets.find(d=>d.id===dataset).name} classification</h2></div><span className="nn-live-dot">● LIVE MODEL</span></div>
        <svg className="decision-map" viewBox="0 0 100 100" role="img" aria-label="Classification decision boundary with data points">
          {cells.map((cell,i)=><rect key={i} x={cell.x} y={cell.y} width={100/grid+.2} height={100/grid+.2} fill={cell.value>=.5?"#8b6ee8":"#45b8ad"} opacity={.12+Math.abs(cell.value-.5)*.48}/>)}
          {svgPoints.map(point=><circle key={point.x+"-"+point.y} cx={point.x} cy={point.y} r={point.isTest?1.15:1.35} fill={point.label?"#f6a6d4":"#b9a7ff"} stroke={point.isTest?"#fff":"#211d3b"} strokeWidth={point.isTest ? .35 : .2} opacity={point.isTest ? .65 : 1}/>)}
        </svg>
        <div className="nn-legend"><span><i className="nn-dot-a"/> Class 0</span><span><i className="nn-dot-b"/> Class 1</span><span><i className="nn-dot-test"/> Test examples</span></div>
        <div className="nn-loss-cards"><div><span>TRAIN LOSS</span><b>{trainLoss.toFixed(3)}</b></div><div><span>TEST LOSS</span><b>{testLoss.toFixed(3)}</b></div><div><span>EPOCH</span><b>{epoch}</b></div></div>
        <div className="nn-loss-chart"><div className="nn-chart-head"><b>Loss over time</b><span>Lower is better</span></div><svg viewBox="0 0 320 90" role="img" aria-label="Training and test loss chart"><path d="M5 5V78H315" fill="none" stroke="#ffffff30"/>{history.length>1&&<><polyline points={history.map((h,i)=>`${5+i*310/Math.max(1,history.length-1)},${75-h.train/maxLoss*65}`).join(" ")} fill="none" stroke="#ad91ff" strokeWidth="2.5"/><polyline points={history.map((h,i)=>`${5+i*310/Math.max(1,history.length-1)},${75-h.test/maxLoss*65}`).join(" ")} fill="none" stroke="#77d9c6" strokeWidth="2.5"/></>}</svg><div className="nn-chart-legend"><span>Training</span><span>Testing</span></div></div>
      </section>
      <aside className="nn-controls-card">
        <div className="nn-card-heading"><div><span className="eyebrow">EXPERIMENT CONTROLS</span><h2>Shape your experiment</h2></div><button className="reset-button" onClick={reset} disabled={running}><RotateCcw size={13}/> Reset</button></div>
        <label className="nn-control"><span>Dataset</span><select value={dataset} disabled={running} onChange={e=>changeDataset(e.target.value)}>{playgroundDatasets.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select><small>{playgroundDatasets.find(d=>d.id===dataset).desc}</small></label>
        <label className="nn-control"><span>Activation function</span><select value={activation} disabled={running} onChange={e=>setActivation(e.target.value)}>{activationNames.map(a=><option key={a} value={a}>{a}</option>)}</select><small>How hidden neurons transform their signals.</small></label>
        <label className="nn-control"><span>Learning rate <output>{learningRate.toFixed(3)}</output></span><input type="range" min=".005" max=".15" step=".005" value={learningRate} disabled={running} onChange={e=>setLearningRate(Number(e.target.value))}/><small>Step size used when updating weights.</small></label>
        <label className="nn-control"><span>Batch size <output>{batchSize}</output></span><input type="range" min="5" max="40" step="5" value={batchSize} disabled={running} onChange={e=>setBatchSize(Number(e.target.value))}/><small>Examples processed before each weight update.</small></label>
        <label className="nn-control"><span>Data noise <output>{noise.toFixed(2)}</output></span><input type="range" min="0" max=".8" step=".05" value={noise} disabled={running} onChange={e=>setNoise(Number(e.target.value))}/><small>Adds variation to the example positions.</small></label>
        <label className="nn-control"><span>Training data <output>{trainPercent}%</output></span><input type="range" min="50" max="90" step="5" value={trainPercent} disabled={running} onChange={e=>setTrainPercent(Number(e.target.value))}/><small>Remaining examples are held back for testing.</small></label>
        <div className="nn-architecture"><div className="nn-architecture-head"><b>Hidden layers</b><span>{shape.join(" · ")}</span></div>{shape.map((count,index)=><label key={index} className="nn-layer-control"><span>Layer {index+1}</span><select value={count} disabled={running} onChange={e=>changeShape(index,e.target.value)}>{[2,3,4,5,6,8].map(n=><option key={n} value={n}>{n} neurons</option>)}</select></label>)}<div className="nn-layer-actions"><button onClick={addLayer} disabled={shape.length>=3}>+ Add layer</button><button onClick={removeLayer} disabled={shape.length<=1}>Remove layer</button></div></div>
        <div className="nn-train-actions"><button className="btn-primary" onClick={()=>trainOne(1)} disabled={running}><Play size={14}/> Train 1 epoch</button><button className="btn-ghost" onClick={()=>trainOne(10)} disabled={running}>Train 10</button><button className="btn-ghost" onClick={()=>trainOne(100)} disabled={running}><Zap size={14}/> Train 100</button></div>
        <p className="nn-training-status" aria-live="polite">{running ? `Training in progress · epoch ${epoch}` : `Ready · ${epoch} epoch${epoch===1?"":"s"} completed`}</p>
        <p className="nn-local-note"><ShieldCheck size={14}/> Runs locally in your browser. No API key or account needed.</p>
      </aside>
    </div>
    <section className="nn-explain-grid"><article><span>01 · DATASET</span><h3>Examples to learn from</h3><p>Each dot has two input features (X and Y) and a known class. The network sees training examples and tries to learn their pattern.</p></article><article><span>02 · NETWORK</span><h3>Layers find patterns</h3><p>Hidden layers combine signals into useful intermediate features. More neurons can represent more complex boundaries, but are not always better.</p></article><article><span>03 · TRAINING</span><h3>Improve through feedback</h3><p>Backpropagation calculates how weights contributed to an error. Gradient descent nudges those weights to reduce the loss.</p></article></section>
    <div className="nn-reference-note">Educational simulator: a compact fully connected neural network using sigmoid output, selectable hidden activations and mini-batch gradient descent. It is intended for learning, not production modelling.</div>
  </main>;
}


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
  const [network,setNetwork] = useState(createNetwork);
  const [trainingEpochs,setTrainingEpochs] = useState(0);
  const [selectedXor,setSelectedXor] = useState(1);
  const [trainingRate,setTrainingRate] = useState(1.5);
  const [trainingHistory,setTrainingHistory] = useState([networkLoss(createNetwork())]);


  const completed = useMemo(() => Object.keys(answers).length, [answers]);
  const score = quiz.reduce((n, q, i) => n + (answers[i] === q.correct ? 1 : 0), 0);
  const currentLesson = lessons.find(x => x.id === selectedLesson) || lessons[0];
  const filteredLessons = lessons.filter(x => (x.title + " " + x.desc + " " + x.tag).toLowerCase().includes(query.toLowerCase()));
  const z = x1*w1 + x2*w2 + bias;
  const probability = 1 / (1 + Math.exp(-z));
  const selectedXorSample = xorTrainingSet[selectedXor];
  const xorPrediction = forwardNetwork(network,selectedXorSample.input);
  const currentNetworkLoss = networkLoss(network);
  const trainEpochs = (count=1) => {
    setNetwork(previous=>{
      let next=previous;
      for(let i=0;i<count;i++) next=trainNetworkEpoch(next,trainingRate);
      return next;
    });
    setTrainingEpochs(previous=>previous+count);
    setTrainingHistory(previous=>{
      const history=[...previous];
      let model=network;
      for(let i=0;i<count;i++) model=trainNetworkEpoch(model,trainingRate);
      history.push(networkLoss(model));
      return history.slice(-24);
    });
  };
  const resetTraining = () => {
    const fresh=createNetwork();
    setNetwork(fresh);
    setTrainingEpochs(0);
    setTrainingHistory([networkLoss(fresh)]);
  };

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
        <button className={active==="neural-playground"?"nav-active":""} onClick={()=>go("neural-playground")}>Neural Playground</button>
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
            <button className="btn-ghost" onClick={()=>go("neural-playground")}><Play size={16}/> Try the neural playground</button>
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
      <section className="lab-first-steps" aria-labelledby="lab-guide-title">
        <div className="lab-guide-heading">
          <div>
            <div className="eyebrow">NEW HERE? START WITH THIS</div>
            <h2 id="lab-guide-title">Your 60-second guide to the lab</h2>
            <p>You do not need a maths or coding background. Think of this as a tiny decision-maker you can experiment with.</p>
          </div>
          <span className="guide-time"><Sparkles size={14}/> BEGINNER FRIENDLY</span>
        </div>
        <div className="lab-guide-grid">
          <article className="lab-guide-step">
            <span className="guide-number">01</span>
            <div className="guide-step-icon"><SlidersHorizontal size={19}/></div>
            <h3>Give it signals</h3>
            <p><b>Input 1</b> and <b>Input 2</b> are two pieces of information. Imagine clues such as an object's colour and shape. Move the input sliders to make each clue weaker or stronger.</p>
          </article>
          <article className="lab-guide-step">
            <span className="guide-number">02</span>
            <div className="guide-step-icon"><GitBranch size={19}/></div>
            <h3>Choose their influence</h3>
            <p>A <b>weight</b> tells the neuron how much a signal matters. A positive weight pushes the result up; a negative weight pulls it down. A weight near zero has little influence.</p>
          </article>
          <article className="lab-guide-step">
            <span className="guide-number">03</span>
            <div className="guide-step-icon"><Scale size={19}/></div>
            <h3>Adjust the starting point</h3>
            <p><b>Bias</b> is an extra value added before the final calculation. It can shift the result up or down, even when the inputs stay the same.</p>
          </article>
          <article className="lab-guide-step">
            <span className="guide-number">04</span>
            <div className="guide-step-icon"><Gauge size={19}/></div>
            <h3>Watch the prediction</h3>
            <p>The neuron combines the signals, then the <b>sigmoid</b> function turns the result into a score from 0% to 100%. Try changing one slider at a time and watch what happens.</p>
          </article>
        </div>
        <div className="lab-try-it">
          <div className="try-it-icon"><Lightbulb size={20}/></div>
          <div>
            <strong>Try this mini experiment</strong>
            <p>Keep the inputs where they are. Move <b>Weight 1</b> from a positive value to a negative value. Notice how the first signal changes from supporting the prediction to reducing it. Then press <b>Reset</b> to start over.</p>
          </div>
        </div>
        <details className="lab-glossary">
          <summary>What do the numbers and terms mean?</summary>
          <div className="glossary-grid">
            <p><b>Weighted sum (z)</b><br/>The total after each input is multiplied by its weight and the bias is added.</p>
            <p><b>Sigmoid</b><br/>A mathematical curve that converts any number into a value between 0 and 1.</p>
            <p><b>Neuron</b><br/>A small calculation unit that combines incoming signals and produces an output.</p>
            <p><b>Prediction score</b><br/>The model's output for this demonstration. It is not a guaranteed answer or a real-world probability.</p>
          </div>
        </details>
      </section>
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
      <section className="deep-network-studio" aria-labelledby="deep-studio-title">
        <div className="deep-studio-intro">
          <div>
            <div className="eyebrow">VERSION 1.2 · TRAINING STUDIO</div>
            <h2 id="deep-studio-title">Now teach a network to learn.</h2>
            <p>This is a small, working multi-layer neural network. It starts with untrained weights, makes predictions, compares them with the answers, and uses backpropagation to improve.</p>
          </div>
          <span className="training-pill"><i/> BACKPROPAGATION</span>
        </div>

        <div className="deep-studio-grid">
          <div className="deep-network-panel">
            <div className="deep-panel-head">
              <div><span className="eyebrow">NETWORK ARCHITECTURE</span><h3>2 inputs → 4 hidden neurons → 1 output</h3></div>
              <span className="architecture-tag">2–4–1</span>
            </div>
            <div className="deep-network-canvas">
              <svg viewBox="0 0 650 310" role="img" aria-label="Multi-layer neural network with two input neurons, four hidden neurons and one output neuron">
                <defs>
                  <linearGradient id="deepLine" x1="0" x2="1"><stop offset="0%" stopColor="#8d75ec"/><stop offset="100%" stopColor="#e58fc0"/></linearGradient>
                  <filter id="deepGlow"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                </defs>
                {network.hiddenWeights.map((weights,i)=>[
                  <line key={`a-${i}`} x1="105" y1="105" x2="335" y2={48+i*70} stroke="url(#deepLine)" strokeWidth={1.5+Math.min(3,Math.abs(weights[0]))} opacity=".58"/>,
                  <line key={`b-${i}`} x1="105" y1="220" x2="335" y2={48+i*70} stroke="#75d9cf" strokeWidth={1.5+Math.min(3,Math.abs(weights[1]))} opacity=".58"/>
                ])}
                {network.outputWeights.map((weight,i)=><line key={`o-${i}`} x1="335" y1={48+i*70} x2="555" y2="150" stroke="#bd9cf4" strokeWidth={1.5+Math.min(3,Math.abs(weight))} opacity=".62"/>)}
                <text x="105" y="28" fill="#a99bd4" fontSize="11" textAnchor="middle">INPUT LAYER</text>
                <text x="335" y="17" fill="#a99bd4" fontSize="11" textAnchor="middle">HIDDEN LAYER</text>
                <text x="555" y="105" fill="#a99bd4" fontSize="11" textAnchor="middle">OUTPUT</text>
                {[105,220].map((y,i)=><g key={`input-${i}`}><circle cx="105" cy={y} r="27" fill="#30265c" stroke="#a78bfa" strokeWidth="2"/><text x="105" y={y+4} fill="#fff" fontSize="15" textAnchor="middle" fontWeight="700">x{i+1}</text></g>)}
                {xorPrediction.hidden.map((value,i)=><g key={`hidden-${i}`}><circle cx="335" cy={48+i*70} r="24" fill="#49366e" stroke="#c5a7ff" strokeWidth="2" filter="url(#deepGlow)"/><text x="335" y={52+i*70} fill="#fff" fontSize="12" textAnchor="middle" fontWeight="700">{(value*100).toFixed(0)}%</text></g>)}
                <circle cx="555" cy="150" r="38" fill="#245448" stroke="#8ce5b8" strokeWidth="2.5" filter="url(#deepGlow)"/>
                <text x="555" y="146" fill="#fff" fontSize="10" textAnchor="middle">OUTPUT</text><text x="555" y="164" fill="#fff" fontSize="15" fontWeight="700" textAnchor="middle">{(xorPrediction.output*100).toFixed(0)}%</text>
                <text x="105" y="275" fill="#b9b2d5" fontSize="11" textAnchor="middle">2 signals</text>
                <text x="335" y="275" fill="#b9b2d5" fontSize="11" textAnchor="middle">4 learned features</text>
                <text x="555" y="212" fill="#b9b2d5" fontSize="11" textAnchor="middle">prediction</text>
              </svg>
            </div>
            <div className="deep-network-legend">
              <span><i className="legend-input"/> Input layer</span><span><i className="legend-hidden"/> Hidden layer</span><span><i className="legend-output"/> Output layer</span>
            </div>
            <div className="network-insight"><Lightbulb size={17}/><p><b>What makes this multi-layer?</b> The hidden layer combines the two inputs in four different ways. The output layer combines those learned signals to make the final prediction.</p></div>
          </div>

          <aside className="training-controls-panel">
            <div className="deep-panel-head"><div><span className="eyebrow">TRAINING CONTROLS</span><h3>Teach the network</h3></div><button className="reset-button" onClick={resetTraining}><RotateCcw size={14}/> Reset</button></div>
            <div className="training-metrics">
              <div><span>EPOCHS</span><strong>{trainingEpochs.toLocaleString()}</strong></div>
              <div><span>AVERAGE LOSS</span><strong>{currentNetworkLoss.toFixed(4)}</strong></div>
            </div>
            <div className="training-rate-control">
              <div className="control-title"><label htmlFor="learning-rate">Learning rate</label><output>{trainingRate.toFixed(2)}</output></div>
              <input id="learning-rate" type="range" min=".1" max="2" step=".05" value={trainingRate} onChange={e=>setTrainingRate(Number(e.target.value))}/>
              <small>How strongly the model adjusts its weights after each example.</small>
            </div>
            <div className="training-actions">
              <button className="btn-primary" onClick={()=>trainEpochs(1)}><Play size={15}/> Train 1 epoch</button>
              <button className="btn-light" onClick={()=>trainEpochs(100)}><Zap size={15}/> Train 100</button>
              <button className="btn-light" onClick={()=>trainEpochs(500)}><Zap size={15}/> Train 500</button>
            </div>
            <div className="loss-visual">
              <div className="loss-head"><b>Learning progress</b><span>Lower loss is better</span></div>
              <svg viewBox="0 0 300 92" role="img" aria-label="Recent training loss trend">
                <path d="M5 8 V78 H295" stroke="#ffffff30" fill="none"/>
                {trainingHistory.length>1 && <polyline points={trainingHistory.map((loss,i)=>`${5+i*(290/Math.max(1,trainingHistory.length-1))},${75-Math.min(1,loss)*62}`).join(" ")} fill="none" stroke="#9c85f0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>}
                {trainingHistory.length===1 && <text x="150" y="45" fill="#aaa8c3" fontSize="10" textAnchor="middle">Train the network to see its progress</text>}
              </svg>
            </div>
            <div className="training-note"><ShieldCheck size={16}/><p>Training happens in your browser. No account, server or API key is needed.</p></div>
          </aside>
        </div>

        <div className="xor-challenge">
          <div className="xor-challenge-heading"><div><span className="eyebrow">THE LEARNING CHALLENGE</span><h3>Can your network learn XOR?</h3><p>Choose an example. The network predicts an answer, then compare it with the correct label.</p></div><span className="xor-tag">4 TRAINING EXAMPLES</span></div>
          <div className="xor-examples">
            {xorTrainingSet.map((sample,i)=><button key={sample.label} className={selectedXor===i?"xor-example selected":"xor-example"} onClick={()=>setSelectedXor(i)}><span>{sample.input[0]} XOR {sample.input[1]}</span><strong>{sample.target}</strong></button>)}
          </div>
          <div className="xor-result">
            <div><span>NETWORK PREDICTION</span><strong>{xorPrediction.output.toFixed(3)}</strong></div>
            <div><span>EXPECTED ANSWER</span><strong>{selectedXorSample.target}</strong></div>
            <div><span>ABSOLUTE ERROR</span><strong>{Math.abs(selectedXorSample.target-xorPrediction.output).toFixed(3)}</strong></div>
            <div className={Math.round(xorPrediction.output)===selectedXorSample.target?"xor-status learned":"xor-status learning"}>{Math.round(xorPrediction.output)===selectedXorSample.target?"Matches label":"Keep training"}</div>
          </div>
          <p className="xor-footnote">The model uses sigmoid activations and backpropagation with gradient descent on a tiny XOR training set. Training loss is a learning signal, not a guarantee of performance on other data.</p>
        </div>
      </section>

      <section className="lab-formula">
        <div><div className="eyebrow">THE SIMPLE MATHS</div><h2>From inputs to output</h2><p>Neurons combine incoming signals using weights and a bias. The activation function transforms the combined value.</p></div>
        <div className="formula-box"><code>z = (x₁ × w₁) + (x₂ × w₂) + b</code><code>output = 1 ÷ (1 + e<sup>−z</sup>)</code><span>Here, sigmoid keeps the output between 0 and 1.</span></div>
      </section>
      <div className="lab-caveat"><CircleHelp size={17}/><p><b>Learning model, not a trained AI.</b> This is a single-neuron mathematical simulation with manually adjustable parameters. Real neural networks usually contain many neurons and learn weights from training data through optimisation.</p></div>
    </main>}

    {active==="neural-playground" && <NeuralNetworkPlayground/>}

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
