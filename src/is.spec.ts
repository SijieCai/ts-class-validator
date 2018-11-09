import { is, Rule } from './index';

test('is.async will have rule isAsync', () => {
  expect(is.sync(() => false).isAsync).toBe(false);
  expect(is.async(() => false).isAsync).toBe(true);
});

test('is.ruleCreators', () => {
  expect(is.async(() => false) instanceof (Rule)).toBe(true);
  expect(is.sync(() => false) instanceof (Rule)).toBe(true);
});

test('is.sync validate function get correct params', () => {
  is.sync((a, b) => {
    expect(a).toBe(1);
    expect(b).toBe(2);
    return true;
  }).validate(1, 2);
})

