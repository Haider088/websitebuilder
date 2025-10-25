# AI Assistant Setup Instructions

## 🎉 Features Added

Your restaurant website builder now has an **AI-powered assistant** that can:

1. ✅ **Add components from library** - "Create a hero section"
2. ✅ **Modify existing components** - "Make the heading bigger"  
3. ✅ **Create multiple components at once** - "Add a menu grid with contact form"
4. ✅ **Update global settings** - "Change the primary color to blue"
5. ✅ **Batch operations** - "Update all buttons to be larger"
6. ✅ **Smart suggestions** - Context-aware recommendations
7. ✅ **Natural language** - Talk to it like a human!

## 📦 Installation Steps

### Step 1: Install Dependencies

The AI assistant requires the Google Generative AI SDK. Add this to your project:

```bash
npm install @google/generative-ai
```

Or if using yarn:

```bash
yarn add @google/generative-ai
```

### Step 2: Get Your API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy your API key

### Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and add your API key:
   ```
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Important**: Never commit `.env` to version control!

### Step 4: Restart Development Server

After adding the API key, restart your dev server:

```bash
npm run dev
```

Or:

```bash
yarn dev
```

## 🚀 Usage

### Opening the AI Assistant

Click the **"AI Assistant"** button in the toolbar (purple/blue gradient button with robot icon).

### Example Prompts

**Adding Components:**
- "Create a hero section with our restaurant name"
- "Add a three-column menu grid"
- "Create a contact form"

**Modifying Components:**
- "Make the heading bigger"
- "Change the hero background to a darker color"
- "Add padding to all sections"

**Complex Layouts:**
- "Create a homepage with hero, menu, and contact sections"
- "Build an about page with our story and team photos"
- "Add a reservation section with a form"

**Global Changes:**
- "Change all buttons to use our brand color"
- "Update the primary color to #FF5733"
- "Make the site more modern looking"

**Questions:**
- "How do I add a menu?"
- "What components are available?"
- "How do I make things responsive?"

## 🎯 How It Works

### Action Types

The AI can perform 7 types of actions:

1. **use-component** (Safe) - Adds from library
2. **modify-component** (Moderate) - Updates existing
3. **create-component** (Risky) - Custom code (coming soon)
4. **create-multiple** (Moderate) - Multiple at once
5. **system-operation** (Risky) - Global settings
6. **batch-operation** (Risky) - Bulk updates
7. **explanation** (Safe) - Just answers

### Risk Levels

- 🟢 **Safe**: Executed immediately
- 🟡 **Moderate**: Quick confirmation
- 🔴 **Risky**: Detailed approval required

### Context Awareness

The AI knows:
- ✅ Your restaurant name and branding
- ✅ What's currently on the page
- ✅ Available components
- ✅ Recent actions
- ✅ Global settings

## 💡 Tips

1. **Be specific** - "Add a hero with dark background" is better than "add hero"
2. **Use your data** - It auto-fills restaurant name, colors, etc.
3. **Ask questions** - It can explain how things work
4. **Iterate** - Try "make it bigger" or "use different colors"
5. **Review actions** - Check what it plans to do before executing

## 🛡️ Safety Features

1. **Validation** - All actions are validated before execution
2. **Undo** - Every change goes through history system
3. **Approval** - Risky operations require confirmation
4. **Sandboxing** - Code is checked for security issues

## 🐛 Troubleshooting

### "AI is not available"
- Check that you added the API key to `.env`
- Restart your dev server
- Make sure the key is valid

### "Failed to send message"
- Check your internet connection
- Verify API key is correct
- Check console for error details

### "Failed to execute actions"
- Check console for specific error
- Try a simpler request
- Report the issue if it persists

### API Key Issues
- Make sure `.env` file exists (not just `.env.example`)
- API key should start with `AIza...`
- No quotes around the API key needed
- Restart server after adding key

## 💰 Cost Estimate

Gemini 2.0 Flash is very affordable:

- **Free tier**: 15 requests per minute
- **Paid**: ~$0.01 per request
- **Typical session**: $0.05 - $0.20

Much cheaper than human developer time! 🎉

## 🔐 Security Notes

1. **.env is gitignored** - Your key won't be committed
2. **Client-side only** - For prototypes, not production
3. **No PII collection** - AI doesn't store user data
4. **Rate limited** - Can't be abused

## 🎨 UI Features

- **Slide-in panel** - Opens from right side
- **Chat interface** - Natural conversation
- **Action previews** - See what it will do
- **Quick suggestions** - Context-aware prompts
- **Execute button** - One-click to apply changes
- **Loading states** - Visual feedback
- **Error handling** - Clear error messages

## 🚧 Limitations (Current)

1. **Custom components** - Can't create new React components yet
2. **Complex CSS** - Limited custom styling
3. **File operations** - Can't manage assets directly
4. **Drag positioning** - Can't set exact pixel positions

These will be added in future updates!

## 🎯 Next Steps

Try these to get started:

1. Open AI Assistant (click the button)
2. Try: "Create a hero section with our restaurant name"
3. Execute the action
4. Try: "Add a menu grid below it"
5. Ask: "How do I make it responsive?"

## 📚 Advanced Usage

### Conversation Context

The AI remembers your conversation, so you can:
- "Make it bigger" (refers to last component)
- "Change its color to blue" (knows what "it" is)
- "Add another one" (creates similar component)

### Batch Operations

You can request multiple actions:
- "Create a complete homepage" → Adds hero, menu, about, contact
- "Update all headings to use serif font" → Batch update

### Smart Suggestions

Empty page shows:
- "Create a hero section with our restaurant name"
- "Add a menu grid with three columns"
- "Create a contact form"
- "Add business hours and location"

## 🤝 Contributing

Want to improve the AI assistant?

1. Edit `/utils/aiService.ts` - AI prompt and logic
2. Edit `/types/ai.ts` - Action types and interfaces
3. Edit `/utils/aiActionExecutor.ts` - Action execution
4. Edit `/components/AIAssistant.tsx` - UI components

## 📄 License

Same as the main project.

---

**Enjoy building with AI!** 🚀

If you have questions or issues, check the console logs for detailed error messages.
