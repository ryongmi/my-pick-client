'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Users,
  UserCheck,
  Shield,
  Youtube,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  MoreHorizontal,
  Square,
  CheckSquare,
  Edit,
  Trash2,
  Mail,
  Eye,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  fetchUsers,
  fetchUserStats,
  fetchCreatorApplications,
  updateUser,
  executeBulkAction,
  setFilters,
  setPagination,
  toggleUserSelection,
  toggleAllUsers,
  clearSelectedUsers,
  clearError,
  setActiveTab,
  fetchApprovalHistory,
} from '@/store/slices/userManagementSlice';
import { cn } from '@/lib/utils';
import { MyPickUser, UserManagementFilter } from '@/types/userManagement';
import { BulkOperations, BulkAction } from '@/components/admin/shared/bulk-operations';
import { UserDetailModal } from '@/components/admin/users/user-detail-modal';
import { UserEditModal } from '@/components/admin/users/user-edit-modal';
import { CreatorApprovalModal } from '@/components/admin/creators/creator-approval-modal';
import { CreatorApprovalHistory } from '@/components/admin/creators/creator-approval-history';

export function AdminUsers() {
  const dispatch = useAppDispatch();
  
  // Redux state
  const {
    users,
    selectedUsers,
    pagination,
    filters,
    stats,
    pendingApplicationsCount,
    isLoading,
    isProcessingBulkAction,
    error,
    activeTab,
  } = useAppSelector((state) => state.userManagement);
  
  // Local state
  const [searchTerm, setSearchTerm] = useState(filters.search);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [showUserDetailModal, setShowUserDetailModal] = useState(false);
  const [selectedUserForDetail, setSelectedUserForDetail] = useState<string | null>(null);
  const [showUserEditModal, setShowUserEditModal] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<MyPickUser | null>(null);
  const [showCreatorApprovalModal, setShowCreatorApprovalModal] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // 초기 데이터 로드
  useEffect(() => {
    dispatch(fetchUsers({ page: pagination.page, limit: pagination.limit, filters }));
    dispatch(fetchUserStats());
    dispatch(fetchCreatorApplications());
  }, [dispatch, pagination.page, pagination.limit, filters]);

  // 검색 디바운싱
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      if (searchTerm !== filters.search) {
        dispatch(setFilters({ search: searchTerm }));
      }
    }, 500);
    
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm, filters.search, dispatch]);

  // 드롭다운 외부 클릭 처리
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenDropdownId(null);
        setShowDeleteConfirm(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // 선택 관련 핸들러들
  const handleUserSelect = (userId: string) => {
    dispatch(toggleUserSelection(userId));
  };

  const handleSelectAllUsers = () => {
    dispatch(toggleAllUsers(true));
  };

  const handleSelectNoneUsers = () => {
    dispatch(toggleAllUsers(false));
  };

  // 필터 핸들러들
  const handleFilterChange = (key: keyof UserManagementFilter, value: any) => {
    dispatch(setFilters({ [key]: value }));
  };

  // 페이지네이션 핸들러
  const handlePageChange = (page: number) => {
    dispatch(setPagination({ page }));
  };

  // 일괄 작업 핸들러
  const handleBulkAction = async (action: BulkAction, userIds: string[]) => {
    try {
      await dispatch(executeBulkAction({
        type: action as any,
        userIds,
        performedBy: 'admin', // TODO: 실제 사용자 ID로 변경
        performedAt: new Date().toISOString(),
      })).unwrap();
      
      dispatch(clearSelectedUsers());
    } catch (error) {
      console.error('일괄 작업 실패:', error);
    }
  };

  // 드롭다운 메뉴 핸들러들
  const toggleDropdown = (userId: string) => {
    setOpenDropdownId(openDropdownId === userId ? null : userId);
  };

  const handleViewUser = (user: MyPickUser) => {
    setSelectedUserForDetail(user.id);
    setShowUserDetailModal(true);
    setOpenDropdownId(null);
  };

  const handleEditUser = (user: MyPickUser) => {
    setSelectedUserForEdit(user);
    setShowUserEditModal(true);
    setOpenDropdownId(null);
  };

  const handleCloseUserDetailModal = () => {
    setShowUserDetailModal(false);
    setSelectedUserForDetail(null);
  };

  const handleCloseUserEditModal = () => {
    setShowUserEditModal(false);
    setSelectedUserForEdit(null);
    // 사용자 목록 새로고침
    dispatch(fetchUsers({ page: pagination.page, limit: pagination.limit, filters }));
  };

  const handleToggleUserStatus = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) {return;}
    
    const newStatus = user.serviceStatus === 'active' ? 'inactive' : 'active';
    
    try {
      await dispatch(updateUser({
        userId,
        updates: { serviceStatus: newStatus }
      })).unwrap();
    } catch (error) {
      console.error('사용자 상태 변경 실패:', error);
    }
    
    setOpenDropdownId(null);
  };

  const handleDeleteUser = (userId: string) => {
    setDeletingUserId(userId);
    setShowDeleteConfirm(true);
    setOpenDropdownId(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingUserId) {return;}
    
    try {
      await dispatch(executeBulkAction({
        type: 'delete',
        userIds: [deletingUserId],
        performedBy: 'admin',
        performedAt: new Date().toISOString(),
      })).unwrap();
    } catch (error) {
      console.error('사용자 삭제 실패:', error);
    }
    
    setShowDeleteConfirm(false);
    setDeletingUserId(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeletingUserId(null);
  };


  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">사용자 관리</h1>
          <p className="mt-2 text-gray-600">
            등록된 사용자를 관리하고 권한을 설정합니다
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => dispatch(fetchUsers({ page: pagination.page, limit: pagination.limit, filters }))}
            disabled={isLoading}
          >
            새로고침
          </Button>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => dispatch(setActiveTab('users'))}
            className={cn(
              'py-2 px-1 border-b-2 font-medium text-sm',
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            )}
          >
            <Users className="inline-block w-4 h-4 mr-2" />
            사용자 목록
          </button>
          <button
            onClick={() => {
              dispatch(setActiveTab('approvalHistory'));
              if (activeTab !== 'approvalHistory') {
                dispatch(fetchApprovalHistory({}));
              }
            }}
            className={cn(
              'py-2 px-1 border-b-2 font-medium text-sm',
              activeTab === 'approvalHistory'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            )}
          >
            <CheckCircle className="inline-block w-4 h-4 mr-2" />
            크리에이터 승인 내역
          </button>
        </nav>
      </div>

      {/* 통계 대시보드 */}
      {stats ? <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">총 사용자</p>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">활성 사용자</p>
                  <p className="text-2xl font-bold text-green-600">{stats.activeUsers}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">크리에이터</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.creators.total}</p>
                  <p className="text-xs text-muted-foreground">
                    대기중: {stats.creators.pending}
                  </p>
                </div>
                <Shield className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">YouTube 연동</p>
                  <p className="text-2xl font-bold text-red-600">{stats.youtubeConnections.connected}</p>
                  <p className="text-xs text-muted-foreground">
                    연동률: {Math.round((stats.youtubeConnections.connected / stats.totalUsers) * 100)}%
                  </p>
                </div>
                <Youtube className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div> : null}

      {/* 탭별 컨텐츠 */}
      {activeTab === 'users' && (
        <>
          {/* 크리에이터 신청 알림 */}
          {pendingApplicationsCount > 0 && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <div className="flex-1">
                    <p className="font-medium text-yellow-800">
                      {pendingApplicationsCount}개의 크리에이터 신청이 대기 중입니다.
                    </p>
                    <p className="text-sm text-yellow-700">
                      신청을 검토하고 승인 또는 거부 처리를 해주세요.
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                    onClick={() => setShowCreatorApprovalModal(true)}
                  >
                    검토하기
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 에러 메시지 */}
          {error ? <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <div className="flex-1">
                    <p className="font-medium text-red-800">오류가 발생했습니다</p>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-100"
                    onClick={() => dispatch(clearError())}
                  >
                    닫기
                  </Button>
                </div>
              </CardContent>
            </Card> : null}

          {/* 일괄 작업 */}
          {selectedUsers.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <BulkOperations
                  selectedCreators={selectedUsers}
                  totalCreators={users.length}
                  onSelectAll={handleSelectAllUsers}
                  onSelectNone={handleSelectNoneUsers}
                  onBulkAction={handleBulkAction}
                />
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* 사용자 목록 관련 UI (사용자 탭에서만 표시) */}
      {activeTab === 'users' && (
        <>
          {/* 검색 및 필터 */}
          <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
              <input
                type="text"
                placeholder="이름 또는 이메일로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filters.userType}
                onChange={(e) => handleFilterChange('userType', e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">모든 타입</option>
                <option value="user">일반 사용자</option>
                <option value="creator">크리에이터</option>
              </select>
              
              <select
                value={filters.serviceStatus}
                onChange={(e) => handleFilterChange('serviceStatus', e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">모든 상태</option>
                <option value="active">활성</option>
                <option value="inactive">비활성</option>
                <option value="suspended">정지</option>
              </select>
              
              <select
                value={filters.youtubeConnected}
                onChange={(e) => handleFilterChange('youtubeConnected', e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">모든 연동상태</option>
                <option value="connected">YouTube 연동</option>
                <option value="disconnected">YouTube 미연동</option>
              </select>
              
              <Button variant="outline" size="sm">
                <Filter className="mr-1 h-4 w-4" />
                필터
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 사용자 목록 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle>사용자 목록 ({users.length}명)</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="w-12 p-4 text-left text-sm font-medium">
                    <button
                      onClick={() =>
                        selectedUsers.length === users.length
                          ? handleSelectNoneUsers()
                          : handleSelectAllUsers()
                      }
                      className="p-1"
                    >
                      {selectedUsers.length === users.length && users.length > 0 ? (
                        <CheckSquare className="h-4 w-4 text-blue-600" />
                      ) : selectedUsers.length > 0 ? (
                        <CheckSquare className="h-4 w-4 text-blue-500" />
                      ) : (
                        <Square className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </th>
                  <th className="p-4 text-left text-sm font-medium">사용자</th>
                  <th className="p-4 text-center text-sm font-medium">타입</th>
                  <th className="p-4 text-center text-sm font-medium">상태</th>
                  <th className="p-4 text-center text-sm font-medium">YouTube</th>
                  <th className="p-4 text-center text-sm font-medium">API 사용량</th>
                  <th className="p-4 text-center text-sm font-medium">마지막 로그인</th>
                  <th className="p-4 text-center text-sm font-medium">액션</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className={cn(
                      'border-b hover:bg-gray-50',
                      selectedUsers.includes(user.id) && 'bg-blue-50'
                    )}
                  >
                    <td className="p-4">
                      <button
                        onClick={() => handleUserSelect(user.id)}
                        className="p-1"
                      >
                        {selectedUsers.includes(user.id) ? (
                          <CheckSquare className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Square className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </td>
                    
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          {user.avatar ? (
                            <img 
                              src={user.avatar} 
                              alt={user.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-medium text-gray-600">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="flex items-center justify-center">
                        <span className={cn(
                          'px-2 py-1 rounded-full text-xs font-medium',
                          user.userType === 'creator' 
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-gray-100 text-gray-700'
                        )}>
                          {user.userType === 'creator' ? '크리에이터' : '일반'}
                        </span>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        {user.serviceStatus === 'active' ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-green-600">활성</span>
                          </>
                        ) : user.serviceStatus === 'inactive' ? (
                          <>
                            <XCircle className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">비활성</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                            <span className="text-sm text-red-600">정지</span>
                          </>
                        )}
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="flex items-center justify-center">
                        {user.youtubeConnection.isConnected ? (
                          <div className="flex items-center gap-1">
                            <Youtube className="h-4 w-4 text-red-500" />
                            <span className="text-xs text-green-600">연동</span>
                            {user.youtubeConnection.hasError ? <XCircle className="h-3 w-3 text-red-500" /> : null}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500">미연동</span>
                        )}
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-mono">
                          {user.apiUsage.currentMonth.toLocaleString()}
                        </span>
                        <div className="w-16 bg-gray-200 rounded-full h-1 mt-1">
                          <div 
                            className={cn(
                              'h-1 rounded-full',
                              user.apiUsage.quotaExceeded 
                                ? 'bg-red-500' 
                                : user.apiUsage.currentMonth / user.apiUsage.monthlyLimit > 0.8
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                            )}
                            style={{
                              width: `${Math.min(
                                (user.apiUsage.currentMonth / user.apiUsage.monthlyLimit) * 100,
                                100
                              )}%`
                            }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          /{user.apiUsage.monthlyLimit.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="flex flex-col items-center">
                        {user.lastLoginAt ? (
                          <>
                            <span className="text-sm">
                              {new Date(user.lastLoginAt).toLocaleDateString('ko-KR')}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(user.lastLoginAt).toLocaleTimeString('ko-KR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="flex items-center justify-center">
                        <div
                          className="relative"
                          ref={openDropdownId === user.id ? dropdownRef : null}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleDropdown(user.id)}
                            disabled={isLoading || isProcessingBulkAction}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>

                          {/* 드롭다운 메뉴 */}
                          {openDropdownId === user.id && (
                            <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-md border border-gray-200 bg-white shadow-lg">
                              <div className="py-1">
                                <button
                                  onClick={() => handleViewUser(user)}
                                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  disabled={isLoading}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  상세보기
                                </button>
                                
                                <button
                                  onClick={() => handleEditUser(user)}
                                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  disabled={isLoading}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  수정
                                </button>
                                
                                <button
                                  onClick={() => handleToggleUserStatus(user.id)}
                                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  disabled={isLoading}
                                >
                                  {user.serviceStatus === 'active' ? (
                                    <>
                                      <XCircle className="mr-2 h-4 w-4" />
                                      비활성화
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      활성화
                                    </>
                                  )}
                                </button>
                                
                                <div className="my-1 border-t border-gray-100"></div>
                                
                                <button
                                  onClick={() => {
                                    // TODO: 이메일 보내기 기능
                                    console.log('Send email to:', user.email);
                                    setOpenDropdownId(null);
                                  }}
                                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <Mail className="mr-2 h-4 w-4" />
                                  이메일 보내기
                                </button>
                                
                                <div className="my-1 border-t border-gray-100"></div>
                                
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                  disabled={isLoading}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  사용자 삭제
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
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
                전체 {pagination.total}명 중 {((pagination.page - 1) * pagination.limit) + 1}-
                {Math.min(pagination.page * pagination.limit, pagination.total)}명 표시
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
                <p className="text-sm text-muted-foreground">사용자 데이터를 불러오는 중...</p>
              </div>
            </div> : null}
          
          {/* 빈 상태 */}
          {!isLoading && users.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">사용자가 없습니다</p>
              <p className="text-muted-foreground">조건에 맞는 사용자를 찾을 수 없습니다.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 삭제 확인 다이얼로그 */}
      {showDeleteConfirm ? <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center">
              <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  사용자 삭제
                </h3>
                <p className="text-sm text-gray-500">
                  이 작업은 되돌릴 수 없습니다.
                </p>
              </div>
            </div>

            <p className="mb-6 text-gray-700">
              정말로 이 사용자를 삭제하시겠습니까?
              <br />
              <span className="font-medium">
                {deletingUserId ? users.find((u) => u.id === deletingUserId)?.name : null}
              </span>
              과 관련된 모든 데이터가 함께 삭제됩니다.
            </p>

            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={handleCancelDelete}
                disabled={isProcessingBulkAction}
              >
                취소
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleConfirmDelete}
                disabled={isProcessingBulkAction}
              >
                삭제
              </Button>
            </div>
          </div>
        </div> : null}
        </>
      )}

      {/* 크리에이터 승인 내역 탭 */}
      {activeTab === 'approvalHistory' && (
        <CreatorApprovalHistory />
      )}

      {/* 사용자 상세 모달 */}
      <UserDetailModal
        isOpen={showUserDetailModal}
        onClose={handleCloseUserDetailModal}
        userId={selectedUserForDetail}
      />

      {/* 사용자 수정 모달 */}
      <UserEditModal
        isOpen={showUserEditModal}
        onClose={handleCloseUserEditModal}
        user={selectedUserForEdit}
      />

      {/* 크리에이터 승인 모달 */}
      <CreatorApprovalModal
        isOpen={showCreatorApprovalModal}
        onClose={() => {
          setShowCreatorApprovalModal(false);
          // 크리에이터 신청 목록 새로고침
          dispatch(fetchCreatorApplications());
        }}
      />
    </div>
  );
}