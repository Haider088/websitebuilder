# How Containers Work - Complete Guide

## What Are Containers?

**Containers** are special layout components that can hold other components as children. They allow you to:

1. **Arrange components side-by-side** (Row Container)
2. **Create grid layouts** with 2, 3, or 4 columns (Grid Container)  
3. **Build complex layouts** without full freeform positioning

Think of containers like **boxes that hold other components**, similar to how a folder holds files.

## Available Container Types

### 1. Row Container (⬌)
- **Best for**: Side-by-side layouts, horizontal arrangements
- **Example uses**:
  - Two images next to each other (50/50 split)
  - Text on left, image on right (33/66 split)
  - Three buttons in a row
  
### 2. Grid Container (▦)
- **Best for**: Multi-column layouts, card grids, galleries
- **Configurable**: 2, 3, or 4 columns
- **Example uses**:
  - Three-column feature section
  - Four-column image gallery
  - Two-column menu items

### 3. Two Column / Three Column
- **Best for**: Quick pre-configured layouts
- **Pre-set** to 2 or 3 columns automatically

## How To Use Containers (Step-by-Step)

### Step 1: Add a Container to Your Page

1. Open **Component Library** (left panel)
2. Click on **Layout** category
3. **Drag** "Row Container" or "Grid Container" onto the canvas
4. You'll see a gray box with "Drop components here"

### Step 2: Add Components INTO the Container

This is the key step that many users miss!

1. From the Component Library, **drag any component** (e.g., Text Block, Image, Button)
2. **Hover over the container** - you'll see a **blue ring** appear around it
3. **Release** to drop the component INTO the container
4. The component is now a **child** of the container

> **Important**: You must see the blue ring when hovering! If you don't see it, the component will be added to the page instead of the container.

### Step 3: Add More Components

1. Repeat Step 2 to add more components
2. For **Row Containers**: Components will appear side-by-side
3. For **Grid Containers**: Components will fill the grid columns

### Step 4: Configure the Container

1. **Click on the container** (not the child components)
2. Open the **Layout tab** in Property Inspector (right panel)
3. You'll see **Container Layout** section (only visible for containers!)

**Container Settings:**
- **Grid Columns** (Grid only): 2, 3, or 4 columns
- **Align Items**: Vertical alignment (start, center, end, stretch)
- **Justify Content**: Horizontal distribution (start, center, end, between, around, evenly)
- **Wrap** (Row only): Allow components to wrap to next line
- **Gap**: Space between child components

### Step 5: Configure Child Components

1. **Click on a component INSIDE the container**
2. Open the **Layout tab**
3. You'll see **Width & Sizing** section (only for nested components!)

**Child Settings:**
- **Width**: Auto, 25%, 33%, 50%, 66%, 75%, 100%, Custom
- **Flex Grow**: How much it grows to fill space (0-10)
- **Flex Shrink**: How much it shrinks when space is tight (0-10)

## Visual Indicators

| What You See | What It Means |
|--------------|---------------|
| Gray dashed box with "Drop components here" | Empty container waiting for components |
| Blue ring around container when dragging | Ready to accept drop - release now! |
| Gray dashed columns in Two/Three Column | Empty column slots |
| Indented item in Layers panel with "└" | Nested component inside a container |
| "(nested)" label in Layers | Component is a child of a container |

## Common Layouts & How to Build Them

### 50/50 Split (Image + Text)

```
1. Add Row Container
2. Drag Image into container → drop when blue ring appears
3. Drag Text Block into container
4. Select first image → Layout tab → Width: 50%
5. Select text block → Layout tab → Width: 50%
```

### Three Equal Cards

```
1. Add Grid Container
2. In Layout tab → Grid Columns: 3
3. Drag three Card/Text components into container
4. They auto-distribute evenly!
```

### 33% Sidebar + 66% Content

```
1. Add Row Container
2. Drag sidebar component → Layout tab → Width: 33%
3. Drag main content → Layout tab → Width: 66%
```

### Overlapping Images (Offset Effect)

```
1. Add Row Container
2. Add two images
3. Select second image → Layout tab:
   - Offset Y: 50 (moves down 50px)
   - Z-Index: 2 (appears on top)
```

## Troubleshooting

### "I dragged a component but it's not in the container!"

**Problem**: You didn't see the blue ring, so it was added to the page instead.

**Solution**: 
1. Delete the component (select it, press Delete)
2. Try again, but this time **wait for the blue ring** before releasing
3. Make sure you're hovering directly over the container

### "I can't select/edit components inside a container"

**Problem**: This was a bug that's now fixed!

**Solution**: 
- Components inside containers are now fully selectable
- Click on them in the canvas OR in the Layers panel
- Look for the indented items in Layers panel

### "Components are stacking vertically instead of side-by-side"

**Problem**: You're using Grid Container with 1 column, or Row Container with wrap enabled.

**Solution**:
1. Select the container
2. Layout tab → make sure it's **Row Container** (not Grid)
3. If Row: check that **Wrap** is OFF
4. If Grid: check **Grid Columns** is set to 2 or more

### "The Layout tab doesn't show Container settings"

**Problem**: You have a child component selected, not the container.

**Solution**:
1. Click on the container itself (the outer box)
2. OR go to Layers panel and select the parent container
3. Look for "Container Layout" section in Layout tab

### "I want to remove a component from a container"

**Current limitation**: You can't move components out of containers yet.

**Workaround**:
1. Note the component's settings
2. Delete it from the container
3. Add a new one to the page
4. Reconfigure it

## Best Practices

1. **Plan your layout first** - sketch out containers before building
2. **Use Gap instead of margins** - easier to manage spacing between children
3. **Lock containers** - after setup, lock them to prevent accidental changes
4. **Name your containers** - helps identify them in Layers panel
5. **Test responsive** - switch device preview to see how it adapts

## Technical Details

### How Components Are Stored

```javascript
{
  id: 'row-container-123',
  componentId: 'row-container',
  name: 'Row Container',
  children: [
    {
      id: 'text-block-456',
      name: 'Text Block',
      parentId: 'row-container-123',  // References parent
      // ... other props
    },
    {
      id: 'image-789',
      name: 'Image',
      parentId: 'row-container-123',
      // ... other props
    }
  ]
}
```

### Selection & Updates

- The app now uses **recursive search** to find nested components
- Layers panel shows **flattened hierarchy** with indentation
- Updates work on components at **any depth**
- Deletion removes components **recursively**

## FAQ

**Q: Can I nest containers inside containers?**  
A: Yes! You can put a Row Container inside a Grid Container, for example.

**Q: How many components can I put in a container?**  
A: No limit, but performance may degrade with 50+ components.

**Q: Can I reorder components inside a container?**  
A: Not yet - they appear in the order you added them.

**Q: Do containers work on mobile?**  
A: Yes! Use the Responsive tab to change layout on mobile (e.g., stack instead of row).

**Q: Can I change the background color of a container?**  
A: Yes! Select the container → Style tab → Background Color.

**Q: Why do I see "Drop components here" instead of my content?**  
A: The container is empty. Drag components into it!

## Next Steps

1. Try creating a simple two-column layout
2. Experiment with Grid Container for a card layout
3. Use Offset controls to create overlapping effects
4. Combine containers for complex layouts
5. Check the Layout tab for all available options

---

**Still having trouble?** Check that:
- ✅ You're seeing the blue ring when dropping
- ✅ Components show "(nested)" in Layers panel
- ✅ You're selecting the container (not children) to edit layout settings
- ✅ You're using Layout tab (not Style tab) for positioning controls
