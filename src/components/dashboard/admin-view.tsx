'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Users,
  Star,
  Video,
  Settings,
  BarChart,
  Database,
  Search,
  Filter,
  MoreHorizontal,
  ExternalLink,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  TrendingDown,
  Square,
  CheckSquare,
  Layers,
  Edit,
  Copy,
  Trash2,
  Eye,
  UserCheck,
  UserX,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useAdmin } from '@/hooks/redux';
import { setCurrentAdminPage } from '@/store/slices/adminSlice';
import {
  enablePlatform,
  disablePlatform,
  addPlatform,
  updatePlatform,
  removePlatform,
  selectAllPlatforms,
  selectEnabledPlatforms,
  selectDisabledPlatforms,
} from '@/store/slices/platformSlice';
import { cn } from '@/lib/utils';
import { mockCreators } from '@/data/creators';
import { Creator } from '@/types';
import { PlatformConfig } from '@/types/platform';
import { CreatorAddModal } from './creator-add-modal';
import { CreatorDetailModal } from './creator-detail-modal';
import { CreatorEditModal } from './creator-edit-modal';
import { PlatformAddModal } from './platform-add-modal';
import { BulkOperations, BulkAction } from './bulk-operations';

const ADMIN_MENU_ITEMS = [
  { id: 'dashboard', label: '대시보드', icon: BarChart },
  { id: 'users', label: '사용자 관리', icon: Users },
  { id: 'creators', label: '크리에이터 관리', icon: Star },
  { id: 'platforms', label: '플랫폼 관리', icon: Layers },
  { id: 'content', label: '콘텐츠 모니터링', icon: Video },
  { id: 'api', label: 'API 키 관리', icon: Database },
  { id: 'settings', label: '시스템 설정', icon: Settings },
];

const MOCK_STATS = {
  totalUsers: 12345,
  totalCreators: 487,
  totalContent: 1892,
  apiUsage: 89,
  userGrowth: 12,
  creatorGrowth: 8,
  contentGrowth: 23,
};

const MOCK_RECENT_ACTIVITY = [
  {
    id: '1',
    type: 'user_joined',
    message: '새 사용자 가입: user1234',
    time: '2분 전',
    color: 'bg-green-500',
  },
  {
    id: '2',
    type: 'creator_added',
    message: '크리에이터 등록: NewCreator',
    time: '15분 전',
    color: 'bg-blue-500',
  },
  {
    id: '3',
    type: 'api_warning',
    message: 'API 할당량 80% 도달',
    time: '1시간 전',
    color: 'bg-yellow-500',
  },
];

const MOCK_POPULAR_CREATORS = [
  {
    id: 'ado',
    name: 'Ado',
    followers: 15200,
    growth: 12,
  },
  {
    id: 'hikakin',
    name: '히카킨',
    followers: 12800,
    growth: 8,
  },
];

// 관리자 페이지용 크리에이터 데이터 가공
const transformCreatorForAdmin = (creator: Creator) => {
  const youtubeData = creator.platforms.find((p) => p.type === 'youtube');

  return {
    id: creator.id,
    name: creator.name,
    displayName: creator.displayName,
    platform: 'YouTube',
    channelUrl: youtubeData?.url || '',
    subscriberCount: creator.followerCount,
    totalVideos: creator.contentCount,
    avgViews: Math.floor(creator.totalViews / creator.contentCount),
    status: creator.isVerified ? 'active' : 'pending',
    verificationStatus: creator.isVerified ? 'verified' : 'pending',
    joinedDate: creator.createdAt.split('T')[0],
    lastActivity: creator.updatedAt.split('T')[0],
    contentCategories: creator.description
      ? ['음악', '엔터테인먼트']
      : ['게임', '리뷰'],
    monthlyGrowth: Math.round((Math.random() * 20 - 5) * 10) / 10, // -5% ~ 15% 랜덤 성장률 (소수점 1자리)
    engagementRate: Math.round((Math.random() * 15 + 5) * 10) / 10, // 5% ~ 20% 랜덤 참여율 (소수점 1자리)
    topVideo: {
      title: `${creator.displayName}의 인기 영상`,
      views: Math.floor(creator.totalViews * 0.1),
      uploadDate: new Date().toISOString().split('T')[0],
    },
  };
};

