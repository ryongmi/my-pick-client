# 프로덕션 빌드 스테이지
FROM node:18-alpine AS builder

WORKDIR /app

# 의존성 파일 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci --only=production && npm cache clean --force

# 소스 코드 복사
COPY . .

# 환경 변수 설정 (빌드 시)
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Next.js 빌드
RUN npm run build

# 런타임 스테이지
FROM node:18-alpine AS runner

WORKDIR /app

# 보안을 위한 사용자 생성
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 필요한 파일들만 복사
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# 파일 권한 설정
RUN chown -R nextjs:nodejs /app
USER nextjs

# 포트 노출
EXPOSE 3000

# 환경 변수 설정
ENV PORT=3000
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 헬스체크
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# 애플리케이션 실행
CMD ["node", "server.js"]
