import { Open, Result, TableListParams } from '@/pages/typeings';


/**
 * Table项
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/9/26 15:22
 */
export interface TypeTableListItem {
  id?: string;
  name?: string;
  code?: string;
  status?: string;
}

export interface ValueTableListItem {
  id?: string;
  label?: string;
  value?: string;
  status?: string;
  sort?: string;
}

/**
 * TYpeFrom 表单项
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/9/26 15:22
 */
export interface TypeFormItem {
  type?: Open;
  fields?: TypeFormItemFields;
  title?: string;
  visible?: boolean;
}

/**
 * 表单字段
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/9/26 15:51
 */
export interface TypeFormItemFields {
  id?: string | number;
  name?: string;
  code?: string;
  remarks?: string;
}

/**
 * 搜索参数字段
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/10/14 15:57
 */
export interface TypeSearchParams extends TableListParams {
  name: string;
  status: string;
}

/**
 * ValueFormItem 表单项
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/9/26 15:22
 */
export interface ValueFormItem {
  type?: Open;
  fields?: ValueFormItemFields;
  title?: string;
  visible?: boolean;
}

/**
 * 表单字段
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/9/26 15:51
 */
export interface ValueFormItemFields {
  id?: string;
  type?: string;
  label?: string;
  value?: string;
  color?: string;
  status?: string;
  sort?: string | number;
  remarks?: string;
}

/**
 * 搜索参数字段
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/10/14 15:57
 */
export interface ValueSearchParams extends TableListParams {
  label: string;
}

export { TableListParams, Result };
