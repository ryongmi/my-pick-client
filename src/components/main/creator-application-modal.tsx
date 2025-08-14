'use client';

import { useState } from 'react';
import { X, Youtube, AlertCircle, Check, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { submitCreatorApplication, resubmitCreatorApplication } from '@/store/slices/creatorApplicationSlice';
import { cn } from '@/lib/utils';

interface CreatorApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ApplicationFormData {
  channelName: string;
  channelId: string;
  channelUrl: string;
  subscriberCount: number;
  contentCategories: string[];
  description: string;
  businessEmail: string;
  socialLinks: {
    instagram: string;
    twitter: string;
    website: string;
  };
  sampleVideos: string[];
}

const CONTENT_CATEGORIES = [
  '음악',
  '게임',
  '엔터테인먼트',
  '교육',
  '기술',
  '라이프스타일',
  '요리',
  '스포츠',
  '뷰티',
  '여행',
  '기타'
];

export function CreatorApplicationModal({ isOpen, onClose }: CreatorApplicationModalProps) {
  const dispatch = useAppDispatch();
  const { isSubmitting, applicationStatus, error } = useAppSelector(state => state.creatorApplication);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<ApplicationFormData>({
    channelName: '',
    channelId: '',
    channelUrl: '',
    subscriberCount: 0,
    contentCategories: [],
    description: '',
    businessEmail: '',
    socialLinks: {
      instagram: '',
      twitter: '',
      website: ''
    },
    sampleVideos: ['', '', '']
  });

  if (!isOpen) {return null;}

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.channelName.trim()) {
        newErrors.channelName = '채널명을 입력해주세요.';
      }
      if (!formData.channelUrl.trim()) {
        newErrors.channelUrl = '채널 URL을 입력해주세요.';
      } else if (!formData.channelUrl.includes('youtube.com/')) {
        newErrors.channelUrl = '올바른 YouTube 채널 URL을 입력해주세요.';
      }
      if (formData.subscriberCount < 1000) {
        newErrors.subscriberCount = '최소 1,000명 이상의 구독자가 필요합니다.';
      }
    }

    if (step === 2) {
      if (formData.contentCategories.length === 0) {
        newErrors.contentCategories = '최소 1개의 콘텐츠 카테고리를 선택해주세요.';
      } else if (formData.contentCategories.length > 3) {
        newErrors.contentCategories = '최대 3개까지만 선택할 수 있습니다.';
      }
      if (!formData.description.trim()) {
        newErrors.description = '채널 설명을 입력해주세요.';
      } else if (formData.description.trim().length < 50) {
        newErrors.description = '채널 설명은 최소 50자 이상 입력해주세요.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {return;}

    try {
      const applicationData = {
        channelName: formData.channelName,
        channelId: formData.channelId,
        channelUrl: formData.channelUrl,
        subscriberCount: formData.subscriberCount,
        contentCategories: formData.contentCategories,
        description: formData.description,
        businessEmail: formData.businessEmail,
        socialLinks: formData.socialLinks,
        sampleVideos: formData.sampleVideos,
      };

      if (applicationStatus === 'rejected') {
        await dispatch(resubmitCreatorApplication(applicationData)).unwrap();
      } else {
        await dispatch(submitCreatorApplication(applicationData)).unwrap();
      }
      
      // 성공 시 모달 닫기는 Redux에서 자동으로 처리됨
      alert('크리에이터 신청이 완료되었습니다. 검토 후 연락드리겠습니다.');
    } catch (error) {
      console.error('신청 실패:', error);
      // 에러는 Redux state에서 관리됨
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 에러 클리어
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const updateSocialLinks = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const updateSampleVideo = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      sampleVideos: prev.sampleVideos.map((video, i) => i === index ? value : video)
    }));
  };

  const toggleCategory = (category: string) => {
    setFormData(prev => {
      const currentCategories = prev.contentCategories;
      const isSelected = currentCategories.includes(category);
      
      if (isSelected) {
        // 카테고리 제거
        return {
          ...prev,
          contentCategories: currentCategories.filter(c => c !== category)
        };
      } else {
        // 카테고리 추가 (최대 3개까지)
        if (currentCategories.length < 3) {
          return {
            ...prev,
            contentCategories: [...currentCategories, category]
          };
        }
        return prev;
      }
    });
    
    // 에러 클리어
    if (errors.contentCategories) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.contentCategories;
        return newErrors;
      });
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">기본 채널 정보</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              채널명 <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.channelName}
              onChange={(e) => updateFormData('channelName', e.target.value)}
              placeholder="예: 히카킨TV"
              className={cn(errors.channelName && 'border-red-500')}
            />
            {errors.channelName ? <p className="text-red-500 text-xs mt-1">{errors.channelName}</p> : null}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              채널 URL <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.channelUrl}
              onChange={(e) => updateFormData('channelUrl', e.target.value)}
              placeholder="https://www.youtube.com/channel/UC..."
              className={cn(errors.channelUrl && 'border-red-500')}
            />
            {errors.channelUrl ? <p className="text-red-500 text-xs mt-1">{errors.channelUrl}</p> : null}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              구독자 수 <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              value={formData.subscriberCount}
              onChange={(e) => updateFormData('subscriberCount', parseInt(e.target.value) || 0)}
              placeholder="1000"
              min="1000"
              className={cn(errors.subscriberCount && 'border-red-500')}
            />
            {errors.subscriberCount ? <p className="text-red-500 text-xs mt-1">{errors.subscriberCount}</p> : null}
            <p className="text-xs text-muted-foreground mt-1">
              최소 1,000명 이상의 구독자가 필요합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">콘텐츠 정보</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              콘텐츠 카테고리 <span className="text-red-500">*</span>
              <span className="text-xs text-muted-foreground ml-2">(1~3개 선택)</span>
            </label>
            
            {/* 선택된 카테고리 태그 표시 */}
            {formData.contentCategories.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {formData.contentCategories.map(category => (
                  <span
                    key={category}
                    className="inline-flex items-center px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full"
                  >
                    {category}
                    <button
                      type="button"
                      onClick={() => toggleCategory(category)}
                      className="ml-1 h-3 w-3 rounded-full bg-indigo-200 hover:bg-indigo-300 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            
            {/* 카테고리 체크박스 그리드 */}
            <div className={cn(
              'grid grid-cols-2 md:grid-cols-3 gap-3 p-3 border rounded-lg',
              errors.contentCategories && 'border-red-500'
            )}>
              {CONTENT_CATEGORIES.map(category => {
                const isSelected = formData.contentCategories.includes(category);
                const isDisabled = !isSelected && formData.contentCategories.length >= 3;
                
                return (
                  <label
                    key={category}
                    className={cn(
                      'flex items-center space-x-2 p-2 rounded cursor-pointer transition-colors',
                      isSelected 
                        ? 'bg-indigo-50 border border-indigo-200' 
                        : 'hover:bg-gray-50',
                      isDisabled && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => !isDisabled && toggleCategory(category)}
                      disabled={isDisabled}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className={cn(
                      'text-sm',
                      isSelected ? 'font-medium text-indigo-700' : 'text-gray-700'
                    )}>
                      {category}
                    </span>
                  </label>
                );
              })}
            </div>
            
            {errors.contentCategories ? <p className="text-red-500 text-xs mt-1">{errors.contentCategories}</p> : null}
            
            <p className="text-xs text-muted-foreground mt-2">
              선택됨: {formData.contentCategories.length}/3
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              채널 설명 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => updateFormData('description', e.target.value)}
              placeholder="채널의 주요 콘텐츠와 특징을 설명해주세요..."
              rows={4}
              className={cn(
                'w-full border border-input rounded-lg px-3 py-2 bg-background resize-none',
                errors.description && 'border-red-500'
              )}
            />
            <div className="flex justify-between mt-1">
              {errors.description ? (
                <p className="text-red-500 text-xs">{errors.description}</p>
              ) : (
                <p className="text-xs text-muted-foreground">최소 50자 이상</p>
              )}
              <p className="text-xs text-muted-foreground">
                {formData.description.length}/500
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">추가 정보 (선택사항)</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">비즈니스 이메일</label>
            <Input
              type="email"
              value={formData.businessEmail}
              onChange={(e) => updateFormData('businessEmail', e.target.value)}
              placeholder="business@example.com"
            />
            <p className="text-xs text-muted-foreground mt-1">
              협업 제안 등을 위한 연락처
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">소셜 미디어</label>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Instagram</label>
                <Input
                  value={formData.socialLinks.instagram}
                  onChange={(e) => updateSocialLinks('instagram', e.target.value)}
                  placeholder="@username"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Twitter</label>
                <Input
                  value={formData.socialLinks.twitter}
                  onChange={(e) => updateSocialLinks('twitter', e.target.value)}
                  placeholder="@username"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">웹사이트</label>
                <Input
                  value={formData.socialLinks.website}
                  onChange={(e) => updateSocialLinks('website', e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">대표 비디오 ID (선택)</label>
            <div className="space-y-2">
              {formData.sampleVideos.map((videoId, index) => (
                <Input
                  key={index}
                  value={videoId}
                  onChange={(e) => updateSampleVideo(index, e.target.value)}
                  placeholder={`비디오 ID ${index + 1} (예: dQw4w9WgXcQ)`}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              채널을 대표하는 비디오의 YouTube ID를 입력하세요
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Youtube className="h-5 w-5 text-red-500" />
              크리에이터 신청
            </h2>
            <p className="text-sm text-muted-foreground">
              단계 {currentStep}/3
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* 진행 표시기 */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                  step <= currentStep 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                )}>
                  {step < currentStep ? <Check className="h-4 w-4" /> : step}
                </div>
                {step < 3 && (
                  <div className={cn(
                    'w-20 h-1 mx-2',
                    step < currentStep ? 'bg-primary' : 'bg-muted'
                  )} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>기본 정보</span>
            <span>콘텐츠 정보</span>
            <span>추가 정보</span>
          </div>
        </div>

        {/* 콘텐츠 */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {error ? <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
              <span className="text-red-700 text-sm">{error}</span>
            </div> : null}
          {renderStepContent()}
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-between p-6 border-t bg-gray-50">
          <Button
            variant="outline"
            onClick={currentStep === 1 ? onClose : handlePrevious}
            disabled={isSubmitting}
          >
            {currentStep === 1 ? '취소' : '이전'}
          </Button>
          
          <Button
            onClick={currentStep === 3 ? handleSubmit : handleNext}
            disabled={isSubmitting}
          >
            {isSubmitting ? '제출 중...' : currentStep === 3 ? '신청 완료' : '다음'}
          </Button>
        </div>
      </div>
    </div>
  );
}