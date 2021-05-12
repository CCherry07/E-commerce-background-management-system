<template>
  <el-container class="home-cont">
    <!-- header -->
    <el-header>
      <div>
        <img
          src="https://img0.baidu.com/it/u=1986451467,394304688&fm=26&fmt=auto&gp=0.jpg"
        />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="iscollapse ? '64px':'200px'">
          <div class="toggle-btn" @click="togglebtn"><i :class="iscollapse ? 'el-icon-s-fold':'el-icon-s-unfold'"></i></div>
        <!-- 侧边栏 -->
        <el-menu
        :default-active="$route.path"
          background-color="#333744"
          text-color="#fff"
          :unique-opened="true"
            :collapse='iscollapse'
            :collapse-transition='iscollapse'
            router
        >
        <!-- 一级菜单 -->
          <el-submenu
            :index="String(item.id)"
            v-for="item in menulist"
            :key="item.id"
          >
            <template slot="title">
              <i :class="icons[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="String('/'+subItem.path)"
              v-for="subItem in item.children"
              :key="subItem.id"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
          
        </el-menu>
      </el-aside>
      <el-main><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
    iscollapse:false,
      menulist: [],
      icons:{
          '125':'iconfont icon-users',
          '103':'iconfont icon-tijikongjian',
          '101':'iconfont icon-shangpin',
          '102':'iconfont icon-danju',
          '145':'iconfont icon-baobiao'
      }
    };
  },
  created() {
    this.getMenuList();
  },
  methods: {
      togglebtn(){
          this.iscollapse= !this.iscollapse
      },

    logout() {
      window.sessionStorage.removeItem("token");
      this.$router.push("/login");
    },
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200)
        return this.$message.console.error(res.meta.msg);
      this.menulist = res.data;
    },
    
  },
};
</script>

<style scoped>
.home-cont {
  height: 100%;
}
.el-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #373d41;
}
.el-header > div {
  display: flex;
  align-items: center;
  color: #fff;
  width: 50%;
}
.el-header > div > img {
  width: 5%;
  height: auto;
  border-radius: 50%;
  margin-right: 1%;
}
.el-aside {
transition: all ease-in-out .5s;
  background-color: #333744;
}
.el-main {
  background-color: #fff;
}
.el-menu{
    border: 0;
}
.iconfont{
    margin-right:8% ;
}
.toggle-btn{
background-color:#2e3e4e;
color: #fff;
text-align: center;
cursor:pointer;
}
</style>