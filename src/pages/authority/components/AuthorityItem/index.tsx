import React, { Fragment } from 'react';
import { FormComponentProps } from 'antd/es/form';
import { Button, Divider, Form, Icon, Popconfirm, Switch, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { formatMessage } from 'umi-plugin-react/locale';
import Authorized from '@/components/Authorized/Authorized';
import { AuthorityItemFormItemFields, ConfigListItem } from '../../data.d';
import AuthorizedItemModule from '@/pages/authority/components/AuthorityItem/form';
import { Open } from '@/pages/typings';
import { AuthorityType, AuthStatus } from '@/pages/authority/typings';

/**
 * AuthItemProps
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/9/20 18:00
 */
interface AuthItemProps extends FormComponentProps {
  // 数据
  data: ConfigListItem[];
  // 归属权限
  authorize: string;
  // 类型 路由、操作、接口
  type: AuthorityType;
  // loading
  loading: boolean;
  // 提交
  submit: (
    values: AuthorityItemFormItemFields,
    type: Open,
    callback: (success: boolean) => void,
  ) => void;
  // 删除
  remove: (ids: string[], authorize: string, type: AuthorityType) => void;
  // 唯一
  unique: (payload: {}, callback: (unique: boolean) => void) => void;
}
interface AuthItemState {
  // 控制Form
  visible: boolean;
  // 数据
  data?: {};
  // 类型
  type?: Open;
}
/**
 * 操作权限
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/10/9 10:25
 */
class AuthorityItem extends React.Component<AuthItemProps, AuthItemState> {
  state = {
    visible: false,
    data: {},
    type: Open.ADD,
  };

  /**
   * 表格columns
   */
  columns: ColumnProps<ConfigListItem>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '标识',
      dataIndex: 'permission',
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      render: (text, record) => (
        <Switch
          onClick={(checked: boolean) => {
            const status = checked ? AuthStatus.ENABLE : AuthStatus.DISABLE;
            this.props.submit({ ...record, status }, Open.UPDATE, () => {});
          }}
          checkedChildren="启用"
          unCheckedChildren="禁用"
          checked={text === AuthStatus.ENABLE}
        />
      ),
    },
    {
      title: '操作',
      align: 'center',
      render: text => (
        <Fragment>
          <Authorized authority="manage:operate:authority:update" noMatch={<></>}>
            <a onClick={this.updateOnClick.bind(this, text)}>
              {formatMessage({ id: 'edit.name' })}
            </a>
          </Authorized>
          <Authorized authority="manage:operate:authority:remove" noMatch={<></>}>
            <Divider type="vertical" />
            <Popconfirm
              style={{ marginLeft: 70, clear: 'both', whiteSpace: 'nowrap' }}
              title={formatMessage({ id: 'del.confirm.title' })}
              placement="bottomLeft"
              onConfirm={() => {
                this.props.remove([text.id], text.authorize, this.props.type);
              }}
              icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
            >
              <a>{formatMessage({ id: 'del.name' })}</a>
            </Popconfirm>
          </Authorized>
        </Fragment>
      ),
    },
  ];

  /**
   * updateOnClick
   * @param text
   */
  updateOnClick(text: any) {
    this.setState({
      visible: true,
      data: {
        id: text.id,
        authorize: text.authorize,
        type: text.type,
        status: text.status,
        name: text.name,
        permission: text.permission,
      },
      type: Open.UPDATE,
    });
  }

  /**
   * render
   */
  render(): React.ReactNode {
    const { data, loading } = this.props;
    return (
      <Fragment>
        <Table<ConfigListItem>
          rowKey={record => `${record.id}`}
          dataSource={data}
          columns={this.columns}
          defaultExpandAllRows
          pagination={false}
          loading={loading}
          size="middle"
        />
        <Authorized authority="manage:operate:authority:add" noMatch={<></>}>
          <Button
            style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
            type="dashed"
            icon="plus"
            onClick={() => {
              this.setState({
                visible: true,
                data: {
                  id: '',
                  authorize: this.props.authorize,
                  type: this.props.type,
                  status: AuthStatus.ENABLE,
                },
                type: Open.ADD,
              });
            }}
          >
            新增权限
          </Button>
          <AuthorizedItemModule
            title={this.state.type === Open.ADD ? '新增权限项' : '修改权限项'}
            data={this.state.data}
            visible={this.state.visible}
            onCancel={() => {
              this.setState({ visible: false });
            }}
            submit={(values: AuthorityItemFormItemFields, callback: (success: boolean) => void) => {
              this.props.submit(values, this.state.type, (success: boolean) => {
                if (success) {
                  this.setState({ visible: false }, () => {
                    callback(true);
                  });
                }
              });
            }}
            unique={this.props.unique}
          />
        </Authorized>
      </Fragment>
    );
  }
}
export default Form.create<AuthItemProps>()(AuthorityItem);
