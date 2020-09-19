<template>
<div>
  <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
</el-breadcrumb>
<el-card >
  <el-row :gutter="20">
    <el-col :span="8">
      <div class="grid-content bg-purple">
        <el-input placeholder="请输入内容" v-model='queryInfo.query' clearable @clear='getUserList'>
          <el-button slot="append" icon="el-icon-search" @click='getUserList'></el-button>
        </el-input>
      </div>
    </el-col>
    <el-col :span="3"><div class="grid-content bg-purple">
      <el-button type="primary" @click='addUserVisibile=true'>添加用户</el-button>
    </div></el-col>
  </el-row>
  <el-table :data='userList' border stripe>
    <el-table-column type="index"></el-table-column>
    <el-table-column label='姓名' prop='username'></el-table-column>
    <el-table-column label='邮箱' prop='email'></el-table-column>
    <el-table-column label='电话' prop='mobile'></el-table-column>
    <el-table-column label='角色' prop='role_name'></el-table-column>
    <el-table-column label='状态' prop='mg_state'>
      <template slot-scope='scope'>
        <el-switch v-model="scope.row.mg_state" @change='userStateChange(scope.row)'>
        </el-switch>
      </template>
    </el-table-column>
    <el-table-column label='操作' width='180px'>
      <template slot-scope='scope'>
        <el-button type="primary" icon="el-icon-edit" size='mini' @click='showEditDialog(scope.row.id)'></el-button>
        <el-button type="danger" icon="el-icon-delete" size='mini' @click='removeByUserId(scope.row.id)'></el-button>
        <el-tooltip  effect="dark" content="分配角色" placement="top" :enterable='false'>
          <el-button type="warning" icon="el-icon-setting" size='mini' @click='showSetRole(scope.row)'></el-button>
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
  </el-pagination>
</el-card>
<!-- 添加用户对话框 -->
<el-dialog
  title="添加用户"
  :visible.sync="addUserVisibile"
  width="50%" @close='addDialogClose'>
  <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" >
    <el-form-item label="用户名称" prop="username">
      <el-input v-model="addForm.username"></el-input>
    </el-form-item>
    <el-form-item label="用户密码" prop="password">
      <el-input v-model="addForm.password"></el-input>
    </el-form-item>
    <el-form-item label="用户邮箱" prop="email">
      <el-input v-model="addForm.email"></el-input>
    </el-form-item>
    <el-form-item label="用户手机" prop="mobile">
      <el-input v-model="addForm.mobile"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addUserVisibile = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
</el-dialog>
<!-- 修改用户对话框 -->
<el-dialog
  title="修改用户"
  :visible.sync="editUserVisible"
  width="50%"  @close='editFormClose'>
  <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
    <el-form-item  l-form-item label="用户名">
      <el-input v-model="editForm.username" disabled></el-input>
    </el-form-item>
    <el-form-item  l-form-item label="邮箱" prop='email'>
      <el-input v-model="editForm.email"></el-input>
    </el-form-item>
    <el-form-item  l-form-item label="电话" prop='mobile'>
      <el-input v-model="editForm.mobile"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editUserVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUser">确 定</el-button>
  </span>
</el-dialog>
<!-- 分配角色对话框 -->
<el-dialog
  title="分配角色"
  :visible.sync="setRolevisibile"
  width="50%" @close='setRoleClosed'>
<div>
  <p>当前的用户:{{userinfo.username}}</p>
  <p>当前的角色:{{userinfo.role_name}}</p>
  <p>分配新角色:
  <el-select v-model="selectedRoleID" placeholder="请选择">
    <el-option
      v-for="item in roleList"
      :key="item.id"
      :label="item.roleName"
      :value="item.id">
    </el-option>
  </el-select>
  </p>
</div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRolevisibile = false">取 消</el-button>
    <el-button type="primary" @click="setRoleUser">确 定</el-button>
  </span>
</el-dialog>
</div>
</template>
<script>
export default {
  data () {
    var checkEmail = (rule, value, cb) => {
      const ruleEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (ruleEmail.test(value)) {
        return cb()
      } else {
        cb(new Error('邮箱格式不正确'))
      }
    }
    var checkMobil = (rule, value, cb) => {
      const ruleMobil = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (ruleMobil.test(value)) {
        return cb()
      } else {
        cb(new Error('手机号码不正确'))
      }
    }

    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      addUserVisibile: false,
      addForm: { // 添加用户的表单数据
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkMobil, trigger: 'blur' }
        ]
      },
      editUserVisible: false,
      editForm: {},
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkMobil, trigger: 'blur' }
        ]
      },
      // 控制分配角色是否显示
      setRolevisibile: false,
      userinfo: [],
      roleList: [],
      selectedRoleID: ''
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.userList = res.data.users
      this.total = res.data.total
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    async userStateChange (userinfo) {
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error(res.meta.msg)
      }
      this.$message.success('更新状态成功')
    },
    addDialogClose () {
      this.$refs.addFormRef.resetFields()
    },
    addUser () {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return false
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success('用户添加成功')
        this.addUserVisibile = false
        this.getUserList()
      })
    },
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('/users/' + id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editForm = res.data
      this.editUserVisible = true
    },
    editFormClose () {
      this.$refs.editFormRef.resetFields()
    },
    editUser () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.put('/users/' + this.editForm.id, { email: this.editForm.email, mobile: this.editForm.mobile })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.getUserList()
        this.$message.success('修改用户数据成功')
        this.editUserVisible = false
      })
    },
    async removeByUserId (id) {
      const res = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (res !== 'confirm') return this.$message.info('取消了删除操作')
      const { data: result } = await this.$http.delete('/users/' + id)
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
      this.$message.success('删除成功')
      this.getUserList()
    },
    async showSetRole (userinfo) {
      this.userinfo = userinfo
      const { data: res } = await this.$http.get('/roles')
      if (res.meta.status !== 200) return this.$message.info(res.meta.msg)
      this.roleList = res.data
      this.setRolevisibile = true
    },
    async setRoleUser () {
      if (!this.selectedRoleID) return this.$message.error('未选择角色')
      const { data: res1 } = await this.$http.put(`/users/${this.userinfo.id}/role`, { rid: this.selectedRoleID })
      if (res1.meta.status !== 200) return this.$message.error(res1.meta.msg)
      this.getUserList()
      this.setRolevisibile = false
    },
    setRoleClosed () {
      this.selectedRoleID = ''
      this.userinfo = {}
    }
  }
}
</script>
<style lang="less" scoped>

</style>
