'use client';

import React from 'react';
import { Eye, Heart, FileVideo, Link as LinkIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatNumber } from '@/lib/utils';
import type { DashboardStats } from '@/types/creatorDashboard';

interface StatsCardsProps {
  stats: DashboardStats | null;
  isLoading?: boolean;
}

export function StatsCards({ stats, isLoading = false }: StatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-8 w-8 bg-muted rounded-full mx-auto mb-2" />
                <div className="h-8 w-16 bg-muted rounded mx-auto mb-1" />
                <div className="h-4 w-12 bg-muted rounded mx-auto" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statsItems = [
    {
      icon: FileVideo,
      value: stats?.totalContents || 0,
      label: '총 콘텐츠',
      color: 'text-blue-600',
      iconBg: 'text-blue-500',
    },
    {
      icon: Eye,
      value: stats?.totalViews || 0,
      label: '총 조회수',
      color: 'text-green-600',
      iconBg: 'text-green-500',
    },
    {
      icon: Heart,
      value: stats?.totalLikes || 0,
      label: '총 좋아요',
      color: 'text-red-600',
      iconBg: 'text-red-500',
    },
    {
      icon: LinkIcon,
      value: stats?.platformCount || 0,
      label: '연동 플랫폼',
      color: 'text-purple-600',
      iconBg: 'text-purple-500',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {statsItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <Card key={index}>
            <CardContent className="p-6 text-center">
              <Icon className={`mx-auto mb-2 h-8 w-8 ${item.iconBg}`} />
              <p className={`text-3xl font-bold ${item.color}`}>
                {formatNumber(item.value)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
