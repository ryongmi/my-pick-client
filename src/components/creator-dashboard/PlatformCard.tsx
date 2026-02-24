'use client';

import React from 'react';
import { Youtube, Twitter, MoreVertical, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import type { CreatorPlatform } from '@/types/creatorDashboard';
import { cn } from '@/lib/utils';

interface PlatformCardProps {
  platform: CreatorPlatform;
  onEdit: (platform: CreatorPlatform) => void;
  onDelete: (platformId: string) => void;
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

export function PlatformCard({ platform, onEdit, onDelete }: PlatformCardProps) {
  const Icon = platformIcons[platform.platformType];
  const colorClass = platformColors[platform.platformType];
  const bgColorClass = platformBgColors[platform.platformType];
  const platformName = platformNames[platform.platformType];

  const formatNumber = (num?: number) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '동기화 안됨';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;
    return date.toLocaleDateString('ko-KR');
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn('p-2 rounded-lg', bgColorClass)}>
              <Icon className={cn('h-6 w-6', colorClass)} />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{platformName}</h3>
              {platform.platformUsername && (
                <p className="text-sm text-muted-foreground">@{platform.platformUsername}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {platform.isActive ? (
              <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                <CheckCircle className="h-3 w-3 mr-1" />
                활성
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                <XCircle className="h-3 w-3 mr-1" />
                비활성
              </Badge>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(platform)}>
                  <Edit className="h-4 w-4 mr-2" />
                  수정
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(platform.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  삭제
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 플랫폼 정보 */}
        <div className="space-y-2">
          {platform.platformUrl && (
            <div className="text-sm">
              <span className="text-muted-foreground">URL: </span>
              <a
                href={platform.platformUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline truncate"
              >
                {platform.platformUrl}
              </a>
            </div>
          )}
          <div className="text-sm">
            <span className="text-muted-foreground">플랫폼 ID: </span>
            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{platform.platformId}</code>
          </div>
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-3 gap-4 pt-3 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold">{formatNumber(platform.followerCount)}</p>
            <p className="text-xs text-muted-foreground">팔로워</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{formatNumber(platform.contentCount)}</p>
            <p className="text-xs text-muted-foreground">콘텐츠</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{formatNumber(platform.totalViews)}</p>
            <p className="text-xs text-muted-foreground">조회수</p>
          </div>
        </div>

        {/* 동기화 정보 */}
        <div className="pt-3 border-t">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>마지막 동기화</span>
            <span>{formatDate(platform.lastSyncAt)}</span>
          </div>
          {platform.syncProgress && (
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">
                  동기화: {platform.syncProgress.synced} / {platform.syncProgress.total}
                </span>
                {platform.syncProgress.failed > 0 && (
                  <span className="text-destructive">실패: {platform.syncProgress.failed}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
