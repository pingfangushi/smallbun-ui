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
  Modal,
} from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { ColumnProps } from 'antd/lib/table';
import moment from 'moment';
import StandardTable from '@/components/StandardTable';
import { StateType } from './model';
import { TypeTableListItem } from './data.d';
import styles from './style.less';
import { Open, Result, Status } from '@/pages/typings';
import { Add, Remove } from '@/components/OpenButton';
import Authorized from '@/components/Authorized/Authorized';
import { TypeStatus } from '@/pages/dict/typings';

const { TextArea } = Input;
const FormItem = Form.Item;
const { Option } = Select;

interface DictTableListProps extends FormComponentProps {
  loading: boolean;
  dispatch: Dispatch<
    Action<
      | 'dict/typeForm'
      | 'dict/fetchTypes'
      | 'dict/fetchItems'
      | 'dict/submitType'
      | 'dict/removeType'
      | 'dict/updateStatus'
    >
  >;
  dict: StateType;
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
  ({ dict, loading }: { dict: StateType; loading: { effects: { [key: string]: boolean } } }) => ({
    dict,
    loading: loading.effects['dict/fetchTypes'],
  }),
)
class DictType extends React.Component<DictTableListProps, DictTableListState> {
  state = {
    selectedRows: [],
  };

  /**
   * 表格columns
   */
  columns: ColumnProps<TypeTableListItem>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '编码',
      dataIndex: 'code',
      align: 'center',
      sorter: true,
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
              type: 'dict/updateStatus',
              payload: {
                id: record.id,
                status: checked ? TypeStatus.ENABLE : TypeStatus.DISABLE,
              },
            });
          }}
          checkedChildren="启用"
          unCheckedChildren="禁用"
          checked={text === TypeStatus.ENABLE}
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
          <Authorized authority="manage:operate:dict:item" noMatch={<></>}>
            <a
              onClick={() => {
                const { dispatch } = this.props;
                // 获取字典项数据
                dispatch({
                  type: 'dict/fetchItems',
                  payload: {
                    sorter: 'sort',
                    asc: true,
                    type: text,
                    visible: true,
                  },
                });
              }}
            >
              字典项
            </a>
          </Authorized>
          <Authorized authority="manage:operate:dict:update" noMatch={<></>}>
            <Divider type="vertical" />
            <a onClick={this.updateOnClick.bind(this, text.id)}>
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
   * 新增
   */
  addOnClick = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dict/typeForm',
      payload: { visible: true, operating: Open.ADD },
    });
  };

  /**
   * 修改
   * @param id
   */
  updateOnClick = (id: string) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dict/typeForm',
      payload: { visible: true, operating: Open.UPDATE, id },
      callback: (response: Result<boolean>) => {
        if (response.status === Status.SUCCESS) {
          message.success(response.message);
          dispatch({ type: 'dict/fetchTypes', payload: { id } });
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
   * removeOnClick
   */
  removeOnClick = (ids: string[]) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dict/removeType',
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
      type: 'dict/fetchTypes',
      payload: { ...params },
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
            <Col span={8} xs={8} md={8} sm={24}>
              <FormItem label="类型名称">
                {getFieldDecorator('name')(
                  <Input autoComplete="off" allowClear placeholder="请输入类型名称" />,
                )}
              </FormItem>
            </Col>
            <Col span={8} xs={8} md={8} sm={24}>
              <FormItem label="字典状态">
                {getFieldDecorator('status')(
                  <Select placeholder="请选择字典状态" allowClear style={{ width: '100%' }}>
                    <Option value={TypeStatus.ENABLE}>启用</Option>
                    <Option value={TypeStatus.DISABLE}>禁用</Option>
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
      dict: {
        type: { list: data },
      },
    } = this.props;
    const { loading } = this.props;
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
          <DictTypeForm />
        </PageHeaderWrapper>
      </div>
    );
  }
}

export default Form.create()(DictType);

