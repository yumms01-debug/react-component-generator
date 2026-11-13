import { describe, it, expect } from 'vitest';
import { isPromptLengthValid } from './validatePromptLength';

describe('isPromptLengthValid', () => {
  it.each([0, 499, 500])('%i자는 길이 제한 이내다', (length) => {
    expect(isPromptLengthValid('가'.repeat(length))).toBe(true);
  });

  it('501자는 길이 제한을 초과한다', () => {
    expect(isPromptLengthValid('가'.repeat(501))).toBe(false);
  });

  it('공백도 입력 길이에 포함한다', () => {
    expect(isPromptLengthValid(' ' + '가'.repeat(500))).toBe(false);
  });
});
