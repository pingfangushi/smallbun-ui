import { Descriptions, Form, Modal } from 'antd';
import React from 'react';
import { Dispatch, Action } from 'redux';
import { connect } from 'dva';
import { RouteContext } from '@ant-design/pro-layout';
import { StateType } from './model';
import styles from './style.less';

export interface DetailsProps {
  dispatch: Dispatch<Action<'users/details'>>;
  users: StateType;
}

/**
 * Details
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/11/2 21:09
 */
@connect(({ users }: { users: StateType }) => ({
  users,
}))
class UserDetails extends React.PureComponent<DetailsProps> {
  /**
   * 隐藏
   */
  onClose = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'users/details', payload: { visible: false } });
  };

  render(): React.ReactNode {
    const {
      users: {
        details: { visible, fields = {} },
      },
    } = this.props;

    return (
      <div>
        <Modal title="日志详情" width={950} onCancel={this.onClose} footer={null} visible={visible}>
          <RouteContext.Consumer>
            {() => (
              <div>
                <Descriptions className={styles.headerList} size="small" column={1} bordered>
                  <Descriptions.Item label="姓名">{fields}</Descriptions.Item>
                  <Descriptions.Item label="用户名">{fields.username}</Descriptions.Item>
                  <Descriptions.Item label="手机">{fields}</Descriptions.Item>
                  <Descriptions.Item label="邮箱">{fields}</Descriptions.Item>
                  <Descriptions.Item label="所在组织">
                    {fields.group && fields.group.name}
                  </Descriptions.Item>
                  <Descriptions.Item label="用户类型">{fields.type}</Descriptions.Item>
                  <Descriptions.Item label="上次登录IP">{fields}</Descriptions.Item>
                  <Descriptions.Item label="上次登录地点">{fields}</Descriptions.Item>
                  <Descriptions.Item label="上次登录时间">{fields.lastLoginTime}</Descriptions.Item>
                  <Descriptions.Item label="用户状态">{fields.status}</Descriptions.Item>
                  <Descriptions.Item label="备注">{fields.remarks}</Descriptions.Item>
                </Descriptions>
              </div>
            )}
          </RouteContext.Consumer>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(UserDetails);
