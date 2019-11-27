import React from 'react';
import { connect } from 'dva';
import { Modal, Button, Input, Form, Col, Icon, InputNumber } from 'antd';
// @ts-ignore
import { ChromePicker } from 'react-color';
import { FormComponentProps } from 'antd/lib/form';
import { Dispatch, Action } from 'redux';
import { ModelType, StateType } from '@/pages/dict/value/model';

const { TextArea } = Input;

export interface DictValueFormProps extends FormComponentProps {
  visible: boolean;
  dispatch: Dispatch<
    Action<'dictValue/submit' | 'dictValue/form' | 'dictValue/fetch' | 'dictValue/unique'>
  >;
  dictValue: StateType;
  loading: boolean;
}

export interface DictValueFormState {
  displayColorPicker?: boolean;
}

/**
 * 字典值form
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/10/12 11:32
 */
@connect(
  ({
    dictValue,
    loading,
  }: {
    dictValue: ModelType;
    loading: { effects: { [key: string]: boolean } };
  }) => ({
    dictValue,
    loading: loading.effects['dictValue/submit'],
  }),
)
class DictValueForm extends React.Component<DictValueFormProps, DictValueFormState> {
  state = {
    displayColorPicker: false,
  };

  /**
   * 确定
   */
  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'dictValue/submit',
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
    const { form, dispatch } = this.props;
    dispatch({ type: 'dictValue/form', payload: { visible: false } });
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
    if (!value) {
      callback(prompt);
      return;
    }
    // 唯一验证
    dispatch({
      type: 'dictValue/unique',
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
      dictValue: {
        form: { visible, fields = {}, title },
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
          width={600}
        >
          <Form labelCol={{ span: 5 }} wrapperCol={{ span: 17 }}>
            {getFieldDecorator('id', { initialValue: fields.id })(
              <Input autoComplete="off" disabled type="hidden" />,
            )}
            {getFieldDecorator('type', { initialValue: fields.type })(
              <Input autoComplete="off" disabled type="hidden" />,
            )}
            <Form.Item label="标签值">
              {getFieldDecorator('label', {
                initialValue: fields.label,
                rules: [
                  {
                    required: true,
                    validator: (rule, value, callback) => {
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
              })(<Input autoComplete="off" />)}
            </Form.Item>
            <Form.Item label="字典值">
              {getFieldDecorator('value', {
                initialValue: fields.value,
                rules: [
                  {
                    required: true,
                    validator: (rule, value, callback) => {
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
              })(<Input autoComplete="off" />)}
            </Form.Item>
            {/* 字典展示字体颜色 */}
            <Form.Item label="展示颜色">
              <Col span={4}>
                <Button
                  onClick={() => {
                    this.setState({ displayColorPicker: !displayColorPicker });
                  }}
                >
                  <Icon
                    type="bg-colors"
                    style={{
                      color: getFieldValue('color') ? getFieldValue('color') : fields.color,
                    }}
                  />
                </Button>
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
              </Col>
              <Col span={20}>
                {getFieldDecorator('color', {
                  initialValue: fields.color,
                  rules: [{ required: true, message: '请选择颜色值!' }],
                })(<Input />)}
              </Col>
            </Form.Item>
            <Form.Item label="字典排序">
              {getFieldDecorator('sort', { initialValue: fields.sort })(<InputNumber />)}
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
      </div>
    );
  }
}

export default Form.create()(DictValueForm);
