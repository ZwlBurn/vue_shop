<template>
<div>
<el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
  <el-breadcrumb-item>参数列表</el-breadcrumb-item>
</el-breadcrumb>
<el-card>
 <el-alert title="注意：只允许为第三级分类设置相关参数!" type="warning" :closable='false' show-icon></el-alert>

<el-row class='optCate'>
  <el-col>
    <span>选择商品分类:</span>
     <el-cascader
    v-model="selectedCateKeys"
    :options="cateList"
    :props="propsCate"
    @change="handleChange" ></el-cascader>
  </el-col>
</el-row>

  <el-tabs v-model="activeName" @tab-click="handleTabClick">
    <!-- 动态参数列表 -->
    <el-tab-pane label="动态参数" name="many">
      <el-button type="primary" size="mini" :disabled='isBtnDisabled' @click='addDialogvisibile=true'>添加参数</el-button>
      <el-table :data='manyTableData' border stripe>
        <!-- 动态参数扩展列 -->
        <el-table-column type="expand">
          <!-- 循环动态生成tag标签 -->
          <template slot-scope='scope'>
            <el-tag closable v-for="(item,i) in scope.row.attr_vals" :key='i' @close='handleClose(i,scope.row)'>{{item}} </el-tag>
            <!-- 按钮的切换隐藏 -->
            <el-input class="input-new-tag"  v-if="scope.row.inputVisible"
              v-model="scope.row.inputValue"  ref="saveTagInput" size="small"
              @keyup.enter.native="handleInputConfirm(scope.row)"
              @blur="handleInputConfirm(scope.row)"
            >
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="参数名称" prop='attr_name'></el-table-column>
        <el-table-column label="操作">
          <template slot-scope='scope'>
            <el-button type="primary" icon="el-icon-edit" size='mini' @click='showEditParams(scope.row.attr_id)'>编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size='mini' @click='removeParams(scope.row.attr_id)'>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <!-- 静态参数列表 -->
    <el-tab-pane label="静态属性" name="only">
      <el-button type="primary" size="mini" :disabled='isBtnDisabled' @click='addDialogvisibile=true'>添加属性</el-button>
      <el-table :data='onlyTableData' border stripe>
         <!-- 静态参数扩展列 -->
        <el-table-column type="expand">
          <!-- 循环动态生成tag标签 -->
          <template slot-scope='scope'>
            <el-tag closable v-for="(item,i) in scope.row.attr_vals" :key='i' @close='handleClose(i,scope.row)'>{{item}} </el-tag>
            <!-- 按钮的切换隐藏 -->
            <el-input class="input-new-tag"  v-if="scope.row.inputVisible"
              v-model="scope.row.inputValue"  ref="saveTagInput" size="small"
              @keyup.enter.native="handleInputConfirm(scope.row)"
              @blur="handleInputConfirm(scope.row)"
            >
            </el-input>
            <el-button v-else class="button-new-tag"  size="small" @click="showInput(scope.row)">+ New Tag</el-button>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="属性名称" prop='attr_name'></el-table-column>
        <el-table-column label="操作">
          <template slot-scope='scope'>
            <el-button type="primary" icon="el-icon-edit" size='mini' @click='showEditParams(scope.row.attr_id)'>编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size='mini' @click='removeParams(scope.row.attr_id)'>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
  </el-tabs>
</el-card>

<!-- 添加参数的对话框 -->
<el-dialog
  :title="'添加'+titleText"
  :visible.sync="addDialogvisibile"
  width="50%" @close='addDialogClosed'>
  <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
  <el-form-item :label="titleText" prop="attr_name">
    <el-input v-model="addForm.attr_name"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogvisibile = false">取 消</el-button>
    <el-button type="primary" @click="addParams">确 定</el-button>
  </span>
</el-dialog>
<!-- 修改参数的对话框 -->
<el-dialog
  :title="'添加'+titleText"
  :visible.sync="editDialogvisibile"
  width="50%" @close='editDialogClosed'>
  <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
  <el-form-item :label="titleText" prop="attr_name">
    <el-input v-model="editForm.attr_name"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogvisibile = false">取 消</el-button>
    <el-button type="primary" @click="editParams">确 定</el-button>
  </span>
</el-dialog>
</div>
</template>
<script>
export default {
  data () {
    return {
      cateList: [],
      // 级联选择框的配置参数
      propsCate: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      // 被选中的级联选择框的数组id
      selectedCateKeys: [],
      activeName: 'many',
      manyTableData: [], // 动态参数的数据
      onlyTableData: [],
      addDialogvisibile: false, // 添加对话框的显示隐藏
      addForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      },
      editDialogvisibile: false,
      editForm: {},
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.info(res.meta.msg)
      this.cateList = res.data
    },
    // 级联选择器改变按钮
    handleChange () {
      this.getParamsData()
    },
    // 点击tab切换按钮
    handleTabClick () {
      this.getParamsData()
      console.log(this.activeName)
    },
    // 获取参数列表
    async getParamsData () {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return false
      }
      const { data: res } = await this.$http.get(`categories/${this.cateID}/attributes`, { params: { sel: this.activeName } })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      res.data.forEach(items => {
        items.attr_vals = items.attr_vals ? items.attr_vals.split(' ') : []
        items.inputVisible = false
        items.inputValue = ''
      })
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    addParams () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.post(`categories/${this.cateID}/attributes`, { attr_name: this.addForm.attr_name, attr_sel: this.activeName })

        if (res.meta.status !== 201) return this.$message.info(res.meta.msg)
        this.$message.success('添加参数成功')
        this.addDialogvisibile = false
        this.getParamsData()
      })
    },
    async showEditParams (attrId) {
      const { data: res } = await this.$http.get(`categories/${this.cateID}/attributes/${attrId}`, { params: { attr_sel: this.activeName } })
      if (res.meta.status !== 200) return this.$message.info(res.meta.msg)
      this.editForm = res.data
      this.editDialogvisibile = true
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    editParams (id) {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.put(`categories/${this.cateID}/attributes/${this.editForm.attr_id}`, { attr_name: this.editForm.attr_name, attr_sel: this.activeName })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success('修改参数成功')
        this.getParamsData()
        this.editDialogvisibile = false
      })
    },
    async removeParams (attrID) {
      const res = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (res !== 'confirm') {
        return this.$message.info('用户取消了删除')
      }

      const { data: res1 } = await this.$http.delete(`categories/${this.cateID}/attributes/${attrID}`)
      if (res1.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getParamsData()
    },
    handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return false
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrVal(row)
    },
    showInput (row) {
      // 让文本框自动获取焦点--这里有问题
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 保存attr_val
    async saveAttrVal (row) {
      const { data: res } = await this.$http.put(`categories/${this.cateID}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) return this.$message.error('添加失败')
      this.$message.success('修改参数项成功')
    },
    handleClose (i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVal(row)
    }
  },
  computed: {
    // 判断如果选中的不是第三级分类，直返回true，表示禁用按钮
    isBtnDisabled () {
      if (this.selectedCateKeys.length !== 3) {
        return true
      } else {
        return false
      }
    },
    // 当前选中的第三级分类
    cateID () {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    // 动态设置添加参数的标题
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>
<style lang='less' scoped>
.optCate{
  margin:15px 0;
}
.el-tag{
  margin:10px;
}
.input-new-tag{
  width:100px;
}
</style>
