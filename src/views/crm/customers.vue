<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model.trim="listQuery.first_name" placeholder="first_name" style="width: 150px;" class="filter-item" @keyup.enter.native="getList" />
      <!-- <el-input v-model.trim="listQuery.last_name" placeholder="last_name" style="width: 150px;" class="filter-item" @keyup.enter.native="getList" /> -->
      <el-input v-model.trim="listQuery.company_name" placeholder="公司名称" style="width: 150px;" class="filter-item" @keyup.enter.native="getList" />
      <el-input v-model.trim="listQuery.phone" placeholder="手机号" style="width: 150px;" class="filter-item" @keyup.enter.native="getList" />
      <el-input v-model.trim="listQuery.email" placeholder="email" style="width: 150px;" class="filter-item" @keyup.enter.native="getList" />
      <el-input v-model.trim="listQuery.country" placeholder="国籍" style="width: 150px;" class="filter-item" @keyup.enter.native="getList" />
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
      <el-table-column label="国籍" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.country }}</span>
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
      <el-table-column label="负责人" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.employee_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-row>
          <el-button type="primary" size="small" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="success" size="small" @click="handleUpdate2(row)">
            详情
          </el-button>
        </el-row>
        <el-row class="mt10">
          <el-button type="success" size="small" @click="handleUpdate3(row)">
            分配
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
        </el-row>
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
        <el-form-item label="国籍" prop="country">
          <el-input v-model="temp.country" placeholder="请输入国籍！" />
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
    <!-- 查看公司其他信息 -->
    <el-dialog title="公司详情信息" :visible.sync="dialogFormVisible2" :close-on-click-modal="false" width="90%" :before-close="handleClose">
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key">
          <div v-if="dialogFormVisible2">
            <Bill v-if="'bill'==item.key" :id="companyId" key="bill" />
            <Address v-if="'address'==item.key" :id="companyId" key="address" />
          </div>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">
          关闭
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="分配客户" :visible.sync="dialogFormVisible3" :close-on-click-modal="false" width="30%" :before-close="handleClose">
      <el-select ref="select" v-model="employeeId" placeholder="请选择员工">
        <el-option v-for="item in employeeList" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible3 = false">
          关闭
        </el-button>
        <el-button type="primary" @click="updateDistributeEmployee()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getCustomers, postCustomers, putCustomers, destroyCustomers, updateDistributeEmployee } from '@/api/crm'
import Pagination from '@/components/Pagination'
import Address from '@/components/Address'
import Bill from '@/components/Bill'
import { fetchList } from '@/api/hr'

export default {
  name: 'ComplexTable',
  components: { Pagination, Address, Bill },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      employeeId: null,
      employeeList: {},
      listQuery: {
        first_name: null,
        last_name: null,
        phone: null,
        company_name: null,
        email: null,
        country: null,
        page: 1,
        limit: 20
      },
      temp: {
        first_name: null,
        last_name: null,
        phone: null,
        company_name: null,
        email: null,
        country: null,
        message: null
      },
      dialogFormVisible: false,
      dialogFormVisible2: false,
      dialogFormVisible3: false,
      dialogStatus: '',
      textMap: {
        update: '编辑客户信息',
        create: '创建客户信息'
      },
      activeName: 'address', // 弹窗tab显示菜单
      tabMapOptions: [
        { label: '收货地址', key: 'address' },
        { label: '发票信息', key: 'bill' }
      ],
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
        country: null,
        page: 1,
        limit: 20
      }
      this.temp = {
        first_name: null,
        last_name: null,
        phone: null,
        company_name: null,
        email: null,
        country: null
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
    handleUpdate3(row) {
      this.temp = Object.assign({}, row)
      this.$nextTick(() => {
        let tem = {
          limit: 1000
        }
        fetchList(tem).then(response => {
          this.dialogFormVisible3 = true
          this.employeeList = response.data.page_datas
          this.listLoading = false
        })
      })
    },
    updateDistributeEmployee() {
      let tem = {
        employee_id: this.employeeId
      }
      updateDistributeEmployee(this.temp.id, tem).then(() => {
        this.$notify({
          title: 'Success',
          message: '修改成功！',
          type: 'success',
          duration: 2000
        })
        this.getList()
        this.dialogFormVisible3 = false
      })
    },
    handleUpdate2(row) {
      this.companyId = row.id.toString()
      this.temp = Object.assign({}, row)
      this.dialogFormVisible2 = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
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
    },
    handleClose(done) {
      // dialog 关闭回调
      done()
      this.activeName = 'address'
    }
  }
};

</script>
