import { Open } from '@/pages/typings';
import { TableListParams } from '@/components/StandardTable/data';
import { TableListItem as OrgTableListItem } from '@/pages/group/data';
import { TableListItem as RoleTableListItem } from '@/pages/role/data';
import { UserStatus } from '@/pages/user/typings';

/**
 * 表格列表
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/9/22 14:20
 */
export interface TableListItem {
  id: string;
  // 角色
  roles?: RoleTableListItem[];
  // 组织机构
  group?: OrgTableListItem;
  // 详情
  headPortraitUrl?: string;
  username: string;
  type: string;
  status: number;
  remarks?: number;
  lastLoginTime?: Date;
}

/**
 * From 表单项
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/9/26 15:22
 */
export interface FormItem {
  type?: Open;
  fields?: FormItemFields;
  title?: string;
  visible?: boolean;
}

/**
 * 表单字段
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/9/26 15:51
 */
export interface FormItemFields {
  id?: string;
  username?: string;
  name?: string;
  email?: string;
  phone?: string;
  status?: UserStatus;
  remarks?: number;
  // 角色
  roles?: RoleTableListItem[];
  // 组织机构
  group?: OrgTableListItem;
}
// 用户详情
export interface UserInfoItems {
  id?: string;
  userId?: string;
  name?: string;
  email?: string;
  phone?: string;
  nickName?: string;
  headPortraitUrl?: string;
  idCard?: string;
  qrCode?: string;
}
/**
 * FormDetails
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/9/26 15:22
 */
export interface FormDetails {
  fields?: DetailsItemFields;
  visible?: boolean;
}

/**
 * DetailsItemFields
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/9/26 15:51
 */
export interface DetailsItemFields {
  id?: string;
  groupId?: string;
  username?: string;
  type?: string;
  status?: number;
  remarks?: number;
  group?: OrgTableListItem;
  lastLoginTime?: Date;
}

export interface SearchParams extends TableListParams {
  username: string;
  status: string;
  sorter: string;
}
