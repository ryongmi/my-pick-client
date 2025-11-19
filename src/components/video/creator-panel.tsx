'use client';

interface CreatorPanelProps {
  creatorId: string;
  currentVideoId?: string;
}

export function CreatorPanel({ creatorId }: CreatorPanelProps): JSX.Element {
  // 크리에이터 패널이 완전히 제거됨

  return (
    <div className="space-y-4">
      {/* 크리에이터 패널이 비어있으므로 null 반환 */}
    </div>
  );
}