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
  Switch,
} from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { ColumnProps } from 'antd/lib/table';
import StandardTable from '@/components/StandardTable';
import { ModelType, StateType } from './model';
import { StateType as DictValueStateType } from '../value/model';
import { TypeTableListItem } from './data.d';
import styles from './style.less';
import { Open, Result, Status, StatusEnum } from '@/pages/typeings';
import { Add, Remove } from '@/components/OpenButton';
import DictTypeForm from '@/pages/dict/type/form';
import Authorized from '@/components/Authorized/Authorized';

const FormItem = Form.Item;
const { Option } = Select;

interface DictTableListProps extends FormComponentProps {
  loading: boolean;
  dispatch: Dispatch<
    Action<
      | 'dictType/form'
      | 'dictType/fetch'
      | 'dictType/submit'
      | 'dictType/remove'
      | 'dictType/updateStatusById'
      | 'dictValue/visible'
      | 'dictValue/fetch'
    >
  >;
  dictType: StateType;
  dictValue: DictValueStateType;
}

interface DictTableListState {
  selectedRows: TypeTableListItem[];
}

/**
 * 字典类型
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/8/27 16:46
 */
@connect(
  ({
    dictType,
    dictValue,
    loading,
  }: {
    dictType: ModelType;
    dictValue: DictValueStateType;
    loading: { models: { [key: string]: boolean } };
  }) => ({
    dictType,
    dictValue,
    loading: loading.models.dictType,
  }),
)
class DictTypeList extends React.Component<DictTableListProps, DictTableListState> {
  state = {
    selectedRows: [],
  };

  /**
   * 表格columns
   */
  columns: ColumnProps<TypeTableListItem>[] = [
    {
      title: '类型名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '类型编码',
      dataIndex: 'code',
      align: 'center',
      sorter: true,
    },
    {
      title: '字典状态',
      dataIndex: 'status',
      align: 'center',
      sorter: true,
      render: (text, record) => (
        <Switch
          onClick={(checked: boolean) => {
            const { dispatch } = this.props;
            dispatch({
              type: 'dictType/updateStatusById',
              payload: {
                id: record.id,
                status: checked ? StatusEnum.ENABLE : StatusEnum.DISABLE,
              },
            });
          }}
          checkedChildren="启用"
          unCheckedChildren="禁用"
          checked={text === StatusEnum.ENABLE}
        />
      ),
    },
    {
      title: '操作',
      align: 'center',
      render: text => (
        <Fragment>
          <Authorized authority="manage:operate:dict:item" noMatch={<></>}>
            <a
              onClick={() => {
                const { dispatch } = this.props;
                // 传递字典类型数据
                dispatch({ type: 'dictValue/visible', payload: { visible: true, type: text } });
                // 获取字典项数据
                dispatch({ type: 'dictValue/fetch' });
              }}
            >
              字典项
            </a>
          </Authorized>
          <Authorized authority="manage:operate:dict:update" noMatch={<></>}>
            <Divider type="vertical" />
            <a
              onClick={() => {
                const { dispatch } = this.props;
                dispatch({
                  type: 'dictType/form',
                  payload: { visible: true, type: Open.UPDATE, id: text.id },
                  callback: (response: Result<boolean>) => {
                    if (response.status === Status.SUCCESS) {
                      message.success(response.message);
                      dispatch({ type: 'dictType/fetch', payload: { id: text.id } });
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
              }}
            >
              {formatMessage({ id: 'edit.name' })}
            </a>
          </Authorized>
          <Authorized authority="manage:operate:dict:remove" noMatch={<></>}>
            <Divider type="vertical" />
            <Popconfirm
              className={styles.openButton}
              style={{ marginLeft: 70, clear: 'both', whiteSpace: 'nowrap' }}
              title={formatMessage({ id: 'dict.del.confirm.title' })}
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
   * removeOnClick
   */
  removeOnClick = (ids: string[]) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dictType/remove',
      payload: { ids },
      callback: () => {
        this.setState({ selectedRows: [] });
      },
    });
  };

  /**
   * handleSelectRows
   * @param rows
   */
  handleSelectRows = (rows: TypeTableListItem[]) => {
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
      type: 'dictType/fetch',
      payload: params,
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
           <Col xs={24} sm={24} md={6}>
              <FormItem label="类型名称">
                {getFieldDecorator('name')(
                  <Input autoComplete="off" allowClear placeholder="请输入类型名称" />,
                )}
              </FormItem>
            </Col>
           <Col xs={24} sm={24} md={6}>
              <FormItem label="字典状态">
                {getFieldDecorator('status')(
                  <Select placeholder="请选择字典状态" allowClear style={{ width: '100%' }}>
                    <Option value={StatusEnum.ENABLE}>启用</Option>
                    <Option value={StatusEnum.DISABLE}>禁用</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
           <Col xs={24} sm={24} md={6}>
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

  addOnClick = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dictType/form',
      payload: { visible: true, type: Open.ADD },
    });
  };

  /**
   * render
   */
  render(): React.ReactNode {
    const {
      dictType: { list: data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;
    return (
      <div>
        <PageHeaderWrapper content={formatMessage({ id: 'dict.type.content.description' })}>
          <Card bordered={false}>
            {/* 搜索框 */}
            {this.searchForm()}
            {/* 操作按钮 */}
            <Add onClick={this.addOnClick} authority="manage:operate:dict:add" />
            <Remove
              message={formatMessage({ id: 'dict.del.confirm.title' })}
              onClick={() => {
                this.removeOnClick(this.state.selectedRows.map((i: any) => i.id));
              }}
              selectedRows={selectedRows}
              authority="manage:operate:dict:remove"
            />
            {/* 表格 */}
            <StandardTable<TypeTableListItem>
              data={data}
              fetch={this.fetch}
              columns={this.columns}
              loading={loading}
              rowKey={record => `${record.id}`}
              selectedRows={selectedRows}
              onSelectRow={this.handleSelectRows}
            />
          </Card>
        </PageHeaderWrapper>
        <DictTypeForm />
      </div>
    );
  }
}

export default Form.create()(DictTypeList);
