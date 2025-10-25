# AI Assistant - Technical Architecture

## Overview

The AI assistant uses Google's Gemini 2.0 Flash model to understand natural language requests and generate structured actions that modify the website builder state.

## Architecture Diagram

```
User Input
    ↓
AIAssistant Component (UI)
    ↓
useAI Hook (State Management)
    ↓
aiService.ts (Gemini API)
    ↓
AI Response (JSON)
    ↓
aiActionExecutor.ts (Validation & Execution)
    ↓
App State Update
    ↓
UI Re-render
```

## Core Components

### 1. Types (`/types/ai.ts`)

Defines all AI-related TypeScript interfaces:

- **AIActionType**: 7 action types (use-component, modify-component, etc.)
- **AIRiskLevel**: safe, moderate, risky
- **AIAction**: Structure for each action
- **AIMessage**: Chat message format
- **AIContext**: Context sent to AI

### 2. AI Service (`/utils/aiService.ts`)

**Responsibilities:**
- Initialize Gemini API client
- Build system prompt with context
- Send messages to Gemini
- Parse JSON responses
- Validate actions

**Key Functions:**
- `initializeAI()` - Setup API client
- `isAIAvailable()` - Check if configured
- `sendMessage()` - Send to Gemini with context
- `getQuickSuggestions()` - Context-aware prompts

**System Prompt:**
The prompt tells Gemini:
- Available components from library
- Current page state
- Response format (strict JSON)
- Action types and risk levels
- Guidelines for safe operations

### 3. Action Executor (`/utils/aiActionExecutor.ts`)

**Responsibilities:**
- Execute validated actions
- Handle all 7 action types
- Call appropriate App.tsx handlers
- Show toast notifications

**Action Types:**

1. **use-component**: `onDrop()` existing component
2. **modify-component**: `onUpdateComponent()` with new props
3. **create-component**: Dynamic React component (future)
4. **create-multiple**: Loop `onDrop()` multiple times
5. **system-operation**: `onUpdateGlobalSettings()`
6. **batch-operation**: Bulk updates/deletes
7. **explanation**: No action, just answer

### 4. AI Hook (`/hooks/useAI.ts`)

**Responsibilities:**
- Manage message history
- Track conversation state
- Handle loading states
- Mark actions as executed/failed

**State:**
- `messages[]` - Chat history
- `isLoading` - Waiting for AI
- `isAvailable` - API key configured
- `recentActions[]` - For context

### 5. UI Component (`/components/AIAssistant.tsx`)

**Responsibilities:**
- Slide-in chat panel
- Message bubbles (user/assistant)
- Action cards with risk badges
- Execute button
- Quick suggestions
- Error handling

**Features:**
- Auto-scroll to bottom
- Enter to send, Shift+Enter for newline
- Loading spinners
- Risk color coding
- Success/error states

## Data Flow

### 1. User Sends Message

```typescript
User types: "Create a hero section"
    ↓
AIAssistant.onSendMessage()
    ↓
useAI.sendMessage()
    ↓
aiService.sendMessage()
```

### 2. Build Context

```typescript
AIContext = {
  componentLibrary: [...], // Available components
  currentComponents: [...], // What's on page
  globalSettings: {...},   // Restaurant info
  recentActions: [...]     // Recent history
}
```

### 3. Send to Gemini

```typescript
const prompt = `
${SYSTEM_PROMPT}
${contextMessage}
${conversationHistory}
`

const response = await model.generateContent(prompt)
```

### 4. Parse Response

```typescript
const aiResponse: AIResponse = {
  message: "I'll create a hero section...",
  actions: [
    {
      type: "use-component",
      riskLevel: "safe",
      description: "Add Hero component",
      requiresApproval: false,
      data: {
        componentId: "hero",
        props: { heading: "My Restaurant" }
      }
    }
  ],
  confidence: 0.95,
  needsClarification: false
}
```

### 5. Display in UI

```typescript
AIMessage = {
  role: "assistant",
  content: "I'll create a hero section...",
  actions: [...],
  executed: false
}

// Shows execute button
```

### 6. User Clicks Execute

```typescript
App.handleExecuteAIActions()
    ↓
executeActions(actions, context)
    ↓
For each action:
  - executeUseComponent()
  - Call context.onDrop()
  - Toast notification
    ↓
App state updates
    ↓
UI re-renders
```

## Security & Validation

### Input Validation

1. **API Key**: Checked on initialization
2. **Message Length**: Limited by Gemini
3. **Rate Limiting**: Gemini's built-in limits

### Action Validation

1. **Type Checking**: Validate action types
2. **Component Existence**: Check library
3. **Risk Level**: Auto-determine based on type
4. **Approval Required**: Flag risky operations

