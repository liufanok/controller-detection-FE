<template>
    <div id="loop" class="app-container calendar-list-container">
        <div class="plant-search">
            <el-input @change='selectPlantName' size="mini" placeholder="请输入回路名" v-model="name">
            </el-input>
            <el-button @click="plantAdd" size="mini" type="primary" icon="el-icon-plus">增加回路</el-button>
        </div>
        <!-- Note that row-key is necessary to get a correct row order. -->
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
  :title="dialogstatus=='add'?'增加回路':'编辑回路'"
  :visible.sync="dialogVisible"
  width="500px"
  :before-close="dialogCancel">
  <section style="display: flex;
    align-items: center;">
      <span style=" width: 70px;display: block;">回路名：</span>
       <el-input v-model="edit_name" placeholder="请输入回路名"></el-input>
  </section>
  <section style="display: flex;justify-content: flex-start; align-items: center;margin-top:20px;">
     <div v-if="dialogstatus=='edit'&&select_work"  style="display: flex;align-items: center;margin-right: 20px;">

        <div>所属厂区：</div>
      
          <el-select @change="selectWorkChange" v-if="dialogstatus=='edit'" v-model="select_work" filterable placeholder="请选择厂区">
    <el-option
      v-for="item in select_work_list"
      :key="item.id"
      :label="item.name"
      :value="item.id">
    </el-option>
  </el-select>
  </div>
  <el-select v-if="dialogstatus=='edit'"   v-model="select_loop" filterable placeholder="请选择车间">
            <el-option
            v-for="item in select_loop_list"
            :key="item.id"
            :label="item.name"
            :value="item.id">
            </el-option>
        </el-select>
   
  
    </section>
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
          select_loop: '',
          select_loop_list: '',
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
          newList: [],
          local_workshop_id: ''
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
        // workShop() {
        //   this.$router.push('/manage/workshop')
        // },
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
            url = '/api/v1/loops/add-loop'
            data = qs.stringify({
              workshop_id: JSON.parse(window.localStorage.getItem('loop')).id,
              name: this.edit_name
            })
          } else {
            url = '/api/v1/loops/update-loop'
            data = qs.stringify({
              id: this.edit_id,
              workshop_id: this.select_loop,
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
        selectWorkChange(val) {
          this.getAllLoop()
        },
        handleEdit(val) {
          this.edit_id = val.id
          this.local_workshop_id = val.workshop_id
          this.edit_name = val.loop_name
          this.dialogVisible = true
          this.dialogstatus = 'edit'
          this.getAllLoop()
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
        getAllLoop() {
          request({
            url: '/api/v1/workshop/get-workshop-by-plant',
            method: 'post',
            data: qs.stringify({
              plant_id: this.select_work
            })
          }).then(res => {
            this.select_loop = this.local_workshop_id
            this.select_loop_list = res.data.data
          })
        },
        plantDelete(val) {
          this.$confirm('此操作将永久删除, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            request({
              url: '/api/v1/loops/delete-loop',
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
        fetchList() {},
        getList(name, page, limit) {
          //   if (!JSON.parse(this.$route.params)) {
          //     this.$router.push('/manage/plant')
          //   }
          const data = window.localStorage.getItem('loop')
          this.select_work = JSON.parse(data).plant_id
          this.listLoading = true
          request({
            url: '/api/v1/loops/loop-list',
            method: 'post',
            data: qs.stringify({
              workshop_id: JSON.parse(data).id,
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
    .plant-search {
        margin-bottom: 20px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }
    .plant-pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 20px;
    }
    .plant-search .el-input {
        width: 200px;
        margin-right: 20px;
    }
    .plant-search .el-button {
        min-width: 100px;
        max-width: 200px;
    }
    .sortable-ghost {
        opacity: .8;
        color: #fff!important;
        background: #42b983!important;
    }
    #loop .el-dialog__body .el-select .el-input{
        width: 150px;
    }
    #loop .el-dialog__body .el-input {
        width: 250px;
    }
</style>

<style scoped>
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
</style>