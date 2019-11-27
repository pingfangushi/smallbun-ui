import React from 'react';
import { Input, Tree } from 'antd';
import { TreeProps } from 'antd/es/tree';

const { TreeNode } = Tree;
const { Search } = Input;

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

const dataList: any[] = [];

const generateList = (data: any[]) => {
  for (let i = 0; i < data.length; i += 1) {
    const node = data[i];
    const { key, title } = node;
    dataList.push({ key, title });
    if (node.children) {
      generateList(node.children);
    }
  }
};

const getParentKey = (key: any, tree: any): any => {
  let parentKey;
  for (let i = 0; i < tree.length; i += 1) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item: { key: string }) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};
/**
 *  SearchTreeProps
 */
export interface SearchTreeProps extends Omit<TreeProps, 'treeData'> {
  // 搜索value
  searchValue: string;
  // 提示
  placeholder: string;
  // 数据
  data: any;
}

/**
 * 封装SearchTree
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/5/2 11:23
 */
class SearchTree extends React.PureComponent<SearchTreeProps> {
  state = {
    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,
  };

  componentDidMount(): void {
    // 设置展开key的值，展开全部
    this.setState({
      searchValue: this.props.searchValue,
      expandedKeys: this.props.data.map((i: { id: any }) => i.id),
    });
  }

  onExpand = (expandedKeys: string[]) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onChange = (e: { target: { value: any } }) => {
    const { data } = this.props;
    const { value } = e.target;
    const expandedKeys = dataList
      .map(item => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, data);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  };

  render() {
    const { data, placeholder } = this.props;
    const { searchValue, expandedKeys, autoExpandParent } = this.state;
    if (data) {
      generateList(data);
      const loop = (list: any[]) =>
        list.map(item => {
          const index = item.title.indexOf(searchValue);
          const beforeStr = item.title.substr(0, index);
          const afterStr = item.title.substr(index + searchValue.length);
          const title =
            index > -1 ? (
              <span>
                {beforeStr}
                <span style={{ color: '#f50' }}>{searchValue}</span>
                {afterStr}
              </span>
            ) : (
              <span>{item.title}</span>
            );
          if (item.children) {
            return (
              <TreeNode key={item.key} title={title}>
                {loop(item.children)}
              </TreeNode>
            );
          }
          return <TreeNode key={item.key} title={title} />;
        });
      return (
        <div>
          <Search
            style={{ marginBottom: 8 }}
            value={searchValue}
            placeholder={placeholder}
            onChange={this.onChange}
          />
          <Tree
            onExpand={this.onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            {...this.props}
          >
            {loop(data)}
          </Tree>
        </div>
      );
    }
    return null;
  }
}

export default SearchTree;
