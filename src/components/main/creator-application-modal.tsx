'use client';

import { useState } from 'react';
import { X, Youtube, X as XIcon, AlertCircle } from 'lucide-react';
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
  platform: 'youtube' | 'twitter';
  channelId: string;
  channelUrl: string;
  registrationMessage: string;
}

export function CreatorApplicationModal({ isOpen, onClose }: CreatorApplicationModalProps): JSX.Element | null {
  const dispatch = useAppDispatch();
  const { isSubmitting, applicationStatus, error } = useAppSelector(state => state.creatorApplication);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<ApplicationFormData>({
    platform: 'youtube',
    channelId: '',
    channelUrl: '',
    registrationMessage: ''
  });

  if (!isOpen) {return null;}

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.channelId.trim()) {
      newErrors.channelId = '채널 ID를 입력해주세요.';
    }

    if (!formData.channelUrl.trim()) {
      newErrors.channelUrl = '채널 URL을 입력해주세요.';
    } else {
      // 플랫폼별 URL 검증
      if (formData.platform === 'youtube' && !formData.channelUrl.includes('youtube.com/')) {
        newErrors.channelUrl = '올바른 YouTube 채널 URL을 입력해주세요.';
      } else if (formData.platform === 'twitter' && !formData.channelUrl.includes('twitter.com/') && !formData.channelUrl.includes('x.com/')) {
        newErrors.channelUrl = '올바른 X URL을 입력해주세요.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) {return;}

    try {
      const applicationData = {
        platform: formData.platform,
        channelId: formData.channelId,
        channelUrl: formData.channelUrl,
        ...(formData.registrationMessage.trim() && { registrationMessage: formData.registrationMessage })
      };

      if (applicationStatus === 'rejected') {
        await dispatch(resubmitCreatorApplication(applicationData)).unwrap();
      } else {
        await dispatch(submitCreatorApplication(applicationData)).unwrap();
      }

      alert('크리에이터 신청이 완료되었습니다. 검토 후 연락드리겠습니다.');
      onClose();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('신청 실패:', error);
    }
  };

  const updateFormData = (field: string, value: unknown): void => {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-xl overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              {formData.platform === 'youtube' ? (
                <Youtube className="h-5 w-5 text-red-500" />
              ) : (
                <XIcon className="h-5 w-5 text-black" />
              )}
              크리에이터 신청
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              채널 정보를 입력해주세요. 나머지 정보는 자동으로 수집됩니다.
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* 콘텐츠 */}
        <div className="p-6">
          {error ? (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          ) : null}

          <div className="space-y-4">
            {/* 플랫폼 선택 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                플랫폼 <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => updateFormData('platform', 'youtube')}
                  className={cn(
                    'p-3 rounded-lg border-2 flex items-center justify-center gap-2 transition-colors',
                    formData.platform === 'youtube'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <Youtube className="h-5 w-5" />
                  <span className="font-medium">YouTube</span>
                </button>
                <button
                  type="button"
                  disabled
                  className={cn(
                    'p-3 rounded-lg border-2 flex items-center justify-center gap-2 transition-colors',
                    'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                  )}
                  title="X는 현재 지원하지 않습니다"
                >
                  <XIcon className="h-5 w-5" />
                  <span className="font-medium">X</span>
                  <span className="text-xs">(준비중)</span>
                </button>
              </div>
            </div>

            {/* 채널 ID */}
            <div>
              <label className="block text-sm font-medium mb-2">
                채널 ID <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.channelId}
                onChange={(e) => updateFormData('channelId', e.target.value)}
                placeholder={formData.platform === 'youtube' ? '예: UCXuqSBlHAE6Xw-yeJA0Tunw' : '예: username'}
                className={cn(errors.channelId && 'border-red-500')}
              />
              {errors.channelId ? (
                <p className="text-red-500 text-xs mt-1">{errors.channelId}</p>
              ) : (
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.platform === 'youtube'
                    ? 'YouTube 채널의 고유 ID를 입력하세요'
                    : 'X 사용자 이름을 입력하세요'}
                </p>
              )}
            </div>

            {/* 채널 URL */}
            <div>
              <label className="block text-sm font-medium mb-2">
                채널 URL <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.channelUrl}
                onChange={(e) => updateFormData('channelUrl', e.target.value)}
                placeholder={
                  formData.platform === 'youtube'
                    ? 'https://www.youtube.com/channel/UC...'
                    : 'https://x.com/username'
                }
                className={cn(errors.channelUrl && 'border-red-500')}
              />
              {errors.channelUrl ? (
                <p className="text-red-500 text-xs mt-1">{errors.channelUrl}</p>
              ) : null}
            </div>

            {/* 신청 메시지 (선택) */}
            <div>
              <label className="block text-sm font-medium mb-2">
                신청 메시지 (선택)
              </label>
              <textarea
                value={formData.registrationMessage}
                onChange={(e) => updateFormData('registrationMessage', e.target.value)}
                placeholder="크리에이터로 활동하고 싶은 이유나 추가로 전달하고 싶은 내용을 작성해주세요..."
                rows={4}
                maxLength={500}
                className="w-full border border-input rounded-lg px-3 py-2 bg-background resize-none text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1 text-right">
                {formData.registrationMessage.length}/500
              </p>
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-between p-6 border-t bg-gray-50">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            취소
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? '제출 중...' : '신청 완료'}
          </Button>
        </div>
      </div>
    </div>
  );
}
