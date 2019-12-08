import { DefaultFooter, MenuDataItem, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet } from 'react-helmet';
import Link from 'umi/link';
import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';

import SelectLang from '@/components/SelectLang';
import { ConnectProps, ConnectState } from '@/models/connect';
import logo from '../assets/logo.svg';
import styles from './UserLayout.less';
import {Icon} from "antd";

export interface UserLayoutProps extends ConnectProps {
  breadcrumbNameMap: { [path: string]: MenuDataItem };
}

const UserLayout: React.FC<UserLayoutProps> = props => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    breadcrumb,
    formatMessage,
    ...props,
  });
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>

      <div className={styles.container}>
        <div className={styles.lang}>
          <SelectLang />
        </div>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>SmallBun</span>
              </Link>
            </div>
            <div className={styles.desc}>SmallBun是大明湖畔最好的企业级开发脚手架</div>
          </div>
          {children}
        </div>
        <DefaultFooter
          copyright="2019 SmallBun 企业级开发脚手架"
          links={[
            {
              key: '官网',
              title: '官网',
              href: 'https://pro.ant.design',
              blankTarget: true,
            },
            {
              key: 'github',
              title: <Icon type="github" />,
              href: 'https://github.com/ant-design/ant-design-pro',
              blankTarget: true,
            },
            {
              key: '文档',
              title: '文档',
              href: 'https://ant.design',
              blankTarget: true,
            },
          ]}
        />
      </div>
    </>
  );
};

export default connect(({ settings }: ConnectState) => ({
  ...settings,
}))(UserLayout);
