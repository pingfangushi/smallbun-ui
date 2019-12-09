import { Alert, Button, Checkbox, Col, Form, Icon, Input, notification, Row, Spin } from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { JSEncrypt } from 'jsencrypt';

import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { AnyAction, Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import { StateType } from '@/models/login';
import styles from './style.less';
import { ConnectState } from '@/models/connect';
import { Status } from '@/pages/typings';

interface LoginProps extends FormComponentProps {
  dispatch: Dispatch<AnyAction>;
  userLogin: StateType;
  submitting: boolean;
}
interface LoginState {
  // key
  key?: string;
  // 图片验证码
  captcha?: string;
  // 公钥
  secret?: string;
  // 自动登录
  autoLogin: boolean;
  // 验证码加载
  captchaLoading: boolean;
}

@connect(({ login, loading }: ConnectState) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))
class Login extends Component<LoginProps, LoginState> {
  state: LoginState = {
    autoLogin: true,
    captchaLoading: true,
  };

  componentDidMount(): void {
    this.getPublicSecret(this.onGetCaptcha);
    notification.close('notification');
    notification.open({
      key: 'notification',
      message: '提示',
      duration: null,
      description: (
        <div style={{ textAlign: 'center' }}>
          <img
            src="https://smallbun.oss-cn-hangzhou.aliyuncs.com/liaojishu.jpg"
            alt=""
            style={{ height: '250px' }}
          />
          <p style={{ fontSize: '16px' }}>
            <span style={{ color: '#1890FF' }}>关注公众号</span>，回复
            <span style={{ color: '#ff4626' }}>口令</span>，获取账号密码
          </p>
        </div>
      ),
      style: {
        width: 320,
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
  handleSubmit = (e?: React.FormEvent) => {
    const { secret, key, autoLogin, captchaLoading } = this.state;
    const {
      form,
      dispatch,
    } = this.props;
    // 验证码没加载出来之前,不能提交
    if (captchaLoading) return;
    if (e) e.preventDefault();
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
        payload: { ...values, password, key, rememberMe: autoLogin },
        callback: (response: any) => {
          /** 成功 */
          if (response.status === Status.SUCCESS) {
            // 关闭弹框
            notification.close('notification');
          }
          /** 验证码错误 */
          if (response.status === Status.EX000103) {
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
          /** 账户或密码错误 */
          if (response.status === Status.EX000102) {
            // 刷新验证码
            this.onGetCaptcha();
          }
          /** 数字签名错误  */
          if (response.status === Status.EX900005) {
            // 刷新秘钥验证码
            this.getPublicSecret(this.onGetCaptcha);
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
    this.setState({ captchaLoading: true });
    if (key) {
      // 获取验证码
      dispatch({
        type: 'login/getImageCaptcha',
        payload: { key },
        callback: (value: { image: string }) => {
          const { form } = this.props;
          this.setState({ captcha: value.image, captchaLoading: false });
          form.setFields({ captcha: { value: '' } });
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
          {(status === Status.EX000102 || status === Status.EX900005) &&
            !submitting &&
            this.renderMessage(
              formatMessage({ id: 'user-login.login.message-invalid-credentials' }),
            )}
          <Form className="login-form">
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
                    const { form } = this.props;
                    e.preventDefault();
                    if (form) {
                      this.handleSubmit();
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
                      onPressEnter={e => {
                        const { form } = this.props;
                        e.preventDefault();
                        if (form) {
                          this.handleSubmit();
                        }
                      }}
                    />,
                  )}
                </Col>
                <Col span={8}>
                  <Spin spinning={this.state.captchaLoading}>
                    {this.state.captcha && (
                      <img
                        className={styles.getCaptcha}
                        onClick={this.onGetCaptcha}
                        src={`data:image/png;base64,${this.state.captcha}`}
                        alt=""
                      />
                    )}
                  </Spin>
                </Col>
              </Row>
            </Form.Item>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              <FormattedMessage id="user-login.login.remember-me" />
            </Checkbox>
            <Button
              className="smallbun-login-submit"
              type="primary"
              size="large"
              block
              loading={submitting}
              htmlType="submit"
              onClick={this.handleSubmit}
            >
              <FormattedMessage id="user-login.login.login" />
            </Button>
          </Form>
        </div>
      </React.Fragment>
    );
  }
}

export default Form.create<LoginProps>()(Login);
