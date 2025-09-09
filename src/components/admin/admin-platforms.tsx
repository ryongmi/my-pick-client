'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Layers,
  Star,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  MoreHorizontal,
  Square,
  CheckSquare,
  Edit,
  Copy,
  Trash2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
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
import { PlatformConfig } from '@/types/platform';
import { PlatformAddModal } from '@/components/admin/platforms/platform-add-modal';
import { BulkOperations, BulkAction } from '@/components/admin/shared/bulk-operations';

export function AdminPlatforms(): JSX.Element {
  const dispatch = useAppDispatch();
  
  // Redux state
  const allPlatforms = useAppSelector(selectAllPlatforms);
  const enabledPlatforms = useAppSelector(selectEnabledPlatforms);
  const disabledPlatforms = useAppSelector(selectDisabledPlatforms);
  
  // Local state
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [platformSearchTerm, setPlatformSearchTerm] = useState('');
  const [platformStatusFilter, setPlatformStatusFilter] = useState('all');
  const [showPlatformAddModal, setShowPlatformAddModal] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState<PlatformConfig | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingPlatformId, setDeletingPlatformId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 드롭다운 외부 클릭 시 닫기 및 ESC키 핸들링
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        setOpenDropdownId(null);
        setShowDeleteConfirm(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return (): void => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // 플랫폼 필터링 로직
  const filteredPlatforms = allPlatforms.filter((platform) => {
    const matchesSearch =
      platform.name.toLowerCase().includes(platformSearchTerm.toLowerCase()) ||
      platform.displayName.toLowerCase().includes(platformSearchTerm.toLowerCase());
    const matchesStatus =
      platformStatusFilter === 'all' ||
      (platformStatusFilter === 'enabled' && platform.isEnabled) ||
      (platformStatusFilter === 'disabled' && !platform.isEnabled);
    return matchesSearch && matchesStatus;
  });

  // 선택 관련 핸들러들
  const handlePlatformSelect = (platformId: string): void => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((id) => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleSelectAllPlatforms = (): void => {
    setSelectedPlatforms(filteredPlatforms.map((platform) => platform.id));
  };

  const handleSelectNonePlatforms = (): void => {
    setSelectedPlatforms([]);
  };

  // 일괄 작업 핸들러
  const handlePlatformBulkAction = async (action: BulkAction, platformIds: string[]): Promise<void> => {
    setIsLoading(true);
    try {
      // eslint-disable-next-line no-console
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
        case 'export': {
          const exportData = allPlatforms.filter((platform) =>
            platformIds.includes(platform.id)
          );
          // eslint-disable-next-line no-console
          console.log('플랫폼 내보내기 데이터:', exportData);
          break;
        }
        case 'refresh':
          // eslint-disable-next-line no-console
          console.log('플랫폼 데이터 새로고침');
          break;
      }

      setSelectedPlatforms([]);
      // eslint-disable-next-line no-console
      console.log(`일괄 ${action} 완료: ${platformIds.length}개 플랫폼`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`일괄 ${action} 실패:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  // CRUD 작업 핸들러들
  const handleAddPlatform = async (platformData: Omit<PlatformConfig, 'id'>): Promise<void> => {
    setIsLoading(true);
    try {
      const newPlatform: PlatformConfig = {
        ...platformData,
        id: `platform_${Date.now()}`,
      };

      dispatch(addPlatform(newPlatform));
      // eslint-disable-next-line no-console
      console.log('새 플랫폼 추가:', newPlatform);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('플랫폼 추가 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePlatform = async (platformData: Omit<PlatformConfig, 'id'>): Promise<void> => {
    if (!editingPlatform) {return;}
    
    setIsLoading(true);
    try {
      const updatedPlatform: PlatformConfig = {
        ...platformData,
        id: editingPlatform.id,
      };

      dispatch(updatePlatform(updatedPlatform));
      // eslint-disable-next-line no-console
      console.log('플랫폼 수정:', updatedPlatform);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('플랫폼 수정 실패:', error);
    } finally {
      setIsLoading(false);
    }

    setEditingPlatform(null);
  };

  const handleTogglePlatform = async (platformId: string): Promise<void> => {
    setIsLoading(true);
    try {
      const platform = allPlatforms.find((p) => p.id === platformId);
      if (platform) {
        if (platform.isEnabled) {
          dispatch(disablePlatform(platformId));
        } else {
          dispatch(enablePlatform(platformId));
        }
        // eslint-disable-next-line no-console
        console.log('플랫폼 상태 토글:', platformId);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('플랫폼 상태 변경 실패:', error);
    } finally {
      setIsLoading(false);
      setOpenDropdownId(null);
    }
  };

  const handleDuplicatePlatform = async (platform: PlatformConfig): Promise<void> => {
    setIsLoading(true);
    try {
      const duplicatedPlatform: Omit<PlatformConfig, 'id'> = {
        ...platform,
        name: `${platform.name}_copy`,
        displayName: `${platform.displayName} 복사본`,
        isDefault: false, // 복사본은 기본값이 될 수 없음
        order: allPlatforms.length + 1, // 마지막 순서로 설정
      };

      await handleAddPlatform(duplicatedPlatform);
      // eslint-disable-next-line no-console
      console.log('플랫폼 복제:', duplicatedPlatform);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('플랫폼 복제 실패:', error);
    } finally {
      setIsLoading(false);
      setOpenDropdownId(null);
    }
  };

  // 드롭다운 메뉴 핸들러들
  const toggleDropdown = (platformId: string): void => {
    setOpenDropdownId(openDropdownId === platformId ? null : platformId);
  };

  const handleEditPlatform = (platform: PlatformConfig): void => {
    setEditingPlatform(platform);
    setShowPlatformAddModal(true);
    setOpenDropdownId(null);
  };

  const handleDeletePlatform = (platformId: string): void => {
    setDeletingPlatformId(platformId);
    setShowDeleteConfirm(true);
    setOpenDropdownId(null);
  };

  const handleConfirmDelete = async (): Promise<void> => {
    if (!deletingPlatformId) {return;}
    
    setIsLoading(true);
    try {
      dispatch(removePlatform(deletingPlatformId));
      // eslint-disable-next-line no-console
      console.log('플랫폼 삭제:', deletingPlatformId);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('플랫폼 삭제 실패:', error);
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
      setDeletingPlatformId(null);
    }
  };

  const handleCancelDelete = (): void => {
    setShowDeleteConfirm(false);
    setDeletingPlatformId(null);
  };

  const handleClosePlatformModal = (): void => {
    setShowPlatformAddModal(false);
    setEditingPlatform(null);
  };

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">플랫폼 관리</h1>
          <p className="mt-2 text-gray-600">
            애플리케이션에서 사용할 플랫폼을 관리합니다
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={(): void => setShowPlatformAddModal(true)}
            disabled={isLoading}
          >
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
      {selectedPlatforms.length > 0 && (
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
      )}

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
                onChange={(e): void => setPlatformSearchTerm(e.target.value)}
                className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={platformStatusFilter}
                onChange={(e): void => setPlatformStatusFilter(e.target.value)}
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
                      onClick={(): void =>
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
                  <th className="p-4 text-center text-sm font-medium">플랫폼</th>
                  <th className="p-4 text-center text-sm font-medium">상태</th>
                  <th className="p-4 text-center text-sm font-medium">순서</th>
                  <th className="p-4 text-center text-sm font-medium">기본값</th>
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
                        onClick={(): void => handlePlatformSelect(platform.id)}
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
                        <span className="font-mono text-sm">{platform.order}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center">
                        {platform.isDefault ? (
                          <Star className="h-4 w-4 text-yellow-500" />
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
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
                          ref={openDropdownId === platform.id ? dropdownRef : null}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(): void => toggleDropdown(platform.id)}
                            disabled={isLoading}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>

                          {/* 드롭다운 메뉴 */}
                          {openDropdownId === platform.id && (
                            <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-md border border-gray-200 bg-white shadow-lg">
                              <div className="py-1">
                                <button
                                  onClick={(): void => handleEditPlatform(platform)}
                                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  disabled={isLoading}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  수정
                                </button>
                                <button
                                  onClick={async (): Promise<void> => await handleDuplicatePlatform(platform)}
                                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  disabled={isLoading}
                                >
                                  <Copy className="mr-2 h-4 w-4" />
                                  복제
                                </button>
                                <div className="my-1 border-t border-gray-100"></div>
                                <button
                                  onClick={async (): Promise<void> => await handleTogglePlatform(platform.id)}
                                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  disabled={isLoading}
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
                                  onClick={(): void => handleDeletePlatform(platform.id)}
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

      {/* 플랫폼 추가/수정 모달 */}
      <PlatformAddModal
        isOpen={showPlatformAddModal}
        onClose={handleClosePlatformModal}
        onSubmit={editingPlatform ? handleUpdatePlatform : handleAddPlatform}
        editingPlatform={editingPlatform}
      />

      {/* 삭제 확인 다이얼로그 */}
      {showDeleteConfirm ? <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
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
                {deletingPlatformId ? allPlatforms.find((p) => p.id === deletingPlatformId)
                    ?.displayName : null}
              </span>
              과 관련된 모든 데이터가 함께 삭제됩니다.
            </p>

            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={handleCancelDelete}
                disabled={isLoading}
              >
                취소
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleConfirmDelete}
                disabled={isLoading}
              >
                삭제
              </Button>
            </div>
          </div>
        </div> : null}
    </div>
  );
}