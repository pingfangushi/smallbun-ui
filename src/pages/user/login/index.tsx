import { Alert, Checkbox, Form, Button, Input, Icon, Row, Col } from 'antd';
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
  // 图片验证码
  imageCaptcha: string;
  // 图片验证码key
  imageCaptchaKey: string;
  // 公钥key
  publicKey: string;
  // 公钥
  publicSecret: string;
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
    imageCaptcha: '',
    imageCaptchaKey: '',
    publicKey: '',
    publicSecret: '',
    autoLogin: false,
  };

  componentDidMount(): void {
    this.onGetCaptcha();
    this.getPublicSecret();
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
    const { publicSecret, publicKey, imageCaptchaKey } = this.state;
    const { form, dispatch } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (err) return;
      // 处理密码加密
      let { password } = values;
      const encrypt = new JSEncrypt();
      encrypt.setPublicKey(publicSecret);
      // 加密
      password = password && encrypt.encrypt(password);
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
          password,
          publicKey,
          imageCaptchaKey,
        },
      });
    });
  };

  /**
   * 获取验证码
   */
  onGetCaptcha = () => {
    const { dispatch } = this.props;
    // 获取验证码
    dispatch({
      type: 'login/getImageCaptcha',
      callback: (value: { image: string; key: string }) => {
        this.setState({ imageCaptcha: value.image, imageCaptchaKey: value.key });
      },
    });
  };

  /**
   * 获取登录秘钥
   */
  getPublicSecret = () => {
    const { dispatch } = this.props;
    // 获取公钥
    dispatch({
      type: 'login/getPublicSecret',
      callback: (value: { secret: string; key: string }) => {
        this.setState({ publicSecret: value.secret, publicKey: value.key });
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
    const { status, type: loginType } = userLogin;
    const { autoLogin } = this.state;
    return (
      <React.Fragment>
        <div className={styles.main}>
          {status === 'error' &&
            loginType === 'account' &&
            !submitting &&
            this.renderMessage(
              formatMessage({ id: 'user-login.login.message-invalid-credentials' }),
            )}
          <Form className="login-form" onSubmit={this.handleSubmit}>
            <Form.Item>
              {getFieldDecorator('userName', {
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
                <Input
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
                        message: formatMessage({ id: 'user-login.phone-number.required' }),
                      },
                    ],
                  })(
                    <Input
                      size="large"
                      prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      autoComplete="off"
                      placeholder={`${formatMessage({ id: 'user-login.login.captcha' })}`}
                    />,
                  )}
                </Col>
                <Col span={8}>
                  <img
                    className={styles.getCaptcha}
                    onClick={this.onGetCaptcha}
                    src={`data:image/png;base64,${this.state.imageCaptcha}`}
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
