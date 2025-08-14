import { useEffect } from 'react';

/**
 * 동적으로 document title을 설정하는 훅
 * CSR 환경에서 페이지별 타이틀을 관리합니다.
 */
export function useDocumentTitle(title?: string) {
  useEffect(() => {
    if (title) {
      document.title = `${title} - MyPick`;
    } else {
      document.title = 'MyPick - 크리에이터 통합 대시보드';
    }
  }, [title]);
}

/**
 * 메타데이터를 동적으로 설정하는 훅
 * description, keywords 등의 메타 태그를 업데이트합니다.
 */
export function useDocumentMeta(options: {
  title?: string;
  description?: string;
  keywords?: string[];
}) {
  useEffect(() => {
    const { title, description, keywords } = options;
    
    // Title 설정
    if (title) {
      document.title = `${title} - MyPick`;
    }
    
    // Description 메타 태그 설정
    if (description) {
      let descriptionMeta = document.querySelector('meta[name="description"]') as HTMLMetaElement;
      if (!descriptionMeta) {
        descriptionMeta = document.createElement('meta');
        descriptionMeta.name = 'description';
        document.head.appendChild(descriptionMeta);
      }
      descriptionMeta.content = description;
    }
    
    // Keywords 메타 태그 설정
    if (keywords && keywords.length > 0) {
      let keywordsMeta = document.querySelector('meta[name="keywords"]') as HTMLMetaElement;
      if (!keywordsMeta) {
        keywordsMeta = document.createElement('meta');
        keywordsMeta.name = 'keywords';
        document.head.appendChild(keywordsMeta);
      }
      keywordsMeta.content = keywords.join(', ');
    }
  }, [options.title, options.description, options.keywords]);
}

/**
 * 기본 앱 타이틀로 리셋하는 함수
 */
export function resetDocumentTitle() {
  document.title = 'MyPick - 크리에이터 통합 대시보드';
}