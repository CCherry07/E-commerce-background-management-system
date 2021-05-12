<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/hone' }"></el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row
        ><el-col>
          <el-button type="primary">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table
        class="treeTable"
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false" >
        <!-- 是否有效 -->
      <!-- slot = 'isItEffective' slot-scope="scope" -->
      <template #isItEffective ='scope'>
        <i class="el-icon-success" 
        v-if="scope.row.cat_deleted===false"
        style="color:lightgreen"></i>
        <i class="e-icon-error"></i>
      </template>
      <!-- 层级列 -->
      <template #level='scope'>
        <el-tag type="" v-if="scope.row.cat_level==0">一级</el-tag>
        <el-tag type="success" v-else-if="scope.row.cat_level==1">二级</el-tag>
        <el-tag type="warning" v-else>三级</el-tag>
      </template>
      <!-- operating -->
      <template #operating = 'scope'>
        <el-button type="primary" icon="el-icon-edit"> </el-button>
        <el-button type="danger" icon="el-icon-delete"></el-button>
      </template>
      </tree-table>
      <!-- 分页区域 -->
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="querInfo.pagenum"
      :page-sizes="[5, 10, 20, 30]"
      :page-size="querInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类列表
      catelist: [],
      // getCateData的query
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      // 为table定义属性
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label:'是否有效',
          type:'template',
          template:'isItEffective'
        },
        {
          label:'层级',
          type:'template',
          template:'level'
        },
        {
          label:'操作',
          type:'template',
          template:'operating'
        },
      ],
    };
  },
  created() {
    this.getCateData();
  },
  methods: {
    async getCateData() {
      const { data: res } = await this.$http.get("categories", {
        params: this.querInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败");
      } else {
        console.log(res)
        this.catelist = res.data.result;
        this.total = res.data.total;
      }
    },

    handleSizeChange(newSize){
      this.querInfo.pagesize =newSize
      this.getCateData()
    },
    handleCurrentChange(newpage){
      this.querInfo.pagenum = newpage
      this.getCateData()
    }
  },
};
</script>

<style>
.treeTable{
  margin-top: 1%;
}
</style>
