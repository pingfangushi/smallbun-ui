import React, { Fragment } from 'react';
import { FormComponentProps } from 'antd/es/form';
import {
  Button,
  Card,
  Col,
  Divider,
  Drawer,
  Form,
  Icon,
  Input,
  Popconfirm,
  Row,
  Switch,
} from 'antd';
import { connect } from 'dva';
import { Action, Dispatch } from 'redux';
import { formatMessage } from 'umi-plugin-react/locale';
import { ColumnProps } from 'antd/lib/table';
import { StateType as DictValueStateType, StateType } from './model';
import { Open } from '@/pages/typeings';
import { Add } from '@/components/OpenButton';
import StandardTable from '@/components/StandardTable';
import styles from './style.less';
import { TypeTableListItem, ValueTableListItem } from './data.d';
import DictValueForm from '@/pages/dict/value/form';
import Authorized from '@/components/Authorized/Authorized';

const FormItem = Form.Item;

/**
 * 字典值枚举
 */
export enum DictValueEnum {
  // 默认
  DEFAULT = '0',
  // 非默认
  NOT_DEFAULT = '1',
}

interface DictValueTableListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'dictValue/visible'
      | 'dictValue/fetch'
      | 'dictValue/remove'
      | 'dictValue/form'
      | 'dictValue/updateIsDefaultById'
    >
  >;
  loading: boolean;
  dictType: StateType;
  dictValue: DictValueStateType;
}

interface DictValueTableListState {
  searchValues: { [key: string]: string };
}

/**
 * 字典值列表
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/10/12 17:58
 */
@connect(
  ({
    dictValue,
    loading,
  }: {
    dictValue: StateType;
    loading: { models: { [key: string]: boolean } };
  }) => ({
    dictValue,
    loading: loading.models.dictValue,
  }),
)
class DictValueList extends React.PureComponent<DictValueTableListProps, DictValueTableListState> {
  /**
   * 表格columns
   */
  columns: ColumnProps<ValueTableListItem>[] = [
    {
      title: '字典标签',
      dataIndex: 'label',
      align: 'center',
    },
    {
      title: '字典值',
      dataIndex: 'value',
      align: 'center',
    },
    {
      title: '默认项',
      dataIndex: 'isDefault',
      align: 'center',
      render: (text, record) => (
        <Switch
          onClick={(checked: boolean) => {
            const { dispatch } = this.props;
            dispatch({
              type: 'dictValue/updateIsDefaultById',
              payload: {
                id: record.id,
                isDefault: checked ? DictValueEnum.DEFAULT : DictValueEnum.NOT_DEFAULT,
              },
            });
          }}
          checkedChildren="是"
          unCheckedChildren="否"
          checked={text === DictValueEnum.DEFAULT}
        />
      ),
    },
    {
      title: '排序',
      dataIndex: 'sort',
      align: 'center',
      sorter: true,
    },
    {
      title: '操作',
      align: 'center',
      render: text => (
        <Fragment>
          <Authorized authority="manage:operate:dict:update" noMatch={<></>}>
            <a
              onClick={() => {
                this.updateOnClick(text.id);
              }}
            >
              {formatMessage({ id: 'edit.name' })}
            </a>
          </Authorized>
          <Authorized authority="manage:operate:dict:remove" noMatch={<></>}>
            <Divider type="vertical" />
            <Popconfirm
              className={styles.openButton}
              style={{ marginLeft: 70, clear: 'both', whiteSpace: 'nowrap' }}
              title={formatMessage({ id: 'del.confirm.title' })}
              placement="bottomLeft"
              onConfirm={() => {
                this.removeOnClick([text.id]);
              }}
              icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
            >
              <a>{formatMessage({ id: 'del.name' })}</a>
            </Popconfirm>
          </Authorized>
        </Fragment>
      ),
    },
  ];

  /**
   * fetch
   */
  fetch = (params?: {}) => {
    const { dispatch } = this.props;
    dispatch({ type: 'dictValue/fetch', payload: params });
  };

  /**
   * removeOnClick
   */
  removeOnClick = (ids: string[]) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dictValue/remove',
      payload: { ids },
      callback: () => {},
    });
  };

  /**
   * addOnClick
   */
  addOnClick = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dictValue/form',
      payload: { type: Open.ADD, visible: true },
    });
  };

  /**
   * updateOnClick
   */
  updateOnClick = (id: string) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dictValue/form',
      payload: { type: Open.UPDATE, id, visible: true },
    });
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
        <Form layout="inline">
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col span={12} xs={12} md={12} sm={24}>
              <FormItem label="字典标签">
                {getFieldDecorator('label')(
                  <Input autoComplete="off" allowClear placeholder="请输入字典标签" />,
                )}
              </FormItem>
            </Col>
            <Col span={12} xs={12} md={12} sm={24}>
              <span className={styles.submitButtons}>
                <Button
                  type="primary"
                  onClick={() => {
                    const { dispatch, form } = this.props;
                    dispatch({ type: 'dictValue/fetch', payload: form.getFieldsValue() });
                  }}
                >
                  查询
                </Button>
                <Button
                  style={{ marginLeft: 10 }}
                  onClick={() => {
                    const { dispatch, form } = this.props;
                    form.resetFields();
                    dispatch({ type: 'dictValue/fetch', payload: form.getFieldsValue() });
                  }}
                >
                  重置
                </Button>
              </span>
            </Col>
          </Row>
        </Form>
      </div>
    );
  };

  render(): React.ReactNode {
    const {
      dictValue: { visible, list, type },
    } = this.props;
    const { loading } = this.props;
    return (
      <div>
        <Drawer
          title={`${type.name ? `${type.name}：` : ''}字典列表`}
          width={850}
          onClose={() => {
            const { dispatch } = this.props;
            dispatch({
              type: 'dictValue/visible',
              payload: { visible: false, type: {} },
            });
          }}
          visible={visible}
        >
          <Card bordered={false}>
            {/* 搜索 */}
            {this.searchForm()}
            {/* 操作按钮 */}
            <Add onClick={this.addOnClick} authority="manage:operate:dict:add" />
            {/* 表格 */}
            <StandardTable<TypeTableListItem>
              data={list}
              rowKey={record => `${record.id}`}
              fetch={this.fetch}
              columns={this.columns}
              loading={loading}
              rowSelection={undefined}
              prompt={false}
            />
          </Card>
        </Drawer>
        <DictValueForm />
      </div>
    );
  }
}

export default Form.create()(DictValueList);
