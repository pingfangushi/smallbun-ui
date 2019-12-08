import React from 'react';
import { Action, Dispatch } from 'redux';
import { connect } from 'dva';
import { FormComponentProps } from 'antd/es/form';
import { Form, Input, Modal } from 'antd';
import { StateType } from '@/models/authority';
import { FormItemFields } from './data.d';

const { TextArea } = Input;

export interface AuthorityFormProps extends FormComponentProps {
  loading: boolean;
  dispatch: Dispatch<
    Action<
      | 'authority/form'
      | 'authority/fetch'
      | 'authority/remove'
      | 'authority/submit'
      | 'authority/unique'
    >
  >;
  authority: StateType;
}

/**
 * ModuleForm
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/8/29 16:22
 */
@connect(
  ({
    authority,
    loading,
  }: {
    authority: StateType;
    loading: { effects: { [key: string]: boolean } };
  }) => ({
    authority,
    loading: loading.effects['authority/submit'],
  }),
)
class AuthorityModule extends React.Component<AuthorityFormProps> {
  /**
   * 隐藏
   */
  onClose = () => {
    // 清除表单数据
    this.props.form.resetFields();
    const { dispatch } = this.props;
    dispatch({ type: 'authority/form', payload: { visible: false } });
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
        dispatch({
          type: 'authority/submit',
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
   * @param prompt
   */
  validation(rule: any, value: any, callback: any, payload: {}, prompt: string) {
    const { dispatch } = this.props;
    // 唯一验证
    dispatch({
      type: 'authority/unique',
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

  render() {
    const {
      form: { getFieldDecorator },
      authority: {
        form: { title, visible, fields = {} },
      },
      loading,
    } = this.props;
    return (
      <Modal
        title={title}
        width={610}
        onOk={this.handleSubmit}
        confirmLoading={loading}
        onCancel={this.onClose}
        visible={visible}
      >
        <Form layout="horizontal" labelCol={{ span: 3 }} wrapperCol={{ span: 20 }}>
          {getFieldDecorator('id', {
            initialValue: fields.id,
          })(<Input type="hidden" />)}
          <Form.Item label="名称">
            {getFieldDecorator('name', {
              validateTrigger: ['onFocus', 'onBlur'],
              rules: [
                {
                  required: true,
                  validator: (rule, value, callback) => {
                    if (!value) {
                      callback('请输入业务名称');
                      return;
                    }
                    this.validation(
                      rule,
                      value,
                      callback,
                      { id: fields.id, name: value },
                      '已存在业务名称',
                    );
                  },
                },
              ],
              initialValue: fields.name,
            })(<Input autoComplete="off" placeholder="请输入业务名称" />)}
          </Form.Item>
          <Form.Item label="编码">
            {getFieldDecorator('code', {
              validateTrigger: ['onFocus', 'onBlur'],
              rules: [
                {
                  required: true,
                  validator: (rule, value, callback) => {
                    if (!value) {
                      callback('请输入业务编码');
                      return;
                    }
                    this.validation(
                      rule,
                      value,
                      callback,
                      { id: fields.id, code: value },
                      '已存在业务编码',
                    );
                  },
                },
              ],
              initialValue: fields.code,
            })(<Input autoComplete="off" placeholder="请输入业务编码" />)}
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

export default Form.create()(AuthorityModule);
