import { TableListData } from '@/components/StandardTable/data.d';

/**
 * 状态枚举
 */
export enum StatusEnum {
  ENABLE = 'ENABLE',
  DISABLE = 'DISABLE',
}

/**
 * 操作类型
 */
export enum Open {
  ADD,
  UPDATE,
  DEL,
  IMPORT,
  EXPORT,
  CLOSE,
}

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export default class Type {}

/**
 * Status
 */
export enum Status {
  SUCCESS = '200',
  EX900001 = '900001',
}

export interface BaseResult {
  // 消息提示
  message: string;
  // 状态码
  status: Status | string;
}

/**
 * 结果
 */
export interface Result<T> extends BaseResult {
  // 结果
  result: TableListData<T> | T | T[];
}
