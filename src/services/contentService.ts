import { mypickApi } from '@/lib/httpClient';
import type { PaginatedResponse } from '@/types';
import { BaseService } from './base';

/**
 * 콘텐츠 관리 Service
 *
 * 콘텐츠 조회, 북마크, 좋아요, 검색 등을 담당
 */
export class ContentService extends BaseService {
  /**
   * 콘텐츠 목록 조회 (페이지네이션)
   */
  async getContent(params?: Record<string, unknown>): Promise<PaginatedResponse<unknown>> {
    try {
      const response = await mypickApi.get<PaginatedResponse<unknown>>('/content', {
        params,
      });

      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 콘텐츠 상세 조회
   */
  async getContentById(id: string): Promise<unknown> {
    try {
      const response = await mypickApi.get<unknown>(`/content/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 북마크 추가
   */
  async bookmarkContent(id: string): Promise<void> {
    try {
      await mypickApi.post(`/content/${id}/bookmark`);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 북마크 제거
   */
  async removeBookmark(id: string): Promise<void> {
    try {
      await mypickApi.delete(`/content/${id}/bookmark`);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 좋아요 추가
   */
  async likeContent(id: string): Promise<void> {
    try {
      await mypickApi.post(`/content/${id}/like`);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 좋아요 취소
   */
  async unlikeContent(id: string): Promise<void> {
    try {
      await mypickApi.delete(`/content/${id}/like`);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 북마크 목록 조회
   */
  async getBookmarks(page = 1, limit = 20): Promise<PaginatedResponse<unknown>> {
    try {
      const response = await mypickApi.get<PaginatedResponse<unknown>>(
        '/content/bookmarks',
        {
          params: { page, limit },
        }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 콘텐츠 검색
   */
  async searchContent(
    query: string,
    filters?: Record<string, unknown>
  ): Promise<PaginatedResponse<unknown>> {
    try {
      const response = await mypickApi.get<PaginatedResponse<unknown>>(
        '/content/search',
        {
          params: { q: query, ...filters },
        }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 북마크 토글 (편의 메서드)
   */
  async toggleBookmark(id: string, isCurrentlyBookmarked: boolean): Promise<void> {
    if (isCurrentlyBookmarked) {
      await this.removeBookmark(id);
    } else {
      await this.bookmarkContent(id);
    }
  }

  /**
   * 좋아요 토글 (편의 메서드)
   */
  async toggleLike(id: string, isCurrentlyLiked: boolean): Promise<void> {
    if (isCurrentlyLiked) {
      await this.unlikeContent(id);
    } else {
      await this.likeContent(id);
    }
  }
}

// 싱글톤 인스턴스
export const contentService = new ContentService();
