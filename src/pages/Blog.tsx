import React from 'react';
import { Card, Timeline } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

export default (): React.ReactNode => (
  <PageHeaderWrapper>
    <Card>
      <Timeline>
        <Timeline.Item color="green">
          <p>1.0.1版本发布</p>
          <p>修复XXX</p>
          <p>更新XXX</p>
        </Timeline.Item>
        <Timeline.Item color="green">
          <p>1.0.0初版发布 2020-01-01</p>
        </Timeline.Item>
        <Timeline.Item color="green">2019年10月份开始学习并编写</Timeline.Item>
      </Timeline>
    </Card>
  </PageHeaderWrapper>
);
