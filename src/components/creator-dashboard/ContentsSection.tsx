'use client';

import React, { useState, useEffect } from 'react';
import {
  Eye,
  Heart,
  Search,
  EyeOff,
  CheckSquare,
  Square,
  Trash2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  fetchMyContents,
  updateContentStatus,
  deleteContent,
  bulkUpdateContentStatus,
  setFilters,
  setPage,
  setLimit,
  toggleContentSelection,
  toggleAllContentSelection,
  clearSelection,
  selectMyCreatorInfo,
  selectMyContents,
  selectFilters,
  selectSelectedContentIds,
} from '@/store/slices/creatorDashboardSlice';
import { ContentStatus, ContentStatusLabel, LimitType } from '@/types/creatorDashboard';
import { cn, formatNumber, formatDate } from '@/lib/utils';

export function ContentsSection() {
  const dispatch = useAppDispatch();

  const creatorInfo = useAppSelector(selectMyCreatorInfo);
  const contents = useAppSelector(selectMyContents);
  const filters = useAppSelector(selectFilters);
  const selectedContentIds = useAppSelector(selectSelectedContentIds);
  const { page, limit, totalContents, totalPages, isLoadingContents } = useAppSelector(
    (state) => state.creatorDashboard
  );

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // 콘텐츠 로드
  useEffect(() => {
    if (!creatorInfo?.id) return;

    const params: {
      creatorId: string;
      page?: number;
      limit?: number;
      platform?: string;
      sortBy?: string;
      sortOrder?: 'ASC' | 'DESC';
    } = {
      creatorId: creatorInfo.id,
      page: page,
      limit: limit,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder.toUpperCase() as 'ASC' | 'DESC',
    };

    if (filters.platform !== 'all') {
      params.platform = filters.platform;
    }

    dispatch(fetchMyContents(params));
  }, [dispatch, creatorInfo?.id, page, limit, filters.platform, filters.sortBy, filters.sortOrder]);

  // 필터 변경 핸들러
  const handleFilterChange = (key: string, value: string) => {
    dispatch(setFilters({ [key]: value }));
  };

  // 콘텐츠 상태 변경
  const handleStatusChange = async (contentId: string, status: ContentStatus) => {
    try {
      await dispatch(updateContentStatus({ contentId, status })).unwrap();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  // 콘텐츠 삭제
  const handleDelete = async (contentId: string) => {
    setDeleteTargetId(contentId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;

    try {
      await dispatch(deleteContent(deleteTargetId)).unwrap();
      setShowDeleteConfirm(false);
      setDeleteTargetId(null);
    } catch (error) {
      console.error('Failed to delete content:', error);
    }
  };

  // 일괄 상태 변경
  const handleBulkStatusChange = async (status: ContentStatus) => {
    if (selectedContentIds.length === 0) return;

    try {
      await dispatch(
        bulkUpdateContentStatus({
          contentIds: selectedContentIds,
          status,
        })
      ).unwrap();
    } catch (error) {
      console.error('Failed to bulk update:', error);
    }
  };

  // 페이지 변경 핸들러
  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // limit 변경 핸들러
  const handleLimitChange = (newLimit: LimitType) => {
    dispatch(setLimit(newLimit));
  };

  const allSelected = selectedContentIds.length === contents.length && contents.length > 0;

  return (
    <>
      {/* 필터 및 액션 바 */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* 검색 */}
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="콘텐츠 검색..."
                  value={filters.searchQuery}
                  onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* 플랫폼 필터 */}
            <select
              value={filters.platform}
              onChange={(e) => handleFilterChange('platform', e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 pr-8 min-w-[120px]"
            >
              <option value="all">모든 플랫폼</option>
              <option value="youtube">YouTube</option>
              <option value="twitter">Twitter</option>
            </select>

            {/* 상태 필터 */}
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 pr-8 min-w-[110px]"
            >
              <option value="all">모든 상태</option>
              <option value={ContentStatus.ACTIVE}>공개</option>
              <option value={ContentStatus.INACTIVE}>비공개</option>
            </select>

            {/* 페이지당 개수 선택 */}
            <select
              value={limit}
              onChange={(e) => handleLimitChange(Number(e.target.value) as LimitType)}
              className="rounded-md border border-input bg-background px-3 py-2 pr-8 min-w-[100px]"
            >
              <option value={LimitType.FIFTEEN}>{LimitType.FIFTEEN}개씩</option>
              <option value={LimitType.THIRTY}>{LimitType.THIRTY}개씩</option>
              <option value={LimitType.FIFTY}>{LimitType.FIFTY}개씩</option>
              <option value={LimitType.HUNDRED}>{LimitType.HUNDRED}개씩</option>
            </select>

            {/* 일괄 작업 버튼 */}
            {selectedContentIds.length > 0 && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkStatusChange(ContentStatus.INACTIVE)}
                >
                  <EyeOff className="mr-2 h-4 w-4" />
                  비공개 전환
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkStatusChange(ContentStatus.ACTIVE)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  공개 전환
                </Button>
                <Button variant="ghost" size="sm" onClick={() => dispatch(clearSelection())}>
                  선택 해제
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 콘텐츠 리스트 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>콘텐츠 관리</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dispatch(toggleAllContentSelection())}
            >
              {allSelected ? (
                <>
                  <CheckSquare className="mr-2 h-4 w-4" />
                  전체 해제
                </>
              ) : (
                <>
                  <Square className="mr-2 h-4 w-4" />
                  전체 선택
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingContents ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground">로딩 중...</p>
            </div>
          ) : contents.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">콘텐츠가 없습니다.</div>
          ) : (
            <div className="space-y-4">
              {contents.map((content) => {
                const isSelected = selectedContentIds.includes(content.id);

                return (
                  <div
                    key={content.id}
                    className={cn(
                      'flex items-center gap-4 rounded-lg border p-4 transition-colors',
                      isSelected && 'border-primary bg-primary/5'
                    )}
                  >
                    {/* 체크박스 */}
                    <button
                      onClick={() => dispatch(toggleContentSelection(content.id))}
                      className="flex-shrink-0"
                    >
                      {isSelected ? (
                        <CheckSquare className="h-5 w-5 text-primary" />
                      ) : (
                        <Square className="h-5 w-5 text-muted-foreground" />
                      )}
                    </button>

                    {/* 썸네일 */}
                    <div className="h-20 w-32 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                      {content.thumbnail && (
                        <img
                          src={content.thumbnail}
                          alt={content.title}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>

                    {/* 콘텐츠 정보 */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{content.title}</h3>
                      <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {formatNumber(content.statistics?.views || 0)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {formatNumber(content.statistics?.likes || 0)}
                        </span>
                        <span>{formatDate(content.publishedAt, 'relative')}</span>
                      </div>
                    </div>

                    {/* 상태 배지 */}
                    <Badge
                      variant={content.status === ContentStatus.ACTIVE ? 'default' : 'secondary'}
                    >
                      {ContentStatusLabel[content.status as ContentStatus] || content.status}
                    </Badge>

                    {/* 액션 버튼 */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleStatusChange(
                            content.id,
                            content.status === ContentStatus.ACTIVE
                              ? ContentStatus.INACTIVE
                              : ContentStatus.ACTIVE
                          )
                        }
                      >
                        {content.status === ContentStatus.ACTIVE ? (
                          <>
                            <EyeOff className="mr-1 h-4 w-4" />
                            비공개
                          </>
                        ) : (
                          <>
                            <Eye className="mr-1 h-4 w-4" />
                            공개
                          </>
                        )}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(content.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              이전
            </Button>

            {/* 페이지 번호 버튼 */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
              // 현재 페이지 근처만 표시
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= page - 2 && pageNum <= page + 2)
              ) {
                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              } else if (pageNum === page - 3 || pageNum === page + 3) {
                return <span key={pageNum}>...</span>;
              }
              return null;
            })}

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
            >
              다음
            </Button>
          </div>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>콘텐츠 삭제</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">
                정말 이 콘텐츠를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteTargetId(null);
                  }}
                >
                  취소
                </Button>
                <Button variant="destructive" onClick={confirmDelete}>
                  삭제
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
