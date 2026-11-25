import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
    ArrowLeft, ArrowRight, ArrowUpRight, BrainCircuit, Sparkles, Compass, Zap, BookOpen,
  Gamepad2, Search, Menu, X, CheckCircle2, CircleHelp, Lightbulb, Target,
  Trophy, ChevronRight, RotateCcw, WandSparkles, Layers3, ShieldCheck,
  Bot, Network, FlaskConical, GraduationCap, Play, Star,
  SlidersHorizontal, GitBranch, Scale, Gauge, Clock3, Download, Upload, RefreshCw
} from "lucide-react";
import "./styles.css";
import "./premium.css";
import "./explore-levels.css";
import { advancedLessons, advancedLessonDeepDive, advancedChapterPractice } from "./advancedLessons";
import { phase2Lessons, phase2LessonDeepDive, phase2ChapterPractice } from "./phase2Lessons";
import { expansionLessons, expansionDeepDive, expansionChapterPractice } from "./expansionLessons";
import { coreCourseDeepDive, coreCourseChapterPractice } from "./coreCourseExpansion";
import { recordChapterCompletion, recordQuizResult, recordAssessmentResult, getProgressSnapshot, subscribeToProgress, exportProgress, importProgress, resetProgress } from "./services/progressStorage";

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

const chapterPractice = {"ai": [{"q": "A photo app groups pictures of the same person without names. Which capability is it demonstrating?", "a": ["File compression", "Pattern recognition", "Manual rule execution", "Internet browsing"], "correct": 1, "explain": "It identifies visual similarities across photos."}, {"q": "A voice assistant converts spoken words into text. Which capability is most directly involved?", "a": ["File sorting", "Disk encryption", "Audio and language perception", "Processor cooling"], "correct": 2, "explain": "It interprets an audio signal and maps it to language."}, {"q": "A navigation app compares routes using traffic and distance. Which combination best describes its work?", "a": ["Random selection", "Manual data entry", "Image generation only", "Search and prediction"], "correct": 3, "explain": "It evaluates routes against constraints and estimates travel conditions."}, {"q": "A bank model flags an unusual payment. What should happen next?", "a": ["Treat the flag as a signal for review", "Assume the model is always correct", "Automatically accuse the customer", "Delete the transaction"], "correct": 0, "explain": "A prediction is not proof. Human review should consider the context."}], "ml": [{"q": "You have 5,000 emails labelled spam or not spam. Which learning approach fits best?", "a": ["Manual clustering", "Reinforcement learning", "Unsupervised learning", "Supervised learning"], "correct": 3, "explain": "The examples already contain target labels."}, {"q": "A retailer wants to discover customer groups but has no group labels. Which approach is suitable?", "a": ["Unsupervised learning", "Reinforcement learning", "Supervised learning", "Text generation"], "correct": 0, "explain": "Clustering finds structure without supplied target labels."}, {"q": "Why keep a test dataset separate until final evaluation?", "a": ["To increase labels", "To estimate performance on unseen data", "To remove all errors", "To make training run faster"], "correct": 1, "explain": "A held-out test set estimates generalisation when it is not used for tuning."}, {"q": "A model scores 99% on training data but 68% on unseen data. What is likely?", "a": ["Perfect generalisation", "Data encryption", "Overfitting", "Tokenisation"], "correct": 2, "explain": "The large gap suggests it fitted training-specific patterns."}], "dl": [{"q": "A neuron multiplies inputs by weights and adds a bias. What happens next?", "a": ["A new dataset is created", "An activation function transforms the result", "The output is always zero", "The inputs are deleted"], "correct": 1, "explain": "The activation function transforms the weighted sum."}, {"q": "Why can multiple hidden layers be useful?", "a": ["They guarantee 100% accuracy", "They make every model explainable", "They can learn layered representations of complex patterns", "They remove the need for data"], "correct": 2, "explain": "Successive layers can build increasingly useful representations."}, {"q": "During training, what does backpropagation calculate?", "a": ["Internet speed", "Database record counts", "The final user interface", "Gradients used to update parameters"], "correct": 3, "explain": "It computes how the loss changes with model parameters."}, {"q": "A deep network performs well on training images but poorly on new images. What should you investigate?", "a": ["Overfitting and data representativeness", "File name length", "Screen brightness", "The network logo"], "correct": 0, "explain": "Poor performance on new examples can indicate overfitting or data mismatch."}], "genai": [{"q": "A tool writes a new product description from a brief. What makes this generative AI?", "a": ["It measures network speed", "It sorts records", "It retrieves an exact saved file", "It creates new content"], "correct": 3, "explain": "Generative AI produces new outputs such as text, images, audio or code."}, {"q": "A text model generates a reply one token at a time. What is it doing at each step?", "a": ["Predicting a likely next token from context", "Selecting a random dictionary page", "Searching every website", "Running a spreadsheet formula"], "correct": 0, "explain": "Autoregressive generation repeatedly predicts the next token from context."}, {"q": "You want a model to describe a photo and answer a question about it. Which capability is useful?", "a": ["Database indexing only", "Multimodal processing", "A compiler", "Text-only formatting"], "correct": 1, "explain": "Multimodal systems work across modalities such as images and text."}, {"q": "An AI-generated image includes a misleading logo. What is the best response?", "a": ["Assume generated images are always accurate", "Remove the original brief", "Review and correct it before publishing", "Publish without checking"], "correct": 2, "explain": "Generated content needs human review for accuracy, rights and brand requirements."}], "llm": [{"q": "What is a token in a language model?", "a": ["A user's password", "A unit of text the model processes", "A database table", "A physical computer chip"], "correct": 1, "explain": "Tokens are chunks of text such as words, word pieces or punctuation."}, {"q": "Why do LLMs need large training corpora?", "a": ["To store a verified answer to every question", "To avoid parameters", "To learn statistical patterns in language from many examples", "To connect to every website"], "correct": 2, "explain": "Large and varied data helps models learn patterns and relationships in language."}, {"q": "An LLM gives a plausible but fabricated citation. What is this?", "a": ["A correct database join", "A network timeout", "A guaranteed fact", "A hallucination"], "correct": 3, "explain": "A hallucination is plausible-sounding generated content that is unsupported or false."}, {"q": "You need an LLM to summarise a long policy document. What should you do?", "a": ["Provide the source text and request a traceable summary", "Remove all context", "Ask it to guess the policy", "Request confidence only"], "correct": 0, "explain": "Grounding the task in source material reduces unsupported additions."}], "prompt": [{"q": "Which prompt is most useful for a specific task?", "a": ["Make it better", "Do the thing", "Tell me something", "Summarise this report for a new manager in five bullets, noting risks and dates"], "correct": 3, "explain": "A strong prompt defines task, audience, output format and constraints."}, {"q": "You want an AI to compare two products fairly. What context should you provide?", "a": ["Products, comparison criteria and source information", "A request to choose the most expensive", "Only the word compare", "No criteria"], "correct": 0, "explain": "Criteria and sources make the comparison focused and auditable."}, {"q": "The first AI response is too long. What is a good next step?", "a": ["Delete the task", "Refine the prompt with a length and format constraint", "Ask an unrelated question", "Assume the model cannot be guided"], "correct": 1, "explain": "Prompt iteration clarifies constraints and improves output."}, {"q": "A prompt asks for current legal information but supplies no jurisdiction or date. What should be improved?", "a": ["Ask for more confident wording", "Request a longer answer only", "Add jurisdiction, relevant dates and request verified sources", "Remove the question"], "correct": 2, "explain": "Jurisdiction and date can materially affect legal information."}]};

// Register the extended curriculum before React renders the lesson catalogue.
lessons.push(...advancedLessons);
Object.assign(lessonDeepDive, advancedLessonDeepDive);
Object.assign(chapterPractice, advancedChapterPractice);

// Phase 2: Python, mathematics and data foundations.
lessons.push(...phase2Lessons);
Object.assign(lessonDeepDive, phase2LessonDeepDive);
Object.assign(chapterPractice, phase2ChapterPractice);

// Expanded roadmap courses (seven new courses; existing course IDs remain unchanged).
lessons.push(...expansionLessons);
Object.assign(lessonDeepDive, expansionDeepDive);
Object.assign(chapterPractice, expansionChapterPractice);
Object.assign(lessonDeepDive, coreCourseDeepDive);
Object.assign(chapterPractice, coreCourseChapterPractice);


