'use client';

import { Card, CardContent } from '@/components/ui/card';

export function AdminContent(): JSX.Element {
  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">콘텐츠 모니터링</h1>
          <p className="mt-2 text-gray-600">
            콘텐츠 현황을 모니터링하고 관리합니다
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">
            콘텐츠 모니터링 기능이 여기에 표시됩니다.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}