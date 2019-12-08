import { Alert, Drawer, Form, Table, Tabs, Row, Col } from 'antd';
import * as React from 'react';
import { FormComponentProps } from 'antd/es/form';
import { Action, Dispatch } from 'redux';
import { connect } from 'dva';
import { StateType as RoleStateType } from '@/models/role';
import { AuthorityType } from '@/pages/authority/typings';
import { Item } from '@/pages/role/data';

const { Column } = Table;

const { TabPane } = Tabs;
export interface RoleAuthorizeProps extends FormComponentProps {
  loading: boolean;
  dispatch: Dispatch<Action<'role/updateAuthorize' | 'role/fetchAuthorize'>>;
  role: RoleStateType;
}

/**
 * 角色授权页面
 * 这个页面完全都是通过数据构建的
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/8/29 16:22
 */
@connect(({ role }: { role: RoleStateType }) => ({
  role,
}))
class RoleAuthorize extends React.PureComponent<RoleAuthorizeProps> {
  /**
   * 隐藏
   */
  onClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/fetchAuthorize',
      payload: { visible: false, id: '' },
    });
  };

  /**
   * 更新权限
   */
  updateAuthorize = (
    id?: string,
    type?: AuthorityType,
    auth?: string,
    item?: string[] | string,
    checked?: boolean,
  ) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/updateAuthorize',
      payload: {
        id, // 角色ID
        type, // 类型
        auth, // 权限ID
        item, // 权限项ID
        checked, // 是否选中
      },
    });
  };

  /**
   * table
   */
  table = (items: Item[], id?: string, authId?: string, type?: AuthorityType) => (
    <Table
      rowKey="id"
      rowSelection={{
        // 默认选中项
        selectedRowKeys: items.map((text: any) => {
          if (text.checked) {
            return text.id;
          }
          return null;
        }),
        // 选中
        onSelect: (record, selected) => {
          this.updateAuthorize(id, type, authId, record.id, selected);
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
          this.updateAuthorize(
            id,
            type,
            authId,
            changeRows ? changeRows.map(s => s.id) : selectedRows.map(s => s.id),
            selected,
          );
        },
      }}
      dataSource={items}
      pagination={false}
      size="middle"
    >
      <Column title="权限名称" align="center" dataIndex="name" key="name" />
      <Column title="权限值" align="center" dataIndex="permission" key="permission" />
    </Table>
  );

  render() {
    const {
      role: {
        auth: { visible, items = [], id },
      },
    } = this.props;
    return (
      <Drawer title="角色授权" width={850} onClose={this.onClose} visible={visible}>
        <Row>
          <Col span={24} xs={24}>
            <Alert
              style={{ marginBottom: '20px' }}
              message="为路由、操作、接口进行授权，实现细粒度权限控制。"
              type="info"
            />
            <Tabs defaultActiveKey="1" tabPosition="left" size="small" style={{ height: 800 }}>
              {items.map(i => (
                <TabPane tab={`${i.name}`} key={`${i.id}`}>
                  {/* 权限内容 */}
                  <Tabs tabPosition="top" defaultActiveKey="1" type="card">
                    <TabPane tab="路由权限" key="1">
                      {i.routes && this.table(i.routes, id, i.id, AuthorityType.ROUTE)}
                    </TabPane>
                    <TabPane tab="操作权限" key="2">
                      {i.operates && this.table(i.operates, id, i.id, AuthorityType.OPERATE)}
                    </TabPane>
                    <TabPane tab="接口权限" key="3">
                      {i.interfaces && this.table(i.interfaces, id, i.id, AuthorityType.INTERFACE)}
                    </TabPane>
                  </Tabs>
                </TabPane>
              ))}
            </Tabs>
          </Col>
        </Row>
      </Drawer>
    );
  }
}

export default Form.create()(RoleAuthorize);
