import React from 'react';
import DictType from './type';
import DictItem from './item';

/**
 * 数据字典
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/8/27 16:46
 */
const Index: React.FC = () => (
  <div>
    {/* 字典类型 */}
    <DictType />
    {/* 字典项 */}
    <DictItem />
  </div>
);
export default Index;
