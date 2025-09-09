'use client';

import { useState, useEffect } from 'react';
import { Settings, Eye, EyeOff, RotateCcw, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { WidgetConfig } from './dashboard-grid';

export interface WidgetConfiguratorProps {
  isOpen: boolean;
  onClose: () => void;
  widgets: WidgetConfig[];
  onWidgetUpdate: (widgets: WidgetConfig[]) => void;
  onReset: () => void;
}

const STORAGE_KEY = 'mypick-dashboard-widgets';

const DEFAULT_WIDGETS: WidgetConfig[] = [
  {
    id: 'personalized-feed',
    type: 'personalized-feed',
    title: '맞춤 추천',
    enabled: true,
    position: 0,
    span: { cols: 1, rows: 1 },
    props: { limit: 4, showReason: true },
  },
  {
    id: 'continue-watching',
    type: 'continue-watching',
    title: '이어서 시청하기',
    enabled: true,
    position: 1,
    span: { cols: 1, rows: 1 },
    props: { limit: 3 },
  },
  {
    id: 'trending-highlight',
    type: 'trending-highlight',
    title: '지금 뜨는 콘텐츠',
    enabled: true,
    position: 2,
    span: { cols: 1, rows: 1 },
    props: { showCategory: true, showRank: true },
  },
  {
    id: 'stats-overview',
    type: 'stats-overview',
    title: '내 활동 통계',
    enabled: true,
    position: 3,
    span: { cols: 2, rows: 1 },
    props: { period: 'week', compact: false },
  },
];

export function WidgetConfigurator({
  isOpen,
  onClose,
  widgets,
  onWidgetUpdate,
  onReset,
}: WidgetConfiguratorProps): JSX.Element | null {
  const [localWidgets, setLocalWidgets] = useState<WidgetConfig[]>(widgets);
  const [hasChanges, setHasChanges] = useState(false);

  // Load widgets from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedWidgets = localStorage.getItem(STORAGE_KEY);
      if (savedWidgets) {
        try {
          const parsed = JSON.parse(savedWidgets);
          setLocalWidgets(parsed);
          onWidgetUpdate(parsed);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Failed to parse saved widgets:', error);
          // Fallback to default widgets
          setLocalWidgets(DEFAULT_WIDGETS);
          onWidgetUpdate(DEFAULT_WIDGETS);
        }
      } else {
        // Initialize with default widgets
        setLocalWidgets(DEFAULT_WIDGETS);
        onWidgetUpdate(DEFAULT_WIDGETS);
        saveToLocalStorage(DEFAULT_WIDGETS);
      }
    }
  }, []);

  // Update local state when props change
  useEffect(() => {
    setLocalWidgets(widgets);
  }, [widgets]);

  // Check for changes
  useEffect(() => {
    const originalWidgets = widgets;
    const hasChanged = JSON.stringify(originalWidgets) !== JSON.stringify(localWidgets);
    setHasChanges(hasChanged);
  }, [widgets, localWidgets]);

  const saveToLocalStorage = (widgetsToSave: WidgetConfig[]): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(widgetsToSave));
    }
  };

  const handleWidgetToggle = (widgetId: string): void => {
    const updatedWidgets = localWidgets.map(widget =>
      widget.id === widgetId ? { ...widget, enabled: !widget.enabled } : widget
    );
    setLocalWidgets(updatedWidgets);
  };

  const handleSave = (): void => {
    onWidgetUpdate(localWidgets);
    saveToLocalStorage(localWidgets);
    setHasChanges(false);
  };

  const handleReset = (): void => {
    const resetWidgets = DEFAULT_WIDGETS;
    setLocalWidgets(resetWidgets);
    onWidgetUpdate(resetWidgets);
    saveToLocalStorage(resetWidgets);
    onReset();
    setHasChanges(false);
  };

  const handleCancel = (): void => {
    setLocalWidgets(widgets);
    setHasChanges(false);
    onClose();
  };

  const getWidgetDescription = (type: string): string => {
    const descriptions = {
      'personalized-feed': '사용자 취향에 맞춘 추천 콘텐츠를 표시합니다',
      'continue-watching': '시청 중이던 콘텐츠를 계속 볼 수 있습니다',
      'trending-highlight': '현재 인기 있는 트렌딩 콘텐츠를 보여줍니다',
      'stats-overview': '사용자의 시청 통계와 활동 내역을 요약합니다',
    };
    return descriptions[type as keyof typeof descriptions] || '위젯 설명이 없습니다';
  };

  const getWidgetIcon = (enabled: boolean): JSX.Element => {
    return enabled ? (
      <Eye className="h-4 w-4 text-green-600" />
    ) : (
      <EyeOff className="h-4 w-4 text-gray-400" />
    );
  };

  if (!isOpen) {return null;}

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                위젯 설정
              </CardTitle>
              <CardDescription>
                대시보드에 표시할 위젯을 선택하고 구성하세요
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="max-h-96 overflow-y-auto p-6">
            <div className="space-y-4">
              {localWidgets.map((widget) => (
                <div
                  key={widget.id}
                  className={cn(
                    "p-4 border rounded-lg transition-colors",
                    widget.enabled ? "bg-background border-border" : "bg-muted/30 border-muted"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        {getWidgetIcon(widget.enabled)}
                        <div>
                          <h4 className={cn(
                            "font-medium",
                            widget.enabled ? "text-foreground" : "text-muted-foreground"
                          )}>
                            {widget.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {getWidgetDescription(widget.type)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-3">
                        <Badge variant="outline" className="text-xs">
                          {widget.span.cols}×{widget.span.rows} 크기
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          위치: {widget.position + 1}
                        </Badge>
                        {widget.enabled ? <Badge variant="default" className="text-xs">
                            활성화
                          </Badge> : null}
                      </div>
                    </div>

                    <div className="ml-4">
                      <Switch
                        checked={widget.enabled}
                        onCheckedChange={() => handleWidgetToggle(widget.id)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t p-6">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                기본값으로 복원
              </Button>

              <div className="flex items-center gap-3">
                {hasChanges ? <span className="text-sm text-muted-foreground">
                    저장되지 않은 변경사항이 있습니다
                  </span> : null}
                <Button variant="outline" onClick={handleCancel}>
                  취소
                </Button>
                <Button onClick={handleSave} disabled={!hasChanges}>
                  <Save className="h-4 w-4 mr-2" />
                  저장
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Hook for managing widget configuration
export function useWidgetConfig(): {
  widgets: WidgetConfig[];
  loadWidgets: () => WidgetConfig[];
  saveWidgets: (newWidgets: WidgetConfig[]) => void;
  resetWidgets: () => void;
} {
  const [widgets, setWidgets] = useState<WidgetConfig[]>(DEFAULT_WIDGETS);

  const loadWidgets = (): WidgetConfig[] => {
    if (typeof window !== 'undefined') {
      const savedWidgets = localStorage.getItem(STORAGE_KEY);
      if (savedWidgets) {
        try {
          const parsed = JSON.parse(savedWidgets);
          setWidgets(parsed);
          return parsed;
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Failed to load widgets:', error);
          return DEFAULT_WIDGETS;
        }
      }
    }
    return DEFAULT_WIDGETS;
  };

  const saveWidgets = (newWidgets: WidgetConfig[]): void => {
    setWidgets(newWidgets);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newWidgets));
    }
  };

  const resetWidgets = (): void => {
    setWidgets(DEFAULT_WIDGETS);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_WIDGETS));
    }
  };

  return {
    widgets,
    loadWidgets,
    saveWidgets,
    resetWidgets,
  };
}