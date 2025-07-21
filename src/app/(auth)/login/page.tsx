'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppDispatch } from '@/hooks/redux';
import { useAuth } from '@/hooks/redux';
import { loginUser } from '@/store/slices/authSlice';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: 'user@example.com', // 테스트용 기본값
    password: 'password123',
    rememberMe: false,
  });
  
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await dispatch(loginUser(formData)).unwrap();
      router.push('/'); // 로그인 성공 시 홈으로 이동
    } catch (error) {
      console.error('로그인 실패:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg mx-auto mb-4" />
          <CardTitle className="text-2xl font-bold">MyPick</CardTitle>
          <CardDescription>크리에이터 통합 대시보드에 로그인하세요</CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                이메일
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="이메일을 입력하세요"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                비밀번호
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="비밀번호를 입력하세요"
                required
              />
            </div>
            
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="rounded border-gray-300"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">
                로그인 상태 유지
              </label>
            </div>
            
            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
                {error}
              </div>
            )}
            
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </Button>
          </form>
          
          <div className="mt-6 pt-6 border-t">
            <div className="text-sm text-gray-600 space-y-3">
              <p className="font-medium">테스트 계정:</p>
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setFormData({ email: 'user@example.com', password: 'password123', rememberMe: false })}
                >
                  일반 사용자로 로그인
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
                  onClick={() => setFormData({ email: 'admin@example.com', password: 'password123', rememberMe: false })}
                >
                  관리자로 로그인
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full text-purple-600 border-purple-200 hover:bg-purple-50"
                  onClick={() => setFormData({ email: 'premium@example.com', password: 'password123', rememberMe: false })}
                >
                  프리미엄로 로그인
                </Button>
                <div className="border-t pt-2 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => {
                      localStorage.clear();
                      sessionStorage.clear();
                      window.location.reload();
                    }}
                  >
                    화면 초기화 (스토리지 클리어)
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
  );
}
