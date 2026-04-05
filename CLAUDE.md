# Shoshin — A Practice in Beginner's Mind

Static HTML/CSS/JS. No framework. No build step. No backend. No tracking.

## Architecture
- Each practice tool is a self-contained HTML file
- Module pages (module-01 through module-12) link to practice tools
- index.html is the landing/journey page
- Progress tracked in localStorage (key: haiku-lab-zen-progress)
- Sound via Web Audio API (singing bowls, tones, water noise)
- Calligraphy via canvas (stroke.html)

## Serving locally
```
bunx serve . -l 8080
```

## Deploying
Cloudflare Pages. Point at the repo root. No build command. Static files.

## Design principles
- Rice paper (#f8f6f1) and ink (#1a1a1a). Nothing else.
- No progress bars. No gamification. No encouragement.
- Each tool asks something of the body or of time — not just reading.
- The tool gets out of the way. The practice is what remains.
