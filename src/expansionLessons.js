import { Rocket, Gauge, ShieldCheck, Cloud, Activity, Scale } from "lucide-react";

const courses = [
  {id:"building-ai-app",title:"Building an AI Application",level:"Intermediate",tag:"BUILD PRODUCTS",desc:"Design, build and evaluate a user-facing AI application.",icon:Rocket,color:"orange",chapters:["Define the user problem and product outcome","Choose the AI application pattern","Design the system architecture","Build the frontend experience","Create backend APIs and model adapters","Manage prompts and context","Connect retrieval and external tools","Handle latency, errors and streaming","Design trustworthy user experiences","Create evaluation datasets and tests","Secure, deploy and operate the app","Capstone: ship an AI application MVP"],scenario:"A support assistant that answers order questions using approved customer records."},
  {id:"llm-evaluation",title:"LLM Evaluation and Benchmarking",level:"Advanced",tag:"MODEL QUALITY",desc:"Measure answer quality, groundedness, robustness, safety and cost.",icon:Gauge,color:"violet",chapters:["Why evaluating language models is difficult","Define tasks and quality dimensions","Build representative evaluation datasets","Create human review rubrics","Use exact-match and semantic metrics","Apply model-based judging carefully","Evaluate retrieval and grounded answers","Test robustness and adversarial inputs","Analyse variance and statistical confidence","Avoid benchmark leakage and contamination","Monitor quality after release","Capstone: build an evaluation suite"],scenario:"A policy assistant where every answer must be supported by a specific policy passage."},
  {id:"ai-security",title:"AI Security and Guardrails",level:"Advanced",tag:"TRUST & SAFETY",desc:"Threat-model AI systems and implement layered controls against misuse.",icon:ShieldCheck,color:"pink",chapters:["Threat-model the AI application","Understand prompt injection","Protect sensitive data and secrets","Constrain tool access and agent authority","Validate inputs and handle outputs safely","Design policy guardrails and refusals","Apply identity and access management","Sandbox execution and use least privilege","Red-team adversarial scenarios","Log, detect and respond to abuse","Secure models, dependencies and supply chains","Capstone: produce an AI security plan"],scenario:"A tool-using enterprise assistant that can search documents and draft emails."},
  {id:"production-ai-architecture",title:"Production AI Architecture",level:"Advanced",tag:"SYSTEM ENGINEERING",desc:"Design reliable, scalable AI systems with explicit operational trade-offs.",icon:Cloud,color:"blue",chapters:["Translate requirements into SLOs","Select an architecture pattern","Design model gateways and adapters","Use queues and asynchronous processing","Orchestrate prompts, context and tools","Version models, prompts and data","Engineer resilience and graceful fallback","Plan capacity, concurrency and scaling","Design tenancy, privacy and compliance","Instrument traces, metrics and logs","Balance quality, latency and cost","Capstone: create a production architecture"],scenario:"An enterprise knowledge assistant with search, model providers and usage controls."},
  {id:"deployment-monitoring",title:"Deployment and Monitoring",level:"Advanced",tag:"AI OPERATIONS",desc:"Deploy AI services safely and monitor service, data and model behaviour.",icon:Activity,color:"green",chapters:["Separate development, test and production","Package code and model dependencies","Build reproducible containers","Automate CI/CD checks","Register and version model artefacts","Release with canary and shadow traffic","Monitor service health and latency","Detect data and concept drift","Track model quality and feedback","Prepare rollback and incident runbooks","Manage retraining and lifecycle changes","Capstone: deploy and monitor a model"],scenario:"A fraud-risk scoring service released gradually with measurable rollback conditions."},
  {id:"llmops",title:"LLMOps and Cost Optimisation",level:"Advanced",tag:"AI OPERATIONS",desc:"Operate LLM applications with measurable quality, latency and spend controls.",icon:Gauge,color:"yellow",chapters:["Understand the LLMOps lifecycle","Identify token and request cost drivers","Select and route models by task","Cache safe repeatable work","Tune batching, concurrency and rate limits","Reduce context and retrieval overhead","Set latency budgets and streaming strategy","Attribute spend to teams and features","Run quality-cost optimisation experiments","Forecast capacity and provider resilience","Set budgets, alerts and FinOps controls","Capstone: optimise cost without quality loss"],scenario:"A high-volume summarisation service balancing inference spend, latency and quality."},
  {id:"responsible-ai",title:"Responsible AI and Governance",level:"Advanced",tag:"GOVERNANCE",desc:"Establish accountability, risk controls, transparency and lifecycle governance.",icon:Scale,color:"violet",chapters:["Principles, accountability and intended use","Maintain an AI system inventory","Classify risk and assess impact","Govern data provenance and privacy","Measure fairness and disparate outcomes","Provide transparency and explanations","Design meaningful human oversight","Maintain documentation and audit trails","Assess vendors and third-party models","Map applicable laws and standards","Manage incidents and continuous review","Capstone: create a governance plan"],scenario:"An AI-assisted recruitment screening workflow with human review and appeal routes."}
];

