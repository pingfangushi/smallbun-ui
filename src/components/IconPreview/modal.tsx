import { Modal } from 'antd';
import React from 'react';
import IconPreview from './index';

export interface IconPreviewModalProps {
  /** 选择 */
  onSelect: Function;
  /** 对话框是否可见 */
  visible: boolean;
  /** 点击模态框右上角叉、取消按钮、Props.maskClosable 值为 true 时的遮罩层或键盘按下 Esc 时的回调 */
  onCancel?: (e: React.MouseEvent<HTMLElement>) => void;
}
/**
 * 图标浏览modal
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/10/29 21:26
 */
export const IconPreviewModal: React.FC<IconPreviewModalProps> = props => (
  <Modal title="图标选择" visible={props.visible} onCancel={props.onCancel} footer={null}>
    <IconPreview onSelect={props.onSelect} />
  </Modal>
);
