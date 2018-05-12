<template>
  <div id="user" class="app-container calendar-list-container">
    <div class="add-role">
      <el-button @click="handlAddRole" type="primary">新增管理员</el-button>
      <el-button @click="uploadUser" type="primary">批量导入</el-button>
    </div>
    <ul class="search-bar">
      <li>
        <el-input clearable @keyup.enter.native="searchRole" v-model="search.username" placeholder="请输入用户名"></el-input>
      </li>
      <li>
        <el-input clearable @keyup.enter.native="searchRole" v-model="search.phone" placeholder="请输入用户手机"></el-input>
      </li>
      <li>
        <el-input clearable @keyup.enter.native="searchRole" v-model="search.email" placeholder="请输入注册邮箱"></el-input>
      </li>
      <li>
        <el-select clearable v-model="search.role" filterable placeholder="请选择角色">
          <el-option v-for="(item,index) in role_list" :key="index" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </li>
      <li>
        <el-button @click="searchRole" type="primary">搜索</el-button>
      </li>
    </ul>
    <!-- Note that row-key is necessary to get a correct row order. -->
    <el-table :data="list" row-key="id" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="50">
        <template slot-scope="scope">
                <span>{{scope.row.id}}</span>
</template>
      </el-table-column>
      <!-- username -->
      <el-table-column align="center" label="用户名" >
<template slot-scope="scope">
  <span>{{scope.row.username}}</span>
</template>
      </el-table-column>
      <el-table-column align="center" label="邮件" >
<template slot-scope="scope">
  <span>{{scope.row.email}}</span>
</template>
      </el-table-column>
      <el-table-column align="center" label="电话"  width="120">
<template slot-scope="scope">
  <span>{{scope.row.phone}}</span>
</template>
      </el-table-column>
       <el-table-column align="center" label="状态"  width="80">
<template slot-scope="scope">
  <!-- <span>{{scope.row.status}}</span> -->
  <el-tag v-if="scope.row.status==10" type="success">正常</el-tag>
  <el-tag v-else type="danger">禁用</el-tag>
</template>
      </el-table-column>
      <!-- ？roles -->
       <el-table-column align="center" label="角色" width="80">
<template slot-scope="scope">
  <span>{{scope.row.roles}}</span>
</template>
      </el-table-column>
      <!-- create_time -->
      <!-- belong -->
       <el-table-column align="center" label="所属车间" >
<template slot-scope="scope">
  <span>{{scope.row.belong}}</span>
</template>
      </el-table-column>
       <el-table-column align="center" label="创建时间" >
<template slot-scope="scope">
  <span>{{scope.row.create_time}}</span>
</template>
      </el-table-column>
      <el-table-column
      fixed="right"
      label="操作"
      align="center"
      width="200">
<template slot-scope="scope">
  <el-button @click="handleSet(scope.row)" type="primary" size="mini" icon="el-icon-setting"> </el-button>
  <el-button @click="handleEdit(scope.row)" type="primary" size="mini" icon="el-icon-edit"> </el-button>
</template>
    </el-table-column>
    </el-table>
<!-- // 分页   v-if="search.total>search.limit"-->
    <div class="pagination">
      
                 <!-- <el-pagination
            layout="prev, pager, next"
            :current-page="search.page"
            @current-change="currentChange"
            :total="Number(search.total)">
        </el-pagination> -->

            <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="search.page"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="Number(search.total)">
       </el-pagination>
        </div>
        <!-- 编辑 -->
         <div v-if="dialog.edit">
           <el-dialog
            title="编辑"
            :visible.sync="dialog.edit"
            :before-close="cancleEdit"
            width="400px"
            center>
            <ul class="dialog-edit">
               <li>
                   <label for="">用户名</label>
                    <el-input disabled size="small" placeholder="请输入用户名" v-model="edit.username">
                   
                </el-input>
               </li>
                <li>
                   <label for="">手机号</label>
                    <el-input size="small" placeholder="请输入手机号" v-model="edit.phone">
                   
                </el-input>
               </li>
                <li>
                   <label for="">Email</label>
                  <el-input size="small" placeholder="请输入Email" v-model="edit.email">      
                </el-input>
               </li>
               <li>
                 <!--     active-color="#13ce66"
                    inactive-color="#ff4949" -->
                   <label for="">账号状态</label>
                     <el-switch
                    style="display: block"
                    v-model="edit.status"
                     active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="正常"
                    inactive-text="禁用">
                    </el-switch>
               </li>
                <li>
                   <label for="">角色</label>
                     <el-switch
                    style="display: block"
                    v-model="edit.role"
                   
                    active-text="管理员"
                    inactive-text="普通">
                    </el-switch>
               </li>
            </ul>
            <div>
                   
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancleEdit">取 消</el-button>
                <el-button type="primary" @click="sureEdit">确 定</el-button>
            </span>
            </el-dialog>
    </div>
    <!-- 批量导入 -->

