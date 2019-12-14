import {
  Form,
  Input,
  message,
  notification,
  Select,
  TreeSelect,
  Modal,
  Button,
  InputNumber,
} from 'antd';
import * as React from 'react';
import { FormComponentProps } from 'antd/es/form';
import { Action, Dispatch } from 'redux';
import { connect } from 'dva';
import { StateType } from '@/models/group';
import { FormItemFields } from '@/pages/group/data';
import { Result, Status } from '@/pages/typings';
import { findDict } from '@/utils/dict';
import { GroupStatus } from '@/pages/group/typings';

const { Option } = Select;
const { TextArea } = Input;

export interface OrgFormProps extends FormComponentProps {
  loading: boolean;
  dispatch: Dispatch<
    Action<
      'group/form' | 'group/fetch' | 'group/tree' | 'group/remove' | 'group/submit' | 'group/unique'
    >
  >;
  group: StateType;
}

/**
 * OrgForm
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/8/29 16:22
 */
@connect(
  ({ group, loading }: { group: StateType; loading: { effects: { [key: string]: boolean } } }) => ({
    group,
    loading: loading.effects['group/submit'],
  }),
)
class OrgForm extends React.Component<OrgFormProps> {
  /**
   * 隐藏
   */
  onClose = () => {
    // 清除表单数据
    this.props.form.resetFields();
    const { dispatch } = this.props;
    dispatch({
      type: 'group/form',
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
    form.validateFieldsAndScroll((err, values: FormItemFields) => {
      if (!err) {
        dispatch({
          type: 'group/submit',
          payload: values,
          callback: (response: Result<object>) => {
            if (response.status === Status.SUCCESS) {
              // 清空form值
              form.resetFields();
              message.success(response.message);
              dispatch({ type: 'group/form', payload: { visible: false } });
              dispatch({ type: 'group/fetch' });
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
      type: 'group/unique',
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
      loading,
      group: {
        form: { title, visible, fields = {} },
        tree,
      },
    } = this.props;
    const type = findDict('GROUP_TYPE');
    return (
      <Modal
        title={title}
        width={610}
        destroyOnClose
        maskClosable={false}
        onCancel={this.onClose}
        confirmLoading={loading}
        footer={[
          <Button key="back" onClick={this.onClose}>
            取消
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={this.handleSubmit}>
            提交
          </Button>,
        ]}
        visible={visible}
      >
        <Form
          layout="horizontal"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 20 }}
          onSubmit={this.handleSubmit}
        >
          {getFieldDecorator('id', {
            initialValue: fields.id,
          })(<Input type="hidden" />)}
          {getFieldDecorator('status', {
            initialValue: fields.status || GroupStatus.ENABLE,
          })(<Input type="hidden" />)}
          <Form.Item label="名称">
            {getFieldDecorator('name', {
              validateTrigger: ['onFocus', 'onBlur'],
              initialValue: fields.name,
              rules: [
                {
                  required: true,
                  validator: (rule, value, callback) => {
                    if (!value) {
                      callback('请输入机构名称');
                      return;
                    }
                    this.validation(
                      rule,
                      value,
                      callback,
                      { id: fields.id, name: value },
                      '已存在机构名称',
                    );
                  },
                },
              ],
            })(<Input autoComplete="off" placeholder="请输入机构名称" />)}
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
                      callback('请输入机构编码');
                      return;
                    }
                    this.validation(
                      rule,
                      value,
                      callback,
                      { id: fields.id, code: value },
                      '已存在机构编码',
                    );
                  },
                },
              ],
            })(<Input autoComplete="off" placeholder="请输入机构编码" />)}
          </Form.Item>
          {getFieldDecorator('parentId', {
            initialValue: fields.parentId,
          })(<Input type="hidden" />)}
          <Form.Item label="归属">
            {getFieldDecorator('parent', {
              initialValue:
                fields.parentId === '0' ? '顶级（添加顶级机构，不需选择）' : fields.parentId,
              rules: [
                {
                  required: true,
                  message: '请选择归属机构',
                },
              ],
            })(
              <TreeSelect<string>
                showSearch
                treeDefaultExpandAll
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder="请选择上级机构"
                treeNodeFilterProp="name"
                treeData={tree}
                autoClearSearchValue
                onChange={(value, label, extra) => {
                  const { form } = this.props;
                  form.setFieldsValue({ parentId: extra.triggerNode.props.id });
                }}
              />,
            )}
          </Form.Item>
          <Form.Item label="类型">
            {getFieldDecorator('type', {
              initialValue: fields.type ? fields.type : type && type.default,
              rules: [
                {
                  required: true,
                  message: '请选择机构类型',
                },
              ],
            })(
              <Select showSearch placeholder="请选择机构类型" optionFilterProp="type" allowClear>
                {type &&
                  type.items.map(value => (
                    <Option key={value.value} value={value.value}>
                      {value.label}
                    </Option>
                  ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="排序">
            {getFieldDecorator('sort', { initialValue: fields.sort || 9999 })(<InputNumber />)}
          </Form.Item>
          <Form.Item label="备注">
            {getFieldDecorator('remarks', { initialValue: fields.remarks })(
              <TextArea autoComplete="off" rows={3} placeholder="请输入备注信息" />,
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(OrgForm);
