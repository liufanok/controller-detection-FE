<template>
  <div class="login">
      <el-input v-model="name" placeholder="请输入用户名"></el-input>
       <el-input v-model="pwd" placeholder="请输入密码"></el-input>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      name:'',
      pwd:''
    }
  },
  mounted () {
      this.axios.post(url,{name:this.name,pwd:this.pwd}).then(res=>{

      }).catch(error=>{
        
      })
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
