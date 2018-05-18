<template>
  <div id="user" class="app-container calendar-list-container">
    <section style="display: flex;justify-content: space-between;align-items: center;">
      <ul class="search-bar">
      <li>
        <el-input clearable @keyup.enter.native="searchRole"  v-model="search.username" :placeholder="$t('loopdata.loop')"></el-input>
      </li>
       <li>
            <el-select  @change="selectWorkChange"  clearable v-model="search.workshop_id" filterable :placeholder="$t('loopdata.plant')">
            <el-option
            v-for="item in select_workshop_list"
            :key="item.id"
            :label="item.name"
            :value="item.id">
            </el-option>
        </el-select>
      </li>
       <li>
            <el-select    v-model="select_loop" clearable filterable :placeholder="$t('loopdata.workshop')">
            <el-option
            v-for="item in select_loop_list"
            :key="item.id"
            :label="item.name"
            :value="item.id">
            </el-option>
        </el-select>
      </li>
      <li>
        <el-button @click="searchRole" type="primary">{{$t('loopdata.search')}}</el-button>
      </li>
    </ul>
    <div>
       <el-button @click="getData" type="primary">{{$t('loopdata.export')}}</el-button>
    </div>
    </section>
    <!-- Note that row-key is necessary to get a correct row order. -->
    <el-table :data="list" row-key="id" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="50">
        <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <!-- username -->
      <el-table-column align="center" :label="$t('loopdata.loopname')" >
        <template slot-scope="scope">
            <span>{{scope.row.loop_name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('loopdata.workshopname')" >
        <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>

       <el-table-column
      fixed="right"
      :label="$t('loopdata.operation')"
      align="center"
      width="100">
      <template slot-scope="scope">
         <!-- <el-button @click="handleSet(scope.row)" type="primary"  size="mini"   icon="el-icon-setting"> </el-button> -->
        <el-button @click="handleEdit(scope.row)" type="primary"  size="mini"   icon="el-icon-view"> </el-button>
      </template>
    </el-table-column>
    </el-table>
<!-- // 分页   v-if="search.total>search.limit"-->
    <div class="pagination">


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


  </div>
</template>

<script>
const ROLE = [
  {
    value: 'admin',
    label: '管理员'
  },
  {
    value: 'normal',
    label: '普通用户'
  }
]
var qs = require('qs')
import Sticky from '@/components/Sticky'
import request from '@/utils/request'
import Sortable from 'sortablejs'
export default {
  name: 'user',
  components: {
    Sticky
  },
  data() {
    return {
      select_loop_list: [],
      select_loop: '',
      select_workshop_list: [],
      role_list: ROLE,
      search: {
        name: '',
        workshop_id: '',
        total: '',
        page: 1,
        limit: 10
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
    this.getAllPlant()
  },
  methods: {
    handleEdit(val) {
      window.localStorage.setItem('report', JSON.stringify(val))
      this.$router.push('/loopData/report')
    },
    selectWorkChange(val) {
      this.select_loop = ''
      this.select_loop_list = []
      this.getAllLoop()
    },
    getData() {
      request({
        url: '/api/v1/loops/export',
        method: 'post'
      }).then(res => {
        // 返回值
      })
    },
    getAllLoop() {
      request({
        url: '/api/v1/workshop/get-workshop-by-plant',
        method: 'post',
        data: qs.stringify({
          plant_id: this.search.workshop_id
        })
      }).then(res => {
        this.select_loop = this.local_workshop_id
        this.select_loop_list = res.data.data
      })
    },
    getAllPlant() {
      request({
        url: '/api/v1/plant/get-all-plant',
        method: 'post'
      }).then(res => {
        this.select_loop = ''
        this.select_loop_list = []
        this.select_workshop_list = res.data.data
      })
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
        name: this.search.name,
        plant_id: this.search.workshop_id,
        workshop_id: this.select_loop,
        limit: limit,
        page: page
      }
      request({
        url: '/api/v1/loops/user-loops',
        method: 'post',
        data: qs.stringify(data)
      }).then(res => {
        this.listLoading = false
        this.list = res.data.data.data
        this.search.total = res.data.data.count
        this.$message({
          type: 'success',
          message: this.$t('plant.success')
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
  li{
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
    .add-role{
            margin-bottom: 20px;
            .inner{
                width: 50%;
                margin: 0 auto;
                button{
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