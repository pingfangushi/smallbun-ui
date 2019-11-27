import React, { Fragment } from 'react';
import { Action, Dispatch } from 'redux';
import { connect } from 'dva';
import { FormComponentProps } from 'antd/es/form';
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Icon,
  Input,
  Popconfirm,
  Row,
  Select,
  Switch,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { formatMessage } from 'umi-plugin-react/locale';
import { ColumnProps } from 'antd/lib/table';
import moment from 'moment';
import RoleForm from './form';
import { ModelType, StateType } from './model';
import { TableListItem } from './data.d';
import styles from './style.less';
import { Open } from '@/pages/typings';
import { Add, Remove, Update } from '@/components/OpenButton';

import StandardTable from '@/components/StandardTable';
import RoleAuthorize from '@/pages/role/auth';
import Authorized from '@/components/Authorized/Authorized';
import { RoleStatus } from '@/pages/role/typings';


const FormItem = Form.Item;
const { Option } = Select;

/**
 * TableListProps
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/9/20 18:00
 */
interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<'role/form' | 'role/fetch' | 'role/remove' | 'role/updateStatus' | 'role/fetchAuthorize'>
  >;
  loading: boolean;
  role: StateType;
}

/**
 * TableListState
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/9/20 18:01
 */
interface TableListState {
  selectedRows: TableListItem[];
}

@connect(
  ({ role, loading }: { role: ModelType; loading: { effects: { [key: string]: boolean } } }) => ({
    role,
    loading: loading.effects['role/fetch'],
  }),
)
/**
 * 角色管理
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/8/27 16:46
 */
class Index extends React.Component<TableListProps, TableListState> {
  /**
   * state默认值
   */
  state: TableListState = {
    selectedRows: [],
  };

  /**
   * 表格columns
   */
  columns: ColumnProps<TableListItem>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '编码',
      dataIndex: 'code',
      align: 'center',
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      sorter: true,
      render: (text, record) => (
        <Switch
          onClick={(checked: boolean) => {
            const { dispatch } = this.props;
            dispatch({
              type: 'role/updateStatus',
              payload: {
                id: record.id,
                status: checked ? RoleStatus.ENABLE : RoleStatus.DISABLE,
              },
            });
          }}
          checkedChildren="启用"
          unCheckedChildren="禁用"
          checked={text === RoleStatus.ENABLE}
        />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      render: (val: string) => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      align: 'center',
      render: text => (
        <Fragment>
          <Authorized authority="manage:operate:role:config" noMatch={<></>}>
            <a onClick={this.authorizeOnClick.bind(this, text.id)}>授权</a>
          </Authorized>
          <Authorized authority="manage:operate:role:update" noMatch={<></>}>
            <Divider type="vertical" />
            <a onClick={this.updateOnClick.bind(this, text.id)}>
              {formatMessage({ id: 'edit.name' })}
            </a>
          </Authorized>
          <Authorized authority="manage:operate:role:remove" noMatch={<></>}>
            <Divider type="vertical" />
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
        </Fragment>
      ),
    },
  ];

  /**
   * 组件安装完毕
   */
  componentDidMount(): void {
    this.fetch({ sorter: 'lastModifiedTime', asc: false });
  }

  /**
   * handleSelectRows
   * @param rows
   */
  handleSelectRows = (rows: TableListItem[]) => {
    this.setState({
      selectedRows: rows,
    });
  };

  /**
   * fetch
   */
  fetch = (params?: {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/fetch',
      payload: params,
    });
  };

  /**
   * addOnClick
   */
  addOnClick = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/form',
      payload: { type: Open.ADD },
    });
  };

  /**
   * updateOnClick
   */
  updateOnClick = (id: string) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/form',
      payload: { type: Open.UPDATE, id },
    });
  };

  /**
   * authorizeOnClick
   */
  authorizeOnClick = (id: string) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/fetchAuthorize',
      payload: { visible: true, id },
    });
  };

  /**
   * removeOnClick
   */
  removeOnClick = (ids: string[]) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/remove',
      payload: { ids },
      callback: () => {
        this.setState({ selectedRows: [] });
      },
    });
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
   * 点击取消，清除表单数据
   */
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.fetch({ sorter: 'lastModifiedTime', asc: false });
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
            <Col span={8} xs={8} md={8} sm={24}>
              <FormItem label="角色名称">
                {getFieldDecorator('name')(
                  <Input autoComplete="off" allowClear placeholder="请输入角色名称" />,
                )}
              </FormItem>
            </Col>
            <Col span={8} xs={8} md={8} sm={24}>
              <FormItem label="角色状态">
                {getFieldDecorator('status')(
                  <Select placeholder="请选择角色状态" allowClear style={{ width: '100%' }}>
                    <Option key={RoleStatus.ENABLE} value={RoleStatus.ENABLE}>
                      启用
                    </Option>
                    <Option key={RoleStatus.DISABLE} value={RoleStatus.DISABLE}>
                      禁用
                    </Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={8} xs={8} md={8} sm={24}>
              <span className={styles.submitButtons}>
                <Button type="primary" htmlType="submit">
                  {formatMessage({ id: 'search.inquire' })}
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                  {formatMessage({ id: 'search.reset' })}
                </Button>
              </span>
            </Col>
          </Row>
        </Form>
      </div>
    );
  };

  /**
   * render
   */
  render(): React.ReactNode {
    const {
      role: { list: data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;
    return (
      <div>
        <PageHeaderWrapper content={formatMessage({ id: 'role.content.description' })}>
          <Card bordered={false}>
            {/* 搜索框 */}
            {this.searchForm()}
            {/* 操作按钮 */}
            <Add onClick={this.addOnClick} authority="manage:operate:role:add" />
            <Update
              onClick={() => {
                this.updateOnClick(this.state.selectedRows.map(i => i.id)[0]);
              }}
              selectedRows={selectedRows}
              authority="manage:operate:role:update"
            />
            <Remove
              onClick={() => {
                this.removeOnClick(this.state.selectedRows.map((i: any) => i.id));
              }}
              selectedRows={selectedRows}
              authority="manage:operate:role:remove"
            />
            {/* 表格 */}
            <StandardTable<TableListItem>
              data={data}
              fetch={this.fetch}
              columns={this.columns}
              rowKey={record => `${record.id}`}
              loading={loading}
              selectedRows={selectedRows}
              onSelectRow={this.handleSelectRows}
            />
          </Card>
        </PageHeaderWrapper>
        <RoleForm />
        <RoleAuthorize />
      </div>
    );
  }
}

export default Form.create<TableListProps>()(Index);
