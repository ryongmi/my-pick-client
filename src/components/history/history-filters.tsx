'use client';

import { useState } from 'react';
import { 
  Filter, 
  Calendar, 
  User, 
  Tag, 
  Clock, 
  Play,
  X,
  ChevronDown,
  LucideIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface FilterState {
  creators: string[];
  categories: string[];
  platforms: string[];
  watchStatus: 'all' | 'completed' | 'incomplete';
  duration: {
    min: number;
    max: number;
  };
  dateRange: {
    start: string;
    end: string;
  };
}

const MOCK_CREATORS = [
  { id: 'ado', name: 'Ado', count: 12 },
  { id: 'hikakin', name: '히카킨', count: 8 },
  { id: 'kuzuha', name: 'Kuzuha', count: 5 },
];

const MOCK_CATEGORIES = [
  { id: 'music', name: '음악', count: 15 },
  { id: 'entertainment', name: '엔터테인먼트', count: 10 },
  { id: 'vlog', name: 'Vlog', count: 6 },
  { id: 'review', name: '리뷰', count: 4 },
  { id: 'communication', name: '소통', count: 3 },
];

const MOCK_PLATFORMS = [
  { id: 'youtube', name: 'YouTube', count: 35 },
  { id: 'twitch', name: 'Twitch', count: 3 },
  { id: 'niconico', name: 'Niconico', count: 0 },
];

export function HistoryFilters(): JSX.Element {
  const [filters, setFilters] = useState<FilterState>({
    creators: [],
    categories: [],
    platforms: [],
    watchStatus: 'all',
    duration: { min: 0, max: 3600 },
    dateRange: { start: '', end: '' },
  });

  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['creators', 'categories'])
  );

  const toggleSection = (section: string): void => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ): void => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const toggleCreator = (creatorId: string): void => {
    const newCreators = filters.creators.includes(creatorId)
      ? filters.creators.filter(id => id !== creatorId)
      : [...filters.creators, creatorId];
    updateFilter('creators', newCreators);
  };

  const toggleCategory = (categoryId: string): void => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter(id => id !== categoryId)
      : [...filters.categories, categoryId];
    updateFilter('categories', newCategories);
  };

  const togglePlatform = (platformId: string): void => {
    const newPlatforms = filters.platforms.includes(platformId)
      ? filters.platforms.filter(id => id !== platformId)
      : [...filters.platforms, platformId];
    updateFilter('platforms', newPlatforms);
  };

  const clearAllFilters = (): void => {
    setFilters({
      creators: [],
      categories: [],
      platforms: [],
      watchStatus: 'all',
      duration: { min: 0, max: 3600 },
      dateRange: { start: '', end: '' },
    });
  };

  const hasActiveFilters = 
    filters.creators.length > 0 ||
    filters.categories.length > 0 ||
    filters.platforms.length > 0 ||
    filters.watchStatus !== 'all' ||
    filters.dateRange.start ||
    filters.dateRange.end;

  const getActiveFilterCount = (): number => {
    let count = 0;
    if (filters.creators.length > 0) {count += filters.creators.length;}
    if (filters.categories.length > 0) {count += filters.categories.length;}
    if (filters.platforms.length > 0) {count += filters.platforms.length;}
    if (filters.watchStatus !== 'all') {count += 1;}
    if (filters.dateRange.start || filters.dateRange.end) {count += 1;}
    return count;
  };

  const FilterSection = ({ 
    title, 
    icon: Icon, 
    sectionKey, 
    children 
  }: {
    title: string;
    icon: LucideIcon;
    sectionKey: string;
    children: React.ReactNode;
  }): JSX.Element => {
    const isExpanded = expandedSections.has(sectionKey);
    
    return (
      <div className="border rounded-lg">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full flex items-center justify-between p-3 hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            <span className="font-medium text-sm">{title}</span>
          </div>
          <ChevronDown 
            className={cn(
              "h-4 w-4 transition-transform",
              isExpanded && "rotate-180"
            )} 
          />
        </button>
        
        {isExpanded ? <div className="border-t p-3">
            {children}
          </div> : null}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5" />
            필터
            {hasActiveFilters ? <Badge variant="secondary" className="text-xs">
                {getActiveFilterCount()}
              </Badge> : null}
          </CardTitle>
          
          {hasActiveFilters ? <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              전체 해제
            </Button> : null}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* 크리에이터 필터 */}
        <FilterSection title="크리에이터" icon={User} sectionKey="creators">
          <div className="space-y-2">
            {MOCK_CREATORS.map(creator => (
              <div key={creator.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={filters.creators.includes(creator.id)}
                    onCheckedChange={() => toggleCreator(creator.id)}
                  />
                  <span className="text-sm">{creator.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {creator.count}개
                </span>
              </div>
            ))}
          </div>
        </FilterSection>

        {/* 카테고리 필터 */}
        <FilterSection title="카테고리" icon={Tag} sectionKey="categories">
          <div className="space-y-2">
            {MOCK_CATEGORIES.map(category => (
              <div key={category.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={filters.categories.includes(category.id)}
                    onCheckedChange={() => toggleCategory(category.id)}
                  />
                  <span className="text-sm">{category.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {category.count}개
                </span>
              </div>
            ))}
          </div>
        </FilterSection>

        {/* 플랫폼 필터 */}
        <FilterSection title="플랫폼" icon={Play} sectionKey="platforms">
          <div className="space-y-2">
            {MOCK_PLATFORMS.map(platform => (
              <div key={platform.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={filters.platforms.includes(platform.id)}
                    onCheckedChange={() => togglePlatform(platform.id)}
                  />
                  <span className="text-sm">{platform.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {platform.count}개
                </span>
              </div>
            ))}
          </div>
        </FilterSection>

        {/* 시청 상태 필터 */}
        <FilterSection title="시청 상태" icon={Clock} sectionKey="watchStatus">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={filters.watchStatus === 'all'}
                onCheckedChange={() => updateFilter('watchStatus', 'all')}
              />
              <span className="text-sm">전체</span>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={filters.watchStatus === 'completed'}
                onCheckedChange={() => updateFilter('watchStatus', 'completed')}
              />
              <span className="text-sm">완료</span>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={filters.watchStatus === 'incomplete'}
                onCheckedChange={() => updateFilter('watchStatus', 'incomplete')}
              />
              <span className="text-sm">미완료</span>
            </div>
          </div>
        </FilterSection>

        {/* 날짜 범위 필터 */}
        <FilterSection title="시청 날짜" icon={Calendar} sectionKey="dateRange">
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">시작 날짜</label>
              <Input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => updateFilter('dateRange', {
                  ...filters.dateRange,
                  start: e.target.value
                })}
                className="text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">종료 날짜</label>
              <Input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) => updateFilter('dateRange', {
                  ...filters.dateRange,
                  end: e.target.value
                })}
                className="text-sm"
              />
            </div>
          </div>
        </FilterSection>

        {/* 현재 적용된 필터 표시 */}
        {hasActiveFilters ? <div className="pt-3 border-t">
            <p className="text-xs text-muted-foreground mb-2">적용된 필터:</p>
            <div className="flex flex-wrap gap-1">
              {filters.creators.map(creatorId => {
                const creator = MOCK_CREATORS.find(c => c.id === creatorId);
                return creator && (
                  <Badge 
                    key={creatorId} 
                    variant="secondary" 
                    className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => toggleCreator(creatorId)}
                  >
                    {creator.name} ×
                  </Badge>
                );
              })}
              
              {filters.categories.map(categoryId => {
                const category = MOCK_CATEGORIES.find(c => c.id === categoryId);
                return category && (
                  <Badge 
                    key={categoryId} 
                    variant="secondary" 
                    className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => toggleCategory(categoryId)}
                  >
                    {category.name} ×
                  </Badge>
                );
              })}
              
              {filters.platforms.map(platformId => {
                const platform = MOCK_PLATFORMS.find(p => p.id === platformId);
                return platform && (
                  <Badge 
                    key={platformId} 
                    variant="secondary" 
                    className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => togglePlatform(platformId)}
                  >
                    {platform.name} ×
                  </Badge>
                );
              })}
              
              {filters.watchStatus !== 'all' && (
                <Badge 
                  variant="secondary" 
                  className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => updateFilter('watchStatus', 'all')}
                >
                  {filters.watchStatus === 'completed' ? '완료' : '미완료'} ×
                </Badge>
              )}
            </div>
          </div> : null}
      </CardContent>
    </Card>
  );
}