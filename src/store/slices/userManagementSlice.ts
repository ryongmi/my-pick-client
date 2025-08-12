import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  UserManagementState, 
  MyPickUser, 
  UserManagementFilter, 
  CreatorApplication,
  BulkAction,
  CreatorApplicationAction,
  GetUsersRequest,
  UpdateUserRequest,
  CreatorApprovalHistoryFilter,
  GetApprovalHistoryRequest
} from '@/types/userManagement';
import { adminApi, errorUtils } from '@/lib/api';

const initialState: UserManagementState = {
  // 사용자 목록
  users: [],
  selectedUsers: [],
  
  // 페이지네이션
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  
  // 필터링
  filters: {
    search: '',
    userType: 'all',
    serviceStatus: 'all',
    youtubeConnected: 'all',
    creatorStatus: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  
  // 상세 정보
  selectedUser: null,
  userDetail: null,
  
  // 크리에이터 신청
  creatorApplications: [],
  pendingApplicationsCount: 0,
  
  // 크리에이터 승인 내역
  approvalHistory: [],
  approvalHistoryPagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  approvalHistoryFilters: {
    search: '',
    status: 'all',
    reviewedBy: '',
    sortBy: 'reviewedAt',
    sortOrder: 'desc',
  },
  
  // 통계
  stats: null,
  dashboard: null,
  
  // UI 상태
  isLoading: false,
  isLoadingDetail: false,
  isProcessingBulkAction: false,
  isLoadingApprovalHistory: false,
  
  // 에러 상태
  error: null,
  
  // 모달 상태
  modals: {
    userDetail: false,
    creatorApproval: false,
    bulkAction: false,
    apiLimitSettings: false,
  },
  
  // 현재 활성 탭
  activeTab: 'users',
};

// Async Thunks

// 사용자 목록 조회
export const fetchUsers = createAsyncThunk(
  'userManagement/fetchUsers',
  async (params: GetUsersRequest = {}, { rejectWithValue }) => {
    try {
      const response = await adminApi.getUsers(params);
      return {
        users: response.data || [],
        pagination: response.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 },
        stats: null
      };
    } catch (error: any) {
      const errorMessage = errorUtils.getUserMessage(error) || '사용자 목록을 불러오는데 실패했습니다.';
      return rejectWithValue(errorMessage);
    }
  }
);

// 사용자 상세 정보 조회
export const fetchUserDetail = createAsyncThunk(
  'userManagement/fetchUserDetail',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await adminApi.getUser(userId);
      return {
        user: response.data,
        permissions: [],
        activities: []
      };
    } catch (error: any) {
      const errorMessage = errorUtils.getUserMessage(error) || '사용자 상세 정보를 불러오는데 실패했습니다.';
      return rejectWithValue(errorMessage);
    }
  }
);

// 사용자 정보 업데이트
export const updateUser = createAsyncThunk(
  'userManagement/updateUser',
  async (params: UpdateUserRequest, { rejectWithValue }) => {
    try {
      const response = await adminApi.updateUser(params.userId, params);
      return response.data;
    } catch (error: any) {
      const errorMessage = errorUtils.getUserMessage(error) || '사용자 정보 업데이트에 실패했습니다.';
      return rejectWithValue(errorMessage);
    }
  }
);

// 크리에이터 신청 목록 조회
export const fetchCreatorApplications = createAsyncThunk(
  'userManagement/fetchCreatorApplications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApi.getCreators({ status: 'pending' });
      return response.data || [];
    } catch (error: any) {
      const errorMessage = errorUtils.getUserMessage(error) || '크리에이터 신청 목록을 불러오는데 실패했습니다.';
      return rejectWithValue(errorMessage);
    }
  }
);

