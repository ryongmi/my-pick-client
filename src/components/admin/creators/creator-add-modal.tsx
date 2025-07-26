'use client';

import { useState } from 'react';
import { X, Plus, Trash2, ExternalLink, Youtube, Twitter, Instagram } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Platform } from '@/types';
import { useAppSelector } from '@/hooks/redux';
import { selectEnabledPlatforms } from '@/store/slices/platformSlice';

interface CreatorAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatorFormData) => void;
}

interface CreatorFormData {
  name: string;
  displayName: string;
  description: string;
  platforms: {
    type: Platform['type'];
    username: string;
    url: string;
  }[];
}

// 플랫폼 아이콘 매핑 (하드코딩된 아이콘 대신 동적 매핑용)
const getPlatformIcon = (platformName: string) => {
  const iconMap: Record<string, any> = {
    'youtube': Youtube,
    'twitter': Twitter,
    'instagram': Instagram,
    'tiktok': ExternalLink,
  };
  return iconMap[platformName.toLowerCase()] || ExternalLink;
};

// 플랫폼 색상 매핑
const getPlatformColor = (platformName: string) => {
  const colorMap: Record<string, string> = {
    'youtube': 'text-red-500',
    'twitter': 'text-blue-500',
    'instagram': 'text-pink-500',
    'tiktok': 'text-purple-500',
  };
  return colorMap[platformName.toLowerCase()] || 'text-gray-500';
};

export function CreatorAddModal({ isOpen, onClose, onSubmit }: CreatorAddModalProps) {
  // Redux에서 활성화된 플랫폼 가져오기
  const enabledPlatforms = useAppSelector(selectEnabledPlatforms);
  
  // 첫 번째 활성화된 플랫폼을 기본값으로 설정 (없으면 빈 문자열)
  const defaultPlatformType = enabledPlatforms.length > 0 ? enabledPlatforms[0].name.toLowerCase() : '';
  
  const [formData, setFormData] = useState<CreatorFormData>({
    name: '',
    displayName: '',
    description: '',
    platforms: [{ type: defaultPlatformType as Platform['type'], username: '', url: '' }],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) {return null;}

  const handleInputChange = (field: keyof CreatorFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePlatformChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.map((platform, i) =>
        i === index ? { ...platform, [field]: value } : platform
      ),
    }));
  };

  const addPlatform = () => {
    setFormData(prev => ({
      ...prev,
      platforms: [...prev.platforms, { type: defaultPlatformType as Platform['type'], username: '', url: '' }],
    }));
  };

  const removePlatform = (index: number) => {
    if (formData.platforms.length > 1) {
      setFormData(prev => ({
        ...prev,
        platforms: prev.platforms.filter((_, i) => i !== index),
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '크리에이터 이름은 필수입니다.';
    }
    if (!formData.displayName.trim()) {
      newErrors.displayName = '표시 이름은 필수입니다.';
    }

    formData.platforms.forEach((platform, index) => {
      if (!platform.username.trim()) {
        newErrors[`platform_${index}_username`] = '사용자명은 필수입니다.';
      }
      if (!platform.url.trim()) {
        newErrors[`platform_${index}_url`] = 'URL은 필수입니다.';
      } else if (!isValidUrl(platform.url)) {
        newErrors[`platform_${index}_url`] = '올바른 URL 형식이 아닙니다.';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      handleReset();
      onClose();
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      displayName: '',
      description: '',
      platforms: [{ type: defaultPlatformType as Platform['type'], username: '', url: '' }],
    });
    setErrors({});
  };

  const getDynamicPlatformIcon = (type: Platform['type']) => {
    return getPlatformIcon(type);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <Card className="border-0 shadow-none">
          <CardHeader className="border-b">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl">새 크리에이터 추가</CardTitle>
                <CardDescription>
                  크리에이터 정보와 소셜 미디어 플랫폼을 등록하세요
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 기본 정보 */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">기본 정보</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      크리에이터 이름 *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="실제 이름 또는 계정명"
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name ? <p className="text-red-500 text-xs mt-1">{errors.name}</p> : null}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      표시 이름 *
                    </label>
                    <Input
                      value={formData.displayName}
                      onChange={(e) => handleInputChange('displayName', e.target.value)}
                      placeholder="사용자에게 보여질 이름"
                      className={errors.displayName ? 'border-red-500' : ''}
                    />
                    {errors.displayName ? <p className="text-red-500 text-xs mt-1">{errors.displayName}</p> : null}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    설명 (선택)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="크리에이터에 대한 간단한 설명"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>

              {/* 플랫폼 정보 */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">플랫폼 정보</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addPlatform}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    플랫폼 추가
                  </Button>
                </div>

                {/* 활성화된 플랫폼이 없을 때 안내 메시지 */}
                {enabledPlatforms.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <ExternalLink className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">활성화된 플랫폼이 없습니다</h3>
                    <p className="text-gray-600 mb-4">크리에이터를 추가하려면 먼저 플랫폼을 활성화해주세요.</p>
                    <Button variant="outline" onClick={onClose}>
                      플랫폼 관리로 이동
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.platforms.map((platform, index) => {
                      const PlatformIcon = getDynamicPlatformIcon(platform.type);
                      const platformColor = getPlatformColor(platform.type);
                      const platformData = enabledPlatforms.find(p => p.name.toLowerCase() === platform.type);
                      
                      return (
                        <div key={index} className="border rounded-lg p-4 bg-gray-50">
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2">
                              <PlatformIcon className={`h-5 w-5 ${platformColor}`} />
                              <span className="font-medium">플랫폼 {index + 1}</span>
                            </div>
                            {formData.platforms.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removePlatform(index)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              플랫폼 타입
                            </label>
                            <select
                              value={platform.type}
                              onChange={(e) => handlePlatformChange(index, 'type', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              {enabledPlatforms.map(platformOption => (
                                <option key={platformOption.id} value={platformOption.name.toLowerCase()}>
                                  {platformOption.displayName}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">
                              사용자명 *
                            </label>
                            <Input
                              value={platform.username}
                              onChange={(e) => handlePlatformChange(index, 'username', e.target.value)}
                              placeholder="@username"
                              className={errors[`platform_${index}_username`] ? 'border-red-500' : ''}
                            />
                            {errors[`platform_${index}_username`] ? <p className="text-red-500 text-xs mt-1">
                                {errors[`platform_${index}_username`]}
                              </p> : null}
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">
                              URL *
                            </label>
                            <Input
                              value={platform.url}
                              onChange={(e) => handlePlatformChange(index, 'url', e.target.value)}
                              placeholder="https://..."
                              className={errors[`platform_${index}_url`] ? 'border-red-500' : ''}
                            />
                            {errors[`platform_${index}_url`] ? <p className="text-red-500 text-xs mt-1">
                                {errors[`platform_${index}_url`]}
                              </p> : null}
                          </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 액션 버튼 */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    handleReset();
                    onClose();
                  }}
                >
                  취소
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                >
                  초기화
                </Button>
                <Button type="submit">
                  크리에이터 추가
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}