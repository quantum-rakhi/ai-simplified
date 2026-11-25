"""Small, curated catalogue exposed to the AI Simplified learning agent."""

COURSES = [
    {"id":"ai","title":"What is AI?","level":"Beginner","topics":["AI fundamentals","intelligent tasks","AI limitations"]},
    {"id":"ml","title":"Machine Learning","level":"Beginner","topics":["supervised learning","unsupervised learning","model training","evaluation"]},
    {"id":"dl","title":"Deep Learning","level":"Beginner","topics":["neural networks","layers","activation functions"]},
    {"id":"genai","title":"Generative AI","level":"Beginner","topics":["generative models","tokens","multimodal AI"]},
    {"id":"llm","title":"What is an LLM?","level":"Beginner","topics":["large language models","tokens","context windows"]},
    {"id":"prompt","title":"Prompt Engineering","level":"Beginner","topics":["prompt design","context","structured outputs"]},
    {"id":"python-basics","title":"Python Essentials for AI","level":"Beginner","topics":["Python syntax","functions","data structures"]},
    {"id":"math-for-ai","title":"Mathematics for AI","level":"Beginner","topics":["linear algebra","vectors","derivatives","probability"]},
    {"id":"data-with-python","title":"Working with Data: NumPy & Pandas","level":"Beginner","topics":["NumPy","Pandas","data cleaning","dataframes"]},
    {"id":"statistics-visualization","title":"Statistics & Data Visualisation","level":"Beginner","topics":["descriptive statistics","distributions","visualisation"]},
    {"id":"embeddings","title":"Embeddings and Vector Mathematics","level":"Intermediate","topics":["embeddings","vector similarity","cosine similarity"]},
    {"id":"vectordb","title":"Vector Databases","level":"Intermediate","topics":["vector indexing","metadata filters","retrieval"]},
    {"id":"semantic-search","title":"Semantic Search","level":"Intermediate","topics":["semantic retrieval","similarity ranking","hybrid search"]},
    {"id":"chunking","title":"Document Chunking","level":"Intermediate","topics":["chunk size","overlap","document parsing"]},
    {"id":"rag","title":"RAG: Retrieval-Augmented Generation","level":"Intermediate","topics":["retrieval augmented generation","grounding","retrieval pipeline"]},
    {"id":"ai-agents","title":"AI Agents & Tool Calling","level":"Intermediate","topics":["agents","tools","planning","tool calling"]},
    {"id":"building-ai-app","title":"Building an AI Application","level":"Intermediate","topics":["application architecture","API integration","user experience"]},
    {"id":"finetuning","title":"Fine-Tuning and Model Customisation","level":"Advanced","topics":["fine-tuning","LoRA","model adaptation"]},
    {"id":"llm-evaluation","title":"LLM Evaluation and Benchmarking","level":"Advanced","topics":["evaluation datasets","metrics","human evaluation"]},
    {"id":"ai-security","title":"AI Security and Guardrails","level":"Advanced","topics":["prompt injection","data protection","guardrails"]},
    {"id":"production-ai-architecture","title":"Production AI Architecture","level":"Advanced","topics":["scalability","reliability","architecture"]},
    {"id":"deployment-monitoring","title":"Deployment and Monitoring","level":"Advanced","topics":["deployment","observability","monitoring"]},
    {"id":"llmops","title":"LLMOps and Cost Optimisation","level":"Advanced","topics":["LLMOps","latency","token costs"]},
    {"id":"responsible-ai","title":"Responsible AI and Governance","level":"Advanced","topics":["fairness","transparency","governance"]},
]

def search_courses(keyword: str, level: str = "") -> dict:
    """Find courses by topic, title, or difficulty level."""
    term = keyword.strip().lower()
    selected_level = level.strip().lower()
    matches = [
        course for course in COURSES
        if (not term or term in course["title"].lower()
            or any(term in topic.lower() for topic in course["topics"]))
        and (not selected_level or selected_level == course["level"].lower())
    ]
    return {"count": len(matches), "courses": matches[:10]}

def get_learning_path(level: str) -> dict:
    """Return the ordered courses for Beginner, Intermediate, or Advanced."""
    selected = level.strip().lower()
    matches = [course for course in COURSES if course["level"].lower() == selected]
    if not matches:
        return {"error": "Choose Beginner, Intermediate, or Advanced."}
    return {"level": level, "course_count": len(matches), "courses": matches}

def create_practice_plan(topic: str, level: str = "Beginner", question_count: int = 5) -> dict:
    """Prepare a grounded practice brief; the agent writes the actual questions."""
    count = max(3, min(int(question_count), 10))
    return {
        "topic": topic,
        "learner_level": level,
        "question_count": count,
        "required_mix": [
            "concept understanding",
            "practical application",
            "scenario or troubleshooting",
        ],
        "instruction": "Generate original questions, include plausible distractors for multiple choice, and provide answers with concise explanations after the questions."
    }
