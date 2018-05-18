<template>
  <div id="user" class="app-container calendar-list-container">
    <div class="add-role">
      <el-button @click="handlAddRole" type="primary">{{$t('user.add')}}</el-button>
      <el-button @click="uploadUser" type="primary">{{$t('user.import')}}</el-button>
    </div>
    <ul class="search-bar">
      <li>
        <el-input clearable @keyup.enter.native="searchRole" v-model="search.username" :placeholder="$t('user.username')"></el-input>
      </li>
      <li>
        <el-input clearable @keyup.enter.native="searchRole" v-model="search.phone" :placeholder="$t('user.phone')"></el-input>
      </li>
      <li>
        <el-input clearable @keyup.enter.native="searchRole" v-model="search.email" :placeholder="$t('user.email')"></el-input>
      </li>
      <li>
        <el-select clearable v-model="search.role" filterable :placeholder="$t('user.role')">
          <!--<el-option v-for="(item,index) in role_list" :key="index" :label="item.label" :value="item.value">-->
          <!--</el-option>-->
            <el-option value="admin" :label="$t('user.admin')">{{$t('user.admin')}}</el-option>
            <el-option value="normal" :label="$t('user.normal')">{{$t('user.normal')}}</el-option>
        </el-select>
      </li>
      <li>
        <el-button @click="searchRole" type="primary">{{$t('user.search')}}</el-button>
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
      <el-table-column align="center" :label="$t('user.username1')" >
<template slot-scope="scope">
  <span>{{scope.row.username}}</span>
</template>
      </el-table-column>
      <el-table-column align="center" :label="$t('user.email')" >
<template slot-scope="scope">
  <span>{{scope.row.email}}</span>
</template>
      </el-table-column>
      <el-table-column align="center" :label="$t('user.phone')"  width="120">
<template slot-scope="scope">
  <span>{{scope.row.phone}}</span>
</template>
      </el-table-column>
       <el-table-column align="center" :label="$t('user.status')"  width="80">
<template slot-scope="scope">
  <!-- <span>{{scope.row.status}}</span> -->
  <el-tag v-if="scope.row.status==10" type="success">{{$t('user.normal')}}</el-tag>
  <el-tag v-else type="danger">{{$t('user.forbidden')}}</el-tag>
</template>
      </el-table-column>
      <!-- ？roles -->
       <el-table-column align="center" :label="$t('user.role1')" width="80">
<template slot-scope="scope">
  <span>{{scope.row.roles}}</span>
</template>
      </el-table-column>
      <!-- create_time -->
      <!-- belong -->
       <el-table-column align="center" :label="$t('user.belong')" >
<template slot-scope="scope">
  <span>{{scope.row.belong}}</span>
</template>
      </el-table-column>
       <el-table-column align="center" :label="$t('user.create')" >
<template slot-scope="scope">
  <span>{{scope.row.create_time}}</span>
</template>
      </el-table-column>
      <el-table-column
      fixed="right"
      :label="$t('loop.operation')"
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
            :title="$t('user.edit')"
            :visible.sync="dialog.edit"
            :before-close="cancleEdit"
            width="400px"
            center>
            <ul class="dialog-edit">
               <li>
                   <label for="">{{$t('user.username1')}}</label>
                    <el-input disabled size="small" :placeholder="$t('user.username')" v-model="edit.username">
                   
                </el-input>
               </li>
                <li>
                   <label for="">{{$t('user.phone')}}</label>
                    <el-input size="small" :placeholder="$t('user.phone1')" v-model="edit.phone">
                   
                </el-input>
               </li>
                <li>
                   <label for="">{{$t('user.email1')}}</label>
                  <el-input size="small" :placeholder="$t('user.email')" v-model="edit.email">
                </el-input>
               </li>
               <li>
                 <!--     active-color="#13ce66"
                    inactive-color="#ff4949" -->
                   <label for="">{{$t('user.status')}}</label>
                     <el-switch
                    style="display: block"
                    v-model="edit.status"
                     active-color="#13ce66"
                    inactive-color="#ff4949"
                    :active-text="$t('user.status1')"
                    :inactive-text="$t('user.status0')">
                    </el-switch>
               </li>
                <li>
                   <label for="">{{$t('user.role1')}}</label>
                     <el-switch
                    style="display: block"
                    v-model="edit.role"
                   
                    :active-text="$t('user.admin')"
                    :inactive-text="$t('user.normal')">
                    </el-switch>
               </li>
            </ul>
            <div>
                   
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancleEdit">{{$t('plant.cancel')}}</el-button>
                <el-button type="primary" @click="sureEdit">{{$t('plant.sure')}}</el-button>
            </span>
            </el-dialog>
    </div>
    <!-- 批量导入 -->

<el-dialog
  :title="$t('user.title')"
  :visible.sync="uploaddialog"
  width="400"
  :before-close="uploadClose">
          <el-upload :before-upload="zipChange" action="">
           <el-button type="primary">{{$t('user.upload')}}<i class="el-icon-upload el-icon--right"></i></el-button><a href="/static/template/批量导入用户.xlsx" download="批量导入用户.xlsx">{{$t('user.download')}}</a>
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
    <el-button @click="uploadClose">{{$t('plant.cancel')}}</el-button>
    <el-button type="primary" @click="uploadOk">{{$t('plant.sure')}}</el-button>
  </span>
</el-dialog>
    <!-- 添加 -->
      <div v-if="dialog.add">
           <el-dialog
            :title="$t('user.add')"
            :visible.sync="dialog.add"
            :before-close="cancleEdit"
            width="400px"
            center>
            <ul class="dialog-edit">
               <li>
                   <label for="">{{$t('user.username1')}}</label>
                    <el-input  size="small" :placeholder="$t('user.username')" v-model="add.username">
                   
                </el-input>
               </li>
                <li>
                   <label for="">{{$t('user.phone1')}}</label>
                    <el-input size="small" :placeholder="$t('user.phone')" v-model="add.phone">
                   
                </el-input>
               </li>
                <li>
                   <label for="">{{$t('user.email1')}}</label>
                  <el-input size="small" :placeholder="$t('user.email')" v-model="add.email">
                </el-input>
               </li>
                <li>
                   <label for="">{{$t('user.role')}}</label>
                     <el-switch
                    style="display: block"
                    v-model="add.role"
                   
                    :active-text="$t('user.admin')"
                    :inactive-text="$t('user.normal')">
                    </el-switch>
               </li>
            </ul>
            <div>
                   
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancleAdd">{{$t('plant.cancel')}}</el-button>
                <el-button type="primary" @click="sureAdd">{{$t('plant.sure')}}</el-button>
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