const lessonNotes = [
  "Begin with the problem boundary: identify the user, intended outcome, system inputs and constraints. Distinguish the core mechanism from optional implementation choices.",
  "Trace the workflow from input to output. Name the component responsible for each transformation or decision, and specify where validation belongs.",
  "Compare at least two approaches against the same requirements. Explain trade-offs in reliability, complexity, maintainability, privacy, latency and cost.",
  "Use a realistic example and inspect an edge case. Consider missing, malformed, delayed, contradictory or out-of-scope information.",
  "Define evidence of success before implementation. Choose observable measures, establish a baseline and keep evaluation data separate from tuning examples.",
  "Document operational ownership: who reviews failures, approves changes, receives user reports and can pause or roll back the system."
];

const modulesFor = course => course.chapters.map((title,i) => ({
  title,
  explain:`${title} is a key part of ${course.title.toLowerCase()}. ${lessonNotes[i % lessonNotes.length]} In a practical setting such as ${course.scenario.toLowerCase()}, the team must make responsibilities explicit. Application code should enforce permissions and business rules; model output should be treated as a result to validate, not as an authority.\n\nWork through the concept by writing down the expected input, the transformation or decision, the output and the failure response. Test the normal path and a deliberately difficult case. Record observable evidence, then compare the result with the acceptance criteria. This turns a demo into a repeatable engineering practice.`,
  bullets:[`Explain the role of ${title.toLowerCase()} in the ${course.title.toLowerCase()} lifecycle.`,"Identify inputs, outputs, dependencies and the responsible component.","State assumptions and conditions under which the approach can fail.","Choose a measurable check and compare it with a simple baseline.","Document operational, privacy, security and cost implications."],
  example:`Scenario: ${course.scenario} Apply this chapter by identifying the component responsible, the evidence it should produce and the control that prevents an unsafe or misleading result.`,
  task:`Create a short design note for "${title}". Include an input/output example, a normal-path test, one negative test, an acceptance criterion and the evidence you would collect before release.`
}));

const quizItems = {
 "building-ai-app":["Which artifact defines how the frontend and backend communicate?","Why should an AI app provide a fallback when the model is unavailable?","What is an evaluation dataset used for?","Where should access permissions be enforced?"],
 "llm-evaluation":["Why is fluency alone an inadequate quality metric?","What makes an evaluation dataset representative?","Why should model-based judging be calibrated against human review?","Why include unanswerable questions in a test set?"],
 "ai-security":["Why must retrieved documents be treated as untrusted input?","Where should tool permissions be enforced?","What does least privilege reduce?","Why is red teaming useful before release?"],
 "production-ai-architecture":["What does an SLO make explicit?","Why should retries be bounded?","What is the purpose of a model gateway?","Why are distributed traces useful?"],
 "deployment-monitoring":["What is the purpose of a canary release?","Which signal can reveal data drift?","Why maintain a rollback procedure?","What should a release gate verify?"],
 "llmops":["Which factors drive LLM inference cost?","Why route tasks to different model sizes?","What must be checked when introducing caching?","Why optimise quality and cost together?"],
 "responsible-ai":["What belongs in an AI impact assessment?","Why document intended use?","What makes human oversight meaningful?","Why monitor outcomes after deployment?"]
};
const answerSets = [
 ["An API contract","A marketing slogan","A model card only","A colour palette"],
 ["To give a safe and clear next step","To conceal failures","To increase token usage","To avoid requirements"],
 ["To measure behaviour against defined criteria","To store credentials","To replace logs","To guarantee zero errors"],
 ["In application services and data controls","Only in prompt wording","In user-uploaded files","Nowhere"]
];

export const expansionLessons = courses.map(c=>({
 id:c.id,title:c.title,level:c.level,tag:c.tag,desc:c.desc,time:"4–6 hours",icon:c.icon,color:c.color,
 body:c.desc,analogy:"Treat this course as an engineering workshop: define the problem, design the workflow, test failure cases and justify decisions with evidence.",
 points:["Understand the concepts and their role in the lifecycle.","Apply them to a realistic scenario.","Evaluate trade-offs, risks and operational readiness."]
}));

export const expansionDeepDive = Object.fromEntries(courses.map(c=>[
 c.id,{outcome:"Design a practical solution, validate it with evidence and explain its engineering, operational and governance trade-offs.",modules:modulesFor(c)}
]));

export const expansionChapterPractice = Object.fromEntries(courses.map(c=>[
 c.id,quizItems[c.id].map((q,i)=>({q,a:answerSets[i],correct:0,explain:"The best answer establishes a specific, testable engineering or governance practice rather than relying on model confidence."}))
]));
