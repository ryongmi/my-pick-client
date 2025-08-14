'use client';

import { useState, useEffect } from 'react';
import { Search, TrendingUp, Clock, User, Tag, Play } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SearchSuggestionsProps {
  query: string;
  onSelect: (suggestion: string) => void;
}

interface Suggestion {
  id: string;
  text: string;
  type: 'query' | 'creator' | 'category' | 'video';
  metadata?: {
    subscriberCount?: number;
    videoCount?: number;
    category?: string;
    viewCount?: number;
  };
}

// Mock 자동완성 데이터
const MOCK_SUGGESTIONS: Suggestion[] = [
  {
    id: '1',
    text: 'Ado 새로운 커버곡',
    type: 'query',
  },
  {
    id: '2', 
    text: 'Ado',
    type: 'creator',
    metadata: {
      subscriberCount: 7200000,
      category: '음악',
    }
  },
  {
    id: '3',
    text: 'Ado 라이브',
    type: 'query',
  },
  {
    id: '4',
    text: '【歌ってみた】새로운 커버곡 / Ado',
    type: 'video',
    metadata: {
      viewCount: 520000,
      category: '음악',
    }
  },
  {
    id: '5',
    text: '음악',
    type: 'category',
    metadata: {
      videoCount: 1250,
    }
  },
  {
    id: '6',
    text: '히카킨 검증',
    type: 'query',
  },
  {
    id: '7',
    text: '히카킨',
    type: 'creator',
    metadata: {
      subscriberCount: 5400000,
      category: '엔터테인먼트',
    }
  },
  {
    id: '8',
    text: '엔터테인먼트',
    type: 'category',
    metadata: {
      videoCount: 890,
    }
  },
];

export function SearchSuggestions({ query, onSelect }: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setIsVisible(false);
      return;
    }

    // 검색어와 매칭되는 자동완성 필터링
    const filtered = MOCK_SUGGESTIONS.filter(suggestion =>
      suggestion.text.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 8);

    setSuggestions(filtered);
    setIsVisible(filtered.length > 0);
    setSelectedIndex(-1);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isVisible || suggestions.length === 0) {return;}

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < suggestions.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && suggestions[selectedIndex]) {
            onSelect(suggestions[selectedIndex].text);
          }
          break;
        case 'Escape':
          setIsVisible(false);
          setSelectedIndex(-1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, suggestions, selectedIndex, onSelect]);

  const handleSuggestionClick = (suggestion: Suggestion) => {
    onSelect(suggestion.text);
    setIsVisible(false);
  };

  const getTypeIcon = (type: Suggestion['type']) => {
    switch (type) {
      case 'creator':
        return <User className="h-4 w-4 text-blue-500" />;
      case 'category':
        return <Tag className="h-4 w-4 text-green-500" />;
      case 'video':
        return <Play className="h-4 w-4 text-red-500" />;
      default:
        return <Search className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTypeLabel = (type: Suggestion['type']) => {
    switch (type) {
      case 'creator':
        return '크리에이터';
      case 'category':
        return '카테고리';
      case 'video':
        return '비디오';
      default:
        return '';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return Math.floor(num / 1000000) + 'M';
    }
    if (num >= 1000) {
      return Math.floor(num / 1000) + 'K';
    }
    return num.toString();
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) {return text;}

    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (part.toLowerCase() === query.toLowerCase()) {
        return (
          <mark key={index} className="bg-yellow-200 text-yellow-800 rounded px-0.5">
            {part}
          </mark>
        );
      }
      return part;
    });
  };

  if (!isVisible || suggestions.length === 0) {
    return null;
  }

  return (
    <Card className="absolute top-full left-0 right-0 mt-1 z-50 shadow-lg border">
      <CardContent className="p-2">
        <div className="space-y-1">
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
                selectedIndex === index
                  ? "bg-accent"
                  : "hover:bg-accent/50"
              )}
            >
              {/* 타입 아이콘 */}
              <div className="flex-shrink-0">
                {getTypeIcon(suggestion.type)}
              </div>

              {/* 제안 내용 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">
                    {highlightMatch(suggestion.text, query)}
                  </span>
                  
                  {suggestion.type !== 'query' && (
                    <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      {getTypeLabel(suggestion.type)}
                    </span>
                  )}
                </div>

                {/* 메타데이터 */}
                {suggestion.metadata ? <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    {suggestion.metadata.subscriberCount ? <span>구독자 {formatNumber(suggestion.metadata.subscriberCount)}명</span> : null}
                    {suggestion.metadata.videoCount ? <span>{formatNumber(suggestion.metadata.videoCount)}개 영상</span> : null}
                    {suggestion.metadata.viewCount ? <span>조회수 {formatNumber(suggestion.metadata.viewCount)}</span> : null}
                    {suggestion.metadata.category ? <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">
                        {suggestion.metadata.category}
                      </span> : null}
                  </div> : null}
              </div>

              {/* 바로가기 표시 */}
              <div className="flex-shrink-0">
                <kbd className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                  Enter
                </kbd>
              </div>
            </button>
          ))}
        </div>

        {/* 키보드 힌트 */}
        <div className="border-t mt-2 pt-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="bg-muted px-1 py-0.5 rounded">↑</kbd>
                <kbd className="bg-muted px-1 py-0.5 rounded">↓</kbd>
                탐색
              </span>
              <span className="flex items-center gap-1">
                <kbd className="bg-muted px-1.5 py-0.5 rounded">Enter</kbd>
                선택
              </span>
              <span className="flex items-center gap-1">
                <kbd className="bg-muted px-1.5 py-0.5 rounded">Esc</kbd>
                닫기
              </span>
            </div>
            <span>{suggestions.length}개 제안</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}