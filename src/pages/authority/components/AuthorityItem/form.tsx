import React, { useState } from 'react';
import { FormComponentProps } from 'antd/es/form';
import { Form, Input, Modal } from 'antd';
import { AuthorityItemFormItemFields } from '../../data.d';

export interface AuthorizedItemModuleProps extends FormComponentProps {
  data: AuthorityItemFormItemFields;
  title: string;
  visible: boolean;
  // 提交
  submit: (values: AuthorityItemFormItemFields, callback: (success: boolean) => void) => void;
  // 取消
  onCancel: (e: React.MouseEvent<HTMLElement>) => void;
  // 唯一验证
  unique: (payload: {}, callback: (unique: boolean) => void) => void;
}

/**
 * ModuleForm
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/8/29 16:22
 */
const AuthorizedItemModule : React.FC<AuthorizedItemModuleProps> = props => {
  const [loading, setLoading] = useState(false);
  const { form: { getFieldDecorator }, data } = props;
  return <><Modal
    title={props.title}
    width={550}
    onOk={(e: React.FormEvent) => {
      e.preventDefault();
      const { form } = props;
      form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          // 打开loading
          setLoading(true);
          props.submit(values, (success: boolean) => {
            if (success) {
              // 延时关闭
              setTimeout(() => {
                form.resetFields();
              }, 200);
              // 关闭loading
              setLoading(false)
            }
          });
        }
      });
    }}
    confirmLoading={loading}
    onCancel={(e: React.MouseEvent<HTMLElement>) => {
      const { form } = props;
      form.resetFields();
      props.onCancel(e);
    }}
    visible={props.visible}
  >
    <Form layout="horizontal" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
      {/* ID修改用到 */}
      {getFieldDecorator('id', {
        initialValue: data.id,
      })(<Input type="hidden" />)}
      {/* 归属权限 */}
      {getFieldDecorator('authorize', {
        initialValue: data.authorize,
      })(<Input type="hidden" />)}
      {/* 类型，路由、接口、操作 */}
      {getFieldDecorator('type', {
        initialValue: data.type,
      })(<Input type="hidden" />)}
      {/* status 状态 */}
      {getFieldDecorator('status', {
        initialValue: data.status,
      })(<Input type="hidden" />)}
      <Form.Item label="名称">
        {getFieldDecorator('name', {
          rules: [
            {
              required: true,
              validator: (rule, value, callback) => {
                if (!value) {
                  callback('请输入权限名称');
                  return;
                }
                props.unique(
                  { id: data.id, name: value, type: data.type, authorize: data.authorize },
                  (unique: boolean) => {
                    if (!unique) {
                      callback(`已存在权限名称：${value}!`);
                      return;
                    }
                    callback();
                  },
                );
              },
            },
          ],
          initialValue: data.name,
        })(<Input autoComplete="off" placeholder="请输入权限名称" />)}
      </Form.Item>
      <Form.Item label="标识">
        {getFieldDecorator('permission', {
          initialValue: data.permission,
          rules: [
            {
              required: true,
              validator: (rule, value, callback) => {
                if (!value) {
                  callback('请输入权限标识');
                  return;
                }
                // 唯一验证
                props.unique(
                  {
                    id: data.id,
                    permission: value,
                    type: data.type,
                    authorize: data.authorize,
                  },
                  (unique: boolean) => {
                    if (!unique) {
                      callback(`已存在权限标识：${value}!`);
                      return;
                    }
                    callback();
                  },
                );
              },
            },
          ],
        })(<Input autoComplete="off" placeholder="请输入权限标识" />)}
      </Form.Item>
    </Form>
  </Modal></>
};

export default Form.create<AuthorizedItemModuleProps>()(AuthorizedItemModule);
