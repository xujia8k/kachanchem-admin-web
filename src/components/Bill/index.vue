<template>
  <div>
    <div class="tr">
      <el-button plain  type="warning" icon="el-icon-circle-plus-outline" @click="handleCreate">
        新增发票
      </el-button>
    </div>
    <!-- 客户信息 -->
    <el-table :data="list" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="开票公司名">
        <template slot-scope="scope">
          {{ scope.row.company_name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="税务号">
        <template slot-scope="scope">
          {{ scope.row.tax_no }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="电话">
        <template slot-scope="scope">
          {{ scope.row.mobile }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="公司地址"  :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          {{ scope.row.company_address }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="银行">
        <template slot-scope="scope">
          {{ scope.row.bank }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="账号">
        <template slot-scope="scope">
          {{ scope.row.account_no }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="发票收货地址"  :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          {{ scope.row.delivery_address }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="收货国家">
        <template slot-scope="scope">
          {{ scope.row.delivery_country }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="收票人">
        <template slot-scope="scope">
          {{ scope.row.delivery_contact }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="收货人电话">
        <template slot-scope="scope">
          {{ scope.row.delivery_mobile }}
        </template>
      </el-table-column>
      <!--  发票类型,1-增值税普通发票(13%),2-增值税普通发票(3%),3-增值税专用发票(13%),4-不开票 -->
      <el-table-column align="center" label="发票类型">
        <template slot-scope="scope">
          {{ scope.row.category | invoiceCategoryFilter}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="收货人邮箱">
        <template slot-scope="scope">
          {{ scope.row.delivery_email }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="传真">
        <template slot-scope="scope">
          {{ scope.row.fax }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="默认地址">
        <template slot-scope="scope">
          {{ scope.row.is_default | statusFilter }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否有效">
        <template slot-scope="scope">
          {{ scope.row.active | statusFilter }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="{row}">
          <el-button type="primary" size="small" @click="handleUpdate(row)">
            修改
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="60%" :append-to-body="true">
      <el-form ref="rules" :rules="rules" :model="temp" label-position="right" label-width="110px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="开票公司名" prop="company_name">
              <el-input v-model="temp.company_name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收票人" prop="delivery_contact">
              <el-input v-model="temp.delivery_contact" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="税务号" prop="tax_no">
              <el-input v-model="temp.tax_no" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收货人电话" prop="delivery_mobile">
              <el-input v-model="temp.delivery_mobile" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公司电话" prop="mobile">
              <el-input v-model="temp.mobile" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收货人邮箱" prop="delivery_email">
              <el-input v-model="temp.delivery_email" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="账号" prop="account_no">
              <el-input v-model="temp.account_no" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收货国家" prop="delivery_country">
              <el-input v-model="temp.delivery_country" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="银行" prop="bank">
              <el-input v-model="temp.bank" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发票收货地址" prop="delivery_address">
              <el-input v-model="temp.delivery_address" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公司地址" prop="company_address">
              <el-input v-model="temp.company_address" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="传真" prop="fax">
              <el-input v-model="temp.fax" />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="默认地址" prop="is_default">
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
          <el-col :span="12">
            <el-form-item label="发票类型" prop="category">
              <el-select ref="select" v-model="temp.category" placeholder="请选择发票类型">
                <el-option v-for="item in invoiceType" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否有效" prop="active">
              <el-radio-group v-model="temp.active">
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
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { addClass, removeClass } from '@/utils'
import { fetchInvoicesList, createInvoice, updateInvoice } from '@/api/crm'
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
      invoiceType: [{
        value: 1,
        label: '增值税普通发票(13%)'
      }, {
        value: 2,
        label: '增值税普通发票(3%)'
      }, {
        value: 3,
        label: '增值税专用发票(13%)'
      }],
      list: null,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      temp: {
        company_name: null,
        tax_no: null,
        mobile: null,
        company_address: null,
        bank: null,
        account_no: null,
        delivery_address: null,
        delivery_country: null,
        delivery_contact: null,
        delivery_mobile: null,
        category: 1,
        delivery_email: null,
        fax: null,
        is_default: 1,
        active: 1,
        page: 1,
        limit: 10
      },
      dialogStatus: '',
      dialogFormVisible: false,
      downloadLoading: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        company_name: [{ required: true, message: '开票公司名不能为空', trigger: 'blur' }],
        tax_no: [{ required: true, message: '税务号不能为空', trigger: 'blur' }],
        mobile: [{ required: true, message: '电话不能为空', trigger: 'blur' }],
        company_address: [{ required: true, message: '公司地址不能为空', trigger: 'blur' }],
        bank: [{ required: true, message: '银行不能为空', trigger: 'blur' }],
        account_no: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
        delivery_address: [{ required: true, message: '发票收货地址不能为空', trigger: 'blur' }],
        tax_no: [{ required: true, message: '收货人号不能为空', trigger: 'blur' }],
        delivery_contact: [{ required: true, message: '收货人不能为空', trigger: 'blur' }],
        category: [{ required: true, message: '发票类型不能为空', trigger: 'blur' }],
        delivery_mobile: [{ required: true, message: '收货人电话不能为空', trigger: 'blur' }]
      }

    }
  },
  computed: {},
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.listQuery.id = this.id
      fetchInvoicesList(this.listQuery).then(response => {
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
        limit: 10
      }
      this.temp = {
        company_name: null,
        tax_no: null,
        mobile: null,
        company_address: null,
        bank: null,
        account_no: null,
        delivery_address: null,
        delivery_country: null,
        delivery_contact: null,
        delivery_mobile: null,
        category: 1,
        delivery_email: null,
        fax: null,
        is_default: 1,
        active: 1,
        page: 1,
        limit: 10
      }
    },
    handleUpdate(row) {
      this.companyId = row.id
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['rules'].clearValidate()
      })
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['rules'].clearValidate()
      })
    },
    createData() {
      this.$refs['rules'].validate((valid) => {
        if (valid) {
          createInvoice(this.id, this.temp).then(() => {
            this.getList()
            this.dialogFormVisible = false
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
    updateData() {
      this.$refs['rules'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateInvoice(tempData.id, tempData).then(() => {
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
