<template>
<div>
  <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
  <el-breadcrumb-item>商品分类</el-breadcrumb-item>
</el-breadcrumb>
<el-card>
  <el-row>
  <el-col>
    <el-button type="primary" @click='showAddCate'>添加分类</el-button>
  </el-col>
  </el-row>
  <tree-table :data='cateList' :columns='columns' :selection-type='false' :expand-type='false' show-index index-text='#' border :show-row-hover='false' class="treeTable">
    <!-- 是否有效 -->
    <template slot='isok' slot-scope='scope'>
      <i class="el-icon-success" v-if='scope.row.cat_deleted===false' style="color:lightgreen;"></i>
      <i class="el-icon-error" v-else style="color:red;"></i>
    </template>
    <!-- 排序 -->
     <template slot='order' slot-scope='scope'>
      <el-tag v-if='scope.row.cat_level===0' size='mini'>一级</el-tag>
      <el-tag v-else-if='scope.row.cat_level===1' type='success' size='mini'>二级</el-tag>
      <el-tag v-else type='warning' size='mini'>三级</el-tag>
    </template>
    <!-- 操作 -->
    <template slot='opt' >
      <el-button type="primary" icon="el-icon-edit" size='mini'>编辑</el-button>
      <el-button type="danger" icon="el-icon-delete" size='mini'>删除</el-button>
    </template>
  </tree-table>
  <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryinfo.pagenum"
      :page-sizes="[2, 5, 10, 15]"
      :page-size="queryinfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
  </el-pagination>
  <el-dialog
  title="添加分类"
  :visible.sync="addCatevisibile"
  width="=50%" @click='addCateDialogClosed'>
  <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px" >
    <el-form-item label="分类名称" prop="cat_name">
      <el-input v-model="addCateForm.cat_name"></el-input>
    </el-form-item>
    <el-form-item label="父级分类">
       <el-cascader
      v-model="selectedKeys"
      :options="parentCateList"
      :props="cascaderProps"
      @change="parentCateChange" clearable></el-cascader>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addCatevisibile = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
</el-dialog>
</el-card>
</div>
</template>
<script>
export default {
  data () {
    return {
      queryinfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      cateList: [],
      total: 0,
      // tree-table的每一列的数据源
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      addCatevisibile: false,
      // 添加分类的数据
      addCateForm: {
        cat_name: '', // 要添加的分类名称
        cat_pid: 0, // 父级分类的id
        cat_level: 0// 分类的等级，默认是添加的1级分类
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      parentCateList: [], // 要展示的父级分类
      selectedKeys: [], // 选中了的父级分类id数组
      cascaderProps: { // 指定级联选择器的配置对象
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories', { params: this.queryinfo })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.cateList = res.data.result
      this.total = res.data.total
    },
    handleSizeChange (val) {
      this.queryinfo.pagesize = val
      this.getCateList()
    },
    handleCurrentChange (val) {
      this.queryinfo.pagenum = val
      this.getCateList()
    },
    showAddCate () {
      this.getParentCartList()
      this.addCatevisibile = true
    },
    async getParentCartList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) return this.$message.info(res.meta.msg)
      this.parentCateList = res.data
      console.log(this.parentCateList)
    },
    parentCateChange () {
      console.log(this.selectedKeys)
      if (this.selectedKeys.length > 0) {
      //  父级分类的id
        this.addCateForm.pid = this.selectedKeys[this.selectedKeys - 1]
        // 当前分类的等级
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 点击按钮添加分类
    addCate () {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success('添加成功')
        this.addCatevisibile = false
        this.getCateList()
      })
    },
    addCateDialogClosed () {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.pid = 0
      this.addCateForm.cat_level = 0
    }
  }
}
</script>
<style lang="less" scoped>
.treeTable{
  margin-top:15px;
}
.el-cascader{
  width:100%;
}
.el-cascader-panel>.el-cascader-menu {
  height: 300px!important;
}
</style>
