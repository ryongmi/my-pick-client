'use client';

import { useState } from 'react';
import { X, Search, Plus, Youtube, Twitter, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QuickCreatorAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCreator: (creator: { name: string; displayName: string; platform: string; url: string }) => void;
}

// 플랫폼 타입 정의
const PLATFORMS = [
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'text-red-600' },
  { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'text-blue-400' },
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
];

// 빠른 추천 크리에이터 (UX 개선용)
const SUGGESTED_CREATORS = [
  { name: 'PewDiePie', platform: 'youtube', displayName: 'PewDiePie', description: '게임 & 엔터테인먼트' },
  { name: 'MrBeast', platform: 'youtube', displayName: 'MrBeast', description: '챌린지 & 자선' },
  { name: 'BLACKPINK', platform: 'youtube', displayName: 'BLACKPINK', description: 'K-POP' },
  { name: 'IU_official', platform: 'instagram', displayName: '아이유', description: 'K-POP 가수' },
];

export function QuickCreatorAddModal({ isOpen, onClose, onAddCreator }: QuickCreatorAddModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);
  const [step, setStep] = useState<'search' | 'add'>('search'); // 단계별 UX

  if (!isOpen) return null;

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    // 실제로는 API 호출을 여기서 수행
    setTimeout(() => {
      setIsSearching(false);
      setStep('add');
    }, 1000);
  };

  const handleQuickAdd = (creator: typeof SUGGESTED_CREATORS[0]) => {
    onAddCreator({
      name: creator.name,
      displayName: creator.displayName,
      platform: creator.platform,
      url: `https://${creator.platform}.com/${creator.name}`
    });
    handleClose();
  };

  const handleManualAdd = () => {
    if (!searchTerm.trim() || !selectedPlatform) return;
    
    onAddCreator({
      name: searchTerm,
      displayName: searchTerm,
      platform: selectedPlatform,
      url: `https://${selectedPlatform}.com/${searchTerm}`
    });
    handleClose();
  };

  const handleClose = () => {
    setSearchTerm('');
    setSelectedPlatform('');
    setStep('search');
    setIsSearching(false);
    onClose();
  };

  const getPlatformIcon = (platformId: string) => {
    const platform = PLATFORMS.find(p => p.id === platformId);
    if (!platform) return null;
    const Icon = platform.icon;
    return <Icon className={cn('h-4 w-4', platform.color)} />;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-lg font-semibold">크리에이터 빠른 추가</h2>
            <p className="text-sm text-muted-foreground">
              {step === 'search' ? '관심있는 크리에이터를 찾아보세요' : '추가할 크리에이터 정보를 확인하세요'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 space-y-4 max-h-[calc(90vh-100px)] overflow-y-auto">
          {step === 'search' && (
            <>
              {/* 검색 섹션 */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="채널명, 사용자명 또는 URL 입력..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-10 pr-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                {/* 플랫폼 선택 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">플랫폼 선택</label>
                  <div className="flex gap-2">
                    {PLATFORMS.map((platform) => {
                      const Icon = platform.icon;
                      return (
                        <button
                          key={platform.id}
                          onClick={() => setSelectedPlatform(platform.id)}
                          className={cn(
                            'flex items-center gap-2 px-3 py-2 rounded-md border transition-all text-sm',
                            selectedPlatform === platform.id
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-input hover:border-primary/50'
                          )}
                        >
                          <Icon className={cn('h-4 w-4', platform.color)} />
                          {platform.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Button 
                  onClick={handleSearch}
                  disabled={!searchTerm.trim() || !selectedPlatform || isSearching}
                  className="w-full"
                >
                  {isSearching ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      검색 중...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      검색하기
                    </>
                  )}
                </Button>
              </div>

              {/* 구분선 */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-muted"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">또는</span>
                </div>
              </div>

              {/* 추천 크리에이터 섹션 */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium">인기 크리에이터</h3>
                <div className="space-y-2">
                  {SUGGESTED_CREATORS.map((creator, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border border-input rounded-md hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {getPlatformIcon(creator.platform)}
                        <div>
                          <p className="font-medium text-sm">{creator.displayName}</p>
                          <p className="text-xs text-muted-foreground">{creator.description}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleQuickAdd(creator)}
                        className="h-8"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        추가
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 'add' && (
            <>
              {/* 검색 결과 확인 */}
              <div className="space-y-4">
                <div className="p-4 border border-input rounded-md bg-muted/50">
                  <div className="flex items-center gap-3 mb-3">
                    {getPlatformIcon(selectedPlatform)}
                    <div>
                      <p className="font-medium">{searchTerm}</p>
                      <p className="text-sm text-muted-foreground">
                        {PLATFORMS.find(p => p.id === selectedPlatform)?.name}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    이 크리에이터를 내 목록에 추가하시겠습니까?
                  </p>
                </div>

                {/* 액션 버튼 */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setStep('search')}
                    className="flex-1"
                  >
                    다시 검색
                  </Button>
                  <Button
                    onClick={handleManualAdd}
                    className="flex-1"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    추가하기
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}