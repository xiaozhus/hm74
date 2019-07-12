<template>
    <div class="login-container">
        <el-card class="login-box">
            <img src="../../assets/images/logo_index.png" alt="">
            <!-- 登录表单 -->
            <el-form ref="loginFrom" :status-icon="true" :model="loginFrom" :rules="loginRules">
                <!-- 手机号 -->
                <el-form-item prop="mobile">
                    <el-input v-model="loginFrom.mobile" placeholder="请输入手机号"></el-input>
                </el-form-item>

                <!-- 验证码 -->
                <el-form-item prop="code">
                    <el-input v-model="loginFrom.code" placeholder="请输入验证码"  style="width:240px"></el-input>
                    <!-- 发送验证码 -->
                    <el-button style="float:right">发送验证码</el-button>
                </el-form-item>

                <el-form-item>
                    <el-checkbox :value="true"><span style="color:black">我已阅读并同意</span>用户协议<span style="color:black">和</span>隐私条款</el-checkbox>
                </el-form-item>
                <!-- 登录按钮 -->
                <el-form-item>
                    <el-button style="width:100%" type="primary" @click="login()">登录</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
export default {
  data () {
    //   校验手机号
    const checkMoblie = (rule, value, callback) => {
      // 检验逻辑   把value拿出来进行手机号的格式的校验
      if (/^1[3-9]\d{9}$/.test(value)) {
        callback()
      } else {
        callback(new Error('手机号格式错误'))
      }
    }
    return {
      // 表单数据对象
      loginFrom: {
        mobile: '',
        code: ''
      },
      //   表单验证规则对象
      loginRules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          //   自定义规则
          { validator: checkMoblie, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { len: 6, message: '请输入6位数字', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login () {
      // 对整个表单进行效验
      this.$refs.loginFrom.validate(valid => {
        if (valid) {
          // 提交登陆请求
          this.$http.post('http://ttapi.research.itcast.cn/mp/v1_0/authorizations',
            this.loginFrom
          )
            .then(res => {
              // res 是响应对象   包含  后台返回的数据  res.data
              // console.log(res.data)
              // 1.跳转到首页
              // TODD2.保存用户的信息   用来判断登陆的状态

              // 编程式导航
              this.$router.push('/')
            })
            .catch(() => {
              // 提示
              this.$message.error('手机号或验证码错误')
            })
        }
      })
    }
  }
}
</script>

<style scoped lang='less'>
    .login-container {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0px;
        left: 0px;
        // background: red;
        // cover 后面容器 多余的裁剪      contain在容器内容完全显示图片
        // 背景定位   /    背景图片
        background: url(../../assets/images/login_bg.jpg)no-repeat center / cover;
        .login-box {
            width: 400px;
            height: 330px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            img {
                display: block;
                width: 200px;
                margin: 10px auto;
            }
        }
    }
</style>
