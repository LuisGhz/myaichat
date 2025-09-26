# MyAIChat

## Description
MyAIChat is a polished, production-ready chat assistant that layers a refined user experience on top of modern large language models. Recruiters and hiring managers can see how the app handles authentication, streaming conversations, prompt curation, and multimodal inputs while keeping the interface approachable for everyday users.

## Features
- **GitHub-powered sign-in** that directs users through the project’s OAuth2 backend before unlocking the main workspace.
- **Responsive chat workspace** with guarded routes, message streaming feedback, and auto-scroll so conversations stay in context.
- **Model management tools** for switching between multiple OpenAI and Google Gemini models, adjusting output tokens, and enabling web search augmentations.
- **Voice and file inputs** that capture audio, transcribe speech on-device, and validate pasted or uploaded images before sending them to the assistant.
- **Reusable prompt library** that lets power users create, edit, and delete saved prompts to bootstrap new conversations quickly.
- **Installable PWA shell** built with Vite, Tailwind, and Ant Design, offering dark mode styling, offline caching, and a native-like feel across devices.
- **Robust state orchestration** via Zustand stores, Axios API client wrappers, and shared modals that highlight clean architecture patterns.

### Supported models
- [GPT 4o](https://platform.openai.com/docs/models/gpt-4o)
- [GPT 4o Mini](https://platform.openai.com/docs/models/gpt-4o-mini)
- [GPT 4.1](https://platform.openai.com/docs/models/gpt-4.1)
- [GPT 4.1 Mini](https://platform.openai.com/docs/models/gpt-4.1-mini)
- [o4 Mini](https://platform.openai.com/docs/models/o4-mini)
- [Gemini 2.0 Flash Lite](https://cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-0-flash-lite?hl=es-419)
- [Gemini 2.0 Flash](https://cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-0-flash?hl=es-419)
- [Gemini 2.5 Flash](https://cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-5-flash?hl=es-419)
- [Gemini 2.5 Pro](https://cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-5-pro?hl=es-419)

## Installation Instructions
1. **Clone and install dependencies**
	```bash
	git clone https://github.com/LuisGhz/myaichat.git
	cd myaichat
	npm install
	```
2. **Configure environment variables**
	- Copy `.env` (or create a new one) and point `VITE_API_URL` to the backend that exposes `/oauth2/authorization/github` and the chat endpoints.
3. **Run the development server**
	```bash
	npm run dev
	```
	Vite prints the local URL (defaults to [http://localhost:5173](http://localhost:5173)); open it in your browser to start testing.
4. **Optional: run quality checks**
	```bash
	npm test
	npm run lint
	npm run build
	```
5. **Optional: build and serve with Docker**
	```bash
	docker build --build-arg VITE_API_URL=http://localhost:8080/api -t myaichat .
	docker run -p 3051:80 myaichat
	```

## Requirements
- Node.js 20 LTS (or newer) and npm 10+
- A running MyAIChat-compatible backend that provides OAuth2 with GitHub and REST/streaming endpoints for chats, prompts, and file uploads
- Modern browser with microphone permissions enabled for voice capture (Chrome, Edge, or Safari)
- Docker (optional) for containerized deployments

## References
- [Project issue tracker and roadmap](https://github.com/LuisGhz/myaichat)
- [React 19 documentation](https://react.dev/)
- [Vite + SWC guide](https://vite.dev/guide/)
- [Ant Design component library](https://ant.design/)
- [Zustand state management](https://zustand-demo.pmnd.rs/)
- [vite-plugin-pwa reference](https://vite-pwa-org.netlify.app/)
