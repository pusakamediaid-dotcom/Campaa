# Roadmap - Campaa AI

## Current Version: 1.1.0

## Completed Features

### v1.0.0 - Initial Release
- [x] Vite + React + TypeScript setup
- [x] Basic chat interface
- [x] 9 AI modes
- [x] Provider selector (OpenAI, Gemini, OpenRouter, Demo)
- [x] Mode demo tanpa API key
- [x] localStorage conversation memory
- [x] Basic prompt enhancer

### v1.1.0 - Current Release
- [x] Tool system (Calculator, Prompt, Export, Task Planner, Repository Helper, Ebook Agent)
- [x] Tool router dengan intent detection
- [x] Agent pipeline infrastructure
- [x] Ebook Agent Bridge integration
- [x] Action system dengan approval gate
- [x] 15 AI modes (ditambah 6 mode baru)
- [x] Cost guard dan memory system
- [x] Comprehensive documentation

## Planned Features

### v1.2.0 - Tool Enhancement
- [ ] Tool panel di UI (sidebar atau dropdown)
- [ ] Visual tool results display
- [ ] Tool history
- [ ] Chain multiple tools
- [ ] Tool customization

### v1.3.0 - Action System Enhancement
- [ ] Action panel dengan pending approvals
- [ ] Action execution status
- [ ] Action history dan audit log
- [ ] GitHub API integration (read-only)
- [ ] Webhook payload generator

### v1.4.0 - AI Enhancement
- [ ] Streaming responses
- [ ] Token usage display
- [ ] Cost tracking per conversation
- [ ] Provider auto-fallback visualization
- [ ] Model comparison tool

### v1.5.0 - Ebook Agent Deep Integration
- [ ] Direct GitHub API untuk read artifact
- [ ] Artifact preview di Campaa
- [ ] Automated issue creation (dengan approval)
- [ ] Run status monitoring
- [ ] Cost report analysis

### v2.0.0 - Multi-Agent
- [ ] Multiple AI agents bekerja sama
- [ ] Agent delegation system
- [ ] Cross-agent context sharing
- [ ] Parallel tool execution

## Technical Improvements

### Near Term
- [ ] PWA support untuk mobile
- [ ] Offline mode dengan cached models
- [ ] IndexedDB untuk better storage
- [ ] Service worker untuk caching

### Medium Term
- [ ] WebSocket untuk real-time updates
- [ ] SQLite untuk local database
- [ ] File system access untuk export
- [ ] Background sync

## Known Limitations

1. **No persistent server** - Semua data di localStorage
2. **Demo mode default** - AI hanya berfungsi dengan backend
3. **Single conversation** - Tidak ada multi-conversation tabs
4. **No file upload** - Hanya text input
5. **No image generation** - Text only

## Dependencies

- React 18.3
- Vite 6.0
- TypeScript 5.6
- @vercel/node 3.0 (for backend)

## Deployment

Currently deployed to Vercel with serverless functions.

### Required Environment Variables
- `OPENAI_API_KEY`
- `GEMINI_API_KEY`
- `OPENROUTER_API_KEY`

## Contributing

1. Fork repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

## License

MIT