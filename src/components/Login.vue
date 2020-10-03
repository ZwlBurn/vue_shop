<template>
<div class="login_container">
<div class="login_box">
  <div class="avatar_box">
    <img src="../assets/logo.png" alt="">
  </div>
  <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
    <el-form-item prop='username'>
      <el-input v-model='loginForm.username'>
        <i slot="prefix" class="iconfont icon-user"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop='password'>
      <el-input v-model='loginForm.password' type="password">
        <i slot="prefix" class="iconfont icon-3702mima"></i>
      </el-input>
    </el-form-item>
    <el-form-item class="btns">
      <el-button type="primary" @click='login'>登录</el-button>
      <el-button type="info" @click='resetLoginForm'>重置</el-button>
    </el-form-item>
  </el-form>
</div>
</div>
</template>
<script>
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        console.log(res.data)
        this.$message.success('登录成功')
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>
<style lang="less" scoped>
.login_container{
  height: 100%;
  background-color:#2b4b6b;
  .login_box{
    width: 450px;
    height: 300px;
    background-color:#fff;
    margin:0 auto;
    border-radius:3px;
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    .avatar_box{
      position: absolute;
      width:130px;
      height: 130px;
      border:1px solid #eee;
      border-radius:50%;
      padding:10px;
      box-shadow:0 0 10px #ddd;
      left:50%;
      transform:translate(-50%,-50%);
      background-color:#fff;
      img{
        width: 100%;
        height: 100%;
        border-radius:50%;
        background-color:#eee;
      }
    }
  }
}
  .btns{
      display:flex;
      justify-content:flex-end;
  }
 .login_form{
    position:absolute;
    bottom:0;
    width:100%;
    padding:0 20px;
    box-sizing:border-box;
  }
</style>
