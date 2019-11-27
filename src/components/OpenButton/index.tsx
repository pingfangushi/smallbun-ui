import React from 'react';
import { Button, Dropdown, Icon, Menu, Popconfirm } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { ButtonType } from 'antd/es/button';
import styles from './style.less';
import Authorized from '@/components/Authorized/Authorized';

export interface ButtonProps {
  onClick: any | undefined;
  message?: string;
  selectedRows?: any[];
  authority?: any;
  type?: ButtonType;
}

export class Add extends React.PureComponent<Omit<ButtonProps, 'selectedRows'>> {
  render(): React.ReactNode {
    const { authority, message } = this.props;
    const click: any = this.props.onClick;
    return (
      <Authorized authority={authority} noMatch={<></>}>
        <Button
          className={styles.openButton}
          type="primary"
          title={message || formatMessage({ id: 'add.title' })}
          onClick={click}
        >
          {formatMessage({ id: 'add.name' })}
        </Button>
      </Authorized>
    );
  }
}

export class Update extends React.PureComponent<ButtonProps> {
  render(): React.ReactNode {
    const click: any = this.props.onClick;
    const { authority, message, type } = this.props;
    const { selectedRows } = this.props;
    if (selectedRows !== undefined && selectedRows.length === 1) {
      return (
        <Authorized authority={authority} noMatch={<></>}>
          <Button
            className={styles.openButton}
            type={type || 'dashed'}
            title={message || formatMessage({ id: 'edit.title' })}
            onClick={click}
          >
            {formatMessage({ id: 'edit.name' })}
          </Button>
        </Authorized>
      );
    }
    return null;
  }
}

export class Remove extends React.PureComponent<ButtonProps> {
  render(): React.ReactNode {
    const click: any = this.props.onClick;
    const { authority, message } = this.props;
    const { selectedRows } = this.props;
    if (selectedRows !== undefined && selectedRows.length !== 0) {
      return (
        <Authorized authority={authority} noMatch={<></>}>
          <Popconfirm
            className={styles.openButton}
            style={{ marginLeft: 70, clear: 'both', whiteSpace: 'nowrap' }}
            title={message || formatMessage({ id: 'del.confirm.title' })}
            placement="bottomLeft"
            onConfirm={click}
            icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
          >
            <Button type="danger" title={formatMessage({ id: 'del.title' })}>
              {formatMessage({ id: 'del.name' })}
            </Button>
          </Popconfirm>
        </Authorized>
      );
    }
    return null;
  }
}

export class Empty extends React.PureComponent<ButtonProps> {
  render(): React.ReactNode {
    const click: any = this.props.onClick;
    const { authority, message } = this.props;
    return (
      <Authorized authority={authority} noMatch={<></>}>
        <Popconfirm
          className={styles.openButton}
          style={{ marginLeft: 70, clear: 'both', whiteSpace: 'nowrap' }}
          title={message || formatMessage({ id: 'empty.confirm.title' })}
          placement="bottomLeft"
          onConfirm={click}
          icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
        >
          <Button type="danger" title={formatMessage({ id: 'empty.title' })}>
            {formatMessage({ id: 'empty.name' })}
          </Button>
        </Popconfirm>
      </Authorized>
    );
  }
}

export class More extends React.PureComponent {
  render(): React.ReactNode {
    return (
      <Dropdown
        className={styles.openButton}
        overlay={() => (
          <Menu
            onClick={(e: object) => {
              console.log(e);
            }}
          >
            <Menu.Item title={formatMessage({ id: 'import.menu.title' })} key="1">
              {formatMessage({ id: 'import.menu.name' })}
            </Menu.Item>
            <Menu.Item title={formatMessage({ id: 'export.menu.title' })} key="2">
              {formatMessage({ id: 'export.menu.name' })}
            </Menu.Item>
          </Menu>
        )}
      >
        <Button>
          更多
          <Icon type="down" />
        </Button>
      </Dropdown>
    );
  }
}
