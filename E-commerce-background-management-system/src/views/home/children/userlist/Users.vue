<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- seach -->
      <el-row :gutter="20">
        <el-col :span="8"
          ><el-input
            placeholder="请输入内容"
            v-model="UserQuery.query"
            clearable
            @clear="getUserList"
            class="input-with-select"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4"></el-col>
        <el-col :span="4"
          ><ElButton type="primary" @click="addDialogVisible = true"
            >添加用户</ElButton
          ></el-col
        >
      </el-row>
      <!-- 用户数据 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <el-switch
              v-model="scope.row.mg_state"
              @change="uesrStateChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editUser(scope.row)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delUserById(scope.row.id)"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="showAssigningRoles(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="UserQuery.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="UserQuery.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="dialogClosed(0)"
    >
      <!-- 内容 -->
      <span>
        <el-form
          ref="formRef"
          :model="addform"
          label-width="80px"
          :rules="userrules"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addform.username"></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input v-model="addform.password"></el-input>
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addform.email"></el-input>
          </el-form-item>

          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addform.mobile"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <div slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="adduser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 展示编辑用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%">
      <el-form
        :model="editForm"
        :rules="userrules"
        ref="editFormRef"
        label="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button @click="dialogClosed(1)">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="showRoles"
      width="50%">
      <div>
        <p>当前的用户:{{addform.username}}</p>
        <p>当前的角色:{{addform.role_name}}</p>
        <el-select v-model="selRoleId" placeholder="请选择">
          <el-option v-for="item in rolesList " :label="item.roleName" :value="item.id" :key="item.id"></el-option>
        </el-select>
      </div>
      <div slot="footer">
        <el-button @click="showRoles = false">取 消</el-button>
        <el-button type="primary" @click="assigningRoles">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
      if (regEmail.test(value)) {
        return callback();
      } else {
        callback(new Error("请输入正确的邮箱"));
      }
    };
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        return callback();
      } else {
        callback(new Error("请输入正确的手机号"));
      }
    };

    return {
      //列表参数
      UserQuery: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      userList: [],
      rolesList:[],
      selRoleId:'',
      total: 0,
      addform: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      userinfo:'',
      userrules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            require: true,
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
          {
            require: true,
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入用户邮箱", trigger: "blur" },
          {
            require: true,
            min: 6,
            max: 20,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入用户手机号", trigger: "blur" },
          {
            require: true,
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      addDialogVisible: false,
      // 编辑用户对话框显示与隐藏
      editDialogVisible: false,
      showRoles:false,
      editForm: {
        username: "",
        email: "",
        mobile: "",
      },
    };
  },
  created() {
    // user数据请求
    this.getUserList();
  },
  methods: {
    // user数据请求
    async getUserList() {
      const { data: res } = await this.$http.get("/users", {
        params: this.UserQuery,
      });
      if (res.meta.status !== 200)
        return this.$message.console.error("res.meta.msg");
      this.userList = res.data.users;
      this.total = res.data.total;
    },
    //页数据响应
    handleSizeChange(newsize) {
      this.UserQuery.pagesize = newsize;
      this.getUserList();
    },
    //页数响应
    handleCurrentChange(newpage) {
      this.UserQuery.pagenum = newpage;
      this.getUserList();
    },
    //用户状态change
    async uesrStateChange(userinfo) {
      console.log(userinfo);
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state;
        return this.$message.error("更新用户状态失败！");
      }
      this.$message.success("更新用户状态成功！");
    },
    //离开对话框重置表单
    dialogClosed(num) {
      if (num == 0) {
        this.dialogVisible = false;
        this.$refs.addformRef.resetFields();
      } else if (num == 1) {
        this.editDialogVisible = false;
        this.$refs.editFormRef.resetFields();
      }
    },
    //点击按钮，添加新用户
    adduser() {
      this.$refs.formRef.validate(async (vaild) => {
        if (!vaild) return;
        const { data: res } = await this.$http.post("users", this.addform);
        if (res.meta.status !== 201) {
          return this.$message.error("添加用户失败");
        } else {
          this.getUserList();
          this.addDialogVisible = false;
          return this.$message.success("添加用户成功");
        }
      });
    },
    //展示编辑用户对话框
    editUser(scope) {
      this.editForm = scope;
      this.editDialogVisible = true;
    },
    //修改用户信息
    editUserInfo() {
      this.$refs.editFormRef.validate(async (vaild) => {
        if (!vaild) return;
        const { data: res } = await this.$http.put(
          "users/" + this.editForm.id,
          this.editForm
        );
        if (res.meta.status !== 200) { 
          return this.$message.error("修改用户信息失败");
        } else {
          this.getUserList();
          this.editDialogVisible = false;
          return this.$message.success("修改用户信息成功");
        }
      });
    },
    //根据id删除该用户信息
    async delUserById(id) {
      const configRresut = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      //确定按钮,返回字符串 confirm
      //取消按钮,返回字符串 cancel
      if (configRresut !== "confirm") {
        return this.$message.info("以取消删除");
      } else {
        const { data: res } = await this.$http.delete("users/" + id);
        if (res.meta.status !== 200) {
          return this.$message.error("删除用户信息失败");
        } else {
          this.getUserList();
          return this.$message.success("删除用户信息成功");
        }
      }
    },
   async showAssigningRoles(scope){
     this.selRoleId=''
     this.addform = scope
      this.showRoles = true
      // 获取角色列表
      const {data:res} = await this.$http.get('roles')
     if (res.meta.status !== 200) {
          return this.$message.error("获取角色列表失败失败");
        } else {
          this.rolesList = res.data
          return this.$message.success("获取角色列表成功");
        }
    },
   async assigningRoles(){
      if(!this.selRoleId)return this.$message.error('请选择用户角色')
      const {data:res} = await this.$http.put(`users/${this.addform.id}/role`,
      {rid: this.selRoleId})
      if (res.meta.status !== 200) {
          return this.$message.error("更新角色失败");
        } else {
          this.getUserList()
          this.showRoles = false
          return this.$message.success("更新角色成功");
        }
    }
  },
};
</script>

<style></style>
