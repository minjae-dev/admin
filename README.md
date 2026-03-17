# Admin Dashboard (Next.js + Prisma + NextAuth)

간단한 관리자 회원 승인 대시보드입니다.

## 기술 스택

- Next.js (App Router)
- Tailwind CSS
- Prisma ORM
- SQLite (로컬 개발용)
- NextAuth (Credentials 로그인)

## 기능

- `/login` 로그인 페이지
  - 계정: `admin@test.com`
  - 비밀번호: `123456`
- 인증되지 않은 사용자는 `/login`으로 리다이렉트
- `/` 관리자 대시보드
  - 회원 목록 조회
  - 상태 필터 (Show All / Pending / Approved)
  - 대기 회원 승인 처리
  - 로그아웃 버튼
- API
  - `GET /api/users`
  - `PATCH /api/users/:id`

## 프로젝트 구조

```txt
app/
  api/
    auth/[...nextauth]/route.ts
    users/route.ts
    users/[id]/route.ts
  login/page.tsx
  page.tsx
  layout.tsx
  globals.css
components/
  auth/LoginForm.tsx
  dashboard/DashboardClient.tsx
lib/
  prisma.ts
prisma/
  schema.prisma
  seed.mjs
auth.ts
middleware.ts
```

## 실행 방법

1. 환경 변수 파일 생성

```bash
cp .env.example .env
```

2. 의존성 설치

```bash
npm install
```

3. Prisma Client 생성 및 DB 마이그레이션

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
```

4. 시드 데이터 입력

```bash
npm run prisma:seed
```

5. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속 후 로그인하세요.
