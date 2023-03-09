<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model.trim="listQuery.name" placeholder="名字" style="width: 200px;" class="filter-item" @keyup.enter.native="getList" />
      <el-input v-model.trim="listQuery.username" placeholder="账号" style="width: 200px;margin-left: 10px;" class="filter-item" @keyup.enter.native="getList" />
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
      <el-table-column label="账号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="岗位" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.position_id | positionFilter }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="email" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="生日" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.birthday | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="加入时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.joined_on | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="small" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="success" size="small" @click="handleUpdateRoles(row)">
            分配角色
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="账号" prop="username">
              <el-input v-model="temp.username" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="temp.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码" prop="password">
              <el-input v-model="temp.password" show-password />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生日" prop="birthday">
              <el-date-picker v-model="temp.birthday" type="date" placeholder="请输入生日！" style="width:100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="确认密码" prop="password_confirmation">
              <el-input v-model="temp.password_confirmation" show-password />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入职时间" prop="joined_on">
              <el-date-picker v-model="temp.joined_on" type="date" placeholder="请输入入职时间" style="width:100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="mobile">
              <el-input v-model="temp.mobile" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="QQ号" prop="qq_num">
              <el-input v-model="temp.qq_num" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公司电话" prop="office_tel">
              <el-input v-model="temp.office_tel" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="email" prop="email">
              <el-input v-model="temp.email" placeholder="请输入email！" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="在职状态" prop="job_status">
              <el-radio-group v-model="temp.job_status">
                <el-radio :label="1">
                  在职
                </el-radio>
                <el-radio :label="-1">
                  离职
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否启用" prop="is_enabled">
              <el-radio-group v-model="temp.is_enabled">
                <el-radio :label="1">
                  启用
                </el-radio>
                <el-radio :label="0">
                  不启用
                </el-radio>
              </el-radio-group>
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
    <el-dialog title="更新角色权限信息" :visible.sync="dialogFormVisible2">
      <el-checkbox-group v-model="checkRolesList">
        <el-checkbox v-for="item in rolesList.roles" :key="item.id" :label="item.id">
          {{ item.name_cn }}
        </el-checkbox>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateRolesListData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { fetchList, create, update, fetchRolesList, updateEmployeesRole, updateRole } from '@/api/hr'
import { parseTime, isInArray } from '@/utils'
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
      checkRolesList: [], // 选中角色列表
      rolesList: {}, // 角色列表
      listQuery: {
        name: '',
        username: '',
        position_id: null,
        page: 1,
        limit: 20
      },
      temp: {
        username: '',
        name: '',
        position_id: 0,
        team_id: '',
        password: '',
        password_confirmation: '',
        birthday: new Date(),
        joined_on: new Date(),
        mobile: '',
        office_tel: '',
        qq_num: '',
        job_status: 1, // 在职状态, 1:在职, -1:离职
        is_enabled: 1 // 是否启用，1-是，0-否
      },
      dialogFormVisible: false,
      dialogFormVisible2: false,
      dialogStatus: '',
      textMap: {
        update: '编辑员工信息',
        create: '创建员工信息'
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
      fetchList(this.listQuery).then(response => {
        this.list = response.data.page_datas
        this.total = response.data.total_count
        this.listLoading = false
      })
    },
    resetTemp() {
      this.listQuery = {
        name: '',
        username: '',
        position_id: null,
        page: 1,
        limit: 20
      }
      this.temp = {
        username: '',
        name: '',
        position_id: 0,
        team_id: '',
        password: '',
        password_confirmation: '',
        birthday: new Date(),
        joined_on: new Date(),
        mobile: '',
        office_tel: '',
        qq_num: '',
        job_status: 1, // 在职状态, 1:在职, -1:离职
        is_enabled: 1 // 是否启用，1-是，0-否
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
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          create(this.temp).then(() => {
            // this.list.unshift(this.temp)
            this.dialogFormVisible = false
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
    // 分配角色
    handleUpdateRoles(row) {
      this.dialogFormVisible2 = true
      this.listLoading = true
      this.roleId = row.id
      updateEmployeesRole(row).then(response => {
        this.rolesList = response.data
        this.checkRolesList = response.data.selected_role_ids
        this.listLoading = false
      })
    },
    // 更新分配角色
    updateRolesListData() {
      const that = this
      updateRole(that.roleId, { role_ids: that.checkRolesList }).then(response => {
        that.updatePermissionList = response.data.page_datas
        that.checkRolesList = []
        that.dialogFormVisible2 = false
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          update(tempData).then(() => {
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
    closeCom(msg) {
      this.viewData.search_terms_setting = msg[0];
      this.viewData.list_terms_setting = msg[1];
    },
  }
}

</script>
