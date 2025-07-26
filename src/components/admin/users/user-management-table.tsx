'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Check, 
  X, 
  Eye, 
  Edit, 
  UserPlus,
  UserMinus,
  Ban,
  Trash2,
  Youtube,
  CheckCircle,
  XCircle,
  Clock,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  fetchUsers,
  setFilters,
  setPagination,
  toggleUserSelection,
  toggleAllUsers,
  setSelectedUser,
  setModalOpen,
  setSorting
} from '@/store/slices/userManagementSlice';
import { MyPickUser, UserManagementFilter } from '@/types/userManagement';
import { cn } from '@/lib/utils';

// 상태 배지 컴포넌트
const StatusBadge = ({ status }: { status: MyPickUser['serviceStatus'] }) => {
  const variants = {
    active: 'bg-green-100 text-green-800 border-green-200',
    inactive: 'bg-gray-100 text-gray-800 border-gray-200',
    suspended: 'bg-red-100 text-red-800 border-red-200',
  };

  const labels = {
    active: '활성',
    inactive: '비활성',
    suspended: '정지',
  };

  return (
    <span className={cn(
      'inline-flex items-center px-2 py-1 text-xs font-medium rounded-md border',
      variants[status]
    )}>
      {labels[status]}
    </span>
  );
};

// 사용자 타입 배지 컴포넌트
const UserTypeBadge = ({ userType }: { userType: MyPickUser['userType'] }) => {
  const variants = {
    user: 'bg-blue-100 text-blue-800 border-blue-200',
    creator: 'bg-purple-100 text-purple-800 border-purple-200',
  };

  const labels = {
    user: '일반',
    creator: '크리에이터',
  };

  return (
    <span className={cn(
      'inline-flex items-center px-2 py-1 text-xs font-medium rounded-md border',
      variants[userType]
    )}>
      {labels[userType]}
    </span>
  );
};

// YouTube 연동 상태 아이콘
const YouTubeConnectionIcon = ({ isConnected, hasError }: { isConnected: boolean; hasError?: boolean }) => {
  if (!isConnected) {
    return <XCircle className="w-4 h-4 text-gray-400" />;
  }
  
  if (hasError) {
    return <X className="w-4 h-4 text-red-500" />;
  }
  
  return <CheckCircle className="w-4 h-4 text-green-500" />;
};

// 테이블 헤더 컴포넌트
interface TableHeaderProps {
  label: string;
  sortKey?: keyof UserManagementFilter['sortBy'];
  currentSort: UserManagementFilter['sortBy'];
  currentOrder: UserManagementFilter['sortOrder'];
  onSort: (sortBy: UserManagementFilter['sortBy'], sortOrder: UserManagementFilter['sortOrder']) => void;
  className?: string;
}

const TableHeader = ({ label, sortKey, currentSort, currentOrder, onSort, className }: TableHeaderProps) => {
  const handleSort = () => {
    if (!sortKey) {return;}
    
    const newOrder = currentSort === sortKey && currentOrder === 'asc' ? 'desc' : 'asc';
    onSort(sortKey, newOrder);
  };

  const showSortIcon = sortKey && currentSort === sortKey;

  return (
    <th className={cn('px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider', className)}>
      {sortKey ? (
        <button
          onClick={handleSort}
          className="flex items-center space-x-1 hover:text-gray-700"
        >
          <span>{label}</span>
          {showSortIcon ? currentOrder === 'asc' ? 
              <ChevronUp className="w-4 h-4" /> : 
              <ChevronDown className="w-4 h-4" /> : null}
        </button>
      ) : (
        label
      )}
    </th>
  );
};

