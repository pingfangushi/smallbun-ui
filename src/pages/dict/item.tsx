import React, { Fragment } from 'react';
import { FormComponentProps } from 'antd/es/form';
import {
  Button,
  Card,
  Col,
  Divider,
  Drawer,
  Form,
  Icon,
  Input,
  Popconfirm,
  Row,
  Switch,
  Modal,
  InputNumber,
} from 'antd';
import { connect } from 'dva';
import { Action, Dispatch } from 'redux';
import { formatMessage } from 'umi-plugin-react/locale';
import { ColumnProps } from 'antd/lib/table';
import { ChromePicker } from 'react-color';
import { StateType } from './model';
import { Open } from '@/pages/typings';
import { Add } from '@/components/OpenButton';
import StandardTable from '@/components/StandardTable';
import styles from './style.less';
import { TypeTableListItem, ItemTableListItem } from './data.d';
import Authorized from '@/components/Authorized/Authorized';
import { DefaultItem } from '@/pages/dict/typings';

const { TextArea } = Input;
const FormItem = Form.Item;

interface dictTableListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<'dict/itemForm' | 'dict/fetchItems' | 'dict/removeItem' | 'dict/updateDefault'>
  >;
  loading: boolean;
  dict: StateType;
}

interface dictTableListState {
  searchValues: { [key: string]: string };
}

/**
 * 字典值列表
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/10/12 17:58
 */
@connect(
  ({ dict, loading }: { dict: StateType; loading: { effects: { [key: string]: boolean } } }) => ({
    dict,
    loading: loading.effects['dict/fetchItems'],
  }),
)
class DictItem extends React.PureComponent<dictTableListProps, dictTableListState> {
  /**
   * 表格columns
   */
  columns: ColumnProps<ItemTableListItem>[] = [
    {
      title: '字典标签',
      dataIndex: 'label',
      align: 'center',
    },
    {
      title: '字典值',
      dataIndex: 'value',
      align: 'center',
    },
    {
      title: '默认项',
      dataIndex: 'isDefault',
      align: 'center',
      render: (text, record) => (
        <Switch
          onClick={(checked: boolean) => {
            const { dispatch } = this.props;
            dispatch({
              type: 'dict/updateDefault',
              payload: {
                id: record.id,
                isDefault: checked ? DefaultItem.YES : DefaultItem.NO,
              },
            });
          }}
          checkedChildren="是"
          unCheckedChildren="否"
          checked={text === DefaultItem.YES}
        />
      ),
    },
    {
      title: '排序',
      dataIndex: 'sort',
      align: 'center',
      sorter: true,
    },
    {
      title: '操作',
      align: 'center',
      render: text => (
        <Fragment>
          <Authorized authority="manage:operate:dict:update" noMatch={<></>}>
            <a
              onClick={() => {
                this.updateOnClick(text.id);
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
   * fetch
   */
  fetch = (params?: any) => {
    const { dispatch } = this.props;
    dispatch({ type: 'dict/fetchItems', payload: params });
  };

  /**
   * addOnClick
   */
  addOnClick = () => {
    const { dispatch } = this.props;
    const {
      dict: {
        item: {
          type: { id },
        },
      },
    } = this.props;
    dispatch({
      type: 'dict/itemForm',
      payload: {
        operating: Open.ADD,
        fields: { type: id, color: 'green', sort: 9999 },
        visible: true,
      },
    });
  };

  /**
   * updateOnClick
   */
  updateOnClick = (id: string) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dict/itemForm',
      payload: { visible: true, id, operating: Open.UPDATE },
    });
  };

  /**
   * removeOnClick
   */
  removeOnClick = (ids: string[]) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dict/removeItem',
      payload: { ids },
      callback: () => {},
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
        <Form layout="inline">
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col span={12} xs={12} md={12} sm={24}>
              <FormItem label="字典标签">
                {getFieldDecorator('label')(
                  <Input autoComplete="off" allowClear placeholder="请输入字典标签" />,
                )}
              </FormItem>
            </Col>
            <Col span={12} xs={12} md={12} sm={24}>
              <span className={styles.submitButtons}>
                <Button
                  type="primary"
                  onClick={() => {
                    const {
                      dispatch,
                      form,
                      dict: {
                        item: { type },
                      },
                    } = this.props;
                    dispatch({
                      type: 'dict/fetchItems',
                      payload: {
                        ...form.getFieldsValue(),
                        type,
                        visible: true,
                      },
                    });
                  }}
                >
                  {formatMessage({ id: 'search.inquire' })}
                </Button>
                <Button
                  style={{ marginLeft: 10 }}
                  onClick={() => {
                    const {
                      dispatch,
                      form,
                      dict: {
                        item: { type },
                      },
                    } = this.props;
                    form.resetFields();
                    dispatch({
                      type: 'dict/fetchItems',
                      payload: {
                        sorter: 'sort',
                        asc: true,
                        visible: true,
                        type,
                      },
                    });
                  }}
                >
                  {formatMessage({ id: 'search.reset' })}
                </Button>
              </span>
            </Col>
          </Row>
        </Form>
      </div>
    );
  };

