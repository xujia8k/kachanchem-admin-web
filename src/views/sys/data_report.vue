<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model.trim="listQuery.name" placeholder="请输入报表名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button type="primary" @click="handleFilter" class="filter-item ml10">
        查询
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
    <el-table :data="list" style="width: 100%;margin-top:20px;" border fit highlight-current-row stripe class="cp">
      <el-table-column align="center" label="ID" width="110">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="报表名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="数据源sql设置">
        <template slot-scope="scope">
          {{ scope.row.sql_config }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="报表字段设置">
        <template slot-scope="scope">
          {{ scope.row.columns }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="报表搜索条件项">
        <template slot-scope="scope">
          {{ scope.row.conditions }}
        </template>
      </el-table-column> -->
      <el-table-column align="center" label="是否有效" width="110">
        <template slot-scope="scope">
          {{ scope.row.active | statusActiveFilter}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.created_at }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="修改日期">
        <template slot-scope="scope">
          {{ scope.row.updated_at }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注">
        <template slot-scope="scope">
          {{ scope.row.note }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="250">
        <template slot-scope="{row}">
          <el-button type="primary" size="small" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="success" size="small" @click="handleUpdateRoles(row)">
            分配角色
          </el-button>
          <el-button class="filter-item" size="small" style="margin-left: 10px;" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="80%" :close-on-click-modal="false">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="110px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="报表名称" prop="name">
              <el-input v-model="temp.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据源设置" prop="sql_config">
              <el-input v-model="temp.sql_config" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报表字段设置" prop="columns">
              <el-input v-model="temp.columns" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="note">
              <el-input v-model="temp.note" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-divider content-position="center">报表搜索条件</el-divider>
          </el-col>
          <el-col :span="24">
            <el-button @click="addConditions" size="small" type="success" class="fr mb10">新增域名</el-button>
          </el-col>
          <!-- 报表搜索条件 -->
          <div v-for="(item,index) in temp.conditions" :label="item.name" :key="index">
            <el-col :span="12">
              <el-form-item label="搜索条件名称" prop="name">
                <el-input v-model="item.name" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="搜索条件字段" prop="key">
                <el-input v-model="item.key" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="搜索条件脚本" prop="condition">
                <el-input v-model="item.condition" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="默认值" prop="default_value">
                <el-input v-model="item.default_value" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="条件展示方式" prop="view_type">
                <el-radio-group v-model="item.view_type" @change="typeChange(item)">
                  <el-radio label="select">
                    下拉框
                  </el-radio>
                  <el-radio label="text">
                    文本框
                  </el-radio>
                  <el-radio label="time">
                    时间框
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="item.view_value_status || item.view_type=='select'">
              <el-form-item label="下拉框列表" prop="view_value">
                <el-select placeholder="请选择">
                  <el-option v-for="item in item.view_value" :key="item.value" :label="item.key" :value="item.value" disabled="disabled" />
                </el-select>
                <el-button type="success" @click.prevent="editViewValue( item.view_value,index)">编辑下拉框列表</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-button @click.prevent="removeConditions(item)" size="small" type="danger" class="fr mb10">删除</el-button>
            </el-col>
          </div>
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
    <el-dialog title="编辑下拉框列表" :visible.sync="dialogFormVisible3" width="50%">
      <div class="tr mb10">
        <el-button @click.prevent="addViewList()" type="success" class="tr">新增</el-button>
      </div>
      <el-form label-width="120px" class="demo-dynamic">
        <el-row :gutter="20" v-for="(item, index) in viewList">
          <el-col :span="10">
            <el-form-item prop="key" label="显示内容(key)">
              <el-input v-model="item.key"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item prop="value" label="提交参数(value)">
              <el-input v-model="item.value"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button @click.prevent="removeViewList(item,index)" type="danger">删除</el-button>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible3 = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateItemViewData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { reportForms, addReportForms, updateReportForms, deleteReportForms, chartsFormsRole, updateChartsFormsRole } from '@/api/sys'
import { parseTime } from '@/utils'


export default {
  name: '数据报表列表',
  components: { Pagination },
  data() {
    return {
      viewList: [{
        "value": '',
        "key": ''
      }], // 下拉列表
      editItemIndex: '', // 编辑数据行
      rolesList: {}, // 角色列表
      checkRolesList: [], // 选中角色列表
      roleId: null, // 编辑的角色ID
      date: null,
      list: null,
      listLoading: true,
      total: 0,
      dialogFormVisible: false,
      dialogFormVisible2: false,
      dialogFormVisible3: false,
      dialogStatus: '',
      textMap: {
        update: '修改数据报表',
        create: '添加数据报表'
      },
      listQuery: {
        page: 1,
        limit: 20
      },
      rules: {
        name: [{ required: true, message: '报表名称不能为空', trigger: 'blur' }],
        sql_config: [{ required: true, message: '数据源设置不能为空', trigger: 'blur' }],
        columns: [{ required: true, message: '报表字段设置不能为空', trigger: 'blur' }]
      },
      temp: {
        name: "",
        note: "",
        sql_config: "",
        columns: "",
        active: 1,
        conditions: [{
          name: "",
          key: "",
          condition: "",
          view_type: "text",
          view_value: null,
          default_value: null
        }]
      }
    }
  },
  created() {
    let that = this;
    that.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      reportForms(this.listQuery).then(response => {
        this.list = response.data.page_datas
        this.total = response.data.total_count
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.listQuery = {
        name: null,
        page: 1,
        limit: 20
      }
      this.fileList = [];
      this.temp = {
        name: "",
        note: "",
        sql_config: "",
        columns: "",
        active: 1,
        conditions: [{
          name: "",
          key: "",
          condition: "",
          view_type: "text",
          view_value: null,
          default_value: null
        }]
      }
    },
    refresh() {
      this.resetTemp()
      this.listQuery.page = 1
      this.getList()
    },
    // 删除用户设
    handleDelete(row) {
      let tem = {
        id: row.id
      }
      deleteReportForms(tem).then(response => {
        if (response.code == 0) {
          this.$notify({
            title: '提示信息',
            message: '删除成功！',
            type: 'success',
            duration: 2000
          })
          this.handleFilter();
        }
      })
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
          addReportForms(this.temp).then(response => {
            if (response.code == 0) {
              this.dialogFormVisible = false
              this.$notify({
                title: '提示信息',
                message: '创建成功！',
                type: 'success',
                duration: 2000
              })
              this.handleFilter();
            }
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
          updateReportForms(tempData).then(response => {
            if (response.code == 0) {
              this.$notify({
                title: '提示信息',
                message: '更新成功！',
                type: 'success',
                duration: 2000
              })
              for (const v of this.list) {
                if (v.id === this.temp.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.temp)
                  break
                }
              }
              this.dialogFormVisible = false
            }
          })
        }
      })
    },
    //添加搜索条件
    addConditions() {
      this.temp.conditions.push({
        name: '',
        key: '',
        condition: '',
        view_type: 'text',
        view_value: [],
        default_value: ''
      });
    },
    //删除搜索条件
    removeConditions(item) {
      var index = this.temp.conditions.indexOf(item)
      if (index !== -1) {
        this.temp.conditions.splice(index, 1)
      }
    },
    // 分配角色
    handleUpdateRoles(row) {
      this.dialogFormVisible2 = true
      this.listLoading = true
      this.roleId = row.id;
      row.entity_id=row.id;
      row.entity_type='ReportForm';
      chartsFormsRole(row).then(response => {
        this.rolesList = response.data
        this.checkRolesList = response.data.selected_role_ids
        this.listLoading = false
      })
    },
    // 更新分配角色
    updateRolesListData() {
      const that = this
      let tem = {
        role_ids: that.checkRolesList,
        entity_id:this.roleId,
        entity_type:'ReportForm'
      }
      updateChartsFormsRole(tem).then(response => {
        if (response.code == 0) {
          this.$notify({
            title: '提示信息',
            message: '更新成功！',
            type: 'success',
            duration: 2000
          })
          that.checkRolesList = []
          that.dialogFormVisible2 = false
        }
      })
    },
    //条件展示方式改变
    typeChange: function(item) {
      item.view_type == 'select' ? item.view_value_status = true : item.view_value_status = false;
    },
    //添加下拉框列表值
    editViewValue: function(item, index) {
      if (item) {
        this.viewList = item
      } else {
        this.viewList = [{
          "value": '',
          "key": ''
        }]
      }
      this.editItemIndex = index
      this.dialogFormVisible3 = true;
    },
    //添加下拉框列表值
    addViewList: function(item) {
      this.viewList.push({ "value": null, "key": null })
    },
    //删除下拉框列表值
    removeViewList: function(row, index) {
      this.viewList.splice(index, 1)
    },
    //提交下拉框列表值
    updateItemViewData: function() {
      this.$set(this.temp.conditions[this.editItemIndex], 'view_value', this.viewList);
      this.viewList = [{
        "value": '',
        "key": ''
      }];
      this.editItemIndex = '';
      this.dialogFormVisible3 = false;
    }
  }
}

</script>
