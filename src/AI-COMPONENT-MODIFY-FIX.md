# AI Component Modification - Fix Applied

## Problem

When users asked the AI to modify components (e.g., "change the hero image to a pizza pic"), the AI would fail with:

```
Component not found: hero-full
```

## Root Cause

The AI was trying to find components by their **component type** (e.g., `hero-full`) but the system was only searching by **instance ID** (e.g., `hero-full-1734567890`).

### How Components Work

Each component on the canvas has TWO identifiers:

1. **componentId** (type): `"hero-full"` - What kind of component it is
2. **id** (instance): `"hero-full-1734567890"` - The unique instance on the page

When you drag a Hero component onto the canvas, it creates an instance with:
- `componentId: "hero-full"` (the type)
- `id: "hero-full-1734567890"` (unique timestamp-based ID)

## Solution

Updated the AI action executor to search in two ways:

### 1. Updated `executeModifyComponent` Function

```typescript
// First try to find by instance ID
let component = findComponentRecursive(currentPage.components, data.componentId);

// If not found, try to find by componentId (type)
if (!component) {
  component = findComponentByComponentId(currentPage.components, data.componentId);
}
```

### 2. Added Helper Functions

**`findComponentByComponentId`** - Finds component by type (e.g., "hero-full")
**`getAllComponentInfo`** - Lists all components for better error messages

### 3. Improved AI Context

The AI now receives detailed component information:

```
Current Page Components:
- Hero - Full Width (type: "hero-full", instance ID: "hero-full-1734567890")
  Current props: {"title": "Welcome", "backgroundImage": "restaurant hero"}...
```

### 4. Enhanced System Prompt

Added specific guidance for:
- Component identification (use type OR instance ID)
- Image prop names (`backgroundImage`, `imageUrl`, etc.)
- Unsplash image handling
- Component prop documentation in library listing

## How It Works Now

### User Request
```
"Change the hero image to a pizza pic"
```

### AI Response
```json
{
  "message": "I'll update the hero section with a pizza image.",
  "actions": [
    {
      "type": "modify-component",
      "riskLevel": "safe",
      "description": "Update hero background to pizza image",
      "data": {
        "componentId": "hero-full",  // Can use type...
        // OR
        "componentId": "hero-full-1734567890",  // ...or instance ID
        "updates": {
          "props": {
            "backgroundImage": "pizza restaurant"
          }
        }
      }
    }
  ]
}
```

### Execution Flow

1. **Executor receives**: `componentId: "hero-full"`
2. **First search**: Try to find by instance ID → Not found
3. **Second search**: Try to find by component type → Found! `hero-full-1734567890`
4. **Update**: Call `onUpdateComponent("hero-full-1734567890", { backgroundImage: "pizza restaurant" })`
5. **Success**: Component updated ✅

## Better Error Messages

If component still not found, you'll see:

```
Component not found. Looking for: "hero-full". 
Available components: Hero - Full Width (type: hero-full, id: hero-full-1734567890), 
Menu Grid (type: menu-grid, id: menu-grid-1734567891)
```

This helps debug exactly what went wrong.

## Common Image Modifications

### Hero Background
```typescript
{
  "componentId": "hero-full",
  "updates": {
    "props": {
      "backgroundImage": "pizza restaurant"  // Unsplash search term
    }
  }
}
```

### Gallery Images
```typescript
{
  "componentId": "image-gallery",
  "updates": {
    "props": {
      "images": [
        "italian pasta",
        "wine and cheese",
        "dessert platter"
      ]
    }
  }
}
```

### Menu Item Image
```typescript
{
  "componentId": "menu-grid",
  "updates": {
    "props": {
      "imageUrl": "gourmet burger"
    }
  }
}
```

## Testing

Try these prompts:

✅ "Change the hero image to a pizza pic"
✅ "Make the hero background show a sushi restaurant"
✅ "Update the image to show fine dining"
✅ "Change the background to a close-up of pasta"

## Files Modified

1. **`/utils/aiActionExecutor.ts`**
   - Updated `executeModifyComponent` to search by type
   - Added `findComponentByComponentId` helper
   - Added `getAllComponentInfo` for debugging
   - Better error messages

2. **`/utils/aiService.ts`**
   - Enhanced component context with both type and instance ID
   - Added component prop documentation to library listing
   - Improved guidelines for image handling
   - Added example for image modification

## What This Fixes

✅ Component modification by type (e.g., "hero-full")
✅ Component modification by instance ID (e.g., "hero-full-1734567890")
✅ Better error messages when component not found
✅ AI understands component prop names
✅ AI knows which props are for images

## What Still Works

✅ Adding new components
✅ Creating multiple components
✅ System operations (global settings)
✅ Batch operations
✅ Explanations

---

**Status**: FIXED ✅

The AI can now modify components by either their type or instance ID, and provides much better error messages when something goes wrong.
