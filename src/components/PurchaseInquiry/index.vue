<template>
  <el-dialog title="创建采购询价订单" width="80%" :close-on-click-modal="false" :visible.sync="dialogVisible" :before-close="onClose">
    <el-form label-width="80px">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="化学品">
            <products v-if="showComponent" index="0" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="销售">
            <employees v-if="showComponent" :userId="userName" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="数量/包装">
            <el-input v-model="package"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="单位">
            <el-select v-model="unit" filterable placeholder="请选择单位" style="width:100%">
              <el-option v-for="item in unitList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="纯度">
            <el-input v-model="purity"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注">
            <el-input v-model="note" type="textarea" show-word-limit />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-divider content-position="left">供应商信息</el-divider>
    <el-form label-width="80px" class="mt44">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="供应商">
            <companies v-if="showComponent" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-divider content-position="left">采购报价信息</el-divider>
    <div class="ovh" style="margin-bottom: 20px">
      <!-- <span class="dib" style="line-height: 36px;font-size: 16px;">采购报价信息</span> -->
      <el-button-group class="fr">
        <el-button type="warning" icon="el-icon-circle-plus-outline" @click="handleAddQuotation">添加报价行</el-button>
        <!-- <el-button type="success" icon="el-icon-check" @click="handleCreate">保存</el-button> -->
      </el-button-group>
    </div>
    <el-table :data="quotation_details" style="width: 100%;" border>
      <el-table-column align="center" label="价格" width="200x">
        <template slot-scope="scope">
          <template v-if=" scope.row.edit">
            <el-input v-model="scope.row.price" class="tc" size="small" />
          </template>
          <span v-else>{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="数量/包装" width="200x">
        <template slot-scope="scope">
          <template v-if=" scope.row.edit">
            <el-input v-model="scope.row.package" class="tc" size="small" />
          </template>
          <span v-else>{{ scope.row.package }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="单位" width="200x">
        <template slot-scope="scope">
          <template v-if=" scope.row.edit">
            <el-select v-model="scope.row.unit" filterable placeholder="请选择单位">
              <el-option v-for="item in unitList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
          <span v-else>{{ scope.row.unit }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="纯度" width="200x">
        <template slot-scope="scope">
          <template v-if=" scope.row.edit">
            <el-input v-model="scope.row.purity" class="tc" size="small" />
          </template>
          <span v-else>{{ scope.row.purity }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="货期" width="200x">
        <template slot-scope="scope">
          <template v-if=" scope.row.edit">
            <el-input v-model="scope.row.stock" class="tc" size="small" />
          </template>
          <span v-else>{{ scope.row.stock }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注">
        <template slot-scope="scope">
          <template v-if=" scope.row.edit">
            <el-input v-model="scope.row.note" class="tc" size="small" />
          </template>
          <span v-else>{{ scope.row.note }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="handleDeleQuotation(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onClose">取消</el-button>
      <el-button type="success" icon="el-icon-check" @click="handleCreate">保存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { mapState } from 'vuex';
import { deleteObjNull } from '@/utils'
import { createInquiries } from '@/api/purchase'
import companies from '@/components/Autocomplete/companies'
import products from '@/components/Autocomplete/products'
import employees from '@/components/Autocomplete/employees'
import { getUserId, getName } from '@/utils/auth'

export default {
  name: 'inquiry',
  components: { companies, products, employees },
  computed: {
    ...mapState(['user/companiesInfo', 'user/productsInfo', 'user/employeesInfo']),
    companiesInfo() {
      return this.$store.state.user.companiesInfo;
    },
    productsInfo() {
      return this.$store.state.user.productsInfo;
    },
    employeesInfo() {
      return this.$store.state.user.employeesInfo;
    }
  },
  props: {
    showFlag: {
      type: Boolean
    }
  },
  watch: {
    showFlag(newVal, oldVal) {
      this.dialogVisible = newVal
      newVal ? this.showComponent = true : this.showComponent = false;
    }
  },
  data() {
    return {
      showComponent: true,
      dialogVisible: false,
      company_id: null,
      // product_id: null,
      userId: getUserId(), //当前登录用户ID
      userName: getName(), //当前登录用户名字
      package: null,
      unit: null,
      purity: null,
      saler_id: null,
      note: null,
      unitList: [{
        "value": 1,
        "label": 'mg'
      }, {
        "value": 2,
        "label": 'g'
      }, {
        "value": 3,
        "label": 'kg'
      }, {
        "value": 4,
        "label": 'ML'
      }, {
        "value": 5,
        "label": 'L'
      }, {
        "value": 6,
        "label": 'T'
      }, {
        "value": 7,
        "label": 'mm'
      }, {
        "value": 8,
        "label": 'cm'
      }, {
        "value": 9,
        "label": 'm'
      }, {
        "value": 10,
        "label": '支'
      }, {
        "value": 11,
        "label": '瓶'
      }, {
        "value": 12,
        "label": '个'
      }, {
        "value": 13,
        "label": '把'
      }, {
        "value": 14,
        "label": '套'
      }, {
        "value": 15,
        "label": '组'
      }, {
        "value": 16,
        "label": '盒'
      }, {
        "value": 17,
        "label": '台'
      }, {
        "value": 18,
        "label": '包'
      }],
      quotation_details: [
        { "edit": true, "price": null, "package": null, "unit": null, "purity": null, "stock": null, "note": null }
      ],
      rules2: {
        user_id: [{ required: true, message: '客户不能为空', trigger: 'blur' }],
        company_id: [{ required: true, message: '供应商不能为空', trigger: 'blur' }],
        product_id: [{ required: true, message: '化学品不能为空', trigger: 'blur' }],
        price: [{ required: true, message: '价格不能为空', trigger: 'blur' }],
        cas: [{ required: true, message: 'CAS号不能为空', trigger: 'blur' }],
        package: [{ required: true, message: '包装不能为空', trigger: 'blur' }],
        unit: [{ required: true, message: '单位不能为空', trigger: 'blur' }],
        purity: [{ required: true, message: '纯度不能为空', trigger: 'blur' }]
      },
    }
  },
  mounted() {},
  methods: {
    onClose() {
      // this.$emit('update:visible', false)
      this.$store.commit("user/SET_PRODUCTS_INFO", '');
      this.resetTemp();
      this.$emit('closeChildDialog')
    },
    resetTemp() {
      this.company_id = null;
      this.product_id = null;
      this.package = null;
      this.unit = null;
      this.purity = null;
      this.saler_id = null;
      this.note = null;
      this.quotation_details = [
        { "edit": true, "price": null, "package": null, "unit": null, "purity": null, "stock": null, "note": null }
      ]
    },
    refresh() {
      this.resetTemp()
      this.listQuery.page = 1
      this.getList()
    },
    handleAddQuotation(val) {
      // 添加询盘报价
      let that = this;
      that.quotation_details.push({ "edit": true, "price": null, "package": null, "unit": null, "purity": null, "stock": null, "note": null })
    },
    // 刪除询盘报价
    handleDeleQuotation(row) {
      //只能删除未提交的报价
      this.$confirm('此操作将删除该行, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.quotation_details.splice(row.$index, 1)
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    //验证方法
    handleVerify() {
      let that = this;
      let status = true;
      if (!that.productsInfo) {
        that.$notify({
          title: '提示信息',
          message: '请输入化学品信息！',
          type: 'error',
          duration: 4000
        })
        status = false
      } else if (!that.package) {
        that.$notify({
          title: '提示信息',
          message: '请输入数量/包装信息！',
          type: 'error',
          duration: 3000
        })
        status = false
      } else if (!that.unit) {
        that.$notify({
          title: '提示信息',
          message: '请输入单位信息！',
          type: 'error',
          duration: 3000
        })
        status = false
      } else if (!that.purity) {
        that.$notify({
          title: '提示信息',
          message: '请输入纯度信息！',
          type: 'error',
          duration: 3000
        })
        status = false
      } else if (!that.purity) {
        that.$notify({
          title: '提示信息',
          message: '请输入纯度信息！',
          type: 'error',
          duration: 3000
        })
        status = false
      } else if (that.companiesInfo.id && !that.quotation_details[0].price) {
        that.$notify({
          title: '提示信息',
          message: '请输入报价信息里的价格！',
          type: 'error',
          duration: 3000
        })
        status = false
      } else if (that.companiesInfo.id && !that.quotation_details[0].package) {
        that.$notify({
          title: '提示信息',
          message: '请输入报价信息里的数量/包装！',
          type: 'error',
          duration: 3000
        })
        status = false
      } else if (that.companiesInfo.id && !that.quotation_details[0].unit) {
        that.$notify({
          title: '提示信息',
          message: '请输入报价信息里的单位！',
          type: 'error',
          duration: 3000
        })
        status = false
      } else if (that.companiesInfo.id && !that.quotation_details[0].purity) {
        that.$notify({
          title: '提示信息',
          message: '请输入报价信息里的纯度！',
          type: 'error',
          duration: 3000
        })
        status = false
      }

      return status;
    },
    handleCreate() {
      let that = this;
      if (!that.handleVerify()) {
        return
      }
      let tem = {
        "product_id": that.productsInfo[0].id,
        "package": that.package,
        "unit": that.unit,
        "purity": that.purity,
        "saler_id": that.employeesInfo ? that.employeesInfo.id : that.userId,
        "note": that.note,
      }
      if (that.companiesInfo.id) {
        tem.inquiry_quotation = [{
          "company_id": that.companiesInfo.id || null,
          "quotation_details": that.quotation_details
        }]
      }
      createInquiries(tem).then(response => {
        if (response.code == 0) {
          this.onClose();
          this.$message({
            message: '创建成功！',
            type: 'success'
          });
          that.$store.commit("user/SET_COMPANIES_INFO", '');
        }
      })
    }
  }
}

</script>
<style lang="scss" scoped>
</style>
