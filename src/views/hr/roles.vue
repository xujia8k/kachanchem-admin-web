<template>
  <div class="app-container">
    <el-row>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>角色和权限管理</span>
          <el-button plain class="fr" type="warning" icon="el-icon-circle-plus-outline" @click="handleCreate">
            新增
          </el-button>
        </div>
        <el-row :gutter="20">
          <el-col v-for="item in list" :key="item.id" :span="6" class="text-center">
            <div class="item">
              <div class="dib">{{ item.name }}</div>
              <el-tooltip class="cp ml10" effect="dark" content="编辑" placement="top">
                <i class="el-icon-edit" @click="handleUpdate(item)" />
              </el-tooltip>
              <el-tooltip class="cp" effect="dark" content="分配操作权限" placement="top">
                <i class="el-icon-menu" @click="showPermission(item)" />
              </el-tooltip>
              <el-tooltip class="cp" effect="dark" content="员工列表" placement="top">
                <i class="el-icon-more" @click="showList(item)" />
              </el-tooltip>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </el-row>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="update" label-position="left" label-width="100px" style="width: 400px; margin-left:100px;">
        <el-form-item label="名称(英文)" prop="name">
          <el-input v-model="update.name" />
        </el-form-item>
        <el-form-item label="名称(中文)" prop="name_cn">
          <el-input v-model="update.name_cn" />
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
    <!-- 角色权限分配 -->
    <el-dialog title="角色权限分配" :visible.sync="dialogFormVisible2" :close-on-click-modal="false" width="80%">
      <el-table :data="permissionList.permissions" :span-method="objectSpanMethod" border style="width: 100%; margin-top: 20px">
        <el-table-column prop="menu" label="菜单" width="180" />
        <el-table-column prop="child_menu" label="功能" width="180" />
        <el-table-column label="操作权限">
          <template slot-scope="scope">
            <el-checkbox-group v-model="role_ids">
              <el-checkbox v-for="item in scope.row.details" :key="item.id" :label="item.id">{{ item.operate_name }}</el-checkbox>
            </el-checkbox-group>
          </template>
        </el-table-column>
        <!-- <el-table-column label="查看他人单据" width="120" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="handlePermissions(scope.row)">设置查看权限</el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">
          取消
        </el-button>
        <el-button type="primary" @click="updatePermission">
          保存
        </el-button>
      </div>
    </el-dialog>
    <!-- 权限分配 -->
    <el-dialog title="角色下的员工列表" :visible.sync="dialogFormVisible3">
      <div>
        <el-button v-for="item in employeeList.employees" :key="item.id" v-if="item" style=" width: 100px;margin-bottom: 20px">{{ item.name }}</el-button>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible3 = false">
          取消
        </el-button>
      </div>
    </el-dialog>
    <!-- 限定可查看哪些人的单据 -->
    <el-dialog title="限定可查看哪些人的单据" :visible.sync="dialogFormVisible4" :close-on-click-modal="false" width="70%">
      <el-table :data="pagePermissionList" border style="width: 100%; margin-top: 20px">
        <el-table-column prop="id" label="id" width="80" />
        <el-table-column prop="name" label="角色名称" width="180" />
        <el-table-column prop="name_cn" label="中文名" width="180" />
        <el-table-column label="成员">
          <template slot-scope="scope">
            <span v-for="item in scope.row.employee_name" :key="item.id" :label="item.id" class="c-dark-blue">{{ item }},</span>
          </template>
        </el-table-column>
        <el-table-column label="查看他人单据" width="120" align="center">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.is_selected" :checked="scope.row.is_selected == 1 ? true : false"></el-checkbox>
          </template>
        </el-table-column>
        <!-- <el-table-column label="是否可以查看" width="120" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.is_selected | statusFilter}}</span>
          </template>
        </el-table-column> -->
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible4 = false">
          取消
        </el-button>
        <el-button type="primary" @click="handleUpdatePagePermission">
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { fetchRolesList, createRoles, updateRoles, fetchPermissionList, updatePermission, fetchEmployeeList, pagePermission, updatePagePermission } from '@/api/hr'
export default {
  name: 'Profile',
  data() {
    return {
      roleId: null, // 角色id
      list: null,
      employeeList: {},
      permissionList: {},
      viewPermissions: null, //控制器路径，用于标识列表页接口地址
      role_ids: [],
      spanArr: [], // 在data里面定义
      position: 0, // 在data里面定义
      updatePermissionList: null,
      pagePermissionList: null, //获取角色查看他人单据信息列表
      listQuery: {
        name: undefined
      },
      dialogFormVisible: false,
      dialogFormVisible2: false,
      dialogFormVisible3: false,
      dialogFormVisible4: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      update: {
        name: '',
        name_cn: ''
      },
      rules: {
        name: [{ required: true, message: '名称(中文)不能为空', trigger: 'blur' }],
        name_cn: [{ required: true, message: '名称(英文)不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchRolesList(this.listQuery).then(response => {
        this.list = response.data.page_datas
        this.listLoading = false
      })
    },
    resetTemp() {
      this.temp = {}
      this.update = {
        name: '',
        name_cn: ''
      }
    },
    handleFilter() {
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
          createRoles(this.update).then(() => {
            this.getList()
            for (const v of this.list) {
              if (v.id === this.update.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.update)
                break
              }
            }
            this.dialogFormVisible = false
          })
        }
      })
    },
    //设置查看权限
    // handlePermissions(row) {
    //   let temp = {
    //     "id": this.roleId,
    //     "controller_path": row.controller_path
    //   }
    //   this.viewPermissions = row.controller_path;
    //   this.dialogFormVisible4 = true
    //   this.getPagePermission(temp);
    // },
    //获取角色查看他人单据信息
    getPagePermission(query) {
      const updateData = Object.assign({}, query)
      pagePermission(updateData).then(response => {
        this.pagePermissionList = response.data.roles
      })
    },
    //获取角色查看他人单据信息
    handleUpdatePagePermission() {
      let tempList = this.pagePermissionList;
      let tem = {
        controller_path: this.viewPermissions,
        role_ids: [],
      };
      for (const t of tempList) {
        if (t.is_selected) {
          tem.role_ids.push(t.id)
        }
      }
      updatePagePermission(this.roleId, tem).then(() => {
        for (const v of this.pagePermissionList) {
          if (v.id === this.update.id) {
            const index = this.pagePermissionList.indexOf(v)
            this.pagePermissionList.splice(index, 1, this.update)
            this.$message({
              type: 'info',
              message: '修改成功！'
            });
            break
          }
        }
        this.dialogFormVisible4 = false
      })
    },
    handleUpdate(row) {
      this.update = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const updateData = Object.assign({}, this.update)
          updateRoles(updateData).then(() => {
            for (const v of this.list) {
              if (v.id === this.update.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.update)
                break
              }
            }
            this.dialogFormVisible = false
          })
        }
      })
    },
    showList(row) {
      this.dialogFormVisible3 = true
      this.listLoading = true
      this.roleId = row.id
      fetchEmployeeList(row).then(response => {
        this.employeeList = response.data
        this.listLoading = false
      })
    },
    // 显示权限分配弹窗
    showPermission(row) {
      this.dialogFormVisible2 = true
      this.listLoading = true
      this.roleId = row.id
      fetchPermissionList(row).then(response => {
        this.permissionList = response.data
        this.role_ids = response.data.selected_permission_ids

        this.spanArr = [] // 在data里面定义
        this.position = 0 // 在data里面定义
        this.permissionList.permissions.forEach((item, index) => {
          if (index === 0) {
            this.spanArr.push(1)
            this.position = 0
            // item.sequence=index+1;//设置序号
          } else {
            if (this.permissionList.permissions[index].menu ===
              this.permissionList.permissions[index - 1].menu) {
              this.spanArr[this.position] += 1 // 连续有几行项目名名称相同
              this.spanArr.push(0) // 名称相同后往数组里面加一项0
            } else {
              this.spanArr.push(1)
              this.position = index
            }
          }
        })
        this.listLoading = false
      })
    },
    updatePermission(row) {
      updatePermission(this.roleId, { permission_ids: this.role_ids }).then(response => {
        this.updatePermissionList = response.data.page_datas
        this.role_ids = []
        this.dialogFormVisible2 = false
      })
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) { // 项目列也进行合并(第1列)
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    }
  }
}

</script>
<style lang="scss" scoped>
.item {
  margin-bottom: 20px;
}

</style>
