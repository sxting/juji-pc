<template>
    <div :class="className">
        <a-dropdown >
            <span class="action account">
              <a-avatar
                size="small"
                class="avatar"
                src='https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'
                alt="avatar"
              />
              <span class="name">Ryan Ru</span>
            </span>

            <a-menu slot="overlay" class="menu">
                <a-menu-item key="logout">
                    <a-icon type="logout"/>
                    退出登录
                </a-menu-item>
            </a-menu>
          </a-dropdown>
          <a-setting-drawer :collapse="collapse"/>
    </div>
</template>

<script>
import { Tooltip, Icon, Dropdown, Menu, Avatar, Modal, Divider } from "ant-design-vue";
import NoticeIcon from "@/components/NoticeIcon"
import SettingDrawer from "@/components/SettingDrawer"
export default {
  data: () => ({
    collapse: false
  }),
  components: {
    ATooltip: Tooltip,
    AIcon: Icon,
    ADropdown: Dropdown,
    AMenu: Menu,
    AMenuItem: Menu.Item,
    AMenuDivider: Menu.Divider,
    AAvatar: Avatar,
    ANoticeIcon: NoticeIcon,
    ANoticeIconTab: NoticeIcon.Tab,

    ADivider: Divider,
    ASettingDrawer: SettingDrawer
  },
  props:["theme","layout"],
  methods: {

    handleMenuClick(e){
       if(e.key==='gitee'){
           window.open('https://gitee.com/ruyangit/seed-workbench-ui.git','_blank')
       }else{
           window.open('https://github.com/ruyangit/seed-workbench-ui.git','_blank')
       }
    },
    success() {
      Modal.success({
        title: '友好的一个提示',
        content: (  // JSX support
          <div>
            <p>使用文档，组件API，等说明。正在加班整理中...</p>
            <p>您可以先 Star 一个，追踪后面的更新。</p>
            <p>欢迎 Pr。</p>
          </div>
        ),
      });
    },
  },
  computed:{
      className(){
        let className = 'ai-header-right';
        if (this.theme === 'dark' && this.layout==='topmenu') {
            className = `ai-header-right dark`;
        }
        return className;
      }
  }
};
</script>
