import { Card, Col, Icon, Row, Tabs } from 'antd';
import React from 'react';
import { fields } from './fields';
import styles from './styles.less';

const { TabPane } = Tabs;
export interface IconPreviewProps {
  onSelect: Function;
}
/**
 * 图标浏览
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/10/29 21:26
 */
const IconPreview: React.FC<IconPreviewProps> = props => (
  <Tabs defaultActiveKey="direction">
    {fields.map(data => (
      <TabPane tab={data.description} key={data.category}>
        <Card className={styles.card} bordered={false}>
          <Row gutter={24} className={styles.iconPreview}>
            {data.icons.map(icon => (
              <Col span={4} key={icon}>
                <Icon type={icon} onClick={() => props.onSelect({ icon })} />
              </Col>
            ))}
          </Row>
        </Card>
      </TabPane>
    ))}
  </Tabs>
);
export default IconPreview;
