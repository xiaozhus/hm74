<template>
  <div class="image-container">
    <!-- 图片按钮 -->
    <div class="img-btn" @click="openDialog">
      <img :src="value || dafaultImage" alt />
    </div>
    <!-- 对话框 -->
    <el-dialog :visible.sync="dialogVisible" width="700px">
      <!-- activeName  选项卡标签的name属性的值-->
      <!-- label="用于管理" 选项卡标签的文字 -->
      <!-- el-tab-pane  标签的内容  就是选项卡对应的内容-->
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="素材库" name="image">
          <!-- 1.单选框 -->
          <div style="margin-bottom:10px">
            <el-radio-group size="small" @change="search()" v-model="reqParams.collect">
              <el-radio-button label="false">全部</el-radio-button>
              <el-radio-button label="true">收藏</el-radio-button>
            </el-radio-group>
          </div>
          <!-- 2.图片列表 -->
          <div class="img-item" v-for="item in images" :key="item.id" :class="{selected:selectedImageUrl==item.url}" @click="selected(item.url)">
            <img :src="item.url" alt />
          </div>
          <!-- 3.分页 -->
          <el-pagination
          v-if="total>reqParams.per_page"
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="reqParams.per_page"
          :current-page="reqParams.page"
          @current-change="pager"
          >
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="upload">
          <el-upload
            class="avatar-uploader"
            action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
            :show-file-list="false"
            :headers="headers"
            name="image"
            :on-success="handleSuccess"
          >
            <img v-if="uploadImageUrl" :src="uploadImageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmImage()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import dafaultImage from '../assets/images/default.png'
export default {
  name: 'my-image',
  data () {
    return {
      // 头部数据
      headers: {
        Authorization:
      'Bearer ' +
        JSON.parse(window.sessionStorage.getItem('hm74-toutiao')).token
      },
      // 控制对话框显示隐藏
      dialogVisible: false,
      //   控制选中的选项卡
      activeName: 'image',
      //   获取素材列表时 传参
      reqParams: {
        collect: false,
        page: 1,
        per_page: 8
      },
      //   上传图片后预览的地址
      uploadImageUrl: null,
      // 素材列表数据
      images: [],
      // 总条数
      total: 0,
      // 你选中的素材地址
      selectedImageUrl: null,
      // 你选中的图片  默认的是图片
      // value: dafaultImage
      dafaultImage
    }
  },
  props: ['value'],
  methods: {
    selected (url) {
      this.selectedImageUrl = url
      console.log('fdafasd')
    },
    // 确认图片
    confirmImage () {
      if (this.activeName === 'image') {
        // 1.如果是素材  使用 selectdImageUrl  作为封面
        if (!this.selectedImageUrl) return this.$message.warning('请选择素材')
        // this.value = this.selectedImageUrl/
        this.$emit('input', this.selectedImageUrl)
      } else {
        // 1.如果是上传图片   使用 uploadImageUrl  作为封面
        if (!this.uploadImageUrl) return this.$message.warning('请上传图片')
        // this.value = this.uploadImageUrl
        this.$emit('input', this.uploadImageUrl)
      }
      this.dialogVisible = false
    },
    // 上传成功
    handleSuccess (res) {
      // 预览
      this.uploadImageUrl = res.data.url
    },
    openDialog () {
      this.dialogVisible = true
      // 清除上一次的数据
      this.selectedImageUrl = null
      this.uploadImageUrl = null
      //   做其他事情   渲染素材列表
      this.getImages()
    },
    async getImages () {
      const { data: { data } } = await this.$http.get('user/images', { params: this.reqParams })
      this.images = data.results
      this.total = data.total_count
    },
    search () {
      this.reqParams.page = 1
      this.getImages()
    },
    pager (newPage) {
      this.reqParams.page = newPage
      this.getImages()
    }
  }
}
</script>

<style scoped lang="less">
.image-container{
  display: inline-block;
  margin-right: 20px;
}
.img-item {
  width: 150px;
  height: 120px;
  border: 1px dashed #ddd;
  display: inline-block;
  margin-right: 10px;
  position: relative;
  &.selected {
    &::before {
      content:'';
      position: absolute;
      width:100%;
      height:100%;
      background: rgba(0,0,0,.4) url(../assets/images/selected.png) no-repeat center / 50px 50px;
    }
  }
  img {
    display: block;
    width: 100%;
    height: 100%;
    // 图片填充的规则  图片等比例缩放
    object-fit: contain;
  }
}
.img-btn {
  width: 150px;
  height: 150px;
  border: 1px dashed #ddd;
  img {
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>
