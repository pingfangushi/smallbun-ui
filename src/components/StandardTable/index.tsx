import { Table, Alert } from 'antd';
import { TableRowSelection, TableProps } from 'antd/es/table';
import React, { Component, Fragment } from 'react';
import { SorterResult } from 'antd/lib/table';
import styles from './index.less';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface StandardTableProps<T> extends TableProps<T> {
  // 数据
  data: {
    // 集合
    list: T[];
    // 分页
    pagination: StandardTableProps<T>['pagination'];
  };
  fetch: (params?: any) => void;
  prompt?: boolean;
  selectedRows?: T[];
  onSelectRow?: (rows: any) => void;
}

interface StandardTableState<T> {
  selectedRowKeys: string[];
}

class StandardTable<T> extends Component<StandardTableProps<T>, StandardTableState<T>> {
  constructor(props: StandardTableProps<T>) {
    super(props);
    this.state = {
      selectedRowKeys: [],
    };
  }

  handleRowSelectChange: TableRowSelection<T>['onChange'] = (
    selectedRowKeys,
    selectedRows: T[],
  ) => {
    const currySelectedRowKeys = selectedRowKeys as string[];
    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys: currySelectedRowKeys });
  };

  handleTableChange: TableProps<T>['onChange'] = (pagination, filters, sorter, ...rest) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter, ...rest);
    } else {
      this.onChange(pagination, filters, sorter);
    }
  };

  getValue = (obj: { [x: string]: string[] }) =>
    Object.keys(obj)
      .map(key => obj[key])
      .join(',');

  /**
   * 更改
   * @param pagination
   * @param filtersArg
   * @param sorter
   */
  onChange = (
    pagination: Partial<StandardTableProps<T>['pagination']>,
    filtersArg: Record<keyof T, string[]>,
    sorter: SorterResult<T>,
  ) => {
    const { fetch } = this.props;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = this.getValue(filtersArg[key]);
      return newObj;
    }, {});
    const params: any = {
      current: pagination ? pagination.current : undefined,
      pageSize: pagination ? pagination.pageSize : undefined,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}`;
      params.asc = sorter.order === 'ascend';
    }
    // 调用fetch
    fetch(params);
  };

  cleanSelectedKeys = () => {
    if (this.handleRowSelectChange) {
      this.handleRowSelectChange([], []);
    }
  };

  render() {
    const { selectedRowKeys } = this.state;
    const { data, selectedRows, prompt = true, rowKey, ...rest } = this.props;
    const { list = [], pagination = false } = data || {};
    const paginationProps = pagination
      ? {
          showSizeChanger: true,
          showQuickJumper: true,
          ...pagination,
        }
      : false;
    /**
     *行选择
     */
    const rowSelection: TableRowSelection<T> = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: (record: T | any) => ({
        disabled: record.disabled,
      }),
    };
    return (
      <div className={styles.standardTable}>
        {prompt && (
          <div className={styles.tableAlert}>
            <Alert
              message={
                <Fragment>
                  已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                  <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>
                    清空
                  </a>
                </Fragment>
              }
              type="info"
              showIcon
            />
          </div>
        )}
        <Table
          rowKey={rowKey || 'key'}
          rowSelection={rowSelection}
          dataSource={list}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          size="middle"
          {...rest}
        />
      </div>
    );
  }
}

export default StandardTable;
