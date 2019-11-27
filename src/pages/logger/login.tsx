import React from 'react';
import { Action, Dispatch } from 'redux';
import { connect } from 'dva';
import { FormComponentProps } from 'antd/es/form';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { LoginTableListItem } from './data.d';
import { StateType } from './model';
import styles from './style.less';
import { Empty } from '@/components/OpenButton';

import StandardTable from '@/components/StandardTable';

const FormItem = Form.Item;

/**
 * TableListProps
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/9/20 18:00
 */
interface LoginTableListProps extends FormComponentProps {
  dispatch: Dispatch<Action<'logger/fetchLogin' | 'logger/emptyLogin'>>;
  loading: boolean;
  logger: StateType;
}

/**
 * TableListState
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/9/20 18:01
 */
interface LoginTableListState {}

@connect(
  ({
    logger,
    loading,
  }: {
    logger: StateType;
    loading: { effects: { [key: string]: boolean } };
  }) => ({
    logger,
    loading: loading.effects['logger/fetchLogin'],
  }),
)
/**
 * 日志管理
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/8/27 16:46
 */
class LoginLogger extends React.Component<LoginTableListProps, LoginTableListState> {
  /**
   * 表格columns
   * */
  columns: ColumnProps<LoginTableListItem>[] = [
    {
      title: '用户',
      dataIndex: 'user',
      align: 'center',
    },
    {
      title: '浏览器',
      dataIndex: 'browser',
      align: 'center',
    },
    {
      title: 'IP',
      dataIndex: 'ip',
      align: 'center',
    },
    {
      title: '位置',
      dataIndex: 'location',
      align: 'center',
    },
    {
      title: '操作系统',
      dataIndex: 'os',
      align: 'center',
    },
    {
      title: '结果',
      dataIndex: 'result',
      align: 'center',
    },
    {
      title: '登录时间',
      dataIndex: 'loginTime',
      sorter: true,
      align: 'center',
    },
  ];

  /**
   * fetch
   */
  fetch = (params?: {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'logger/fetchLogin',
      payload: params,
    });
  };

  /**
   * emptyOnClick
   */
  emptyOnClick = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'logger/emptyLogin',
      callback: () => {},
    });
  };

  /**
   * 搜索
   * @param e
   */
  handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.fetch(fieldsValue);
    });
  };

  /**
   * 点击取消，清除表单数据
   */
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.fetch();
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
        <Form layout="inline" onSubmit={this.handleSearch}>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={6} xs={6} lg={8} md={8} sm={24}>
              <FormItem label="用户">
                {getFieldDecorator('user')(
                  <Input autoComplete="off" allowClear placeholder="请输入用户名" />,
                )}
              </FormItem>
            </Col>
            <Col span={6} xs={6} lg={8} md={8} sm={24}>
              <span className={styles.submitButtons}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                  重置
                </Button>
              </span>
            </Col>
          </Row>
        </Form>
      </div>
    );
  };

  /**
   * render
   */
  render(): React.ReactNode {
    const {
      logger: {
        login: { list: data },
      },
      loading,
    } = this.props;
    return (
      <div>
        <Card bordered={false}>
          {/* 搜索框 */}
          {this.searchForm()}
          {/* 操作按钮 */}
          <Empty onClick={this.emptyOnClick} authority="manage:operate:logger:remove" />
          {/* 表格 */}
          <StandardTable<LoginTableListItem>
            data={data}
            fetch={this.fetch}
            columns={this.columns}
            rowKey={record => `${record.id}`}
            loading={loading}
            prompt={false}
            rowSelection={undefined}
          />
        </Card>
      </div>
    );
  }
}

export default Form.create()(LoginLogger);
