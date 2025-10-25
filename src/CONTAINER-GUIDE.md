# Container System User Guide

## Overview
The layout system now includes powerful container components that allow you to arrange components side-by-side, in grids, and with precise positioning control.

## Available Container Types

### 1. Row Container (⬌)
- **Purpose**: Arrange components horizontally (side-by-side)
- **Location**: Component Library > Layout section
- **Usage**: Drag from library onto canvas, then drag other components INTO the container

### 2. Grid Container (▦)
- **Purpose**: Arrange components in a multi-column grid (2, 3, or 4 columns)
- **Location**: Component Library > Layout section
- **Usage**: Drag from library onto canvas, configure columns in Layout tab

### 3. Two Column Layout (📊)
- **Purpose**: Pre-configured 2-column layout
- **Usage**: Drag components into the two columns shown

### 4. Three Column Layout
- **Purpose**: Pre-configured 3-column layout  
- **Usage**: Drag components into the three columns shown

## How to Use Containers

### Step 1: Add a Container
1. Open the **Component Library** (left panel)
2. Navigate to the **Layout** category
3. Drag a **Row Container** or **Grid Container** onto the canvas
4. You'll see a placeholder that says "Drop components here"

### Step 2: Add Components to Container
1. From the Component Library, drag any component (Hero, Text Block, Image, etc.)
2. Hover over the container - it will highlight with a blue ring when you can drop
3. Release to drop the component INTO the container
4. Repeat to add more components

### Step 3: Configure Layout
1. Select the container component
2. Open the **Layout** tab in the Property Inspector (right panel)
3. Configure:
   - **Grid Columns** (for grid containers): 2, 3, or 4 columns
   - **Align Items**: How children align vertically (start, center, end, stretch)
   - **Justify Content**: How children are distributed (start, center, end, between, around, evenly)
   - **Gap**: Spacing between children
   - **Wrap**: Whether items wrap to next line (row containers)

### Step 4: Configure Child Components
1. Select a component INSIDE a container
2. In the Layout tab, you'll see **Width & Sizing** controls:
   - **Width**: Auto, 25%, 33%, 50%, 66%, 75%, 100%, or Custom
   - **Flex Grow**: How much the component grows to fill space
   - **Flex Shrink**: How much the component shrinks when space is tight

## Layout Tab Controls

### Basic Layout (All Components)
- **Width**: Overall container width (sm, md, lg, xl, full)
- **Padding**: Internal spacing
- **Margin Top/Bottom**: External spacing
- **Center Horizontally**: Center the component
- **Full Height**: Make component fill viewport height

### Container Layout (For Containers Only)
- **Grid Columns**: Number of columns (grid containers)
- **Align Items**: Vertical alignment of children
- **Justify Content**: Horizontal distribution of children
- **Wrap Items**: Allow wrapping (row containers)

### Spacing (All Components)
- **Gap**: Space between children (for containers)
- **Margin Top/Bottom/Left/Right**: Individual margin controls (XS, SM, MD, LG, XL, 2XL)
- **Padding Top/Bottom/Left/Right**: Individual padding controls

### Width & Sizing (Components Inside Containers)
- **Width**: Set width as percentage or custom value
- **Custom Width**: Enter custom width (e.g., "300px", "20rem")
- **Flex Grow**: Expansion factor (0-10)
- **Flex Shrink**: Shrink factor (0-10)

### Position & Offset (All Components)
- **Offset X**: Move left/right in pixels (positive = right, negative = left)
- **Offset Y**: Move up/down in pixels (positive = down, negative = up)
- **Z-Index**: Layering order (higher values appear on top)

## Common Use Cases

### 1. Side-by-Side Images (50/50)
1. Add a **Row Container**
2. Drag two **Image** components into it
3. Select first image → Layout tab → Width: **50%**
4. Select second image → Layout tab → Width: **50%**

### 2. Offset Image Effect (Image 200px Below Another)
1. Add a **Row Container**
2. Drag two **Image** components into it
3. Select second image → Layout tab:
   - **Offset Y**: **200** (moves it down 200px)
   - **Z-Index**: **1** (if you want it on top)

### 3. Three Equal Columns
1. Add a **Grid Container**
2. In Layout tab, set **Grid Columns**: **3**
3. Drag three components into the grid
4. They'll automatically distribute evenly

### 4. 33% / 66% Split Layout
1. Add a **Row Container**
2. Drag two components into it
3. Select first component → Layout tab → Width: **33%**
4. Select second component → Layout tab → Width: **66%**

### 5. Card with Overlapping Element
1. Add a **Row Container**
2. Add a **Card** component
3. Add another component (e.g., Badge)
4. Select the badge → Layout tab:
   - **Offset Y**: **-30** (moves it up, creating overlap)
   - **Z-Index**: **10** (ensures it appears on top)

## Visual Indicators

- **Empty Container**: Shows dashed border with "Drop components here"
- **Hover Over Container**: Blue ring highlights when you can drop
- **Empty Column**: Shows "Column 1/2/3" with "Drop component here"

## Tips & Best Practices

1. **Start with Layout**: Plan your layout structure first with containers
2. **Nest Wisely**: You can put containers inside containers for complex layouts
3. **Use Gap Instead of Margins**: The Gap control is easier for spacing between children
4. **Test Responsive**: Switch device preview to see how layout adapts
5. **Lock Containers**: Lock the container after setup to prevent accidental changes
6. **Use Presets**: Start with Two Column or Three Column for quick layouts

## Troubleshooting

**Q: Component won't drop into container**
- Make sure you're hovering directly over the container (look for blue ring)
- Ensure the container is not locked (check for 🔒 icon)

**Q: Components not appearing side-by-side**
- Check that you're using Row Container (not Column/Stack)
- Verify Wrap is disabled if you want strict horizontal layout
- Check width settings of child components

**Q: Offset not working**
- Make sure you're entering a number (not text)
- Positive values move right/down, negative values move left/up
- Offset is relative positioning, so the component stays in flow

**Q: Components overlapping**
- Use Z-Index to control layering
- Check Offset X/Y values
- Verify container width is sufficient for all children

## Keyboard Shortcuts

- **Ctrl/Cmd + D**: Duplicate selected component
- **Delete**: Remove selected component
- **Ctrl/Cmd + Z**: Undo
- **Ctrl/Cmd + Shift + Z**: Redo

## Next Steps

- Explore **Responsive** tab to adjust layouts for mobile/tablet
- Use **Interactions** tab to add hover effects and animations
- Combine with **Global Settings** for consistent branding
