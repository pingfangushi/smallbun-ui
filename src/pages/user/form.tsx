import { Button, Col, Form, Input, Modal, Radio, Row, Select, TreeSelect, Alert } from 'antd';
import * as React from 'react';
import { FormComponentProps } from 'antd/es/form';
import { Action, Dispatch } from 'redux';
import { connect } from 'dva';
import { ValidateFieldsOptions } from 'antd/lib/form/Form';
import Divider from '@/components/Divider';
import { StateType } from './model';
import { StateType as GroupStateType } from '../group/model';
import { UserStatus } from './typings';
import { StateType as RoleStateType } from '@/pages/role/model';

const { Option } = Select;
const { TextArea } = Input;
const RadioGroup = Radio.Group;

export interface UserFormProps extends FormComponentProps {
  loading: boolean;
  dispatch: Dispatch<
    Action<'users/form' | 'users/fetch' | 'users/remove' | 'users/submit' | 'users/unique'>
  >;
  users: StateType;
  role: RoleStateType;
  group: GroupStateType;
}

// formItem布局
const formItemLayout = {
  labelCol: {
    md: { span: 4 },
  },
  wrapperCol: {
    md: { span: 20 },
  },
};

/**
 * UserForm
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/8/29 16:22
 */
@connect(
  ({
    users,
    group,
    role,
    loading,
  }: {
    users: StateType;
    group: GroupStateType;
    role: RoleStateType;
    loading: { effects: { [key: string]: boolean } };
  }) => ({
    users,
    group,
    role,
    loading: loading.effects['users/submit'],
  }),
)
class UserForm extends React.PureComponent<UserFormProps> {
  static defaultProps = {};

  /**
   * 隐藏
   */
  onClose = () => {
    // 清除表单数据
    this.props.form.resetFields();
    const {
      dispatch,
      role: {
        form: { type },
      },
    } = this.props;
    dispatch({
      type: 'users/form',
      payload: { visible: false, type },
    });
  };