function LessonDeepDive({lesson}) {
  const content = lessonDeepDive[lesson.id];
  const [expanded, setExpanded] = useState(0);
  const [completed, setCompleted] = useState([]);
  const [revealed, setRevealed] = useState({});
  const [notes, setNotes] = useState({});
  const [practiceAnswers, setPracticeAnswers] = useState({});
  const shouldScrollToChapter = React.useRef(false);

  const progress = Math.round((completed.length / content.modules.length) * 100);
  const finishChapter = (index) => {
    setCompleted(previous => previous.includes(index) ? previous : [...previous, index]);
    recordChapterCompletion(lesson.id, index, content.modules.length);
  };
  const activeIndex = Math.max(0, Math.min(expanded, content.modules.length - 1));
  const activeModule = content.modules[activeIndex];
  useEffect(() => {
    if (!shouldScrollToChapter.current) return;
    const chapter = document.getElementById(`lesson-chapter-${lesson.id}-${activeIndex}`);
    chapter?.scrollIntoView({ behavior: "smooth", block: "start" });
    shouldScrollToChapter.current = false;
  }, [activeIndex, lesson.id]);
  if (!content) return null;
  const selectChapter = (index) => {
    if (index === activeIndex) {
      document.getElementById(`lesson-chapter-${lesson.id}-${index}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    shouldScrollToChapter.current = true;
    setExpanded(index);
  };
  const goNext = () => selectChapter(Math.min(activeIndex + 1, content.modules.length - 1));
  const goPrevious = () => selectChapter(Math.max(activeIndex - 1, 0));

  return <section className="deep-dive">
    <style>{`
      .deep-dive{margin:42px 0 34px;color:#f5f1ff}
      /* BOOK-STYLE PAGE LAYOUT: use the full available viewport */
      main.section-wrap.page-main.lesson-page{
        width:min(1480px, calc(100% - 64px)) !important;
        max-width:1480px !important;
        margin-left:auto !important;
        margin-right:auto !important;
      }
      .lesson-page .lesson-detail{
        display:grid !important;
        grid-template-columns:minmax(220px,260px) minmax(0,1fr) !important;
        align-items:start !important;
        gap:clamp(22px,3vw,42px) !important;
        width:100% !important;
        max-width:none !important;
      }
      .lesson-page .lesson-aside{
        grid-column:1 !important;
        grid-row:1 !important;
        position:sticky !important;
        top:22px !important;
        width:100% !important;
        max-width:none !important;
        align-self:start !important;
        margin:0 !important;
      }
      .lesson-page .lesson-main{
        grid-column:2 !important;
        grid-row:1 !important;
        width:100% !important;
        max-width:none !important;
        min-width:0 !important;
        padding:clamp(24px,3.4vw,48px) !important;
        border:1px solid rgba(183,160,255,.15) !important;
        border-radius:22px !important;
        background:linear-gradient(145deg,rgba(31,29,53,.96),rgba(22,20,39,.96)) !important;
        box-shadow:0 18px 55px rgba(0,0,0,.16) !important;
      }
      .lesson-page .lesson-main > h1{
        font-size:clamp(34px,4.2vw,52px) !important;
        line-height:1.08 !important;
        letter-spacing:-1.5px !important;
        margin:12px 0 14px !important;
      }
      .lesson-page .lesson-main > .lesson-intro{
        max-width:850px !important;
        font-size:16px !important;
        line-height:1.8 !important;
        color:#c9c1e3 !important;
        margin-bottom:28px !important;
      }
      .lesson-page .definition-card,
      .lesson-page .analogy-card{
        max-width:none !important;
        margin:18px 0 !important;
      }
      .lesson-page .lesson-main > h2{
        margin-top:32px !important;
      }
      .lesson-page .deep-dive{
        width:100% !important;
        max-width:none !important;
        margin:42px 0 28px !important;
      }
      .lesson-page .deep-dive-hero{
        padding:clamp(23px,3vw,36px) !important;
        border-radius:18px !important;
      }
      .lesson-page .deep-dive-roadmap{
        grid-template-columns:repeat(2,minmax(0,1fr)) !important;
      }
      .lesson-page .chapter-card{
        border-radius:13px !important;
        background:rgba(255,255,255,.025) !important;
        margin:14px 0 !important;
      }
      .lesson-page .chapter-card.open{
        background:linear-gradient(120deg,rgba(139,110,232,.10),rgba(255,255,255,.025)) !important;
      }
      .lesson-page .chapter-toggle{
        padding:21px 23px !important;
      }
      .lesson-page .chapter-body{
        max-width:1000px !important;
        padding:4px 28px 28px 75px !important;
        font-size:14px !important;
      }
      .lesson-page .chapter-body > p{
        font-size:15px !important;
        line-height:1.95 !important;
      }
      .lesson-page .concept-item{
        min-height:64px !important;
        font-size:13px !important;
        padding:13px 14px !important;
      }
      .lesson-page .chapter-example,
      .lesson-page .chapter-task{
        padding:18px 19px !important;
      }
      .lesson-page .chapter-example{
        font-size:14px !important;
        line-height:1.8 !important;
      }
      .lesson-page .lesson-aside .path-item{
        width:100% !important;
      }
      @media(max-width:900px){
        main.section-wrap.page-main.lesson-page{
          width:calc(100% - 32px) !important;
        }
        .lesson-page .lesson-detail{
          grid-template-columns:minmax(0,1fr) !important;
          gap:18px !important;
        }
        .lesson-page .lesson-aside{
          position:static !important;
          grid-column:1 !important;
          grid-row:1 !important;
        }
        .lesson-page .lesson-main{
          grid-column:1 !important;
          grid-row:2 !important;
        }
      }
      @media(max-width:560px){
        main.section-wrap.page-main.lesson-page{
          width:calc(100% - 20px) !important;
        }
        .lesson-page .lesson-main{padding:20px 15px !important}
        .lesson-page .deep-dive-roadmap{grid-template-columns:1fr 1fr !important}
        .lesson-page .chapter-body{padding:2px 14px 18px !important}
        .lesson-page .chapter-toggle{padding:14px !important}
      }
      .deep-dive-hero{position:relative;overflow:hidden;padding:25px 26px 22px;border:1px solid rgba(177,151,255,.25);border-radius:20px;background:radial-gradient(circle at 92% 0%,rgba(180,119,255,.20),transparent 34%),linear-gradient(135deg,#24203d,#19172d 72%);margin-bottom:20px}
      .deep-dive-hero:after{content:"";position:absolute;width:170px;height:170px;border:1px solid rgba(196,174,255,.12);border-radius:50%;right:-62px;bottom:-105px;box-shadow:0 0 0 18px rgba(196,174,255,.035),0 0 0 38px rgba(196,174,255,.025)}
      .deep-dive-kicker{display:flex;align-items:center;gap:8px;color:#c6b2ff;font-size:10px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase}
      .deep-dive-hero h2{font-size:clamp(23px,3vw,30px);line-height:1.15;margin:11px 0 8px;letter-spacing:-.6px}
      .deep-dive-hero p{max-width:680px;color:#c7c0df;line-height:1.7;margin:0;font-size:14px}
      .deep-dive-progress{display:flex;align-items:center;gap:13px;margin-top:22px;position:relative;z-index:1}
      .deep-dive-progress-track{height:8px;flex:1;background:#38334d;border-radius:99px;overflow:hidden}
      .deep-dive-progress-fill{height:100%;border-radius:99px;background:linear-gradient(90deg,#8c72ef,#d28ce8);transition:width .25s}
      .deep-dive-progress span{font-size:12px;color:#d9d0f8;font-weight:800;white-space:nowrap}
      .deep-dive-roadmap{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px;margin:0 0 22px}
      .roadmap-step{display:flex;align-items:center;gap:9px;padding:11px 12px;border:1px solid rgba(255,255,255,.09);border-radius:12px;background:rgba(255,255,255,.025);color:#bcb5d5;font-size:11px;min-width:0}
      .roadmap-step span{display:grid;place-items:center;width:25px;height:25px;flex:none;border-radius:8px;background:#30294b;color:#c9b8ff;font-weight:800}
      .roadmap-step strong{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:650}
      .roadmap-step.done{border-color:rgba(119,217,198,.35);background:rgba(119,217,198,.07);color:#d8f5ed}
      .roadmap-step.done span{background:#24564f;color:#9ef0d8}
      .slide-roadmap .roadmap-step{font:inherit;text-align:left;cursor:pointer}
      .slide-roadmap .roadmap-step.current{border-color:rgba(174,145,255,.62);background:rgba(139,110,232,.15);color:#f2eaff}
      .slide-roadmap .roadmap-step:focus-visible,.slide-navigation button:focus-visible{outline:2px solid #bca6ff;outline-offset:3px}
      .lesson-slide{display:flex;flex-direction:column;min-height:560px}
      .slide-heading{display:flex;align-items:center;gap:13px;padding:22px 23px 0}
      .slide-navigation{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:17px 22px 21px;border-top:1px solid rgba(255,255,255,.08);margin-top:auto}
      .slide-navigation>span{font-size:11px;color:#a9a1c5;font-weight:750;white-space:nowrap}
      .slide-navigation button:disabled{opacity:.35;cursor:not-allowed}
      .slide-prev-icon{transform:rotate(180deg)}
      .lesson-slide .chapter-body{flex:1;padding-top:15px}
      @media(max-width:560px){.lesson-slide{min-height:0}.slide-heading{padding:16px 14px 0}.slide-navigation{padding:14px;flex-wrap:wrap}.slide-navigation>span{order:3;width:100%;text-align:center}}
      .learning-outcome{display:flex;gap:13px;align-items:flex-start;border:1px solid rgba(166,139,250,.25);background:linear-gradient(110deg,rgba(139,110,232,.13),rgba(139,110,232,.045));padding:17px 19px;border-radius:15px;margin:0 0 22px;color:#ddd5ff;line-height:1.65;font-size:13px}
      .outcome-icon{width:34px;height:34px;display:grid;place-items:center;border-radius:10px;background:#30284f;color:#cdbbff;flex:none}
      .learning-outcome b{display:block;color:#c4adff;font-size:10px;letter-spacing:1.2px;margin-bottom:4px}
      .chapter-practice{margin:22px 0 4px;padding:20px;border:1px solid rgba(158,133,245,.28);border-radius:15px;background:linear-gradient(135deg,rgba(104,79,171,.13),rgba(255,255,255,.025))}
      .chapter-practice h4{font-size:15px;line-height:1.6;margin:8px 0 14px;color:#f6f2ff}
      .practice-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
      .practice-option{display:flex;align-items:center;gap:10px;text-align:left;padding:12px;border:1px solid rgba(255,255,255,.11);border-radius:11px;background:rgba(255,255,255,.035);color:#ddd7ef;cursor:pointer;font:inherit;font-size:12px;line-height:1.5;transition:.18s}
      .practice-option>span{display:grid;place-items:center;width:25px;height:25px;flex:none;border-radius:8px;background:#30294b;color:#cbbaff;font-size:11px;font-weight:800}
      .practice-option:hover:not(:disabled){border-color:#a58af5;background:rgba(155,127,240,.12)}
      .practice-option.correct{border-color:rgba(105,210,174,.55);background:rgba(73,169,145,.12);color:#c9f5e6}
      .practice-option.incorrect{border-color:rgba(241,125,151,.45);background:rgba(241,125,151,.08)}
      .practice-feedback{margin-top:13px;padding:13px 15px;border-radius:10px;background:rgba(255,255,255,.045);color:#d8d0ea;font-size:12px;line-height:1.7}
      .practice-feedback b{color:#c9b8ff}.practice-feedback p{margin:5px 0 9px}
      @media(max-width:560px){.practice-options{grid-template-columns:1fr}.chapter-practice{padding:15px}}
      .chapter-card{position:relative;border:1px solid rgba(255,255,255,.10);background:linear-gradient(120deg,rgba(255,255,255,.045),rgba(255,255,255,.018));border-radius:16px;margin:12px 0;overflow:hidden;transition:border-color .2s,background .2s}
      .chapter-card.open{border-color:rgba(174,145,255,.45);background:linear-gradient(120deg,rgba(139,110,232,.105),rgba(255,255,255,.025))}
      .chapter-card.is-done{border-color:rgba(119,217,198,.28)}
      .chapter-toggle{width:100%;display:flex;align-items:center;gap:13px;text-align:left;padding:17px 19px;background:transparent;border:0;color:#f5f1ff;cursor:pointer}
      .chapter-number{width:38px;height:38px;border-radius:11px;background:linear-gradient(145deg,#3b315d,#29233f);color:#d0beff;display:grid;place-items:center;font-size:12px;font-weight:850;flex:none}
      .chapter-card.is-done .chapter-number{background:linear-gradient(145deg,#24665c,#20483f);color:#a9f1dc}
      .chapter-title-wrap{flex:1;min-width:0}.chapter-title-wrap strong{display:block;font-size:15px;line-height:1.35}.chapter-title-wrap small{display:block;color:#9e96bd;font-size:10px;margin-top:4px;letter-spacing:.35px}
      .chapter-status{font-size:10px;font-weight:750;color:#9fe5d1;background:rgba(73,169,145,.13);border:1px solid rgba(119,217,198,.2);padding:5px 8px;border-radius:99px;white-space:nowrap}
      .chapter-toggle .chapter-chevron{color:#b7a4f4;transition:transform .2s;flex:none}.chapter-toggle[aria-expanded="true"] .chapter-chevron{transform:rotate(90deg)}
      .chapter-body{padding:1px 22px 22px 70px;color:#c9c3df;line-height:1.75;font-size:13px}.chapter-body>p{margin:0 0 17px;font-size:14px;line-height:1.8;color:#ded8ee}
      .chapter-section-label{display:flex;align-items:center;gap:7px;color:#cbb9ff;font-size:10px;font-weight:850;letter-spacing:1.15px;text-transform:uppercase;margin:18px 0 9px}
      .chapter-concepts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:0 0 17px}
      .concept-item{display:flex;gap:9px;align-items:flex-start;padding:10px 11px;border-radius:11px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.06);color:#cfc9e3;font-size:12px;line-height:1.55}
      .concept-item svg{color:#b49aff;flex:none;margin-top:2px}
      .chapter-example{position:relative;background:linear-gradient(110deg,rgba(65,158,139,.13),rgba(65,158,139,.045));border:1px solid rgba(119,217,198,.17);border-left:3px solid #77d9c6;border-radius:0 12px 12px 0;padding:14px 15px;margin:16px 0;color:#d2e9e3;line-height:1.7}
      .chapter-example b{display:flex;align-items:center;gap:7px;color:#8fe2cd;font-size:10px;letter-spacing:1.1px;margin-bottom:5px}
      .chapter-task{background:linear-gradient(110deg,rgba(173,145,255,.12),rgba(173,145,255,.045));border:1px solid rgba(173,145,255,.22);padding:15px 16px;border-radius:13px;margin-top:16px}
      .chapter-task b{display:flex;align-items:center;gap:7px;color:#cbb8ff;font-size:10px;letter-spacing:1.1px;margin-bottom:7px}
      .chapter-task p{margin:0;color:#e0daf1;line-height:1.65}
      .reflection-input{width:100%;min-height:76px;resize:vertical;background:#171529;border:1px solid rgba(187,164,255,.2);border-radius:10px;color:#eee9ff;padding:11px 12px;font:inherit;font-size:12px;line-height:1.6;margin-top:12px;outline:none}
      .reflection-input:focus{border-color:#a88bf4;box-shadow:0 0 0 3px rgba(168,139,244,.1)}
      .chapter-actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:12px}
      .chapter-action-btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:9px 12px;border-radius:9px;border:1px solid rgba(184,160,255,.28);background:rgba(157,126,241,.12);color:#d9ccff;font-size:11px;font-weight:750;cursor:pointer}
      .chapter-action-btn.primary{background:linear-gradient(100deg,#8065dc,#a879df);border-color:transparent;color:white}
      .chapter-action-btn:disabled{opacity:.45;cursor:not-allowed}
      .chapter-answer{margin-top:11px;padding:11px 12px;border-radius:10px;background:rgba(255,255,255,.045);color:#d9d2f2;font-size:12px;line-height:1.65}
      .lesson-end-check{position:relative;overflow:hidden;padding:21px;border-radius:16px;background:radial-gradient(circle at 100% 0%,rgba(176,136,255,.16),transparent 36%),#211e38;border:1px solid rgba(255,255,255,.11);margin:25px 0}
      .lesson-end-check h3{margin:0 0 7px;font-size:17px}.lesson-end-check p{color:#c5bfdc;line-height:1.7;margin:0;font-size:13px}
      .lesson-end-check .finish-stat{display:flex;align-items:center;gap:8px;margin-top:13px;color:#b8efdF;font-size:11px;font-weight:700}
      @media(max-width:760px){.deep-dive-roadmap{grid-template-columns:repeat(2,minmax(0,1fr))}.chapter-concepts{grid-template-columns:1fr}.chapter-body{padding:0 15px 18px}.chapter-toggle{padding:14px}.chapter-title-wrap strong{font-size:14px}.chapter-status{display:none}.deep-dive-hero{padding:20px}.learning-outcome{padding:14px}}
    `}</style>

    <div className="deep-dive-hero">
      <div className="deep-dive-kicker"><Sparkles size={14}/> INTERACTIVE LEARNING PATH <span>·</span> {content.modules.length} CHAPTERS</div>
      <h2>Go from curious to confident.</h2>
      <p>Explore the concepts, connect them to real situations, and test your understanding as you go. No memorising required — learn by doing.</p>
      <div className="deep-dive-progress">
        <div className="deep-dive-progress-track"><div className="deep-dive-progress-fill" style={{width:`${progress}%`}}/></div>
        <span>{completed.length}/{content.modules.length} completed · {progress}%</span>
      </div>
    </div>

    <div className="lesson-workspace">
      <aside className="lesson-chapter-sidebar">
        <div className="chapter-sidebar-heading">
          <span>COURSE CONTENT</span>
          <strong>{content.modules.length} chapters</strong>
        </div>
        <div className="deep-dive-roadmap slide-roadmap" aria-label="Lesson chapters">
      {content.modules.map((module,index)=><button type="button" key={module.title} onClick={()=>selectChapter(index)} aria-current={activeIndex===index?"step":undefined} className={`roadmap-step ${completed.includes(index)?"done":""} ${activeIndex===index?"current":""}`}>
        <span>{completed.includes(index)?<CheckCircle2 size={14}/>:String(index+1).padStart(2,"0")}</span>
        <strong>{module.title}</strong>
      </button>)}
    </div>
      </aside>
      <div className="lesson-active-content">
        <div className="learning-outcome">
      <span className="outcome-icon"><Target size={18}/></span>
      <div><b>YOUR LEARNING GOAL</b>{content.outcome}</div>
    </div>
        <article id={`lesson-chapter-${lesson.id}-${activeIndex}`} className={`chapter-card lesson-slide open ${completed.includes(activeIndex)?"is-done":""}`} key={activeModule.title} aria-live="polite" style={{ scrollMarginTop: "128px" }}>
      <div className="slide-heading">
        <span className="chapter-number">{completed.includes(activeIndex)?<CheckCircle2 size={19}/>:String(activeIndex+1).padStart(2,"0")}</span>
        <span className="chapter-title-wrap"><strong>{activeModule.title}</strong><small>CHAPTER {activeIndex+1} OF {content.modules.length} · CONCEPT EXPLAINER · EXAMPLE · PRACTICE</small></span>
        {completed.includes(activeIndex)&&<span className="chapter-status">COMPLETED</span>}
      </div>
      <div className="chapter-body">
        <p>{activeModule.explain}</p>
        <div className="chapter-section-label"><BookOpen size={13}/> The important ideas</div>
        <div className="chapter-concepts">{activeModule.bullets.map(item=><div className="concept-item" key={item}><CheckCircle2 size={14}/><span>{item}</span></div>)}</div>
        <div className="chapter-example"><b><Lightbulb size={13}/> SEE IT IN THE REAL WORLD</b>{activeModule.example}</div>
        <div className="chapter-task">
          <b><Target size={13}/> YOUR TURN · THINK IT THROUGH</b>
          <p>{activeModule.task}</p>
          <textarea className="reflection-input" value={notes[activeIndex]||""} onChange={event=>setNotes(previous=>({...previous,[activeIndex]:event.target.value}))} placeholder="Write your answer or an example in your own words…"/>
          <div className="chapter-actions">
            <button className="chapter-action-btn" onClick={()=>setRevealed(previous=>({...previous,[activeIndex]:!previous[activeIndex]}))}><Lightbulb size={13}/>{revealed[activeIndex]?"Hide learning hint":"Show learning hint"}</button>
            <button className="chapter-action-btn primary" onClick={()=>finishChapter(activeIndex)} disabled={completed.includes(activeIndex)}><CheckCircle2 size={14}/>{completed.includes(activeIndex)?"Chapter completed":"Mark chapter complete"}</button>
          </div>
          {revealed[activeIndex]&&<div className="chapter-answer"><b>How to approach it:</b> Identify the input, the task the system is performing, what a correct result would look like, and what could go wrong. There may be several valid answers — explain your reasoning rather than memorising a definition.</div>}
        </div>
        {chapterPractice[lesson.id]?.[activeIndex]&&<div className="chapter-practice">
          <div className="chapter-section-label"><FlaskConical size={14}/> INTERACTIVE PRACTICE · CHECK YOUR UNDERSTANDING</div>
          <h4>{chapterPractice[lesson.id][activeIndex].q}</h4>
          <div className="practice-options">{chapterPractice[lesson.id][activeIndex].a.map((option,optionIndex)=>{
            const answerKey=`${lesson.id}-${activeIndex}`;
            const chosen=practiceAnswers[answerKey];
            const locked=chosen!==undefined;
            const correct=chapterPractice[lesson.id][activeIndex].correct;
            return <button key={option} disabled={locked} onClick={()=>setPracticeAnswers(prev=>({...prev,[answerKey]:optionIndex}))} className={`practice-option ${locked&&optionIndex===correct?"correct":""} ${locked&&chosen===optionIndex&&chosen!==correct?"incorrect":""}`}>
              <span>{String.fromCharCode(65+optionIndex)}</span>{option}{locked&&optionIndex===correct&&<CheckCircle2 size={16}/>}
            </button>;
          })}</div>
          {practiceAnswers[`${lesson.id}-${activeIndex}`]!==undefined&&<div className="practice-feedback">
            <b>{practiceAnswers[`${lesson.id}-${activeIndex}`]===chapterPractice[lesson.id][activeIndex].correct?"Correct — nicely reasoned!":"Not quite. Review the explanation:"}</b>
            <p>{chapterPractice[lesson.id][activeIndex].explain}</p>
            <button className="chapter-action-btn" onClick={()=>setPracticeAnswers(prev=>({...prev,[`${lesson.id}-${activeIndex}`]:undefined}))}><RotateCcw size={13}/> Try again</button>
          </div>}
        </div>}
      </div>
      <div className="slide-navigation">
        <button className="chapter-action-btn" onClick={goPrevious} disabled={activeIndex===0}><ChevronRight size={14} className="slide-prev-icon"/> Previous</button>
        <span>SLIDE {activeIndex+1} / {content.modules.length}</span>
        {activeIndex<content.modules.length-1
          ? <button className="chapter-action-btn primary" onClick={goNext}>Next chapter <ArrowRight size={14}/></button>
          : <button className="chapter-action-btn primary" onClick={()=>finishChapter(activeIndex)}><CheckCircle2 size={14}/> Finish lesson</button>}
      </div>
    </article>
      </div>
    </div>

    <div className="lesson-end-check">
      <div className="deep-dive-kicker"><Trophy size={14}/> YOUR PROGRESS</div>
      <h3>{progress===100?"Excellent work — lesson complete!":"You're building real understanding."}</h3>
      <p>{progress===100?"You've marked every chapter complete. Move on to the lesson quiz to check what you can recall and apply.":`You've completed ${completed.length} of ${content.modules.length} chapters. Mark each chapter complete as you work through it; your progress updates here.`}</p>
      <div className="finish-stat"><CheckCircle2 size={15}/> {completed.length} of {content.modules.length} chapters completed</div>
    </div>
  </section>;
}

const quiz = [
  { topic:"AI", q:"Which statement best describes Artificial Intelligence?", a:["A computer always connected to the internet", "A database storing every answer", "Systems designed to perform tasks associated with human intelligence", "A faster processor"], correct:2, explain:"AI systems perform tasks such as recognising patterns, understanding language and making predictions." },
  { topic:"AI", q:"An AI system flags a payment as unusual. What does this mean?", a:["The model made a legal decision", "The customer must be blocked permanently", "The payment may deserve further review", "The payment is proven fraudulent"], correct:2, explain:"A model output is a signal, not proof. High-impact decisions need review." },
  { topic:"AI", q:"Which is a limitation of AI systems?", a:["They can make errors when data is incomplete or unrepresentative", "They cannot process images", "They understand context exactly like humans", "They never use patterns"], correct:0, explain:"Performance depends on data, task design and evaluation." },
  { topic:"Machine Learning", q:"Machine Learning is best described as\u2026", a:["A programming language", "A subset of AI that learns patterns from data", "A hardware component", "Another name for a database"], correct:1, explain:"Machine Learning uses data and algorithms to adjust model parameters." },
  { topic:"Machine Learning", q:"You have customer records with no group labels and want to discover groups. Which approach fits?", a:["Unsupervised clustering", "Text generation", "Supervised classification", "Reinforcement learning"], correct:0, explain:"Clustering discovers structure without supplied target labels." },
  { topic:"Machine Learning", q:"A model performs well on training data but poorly on unseen data. What is this?", a:["Data compression", "Multimodal learning", "Tokenisation", "Overfitting"], correct:3, explain:"Overfitting means fitting training-specific details and generalising poorly." },
  { topic:"Deep Learning", q:"What is the role of a weight in an artificial neuron?", a:["It controls how strongly an input influences the weighted sum", "It selects the user interface", "It stores the complete dataset", "It guarantees a correct prediction"], correct:0, explain:"Weights scale inputs and are adjusted during training." },
  { topic:"Deep Learning", q:"What does an epoch represent in neural-network training?", a:["A single prediction", "One pass through the training dataset", "The time to install software", "One neuron in a hidden layer"], correct:1, explain:"An epoch is one complete pass through the training dataset." },
  { topic:"Deep Learning", q:"What does backpropagation help calculate?", a:["The number of users online", "A list of training labels", "Gradients for updating network parameters", "Screen resolution"], correct:2, explain:"Backpropagation computes gradients of loss with respect to parameters." },
  { topic:"Generative AI", q:"What is a defining capability of Generative AI?", a:["Guaranteeing every output is true", "Only copying a database row", "Only sorting files", "Creating new content such as text, images, audio or code"], correct:3, explain:"Generative AI produces new outputs from learned patterns and supplied context." },
  { topic:"Generative AI", q:"A model creates an image from a written description. What is the description called?", a:["A prompt", "A gradient", "A label", "An epoch"], correct:0, explain:"The prompt is the instruction or context guiding the model output." },
  { topic:"LLMs", q:"What do LLMs primarily learn from large text datasets?", a:["Human consciousness", "Statistical patterns and relationships in language", "The identity of every user", "A verified answer to every possible question"], correct:1, explain:"LLMs learn patterns in token sequences; fluent output is not guaranteed fact." },
  { topic:"LLMs", q:"Why can an LLM produce a fabricated citation?", a:["It checks every source live", "It refuses to predict tokens", "It can generate plausible but unsupported details", "It has perfect factual memory"], correct:2, explain:"Language generation can produce plausible but unsupported content." },
  { topic:"Prompt Engineering", q:"Which prompt is likely to produce a useful answer?", a:["Write something interesting", "Give me everything", "Explain stuff", "Explain photosynthesis to a 10-year-old in four bullets with one example"], correct:3, explain:"A clear prompt specifies task, audience, format and constraints." },
  { topic:"Prompt Engineering", q:"An AI response must use only an attached policy. Which instruction helps?", a:["Use only the supplied policy; quote the relevant section and flag missing information", "Do not mention uncertainty", "Fill gaps using guesses", "Make the answer sound confident"], correct:0, explain:"Source constraints and explicit handling of missing information reduce unsupported additions." }
];

const assessmentBanks = {"Beginner": {"minutes": 10, "questions": [{"topic": "AI", "q": "Which task is a common use of AI?", "a": ["Charging a battery", "Recognising objects in images", "Formatting a USB drive", "Increasing screen brightness"], "correct": 1, "explain": "AI can identify patterns in images and classify objects."}, {"topic": "Machine Learning", "q": "What does supervised learning use?", "a": ["Only random numbers", "Rewards from a game only", "Examples with known labels", "No data at all"], "correct": 2, "explain": "Supervised learning trains on examples paired with known target labels."}, {"topic": "Deep Learning", "q": "What is an artificial neuron?", "a": ["A type of monitor", "A database table", "A physical brain cell inside a computer", "A unit that combines inputs using weights and a bias"], "correct": 3, "explain": "An artificial neuron calculates a weighted sum and applies an activation function."}, {"topic": "Generative AI", "q": "Which output can Generative AI create?", "a": ["A new image from a text prompt", "Only a network cable", "Only a printed spreadsheet", "A computer processor"], "correct": 0, "explain": "Generative AI can create text, images, audio, video and code."}, {"topic": "LLMs", "q": "What does LLM stand for?", "a": ["Linked Learning Module", "Large Language Model", "Low Latency Memory", "Long Logic Machine"], "correct": 1, "explain": "LLM stands for Large Language Model."}, {"topic": "Prompt Engineering", "q": "Which prompt gives the clearest instruction?", "a": ["Tell me about things", "Write anything", "Explain gravity to a 10-year-old in three bullet points", "Do it"], "correct": 2, "explain": "A good prompt gives a task, audience and output format."}]}, "Intermediate": {"minutes": 8, "questions": [{"topic": "AI", "q": "A medical-image model highlights a possible abnormality. What is the appropriate use?", "a": ["Ignore patient history", "Support a qualified clinician's review", "Treat the prediction as certain", "Replace diagnosis automatically"], "correct": 1, "explain": "The model can support decision-making, but qualified professionals must interpret it in context."}, {"topic": "Machine Learning", "q": "A dataset has 2% fraud cases. Why might accuracy be misleading?", "a": ["Accuracy always equals recall", "Fraud is a regression target", "A model can predict 'not fraud' for nearly all cases and still score highly", "The dataset has too many columns"], "correct": 2, "explain": "With severe class imbalance, accuracy can hide poor detection of the minority class."}, {"topic": "Machine Learning", "q": "Which data split should be reserved for final unbiased evaluation?", "a": ["Production cache", "Feature set", "Training set", "Test set"], "correct": 3, "explain": "The test set should remain separate from model selection and tuning."}, {"topic": "Deep Learning", "q": "What does backpropagation calculate?", "a": ["Gradients of the loss with respect to model parameters", "The total number of records", "The number of hidden layers", "The model's file size"], "correct": 0, "explain": "Backpropagation computes gradients that an optimiser uses to update weights."}, {"topic": "Generative AI", "q": "A generated answer includes a made-up statistic. What should you do?", "a": ["Repeat it without checking", "Verify it against a reliable source before use", "Remove all citations", "Assume fluent writing means accuracy"], "correct": 1, "explain": "Generated outputs can contain hallucinations and need fact-checking."}, {"topic": "LLMs", "q": "Why can a very long prompt exceed a model's context window?", "a": ["The model has no vocabulary", "The file is not a PDF", "The prompt and response require more tokens than the model can handle at once", "The internet is disconnected"], "correct": 2, "explain": "A context window limits how many tokens can be processed in one interaction."}]}, "Advanced": {"minutes": 6, "questions": [{"topic": "AI", "q": "A model's error rate rises after deployment as customer behaviour changes. What is the likely concern?", "a": ["Image resolution", "Data or concept drift", "Prompt formatting", "Tokenisation failure"], "correct": 1, "explain": "Drift occurs when input distributions or relationships change, degrading model performance."}, {"topic": "Machine Learning", "q": "A feature includes information recorded only after the outcome occurred. What risk does this create?", "a": ["Regularisation", "Batch normalisation", "Data leakage", "Clustering"], "correct": 2, "explain": "Leakage lets the model use information unavailable at prediction time, inflating evaluation results."}, {"topic": "Machine Learning", "q": "For a high-recall fraud-screening system, which trade-off may increase?", "a": ["No need for labels", "Guaranteed perfect precision", "Fewer flagged cases in every scenario", "More false positives"], "correct": 3, "explain": "Increasing recall can catch more actual fraud but may also flag more legitimate transactions."}, {"topic": "Deep Learning", "q": "Why can a deep network suffer vanishing gradients?", "a": ["Gradients can shrink as they propagate through many layers", "The GPU has no display", "The model has too many labels", "The dataset is sorted alphabetically"], "correct": 0, "explain": "Repeated derivatives smaller than one can cause gradients to diminish in early layers."}, {"topic": "Generative AI", "q": "What is retrieval-augmented generation (RAG) designed to do?", "a": ["Guarantee every generated answer is correct", "Retrieve relevant external knowledge and provide it as context to generation", "Train a model without data", "Replace the language model with a database"], "correct": 1, "explain": "RAG grounds generation in retrieved material, though the retrieved sources and answer still need evaluation."}, {"topic": "LLMs", "q": "Why is temperature usually lowered for deterministic extraction tasks?", "a": ["To increase image resolution", "To train new model weights", "To reduce variation in token sampling", "To expand the context window"], "correct": 2, "explain": "Lower temperature generally makes sampling less varied, which can help structured extraction tasks."}]}};

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



function AgentTutorial() {
  const [completed,setCompleted] = useState([]);
  const [current,setCurrent] = useState(0);
  const [copyStatus,setCopyStatus] = useState("idle");
  const copyCurrentCode = async () => {
    if (!step?.code) return;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(step.code);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = step.code;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        const copied = document.execCommand("copy");
        document.body.removeChild(textarea);
        if (!copied) throw new Error("Copy command was not available");
      }
      setCopyStatus("copied");
      window.setTimeout(() => setCopyStatus("idle"), 1800);
    } catch (error) {
      setCopyStatus("failed");
      window.setTimeout(() => setCopyStatus("idle"), 2200);
    }
  };
  const steps = [
    {title:"Understand the architecture",tag:"FOUNDATION",time:"3 min",body:"Your React website is the learning interface. The Python Gemini ADK agent runs separately on your computer. The browser will call a backend API later; never place a Gemini key in frontend code.",code:"React website  →  Python ADK agent  →  Gemini model",tip:"Think of the agent as the engine and the website as its control panel."},
    {title:"Install Python",tag:"ENVIRONMENT",time:"5 min",body:"On Windows, install Python 3.11 or later. Open PowerShell and check that the Python launcher is available.",code:"py --version",tip:"If Windows says the command is not recognised, install Python and enable the Python Launcher."},
    {title:"Get a Gemini API key",tag:"ACCESS",time:"5 min",body:"Create a key in Google AI Studio. Use only the free tier and check the current model availability, quota and data-use terms before sending prompts. Do not commit your key to GitHub.",link:"https://aistudio.google.com/apikey",tip:"Keep this key private. You will store it in a local .env file, never in React code."},
    {title:"Download the AI Simplified project",tag:"PROJECT",time:"3 min",body:"Clone the existing repository and move into the agent backend folder.",code:"git clone https://github.com/quantum-rakhi/ai-simplified.git\ncd ai-simplified\\agent-backend",tip:"Run these commands in PowerShell from the folder where you want the project."},
    {title:"Create and activate a virtual environment",tag:"ENVIRONMENT",time:"3 min",body:"A virtual environment keeps the agent's Python packages separate from other projects.",code:"py -3.11 -m venv .venv\n.\\.venv\\Scripts\\Activate.ps1",tip:"When activation works, your terminal prompt normally shows (.venv)."},
    {title:"Install Google ADK",tag:"DEPENDENCIES",time:"3 min",body:"Install the dependencies listed in the agent backend requirements file.",code:"python -m pip install --upgrade pip\npip install -r requirements.txt",tip:"Keep the virtual environment activated while installing and running the agent."},
    {title:"Configure your API key",tag:"CONFIGURATION",time:"3 min",body:"Create a local .env file by copying .env.example. Add your key to GOOGLE_API_KEY. The .env file is ignored by Git; never paste the key into this website or a public repository.",code:"Copy-Item .env.example .env\nnotepad .env",tip:"Replace the example value after GOOGLE_API_KEY= with your real key. Do not share the file."},
    {title:"Start the agent locally",tag:"RUN",time:"2 min",body:"Run the ADK development interface from the agent-backend directory. Open the local address in your browser and select ai_simplified_agent.",code:"adk web --port 8000",tip:"Leave this terminal window running while you use the local agent interface."},
    {title:"Test the learning tools",tag:"VALIDATION",time:"5 min",body:"Try these prompts. The agent can search the course catalogue, return a learning path and prepare a practice plan.",code:"Find beginner courses about Python.\nShow me the intermediate AI learning path.\nCreate a 5-question quiz about RAG.",tip:"Check that each response is relevant and grounded in the AI Simplified course catalogue."},
    {title:"Connect the agent to the website",tag:"NEXT MILESTONE",time:"Next phase",body:"After local testing, we will add a small FastAPI service and a React chat panel. During local development, run both services on your computer. Public hosting is a separate step and must be checked for a genuinely free option.",tip:"This milestone comes after the local agent works reliably."}
  ];
  const step = steps[current];
  const toggleDone = (i) => setCompleted(prev=>prev.includes(i)?prev.filter(x=>x!==i):[...prev,i]);
  const goTo = (i) => { setCurrent(Math.max(0,Math.min(steps.length-1,i))); setCopyStatus("idle"); };
  return <main className="agent-workbench">
    <section className="agent-workbench-hero">
      <div className="agent-hero-top"><span className="agent-live-label"><i/> ZERO-COST BUILD WORKSPACE</span><span className="agent-hero-index">PROJECT 01 / AI SIMPLIFIED</span></div>
      <div className="agent-hero-main"><div><div className="agent-kicker">YOUR FIRST AI BUILD</div><h1>Build an agent.<br/><em>Make it useful.</em></h1><p>Create a Python learning agent with Google ADK and Gemini — then bring it into AI Simplified. One practical milestone at a time.</p><div className="agent-hero-tags"><span><Bot size={14}/> Google ADK</span><span>Python 3.11+</span><span>Local-first · Free tier</span></div></div><div className="agent-hero-art"><div className="agent-hero-ring ring-one"/><div className="agent-hero-ring ring-two"/><div className="agent-hero-core"><Bot size={54}/><small>AI AGENT</small></div><span className="agent-float-chip chip-a">TOOLS</span><span className="agent-float-chip chip-b">GEMINI</span><span className="agent-float-chip chip-c">ADK</span></div></div>
      <div className="agent-hero-bottom"><div><strong>10</strong><span>BUILD STEPS</span></div><div><strong>~35 min</strong><span>INITIAL SETUP</span></div><div><strong>₹0</strong><span>LOCAL DEVELOPMENT</span></div><div className="agent-hero-progress"><div className="agent-hero-progress-label"><span>YOUR BUILD PROGRESS</span><b>{completed.length*10}%</b></div><div className="agent-hero-progress-track"><i style={{width:(completed.length/steps.length*100)+"%"}}/></div></div></div>
    </section>
    <div className="agent-workbench-heading"><div><span className="agent-kicker">THE BUILD SEQUENCE</span><h2>From zero to your first agent</h2><p>Choose a milestone. Follow the instructions. Mark it complete when it works.</p></div><span className="agent-workbench-status">{completed.length} / 10 COMPLETE</span></div>
    <section className="agent-workbench-grid">
      <aside className="agent-rail"><div className="agent-rail-title">BUILD ROADMAP <span>01—10</span></div>{steps.map((s,i)=><button key={s.title} className={"agent-rail-item "+(current===i?"selected ":"")+(completed.includes(i)?"is-done":"")} onClick={()=>goTo(i)}><span className="agent-rail-num">{completed.includes(i)?<CheckCircle2 size={16}/>:String(i+1).padStart(2,"0")}</span><span className="agent-rail-copy"><b>{s.title}</b><small>{s.time}</small></span><ChevronRight size={15}/></button>)}<div className="agent-rail-foot"><ShieldCheck size={16}/><span>Private key stays on your machine.</span></div></aside>
      <article className="agent-focus-panel"><div className="agent-focus-top"><span className="agent-focus-tag">{step.tag}</span><span className="agent-focus-time">{step.time}</span></div><div className="agent-focus-number">STEP {String(current+1).padStart(2,"0")} <span> / 10</span></div><h3>{step.title}</h3><p className="agent-focus-body">{step.body}</p>{step.code&&<div className="agent-command-panel"><div className="agent-command-head"><span><i/> POWERSHELL / COMMAND</span><button onClick={copyCurrentCode} aria-live="polite">{copyStatus==="copied"?"COPIED ✓":copyStatus==="failed"?"COPY FAILED":"COPY ↗"}</button></div><pre>{step.code}</pre></div>}{step.link&&<a className="agent-resource-link" href={step.link} target="_blank" rel="noreferrer">Open Google AI Studio <ArrowUpRight size={15}/></a>}{step.tip&&<div className="agent-pro-tip"><span>FIELD NOTE</span><p>{step.tip}</p></div>}<div className="agent-focus-actions"><button className={"agent-complete-btn "+(completed.includes(current)?"completed":"")} onClick={()=>toggleDone(current)}>{completed.includes(current)?<><CheckCircle2 size={16}/> COMPLETED — UNDO</>:<>MARK MILESTONE COMPLETE <CheckCircle2 size={16}/></>}</button><div className="agent-step-nav"><button disabled={current===0} onClick={()=>goTo(current-1)}>BACK</button><button onClick={()=>goTo(current+1)} disabled={current===steps.length-1}>NEXT MILESTONE <ChevronRight size={15}/></button></div></div></article>
    </section>
    <section className="agent-safety-strip"><ShieldCheck size={20}/><div><b>Built to stay free. Designed to stay safe.</b><p>Use the Gemini API free tier only where available. Quotas and terms can change. Do not add billing, publish API keys or send confidential information. Local development does not require paid hosting.</p></div><div className="agent-reference-links"><a href="https://github.com/quantum-rakhi/ai-simplified/tree/main/agent-backend" target="_blank" rel="noreferrer">SOURCE CODE <ArrowUpRight size={13}/></a><a href="https://google.github.io/adk-docs/" target="_blank" rel="noreferrer">ADK DOCS <ArrowUpRight size={13}/></a></div></section>
  </main>;
}

function App() {
  const [active, setActive] = useState("home");
  const [selectedLesson, setSelectedLesson] = useState("ai");
  const [query, setQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("All");
  const [menuOpen, setMenuOpen] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizDone, setQuizDone] = useState(false);
  const [promptMode, setPromptMode] = useState(1);
  const [demoCount, setDemoCount] = useState(0);
  const [demoGuess, setDemoGuess] = useState("");
  const [demoScore, setDemoScore] = useState(0);
  const [demoAnswered, setDemoAnswered] = useState(false);
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
  const [assessmentLevel,setAssessmentLevel] = useState("Beginner");
  const [assessmentStarted,setAssessmentStarted] = useState(false);
  const [assessmentIndex,setAssessmentIndex] = useState(0);
  const [assessmentAnswers,setAssessmentAnswers] = useState({});
  const [assessmentSeconds,setAssessmentSeconds] = useState(600);
  const [assessmentFinished,setAssessmentFinished] = useState(false);
  const [assessmentHistory,setAssessmentHistory] = useState([]);
  const [assessmentSaved,setAssessmentSaved] = useState(false);


  const completed = useMemo(() => Object.keys(answers).length, [answers]);
  const score = quiz.reduce((n, q, i) => n + (answers[i] === q.correct ? 1 : 0), 0);
  const currentAssessment = assessmentBanks[assessmentLevel];
  const assessmentScore = currentAssessment.questions.reduce((total,q,i)=>total+(assessmentAnswers[i]===q.correct?1:0),0);
  const assessmentTopics = ["AI","Machine Learning","Deep Learning","Generative AI","LLMs","Prompt Engineering"];
  const formatTime = seconds => `${Math.floor(seconds/60).toString().padStart(2,"0")}:${(seconds%60).toString().padStart(2,"0")}`;
  useEffect(()=>{
    if(!assessmentStarted || assessmentFinished) return;
    const timer=window.setInterval(()=>{
      setAssessmentSeconds(previous=>{
        if(previous<=1){
          window.clearInterval(timer);
          setAssessmentStarted(false);
          setAssessmentFinished(true);
          return 0;
        }
        return previous-1;
      });
    },1000);
    return ()=>window.clearInterval(timer);
  },[assessmentStarted,assessmentFinished]);
  useEffect(()=>{
    if(!assessmentFinished || assessmentSaved) return;
    const bank=assessmentBanks[assessmentLevel];
    const total=bank.questions.length;
    const correct=bank.questions.reduce((sum,q,i)=>sum+(assessmentAnswers[i]===q.correct?1:0),0);
    const topicScores={};
    bank.questions.forEach((q,i)=>{
      if(!topicScores[q.topic]) topicScores[q.topic]={correct:0,total:0};
      topicScores[q.topic].total++;
      if(assessmentAnswers[i]===q.correct) topicScores[q.topic].correct++;
    });
    setAssessmentHistory(previous=>[...previous,{level:assessmentLevel,score:correct,total,topicScores,date:new Date().toISOString()}]);
    recordAssessmentResult({level:assessmentLevel,score:correct,total,topicScores});
    setAssessmentSaved(true);
  },[assessmentFinished,assessmentSaved,assessmentLevel,assessmentAnswers]);
  const currentLesson = lessons.find(x => x.id === selectedLesson) || lessons[0];
  const filteredLessons = lessons.filter(
  x =>
    (levelFilter === "All" || x.level === levelFilter) &&
    (x.title + " " + x.desc + " " + x.tag)
      .toLowerCase()
      .includes(query.toLowerCase())
);

const levelCounts = {
  All: lessons.length,
  Beginner: lessons.filter(x => x.level === "Beginner").length,
  Intermediate: lessons.filter(x => x.level === "Intermediate").length,
  Advanced: lessons.filter(x => x.level === "Advanced").length
};
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
    if (quizIndex === quiz.length - 1) {
      recordQuizResult(score, quiz.length);
      setQuizDone(true);
    } else setQuizIndex(v => v + 1);
  };
  const restartQuiz = () => { setAnswers({}); setQuizIndex(0); setQuizDone(false); };
  const startAssessment = (level=assessmentLevel) => {
    setAssessmentLevel(level);
    setAssessmentAnswers({});
    setAssessmentIndex(0);
    setAssessmentSeconds(assessmentBanks[level].minutes*60);
    setAssessmentFinished(false);
    setAssessmentSaved(false);
    setAssessmentStarted(true);
  };
  const answerAssessment = optionIndex => {
    if(assessmentAnswers[assessmentIndex]!==undefined) return;
    setAssessmentAnswers(previous=>({...previous,[assessmentIndex]:optionIndex}));
  };
  const nextAssessmentQuestion = () => {
    if(assessmentIndex===currentAssessment.questions.length-1){
      setAssessmentStarted(false);
      setAssessmentFinished(true);
    } else setAssessmentIndex(previous=>previous+1);
  };
  const resetAssessment = () => {
    setAssessmentStarted(false);
    setAssessmentFinished(false);
    setAssessmentAnswers({});
    setAssessmentIndex(0);
    setAssessmentSeconds(currentAssessment.minutes*60);
    setAssessmentSaved(false);
  };

  return <div className="app-shell">
    
    <header className="topbar">
      <button className="brand" onClick={() => go("home")} aria-label="AI Simplified home">
        <span className="brand-mark"><BrainCircuit size={22}/></span>
        <span>AI <b>SIMPLIFIED</b><small>MAKE AI MAKE SENSE</small></span>
      </button>
      <nav className={menuOpen ? "nav-links open" : "nav-links"}>
        <button className={active==="home"?"nav-active":""} onClick={()=>go("home")}>Home</button>
        <button className={active==="explore"?"nav-active":""} onClick={()=>go("explore")}>Learn</button>
        <details className="nav-menu" onMouseLeave={(event)=>{event.currentTarget.open=false;}}>
          <summary className={["playground","neural-playground","visual-lab"].includes(active)?"nav-active":""}>Labs</summary>
          <div className="nav-dropdown">
            <button className={active==="playground"?"nav-active":""} onClick={()=>go("playground")}>AI Playground</button>
            <button className={active==="neural-playground"?"nav-active":""} onClick={()=>go("neural-playground")}>Neural Playground</button>
            <button className={active==="visual-lab"?"nav-active":""} onClick={()=>go("visual-lab")}>Visual AI Lab</button>
            <button className={active==="agent-tutorial"?"nav-active":""} onClick={()=>go("agent-tutorial")}>Build an Agent</button>
          </div>
        </details>
        <details className="nav-menu" onMouseLeave={(event)=>{event.currentTarget.open=false;}}>
          <summary className={["quiz","assessment"].includes(active)?"nav-active":""}>Assessments</summary>
          <div className="nav-dropdown">
            <button className={active==="quiz"?"nav-active":""} onClick={()=>go("quiz")}>Knowledge Quiz</button>
            <button className={active==="assessment"?"nav-active":""} onClick={()=>go("assessment")}>Assessment Centre</button>
          </div>
        </details>
        <button className={active==="dashboard"?"nav-active":""} onClick={()=>go("dashboard")}>My Progress</button>
      </nav>
      <button className="top-cta" onClick={()=>go("explore")}>Start learning <ArrowUpRight size={16}/></button>
      <button className="mobile-menu" onClick={()=>setMenuOpen(v=>!v)} aria-label="Toggle menu">{menuOpen?<X/>:<Menu/>}</button>
    </header>

    {active==="dashboard" && <LearningDashboard onNavigate={go} onOpenLesson={openLesson}/>}
    {active==="agent-tutorial" && <AgentTutorial/>}

    {active==="home" && <main>
      <section className="hero section-wrap">
        <div className="hero-copy">
          <div className="eyebrow"><span className="pulse-dot"/> AI LEARNING FOR EVERY CURIOUS MIND</div>
          <h1>AI feels complex.<br/><span>Let's unlock it.</span></h1>
          <p className="hero-lede">No jargon. No coding. No confusion. Just bite-sized lessons and playful experiments that make artificial intelligence click.</p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={()=>go("explore")}>Explore AI <ArrowRight size={18}/></button>
            <button className="btn-ghost" onClick={()=>go("neural-playground")}><Play size={16}/> Try the neural playground</button>
            <button className="btn-ghost" onClick={()=>go("dashboard")}><GraduationCap size={16}/> My learning progress</button>
          </div>
          <div className="hero-proof"><div className="avatar-stack"><i>🧑‍🎓</i><i>👩‍💻</i><i>🧑‍🚀</i></div><span><b>Curious minds welcome.</b><br/>Start from absolute zero.</span></div>
        </div>
        <div className="hero-art" onPointerMove={(event)=>{if(event.pointerType!=="mouse")return;const r=event.currentTarget.getBoundingClientRect();const x=(event.clientX-r.left)/r.width;const y=(event.clientY-r.top)/r.height;const dx=(x-.5)*2;const dy=(y-.5)*2;event.currentTarget.style.setProperty("--pointer-x",(x*100)+"%");event.currentTarget.style.setProperty("--pointer-y",(y*100)+"%");event.currentTarget.style.setProperty("--parallax-x",(dx*7)+"px");event.currentTarget.style.setProperty("--parallax-y",(dy*7)+"px");event.currentTarget.style.setProperty("--parallax-inverse-x",(dx*-5)+"px");event.currentTarget.style.setProperty("--parallax-inverse-y",(dy*-5)+"px");}} onPointerLeave={(event)=>{event.currentTarget.style.setProperty("--pointer-x","50%");event.currentTarget.style.setProperty("--pointer-y","50%");event.currentTarget.style.setProperty("--parallax-x","0px");event.currentTarget.style.setProperty("--parallax-y","0px");event.currentTarget.style.setProperty("--parallax-inverse-x","0px");event.currentTarget.style.setProperty("--parallax-inverse-y","0px");}}>
          <div className="orbit orbit-one"></div><div className="orbit orbit-two"></div>
          <div className="lab-orbit-track" aria-label="Explore AI labs">
            <button className="lab-orbit-card lab-orbit-one" onClick={()=>go("agent-tutorial")}><span className="lab-orbit-card-inner"><span className="lab-orbit-icon"><Bot size={16}/></span><span><b>Build an Agent</b><small>CREATE · AUTOMATE</small></span><ArrowUpRight size={13}/></span></button>
            <button className="lab-orbit-card lab-orbit-two" onClick={()=>go("playground")}><span className="lab-orbit-card-inner"><span className="lab-orbit-icon"><FlaskConical size={16}/></span><span><b>AI Playground</b><small>EXPERIMENT · LEARN</small></span><ArrowUpRight size={13}/></span></button>
            <button className="lab-orbit-card lab-orbit-three" onClick={()=>go("neural-playground")}><span className="lab-orbit-card-inner"><span className="lab-orbit-icon"><Network size={16}/></span><span><b>Neural Playground</b><small>TRAIN · EXPLORE</small></span><ArrowUpRight size={13}/></span></button>
            <button className="lab-orbit-card lab-orbit-four" onClick={()=>go("visual-lab")}><span className="lab-orbit-card-inner"><span className="lab-orbit-icon"><BrainCircuit size={16}/></span><span><b>Visual AI Lab</b><small>VISUALISE · DISCOVER</small></span><ArrowUpRight size={13}/></span></button>
          </div>
          <div className="brain-glow"><div className="brain-core"><BrainCircuit size={104} strokeWidth={1.25}/><span className="core-spark">✦</span></div></div>
          <div className="orbit-label label-a">LEARN</div><div className="orbit-label label-b">EXPLORE</div>
          <span className="art-star star-a">✳</span><span className="art-star star-b">✦</span>
        </div>
      </section>

      <section className="stats-strip section-wrap">
        <div><b>06</b><span>Beginner lessons</span></div><div><b>01</b><span>Interactive playground</span></div><div><b>03</b><span>Assessment levels</span></div><div><b>∞</b><span>Curiosity encouraged</span></div>
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

{active==="explore" && <main className="section-wrap page-main explore-page">
  <div className="page-intro">
    <div className="eyebrow">YOUR AI LEARNING JOURNEY</div>
    <h1>Learn AI. <span>Level by level.</span></h1>
    <p>Build a strong foundation, develop practical skills, then move into advanced AI engineering.</p>
  </div>

  <div className="level-overview">
    {[
      {level:"Beginner",num:"01",kicker:"START HERE",desc:"AI fundamentals, Python, maths and data basics."},
      {level:"Intermediate",num:"02",kicker:"BUILD SKILLS",desc:"Embeddings, vector search, RAG and AI agents."},
      {level:"Advanced",num:"03",kicker:"GO DEEPER",desc:"Fine-tuning and production AI systems."}
    ].map(item => (
      <button key={item.level}
        className={`level-card level-${item.level.toLowerCase()} ${levelFilter===item.level?"selected":""}`}
        onClick={()=>{setLevelFilter(item.level); document.getElementById("course-catalogue")?.scrollIntoView({behavior:"smooth",block:"start"});}}>
        <span className="level-index">{item.num}</span>
        <span className="level-kicker">{item.kicker}</span>
        <strong>{item.level}</strong>
        <span className="level-description">{item.desc}</span>
        <span className="level-total">{levelCounts[item.level]} lessons <ArrowUpRight size={14}/></span>
      </button>
    ))}
  </div>

  <div className="catalogue-heading" id="course-catalogue">
    <div>
      <div className="eyebrow">COURSE CATALOGUE</div>
      <h2>{levelFilter==="All"?"All learning content":levelFilter+" learning path"}</h2>
      <p>Select a level that matches your experience. You can change it anytime.</p>
    </div>
  </div>

  <div className="catalogue-controls">
    <div className="level-filters">
      {["All","Beginner","Intermediate","Advanced"].map(level => (
        <button key={level}
          className={levelFilter===level?"level-filter active":"level-filter"}
          onClick={()=>{setLevelFilter(level); document.getElementById("course-catalogue")?.scrollIntoView({behavior:"smooth",block:"start"});}}>
          {level}<span>{levelCounts[level]}</span>
        </button>
      ))}
    </div>
    <div className="search-box">
      <Search size={18}/>
      <input value={query}
        onChange={e=>setQuery(e.target.value)}
        placeholder="Search lessons, topics or concepts..."/>
      <span>{filteredLessons.length} LESSONS</span>
    </div>
  </div>

  <div className="lesson-grid all-lessons">
    {filteredLessons.map((lesson,i)=>(
      <LessonCard key={lesson.id} lesson={lesson} index={i}
        onClick={()=>openLesson(lesson.id)}/>
    ))}
  </div>
  {filteredLessons.length===0 &&
    <div className="empty-state">No lessons found. Try another level.</div>}
</main>}

        {active==="lesson" && <main className="section-wrap page-main lesson-page">
      <button className="text-link" onClick={()=>go("explore")}>
        <ArrowLeft size={16}/> Back to all lessons
      </button>

      <div className="page-intro lesson-intro">
        <div className="eyebrow">{currentLesson.level || "AI LEARNING"} · COURSE</div>
        <h1>{currentLesson.title}</h1>
        <p>{currentLesson.desc}</p>
      </div>

      {lessonDeepDive[currentLesson.id]
        ? <LessonDeepDive lesson={currentLesson}/>
        : <div className="empty-state">Course chapters are being prepared. Please choose another lesson for now.</div>}
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
      {(() => {
        const samples = [
          {fruit:"Apple",emoji:"🍎",colour:"Red",shape:"Round",texture:"Crisp",clue:"A familiar snack fruit. Its red skin and crisp bite are useful clues.",why:"Red + round + crisp strongly points to an apple in this tiny teaching dataset."},
          {fruit:"Banana",emoji:"🍌",colour:"Yellow",shape:"Long",texture:"Soft",clue:"Notice the unusual shape as well as the colour.",why:"Yellow + long + soft is the feature pattern labelled Banana."},
          {fruit:"Orange",emoji:"🍊",colour:"Orange",shape:"Round",texture:"Juicy",clue:"The colour is a strong signal, but check the texture too.",why:"Orange colour + round shape + juicy texture matches Orange."},
          {fruit:"Apple",emoji:"🍎",colour:"Green",shape:"Round",texture:"Crisp",clue:"This one is designed to challenge a colour-only guess.",why:"Even though the colour is green, round + crisp still matches the Apple examples."},
          {fruit:"Banana",emoji:"🍌",colour:"Green-yellow",shape:"Long",texture:"Firm",clue:"A banana can look different depending on how ripe it is.",why:"The long shape is a strong feature; the colour and texture can vary with ripeness."},
          {fruit:"Orange",emoji:"🍊",colour:"Orange",shape:"Round",texture:"Juicy",clue:"Compare this sample with the earlier round fruit.",why:"The juicy texture and orange colour distinguish it from the crisp apple."}
        ];
        const sample = samples[demoCount % samples.length];
        const options = ["Apple","Banana","Orange"];
        const answered = demoAnswered;
        return <>
          <style>{`
            .meaning-playground{max-width:850px;margin:0 auto 28px}
            .meaning-playground .playground-header{align-items:center}
            .meaning-progress{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:20px 0 10px;color:#aaa2c5;font-size:11px}
            .meaning-progress-track{height:7px;border-radius:20px;background:#ffffff12;overflow:hidden;margin-bottom:22px}
            .meaning-progress-track span{display:block;height:100%;background:linear-gradient(90deg,#9474ed,#e19bd4);transition:width .25s}
            .meaning-task{padding:24px;border-radius:16px;background:#111022;border:1px solid #ffffff12}
            .meaning-features{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:20px 0}
            .meaning-feature{padding:13px;border-radius:12px;background:#ffffff08}
            .meaning-feature small{display:block;color:#a99fc9;font-size:9px;letter-spacing:1px;font-weight:800;margin-bottom:6px}
            .meaning-feature b{font-size:14px;color:#f5f0ff}
            .meaning-options{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:15px}
            .meaning-option{padding:14px 10px;border-radius:12px;border:1px solid #ffffff20;background:#ffffff08;color:#f7f2ff;font-weight:750;cursor:pointer}
            .meaning-option.selected{border-color:#b39aff;background:#9271e52b}
            .meaning-option:disabled{cursor:default;opacity:.8}
            .meaning-feedback{padding:16px;border-radius:13px;margin-top:16px;background:#8c78e51a;border:1px solid #9c85f055;color:#e8e0ff;font-size:13px;line-height:1.65}
            .meaning-feedback.correct{background:#48c99a12;border-color:#48c99a55}
            .meaning-actions{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:18px}
            .meaning-score{font-size:12px;color:#bdb4d8;margin-left:auto}
            .meaning-learning{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:16px}
            .meaning-learning article{padding:17px;border:1px solid #ffffff14;border-radius:14px;background:#ffffff06}
            .meaning-learning b{display:block;font-size:13px;margin:8px 0 5px}
            .meaning-learning p{font-size:11px;line-height:1.6;color:#aaa2c5;margin:0}
            @media(max-width:600px){.meaning-features,.meaning-options,.meaning-learning{grid-template-columns:1fr}.meaning-task{padding:16px}.meaning-score{width:100%;margin-left:0}}
          `}</style>
          <div className="page-intro"><div className="eyebrow">THE AI PLAYGROUND · HANDS-ON LAB</div><h1>Don't just read AI. <span>Make decisions.</span></h1><p>Step into the role of a machine-learning trainer. Inspect data, make a prediction, and learn why the features matter.</p></div>
          <div className="playground-card meaning-playground">
            <div className="playground-header"><div className="play-icon"><FlaskConical size={22}/></div><div><h2>Lab 01 · Train your fruit classifier</h2><p>Can you classify unseen examples using their features?</p></div><span className="demo-tag">INTERACTIVE LAB</span></div>
            <div className="meaning-progress"><span>EXAMPLE {demoCount % samples.length + 1} OF {samples.length}</span><span>YOUR SCORE: {demoScore}/{demoCount + (answered ? 1 : 0)}</span></div>
            <div className="meaning-progress-track"><span style={{width:`${((demoCount%samples.length)+1)/samples.length*100}%`}}/></div>
            <div className="meaning-task">
              <div className="fruit-stage"><div className="fruit-orb">{sample.emoji}</div><div><span className="stage-label">UNKNOWN SAMPLE</span><h3>What fruit is this?</h3><p>{sample.clue}</p></div></div>
              <div className="meaning-features">
                <div className="meaning-feature"><small>FEATURE 01 · COLOUR</small><b>{sample.colour}</b></div>
                <div className="meaning-feature"><small>FEATURE 02 · SHAPE</small><b>{sample.shape}</b></div>
                <div className="meaning-feature"><small>FEATURE 03 · TEXTURE</small><b>{sample.texture}</b></div>
              </div>
              <div className="eyebrow">YOUR PREDICTION</div>
              <p style={{fontSize:12,color:"#aaa2c5",margin:"7px 0 0"}}>Choose the label you think best matches these features.</p>
              <div className="meaning-options">{options.map(option=><button key={option} disabled={answered} className={`meaning-option ${demoGuess===option?"selected":""}`} onClick={()=>setDemoGuess(option)}>{option}</button>)}</div>
              {answered && <div className={`meaning-feedback ${demoGuess===sample.fruit?"correct":""}`}>
                <b>{demoGuess===sample.fruit?"Correct classification!":"Good attempt — let's inspect the label."}</b><br/>
                The correct label is <strong>{sample.emoji} {sample.fruit}</strong>. {sample.why}
              </div>}
              <div className="meaning-actions">
                {!answered ? <button className="btn-primary" disabled={!demoGuess} onClick={()=>{setDemoAnswered(true);if(demoGuess===sample.fruit)setDemoScore(v=>v+1);}}>Check my prediction <ArrowRight size={16}/></button> :
                  <button className="btn-primary" onClick={()=>{setDemoCount(v=>v+1);setDemoGuess("");setDemoAnswered(false);}}>Next example <ArrowRight size={16}/></button>}
                <button className="btn-light" onClick={()=>{setDemoCount(0);setDemoGuess("");setDemoScore(0);setDemoAnswered(false);}}><RotateCcw size={15}/> Restart lab</button>
                <span className="meaning-score">{answered?"Answer recorded":"No pressure — learn by trying"}</span>
              </div>
            </div>
            <div className="disclaimer"><CircleHelp size={16}/> This is a transparent rule-based learning exercise, not a trained AI model. The labels are known in advance so you can understand how classification works.</div>
          </div>
          <div className="concept-note"><div className="note-icon"><Target size={22}/></div><div><b>What are you learning?</b><p>A classification model learns from labelled examples. The input features (colour, shape and texture) help it predict a category (the label). In real machine learning, the model learns patterns from many examples and can make mistakes on new data.</p></div></div>
          <div className="meaning-learning">
            <article><span className="eyebrow">01 · INPUT</span><b>Features</b><p>Observable properties supplied to a model, such as colour, shape or texture.</p></article>
            <article><span className="eyebrow">02 · OUTPUT</span><b>Label</b><p>The category the model is trying to predict, such as Apple, Banana or Orange.</p></article>
            <article><span className="eyebrow">03 · EVALUATION</span><b>Accuracy</b><p>Compare predictions with known labels to see how often the classifier is correct.</p></article>
          </div>
        </>;
      })()}
    </main>}

    {active==="quiz" && <main className="section-wrap page-main quiz-page">
      <div className="page-intro"><div className="eyebrow">THE KNOWLEDGE ARENA</div><h1>Test your AI <span>knowledge.</span></h1><p>15 questions across six core topics. Test concepts, apply what you learned and read the explanation after every answer.</p></div>
      <div className="quiz-card">
        {!quizDone ? <>
          <div className="quiz-top"><span>QUESTION {quizIndex+1} OF {quiz.length}</span><span>{completed}/{quiz.length} ANSWERED</span></div>
          <div className="progress-track"><div style={{width:`${(quizIndex/quiz.length)*100}%`}}/></div>
          <div className="quiz-question"><span className="question-number">{String(quizIndex+1).padStart(2,"0")}</span><div><div className="eyebrow">{quiz[quizIndex].topic}</div><h2>{quiz[quizIndex].q}</h2></div></div>
          <div className="answer-list">{quiz[quizIndex].a.map((a,i)=><button key={a} onClick={()=>answerQuiz(i)} className={`answer-option ${answers[quizIndex]===i?(i===quiz[quizIndex].correct?"correct":"incorrect"):""} ${answers[quizIndex]!==undefined&&i===quiz[quizIndex].correct?"correct":""}`}><span className="answer-letter">{String.fromCharCode(65+i)}</span>{a}{answers[quizIndex]===i&&<CheckCircle2 size={19}/>}</button>)}</div>
          {answers[quizIndex]!==undefined&&<div className="answer-explain"><b>{answers[quizIndex]===quiz[quizIndex].correct?"That's right! 🎉":"Good try — here's the idea."}</b><p>{quiz[quizIndex].explain}</p></div>}
          <div className="quiz-footer"><span>{answers[quizIndex]!==undefined?"Answer locked in":"Choose the best answer"}</span><button className="btn-primary" disabled={answers[quizIndex]===undefined} onClick={nextQuestion}>{quizIndex===quiz.length-1?"See my score":"Next question"} <ArrowRight size={16}/></button></div>
        </> : <div className="quiz-result"><div className="trophy-icon"><Trophy size={42}/></div><div className="eyebrow">YOU SHOWED UP. THAT'S A WIN.</div><h2>{score===quiz.length?"AI superstar!":score>=Math.ceil(quiz.length*0.7)?"You're getting the hang of it!":"A curious mind is a growing mind!"}</h2><div className="score-big">{score}<span> / {quiz.length}</span></div><p>You got {score} out of {quiz.length} correct across six topics. Revisit a lesson and give it another go.</p><button className="btn-primary" onClick={restartQuiz}><RotateCcw size={16}/> Try again</button><button className="text-link" onClick={()=>go("explore")}>Explore lessons <ArrowRight size={16}/></button></div>}
        </div>
    </main>}

    {active==="assessment" && <main className="section-wrap page-main assessment-page">
      <style>{`
      .assessment-page{padding-bottom:70px}
      .assessment-level-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin:28px 0 18px}
      .assessment-level-card{display:flex;flex-direction:column;align-items:flex-start;gap:9px;text-align:left;padding:22px;border:1px solid rgba(255,255,255,.12);border-radius:17px;background:linear-gradient(145deg,rgba(255,255,255,.055),rgba(255,255,255,.018));color:#f5f1ff;cursor:pointer;transition:.2s}
      .assessment-level-card:hover,.assessment-level-card.selected{border-color:rgba(177,151,255,.65);background:linear-gradient(145deg,rgba(139,110,232,.17),rgba(255,255,255,.025));transform:translateY(-2px)}
      .assessment-level-card strong{font-size:23px;letter-spacing:-.5px}
      .assessment-level-card>span:nth-of-type(2){font-size:12px;color:#c8bde7}
      .assessment-level-kicker{font-size:9px;letter-spacing:1.2px;font-weight:850;color:#bca8ff}
      .assessment-level-desc{font-size:12px;line-height:1.6;color:#a9a1c3}
      .assessment-start-card,.assessment-test-card,.assessment-result-card,.assessment-dashboard{padding:clamp(20px,3vw,30px);border:1px solid rgba(177,151,255,.2);border-radius:19px;background:linear-gradient(145deg,rgba(31,29,53,.96),rgba(22,20,39,.96));margin:18px 0 26px}
      .assessment-start-card{display:flex;align-items:center;justify-content:space-between;gap:20px}
      .assessment-start-card h2,.assessment-test-top h2,.assessment-result-card h2{font-size:24px;margin:8px 0}
      .assessment-start-card p,.assessment-result-heading p{font-size:13px;color:#aaa2c5;margin:0;line-height:1.6}
      .assessment-test-top{display:flex;align-items:center;justify-content:space-between;gap:18px}
      .assessment-timer{display:flex;flex-direction:column;align-items:center;padding:10px 17px;border-radius:12px;border:1px solid rgba(177,151,255,.3);background:rgba(139,110,232,.12)}
      .assessment-timer span{font-size:9px;letter-spacing:1px;color:#b9add9;font-weight:800}
      .assessment-timer strong{font-size:25px;font-variant-numeric:tabular-nums;color:#eee7ff}
      .assessment-timer.urgent{border-color:rgba(255,120,140,.55);background:rgba(255,100,120,.12)}
      .assessment-topic-label{display:inline-flex;margin:24px 0 4px;padding:6px 10px;border-radius:99px;background:rgba(139,110,232,.14);color:#c8b5ff;font-size:10px;font-weight:800}
      .assessment-test-card h3{font-size:20px;line-height:1.55;color:#f4efff;margin:12px 0 20px}
      .assessment-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
      .assessment-option{display:flex;align-items:center;gap:11px;text-align:left;padding:14px;border:1px solid rgba(255,255,255,.11);border-radius:12px;background:rgba(255,255,255,.035);color:#ded8ef;cursor:pointer;font:inherit;font-size:13px;line-height:1.5}
      .assessment-option>span{display:grid;place-items:center;width:27px;height:27px;flex:none;border-radius:8px;background:#30294b;color:#cbbaff;font-size:11px;font-weight:850}
      .assessment-option:hover:not(:disabled),.assessment-option.chosen{border-color:#a58af5;background:rgba(155,127,240,.13)}
      .assessment-option:disabled{cursor:default}
      .assessment-test-footer{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:24px;padding-top:18px;border-top:1px solid rgba(255,255,255,.09);font-size:12px;color:#aaa2c5}
      .assessment-result-heading{display:flex;align-items:center;gap:17px}
      .assessment-score-line{display:flex;align-items:baseline;justify-content:space-between;margin:25px 0;padding:20px;border-radius:14px;background:rgba(139,110,232,.11)}
      .assessment-score-line>strong{font-size:42px;color:#e6dcff}.assessment-score-line small{font-size:18px;color:#aaa2c5}.assessment-score-line>span{font-size:13px;color:#c7b6ff;font-weight:800}
      .assessment-review-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:18px 0 24px}
      .assessment-review-item{padding:15px;border:1px solid rgba(255,255,255,.09);border-radius:12px;background:rgba(255,255,255,.025)}
      .assessment-review-top{display:flex;justify-content:space-between;gap:10px;margin-bottom:9px;font-size:10px;color:#aaa2c5}
      .assessment-review-top .good{color:#8fe0c4}.assessment-review-top .needs-work{color:#f3b2a6}
      .assessment-review-item>strong{display:block;font-size:13px;line-height:1.5;color:#eee9fa}
      .assessment-review-item p,.assessment-review-item small{display:block;font-size:11px;line-height:1.6;color:#aaa2c5;margin:7px 0 0}
      .assessment-review-item .assessment-correct-answer{color:#a8e6d2}
      .assessment-dashboard{margin-top:35px}
      .assessment-dashboard-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:20px 0}
      .assessment-dashboard-stats>div{padding:17px;border:1px solid rgba(255,255,255,.09);border-radius:12px;background:rgba(255,255,255,.025)}
      .assessment-dashboard-stats strong{display:block;font-size:26px;color:#e6dcff}.assessment-dashboard-stats span{font-size:11px;color:#aaa2c5}
      .topic-performance-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:13px}
      .topic-performance-card{display:grid;grid-template-columns:1fr auto;gap:9px 12px;align-items:center;padding:14px;border:1px solid rgba(255,255,255,.08);border-radius:12px}
      .topic-performance-card>div:first-child{display:flex;flex-direction:column;gap:4px}.topic-performance-card strong{font-size:12px;color:#e6e0f5}.topic-performance-card span{font-size:10px;color:#9991b2}.topic-performance-card>b{font-size:12px;color:#c9b8ff}
      .topic-bar{grid-column:1/2;height:6px;border-radius:99px;background:#38334d;overflow:hidden}.topic-bar i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,#8c72ef,#d28ce8)}
      .assessment-empty-state{font-size:12px;color:#aaa2c5;margin:18px 0 0}
      .assessment-history-list{margin-top:22px}.assessment-history-list>strong{display:block;font-size:12px;margin-bottom:8px}.assessment-history-list>div{display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.07);font-size:11px;color:#aaa2c5}.assessment-history-list b{color:#d7caff}
      @media(max-width:760px){.assessment-level-grid{grid-template-columns:1fr}.assessment-start-card{align-items:flex-start;flex-direction:column}.assessment-options,.assessment-review-list,.topic-performance-grid{grid-template-columns:1fr}}
      @media(max-width:520px){.assessment-test-top{align-items:flex-start}.assessment-test-card,.assessment-result-card,.assessment-dashboard{padding:17px}.assessment-dashboard-stats{gap:7px}.assessment-dashboard-stats>div{padding:12px}.assessment-dashboard-stats strong{font-size:21px}.assessment-history-list>div{flex-direction:column;gap:4px}}
`}</style>
      <div className="page-intro">
        <div className="eyebrow">AI SIMPLIFIED · ASSESSMENT CENTRE</div>
        <h1>Prove what <span>you know.</span></h1>
        <p>Choose your level, take a timed mock test and use your topic-wise results to decide what to revise next.</p>
      </div>
      <section className="assessment-level-grid">
        {Object.entries(assessmentBanks).map(([level,bank])=>{
          const selected=assessmentLevel===level;
          const levelClass=level.toLowerCase();
          return <button key={level} className={`assessment-level-card ${levelClass} ${selected?"selected":""}`} onClick={()=>{setAssessmentLevel(level);resetAssessment();}}>
            <span className="assessment-level-kicker">{level==="Beginner"?"BUILD CONFIDENCE":level==="Intermediate"?"APPLY CONCEPTS":"CHALLENGE YOURSELF"}</span>
            <strong>{level}</strong>
            <span>{bank.questions.length} questions · {bank.minutes} minutes</span>
            <span className="assessment-level-desc">{level==="Beginner"?"Core terms and everyday AI examples":level==="Intermediate"?"Practical scenarios and model evaluation":"Trade-offs, deployment risks and deeper concepts"}</span>
          </button>;
        })}
      </section>

      {!assessmentStarted&&!assessmentFinished&&<section className="assessment-start-card">
        <div><div className="eyebrow">YOUR NEXT MOCK TEST</div><h2>{assessmentLevel} assessment</h2><p>{currentAssessment.questions.length} questions · {currentAssessment.minutes} minutes · Instant answer review after submission</p></div>
        <button className="btn-primary" onClick={()=>startAssessment(assessmentLevel)}>Start timed test <ArrowRight size={17}/></button>
      </section>}

      {assessmentStarted&&<section className="assessment-test-card">
        <div className="assessment-test-top">
          <div><div className="eyebrow">{assessmentLevel.toUpperCase()} MOCK TEST</div><h2>Question {assessmentIndex+1} of {currentAssessment.questions.length}</h2></div>
          <div className={`assessment-timer ${assessmentSeconds<=60?"urgent":""}`}><span>TIME LEFT</span><strong>{formatTime(assessmentSeconds)}</strong></div>
        </div>
        <div className="progress-track"><div style={{width:`${(assessmentIndex/currentAssessment.questions.length)*100}%`}}/></div>
        <div className="assessment-topic-label">{currentAssessment.questions[assessmentIndex].topic}</div>
        <h3>{currentAssessment.questions[assessmentIndex].q}</h3>
        <div className="assessment-options">{currentAssessment.questions[assessmentIndex].a.map((option,i)=>{
          const chosen=assessmentAnswers[assessmentIndex];
          return <button key={option} disabled={chosen!==undefined} onClick={()=>answerAssessment(i)} className={`assessment-option ${chosen===i?"chosen":""}`}>
            <span>{String.fromCharCode(65+i)}</span>{option}{chosen===i&&<CheckCircle2 size={17}/>}
          </button>;
        })}</div>
        <div className="assessment-test-footer">
          <span>{Object.keys(assessmentAnswers).length} of {currentAssessment.questions.length} answered</span>
          <button className="btn-primary" disabled={assessmentAnswers[assessmentIndex]===undefined} onClick={nextAssessmentQuestion}>{assessmentIndex===currentAssessment.questions.length-1?"Submit assessment":"Next question"} <ArrowRight size={16}/></button>
        </div>
      </section>}

      {assessmentFinished&&<section className="assessment-result-card">
        <div className="assessment-result-heading"><div className="trophy-icon"><Trophy size={36}/></div><div><div className="eyebrow">ASSESSMENT COMPLETE</div><h2>{assessmentScore>=5?"Excellent work!":assessmentScore>=3?"Good progress — keep going!":"Every attempt is progress."}</h2><p>{assessmentLevel} level · {Object.keys(assessmentAnswers).length} of {currentAssessment.questions.length} answered</p></div></div>
        <div className="assessment-score-line"><strong>{assessmentScore}<small> / {currentAssessment.questions.length}</small></strong><span>{Math.round(assessmentScore/currentAssessment.questions.length*100)}% score</span></div>
        <div className="assessment-review-list">{currentAssessment.questions.map((q,i)=>{
          const correct=assessmentAnswers[i]===q.correct;
          return <article className="assessment-review-item" key={`${q.topic}-${i}`}>
            <div className="assessment-review-top"><span>{q.topic} · Q{i+1}</span><b className={correct?"good":"needs-work"}>{correct?"Correct":"Review"}</b></div>
            <strong>{q.q}</strong>
            <p>Your answer: {assessmentAnswers[i]===undefined?"Not answered":q.a[assessmentAnswers[i]]}</p>
            <p className="assessment-correct-answer">Correct answer: {q.a[q.correct]}</p>
            <small>{q.explain}</small>
          </article>;
        })}</div>
        <button className="btn-primary" onClick={()=>startAssessment(assessmentLevel)}><RotateCcw size={16}/> Retake this level</button>
      </section>}

      <section className="assessment-dashboard">
        <div className="section-heading"><div><div className="eyebrow">YOUR LEARNING ANALYTICS</div><h2>Performance <span>dashboard</span></h2><p>Track your mock-test results by topic across completed attempts in this browser session.</p></div></div>
        <div className="assessment-dashboard-stats">
          <div><strong>{assessmentHistory.length}</strong><span>Tests completed</span></div>
          <div><strong>{assessmentHistory.length?Math.round(assessmentHistory.reduce((sum,item)=>sum+item.score/item.total,0)/assessmentHistory.length*100):0}%</strong><span>Average score</span></div>
          <div><strong>{assessmentHistory.length?Math.max(...assessmentHistory.map(item=>Math.round(item.score/item.total*100))):0}%</strong><span>Best score</span></div>
        </div>
        <div className="topic-performance-grid">{assessmentTopics.map(topic=>{
          const rows=assessmentHistory.flatMap(item=>{
            const value=item.topicScores[topic];
            return value?[value]:[];
          });
          const correct=rows.reduce((sum,item)=>sum+item.correct,0);
          const total=rows.reduce((sum,item)=>sum+item.total,0);
          const percent=total?Math.round(correct/total*100):0;
          return <div className="topic-performance-card" key={topic}>
            <div><strong>{topic}</strong><span>{total?`${correct}/${total} correct`:"Not tested yet"}</span></div>
            <div className="topic-bar"><i style={{width:`${percent}%`}}/></div>
            <b>{total?`${percent}%`:"—"}</b>
          </div>;
        })}</div>
        {assessmentHistory.length===0&&<p className="assessment-empty-state">Your topic dashboard will populate after your first completed mock test.</p>}
        {assessmentHistory.length>0&&<div className="assessment-history-list"><strong>Recent attempts</strong>{assessmentHistory.slice().reverse().slice(0,5).map((item,index)=><div key={`${item.date}-${index}`}><span>{item.level} · {new Date(item.date).toLocaleString()}</span><b>{item.score}/{item.total} · {Math.round(item.score/item.total*100)}%</b></div>)}</div>}
      </section>
    </main>}

    <footer className="footer"><div className="footer-inner"><button className="brand footer-brand" onClick={()=>go("home")}><span className="brand-mark"><BrainCircuit size={21}/></span><span>AI <b>SIMPLIFIED</b><small>MAKE AI MAKE SENSE</small></span></button><p>Making artificial intelligence practical and understandable for students, professionals, creators and developers.</p><div className="footer-bottom"><span>© 2026 AI Simplified. All rights reserved.</span><span>Built with curiosity <span className="heart">♥</span> by <a href="https://github.com/quantum-rakhi" target="_blank" rel="noreferrer">Rakhi Thakur</a></span></div></div></footer>
  </div>;
}


const roadmapLevels = [
  {id:"foundations",level:0,title:"AI Foundations",description:"Understand what AI is, where it is used, and what its limitations mean in practice.",skills:["AI fundamentals","AI vs ML vs Deep Learning","Responsible AI"],lessons:["ai"],practical:"Identify AI use cases and distinguish AI, machine learning and generative AI.",status:"available"},
  {id:"python-data",level:1,title:"Python, Mathematics & Data",description:"Build practical programming, mathematical and data-analysis foundations for AI.",skills:["Python","Vectors and matrices","NumPy and Pandas","Statistics","Data visualisation"],lessons:["python-basics","math-for-ai","data-with-python","statistics-visualization"],practical:"Write Python code, clean a small dataset and explain its patterns with a chart.",status:"available"},
  {id:"machine-learning",level:2,title:"Machine Learning",description:"Understand training data, features, labels, algorithms and model evaluation.",skills:["Supervised learning","Unsupervised learning","Regression","Classification"],lessons:["ml"],practical:"Design a classifier and explain how to evaluate predictions on unseen data.",status:"available"},
  {id:"deep-learning",level:3,title:"Deep Learning",description:"Explore neurons, layers, activation functions, backpropagation and training.",skills:["Neural networks","Backpropagation","Optimisation","Transformers"],lessons:["dl"],practical:"Train the existing XOR neural network and inspect how loss changes.",status:"available"},
  {id:"generative-ai",level:4,title:"Generative AI & LLMs",description:"Learn how language models process prompts and generate text and other content.",skills:["Generative AI","LLMs","Tokens","Prompt engineering","Evaluation"],lessons:["genai","llm","prompt"],practical:"Improve a prompt by adding context, constraints and an output format.",status:"available"},
  {id:"ai-engineering",level:5,title:"AI Engineering & RAG",description:"Understand embeddings, vector search, document chunking and retrieval-augmented generation.",skills:["Embeddings","Vector databases","Semantic search","Chunking","RAG"],lessons:["embeddings","vectordb","semantic-search","chunking","rag"],practical:"Map the stages of a document question-answering pipeline.",status:"available"},
  {id:"agentic-ai",level:6,title:"Agentic AI",description:"Explore agent planning, tool calling, memory, orchestration and guardrails.",skills:["AI agents","Tool calling","Memory","Multi-agent systems","MCP"],lessons:["ai-agents"],practical:"Design a safe agent workflow with a tool, validation and human approval.",status:"available"},
  {id:"production-ai",level:7,title:"Production AI & MLOps",description:"Learn deployment, monitoring, evaluation, security and responsible operations.",skills:["Model serving","APIs","CI/CD","Monitoring","Drift","Governance"],lessons:["finetuning"],practical:"Create a deployment checklist covering evaluation, monitoring and rollback.",status:"available"}
];

function LearningDashboard({onNavigate,onOpenLesson}) {
  const [progress,setProgress] = useState(getProgressSnapshot);
  const [notice,setNotice] = useState("");
  useEffect(()=>subscribeToProgress(()=>setProgress(getProgressSnapshot())),[]);
  const completedChapters = Object.values(progress.chapters).reduce((sum,item)=>sum+(item.completed?.length||0),0);
  const totalChapters = Object.values(progress.chapters).reduce((sum,item)=>sum+(item.total||0),0);
  const chapterPercent = totalChapters ? Math.round(completedChapters/totalChapters*100) : 0;
  const latestAssessment = progress.assessments[progress.assessments.length-1];
  const latestQuiz = progress.quizzes[progress.quizzes.length-1];
  const lessonDone = id => {
    const item = progress.chapters[id];
    return !!item && item.total>0 && item.completed.length>=item.total;
  };
  const startNext = () => {
    const level = roadmapLevels.find(item=>item.status==="available" && item.lessons.some(id=>!lessonDone(id)));
    onOpenLesson(level?.lessons.find(id=>!lessonDone(id)) || "ai");
  };
  const downloadBackup = () => {
    const blob = new Blob([exportProgress()],{type:"application/json"});
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href=url; anchor.download="ai-simplified-progress.json"; anchor.click();
    URL.revokeObjectURL(url); setNotice("Progress backup downloaded.");
  };
  const uploadBackup = async event => {
    const file=event.target.files?.[0]; if(!file) return;
    try { importProgress(await file.text()); setProgress(getProgressSnapshot()); setNotice("Progress restored from backup."); }
    catch(error) { setNotice(error.message || "Could not import this backup."); }
    event.target.value="";
  };
  const clearProgress = () => {
    if(!window.confirm("Reset all locally saved AI Simplified learning progress on this device?")) return;
    resetProgress(); setProgress(getProgressSnapshot()); setNotice("Local learning progress has been reset.");
  };
  return <main className="section-wrap page-main learner-dashboard">
    <style>{`
      .learner-dashboard{padding-bottom:76px}.learner-welcome{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:26px 28px;margin:24px 0;border:1px solid rgba(177,151,255,.22);border-radius:18px;background:linear-gradient(115deg,rgba(116,83,190,.22),rgba(34,31,59,.9))}
      .learner-welcome h2{font:700 25px "Space Grotesk";margin:9px 0}.learner-welcome p{color:#aaa8c3;font-size:13px;margin:0}
      .learner-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:13px;margin:20px 0 44px}
      .learner-stats article{display:flex;flex-direction:column;gap:7px;padding:18px;border:1px solid var(--line);border-radius:14px;background:linear-gradient(145deg,#201e3c,#19182f)}
      .learner-stats svg{width:19px;color:#b9a6ff}.learner-stats strong{font:700 27px "Space Grotesk";color:#f8f5ff}.learner-stats span{font-size:11px;color:#aaa8c3}
      .roadmap-section{margin:0 0 42px}.roadmap-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
      .roadmap-card{display:flex;flex-direction:column;padding:20px;border:1px solid var(--line);border-radius:16px;background:linear-gradient(145deg,#201e3c,#19182f);min-height:300px}
      .roadmap-card.is-complete{border-color:rgba(119,217,198,.4)}.roadmap-card.is-planned{opacity:.78}
      .roadmap-card-top{display:flex;justify-content:space-between;align-items:center;color:#b9a6ff;font-size:10px;font-weight:850;letter-spacing:1.2px}
      .roadmap-card-top svg{color:#8fe0c4}.roadmap-card h3{font:700 20px "Space Grotesk";margin:14px 0 7px}.roadmap-card>p{font-size:12px;line-height:1.7;color:#aaa8c3;margin:0 0 14px}
      .roadmap-skills{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:15px}.roadmap-skills span{font-size:10px;color:#d3c8f4;background:#9b7cff18;border:1px solid #9b7cff30;border-radius:30px;padding:5px 8px}
      .roadmap-practical{margin-top:auto;padding:12px;border-radius:11px;background:#77d9c610;border:1px solid #77d9c622;color:#c9e8df;font-size:11px;line-height:1.6}.roadmap-practical b{display:block;color:#8fe0c4;font-size:9px;letter-spacing:1px;margin-bottom:4px}
      .roadmap-card-bottom{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:14px;color:#aaa8c3;font-size:10px}.roadmap-card-bottom button{display:inline-flex;align-items:center;gap:6px;border:0;background:#9b7cff22;color:#d6c9ff;padding:8px 10px;border-radius:9px;font-size:10px;font-weight:800}.roadmap-coming{color:#9c96b3;font-weight:700}
      .learner-recent-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin:24px 0}.learner-panel{padding:20px;border:1px solid var(--line);border-radius:15px;background:#1b1a32}
      .learner-panel h3{font:700 24px "Space Grotesk";margin:10px 0 5px}.learner-panel p{font-size:11px;line-height:1.6;color:#aaa8c3}
      .learner-data-tools{display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap;padding:20px;border:1px solid var(--line);border-radius:15px;background:#17162c}
      .learner-data-tools h3{margin:8px 0;font-size:16px}.learner-data-tools p{max-width:560px;color:#aaa8c3;font-size:11px;line-height:1.6}
      .learner-data-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.learner-data-actions .btn-light{margin:0;padding:10px 12px;font-size:10px}
      .learner-reset{display:inline-flex;align-items:center;gap:6px;border:1px solid #e68b9a44;border-radius:10px;background:#e68b9a12;color:#f0b8c0;padding:10px 12px;font-size:10px;font-weight:800}
      .learner-notice{width:100%;color:#9de4c9!important;margin:0}
      @media(max-width:760px){.learner-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.roadmap-grid{grid-template-columns:1fr}.learner-welcome{align-items:flex-start;flex-direction:column}.learner-recent-grid{grid-template-columns:1fr}}
      @media(max-width:480px){.learner-dashboard{padding-left:16px;padding-right:16px}.learner-stats article{padding:14px}.learner-data-tools{align-items:flex-start;flex-direction:column}}
    `}</style>
    <div className="page-intro"><div className="eyebrow"><Sparkles size={13}/> YOUR LEARNING HOME</div><h1>Your AI learning <span>journey.</span></h1><p>Pick up where you left off, explore the roadmap and keep track of the skills you are building. Your progress stays in this browser.</p></div>
    <section className="learner-welcome"><div><div className="eyebrow">YOUR NEXT STEP</div><h2>Small steps become real skills.</h2><p>Start with a lesson, try the experiment, then check what you understand.</p></div><button className="btn-primary" onClick={startNext}>Continue learning <ArrowRight size={16}/></button></section>
    <section className="learner-stats">
      <article><BookOpen/><strong>{completedChapters}</strong><span>Chapters completed</span></article>
      <article><Target/><strong>{chapterPercent}%</strong><span>Chapter progress</span></article>
      <article><Trophy/><strong>{progress.quizzes.length+progress.assessments.length}</strong><span>Assessments attempted</span></article>
      <article><GraduationCap/><strong>{roadmapLevels.length}</strong><span>Learning levels</span></article>
    </section>
    <section className="roadmap-section"><div className="section-heading"><div><div className="eyebrow">ZERO TO AI BUILDER</div><h2>Your learning <span>roadmap.</span></h2><p>Follow the levels in order, or revisit a topic whenever you need it.</p></div></div>
      <div className="roadmap-grid">{roadmapLevels.map(level=>{
        const done=level.lessons.length>0&&level.lessons.every(lessonDone); const available=level.status==="available";
        return <article className={`roadmap-card ${done?"is-complete":""} ${available?"":"is-planned"}`} key={level.id}>
          <div className="roadmap-card-top"><span>LEVEL {level.level}</span>{done?<CheckCircle2 size={17}/>:available?<BookOpen size={17}/>:<Clock3 size={17}/>}</div>
          <h3>{level.title}</h3><p>{level.description}</p><div className="roadmap-skills">{level.skills.map(skill=><span key={skill}>{skill}</span>)}</div>
          <div className="roadmap-practical"><b>HANDS-ON OUTCOME</b>{level.practical}</div>
          <div className="roadmap-card-bottom"><span>{done?"Completed":available?"Lessons available":"Coming in a future release"}</span>{available&&level.lessons.length>0?<button onClick={()=>onOpenLesson(level.lessons[0])}>Start level <ArrowRight size={14}/></button>:<span className="roadmap-coming">Planned</span>}</div>
        </article>;
      })}</div>
    </section>
    <section className="learner-recent-grid">
      <article className="learner-panel"><div className="eyebrow">LATEST QUIZ</div><h3>{latestQuiz?`${latestQuiz.score} / ${latestQuiz.total}`:"Not attempted yet"}</h3><p>{latestQuiz?new Date(latestQuiz.date).toLocaleString():"Complete the knowledge quiz to record your first result."}</p><button className="text-link" onClick={()=>onNavigate("quiz")}>Open quiz <ArrowRight size={14}/></button></article>
      <article className="learner-panel"><div className="eyebrow">LATEST MOCK ASSESSMENT</div><h3>{latestAssessment?`${latestAssessment.score} / ${latestAssessment.total}`:"Not attempted yet"}</h3><p>{latestAssessment?`${latestAssessment.level} · ${new Date(latestAssessment.date).toLocaleString()}`:"Take a timed assessment to check your understanding."}</p><button className="text-link" onClick={()=>onNavigate("assessment")}>Open assessment <ArrowRight size={14}/></button></article>
    </section>
    <section className="learner-data-tools"><div><div className="eyebrow">YOUR DATA, YOUR DEVICE</div><h3>Manage your learning backup</h3><p>Progress is stored locally in this browser. Export it before clearing browser data or moving to another device.</p></div>
      <div className="learner-data-actions"><button className="btn-light" onClick={downloadBackup}><Download size={15}/> Export progress</button><label className="btn-light"><Upload size={15}/> Import backup<input type="file" accept="application/json,.json" onChange={uploadBackup} hidden/></label><button className="learner-reset" onClick={clearProgress}><RefreshCw size={14}/> Reset progress</button></div>
      {notice&&<p className="learner-notice" role="status">{notice}</p>}
    </section>
  </main>;
}

function LessonCard({lesson,index,onClick}) {
  const Icon=lesson.icon;
  return <button className="lesson-card" onClick={onClick}><div className="card-topline">
  <span className={`lesson-icon ${lesson.color}`}><Icon size={23}/></span>
  <span className={`lesson-level-chip ${(lesson.level||"Beginner").toLowerCase()}`}>
    {lesson.level||"Beginner"}
  </span>
  <span className="card-number">{String(index+1).padStart(2,"0")}</span>
</div>
    <div className="card-tag">{lesson.tag}</div><h3>{lesson.title}</h3><p>{lesson.desc}</p>
    <div className="card-bottom"><span><BookOpen size={14}/> {lesson.time}</span><span className="card-arrow"><ArrowUpRight size={18}/></span></div>
  </button>;
}

createRoot(document.getElementById("root")).render(<App />);
