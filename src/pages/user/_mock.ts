import { Request, Response } from 'express';
import { parse } from 'url';
import { TableListItem, SearchParams } from './data.d';
import { Result, Status } from '@/pages/typeings';

const tableListDataSource: TableListItem[] = [];

for (let i = 0; i < 12; i += 1) {
  tableListDataSource.push({
    id: `${i}`,
    groupId: '1',
    username: `用户${i}`,
    type: '普通用户',
    status: Math.floor(Math.random() * 10) % 4,
    lastLoginTime: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
  });
}

/**
 * 获取分页数据
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/10/14 16:04
 */
function getPage(req: Request, res: Response, u: string) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }
  const params = (parse(url, true).query as unknown) as SearchParams;
  let dataSource = tableListDataSource;

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.status) {
    const status = params.status.split(',');
    let filterDataSource: TableListItem[] = [];
    status.forEach((s: string) => {
      filterDataSource = filterDataSource.concat(
        dataSource.filter(item => parseInt(`${item.status}`, 10) === parseInt(s.split('')[0], 10)),
      );
    });
    dataSource = filterDataSource;
  }

  if (params.username) {
    dataSource = dataSource.filter(data => data.username.indexOf(params.username) > -1);
  }

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

export default {
  'GET  /api/user': getPage,
  'GET  /api/user:id': (_: Request, res: Response) => {
    res.send({ message: '成功', code: 200 });
  },
  'POST  /api/user': (_: Request, res: Response) => {
    res.send({ message: '成功', code: 200 });
  },
  'PUT  /api/user': (_: Request, res: Response) => {
    res.send({ message: '成功', code: 200 });
  },
  'DELETE  /api/user': (_: Request, res: Response) => {
    res.send({ message: '成功', code: 200 });
  },
};
