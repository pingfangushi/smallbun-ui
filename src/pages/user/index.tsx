import React, { Fragment, PureComponent } from 'react';
import {
  Button,
  Card,
  Col,
  Menu,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Popconfirm,
  Icon,
  Modal,
  Dropdown,
  Avatar,
  Tag,
} from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch, Action } from 'redux';
import { formatMessage } from 'umi-plugin-react/locale';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { ColumnProps } from 'antd/lib/table';
import UserForm from './form';
import { UserModelState as StateType } from '@/models/user';
import { StateType as RoleStateType } from '@/models/role';
import styles from './style.less';
import StandardTable from '@/components/StandardTable';
import { TableListItem } from './data.d';
import { Add, Remove, Update } from '@/components/OpenButton';
import { Open } from '@/pages/typings';
import Authorized from '@/components/Authorized/Authorized';
import { UserStatus } from '@/pages/user/typings';
import { StateType as GroupStateType } from '@/models/group';
import OrgSearchTree from '../group/tree';

const { Option } = Select;
const FormItem = Form.Item;

/**
 * TableListProps
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/9/22 14:32
 */
interface TableListProps extends FormComponentProps {
  loading: boolean;
  dispatch: Dispatch<
    Action<
      | 'group/tree'
      | 'user/form'
      | 'user/fetch'
      | 'user/remove'
      | 'user/submit'
      | 'user/details'
      | 'user/updateStatus'
      | 'user/updatePassword'
    >
  >;
  role: RoleStateType;
  user: StateType;
  group: GroupStateType;
}

/**
 * TableListState
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/9/22 14:32
 */
interface TableListState {
  selectedRows: TableListItem[];
  passWordVisible: boolean;
  passWordLoading: boolean;
  passWordId?: string;
}

@connect(
  ({ user, loading }: { user: StateType; loading: { effects: { [key: string]: boolean } } }) => ({
    user,
    loading: loading.effects['user/fetch'],
  }),
)
@connect(({ group }: { group: GroupStateType }) => ({
  group,
}))
/**
 * 用户管理
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/8/27 16:46
 */
class Index extends PureComponent<TableListProps, TableListState> {
  state: TableListState = {
    selectedRows: [],
    passWordVisible: false,
    passWordLoading: false,
  };

