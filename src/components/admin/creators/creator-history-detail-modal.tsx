'use client';

import { useState } from 'react';
import {
  X,
  CheckCircle,
  XCircle,
  Youtube,
  User,
  ExternalLink,
  Copy,
  Check,
  Globe,
  Instagram,
  Twitter,
  Calendar,
  Eye,
  Mail,
  MessageSquare,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CreatorApplication } from '@/types/userManagement';

interface CreatorHistoryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: CreatorApplication | null;
}

export function CreatorHistoryDetailModal({ 
  isOpen, 
  onClose, 
  application 
}: CreatorHistoryDetailModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen || !application) {return null;}

  const handleCopy = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error('복사 실패:', error);
    }
  };

  const formatSubscriberCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toLocaleString();
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          icon: <CheckCircle className="h-6 w-6" />,
          text: '승인됨',
          bgColor: 'bg-green-100',
          textColor: 'text-green-700',
          borderColor: 'border-green-200',
        };
      case 'rejected':
        return {
          icon: <XCircle className="h-6 w-6" />,
          text: '거부됨',
          bgColor: 'bg-red-100',
          textColor: 'text-red-700',
          borderColor: 'border-red-200',
        };
      default:
        return {
          icon: <Calendar className="h-6 w-6" />,
          text: '대기중',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-700',
          borderColor: 'border-yellow-200',
        };
    }
  };

  const statusInfo = getStatusInfo(application.status);

  const CopyButton = ({ text, fieldName }: { text: string; fieldName: string }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleCopy(text, fieldName)}
      className="h-6 w-6 p-0 ml-2"
    >
      {copiedField === fieldName ? (
        <Check className="h-3 w-3 text-green-600" />
      ) : (
        <Copy className="h-3 w-3 text-gray-400" />
      )}
    </Button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden">
        {/* 헤더 - 결정 상태 */}
        <div className={cn(
          'p-6 border-b-2',
          statusInfo.bgColor,
          statusInfo.borderColor
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={cn('flex items-center gap-2', statusInfo.textColor)}>
                {statusInfo.icon}
                <div>
                  <h2 className="text-xl font-bold">{statusInfo.text}</h2>
                  <div className="flex items-center gap-4 mt-1 text-sm">
                    {application.reviewedAt ? <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(application.reviewedAt).toLocaleDateString('ko-KR')} {' '}
                        {new Date(application.reviewedAt).toLocaleTimeString('ko-KR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span> : null}
                    {application.reviewedBy ? <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        검토자: {application.reviewedBy}
                      </span> : null}
                  </div>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="p-6 space-y-6">
            {/* 거부 사유 (거부된 경우에만 표시) */}
            {application.status === 'rejected' && application.rejectionReason ? <Card className="border-red-200 bg-red-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-red-800 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    거부 사유
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-red-700">{application.rejectionReason}</p>
                </CardContent>
              </Card> : null}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 채널 정보 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Youtube className="h-5 w-5 text-red-500" />
                    채널 정보
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">채널명</label>
                    <div className="flex items-center gap-1 mt-1">
                      <p className="text-lg font-semibold">
                        {application.applicationData.channelName}
                      </p>
                      <CopyButton 
                        text={application.applicationData.channelName} 
                        fieldName="channelName" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">구독자 수</label>
                      <p className="text-lg font-semibold text-blue-600">
                        {formatSubscriberCount(application.applicationData.subscriberCount)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {application.applicationData.subscriberCount.toLocaleString()}명
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">카테고리</label>
                      <p className="text-sm mt-1 px-2 py-1 bg-gray-100 rounded-md">
                        {application.applicationData.contentCategory}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">채널 URL</label>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-blue-600 truncate flex-1">
                        {application.applicationData.channelUrl}
                      </p>
                      <CopyButton 
                        text={application.applicationData.channelUrl} 
                        fieldName="channelUrl" 
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(application.applicationData.channelUrl, '_blank')}
                        className="h-6 w-6 p-0"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">채널 설명</label>
                    <p className="text-sm mt-1 p-3 bg-gray-50 rounded-md leading-relaxed">
                      {application.applicationData.description}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* 신청자 정보 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5 text-gray-600" />
                    신청자 정보
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                      {application.user?.avatar ? (
                        <img 
                          src={application.user.avatar} 
                          alt={application.user.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-6 w-6 text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1">
                        <p className="font-semibold">
                          {application.user?.name || 'Unknown User'}
                        </p>
                        <CopyButton 
                          text={application.user?.name || ''} 
                          fieldName="userName" 
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <p className="text-sm text-gray-600">
                          {application.user?.email || 'No email'}
                        </p>
                        {application.user?.email ? <CopyButton 
                            text={application.user.email} 
                            fieldName="userEmail" 
                          /> : null}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">신청일</label>
                    <p className="text-sm mt-1">
                      {new Date(application.appliedAt).toLocaleDateString('ko-KR')} {' '}
                      {new Date(application.appliedAt).toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  {application.applicationData.businessEmail ? <div>
                      <label className="text-sm font-medium text-gray-600">비즈니스 이메일</label>
                      <div className="flex items-center gap-1 mt-1">
                        <p className="text-sm">{application.applicationData.businessEmail}</p>
                        <CopyButton 
                          text={application.applicationData.businessEmail} 
                          fieldName="businessEmail" 
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(`mailto:${application.applicationData.businessEmail}`, '_blank')}
                          className="h-6 w-6 p-0"
                        >
                          <Mail className="h-3 w-3" />
                        </Button>
                      </div>
                    </div> : null}
                </CardContent>
              </Card>
            </div>

            {/* 제출 자료 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-blue-500" />
                  제출 자료
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 샘플 비디오 */}
                {application.applicationData.sampleVideos.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-2 block">
                      샘플 비디오 ({application.applicationData.sampleVideos.length}개)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {application.applicationData.sampleVideos.map((videoId, index) => (
                        <div 
                          key={index} 
                          className="p-3 border rounded-lg hover:border-blue-300 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">비디오 {index + 1}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                // YouTube 비디오 ID라고 가정하고 URL 생성
                                const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
                                window.open(videoUrl, '_blank');
                              }}
                              className="h-6 w-6 p-0"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 truncate">{videoId}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 소셜 링크 */}
                {application.applicationData.socialLinks ? <div>
                    <label className="text-sm font-medium text-gray-600 mb-2 block">소셜 미디어</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {application.applicationData.socialLinks?.instagram ? <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <Instagram className="h-4 w-4 text-pink-500" />
                            <span className="text-sm">@{application.applicationData.socialLinks?.instagram}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CopyButton 
                              text={`https://instagram.com/${application.applicationData.socialLinks?.instagram}`} 
                              fieldName="instagram" 
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(`https://instagram.com/${application.applicationData.socialLinks?.instagram}`, '_blank')}
                              className="h-6 w-6 p-0"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        </div> : null}

                      {application.applicationData.socialLinks?.twitter ? <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <Twitter className="h-4 w-4 text-blue-500" />
                            <span className="text-sm">@{application.applicationData.socialLinks?.twitter}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CopyButton 
                              text={`https://twitter.com/${application.applicationData.socialLinks?.twitter}`} 
                              fieldName="twitter" 
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(`https://twitter.com/${application.applicationData.socialLinks?.twitter}`, '_blank')}
                              className="h-6 w-6 p-0"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        </div> : null}

                      {application.applicationData.socialLinks?.website ? <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-green-500" />
                            <span className="text-sm truncate">웹사이트</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CopyButton 
                              text={application.applicationData.socialLinks?.website} 
                              fieldName="website" 
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(application.applicationData.socialLinks?.website, '_blank')}
                              className="h-6 w-6 p-0"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        </div> : null}
                    </div>
                  </div> : null}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 푸터 */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>신청 ID: {application.id}</span>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => window.open(application.applicationData.channelUrl, '_blank')}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              채널 보기
            </Button>
            <Button onClick={onClose}>
              닫기
            </Button>
          </div>
        </div>
      </div>

      {/* 복사 성공 토스트 */}
      {copiedField ? <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-60">
          <Check className="h-4 w-4" />
          <span className="text-sm">복사되었습니다</span>
        </div> : null}
    </div>
  );
}