import request from '@/utils/request';

/**
 * 分页类型查询
 * @param params
 */
export async function fetchTypes(params: any) {
  return request('/upms/api/dict/type', {
    params,
  });
}
/**
 * 分页字典项查询
 * @param params
 */
export async function fetchItems(params: any) {
  return request('/upms/api/dict/item', {
    params,
  });
}
/**
 * 类型唯一验证
 * @param params
 */
export async function uniqueType(params: any) {
  return request('/upms/api/dict/type/unique', {
    params,
  });
}
/**
 * 字典项唯一验证
 * @param params
 */
export async function uniqueItem(params: any) {
  return request('/upms/api/dict/item/unique', {
    params,
  });
}

/**
 * 根据ID查询类型数据
 * @param params
 */
export async function getTypeById(params: { id: string }) {
  return request(`/upms/api/dict/type/${params.id}`);
}
/**
 * 根据ID查询字典值数据
 * @param params
 */
export async function getItemById(params: { id: string }) {
  return request(`/upms/api/dict/item/${params.id}`);
}
/**
 * 添加类型
 * @param params
 */
export async function addType(params: any) {
  return request('/upms/api/dict/type', {
    method: 'POST',
    data: params,
  });
}
/**
 * 条件字典项
 * @param params
 */
export async function addItem(params: any) {
  return request('/upms/api/dict/item', {
    method: 'POST',
    data: params,
  });
}
/**
 * 修改字典类型数据
 * @param params
 */
export async function updateTypeById(params: any) {
  return request('/upms/api/dict/type', {
    method: 'PUT',
    data: params,
  });
}
/**
 * 修改字典项数据
 * @param params
 */
export async function updateItemById(params: any) {
  return request('/upms/api/dict/item', {
    method: 'PUT',
    data: params,
  });
}
/**
 * 删除字典类型
 * @param params
 */
export async function removeTypeByIds(params: { ids: [] }) {
  return request(`/upms/api/dict/type/${new Array(params.ids).join(',')}`, { method: 'DELETE' });
}
/**
 * 删除字典项
 * @param params
 */
export async function removeItemByIds(params: { ids: [] }) {
  return request(`/upms/api/dict/item/${new Array(params.ids).join(',')}`, { method: 'DELETE' });
}
/**
 * 根据ID更新状态
 * @param params
 */
export async function updateStatusById(params: { id: string; status: string }) {
  return request(`/upms/api/dict/type/${params.id}/status/${params.status}`, {
    method: 'PUT',
  });
}

/**
 * 根据ID默认状态
 * @param params
 */
export async function updateDefaultById(params: { id: string; isDefault: string }) {
  return request(`/upms/api/dict/item/${params.id}/default/${params.isDefault}`, {
    method: 'PUT',
  });
}