// 크리에이터 신청 승인/거부
export const processCreatorApplication = createAsyncThunk(
  'userManagement/processCreatorApplication',
  async (params: CreatorApplicationAction, { rejectWithValue }) => {
    try {
      if (params.action === 'approve') {
        await adminApi.approveCreator(params.applicationId);
        return { id: params.applicationId, status: 'approved' };
      } else {
        await adminApi.rejectCreator(params.applicationId);
        return { id: params.applicationId, status: 'rejected' };
      }
    } catch (error: any) {
      const errorMessage = errorUtils.getUserMessage(error) || '크리에이터 신청 처리에 실패했습니다.';
      return rejectWithValue(errorMessage);
    }
  }
);

// 크리에이터 승인 내역 조회
export const fetchApprovalHistory = createAsyncThunk(
  'userManagement/fetchApprovalHistory',
  async (params: GetApprovalHistoryRequest = {}, { rejectWithValue }) => {
    try {
      const response = await adminApi.getCreators({ ...params, status: 'all' });
      return {
        applications: response.data || [],
        pagination: response.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 }
      };
    } catch (error: any) {
      const errorMessage = errorUtils.getUserMessage(error) || '승인 내역을 불러오는데 실패했습니다.';
      return rejectWithValue(errorMessage);
    }
  }
);

// 일괄 작업 실행
export const executeBulkAction = createAsyncThunk(
  'userManagement/executeBulkAction',
  async (action: BulkAction, { rejectWithValue }) => {
    try {
      // Bulk actions need individual API calls for now
      const results = { type: action.type, successCount: 0, failureCount: 0 };
      for (const userId of action.userIds) {
        try {
          if (action.type === 'delete') {
            await adminApi.deleteUser(userId);
          } else {
            await adminApi.updateUser(userId, { serviceStatus: action.type });
          }
          results.successCount++;
        } catch {
          results.failureCount++;
        }
      }
      return results;
      return response;
    } catch (error: any) {
      const errorMessage = errorUtils.getUserMessage(error) || '일괄 작업 실행에 실패했습니다.';
      return rejectWithValue(errorMessage);
    }
  }
);

// 사용자 통계 조회
export const fetchUserStats = createAsyncThunk(
  'userManagement/fetchUserStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApi.getDashboardStats();
      return response;
    } catch (error: any) {
      const errorMessage = errorUtils.getUserMessage(error) || '사용자 통계를 불러오는데 실패했습니다.';
      return rejectWithValue(errorMessage);
    }
  }
);

// 대시보드 데이터 조회
export const fetchDashboard = createAsyncThunk(
  'userManagement/fetchDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApi.getDashboardStats();
      return response;
    } catch (error: any) {
      const errorMessage = errorUtils.getUserMessage(error) || '대시보드 데이터를 불러오는데 실패했습니다.';
      return rejectWithValue(errorMessage);
    }
  }
);