export function AdminView() {
  const dispatch = useAppDispatch();
  const { currentAdminPage } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCreators, setSelectedCreators] = useState<string[]>([]);
  const [adminCreatorsData, setAdminCreatorsData] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCreatorForModal, setSelectedCreatorForModal] = useState<any>(null);

  // 플랫폼 관리 관련 상태
  const allPlatforms = useAppSelector(selectAllPlatforms);
  const enabledPlatforms = useAppSelector(selectEnabledPlatforms);
  const disabledPlatforms = useAppSelector(selectDisabledPlatforms);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [platformSearchTerm, setPlatformSearchTerm] = useState('');
  const [platformStatusFilter, setPlatformStatusFilter] = useState('all');
  const [showPlatformAddModal, setShowPlatformAddModal] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState<PlatformConfig | null>(
    null
  );
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingPlatformId, setDeletingPlatformId] = useState<string | null>(
    null
  );
  // 크리에이터 관리용 드롭다운 상태
  const [openCreatorDropdownId, setOpenCreatorDropdownId] = useState<string | null>(null);
  const [showCreatorDeleteConfirm, setShowCreatorDeleteConfirm] = useState(false);
  const [deletingCreatorId, setDeletingCreatorId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const creatorDropdownRef = useRef<HTMLDivElement>(null);

  // Mock 데이터를 관리자 페이지 형식으로 변환
  useEffect(() => {
    const transformedData = mockCreators.map(transformCreatorForAdmin);
    setAdminCreatorsData(transformedData);
  }, []);

  // 드롭다운 외부 클릭 시 닫기 및 ESC키 핸들링
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdownId(null);
      }
      if (
        creatorDropdownRef.current &&
        !creatorDropdownRef.current.contains(event.target as Node)
      ) {
        setOpenCreatorDropdownId(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenDropdownId(null);
        setShowDeleteConfirm(false);
        setOpenCreatorDropdownId(null);
        setShowCreatorDeleteConfirm(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleMenuClick = (pageId: string) => {
    dispatch(setCurrentAdminPage(pageId as any));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'inactive':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '활성';
      case 'pending':
        return '대기중';
      case 'inactive':
        return '비활성';
      default:
        return status;
    }
  };

  const getVerificationIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + 'B';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const filteredCreators = adminCreatorsData.filter((creator) => {
    const matchesSearch =
      creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      creator.displayName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || creator.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // 일괄 작업 핸들러
  const handleSelectAll = () => {
    setSelectedCreators(filteredCreators.map((creator) => creator.id));
  };

  const handleSelectNone = () => {
    setSelectedCreators([]);
  };

  const handleCreatorSelect = (creatorId: string) => {
    setSelectedCreators((prev) =>
      prev.includes(creatorId)
        ? prev.filter((id) => id !== creatorId)
        : [...prev, creatorId]
    );
  };

  const handleBulkAction = (action: BulkAction, creatorIds: string[]) => {
    console.log(`일괄 작업: ${action}`, creatorIds);

    switch (action) {
      case 'activate':
        setAdminCreatorsData((prev) =>
          prev.map((creator) =>
            creatorIds.includes(creator.id)
              ? { ...creator, status: 'active' }
              : creator
          )
        );
        break;
      case 'deactivate':
        setAdminCreatorsData((prev) =>
          prev.map((creator) =>
            creatorIds.includes(creator.id)
              ? { ...creator, status: 'inactive' }
              : creator
          )
        );
        break;
      case 'delete':
        setAdminCreatorsData((prev) =>
          prev.filter((creator) => !creatorIds.includes(creator.id))
        );
        break;
      case 'export':
        // 내보내기 로직
        const exportData = adminCreatorsData.filter((creator) =>
          creatorIds.includes(creator.id)
        );
        console.log('내보내기 데이터:', exportData);
        break;
      case 'refresh':
        // 새로고침 로직
        console.log('데이터 새로고침');
        break;
    }

    setSelectedCreators([]);
  };

  const handleAddCreator = (formData: any) => {
    const newCreator = {
      id: `creator_${Date.now()}`,
      name: formData.name,
      displayName: formData.displayName,
      description: formData.description,
      platform: formData.platforms[0]?.type || 'YouTube',
      channelUrl: formData.platforms[0]?.url || '',
      platforms: formData.platforms,
      subscriberCount: 0,
      totalVideos: 0,
      avgViews: 0,
      status: 'pending',
      verificationStatus: 'pending',
      joinedDate: new Date().toISOString().split('T')[0],
      lastActivity: new Date().toISOString().split('T')[0],
      contentCategories: ['신규'],
      monthlyGrowth: 0,
      engagementRate: 0,
      topVideo: {
        title: '아직 영상 없음',
        views: 0,
        uploadDate: new Date().toISOString().split('T')[0],
      },
    };

    setAdminCreatorsData((prev) => [newCreator, ...prev]);
    
    // 추가 성공 알림
    setTimeout(() => {
      alert(`${formData.displayName} 크리에이터가 성공적으로 추가되었습니다.`);
    }, 100);
    
    console.log('새 크리에이터 추가:', newCreator);
  };

  // 크리에이터 수정 처리
  const handleUpdateCreator = (formData: any) => {
    if (!selectedCreatorForModal) return;

    setAdminCreatorsData((prev) =>
      prev.map((creator) =>
        creator.id === selectedCreatorForModal.id
          ? {
              ...creator,
              name: formData.name,
              displayName: formData.displayName,
              description: formData.description,
              platforms: formData.platforms,
              channelUrl: formData.platforms[0]?.url || creator.channelUrl,
              platform: formData.platforms[0]?.type || creator.platform,
              lastActivity: new Date().toISOString().split('T')[0], // 수정 시 활동 날짜 업데이트
            }
          : creator
      )
    );
    
    // 수정 성공 알림
    setTimeout(() => {
      alert(`${formData.displayName} 크리에이터 정보가 성공적으로 수정되었습니다.`);
    }, 100);
    
    console.log('크리에이터 수정:', selectedCreatorForModal.id, formData);
  };

  // 모달 닫기 헬퍼 함수들
  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedCreatorForModal(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedCreatorForModal(null);
  };

  // 플랫폼 관리 관련 함수들
  const filteredPlatforms = allPlatforms.filter((platform) => {
    const matchesSearch =
      platform.name.toLowerCase().includes(platformSearchTerm.toLowerCase()) ||
      platform.displayName
        .toLowerCase()
        .includes(platformSearchTerm.toLowerCase());
    const matchesStatus =
      platformStatusFilter === 'all' ||
      (platformStatusFilter === 'enabled' && platform.isEnabled) ||
      (platformStatusFilter === 'disabled' && !platform.isEnabled);
    return matchesSearch && matchesStatus;
  });

  const handlePlatformSelect = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((id) => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleSelectAllPlatforms = () => {
    setSelectedPlatforms(filteredPlatforms.map((platform) => platform.id));
  };

  const handleSelectNonePlatforms = () => {
    setSelectedPlatforms([]);
  };

  const handlePlatformBulkAction = (
    action: BulkAction,
    platformIds: string[]
  ) => {
    console.log(`플랫폼 일괄 작업: ${action}`, platformIds);

    switch (action) {
      case 'activate':
        platformIds.forEach((id) => dispatch(enablePlatform(id)));
        break;
      case 'deactivate':
        platformIds.forEach((id) => dispatch(disablePlatform(id)));
        break;
      case 'delete':
        platformIds.forEach((id) => dispatch(removePlatform(id)));
        break;
      case 'export':
        const exportData = allPlatforms.filter((platform) =>
          platformIds.includes(platform.id)
        );
        console.log('플랫폼 내보내기 데이터:', exportData);
        break;
      case 'refresh':
        console.log('플랫폼 데이터 새로고침');
        break;
    }

    setSelectedPlatforms([]);
  };

  const handleTogglePlatform = (platformId: string) => {
    const platform = allPlatforms.find((p) => p.id === platformId);
    if (platform) {
      if (platform.isEnabled) {
        dispatch(disablePlatform(platformId));
      } else {
        dispatch(enablePlatform(platformId));
      }
    }
  };

  const handleAddPlatform = (platformData: Omit<PlatformConfig, 'id'>) => {
    const newPlatform: PlatformConfig = {
      ...platformData,
      id: `platform_${Date.now()}`,
    };

    dispatch(addPlatform(newPlatform));
    console.log('새 플랫폼 추가:', newPlatform);
  };

  // 드롭다운 메뉴 토글
  const toggleDropdown = (platformId: string) => {
    setOpenDropdownId(openDropdownId === platformId ? null : platformId);
  };

  // 플랫폼 수정
  const handleEditPlatform = (platform: PlatformConfig) => {
    setEditingPlatform(platform);
    setShowPlatformAddModal(true);
    setOpenDropdownId(null);
  };

  // 플랫폼 복제
  const handleDuplicatePlatform = (platform: PlatformConfig) => {
    const duplicatedPlatform: Omit<PlatformConfig, 'id'> = {
      ...platform,
      name: `${platform.name}_copy`,
      displayName: `${platform.displayName} 복사본`,
      isDefault: false, // 복사본은 기본값이 될 수 없음
      order: allPlatforms.length + 1, // 마지막 순서로 설정
    };

    handleAddPlatform(duplicatedPlatform);
    setOpenDropdownId(null);
    console.log('플랫폼 복제:', duplicatedPlatform);
  };

  // 플랫폼 삭제 확인
  const handleDeletePlatform = (platformId: string) => {
    setDeletingPlatformId(platformId);
    setShowDeleteConfirm(true);
    setOpenDropdownId(null);
  };

  // 플랫폼 삭제 확정
  const handleConfirmDelete = () => {
    if (deletingPlatformId) {
      dispatch(removePlatform(deletingPlatformId));
      console.log('플랫폼 삭제:', deletingPlatformId);
    }
    setShowDeleteConfirm(false);
    setDeletingPlatformId(null);
  };

  // 플랫폼 삭제 취소
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeletingPlatformId(null);
  };

  // 플랫폼 수정 완료
  const handleUpdatePlatform = (platformData: Omit<PlatformConfig, 'id'>) => {
    if (editingPlatform) {
      const updatedPlatform: PlatformConfig = {
        ...platformData,
        id: editingPlatform.id,
      };

      dispatch(updatePlatform(updatedPlatform));
      console.log('플랫폼 수정:', updatedPlatform);
    }

    setEditingPlatform(null);
  };

  // 플랫폼 모달 닫기
  const handleClosePlatformModal = () => {
    setShowPlatformAddModal(false);
    setEditingPlatform(null);
  };

  // 크리에이터 관리 드롭다운 관련 함수들
  const toggleCreatorDropdown = (creatorId: string) => {
    setOpenCreatorDropdownId(openCreatorDropdownId === creatorId ? null : creatorId);
  };

  // 크리에이터 수정
  const handleEditCreator = (creator: any) => {
    setSelectedCreatorForModal(creator);
    setShowEditModal(true);
    setOpenCreatorDropdownId(null);
  };

  // 크리에이터 상세 보기
  const handleViewCreator = (creator: any) => {
    setSelectedCreatorForModal(creator);
    setShowDetailModal(true);
    setOpenCreatorDropdownId(null);
  };

  // 크리에이터 상태 변경
  const handleToggleCreatorStatus = (creatorId: string) => {
    const creator = adminCreatorsData.find(c => c.id === creatorId);
    if (!creator) return;

    const newStatus = creator.status === 'active' ? 'inactive' : 'active';
    const actionText = newStatus === 'active' ? '활성화' : '비활성화';

    setAdminCreatorsData((prev) =>
      prev.map((creator) =>
        creator.id === creatorId
          ? {
              ...creator,
              status: newStatus,
              lastActivity: new Date().toISOString().split('T')[0], // 활동 날짜 업데이트
            }
          : creator
      )
    );
    setOpenCreatorDropdownId(null);
    
    // 성공 알림 (임시로 alert 사용, 나중에 toast로 교체)
    setTimeout(() => {
      alert(`${creator.displayName} 크리에이터가 ${actionText}되었습니다.`);
    }, 100);
    
    console.log('크리에이터 상태 변경:', creatorId, '→', newStatus);
  };

  // 크리에이터 삭제 확인
  const handleDeleteCreator = (creatorId: string) => {
    setDeletingCreatorId(creatorId);
    setShowCreatorDeleteConfirm(true);
    setOpenCreatorDropdownId(null);
  };

  // 크리에이터 삭제 확정
  const handleConfirmCreatorDelete = () => {
    if (deletingCreatorId) {
      const creator = adminCreatorsData.find(c => c.id === deletingCreatorId);
      const creatorName = creator?.displayName || '크리에이터';
      
      setAdminCreatorsData((prev) =>
        prev.filter((creator) => creator.id !== deletingCreatorId)
      );
      
      // 삭제 성공 알림
      setTimeout(() => {
        alert(`${creatorName}이(가) 성공적으로 삭제되었습니다.`);
      }, 100);
      
      console.log('크리에이터 삭제:', deletingCreatorId);
    }
    setShowCreatorDeleteConfirm(false);
    setDeletingCreatorId(null);
  };

  // 크리에이터 삭제 취소
  const handleCancelCreatorDelete = () => {
    setShowCreatorDeleteConfirm(false);
    setDeletingCreatorId(null);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">총 사용자</p>
                <p className="text-2xl font-bold">
                  {MOCK_STATS.totalUsers.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-green-600">
                  ↗ {MOCK_STATS.userGrowth}% 증가
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">등록 크리에이터</p>
                <p className="text-2xl font-bold">{MOCK_STATS.totalCreators}</p>
                <p className="mt-1 text-xs text-green-600">
                  ↗ {MOCK_STATS.creatorGrowth}% 증가
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">오늘의 콘텐츠</p>
                <p className="text-2xl font-bold">
                  {MOCK_STATS.totalContent.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-green-600">
                  ↗ {MOCK_STATS.contentGrowth}% 증가
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <Video className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">API 사용량</p>
                <p className="text-2xl font-bold">{MOCK_STATS.apiUsage}%</p>
                <p className="mt-1 text-xs text-yellow-600">⚠ 주의 필요</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
                <Database className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 최근 활동 & 인기 크리에이터 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>최근 활동</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {MOCK_RECENT_ACTIVITY.map((activity) => (
                <div key={activity.id} className="flex items-center">
                  <div
                    className={cn('mr-3 h-2 w-2 rounded-full', activity.color)}
                  />
                  <div className="flex-1">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>인기 크리에이터</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {MOCK_POPULAR_CREATORS.map((creator) => (
                <div
                  key={creator.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div
                      className={cn(
                        'mr-3 flex h-10 w-10 items-center justify-center rounded-full font-bold text-white',
                        creator.id === 'ado'
                          ? 'gradient-ado'
                          : 'gradient-hikakin'
                      )}
                    >
                      {creator.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{creator.name}</p>
                      <p className="text-xs text-muted-foreground">
                        팔로워 {creator.followers.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-green-600">
                    +{creator.growth}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">사용자 관리</h2>
          <p className="text-muted-foreground">
            등록된 사용자를 관리하고 권한을 설정합니다.
          </p>
        </div>
        <Button>새 사용자 추가</Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">
            사용자 관리 기능이 여기에 표시됩니다.
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const renderCreators = () => (
    <div className="space-y-6">
      {/* 헤더 및 액션 */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">크리에이터 관리</h2>
          <p className="text-muted-foreground">
            등록된 크리에이터와 채널 정보를 관리합니다.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowAddModal(true)}>크리에이터 추가</Button>
        </div>
      </div>

      {/* 통계 요약 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">총 크리에이터</p>
                <p className="text-2xl font-bold">{adminCreatorsData.length}</p>
              </div>
              <Star className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">활성 크리에이터</p>
                <p className="text-2xl font-bold">
                  {
                    adminCreatorsData.filter((c) => c.status === 'active')
                      .length
                  }
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">승인 대기</p>
                <p className="text-2xl font-bold">
                  {
                    adminCreatorsData.filter((c) => c.status === 'pending')
                      .length
                  }
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">총 구독자</p>
                <p className="text-2xl font-bold">
                  {formatNumber(
                    adminCreatorsData.reduce(
                      (sum, c) => sum + c.subscriberCount,
                      0
                    )
                  )}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 일괄 작업 */}
      <Card>
        <CardContent className="p-4">
          <BulkOperations
            selectedCreators={selectedCreators}
            totalCreators={filteredCreators.length}
            onSelectAll={handleSelectAll}
            onSelectNone={handleSelectNone}
            onBulkAction={handleBulkAction}
          />
        </CardContent>
      </Card>

      {/* 검색 및 필터 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
              <input
                type="text"
                placeholder="크리에이터 이름으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">모든 상태</option>
                <option value="active">활성</option>
                <option value="pending">대기중</option>
                <option value="inactive">비활성</option>
              </select>
              <Button variant="outline" size="sm">
                <Filter className="mr-1 h-4 w-4" />
                필터
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 크리에이터 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>크리에이터 목록 ({filteredCreators.length}명)</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="w-12 p-4 text-center text-sm font-medium">
                    <button
                      onClick={() =>
                        selectedCreators.length === filteredCreators.length
                          ? handleSelectNone()
                          : handleSelectAll()
                      }
                      className="p-1"
                    >
                      {selectedCreators.length === filteredCreators.length &&
                      filteredCreators.length > 0 ? (
                        <CheckSquare className="h-4 w-4 text-blue-600" />
                      ) : selectedCreators.length > 0 ? (
                        <CheckSquare className="h-4 w-4 text-blue-500" />
                      ) : (
                        <Square className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </th>
                  <th className="p-4 text-center text-sm font-medium">
                    크리에이터
                  </th>
                  <th className="p-4 text-center text-sm font-medium">구독자</th>
                  <th className="p-4 text-center text-sm font-medium">성장률</th>
                  <th className="p-4 text-center text-sm font-medium">참여율</th>
                  <th className="p-4 text-center text-sm font-medium">상태</th>
                  <th className="p-4 text-center text-sm font-medium">
                    마지막 활동
                  </th>
                  <th className="p-4 text-center text-sm font-medium">액션</th>
                </tr>
              </thead>
              <tbody>
                {filteredCreators.map((creator) => (
                  <tr
                    key={creator.id}
                    className={cn(
                      'border-b hover:bg-gray-50',
                      selectedCreators.includes(creator.id) && 'bg-blue-50'
                    )}
                  >
                    <td className="p-4">
                      <button
                        onClick={() => handleCreatorSelect(creator.id)}
                        className="p-1"
                      >
                        {selectedCreators.includes(creator.id) ? (
                          <CheckSquare className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Square className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className={cn(
                            'flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white',
                            creator.id === 'ado'
                              ? 'bg-gradient-to-r from-pink-400 to-purple-500'
                              : creator.id === 'hikakin'
                                ? 'bg-gradient-to-r from-blue-400 to-cyan-500'
                                : creator.id === 'pewdiepie'
                                  ? 'bg-gradient-to-r from-red-400 to-pink-500'
                                  : creator.id === 'mrBeast'
                                    ? 'bg-gradient-to-r from-green-400 to-blue-500'
                                    : 'bg-gradient-to-r from-gray-400 to-gray-600'
                          )}
                        >
                          {creator.displayName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{creator.displayName}</p>
                            {getVerificationIcon(creator.verificationStatus)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {creator.platform}
                          </p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {creator.contentCategories
                              .slice(0, 2)
                              .map((category: string, index: number) => (
                                <span
                                  key={index}
                                  className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600"
                                >
                                  {category}
                                </span>
                              ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium">
                          {formatNumber(creator.subscriberCount)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {creator.totalVideos} 영상
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        {creator.monthlyGrowth > 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                        <span
                          className={cn(
                            'font-medium',
                            creator.monthlyGrowth > 0
                              ? 'text-green-600'
                              : 'text-red-600'
                          )}
                        >
                          {creator.monthlyGrowth > 0 ? '+' : ''}
                          {creator.monthlyGrowth.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-12 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full rounded-full bg-blue-500"
                            style={{
                              width: `${Math.min(creator.engagementRate * 10, 100)}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {creator.engagementRate.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        {getStatusIcon(creator.status)}
                        <span className="text-sm">
                          {getStatusText(creator.status)}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <p className="text-sm">{creator.lastActivity}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => window.open(creator.channelUrl, '_blank')}
                          title="채널 보기"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <div
                          className="relative"
                          ref={
                            openCreatorDropdownId === creator.id ? creatorDropdownRef : null
                          }
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleCreatorDropdown(creator.id)}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>

                          {/* 크리에이터 드롭다운 메뉴 */}
                          {openCreatorDropdownId === creator.id && (
                            <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-md border border-gray-200 bg-white shadow-lg">
                              <div className="py-1">
                                <button
                                  onClick={() => handleViewCreator(creator)}
                                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  상세 보기
                                </button>
                                <button
                                  onClick={() => handleEditCreator(creator)}
                                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  수정
                                </button>
                                <div className="my-1 border-t border-gray-100"></div>
                                <button
                                  onClick={() => handleToggleCreatorStatus(creator.id)}
                                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  {creator.status === 'active' ? (
                                    <>
                                      <UserX className="mr-2 h-4 w-4" />
                                      비활성화
                                    </>
                                  ) : (
                                    <>
                                      <UserCheck className="mr-2 h-4 w-4" />
                                      활성화
                                    </>
                                  )}
                                </button>
                                <div className="my-1 border-t border-gray-100"></div>
                                <button
                                  onClick={() => handleDeleteCreator(creator.id)}
                                  className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  삭제
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
        </CardContent>
      </Card>

      {/* 크리에이터 추가 모달 */}
      <CreatorAddModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddCreator}
      />

      {/* 크리에이터 상세 보기 모달 */}
      <CreatorDetailModal
        isOpen={showDetailModal}
        onClose={handleCloseDetailModal}
        creator={selectedCreatorForModal}
      />

      {/* 크리에이터 수정 모달 */}
      <CreatorEditModal
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        onSubmit={handleUpdateCreator}
        creator={selectedCreatorForModal}
      />

      {/* 크리에이터 삭제 확인 다이얼로그 */}
      {showCreatorDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center">
              <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  크리에이터 삭제
                </h3>
                <p className="text-sm text-gray-500">
                  이 작업은 되돌릴 수 없습니다.
                </p>
              </div>
            </div>

            <p className="mb-6 text-gray-700">
              정말로 이 크리에이터를 삭제하시겠습니까?
              <br />
              <span className="font-medium">
                {deletingCreatorId &&
                  adminCreatorsData.find((c) => c.id === deletingCreatorId)
                    ?.displayName}
              </span>
              과 관련된 모든 데이터가 함께 삭제됩니다.
            </p>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={handleCancelCreatorDelete}>
                취소
              </Button>
              <Button variant="destructive" onClick={handleConfirmCreatorDelete}>
                삭제
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderPlatforms = () => (
    <div className="space-y-6">
      {/* 헤더 및 액션 */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">플랫폼 관리</h2>
          <p className="text-muted-foreground">
            애플리케이션에서 사용할 플랫폼을 관리합니다.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowPlatformAddModal(true)}>
            플랫폼 추가
          </Button>
        </div>
      </div>

      {/* 통계 요약 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">총 플랫폼</p>
                <p className="text-2xl font-bold">{allPlatforms.length}</p>
              </div>
              <Layers className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">활성 플랫폼</p>
                <p className="text-2xl font-bold">{enabledPlatforms.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">비활성 플랫폼</p>
                <p className="text-2xl font-bold">{disabledPlatforms.length}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">기본 플랫폼</p>
                <p className="text-2xl font-bold">
                  {allPlatforms.filter((p) => p.isDefault).length}
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 일괄 작업 */}
      <Card>
        <CardContent className="p-4">
          <BulkOperations
            selectedCreators={selectedPlatforms}
            totalCreators={filteredPlatforms.length}
            onSelectAll={handleSelectAllPlatforms}
            onSelectNone={handleSelectNonePlatforms}
            onBulkAction={handlePlatformBulkAction}
          />
        </CardContent>
      </Card>

      {/* 검색 및 필터 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
              <input
                type="text"
                placeholder="플랫폼 이름으로 검색..."
                value={platformSearchTerm}
                onChange={(e) => setPlatformSearchTerm(e.target.value)}
                className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={platformStatusFilter}
                onChange={(e) => setPlatformStatusFilter(e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">모든 상태</option>
                <option value="enabled">활성</option>
                <option value="disabled">비활성</option>
              </select>
              <Button variant="outline" size="sm">
                <Filter className="mr-1 h-4 w-4" />
                필터
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 플랫폼 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>플랫폼 목록 ({filteredPlatforms.length}개)</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="w-12 p-4 text-left text-sm font-medium">
                    <button
                      onClick={() =>
                        selectedPlatforms.length === filteredPlatforms.length
                          ? handleSelectNonePlatforms()
                          : handleSelectAllPlatforms()
                      }
                      className="p-1"
                    >
                      {selectedPlatforms.length === filteredPlatforms.length &&
                      filteredPlatforms.length > 0 ? (
                        <CheckSquare className="h-4 w-4 text-blue-600" />
                      ) : selectedPlatforms.length > 0 ? (
                        <CheckSquare className="h-4 w-4 text-blue-500" />
                      ) : (
                        <Square className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </th>
                  <th className="p-4 text-center text-sm font-medium">
                    플랫폼
                  </th>
                  <th className="p-4 text-center text-sm font-medium">상태</th>
                  <th className="p-4 text-center text-sm font-medium">순서</th>
                  <th className="p-4 text-center text-sm font-medium">
                    기본값
                  </th>
                  <th className="p-4 text-center text-sm font-medium">설명</th>
                  <th className="p-4 text-center text-sm font-medium">액션</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlatforms.map((platform) => (
                  <tr
                    key={platform.id}
                    className={cn(
                      'border-b hover:bg-gray-50',
                      selectedPlatforms.includes(platform.id) && 'bg-blue-50'
                    )}
                  >
                    <td className="p-4">
                      <button
                        onClick={() => handlePlatformSelect(platform.id)}
                        className="p-1"
                      >
                        {selectedPlatforms.includes(platform.id) ? (
                          <CheckSquare className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Square className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center">
                        <div>
                          <p className="font-medium">{platform.displayName}</p>
                          <p className="text-sm text-muted-foreground">
                            {platform.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        {platform.isEnabled ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-green-600">활성</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-red-500" />
                            <span className="text-sm text-red-600">비활성</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center">
                        <span className="font-mono text-sm">
                          {platform.order}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center">
                        {platform.isDefault ? (
                          <Star className="h-4 w-4 text-yellow-500" />
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            -
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center">
                        <p className="max-w-xs truncate text-sm text-muted-foreground">
                          {platform.description || '설명 없음'}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center">
                        <div
                          className="relative"
                          ref={
                            openDropdownId === platform.id ? dropdownRef : null
                          }
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleDropdown(platform.id)}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>

                          {/* 드롭다운 메뉴 */}
                          {openDropdownId === platform.id && (
                            <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-md border border-gray-200 bg-white shadow-lg">
                              <div className="py-1">
                                <button
                                  onClick={() => handleEditPlatform(platform)}
                                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  수정
                                </button>
                                <button
                                  onClick={() =>
                                    handleDuplicatePlatform(platform)
                                  }
                                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <Copy className="mr-2 h-4 w-4" />
                                  복제
                                </button>
                                <div className="my-1 border-t border-gray-100"></div>
                                <button
                                  onClick={() =>
                                    handleTogglePlatform(platform.id)
                                  }
                                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  {platform.isEnabled ? (
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
                                  onClick={() =>
                                    handleDeletePlatform(platform.id)
                                  }
                                  className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  삭제
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
        </CardContent>
      </Card>

      {/* 플랫폼 추가/수정 모달 */}
      <PlatformAddModal
        isOpen={showPlatformAddModal}
        onClose={handleClosePlatformModal}
        onSubmit={editingPlatform ? handleUpdatePlatform : handleAddPlatform}
        editingPlatform={editingPlatform}
      />

      {/* 삭제 확인 다이얼로그 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center">
              <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  플랫폼 삭제
                </h3>
                <p className="text-sm text-gray-500">
                  이 작업은 되돌릴 수 없습니다.
                </p>
              </div>
            </div>

            <p className="mb-6 text-gray-700">
              정말로 이 플랫폼을 삭제하시겠습니까?
              <br />
              <span className="font-medium">
                {deletingPlatformId &&
                  allPlatforms.find((p) => p.id === deletingPlatformId)
                    ?.displayName}
              </span>
              과 관련된 모든 데이터가 함께 삭제됩니다.
            </p>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={handleCancelDelete}>
                취소
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>
                삭제
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (currentAdminPage) {
      case 'users':
        return renderUsers();
      case 'creators':
        return renderCreators();
      case 'platforms':
        return renderPlatforms();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="space-y-6">
        {/* 관리자 메뉴 탭 */}
        <div className="border-b border-gray-200">
          <div className="w-full overflow-x-auto">
            <nav className="flex min-w-max space-x-8">
              {ADMIN_MENU_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMenuClick(item.id)}
                    className={cn(
                      'flex items-center whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors',
                      currentAdminPage === item.id
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    )}
                  >
                    <Icon className="mr-2 h-5 w-5" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* 관리자 메인 콘텐츠 */}
        <div className="w-full">{renderContent()}</div>
      </div>
    </div>
  );
}
