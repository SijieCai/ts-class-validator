# ts-class-validator
支持嵌套逻辑操作符的声明式TypeScript验证器

## 安装

```
npm install ts-class-validator --save
```

## 使用

``` typescript
import { validate, is, not, and, or, each, isClass, validateGet, mixins } from 'ts-class-validator';

```

### 基本类型验证

每个validate默认不是必须的，除非你将`is.required()`放在顶部，否则`null` 和 `undefined`总是会通过验证

``` typescript 
class PrimitiveClass {
  @validate(
    is.length(4, 10),
    is.contains('111')
  )
  name: string;

  @validate(
    is.required(),
    is.int({min: 1})
  )
  age: number;
}

isClass(PrimitiveClass, { name: '111abced', age: 5 }) // true
isClass(PrimitiveClass, { name: '360', age: 5 }) // 'error message here'

validateGet(PrimitiveClass, { name: '111abced', age: '5' }) 
// { instance: PrimitiveClass { name: '111abced', age: 5 } }
validateGet(PrimitiveClass, { name: '360', age: 5 }) 
// { message: 'error message here' }
 
```



### 数组验证

使用 `each` 验证数组，你也可以嵌套 `each` 来验证二维数组。

``` typescript 
class ArrayClass {
  @validate(
    is.required(),
    each(
      is.required(),
      is.int()
    )
  )
  value: number[];

  @validate(
    each(
      each(
        is.int();
      )
    )
  )
  value2: number[][];
}

validateGet(ArrayClass, {value: [1,2,3]})  // { instance: ArrayClass { value: [1,2,3] } }

validateGet(ArrayClass, {value: [1,2,null]}) // { message: 'error message here' }

validateGet(ArrayClass, {value: '1,2,3,4'})
// { instance: ArrayClass {value: [1,2,3,4] } }

validateGet(ArrayClass, {value: '1,2,3,4'}, {parseArray: false}) 
// { instance: ArrayClass {value: '1,2,3,4'} }

validateGet(ArrayClass, {value: '1,2,3,4'}, {parseNumber: false}) 
// { instance: ArrayClass {value: ['1','2','3','4']} }

validateGet(ArrayClass, {value: '1,2', value2: [[1, 2],[3, '4']]})
// { instance: ArrayClass {value: ['1','2'], value2: [[1,2], [3,4]]} }

```

### 嵌套class验证

``` typescript 

class NestedClass {
  @validate(is.class(IdClass))
  id: IdClass;
}

class DeeplyNestedClass {
  @validate(is.class(NestedClass))
  value: NestedClass;
}

```

### 逻辑操作符

你可以使用 `and`, `or` 逻辑操作符，他们也可以在嵌套中使用。
所有验证规则都可以指定 `onlyIf` 来选择开启或关闭这个验证。

``` typescript
class AndOrClass {
  @validate(or(
    is.in([1, 2, 3]),
    and(
      is.in([4, 5, 6]),
      is.divisibleBy(2)
    )
  ))
  value: number;
}

class OnlyIfClass {
  @validate(
    is.in([1, 2, 3]).onlyIf(
      (target: object, key: string) => target['value2'] !== undefined
    )
  )
  status: number;
  @validate(is.int())
  value2: number;
}
```

### 自定义错误信息
``` typescript
class CustomizeMessageClass {
  @validate(
    is.required().message('field is required!!'),
    is.equals('some value').message('field must equals to some value!!'),
    or(
      is.in([1, 2]),
      is.equals(3)
    ).message('field must be 1,2 or 3, just kidding LOL.')
  )
  field: string;
}
```

### 继承验证类

``` typescript 

class IdClass {
  @validate(is.required(), is.int())
  id: number;

  getId() {return 'prefix-' + this.id ; }
}
 
class ExtendClass extends IdClass {
  name: string; 
}

let instance = validateGet(MixinClass, {id: 1, name: 'name'}).instance;
console.log(instance.getId()); // 'prefix-1'

```


### 混合验证类

