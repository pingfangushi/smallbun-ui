import { TableProps } from 'antd/lib/table';
import { PaginationProps } from 'antd/lib/pagination';
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
