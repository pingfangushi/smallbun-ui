import React from 'react';
import { Card, Tabs } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { formatMessage } from 'umi-plugin-react/locale';
import { Dispatch, Action } from 'redux';
import { connect } from 'dva';
import LoginLogger from '@/pages/logger/login';
import OperateLogger from '@/pages/logger/operate';
import { StateType } from '@/models/logger';

const { TabPane } = Tabs;
export interface IndexProps {
  dispatch: Dispatch<Action<'logger/fetchOperate' | 'logger/fetchLogin'>>;
}
/**
 * 日志管理
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/8/27 16:46
 */
@connect(({ logger }: { logger: StateType }) => ({
  logger,
}))
class Index extends React.PureComponent<IndexProps> {
  componentDidMount(): void {
    const { dispatch } = this.props;
    dispatch({
      type: 'logger/fetchLogin',
      payload: { sorter: 'loginTime', asc: false },
    });
  }

  render(): React.ReactNode {
    return (
      <div>
        <PageHeaderWrapper content={formatMessage({ id: 'logger.content.description' })}>
          <Card bordered={false}>
            <Tabs
              defaultActiveKey="1"
              type="card"
              onChange={activeKey => {
                // 更换的时候刷新子组件
                if (activeKey === '1') {
                  const { dispatch } = this.props;
                  dispatch({
                    type: 'logger/fetchLogin',
                    payload: { sorter: 'loginTime', asc: false },
                  });
                }
                if (activeKey === '2') {
                  const { dispatch } = this.props;
                  dispatch({
                    type: 'logger/fetchOperate',
                    payload: { sorter: 'time', asc: false },
                  });
                }
              }}
            >
              <TabPane tab="登录日志" key="1">
                <LoginLogger />
              </TabPane>
              <TabPane tab="操作日志 " key="2">
                <OperateLogger />
              </TabPane>
            </Tabs>
          </Card>
        </PageHeaderWrapper>
      </div>
    );
  }
}

export default Index;
