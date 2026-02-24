'use client';

import React, { useState, useEffect } from 'react';
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
import type { CreatorPlatform, UpdatePlatformRequest } from '@/types/creatorDashboard';

interface EditPlatformModalProps {
  isOpen: boolean;
  platform: CreatorPlatform | null;
  onClose: () => void;
  onSubmit: (platformId: string, data: UpdatePlatformRequest) => void;
  isLoading?: boolean;
}

const platformIcons = {
  youtube: Youtube,
  twitter: Twitter,
};

const platformColors = {
  youtube: 'text-red-600',
  twitter: 'text-blue-500',
};

const platformBgColors = {
  youtube: 'bg-red-50',
  twitter: 'bg-blue-50',
};

const platformNames = {
  youtube: 'YouTube',
  twitter: 'X (Twitter)',
};

export function EditPlatformModal({
  isOpen,
  platform,
  onClose,
  onSubmit,
  isLoading = false,
}: EditPlatformModalProps) {
  const [formData, setFormData] = useState({
    platformUsername: '',
    platformUrl: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // platform이 변경될 때 formData 초기화
  useEffect(() => {
    if (platform) {
      setFormData({
        platformUsername: platform.platformUsername || '',
        platformUrl: platform.platformUrl || '',
      });
      setErrors({});
    }
  }, [platform]);

  const handleClose = () => {
    setFormData({
      platformUsername: '',
      platformUrl: '',
    });
    setErrors({});
    onClose();
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.platformUrl && !formData.platformUrl.startsWith('http')) {
      newErrors.platformUrl = '올바른 URL 형식이 아닙니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!platform || !validateForm()) return;

    const submitData: UpdatePlatformRequest = {
      ...(formData.platformUsername && { platformUsername: formData.platformUsername.trim() }),
      ...(formData.platformUrl && { platformUrl: formData.platformUrl.trim() }),
    };

    // 빈 객체인 경우 아무것도 제출하지 않음
    if (Object.keys(submitData).length === 0) {
      handleClose();
      return;
    }

    onSubmit(platform.id, submitData);
  };

  if (!platform) return null;

  const Icon = platformIcons[platform.platformType];
  const colorClass = platformColors[platform.platformType];
  const bgColorClass = platformBgColors[platform.platformType];
  const platformName = platformNames[platform.platformType];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>플랫폼 정보 수정</DialogTitle>
            <DialogDescription>
              {platformName} 계정 정보를 수정합니다.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* 플랫폼 정보 표시 */}
            <div className={cn('flex items-center gap-3 p-4 rounded-lg', bgColorClass)}>
              <Icon className={cn('h-6 w-6', colorClass)} />
              <div>
                <p className="font-semibold">{platformName}</p>
                <p className="text-sm text-muted-foreground">
                  플랫폼 ID: <code className="text-xs">{platform.platformId}</code>
                </p>
              </div>
            </div>

            {/* 안내 메시지 */}
            <div className="p-3 rounded-lg bg-muted text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">수정 가능한 정보</p>
              <p>플랫폼 ID는 변경할 수 없습니다. 사용자명과 URL만 수정 가능합니다.</p>
            </div>

            {/* 사용자명 */}
            <div className="space-y-2">
              <Label htmlFor="platformUsername">사용자명</Label>
              <Input
                id="platformUsername"
                value={formData.platformUsername}
                onChange={(e) => setFormData({ ...formData, platformUsername: e.target.value })}
                placeholder="@username"
              />
              <p className="text-xs text-muted-foreground">
                현재: {platform.platformUsername || '설정되지 않음'}
              </p>
            </div>

            {/* URL */}
            <div className="space-y-2">
              <Label htmlFor="platformUrl">URL</Label>
              <Input
                id="platformUrl"
                value={formData.platformUrl}
                onChange={(e) => setFormData({ ...formData, platformUrl: e.target.value })}
                placeholder={`https://${platform.platformType === 'youtube' ? 'youtube.com' : 'twitter.com'}/...`}
                className={errors.platformUrl ? 'border-destructive' : ''}
              />
              {errors.platformUrl && (
                <p className="text-xs text-destructive">{errors.platformUrl}</p>
              )}
              <p className="text-xs text-muted-foreground">
                현재: {platform.platformUrl || '설정되지 않음'}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              취소
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? '수정 중...' : '수정'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
