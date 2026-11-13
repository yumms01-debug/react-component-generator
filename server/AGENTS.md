# Module Context

Bun HTTP 서버가 프로바이더 API 호출과 생성 코드 정규화를 담당한다. 순수 로직은 서버를 시작하지 않고 테스트할 수 있도록 분리되어 있다.

# Tech Stack & Constraints

- Bun 런타임과 내장 `fetch`를 사용한다 (`index.ts:69`, `index.ts:101`, `index.ts:138`).
- 출력은 react-live용 JavaScript/JSX 문자열이다. 앱 서버의 TypeScript 문법을 생성 코드에 섞지 않는다 (`index.ts:10-20`).

# Implementation Patterns

- HTTP 처리는 `index.ts`, 부수효과 없는 변환은 `generator.ts`, 모델 순차 실행은 `fallback.ts` 패턴을 따른다.
- 성공 응답의 `{ code }`와 실패 응답의 `{ error }` 계약을 클라이언트와 함께 유지한다 (`index.ts:188-210`, `../src/hooks/useComponentGenerator.ts:29-38`).

# Testing Strategy

앱 루트에서 `bun run test -- server/generator.test.ts server/fallback.test.ts`를 실행한다. 순수 함수 테스트는 서버 엔트리포인트를 import하지 않는다. 엔트리포인트는 import 시 포트를 열며, 기존 테스트는 순수 모듈을 직접 import한다 (`index.ts:138`, `generator.test.ts:2`, `fallback.test.ts:2`). 이 단위 테스트 통과를 실제 프로바이더 통합 검증으로 보고하지 않는다.

# Local Golden Rules

- Google 모델 목록은 우선순위 순서다. 첫 성공 시 중단하고 모두 실패하면 마지막 오류를 전달하는 동작을 유지한다. Anthropic에는 같은 폴백이 없으므로 공통화 시 차이를 보존한다 (`index.ts:5`, `index.ts:68-95`, `index.ts:134-135`, `fallback.ts:7-19`, `fallback.test.ts:5-40`).
- Google의 `MAX_TOKENS` 응답은 잘린 코드를 성공으로 반환하지 않고 오류로 처리한다 (`index.ts:122-125`).
- 프롬프트의 `render(...)` 요구와 서버의 `ensureRenderCall(stripCodeFences(text))` 정규화는 서로 보완한다. 어느 한쪽을 중복으로 간주해 제거하지 않는다 (`index.ts:12`, `index.ts:188`, `generator.ts:5-23`, `generator.test.ts:4-38`).
- 키 해석은 클라이언트 입력 우선, 서버 환경변수 차선이다. 서버 검증을 UI 검증으로 대체하지 않는다 (`index.ts:64-65`, `index.ts:167-180`, `../src/App.tsx:33-38`).
