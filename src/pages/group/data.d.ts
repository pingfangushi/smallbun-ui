import { TreeNodeNormal } from 'antd/es/tree/Tree';
import { Open, Status, Result } from '@/pages/typings';
import { TableListParams } from '@/components/StandardTable/data';

/**
 * Table项
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/9/26 15:22
 */
export interface TableListItem {
  value: string;
  id: string;
  parentId: string;
  title?: string;
  isLeaf?: boolean;
  name?: string;
  level?: string | number;
  code?: string;
  type?: number | string;
  status?: number | string;
  children?: TableListItem[];
}

/**
 * TreeNode
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/9/26 15:22
 */
export interface TreeNode extends TreeNodeNormal {
  value: string;
  id: string | number;
  name?: string;
  code?: string;
  type?: number | string;
  status?: number | string;
  children?: TreeNode[];
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
  parentId?: string | number;
  code?: string;
  type?: number;
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

export { Status, Result };
