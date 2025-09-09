'use client';

import { 
  Clock, 
  Play, 
  TrendingUp, 
  Calendar, 
  BarChart3,
  PieChart,
  Activity,
  LucideIcon
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn, formatDuration } from '@/lib/utils';

interface ViewingStatsProps {
  timeFilter: 'all' | 'today' | 'week' | 'month';
}

// Mock 통계 데이터
const MOCK_STATS_DATA = {
  all: {
    totalWatchTime: 25680, // seconds (7.13 hours)
    totalVideos: 38,
    averageWatchTime: 676, // seconds (11.26 minutes)
    completionRate: 68,
    favoriteCategory: '음악',
    mostActiveHour: 21,
    watchStreak: 12, // days
    weeklyProgress: [
      { day: '월', minutes: 45 },
      { day: '화', minutes: 80 },
      { day: '수', minutes: 120 },
      { day: '목', minutes: 90 },
      { day: '금', minutes: 150 },
      { day: '토', minutes: 200 },
      { day: '일', minutes: 180 },
    ],
    categoryBreakdown: [
      { category: '음악', percentage: 42, color: 'bg-purple-500' },
      { category: '엔터테인먼트', percentage: 28, color: 'bg-blue-500' },
      { category: 'Vlog', percentage: 18, color: 'bg-green-500' },
      { category: '리뷰', percentage: 8, color: 'bg-orange-500' },
      { category: '소통', percentage: 4, color: 'bg-pink-500' },
    ],
  },
  today: {
    totalWatchTime: 3420, // 57 minutes
    totalVideos: 5,
    averageWatchTime: 684,
    completionRate: 80,
    favoriteCategory: '음악',
    mostActiveHour: 14,
    watchStreak: 1,
    weeklyProgress: [],
    categoryBreakdown: [
      { category: '음악', percentage: 60, color: 'bg-purple-500' },
      { category: '엔터테인먼트', percentage: 40, color: 'bg-blue-500' },
    ],
  },
  week: {
    totalWatchTime: 8750, // 2.43 hours
    totalVideos: 12,
    averageWatchTime: 729,
    completionRate: 75,
    favoriteCategory: '음악',
    mostActiveHour: 20,
    watchStreak: 7,
    weeklyProgress: [
      { day: '월', minutes: 45 },
      { day: '화', minutes: 80 },
      { day: '수', minutes: 120 },
      { day: '목', minutes: 90 },
      { day: '금', minutes: 150 },
      { day: '토', minutes: 200 },
      { day: '일', minutes: 180 },
    ],
    categoryBreakdown: [
      { category: '음악', percentage: 50, color: 'bg-purple-500' },
      { category: '엔터테인먼트', percentage: 30, color: 'bg-blue-500' },
      { category: 'Vlog', percentage: 20, color: 'bg-green-500' },
    ],
  },
  month: {
    totalWatchTime: 20160, // 5.6 hours
    totalVideos: 28,
    averageWatchTime: 720,
    completionRate: 72,
    favoriteCategory: '음악',
    mostActiveHour: 21,
    watchStreak: 12,
    weeklyProgress: [],
    categoryBreakdown: [
      { category: '음악', percentage: 45, color: 'bg-purple-500' },
      { category: '엔터테인먼트', percentage: 25, color: 'bg-blue-500' },
      { category: 'Vlog', percentage: 15, color: 'bg-green-500' },
      { category: '리뷰', percentage: 10, color: 'bg-orange-500' },
      { category: '소통', percentage: 5, color: 'bg-pink-500' },
    ],
  },
};

