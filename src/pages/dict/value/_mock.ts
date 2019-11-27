import { Request, Response } from 'express';
import { parse } from 'url';
import {
  Result,
  TypeSearchParams,
  TypeTableListItem,
  ValueTableListItem,
  ValueSearchParams,
} from './data.d';
import { Status } from '@/pages/typeings';

const typeTableListDataSource: TypeTableListItem[] = [];
const valueTableListDataSource: ValueTableListItem[] = [];

for (let i = 0; i < 100; i += 1) {
  typeTableListDataSource.push({
    id: `${i}`,
    name: `字典类型${i}`,
    code: `${i}`,
    status: '启用',
  });
}
for (let i = 0; i < 3; i += 1) {
  valueTableListDataSource.push({
    id: `${i}`,
    label: `字典值${i}`,
    value: `${i}`,
    sort: `${i}`,
  });
}

function getTypePage(req: Request, res: Response, u: string) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }
  const params = (parse(url, true).query as unknown) as TypeSearchParams;
  const dataSource = typeTableListDataSource;

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = parseInt(`${params.pageSize}`, 0);
  }

  const result: Result<TypeTableListItem> = {
    status: Status.SUCCESS,
    message: '成功',
    result: {
      list: dataSource,
      pagination: {
        total: dataSource.length,
        pageSize,
        current: parseInt(`${params.pageSize}`, 10) || 1,
      },
    },
  };
  return res.json(result);
}

function getValuePage(req: Request, res: Response, u: string) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }
  const params = (parse(url, true).query as unknown) as ValueSearchParams;
  const dataSource = valueTableListDataSource;

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = parseInt(`${params.pageSize}`, 0);
  }

  const result: Result<ValueTableListItem> = {
    status: Status.SUCCESS,
    message: '成功',
    result: {
      list: dataSource,
      pagination: {
        total: dataSource.length,
        pageSize,
        current: parseInt(`${params.pageSize}`, 10) || 1,
      },
    },
  };
  return res.json(result);
}

export default {
  /* type */
  'GET  /api/dict/type': getTypePage,
  'GET  /api/dict/type:id': (_: Request, res: Response) => {
    res.send({ message: '成功', status: 200 });
  },
  'POST  /api/dict/type': (_: Request, res: Response) => {
    res.send({ message: '新增成功', status: 200 });
  },
  'PUT  /api/dict/type': (_: Request, res: Response) => {
    res.send({ message: '修改成功', status: 200 });
  },
  'DELETE  /api/dict/type': (_: Request, res: Response) => {
    res.send({ message: '成功', status: 200 });
  },
  /* value */
  'GET  /api/dict/value': getValuePage,
  'POST  /api/dict/value': (_: Request, res: Response) => {
    res.send({ message: '新增成功', status: 200 });
  },
  'PUT  /api/dict/value': (_: Request, res: Response) => {
    res.send({ message: '修改成功', status: 200 });
  },
  'DELETE  /api/dict/value': (_: Request, res: Response) => {
    res.send({ message: '成功', status: 200 });
  },
};
