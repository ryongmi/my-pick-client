import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MyPick 크리에이터',
  description: '구독한 크리에이터 관리',
};

export default function CreatorsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          크리에이터 관리
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          구독한 크리에이터를 관리하고 새로운 크리에이터를 추가하세요
        </p>
      </div>
      
      <div className="grid gap-6">
        {/* 크리에이터 검색 및 추가 섹션 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            새 크리에이터 추가
          </h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="유튜브 채널 URL 또는 채널명 검색..."
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              검색
            </button>
          </div>
        </div>

        {/* 구독 중인 크리에이터 목록 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            구독 중인 크리에이터
          </h2>
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            아직 구독한 크리에이터가 없습니다.
            <br />
            위에서 새로운 크리에이터를 검색해보세요!
          </div>
        </div>
      </div>
    </div>
  );
}