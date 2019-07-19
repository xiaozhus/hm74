<template>
  <div class="image-container" v-loading="loading">
    <el-card>
      <div slot="header">
        <my-bread>素材管理</my-bread>
      </div>
      <div style="margin-bottom:20px">
        <!-- 按钮式的单选框 -->
        <!-- search()  改变搜索 从新搜索列表数据 -->
        <el-radio-group size="small" @change="search()" v-model="reqParams.collect">
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <!-- 绿色按钮 -->
        <el-button @click="dialogVisible=true" size="small" type="success" style="float:right">添加素材</el-button>
      </div>
      <!-- 图片列表 -->
      <ul class="img-list">
        <li v-for="item in image" :key="item.id">
          <img :src="item.url" alt />
          <div class="fot" v-if="!reqParams.collect">
            <span @click="toggleFav(item)" class="el-icon-star-off" :class="{red:item.is_collected}"></span>
            <span @click="delimage(item.id)" class="el-icon-delete"></span>
          </div>
        </li>
      </ul>
      <el-pagination
        v-if="total>reqParams.per_page"
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="reqParams.per_page"
        :current-page="reqParams.page"
        @current-change="pager"
      ></el-pagination>
    </el-card>
    <!-- 对话框 -->
    <el-dialog title="添加素材" :visible.sync="dialogVisible" width="300px">
      <el-upload
        class="avatar-uploader"
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :headers="headers"
        :show-file-list="false"
        :on-success="handleSuccess"
        name="image"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { async } from 'q'
export default {
  data () {
    return {
      // 参数对象
      reqParams: {
        collect: false,
        // 页数
        page: 1,
        // 每页显示多少条
        per_page: 10
      },
      // 素材列表
      image: [],
      // 加载数据
      loading: false,
      // 总条数
      total: 0,
      // 添加素材相关数据
      dialogVisible: false,
      imageUrl: null,
      headers: {
        Authorization: 'Bearer ' + JSON.parse(window.sessionStorage.getItem('hm74-toutiao')).token
      }
    }
  },
  created () {
    // 获取素材列表数据
    this.getImage()
  },
  methods: {
    // 删除图片
    delimage (id) {
      this.$confirm('此操作将永久删除该图片, 是否继续?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$http.delete('user/images/' + id)
        this.$message.success('删除成功')
        // 删除成功后,更新列表
        this.getImage()
      }).catch(() => {

      })
    },
    // 切换收藏
    async toggleFav (item) {
      const { data: { data } } = await this.$http.put('user/images/' + item.id, {
        collect: !item.is_collected
      })
      // 成功提示
      this.$message.success('操作成功')
      // 把当前的图片的状态改成操作后后台的状态
      item.is_collected = data.collect
    },
    // 上传成功时的方法
    handleSuccess (res) {
      // 1.预览2s中
      this.imageUrl = res.data.url
      this.$message.success('上传成功')
      window.setTimeout(() => {
        // 2.自动关闭对话框.更新列表dia
        this.dialogVisible = false
        this.getImage()
        // 再次打开对话框的时候,预览的是上传按钮,不是之前的图片
        this.imageUrl = null
      }, 2000)
    },

    // 分页功能
    pager (newPage) {
      // 修改提交的参数当中的pager为目前选择的页码
      this.reqParams.page = newPage
      // 从新向后台发起请求
      this.getImage()
    },
    search () {
      // 切换全部收藏
      this.reqParams.page = 1
      this.getImage()
    },
    async getImage () {
      this.loading = true
      const {
        data: { data }
      } = await this.$http.get('user/images', { params: this.reqParams })
      // 获取数据成功
      this.image = data.results
      // 设置总条数
      this.total = data.total_count
      this.loading = false
    }
  }
}
</script>

<style scoped lang="less">
.img-list {
  list-style: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  li {
    width: 150px;
    height: 130px;
    border: 1px dashed #ddd;
    float: left;
    margin-left: 50px;
    margin-bottom: 20px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
      display: block;
    }
    .fot {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 30px;
      line-height: 30px;
      text-align: center;
      background: raba(0, 0, 0, 0.5);
      color: #fff;
      span {
        margin: 0 20px;
        &.red {
          color: red;
        }
      }
    }
  }
}
</style>
