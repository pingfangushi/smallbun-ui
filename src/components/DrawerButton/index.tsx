import * as React from 'react';
import { Button } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';

export interface DrawerButtonProps {
  handleSubmit: React.MouseEventHandler<HTMLElement>;
  handleCancel?: React.MouseEventHandler<HTMLElement>;
  loading?: boolean;
}
const DrawerButton: React.FC<DrawerButtonProps> = props => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      bottom: 0,
      width: '100%',
      borderTop: '1px solid #e9e9e9',
      padding: '10px 16px',
      background: '#fff',
      textAlign: 'left',
    }}
  >
    <Button
      onClick={props.handleSubmit}
      style={{ marginRight: 8 }}
      type="primary"
      loading={props.loading}
      htmlType="submit"
    >
      <FormattedMessage id="drawer.button.submit" />
    </Button>
    <Button onClick={props.handleCancel}>
      <FormattedMessage id="drawer.button.cancel" />
    </Button>
  </div>
);
export default DrawerButton;
