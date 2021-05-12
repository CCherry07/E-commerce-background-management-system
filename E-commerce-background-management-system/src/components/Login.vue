<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 表单 -->
      <el-form
        ref="loginRef"
        :model="loginForm"
        :rules="rules"
        label-width="0px"
        class="loginForm"
      >
        <el-form-item prop="username">
          <el-input
            prefix-icon="iconfont icon-user"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="iconfont icon-3702mima"
            v-model="loginForm.password"
            type="password"
          ></el-input>
        </el-form-item>
        
        <enquiry ref="yzm"></enquiry>
        <!-- 按钮 -->
        <el-form-item class="btn">
          <el-button type="primary" @click="submitForm">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// import {getLoginData} from '../network/login'
import Enquiry from './Enquiry'
export default {
  components:{
    Enquiry
  },
  data(){
    
    return{
      loginForm:{
        username:'admin',
        password:'123456'
      },
       rules: {
          username: [
            { required: true, message: '请输入用户名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          password:[
            {required: true, message: '请输入用户密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          ]
       },
    }
  },
  mounted: function(){
			this.$refs.yzm.createCode()
		},
methods:{

  resetLoginForm() {
    this.$refs.yzm.createCode()
    this.$refs.loginRef.resetFields()
    this.logout()
    } ,

   	submitForm(){
				const regex = new RegExp(this.$refs.yzm.checkCode, 'gi');
				if (this.$refs.yzm.picLyanzhengma == this.$refs.yzm.picLyanzhengma.match(regex)) { 
         this.login()
				  return true
				} else if(this.loginForm.username==''||
                  this.loginForm.password==''){
          return this.$message.error('用户信息未填入');
        }else if(this.$refs.yzm.picLyanzhengma==''){
          console.log(this.loginForm);
           return this.$message.error('验证码未输入');
        } else {
          this.$refs.yzm.createCode()
          return this.$message.error('验证码错误');
				}
        
       
			},
    login(){
        //  if(this.$refs.yzm.picLyanzhengma !==this.$refs.yzm.checkCode)return;
       
        this.$refs.loginRef.validate( async valid => {
          if(!valid)return;
          const { data :res}= await this.$http.post('login',this.loginForm)
          console.log(res)
           if(res.meta.status !==200){
            this.$refs.yzm.createCode()
            return this.$message.error('登录失败,用户信息填写错误')
           }else{
            this.$refs.yzm.createCode()
            this.$message.success('登录成功')
            sessionStorage.setItem('token',res.data.token)
            this.$router.push('/home')
           }
          
      })
    },
  }
};
</script>
<style Lang="less" scoped>
.login_container {
  background-color: #2e4e6e;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login_box {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40%;
  height: 40%;
  background-color: #fff;
  border-radius: 20px;
}
.avatar_box {
  position: absolute;
  transform: translate(0, -100%);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25%;
  height: 50%;
  border-radius: 50%;
  overflow: hidden;
  background-color: rgba(100, 100, 100, 0.8);
  box-shadow: 0 0 15px rgb(0, 255, 255);
}
.btn {
  position: absolute;
  top: 88%;
  right: 50%;
  transform: translate(50%);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>