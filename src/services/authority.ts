import request from '@/utils/request';

/**
 * 唯一验证
 * @param params
 */
export async function unique(params: {}) {
  return request('/upms/api/authority/unique', {
    params,
  });
}

/**
 * 分页查询
 * @param params
 */
export async function getPage(params: {}) {
  return request('/upms/api/authority', {
    params,
  });
}

/**
 * 根据ID获取数据
 * @param id
 */
export async function getById(id: string) {
  return request(`/upms/api/authority/${id}`);
}

/**
 * 新增
 * @param params
 */
export async function add(params: {}) {
  return request('/upms/api/authority', {
    method: 'POST',
    data: params,
  });
}

/**
 * 修改
 * @param params
 */
export async function updateById(params: {}) {
  return request('/upms/api/authority', {
    method: 'PUT',
    data: params,
  });
}

/**
 * 删除
 * @param params
 */
export async function removeByIds(params: { ids: [] }) {
  return request(`/upms/api/authority/${new Array(params.ids).join(',').toString()}`, {
    method: 'DELETE',
  });
}
/**
 * 修改权限项
 * @param params
 */
export async function updateItemById(params: {}) {
  return request('/upms/api/authority/item', {
    method: 'PUT',
    data: params,
  });
}
/**
 * 新增权限项
 * @param params
 */
export async function addItem(params: {}) {
  return request('/upms/api/authority/item', {
    method: 'POST',
    data: params,
  });
}
/**
 * getItemList
 * @param params
 */
export async function getItemList(params: {}) {
  return request('/upms/api/authority/item', {
    params,
  });
}
/**
 * 唯一验证
 * @param params
 */
export async function uniqueItem(params: {}) {
  return request('/upms/api/authority/item/unique', {
    params,
  });
}
/**
 * 删除
 * @param params
 */
export async function removeItemByIds(params: { ids: [] }) {
  return request(`/upms/api/authority/item/${new Array(params.ids).join(',').toString()}`, {
    method: 'DELETE',
  });
}
