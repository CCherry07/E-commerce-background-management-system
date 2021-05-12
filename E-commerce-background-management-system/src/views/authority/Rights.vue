<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col
          ><el-button type="primary" @click="addDialogVisible = true"
            >添加角色</el-button
          ></el-col
        >
      </el-row>
    </el-card>
    <!-- 添加角色输入框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="dialogClosed()"
    >
      <!-- 内容 -->
      <span>
        <el-form
          ref="formRef"
          :model="addRoleForm"
          :rules="roleRules"
          label-width="80px"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addRoleForm.roleName"></el-input>
          </el-form-item>

          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addRoleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <div slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑role -->
    <el-dialog
      title="编辑用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="dialogClosed()"
    >
      <!-- 内容 -->
      <span>
        <el-form
          ref="formRef"
          :model="editRoleForm"
          :rules="roleRules"
          label-width="80px"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editRoleForm.roleName"></el-input>
          </el-form-item>

          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editRoleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <div slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRights">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 角色列表 -->
    <ElTable :data="rolelist" border stripe>
      <ElTableColumn type="expand">
        <template slot-scope="scope">
          <el-row
            :class="['bdbottom', 'vcenter', index1 === 0 ? 'bdtop' : '']"
            v-for="(item1, index1) in scope.row.children"
            :key="item1.id"
          >
            <!-- 一级权限 -->
            <el-col :span="5">
              <el-tag @close="delRightsById(scope.row, item1.id)" closable>{{
                item1.authName
              }}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <!-- 二三级权限 -->
            <el-col :span="19">
              <el-row
                :class="[index2 === 0 ? '' : 'bdtop', 'vcenter']"
                v-for="(item2, index2) in item1.children"
                :key="item2.id"
              >
                <el-col :span="6">
                  <el-tag
                    type="success"
                    @close="delRightsById(scope.row, item2.id)"
                    closable
                    >{{ item2.authName }}</el-tag
                  >
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="18">
                  <el-tag
                    v-for="item3 in item2.children"
                    :key="item3.id"
                    type="warning"
                    @close="delRightsById(scope.row, item3.id)"
                    closable
                  >
                    {{ item3.authName }}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </ElTableColumn>
      <!-- 索引列 -->

      <ElTableColumn type="index" label="#"></ElTableColumn>
      <ElTableColumn label="角色名称" prop="roleName"></ElTableColumn>
      <ElTableColumn label="角色描述" prop="roleDesc"></ElTableColumn>
      <ElTableColumn label="操作" width="auto">
        <template slot-scope="scope">
          <ElButton
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="msg(scope.row)"
            >编辑</ElButton
          >
          <ElButton
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="delRoleById(scope.row.id)"
            >删除</ElButton
          >
          <ElButton
            size="mini"
            type="warning"
            icon="el-icon-setting"
            @click="showPermissions(scope.row)"
            >分配权限</ElButton
          >
        </template>
      </ElTableColumn>
    </ElTable>
    <el-dialog
      title="分配权限"
      :visible.sync="setRightdialogVisible"
      width="50%"
    >
      <!--  -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        ref="treeRef"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defkeys"
      ></el-tree>
      <div slot="footer">
        <el-button @click="setRightdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 角色列表
      rolelist: [],
      // 角色id
      roleId: "",
      //角色
      role: "",
      addRoleForm: {
        roleName: "",
        roleDesc: "",
      },
      editRoleForm: {
        roleName: "",
        roleDesc: "",
      },
      roleInformation: [],
      // 角色权限列表
      rightsList: [],
      // 默认权限id值
      defkeys: [],
      // 表单规则
      roleRules: {
        roleName: [
          { required: true, message: "请输入角色名", trigger: "blur" },
          {
            required: true,
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],

        roleDesc: [
          { required: true, message: "请输入描述", trigger: "blur" },
          {
            required: true,
            min: 3,
            max: 20,
            message: "长度在 3 到 20个字符",
            trigger: "blur",
          },
        ],
      },
      treeProps: {
        label: "authName",
        children: "children",
      },
      addDialogVisible: false,
      editDialogVisible: false,
      setRightdialogVisible: false,
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    // 请求角色列表
    async getRoleList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色数据失败");
      } else {
        this.rolelist = res.data;
        //  console.log(this.rolelist);
      }
    },
    //  添加新角色
    addRole() {
      this.$refs.formRef.validate(async (vaild) => {
        if (!vaild) return;
        const { data: res } = await this.$http.post("roles", this.addRoleForm);
        this.roleInformation = res.data;
        if (res.meta.status !== 201) {
          return this.$message.error("添加角色失败");
        } else {
          this.getRoleList();
          this.addDialogVisible = false;
          return this.$message.success("添加角色成功");
        }
      });
    },
    //  离开对话框重置表单
    dialogClosed() {
      this.dialogVisible = false || this.$refs.formRef.resetFields();
    },
    msg(scope) {
      this.editDialogVisible = true;
      this.editRoleForm = scope;
    },
    // 修改角色信息
    async editRights() {
      const { data: res } = await this.$http.put(
        "roles/" + this.editRoleForm.id,
        this.editRoleForm
      );
      if (res.meta.status !== 200) {
        return this.$message.error("修改角色信息失败");
      } else {
        this.getRoleList();
        this.editDialogVisible = false;
        return this.$message.success("修改角色信息成功");
      }
    },
    // async delRights(scope) {
    //   const { data: res } = await this.$http.delete(
    //     "roles/" + scope.id,
    //   );
    //   if (res.meta.status !== 200) {
    //     console.log(res);
    //     return this.$message.error("删除角色失败");
    //   } else {
    //     this.getRoleList();
    //     return this.$message.success("删除角色成功");
    //   }
    // },

    //通过角色id删除角色
    async delRoleById(id) {
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
        console.log(configRresut);
        return this.$message.info("以取消删除");
      } else {
        const { data: res } = await this.$http.delete("roles/" + id);
        if (res.meta.status !== 200) {
          return this.$message.error("删除用户信息失败");
        } else {
          this.getRoleList();
          return this.$message.success("删除用户信息成功");
        }
      }
    },
    // 分配权限对话框
    async showPermissions(role) {
      this.defkeys = [];
      this.roleId = role.id;
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限列表失败");
      } else {
        this.rightsList = res.data;
        this.setRightdialogVisible = true;
        this.defkeys = [];
        this.getleafKeys(role, this.defkeys);
      }
    },
    //通过角色id删除角色某些权限
    async delRightsById(role, rightId) {
      const configRresut = await this.$confirm(
        "此操作将永久删除用户该权限, 是否继续?",
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
        return this.$message.info("以取消了删除");
      } else {
        const { data: res } = await this.$http.delete(
          `roles/${role.id}/rights/${rightId}`
        );
        if (res.meta.status !== 200) {
          return this.$message.error("取消权限失败");
        } else {
          this.setRightdialogVisible = false;
          role.children = res.data;
          console.log(role.children);
          return this.$message.success("取消权限成功");
        }
      }
    },
    // 获取默认权限id数组
    getleafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => {
        this.getleafKeys(item, arr);
      });
    },
    // 获取角色权限id数组
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      // this.defkeys = keys
      const idstr = keys.join(",");
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idstr }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("角色权限更新失败");
      } else {
        this.getRoleList();
        this.setRightdialogVisible = false;
        return this.$message.success("角色权限更新成功");
      }
    },
  },
};
</script>

<style>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
