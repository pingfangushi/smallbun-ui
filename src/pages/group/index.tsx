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
  message,
  notification,
  Popconfirm,
  Row,
  Select,
  Table,
  Switch,
  Tag,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { formatMessage } from 'umi-plugin-react/locale';
import { ColumnProps } from 'antd/lib/table';
import moment from 'moment';
import OrgForm from './form';
import StandardTable from '@/components/StandardTable';
import { ModelType, StateType } from '@/models/group';
import { TableListItem } from './data.d';
import styles from './style.less';
import { Open, Result, Status } from '@/pages/typings';
import { Add, Remove } from '@/components/OpenButton';
import { findDict } from '@/utils/dict';
import Authorized from '@/components/Authorized/Authorized';
import { GroupStatus } from '@/pages/group/typings';

const FormItem = Form.Item;
const { Option } = Select;

/**
 * TableListProps
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/9/20 18:00
 */
interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<Action<'group/form' | 'group/fetch' | 'group/remove' | 'group/updateStatus'>>;
  loading: boolean;
  group: StateType;
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
  ({ group, loading }: { group: ModelType; loading: { effects: { [key: string]: boolean } } }) => ({
    group,
    loading: loading.effects['group/fetch'],
  }),
)
/**
 * 部门管理
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/10/9 10:25
 */
class Index extends React.Component<TableListProps, TableListState> {
  /**
   * state默认值
   */
  state: TableListState = { selectedRows: [] };

  /**
   * 表格columns
   */
  columns: ColumnProps<TableListItem>[] = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '编码',
      dataIndex: 'code',
      align: 'center',
    },
    {
      title: '类型',
      dataIndex: 'type',
      align: 'center',
      render: text => {
        const status = findDict('GROUP_TYPE');
        return status
          ? status.items.map(value => {
              if (value.value === text) {
                return (
                  <Tag color={value.color} key={value.value}>
                    {value.label}
                  </Tag>
                );
              }
              return null;
            })
          : null;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      render: (text, record) => (
        <Switch
          onClick={(checked: boolean) => {
            const { dispatch } = this.props;
            dispatch({
              type: 'group/updateStatus',
              payload: {
                id: record.id,
                status: checked ? GroupStatus.ENABLE : GroupStatus.DISABLE,
              },
            });
          }}
          checkedChildren="启用"
          unCheckedChildren="禁用"
          checked={text === GroupStatus.ENABLE}
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
          <Authorized authority="manage:operate:group:add" noMatch={<></>}>
            <>
              <Button
                type="link"
                size="small"
                title="新增下级机构"
                disabled={text.status === GroupStatus.DISABLE}
                onClick={() => {
                  this.addOnClick(text.id);
                }}
              >
                {formatMessage({ id: 'add.name' })}
              </Button>
              <Divider type="vertical" />
            </>
          </Authorized>
          <Authorized authority="manage:operate:group:update" noMatch={<></>}>
            <a onClick={this.updateOnClick.bind(this, text.id)}>
              {formatMessage({ id: 'edit.name' })}
            </a>
          </Authorized>
          <Authorized authority="manage:operate:group:remove" noMatch={<></>}>
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
    this.fetch();
  }

  /**
   * fetch
   */
  fetch = (params?: {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'group/fetch',
      payload: params,
    });
  };

  /**
   * addOnClick
   */
  addOnClick = (parentId: string) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'group/form',
      payload: { type: Open.ADD, parentId },
    });
  };

  /**
   * updateOnClick
   */
  updateOnClick = (id: string) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'group/form',
      payload: { type: Open.UPDATE, id },
    });
  };

  /**
   * removeOnClick
   */
  removeOnClick = (ids: string[]) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'group/remove',
      payload: { ids },
      callback: (response: Result<object>) => {
        if (response.status === Status.SUCCESS) {
          message.success(response.message);
          dispatch({ type: 'group/fetch' });
          return;
        }
        // 错误提示
        notification.error({
          placement: 'bottomRight',
          message: '提示',
          description: response.message,
        });
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
    this.fetch();
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
            <Col xs={24} sm={24} md={8} xxl={6}>
              <FormItem label="机构名称">
                {getFieldDecorator('name')(
                  <Input autoComplete="off" placeholder="请输入角色名称" />,
                )}
              </FormItem>
            </Col>
            <Col xs={24} sm={24} md={8} xxl={6}>
              <FormItem label="机构状态">
                {getFieldDecorator('status')(
                  <Select placeholder="请选择机构状态" allowClear style={{ width: '100%' }}>
                    <Option key={GroupStatus.ENABLE} value={GroupStatus.ENABLE}>
                      启用
                    </Option>
                    <Option key={GroupStatus.DISABLE} value={GroupStatus.DISABLE}>
                      禁用
                    </Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col xs={24} sm={24} md={8} xxl={6}>
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
   * handleSelectRows
   * @param rows
   */
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
      group: { list: data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;
    return (
      <div>
        <PageHeaderWrapper content={formatMessage({ id: 'group.content.description' })}>
          <Card bordered={false}>
            {/* 搜索框 */}
            {this.searchForm()}
            {/* 操作按钮 */}
            <Add
              onClick={() => {
                this.addOnClick('0');
              }}
              authority="manage:operate:group:add"
            />
            <Remove
              onClick={() => {
                this.removeOnClick(this.state.selectedRows.map((i: any) => i.id));
              }}
              selectedRows={selectedRows}
              authority="manage:operate:group:remove"
            />
            {/* 表格,没有数据无法展开表格因为用了defaultExpandAllRows,没有数据使用默认table为了制造空状态 */}
            {data && data.list && data.list.length > 0 ? (
              <StandardTable<TableListItem>
                rowKey={record => `${record.id}`}
                data={data}
                fetch={this.fetch}
                columns={this.columns}
                defaultExpandAllRows
                loading={loading}
                selectedRows={selectedRows}
                onSelectRow={this.handleSelectRows}
              />
            ) : (
              <Table<TableListItem> columns={this.columns} dataSource={undefined} />
            )}
          </Card>
        </PageHeaderWrapper>
        <OrgForm />
      </div>
    );
  }
}

export default Form.create<TableListProps>()(Index);
