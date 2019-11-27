import request from '@/utils/request';

/* 新增 */
export async function add(params: any) {
  return request('/api/notice', {
    method: 'POST',
    data: params,
  });
}

/* 删除 */
export async function del(params: any) {
  return request('/api/notice', {
    method: 'DELETE',
    data: params,
  });
}

/* 修改 */
export async function edit(params: any) {
  return request('/api/notice', {
    method: 'PUT',
    data: params,
  });
}

/* 查询全部 */
export async function list(params: any) {
  return request('/api/notice', {
    method: 'GET',
    data: params,
  });
}

/* 分页查询 */
export async function page(params: any) {
  return request('/api/notice/page', {
    method: 'GET',
    data: params,
  });
}
