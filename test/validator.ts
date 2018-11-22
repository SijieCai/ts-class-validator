import { mixins, validate, is, and, or, isClass } from '../src/index';
async function queryDatabase(v: any) { return v; }

class IdParam {
  @validate(
    is.int(),
    is.required()
  )
  id: number;
}

class PaginationParams {
  // 验证 int
  @validate(is.int({ min: 0 }))
  @validate(is.numeric())
  page: number;

  // 定义错误消息和上下文
  @validate(is.int().message('pagesize is not a valid int value'))
  pagesize: number;
}

class StaffListParams {
  // 校验字符串, 支持所有 validator.js 的方法
  @validate(
    is.required().message('is required'),
    is.in(['male', 'female']).message('not in ')
  )
  gender: string

  // 逻辑组合 and or, 下面等同于 (require && (value === 'male' || value === 'female'))
  @validate(
    is.required(),
    or(
      is.equals('male'),
      is.equals('female')
    )
  )
  gender1: string;

  // 条件判断 onlyIf, 仅当 mobile 为空的时候做判断
  @validate(
    is.required().onlyIf(o => !o.mobile),
    is.email()
  )
  email: string;


  // 校验数组
  @validate.each(is.mobilePhone('zh-CN'))
  backupMobiles: string[];

  // 嵌套校验，忽略字段在前面加 ^, 不加这表示要校验的字段
  @validate(is.type(PaginationParams, '^field1,field2,field3'))
  pagination: PaginationParams;

  // 异步校验, 自定义校验
  @validate([
    is.required().message('parentId 不能为空'),
    is.func(async (target: any, ctx: any) => {
      var count = await queryDatabase({ id: target || ctx.parentId });
      return count > 0;
    }).message('parentId 不存在')
  ])
  parentId: number;
}

class StaffListParams1 {
  // 校验字符串, 支持所有 validator.js 的方法
  @validate(
    and(
      is.JSON(),
      is.required().message('is required'),
      is.in(['male', 'female']).message('not in ')
    ).message(''),

    is.required().message('is required'),
    is.in(['male', 'female']).message('not in ')
  )
  // 逻辑组合 and or, 下面等同于 (require && (value === 'male' || value === 'female'))
  @validate(
    is.required(),
    or(
      is.equals('male'),
      is.equals('female')
    )
  )
  gender1: string;

  // 条件判断 onlyIf, 仅当 mobile 为空的时候做判断
  @validate(
    is.required().onlyIf(o => !o.mobile),
    is.email()
  )
  email1: string;


  // 校验数组
  @validate.each(is.mobilePhone('zh-CN'))
  backupMobiles1: string[];

  // 嵌套校验，忽略字段在前面加 ^, 不加这表示要校验的字段
  @validate(is.type(PaginationParams, '^field1,field2,field3'))
  pagination1: PaginationParams;

  // 异步校验, 自定义校验
  @validate([
    is.required().message('parentId 不能为空'),
    is.func(async (target: any, ctx: any) => {
      var count = await queryDatabase({ id: target || ctx.parentId });
      return count > 0;
    }).message('parentId 不存在')
  ])
  parentId1: number;
}

// 组合复用
@mixins(StaffListParams, PaginationParams)
class CombineParams implements StaffListParams, PaginationParams, StaffListParams1 {
  parentId1: number;
  gender: string; email: string;
  backupMobiles: string[];
  pagination: PaginationParams;
  parentId: number;
  page: number;
  pagesize: number;
  gender1: string;
  email1: string;
  backupMobiles1: string[];
  pagination1: PaginationParams;
}

