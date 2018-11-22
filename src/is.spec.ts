import { is } from './index';
  

test('is.sync validate function get correct params', () => {
  
  let r = is.func((a, b) => {
    expect(a[b]).toBe(1);
    return true;
  })
  r.validate({a: 1}, 'a');
})

test('is.contains', () => { 
  is.after()
});
test('is.after', () => { });