  render(): React.ReactNode {
    const {
      dict: {
        item: { visible, list, type = {} },
      },
    } = this.props;
    const { loading } = this.props;
    return (
      <div>
        <Drawer
          title={`${type.name ? `${type.name}：` : ''}字典列表`}
          width={850}
          onClose={() => {
            const { dispatch } = this.props;
            dispatch({
              type: 'dict/fetchItems',
              payload: { visible: false },
            });
          }}
          visible={visible}
        >
          <Card bordered={false}>
            {/* 搜索 */}
            {this.searchForm()}
            {/* 操作按钮 */}
            <Add onClick={this.addOnClick} authority="manage:operate:dict:add" />
            {/* 表格 */}
            <StandardTable<TypeTableListItem>
              data={list}
              rowKey={record => `${record.id}`}
              fetch={this.fetch}
              columns={this.columns}
              loading={loading}
              rowSelection={undefined}
              prompt={false}
            />
          </Card>
          <DictItemForm />
        </Drawer>
      </div>
    );
  }
}

export default Form.create()(DictItem);

/**
 * 字典值form
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/10/12 11:32
 */
export interface dictFormProps extends FormComponentProps {
  visible: boolean;
  dispatch: Dispatch<
    Action<'dict/submitItem' | 'dict/itemForm' | 'dict/fetchItems' | 'dict/uniqueItem'>
  >;
  dict: StateType;
  loading: boolean;
}

export interface dictFormState {
  displayColorPicker?: boolean;
}

@connect(
  ({ dict, loading }: { dict: StateType; loading: { effects: { [key: string]: boolean } } }) => ({
    dict,
    loading: loading.effects['dict/submitItem'],
  }),
)
class ItemForm extends React.Component<dictFormProps, dictFormState> {
  state = {
    displayColorPicker: false,
  };

  /**
   * 确定
   */
  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields((err, values) => {
      if (err) return;
      dispatch({
        type: 'dict/submitItem',
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
    const { form, dispatch } = this.props;
    dispatch({ type: 'dict/itemForm', payload: { visible: false } });
    form.resetFields();
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
      type: 'dict/uniqueItem',
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
      form: { getFieldDecorator, setFieldsValue, getFieldValue },
      loading,
      dict: {
        item: {
          form: { visible, fields = {}, title },
        },
      },
    } = this.props;
    const { displayColorPicker = false } = this.state;
    return (
      <div>
        <Modal
          title={title}
          visible={visible}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              取消
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={this.handleSubmit}>
              提交
            </Button>,
          ]}
          width={610}
        >
          <Form labelCol={{ span: 3 }} wrapperCol={{ span: 20 }}>
            {getFieldDecorator('id', { initialValue: fields.id })(
              <Input autoComplete="off" disabled type="hidden" />,
            )}
            {getFieldDecorator('type', { initialValue: fields.type })(
              <Input autoComplete="off" disabled type="hidden" />,
            )}
            <Form.Item label="标签值">
              {getFieldDecorator('label', {
                validateTrigger: ['onFocus', 'onBlur'],
                initialValue: fields.label,
                rules: [
                  {
                    required: true,
                    validator: (rule, value, callback) => {
                      if (!value) {
                        callback('请输入字典标签值');
                        return;
                      }
                      this.validation(
                        rule,
                        value,
                        callback,
                        { id: fields.id, type: fields.type, label: value },
                        '已存在字典标签值',
                      );
                    },
                  },
                ],
              })(<Input autoComplete="off" placeholder="请输入字典标签值" />)}
            </Form.Item>
            <Form.Item label="字典值">
              {getFieldDecorator('value', {
                initialValue: fields.value,
                validateTrigger: ['onFocus', 'onBlur'],
                rules: [
                  {
                    required: true,
                    validator: (rule, value, callback) => {
                      if (!value) {
                        callback('请输入字典值');
                        return;
                      }
                      this.validation(
                        rule,
                        value,
                        callback,
                        { id: fields.id, type: fields.type, value },
                        '已存在字典值',
                      );
                    },
                  },
                ],
              })(<Input autoComplete="off" placeholder="请输入字典值" />)}
            </Form.Item>
            {/* 字典展示字体颜色 */}
            <Form.Item label="颜色">
              {getFieldDecorator('color', {
                initialValue: fields.color,
                rules: [{ required: true, message: '请选择颜色值!' }],
              })(
                <Input
                  autoComplete="off"
                  addonAfter={
                    <div>
                      <Icon
                        onClick={() => {
                          this.setState({ displayColorPicker: !displayColorPicker });
                        }}
                        type="bg-colors"
                        style={{
                          color: getFieldValue('color') ? getFieldValue('color') : fields.color,
                        }}
                      />
                      {displayColorPicker ? (
                        <div style={{ position: 'absolute', zIndex: 2 }}>
                          <div
                            style={{
                              position: 'fixed',
                              top: '0px',
                              right: '0px',
                              bottom: '0px',
                              left: '0px',
                            }}
                            onClick={() => {
                              this.setState({ displayColorPicker: false });
                            }}
                          />
                          <ChromePicker
                            onChange={(value: any) => {
                              setFieldsValue({ color: value.hex });
                            }}
                            color={getFieldValue('color')}
                          />
                        </div>
                      ) : (
                        <div />
                      )}
                    </div>
                  }
                />,
              )}
            </Form.Item>
            <Form.Item label="排序">
              {getFieldDecorator('sort', { initialValue: fields.sort })(<InputNumber />)}
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
      </div>
    );
  }
}

const DictItemForm = Form.create()(ItemForm);
