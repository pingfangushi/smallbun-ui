import React from 'react';
import { Drawer, Card, Tabs } from 'antd';
import { connect } from 'dva';
import { Action, Dispatch } from 'redux';
import Form from 'antd/es/form';
import { StateType } from '@/models/authority';
import AuthorityItem from '@/pages/authority/components/AuthorityItem';
import { Open } from '@/pages/typings';
import { AuthorityType } from '@/pages/authority/typings';

const { TabPane } = Tabs;

/**
 * AuthorityDrawer
 * @constructor
 */
interface AuthorityDrawerProps {
  loading: boolean;
  dispatch: Dispatch<
    Action<
      | 'authority/config'
      | 'authority/uniqueItem'
      | 'authority/fetchItem'
      | 'authority/submitItem'
      | 'authority/removeItem'
    >
  >;
  authority: StateType;
}
interface AuthorityDrawerState {
  activeKey: string;
}
@connect(
  ({
    authority,
    loading,
  }: {
    authority: StateType;
    loading: { effects: { [key: string]: boolean } };
  }) => ({
    authority,
    loading: loading.effects['authority/fetchItem'],
  }),
)
class AuthorityConfig extends React.Component<AuthorityDrawerProps, AuthorityDrawerState> {
  state = {
    activeKey: '1',
  };

  onClose(): void {
    const { dispatch } = this.props;
    dispatch({
      type: 'authority/config',
      payload: { visible: false },
    });
    this.setState({ activeKey: '1' });
  }

  /**
   * 获取数据
   * @param type
   */
  fetch(type: AuthorityType): void {
    const {
      dispatch,
      authority: {
        config: { authorize },
      },
    } = this.props;
    dispatch({
      type: 'authority/fetchItem',
      payload: { authorize, visible: true, type },
    });
  }

  /**
   * 提交
   * @param values
   * @param type
   * @param callback
   */
  submit(values: {}, type: Open, callback: (success: boolean) => void) {
    const { dispatch } = this.props;
    dispatch({
      type: 'authority/submitItem',
      payload: { ...values, submitType: type },
      callback,
    });
  }

  /**
   * 唯一验证
   * @param payload
   * @param callback
   */
  unique(payload: {}, callback: (unique: boolean) => void) {
    const { dispatch } = this.props;
    dispatch({
      type: 'authority/uniqueItem',
      payload,
      callback,
    });
  }

  /**
   * 删除
   * @param ids
   * @param authorize
   * @param type
   */
  remove(ids: string[], authorize: string, type: AuthorityType) {
    const { dispatch } = this.props;
    dispatch({
      type: 'authority/removeItem',
      payload: { ids, type, authorize },
    });
  }

  render(): React.ReactNode {
    const {
      loading,
      authority: {
        config: { visible, list, authorize },
      },
    } = this.props;
    return (
      <div>
        <Drawer
          title="配置权限"
          width={1000}
          onClose={() => {
            this.onClose();
          }}
          visible={visible}
        >
          <Card bordered={false}>
            <Tabs
              activeKey={this.state.activeKey}
              tabPosition="right"
              size="small"
              onChange={activeKey => {
                this.setState({ activeKey });
                // 更换的时候刷新子组件
                if (activeKey === '1') {
                  this.fetch(AuthorityType.ROUTE);
                }
                if (activeKey === '2') {
                  this.fetch(AuthorityType.OPERATE);
                }
                if (activeKey === '3') {
                  this.fetch(AuthorityType.INTERFACE);
                }
              }}
            >
              <TabPane tab="路由权限" key="1">
                <AuthorityItem
                  data={list}
                  loading={loading}
                  authorize={authorize}
                  type={AuthorityType.ROUTE}
                  submit={(values, type, callback) => {
                    this.submit(values, type, callback);
                  }}
                  unique={(payload, callback) => {
                    this.unique(payload, callback);
                  }}
                  remove={(ids, auth, type) => {
                    this.remove(ids, auth, type);
                  }}
                />
              </TabPane>
              <TabPane tab="操作权限" key="2">
                <AuthorityItem
                  data={list}
                  loading={loading}
                  authorize={authorize}
                  type={AuthorityType.OPERATE}
                  submit={(values, type, callback) => {
                    this.submit(values, type, callback);
                  }}
                  unique={(payload, callback) => {
                    this.unique(payload, callback);
                  }}
                  remove={(ids, auth, type) => {
                    this.remove(ids, auth, type);
                  }}
                />
              </TabPane>
              <TabPane tab="接口权限" key="3">
                <AuthorityItem
                  data={list}
                  loading={loading}
                  authorize={authorize}
                  type={AuthorityType.INTERFACE}
                  submit={(values, type, callback) => {
                    this.submit(values, type, callback);
                  }}
                  unique={(payload, callback) => {
                    this.unique(payload, callback);
                  }}
                  remove={(ids, auth, type) => {
                    this.remove(ids, auth, type);
                  }}
                />
              </TabPane>
            </Tabs>
          </Card>
        </Drawer>
      </div>
    );
  }
}
export default Form.create()(AuthorityConfig);
