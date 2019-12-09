import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Typography, Alert, Icon } from 'antd';

import styles from './Welcome.less';

const Preview: React.FC<{}> = ({ children }) => <pre className={styles.pre}>{children}</pre>;

export default (): React.ReactNode => (
  <PageHeaderWrapper>
    <Card>
      <Alert
        message="😃SmallBun 一款来自于山东济南的企业级开发脚手架，虽然只是一个平凡的故事而已~"
        type="success"
        banner
        showIcon={false}
        style={{
          margin: -12,
          marginBottom: 24,
        }}
      />
      {/* 想说的 */}
      <Preview>
        <a href="https://www.xiami.com/song/5adZ389b2" target="_blank" rel="noopener noreferrer">
          把握生命里的每一分钟 全力以赴我们心中的梦 不经历风雨 怎么见彩虹
          没有人能随随便便成功。--李宗盛《真心英雄》
        </a>
        <br />
        <a href="https://www.xiami.com/song/mQ8pUq66e5a" target="_blank" rel="noopener noreferrer">
          关于理想我从来没选择放弃 即使在灰头土脸的日子里 也许我没有天分 但我有梦的天真 我将会去证明
          用我的一生 --GALA《追梦赤子心》
        </a>
        <br />
        <a
          href="https://www.yuque.com/yubo/morning/grow-up-at-alibaba"
          target="_blank"
          rel="noopener noreferrer"
        >
          决定一个产品灵魂的，往往不是选择做什么，而是选择不做什么。--玉伯《我的前端成长之路》
        </a>
        <br />
      </Preview>
      {/* 愿景 */}
      <Typography.Text
        strong
        style={{
          marginBottom: 12,
        }}
      >
        <span style={{ fontSize: '20px', color: '#1890FF' }}>愿景</span>
      </Typography.Text>
      <Preview>
        <span role="img" aria-label="" style={{ fontSize: 16 }}>
          🚀大明湖畔最好的、企业级开发脚手架
        </span>
      </Preview>

      <Typography.Text
        strong
        style={{
          marginBottom: 12,
        }}
      >
        <span style={{ fontSize: '20px', color: '#1890FF' }}>特性</span>
      </Typography.Text>
      <Preview>
        <span role="img" aria-label="">
          📜区块: 通过区块模板快速构建页面
        </span>
        <br />
        <span role="img" aria-label="">
          💎优雅美观：基于 Ant Design 体系精心设计
        </span>
        <br />
        <span role="img" aria-label="">
          📐常见设计模式：提炼自中后台应用的典型页面和场景
        </span>
        <br />
        <span role="img" aria-label="">
          🚀最新前端技术栈：使用 React/umi/dva/antd 等前端前沿技术开发
        </span>
        <br />
        <span role="img" aria-label="">
          ⚡新后端技术栈：使用 SpringBoot/SpringSecurity/Mybatis Plus/Liquibase/HikariCP/Redis/Maven
          等后端前沿技术开发
        </span>
        <br />
        <span role="img" aria-label="">
          📱响应式：针对不同屏幕大小设计
        </span>
        <br />
        <span role="img" aria-label="">
          🎨主题：可配置的主题满足多样化的品牌诉求
        </span>
        <br />
        <span role="img" aria-label="">
          🌐国际化：内建业界通用的国际化方案
        </span>
        <br />
        <span role="img" aria-label="">
          ⚙最佳实践：良好的工程实践助您持续产出高质量代码
        </span>
        <br />
        <span role="img" aria-label="">
          🔢Mock 数据：实用的本地数据调试方案
        </span>
        <br />
        <span role="img" aria-label="">
          ✅UI 测试：自动化测试保障前端产品质量
        </span>
        <br />
        <span role="img" aria-label="">
          🔑基于业务的权限设计，灵活的细粒度权限控制
        </span>
        <br />
        <span role="img" aria-label="">
          🛫更灵活的前后端分离业务动态字典配置
        </span>
        <br />
      </Preview>
      {/* 致谢 */}
      <Typography.Text
        strong
        style={{
          marginBottom: 12,
        }}
      >
        <span style={{ fontSize: '20px', color: '#1890FF' }}>致谢</span>
      </Typography.Text>
      <Preview>
        <Icon type="heart" theme="twoTone" twoToneColor="#eb2f96" />
        &nbsp;
        <span>
          感谢蚂蚁金服体验技术部，开源了Ant Design 如此优秀的设计语言， umi、 dva、 egg...
          等众多如此优秀的框架，github每个isuess都能得到及时回复处理，有时还在深夜，非常感谢！
        </span>
        <br />
        <Icon type="heart" theme="twoTone" twoToneColor="#eb2f96" />
        &nbsp;
        <span>感谢开源社区同类型开源项目、SmallBun 在设计过程中有所借鉴、参考。</span>
        <br />
        <Icon type="heart" theme="twoTone" twoToneColor="#eb2f96" />
        &nbsp;
        <span>
          感谢技术类文章编写者，在最需要的时候，找到答案。致敬社区大佬们，向着大佬们方向所努力，在人迷茫的时候，犹如在茫茫大海中漂泊多日看到了灯塔。
        </span>
        <br />
        <Icon type="heart" theme="twoTone" twoToneColor="#eb2f96" />
        &nbsp;
        <span>感谢开源，致敬所有的开源作者、开源软件贡献者。</span>
        <br />
      </Preview>
      {/* 参与贡献 */}
      <Typography.Text
        strong
        style={{
          marginBottom: 12,
        }}
      >
        <span style={{ fontSize: '20px', color: '#1890FF' }}>参与贡献</span>
      </Typography.Text>
      <Preview>
        <span role="img" aria-label="">
          很喜欢阿里文化中的一句话：一群有情有义之人一起做一件有意义之事,恳请的希望有兴趣的同学能够参与到
          SmallBun 建设中来，让我们共同完善它，让我们共同成长，帮助更多开发者，解决更多的问题💪。
        </span>
      </Preview>
    </Card>
  </PageHeaderWrapper>
);
