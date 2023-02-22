<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model.trim="listQuery.first_name" placeholder="first_name" style="width: 150px;" class="filter-item" @keyup.enter.native="getList" />
      <el-input v-model.trim="listQuery.last_name" placeholder="last_name" style="width: 150px;" class="filter-item" @keyup.enter.native="getList" />
      <el-input v-model.trim="listQuery.company_name" placeholder="公司名称" style="width: 150px;" class="filter-item" @keyup.enter.native="getList" />
      <el-input v-model.trim="listQuery.phone" placeholder="手机号" style="width: 150px;" class="filter-item" @keyup.enter.native="getList" />
      <el-input v-model.trim="listQuery.email" placeholder="email" style="width: 150px;" class="filter-item" @keyup.enter.native="getList" />
      <el-button class="filter-item ml40" type="primary" icon="el-icon-search" @click="getList">
        搜索
      </el-button>
      <div class="fr">
        <el-button class="filter-item" plain type="success" icon="el-icon-refresh" @click="refresh">
          刷新
        </el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="warning" icon="el-icon-edit-outline" @click="handleCreate">
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
      <el-table-column label="first_name" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.first_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="last_name" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.last_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="公司名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.company_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="email" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:40px;">
        <el-form-item label="first_name" prop="first_name">
          <el-input v-model="temp.first_name" placeholder="请输入first_name！" />
        </el-form-item>
        <el-form-item label="last_name" prop="last_name">
          <el-input v-model="temp.last_name" placeholder="请输入last_name！" />
        </el-form-item>
        <el-form-item label="公司名称" prop="company_name">
          <el-input v-model="temp.company_name" placeholder="请输入公司名称！" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="temp.phone" placeholder="请输入手机号！" />
        </el-form-item>
        <el-form-item label="email" prop="email">
          <el-input v-model="temp.email" placeholder="请输入email！" />
        </el-form-item>
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
import { getCustomers, postCustomers, putCustomers, destroyCustomers } from '@/api/crm'
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
        first_name: null,
        last_name: null,
        phone: null,
        company_name: null,
        email: null,
        page: 1,
        limit: 20
      },
      temp: {
        first_name: null,
        last_name: null,
        phone: null,
        company_name: null,
        email: null,
        message: null
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑客户信息',
        create: '创建客户信息'
      },
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
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
      getCustomers(this.listQuery).then(response => {
        this.list = response.data.page_datas
        this.total = response.data.total_count
        this.listLoading = false
      })
    },
    resetTemp() {
      this.listQuery = {
        first_name: null,
        last_name: null,
        phone: null,
        company_name: null,
        email: null,
        page: 1,
        limit: 20
      }
      this.temp = {
        first_name: null,
        last_name: null,
        phone: null,
        company_name: null,
        email: null,
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
          postCustomers(this.temp).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: 'Success',
              message: '创建成功！',
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
    updateData(id) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          putCustomers(this.temp, this.temp.id).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.$notify({
              title: 'Success',
              message: '修改成功！',
              type: 'success',
              duration: 2000
            })
            this.dialogFormVisible = false
          })
        }
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除客户信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        destroyCustomers(row).then(response => {
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
    }
  }
};

</script>
