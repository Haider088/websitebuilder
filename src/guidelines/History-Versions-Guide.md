# History & Versions System Guide

Complete guide to the Version History and project versioning system in the Restaurant Website Builder.

## Overview

The History & Versions system provides a comprehensive solution for saving project snapshots, browsing version history, and restoring previous versions. This gives users confidence to experiment knowing they can always revert to earlier states of their project.

## Key Features

### 1. Version History
**Complete project snapshots** at any point in time
- **Location**: Toolbar > "Versions" button
- **Storage**: Browser localStorage
- **Capacity**: Up to 50 versions (auto-managed)

**What's Saved in Each Version:**
- All pages and their content
- All components and their properties
- Global site settings
- Current page selection
- Site name and branding
- Navigation structure
- Complete project state

### 2. Manual Versions
**User-created snapshots** with custom names and descriptions
- Named versions (e.g., "Before redesign", "Launch ready")
- Optional descriptions
- Never auto-deleted
- Perfect for milestones

**How to Create Manual Version:**
1. Click "Versions" in toolbar
2. Click "Save Version"
3. Enter version name (optional)
4. Add description (optional)
5. Click "Save Version"

### 3. Auto-Save Versions
**Automatic snapshots** created periodically
- Created when using Ctrl/Cmd+S
- Created during project saves
- Labeled as "Auto-save"
- Older auto-saves cleaned up automatically
- Last 10 auto-saves retained

### 4. Version Browser
**Visual timeline** of all saved versions
- **Location**: Versions dialog
- **Views**: All, Saved (manual), Auto-saves
- **Information**: Name, description, timestamp, page count, component count

**Three Views:**
1. **All** - All versions combined
2. **Saved** - Only manual versions
3. **Auto-saves** - Only automatic versions

### 5. Version Restore
**One-click restoration** to any previous version
- Select any version from history
- Preview version details
- Restore with confirmation
- Current work replaced (save first!)

**Restore Process:**
1. Open Versions dialog
2. Browse versions in timeline
3. Click version to select
4. Click "Restore" button
5. Confirm restoration
6. Project instantly reverts

### 6. Version Management
**Organize and clean up** version history
- Delete individual versions
- Delete all versions
- View storage statistics
- Automatic cleanup of old auto-saves

## User Interface

### Versions Dialog

**Header Section:**
- Title: "Version History"
- Description text
- Save Version button
- Storage stats (total versions, MB used)

**Tabs:**
- **All ({count})** - All versions
- **Saved ({count})** - Manual saves only
- **Auto-saves ({count})** - Auto-saves only

**Version Cards:**
Each version displays:
- Version name
- Badge (Auto, Latest)
- Description (if provided)
- Timestamp (relative: "5 mins ago" or absolute)
- Page count
- Component count
- Restore button
- Delete button

**Footer:**
- Delete All Versions button (destructive)

### Save Version Dialog

**Fields:**
- **Version Name** - Optional, defaults to timestamp
- **Description** - Optional, multi-line text
- **Buttons**: Cancel, Save Version

### Confirmation Dialogs

**Restore Confirmation:**
- Warning about losing current work
- Suggestion to save first
- Cancel / Restore buttons

**Delete Confirmation:**
- Warning about permanent deletion
- Cancel / Delete buttons

## Technical Details

### Storage System

**localStorage Keys:**
- `restaurant-builder-versions` - All version history

**Version Object Structure:**
```typescript
{
  id: string;                    // Unique ID
  name: string;                  // User-provided or auto-generated
  description?: string;          // Optional description
  timestamp: number;             // Unix timestamp
  isAutoSave: boolean;           // Manual or auto
  state: {
    pages: Page[];
    currentPageId: string;
    siteName: string;
    globalSettings: GlobalSettings;
  };
  componentCount: number;        // Total components
  pageCount: number;             // Total pages
}
```

### Storage Limits

**Constraints:**
- **Max total versions**: 50
- **Max auto-saves**: 10 (older ones deleted)
- **localStorage limit**: ~5-10 MB per domain
- **Manual saves**: Never auto-deleted

**Cleanup Strategy:**
1. When storage exceeds limits
2. Delete oldest auto-saves first
3. Keep all manual saves
4. Maintain last 10 auto-saves
5. Alert user if still over limit

### Performance Considerations

**Optimizations:**
- Lazy loading of version list
- No heavy data in memory
- Efficient JSON serialization
- Automatic cleanup prevents bloat

