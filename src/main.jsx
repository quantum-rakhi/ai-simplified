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


const lessonDeepDive = {
  ai: {
    outcome: "Explain what AI is, identify common AI tasks, and recognise its limits.",
    modules: [
      { title:"What problem does AI solve?", explain:"Traditional software follows rules that people explicitly write. That works well when every step is known. But tasks such as recognising a face, understanding a spoken sentence or spotting an unusual transaction are difficult to describe as a complete list of rules. AI techniques help computers handle these tasks by using patterns, examples, search or encoded knowledge.", bullets:["Input: information such as text, images, numbers or sound.","Processing: a system applies a method or model to the input.","Output: a classification, prediction, recommendation, generated response or action."], example:"A spam filter receives an email, analyses clues such as wording and sender behaviour, and estimates whether it belongs in the spam folder.", task:"Name one task you do that involves recognising a pattern. What information would a computer need to attempt it?" },
      { title:"What makes a system intelligent?", explain:"In AI, intelligence is usually discussed through capabilities rather than human-like consciousness. A system may perceive information, represent knowledge, reason over possibilities, learn from examples, understand or generate language, plan actions, or solve a constrained problem. Different AI systems combine different capabilities.", bullets:["Perception: interpreting images, audio or sensor signals.","Prediction: estimating what may happen or which category fits.","Reasoning and planning: comparing options against goals and constraints.","Language: analysing or producing human language."], example:"A navigation app combines location signals, map data and route-search algorithms to recommend a route. It is an AI-related capability, but it does not need human feelings or awareness to do it.", task:"Which capabilities might a voice assistant use when you ask it to set a reminder?" },
      { title:"AI, machine learning and deep learning", explain:"Artificial Intelligence is the broad field. Machine Learning is one approach within AI: instead of hand-writing every decision rule, developers train a model using data. Deep Learning is a family of machine-learning methods based on multi-layer neural networks. Generative AI describes systems that create new content; many modern generative systems use deep learning.", bullets:["AI is the umbrella term.","ML learns patterns from data; not every AI system must learn from data.","Deep Learning uses neural networks with multiple layers.","Generative AI focuses on producing outputs such as text, images, audio or code."], example:"A rule-based chess program can be AI without machine learning. A model trained to recognise handwritten digits is ML. A large language model that drafts an email is generative AI.", task:"Put these in the right relationship: AI, Machine Learning, Deep Learning. Which is the broadest field?" },
      { title:"Where AI is used — and where it can fail", explain:"AI is used in recommendation systems, fraud detection, medical-image support, translation, accessibility tools, manufacturing inspection, customer support and forecasting. Its usefulness depends on the task, data, evaluation and human oversight. A confident output is not automatically a correct one.", bullets:["Data can be incomplete, outdated, unrepresentative or incorrectly labelled.","A model may perform well in testing but poorly in a new environment.","Some decisions need explanations, audit trails and human review.","Privacy, fairness, security and accountability matter throughout development."], example:"A bank may use a model to flag a suspicious payment for review. The flag is a signal for investigation, not proof that the customer committed fraud.", task:"Think of one AI use case where a wrong answer could cause harm. What human check should be added?" }
    ]
  },
  ml: {
    outcome:"Describe the machine-learning workflow and distinguish the main learning approaches.",
    modules:[
      {title:"What does it mean to learn from data?", explain:"A machine-learning model is a mathematical or computational system whose parameters are adjusted using examples. During training, the model makes predictions, compares them with a learning signal and updates its parameters to improve a chosen objective. The goal is not to memorise the training examples, but to perform well on new examples.", bullets:["Features are the input information used by a model.","A label is the target answer in supervised learning.","Parameters are internal values the training process adjusts.","A loss function measures how far predictions are from the target."], example:"For house-price estimation, features might include floor area, location and number of bedrooms. The target label is the known sale price.", task:"For predicting whether a message is spam, identify two possible features and the target label."},
      {title:"The three common learning approaches", explain:"Supervised learning uses labelled examples. Unsupervised learning looks for structure in data without supplied target labels. Reinforcement learning trains an agent to choose actions through feedback from an environment, often expressed as rewards or penalties.", bullets:["Supervised: classification (spam/not spam) and regression (price prediction).","Unsupervised: clustering customers or finding unusual patterns.","Reinforcement: learning a sequence of actions for a game-playing agent or robot."], example:"If you have thousands of customer records with no categories and want to discover groups with similar behaviour, clustering is an unsupervised-learning task.", task:"You have photos already tagged as cat or dog. Which learning approach is suitable, and why?"},
      {title:"A practical machine-learning workflow", explain:"A typical project starts with a clearly defined problem and a measurable success criterion. Data is collected, inspected, cleaned and transformed. The dataset is split so that model choices are not judged only on examples used for fitting. A model is trained, evaluated, improved and then monitored after deployment.", bullets:["Define the target and what a useful prediction means.","Explore data quality, missing values, duplicates and class balance.","Split data into training, validation and test sets where appropriate.","Train and tune using training and validation data; reserve test data for final evaluation.","Monitor performance as real-world data changes."], example:"A support team might predict which tickets need urgent attention. Before training, it should define 'urgent', check whether historical labels are reliable and decide how the team will use the prediction.", task:"Why should the final test set not be repeatedly used to choose model settings?"},
      {title:"Algorithms, evaluation and common mistakes", explain:"Different algorithms suit different data and constraints. Linear regression models a numeric target; logistic regression is commonly used for classification; decision trees create rule-like splits; random forests combine many trees; k-nearest neighbours compares nearby examples; support vector machines seek separating boundaries. No algorithm is best for every problem.", bullets:["Accuracy is the fraction of predictions that are correct.","Precision asks: of predicted positives, how many were truly positive?","Recall asks: of actual positives, how many did we find?","Overfitting means fitting training details too closely and generalising poorly.","Data leakage occurs when information unavailable at prediction time enters training or evaluation."], example:"For a rare disease screening task, high accuracy can be misleading if almost everyone is healthy. Recall and false-negative rates may be especially important.", task:"In fraud detection, would missing a real fraud case or incorrectly flagging a legitimate payment be more costly? The answer helps choose metrics."}
    ]
  },
  dl: {
    outcome:"Explain neurons, layers, training and why deep learning is useful for complex data.",
    modules:[
      {title:"From a neuron to a neural network", explain:"An artificial neuron receives numeric inputs, multiplies them by weights, adds a bias and applies an activation function. The result is passed to other neurons. A network connects many such units so that it can learn a mapping from inputs to outputs.", bullets:["Input layer receives the data representation.","Hidden layers transform information into intermediate representations.","Output layer produces the model's result.","Weights control signal influence; biases shift a neuron's response."], example:"An image classifier receives pixel values. Early layers may respond to simple edges or textures; later layers can combine those signals into more complex visual patterns.", task:"In the Visual AI Lab, change a weight from positive to negative. How does the neuron's output change?"},
      {title:"Why are layers called deep?", explain:"A network is called deep when it has multiple layers of learned transformations. Each layer receives the previous layer's representation and builds on it. Depth can help model complex relationships, but adding layers also increases computational demands and can make training harder.", bullets:["A layer transforms its input into a new representation.","Neurons in a layer can learn different useful signals.","Network architecture includes layer count, width and connectivity.","More layers or neurons do not automatically mean better results."], example:"In speech recognition, a model processes an audio signal and learns representations useful for mapping sound patterns to language.", task:"Why might a very large network be a poor choice when you have only a tiny training dataset?"},
      {title:"How neural networks learn", explain:"Training repeatedly runs examples through the network (forward propagation), calculates a loss, computes how each parameter contributed to that loss (backpropagation), and updates weights using an optimiser such as gradient descent. The process repeats over batches and epochs.", bullets:["Forward pass: calculate a prediction.","Loss: quantify prediction error against the target.","Backpropagation: calculate gradients using the chain rule.","Optimisation: adjust weights to reduce loss.","Epoch: one pass through the training dataset."], example:"The Neural Playground lets you train a small network on XOR. XOR is useful because a single linear boundary cannot separate its two classes; a hidden layer can learn a more suitable representation.", task:"Press Train 100 in the Neural Playground and observe the loss. Does lower training loss always guarantee good test performance?"},
      {title:"Strengths, limits and responsible use", explain:"Deep learning is especially useful for complex unstructured data such as images, audio and text. It often requires substantial data, compute and careful evaluation. Neural networks can be difficult to interpret, vulnerable to dataset shifts and sensitive to biases in training data.", bullets:["Use a baseline model before assuming deep learning is necessary.","Evaluate on data representative of real use.","Check robustness, fairness, privacy and security.","Keep human oversight for high-impact decisions."], example:"A factory vision model may detect surface defects, but changes in lighting or camera placement can reduce accuracy. Monitoring and revalidation are essential.", task:"Suggest one change in a real environment that could make an image model less reliable."}
    ]
  },
  genai: {
    outcome:"Explain how generative systems create content and how to use their outputs responsibly.",
    modules:[
      {title:"What makes generative AI different?", explain:"Traditional predictive systems often classify, score or estimate. Generative AI produces a new sequence or artefact — such as text, an image, audio, video or code — based on patterns learned during training and the instructions or context supplied at use time.", bullets:["Input may include a prompt, reference material or other media.","The model generates an output based on learned statistical structure.","Different model families specialise in text, images, audio, video or combinations.","Generated output is not automatically original, factual, safe or fit for purpose."], example:"A text model can draft a meeting summary; an image model can create a concept illustration; a code assistant can propose a function.", task:"List one task where generating a first draft is useful, and one reason a person must review it."},
      {title:"How text generation works at a high level", explain:"Many language-generation models convert text into tokens, process the token sequence in context and estimate what token is likely to come next. Generation repeats one step at a time until a stopping condition is reached. The result depends on the model, prompt, context and decoding settings.", bullets:["A token can be a whole word, part of a word or punctuation.","Context is the information available to the model while generating.","The model estimates likely continuations; it does not look up truth by default.","Sampling settings can influence how predictable or varied outputs are."], example:"When asked to complete 'The capital of France is…', a model will often produce 'Paris' because that continuation is strongly represented in learned patterns. This mechanism alone is not a guarantee of truth.", task:"Why might a model produce a plausible but incorrect answer to a question about a very recent event?"},
      {title:"Multimodal generation and practical uses", explain:"Multimodal systems can work across more than one type of information, such as text, images, audio and video. Depending on the tool, a user might describe an image, ask questions about a document, generate speech or combine text and visuals in a workflow.", bullets:["Text-to-image: create an image from a written description.","Speech systems: transcribe audio or generate spoken output.","Document workflows: extract, summarise and compare information.","Code generation: suggest, explain or transform source code."], example:"A product team might use a generative tool to brainstorm interface copy, create placeholder illustrations and draft test cases — then have designers and engineers review each output.", task:"Choose a multimodal task and identify the input, output and human review step."},
      {title:"Risks, verification and good practice", explain:"Generative systems can hallucinate details, reproduce bias, expose sensitive information if used carelessly, or create misleading media. Use approved tools, avoid entering confidential information without permission, verify factual claims and check licences or usage rights for generated assets.", bullets:["Verify names, dates, calculations, citations and technical claims independently.","Treat generated code as untrusted until reviewed and tested.","Do not use AI output as the sole basis for high-impact decisions.","Disclose synthetic media where context or policy requires it."], example:"If an AI drafts a legal or medical explanation, treat it as a starting point for questions — not a substitute for a qualified professional.", task:"Create a three-point checklist you would use before publishing AI-generated content."}
    ]
  },
  llm: {
    outcome:"Describe tokens, context, model training and the limits of language-model responses.",
    modules:[
      {title:"What is a large language model?", explain:"A Large Language Model (LLM) is a neural network trained on large collections of text and other data to model language. Given an input context, it generates a continuation, commonly one token at a time. Its scale refers to the size of the model and training process, not to human-like understanding.", bullets:["The prompt is the input context supplied for a response.","Tokens are the units the model processes and generates.","Parameters are learned numerical values inside the network.","The context window limits how much information can be considered in one request."], example:"When you ask an assistant to rewrite a paragraph, it processes your instruction and paragraph as context, then generates a revised sequence of tokens.", task:"Why can a very long conversation or document exceed a model's context window?"},
      {title:"How an LLM is built and adapted", explain:"A common development pipeline includes pretraining on large datasets to learn language patterns, followed by additional stages that may improve instruction following, usefulness and safety. Some systems can also use retrieval to bring relevant external documents into the prompt at answer time.", bullets:["Pretraining learns broad statistical patterns from data.","Instruction tuning helps a model respond to requests.","Human feedback or preference optimisation may shape response behaviour.","Retrieval-augmented generation (RAG) supplies relevant source material at runtime."], example:"A company help assistant might retrieve the latest internal policy page and give that text to an LLM so its answer is grounded in current company documentation.", task:"What problem can retrieval solve when an LLM's built-in knowledge is outdated?"},
      {title:"Why LLMs sometimes make things up", explain:"An LLM is optimised to generate likely sequences, not to guarantee that every statement is true. If context is missing, a question is ambiguous or the model has learned a misleading pattern, it may produce a fluent but false answer. This is often called a hallucination.", bullets:["Fluency is not evidence of correctness.","The model may lack current information or access to a source.","Ambiguous prompts can lead to unsupported assumptions.","Citations should be opened and checked, not trusted merely because they look convincing."], example:"A model may invent a book title or research paper when asked for sources. Search for the title and verify the publisher, author and publication details.", task:"What would you do to verify an AI-generated statistic before putting it in a report?"},
      {title:"Using LLMs effectively and safely", explain:"Good LLM workflows provide a clear goal, relevant context, constraints and an output format. For important tasks, give the model trusted source material, ask it to identify uncertainty, verify the result and keep a person accountable for the final decision.", bullets:["Break complex work into smaller, reviewable steps.","Provide source documents when answers must be grounded.","Remove personal, confidential or regulated data unless the tool is approved for it.","Test outputs against acceptance criteria before using them."], example:"For a QA test-case draft, provide the user story, acceptance criteria, platform and required format. Then review coverage, edge cases and whether each test is actually executable.", task:"Write a prompt for an LLM to summarise a policy document while separating facts from recommendations."}
    ]
  },
  prompt: {
    outcome:"Write clear prompts, iterate on outputs and evaluate whether an answer meets the task.",
    modules:[
      {title:"Anatomy of a useful prompt", explain:"A prompt is a brief that tells an AI system what you want. Strong prompts reduce guesswork by specifying the task, relevant context, audience, constraints and output format. You do not need special keywords; clarity and useful information matter most.", bullets:["Role or perspective: the kind of help you need, when relevant.","Task: the exact action to perform.","Context: background, source material and assumptions.","Constraints: length, tone, exclusions, tools or boundaries.","Output format: table, checklist, code, summary or steps."], example:"Instead of 'Help with testing', try 'Act as a QA analyst. From the acceptance criteria below, draft 8 functional test cases for a web checkout flow. Include preconditions, steps, expected results and one negative case per major feature.'", task:"Improve this prompt: 'Tell me about cloud computing.' Add an audience, purpose and output format."},
      {title:"Give context and source material", explain:"Context helps the model understand the situation. Include only information relevant to the task, define unfamiliar terms and provide the material the answer should rely on. If you need the model to use only a document, say so explicitly and ask it to flag gaps rather than fill them with guesses.", bullets:["State who the output is for and how it will be used.","Paste or attach the relevant requirements, data or examples.","Define acronyms and domain-specific terms if needed.","Separate facts, assumptions and open questions."], example:"'Use only the attached release notes. Summarise changes for customer support. Do not infer missing dates; list any unclear items under Open questions.'", task:"What context would you provide before asking an AI to draft a project status report?"},
      {title:"Iterate, constrain and evaluate", explain:"Prompting is often a cycle: draft, inspect, identify what is missing, refine and verify. Ask for alternatives or a self-check, but do not assume the model's self-evaluation is proof. Compare the output against explicit acceptance criteria.", bullets:["Ask for a first draft, then request targeted revisions.","Use constraints such as word count, reading level or required sections.","Ask the model to state assumptions and uncertainties.","Check completeness, correctness, tone, bias and usability yourself."], example:"If a generated explanation is too technical, follow up with: 'Rewrite for a beginner, define each technical term on first use, and include one everyday analogy without changing the factual meaning.'", task:"An answer is correct but too long. Write a follow-up instruction that makes it concise without removing essential caveats."},
      {title:"Reusable prompt patterns and safety", explain:"Templates make repeatable work easier. A useful pattern is: goal + context + constraints + output format + quality checks. For sensitive or consequential tasks, limit the data shared, verify the result and keep human judgement in the loop.", bullets:["Summarise: source + audience + length + required sections.","Compare: options + criteria + evidence + trade-offs.","Generate: purpose + audience + style + constraints.","Analyse: dataset + question + method + limitations.","Never paste passwords, secrets or confidential information into an unapproved AI tool."], example:"'Compare these two test strategies using coverage, execution time, maintenance effort and risk. Use only the supplied details, show a comparison table, and list missing information separately.'", task:"Create a reusable prompt template for a task you perform regularly at work or school."}
    ]
  }
};

