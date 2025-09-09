'use client';

import { useDocumentTitle } from '@/hooks/use-document-title';

export default function SettingsPage(): JSX.Element {
  useDocumentTitle('설정');
  return (
    <div className="p-6">
      <div className="w-full max-w-2xl mx-auto">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              설정
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              애플리케이션 설정을 관리하세요
            </p>
          </div>
          
          <div className="space-y-6">
        {/* 알림 설정 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            알림 설정
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  새 영상 알림
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  구독한 크리에이터가 새 영상을 업로드할 때 알림
                </div>
              </div>
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                defaultChecked
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  라이브 스트림 알림
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  구독한 크리에이터가 라이브 스트림을 시작할 때 알림
                </div>
              </div>
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                defaultChecked
              />
            </div>
          </div>
        </div>

        {/* 테마 설정 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            테마 설정
          </h2>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="theme"
                value="light"
                className="w-4 h-4 text-blue-600"
                defaultChecked
              />
              <span className="ml-2 text-gray-900 dark:text-white">라이트 모드</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="theme"
                value="dark"
                className="w-4 h-4 text-blue-600"
              />
              <span className="ml-2 text-gray-900 dark:text-white">다크 모드</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="theme"
                value="auto"
                className="w-4 h-4 text-blue-600"
              />
              <span className="ml-2 text-gray-900 dark:text-white">시스템 설정 따르기</span>
            </label>
          </div>
        </div>

            {/* 저장 버튼 */}
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
              설정 저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}