<el-dialog
  title="批量导入用户"
  :visible.sync="uploaddialog"
  width="400"
  :before-close="uploadClose">
          <el-upload :before-upload="zipChange" action="">
           <el-button type="primary">选择上传文件上传<i class="el-icon-upload el-icon--right"></i></el-button>
          </el-upload>
          <div v-if="zip_file !== null">
              <div>
                <el-tag type="border">上传文件名：{{ zip_file.name }}</el-tag>
                <el-button type="primary" size='small' @click="zipUpload" :loading="loadingStatus">{{ loadingStatus ? '上传中' : '点击上传' }}</el-button>
              </div>
          </div>
  <ul>
    <li></li>
  </ul>
  <span slot="footer" class="dialog-footer">
    <el-button @click="uploadClose">取 消</el-button>
    <el-button type="primary" @click="uploadOk">确 定</el-button>
  </span>
</el-dialog>
    <!-- 添加 -->
      <div v-if="dialog.add">
           <el-dialog
            title="添加"
            :visible.sync="dialog.add"
            :before-close="cancleEdit"
            width="400px"
            center>
            <ul class="dialog-edit">
               <li>
                   <label for="">用户名</label>
                    <el-input  size="small" placeholder="请输入用户名" v-model="add.username">
                   
                </el-input>
               </li>
                <li>
                   <label for="">手机号</label>
                    <el-input size="small" placeholder="请输入手机号" v-model="add.phone">
                   
                </el-input>
               </li>
                <li>
                   <label for="">Email</label>
                  <el-input size="small" placeholder="请输入Email" v-model="add.email">      
                </el-input>
               </li>
                <li>
                   <label for="">角色</label>
                     <el-switch
                    style="display: block"
                    v-model="add.role"
                   
                    active-text="管理员"
                    inactive-text="普通">
                    </el-switch>
               </li>
            </ul>
            <div>
                   
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancleAdd">取 消</el-button>
                <el-button type="primary" @click="sureAdd">确 定</el-button>
            </span>
            </el-dialog>
    </div>
  </div>
</template>

