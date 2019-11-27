import request from '../../../utils/request';
import { SearchParams } from './data.d';

/**
 * 分页查询
 * @param params
 */
export async function getPage(params: SearchParams) {
  return request('/api/logger/login', {
    params,
  });
}

/**
 * 根据ID获取数据
 * @param id
 */
export async function getById(id: string) {
  return request(`/api/logger/login/${id}`);
}

/**
 * 清空
 */
export async function empty() {
  return request('/api/logger/login', {
    method: 'DELETE',
  });
}
