import React from 'react';
import { Action, Dispatch } from 'redux';
import { connect } from 'dva';
import { FormComponentProps } from 'antd/es/form';
import { Button, Form, Input, Modal } from 'antd';
import { ModelType, StateType } from './model';

const { TextArea } = Input;

export interface DictTypeFormProps extends FormComponentProps {
  visible: boolean;
  dispatch: Dispatch<
    Action<'dictType/submit' | 'dictType/form' | 'dictType/fetch' | 'dictType/unique'>
  >;
  dictType: StateType;
  loading: boolean;
}

/**
 * 字典类型form
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/10/12 11:33
 */
@connect(
  ({
    dictType,
    loading,
  }: {
    dictType: ModelType;
    loading: { effects: { [key: string]: boolean } };
  }) => ({
    dictType,
    loading: loading.effects['dictType/submit'],
  }),
)
class DictTypeForm extends React.PureComponent<DictTypeFormProps> {
  /**
   * 确定
   */
  handleSubmit = (e: React.FormEvent) => {
    const { form, dispatch } = this.props;
    e.preventDefault();
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'dictType/submit',
        payload: fieldsValue,
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
    dispatch({ type: 'dictType/form', payload: { visible: false } });
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
    if (!value) {
      callback(prompt);
      return;
    }
    // 唯一验证
    dispatch({
      type: 'dictType/unique',
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
      dictType: {
        form: { visible, fields = {}, title },
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
        <Form layout="horizontal" labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
          {getFieldDecorator('id', {
            initialValue: fields.id,
          })(<Input autoComplete="off" type="hidden" />)}
          <Form.Item label="类型名称">
            {getFieldDecorator('name', {
              initialValue: fields.name,
              rules: [
                {
                  required: true,
                  validator: (rule, value, callback) => {
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
            })(<Input autoComplete="off" />)}
          </Form.Item>
          <Form.Item label="类型编码">
            {getFieldDecorator('code', {
              initialValue: fields.code,
              rules: [
                {
                  required: true,
                  validator: (rule, value, callback) => {
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
            })(<Input autoComplete="off" />)}
          </Form.Item>
          <Form.Item label="备注信息">
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

export default Form.create()(DictTypeForm);
