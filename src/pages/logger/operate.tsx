import React, { Fragment } from 'react';
import { Action, Dispatch } from 'redux';
import { connect } from 'dva';
import { FormComponentProps } from 'antd/es/form';
import { Button, Card, Col, Descriptions, Form, Input, Modal, Row, Select } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { RouteContext } from '@ant-design/pro-layout';
import { OperateTableListItem } from './data.d';
import styles from './style.less';
import { Empty } from '@/components/OpenButton';

import StandardTable from '@/components/StandardTable';
import { StateType } from './model';
import { findDict } from '@/utils/dict';

const { Option } = Select;
const FormItem = Form.Item;

/**
 * TableListProps
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/9/20 18:00
 */
interface OperateTableListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<'logger/operateDetails' | 'logger/fetchOperate' | 'logger/emptyOperate'>
  >;
  loading: boolean;
  logger: StateType;
}

/**
 * TableListState
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/9/20 18:01
 */
interface OperateTableListState {}

@connect(
  ({
    logger,
    loading,
  }: {
    logger: StateType;
    loading: { effects: { [key: string]: boolean } };
  }) => ({
    logger,
    loading: loading.effects['logger/fetchOperate'],
  }),
)
/**
 * 日志管理
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/8/27 16:46
 */
class OperateLogger extends React.Component<OperateTableListProps, OperateTableListState> {
  /**
   * 表格columns
   * */
  columns: ColumnProps<OperateTableListItem>[] = [
    {
      title: '模块',
      dataIndex: 'module',
      align: 'center',
      width: 200,
    },
    {
      title: '功能',
      dataIndex: 'feature',
      align: 'center',
      width: 200,
    },
    {
      title: '浏览器',
      dataIndex: 'browser',
      align: 'center',
      width: 120,
    },
    {
      title: '平台',
      dataIndex: 'platform',
      align: 'center',
      width: 150,
    },
    {
      title: 'IP',
      dataIndex: 'ip',
      align: 'center',
      width: 150,
    },
    {
      title: '地点',
      dataIndex: 'location',
      align: 'center',
      width: 150,
    },
    {
      title: '系统',
      dataIndex: 'os',
      align: 'center',
      width: 150,
    },
    {
      title: '用户',
      dataIndex: 'user',
      align: 'center',
      width: 100,
    },
    {
      title: '时间',
      dataIndex: 'time',
      align: 'center',
      sorter: true,
      width: 250,
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 50,
      render: text => (
        <Fragment>
          <a
            onClick={() => {
              const { dispatch } = this.props;
              dispatch({ type: 'logger/operateDetails', payload: { visible: true, id: text.id } });
            }}
          >
            详情
          </a>
        </Fragment>
      ),
    },
  ];

  /**
   * fetch
   */
  fetch = (params?: {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'logger/fetchOperate',
      payload: params,
    });
  };

  /**
   * emptyOnClick
   */
  emptyOnClick = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'logger/emptyOperate',
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
    const platform = findDict('PLATFORM');
    return (
      <div className={styles.searchForm}>
        <Form layout="inline" onSubmit={this.handleSearch}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col span={8} xs={8} md={8} sm={24}>
              <FormItem label="用户">
                {getFieldDecorator('user')(
                  <Input autoComplete="off" allowClear placeholder="请输入操作用户名" />,
                )}
              </FormItem>
            </Col>
            <Col span={8} xs={8} md={8} sm={24}>
              <FormItem label="平台">
                {getFieldDecorator('platform')(
                  <Select placeholder="请选择来源平台" allowClear style={{ width: '100%' }}>
                    {platform &&
                      platform.items.map(value => (
                        <Option key={value.value} value={value.value}>
                          {value.label}
                        </Option>
                      ))}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={8} xs={8} md={8} sm={24}>
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
        operate: { list: data },
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
          <StandardTable<OperateTableListItem>
            data={data}
            fetch={this.fetch}
            columns={this.columns}
            rowKey={record => `${record.id}`}
            loading={loading}
            prompt={false}
            rowSelection={undefined}
            scroll={{ x: 1250 }}
          />
        </Card>
        <OperateDetailsModal />
      </div>
    );
  }
}

export default Form.create()(OperateLogger);

/**
 * 详细信息
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/11/2 21:09
 */
export interface DetailsProps {
  dispatch: Dispatch<Action<'logger/operateDetails'>>;
  logger: StateType;
}

@connect(({ logger }: { logger: StateType }) => ({
  logger,
}))
class OperateDetails extends React.PureComponent<DetailsProps> {
  /**
   * 隐藏
   */
  onClose = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'logger/operateDetails', payload: { visible: false } });
  };

  render(): React.ReactNode {
    const {
      logger: {
        operate: {
          details: { visible, fields = {} },
        },
      },
    } = this.props;

    return (
      <div>
        <Modal title="日志详情" width={950} onCancel={this.onClose} footer={null} visible={visible}>
          <RouteContext.Consumer>
            {() => (
              <div>
                <Descriptions className={styles.headerList} size="small" column={1} bordered>
                  <Descriptions.Item label="模块">{fields.module}</Descriptions.Item>
                  <Descriptions.Item label="功能">{fields.feature}</Descriptions.Item>
                  <Descriptions.Item label="浏览器">{fields.browser}</Descriptions.Item>
                  <Descriptions.Item label="操作系统">{fields.os}</Descriptions.Item>
                  <Descriptions.Item label="IP">{fields.ip}</Descriptions.Item>
                  <Descriptions.Item label="地点">{fields.location}</Descriptions.Item>
                  <Descriptions.Item label="URI">{fields.uri}</Descriptions.Item>
                  <Descriptions.Item label="操作类型">{fields.action}</Descriptions.Item>
                  <Descriptions.Item label="平台">{fields.platform}</Descriptions.Item>
                  <Descriptions.Item label="请求方法">{fields.method}</Descriptions.Item>
                  <Descriptions.Item label="操作用户">{fields.user}</Descriptions.Item>
                  <Descriptions.Item label="操作时间">{fields.time}</Descriptions.Item>
                  {/* <Descriptions.Item label="参数">{fields.params}</Descriptions.Item> */}
                  <Descriptions.Item label="状态">{fields.status}</Descriptions.Item>
                  {/* <Descriptions.Item label="结果">{fields.result}</Descriptions.Item> */}
                </Descriptions>
              </div>
            )}
          </RouteContext.Consumer>
        </Modal>
      </div>
    );
  }
}

const OperateDetailsModal = Form.create()(OperateDetails);