  /**
   * Form 提交
   * @param e
   */
  handleSubmit = (e: React.FormEvent) => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err: Array<string>, values: ValidateFieldsOptions) => {
      if (!err) {
        // 提交
        dispatch({
          type: 'users/submit',
          payload: values,
          callback: () => {
            form.resetFields();
          },
        });
      }
    });
  };

  /**
   * 验证器
   * @param rule
   * @param value
   * @param callback
   * @param payload
   * @param message
   */
  validation(rule: any, value: any, callback: any, payload: {}, message: string) {
    const { dispatch } = this.props;
    // 唯一验证
    dispatch({
      type: 'users/unique',
      payload,
      callback: (unique: boolean) => {
        if (!unique) {
          callback(`${message}：${value}!`);
          return;
        }
        callback();
      },
    });
  }

  render() {
    const {
      loading,
      form: { getFieldDecorator },
      users: {
        form: { visible, title, fields = {} },
      },
      role: {
        list: { list: roles },
      },
      group: { tree },
    } = this.props;
    return (
      <Modal
        title={title}
        width={830}
        onCancel={this.onClose}
        maskClosable={false}
        visible={visible}
        confirmLoading={loading}
        footer={[
          <Button key="back" onClick={this.onClose}>
            取消
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={this.handleSubmit}>
            提交
          </Button>,
        ]}
      >
        <Alert
          message="用户名在系统唯一，不可重复、设置后将不可修改"
          type="warning"
          showIcon
          style={{ marginBottom: 20 }}
        />
        <Form layout="horizontal" onSubmit={this.handleSubmit}>
          <Divider title="基础信息" />
          <Row>
            <Col span={12}>
              {getFieldDecorator('id', {
                initialValue: fields.id,
              })(<Input type="hidden" />)}
              <Form.Item {...formItemLayout} label="账号">
                {getFieldDecorator('username', {
                  initialValue: fields.username,
                  validateTrigger: ['onFocus', 'onBlur'],
                  rules: [
                    {
                      required: true,
                      validator: (rule, value, callback) => {
                        if (!value) {
                          callback('请输入登录名称');
                          return;
                        }
                        this.validation(
                          rule,
                          value,
                          callback,
                          { id: fields.id, username: value },
                          '已存在登录名称',
                        );
                      },
                    },
                  ],
                })(<Input autoComplete="off" placeholder="请输入用户名" />)}
              </Form.Item>
              <Form.Item
                {...formItemLayout}
                label="角色"
              >
                {getFieldDecorator('roleIds', {
                  rules: [{ required: true, message: '请为用户分配角色' }],
                  initialValue: fields.roles && fields.roles.map(i => i.id),
                })(
                  <Select showSearch placeholder="请为用户分配角色" allowClear mode="multiple">
                    {roles &&
                    roles.map(value => (
                      <Option key={value.id} value={value.id}>
                        {value.name}
                      </Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              {getFieldDecorator('groupId', {
                initialValue: fields.group && fields.group.id,
              })(<Input type="hidden" />)}
              <Form.Item {...formItemLayout} label="组织">
                {getFieldDecorator('groupTreeSelect', {
                  initialValue:
                    fields.group && fields.group.id === '0'
                      ? '顶级节点'
                      : fields.group && fields.group.id,
                  rules: [
                    {
                      required: true,
                      message: '请选择归属组织!',
                    },
                  ],
                })(
                  <TreeSelect<string>
                    showSearch
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    placeholder="请选择归属组织"
                    treeDefaultExpandAll
                    treeNodeFilterProp="title"
                    treeData={tree}
                    autoClearSearchValue
                    onChange={(value, label, extra) => {
                      const { form } = this.props;
                      form.setFieldsValue({ groupId: extra.triggerNode.props.id });
                    }}
                  />,
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="状态">
                {getFieldDecorator('status', {
                  initialValue: fields.status || UserStatus.ENABLE,
                })(
                  <RadioGroup name="status">
                    <Radio key={UserStatus.ENABLE} value={UserStatus.ENABLE}>
                      正常
                    </Radio>
                    <Radio key={UserStatus.DISABLE} value={UserStatus.DISABLE}>
                      禁用
                    </Radio>
                    <Radio key={UserStatus.FREEZE} value={UserStatus.FREEZE}>
                      冻结
                    </Radio>
                  </RadioGroup>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Divider title="详细信息" />
          <Row>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="姓名">
                {getFieldDecorator('info.name', {
                  initialValue: fields.info && fields.info.name,
                })(<Input autoComplete="off" placeholder="请输入用户姓名" />)}
              </Form.Item>
              <Form.Item {...formItemLayout} label="邮箱">
                {getFieldDecorator('info.email', {
                  initialValue: fields.info && fields.info.email,
                  validateTrigger: ['onFocus', 'onBlur'],
                  rules: [
                    {
                      validator: (rule, value, callback) => {
                        if (value) {
                          const mailReg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
                          if (!mailReg.test(value)) {
                            callback('请输入正确的邮箱');
                            return;
                          }
                          this.validation(
                            rule,
                            value,
                            callback,
                            { id: fields.id, email: value },
                            '已存在邮箱',
                          );
                        }
                        callback();
                      },
                    },
                  ],
                })(<Input autoComplete="off" placeholder="请输入用户邮箱" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="手机">
                {getFieldDecorator('info.phone', {
                  initialValue: fields.info && fields.info.phone,
                  validateTrigger: ['onFocus', 'onBlur'],
                  rules: [
                    {
                      validator: (rule, value, callback) => {
                        if (value) {
                          const mailReg = /^1\d{10}$/;
                          if (!mailReg.test(value)) {
                            callback('请输入正确的手机号');
                            return;
                          }
                          this.validation(
                            rule,
                            value,
                            callback,
                            { id: fields.id, phone: value },
                            '已存在手机号',
                          );
                        }
                        callback();
                      },
                    },
                  ],
                })(<Input autoComplete="off" placeholder="请输入手机号" />)}
              </Form.Item>
              <Form.Item {...formItemLayout} label="身份证">
                {getFieldDecorator('info.idCard', {
                  initialValue: fields.info && fields.info.phone,
                  validateTrigger: ['onFocus', 'onBlur'],
                  rules: [
                    {
                      validator: (rule, value, callback) => {
                        if (value) {
                          const mailReg = /^1\d{10}$/;
                          if (!mailReg.test(value)) {
                            callback('请输入正确的手机号');
                            return;
                          }
                          this.validation(
                            rule,
                            value,
                            callback,
                            { id: fields.id, idCard: value },
                            '已存在身份证号',
                          );
                        }
                        callback();
                      },
                    },
                  ],
                })(<Input autoComplete="off" placeholder="请输入身份证号" />)}
              </Form.Item>
            </Col>
          </Row>
          <Divider title="其他信息" />
          <Row>
            <Col span={24}>
              <Form.Item
                labelCol={{ md: { span: 2 } }}
                wrapperCol={{ md: { span: 22 } }}
                label="备注"
              >
                {getFieldDecorator('remarks', {
                  initialValue: fields.remarks,
                })(<TextArea autoComplete="off" rows={3} placeholder="请输入备注信息" />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: 'form' })(UserForm);
