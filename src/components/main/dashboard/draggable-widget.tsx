'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Eye, EyeOff, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { WidgetConfig } from './dashboard-grid';

// Widget content components
import { PersonalizedFeed } from './widgets/personalized-feed';
import { ContinueWatching } from './widgets/continue-watching';
import { TrendingHighlight } from './widgets/trending-highlight';
import { StatsOverview } from './widgets/stats-overview';

export interface DraggableWidgetProps {
  widget: WidgetConfig;
  onToggle: (widgetId: string, enabled: boolean) => void;
  onResize?: (widgetId: string, span: { cols: number; rows: number }) => void;
  isDragOverlay?: boolean;
}

export function DraggableWidget({ 
  widget, 
  onToggle, 
  onResize, 
  isDragOverlay = false 
}: DraggableWidgetProps): JSX.Element {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleToggle = (): void => {
    onToggle(widget.id, !widget.enabled);
  };

  const handleResize = (): void => {
    if (onResize) {
      const newSpan = {
        cols: widget.span.cols === 1 ? 2 : 1,
        rows: widget.span.rows === 1 ? 2 : 1,
      };
      onResize(widget.id, newSpan);
    }
  };

  const renderWidgetContent = (): JSX.Element => {
    switch (widget.type) {
      case 'personalized-feed':
        return <PersonalizedFeed {...widget.props} />;
      case 'continue-watching':
        return <ContinueWatching {...widget.props} />;
      case 'trending-highlight':
        return <TrendingHighlight {...widget.props} />;
      case 'stats-overview':
        return <StatsOverview {...widget.props} />;
      default:
        return (
          <div className="p-4 text-center text-muted-foreground">
            <p>Unknown widget type: {widget.type}</p>
          </div>
        );
    }
  };

  const gridSpanClasses = {
    cols: {
      1: 'md:col-span-1',
      2: 'md:col-span-2',
      3: 'lg:col-span-3',
      4: 'xl:col-span-4',
    },
    rows: {
      1: 'md:row-span-1',
      2: 'md:row-span-2',
      3: 'lg:row-span-3',
    },
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative transition-all duration-200',
        gridSpanClasses.cols[widget.span.cols as keyof typeof gridSpanClasses.cols],
        gridSpanClasses.rows[widget.span.rows as keyof typeof gridSpanClasses.rows],
        {
          'opacity-50 scale-95': isDragging && !isDragOverlay,
          'shadow-2xl ring-2 ring-primary/20': isDragging,
          'hover:shadow-lg': !isDragging,
        }
      )}
    >
      {/* Widget Header with Controls */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium">{widget.title}</h3>
        <div className="flex items-center gap-1">
          {/* Resize Button */}
          {onResize ? <Button
              variant="ghost"
              size="icon"
              onClick={handleResize}
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
            >
              {widget.span.cols === 1 && widget.span.rows === 1 ? (
                <Maximize2 className="h-3 w-3" />
              ) : (
                <Minimize2 className="h-3 w-3" />
              )}
            </Button> : null}
          
          {/* Visibility Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggle}
            className="h-6 w-6 text-muted-foreground hover:text-foreground"
          >
            {widget.enabled ? (
              <Eye className="h-3 w-3" />
            ) : (
              <EyeOff className="h-3 w-3" />
            )}
          </Button>

          {/* Drag Handle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>

      {/* Widget Content */}
      <CardContent className="pt-0">
        {renderWidgetContent()}
      </CardContent>
    </Card>
  );
}