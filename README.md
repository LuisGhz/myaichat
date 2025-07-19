# MyAIChat

Chat application integrated with AI developed with React with Vite, Tailwind CSS as the main technologies, it supports the following models.

- [GPT 4O](https://platform.openai.com/docs/models/gpt-4o)
- [GPT 4O Mini](https://platform.openai.com/docs/models/gpt-4o-mini)
- [Gemini 2.0 Flash Lite](https://cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-0-flash-lite?hl=es-419)
- [Gemini 2.0 Flash](https://cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-0-flash?hl=es-419)
- [Gemini 2.5 Flash Preview 04 17](https://cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-5-flash?hl=es-419)
- [Gemini 2.5 Pro Preview 03 25](https://cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-5-pro?hl=es-419)

## 🔐 Authentication

This application uses OAuth2 authentication with GitHub as the identity provider. All application routes are protected and require authentication.

### Features
- GitHub OAuth2 integration
- JWT token-based authentication
- Automatic token validation
- Secure route protection
- User profile management
- Persistent login sessions

### Setup
1. Copy `.env.example` to `.env.local`
2. Configure `VITE_API_URL` to point to your backend
3. Ensure backend OAuth2 is properly configured with GitHub credentials

For detailed authentication implementation, see [auth-steps.md](./auth-steps.md).

## Required env variables
- VITE_API_URL: URL to api.

## Links References
- [Spring AI OpenAI](https://docs.spring.io/spring-ai/reference/api/chat/openai-chat.html)
- [Spring AI VertexAI Gemini](https://docs.spring.io/spring-ai/reference/api/chat/vertexai-gemini-chat.html)
- [OpenAI Models](https://platform.openai.com/docs/models)
- [Gemini api models](https://ai.google.dev/gemini-api/docs/models?hl=es-419)
- [Gemini api pricing](https://ai.google.dev/gemini-api/docs/pricing?hl=es-419)
- [Gemini vertex models](https://cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-5-flash?hl=es-419)
- [Vertex Locations](https://cloud.google.com/vertex-ai/generative-ai/docs/learn/locations?hl=es-419)