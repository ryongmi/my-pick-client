'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function AdminSettings() {
  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">시스템 설정</h1>
          <p className="mt-2 text-gray-600">
            시스템 환경 설정을 관리합니다
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">
            시스템 설정 기능이 여기에 표시됩니다.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}