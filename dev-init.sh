#!/usr/bin/env bash
set -euo pipefail

echo "Setting up Shoshin dev environment..."
echo ""

export BUN_INSTALL="${BUN_INSTALL:-$HOME/.bun}"
export PATH="$BUN_INSTALL/bin:$HOME/.local/share/fnm:$PATH"
[ -x "$HOME/.local/share/fnm/fnm" ] && eval "$($HOME/.local/share/fnm/fnm env)" 2>/dev/null

# ── Bun ──────────────────────────────────────────────────────────────────
if command -v bun &>/dev/null; then
  echo "  Bun already installed: $(bun --version)"
else
  echo "  Installing Bun..."
  curl -fsSL https://bun.sh/install | bash
  export PATH="$BUN_INSTALL/bin:$PATH"
  echo "  Bun installed: $(bun --version)"
fi

# ── Node.js ──────────────────────────────────────────────────────────────
if command -v node &>/dev/null; then
  echo "  Node.js already installed: $(node --version)"
else
  echo "  Installing Node.js..."
  curl -fsSL https://fnm.vercel.app/install | bash -s -- --skip-shell
  export PATH="$HOME/.local/share/fnm:$PATH"
  eval "$(fnm env)"
  fnm install --lts
  echo "  Node.js installed: $(node --version)"
fi

# ── Shell paths ──────────────────────────────────────────────────────────
if ! grep -q '.bun/bin' ~/.bashrc 2>/dev/null; then
  echo '' >> ~/.bashrc
  echo 'export BUN_INSTALL="$HOME/.bun"' >> ~/.bashrc
  echo 'export PATH="$BUN_INSTALL/bin:$PATH"' >> ~/.bashrc
fi

if [ -x "$HOME/.local/share/fnm/fnm" ] && ! grep -q "fnm env" ~/.bashrc 2>/dev/null; then
  echo '' >> ~/.bashrc
  echo 'export PATH="$HOME/.local/share/fnm:$PATH"' >> ~/.bashrc
  echo 'eval "$(fnm env)"' >> ~/.bashrc
fi

# ── Wrangler (Cloudflare CLI) ────────────────────────────────────────────
if npx wrangler --version &>/dev/null; then
  echo "  Wrangler available: $(npx wrangler --version 2>/dev/null)"
else
  echo "  Installing Wrangler..."
  npm install -g wrangler
  echo "  Wrangler installed: $(wrangler --version)"
fi

# ── Claude Code ──────────────────────────────────────────────────────────
if command -v claude &>/dev/null; then
  echo "  Claude Code already installed."
else
  echo "  Installing Claude Code..."
  curl -fsSL https://claude.ai/install.sh | bash
fi

echo ""
echo "Done. Commands:"
echo ""
echo "  node dev-server.js   Dev server with mock auth (port 8080)"
echo "  claude               Start Claude Code"
echo ""
echo "  Test key: test-123"
echo "  Enter page: http://localhost:8080/enter"
echo ""
