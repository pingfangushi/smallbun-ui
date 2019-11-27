import { TableProps } from 'antd/es/table';
import { PaginationProps } from 'antd/lib/pagination';

/**
 * 状态枚举
 */
export enum StatusEnum {
  ENABLE = '0',
  DISABLE = '1',
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

/**
 * 权限类型
 */
export enum AuthorityType {
  ROUTE,
  OPERATING,
  INTERFACE,
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

/**
 * 表数据
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/10/22 22:26
 */
export interface TableListData<T> {
  list: T[];
  pagination: Partial<TableProps<T>['pagination']> | false;
}

/**
 * 查询参数
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/9/22 9:59
 */
export interface TableListParams extends PaginationProps {
  sorter: string;
}
