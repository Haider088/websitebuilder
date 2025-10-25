import { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
  Zap,
  Eye,
  Accessibility,
  Search,
  FileText,
  Layers,
  Image as ImageIcon,
  Download,
} from 'lucide-react';
import { Page, GlobalSettings, Asset, ProjectAnalytics, AnalyticsIssue } from '../types';
import { generateAnalytics } from '../utils/analytics';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';

interface AnalyticsDashboardProps {
  pages: Page[];
  globalSettings: GlobalSettings;
  assets: Asset[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AnalyticsDashboard({ pages, globalSettings, assets, open: controlledOpen, onOpenChange }: AnalyticsDashboardProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;
  const [analytics, setAnalytics] = useState<ProjectAnalytics | null>(null);

  useEffect(() => {
    if (open) {
      const data = generateAnalytics(pages, globalSettings, assets);
      setAnalytics(data);
    }
  }, [open, pages, globalSettings, assets]);

  const getLevelIcon = (level: AnalyticsIssue['level']) => {
    switch (level) {
      case 'critical':
        return <X className="w-4 h-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getLevelColor = (level: AnalyticsIssue['level']) => {
    switch (level) {
      case 'critical':
        return 'destructive';
      case 'warning':
        return 'outline';
      case 'info':
        return 'secondary';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Needs Work';
    return 'Poor';
  };

  const exportReport = () => {
    if (!analytics) return;

    const report = {
      generatedAt: new Date().toISOString(),
      overview: analytics.overview,
      scores: {
        seo: analytics.seo.score,
        accessibility: analytics.accessibility.score,
        performance: analytics.performance.score,
      },
      issues: analytics.issues,
      recommendations: {
        seo: analytics.seo.recommendations,
        accessibility: analytics.accessibility.recommendations,
        performance: analytics.performance.recommendations,
      },
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <BarChart3 className="w-4 h-4" />
          Analytics
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Analytics & Optimization
          </DialogTitle>
          <DialogDescription>
            Insights, performance metrics, and recommendations for your website
          </DialogDescription>
        </DialogHeader>

        {analytics && (
          <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between gap-3 mb-4 min-w-0">
              <div className="overflow-x-auto flex-1 min-w-0">
                <TabsList className="inline-flex w-auto">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="issues" className="gap-1">
                    Issues
                    {analytics.issues.length > 0 && (
                      <Badge variant="destructive" className="ml-1 px-1 min-w-[1.25rem] h-4 text-[10px]">
                        {analytics.issues.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="seo">SEO</TabsTrigger>
                  <TabsTrigger value="accessibility">A11y</TabsTrigger>
                  <TabsTrigger value="performance">Perf</TabsTrigger>
                  <TabsTrigger value="usage">Usage</TabsTrigger>
                </TabsList>
              </div>
              <Button variant="outline" size="sm" onClick={exportReport} className="gap-2 flex-shrink-0">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </div>

            <div className="flex-1 min-h-0 -mx-6 px-6">
              <ScrollArea className="h-full">
              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-0 space-y-4 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* SEO Score */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Search className="w-4 h-4" />
                        SEO Score
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className={`text-3xl font-bold ${getScoreColor(analytics.seo.score)}`}>
                        {analytics.seo.score}/100
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {getScoreLabel(analytics.seo.score)}
                      </p>
                      <Progress value={analytics.seo.score} className="mt-2" />
                    </CardContent>
                  </Card>

                  {/* Accessibility Score */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Accessibility className="w-4 h-4" />
                        Accessibility
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className={`text-3xl font-bold ${getScoreColor(analytics.accessibility.score)}`}>
                        {analytics.accessibility.score}/100
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {getScoreLabel(analytics.accessibility.score)}
                      </p>
                      <Progress value={analytics.accessibility.score} className="mt-2" />
                    </CardContent>
                  </Card>

                  {/* Performance Score */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className={`text-3xl font-bold ${getScoreColor(analytics.performance.score)}`}>
                        {analytics.performance.score}/100
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {getScoreLabel(analytics.performance.score)}
                      </p>
                      <Progress value={analytics.performance.score} className="mt-2" />
                    </CardContent>
                  </Card>
                </div>

                {/* Project Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Project Overview</CardTitle>
                    <CardDescription>Key metrics about your website</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <FileText className="w-4 h-4" />
                          <span className="text-sm">Pages</span>
                        </div>
                        <div className="text-2xl font-bold">{analytics.overview.totalPages}</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Layers className="w-4 h-4" />
                          <span className="text-sm">Components</span>
                        </div>
                        <div className="text-2xl font-bold">{analytics.overview.totalComponents}</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <ImageIcon className="w-4 h-4" />
                          <span className="text-sm">Assets</span>
                        </div>
                        <div className="text-2xl font-bold">{analytics.overview.totalAssets}</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-sm">Project Size</span>
                        </div>
                        <div className="text-2xl font-bold">
                          {analytics.overview.projectSize.toFixed(1)} KB
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Issues Summary */}
                {analytics.issues.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Issues</CardTitle>
                      <CardDescription>
                        Critical and warning issues that need attention
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {analytics.issues.slice(0, 5).map((issue) => (
                          <div
                            key={issue.id}
                            className="flex items-start gap-3 p-3 rounded-lg border bg-muted/50"
                          >
                            {getLevelIcon(issue.level)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-sm">{issue.title}</h4>
                                <Badge variant={getLevelColor(issue.level)} className="text-xs">
                                  {issue.level}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {issue.recommendation}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      {analytics.issues.length > 5 && (
                        <p className="text-sm text-muted-foreground mt-3">
                          And {analytics.issues.length - 5} more issues...
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Issues Tab */}
              <TabsContent value="issues" className="mt-0 space-y-4">
                {analytics.issues.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-green-600" />
                      <h3 className="font-medium mb-2">No Issues Found!</h3>
                      <p className="text-sm text-muted-foreground">
                        Your website follows best practices. Great job!
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {analytics.issues.map((issue) => (
                      <Card key={issue.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            {getLevelIcon(issue.level)}
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-4 mb-2">
                                <div>
                                  <h4 className="font-medium">{issue.title}</h4>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {issue.description}
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <Badge variant={getLevelColor(issue.level)}>
                                    {issue.level}
                                  </Badge>
                                  <Badge variant="outline">{issue.type}</Badge>
                                </div>
                              </div>
                              <div className="bg-muted/50 p-3 rounded-lg">
                                <p className="text-sm">
                                  <strong>Recommendation:</strong> {issue.recommendation}
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* SEO Tab */}
              <TabsContent value="seo" className="mt-0 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="w-5 h-5" />
                      SEO Analysis
                    </CardTitle>
                    <CardDescription>
                      Search engine optimization score and recommendations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Overall SEO Score</p>
                        <p className={`text-4xl font-bold ${getScoreColor(analytics.seo.score)}`}>
                          {analytics.seo.score}/100
                        </p>
                      </div>
                      <Progress value={analytics.seo.score} className="w-1/2" />
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium mb-3">Recommendations</h4>
                      <ul className="space-y-2">
                        {analytics.seo.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {analytics.seo.issues.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-medium mb-3">Issues ({analytics.seo.issues.length})</h4>
                          <div className="space-y-2">
                            {analytics.seo.issues.map((issue) => (
                              <div key={issue.id} className="p-3 rounded-lg border bg-muted/50">
                                <div className="flex items-start gap-2 mb-1">
                                  {getLevelIcon(issue.level)}
                                  <h5 className="font-medium text-sm">{issue.title}</h5>
                                </div>
                                <p className="text-xs text-muted-foreground ml-6">
                                  {issue.recommendation}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Page-by-Page SEO */}
                <Card>
                  <CardHeader>
                    <CardTitle>Page-by-Page Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {analytics.pageStats.map((page) => (
                        <div key={page.id} className="flex items-center justify-between p-3 rounded-lg border">
                          <div>
                            <h5 className="font-medium">{page.name}</h5>
                            <div className="flex gap-2 mt-1">
                              {page.hasMetaTitle ? (
                                <Badge variant="secondary" className="text-xs">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Title
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs">
                                  <X className="w-3 h-3 mr-1" />
                                  No Title
                                </Badge>
                              )}
                              {page.hasMetaDescription ? (
                                <Badge variant="secondary" className="text-xs">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Description
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs">
                                  <X className="w-3 h-3 mr-1" />
                                  No Description
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-right text-sm text-muted-foreground">
                            {page.componentCount} components
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Accessibility Tab */}
              <TabsContent value="accessibility" className="mt-0 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Accessibility className="w-5 h-5" />
                      Accessibility Analysis
                    </CardTitle>
                    <CardDescription>
                      Ensure your website is accessible to all users
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Accessibility Score</p>
                        <p className={`text-4xl font-bold ${getScoreColor(analytics.accessibility.score)}`}>
                          {analytics.accessibility.score}/100
                        </p>
                      </div>
                      <Progress value={analytics.accessibility.score} className="w-1/2" />
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium mb-3">Recommendations</h4>
                      <ul className="space-y-2">
                        {analytics.accessibility.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {analytics.accessibility.issues.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-medium mb-3">
                            Issues ({analytics.accessibility.issues.length})
                          </h4>
                          <div className="space-y-2">
                            {analytics.accessibility.issues.map((issue) => (
                              <div key={issue.id} className="p-3 rounded-lg border bg-muted/50">
                                <div className="flex items-start gap-2 mb-1">
                                  {getLevelIcon(issue.level)}
                                  <h5 className="font-medium text-sm">{issue.title}</h5>
                                </div>
                                <p className="text-xs text-muted-foreground ml-6">
                                  {issue.recommendation}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Performance Tab */}
              <TabsContent value="performance" className="mt-0 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      Performance Analysis
                    </CardTitle>
                    <CardDescription>
                      Optimize loading speed and user experience
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Performance Score</p>
                        <p className={`text-4xl font-bold ${getScoreColor(analytics.performance.score)}`}>
                          {analytics.performance.score}/100
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Est. Load Time</p>
                        <p className="text-4xl font-bold">
                          {(analytics.performance.estimatedLoadTime / 1000).toFixed(1)}s
                        </p>
                      </div>
                    </div>

                    <Progress value={analytics.performance.score} />

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg border">
                        <p className="text-sm text-muted-foreground mb-1">Total Size</p>
                        <p className="text-2xl font-bold">
                          {analytics.performance.totalSize.toFixed(1)} KB
                        </p>
                      </div>
                      <div className="p-3 rounded-lg border">
                        <p className="text-sm text-muted-foreground mb-1">Image Size</p>
                        <p className="text-2xl font-bold">
                          {analytics.performance.imageSize.toFixed(1)} KB
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium mb-3">Recommendations</h4>
                      <ul className="space-y-2">
                        {analytics.performance.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <Zap className="w-4 h-4 mt-0.5 text-yellow-600 flex-shrink-0" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {analytics.performance.issues.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-medium mb-3">
                            Issues ({analytics.performance.issues.length})
                          </h4>
                          <div className="space-y-2">
                            {analytics.performance.issues.map((issue) => (
                              <div key={issue.id} className="p-3 rounded-lg border bg-muted/50">
                                <div className="flex items-start gap-2 mb-1">
                                  {getLevelIcon(issue.level)}
                                  <h5 className="font-medium text-sm">{issue.title}</h5>
                                </div>
                                <p className="text-xs text-muted-foreground ml-6">
                                  {issue.recommendation}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Usage Tab */}
              <TabsContent value="usage" className="mt-0 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Component Usage</CardTitle>
                    <CardDescription>
                      See which components are used most across your website
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analytics.componentUsage.map((usage) => (
                        <div key={usage.componentId} className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h5 className="font-medium text-sm">{usage.name}</h5>
                              <span className="text-sm text-muted-foreground">
                                {usage.count} {usage.count === 1 ? 'use' : 'uses'}
                              </span>
                            </div>
                            <Progress value={(usage.count / analytics.overview.totalComponents) * 100} />
                            <p className="text-xs text-muted-foreground mt-1">
                              Used on: {usage.pages.join(', ')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Page Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {analytics.pageStats.map((page) => (
                        <div key={page.id} className="p-3 rounded-lg border">
                          <div className="flex items-start justify-between mb-2">
                            <h5 className="font-medium">{page.name}</h5>
                            <Badge variant="outline">{page.estimatedSize.toFixed(1)} KB</Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div>
                              <p className="text-muted-foreground">Components</p>
                              <p className="font-medium">{page.componentCount}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Forms</p>
                              <p className="font-medium">{page.formCount}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Images</p>
                              <p className="font-medium">{page.imageCount}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              </ScrollArea>
            </div>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
