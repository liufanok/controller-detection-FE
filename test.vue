<style lang="scss" scoped>
  #user {
    .search-bar {
      margin: 20px 0;
      display: flex;
      li {
        margin-right: 10px;
      }
    }
    .pagination {
      margin: 20px 0;
      display: flex;
      justify-content: center;
    }
  }
  // sss
</style>

<template>
  <div id="user">
    <ul class="search-bar">
      <li>
        <el-input @keyup.enter.native="searchRole" v-model="search.username" placeholder="请输入用户名"></el-input>
      </li>
      <li>
        <el-input @keyup.enter.native="searchRole" v-model="search.phone" placeholder="请输入用户手机"></el-input>
      </li>
      <li>
        <el-input @keyup.enter.native="searchRole" v-model="search.email" placeholder="请输入注册邮箱"></el-input>
      </li>
      <li>
        <el-button @click="searchRole" type="primary">搜索</el-button>
      </li>
    </ul>
    <el-table :data="list" row-key="id" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID">
        <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
            </template>
                  </el-table-column>
                      <el-table-column  align="center" label="回路名">
            <template slot-scope="scope">
              <span>{{scope.row.loop_name}}</span>
            </template>
                  </el-table-column>
                  <el-table-column  align="center" label="所属车间">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
      </el-table-column>
         <el-table-column
      fixed="right"
      label="操作"
      align="center"
      width="200">
      <template slot-scope="scope">
        <el-button @click="handleEdit(scope.row)" type="primary" size="mini" icon="el-icon-edit"> </el-button>
        <el-button @click="plantDelete(scope.row)" type="primary" size="mini" icon="el-icon-delete"></el-button>
      </template>
    </el-table-column>
    </el-table>
       <div class="pagination" v-if="search.total>search.limit">
      
                 <el-pagination
            layout="prev, pager, next"
            :current-page="search.page"
            @current-change="paginationCurrent"
            :total="search.total">
        </el-pagination>
        </div>
  </div>
</template>
<script>
  var qs = require('qs')
  import request from '@/utils/request'
  export default {
    data() {
      return {
        tableData: '',
        search: {
          username: '',
          phone: '',
          email: '',
          status: '',
          total: '',
          page: 1,
          limit: 10
        }
      }
    },
    mounted() {
      this.getUserList(this.search.limit, this.search.page)
    },
    methods: {
      getUserList(limit, page) {
        const data = {
          username: this.search.username,
          phone: this.search.phone,
          email: this.search.email,
          status: this.search.status,
          role: this.search.role,
          limit: limit,
          page: page
        }
        request({
          url: '/api/v1/user/user-list',
          method: 'post',
          data: qs.stringify(data)
        }).then(res => {
          console.log(res.data.data)
          this.tableData = res.data.data.data
          // this.getList(this.name, 1, this.listQuery.limit)
          this.$message({
            type: 'success',
            message: '更新成功!'
          })
        })
      }
    }
  }
</script>
