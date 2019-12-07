import { Alert, Checkbox, Form, Button, Input, Icon, Row, Col, notification } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { JSEncrypt } from 'jsencrypt';

import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { Dispatch, AnyAction } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import { StateType } from '@/models/login';
import styles from './style.less';
import { ConnectState } from '@/models/connect';

interface LoginProps extends FormComponentProps {
  dispatch: Dispatch<AnyAction>;
  userLogin: StateType;
  submitting: boolean;
}
interface LoginState {
  // key
  key: string;
  // 图片验证码
  captcha: string;
  // 公钥
  secret: string;
  // 自动登录
  autoLogin: boolean;
}

@connect(({ login, loading }: ConnectState) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))
class Login extends Component<LoginProps, LoginState> {
  loginForm: FormComponentProps['form'] | undefined | null = undefined;

  state: LoginState = {
    captcha: '',
    key: '',
    secret: '',
    autoLogin: false,
  };

  componentDidMount(): void {
    this.getPublicSecret(this.onGetCaptcha);
    notification.open({
      message: '提示',
      duration: null,
      description: (
        <div>
          <img
            src="https://smallbun.oss-cn-hangzhou.aliyuncs.com/liaojishu.jpg"
            alt=""
            style={{ height: '250px' }}
          />
          <p>关注公众号，回复口令，获取账号密码</p>
        </div>
      ),
      style: {
        width: 315,
      },
    });
  }

  /**
   * 自动登录
   */
  changeAutoLogin = (e: CheckboxChangeEvent) => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  /**
   * 确定
   */
  handleSubmit = (e: React.FormEvent) => {
    const { secret, key } = this.state;
    const { form, dispatch } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (err) return;
      // 处理密码加密
      let { password } = values;
      const encrypt = new JSEncrypt();
      encrypt.setPublicKey(secret);
      // 加密
      password = password && encrypt.encrypt(password);
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
          password,
          key,
        },
        callback: (response: any) => {
          if (response.status === '900005') {
            // 设置错误
            form.setFields({
              captcha: {
                value: '',
                errors: [
                  Error(
                    formatMessage({ id: 'user-login.login.message-invalid-verification-code' }),
                  ),
                ],
              },
            });
            // 刷新验证码
            this.onGetCaptcha();
          }
        },
      });
    });
  };

  /**
   * 获取验证码
   */
  onGetCaptcha = () => {
    const { dispatch } = this.props;
    const { key } = this.state;
    if (key) {
      // 获取验证码
      dispatch({
        type: 'login/getImageCaptcha',
        payload: { key },
        callback: (value: { image: string }) => {
          this.setState({ captcha: value.image });
        },
      });
    }
  };

  /**
   * 获取登录秘钥
   */
  getPublicSecret = (callback: () => void) => {
    const { dispatch } = this.props;
    // 获取公钥
    dispatch({
      type: 'login/getPublicSecret',
      callback: (value: { secret: string; key: string }) => {
        this.setState({ secret: value.secret, key: value.key });
        // 调用验证码
        callback();
      },
    });
  };

  renderMessage = (content: string) => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const {
      userLogin,
      submitting,
      form: { getFieldDecorator },
    } = this.props;
    const { status } = userLogin;
    const { autoLogin } = this.state;
    return (
      <React.Fragment>
        <div className={styles.main}>
          {status === 'error' &&
            !submitting &&
            this.renderMessage(
              formatMessage({ id: 'user-login.login.message-invalid-credentials' }),
            )}
          <Form className="login-form" onSubmit={this.handleSubmit}>
            <Form.Item>
              {getFieldDecorator('username', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'user-login.userName.required' }),
                  },
                ],
              })(
                <Input
                  size="large"
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  autoComplete="off"
                  placeholder={`${formatMessage({ id: 'user-login.login.userName' })}`}
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'user-login.password.required' }),
                  },
                ],
              })(
                <Input.Password
                  size="large"
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  autoComplete="off"
                  placeholder={`${formatMessage({ id: 'user-login.login.password' })}`}
                  onPressEnter={e => {
                    e.preventDefault();
                    if (this.loginForm) {
                      this.loginForm.validateFields(this.handleSubmit);
                    }
                  }}
                />,
              )}
            </Form.Item>
            <Form.Item>
              <Row gutter={8}>
                <Col span={16}>
                  {getFieldDecorator('captcha', {
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'user-login.verification-code.required' }),
                      },
                    ],
                  })(
                    <Input
                      size="large"
                      prefix={<Icon type="safety" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      autoComplete="off"
                      placeholder={`${formatMessage({ id: 'user-login.login.captcha' })}`}
                    />,
                  )}
                </Col>
                <Col span={8}>
                  <img
                    className={styles.getCaptcha}
                    onClick={this.onGetCaptcha}
                    src={`data:image/png;base64,${this.state.captcha}`}
                    alt=""
                  />
                </Col>
              </Row>
            </Form.Item>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              <FormattedMessage id="user-login.login.remember-me" />
            </Checkbox>
            <Button
              className="antd-pro-login-submit"
              type="primary"
              size="large"
              block
              loading={submitting}
              htmlType="submit"
            >
              <FormattedMessage id="user-login.login.login" />
            </Button>
          </Form>
        </div>
      </React.Fragment>
    );
  }
}

export default Form.create()(Login);
