<template>
  <div class="app-container calendar-list-container">

         <div class="plant-search">
                            <el-input
                            @change='selectPlantName'
                                size="mini"
                                :placeholder="$t('workshop.workshop')"
                                v-model="name">
                            </el-input>
                        <el-button @click="plantAdd"  size="mini" type="primary" icon="el-icon-plus">{{$t('workshop.add')}}</el-button>
         </div>
    
      
  
    <!-- Note that row-key is necessary to get a correct row order. -->
    <el-table :data="list" row-key="id"  v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="ID" >
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" :label="$t('workshop.name')">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
    <!-- plant_name -->
    <el-table-column  align="center" :label="$t('workshop.belong')">
        <template slot-scope="scope">
          <span>{{scope.row.plant_name}}</span>
        </template>
      </el-table-column>


      <el-table-column   align="center" :label="$t('workshop.loopnum')">
        <template slot-scope="scope">
         <div> 
             <span style="font-weight: bold;display: inline-block;width: 30px;">{{scope.row.loop_count}}</span>
             &nbsp; &nbsp; &nbsp;
            <el-button @click="workShop(scope.row)" type="primary"  size="mini" icon="el-icon-view"></el-button>
          </div>
        </template>
      </el-table-column>
         <el-table-column
      fixed="right"
      :label="$t('plant.operation')"
      align="center"
      width="200">
      <template slot-scope="scope">
        <el-button @click="handleEdit(scope.row)" type="primary"  size="mini"   icon="el-icon-edit"> </el-button>
        <el-button @click="plantDelete(scope.row)" type="primary"  size="mini"  icon="el-icon-delete"></el-button>
      </template>
    </el-table-column>
    </el-table>
    <!-- $t is vue-i18n global function to translate lang (lang in @/lang)  -->
    <!-- <div class='show-d'>{{$t('table.dragTips1')}} : &nbsp; {{ oldList}}</div>
    <div class='show-d'>{{$t('table.dragTips2')}} : {{newList}}</div> -->
    <div class="plant-pagination">
          <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage4"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="Number(total)">
    </el-pagination>
    </div>

    <el-dialog
  :title="dialogstatus=='add'?this.$t('workshop.add'):this.$t('workshop.edit')"
  :visible.sync="dialogVisible"
  width="30%"
  :before-close="dialogCancel">
 <el-input v-model="edit_name" :placeholder="$t('workshop.workshop')"></el-input>
 <div style="margin-bottom:20px;"></div>
  <el-select v-if="dialogstatus=='edit'" v-model="select_work" filterable :placeholder="$t('workshop.plant')">
    <el-option
      v-for="item in select_work_list"
      :key="item.id"
      :label="item.name"
      :value="item.id">
    </el-option>
  </el-select>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogCancel">{{$t('plant.cancel')}}</el-button>
    <el-button type="primary" @click="dialogOk">{{$t('plant.sure')}}</el-button>
  </span>
</el-dialog>

  </div>
</template>

<script>
var qs = require('qs')
import request from '@/utils/request'
// import { fetchList } from '@/api/article'
import Sortable from 'sortablejs'
export default {
  name: 'dragTable',
  data() {
    return {
      select_work: '',
      select_work_list: [],
      dialogstatus: 'add',
      dialogVisible: false,
      name: '',
      edit_name: '',
      edit_id: '',
      currentPage4: 1,
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
    this.getAllPlant()
    this.getList(this.name, this.listQuery.page, this.listQuery.limit)
    // this.getList('', this.listQuery.page, this.listQuery.limit).then(res => {
    //   this.listLoading = false
    //   this.list = res.data.data.data
    //   this.total = res.data.data.total
    //   this.oldList = this.list.map(v => v.id)
    //   this.newList = this.oldList.slice()
    //   this.$nextTick(() => {
    //     this.setSort()
    //   })
    //   console.log(this.list)
    // })
  },
  methods: {
    workShop(val) {
      window.localStorage.setItem('loop', JSON.stringify(val))
      this.$router.push('/manage/loop')
    },
    plantAdd() {
      this.edit_name = ''
      this.edit_id = ''
      this.dialogVisible = true
      this.dialogstatus = 'add'
    },
    dialogCancel() {
      this.dialogVisible = false
    },
    dialogOk(val) {
        if (this.edit_name.length < 1) {
            this.$message({
                type: 'error',
                message: this.$t('plant.notnull')
            })
        } else {
      let url = ''
      let data = ''
      if (this.dialogstatus === 'add') {
        url = '/api/v1/workshop/add-workshop'
        data = qs.stringify({
          plant_id: JSON.parse(window.localStorage.getItem('workshop')).id,
          name: this.edit_name
        })
      } else {
        url = '/api/v1/workshop/update-workshop'
        data = qs.stringify({
          id: this.edit_id,
          plant_id: this.select_work,
          name: this.edit_name
        })
      }
      request({
        url: url,
        method: 'post',
        data: data
      }).then(res => {
        this.getList(this.name, 1, this.listQuery.limit)
        this.$message({
          type: 'success',
          message: this.$t('plant.success')
        })
        this.dialogVisible = false
      })
        }
    },
    handleEdit(val) {
      this.edit_id = val.id
      this.edit_name = val.name
      this.dialogVisible = true
      this.dialogstatus = 'edit'
    },
    // /api/v1/plant/get-all-plant
    getAllPlant() {
      request({
        url: '/api/v1/plant/get-all-plant',
        method: 'post'
      }).then(res => {
        this.select_work_list = res.data.data
      })
    },
    plantDelete(val) {
      this.$confirm(this.$t('plant.content'), this.$t('plant.tip'), {
        confirmButtonText: this.$t('plant.sure'),
        cancelButtonText: this.$t('plant.cancel'),
        type: 'warning'
      }).then(() => {
        request({
          url: '/api/v1/workshop/delete-workshop',
          method: 'post',
          data: qs.stringify({
            id: val.id
          })
        }).then(res => {
          this.getList(this.name, 1, this.listQuery.limit)
          this.$message({
            type: 'success',
            message: this.$t('plant.delete')
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('plant.deletecancel')
        })
      })
    },
    selectPlantName(val) {
      this.getList(this.name, 1, this.listQuery.limit)
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList(this.name, 1, this.listQuery.limit)
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList(this.name, val, this.listQuery.limit)
    },
    fetchList() {

    },
    getList(name, page, limit) {
    //   if (!JSON.parse(this.$route.params)) {
    //     this.$router.push('/manage/plant')
    //   }
      const data = window.localStorage.getItem('workshop')
      this.select_work = JSON.parse(data).id
      this.listLoading = true
      request({
        url: '/api/v1/workshop/workshop-list',
        method: 'post',
        data: qs.stringify({
          plant_id: JSON.parse(data).id,
          name: this.name,
          page: page,
          limit: limit
        })
      }).then(res => {
        this.listLoading = false
        this.list = res.data.data.data
        this.total = res.data.data.count
        this.oldList = this.list.map(v => v.id)
        this.newList = this.oldList.slice()
        this.$nextTick(() => {
          this.setSort()
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
.plant-search{
    margin-bottom: 20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
.plant-pagination{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
}
  .plant-search  .el-input{
        max-width: 200px;
        margin-right: 20px;
    }
    .plant-search .el-button{
        min-width: 100px;
        max-width: 200px;
    }
.sortable-ghost{
  opacity: .8;
  color: #fff!important;
  background: #42b983!important;
}
</style>

<style scoped>
.icon-star{
  margin-right:2px;
}
.drag-handler{
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.show-d{
  margin-top: 15px;
}
</style>