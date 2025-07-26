'use client';

import { useState, useCallback } from 'react';
import { 
  Filter, 
  X, 
  Calendar,
  Search,
  Users,
  Youtube,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { setFilters, fetchUsers } from '@/store/slices/userManagementSlice';
import { UserManagementFilter } from '@/types/userManagement';
import { cn } from '@/lib/utils';

interface UserFiltersProps {
  className?: string;
  compact?: boolean;
}

export default function UserFilters({ className, compact = false }: UserFiltersProps) {
  const dispatch = useAppDispatch();
  const { filters, pagination } = useAppSelector((state) => state.userManagement);

  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState<UserManagementFilter>(filters);

  // 필터 적용
  const applyFilters = useCallback(() => {
    dispatch(setFilters(localFilters));
    dispatch(fetchUsers({ page: 1, limit: pagination.limit, filters: localFilters }));
    if (compact) {
      setIsExpanded(false);
    }
  }, [dispatch, localFilters, pagination.limit, compact]);

  // 필터 초기화
  const resetFilters = useCallback(() => {
    const defaultFilters: UserManagementFilter = {
      search: '',
      userType: 'all',
      serviceStatus: 'all',
      youtubeConnected: 'all',
      creatorStatus: 'all',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    };
    setLocalFilters(defaultFilters);
    dispatch(setFilters(defaultFilters));
    dispatch(fetchUsers({ page: 1, limit: pagination.limit, filters: defaultFilters }));
  }, [dispatch, pagination.limit]);

  // 로컬 필터 업데이트
  const updateLocalFilter = useCallback((key: keyof UserManagementFilter, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  // 활성 필터 수 계산
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search) {count++;}
    if (filters.userType !== 'all') {count++;}
    if (filters.serviceStatus !== 'all') {count++;}
    if (filters.youtubeConnected !== 'all') {count++;}
    if (filters.creatorStatus !== 'all') {count++;}
    if (filters.dateRange) {count++;}
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  if (compact) {
    return (
      <div className={cn('relative', className)}>
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="relative"
        >
          <Filter className="w-4 h-4 mr-2" />
          필터
          {activeFilterCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </Button>

        {isExpanded ? <Card className="absolute top-full left-0 mt-2 w-80 z-50 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">고급 필터</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <FilterContent
                localFilters={localFilters}
                updateLocalFilter={updateLocalFilter}
                applyFilters={applyFilters}
                resetFilters={resetFilters}
                compact={true}
              />
            </CardContent>
          </Card> : null}
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>고급 필터</span>
            {activeFilterCount > 0 && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {activeFilterCount}개 적용
              </span>
            )}
          </div>
          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              <X className="w-4 h-4 mr-1" />
              초기화
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FilterContent
          localFilters={localFilters}
          updateLocalFilter={updateLocalFilter}
          applyFilters={applyFilters}
          resetFilters={resetFilters}
        />
      </CardContent>
    </Card>
  );
}

interface FilterContentProps {
  localFilters: UserManagementFilter;
  updateLocalFilter: (key: keyof UserManagementFilter, value: any) => void;
  applyFilters: () => void;
  resetFilters: () => void;
  compact?: boolean;
}

function FilterContent({ 
  localFilters, 
  updateLocalFilter, 
  applyFilters, 
  resetFilters,
  compact = false 
}: FilterContentProps) {
  const gridCols = compact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <div className="space-y-6">
      {/* 검색 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Search className="w-4 h-4 inline mr-1" />
          검색
        </label>
        <Input
          placeholder="이름 또는 이메일 검색..."
          value={localFilters.search}
          onChange={(e) => updateLocalFilter('search', e.target.value)}
        />
      </div>

      {/* 필터 그리드 */}
      <div className={cn('grid gap-4', gridCols)}>
        {/* 사용자 타입 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Users className="w-4 h-4 inline mr-1" />
            사용자 타입
          </label>
          <select
            value={localFilters.userType}
            onChange={(e) => updateLocalFilter('userType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">모든 타입</option>
            <option value="user">일반 사용자</option>
            <option value="creator">크리에이터</option>
          </select>
        </div>

        {/* 서비스 상태 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <CheckCircle className="w-4 h-4 inline mr-1" />
            서비스 상태
          </label>
          <select
            value={localFilters.serviceStatus}
            onChange={(e) => updateLocalFilter('serviceStatus', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">모든 상태</option>
            <option value="active">활성</option>
            <option value="inactive">비활성</option>
            <option value="suspended">정지</option>
          </select>
        </div>

        {/* YouTube 연동 상태 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Youtube className="w-4 h-4 inline mr-1" />
            YouTube 연동
          </label>
          <select
            value={localFilters.youtubeConnected}
            onChange={(e) => updateLocalFilter('youtubeConnected', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">모든 상태</option>
            <option value="connected">연동됨</option>
            <option value="disconnected">연동 안됨</option>
          </select>
        </div>

        {/* 크리에이터 신청 상태 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="w-4 h-4 inline mr-1" />
            크리에이터 신청
          </label>
          <select
            value={localFilters.creatorStatus}
            onChange={(e) => updateLocalFilter('creatorStatus', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">모든 상태</option>
            <option value="pending">대기 중</option>
            <option value="approved">승인됨</option>
            <option value="rejected">거부됨</option>
          </select>
        </div>

        {/* 정렬 기준 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            정렬 기준
          </label>
          <select
            value={localFilters.sortBy}
            onChange={(e) => updateLocalFilter('sortBy', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="name">이름</option>
            <option value="email">이메일</option>
            <option value="createdAt">가입일</option>
            <option value="lastLoginAt">마지막 로그인</option>
            <option value="videoCount">영상 수</option>
          </select>
        </div>

        {/* 정렬 순서 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            정렬 순서
          </label>
          <select
            value={localFilters.sortOrder}
            onChange={(e) => updateLocalFilter('sortOrder', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="asc">오름차순</option>
            <option value="desc">내림차순</option>
          </select>
        </div>
      </div>

      {/* 날짜 범위 필터 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Calendar className="w-4 h-4 inline mr-1" />
          가입일 범위
        </label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="date"
            value={localFilters.dateRange?.start || ''}
            onChange={(e) => updateLocalFilter('dateRange', {
              ...localFilters.dateRange,
              start: e.target.value
            })}
            placeholder="시작일"
          />
          <Input
            type="date"
            value={localFilters.dateRange?.end || ''}
            onChange={(e) => updateLocalFilter('dateRange', {
              ...localFilters.dateRange,
              end: e.target.value
            })}
            placeholder="종료일"
          />
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={resetFilters}>
          초기화
        </Button>
        <Button onClick={applyFilters}>
          필터 적용
        </Button>
      </div>
    </div>
  );
}

// 활성 필터 표시 컴포넌트
export function ActiveFilters({ className }: { className?: string }) {
  const dispatch = useAppDispatch();
  const { filters, pagination } = useAppSelector((state) => state.userManagement);

  const removeFilter = useCallback((key: keyof UserManagementFilter) => {
    const newFilters = { ...filters };
    
    switch (key) {
      case 'search':
        newFilters.search = '';
        break;
      case 'userType':
        newFilters.userType = 'all';
        break;
      case 'serviceStatus':
        newFilters.serviceStatus = 'all';
        break;
      case 'youtubeConnected':
        newFilters.youtubeConnected = 'all';
        break;
      case 'creatorStatus':
        newFilters.creatorStatus = 'all';
        break;
      case 'dateRange':
        delete newFilters.dateRange;
        break;
    }
    
    dispatch(setFilters(newFilters));
    dispatch(fetchUsers({ page: 1, limit: pagination.limit, filters: newFilters }));
  }, [dispatch, filters, pagination.limit]);

  const activeFilters = [];

  if (filters.search) {
    activeFilters.push({
      key: 'search' as keyof UserManagementFilter,
      label: `검색: "${filters.search}"`
    });
  }

  if (filters.userType !== 'all') {
    const labels = { user: '일반 사용자', creator: '크리에이터' };
    activeFilters.push({
      key: 'userType' as keyof UserManagementFilter,
      label: `타입: ${labels[filters.userType]}`
    });
  }

  if (filters.serviceStatus !== 'all') {
    const labels = { active: '활성', inactive: '비활성', suspended: '정지' };
    activeFilters.push({
      key: 'serviceStatus' as keyof UserManagementFilter,
      label: `상태: ${labels[filters.serviceStatus]}`
    });
  }

  if (filters.youtubeConnected !== 'all') {
    const labels = { connected: '연동됨', disconnected: '연동 안됨' };
    activeFilters.push({
      key: 'youtubeConnected' as keyof UserManagementFilter,
      label: `YouTube: ${labels[filters.youtubeConnected]}`
    });
  }

  if (filters.creatorStatus !== 'all') {
    const labels = { pending: '대기 중', approved: '승인됨', rejected: '거부됨' };
    activeFilters.push({
      key: 'creatorStatus' as keyof UserManagementFilter,
      label: `크리에이터: ${labels[filters.creatorStatus]}`
    });
  }

  if (filters.dateRange?.start || filters.dateRange?.end) {
    const start = filters.dateRange.start || '시작';
    const end = filters.dateRange.end || '끝';
    activeFilters.push({
      key: 'dateRange' as keyof UserManagementFilter,
      label: `기간: ${start} ~ ${end}`
    });
  }

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className={cn('flex flex-wrap gap-2 p-4 bg-gray-50 rounded-md', className)}>
      <span className="text-sm text-gray-600 font-medium">활성 필터:</span>
      {activeFilters.map(({ key, label }) => (
        <span
          key={key}
          className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md"
        >
          {label}
          <button
            onClick={() => removeFilter(key)}
            className="hover:bg-blue-200 rounded p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
    </div>
  );
}