export default function UserManagementTable() {
  const dispatch = useAppDispatch();
  const {
    users,
    selectedUsers,
    pagination,
    filters,
    isLoading,
    error
  } = useAppSelector((state) => state.userManagement);

  const [searchInput, setSearchInput] = useState(filters.search);

  // 초기 데이터 로드
  useEffect(() => {
    dispatch(fetchUsers({ page: pagination.page, limit: pagination.limit, filters }));
  }, [dispatch]);

  // 검색어 디바운스
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchInput !== filters.search) {
        dispatch(setFilters({ search: searchInput }));
        dispatch(fetchUsers({ page: 1, limit: pagination.limit, filters: { ...filters, search: searchInput } }));
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchInput, filters, dispatch, pagination.limit]);

  // 필터 변경 핸들러
  const handleFilterChange = useCallback((newFilters: Partial<UserManagementFilter>) => {
    dispatch(setFilters(newFilters));
    dispatch(fetchUsers({ page: 1, limit: pagination.limit, filters: { ...filters, ...newFilters } }));
  }, [dispatch, filters, pagination.limit]);

  // 정렬 변경 핸들러
  const handleSort = useCallback((sortBy: UserManagementFilter['sortBy'], sortOrder: UserManagementFilter['sortOrder']) => {
    dispatch(setSorting({ sortBy, sortOrder }));
    dispatch(fetchUsers({ page: pagination.page, limit: pagination.limit, filters: { ...filters, sortBy, sortOrder } }));
  }, [dispatch, filters, pagination]);

  // 페이지 변경 핸들러
  const handlePageChange = useCallback((newPage: number) => {
    dispatch(setPagination({ page: newPage }));
    dispatch(fetchUsers({ page: newPage, limit: pagination.limit, filters }));
  }, [dispatch, filters, pagination.limit]);

  // 사용자 선택 핸들러
  const handleUserSelect = useCallback((userId: string) => {
    dispatch(toggleUserSelection(userId));
  }, [dispatch]);

  // 전체 선택 핸들러
  const handleSelectAll = useCallback((checked: boolean) => {
    dispatch(toggleAllUsers(checked));
  }, [dispatch]);

  // 사용자 상세 보기
  const handleViewUser = useCallback((user: MyPickUser) => {
    dispatch(setSelectedUser(user));
    dispatch(setModalOpen({ modal: 'userDetail', open: true }));
  }, [dispatch]);

  // 날짜 포맷팅
  const formatDate = (dateString: string | null) => {
    if (!dateString) {return '-';}
    return new Date(dateString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 숫자 포맷팅
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ko-KR').format(num);
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            오류가 발생했습니다: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="w-5 h-5" />
          <span>사용자 관리</span>
          <span className="text-sm font-normal text-gray-500">
            ({pagination.total}명)
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* 검색 및 필터 */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* 검색 */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="이름 또는 이메일로 검색..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* 필터들 */}
            <div className="flex flex-wrap gap-2">
              {/* 사용자 타입 필터 */}
              <select
                value={filters.userType}
                onChange={(e) => handleFilterChange({ userType: e.target.value as any })}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">모든 타입</option>
                <option value="user">일반 사용자</option>
                <option value="creator">크리에이터</option>
              </select>

              {/* 상태 필터 */}
              <select
                value={filters.serviceStatus}
                onChange={(e) => handleFilterChange({ serviceStatus: e.target.value as any })}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">모든 상태</option>
                <option value="active">활성</option>
                <option value="inactive">비활성</option>
                <option value="suspended">정지</option>
              </select>

              {/* YouTube 연동 필터 */}
              <select
                value={filters.youtubeConnected}
                onChange={(e) => handleFilterChange({ youtubeConnected: e.target.value as any })}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">연동 상태</option>
                <option value="connected">연동됨</option>
                <option value="disconnected">연동 안됨</option>
              </select>
            </div>
          </div>

          {/* 선택된 사용자 액션 */}
          {selectedUsers.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-md flex items-center justify-between">
              <span className="text-sm text-blue-700">
                {selectedUsers.length}명 선택됨
              </span>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  일괄 활성화
                </Button>
                <Button size="sm" variant="outline">
                  일괄 비활성화
                </Button>
                <Button size="sm" variant="destructive">
                  일괄 삭제
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* 테이블 */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={users.length > 0 && selectedUsers.length === users.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <TableHeader
                  label="사용자"
                  sortKey="name"
                  currentSort={filters.sortBy}
                  currentOrder={filters.sortOrder}
                  onSort={handleSort}
                />
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  타입/상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  YouTube
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  콘텐츠
                </th>
                <TableHeader
                  label="가입일"
                  sortKey="createdAt"
                  currentSort={filters.sortBy}
                  currentOrder={filters.sortOrder}
                  onSort={handleSort}
                />
                <TableHeader
                  label="마지막 로그인"
                  sortKey="lastLoginAt"
                  currentSort={filters.sortBy}
                  currentOrder={filters.sortOrder}
                  onSort={handleSort}
                />
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    데이터를 불러오는 중...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    사용자가 없습니다.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleUserSelect(user.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {user.avatar ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={user.avatar}
                              alt={user.name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <Users className="h-6 w-6 text-gray-600" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1">
                        <UserTypeBadge userType={user.userType} />
                        <StatusBadge status={user.serviceStatus} />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <YouTubeConnectionIcon 
                          isConnected={user.youtubeConnection.isConnected}
                          hasError={user.youtubeConnection.hasError}
                        />
                        {user.youtubeConnection.isConnected && user.youtubeConnection.channelName ? <div className="text-sm">
                            <div className="text-gray-900">{user.youtubeConnection.channelName}</div>
                            {user.youtubeConnection.subscriberCount ? <div className="text-gray-500">
                                구독자 {formatNumber(user.youtubeConnection.subscriberCount)}명
                              </div> : null}
                          </div> : null}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.contentStats.videoCount > 0 ? (
                        <div className="text-sm">
                          <div className="text-gray-900">
                            영상 {formatNumber(user.contentStats.videoCount)}개
                          </div>
                          <div className="text-gray-500">
                            조회수 {formatNumber(user.contentStats.totalViews)}회
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">없음</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(user.lastLoginAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewUser(user)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                총 {pagination.total}명 중 {((pagination.page - 1) * pagination.limit) + 1}-
                {Math.min(pagination.page * pagination.limit, pagination.total)}명 표시
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                >
                  이전
                </Button>
                
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter(page => 
                    page === 1 || 
                    page === pagination.totalPages || 
                    Math.abs(page - pagination.page) <= 2
                  )
                  .map((page, index, array) => (
                    <div key={page} className="flex items-center">
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="text-gray-500 px-2">...</span>
                      )}
                      <Button
                        variant={page === pagination.page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    </div>
                  ))
                }
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                >
                  다음
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}