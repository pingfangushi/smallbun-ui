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
    imageCaptcha:
      '/9j/4AAQSkZJRgABAgAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0a\n' +
      'HBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIy\n' +
      'MjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCABQAPADASIA\n' +
      'AhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQA\n' +
      'AAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3\n' +
      'ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWm\n' +
      'p6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEA\n' +
      'AwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSEx\n' +
      'BhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElK\n' +
      'U1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3\n' +
      'uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD0AU4U\n' +
      'gpwoAUU4VDc3MFnay3NzKsUESl5HY4CqOpNZ1v4s8O3OPJ13TWJ7fakz+WaANkU4VBBdW9yMwXEU\n' +
      'o/2HDfyqwKAFFOFIKUUAOFKKQU4UAKKcKQU4UAKKcKQU4UAKKcKQU4UAKKcKaKcKAFFOFIKcKAFF\n' +
      'OFIKcKAFFOFIKcKAFFOFIKUUAOFKKYzpGheR1VR1LHAFOikSWNZI3V0YZDKcg/jQA8U4UgpwoA4k\n' +
      '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',
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
