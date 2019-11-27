import { Result, Status, TableListParams } from '@/pages/typeings';

/**
 * Table项
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/9/26 15:22
 */
export interface TableListItem {
  id: string;
  module: string;
  feature: string;
  browser: string;
  action: string;
  uri: string;
  ip: string;
  location: string;
  os: string;
  platform: string;
  method: string;
  time: string;
}

/**
 * DetailsItem
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/9/26 15:22
 */
export interface DetailsItem {
  visible: boolean;
  fields?: DetailsItemFields;
}

/**
 * DetailsItemFields
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/9/26 15:51
 */
export interface DetailsItemFields {
  id?: string;
  module?: string;
  params?: string;
  feature?: string;
  browser?: string;
  action?: string;
  uri?: string;
  ip?: string;
  location?: string;
  os?: string;
  platform?: string;
  method?: string;
  time?: string;
  user?: string;
  status?: string;
  result?: string;
}

/**
 * 搜索参数字段
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/10/14 15:57
 */
export interface SearchParams extends TableListParams {
  module: string;
  action: string;
  username: string;
}

export { Result, Status };
