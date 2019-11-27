import { Open, Result, Status, StatusEnum } from '@/pages/typings';
import { TableListParams } from '@/components/StandardTable/data.d';
import { AuthStatus, AuthorityType } from '@/pages/authority/typings';

/**
 * Table项
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/9/26 15:22
 */
export interface TableListItem {
  id: string;
  name: string;
  code: string;
  remarks: string;
}

/**
 *Config
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/9/26 15:22
 */
export interface Config {
  // 权限项ID
  authorize: string;
  /* 是否显示 */
  visible: boolean;
  // 权限项列表
  list: ConfigListItem[];
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
  name?: string;
  type?: number;
  code?: string;
  status?: number | string;
  remarks?: string;
}

/**
 * 搜索参数字段
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/10/14 15:57
 */
export interface SearchParams extends TableListParams {
  name: string;
  status: string;
}

/**
 * ConfigListItem
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/9/26 15:22
 */
export interface ConfigListItem {
  id?: string;
  name?: string;
  url?: string;
  permission?: string;
  status?: StatusEnum;
  remarks?: string;
}

/**
 * 表单字段
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/9/26 15:51
 */
export interface AuthorityItemFormItemFields {
  id?: string;
  authorize?: string;
  type?: AuthorityType;
  name?: string;
  permission?: string;
  status?: AuthStatus;
  remarks?: string;
}
export { Result, Status };
