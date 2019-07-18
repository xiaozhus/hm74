<template>
  <div class="article-container">

    <!-- 筛选区域 -->
    <el-card>
      <!-- 面包屑 -->
      <div slot="header">
        <my-bread>内容管理</my-bread>
      </div>
      <!-- 筛选表单 -->
      <el-form :model="reqParams" size="small" label-width="80px">
        <!-- 表单项 -->
        <el-form-item label="状态:">
          <el-radio-group v-model="reqParams.status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="频道:">
          <my-channel v-model="reqParams.channel_id"></my-channel>
        </el-form-item>

        <!-- 时间 -->
        <el-form-item label="日期:">
          <el-date-picker
            value-format="yyyy-MM-dd"
            @change="changeDate"
            v-model="dateValues"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search()">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 结果区域 -->
    <el-card>
      <div slot="header">
        根据筛选条件共查询到
        <b>{{ total }}</b>条结果
      </div>
      <!-- 当el-table元素中注入data对象数组后，
        在el-table-column中用prop属性来对应对象中的键名即可填入数据，
      用label属性来定义表格的列名。可以使用width属性来定义列宽。-->
      <el-table :data="articles">
        <el-table-column label="封面">
          <template slot-scope="scope">
            <!-- row当前行数据 -->
            <el-image :src="scope.row.cover.images[0]" style="width:100px;height:75px;">
              <div slot="error">
                <img src="../../assets/images/error.gif" width="100" height="75" alt />
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="标题" prop="title"></el-table-column>
        <el-table-column label="状态">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0" type="info">草稿</el-tag>
            <el-tag v-if="scope.row.status === 1">待审核</el-tag>
            <el-tag v-if="scope.row.status === 2" type="success">审核通过</el-tag>
            <el-tag v-if="scope.row.status === 3" type="warning">审核失败</el-tag>
            <el-tag v-if="scope.row.status === 4" type="danger">已删除</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" prop="pubdate"></el-table-column>
        <el-table-column label="操作" width="120">
          <!-- 作用域插槽 -->

          <template slot-scope="scope">
            <!-- 图标 -->
            <!-- circle  圆的按钮 -->
            <!-- plain  简单的-->
            <!-- primary 蓝色按钮 -->
            <!-- danger  红色按钮 -->
            <el-button @click="edit(scope.row.id)" icon="el-icon-edit" plain type="primary" circle></el-button>
            <el-button @click="del(scope.row.id)" icon="el-icon-delete" plain type="danger" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="box">
        <el-pagination
          background
          layout="prev, pager, next"
          @current-change="pager"
          :current-page="reqParams.page"
          :page-size="reqParams.per_page"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
// import { constants } from 'crypto'
// import { async } from 'q'
// 导入my-test
// import MyBread from '@/components/my-bread.vue'
export default {
  // 注册局部组件组成
  // components: { MyBread },
  // 请求参数
  data () {
    return {
      // 提交给后台的筛选条件数据
      reqParams: {
        // 分页
        page: 1,
        per_page: 20,
        // 默认数据： '' 和 null 的区别
        // 如果是 null,该字段是不会提交给后端的

        status: null,
        channel_id: null,
        begin_pubdate: null,
        end_pubdate: null
      },

      // 日期数据
      dateValues: [],

      // 文章列表数据
      articles: [],
      // 总条数
      total: 0
    }
  },
  created () {
    // 获取文章列表数据
    this.getArticles()
  },
  methods: {
    // 编辑
    edit (id) {
      this.$router.push(`/publish?id=${id}`)
    },
    // 删除
    del (id) {
      this.$confirm('此操作将永久删除该文章, 是否继续?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await this.$http.delete(`articles/${id}`)
          // 删除成功
          this.$message.success('删除成功')
          // 删除成功后更新列表
          this.getArticles()
        })
        .catch(() => {

        })
    },
    // 分页
    pager (newPage) {
      // 提交当前页码给后台  才能获取对应的数据
      this.reqParams.page = newPage
      this.getArticles()
    },
    // 选择时间的处理函数
    changeDate (values) {
      if (values) {
        this.reqParams.begin_pubdate = values[0]
        this.reqParams.end_pubdate = values[1]
      } else {
        this.reqParams.begin_pubdate = null
        this.reqParams.end_pubdate = null
      }
    },
    // 搜索
    search () {
      this.reqParams.pager = 1
      this.getArticles()
    },
    // 获取频道数据

    // 获取文章列表数据
    async getArticles () {
      const {
        data: { data }
      } = await this.$http.get('articles', { params: this.reqParams })
      this.articles = data.results
      // 获取总条数
      this.total = data.total_count
    }
  }
}
</script>

<style scoped lang="less">
.el-card {
  margin-bottom: 20px;
}
.box {
  text-align: center;
  margin-top: 20px;
}
</style>
