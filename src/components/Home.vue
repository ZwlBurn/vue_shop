<template>
  <el-container class="home-container">
  <el-header>
    <div>
      <img src="../assets/heima.png" alt="">
      <span>电商后台管理系统</span>
    </div>
    <el-button type='info' @click='logout'>退出</el-button>
  </el-header>
  <el-container>
    <el-aside :width="isClassApse?'64px':'200px'">
      <div class="toggle_button" @click='toggleClassBtn'>|||</div>
      <el-menu background-color="#333744" text-color="#fff" active-text-color="#409eff" :default-active='activePath' unique-opened :collapse='isClassApse' :collapse-transition='false' router>
       <el-submenu :index="items.id+''" v-for='items in menuList' :key='items.id'>
        <template slot="title">
          <i :class="iconObj[items.id]"></i>
          <span>{{items.authName}}</span>
        </template>

        <el-menu-item :index="'/'+subItems.path" v-for='subItems in items.children' :key='subItems.id'>
          <template slot="title">
          <i class="el-icon-menu"></i>
          <span @click='saveNewState("/"+subItems.path)'>{{subItems.authName}}</span>
        </template>
       </el-menu-item>

      </el-submenu>
    </el-menu>
    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>

</template>
<script>
export default {
  data () {
    return {
      menuList: [],
      iconObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isClassApse: false,
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.mesg)
      this.menuList = res.data
    },
    toggleClassBtn () {
      this.isClassApse = !this.isClassApse
    },
    saveNewState (path) {
      window.sessionStorage.setItem('activePath', path)
      this.activePath = path
    }
  }
}
</script>
<style lang="less" scoped>
.home-container{
  height:100%;
}
.el-header{
  background-color:#373D41;
  display:flex;
  justify-content:space-between;
  padding-left:0;
  align-items:center;
  >div{
    display:flex;
    align-items:center;
  }
  span{
    color:#fff;
    font-size:20px;
    margin-left:15px;
  }

}
.el-aside{
  background-color:#333744;
}
.el-main{
  background-color:#eaedf1;
}
.iconfont{
  margin-right:10px;
}
.el-menu{
  border-right:0;
}
.toggle_button{
  background-color:#4a5064;
  color:#fff;
  text-align:center;
  font-size:10px;
  line-height:24px;
  letter-spacing:0.2em;
  cursor:pointer;
}
</style>
