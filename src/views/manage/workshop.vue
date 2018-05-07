<template>
  <div class="app-container calendar-list-container">

         <div class="plant-search">
                            <el-input
                            @change='selectPlantName'
                                size="mini"
                                placeholder="请输入车间名"
                                v-model="name">
                            </el-input>
                        <el-button @click="plantAdd"  size="mini" type="primary" icon="el-icon-plus">增加车间</el-button>
         </div>
    
      
  
    <!-- Note that row-key is necessary to get a correct row order. -->
    <el-table :data="list" row-key="id"  v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="ID" >
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="车间名">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
    <!-- plant_name -->
    <el-table-column  align="center" label="所属厂区">
        <template slot-scope="scope">
          <span>{{scope.row.plant_name}}</span>
        </template>
      </el-table-column>


      <el-table-column   align="center" label="回路数量">
        <template slot-scope="scope">
         <div> 
             <span>{{scope.row.loop_count}}</span>
             &nbsp; &nbsp; &nbsp;
            <el-button @click="workShop" type="primary"  size="mini" icon="el-icon-view"></el-button>
          </div>
        </template>
      </el-table-column>

      <!-- <el-table-column width="110px" align="center" label="Author">
        <template slot-scope="scope">
          <span>{{scope.row.author}}</span>
        </template>
      </el-table-column> -->

      <!-- <el-table-column width="100px" label="Importance">
        <template slot-scope="scope">
          <svg-icon v-for="n in +scope.row.importance" icon-class="star" class="icon-star" :key="n"></svg-icon>
        </template>
      </el-table-column> -->

      <!-- <el-table-column align="center" label="Readings" width="95">
        <template slot-scope="scope">
          <span>{{scope.row.pageviews}}</span>
        </template>
      </el-table-column> -->

      <!-- <el-table-column class-name="status-col" label="Status" width="110">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{scope.row.status}}</el-tag>
        </template>
      </el-table-column> -->

      <!-- <el-table-column align="center" label="Drag" >
        <template slot-scope="scope">
          <svg-icon class='drag-handler' icon-class="drag"></svg-icon>
        </template>
      </el-table-column> -->
         <el-table-column
      fixed="right"
      label="操作"
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
  :title="dialogstatus=='add'?'增加车间':'编辑车间'"
  :visible.sync="dialogVisible"
  width="30%"
  :before-close="dialogCancel">
 <el-input v-model="edit_name" placeholder="请输入车间名"></el-input>
  <el-select v-model="select_work" filterable placeholder="请选择">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogCancel">取 消</el-button>
    <el-button type="primary" @click="dialogOk">确 定</el-button>
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
      select_work_list: '',
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
    workShop() {
      this.$router.push('/manage/workshop')
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
      let url = ''
      let data = ''
      if (this.dialogstatus === 'add') {
        url = '/api/v1/plant/add-workshop'
        data = qs.stringify({

          name: this.edit_name
        })
      } else {
        url = '/api/v1/plant/update-workshop'
        data = qs.stringify({
          id: this.edit_id,
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
          message: '更新成功!'
        })
        this.dialogVisible = false
      })
    },
    handleEdit(val) {
      this.edit_id = val.id
      this.edit_name = val.name
      this.dialogVisible = true
      this.dialogstatus = 'edit'
    },
    plantDelete(val) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/api/v1/workshop/delete-workshop',
          method: 'post',
          data: qs.stringify({
            id: val.id
          })
        }).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
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
      this.listLoading = true
      request({
        url: '/api/v1/workshop/workshop-list',
        method: 'post',
        data: qs.stringify({
          plant_id: JSON.parse(data).id,
          name: JSON.parse(data).name,
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