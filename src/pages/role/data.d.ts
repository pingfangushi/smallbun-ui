import { Open, Result, Status } from '@/pages/typings';
import { TableListParams } from '@/components/StandardTable/data';

export interface TableListItem {
  id: string;
  name: string;
  type: string;
  status: string;
  code: string;
}

export interface Form {
  type?: Open;
  fields?: FormItemFields;
  title?: string;
  visible?: boolean;
}

export interface Auth {
  visible?: boolean;
  id?: string;
  items?: AuthItem[];
}

export interface AuthItem {
  /* 权限ID */
  id?: string;
  /* 权限名称 */
  name?: string;
  /* 接口权限 */
  interfaces: Item[];
  /* 操作权限 */
  operates: Item[];
  /* 路由权限 */
  routes: Item[];
}
export interface Item {
  checked: boolean;
  disabled: boolean;
  id: string;
  name: string;
}

export interface FormItemFields {
  id?: string;
  name?: string;
  type?: number;
  code?: string;
  status?: number | string;
  remarks?: string;
}

export interface SearchParams extends TableListParams {
  name: string;
  status: string;
}

export { Result, Status };
