'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function AdminApi(): JSX.Element {
  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">API 키 관리</h1>
          <p className="mt-2 text-gray-600">
            API 키 및 할당량을 관리합니다
          </p>
        </div>
        <Button>API 키 추가</Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">
            API 키 관리 기능이 여기에 표시됩니다.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}