### Code Safety (Future)

For custom component creation:
1. TypeScript compilation check
2. No dangerous APIs (eval, innerHTML)
3. Import whitelist
4. Sandbox execution

## Context Management

### What AI Knows

**Always:**
- Available components (id, name, description, props)
- Current page components (id, type, props)
- Restaurant info (name, colors, etc.)
- Recent actions (last 5)

**Never:**
- User's personal data
- File system outside project
- Other pages (unless explicitly shared)
- Previous sessions (stateless)

### Context Size

- Component library: ~500 tokens
- Current page: ~200 tokens per component
- Global settings: ~100 tokens
- System prompt: ~1000 tokens
- **Total**: ~2000-3000 tokens per request

## Error Handling

### Levels

1. **AI Service Error**: API key, network, rate limit
   - Show "AI not available" message
   - Suggest checking API key

2. **Parse Error**: Invalid JSON response
   - Show "AI returned invalid response"
   - Log raw response for debugging

3. **Execution Error**: Action fails
   - Show specific error message
   - Don't crash the app
   - Mark action as failed

### User Feedback

- **Loading**: Spinner + "AI is thinking..."
- **Success**: Green checkmark + "Executed successfully"
- **Error**: Red icon + specific error message
- **Warning**: Yellow icon for risky operations

## Performance

### Optimization

1. **Debouncing**: Not implemented (send immediately)
2. **Caching**: Gemini handles caching
3. **Context Pruning**: Only send relevant data
4. **Lazy Loading**: AI loaded on demand

### Response Times

- **Gemini 2.0 Flash**: 1-3 seconds typical
- **Simple requests**: <1 second
- **Complex requests**: 2-5 seconds

## Cost Management

### Gemini 2.0 Flash Pricing

- **Free tier**: 15 requests/minute, 1500/day
- **Input**: $0.075 per 1M tokens
- **Output**: $0.30 per 1M tokens

### Typical Costs

- Request: 2000 input + 300 output = ~$0.0003
- 100 requests = $0.03
- 1000 requests = $0.30

Very affordable! 🎉

## Future Enhancements

### Phase 1 (MVP) ✅
- [x] Basic chat UI
- [x] Use existing components
- [x] Modify components
- [x] System operations
- [x] Batch operations

### Phase 2 (Coming Soon)
- [ ] Custom component creation
- [ ] Visual preview before execution
- [ ] Undo integration (auto-undo if user says "not what I wanted")
- [ ] Learning from corrections
- [ ] Multi-page operations

### Phase 3 (Advanced)
- [ ] Voice input
- [ ] Image-to-component (describe a screenshot)
- [ ] A/B testing suggestions
- [ ] SEO recommendations
- [ ] Accessibility analysis
- [ ] Performance optimization

## API Integration

### Gemini Configuration

```typescript
const model = genAI.getGenerativeModel({ 
  model: 'gemini-2.0-flash-exp',
  generationConfig: {
    temperature: 0.7,      // Balanced creativity
    topP: 0.95,            // Token selection
    topK: 40,              // Limit choices
    maxOutputTokens: 8192, // Max response length
    responseMimeType: 'application/json', // Force JSON
  },
});
```

### Why Gemini?

1. **JSON Mode**: Native structured output
2. **Fast**: 2.0 Flash optimized for speed
3. **Affordable**: Much cheaper than GPT-4
4. **Long Context**: Handles large component libraries
5. **Multimodal**: Future image support

## Testing Strategy

### Manual Testing

1. **Empty page**: Try all quick suggestions
2. **Existing content**: Modify components
3. **Complex requests**: Multi-step operations
4. **Edge cases**: Invalid requests
5. **Error handling**: Invalid API key

### Automated Testing (Future)

- Unit tests for action executor
- Integration tests for full flow
- Mock Gemini responses
- Snapshot tests for UI

## Debugging

### Enable Debug Logs

```typescript
// In aiService.ts
console.log('Sending to AI:', contextMessage);
console.log('AI Response:', response);
```

### Common Issues

1. **Empty actions array**: AI couldn't understand
   - Check system prompt
   - Try more specific request

2. **Invalid component ID**: AI hallucinated
   - Add validation
   - Update system prompt with exact IDs

3. **Props mismatch**: Wrong prop names
   - Include prop schemas in context
   - Validate props before execution

## Summary

The AI assistant is a **structured action system** that:
1. Takes natural language input
2. Converts to validated actions
3. Executes through existing App.tsx handlers
4. Maintains safety and reversibility

It's **not** a freeform code generator - it follows strict patterns and types to ensure safety and consistency.

This makes it perfect for non-technical users who want AI assistance without the risk of breaking their site! 🎯