function LessonDeepDive({lesson}) {
  const content = lessonDeepDive[lesson.id];
  const [expanded, setExpanded] = useState(0);
  const [revealed, setRevealed] = useState({});
  if (!content) return null;
  return <section className="deep-dive">
    <style>{`
      .deep-dive{margin:30px 0 28px}.deep-dive-head{margin-bottom:18px}.deep-dive-head .eyebrow{margin-bottom:9px}.deep-dive-head h2{font-size:25px;margin:0 0 8px}.deep-dive-head p{color:#bdb7d8;line-height:1.7;margin:0}
      .learning-outcome{border:1px solid rgba(166,139,250,.28);background:rgba(139,110,232,.10);padding:15px 17px;border-radius:14px;margin:18px 0 22px;color:#ddd5ff;line-height:1.65}.learning-outcome b{display:block;color:#c4adff;font-size:11px;letter-spacing:1.2px;margin-bottom:5px}
      .chapter-card{border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.035);border-radius:15px;margin:12px 0;overflow:hidden}.chapter-toggle{width:100%;display:flex;align-items:center;gap:13px;text-align:left;padding:17px 18px;background:transparent;border:0;color:#f5f1ff;cursor:pointer}.chapter-number{width:34px;height:34px;border-radius:10px;background:#30284f;color:#c8b5ff;display:grid;place-items:center;font-size:12px;font-weight:800;flex:none}.chapter-toggle strong{font-size:15px;flex:1}.chapter-toggle .chapter-chevron{color:#b7a4f4;transition:transform .2s}.chapter-toggle[aria-expanded="true"] .chapter-chevron{transform:rotate(90deg)}
      .chapter-body{padding:0 19px 19px 65px;color:#c9c3df;line-height:1.75}.chapter-body p{margin:0 0 13px}.chapter-body h4{color:#f0eaff;font-size:13px;margin:17px 0 8px}.chapter-body ul{padding-left:19px;margin:0 0 14px}.chapter-body li{padding:3px 0}.chapter-example{background:rgba(119,217,198,.07);border-left:3px solid #77d9c6;border-radius:0 10px 10px 0;padding:12px 14px;margin:14px 0;color:#d2e9e3}.chapter-task{background:rgba(173,145,255,.08);border:1px solid rgba(173,145,255,.18);padding:13px 14px;border-radius:11px;margin-top:14px}.chapter-task b{display:block;color:#cbb8ff;font-size:11px;letter-spacing:1px;margin-bottom:5px}.chapter-task button{border:0;background:transparent;color:#cdbbff;text-decoration:underline;padding:7px 0 0;cursor:pointer;font-weight:700}.chapter-answer{margin-top:9px;color:#d9d2f2;font-size:13px}
      .lesson-end-check{padding:18px;border-radius:14px;background:#211e38;border:1px solid rgba(255,255,255,.1);margin:22px 0}.lesson-end-check h3{margin:0 0 8px}.lesson-end-check p{color:#c5bfdc;line-height:1.65;margin:0}
      @media(max-width:700px){.chapter-body{padding:0 15px 17px}.chapter-toggle{padding:14px}.chapter-toggle strong{font-size:14px}}
    `}</style>
    <div className="deep-dive-head"><div className="eyebrow">GO BEYOND THE SUMMARY · {content.modules.length} CHAPTERS</div><h2>Learn it step by step</h2><p>Work through each chapter in order. Open a chapter to read the explanation, see a practical example and try a short thinking exercise.</p></div>
    <div className="learning-outcome"><b>WHAT YOU'LL BE ABLE TO DO</b>{content.outcome}</div>
    {content.modules.map((module,index)=><article className="chapter-card" key={module.title}>
      <button className="chapter-toggle" aria-expanded={expanded===index} onClick={()=>setExpanded(expanded===index?-1:index)}>
        <span className="chapter-number">{String(index+1).padStart(2,"0")}</span><strong>{module.title}</strong><ChevronRight className="chapter-chevron" size={18}/>
      </button>
      {expanded===index&&<div className="chapter-body">
        <p>{module.explain}</p><h4>Key ideas</h4><ul>{module.bullets.map(item=><li key={item}>{item}</li>)}</ul>
        <div className="chapter-example"><b>REAL-WORLD EXAMPLE</b><br/>{module.example}</div>
        <div className="chapter-task"><b>THINK IT THROUGH</b>{module.task}<br/><button onClick={()=>setRevealed(prev=>({...prev,[index]:!prev[index]}))}>{revealed[index]?"Hide reflection hint":"Show reflection hint"}</button>{revealed[index]&&<div className="chapter-answer">There can be more than one good answer. Identify the input, the task the system is performing, what a correct result would look like, and what could go wrong. Explain your reasoning rather than memorising a definition.</div>}</div>
      </div>}
    </article>)}
    <div className="lesson-end-check"><h3>Before you move on</h3><p>Can you explain the main idea in your own words, give a real-world example and name one limitation? If yes, you're ready for the next lesson. If not, revisit the chapter that felt least clear.</p></div>
  </section>;
}

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
function buildDenseNetwork(shape=[4,2],seed=17,activation="tanh") {
  // Deterministic Xavier/He-style initialization keeps signal magnitudes
  // better behaved as the network gets wider or deeper.
  const sizes=[2,...shape,1];
  let n=seed;
  const rand=()=>{n=(n*9301+49297)%233280;return n/233280-.5;};
  return sizes.slice(1).map((size,layer)=>{
    const fanIn=sizes[layer];
    const fanOut=size;
    const useHe=activation==="relu" && layer<sizes.length-2;
    const limit=useHe ? Math.sqrt(6/fanIn) : Math.sqrt(6/(fanIn+fanOut));
    return Array.from({length:size},()=>({
      weights:Array.from({length:fanIn},()=>rand()*2*limit),
      bias:0
    }));
  });
}
function splitSamplesStratified(samples,trainPercent) {
  // Split each class independently so train and test retain similar class
  // balance. The hash makes the split deterministic and reproducible.
  const groups=[0,1].map(label=>samples.filter(sample=>sample.label===label));
  const train=[],test=[];
  groups.forEach((group,label)=>{
    const ordered=[...group].sort((a,b)=>{
      const hashA=((a.id+1)*2654435761+(label+1)*2246822519)>>>0;
      const hashB=((b.id+1)*2654435761+(label+1)*2246822519)>>>0;
      return hashA-hashB;
    });
    const requested=Math.round(ordered.length*trainPercent/100);
    const split=Math.max(ordered.length>1?1:0,Math.min(ordered.length-1,requested));
    train.push(...ordered.slice(0,split));
    test.push(...ordered.slice(split));
  });
  train.sort((a,b)=>a.id-b.id);
  test.sort((a,b)=>a.id-b.id);
  return {train,test};
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
  // Deterministic pseudo-shuffle avoids feeding batches in dataset order.
  const shuffled=[...samples].sort((a,b)=>{
    const hashA=((a.id+1)*2246822519)>>>0;
    const hashB=((b.id+1)*2246822519)>>>0;
    return hashA-hashB;
  });
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
function denseAccuracy(layers,samples,activation) {
  if(!samples.length)return 0;
  const correct=samples.reduce((count,sample)=>{
    const prediction=denseForward(layers,[sample.x,sample.y],activation).output>=.5?1:0;
    return count+(prediction===sample.label?1:0);
  },0);
  return correct/samples.length;
}

function NeuralNetworkPlayground() {
  const [dataset,setDataset]=useState("circle");
  const [activation,setActivation]=useState("tanh");
  const [learningRate,setLearningRate]=useState(.3);
  const [noise,setNoise]=useState(0);
  const [trainPercent,setTrainPercent]=useState(50);
  const [batchSize,setBatchSize]=useState(10);
  const [shape,setShape]=useState([4,2]);
  const [layers,setLayers]=useState(()=>buildDenseNetwork([4,2],17,"tanh"));
  const [epoch,setEpoch]=useState(0);
  const [history,setHistory]=useState([]);
  const [running,setRunning]=useState(false);
  const samples=useMemo(()=>makeSamples(dataset,noise),[dataset,noise]);
  const {train,test}=useMemo(()=>splitSamplesStratified(samples,trainPercent),[samples,trainPercent]);
  const trainLoss=denseLoss(layers,train,activation);
  const testLoss=denseLoss(layers,test,activation);
  const trainAccuracy=denseAccuracy(layers,train,activation);
  const testAccuracy=denseAccuracy(layers,test,activation);
  const generalizationGap=testLoss-trainLoss;
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
  const reset=()=>{if(running)return;setLayers(buildDenseNetwork(shape,17+epoch,activation));setEpoch(0);setHistory([]);};
  const resetForExperimentChange=()=>{setLayers(buildDenseNetwork(shape,17,activation));setEpoch(0);setHistory([]);};
  const changeDataset=value=>{if(running)return;setDataset(value);setLayers(buildDenseNetwork(shape,17,activation));setEpoch(0);setHistory([]);};
  const changeActivation=value=>{if(running)return;setActivation(value);setLayers(buildDenseNetwork(shape,17,value));setEpoch(0);setHistory([]);};
  const changeNoise=value=>{if(running)return;setNoise(value);resetForExperimentChange();};
  const changeTrainPercent=value=>{if(running)return;setTrainPercent(value);resetForExperimentChange();};
  const changeShape=(index,value)=>{
    if(running)return;
    const updated=[...shape];updated[index]=Number(value);setShape(updated);setLayers(buildDenseNetwork(updated,17,activation));setEpoch(0);setHistory([]);
  };
  const addLayer=()=>{if(!running&&shape.length<3){const next=[...shape,3];setShape(next);setLayers(buildDenseNetwork(next,17,activation));setEpoch(0);setHistory([]);}};
  const removeLayer=()=>{if(!running&&shape.length>1){const next=shape.slice(0,-1);setShape(next);setLayers(buildDenseNetwork(next,17,activation));setEpoch(0);setHistory([]);}};
  const cells=[];
  const grid=22;
  for(let gy=0;gy<grid;gy++)for(let gx=0;gx<grid;gx++){
    const x=(gx/(grid-1))*2-1,y=(gy/(grid-1))*2-1;
    const value=denseForward(layers,[x,y],activation).output;
    cells.push({x:gx*100/grid,y:gy*100/grid,value});
  }
const testIds = new Set(test.map(sample => sample.id));

const svgPoints = samples.map(sample => ({
  x: (sample.x + 1) * 50,
  y: (1 - sample.y) * 50,
  label: sample.label,
  isTest: testIds.has(sample.id)
}));

  const historyLosses=history.flatMap(h=>[h.train,h.test]);
  const minHistoryLoss=historyLosses.length?Math.min(...historyLosses):0;
  const maxHistoryLoss=historyLosses.length?Math.max(...historyLosses):1;
  const historyRange=Math.max(.02,maxHistoryLoss-minHistoryLoss);
  const chartY=loss=>75-((loss-minHistoryLoss)/historyRange)*62;
  return <main className="section-wrap page-main nn-playground-page">
    <div className="page-intro"><div className="eyebrow">VERSION 1.3.3 · INTERACTIVE MACHINE LEARNING</div><h1>Build it. Train it. <span>See it learn.</span></h1><p>Experiment with a real browser-based neural network. Change the data, architecture and training settings — then watch the decision boundary adapt.</p></div>
    <div className="nn-welcome"><Lightbulb size={19}/><p><b>First time here?</b> The coloured dots are examples. The network learns a boundary that separates the two groups. Start with Circle, keep the default settings and press <b>Train 100</b>.</p></div>
    <style>{`.nn-metrics-strip{display:flex;flex-wrap:wrap;gap:10px 18px;padding:11px 13px;margin:10px 0 2px;border:1px solid rgba(173,145,255,.16);border-radius:10px;background:rgba(255,255,255,.025);font-size:11px;color:#aaa4c7}.nn-metrics-strip span{display:flex;gap:6px;align-items:center}.nn-metrics-strip b{color:#e7ddff;font-variant-numeric:tabular-nums}`}</style>
    <div className="nn-workspace">
      <section className="nn-visual-card">
        <div className="nn-card-heading"><div><span className="eyebrow">LIVE DECISION BOUNDARY</span><h2>{playgroundDatasets.find(d=>d.id===dataset).name} classification</h2></div><span className="nn-live-dot">● LIVE MODEL</span></div>
        <svg className="decision-map" viewBox="0 0 100 100" role="img" aria-label="Classification decision boundary with data points">
          {cells.map((cell,i)=><rect key={i} x={cell.x} y={cell.y} width={100/grid+.2} height={100/grid+.2} fill={cell.value>=.5?"#8b6ee8":"#45b8ad"} opacity={.12+Math.abs(cell.value-.5)*.48}/>)}
          {svgPoints.map(point=><circle key={point.x+"-"+point.y} cx={point.x} cy={point.y} r={point.isTest?1.15:1.35} fill={point.label?"#f6a6d4":"#b9a7ff"} stroke={point.isTest?"#fff":"#211d3b"} strokeWidth={point.isTest ? .35 : .2} opacity={point.isTest ? .65 : 1}/>)}
        </svg>
        <div className="nn-legend"><span><i className="nn-dot-a"/> Class 0</span><span><i className="nn-dot-b"/> Class 1</span><span><i className="nn-dot-test"/> Test examples</span></div>
        <div className="nn-loss-cards"><div><span>TRAIN LOSS</span><b>{trainLoss.toFixed(3)}</b></div><div><span>TEST LOSS</span><b>{testLoss.toFixed(3)}</b></div><div><span>EPOCH</span><b>{epoch}</b></div></div>
        <div className="nn-metrics-strip"><span>Train accuracy <b>{(trainAccuracy*100).toFixed(1)}%</b></span><span>Test accuracy <b>{(testAccuracy*100).toFixed(1)}%</b></span><span>Generalization gap <b>{generalizationGap>=0?"+":""}{generalizationGap.toFixed(3)}</b></span></div>
        <div className="nn-loss-chart"><div className="nn-chart-head"><b>Loss over time</b><span>Lower is better</span></div><svg viewBox="0 0 320 90" role="img" aria-label="Training and test loss chart"><path d="M5 5V78H315" fill="none" stroke="#ffffff30"/>{history.length>1&&<><polyline points={history.map((h,i)=>`${5+i*310/Math.max(1,history.length-1)},${chartY(h.train)}`).join(" ")} fill="none" stroke="#ad91ff" strokeWidth="2.5"/><polyline points={history.map((h,i)=>`${5+i*310/Math.max(1,history.length-1)},${chartY(h.test)}`).join(" ")} fill="none" stroke="#77d9c6" strokeWidth="2.5"/></>}</svg><div className="nn-chart-legend"><span>Training</span><span>Testing</span></div></div>
      </section>
      <aside className="nn-controls-card">
        <div className="nn-card-heading"><div><span className="eyebrow">EXPERIMENT CONTROLS</span><h2>Shape your experiment</h2></div><button className="reset-button" onClick={reset} disabled={running}><RotateCcw size={13}/> Reset</button></div>
        <label className="nn-control"><span>Dataset</span><select value={dataset} disabled={running} onChange={e=>changeDataset(e.target.value)}>{playgroundDatasets.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select><small>{playgroundDatasets.find(d=>d.id===dataset).desc}</small></label>
        <label className="nn-control"><span>Activation function</span><select value={activation} disabled={running} onChange={e=>changeActivation(e.target.value)}>{activationNames.map(a=><option key={a} value={a}>{a}</option>)}</select><small>How hidden neurons transform their signals.</small></label>
        <label className="nn-control"><span>Learning rate <output>{learningRate.toFixed(3)}</output></span><input type="range" min=".01" max="1" step=".01" value={learningRate} disabled={running} onChange={e=>setLearningRate(Number(e.target.value))}/><small>Step size used when updating weights.</small></label>
        <label className="nn-control"><span>Batch size <output>{batchSize}</output></span><input type="range" min="5" max="40" step="5" value={batchSize} disabled={running} onChange={e=>setBatchSize(Number(e.target.value))}/><small>Examples processed before each weight update.</small></label>
        <label className="nn-control"><span>Data noise <output>{noise.toFixed(2)}</output></span><input type="range" min="0" max=".8" step=".05" value={noise} disabled={running} onChange={e=>changeNoise(Number(e.target.value))}/><small>Adds variation to the example positions.</small></label>
        <label className="nn-control"><span>Training data <output>{trainPercent}%</output></span><input type="range" min="50" max="90" step="5" value={trainPercent} disabled={running} onChange={e=>changeTrainPercent(Number(e.target.value))}/><small>A stratified, reproducible sample is held back for testing.</small></label>
        <div className="nn-architecture"><div className="nn-architecture-head"><b>Hidden layers</b><span>{shape.join(" · ")}</span></div>{shape.map((count,index)=><label key={index} className="nn-layer-control"><span>Layer {index+1}</span><select value={count} disabled={running} onChange={e=>changeShape(index,e.target.value)}>{[2,3,4,5,6,8].map(n=><option key={n} value={n}>{n} neurons</option>)}</select></label>)}<div className="nn-layer-actions"><button onClick={addLayer} disabled={shape.length>=3}>+ Add layer</button><button onClick={removeLayer} disabled={shape.length<=1}>Remove layer</button></div></div>
        <div className="nn-train-actions"><button className="btn-primary" onClick={()=>trainOne(1)} disabled={running}><Play size={14}/> Train 1 epoch</button><button className="btn-ghost" onClick={()=>trainOne(10)} disabled={running}>Train 10</button><button className="btn-ghost" onClick={()=>trainOne(100)} disabled={running}><Zap size={14}/> Train 100</button></div>
        <p className="nn-training-status" aria-live="polite">{running ? `Training in progress · epoch ${epoch}` : `Ready · ${epoch} epoch${epoch===1?"":"s"} completed`}</p>
        <p className="nn-local-note"><ShieldCheck size={14}/> Runs locally in your browser. No API key or account needed.</p>
      </aside>
    </div>
    <section className="nn-explain-grid"><article><span>01 · DATASET</span><h3>Examples to learn from</h3><p>Each dot has two input features (X and Y) and a known class. The network sees training examples and tries to learn their pattern.</p></article><article><span>02 · NETWORK</span><h3>Layers find patterns</h3><p>Hidden layers combine signals into useful intermediate features. More neurons can represent more complex boundaries, but are not always better.</p></article><article><span>03 · TRAINING</span><h3>Improve through feedback</h3><p>Backpropagation calculates how weights contributed to an error. Gradient descent nudges those weights to reduce the loss.</p></article></section>
    <div className="nn-reference-note">Educational simulator: a compact fully connected neural network using sigmoid output, selectable hidden activations, stratified reproducible train/test splits, fan-in-aware initialization and mini-batch gradient descent. Accuracy and loss are illustrative evaluation metrics, not production model guarantees.</div>
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
          <LessonDeepDive key={currentLesson.id} lesson={currentLesson}/>
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

    <footer className="footer"><div className="footer-inner"><button className="brand footer-brand" onClick={()=>go("home")}><span className="brand-mark"><BrainCircuit size={21}/></span><span>AI <b>SIMPLIFIED</b><small>MAKE AI MAKE SENSE</small></span></button><p>Making artificial intelligence practical and understandable for students, professionals, creators and developers.</p><div className="footer-bottom"><span>© 2026 AI Simplified v1.3.3 · An open learning project</span><span>Built with curiosity <span className="heart">♥</span> by <a href="https://github.com/quantum-rakhi" target="_blank" rel="noreferrer">Rakhi Thakur</a></span></div></div></footer>
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
