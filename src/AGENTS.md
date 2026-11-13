# Module Context

React UI는 생성 요청과 결과 목록을 관리하고 react-live로 생성 코드를 실행한다. 서버 응답과 브라우저 실행 코드의 계약을 유지한다.

# Tech Stack & Constraints

React 19, TypeScript, react-live 4를 사용한다 (`../package.json:15-18`). 미리보기는 `noInline` 모드이므로 생성 코드에 `render(...)` 호출이 필요하다 (`components/LivePreview.tsx:14`, `../server/generator.ts:12-21`).

# Implementation Patterns

- 생성 요청·결과·오류·로딩 상태는 `useComponentGenerator`에서 관리한다. 요청은 상대 경로 `/api/generate`를 사용하고 응답 오류를 확인한 뒤 목록에 추가한다 (`hooks/useComponentGenerator.ts:18-48`).
- 공통 API 타입은 `types`를 참조하고, 프로바이더 변경은 UI 설정과 서버 분기까지 함께 확인한다 (`App.tsx:5-11`, `../server/index.ts:57-65`, `../server/index.ts:183-186`).

# Testing Strategy

앱 루트에서 `bun run test -- src/components/PromptInput.test.tsx`를 실행한다. 입력 상호작용은 Testing Library와 `userEvent` 패턴을 따른다 (`components/PromptInput.test.tsx:1-4`, `components/PromptInput.test.tsx:12-27`). 기존 입력 테스트는 훅의 네트워크 처리나 react-live 실행을 검증하지 않으므로 해당 영역 변경 시 별도로 확인한다.

# Local Golden Rules

- 입력 제출 핸들러의 공백·로딩 검증과 버튼 비활성화를 함께 유지한다. 키보드 제출도 같은 핸들러를 사용한다 (`components/PromptInput.tsx:20-24`, `components/PromptInput.tsx:44-53`).
- 프로바이더 변경 시 입력한 API 키를 초기화한다. 다른 프로바이더에 이전 키가 전달되지 않게 한다 (`App.tsx:41-44`).
- 키가 없을 때의 UI 검증은 서버 검증을 대체하지 않는다. 서버 키는 `/api/config`의 존재 여부만 사용하고 실제 값을 요청하지 않는다 (`App.tsx:24-38`, `../server/index.ts:147-172`).
- 미리보기의 `noInline` 계약을 바꾸면 서버 출력 정규화도 함께 검토한다. 현재 실행은 브라우저의 react-live이며 보안 격리 샌드박스라고 설명하지 않는다 (`components/LivePreview.tsx:14-18`).
