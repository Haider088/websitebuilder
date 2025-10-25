# AI Assistant Quick Reference

## What Can the AI Do?

### ✅ Working Features

| Feature | What It Does | Example Request | Execute Button? |
|---------|-------------|-----------------|-----------------|
| **Use Component** | Adds library components to page | "Add a hero section" | ✅ Yes |
| **Modify Component** | Updates existing components | "Change the hero title" | ✅ Yes |
| **Create Multiple** | Adds several components at once | "Add hero and menu" | ✅ Yes |
| **System Operations** | Updates global settings | "Change primary color to red" | ✅ Yes |
| **Batch Operations** | Updates multiple components | "Make all buttons blue" | ✅ Yes |
| **Explanations** | Answers questions | "What can you do?" | ❌ No |

### ❌ Not Yet Working

| Feature | Status | Workaround |
|---------|--------|-----------|
| **Custom Components** | Planned | Use existing components creatively |
| **Move Operations** | In batch mode only | Manual reordering |
| **Custom CSS** | Manual editing | Edit `globals.css` directly |

---

## Common Requests

### Adding Content
```
✅ "Add a hero section"
✅ "Create a contact form"
✅ "Add 3 testimonial cards"
```

### Changing Content
```
✅ "Change the hero title to 'Welcome'"
✅ "Update hero image to pizza"
✅ "Make the menu 4 columns"
```

### Changing Images
```
✅ "Change hero background to pizza"
   → AI converts "pizza" to Unsplash URL
   
✅ "Update image to italian restaurant"
   → AI converts search term automatically
```

### Global Changes
```
✅ "Change primary color to brown"
✅ "Update restaurant name to 'Bella'"
✅ "Set phone to (555) 123-4567"
```

### Bulk Changes
```
✅ "Make all buttons blue"
✅ "Change all headings to larger size"
✅ "Delete all testimonial cards"
```

### Questions
```
✅ "What can you do?"
✅ "How do I add a menu?"
✅ "What components are available?"
   
Note: No execute button for these!
```

---

## Risk Levels

| Level | When | Color | Approval |
|-------|------|-------|----------|
| **Safe** 🟢 | Adding components, questions | Green | None |
| **Moderate** 🟡 | Modifying content, global settings | Yellow | Quick |
| **Risky** 🔴 | Batch deletes, custom code | Red | Detailed |

---

## Image Search Terms

When updating images, use descriptive search terms:

### Good Search Terms ✅
```
"pizza restaurant"
"italian food"
"fine dining interior"
"sushi platter"
"coffee shop ambiance"
```

### Bad Search Terms ❌
```
"food" (too generic)
"restaurant" (too broad)
"https://..." (don't use URLs)
```

### How It Works
```
You say: "pizza"
System creates: https://source.unsplash.com/1920x1080/?pizza
Result: Beautiful pizza image appears
```

---

## Component Properties

### Hero Components
```
Props you can change:
- heading
- subheading
- backgroundImage (use search term!)
- buttonText
- buttonLink
```

### Menu Components
```
Props you can change:
- columns (2, 3, or 4)
- items (array of menu items)
- showPrices
- showDescriptions
```

### Contact Forms
```
Props you can change:
- fields (array of form fields)
- submitText
- successMessage
- showLabels
```

---

## Troubleshooting

### Execute Button Not Showing
**Is it an explanation?** No execute needed! ✅

### "Component Not Found" Error
1. Make sure component exists on page
2. Check component name in Layers panel
3. Try using component type: "hero-full" or "menu-grid"

### Image Not Updating
1. Check console for 💾 log
2. Use search terms, not URLs
3. Verify component has `backgroundImage` prop
4. Click "View data" to see what AI generated

### Nothing Happens
1. Click the execute button!
2. Check for error messages
3. Look at console logs (F12)
4. Try rephrasing your request

---

## Examples by Use Case

### Setting Up a New Page
```
"Add a hero section, then a menu grid, 
then a testimonials section with 3 cards, 
and finally a contact form"
```

### Redesigning Colors
```
"Change the primary color to dark brown 
and secondary color to gold"
```

### Updating All Content
```
"Change the hero title to 'Bella Italia', 
update the hero image to italian restaurant, 
and change the tagline to 'Authentic Italian Cuisine'"
```

### Creating a Gallery
```
"Add a row container with 3 image cards inside it"
```

### Cleaning Up
```
"Delete all testimonial cards"
```

---

## Best Practices

### 1. Be Specific
❌ "Change the image"  
✅ "Change the hero background image to pizza"

### 2. One Task at a Time (or group related tasks)
❌ "Add hero, change colors, delete form, update menu"  
✅ "Add a hero section"  
✅ Then: "Change the hero background to pizza"

### 3. Use Search Terms for Images
❌ "backgroundImage": "https://unsplash.com/..."  
✅ "backgroundImage": "pizza restaurant"

### 4. Reference Components Clearly
❌ "Change the title"  
✅ "Change the hero title"

### 5. Check Results Before Next Request
Execute → Verify → Next request

---

## Keyboard Shortcuts

While using AI Assistant:
- `Enter` - Send message
- `Shift + Enter` - New line
- `Esc` - Close assistant (from canvas)

---

## Getting Help

1. **Ask the AI:** "How do I [task]?"
2. **View Action Data:** Click "View data" under actions
3. **Check Console:** Press F12, look for emoji logs
4. **Read Docs:** 
   - `/AI-CAPABILITIES.md` - Full capabilities
   - `/AI-DEBUGGING-GUIDE.md` - Troubleshooting
   - `/AI-QUICK-START.md` - Getting started

---

## API Key Setup

If you see "Setup Required":

1. Install package:
   ```bash
   npm install @google/generative-ai
   ```

2. Get free API key:
   https://aistudio.google.com/app/apikey

3. Create `.env` file:
   ```
   VITE_GEMINI_API_KEY=your_key_here
   ```

4. Restart dev server

See `INSTALL-AI.txt` for details.

---

## Quick Stats

- **Total Capabilities:** 6 working, 1 planned
- **Component Library:** 13+ components
- **Success Rate:** High when used correctly
- **Response Time:** 2-5 seconds typically
- **Cost:** Free with Gemini API key

---

## Tips for Best Results

### 🎯 Do:
- Use descriptive search terms for images
- Reference specific components by name
- Ask for clarification if unsure
- Review changes before making more
- Use "View data" to debug issues

### ❌ Don't:
- Ask for custom React components (not ready yet)
- Use full URLs for images
- Make vague requests
- Skip reading error messages
- Forget to click execute!

---

## Remember

**The AI is a tool to speed up your workflow, not replace your creativity!**

Use it to:
- Quickly add components ⚡
- Bulk update content 📝
- Try different color schemes 🎨
- Get suggestions 💡
- Learn the system 📚

You still have full control:
- Manual editing always available
- Undo/redo works everywhere
- Property inspector for fine-tuning
- Direct component manipulation
- Code export when ready

---

## Need More Help?

- **In-app:** Ask the AI "What can you do?"
- **Documentation:** Check `/guidelines/` folder
- **Console:** Press F12 for debug info
- **Community:** Share your experience!

Happy building! 🚀