**Best Practices:**
- Create versions at milestones
- Delete old versions regularly
- Use descriptions for clarity
- Export project as backup

## Usage Scenarios

### Scenario 1: Before Major Changes

**User Story:**
"I want to redesign my menu page but keep the current version in case I don't like the new design."

**Steps:**
1. Click "Versions" in toolbar
2. Click "Save Version"
3. Name it "Before menu redesign"
4. Add description: "Current menu with grid layout"
5. Save version
6. Make changes freely
7. If unhappy, restore the version

### Scenario 2: Daily Backups

**User Story:**
"I want to save my progress at the end of each day."

**Steps:**
1. At end of day, open Versions dialog
2. Click "Save Version"
3. Name it "End of day - Oct 17"
4. Add description: "Added new photos and updated hours"
5. Save and close

### Scenario 3: Recovering from Mistakes

**User Story:**
"I accidentally deleted important components and can't undo enough times."

**Steps:**
1. Open Versions dialog
2. Look at recent auto-saves
3. Find version from before mistake
4. Click "Restore"
5. Confirm restoration
6. Components are back!

### Scenario 4: A/B Testing Ideas

**User Story:**
"I want to try two different homepage designs."

**Steps:**
1. Create "Homepage Design A"
2. Save version "Design A"
3. Make changes for Design B
4. Save version "Design B"
5. Compare by restoring each
6. Keep preferred version

### Scenario 5: Client Presentations

**User Story:**
"I want to show different versions to my client."

**Steps:**
1. Create multiple design variations
2. Save each as named version
3. In meeting, restore versions one by one
4. Let client choose
5. Restore chosen version

## Best Practices

### 1. Naming Conventions
**Good Names:**
- "Before menu redesign"
- "Launch ready - Oct 2025"
- "Client feedback v1"
- "Added contact forms"
- "New color scheme"

**Bad Names:**
- "Version 1" (not descriptive)
- "Test" (too vague)
- "Untitled" (no context)

### 2. When to Save Versions
**Save manually before:**
- Major design changes
- Deleting multiple components
- Changing global settings
- Redesigning key pages
- Client presentations
- Going on vacation (backup!)

**Rely on auto-saves for:**
- Regular work sessions
- Minor tweaks
- Experimenting with small changes

### 3. Descriptions
**Write helpful descriptions:**
- What changed: "Added new menu categories"
- Why it matters: "Client requested beef section"
- Context: "Before feedback from stakeholders"

**Example:**
```
Name: Pre-launch version
Description: Final version before launching website. 
All menu items added, contact form configured, 
images optimized. Ready for client approval.
```

### 4. Version Cleanup
**Regular maintenance:**
- Review versions monthly
- Delete test/experimental versions
- Keep milestone versions
- Export project before major cleanup

### 5. Storage Management
**Monitor storage:**
- Check storage stats in dialog
- If approaching limit, delete old auto-saves
- Export project to file system
- Consider starting fresh project for major redesigns

## Integration with Other Features

### Undo/Redo System
- **Undo/Redo**: Short-term history (within session)
- **Versions**: Long-term history (across sessions)
- **Use together**: Undo for immediate mistakes, versions for session recovery

### Auto-Save
- Auto-save to main state: Every 2 seconds
- Auto-save to versions: On manual save (Ctrl/Cmd+S)
- Separate systems for different purposes

### Export/Import
- Versions stored in browser only
- Export HTML doesn't include versions
- Consider exporting project JSON for external backup

## Troubleshooting

### Common Issues

**Problem: "Storage quota exceeded" error**
- **Solution**: Delete old versions, especially auto-saves
- **Prevention**: Regular cleanup, limit project size

**Problem: Can't find a specific version**
- **Solution**: Use tabs to filter (All/Saved/Auto)
- **Prevention**: Name versions descriptively

**Problem: Restore didn't work as expected**
- **Solution**: Check which version was restored, try again
- **Note**: Restoring replaces entire project state

**Problem: Too many versions, hard to find the right one**
- **Solution**: Delete unnecessary versions, use better naming
- **Prevention**: Only save meaningful milestones

**Problem: Version missing after browser clear**
- **Solution**: Versions stored in localStorage, cleared with browser data
- **Prevention**: Export project regularly as backup

## Advanced Features (Future)

Potential enhancements for future versions:

### Version Comparison
- **Visual diff** showing what changed
- **Side-by-side** comparison
- **Highlight** added/removed/modified components
- **Page-by-page** comparison

