# Inventory Management System

Next.js 기반의 모던 스택으로 구축한 재고관리(Inventory) 시스템입니다.  
상품 CRUD, 재고 변동 관리, 페이지네이션, 폼 검증, 캐싱, 글로벌 상태관리 등 실무에 필요한 기능들을 포함하고 있습니다.

Tech Stack

Frontend

- Next.js 16 (App Router)
- React Hooks
- React Query – 서버 상태 fetching & 캐싱
- React Hook Form – 고성능 폼 관리 및 검증
- Zustand – 전역 UI/Client 상태관리
- TailwindCSS
- TypeScript

Backend

- Neon DB – Serverless PostgreSQL
- Prisma ORM – 타입 안정성 + 스키마 관리
- StackFrame Auth – Edge 기반 인증 서비스 사용

---

주요 기능 (Features)

1. 재고 / 상품 관리

- 상품 목록 조회
- 상세 정보 보기
- 상품 생성 / 수정 / 삭제 (CRUD)
- 재고 수량 변경 기능

2. React Query 기반 서버 데이터 최적화

- 자동 캐싱
- 리페치 제어
- Optimistic Update 가능 구조
- Pagination 안정적 로딩

3. React Hook Form 기반 고성능 폼 검증

- Yup/Zod 기반 validation
- 불필요한 리렌더 최소화

4. Zustand로 클라이언트 상태 제어

- 모달 상태 관리
- UI 상태 (페이지, 정렬, 필터 등)
- stable wrapper function 제공 구조

5. Prisma + Neon을 통한 안정적인 데이터 구조

- Prisma Schema 기반 타입 안정성
- Neon serverless DB로 빠른 응답 속도
- Migration 기반 버전 관리

6. Next.js App Router 구조

- Route Handlers 기반 API 서버
- 서버/클라이언트 컴포넌트 분리
- Layout/Segment 구조 최적화

---

프로젝트 구조

app/
├─ (main)/ # 메인 라우트 그룹
│ ├─ add-product/ # 상품 추가 페이지
│ │ ├─ api/ # Add Product API (route handlers)
│ │ ├─ AddProductClient.tsx # 클라이언트 컴포넌트
│ │ ├─ loading.tsx # 로딩 UI
│ │ └─ page.tsx # 페이지 엔트리
│ │
│ ├─ dashboard/ # 대시보드 페이지
│ │ └─ page.tsx
│ │
│ ├─ handler/ # StackFrame Auth 핸들러
│ │ └─ [...stackframe].ts # 인증 관련 route handler
│ │
│ ├─ inventory/ # 재고 목록 페이지
│ │ ├─ \_components/ # 재고 페이지 전용 컴포넌트
│ │ │ ├─ TableRow.tsx
│ │ │ ├─ UpdateProductModal.tsx
│ │ │ └─ ...
│ │ ├─ api/ # Inventory API (CRUD)
│ │ │ └─ route.ts
│ │ ├─ InventoryClient.tsx # 메인 클라이언트 컴포넌트
│ │ ├─ loading.tsx
│ │ └─ page.tsx
│ │
│ ├─ settings/ # 사용자 설정/환경설정 페이지
│ │ └─ page.tsx
│ │
│ ├─ layout.tsx # (main) 전용 레이아웃
│ ├─ page.tsx # 메인 홈 페이지
│ ├─ loading.tsx # (main) 전역 로딩
│ └─ providers.tsx # React Query / Zustand Providers
│
├─ sign-in/ # 로그인 페이지
│ └─ page.tsx
│
├─ favicon.ico
├─ globals.css # 전역 스타일
├─ layout.tsx # 앱 루트 레이아웃
├─ loading.tsx # 루트 로딩 UI
├─ page.tsx # 루트 엔트리 페이지
│
components/ # 전역 UI 컴포넌트
lib/
├─ prisma.ts # Prisma Client
└─ utils/ # 공통 함수
prisma/
└─ migrations/ # 마이그레이션 파일
stack/ # StackFrame Auth 설정
store/ # Zustand 전역 상태관리
