import React from 'react';
import { Divider as AndDivider } from 'antd';

export interface SmallBunDividerProps {
  title: string | undefined;
  style?: any | undefined;
}

/**
 * SmallBun 分割线，封装Divider,文字靠左显示，颜色为#6379bb
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/5/2 8:03
 */
const Divider: React.FC<SmallBunDividerProps> = props => (
  <AndDivider orientation="left" style={props.style}>
    {props.title}
  </AndDivider>
);
Divider.defaultProps = {
  style: { color: '#1890FF', marginTop: 0 },
};
export default Divider;
