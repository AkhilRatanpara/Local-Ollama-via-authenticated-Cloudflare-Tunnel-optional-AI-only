# 🚀 Local Ollama via Authenticated Cloudflare Tunnel Guide

This guide explains how to connect your local **Ollama AI** running on your PC (or GPU server) to your live **Vercel** website securely using a **Cloudflare Tunnel** with token authentication.

> [!NOTE]
> **AI is 100% Optional!**  
> If your PC is off, your internet drops, or the tunnel is down, the Sangam live site will **NOT** crash. It automatically falls back to instant database-grounded search and rule-based demographic matching!

---

## 🛠️ Step 1: Install Cloudflared on your Local PC

Download and install the official Cloudflare CLI (`cloudflared`):
- **Windows (winget):**
  ```powershell
  winget install --id Cloudflare.cloudflared
  ```
- **macOS (Homebrew):**
  ```bash
  brew install cloudflared
  ```
- **Linux:**
  ```bash
  curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
  dpkg -i cloudflared.deb
  ```

---

## 🔒 Step 2: Start Quick Tunnel (Instant & Free)

To start a secure tunnel pointing to your local Ollama port (`11434`):

```powershell
cloudflared tunnel --url http://localhost:11434
```

Output will display a public HTTPS URL like:
`https://random-words-123.trycloudflare.com`

---

## 🛡️ Step 3: Add Environment Variables in Vercel

In your **Vercel Project Settings -> Environment Variables**, set the following:

| Key | Example Value | Description |
| :--- | :--- | :--- |
| `OLLAMA_API_URL` | `https://random-words-123.trycloudflare.com/api` | Your Cloudflare Tunnel public URL + `/api` |
| `OLLAMA_TUNNEL_SECRET` | `my_super_secret_token_123` *(Optional)* | Secret token header to protect your local GPU from unauthorized users |
| `AI_MODEL` | `mistral` *(Optional)* | Model name running in your local Ollama |
| `AI_ENABLED` | `true` | Enable or disable AI feature globally |

*(If using Cloudflare Access Service Tokens for Enterprise Auth, you can also set `CF_ACCESS_CLIENT_ID` and `CF_ACCESS_CLIENT_SECRET`).*

---

## 🤖 Step 4: Verify Local Ollama is Running

Make sure Ollama is active on your local machine:
```powershell
ollama run mistral
```

---

## ⚡ How the Fallback Architecture Works

```
[ User on Live Vercel Site ]
            |
            v
 +----------------------+
 | Vercel API Route     |
 +----------+-----------+
            |
    Is Tunnel Active?
    /               \
 (YES)             (NO / Offline / Error)
   v                          v
[ Local Ollama via ]     [ Rule-Based Fallback ]
[ Cloudflare Tunnel]     [ Grounded Database Match ]
```
