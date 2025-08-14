'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Eye, Clock, Heart, Bookmark, Users, Video, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatItem {
  id: string;
  label: string;
  value: number;
  previousValue: number;
  change: number; // percentage change
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ReactNode;
  color: string;
  unit?: string;
  format?: 'number' | 'duration' | 'percentage';
}

export interface StatsOverviewProps {
  period?: 'today' | 'week' | 'month';
  compact?: boolean;
}

export function StatsOverview({ period = 'week', compact = false }: StatsOverviewProps) {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock stats data
  useEffect(() => {
    const mockStats: StatItem[] = [
      {
        id: 'watch-time',
        label: '시청 시간',
        value: 18.5, // hours
        previousValue: 15.2,
        change: 21.7,
        changeType: 'increase',
        icon: <Clock className="h-4 w-4" />,
        color: 'text-blue-600 bg-blue-50',
        unit: '시간',
        format: 'duration',
      },
      {
        id: 'videos-watched',
        label: '시청한 영상',
        value: 47,
        previousValue: 38,
        change: 23.7,
        changeType: 'increase',
        icon: <Video className="h-4 w-4" />,
        color: 'text-purple-600 bg-purple-50',
        unit: '개',
        format: 'number',
      },
      {
        id: 'liked-content',
        label: '좋아요한 콘텐츠',
        value: 23,
        previousValue: 29,
        change: -20.7,
        changeType: 'decrease',
        icon: <Heart className="h-4 w-4" />,
        color: 'text-red-600 bg-red-50',
        unit: '개',
        format: 'number',
      },
      {
        id: 'bookmarks',
        label: '새 북마크',
        value: 8,
        previousValue: 8,
        change: 0,
        changeType: 'neutral',
        icon: <Bookmark className="h-4 w-4" />,
        color: 'text-green-600 bg-green-50',
        unit: '개',
        format: 'number',
      },
      {
        id: 'creators-followed',
        label: '팔로우한 크리에이터',
        value: 3,
        previousValue: 2,
        change: 50.0,
        changeType: 'increase',
        icon: <Users className="h-4 w-4" />,
        color: 'text-orange-600 bg-orange-50',
        unit: '명',
        format: 'number',
      },
      {
        id: 'engagement-rate',
        label: '참여율',
        value: 68.5,
        previousValue: 72.1,
        change: -5.0,
        changeType: 'decrease',
        icon: <TrendingUp className="h-4 w-4" />,
        color: 'text-indigo-600 bg-indigo-50',
        unit: '%',
        format: 'percentage',
      },
    ];

    // Filter stats based on compact mode
    const filteredStats = compact ? mockStats.slice(0, 4) : mockStats;

    // Simulate API call
    setTimeout(() => {
      setStats(filteredStats);
      setIsLoading(false);
    }, 900);
  }, [period, compact]);

  const formatValue = (value: number, format?: string, unit?: string) => {
    switch (format) {
      case 'duration':
        return `${value.toFixed(1)}${unit}`;
      case 'percentage':
        return `${value.toFixed(1)}${unit}`;
      case 'number':
      default:
        return `${value.toLocaleString()}${unit || ''}`;
    }
  };

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp className="h-3 w-3" />;
      case 'decrease':
        return <TrendingDown className="h-3 w-3" />;
      case 'neutral':
      default:
        return <Minus className="h-3 w-3" />;
    }
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      case 'neutral':
      default:
        return 'text-gray-600';
    }
  };

  const getPeriodLabel = () => {
    switch (period) {
      case 'today':
        return '오늘';
      case 'week':
        return '이번 주';
      case 'month':
        return '이번 달';
      default:
        return '이번 주';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
        <div className={cn(
          "grid gap-4",
          compact ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-3"
        )}>
          {[...Array(compact ? 4 : 6)].map((_, i) => (
            <div key={i} className="p-3 border rounded-lg animate-pulse">
              <div className="flex items-center justify-between mb-2">
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
                <div className="w-12 h-3 bg-gray-200 rounded"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-muted-foreground">
          {getPeriodLabel()} 통계
        </h4>
        <div className="text-xs text-muted-foreground">
          vs 지난 {period === 'today' ? '일' : period === 'week' ? '주' : '달'}
        </div>
      </div>

      <div className={cn(
        "grid gap-3",
        compact ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-3"
      )}>
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="p-3 border rounded-lg hover:shadow-sm transition-shadow bg-background"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={cn(
                "p-1.5 rounded-md",
                stat.color.split(' ')[1] // bg-color class
              )}>
                <div className={stat.color.split(' ')[0]}>
                  {stat.icon}
                </div>
              </div>
              
              <div className={cn(
                "flex items-center text-xs font-medium",
                getChangeColor(stat.changeType)
              )}>
                {getChangeIcon(stat.changeType)}
                <span className="ml-1">
                  {stat.change === 0 ? '0' : `${stat.change > 0 ? '+' : ''}${stat.change.toFixed(1)}`}%
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-lg font-semibold">
                {formatValue(stat.value, stat.format, stat.unit)}
              </div>
              <div className="text-xs text-muted-foreground">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary insight */}
      <div className="mt-4 p-3 bg-muted/30 rounded-lg">
        <div className="flex items-center space-x-2 mb-1">
          <Eye className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs font-medium">인사이트</span>
        </div>
        <p className="text-xs text-muted-foreground">
          {period === 'week' && '이번 주는 지난 주보다 시청 시간이 21.7% 증가했습니다. 새로운 크리에이터를 팔로우하면서 더 다양한 콘텐츠를 즐기고 있네요!'}
          {period === 'today' && '오늘 활발한 활동을 보여주고 있습니다. 계속해서 흥미로운 콘텐츠를 탐색해보세요!'}
          {period === 'month' && '이번 달 전반적으로 안정적인 시청 패턴을 보여주고 있습니다.'}
        </p>
      </div>
    </div>
  );
}