/**
 * 字典类型form
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/10/12 11:33
 */
export interface DictTypeFormProps extends FormComponentProps {
  visible: boolean;
  dispatch: Dispatch<
    Action<'dict/submitType' | 'dict/typeForm' | 'dict/fetchTypes' | 'dict/uniqueType'>
  >;
  dict: StateType;
  loading: boolean;
}

@connect(
  ({ dict, loading }: { dict: StateType; loading: { effects: { [key: string]: boolean } } }) => ({
    dict,
    loading: loading.effects['dict/submitType'],
  }),
)
class TypeForm extends React.PureComponent<DictTypeFormProps> {
  /**
   * 确定
   */
  handleSubmit = (e: React.FormEvent) => {
    const { form, dispatch } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (err) return;
      dispatch({
        type: 'dict/submitType',
        payload: values,
        callback() {
          form.resetFields();
        },
      });
    });
  };

  /**
   * 取消
   */
  handleCancel = () => {
    const { dispatch } = this.props;
    this.props.form.resetFields();
    dispatch({ type: 'dict/typeForm', payload: { visible: false } });
  };

  /**
   * 验证器
   * @param rule
   * @param value
   * @param callback
   * @param payload
   * @param prompt
   */
  validation(rule: any, value: any, callback: any, payload: {}, prompt: string) {
    const { dispatch } = this.props;
    // 唯一验证
    dispatch({
      type: 'dict/uniqueType',
      payload,
      callback: (unique: boolean) => {
        if (!unique) {
          callback(`${prompt}：${value}!`);
          return;
        }
        callback();
      },
    });
  }

  render(): React.ReactNode {
    const {
      form: { getFieldDecorator },
      loading,
      dict: {
        type: {
          form: { visible, fields = {}, title },
        },
      },
    } = this.props;
    return (
      <Modal
        title={title}
        visible={visible}
        width={600}
        onCancel={this.handleCancel}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            取消
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={this.handleSubmit}>
            提交
          </Button>,
        ]}
      >
        <Form layout="horizontal" labelCol={{ span: 3 }} wrapperCol={{ span: 20 }}>
          {getFieldDecorator('id', {
            initialValue: fields.id,
          })(<Input autoComplete="off" type="hidden" />)}
          {getFieldDecorator('status', {
            initialValue: fields.status || TypeStatus.ENABLE,
          })(<Input autoComplete="off" type="hidden" />)}
          <Form.Item label="名称">
            {getFieldDecorator('name', {
              initialValue: fields.name,
              validateTrigger: ['onFocus', 'onBlur'],
              rules: [
                {
                  required: true,
                  validator: (rule, value, callback) => {
                    if (!value) {
                      callback('请输入字典类型名称');
                      return;
                    }
                    this.validation(
                      rule,
                      value,
                      callback,
                      { id: fields.id, name: value },
                      '已存在字典类型名称',
                    );
                  },
                },
              ],
            })(<Input autoComplete="off" placeholder="请输入字典类型名称" />)}
          </Form.Item>
          <Form.Item label="编码">
            {getFieldDecorator('code', {
              validateTrigger: ['onFocus', 'onBlur'],
              initialValue: fields.code,
              rules: [
                {
                  required: true,
                  validator: (rule, value, callback) => {
                    if (!value) {
                      callback('请输入字典类型编码');
                      return;
                    }
                    this.validation(
                      rule,
                      value,
                      callback,
                      { id: fields.id, code: value },
                      '已存在字典类型编码',
                    );
                  },
                },
              ],
            })(<Input autoComplete="off" placeholder="请输入字典类型编码" />)}
          </Form.Item>
          <Form.Item label="备注">
            {getFieldDecorator('remarks', { initialValue: fields.remarks })(
              <TextArea
                autoComplete="off"
                placeholder="请输入备注信息"
                autoSize={{ minRows: 3, maxRows: 5 }}
              />,
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

const DictTypeForm = Form.create()(TypeForm);
