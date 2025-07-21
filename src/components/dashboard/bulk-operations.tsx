'use client';

import { useState } from 'react';
import { 
  CheckSquare, Square, ChevronDown, Trash2, 
  CheckCircle, XCircle, Users, Download, 
  AlertTriangle, RefreshCw 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BulkOperationsProps {
  selectedCreators: string[];
  totalCreators: number;
  onSelectAll: () => void;
  onSelectNone: () => void;
  onBulkAction: (action: BulkAction, creatorIds: string[]) => void;
  className?: string;
}

export type BulkAction = 
  | 'activate' 
  | 'deactivate' 
  | 'delete' 
  | 'export' 
  | 'refresh';

interface BulkActionOption {
  action: BulkAction;
  label: string;
  icon: any;
  color: string;
  bgColor: string;
  hoverColor: string;
  confirmRequired?: boolean;
  dangerLevel?: 'low' | 'medium' | 'high';
}

const BULK_ACTIONS: BulkActionOption[] = [
  {
    action: 'activate',
    label: '활성화',
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    hoverColor: 'hover:bg-green-100',
    dangerLevel: 'low',
  },
  {
    action: 'deactivate',
    label: '비활성화',
    icon: XCircle,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    hoverColor: 'hover:bg-yellow-100',
    confirmRequired: true,
    dangerLevel: 'medium',
  },
  {
    action: 'refresh',
    label: '데이터 새로고침',
    icon: RefreshCw,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    hoverColor: 'hover:bg-blue-100',
    dangerLevel: 'low',
  },
  {
    action: 'export',
    label: '내보내기',
    icon: Download,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    hoverColor: 'hover:bg-purple-100',
    dangerLevel: 'low',
  },
  {
    action: 'delete',
    label: '삭제',
    icon: Trash2,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    hoverColor: 'hover:bg-red-100',
    confirmRequired: true,
    dangerLevel: 'high',
  },
];

export function BulkOperations({ 
  selectedCreators, 
  totalCreators, 
  onSelectAll, 
  onSelectNone, 
  onBulkAction,
  className 
}: BulkOperationsProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<BulkActionOption | null>(null);

  const isAllSelected = selectedCreators.length === totalCreators && totalCreators > 0;
  const isPartialSelected = selectedCreators.length > 0 && selectedCreators.length < totalCreators;
  const hasSelection = selectedCreators.length > 0;

  const handleSelectToggle = () => {
    if (isAllSelected) {
      onSelectNone();
    } else {
      onSelectAll();
    }
  };

  const handleBulkAction = (actionOption: BulkActionOption) => {
    if (actionOption.confirmRequired) {
      setConfirmAction(actionOption);
    } else {
      onBulkAction(actionOption.action, selectedCreators);
    }
    setDropdownOpen(false);
  };

  const handleConfirm = () => {
    if (confirmAction) {
      onBulkAction(confirmAction.action, selectedCreators);
      setConfirmAction(null);
    }
  };

  const getSelectionIcon = () => {
    if (isAllSelected) {
      return CheckSquare;
    } else if (isPartialSelected) {
      return CheckSquare;
    } else {
      return Square;
    }
  };

  const SelectionIcon = getSelectionIcon();

  return (
    <>
      <div className={cn("flex items-center gap-4", className)}>
        {/* 전체 선택 체크박스 */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSelectToggle}
            className="p-1 h-auto"
          >
            <SelectionIcon 
              className={cn(
                "h-5 w-5",
                isAllSelected ? "text-blue-600" : 
                isPartialSelected ? "text-blue-500" : "text-gray-400"
              )} 
            />
          </Button>
          <span className="text-sm text-gray-600">
            {selectedCreators.length > 0 
              ? `${selectedCreators.length}개 선택됨`
              : '전체 선택'
            }
          </span>
        </div>

        {/* 일괄 작업 드롭다운 */}
        {hasSelection && (
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              일괄 작업
              <ChevronDown className="h-4 w-4" />
            </Button>

            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <div className="py-1">
                  <div className="px-3 py-2 text-xs text-gray-500 font-medium border-b">
                    {selectedCreators.length}개 크리에이터 대상
                  </div>
                  {BULK_ACTIONS.map((actionOption) => {
                    const Icon = actionOption.icon;
                    return (
                      <button
                        key={actionOption.action}
                        onClick={() => handleBulkAction(actionOption)}
                        className={cn(
                          "w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-colors",
                          actionOption.hoverColor,
                          actionOption.dangerLevel === 'high' && "text-red-600"
                        )}
                      >
                        <Icon className={cn("h-4 w-4", actionOption.color)} />
                        {actionOption.label}
                        {actionOption.confirmRequired && (
                          <AlertTriangle className="h-3 w-3 text-yellow-500 ml-auto" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 선택 해제 버튼 */}
        {hasSelection && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onSelectNone}
            className="text-gray-500 hover:text-gray-700"
          >
            선택 해제
          </Button>
        )}
      </div>

      {/* 드롭다운 외부 클릭 시 닫기 */}
      {dropdownOpen && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setDropdownOpen(false)}
        />
      )}

      {/* 확인 모달 */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                confirmAction.bgColor
              )}>
                <confirmAction.icon className={cn("h-5 w-5", confirmAction.color)} />
              </div>
              <div>
                <h3 className="text-lg font-medium">
                  {confirmAction.label} 확인
                </h3>
                <p className="text-sm text-gray-500">
                  선택된 {selectedCreators.length}개 크리에이터
                </p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600">
                {confirmAction.action === 'delete' && (
                  <>
                    <span className="font-medium text-red-600">주의:</span> 이 작업은 되돌릴 수 없습니다. 
                    선택된 크리에이터들이 완전히 삭제됩니다.
                  </>
                )}
                {confirmAction.action === 'deactivate' && (
                  '선택된 크리에이터들이 비활성화됩니다. 사용자들에게 더 이상 표시되지 않습니다.'
                )}
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setConfirmAction(null)}
              >
                취소
              </Button>
              <Button
                variant={confirmAction.dangerLevel === 'high' ? 'destructive' : 'default'}
                onClick={handleConfirm}
              >
                {confirmAction.label}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}