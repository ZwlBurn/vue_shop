<template>
<div>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
    <el-breadcrumb-item>权限列表</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <el-table :data='rightsList' border stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column label='权限名称' prop='authName'></el-table-column>
      <el-table-column label='路径' prop='path'></el-table-column>
      <el-table-column label='权限等级' prop='level'>
        <template slot-scope='scoped'>
            <el-tag v-if='scoped.row.level==0'>等级一</el-tag>
            <el-tag v-else-if='scoped.row.level==1' type="success">等级二</el-tag>
            <el-tag v-else type="warning">等级三</el-tag>
        </template>
      </el-table-column>

    </el-table>
  </el-card>
</div>
</template>
<script>
export default {
  data () {
    return {
      rightsList: []
    }
  },
  created () {
    this.getRightsList()
  },
  methods: {
    async getRightsList () {
      const { data: res } = await this.$http.get('/rights/list')
      if (res.meta.status !== 200) return this.$message.error(res.message.msg)
      this.rightsList = res.data
    }
  }
}
</script>
<style lang="less" scoped>

</style>
