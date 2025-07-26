'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Users,
  Star,
  CheckCircle,
  Clock,
  Search,
  Filter,
  MoreHorizontal,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Square,
  CheckSquare,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Import existing modal components
import { CreatorAddModal } from '@/components/admin/creators/creator-add-modal';
import { CreatorDetailModal } from '@/components/admin/creators/creator-detail-modal';
import { CreatorEditModal } from '@/components/admin/creators/creator-edit-modal';
import { BulkOperations, BulkAction } from '@/components/admin/shared/bulk-operations';

// Enhanced mock data with all necessary fields
const initialCreatorsData = [
  {
    id: 'ado',
    name: 'Ado',
    displayName: 'Ado',
    platform: 'YouTube',
    channelUrl: 'https://www.youtube.com/@Ado1024',
    subscriberCount: 1520000,
    totalVideos: 45,
    avgViews: 850000,
    status: 'active',
    verificationStatus: 'verified',
    lastActivity: '2024-01-15',
    joinedDate: '2023-06-10',
    monthlyGrowth: 12.5,
    engagementRate: 15.2,
    contentCategories: ['음악', '엔터테인먼트'],
    topVideo: {
      title: 'Ado의 인기 영상',
      views: 2500000,
      uploadDate: '2024-01-10',
    },
  },
  {
    id: 'hikakin',
    name: '히카킨',
    displayName: '히카킨', 
    platform: 'YouTube',
    channelUrl: 'https://www.youtube.com/@HikakinTV',
    subscriberCount: 1280000,
    totalVideos: 123,
    avgViews: 650000,
    status: 'active',
    verificationStatus: 'verified',
    lastActivity: '2024-01-14',
    joinedDate: '2023-03-15',
    monthlyGrowth: 8.3,
    engagementRate: 12.8,
    contentCategories: ['게임', '리뷰'],
    topVideo: {
      title: '히카킨의 인기 영상',
      views: 1800000,
      uploadDate: '2024-01-08',
    },
  },
  {
    id: 'pewdiepie',
    name: 'PewDiePie',
    displayName: 'PewDiePie',
    platform: 'YouTube',
    channelUrl: 'https://www.youtube.com/@PewDiePie',
    subscriberCount: 111000000,
    totalVideos: 4500,
    avgViews: 2500000,
    status: 'pending',
    verificationStatus: 'pending',
    lastActivity: '2024-01-12',
    joinedDate: '2023-12-01',
    monthlyGrowth: -2.1,
    engagementRate: 8.5,
    contentCategories: ['게임', '엔터테인먼트'],
    topVideo: {
      title: 'PewDiePie의 인기 영상',
      views: 5200000,
      uploadDate: '2024-01-05',
    },
  },
];

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

// Utility functions
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'pending':
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case 'inactive':
      return <UserX className="h-4 w-4 text-red-500" />;
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

