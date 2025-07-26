'use client';

import { useState, useEffect } from 'react';
import {
  X,
  User,
  Mail,
  Save,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  updateUser,
} from '@/store/slices/userManagementSlice';
import { cn } from '@/lib/utils';
import { MyPickUser } from '@/types/userManagement';

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: MyPickUser | null;
}

export function UserEditModal({ isOpen, onClose, user }: UserEditModalProps) {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.userManagement);

  const [formData, setFormData] = useState<Partial<MyPickUser>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  // 폼 데이터 초기화
  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        name: user.name,
        email: user.email,
        userType: user.userType,
        serviceStatus: user.serviceStatus,
      });
      setFormErrors({});
    }
  }, [user, isOpen]);

  if (!isOpen || !user) {return null;}

  // 폼 검증
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      errors.name = '이름을 입력해주세요.';
    }

    if (!formData.email?.trim()) {
      errors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = '올바른 이메일 형식을 입력해주세요.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 저장 처리
  const handleSave = async () => {
    if (!validateForm()) {return;}

    setIsSaving(true);
    try {
      await dispatch(updateUser({
        userId: user.id,
        updates: {
          name: formData.name,
          email: formData.email,
          userType: formData.userType,
          serviceStatus: formData.serviceStatus,
        },
      })).unwrap();

      onClose();
    } catch (error) {
      console.error('사용자 정보 업데이트 실패:', error);
      // TODO: 에러 토스트 표시
    } finally {
      setIsSaving(false);
    }
  };

  // 취소 처리
  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        userType: user.userType,
        serviceStatus: user.serviceStatus,
      });
    }
    setFormErrors({});
    onClose();
  };

  // 폼 필드 변경 처리
  const handleFieldChange = (field: keyof MyPickUser, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 해당 필드의 에러 클리어
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">사용자 정보 수정</h2>
            <p className="text-sm text-muted-foreground">
              {user.name} ({user.email})
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* 폼 내용 */}
        <div className="p-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5" />
                기본 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 이름 */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  이름 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  className={cn(
                    'w-full rounded-md border px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500',
                    formErrors.name ? 'border-red-300' : 'border-gray-300'
                  )}
                  placeholder="사용자 이름을 입력하세요"
                />
                {formErrors.name ? <p className="mt-1 text-sm text-red-600">{formErrors.name}</p> : null}
              </div>

              {/* 이메일 */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  이메일 <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  className={cn(
                    'w-full rounded-md border px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500',
                    formErrors.email ? 'border-red-300' : 'border-gray-300'
                  )}
                  placeholder="이메일을 입력하세요"
                />
                {formErrors.email ? <p className="mt-1 text-sm text-red-600">{formErrors.email}</p> : null}
              </div>

              {/* 사용자 타입 */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  사용자 타입
                </label>
                <select
                  value={formData.userType || 'user'}
                  onChange={(e) => handleFieldChange('userType', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">일반 사용자</option>
                  <option value="creator">크리에이터</option>
                </select>
              </div>

              {/* 서비스 상태 */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  서비스 상태
                </label>
                <select
                  value={formData.serviceStatus || 'active'}
                  onChange={(e) => handleFieldChange('serviceStatus', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">활성</option>
                  <option value="inactive">비활성</option>
                  <option value="suspended">정지</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* 경고 메시지 */}
          <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-yellow-800">주의사항</p>
              <p className="text-yellow-700">
                사용자 타입을 변경하면 해당 사용자의 권한과 접근 가능한 기능이 변경됩니다.
              </p>
            </div>
          </div>
        </div>

        {/* 하단 액션 버튼 */}
        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            disabled={isSaving}
          >
            취소
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSaving || Object.keys(formErrors).length > 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                저장 중...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                저장
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}