``` typescript 

class IdClass {
  @validate(is.required(), is.int())
  id: number;

  getId() {return 'prefix-' + this.id ; }
}

class NameClass {
  @validate(is.required(), is.length(3,10))
  name: string;

  @validate() // validate without rules is used to whitelisting a field for validateGet
  whitelist: any
}

@mixins(IdClass, NameClass)
class MixinClass implements IdClass, NameClass {
  name: string;
  id: number[];
  getId: ()=>string
}

let instance = validateGet(MixinClass, {id: 1, name: 'name'}).instance;
console.log(instance.getId()); // 'prefix-1'


```

### 验证规则

`is` 和 `not` 是内建的规则生成器生成的，它们支持所有 [validator.js](https://github.com/chriso/validator.js)
的静态方法（除 sanitizer），此外我们增加了以下方法：
- func(customValidator: (target: any, key: string) => boolean | string): 定义一个自定义验证器逻辑，你可以在这里写任何东西。
- class(TClass: new () => any, fieldsPattern?: string): 和isClass类似, 定义一个嵌套的class类型。
- required(): 所有其它验证都通过时，value为 `null` 或者 `undefined` 不能通过验证.
- tripleEquals(value: any): 比较 target === value
- doubleEquals(value: any): 比较 target == value

### 创建你自己的规则生成器

你可以定义你自己的规则生成器返回一个规则，它能够被组合（compose）和重用（reused），例如，你想要在JSON解析时验证一些字段，你可以这样做：

``` typescript

class Person {/* .... */}

class SomeClass {
  @validate(
    jsonParse(
      is.class(Person)
    ).message('person is not a valid JSON')
  )
  person: Person;
}

validateGet(SomeClass, {person: '{"person":{"name":"","age":40}}'}, {parseJSON: true})
// SomeClass { person: Person {name: '', age: 40} }

```

实现 jsonParse ：

``` typescript
import { Rule, and } from 'ts-class-validation';
function jsonParse(...rules: Rule[]) {
  return new Rule(
    function validate(target: object, key: string) {
      let value = target[key];

      try { value = JSON.parse(value); }
      catch (e) { return false; }

      target = Object.assign({}, target, { [key]: value });

      return and(...rules).validate(target, key);
    },
    function validateGetParser(value, options) {
      if (options.parseJSON) { // parseJSON passed in by validateGet(a, b, options)
        return JSON.parse(value);
      }
      return value;
    }
  ).message(
    (target, key) => `target.${key} is not a validate json`
  );
}
```

### validateGet 选项
`validateGet` 接收三个可选参数

``` typescript

interface ValidateGetOptions {
  filterUnvalidateFields?: boolean; // default true
  parseNumber?: boolean;      // default true
  parseArray?: boolean;       // default true
  [name: string]: any         // for user defined rule 
}

```
## 本地化

每个失败的验证将显示一条内置的错误信息，你可以用 `.message()` 方法重写每个规则的错误信息，或者你可以重写默认错误信息。

``` typescript
import { setErrorMessage } from 'ts-class-validator';
setErrorMessage({
  contains: {
    is: (target: object, key: string, ...rest: any[]) => `customized: ${target[key]} contains ${rest.join(', ')}`,
    not: (target: object, key: string, ...rest: any[]) => `customized: ${target[key]} not contains ${rest.join(', ')}`
  },
  after: {
    is: (target: object, key: string, ...rest: any[]) => `customized: ${target[key]} date is after date ${rest.join(', ')}`,
    not: (target: object, key: string, ...rest: any[]) => `customized: ${target[key]} date is not after date ${rest.join(', ')}`
  },
  // other settings
})

```

## 异步支持

现在不支持异步的验证方法！

异步验证混合同步的可能会导致性能问题，为什么？大多是时候异步验证很耗时，我们通常想同步验证成功后再一个接一个或者并行做异步，这取决于应用的情况，但如果我们设计接口时去支持所有的情景，最终可能会导致它非常丑陋。

如果你有更好的想法，欢迎告诉我。