  /**
   * 表格columns
   */
  columns: ColumnProps<TableListItem>[] = [
    {
      title: '账号',
      dataIndex: 'username',
      align: 'center',
    },
    {
      title: '头像',
      dataIndex: 'headPortraitUrl',
      align: 'center',
      render: (text, record) => {
        if (record.headPortraitUrl) {
          return <Avatar src={record.headPortraitUrl} key={text} />;
        }
        return (
          <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }} key={text}>
            {record.username && record.username.substring(0, 1).toLocaleUpperCase()}
          </Avatar>
        );
      },
    },
    {
      title: '姓名',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '昵称',
      dataIndex: 'nickName',
      align: 'center',
    },
    {
      title: '手机',
      dataIndex: 'phone',
      align: 'center',
      render: text => text || <>-</>,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      align: 'center',
      render: text => text || <>-</>,
    },
    {
      title: '身份证',
      dataIndex: 'idCard',
      align: 'center',
      render: text => text || <>-</>,
    },
    {
      title: '组织',
      dataIndex: 'group.name',
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      sorter: true,
      render: text => {
        if (text === UserStatus.ENABLE) {
          return <Tag color="green">启用</Tag>;
        }
        if (text === UserStatus.DISABLE) {
          return <Tag color="volcano">禁用</Tag>;
        }
        if (text === UserStatus.LOCKED) {
          return <Tag color="red">锁定</Tag>;
        }
        return <></>;
      },
    },
    {
      title: '操作',
      align: 'center',
      render: text => (
        <Fragment>
          <Authorized authority="manage:operate:user:update" noMatch={<></>}>
            <a onClick={this.updateOnClick.bind(this, text.id)}>
              {formatMessage({ id: 'edit.name' })}
            </a>
            <Divider type="vertical" />
          </Authorized>
          <Dropdown
            placement="bottomCenter"
            overlay={
              <Menu>
                <Menu.Item key="1">
                  <Authorized authority="manage:operate:user:remove" noMatch={<></>}>
                    <Popconfirm
                      className={styles.openButton}
                      style={{ marginLeft: 70, clear: 'both', whiteSpace: 'nowrap' }}
                      title={formatMessage({ id: 'del.confirm.title' })}
                      placement="bottomLeft"
                      onConfirm={() => {
                        this.removeOnClick([text.id]);
                      }}
                      icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                    >
                      <a>{formatMessage({ id: 'del.name' })}</a>
                    </Popconfirm>
                  </Authorized>
                </Menu.Item>
                <Menu.Item key="3">
                  <Authorized authority="manage:operate:user:update" noMatch={<></>}>
                    <a onClick={this.passWordOnClick.bind(this, text.id)}>设置密码</a>
                  </Authorized>
                </Menu.Item>
              </Menu>
            }
            trigger={['click']}
          >
            <a className="ant-dropdown-link" href="#">
              更多
              <Icon type="down" />
            </a>
          </Dropdown>
        </Fragment>
      ),
    },
  ];

  /**
   * componentDidMount
   */
  componentDidMount() {
    this.fetch({ sorter: 'lastModifiedTime', asc: false });
  }

  /**
   * fetch
   */
  fetch = (params?: {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetch',
      payload: params,
    });
  };

  /**
   * addOnClick
   */
  addOnClick = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/form',
      payload: { type: Open.ADD },
    });
  };

  /**
   * updateOnClick
   */
  updateOnClick = (id: string) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/form',
      payload: { type: Open.UPDATE, id },
    });
  };

  /**
   * passWordOnClick
   */
  passWordOnClick = (id: string) => {
    this.setState({ passWordVisible: true, passWordId: id });
  };

  removeOnClick = (ids: string[]) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/remove',
      payload: { ids },
      callback: () => {
        this.setState({ selectedRows: [] });
      },
    });
  };

  /**
   * 点击取消，清除表达数据
   */
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.fetch({ sorter: 'lastModifiedTime', asc: false });
  };

  /**
   * 搜索
   * @param e
   */
  handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.fetch(fieldsValue);
    });
  };

  /**
   * 搜索form
   */
  searchForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div className={styles.searchForm}>
        <Form layout="inline" onSubmit={this.handleSearch}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col xs={24} sm={24} md={8} lg={6}>
              <FormItem label="账户">
                {getFieldDecorator('username')(
                  <Input autoComplete="off" allowClear placeholder="请输入用户名" />,
                )}
              </FormItem>
            </Col>
            <Col xs={24} sm={24} md={8} lg={6}>
              <FormItem label="状态">
                {getFieldDecorator('status')(
                  <Select placeholder="请选择用户状态" allowClear style={{ width: '100%' }}>
                    <Option key={UserStatus.ENABLE} value={UserStatus.ENABLE}>
                      启用
                    </Option>
                    <Option key={UserStatus.DISABLE} value={UserStatus.DISABLE}>
                      禁用
                    </Option>
                    <Option key={UserStatus.LOCKED} value={UserStatus.LOCKED}>
                      冻结
                    </Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col xs={24} sm={24} md={8} lg={6}>
              <span className={styles.submitButtons}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                  重置
                </Button>
              </span>
            </Col>
          </Row>
        </Form>
      </div>
    );
  };

  /**
   * onSelect
   */
  onSelect = (selectedKeys: string[]) => {
    const { form } = this.props;
    this.fetch({ groupId: selectedKeys });
    this.setState({ selectedRows: [] });
    form.resetFields();
  };

  handleSelectRows = (rows: TableListItem[]) => {
    this.setState({
      selectedRows: rows,
    });
  };

  /**
   * render
   */
  render(): React.ReactNode {
    const {
      user: { list },
      loading,
    } = this.props;
    const { selectedRows } = this.state;
    return (
      <div>
        {/* 内容区域 */}
        <PageHeaderWrapper content={formatMessage({ id: 'user.content.description' })}>
          <Row gutter={8}>
            {/* 左侧机构树 */}
            <Col span={5} md={4} sm={24}>
              <OrgSearchTree
                placeholder="请输入组织名称"
                searchValue=""
                title="组织机构"
                onSelect={(value: string[]) => {
                  this.onSelect(value);
                }}
              />
            </Col>
            {/* 右侧列表 */}
            <Col span={19} md={20} sm={24}>
              <Card bordered={false}>
                {/* 搜索框 */}
                {this.searchForm()}
                {/* 操作按钮栏 */}
                <Add onClick={this.addOnClick} authority="manage:operate:user:add" />
                <Update
                  onClick={() => {
                    this.updateOnClick(this.state.selectedRows.map(i => i.id)[0]);
                  }}
                  selectedRows={selectedRows}
                  authority="manage:operate:user:update"
                />
                <Remove
                  onClick={() => {
                    this.removeOnClick(this.state.selectedRows.map((i: any) => i.id));
                  }}
                  selectedRows={selectedRows}
                  authority="manage:operate:user:remove"
                />
                {/* 表格 */}
                <StandardTable<TableListItem>
                  data={list}
                  rowKey={record => `${record.id}`}
                  fetch={this.fetch}
                  columns={this.columns}
                  loading={loading}
                  selectedRows={selectedRows}
                  onSelectRow={this.handleSelectRows}
                />
              </Card>
            </Col>
          </Row>
        </PageHeaderWrapper>
        <UserForm />
        <SetPassWord
          id={this.state.passWordId}
          loading={this.state.passWordLoading}
          visible={this.state.passWordVisible}
          onClose={() => {
            this.setState({ passWordVisible: false });
          }}
          handleSubmit={(value, callback) => {
            this.setState({ passWordLoading: true });
            const { dispatch } = this.props;
            dispatch({
              type: 'user/updatePassword',
              payload: { id: value.id, password: value.password },
              callback: () => {
                this.setState({ passWordVisible: false });
                callback();
              },
            });
          }}
        />
      </div>
    );
  }
}

