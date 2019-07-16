<template>
    <div class="welcome-container">
        <img src="../../assets/images/welcome.jpg" alt="">
    </div>
</template>

<script>
export default {
  created () {
    // this.$http.get('http://ttapi.research.itcast.cn/mp/v1_0/articles').then(res => console.log(res.data))
  }
}
</script>

<style scope lang="less">
.welcome-container {
    text-align: center;
}
</style>
