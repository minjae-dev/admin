# Admin Dashboard

Next.js App Router 기반의 실제 동작하는 관리자 시스템입니다.

## 주요 기능

- NextAuth Credentials 로그인 (`admin@test.com` / `123456`)
- `/` 관리자 페이지 보호 (미로그인 시 `/login` 리다이렉트)
- Prisma + DB 기반 회원 조회/승인
- REST API
  - `GET /api/users`
  - `PATCH /api/users/[id]`
  - `POST /api/users` (옵션)
- 회원 승인 시 토스트 메시지: `회원 승인 완료`
- 로딩 상태 및 API 에러 처리

## 기술 스택

- Next.js (App Router)
- Tailwind CSS
- Prisma ORM
- SQLite (로컬 기본)
- NextAuth (Credentials Provider)

> 운영 환경에서는 `prisma/schema.prisma`의 datasource를 PostgreSQL로 변경해 사용할 수 있습니다.

## 실행 방법

```bash
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

## 로그인 정보

- email: `admin@test.com`
- password: `123456`
