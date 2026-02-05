# 🔑 API Key Setup & Recommendations

## ✅ QUICK START - Get Your API Key

### **Step 1: Choose Your AI Provider**

#### Option A: **OpenAI (RECOMMENDED)** ⭐⭐⭐
Best for fashion advice and conversational AI

**Get API Key:**
1. Go to https://platform.openai.com/api-keys
2. Sign up (free account needed)
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)

**Pricing:**
- GPT-3.5-turbo: ~$0.001 per 1K tokens (~$0.003 per chat message)
- GPT-4o: ~$0.005 per 1K tokens (~$0.015 per chat message)
- **Better option: GPT-4o Turbo** ($0.01 per 1M input tokens)

**Why it's best:**
- ✅ Best quality responses
- ✅ Excellent understanding of fashion context
- ✅ Fast and reliable
- ✅ Great token efficiency
- ✅ Large context window (128K tokens)

**Example response quality:**
> "For your casual minimalist style with a $100 budget, I recommend:
> 1. Classic white oversized t-shirt - perfect base
> 2. Black cropped trousers - elevates minimalist look
> 3. White leather sneakers - clean and versatile
> 4. Neutral linen belt - adds definition..."

---

#### Option B: **Google Gemini** ⭐⭐
Good alternative, free tier available

**Get API Key:**
1. Go to https://aistudio.google.com/app/apikeys
2. Click "Create API Key"
3. Copy the key

**Pricing:**
- Free tier: 60 requests/minute (good for testing)
- Paid: $0.075 per 1M input tokens ($0.30 per 1M output tokens)

**Pros:**
- ✅ Free option available
- ✅ Good quality
- ✅ Large context (100K tokens)

**Cons:**
- ❌ Not as refined for creative tasks
- ❌ Slower than OpenAI
- ❌ Less consistent quality

---

#### Option C: **Claude (Anthropic)** ⭐⭐
Great for detailed responses

**Get API Key:**
1. Go to https://console.anthropic.com
2. Create account
3. Generate API key

**Pricing:**
- $0.003 per 1K input tokens
- $0.015 per 1K output tokens

**Pros:**
- ✅ Best reasoning ability
- ✅ Excellent for complex advice
- ✅ Strong ethical guidelines

**Cons:**
- ❌ More expensive than OpenAI
- ❌ Slower response times
- ❌ Lower token limits per minute

---

### **Step 2: Add Your API Key to Dressify AI**

**For Flask/Python Chat API (Port 5000):**

1. Open `Dressify Ai\Dressify Ai\backend\python_chat_api.py`
2. Or set environment variable:

Windows PowerShell:
```powershell
$env:OPENAI_API_KEY = "sk-your-actual-api-key"
```

Windows Command Prompt:
```cmd
set OPENAI_API_KEY=sk-your-actual-api-key
```

**For AI Hub Python Backend (Port 8001):**

1. Update `Dressify Ai\Dressify Ai\backend\.env`:
```env
OPENAI_API_KEY=sk-your-actual-api-key
```

2. Or set environment variable (same as above)

**For Node.js Backend (Port 8000):**

1. Update `Dressify Ai\backend\.env`:
```env
OPENAI_API_KEY=sk-your-actual-api-key
```

---

### **Step 3: Verify Installation**

Test if API is working:

1. Start all servers (if not running):
   - Python AI (8001): ✅ Running
   - Node backend (8000): ✅ Running
   - Frontend (3000): ✅ Running

2. Open http://localhost:3000 in browser

3. Try one of these:
   - **Chat:** Send a message in the chat box
   - **Recommendations:** Fill style preferences and click "Get AI Recommendations"

4. Check terminal for responses

---

## 💰 Pricing Comparison

| Provider | Model | Cost per Message | Quality | Speed | Context |
|----------|-------|-----------------|---------|-------|---------|
| **OpenAI** | GPT-4o | $0.010-0.015 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 128K |
| OpenAI | GPT-3.5-turbo | $0.003-0.005 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 4K |
| Google | Gemini (paid) | $0.008-0.012 | ⭐⭐⭐⭐ | ⭐⭐⭐ | 100K |
| Google | Gemini (free) | Free (limited) | ⭐⭐⭐ | ⭐⭐⭐ | 100K |
| Claude | Claude-3-Sonnet | $0.015-0.018 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | 200K |

---

## 🎯 Recommendations by Use Case

### **Best Overall: OpenAI GPT-4o Turbo**
- Perfect for fashion advice
- Fast responses
- Good pricing at scale
- Most reliable

### **Budget Conscious: Google Gemini Free**
- Great for testing
- Good quality
- No credit card needed

### **High Quality Responses: Claude**
- Best for detailed analysis
- Great for complex requests
- Higher cost

---

## 🚀 Usage Examples

### Fashion Recommendation Request:
```json
{
  "preferences": "minimalist, sustainable",
  "budget": "$50-100",
  "style": "casual",
  "occasion": "everyday"
}
```

**Expected Response (OpenAI GPT-4o):**
```
Based on your minimalist and sustainable preferences:

1. **Linen Blend T-Shirt** ($35)
   - Organic cotton, minimal design
   - Perfect base layer

2. **Sustainable Denim Jeans** ($75)
   - Recycled materials
   - Timeless cut

[... more recommendations ...]
```

---

## ✅ Recommended Setup

For best experience, use:

**Model:** GPT-4o Turbo
**Provider:** OpenAI
**Cost:** ~$0.02-0.03 per user interaction
**Quality:** Excellent
**Speed:** Fast

---

## 🔒 Security Notes

- ✅ Keep API keys private
- ✅ Never commit keys to git
- ✅ Use environment variables
- ✅ Rotate keys periodically
- ✅ Use different keys for dev/prod

---

## 📞 Support

If recommendations aren't working:

1. Check API key is set correctly
2. Verify backend is running (`http://localhost:8001/health`)
3. Check browser console for errors (F12)
4. Verify network connectivity
5. Check API account has credits (OpenAI)

---

**Last Updated:** February 2, 2026
