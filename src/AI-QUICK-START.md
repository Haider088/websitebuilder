# 🤖 AI Assistant - Quick Start

## Setup (2 minutes)

### 1. Install Package
```bash
npm install @google/generative-ai
```

### 2. Get API Key
Go to https://aistudio.google.com/app/apikey and create a key

### 3. Create .env File
```bash
cp .env.example .env
```

Add your key:
```
VITE_GEMINI_API_KEY=your_key_here
```

### 4. Restart Server
```bash
npm run dev
```

## Using the AI

### 1. Click the "AI Assistant" Button
Purple/blue gradient button in the toolbar

### 2. Try These Prompts

**For empty pages:**
- "Create a hero section with our restaurant name"
- "Add a menu grid with three columns"
- "Build a complete homepage"

**For editing:**
- "Make the heading bigger"
- "Change the background color to dark blue"
- "Add more padding to the hero"

**For questions:**
- "How do I add a contact form?"
- "What components can I use?"
- "How do I make this responsive?"

### 3. Execute Actions
- Review what the AI will do
- Click "Execute" to apply changes
- Changes go through undo/redo system

## Example Conversation

```
You: Create a hero section with our restaurant name
AI: I'll add a Hero component with your restaurant name...
[Execute button appears]

You: Make the heading bigger
AI: I'll update the fontSize to 3xl...
[Execute button appears]

You: Add a menu grid below it
AI: I'll add a Menu Grid with 3 columns...
[Execute button appears]
```

## Tips

✅ Be specific: "dark blue background" not "nice background"
✅ Use questions: AI can explain concepts
✅ Iterate: "make it bigger", "use different colors"
✅ Check actions: Review before executing

## Troubleshooting

**"AI not available"**
→ Check .env file has correct API key
→ Restart dev server

**"Failed to execute"**
→ Check browser console for errors
→ Try a simpler request

---

That's it! Start building with AI 🚀