### Version Branching
- **Create branches** for experiments
- **Merge branches** back to main
- **Multiple timelines** for complex projects

### Cloud Sync
- **Sync versions** across devices
- **Collaboration** with team members
- **Cloud backup** for safety
- **Version sharing** with others

### Version Tags
- **Tag versions** (e.g., "production", "staging")
- **Filter by tags**
- **Protected tags** can't be deleted

### Export/Import Versions
- **Export version** as file
- **Import version** from file
- **Share versions** with others
- **Archive old versions** externally

## Technical Implementation

### Hook: `useVersionHistory`

**Location**: `/hooks/useVersionHistory.ts`

**Methods:**
```typescript
{
  versions: ProjectVersion[];           // All versions
  saveVersion: (state, name?, desc?, isAuto?) => ProjectVersion;
  restoreVersion: (versionId) => VersionHistoryState | null;
  deleteVersion: (versionId) => void;
  deleteAllVersions: () => void;
  compareVersions: (v1Id, v2Id) => VersionComparison | null;
  getVersionStats: () => VersionStats;
  loadVersions: () => void;
}
```

**Usage Example:**
```typescript
const { saveVersion, restoreVersion, versions } = useVersionHistory();

// Save a version
const newVersion = saveVersion(
  currentState,
  "My milestone",
  "Important changes",
  false // not auto-save
);

// Restore a version
const restored = restoreVersion("version-123456");
if (restored) {
  updateAppState(restored);
}

// Get stats
const stats = getVersionStats();
console.log(`${stats.total} versions, ${stats.sizeInMB} MB`);
```

### Component: `VersionHistoryDialog`

**Location**: `/components/VersionHistoryDialog.tsx`

**Props:**
```typescript
{
  currentState: VersionHistoryState;     // Current project state
  onRestoreVersion: (state) => void;     // Callback on restore
}
```

**State Management:**
- Manages its own dialog open state
- Tracks selected version
- Handles confirmation dialogs
- Formats timestamps nicely

### Data Flow

```
User clicks "Versions"
  ↓
VersionHistoryDialog opens
  ↓
useVersionHistory hook loads versions from localStorage
  ↓
Versions displayed in timeline
  ↓
User clicks "Save Version"
  ↓
saveVersion() creates new ProjectVersion
  ↓
Version saved to localStorage
  ↓
Timeline refreshes
  ↓
[Later] User clicks "Restore"
  ↓
restoreVersion() retrieves version state
  ↓
onRestoreVersion callback to App.tsx
  ↓
App state updated
  ↓
UI re-renders with restored content
```

## Accessibility

### Keyboard Navigation
- **Tab**: Navigate between versions
- **Enter**: Select version
- **Escape**: Close dialog
- **Delete**: Delete selected version

### Screen Readers
- Proper ARIA labels on buttons
- Version count announced
- Timestamp information readable
- Confirmation dialogs accessible

### Visual Indicators
- Selected version highlighted
- Latest version badge
- Auto-save badge
- Clear button states
- Relative time stamps

## Security & Privacy

### Data Storage
- **Local only**: All versions in browser localStorage
- **No cloud**: Nothing sent to servers
- **Privacy**: Data never leaves user's device
- **Clearing**: Deleted with browser data

### Best Practices
- **Don't store sensitive data** in descriptions
- **Clear versions** before sharing computer
- **Export sensitive projects** to encrypted storage
- **Be aware**: localStorage is not encrypted

## Performance Monitoring

### Metrics to Watch
1. **Number of versions** - Keep under 50
2. **Storage size** - Monitor MB used
3. **Load time** - Dialog should open quickly
4. **Restore time** - Should be near-instant

### Optimization Tips
- Delete old auto-saves regularly
- Keep descriptions concise
- Limit to necessary versions
- Export and archive old projects

## Conclusion

The History & Versions system provides robust version control for restaurant website projects. With manual and automatic versioning, users can work confidently knowing they can always restore previous states. The intuitive timeline interface, descriptive metadata, and one-click restoration make it easy for non-technical users to manage their project history effectively.

Key benefits:
- ✅ Confidence to experiment
- ✅ Recovery from mistakes
- ✅ Milestone tracking
- ✅ A/B testing capability
- ✅ Client presentation tool
- ✅ Automatic backups
- ✅ Easy restoration
- ✅ Storage management

The system is production-ready and provides a professional-grade versioning solution for the website builder.
