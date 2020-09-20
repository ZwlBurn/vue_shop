<template>
  <div>
  <el-breadcrumb separator="/home">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
    <el-breadcrumb-item>添加商品</el-breadcrumb-item>
  </el-breadcrumb>
<el-card>
      <!-- 文字提示区域 -->
  <el-alert title="添加商品信息" type="info" center
    show-icon :closable="false">
  </el-alert>
  <!-- step步骤条区域 减0是为了把字符串转成数字 -->
  <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
    <el-step title="基本信息"></el-step>
    <el-step title="商品参数"></el-step>
    <el-step title="商品属性"></el-step>
    <el-step title="商品图片"></el-step>
    <el-step title="商品内容"></el-step>
    <el-step title="完成"></el-step>
  </el-steps>
  <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position='top'>
    <!-- tab标签页 -->
    <el-tabs v-model='activeIndex' :tab-position="'left'" :before-leave='beforeTabLiave' @tab-click='tabClicked'>
      <!-- 基本信息 -->
      <el-tab-pane label="基本信息" name='0'>
        <el-form-item label="商品名称" prop='goods_name'>
          <el-input v-model='addForm.goods_name'></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop='goods_price'>
          <el-input v-model='addForm.goods_price' type='number'></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop='goods_weight'>
          <el-input v-model='addForm.goods_weight' type='number'></el-input>
        </el-form-item>
         <el-form-item label="商品数量" prop='goods_number'>
          <el-input v-model='addForm.goods_number' type='number'></el-input>
        </el-form-item>
        <el-form-item label="商品分类" prop='goods_cat'>
          <el-cascader
            v-model="addForm.goods_cat"
            :options="cateList"
            :props="cateProps"
            @change="handleCateChange"></el-cascader>
         </el-form-item>
      </el-tab-pane>
      <!-- 商品参数 -->
      <el-tab-pane label="商品参数" name='1'>
       <el-form-item :label="item.attr_name" v-for='item in manyTabData' :key='item.attr_id'>
        <el-checkbox-group v-model="item.attr_vals">
          <el-checkbox :label="cb" v-for='(cb,i) in item.attr_vals' :key='i' border></el-checkbox>
        </el-checkbox-group>
       </el-form-item>
      </el-tab-pane>
      <!-- 商品属性 -->
      <el-tab-pane label="商品属性" name='2'>
        <el-form-item :label='item.attr_name' v-for='item in onlyTabData' :key='item.attr_id'>
          <el-input v-model='item.attr_vals'></el-input>
        </el-form-item>
      </el-tab-pane>
      <!-- 商品图片 -->
      <el-tab-pane label="商品图片" name='3'>
        <el-upload
          :action="uploadUrl"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          list-type="picture" :headers='headersObj'
          :on-success='handleSuccess'>
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-tab-pane>
      <!-- 商品内容 -->
      <el-tab-pane label="商品内容" name='4'>
        <quill-editor v-model='addForm.goods_introduce'></quill-editor>
        <el-button type="primary" class="btnClass" @click="add">添加商品</el-button>
      </el-tab-pane>
    </el-tabs>
  </el-form>

</el-card>
<!-- 图片预览对话框 -->
<el-dialog
  title="图片预览"
  :visible.sync="previewVisible"
  width="50%">
  <img :src="this.previewPath" alt="" class="previewImg">
</el-dialog>
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  data () {
    return {
      activeIndex: '0', // 进度条的激活项
      addForm: { // 添加表单的数据对象
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [], // 商品所属的分类数组
        pics: [],
        goods_introduce: '', // 商品的详细描述
        attrs: []// 里面是动态参数和静态属性
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      cateList: [], // 商品分类列表
      selectedCateKeys: [], // 选择的商品分类id
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      manyTabData: [], // 动态参数数据列表
      onlyTabData: [], // 静态属性数据列表
      uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      headersObj: { // 图片上传header的请求头对象
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPath: '',
      previewVisible: false
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.info('获取数据失败')
      this.cateList = res.data
    },
    handleCateChange () {
      console.log(this.addForm.goods_cat)
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    beforeTabLiave (activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    async tabClicked () {
      // 点击的是动态参数的面板
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } })
        if (res.meta.status !== 200) return this.$message.error('获取参数列表失败')
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTabData = res.data
      } else if (this.activeIndex === '2') {
        // 点击的是静态属性的面板
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } })
        if (res.meta.status !== 200) return this.$message.error('获取静态属性失败')
        this.onlyTabData = res.data
        console.log(this.onlyTabData)
      }
    },
    // 处理图片预览功能
    handlePreview (file) {
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    // 处理图片移除操作
    handleRemove (file) {
      // 获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      const i = this.addForm.pics.findIndex(x =>
        x.pic === filePath
      )
      this.addForm.pics.splice(i, 1)
    },
    // 监听图片上传成功的事件
    handleSuccess (response) {
      const picInfo = {
        pic: response.data.tmp_path
      }
      this.addForm.pics.push(picInfo)
      console.log(this.addForm)
    },
    add () {
      // console.log(this.addForm)
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请输入合法的表单项')
        }
        const from = _.cloneDeep(this.addForm)
        from.goods_cat = from.goods_cat.join(',')
        this.manyTabData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals.join(' ') }
          this.addForm.attrs.push(newInfo)
        })
        this.onlyTabData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addForm.attrs.push(newInfo)
        })
        from.attrs = this.addForm.attrs
        console.log(from)
        const { data: res } = await this.$http.post('goods', from)
        if (res.meta.status !== 201) return this.$message.error('添加失败')
        this.$message.success('添加成功')
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateId () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>
<style lang="less" scoped>
.el-checkbox{
  margin:0 10px 0 0!important;
}
.previewImg{
  width: 100%;
}
.btnClass{
  margin-top:15px;
}
</style>
