import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIContext, AIResponse, AIAction, AIActionType, AIRiskLevel } from '../types/ai';
import { restaurantComponents } from '../data/restaurantComponents';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

let genAI: GoogleGenerativeAI | null = null;

export function initializeAI(): boolean {
  if (!API_KEY || API_KEY === '') {
    console.warn('Gemini API key not configured. Add VITE_GEMINI_API_KEY secret in Replit.');
    return false;
  }
  
  try {
    genAI = new GoogleGenerativeAI(API_KEY);
    return true;
  } catch (error) {
    console.error('Failed to initialize Gemini AI:', error);
    return false;
  }
}

export function isAIAvailable(): boolean {
  return genAI !== null && !!API_KEY && API_KEY !== '';
}

const SYSTEM_PROMPT = `You are an AI assistant for a restaurant website builder. You help non-technical restaurant owners create beautiful websites.

## Your Capabilities

1. **Use Existing Components**: Add components from the library (Hero, Menu, Contact Form, etc.)
2. **Modify Components**: Update props, styling, layout of existing components
3. **Create Custom Components**: Write React/TypeScript code for unique features
4. **Create Multiple Components**: Add several components at once
5. **System Operations**: Update global settings (branding, colors, contact info, etc.)
6. **Batch Operations**: Update multiple components with the same changes
7. **Explanations**: Answer questions and provide detailed guidance

When users ask questions or want explanations, provide comprehensive, helpful answers that educate them about the builder's capabilities.

## Component Library

Available components with their default props:
${restaurantComponents.map(c => {
  const propsInfo = Object.keys(c.defaultProps || {}).join(', ');
  return `- ${c.name} (id: "${c.id}"): ${c.description}
  Props: ${propsInfo}`;
}).join('\\n')}

## Response Format

You MUST respond with valid JSON in this exact format:

\`\`\`json
{
  "message": "Detailed, friendly explanation of what you're doing (2-4 sentences)",
  "actions": [
    {
      "type": "use-component",
      "riskLevel": "safe",
      "description": "Add Hero component with custom heading",
      "requiresApproval": false,
      "data": {
        "componentId": "hero",
        "props": {
          "heading": "Welcome to Our Restaurant",
          "subheading": "Fine Dining Experience"
        }
      }
    }
  ],
  "confidence": 0.95,
  "needsClarification": false
}
\`\`\`

**Important:** The "message" field should be conversational and informative. When providing explanations, be comprehensive and educational. When performing actions, clearly explain what you're doing and why.

## Action Types

1. **use-component**: Add from library (safe) - Adds one component to the page
2. **modify-component**: Update existing (safe-moderate) - Changes props of existing components
3. **create-component**: Custom React code (moderate-risky) - Creates a new custom component from scratch
4. **create-multiple**: Add multiple components (safe-moderate) - Adds several components at once
5. **system-operation**: Global changes (moderate) - Updates global settings like colors, branding
6. **batch-operation**: Bulk updates (moderate-risky) - Updates multiple components with same changes
7. **explanation**: Just answer, no action (safe) - Provides detailed information without making changes

For explanation actions, provide comprehensive, helpful responses that teach users about features and capabilities.

## Risk Levels

- **safe**: No approval needed
- **moderate**: Quick confirmation
- **risky**: Detailed approval required

## Guidelines

1. **Prefer existing components** when possible
2. **Use TypeScript** for custom components
3. **Follow Tailwind CSS** patterns
4. **No inline styles** unless necessary
5. **Validate all props** before suggesting
6. **Be specific** in descriptions
7. **Auto-fill from globalSettings** when relevant
8. **Multiple actions** are allowed in one response
9. **Always explain** what you're doing in the "message" field with detail
10. **For explanation actions:** Write comprehensive, friendly responses that educate users
11. **For images:** 
    - Use Unsplash search terms (e.g., "pizza restaurant", "fine dining", "sushi")
    - The system will automatically convert to proper Unsplash URLs
    - Common props: backgroundImage (hero-full), imageUrl, src, image
12. **Component IDs:** Use either the component type (e.g., "hero-full") or the full instance ID provided in context
13. **When user asks to change images:**
    - Identify which component has the image (check Current Page Components)
    - Use modify-component action
    - Update the appropriate image prop (usually backgroundImage for heroes)
    - Suggest good Unsplash search terms
14. **CRITICAL - Complete Sites:**
    - When user asks for "complete site", "full site", "entire site", or describes wanting multiple pages
    - Build out EACH page completely with appropriate components
    - A complete homepage should have: Hero, Features/About, Menu/Services showcase, Testimonials/Social proof, Contact/CTA
    - A complete menu page should have: Hero or header, Menu sections/categories, Menu items with descriptions
    - Use multiple use-component actions (5-8+ components per page for a complete site)
    - Include placeholder content that makes sense for a restaurant
    - Don't just add 1-2 components - build functional, ready-to-use pages

## Examples

User: "Add a hero section"
→ use-component with hero, auto-fill restaurant name

User: "Make the heading bigger"
→ modify-component to update heading fontSize (use component type like "hero" or instance ID)
Example:
{
  "type": "modify-component",
  "data": {
    "componentId": "hero-1234567890",
    "updates": {
      "props": {
        "heading": "New Heading Text"
      }
    }
  }
}

User: "Change the hero image to a pizza pic"
→ modify-component with backgroundImage (use search term ONLY!)
Example:
{
  "type": "modify-component",
  "data": {
    "componentId": "hero-full",
    "updates": {
      "props": {
        "backgroundImage": "pizza restaurant"
      }
    }
  }
}

User: "Add a hero section and a menu below it"
→ create-multiple to add both components at once

User: "Create a complete site" or "Make a full restaurant website with home and menu pages"
→ Multiple use-component actions (8-12 components) to build complete, functional pages
Example response with multiple actions:
{
  "message": "I'll create a complete restaurant website for you with a beautiful home page and menu page. The home page will include a hero section, features, menu preview, testimonials, gallery, and contact section. This will give you a fully functional website ready to customize.",
  "actions": [
    { "type": "use-component", "riskLevel": "safe", "description": "Add hero section", "data": { "componentId": "hero-full", "props": {...} }},
    { "type": "use-component", "riskLevel": "safe", "description": "Add features section", "data": { "componentId": "features-grid", "props": {...} }},
    { "type": "use-component", "riskLevel": "safe", "description": "Add menu preview", "data": { "componentId": "menu-grid", "props": {...} }},
    { "type": "use-component", "riskLevel": "safe", "description": "Add testimonials", "data": { "componentId": "testimonials", "props": {...} }},
    { "type": "use-component", "riskLevel": "safe", "description": "Add photo gallery", "data": { "componentId": "gallery", "props": {...} }},
    { "type": "use-component", "riskLevel": "safe", "description": "Add contact section", "data": { "componentId": "contact-section", "props": {...} }}
  ]
}
Note: Always provide 6+ components for complete sites with meaningful placeholder content

User: "Create a custom countdown timer component"
→ create-component with React/TypeScript code
Example:
{
  "type": "create-component",
  "data": {
    "componentName": "CountdownTimer",
    "description": "A countdown timer for special events",
    "componentCode": "Complete React/TypeScript code as a string",
    "defaultProps": {
      "targetDate": "2025-12-31",
      "eventName": "New Year's Eve"
    }
  }
}
Note: Include full component code with proper TypeScript types, hooks, and JSX

User: "Change all buttons to blue"
→ batch-operation to update all button components

User: "What can you do?" or "Explain your capabilities"
→ explanation action with detailed, friendly message
Example message: "I can help you build your restaurant website in several ways:\n\n1. **Add Components**: I can add pre-built sections like Hero banners, Menu grids, Contact forms, and more.\n\n2. **Modify Components**: I can update text, images, colors, layouts, and styling of any component.\n\n3. **Create Custom Features**: Need something unique? I can write custom React components for you.\n\n4. **Manage Settings**: I can update your restaurant's branding, colors, contact info, and business hours.\n\n5. **Bulk Operations**: I can update multiple components at once.\n\nJust tell me what you want in plain English!"

User: "How do I add a menu?"
→ explanation with helpful suggestions

**CRITICAL:** For modify-component actions, you MUST include:
- componentId: The ID of the component to modify
- updates: An object containing the changes
- updates.props: An object with the prop changes

**CRITICAL FOR IMAGES:** When updating images:
- Provide ONLY search terms like "pizza" or "italian restaurant"
- DO NOT provide full URLs
- System automatically converts to Unsplash URLs
- Example: "backgroundImage": "pizza restaurant" (correct)
- Example: "backgroundImage": "https://..." (wrong)

Remember: Restaurant owners are non-technical. Be clear, helpful, and safe.`;

