'use client';

import { useState, useEffect, useRef } from 'react';
import {
  CheckCircle,
  XCircle,
  Youtube,
  Search,
  Filter,
  Eye,
  ExternalLink,
  User,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  fetchApprovalHistory,
  setApprovalHistoryFilters,
  setApprovalHistoryPagination,
} from '@/store/slices/userManagementSlice';
import { cn } from '@/lib/utils';
import { CreatorApplication, CreatorApprovalHistoryFilter } from '@/types/userManagement';
import { CreatorHistoryDetailModal } from './creator-history-detail-modal';

export function CreatorApprovalHistory(): JSX.Element {
  const dispatch = useAppDispatch();
  
  // Redux state
  const {
    approvalHistory,
    approvalHistoryPagination: pagination,
    approvalHistoryFilters: filters,
    isLoadingApprovalHistory: isLoading,
  } = useAppSelector((state) => state.userManagement);
  
  // Local state
  const [searchTerm, setSearchTerm] = useState(filters.search);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<CreatorApplication | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // 초기 데이터 로드
  useEffect(() => {
    dispatch(fetchApprovalHistory({ page: pagination.page, limit: pagination.limit, filters }));
  }, [dispatch, pagination.page, pagination.limit, filters]);

  // 검색 디바운싱
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      if (searchTerm !== filters.search) {
        dispatch(setApprovalHistoryFilters({ search: searchTerm }));
      }
    }, 500);
    
    return (): void => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm, filters.search, dispatch]);

  // 필터 핸들러들
  const handleFilterChange = (key: keyof CreatorApprovalHistoryFilter, value: string): void => {
    dispatch(setApprovalHistoryFilters({ [key]: value }));
  };

  // 페이지네이션 핸들러
  const handlePageChange = (page: number): void => {
    dispatch(setApprovalHistoryPagination({ page }));
  };

  // 정렬 핸들러
  const handleSort = (sortBy: CreatorApprovalHistoryFilter['sortBy']): void => {
    const newSortOrder = filters.sortBy === sortBy && filters.sortOrder === 'desc' ? 'asc' : 'desc';
    dispatch(setApprovalHistoryFilters({ sortBy, sortOrder: newSortOrder }));
  };

  // 상세 보기 핸들러
  const handleViewDetail = (application: CreatorApplication): void => {
    setSelectedApplication(application);
    setShowDetailModal(true);
  };

  const formatSubscriberCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toLocaleString();
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string): JSX.Element | null => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getSortIcon = (column: string): JSX.Element | null => {
    if (filters.sortBy !== column) {return null;}
    return filters.sortOrder === 'asc' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">크리에이터 승인 내역</h2>
          <p className="mt-1 text-gray-600">
            승인 및 거부된 크리에이터 신청 내역을 확인합니다
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => dispatch(fetchApprovalHistory({ page: pagination.page, limit: pagination.limit, filters }))}
            disabled={isLoading}
          >
            새로고침
          </Button>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                <input
                  type="text"
                  placeholder="채널명 또는 신청자명으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                필터
                {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>

            {/* 확장된 필터 */}
            {showFilters ? <div className="grid grid-cols-1 gap-4 pt-4 border-t md:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">상태</label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">모든 상태</option>
                    <option value="approved">승인됨</option>
                    <option value="rejected">거부됨</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">검토자</label>
                  <input
                    type="text"
                    placeholder="검토자명 입력..."
                    value={filters.reviewedBy}
                    onChange={(e) => handleFilterChange('reviewedBy', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">정렬 기준</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="reviewedAt">검토일</option>
                    <option value="appliedAt">신청일</option>
                    <option value="channelName">채널명</option>
                    <option value="subscriberCount">구독자 수</option>
                  </select>
                </div>
              </div> : null}
          </div>
        </CardContent>
      </Card>

      {/* 승인 내역 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>승인 내역 ({approvalHistory.length}건)</span>
            <span className="text-sm font-normal text-muted-foreground">
              총 {pagination.total}건 중 {((pagination.page - 1) * pagination.limit) + 1}-
              {Math.min(pagination.page * pagination.limit, pagination.total)}건 표시
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th 
                    className="p-4 text-left text-sm font-medium cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('channelName')}
                  >
                    <div className="flex items-center gap-1">
                      채널 정보
                      {getSortIcon('channelName')}
                    </div>
                  </th>
                  <th className="p-4 text-center text-sm font-medium">신청자</th>
                  <th 
                    className="p-4 text-center text-sm font-medium cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('subscriberCount')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      구독자 수
                      {getSortIcon('subscriberCount')}
                    </div>
                  </th>
                  <th className="p-4 text-center text-sm font-medium">상태</th>
                  <th 
                    className="p-4 text-center text-sm font-medium cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('appliedAt')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      신청일
                      {getSortIcon('appliedAt')}
                    </div>
                  </th>
                  <th 
                    className="p-4 text-center text-sm font-medium cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('reviewedAt')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      검토일
                      {getSortIcon('reviewedAt')}
                    </div>
                  </th>
                  <th className="p-4 text-center text-sm font-medium">검토자</th>
                  <th className="p-4 text-center text-sm font-medium">액션</th>
                </tr>
              </thead>
              <tbody>
                {approvalHistory.map((application) => (
                  <tr
                    key={application.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          <Youtube className="h-6 w-6 text-red-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 truncate">
                            {application.applicationData.channelName}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {application.applicationData.contentCategory}
                          </p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-600" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium">
                              {application.user?.name || 'Unknown'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {application.user?.email || ''}
                            </p>
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="text-center">
                        <p className="font-medium">
                          {formatSubscriberCount(application.applicationData.subscriberCount)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {application.applicationData.subscriberCount.toLocaleString()}명
                        </p>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="flex items-center justify-center">
                        <span className={cn(
                          'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                          getStatusColor(application.status)
                        )}>
                          {getStatusIcon(application.status)}
                          {application.status === 'approved' ? '승인' : '거부'}
                        </span>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="text-center text-sm">
                        <p>{new Date(application.appliedAt).toLocaleDateString('ko-KR')}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(application.appliedAt).toLocaleTimeString('ko-KR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="text-center text-sm">
                        {application.reviewedAt ? (
                          <>
                            <p>{new Date(application.reviewedAt).toLocaleDateString('ko-KR')}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(application.reviewedAt).toLocaleTimeString('ko-KR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="text-center text-sm">
                        {application.reviewedBy || '-'}
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetail(application)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(application.applicationData.channelUrl, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* 페이지네이션 */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t px-4 py-3">
              <div className="text-sm text-muted-foreground">
                전체 {pagination.total}건 중 {((pagination.page - 1) * pagination.limit) + 1}-
                {Math.min(pagination.page * pagination.limit, pagination.total)}건 표시
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1 || isLoading}
                >
                  이전
                </Button>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter(page => 
                    page === 1 || 
                    page === pagination.totalPages || 
                    Math.abs(page - pagination.page) <= 1
                  )
                  .map((page, index, array) => (
                    <div key={page} className="flex items-center">
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="px-2 text-muted-foreground">...</span>
                      )}
                      <Button
                        variant={page === pagination.page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        disabled={isLoading}
                      >
                        {page}
                      </Button>
                    </div>
                  ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages || isLoading}
                >
                  다음
                </Button>
              </div>
            </div>
          )}
          
          {/* 로딩 상태 */}
          {isLoading ? <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">승인 내역을 불러오는 중...</p>
              </div>
            </div> : null}
          
          {/* 빈 상태 */}
          {!isLoading && approvalHistory.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <CheckCircle className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">승인 내역이 없습니다</p>
              <p className="text-muted-foreground">조건에 맞는 승인 내역을 찾을 수 없습니다.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 상세 모달 */}
      <CreatorHistoryDetailModal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedApplication(null);
        }}
        application={selectedApplication}
      />
    </div>
  );
}