export function AdminCreators() {
  // State management
  const [creatorsData, setCreatorsData] = useState(initialCreatorsData);
  const [selectedCreators, setSelectedCreators] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Modal state management
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Filter creators based on search and status
  const filteredCreators = creatorsData.filter((creator) => {
    const matchesSearch =
      creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      creator.displayName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || creator.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Selection handlers
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

  // Action handlers
  const toggleDropdown = (creatorId: string) => {
    setOpenDropdownId(openDropdownId === creatorId ? null : creatorId);
  };

  // Modal handlers
  const handleAddCreator = () => {
    setIsAddModalOpen(true);
  };

  const handleViewCreator = (creator: any) => {
    setSelectedCreator(creator);
    setIsDetailModalOpen(true);
    setOpenDropdownId(null);
  };

  const handleEditCreator = (creator: any) => {
    setSelectedCreator(creator);
    setIsEditModalOpen(true);
    setOpenDropdownId(null);
  };

  // CRUD operations
  const handleCreatorAdd = async (formData: any) => {
    setIsLoading(true);
    try {
      // Create new creator with mock data structure
      const newCreator = {
        id: `creator_${Date.now()}`,
        name: formData.name,
        displayName: formData.displayName,
        platform: formData.platforms[0]?.type || 'youtube',
        channelUrl: formData.platforms[0]?.url || '',
        subscriberCount: Math.floor(Math.random() * 1000000) + 10000,
        totalVideos: Math.floor(Math.random() * 100) + 5,
        avgViews: Math.floor(Math.random() * 500000) + 50000,
        status: 'pending',
        verificationStatus: 'pending',
        lastActivity: new Date().toISOString().split('T')[0],
        joinedDate: new Date().toISOString().split('T')[0],
        monthlyGrowth: (Math.random() - 0.5) * 20,
        engagementRate: Math.random() * 15 + 5,
        contentCategories: ['신규'],
        topVideo: {
          title: '새 크리에이터의 인기 영상',
          views: Math.floor(Math.random() * 100000) + 10000,
          uploadDate: new Date().toISOString().split('T')[0],
        },
      };

      setCreatorsData(prev => [...prev, newCreator]);
      console.log('Creator added successfully:', newCreator);
    } catch (error) {
      console.error('Error adding creator:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatorEdit = async (formData: any) => {
    if (!selectedCreator) {return;}
    
    setIsLoading(true);
    try {
      setCreatorsData(prev => prev.map(creator => 
        creator.id === selectedCreator.id 
          ? {
              ...creator,
              name: formData.name,
              displayName: formData.displayName,
              channelUrl: formData.platforms[0]?.url || creator.channelUrl,
              platform: formData.platforms[0]?.type || creator.platform,
            }
          : creator
      ));
      console.log('Creator updated successfully');
    } catch (error) {
      console.error('Error updating creator:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatorDelete = async (creatorId: string) => {
    if (!confirm('정말로 이 크리에이터를 삭제하시겠습니까?')) {return;}
    
    setIsLoading(true);
    try {
      setCreatorsData(prev => prev.filter(creator => creator.id !== creatorId));
      setSelectedCreators(prev => prev.filter(id => id !== creatorId));
      console.log('Creator deleted successfully');
    } catch (error) {
      console.error('Error deleting creator:', error);
    } finally {
      setIsLoading(false);
      setOpenDropdownId(null);
    }
  };

  const handleStatusToggle = async (creatorId: string) => {
    setIsLoading(true);
    try {
      setCreatorsData(prev => prev.map(creator => 
        creator.id === creatorId 
          ? { 
              ...creator, 
              status: creator.status === 'active' ? 'inactive' : 'active' 
            }
          : creator
      ));
      console.log('Creator status updated successfully');
    } catch (error) {
      console.error('Error updating creator status:', error);
    } finally {
      setIsLoading(false);
      setOpenDropdownId(null);
    }
  };

  const handleBulkAction = async (action: BulkAction, creatorIds: string[]) => {
    setIsLoading(true);
    try {
      switch (action) {
        case 'activate':
          setCreatorsData(prev => prev.map(creator => 
            creatorIds.includes(creator.id) 
              ? { ...creator, status: 'active' }
              : creator
          ));
          break;
        case 'deactivate':
          setCreatorsData(prev => prev.map(creator => 
            creatorIds.includes(creator.id) 
              ? { ...creator, status: 'inactive' }
              : creator
          ));
          break;
        case 'delete':
          setCreatorsData(prev => prev.filter(creator => !creatorIds.includes(creator.id)));
          setSelectedCreators([]);
          break;
        case 'export':
          // Mock export functionality
          const exportData = creatorsData.filter(creator => creatorIds.includes(creator.id));
          console.log('Exporting creators:', exportData);
          break;
        case 'refresh':
          // Mock refresh functionality
          console.log('Refreshing creator data for:', creatorIds);
          break;
      }
      console.log(`Bulk ${action} completed for ${creatorIds.length} creators`);
    } catch (error) {
      console.error(`Error in bulk ${action}:`, error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">크리에이터 관리</h1>
          <p className="mt-2 text-gray-600">
            등록된 크리에이터와 채널 정보를 관리합니다
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleAddCreator} disabled={isLoading}>
            크리에이터 추가
          </Button>
        </div>
      </div>

      {/* 통계 요약 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">총 크리에이터</p>
                <p className="text-2xl font-bold">{creatorsData.length}</p>
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
                  {creatorsData.filter((c) => c.status === 'active').length}
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
                  {creatorsData.filter((c) => c.status === 'pending').length}
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
                    creatorsData.reduce((sum, c) => sum + c.subscriberCount, 0)
                  )}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 일괄 작업 표시 */}
      {selectedCreators.length > 0 && (
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
      )}

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
                  <th className="p-4 text-center text-sm font-medium">크리에이터</th>
                  <th className="p-4 text-center text-sm font-medium">구독자</th>
                  <th className="p-4 text-center text-sm font-medium">성장률</th>
                  <th className="p-4 text-center text-sm font-medium">참여율</th>
                  <th className="p-4 text-center text-sm font-medium">상태</th>
                  <th className="p-4 text-center text-sm font-medium">마지막 활동</th>
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
                      <div className="flex items-center gap-1 justify-center">
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
                      <div className="flex items-center gap-2 justify-center">
                        <div className="h-2 w-12 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full rounded-full bg-blue-500"
                            style={{
                              width: `${Math.min(creator.engagementRate * 5, 100)}%`,
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
                          ref={openDropdownId === creator.id ? dropdownRef : null}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleDropdown(creator.id)}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>

                          {/* 드롭다운 메뉴 */}
                          {openDropdownId === creator.id && (
                            <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-md border border-gray-200 bg-white shadow-lg">
                              <div className="py-1">
                                <button 
                                  onClick={() => handleViewCreator(creator)}
                                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  disabled={isLoading}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  상세 보기
                                </button>
                                <button 
                                  onClick={() => handleEditCreator(creator)}
                                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  disabled={isLoading}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  수정
                                </button>
                                <div className="my-1 border-t border-gray-100"></div>
                                <button 
                                  onClick={() => handleStatusToggle(creator.id)}
                                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  disabled={isLoading}
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
                                  onClick={() => handleCreatorDelete(creator.id)}
                                  className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                  disabled={isLoading}
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

      {/* Modal Components */}
      <CreatorAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreatorAdd}
      />

      <CreatorDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedCreator(null);
        }}
        creator={selectedCreator}
      />

      <CreatorEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCreator(null);
        }}
        onSubmit={handleCreatorEdit}
        creator={selectedCreator}
      />
    </div>
  );
}