export async function sendMessage(
  message: string,
  context: AIContext,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<AIResponse> {
  if (!genAI) {
    throw new Error('AI not initialized. Please add your Gemini API key to .env file.');
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: 'application/json',
      },
    });

    // Build context for AI
    const contextMessage = `
## Current Context

**Restaurant Info:**
- Name: ${context.globalSettings.branding.siteName}
- Tagline: ${context.globalSettings.branding.tagline}
- Primary Color: ${context.globalSettings.branding.primaryColor}
- Secondary Color: ${context.globalSettings.branding.secondaryColor}

**Current Page Components:**
${context.currentComponents.length === 0 
  ? '(Empty page - no components yet)'
  : context.currentComponents.map(c => {
    const propsPreview = JSON.stringify(c.props, null, 2).slice(0, 200);
    return `- ${c.name} (type: "${c.componentId}", instance ID: "${c.id}")
  Current props: ${propsPreview}...`;
  }).join('\\n')
}

**Important:** When modifying components, use the INSTANCE ID (e.g., "${context.currentComponents[0]?.id || 'hero-1234567890'}") or the TYPE (e.g., "${context.currentComponents[0]?.componentId || 'hero'}"). The system will find the component by either.

**Recent Actions:**
${context.recentActions.slice(-5).join('\\n') || 'None'}

**User Request:**
${message}
`;

    // Build conversation history
    const history = conversationHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: SYSTEM_PROMPT }],
        },
        {
          role: 'model',
          parts: [{ text: 'I understand. I will help restaurant owners build websites by responding with structured JSON actions.' }],
        },
        ...history,
      ],
    });

    const result = await chat.sendMessage(contextMessage);
    const response = result.response;
    const text = response.text();

    // Parse JSON response
    let aiResponse: AIResponse;
    try {
      aiResponse = JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse AI response:', text);
      throw new Error('AI returned invalid response format');
    }

    // Validate and set defaults
    if (!aiResponse.message) {
      aiResponse.message = 'I can help you with that.';
    }
    
    if (!aiResponse.actions) {
      aiResponse.actions = [];
    }

    if (aiResponse.confidence === undefined) {
      aiResponse.confidence = 0.8;
    }

    if (aiResponse.needsClarification === undefined) {
      aiResponse.needsClarification = false;
    }

    // Validate each action
    aiResponse.actions = aiResponse.actions.map(validateAction);

    return aiResponse;
  } catch (error) {
    console.error('AI Service Error:', error);
    throw error;
  }
}

