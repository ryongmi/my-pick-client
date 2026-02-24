'use client';

import React, { useState } from 'react';
import { Plus, Link as LinkIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  fetchMyPlatforms,
  addPlatform,
  updatePlatform,
  deletePlatform,
  openAddPlatformModal,
  closeAddPlatformModal,
  openEditPlatformModal,
  closeEditPlatformModal,
  selectMyPlatforms,
  selectIsLoadingPlatforms,
  selectIsAddPlatformModalOpen,
  selectIsEditPlatformModalOpen,
  selectEditingPlatform,
  selectIsLoading,
} from '@/store/slices/creatorDashboardSlice';
import type {
  CreatorPlatform,
  CreatePlatformRequest,
  UpdatePlatformRequest,
} from '@/types/creatorDashboard';
import { PlatformCard, AddPlatformModal, EditPlatformModal } from '@/components/creator-dashboard';

export function PlatformsSection() {
  const dispatch = useAppDispatch();

  const platforms = useAppSelector(selectMyPlatforms);
  const isLoadingPlatforms = useAppSelector(selectIsLoadingPlatforms);
  const isAddPlatformModalOpen = useAppSelector(selectIsAddPlatformModalOpen);
  const isEditPlatformModalOpen = useAppSelector(selectIsEditPlatformModalOpen);
  const editingPlatform = useAppSelector(selectEditingPlatform);
  const isLoading = useAppSelector(selectIsLoading);

  const [deletePlatformId, setDeletePlatformId] = useState<string | null>(null);

  // 플랫폼 관련 핸들러
  const handleAddPlatform = async (data: CreatePlatformRequest) => {
    try {
      await dispatch(addPlatform(data)).unwrap();
    } catch (error) {
      console.error('Failed to add platform:', error);
    }
  };

  const handleEditPlatform = (platform: CreatorPlatform) => {
    dispatch(openEditPlatformModal(platform));
  };

  const handleUpdatePlatform = async (platformId: string, data: UpdatePlatformRequest) => {
    try {
      await dispatch(updatePlatform({ platformId, data })).unwrap();
    } catch (error) {
      console.error('Failed to update platform:', error);
    }
  };

  const handleDeletePlatform = (platformId: string) => {
    setDeletePlatformId(platformId);
  };

  const confirmDeletePlatform = async () => {
    if (!deletePlatformId) return;

    try {
      await dispatch(deletePlatform(deletePlatformId)).unwrap();
      setDeletePlatformId(null);
    } catch (error) {
      console.error('Failed to delete platform:', error);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>연동된 플랫폼</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                콘텐츠를 동기화할 플랫폼을 관리하세요
              </p>
            </div>
            <Button onClick={() => dispatch(openAddPlatformModal())}>
              <Plus className="mr-2 h-4 w-4" />
              플랫폼 추가
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingPlatforms ? (
            <div className="py-8 text-center">
              <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground">로딩 중...</p>
            </div>
          ) : platforms.length === 0 ? (
            <div className="py-12 text-center">
              <LinkIcon className="mx-auto mb-3 h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground mb-4">연동된 플랫폼이 없습니다.</p>
              <Button variant="outline" onClick={() => dispatch(openAddPlatformModal())}>
                <Plus className="mr-2 h-4 w-4" />
                첫 플랫폼 추가하기
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {platforms.map((platform) => (
                <PlatformCard
                  key={platform.id}
                  platform={platform}
                  onEdit={handleEditPlatform}
                  onDelete={handleDeletePlatform}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 플랫폼 삭제 확인 모달 */}
      {deletePlatformId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>플랫폼 삭제</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">
                정말 이 플랫폼을 삭제하시겠습니까? 플랫폼이 비활성화되며, 연동된 콘텐츠 동기화가 중단됩니다.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDeletePlatformId(null)}>
                  취소
                </Button>
                <Button variant="destructive" onClick={confirmDeletePlatform}>
                  삭제
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 플랫폼 추가 모달 */}
      <AddPlatformModal
        isOpen={isAddPlatformModalOpen}
        onClose={() => dispatch(closeAddPlatformModal())}
        onSubmit={handleAddPlatform}
        isLoading={isLoading}
      />

      {/* 플랫폼 수정 모달 */}
      <EditPlatformModal
        isOpen={isEditPlatformModalOpen}
        platform={editingPlatform}
        onClose={() => dispatch(closeEditPlatformModal())}
        onSubmit={handleUpdatePlatform}
        isLoading={isLoading}
      />
    </>
  );
}
