import React from 'react';
import { connect } from 'dva';
import { Redirect } from 'umi';
import { stringify } from 'querystring';
import { ConnectState, ConnectProps } from '@/models/connect';
import { CurrentUser } from '@/models/user';
import PageLoading from '@/components/PageLoading';

interface SecurityLayoutProps extends ConnectProps {
  loading: boolean;
  currentUser: CurrentUser;
}

interface SecurityLayoutState {
  isReady: boolean;
}

class SecurityLayout extends React.Component<SecurityLayoutProps, SecurityLayoutState> {
  state: SecurityLayoutState = {
    isReady: false,
  };

  componentDidMount() {
    this.setState({
      isReady: true,
    });
  }

  render() {
    const { isReady } = this.state;
    const { children, loading } = this.props;
    const isLogin = localStorage.getItem('X-AUTH-TOKEN');
    const queryString = stringify({
      redirect: window.location.href,
    });

    if ((!isLogin && loading) || !isReady) {
      return <PageLoading />;
    }
    if (!isLogin) {
      return <Redirect to={`/user/login?${queryString}`} />;
    }
    return children;
  }
}

export default connect(({ user, loading }: ConnectState) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
}))(SecurityLayout);
