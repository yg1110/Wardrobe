# Wardrobe

React + Vite + Tailwind CSS 프로젝트

## Supabase 설정

이 프로젝트는 Supabase를 사용하여 데이터를 저장합니다.

### 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에서 새 프로젝트를 생성합니다.
2. 프로젝트 설정 > API에서 다음 정보를 확인합니다:
   - Project URL
   - anon/public key

### 2. 데이터베이스 스키마 생성

`supabase-schema.sql` 파일의 내용을 Supabase 대시보드의 SQL Editor에서 실행하여 테이블을 생성합니다.

### 3. Storage 버킷 생성

1. Supabase 대시보드에서 Storage로 이동
2. "Create bucket" 클릭
3. 버킷 이름: `closet-images`
4. Public bucket: 활성화
5. 생성

### 4. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가합니다:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 설치

```bash
pnpm install
```

## 개발 서버 실행

```bash
pnpm dev
```

## 빌드

```bash
pnpm build
```

## 미리보기

```bash
pnpm preview
```

