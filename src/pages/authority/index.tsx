import React, { Fragment } from 'react';
import { Action, Dispatch } from 'redux';
import { connect } from 'dva';
import { FormComponentProps } from 'antd/es/form';
import { Button, Card, Col, Divider, Form, Icon, Input, Popconfirm, Row } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { formatMessage } from 'umi-plugin-react/locale';
import { ColumnProps } from 'antd/lib/table';
import moment from 'moment';
import { StateType } from '@/models/authority';
import { TableListItem } from './data.d';
import { Open } from '@/pages/typings';
import { Add, Remove, Update } from '@/components/OpenButton';

import style from '@/pages/authority/style.less';
import StandardTable from '@/components/StandardTable';
import AuthorityConfig from '@/pages/authority/config';
import AuthorityModule from '@/pages/authority/form';
import Authorized from '@/components/Authorized/Authorized';

const FormItem = Form.Item;

/**
 * TableListProps
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/9/20 18:00
 */
interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'authority/form'
      | 'authority/fetch'
      | 'authority/remove'
      | 'authority/config'
      | 'authorityRoutes/fetch'
    >
  >;
  loading: boolean;
  authority: StateType;
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
  ({
    authority,
    loading,
  }: {
    authority: StateType;
    loading: { effects: { [key: string]: boolean } };
  }) => ({
    authority,
    loading: loading.effects['logger/fetch'],
  }),
)
/**
 * 业务管理
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
      title: '权限名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '业务编码',
      dataIndex: 'code',
      align: 'center',
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      align: 'center',
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
          <Authorized authority="manage:operate:authority:config" noMatch={<></>}>
            <a onClick={this.configOnClick.bind(this, text.id)}>配置</a>
          </Authorized>
          <Authorized authority="manage:operate:authority:update" noMatch={<></>}>
            <Divider type="vertical" />
            <a onClick={this.updateOnClick.bind(this, text.id)}>
              {formatMessage({ id: 'edit.name' })}
            </a>
          </Authorized>
          <Authorized authority="manage:operate:authority:remove" noMatch={<></>}>
            <Divider type="vertical" />
            <Popconfirm
              className={style.openButton}
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
      type: 'authority/fetch',
      payload: params,
    });
  };

  /**
   * addOnClick
   */
  addOnClick = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'authority/form',
      payload: { type: Open.ADD },
    });
  };

  /**
   * updateOnClick
   */
  updateOnClick = (id: string) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'authority/form',
      payload: { type: Open.UPDATE, id },
    });
  };

  /**
   * configOnClick
   */
  configOnClick = (id: string) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'authority/config',
      payload: { authorize: id, visible: true },
    });
  };

  /**
   * removeOnClick
   */
  removeOnClick = (ids: string[]) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'authority/remove',
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
      <div className={style.searchForm}>
        <Form layout="inline" onSubmit={this.handleSearch}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
           <Col xs={24} sm={24} md={8} xxl={6}>
              <FormItem label="业务名称">
                {getFieldDecorator('name')(
                  <Input autoComplete="off" allowClear placeholder="请输入业务名称" />,
                )}
              </FormItem>
            </Col>
           <Col xs={24} sm={24} md={8} xxl={6}>
              <span className={style.submitButtons}>
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
   * render
   */
  render(): React.ReactNode {
    const {
      authority: { list: data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;
    return (
      <div>
        <PageHeaderWrapper content={formatMessage({ id: 'authority.content.description' })}>
          <Card bordered={false}>
            {/* 搜索框 */}
            {this.searchForm()}
            {/* 操作按钮 */}
            <Add onClick={this.addOnClick} authority="manage:operate:authority:add" />
            <Update
              onClick={() => {
                this.updateOnClick(this.state.selectedRows.map(i => i.id)[0]);
              }}
              selectedRows={selectedRows}
              authority="manage:operate:authority:update"
            />
            <Remove
              onClick={() => {
                this.removeOnClick(this.state.selectedRows.map((i: any) => i.id));
              }}
              selectedRows={selectedRows}
              authority="manage:operate:authority:remove"
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
        {/* 权限Form */}
        <AuthorityModule />
        {/* 权限配置 */}
        <AuthorityConfig />
      </div>
    );
  }
}

export default Form.create<TableListProps>()(Index);
