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
