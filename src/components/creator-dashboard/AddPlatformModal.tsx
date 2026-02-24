'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Youtube, Twitter } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CreatePlatformRequest } from '@/types/creatorDashboard';

interface AddPlatformModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePlatformRequest) => void;
  isLoading?: boolean;
}

const platformOptions = [
  {
    type: 'youtube' as const,
    name: 'YouTube',
    icon: Youtube,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-600',
    placeholder: {
      id: 'UCxxx... (채널 ID)',
      username: '@channelname',
      url: 'https://www.youtube.com/channel/UCxxx...',
    },
  },
  {
    type: 'twitter' as const,
    name: 'X (Twitter)',
    icon: Twitter,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-500',
    placeholder: {
      id: '1234567890 (사용자 ID)',
      username: '@username',
      url: 'https://twitter.com/username',
    },
  },
];

export function AddPlatformModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: AddPlatformModalProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<'youtube' | 'twitter'>('youtube');
  const [formData, setFormData] = useState({
    platformId: '',
    platformUsername: '',
    platformUrl: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleClose = () => {
    setFormData({
      platformId: '',
      platformUsername: '',
      platformUrl: '',
    });
    setErrors({});
    setSelectedPlatform('youtube');
    onClose();
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.platformId.trim()) {
      newErrors.platformId = '플랫폼 ID는 필수입니다.';
    }

    if (formData.platformUrl && !formData.platformUrl.startsWith('http')) {
      newErrors.platformUrl = '올바른 URL 형식이 아닙니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const submitData: CreatePlatformRequest = {
      platformType: selectedPlatform,
      platformId: formData.platformId.trim(),
      ...(formData.platformUsername && { platformUsername: formData.platformUsername.trim() }),
      ...(formData.platformUrl && { platformUrl: formData.platformUrl.trim() }),
    };

    onSubmit(submitData);
  };

  const currentPlatform = platformOptions.find((p) => p.type === selectedPlatform)!;
  const Icon = currentPlatform.icon;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>플랫폼 추가</DialogTitle>
            <DialogDescription>
              새로운 플랫폼 계정을 연동하여 콘텐츠를 관리하세요.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* 플랫폼 선택 */}
            <div className="space-y-2">
              <Label>플랫폼 선택</Label>
              <div className="grid grid-cols-2 gap-3">
                {platformOptions.map((platform) => {
                  const PlatformIcon = platform.icon;
                  const isSelected = selectedPlatform === platform.type;

                  return (
                    <button
                      key={platform.type}
                      type="button"
                      onClick={() => setSelectedPlatform(platform.type)}
                      className={cn(
                        'flex items-center gap-3 p-4 rounded-lg border-2 transition-all',
                        isSelected
                          ? `${platform.borderColor} ${platform.bgColor}`
                          : 'border-border hover:border-gray-300'
                      )}
                    >
                      <PlatformIcon
                        className={cn('h-6 w-6', isSelected ? platform.color : 'text-gray-400')}
                      />
                      <span className={cn('font-medium', isSelected && 'text-foreground')}>
                        {platform.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 플랫폼 ID */}
            <div className="space-y-2">
              <Label htmlFor="platformId">
                플랫폼 ID <span className="text-destructive">*</span>
              </Label>
              <Input
                id="platformId"
                value={formData.platformId}
                onChange={(e) => setFormData({ ...formData, platformId: e.target.value })}
                placeholder={currentPlatform.placeholder.id}
                className={errors.platformId ? 'border-destructive' : ''}
              />
              {errors.platformId && (
                <p className="text-xs text-destructive">{errors.platformId}</p>
              )}
            </div>

            {/* 사용자명 */}
            <div className="space-y-2">
              <Label htmlFor="platformUsername">사용자명 (선택)</Label>
              <Input
                id="platformUsername"
                value={formData.platformUsername}
                onChange={(e) => setFormData({ ...formData, platformUsername: e.target.value })}
                placeholder={currentPlatform.placeholder.username}
              />
            </div>

            {/* URL */}
            <div className="space-y-2">
              <Label htmlFor="platformUrl">URL (선택)</Label>
              <Input
                id="platformUrl"
                value={formData.platformUrl}
                onChange={(e) => setFormData({ ...formData, platformUrl: e.target.value })}
                placeholder={currentPlatform.placeholder.url}
                className={errors.platformUrl ? 'border-destructive' : ''}
              />
              {errors.platformUrl && <p className="text-xs text-destructive">{errors.platformUrl}</p>}
            </div>

            {/* 안내 메시지 */}
            <div className="flex items-start gap-2 p-3 rounded-lg bg-muted">
              <Icon className={cn('h-5 w-5 mt-0.5', currentPlatform.color)} />
              <div className="text-xs text-muted-foreground">
                <p className="font-medium text-foreground mb-1">{currentPlatform.name} 연동 안내</p>
                <p>플랫폼 ID는 필수이며, 사용자명과 URL은 선택사항입니다.</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              취소
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? '추가 중...' : '추가'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
