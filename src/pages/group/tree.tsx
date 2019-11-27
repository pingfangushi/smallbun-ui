import React from 'react';
import { Card, Form } from 'antd';
import { connect } from 'dva';
import { Action, Dispatch } from 'redux';
import { FormComponentProps } from 'antd/lib/form';
import { ModelType, StateType } from './model';
import SearchTree, { SearchTreeProps } from '@/components/SearchTree';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * OrgTreeSearchProps
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/9/23 20:15
 */
export interface OrgTreeSearchProps extends Omit<SearchTreeProps, 'data'>, FormComponentProps {
  title: string;
  group: StateType;
  dispatch: Dispatch<Action<'group/tree'>>;
  height?: string | number;
}

@connect((group: ModelType) => group)
/**
 * OrgSearchTree
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/9/23 14:05
 */
class OrgSearchTree extends React.PureComponent<OrgTreeSearchProps> {
  /**
   * 组件安装完毕
   */
  componentDidMount(): void {
    const { dispatch } = this.props;
    dispatch({
      type: 'group/tree',
    });
  }

  render(): React.ReactNode {
    const {
      group: { tree },
    } = this.props;
    return tree && tree.length ? (
      <Card title={this.props.title} bordered={false} style={{ height: this.props.height }}>
        <SearchTree
          placeholder={this.props.placeholder}
          searchValue={this.props.searchValue}
          data={tree}
          {...this.props}
        />
      </Card>
    ) : (
      <Card title={this.props.title} bordered={false} />
    );
  }
}

export default Form.create<Omit<OrgTreeSearchProps, 'group' | 'dispatch'>>()(OrgSearchTree);
