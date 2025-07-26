'use client';

import { useState, useEffect } from 'react';
import {
  X,
  Youtube,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ExternalLink,
  User,
  Calendar,
  Eye,
  MessageSquare,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  fetchCreatorApplications,
  processCreatorApplication,
} from '@/store/slices/userManagementSlice';
import { cn } from '@/lib/utils';
import { CreatorApplication } from '@/types/userManagement';

interface CreatorApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatorApprovalModal({ isOpen, onClose }: CreatorApprovalModalProps) {
  const dispatch = useAppDispatch();
  const { creatorApplications, isLoading } = useAppSelector(
    (state) => state.userManagement
  );

  const [selectedApplication, setSelectedApplication] = useState<CreatorApplication | null>(null);
  const [reviewMessage, setReviewMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | null>(null);

  // 크리에이터 신청 목록 로드
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchCreatorApplications());
    }
  }, [dispatch, isOpen]);

  if (!isOpen) {return null;}

  // 대기 중인 신청만 필터링
  const pendingApplications = creatorApplications.filter(app => app.status === 'pending');

  const handleApplicationSelect = (application: CreatorApplication) => {
    setSelectedApplication(application);
    setReviewMessage('');
  };

  const handleAction = (action: 'approve' | 'reject') => {
    setConfirmAction(action);
    setShowConfirmDialog(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedApplication || !confirmAction) {return;}

    setIsProcessing(true);
    try {
      await dispatch(processCreatorApplication({
        applicationId: selectedApplication.id,
        action: confirmAction,
        reason: reviewMessage || undefined,
        reviewedBy: 'admin', // TODO: 실제 사용자 ID로 변경
      })).unwrap();

      // 성공 시 신청 목록에서 제거
      setSelectedApplication(null);
      setReviewMessage('');
      
      // 신청 목록 새로고침
      dispatch(fetchCreatorApplications());
    } catch (error) {
      console.error('크리에이터 신청 처리 실패:', error);
    } finally {
      setIsProcessing(false);
      setShowConfirmDialog(false);
      setConfirmAction(null);
    }
  };

  const handleCancelAction = () => {
    setShowConfirmDialog(false);
    setConfirmAction(null);
  };

  const formatSubscriberCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toLocaleString();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-6xl max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">크리에이터 신청 검토</h2>
            <p className="text-sm text-muted-foreground">
              대기 중인 신청: {pendingApplications.length}개
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* 왼쪽: 신청 목록 */}
          <div className="w-1/3 border-r overflow-y-auto">
            <div className="p-4">
              <h3 className="font-medium mb-4">대기 중인 신청</h3>
              
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : pendingApplications.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    모든 신청이 처리되었습니다
                  </p>
                  <p className="text-muted-foreground">
                    새로운 크리에이터 신청이 없습니다.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingApplications.map((application) => (
                    <div
                      key={application.id}
                      onClick={() => handleApplicationSelect(application)}
                      className={cn(
                        'p-3 border rounded-lg cursor-pointer transition-colors',
                        selectedApplication?.id === application.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">
                            {application.applicationData.channelName}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {application.user?.name || 'Unknown User'}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Youtube className="h-3 w-3 text-red-500" />
                            <span className="text-xs text-muted-foreground">
                              {formatSubscriberCount(application.applicationData.subscriberCount)} 구독자
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(application.appliedAt).toLocaleDateString('ko-KR')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 오른쪽: 상세 정보 */}
          <div className="flex-1 overflow-y-auto">
            {selectedApplication ? (
              <div className="p-6 space-y-6">
                {/* 기본 정보 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Youtube className="h-5 w-5 text-red-500" />
                      채널 정보
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">채널명</label>
                        <p className="text-lg font-semibold">
                          {selectedApplication.applicationData.channelName}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">구독자 수</label>
                        <p className="text-lg font-semibold">
                          {selectedApplication.applicationData.subscriberCount.toLocaleString()}명
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">카테고리</label>
                        <p>{selectedApplication.applicationData.contentCategory}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">신청일</label>
                        <p>{new Date(selectedApplication.appliedAt).toLocaleDateString('ko-KR')}</p>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">채널 URL</label>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm">{selectedApplication.applicationData.channelUrl}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(selectedApplication.applicationData.channelUrl, '_blank')}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">채널 설명</label>
                      <p className="text-sm mt-1 p-3 bg-gray-50 rounded">
                        {selectedApplication.applicationData.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* 신청자 정보 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      신청자 정보
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">이름</label>
                        <p>{selectedApplication.user?.name || 'Unknown'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">이메일</label>
                        <p>{selectedApplication.user?.email || 'Unknown'}</p>
                      </div>
                      {selectedApplication.applicationData.businessEmail ? <div>
                          <label className="text-sm font-medium text-muted-foreground">비즈니스 이메일</label>
                          <p>{selectedApplication.applicationData.businessEmail}</p>
                        </div> : null}
                    </div>

                    {selectedApplication.applicationData.socialLinks ? <div className="mt-4">
                        <label className="text-sm font-medium text-muted-foreground">소셜 링크</label>
                        <div className="flex gap-4 mt-2">
                          {selectedApplication.applicationData.socialLinks.instagram ? <a
                              href={`https://instagram.com/${selectedApplication.applicationData.socialLinks.instagram}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              Instagram: {selectedApplication.applicationData.socialLinks.instagram}
                            </a> : null}
                          {selectedApplication.applicationData.socialLinks.twitter ? <a
                              href={`https://twitter.com/${selectedApplication.applicationData.socialLinks.twitter}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              Twitter: {selectedApplication.applicationData.socialLinks.twitter}
                            </a> : null}
                          {selectedApplication.applicationData.socialLinks.website ? <a
                              href={selectedApplication.applicationData.socialLinks.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              Website: {selectedApplication.applicationData.socialLinks.website}
                            </a> : null}
                        </div>
                      </div> : null}
                  </CardContent>
                </Card>

                {/* 샘플 비디오 */}
                {selectedApplication.applicationData.sampleVideos.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        샘플 비디오
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {selectedApplication.applicationData.sampleVideos.map((videoId, index) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">샘플 비디오 {index + 1}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // TODO: 실제 비디오 URL로 연결
                                console.log('View video:', videoId);
                              }}
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              보기
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* 검토 메시지 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      검토 메시지
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <textarea
                      value={reviewMessage}
                      onChange={(e) => setReviewMessage(e.target.value)}
                      placeholder="승인/거부 사유를 입력하세요..."
                      rows={4}
                      className="w-full rounded border px-3 py-2 resize-none"
                    />
                  </CardContent>
                </Card>

                {/* 액션 버튼 */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => handleAction('reject')}
                    disabled={isProcessing}
                    className="border-red-300 text-red-700 hover:bg-red-50"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    거부
                  </Button>
                  <Button
                    onClick={() => handleAction('approve')}
                    disabled={isProcessing}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    승인
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    신청을 선택하세요
                  </p>
                  <p className="text-muted-foreground">
                    왼쪽 목록에서 검토할 크리에이터 신청을 선택해주세요.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 확인 다이얼로그 */}
        {showConfirmDialog ? <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-lg p-6">
              <div className="mb-4 flex items-center">
                <div className={cn(
                  'mr-4 flex h-12 w-12 items-center justify-center rounded-full',
                  confirmAction === 'approve' ? 'bg-green-100' : 'bg-red-100'
                )}>
                  {confirmAction === 'approve' ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    크리에이터 신청 {confirmAction === 'approve' ? '승인' : '거부'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    이 작업은 되돌릴 수 없습니다.
                  </p>
                </div>
              </div>

              <p className="mb-6 text-gray-700">
                <strong>{selectedApplication?.applicationData.channelName}</strong> 채널의 
                크리에이터 신청을 {confirmAction === 'approve' ? '승인' : '거부'}하시겠습니까?
              </p>

              <div className="flex justify-end space-x-3">
                <Button 
                  variant="outline" 
                  onClick={handleCancelAction}
                  disabled={isProcessing}
                >
                  취소
                </Button>
                <Button 
                  variant={confirmAction === 'approve' ? 'default' : 'destructive'}
                  onClick={handleConfirmAction}
                  disabled={isProcessing}
                >
                  {isProcessing ? '처리 중...' : (confirmAction === 'approve' ? '승인' : '거부')}
                </Button>
              </div>
            </div>
          </div> : null}
      </div>
    </div>
  );
}