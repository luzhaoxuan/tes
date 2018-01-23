import React, { PureComponent } from 'react';
import { Layout, Menu, Icon, Spin, Tag, Dropdown, Avatar, Divider } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import SiderMenu from '../SiderMenu';
import { getMenuData } from '../../common/menu';
import Authorized from '../../utils/Authorized';

const { Header } = Layout;

export default class GlobalHeader extends PureComponent {
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map((notice) => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      // transform id to item key
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };

  render() {
    const {
      currentUser,
      collapsed,
      logo,
      onMenuClick,
      location,
    } = this.props;

    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item disabled>
          <Icon type="user" />个人中心
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />退出登录
        </Menu.Item>
      </Menu>
    );
    return (
      <Header className={styles.header}>
        <div>
          <div className={styles.left}>
            <SiderMenu
              logo={logo}
              // 不带Authorized参数的情况下如果没有权限,会强制跳到403界面
              // If you do not have the Authorized parameter
              // you will be forced to jump to the 403 interface without permission
              Authorized={Authorized}
              menuData={getMenuData()}
              collapsed={collapsed}
              location={location}
            />
          </div>
          <div className={styles.right}>
            {currentUser.name ? (
              <Dropdown overlay={menu}>
                <span className={`${styles.action} ${styles.account}`}>
                  <Avatar size="small" className={styles.avatar} src={currentUser.avatar} />
                  <span style={{ color: '#fff' }} className={styles.name}>{currentUser.name}</span>
                </span>
              </Dropdown>
            ) : (
              <Spin size="small" style={{ marginLeft: 8 }} />
            )}
          </div>
        </div>
      </Header>
    );
  }
}
