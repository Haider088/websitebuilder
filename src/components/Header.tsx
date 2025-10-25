interface HeaderProps {
  currentPageName: string;
  siteName?: string;
}

export function Header({ currentPageName, siteName = 'Untitled Website' }: HeaderProps) {
  return (
    <header className="h-14 border-b border-border bg-background flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Restaurant Website Builder</span>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>/</span>
          <span>{siteName}</span>
          <span>/</span>
          <span>{currentPageName}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Auto-save indicator */}
        <span className="text-xs text-muted-foreground">All changes saved</span>
      </div>
    </header>
  );
}
