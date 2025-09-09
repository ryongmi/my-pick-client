'use client';

import { useState, useEffect } from 'react';
import { X, Youtube, Twitter, Instagram, Music, Tv } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { PlatformConfig } from '@/types/platform';

interface PlatformAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (platformData: Omit<PlatformConfig, 'id'>) => void;
  editingPlatform?: PlatformConfig | null;
}

const AVAILABLE_ICONS = [
  { name: 'Youtube', component: Youtube, value: 'Youtube' },
  { name: 'Twitter', component: Twitter, value: 'Twitter' },
  { name: 'Instagram', component: Instagram, value: 'Instagram' },
  { name: 'Music', component: Music, value: 'Music' },
  { name: 'Tv', component: Tv, value: 'Tv' },
];

const PRESET_COLORS = [
  '#FF0000', // YouTube Red
  '#1DA1F2', // Twitter Blue
  '#E4405F', // Instagram Pink
  '#1DB954', // Spotify Green
  '#7B68EE', // Medium Slate Blue
  '#FF6B35', // Orange
  '#4ECDC4', // Teal
  '#FFE66D', // Yellow
  '#A8E6CF', // Mint
  '#FF8B94', // Pink
];

export function PlatformAddModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingPlatform 
}: PlatformAddModalProps): JSX.Element | null {
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    icon: 'Youtube',
    color: '#FF0000',
    bgColor: 'bg-red-500',
    description: '',
    isEnabled: true,
    isDefault: false,
    order: 1,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // editingPlatform이 변경될 때마다 폼 데이터 업데이트
  useEffect(() => {
    if (isOpen) {
      if (editingPlatform) {
        // 수정 모드: 기존 데이터로 초기화
        setFormData({
          name: editingPlatform.name,
          displayName: editingPlatform.displayName,
          icon: editingPlatform.icon,
          color: editingPlatform.color,
          bgColor: editingPlatform.bgColor,
          description: editingPlatform.description || '',
          isEnabled: editingPlatform.isEnabled,
          isDefault: editingPlatform.isDefault,
          order: editingPlatform.order,
        });
      } else {
        // 추가 모드: 기본값으로 초기화
        setFormData({
          name: '',
          displayName: '',
          icon: 'Youtube',
          color: '#FF0000',
          bgColor: 'bg-red-500',
          description: '',
          isEnabled: true,
          isDefault: false,
          order: 1,
        });
      }
      // 에러 상태도 초기화
      setErrors({});
    }
  }, [isOpen, editingPlatform]);

  if (!isOpen) {return null;}

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '플랫폼 이름은 필수입니다.';
    }

    if (!formData.displayName.trim()) {
      newErrors.displayName = '표시명은 필수입니다.';
    }

    if (!formData.color) {
      newErrors.color = '색상을 선택해주세요.';
    }

    if (formData.order < 1) {
      newErrors.order = '순서는 1 이상이어야 합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // bgColor를 color 기반으로 자동 생성
    const bgColor = `bg-[${formData.color}]`;

    onSubmit({
      ...formData,
      bgColor,
    });

    // 폼 초기화는 useEffect에서 처리하므로 여기서는 모달만 닫기
    onClose();
  };

  const handleInputChange = (field: string, value: string | number | boolean): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // 에러 제거
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const selectedIcon = AVAILABLE_ICONS.find(icon => icon.value === formData.icon);
  const IconComponent = selectedIcon?.component || Youtube;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {editingPlatform ? '플랫폼 편집' : '새 플랫폼 추가'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 기본 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  플랫폼 이름 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="예: youtube, twitter"
                  className={cn(
                    "w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                    errors.name ? "border-red-500" : "border-gray-300"
                  )}
                />
                {errors.name ? <p className="text-red-500 text-sm mt-1">{errors.name}</p> : null}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  표시명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => handleInputChange('displayName', e.target.value)}
                  placeholder="예: YouTube, Twitter"
                  className={cn(
                    "w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                    errors.displayName ? "border-red-500" : "border-gray-300"
                  )}
                />
                {errors.displayName ? <p className="text-red-500 text-sm mt-1">{errors.displayName}</p> : null}
              </div>
            </div>

            {/* 아이콘 선택 */}
            <div>
              <label className="block text-sm font-medium mb-2">아이콘</label>
              <div className="grid grid-cols-5 gap-3">
                {AVAILABLE_ICONS.map((icon) => {
                  const Icon = icon.component;
                  return (
                    <button
                      key={icon.value}
                      type="button"
                      onClick={() => handleInputChange('icon', icon.value)}
                      className={cn(
                        "p-3 border-2 rounded-lg flex items-center justify-center transition-colors",
                        formData.icon === icon.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <Icon className="h-6 w-6" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 색상 선택 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                색상 <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-3 mb-3">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleInputChange('color', color)}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 transition-all",
                      formData.color === color
                        ? "border-gray-800 scale-110"
                        : "border-gray-300 hover:scale-105"
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  placeholder="#FF0000"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {errors.color ? <p className="text-red-500 text-sm mt-1">{errors.color}</p> : null}
            </div>

            {/* 미리보기 */}
            <div>
              <label className="block text-sm font-medium mb-2">미리보기</label>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                  style={{ backgroundColor: formData.color }}
                >
                  <IconComponent className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">{formData.displayName || '표시명'}</p>
                  <p className="text-sm text-muted-foreground">{formData.name || '플랫폼 이름'}</p>
                </div>
              </div>
            </div>

            {/* 설정 옵션 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">순서</label>
                <input
                  type="number"
                  min="1"
                  value={formData.order}
                  onChange={(e) => handleInputChange('order', parseInt(e.target.value))}
                  className={cn(
                    "w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                    errors.order ? "border-red-500" : "border-gray-300"
                  )}
                />
                {errors.order ? <p className="text-red-500 text-sm mt-1">{errors.order}</p> : null}
              </div>

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isEnabled}
                    onChange={(e) => handleInputChange('isEnabled', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">플랫폼 활성화</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) => handleInputChange('isDefault', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">기본 플랫폼으로 설정</span>
                </label>
              </div>
            </div>

            {/* 설명 */}
            <div>
              <label className="block text-sm font-medium mb-2">설명 (선택사항)</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="플랫폼에 대한 설명을 입력하세요..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* 액션 버튼 */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                취소
              </Button>
              <Button type="submit">
                {editingPlatform ? '수정' : '추가'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}