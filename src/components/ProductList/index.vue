<template>
  <div>
    <div class="tr">
      <el-button plain type="warning" icon="el-icon-circle-plus-outline" @click="handleCreate">
        新增产品
      </el-button>
    </div>
    <el-table :data="list" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="ID" width="90">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="化学品名称" :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          {{ scope.row.chemical_name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Cas号" width="120" :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          {{ scope.row.cas }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="库存" width="90">
        <template slot-scope="scope">
          {{ scope.row.stock }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="数量" width="90">
        <template slot-scope="scope">
          {{ scope.row.package }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="单位" width="90">
        <template slot-scope="scope">
          {{ scope.row.unit | unitFilter}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="价格" width="90">
        <template slot-scope="scope">
          {{ scope.row.price }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否有效" width="90">
        <template slot-scope="scope">
          {{ scope.row.active | statusFilter}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="首页展示" width="90">
        <template slot-scope="scope">
          {{ scope.row.is_show | statusFilter}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建人" width="90">
        <template slot-scope="scope">
          {{ scope.row.created_name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建日期" width="155">
        <template slot-scope="scope">
          {{ scope.row.created_at }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注">
        <template slot-scope="scope">
          {{ scope.row.note }}
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
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="60%" :append-to-body="true">
      <el-form ref="rules" :rules="rules" :model="temp" label-position="right" label-width="110px">
        <el-row :gutter="20">
          <!-- <el-col :span="12">
            <el-form-item label="供应商产品id" prop="id">
              <el-input v-model="temp.id" />
            </el-form-item>
          </el-col> -->
          <el-col :span="24">
            <el-form-item label="化学品名称" prop="chemical_name">
              <!-- <el-input v-model="temp.chemical_id" /> -->
              <chemicals style="width:100%" v-if="showComponent" :state="temp.chemical_name" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="库存" prop="stock">
              <el-input v-model="temp.stock" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="数量" prop="package">
              <el-input v-model="temp.package" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单位" prop="unit">
              <!-- temp.unit--{{temp.unit}} -->
              <el-select v-model="temp.unit" filterable placeholder="请选择单位" style="width: 100%">
                <el-option v-for="item in unitList" :key="item.label" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="价格" prop="price">
              <el-input v-model="temp.price" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="排序" prop="weight">
              <el-input v-model="temp.weight" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="备注" prop="note">
              <el-input v-model="temp.note" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
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
          <el-col :span="8">
            <el-form-item label="是否在首页展示该热销商品" prop="is_show">
              <el-radio-group v-model="temp.is_show">
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
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()" v-preventReClick>
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { vendorCompaniesProduct, createProduct, updateProduct } from '@/api/crm'
import chemicals from '@/components/Autocomplete/chemicals'
import Pagination from '@/components/Pagination'
export default {
  name: 'Customer',
  components: { Pagination, chemicals },
  props: {
    id: {
      default: false,
      type: String
    },
    showFlag: {
      type: Boolean
    }
  },
  watch: {
    showFlag(newVal, oldVal) {
      this.dialogVisible = newVal
      newVal ? this.showComponent = true : this.showComponent = false;
    },
    companiesInfo(newVal, oldVal) {
      this.vendor_id = null;
      this.contactsList = null;
      // this.getContactsList(newVal.id);
    }
  },
  computed: {
    ...mapState(['user/companiesInfo']),
    chemicalsInfo() {
      return this.$store.state.user.chemicalsInfo;
    }
  },
  data() {
    return {
      showComponent: true,
      options: [{
        value: 1,
        label: '增值税普通发票(13%)'
      }, {
        value: 2,
        label: '增值税普通发票(3%)'
      }, {
        value: 3,
        label: '增值税专用发票(13%)'
      }, {
        value: 4,
        label: '不开票'
      }],
      unitList: [{
        "value": '1',
        "label": 'mg'
      }, {
        "value": '2',
        "label": 'g'
      }, {
        "value": '3',
        "label": 'kg'
      }, {
        "value": '4',
        "label": 'ML'
      }, {
        "value": '5',
        "label": 'L'
      }, {
        "value": '6',
        "label": 'T'
      }, {
        "value": '7',
        "label": 'mm'
      }, {
        "value": '8',
        "label": 'cm'
      }, {
        "value": '9',
        "label": 'm'
      }, {
        "value": '10',
        "label": '支'
      }, {
        "value": '11',
        "label": '瓶'
      }, {
        "value": '12',
        "label": '个'
      }, {
        "value": '13',
        "label": '把'
      }, {
        "value": '14',
        "label": '套'
      }, {
        "value": '15',
        "label": '组'
      }, {
        "value": '16',
        "label": '盒'
      }, {
        "value": '17',
        "label": '台'
      }, {
        "value": '18',
        "label": '包'
      }],
      list: null,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      temp: {
        chemical_id: null,
        is_show: 1,
        weight: 0,
        active: 1,
        stock: null,
        price: null,
        note: null,
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
        unit: [{ required: true, message: '单位不能为空', trigger: 'blur' }]
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
      vendorCompaniesProduct(this.id, this.listQuery).then(response => {
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
        chemical_id: null,
        is_show: 1,
        weight: 0,
        active: 1,
        stock: null,
        price: null,
        note: null,
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
      if (!this.$store.state.user.chemicalsInfo || !this.$store.state.user.chemicalsInfo[0].id) {
        this.$notify({
          title: '提示信息',
          message: '请输入化学品名称，并在下拉菜单中选中！',
          type: 'error',
          duration: 4000
        })
        return
      }
      this.$refs['rules'].validate((valid) => {
        if (valid) {
          this.temp.chemical_id = this.$store.state.user.chemicalsInfo[0].id;
          createProduct(this.temp, this.id).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.resetTemp()
            this.$store.commit("user/SET_CHEMICALS_INFO", null);
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
          this.temp.chemical_id = this.$store.state.user.chemicalsInfo[0].id;
          const tempData = Object.assign({}, this.temp)
          tempData.product_id = tempData.id;
          updateProduct(tempData, tempData.id).then(() => {
            this.$store.commit("user/SET_CHEMICALS_INFO", null);
            this.getList()
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