<script>
  const ROLE = [{
    value: 'admin',
    label: '管理员'
  },
  {
    value: 'normal',
    label: '普通用户'
  }
  ]
  var qs = require('qs')
  import request from '@/utils/request'
  import Sortable from 'sortablejs'
  export default {
    name: 'user',
    data() {
      return {
        //
        loadingStatus: false,
        zipfile: null,
        zip_file: null,
        uploaddialog: false,
        // ==
        role_list: ROLE,
        search: {
          username: '',
          phone: '',
          email: '',
          status: '',
          role: '',
          total: '',
          page: 1,
          limit: 10
        },
        dialog: {
          edit: false,
          add: false
        },
        edit: {
          id: '',
          username: '',
          phone: '',
          email: '',
          status: false,
          role: false
        },
        add: {
          username: '',
          phone: '',
          email: '',
          role: false
        },
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10
        },
        sortable: null,
        oldList: [],
        newList: []
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'info',
          deleted: 'danger'
        }
        return statusMap[status]
      }
    },
    created() {
      this.getUserList()
    },
    methods: {
      // 文件上传前
      // 文件上传前
      zipChange(file) {
        if (file.type.indexOf('zip') > 0) {
          this.zip_file = file
          return false
        } else {
          this.$Message.error('绘本压缩包上传，只支持“zip”格式')
          this.zip_file = ''
          return false
        }
      },
      fileUpload(item) {
        return new Promise((resolve, reject) => {
          const formData = new window.FormData()
          formData.append('file', item.data)
          const config = {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
          request({
            url: '/api/v1/user/batch-import-user',
            method: 'post',
            data: formData,
            config
          }).then(res => {
            if (res.data.code == 0) {
              this.dialog.add = false
              this.$message({
                type: 'success',
                message: '更新成功!'
              })
            }
          })
        })
      },
      zipUpload() {
        if (this.zip_file) {
          this.loadingStatus = true
          const obj = {
            type: 'zip',
            data: this.zip_file
          }
          this.fileUpload(obj).then(res => {
            this.formValidate.zipfile = res.url
            setTimeout(() => {
              this.zip_file = null
              this.loadingStatus = false
              this.$Message.success('zip上传成功')
            }, 1500)
          }, error => {
          })
        } else {
          this.$Message.error('请选择正确的压缩包格式')
        }
      },
      uploadClose() {
        this.uploaddialog = false
      },
      uploadOk() {},
      uploadUser() {
        this.uploaddialog = true
      },
      handleSet(val) {},
      handlAddRole() {
        this.dialog.add = true
      },
      cancleAdd() {
        this.add = {
          username: '',
          phone: '',
          email: '',
          role: false
        }
        this.dialog.add = false
      },
      sureAdd() {
        const data = {
          username: this.add.username,
          phone: this.add.phone,
          email: this.add.email,
          role: this.add.role ? 'admin' : 'normal'
        }
        request({
          url: '/api/v1/user/add-user',
          method: 'post',
          data: qs.stringify(data)
        }).then(res => {
          if (res.data.code == 0) {
            this.dialog.add = false
            this.$message({
              type: 'success',
              message: '更新成功!'
            })
          }
        })
      },
      cancleEdit() {
        this.edit = {
          id: '',
          username: '',
          phone: '',
          email: '',
          status: false,
          role: false
        },
        this.dialog.edit = false
      },
      sureEdit() {
        // /api/v1/user/update-user
        const data = {
          id: this.edit.id,
          username: this.edit.username,
          phone: this.edit.phone,
          email: this.edit.email,
          status: this.edit.status ? 10 : 0,
          role: this.edit.role ? 'admin' : 'normal'
        }
        request({
          url: '/api/v1/user/update-user',
          method: 'post',
          data: qs.stringify(data)
        }).then(res => {
          this.listLoading = false
          this.list = res.data.data.data
          this.search.total = res.data.data.count
          // this.getList(this.name, 1, this.listQuery.limit)
          this.$message({
            type: 'success',
            message: '更新成功!'
          })
        })
      },
      handleEdit(val) {
        this.edit = {
          id: val.id,
          username: val.username,
          phone: val.phone,
          email: val.email,
          status: val.status == 10 ? 1 : 0,
          role: val.role == 'admin' ? 1 : 0
        }
        this.dialog.edit = true
      },
      searchRole() {
        this.getUserList(this.search.limit, 1)
      },
      handleCurrentChange(val) {
        this.getUserList(this.search.limit, val)
      },
      handleSizeChange(val) {
        this.getUserList(val, this.search.page)
      },
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
          this.listLoading = false
          this.list = res.data.data.data
          this.search.total = res.data.data.count
          // this.getList(this.name, 1, this.listQuery.limit)
          this.$message({
            type: 'success',
            message: '更新成功!'
          })
        })
      },
      setSort() {
        const el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
        this.sortable = Sortable.create(el, {
          ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
          setData: function(dataTransfer) {
            dataTransfer.setData('Text', '')
            // to avoid Firefox bug
            // Detail see : https://github.com/RubaXa/Sortable/issues/1012
          },
          onEnd: evt => {
            const targetRow = this.list.splice(evt.oldIndex, 1)[0]
            this.list.splice(evt.newIndex, 0, targetRow)
            // for show the changes, you can delete in you code
            const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
            this.newList.splice(evt.newIndex, 0, tempIndex)
          }
        })
      }
    }
  }
</script>

<style>
  .sortable-ghost {
    opacity: .8;
    color: #fff!important;
    background: #42b983!important;
  }
  li {
    list-style: none;
  }
</style>

<style lang="scss" scoped>
  .icon-star {
    margin-right: 2px;
  }
  .drag-handler {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
  .show-d {
    margin-top: 15px;
  }
  .dialog-edit,
  .dialog-pwd {
    li {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-top: 10px;
      label {
        width: 80px;
      }
    }
  }
  #user {
    .add-role {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-bottom: 20px;
      .inner {
        width: 50%;
        margin: 0 auto;
        button {
          width: 100%;
        }
      }
    }
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
</style>