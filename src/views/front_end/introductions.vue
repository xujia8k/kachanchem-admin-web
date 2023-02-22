<template>
  <div class="app-container">
    <div class="filter-container" style="overflow: hidden;">
      <el-button plain type="success" @click="handleCompanyIntroductionList">
        公司简介管理
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
     <!--  <el-table-column label="公司简介" align="center">
        <template slot-scope="scope">
          <div>
            <span class="ellipsis">{{scope.row.introductions}}</span>
          </div>
        </template>
      </el-table-column> -->
      <el-table-column label="公司名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地址" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.tel }}</span>
        </template>
      </el-table-column>
      <el-table-column label="传真" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.fax }}</span>
        </template>
      </el-table-column>
      <el-table-column label="email" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
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
    <el-dialog title="公司简介" :visible.sync="dialogFormVisible1" width="70%">
      <el-form ref="dataForm" :model="temp" label-position="right" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="公司简介" prop="value">
              <el-input v-model="value" type="textarea" :rows="2" placeholder="请输入内容"  :autosize="{ minRows: 4, maxRows: 50}"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateCompanyIntroduction()">
          确认
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="70%">
      <el-form ref="dataForm" :model="temp" label-position="right" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="公司名称" prop="name">
              <el-input v-model="temp.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公司地址" prop="address">
              <el-input v-model="temp.address" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话" prop="tel">
              <el-input v-model="temp.tel" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="传真" prop="fax">
              <el-input v-model="temp.fax" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="email" prop="email">
              <el-input v-model="temp.email" />
            </el-form-item>
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
import { fetchIntroductionsList, createIntroductions, updateIntroductions, destroyIntroductions, fetchCompanyIntroductionList, updateCompanyIntroduction } from '@/api/frontEnd'
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
        name: '',
        address: '',
        tel: '',
        fax: '',
        email: ''
      },
      value: {
        value: ''
      }, //公司简介
      info: '', //公司信息列表
      dialogFormVisible: false,
      dialogFormVisible1: false,
      dialogStatus: '',
      textMap: {
        update: '编辑公司信息',
        create: '创建公司信息'
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
      fetchIntroductionsList(this.listQuery).then(response => {
        //排序
        // response.data.page_datas.info=response.data.page_datas.info.sort()
        this.list = response.data.page_datas
        this.total = response.data.total_count
        this.listLoading = false
      })
    },
    resetTemp() {
      this.listQuery = {
        page: 1,
        limit: 20
      }
      this.temp = {
        name: '',
        address: '',
        tel: '',
        fax: '',
        email: ''
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
          createIntroductions(this.temp).then(() => {
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
          updateIntroductions(tempData).then(() => {
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
      this.$confirm('此操作将永久删除公司信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        destroyIntroductions(row).then(response => {
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
    },
    handleCompanyIntroductionList() {
      fetchCompanyIntroductionList().then(response => {
        this.value = response.data.value
        this.dialogFormVisible1 = true
      })
    },
    updateCompanyIntroduction() {
      let tem = {
        value: this.value
      }
      updateCompanyIntroduction(tem).then(() => {
        this.dialogFormVisible1 = false
      })
    },

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
