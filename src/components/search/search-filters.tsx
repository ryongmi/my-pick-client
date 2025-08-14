'use client';

import { useState } from 'react';
import { 
  Filter, 
  Calendar, 
  Clock, 
  Play, 
  User,
  Tag,
  Youtube,
  X,
  ChevronDown,
  SlidersHorizontal
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SearchFiltersState {
  duration: {
    min: number;
    max: number;
    preset: 'any' | 'short' | 'medium' | 'long';
  };
  uploadDate: 'any' | 'hour' | 'today' | 'week' | 'month' | 'year';
  sortBy: 'relevance' | 'upload_date' | 'view_count' | 'rating';
  platforms: string[];
  creators: string[];
  categories: string[];
  features: string[];
}

const DURATION_PRESETS = [
  { id: 'any', label: '모든 길이', min: 0, max: Infinity },
  { id: 'short', label: '4분 미만', min: 0, max: 240 },
  { id: 'medium', label: '4-20분', min: 240, max: 1200 },
  { id: 'long', label: '20분 이상', min: 1200, max: Infinity },
];

const UPLOAD_DATE_OPTIONS = [
  { id: 'any', label: '전체 기간' },
  { id: 'hour', label: '1시간 이내' },
  { id: 'today', label: '오늘' },
  { id: 'week', label: '이번 주' },
  { id: 'month', label: '이번 달' },
  { id: 'year', label: '올해' },
];

const SORT_OPTIONS = [
  { id: 'relevance', label: '관련도' },
  { id: 'upload_date', label: '업로드 날짜' },
  { id: 'view_count', label: '조회수' },
  { id: 'rating', label: '평점' },
];

const PLATFORM_OPTIONS = [
  { id: 'youtube', label: 'YouTube', icon: Youtube, color: 'text-red-500' },
  { id: 'twitch', label: 'Twitch', color: 'text-purple-500' },
  { id: 'niconico', label: 'Niconico', color: 'text-gray-500' },
];

const CATEGORY_OPTIONS = [
  '음악', '엔터테인먼트', 'Vlog', '리뷰', '게임', '요리', '운동', '여행',
  '교육', '뉴스', '코미디', '영화', '애니메이션', '과학', '기술'
];

const FEATURE_OPTIONS = [
  { id: 'hd', label: 'HD 화질' },
  { id: '4k', label: '4K 화질' },
  { id: 'subtitles', label: '자막' },
  { id: 'live', label: '라이브' },
  { id: 'creative_commons', label: 'Creative Commons' },
  { id: '360', label: '360도 영상' },
  { id: 'vr', label: 'VR 영상' },
];

export function SearchFilters() {
  const [filters, setFilters] = useState<SearchFiltersState>({
    duration: { min: 0, max: Infinity, preset: 'any' },
    uploadDate: 'any',
    sortBy: 'relevance',
    platforms: [],
    creators: [],
    categories: [],
    features: [],
  });

  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['duration', 'platforms'])
  );

  const [creatorInput, setCreatorInput] = useState('');

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const updateFilter = <K extends keyof SearchFiltersState>(
    key: K,
    value: SearchFiltersState[K]
  ) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const addCreator = (creatorName: string) => {
    if (!creatorName.trim() || filters.creators.includes(creatorName)) {return;}
    
    updateFilter('creators', [...filters.creators, creatorName]);
    setCreatorInput('');
  };

  const removeCreator = (creatorName: string) => {
    updateFilter('creators', filters.creators.filter(c => c !== creatorName));
  };

  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    updateFilter('categories', newCategories);
  };

  const togglePlatform = (platform: string) => {
    const newPlatforms = filters.platforms.includes(platform)
      ? filters.platforms.filter(p => p !== platform)
      : [...filters.platforms, platform];
    updateFilter('platforms', newPlatforms);
  };

  const toggleFeature = (feature: string) => {
    const newFeatures = filters.features.includes(feature)
      ? filters.features.filter(f => f !== feature)
      : [...filters.features, feature];
    updateFilter('features', newFeatures);
  };

  const clearAllFilters = () => {
    setFilters({
      duration: { min: 0, max: Infinity, preset: 'any' },
      uploadDate: 'any',
      sortBy: 'relevance',
      platforms: [],
      creators: [],
      categories: [],
      features: [],
    });
    setCreatorInput('');
  };

  const hasActiveFilters = 
    filters.duration.preset !== 'any' ||
    filters.uploadDate !== 'any' ||
    filters.sortBy !== 'relevance' ||
    filters.platforms.length > 0 ||
    filters.creators.length > 0 ||
    filters.categories.length > 0 ||
    filters.features.length > 0;

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.duration.preset !== 'any') {count += 1;}
    if (filters.uploadDate !== 'any') {count += 1;}
    if (filters.sortBy !== 'relevance') {count += 1;}
    count += filters.platforms.length;
    count += filters.creators.length;
    count += filters.categories.length;
    count += filters.features.length;
    return count;
  };

  const FilterSection = ({ 
    title, 
    icon: Icon, 
    sectionKey, 
    children 
  }: {
    title: string;
    icon: any;
    sectionKey: string;
    children: React.ReactNode;
  }) => {
    const isExpanded = expandedSections.has(sectionKey);
    
    return (
      <div className="border rounded-lg">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5" />
            <span className="font-medium">{title}</span>
          </div>
          <ChevronDown 
            className={cn(
              "h-4 w-4 transition-transform",
              isExpanded && "rotate-180"
            )} 
          />
        </button>
        
        {isExpanded ? <div className="border-t p-4">
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
            <SlidersHorizontal className="h-5 w-5" />
            고급 필터
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
        {/* 업로드 날짜 */}
        <FilterSection title="업로드 날짜" icon={Calendar} sectionKey="uploadDate">
          <div className="grid grid-cols-2 gap-2">
            {UPLOAD_DATE_OPTIONS.map(option => (
              <button
                key={option.id}
                onClick={() => updateFilter('uploadDate', option.id as any)}
                className={cn(
                  "p-2 text-sm rounded border transition-colors text-left",
                  filters.uploadDate === option.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "hover:bg-accent"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* 영상 길이 */}
        <FilterSection title="영상 길이" icon={Clock} sectionKey="duration">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {DURATION_PRESETS.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => updateFilter('duration', { 
                    min: preset.min, 
                    max: preset.max, 
                    preset: preset.id as any 
                  })}
                  className={cn(
                    "p-2 text-sm rounded border transition-colors",
                    filters.duration.preset === preset.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "hover:bg-accent"
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            
            {filters.duration.preset === 'any' && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">최소 (분)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    min="0"
                    className="text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">최대 (분)</label>
                  <Input
                    type="number"
                    placeholder="무제한"
                    min="0"
                    className="text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        </FilterSection>

        {/* 플랫폼 */}
        <FilterSection title="플랫폼" icon={Play} sectionKey="platforms">
          <div className="space-y-2">
            {PLATFORM_OPTIONS.map(platform => {
              const Icon = platform.icon;
              return (
                <div key={platform.id} className="flex items-center space-x-3">
                  <Checkbox
                    checked={filters.platforms.includes(platform.id)}
                    onCheckedChange={() => togglePlatform(platform.id)}
                  />
                  <div className="flex items-center gap-2">
                    {Icon ? <Icon className={cn("h-4 w-4", platform.color)} /> : null}
                    <span className="text-sm">{platform.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </FilterSection>

        {/* 크리에이터 */}
        <FilterSection title="크리에이터" icon={User} sectionKey="creators">
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="크리에이터 이름 입력"
                value={creatorInput}
                onChange={(e) => setCreatorInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addCreator(creatorInput);
                  }
                }}
                className="text-sm"
              />
              <Button
                size="sm"
                onClick={() => addCreator(creatorInput)}
                disabled={!creatorInput.trim()}
              >
                추가
              </Button>
            </div>
            
            {filters.creators.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {filters.creators.map((creator, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => removeCreator(creator)}
                  >
                    {creator} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </FilterSection>

        {/* 카테고리 */}
        <FilterSection title="카테고리" icon={Tag} sectionKey="categories">
          <div className="grid grid-cols-3 gap-2">
            {CATEGORY_OPTIONS.map(category => (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                className={cn(
                  "p-2 text-xs rounded border transition-colors text-center",
                  filters.categories.includes(category)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "hover:bg-accent"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* 정렬 기준 */}
        <FilterSection title="정렬 기준" icon={Filter} sectionKey="sortBy">
          <div className="grid grid-cols-2 gap-2">
            {SORT_OPTIONS.map(option => (
              <button
                key={option.id}
                onClick={() => updateFilter('sortBy', option.id as any)}
                className={cn(
                  "p-2 text-sm rounded border transition-colors",
                  filters.sortBy === option.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "hover:bg-accent"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* 특수 기능 */}
        <FilterSection title="특수 기능" icon={SlidersHorizontal} sectionKey="features">
          <div className="space-y-2">
            {FEATURE_OPTIONS.map(feature => (
              <div key={feature.id} className="flex items-center space-x-3">
                <Checkbox
                  checked={filters.features.includes(feature.id)}
                  onCheckedChange={() => toggleFeature(feature.id)}
                />
                <span className="text-sm">{feature.label}</span>
              </div>
            ))}
          </div>
        </FilterSection>

        {/* 현재 적용된 필터 요약 */}
        {hasActiveFilters ? <div className="pt-4 border-t">
            <p className="text-sm font-medium mb-3">적용된 필터:</p>
            <div className="flex flex-wrap gap-2">
              {filters.duration.preset !== 'any' && (
                <Badge variant="outline" className="text-xs">
                  길이: {DURATION_PRESETS.find(p => p.id === filters.duration.preset)?.label}
                </Badge>
              )}
              {filters.uploadDate !== 'any' && (
                <Badge variant="outline" className="text-xs">
                  날짜: {UPLOAD_DATE_OPTIONS.find(o => o.id === filters.uploadDate)?.label}
                </Badge>
              )}
              {filters.sortBy !== 'relevance' && (
                <Badge variant="outline" className="text-xs">
                  정렬: {SORT_OPTIONS.find(o => o.id === filters.sortBy)?.label}
                </Badge>
              )}
              {filters.platforms.map(platform => (
                <Badge key={platform} variant="outline" className="text-xs">
                  {PLATFORM_OPTIONS.find(p => p.id === platform)?.label}
                </Badge>
              ))}
              {filters.categories.map(category => (
                <Badge key={category} variant="outline" className="text-xs">
                  {category}
                </Badge>
              ))}
              {filters.features.map(feature => (
                <Badge key={feature} variant="outline" className="text-xs">
                  {FEATURE_OPTIONS.find(f => f.id === feature)?.label}
                </Badge>
              ))}
            </div>
          </div> : null}
      </CardContent>
    </Card>
  );
}