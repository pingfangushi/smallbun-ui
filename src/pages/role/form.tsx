import { Modal, Form, Input } from 'antd';
import * as React from 'react';
import { FormComponentProps } from 'antd/es/form';
import { Action, Dispatch } from 'redux';
import { connect } from 'dva';
import { StateType } from '@/models/role';
import { FormItemFields } from '@/pages/role/data';

import { RoleStatus } from './typings';

const { TextArea } = Input;

export interface RoleFormProps extends FormComponentProps {
  loading: boolean;
  dispatch: Dispatch<
    Action<'role/form' | 'role/fetch' | 'role/remove' | 'role/submit' | 'role/unique'>
  >;
  role: StateType;
}

/**
 * RoleForm
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/8/29 16:22
 */
@connect(
  ({ role, loading }: { role: StateType; loading: { effects: { [key: string]: boolean } } }) => ({
    role,
    loading: loading.effects['role/submit'],
  }),
)
class RoleForm extends React.Component<RoleFormProps> {
  /**
   * 隐藏
   */
  onClose = () => {
    // 清除表单数据
    this.props.form.resetFields();
    const { dispatch } = this.props;
    dispatch({ type: 'role/form', payload: { visible: false } });
  };

  /**
   * Form 提交
   * @param e
   */
  handleSubmit = (e: React.FormEvent) => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values: FormItemFields) => {
      if (!err) {
        // 提交
        dispatch({
          type: 'role/submit',
          payload: values,
          callback() {
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
      type: 'role/unique',
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
      form: { getFieldDecorator },
      role: {
        form: { title, visible, fields = {} },
      },
      loading,
    } = this.props;
    return (
      <Modal
        title={title}
        width={610}
        onCancel={this.onClose}
        onOk={this.handleSubmit}
        confirmLoading={loading}
        visible={visible}
      >
        <Form layout="horizontal" labelCol={{ span: 3 }} wrapperCol={{ span: 20 }}>
          {getFieldDecorator('id', {
            initialValue: fields.id,
          })(<Input type="hidden" />)}
          {getFieldDecorator('status', {
            initialValue: fields.status || RoleStatus.ENABLE,
          })(<Input type="hidden"/>)}
          <Form.Item label="名称">
            {getFieldDecorator('name', {
              initialValue: fields.name,
              validateTrigger: ['onFocus', 'onBlur'],
              rules: [
                {
                  required: true,
                  validator: (rule, value, callback) => {
                    if (!value) {
                      callback('请输入角色名称');
                      return;
                    }
                    this.validation(
                      rule,
                      value,
                      callback,
                      { id: fields.id, name: value },
                      '已存在角色名称',
                    );
                  },
                },
              ],
            })(<Input autoComplete="off" placeholder="请输入角色名称" />)}
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
                      callback('请输入角色编码');
                      return;
                    }
                    this.validation(
                      rule,
                      value,
                      callback,
                      { id: fields.id, code: value },
                      '已存在角色编码',
                    );
                  },
                },
              ],
            })(<Input autoComplete="off" placeholder="请输入角色编码" />)}
          </Form.Item>
          <Form.Item label="备注">
            {getFieldDecorator('remarks', {
              initialValue: fields.remarks,
            })(<TextArea autoComplete="off" rows={3} placeholder="请输入备注信息" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(RoleForm);
