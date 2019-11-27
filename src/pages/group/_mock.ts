import { Request, Response } from 'express';
import { Result, TableListItem, Status } from './data.d';

let tableListDataSource: TableListItem[] = [];

tableListDataSource.push({
  children: [
    {
      code: '1002',
      id: '2',
      level: '中',
      name: '义工协会',
      status: '0',
      title: '义工协会',
      type: 'B',
      value: '2',
    },
    {
      code: '1003',
      id: '3',
      level: '低',
      name: '公益协会',
      status: '0',
      title: '公益协会',
      type: 'C',
      value: '3',
    },
    {
      code: '1004',
      id: '4',

      level: '中',
      name: '就业协会',
      status: '1',
      title: '就业协会',
      type: 'D',
      value: '4',
    },
    {
      code: '1005',
      id: '5',

      level: '高',
      name: '商业协会',
      status: '1',
      title: '商业协会',
      type: 'E',
      value: '5',
    },
  ],
  code: '1001',
  id: '1',

  level: '高',
  name: '志愿者协会',
  status: '0',
  title: '志愿者协会',
  type: 'A',
  value: '1',
});

/**
 * 查询
 * @param req
 * @param res
 */
function getList(req: Request, res: Response) {
  const result: Result<TableListItem> = {
    status: Status.SUCCESS,
    message: '成功',
    result: tableListDataSource,
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
  // eslint-disable-next-line max-len
  const item: TableListItem = tableListDataSource.filter(
    i => i.id.indexOf(_.body.parentId) >= 0,
  )[0];
  // 移除
  tableListDataSource = tableListDataSource.filter(j => j.id.indexOf(_.body.parentId) === -1);
  if (item.children) {
    item.children.unshift({
      id: `${id}`,
      value: _.body.name,
      title: _.body.name,
      name: _.body.name,
      type: _.body.type,
      status: _.body.status,
      code: _.body.code,
      level: _.body.level,
    });
  }
  tableListDataSource.unshift(item);

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
      tableListDataSource[i].title = _.body.title;
      tableListDataSource[i].type = _.body.type;
      tableListDataSource[i].status = _.body.status;
      tableListDataSource[i].code = _.body.code;
      tableListDataSource[i].level = _.body.level;
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
  'POST /api/group': add,
  'GET  /api/group': getList,
  'PUT  /api/group': updateById,
  'GET  /api/group/:id': getById,
  'DELETE  /api/group': removeByIds,
};
