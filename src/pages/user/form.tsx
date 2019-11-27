import { Button, Form, Input, Modal, Select, TreeSelect, Alert, Radio } from 'antd';
import * as React from 'react';
import { FormComponentProps } from 'antd/es/form';
import { Action, Dispatch } from 'redux';
import { connect } from 'dva';
import { Open } from '@/pages/typings';
import { StateType } from './model';
import { StateType as GroupStateType } from '../group/model';
import { StateType as RoleStateType } from '@/pages/role/model';
import { UserStatus } from '@/pages/user/typings';

const RadioGroup = Radio.Group;
const { Option } = Select;

export interface UserFormProps extends FormComponentProps {
  loading: boolean;
  dispatch: Dispatch<
    Action<'users/form' | 'users/fetch' | 'users/remove' | 'users/submit' | 'users/unique'>
  >;
  users: StateType;
  role: RoleStateType;
  group: GroupStateType;
}

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
  /**
   * 隐藏
   */
  onClose = () => {
    // 清除表单数据
    this.props.form.resetFields();
    const { dispatch } = this.props;
    dispatch({
      type: 'users/form',
      payload: { visible: false },
    });
  };

  /**
   * Form 提交
   * @param e
   */
  handleSubmit = (e: React.FormEvent) => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err: Array<string>, values) => {
      if (!err) {
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
      role: {
        list: { list: roles },
      },
      users: {
        form: { visible, title, fields = {}, type: open },
      },
      group: { tree },
    } = this.props;
    return (
      <Modal
        title={title}
        width={620}
        maskClosable={false}
        destroyOnClose
        onCancel={this.onClose}
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
        {open === Open.ADD && (
          <Alert
            message="密码为系统初始密码，用户账号在系统唯一，不可重复、设置后将不可修改"
            type="info"
            showIcon
            style={{ marginBottom: 20 }}
          />
        )}
        <Form
          layout="horizontal"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 20 }}
          onSubmit={this.handleSubmit}
        >
          {getFieldDecorator('id', {
            initialValue: fields.id,
          })(<Input type="hidden" />)}
          <Form.Item label="账号">
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
            })(
              <Input
                autoComplete="off"
                readOnly={open === Open.UPDATE}
                placeholder="请输入用户名"
              />,
            )}
          </Form.Item>
          <Form.Item label="角色">
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
          <Form.Item label="组织">
            {getFieldDecorator('groupId', {
              initialValue:
                fields.group && fields.group.id === '0'
                  ? '顶级节点'
                  : fields.group && fields.group.id,
              rules: [
                {
                  required: true,
                  message: '请为用户分配组织',
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
              />,
            )}
          </Form.Item>
          <Form.Item label="姓名">
            {getFieldDecorator('info.name', {
              initialValue: fields.info && fields.info.name,
              rules: [
                {
                  required: true,
                  message: '请输入用户姓名',
                },
              ],
            })(<Input autoComplete="off" placeholder="请输入用户姓名" />)}
          </Form.Item>
          <Form.Item label="邮箱">
            {getFieldDecorator('info.email', {
              initialValue: fields.info && fields.info.email,
              validateTrigger: ['onFocus', 'onBlur'],
              rules: [
                {
                  required: true,
                  validator: (rule, value, callback) => {
                    if (!value) {
                      callback('请输入邮箱地址');
                      return;
                    }
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
                  },
                },
              ],
            })(<Input autoComplete="off" placeholder="请输入用户邮箱" />)}
          </Form.Item>
          <Form.Item label="手机">
            {getFieldDecorator('info.phone', {
              initialValue: fields.info && fields.info.phone,
              validateTrigger: ['onFocus', 'onBlur'],
              rules: [
                {
                  required: true,
                  validator: (rule, value, callback) => {
                    if (!value) {
                      callback('请输入手机号');
                      return;
                    }
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
                  },
                },
              ],
            })(<Input autoComplete="off" placeholder="请输入用户手机号" />)}
          </Form.Item>
          <Form.Item label="状态">
            {getFieldDecorator('status', {
              rules: [{ required: true, message: '请选择用户状态' }],
              initialValue: fields.status || UserStatus.NORMAL,
            })(
              <RadioGroup name="status">
                <Radio key={UserStatus.NORMAL} value={UserStatus.NORMAL}>
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
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: 'form' })(UserForm);