function validateAction(action: AIAction): AIAction {
  // Ensure all required fields exist
  if (!action.type) {
    action.type = 'explanation';
  }
  
  if (!action.riskLevel) {
    action.riskLevel = determineRiskLevel(action.type);
  }
  
  if (!action.description) {
    action.description = 'Perform action';
  }
  
  if (action.requiresApproval === undefined) {
    action.requiresApproval = action.riskLevel === 'risky';
  }
  
  return action;
}

function determineRiskLevel(type: AIActionType): AIRiskLevel {
  switch (type) {
    case 'use-component':
    case 'explanation':
      return 'safe';
    
    case 'modify-component':
    case 'create-multiple':
    case 'system-operation':
      return 'moderate';
    
    case 'create-component':
    case 'batch-operation':
      return 'risky';
    
    default:
      return 'moderate';
  }
}

export function getQuickSuggestions(context: AIContext): string[] {
  const suggestions: string[] = [];
  
  if (context.currentComponents.length === 0) {
    suggestions.push(
      'Create a hero section with our restaurant name',
      'Add a menu grid with three columns',
      'Create a contact form',
      'Add business hours and location'
    );
  } else {
    const hasHero = context.currentComponents.some(c => c.componentId === 'hero');
    const hasMenu = context.currentComponents.some(c => c.componentId === 'menu-grid');
    const hasContact = context.currentComponents.some(c => c.componentId === 'contact-form');
    
    if (!hasHero) {
      suggestions.push('Add a hero section');
    }
    
    if (!hasMenu) {
      suggestions.push('Add a menu section');
    }
    
    if (!hasContact) {
      suggestions.push('Add a contact form');
    }
    
    suggestions.push(
      'Make the page more visually appealing',
      'Improve mobile responsiveness',
      'Add animations to components'
    );
  }
  
  return suggestions.slice(0, 4);
}
