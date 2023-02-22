<template>
  <div>
    <!-- <div class="tr">
      <el-button plain  type="warning" icon="el-icon-circle-plus-outline" @click="handleCreate">
        新增联系人
      </el-button>
    </div> -->
    <!-- 公司信息 -->
    <el-table :data="list" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="姓名">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="电话">
        <template slot-scope="scope">
          {{ scope.row.tel }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="邮箱">
        <template slot-scope="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="职位">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="座机">
        <template slot-scope="scope">
          {{ scope.row.mobile }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="传真">
        <template slot-scope="scope">
          {{ scope.row.fax }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="QQ">
        <template slot-scope="scope">
          {{ scope.row.qq }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="生日">
        <template slot-scope="scope">
          {{ scope.row.birthday | parseTime('{y}-{m}-{d}') || '-'}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="地址">
        <template slot-scope="scope">
          {{ scope.row.address }}
        </template>
      </el-table-column>
      <!--是否需要展示在首页，1-是，0-否 -->
      <el-table-column align="center" label="性别" width="50">
        <template slot-scope="scope">
          {{ scope.row.gender | genderFilter }}
        </template>
      </el-table-column>
      <!--是否为默认联系人，1-是，0-否 -->
      <el-table-column align="center" label="默认联系人" width="100">
        <template slot-scope="scope">
          {{ scope.row.is_default | statusFilter }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="110">
        <template slot-scope="{row}">
          <el-button type="primary" size="small" @click="handleUpdate(row)">
            修改
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="60%" :append-to-body="true">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="110px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="temp.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话" prop="tel">
              <el-input v-model="temp.tel" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="temp.email" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职位" prop="title">
              <el-input v-model="temp.title" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="座机" prop="mobile">
              <el-input v-model="temp.mobile" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="传真" prop="fax">
              <el-input v-model="temp.fax" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="QQ" prop="qq">
              <el-input v-model="temp.qq" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生日" prop="birthday">
              <el-date-picker v-model="temp.birthday" type="date" placeholder="请选择生日！" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地址" prop="address">
              <el-input v-model="temp.address" type="textarea" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="temp.gender">
                <el-radio :label="0">
                  男
                </el-radio>
                <el-radio :label="1">
                  女
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="默认联系人" prop="gender">
              <el-radio-group v-model="temp.is_default">
                <el-radio :label="0">
                  否
                </el-radio>
                <el-radio :label="1">
                  是
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
        <el-button type="primary" @click="updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { addClass, removeClass } from '@/utils'
import { fetchPermissionContacts, createContacts, updateContact } from '@/api/crm'
import Pagination from '@/components/Pagination'
export default {
  name: 'Customer',
  components: { Pagination },
  props: {
    id: {
      default: false,
      type: String
    }
  },
  data() {
    return {
      show: false,
      list: null,
      total: 0,
      listQuery: {
        page: 1,
        limit: 5
      },
      temp: {
        name: null,
        tel: null,
        email: null,
        title: null,
        mobile: null,
        fax: null,
        qq: null,
        gender: 0,
        birthday: null,
        address: null,
        is_default: 1,
        page: 1,
        limit: 5
      },
      dialogStatus: '',
      dialogFormVisible: false,
      downloadLoading: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        tel: [{ required: true, message: '电话不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {},
  watch: {
    show(value) {
      if (value && !this.clickNotClose) {
        this.addEventClick()
      }
      if (value) {
        addClass(document.body, 'showRightPanel')
      } else {
        removeClass(document.body, 'showRightPanel')
      }
    }
  },
  mounted() {
    this.getList()
  },
  beforeDestroy() {
    this.resetTemp()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.listQuery.id = this.id
      fetchPermissionContacts(this.listQuery).then(response => {
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
        page: 1,
        limit: 5
      }
      this.temp = {
        name: null,
        tel: null,
        email: null,
        title: null,
        mobile: null,
        fax: null,
        qq: null,
        gender: 0,
        birthday: null,
        address: null,
        is_default: 1,
        page: 1,
        limit: 5
      }
    },
    handleUpdate(row) {
      this.companyId = row.id
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateContact(tempData.id, tempData).then(() => {
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
    }
  }
}

</script>
