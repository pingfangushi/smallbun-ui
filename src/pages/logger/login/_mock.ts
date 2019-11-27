import { Request, Response } from 'express';
import { parse } from 'url';
import { Result, TableListItem, SearchParams, Status } from './data.d';

let tableListDataSource: TableListItem[] = [];

for (let i = 0; i < 12; i += 1) {
  tableListDataSource.push({
    key: 10000 + i,
    id: `10000${i}`,
    name: `管理员${i}`,
    type: `1${i}`,
    status: '1',
    code: `A10000${i}`,
  });
}

/**
 * 查询
 * @param req
 * @param res
 * @param u
 */
function getPage(req: Request, res: Response, u: string) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }
  const params = (parse(url, true).query as unknown) as SearchParams;
  const dataSource = tableListDataSource;

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = parseInt(`${params.pageSize}`, 0);
  }

  const result: Result<TableListItem> = {
    status: Status.SUCCESS,
    message: '成功',
    result: {
      list: dataSource,
      pagination: {
        total: dataSource.length,
        pageSize,
        current: parseInt(`${params.current}`, 10) || 1,
      },
    },
  };
  return res.json(result);
}

/**
 * 根据ID获取数据
 * @param req
 * @param res
 */
function getById(req: Request, res: Response) {
  const id: string = [req.params.id][0];
  const item: TableListItem = tableListDataSource.filter(i => i.id.indexOf(id) >= 0)[0];
  return res.json({ message: '成功', status: 200, result: item });
}

/**
 * 新增
 * @param _
 * @param res
 */
function add(_: Request, res: Response) {
  const id = Math.random();
  tableListDataSource.unshift({
    key: id,
    id: `${id}`,
    name: _.body.name,
    type: _.body.type,
    status: _.body.status,
    code: _.body.code,
  });
  return res.json({ message: '成功', status: 200 });
}

/**
 * 修改
 * @param _
 * @param res
 */
function updateById(_: Request, res: Response) {
  for (let i = 0; i < tableListDataSource.length; i += 1) {
    if (tableListDataSource[i].id === _.body.id) {
      tableListDataSource[i].name = _.body.name;
      tableListDataSource[i].type = _.body.type;
      tableListDataSource[i].status = _.body.status;
      tableListDataSource[i].code = _.body.code;
    }
  }
  return res.json({ message: '成功', status: 200 });
}

/**
 * 删除
 * @param _
 * @param res
 */
function removeByIds(_: Request, res: Response) {
  for (let i = 0; i < _.body.ids.length; i += 1) {
    tableListDataSource = tableListDataSource.filter(item => _.body.ids[i].indexOf(item.id) === -1);
  }
  return res.json({ message: '成功', status: 200 });
}

export default {
  'POST  /api/role': add,
  'GET  /api/role': getPage,
  'GET  /api/role/:id': getById,
  'PUT  /api/role': updateById,
  'DELETE  /api/role/:id': removeByIds,
};
