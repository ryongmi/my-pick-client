'use client';

import { useState, useEffect, useMemo } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import { DraggableWidget } from './draggable-widget';

export interface WidgetConfig {
  id: string;
  type: string;
  title: string;
  enabled: boolean;
  position: number;
  span: {
    cols: number;
    rows: number;
  };
  props?: Record<string, unknown>;
}

export interface DashboardGridProps {
  widgets: WidgetConfig[];
  onWidgetReorder: (widgets: WidgetConfig[]) => void;
  onWidgetToggle: (widgetId: string, enabled: boolean) => void;
  onWidgetResize?: (widgetId: string, span: { cols: number; rows: number }) => void;
}

export function DashboardGrid({ 
  widgets, 
  onWidgetReorder, 
  onWidgetToggle,
  onWidgetResize 
}: DashboardGridProps): JSX.Element | null {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Client-side only rendering to avoid hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Filter and sort enabled widgets
  const enabledWidgets = useMemo(() => {
    return widgets
      .filter(widget => widget.enabled)
      .sort((a, b) => a.position - b.position);
  }, [widgets]);

  // Get widget IDs for sortable context
  const widgetIds = useMemo(() => {
    return enabledWidgets.map(widget => widget.id);
  }, [enabledWidgets]);

  const handleDragStart = (event: DragStartEvent): void => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent): void => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = enabledWidgets.findIndex(w => w.id === active.id);
    const newIndex = enabledWidgets.findIndex(w => w.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newEnabledWidgets = arrayMove(enabledWidgets, oldIndex, newIndex);
      
      // Update positions and merge with disabled widgets
      const updatedWidgets = widgets.map(widget => {
        if (widget.enabled) {
          const newPosition = newEnabledWidgets.findIndex(w => w.id === widget.id);
          return { ...widget, position: newPosition };
        }
        return widget;
      });

      onWidgetReorder(updatedWidgets);
    }
  };

  const activeWidget = activeId ? widgets.find(w => w.id === activeId) : null;

  if (!isMounted) {
    return null; // Avoid hydration issues
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="w-full">
        <SortableContext items={widgetIds} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-min">
            {enabledWidgets.map((widget) => (
              <DraggableWidget
                key={widget.id}
                widget={widget}
                onToggle={onWidgetToggle}
                onResize={onWidgetResize || ((): void => {})}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeWidget ? (
            <div className="bg-background border-2 border-primary/50 rounded-lg shadow-2xl opacity-90">
              <DraggableWidget
                widget={activeWidget}
                onToggle={onWidgetToggle}
                onResize={onWidgetResize || ((): void => {})}
                isDragOverlay
              />
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}