export default Form.create<TableListProps>()(Index);

export interface SetPassWordProps extends FormComponentProps {
  id?: string;
  loading: boolean;
  visible: boolean;
  onClose: () => void;
  handleSubmit: (values: any, callback: () => void) => void;
}

class PassWord extends React.PureComponent<SetPassWordProps> {
  state = {
    confirmDirty: false,
  };

  handleConfirmBlur = (e: any) => {
    const { value } = e.target;
    const { confirmDirty } = this.state;
    this.setState({ confirmDirty: confirmDirty || !!value });
  };

  compareToFirstPassword = (rule: any, value: any, callback: any) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('passwordHash')) {
      callback('您输入的两个密码不一致');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule: any, value: any, callback: any) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Modal
        title="设置密码"
        width={530}
        onCancel={this.props.onClose}
        maskClosable={false}
        visible={this.props.visible}
        footer={[
          <Button key="back" onClick={this.props.onClose}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={this.props.loading}
            onClick={(e: React.FormEvent) => {
              const { form } = this.props;
              form.validateFieldsAndScroll((err: Array<string>, values) => {
                e.preventDefault();
                if (!err) {
                  this.props.handleSubmit(values, () => {
                    form.resetFields();
                  });
                }
              });
            }}
          >
            提交
          </Button>,
        ]}
      >
        <Form layout="horizontal" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
          <Row>
            {getFieldDecorator('id', {
              initialValue: this.props.id,
            })(<Input type="hidden" />)}
            <Form.Item label="登录密码">
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: '请输入登录密码!',
                  },
                  {
                    validator: this.validateToNextPassword,
                  },
                ],
              })(<Input.Password placeholder="请输入登录密码" />)}
            </Form.Item>
            <Form.Item label="确认密码">
              {getFieldDecorator('confirm', {
                rules: [
                  {
                    required: true,
                    message: '请输入确认密码!',
                  },
                  {
                    validator: this.compareToFirstPassword,
                  },
                ],
              })(<Input.Password onBlur={this.handleConfirmBlur} placeholder="请输入确认密码" />)}
            </Form.Item>
          </Row>
        </Form>
      </Modal>
    );
  }
}
const SetPassWord = Form.create<SetPassWordProps>()(PassWord);