const userManagementSlice = createSlice({
  name: 'userManagement',
  initialState,
  reducers: {
    // 에러 클리어
    clearError: (state) => {
      state.error = null;
    },

    // 필터 설정
    setFilters: (state, action: PayloadAction<Partial<UserManagementFilter>>) => {
      state.filters = { ...state.filters, ...action.payload };
      // 필터 변경시 첫 페이지로 이동
      state.pagination.page = 1;
    },

    // 페이지네이션 설정
    setPagination: (state, action: PayloadAction<{ page: number; limit?: number }>) => {
      state.pagination.page = action.payload.page;
      if (action.payload.limit) {
        state.pagination.limit = action.payload.limit;
      }
    },

    // 사용자 선택/해제
    toggleUserSelection: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      const index = state.selectedUsers.indexOf(userId);
      if (index === -1) {
        state.selectedUsers.push(userId);
      } else {
        state.selectedUsers.splice(index, 1);
      }
    },

    // 모든 사용자 선택/해제
    toggleAllUsers: (state, action: PayloadAction<boolean>) => {
      if (action.payload) {
        state.selectedUsers = state.users.map(user => user.id);
      } else {
        state.selectedUsers = [];
      }
    },

    // 선택된 사용자 클리어
    clearSelectedUsers: (state) => {
      state.selectedUsers = [];
    },

    // 선택된 사용자 설정
    setSelectedUser: (state, action: PayloadAction<MyPickUser | null>) => {
      state.selectedUser = action.payload;
    },

    // 모달 상태 관리
    setModalOpen: (state, action: PayloadAction<{ modal: keyof UserManagementState['modals']; open: boolean }>) => {
      state.modals[action.payload.modal] = action.payload.open;
    },

    // 사용자 목록에서 사용자 업데이트 (로컬 상태)
    updateUserInList: (state, action: PayloadAction<{ userId: string; updates: Partial<MyPickUser> }>) => {
      const { userId, updates } = action.payload;
      const userIndex = state.users.findIndex(user => user.id === userId);
      if (userIndex !== -1) {
        state.users[userIndex] = { ...state.users[userIndex], ...updates };
      }
    },

    // 크리에이터 신청 상태 업데이트 (로컬 상태)
    updateCreatorApplicationInList: (state, action: PayloadAction<{ applicationId: string; updates: Partial<CreatorApplication> }>) => {
      const { applicationId, updates } = action.payload;
      const appIndex = state.creatorApplications.findIndex(app => app.id === applicationId);
      if (appIndex !== -1) {
        state.creatorApplications[appIndex] = { ...state.creatorApplications[appIndex], ...updates };
      }
    },

    // 검색어 설정 (디바운스용)
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
    },

    // 정렬 설정
    setSorting: (state, action: PayloadAction<{ sortBy: UserManagementFilter['sortBy']; sortOrder: UserManagementFilter['sortOrder'] }>) => {
      state.filters.sortBy = action.payload.sortBy;
      state.filters.sortOrder = action.payload.sortOrder;
    },

    // 활성 탭 설정
    setActiveTab: (state, action: PayloadAction<'users' | 'approvalHistory'>) => {
      state.activeTab = action.payload;
    },

    // 승인 내역 필터 설정
    setApprovalHistoryFilters: (state, action: PayloadAction<Partial<CreatorApprovalHistoryFilter>>) => {
      state.approvalHistoryFilters = { ...state.approvalHistoryFilters, ...action.payload };
      // 필터 변경시 첫 페이지로 이동
      state.approvalHistoryPagination.page = 1;
    },

    // 승인 내역 페이지네이션 설정
    setApprovalHistoryPagination: (state, action: PayloadAction<{ page: number; limit?: number }>) => {
      state.approvalHistoryPagination.page = action.payload.page;
      if (action.payload.limit) {
        state.approvalHistoryPagination.limit = action.payload.limit;
      }
    },
  },
  extraReducers: (builder) => {
    // 사용자 목록 조회
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.users;
        state.pagination = action.payload.pagination;
        state.stats = action.payload.stats;
        // 선택된 사용자 목록 클리어 (새 데이터 로드시)
        state.selectedUsers = [];
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // 사용자 상세 정보 조회
    builder
      .addCase(fetchUserDetail.pending, (state) => {
        state.isLoadingDetail = true;
        state.error = null;
      })
      .addCase(fetchUserDetail.fulfilled, (state, action) => {
        state.isLoadingDetail = false;
        state.userDetail = action.payload;
        state.selectedUser = action.payload.user;
      })
      .addCase(fetchUserDetail.rejected, (state, action) => {
        state.isLoadingDetail = false;
        state.error = action.payload as string;
      });

    // 사용자 정보 업데이트
    builder
      .addCase(updateUser.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        // 목록에서 업데이트
        const userIndex = state.users.findIndex(user => user.id === updatedUser.id);
        if (userIndex !== -1) {
          state.users[userIndex] = updatedUser;
        }
        // 선택된 사용자 업데이트
        if (state.selectedUser?.id === updatedUser.id) {
          state.selectedUser = updatedUser;
        }
      });

    // 크리에이터 신청 목록 조회
    builder
      .addCase(fetchCreatorApplications.fulfilled, (state, action) => {
        state.creatorApplications = action.payload;
        state.pendingApplicationsCount = action.payload.filter(app => app.status === 'pending').length;
      });

    // 크리에이터 신청 처리
    builder
      .addCase(processCreatorApplication.fulfilled, (state, action) => {
        const processedApplication = action.payload;
        const appIndex = state.creatorApplications.findIndex(app => app.id === processedApplication.id);
        if (appIndex !== -1) {
          state.creatorApplications[appIndex] = processedApplication;
        }
        // 대기 중인 신청 수 업데이트
        state.pendingApplicationsCount = state.creatorApplications.filter(app => app.status === 'pending').length;
        
        // 승인 내역에도 추가 (승인/거부된 경우)
        if (processedApplication.status !== 'pending') {
          const historyIndex = state.approvalHistory.findIndex(app => app.id === processedApplication.id);
          if (historyIndex === -1) {
            // 새로 추가
            state.approvalHistory.unshift(processedApplication);
          } else {
            // 기존 항목 업데이트
            state.approvalHistory[historyIndex] = processedApplication;
          }
        }
      });

    // 크리에이터 승인 내역 조회
    builder
      .addCase(fetchApprovalHistory.pending, (state) => {
        state.isLoadingApprovalHistory = true;
        state.error = null;
      })
      .addCase(fetchApprovalHistory.fulfilled, (state, action) => {
        state.isLoadingApprovalHistory = false;
        state.approvalHistory = action.payload.applications;
        state.approvalHistoryPagination = action.payload.pagination;
      })
      .addCase(fetchApprovalHistory.rejected, (state, action) => {
        state.isLoadingApprovalHistory = false;
        state.error = action.payload as string;
      });

    // 일괄 작업 실행
    builder
      .addCase(executeBulkAction.pending, (state) => {
        state.isProcessingBulkAction = true;
        state.error = null;
      })
      .addCase(executeBulkAction.fulfilled, (state, action) => {
        state.isProcessingBulkAction = false;
        const result = action.payload;
        
        // 성공한 사용자들의 상태 업데이트
        if (result.type === 'activate' || result.type === 'deactivate' || result.type === 'suspend' || result.type === 'unsuspend') {
          state.users = state.users.map(user => {
            if (result.successCount > 0 && state.selectedUsers.includes(user.id)) {
              // 실제로는 서버에서 업데이트된 데이터를 받아와야 함
              let newStatus = user.serviceStatus;
              switch (result.type) {
                case 'activate':
                  newStatus = 'active';
                  break;
                case 'deactivate':
                  newStatus = 'inactive';
                  break;
                case 'suspend':
                  newStatus = 'suspended';
                  break;
                case 'unsuspend':
                  newStatus = 'active';
                  break;
              }
              return { ...user, serviceStatus: newStatus };
            }
            return user;
          });
        }
        
        // 삭제의 경우 목록에서 제거
        if (result.type === 'delete' && result.successCount > 0) {
          state.users = state.users.filter(user => !state.selectedUsers.includes(user.id));
        }
        
        // 선택된 사용자 목록 클리어
        state.selectedUsers = [];
      })
      .addCase(executeBulkAction.rejected, (state, action) => {
        state.isProcessingBulkAction = false;
        state.error = action.payload as string;
      });

    // 사용자 통계 조회
    builder
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });

    // 대시보드 데이터 조회
    builder
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.dashboard = action.payload;
      });
  },
});

export const {
  clearError,
  setFilters,
  setPagination,
  toggleUserSelection,
  toggleAllUsers,
  clearSelectedUsers,
  setSelectedUser,
  setModalOpen,
  updateUserInList,
  updateCreatorApplicationInList,
  setSearchQuery,
  setSorting,
  setActiveTab,
  setApprovalHistoryFilters,
  setApprovalHistoryPagination,
} = userManagementSlice.actions;

export default userManagementSlice.reducer;