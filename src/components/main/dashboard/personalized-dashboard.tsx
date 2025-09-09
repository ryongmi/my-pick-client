'use client';

import { useState, useEffect } from 'react';
import { Settings, Layout, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardGrid } from './dashboard-grid';
import { WidgetConfigurator, useWidgetConfig } from './widget-configurator';
import { MainContent } from './main-content';
import { cn } from '@/lib/utils';

export interface PersonalizedDashboardProps {
  showTraditionalFeed?: boolean;
}

export function PersonalizedDashboard({ showTraditionalFeed = true }: PersonalizedDashboardProps): JSX.Element {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'widgets' | 'feed' | 'hybrid'>('hybrid');
  const [isCompact, setIsCompact] = useState(false);
  
  const { widgets, loadWidgets, saveWidgets, resetWidgets } = useWidgetConfig();

  // Initialize widgets on mount
  useEffect(() => {
    loadWidgets();
  }, []);

  const handleWidgetReorder = (newWidgets: unknown[]): void => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    saveWidgets(newWidgets as any);
  };

  const handleWidgetToggle = (widgetId: string, enabled: boolean): void => {
    const updatedWidgets = widgets.map(widget =>
      widget.id === widgetId ? { ...widget, enabled } : widget
    );
    saveWidgets(updatedWidgets);
  };

  const handleWidgetResize = (widgetId: string, span: { cols: number; rows: number }): void => {
    const updatedWidgets = widgets.map(widget =>
      widget.id === widgetId ? { ...widget, span } : widget
    );
    saveWidgets(updatedWidgets);
  };

  const enabledWidgetsCount = widgets.filter(w => w.enabled).length;
  const totalWidgetsCount = widgets.length;

  const getViewModeLabel = (): string => {
    switch (viewMode) {
      case 'widgets':
        return '위젯 모드';
      case 'feed':
        return '피드 모드';
      case 'hybrid':
        return '하이브리드';
      default:
        return '하이브리드';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Dashboard Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Layout className="h-5 w-5" />
                개인화 대시보드
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {enabledWidgetsCount}/{totalWidgetsCount}개 위젯 활성화 • {getViewModeLabel()}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-muted rounded-lg p-1">
                <Button
                  variant={viewMode === 'widgets' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('widgets')}
                  className="text-xs"
                >
                  위젯
                </Button>
                <Button
                  variant={viewMode === 'hybrid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('hybrid')}
                  className="text-xs"
                >
                  하이브리드
                </Button>
                <Button
                  variant={viewMode === 'feed' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('feed')}
                  className="text-xs"
                >
                  피드
                </Button>
              </div>

              {/* Compact Mode Toggle */}
              <Button
                variant={isCompact ? 'default' : 'outline'}
                size="sm"
                onClick={() => setIsCompact(!isCompact)}
                className="flex items-center gap-2"
              >
                {isCompact ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                <span className="hidden sm:inline">
                  {isCompact ? '확장' : '압축'}
                </span>
              </Button>

              {/* Widget Configuration Button */}
              <Button
                variant="outline"
                onClick={() => setIsConfigOpen(true)}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">위젯 설정</span>
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Dashboard Content */}
      <div className={cn(
        "space-y-6",
        viewMode === 'hybrid' && "lg:grid lg:grid-cols-12 lg:gap-6 lg:space-y-0"
      )}>
        {/* Widgets Section */}
        {(viewMode === 'widgets' || viewMode === 'hybrid') && (
          <div className={cn(
            viewMode === 'hybrid' ? "lg:col-span-5" : "w-full"
          )}>
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">대시보드 위젯</CardTitle>
                {isCompact ? <p className="text-xs text-muted-foreground">
                    압축 모드 - 핵심 정보만 표시
                  </p> : null}
              </CardHeader>
              <CardContent>
                {enabledWidgetsCount === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Layout className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>활성화된 위젯이 없습니다</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsConfigOpen(true)}
                      className="mt-2"
                    >
                      위젯 설정하기
                    </Button>
                  </div>
                ) : (
                  <DashboardGrid
                    widgets={widgets.map(w => ({
                      ...w,
                      props: {
                        ...w.props,
                        compact: isCompact,
                      }
                    }))}
                    onWidgetReorder={handleWidgetReorder}
                    onWidgetToggle={handleWidgetToggle}
                    onWidgetResize={handleWidgetResize}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Feed Section */}
        {(viewMode === 'feed' || viewMode === 'hybrid') && showTraditionalFeed ? <div className={cn(
            viewMode === 'hybrid' ? "lg:col-span-7" : "w-full"
          )}>
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">콘텐츠 피드</CardTitle>
                <p className="text-xs text-muted-foreground">
                  팔로우한 크리에이터의 최신 콘텐츠
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[800px] overflow-y-auto px-6 pb-6">
                  <MainContent />
                </div>
              </CardContent>
            </Card>
          </div> : null}
      </div>

      {/* Widget Configurator Modal */}
      <WidgetConfigurator
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        widgets={widgets}
        onWidgetUpdate={saveWidgets}
        onReset={resetWidgets}
      />
    </div>
  );
}