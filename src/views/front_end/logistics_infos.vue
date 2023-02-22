<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model.trim="listQuery.num" placeholder="快递单号" style="width: 200px;" class="filter-item" @keyup.enter.native="getList" />
      <el-input v-model.trim="listQuery.order_no" placeholder="订单号" style="width: 200px;" class="filter-item" @keyup.enter.native="getList" />
      <el-button class="filter-item ml10" type="primary" icon="el-icon-search" @click="getList">
        搜索
      </el-button>
      <div class="fr">
        <el-button plain type="success" icon="el-icon-refresh" @click="refresh">
          刷新
        </el-button>
        <el-button plain type="warning" icon="el-icon-circle-plus-outline" @click="handleCreate">
          新增
        </el-button>
      </div>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" :data="list" border highlight-current-row style="width: 100%;">
      <el-table-column label="ID" prop="id" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="物流公司" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.company_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="快递单号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.num }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.order_no }}</span>
        </template>
      </el-table-column>
      <el-table-column label="物流信息" align="center" height="50">
        <!-- <template slot-scope="scope">
          <span>{{ scope.row.info }}</span> -->
        <template slot-scope="scope">
          <div>
            <span class="ellipsis">{{scope.row.info}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="small" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="70%" :close-on-click-modal="false">
      <el-form ref="dataForm" :model="temp" label-position="right" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="物流公司" prop="company_name">
              <el-input v-model="temp.company_name" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="快递单号" prop="num">
              <el-input v-model="temp.num" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="订单号" prop="order_no">
              <el-input v-model="temp.order_no" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-for="(item, index) in temp.info" :label="'物流信息' + index+1" :key="item.sort" >
          <el-col  :span="8">
            <el-form-item label="时间"  :span="8">
              <el-input v-model="item.time"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="物流信息" prop="order_no">
              <el-input v-model="item.info" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
              <el-button type="warning" icon="el-icon-delete" @click.prevent="removeItem(item)" v-if="index>0">删除</el-button>
              <el-button plain type="success" icon="el-icon-circle-plus-outline" @click="addItem" v-if="index == (temp.info.length-1)">新增</el-button>
          </el-col>

        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { fetchLogisticsInfos, createLogisticsInfos, updateLogisticsInfos, destroyLogisticsInfos } from '@/api/frontEnd'
import { parseTime, showFilter } from '@/utils'
import Pagination from '@/components/Pagination'


export default {
  name: 'ComplexTable',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        num: '',
        order_no: '',
        page: 1,
        limit: 20
      },
      temp: {
        num: '',
        order_no: '',
        info: [{
          info: "",
          sort: 1,
          time: "",
        }],
      },
      info:'',//物流信息列表
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑物流信息',
        create: '创建物流信息'
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchLogisticsInfos(this.listQuery).then(response => {
        //排序
        // response.data.page_datas.info=response.data.page_datas.info.sort()
        this.list = response.data.page_datas
        this.total = response.data.total_count
        this.listLoading = false
      })
    },
    resetTemp() {
      this.listQuery = {
        num: '',
        order_no: '',
        page: 1,
        limit: 20
      }
      this.temp = {
        num: '',
        order_no: '',
        info: [{
          info: "",
          sort: 1,
          time: "",
        }],
      }
    },
    refresh() {
      this.resetTemp()
      this.listQuery.page = 1
      this.getList()
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createLogisticsInfos(this.temp).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateLogisticsInfos(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
          })
        }
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除物流信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        destroyLogisticsInfos(row).then(response => {
          if (response.code == 0) {
            this.$message({
              type: 'success',
              message: '操作成功!'
            });
            this.getList();
          } else {
            this.$message({
              type: 'info',
              message: '取消错误！'
            });
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消操作'
        });
      });
    },
     removeItem(item) {
        var index = this.temp.info.indexOf(item)
        if (index !== -1) {
          this.temp.info.splice(index, 1)
        }
      },
      addItem() {
        this.temp.info.push({
          time: '',
          info: ''
        });
      }
  }
};

</script>
<style lang="scss">
.ellipsis {
  display: -webkit-box;
  text-overflow: ellipsis;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

</style>
