# AI Simplified 🧠✨

**Make AI make sense.** A colourful, gamified AI learning platform for students, professionals, creators and developers — from first concepts to practical experiments.

## MVP features

- Six beginner lessons: AI, Machine Learning, Deep Learning, Generative AI, LLMs and Prompt Engineering
- Searchable lesson library
- Interactive fruit-classification explainer (fixed-rule demo, not a trained model)
- Five-question knowledge quiz with explanations and score
- Responsive layout for mobile and desktop
- GitHub Pages deployment through GitHub Actions

## Run locally

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Build for production

```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages

This repository is configured for `https://quantum-rakhi.github.io/ai-simplified/`.

1. Create a **public** GitHub repository named `ai-simplified` under your GitHub account (the example URL below uses `quantum-rakhi`).
2. Upload/push all files from this project to the repository's `main` branch. Include the hidden `.github/workflows/deploy.yml` file.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **GitHub Actions**.
5. Open the **Actions** tab and wait for the “Deploy AI Simplified to GitHub Pages” workflow to finish.
6. Visit `https://quantum-rakhi.github.io/ai-simplified/`.

If you use a different repository name, update `base` in `vite.config.js` to `/<your-repository-name>/` and update the README URL.

## Project structure

```text
ai-simplified/
├── .github/workflows/deploy.yml
├── src/
│   ├── main.jsx
│   └── styles.css
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Important note about the playground

The fruit classifier is intentionally a deterministic, rule-based teaching simulation. It illustrates the idea of classification and feature matching; it does not train a machine-learning model or call an AI API.

## Roadmap

- Add progress saved in the browser
- Add more visual explainers (tokens, neural networks, training vs inference)
- Add accessibility and keyboard-navigation improvements
- Add optional multilingual content
- Add a real, privacy-conscious AI demo only after explaining its limitations and API costs

## Author

Created by [Rakhi Thakur](https://github.com/quantum-rakhi).
