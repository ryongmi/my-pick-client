'use client';

import { X, Clock, CheckCircle, XCircle, AlertCircle, Calendar, User, Youtube } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { closeStatusModal, openApplicationModal } from '@/store/slices/creatorApplicationSlice';
import { cn } from '@/lib/utils';

interface CreatorStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatorStatusModal({ isOpen, onClose }: CreatorStatusModalProps) {
  const dispatch = useAppDispatch();
  const { currentApplication, applicationStatus } = useAppSelector(state => state.creatorApplication);

  if (!isOpen || !currentApplication) return null;

  const getStatusInfo = () => {
    switch (applicationStatus) {
      case 'pending':
        return {
          icon: Clock,
          title: '검토 대기 중',
          description: '크리에이터 신청이 접수되었습니다. 검토 완료까지 영업일 기준 3-5일 소요됩니다.',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200'
        };
      case 'approved':
        return {
          icon: CheckCircle,
          title: '신청 승인됨',
          description: '축하합니다! 크리에이터 신청이 승인되었습니다. 이제 크리에이터 기능을 사용할 수 있습니다.',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case 'rejected':
        return {
          icon: XCircle,
          title: '신청 거부됨',
          description: '아쉽게도 크리에이터 신청이 거부되었습니다. 하단의 사유를 확인해주세요.',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      default:
        return {
          icon: AlertCircle,
          title: '알 수 없는 상태',
          description: '신청 상태를 확인할 수 없습니다.',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  const handleResubmit = () => {
    onClose();
    dispatch(openApplicationModal());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Youtube className="h-5 w-5 text-red-500" />
              크리에이터 신청 상태
            </h2>
            <p className="text-sm text-muted-foreground">
              신청일: {new Date(currentApplication.appliedAt).toLocaleDateString('ko-KR')}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* 상태 표시 */}
        <div className="p-6">
          <div className={cn(
            'flex items-center p-4 rounded-lg border-2',
            statusInfo.bgColor,
            statusInfo.borderColor
          )}>
            <StatusIcon className={cn('h-8 w-8 mr-4', statusInfo.color)} />
            <div>
              <h3 className={cn('text-lg font-semibold', statusInfo.color)}>
                {statusInfo.title}
              </h3>
              <p className="text-gray-700 mt-1">
                {statusInfo.description}
              </p>
            </div>
          </div>

          {/* 신청 정보 */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">신청 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">채널명</label>
                  <p className="mt-1 font-medium">{currentApplication.applicationData.channelName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">구독자 수</label>
                  <p className="mt-1 font-medium">
                    {currentApplication.applicationData.subscriberCount.toLocaleString()}명
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">카테고리</label>
                  <div className="mt-1">
                    {Array.isArray(currentApplication.applicationData.contentCategory) ? (
                      <div className="flex flex-wrap gap-1">
                        {currentApplication.applicationData.contentCategory.map((category, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p>{currentApplication.applicationData.contentCategory}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">신청일</label>
                  <p className="mt-1">
                    {new Date(currentApplication.appliedAt).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">채널 설명</label>
                <p className="mt-1 text-sm p-3 bg-gray-50 rounded">
                  {currentApplication.applicationData.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 검토 결과 (승인/거부 시) */}
          {(applicationStatus === 'approved' || applicationStatus === 'rejected') && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">검토 결과</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">검토일</label>
                    <p className="mt-1">
                      {currentApplication.reviewedAt 
                        ? new Date(currentApplication.reviewedAt).toLocaleDateString('ko-KR')
                        : '정보 없음'
                      }
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">검토자</label>
                    <p className="mt-1">{currentApplication.reviewedBy || '관리자'}</p>
                  </div>
                </div>

                {currentApplication.rejectionReason && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-500">거부 사유</label>
                    <p className="mt-1 text-sm p-3 bg-red-50 rounded border border-red-200">
                      {currentApplication.rejectionReason}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            닫기
          </Button>
          
          {applicationStatus === 'rejected' && (
            <Button onClick={handleResubmit} className="bg-indigo-600 hover:bg-indigo-700">
              재신청하기
            </Button>
          )}
          
          {applicationStatus === 'approved' && (
            <Button 
              onClick={() => {
                // TODO: 크리에이터 대시보드로 이동
                window.location.href = '/creator-dashboard';
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              크리에이터 대시보드로
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}