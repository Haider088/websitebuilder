# AI Assistant Debugging Guide

## Quick Diagnosis

### Note: Explanations Don't Need Execution
If you ask the AI to explain something (like "What can you do?"), you won't see an execute button - that's correct! Explanations provide information without making changes.

### When Actions Need Execution
When the AI says "Executed successfully" but nothing changes, follow these steps:

### 1. Check Browser Console (F12)

Look for these emoji indicators in the console:

- 🔧 **Action Starting** - Shows the data the AI is sending
- ✅ **Component Found** - Confirms the component exists
- 📝 **Updates** - Shows what properties will be changed  
- 💾 **Calling Update** - The update function is being called

### 2. View Action Data in UI

1. In the AI Assistant panel, click **"View data"** under the action
2. Check the JSON to see exactly what the AI is trying to do
3. Look for these fields:
   - `componentId`: Should match a component on your canvas
   - `updates.props`: Should contain the properties to change

### 3. Common Issues

#### ❌ **Component Not Found**
**Console shows:** "Component not found"
**Solution:** 
- Make sure you've added the component to the canvas first
- The AI can only modify existing components
- Try: "Add a hero section" first, then "change the hero image"

#### ❌ **Wrong Component ID**
**Console shows:** "Looking for: hero-full, Available: []"
**Solution:**
- The component hasn't been added to the page yet
- Add the component manually from the left panel
- Or ask AI to "add a hero section" first

#### ❌ **Image Not Updating**
**Check:**
1. Open browser DevTools → Console
2. Look for: `💾 Final updates object: { backgroundImage: "..." }`
3. The value should be a full Unsplash URL or search term
4. If it's missing, the AI didn't generate the right data

**Fix:**
- Hero Full Width uses `backgroundImage` prop
- Hero Split uses `imageUrl` prop
- Make sure the prop name matches

#### ❌ **Updates Object Empty**
**Console shows:** "No valid updates provided"
**Solution:**
- The AI generated an action but didn't include any actual changes
- This is an AI generation issue - try rephrasing your request
- Example: Instead of "update the hero", try "change the hero title to 'Welcome'"

### 4. Testing the Fix

To test if images work:

1. **Add a Hero manually:**
   - Drag "Hero - Full Width" from the left panel onto the canvas

2. **Test AI image change:**
   ```
   Ask: "Change the hero background image to a pizza image"
   ```

3. **Check console logs:**
   - Should see: 🔧 → ✅ → 📝 → 💾
   - If any step is missing, that's where it's failing

4. **Check the canvas:**
   - The hero image should update to show a pizza image

### 5. Manual Override

If the AI can't update it, you can do it manually:

1. Click on the Hero component in the canvas
2. Look at the right panel (Property Inspector)
3. Find the "Background Image" field
4. Enter either:
   - A search term: `pizza restaurant`
   - Or a full Unsplash URL: `https://images.unsplash.com/...`

### 6. Reporting Issues

If you find a bug, note:
- What you asked the AI to do
- The console logs (all 🔧 ✅ 📝 💾 messages)
- The action data (from "View data" button)
- Whether the component exists on the canvas
- What happened vs. what should happen

## Technical Details

### Image Conversion System

When you provide a search term like "pizza restaurant":

1. **AI generates:** `{ backgroundImage: "pizza restaurant" }`
2. **System converts to:** `https://source.unsplash.com/1920x1080/?pizza+restaurant`
3. **Component renders:** The hero shows a pizza restaurant image

### Component Search

The system finds components two ways:

1. **By instance ID:** `hero-full-1234567890` (exact match)
2. **By type:** `hero-full` (finds first match of that type)

If you have multiple heroes, it will update the first one it finds.

### Props Structure

The update system accepts:
```json
{
  "componentId": "hero-full-1234567890",
  "updates": {
    "props": {
      "title": "New Title",
      "backgroundImage": "pizza"
    },
    "spacing": { "padding": "large" },
    "interactions": { "hoverEffect": true }
  }
}
```

Most common updates go in `updates.props`.

## Need More Help?

Check the code at:
- `/utils/aiActionExecutor.ts` - Action execution logic
- `/utils/aiService.ts` - AI prompt and instructions
- `/components/CanvasComponent.tsx` - Component rendering
- `/data/restaurantComponents.ts` - Component definitions