export function ViewingStats({ timeFilter }: ViewingStatsProps): JSX.Element {
  const stats = MOCK_STATS_DATA[timeFilter];

  const getTimeFilterLabel = (filter: string): string => {
    switch (filter) {
      case 'today': return '오늘';
      case 'week': return '이번 주';
      case 'month': return '이번 달';
      default: return '전체 기간';
    }
  };

  const StatCard = ({ 
    icon: Icon, 
    label, 
    value, 
    subtitle, 
    color = 'text-foreground' 
  }: {
    icon: LucideIcon;
    label: string;
    value: string;
    subtitle?: string;
    color?: string;
  }): JSX.Element => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div>
        <div className={cn("text-2xl font-bold", color)}>{value}</div>
        {subtitle ? <div className="text-xs text-muted-foreground">{subtitle}</div> : null}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* 기본 통계 */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          icon={Clock}
          label="총 시청 시간"
          value={formatDuration(stats.totalWatchTime)}
          subtitle={getTimeFilterLabel(timeFilter)}
          color="text-primary"
        />
        
        <StatCard
          icon={Play}
          label="시청한 영상"
          value={`${stats.totalVideos}개`}
          color="text-blue-600"
        />
        
        <StatCard
          icon={BarChart3}
          label="평균 시청 시간"
          value={formatDuration(stats.averageWatchTime)}
          color="text-green-600"
        />
        
        <StatCard
          icon={TrendingUp}
          label="완시청률"
          value={`${stats.completionRate}%`}
          color="text-purple-600"
        />
      </div>

      {/* 완시청률 프로그레스 바 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">완시청률</span>
          <span className="text-sm font-medium">{stats.completionRate}%</span>
        </div>
        <Progress value={stats.completionRate} className="h-2" />
      </div>

      {/* 카테고리 분석 */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium flex items-center gap-2">
          <PieChart className="h-4 w-4" />
          카테고리별 시청 분포
        </h4>
        
        <div className="space-y-2">
          {stats.categoryBreakdown.map((item) => (
            <div key={item.category} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {item.category}
                </span>
                <span className="text-xs font-medium">
                  {item.percentage}%
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full", item.color)}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 주간 활동 (주/전체 필터일 때만) */}
      {(timeFilter === 'week' || timeFilter === 'all') && stats.weeklyProgress.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Activity className="h-4 w-4" />
            주간 활동
          </h4>
          
          <div className="grid grid-cols-7 gap-1">
            {stats.weeklyProgress.map((day) => {
              const maxMinutes = Math.max(...stats.weeklyProgress.map(d => d.minutes));
              const height = (day.minutes / maxMinutes) * 40 + 8; // 8-48px
              
              return (
                <div key={day.day} className="flex flex-col items-center gap-1">
                  <div 
                    className="w-4 bg-primary rounded-sm opacity-80 hover:opacity-100 transition-opacity"
                    style={{ height: `${height}px` }}
                    title={`${day.day}: ${day.minutes}분`}
                  />
                  <span className="text-xs text-muted-foreground">
                    {day.day}
                  </span>
                </div>
              );
            })}
          </div>
          
          <div className="text-xs text-muted-foreground text-center">
            일별 시청 시간 (분)
          </div>
        </div>
      )}

      {/* 추가 정보 */}
      <div className="space-y-3 pt-3 border-t">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">선호 카테고리</span>
          <Badge variant="secondary" className="text-xs">
            {stats.favoriteCategory}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">주요 시청 시간</span>
          <span className="text-sm font-medium">
            {stats.mostActiveHour}시 ~ {stats.mostActiveHour + 2}시
          </span>
        </div>
        
        {timeFilter === 'all' && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">연속 시청일</span>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-green-500" />
              <span className="text-sm font-medium text-green-600">
                {stats.watchStreak}일
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 목표 및 성과 (전체 기간일 때만) */}
      {timeFilter === 'all' && (
        <div className="space-y-3 pt-3 border-t">
          <h4 className="text-sm font-medium">이번 달 목표</h4>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">시청 시간 목표</span>
              <span className="text-xs font-medium">10시간 / 15시간</span>
            </div>
            <Progress value={67} className="h-1" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">새로운 크리에이터</span>
              <span className="text-xs font-medium">3명 / 5명</span>
            </div>
            <Progress value={60} className="h-1" />
          </div>
        </div>
      )}
    </div>
  );
}