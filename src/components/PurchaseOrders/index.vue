<template>
  <el-dialog title="创建采购订单" width="80%" :close-on-click-modal="false" :visible.sync="dialogVisible" :before-close="onClose">
    <el-form label-width="100px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="供应商">
            <companies v-if="showComponent" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="供应商联系人">
            <!-- <el-input v-model="vendor_id" show-word-limit /> -->
            <el-select v-model="vendor_id" placeholder="供应商联系人" style="width: 100%;">
              <el-option v-for="item in contactsList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="付款账户">
            <el-select v-model="finance_account_id" placeholder="付款账户" style="width: 100%;">
              <el-option v-for="item in accountsList" :key="item.id" :label="item.account_name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="付款方式">
            <el-select v-model="payment_type" placeholder="付款方式" style="width: 100%;">
              <el-option v-for="item in paymentType" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="货币类型">
            <el-select v-model="currency_type" placeholder="币种" style="width: 100%;">
              <el-option v-for="item in company_currency_type" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="发票类型">
            <el-select v-model="invoice_type" placeholder="币种" style="width: 100%;">
              <el-option v-for="item in invoiceType" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="订单采购渠道">
            <el-select v-model="purchase_channel" placeholder="订单采购渠道" style="width: 100%;">
              <el-option v-for="item in purchaseChannel" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="订单中转方式">
            <el-select v-model="transit_method" placeholder="订单中转方式" style="width: 100%;">
              <el-option v-for="item in transitMethod" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注">
            <el-input v-model="note" type="textarea" show-word-limit />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-divider content-position="left">采购商品信息</el-divider>
    <div class="ovh" style="margin-bottom: 20px">
      <!-- <span class="dib" style="line-height: 36px;font-size: 16px;">采购报价信息</span> -->
      <el-button-group class="fr">
        <el-button type="warning" icon="el-icon-circle-plus-outline" @click="handleAddQuotation">添加商品行</el-button>
      </el-button-group>
    </div>
    <el-table :data="order_detail" style="width: 100%;" border>
      <el-table-column align="center" label="化学品名称">
        <template slot-scope="scope">
          <template v-if=" scope.row.edit">
            <products style="width:100%" v-if="showComponent" :index="scope.$index" />
          </template>
          <span v-else>{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="价格" width="150px">
        <template slot-scope="scope">
          <template v-if=" scope.row.edit">
            <el-input v-model="scope.row.price" class="edit-input" size="small" />
          </template>
          <span v-else>{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="数量" width="150px">
        <template slot-scope="scope">
          <template v-if=" scope.row.edit">
            <el-input v-model.number="scope.row.package"  class="edit-input" size="small" />
          </template>
          <span v-else>{{ scope.row.package }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="单位" width="150px">
        <template slot-scope="scope">
          <template v-if=" scope.row.edit">
            <!-- <el-input v-model="scope.row.unit" class="edit-input" size="small" /> -->
            <el-select v-model="scope.row.unit" filterable placeholder="请选择单位">
              <el-option v-for="item in unitList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
          <span v-else>{{ scope.row.unit }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="纯度" width="90px">
        <template slot-scope="scope">
          <template v-if=" scope.row.edit">
            <el-input v-model="scope.row.purity" class="edit-input" size="small" />
          </template>
          <span v-else>{{ scope.row.purity }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="货期" width="80px">
        <template slot-scope="scope">
          <template v-if=" scope.row.edit">
            <el-input v-model="scope.row.stock" class="edit-input" size="small" />
          </template>
          <span v-else>{{ scope.row.stock }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用途" width="150px">
        <template slot-scope="scope">
          <template v-if=" scope.row.edit">
            <!-- <el-input v-model="scope.row.purpose" class="edit-input" size="small" /> -->
            <el-select v-model="scope.row.purpose" filterable placeholder="请选择单位">
              <el-option v-for="item in purposeList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
          <span v-else>{{ scope.row.purpose }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注" width="150">
        <template slot-scope="scope">
          <template v-if=" scope.row.edit">
            <el-input v-model="scope.row.note" class="edit-input" size="small" />
          </template>
          <span v-else>{{ scope.row.note }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="handleDeleQuotation(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onClose">取消</el-button>
      <el-button type="success" icon="el-icon-check" @click="handleCreate" v-preventReClick>保存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { mapState } from 'vuex';
import { deleteObjNull } from '@/utils'
import { createOrders } from '@/api/purchase'
import { contactsList, accountsList } from '@/api/remote-search'
import { financeAccounts } from '@/api/finance'
import companies from '@/components/Autocomplete/companies'
import products from '@/components/Autocomplete/products'
import employees from '@/components/Autocomplete/employees'

export default {
  name: 'inquiry',
  components: { companies, products, employees },
  props: {
    showFlag: {
      type: Boolean
    }
  },
  watch: {
    showFlag(newVal, oldVal) {
      this.dialogVisible = newVal
      newVal ? this.showComponent = true : this.showComponent = false;
      //获取收款地址列表
      accountsList({}).then(response => {
        if (response.code == 0) {
          let data = response.data.page_datas;
          //默认选中开票类型为1
          data.forEach((item, index) => {
            if (item.is_default == 1) {
              this.finance_account_id = item.id;
              return
            }
          })
          this.accountsList = data;
        }
      })
    },
    companiesInfo(newVal, oldVal) {
      this.vendor_id = null;
      this.contactsList = null;
      this.getContactsList(newVal.id);
    }
  },
  computed: {
    ...mapState(['user/companiesInfo', 'user/employeesInfo', 'user/productsInfo']),
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
  data() {
    return {
      showComponent: true,
      accountsList: null, //收款地址列表
      finance_account_id: null, //默认收款地址
      company_id: null,
      contactsList: null,
      vendor_id: null,
      payment_type: 0,
      purchase_channel: 0,
      transit_method: 0,
      currency_type: 1,
      invoice_type: 1,
      note: null,
      dialogVisible: false,
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
      company_currency_type: [{
        "value": 1,
        "label": 'CNY'
      }, {
        "value": 2,
        "label": 'USD'
      }, {
        "value": 3,
        "label": 'INR'
      }, {
        "value": 4,
        "label": 'EUR'
      }],
      paymentType: [{
        "value": 0,
        "label": '款到发货'
      }, {
        "value": 1,
        "label": '预付30%'
      }, {
        "value": 2,
        "label": '预付50%'
      }],
      invoiceType: [{
        "value": 1,
        "label": '增值税普通发票(13%)'
      }, {
        "value": 2,
        "label": '增值税普通发票(3%)'
      }, {
        "value": 3,
        "label": '增值税专用发票(13%)'
      }, {
        "value": 4,
        "label": '不开票'
      }],
      purposeList: [{
        "value": 0,
        "label": '贸易库存'
      }, {
        "value": 1,
        "label": '研发原料'
      }, {
        "value": 2,
        "label": '耗材'
      }],
      purchaseChannel: [{
        "value": 0,
        "label": '国内采购'
      }, {
        "value": 1,
        "label": '进口自营'
      }, {
        "value": 2,
        "label": '国内自营'
      }],
      transitMethod: [{
        "value": 0,
        "label": '现货'
      }, {
        "value": 1,
        "label": '请购'
      }, {
        "value": 2,
        "label": '直发'
      }],
      order_detail: [
        { "edit": true, "product_id": null, "price": null, "package": null, "unit": null, "purity": null, "stock": null, "purpose": null, "note": null }
      ],
      rules2: {
        company_id: [{ required: true, message: '供应商不能为空', trigger: 'blur' }],
        vendor_id: [{ required: true, message: '供应商联系人不能为空', trigger: 'blur' }],
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
    getContactsList(id) {
      if (id) {
        const tempData = {
          company_id: id,
          company_category: 0
        }
        contactsList(tempData).then(response => {
          this.contactsList = response.data.page_datas
          this.total = response.data.total_count
        })
      }
    },
    onClose() {
      // this.$emit('update:visible', false)
      this.vendor_id = null;
      this.finance_account_id = null;
      this.contactsList = null;
      this.vendor_id = null;
      this.note = null;
      this.order_detail = [
        { "edit": true, "product_id": null, "price": null, "package": null, "unit": null, "purity": null, "stock": null, "purpose": null, "note": null }
      ];
      this.$store.commit("user/SET_PRODUCTS_INFO", '');
      this.$emit('closeChildDialog')
    },
    handleAddQuotation(val) {
      // 添加询盘报价
      let that = this;
      // if (that.order_detail.length < 2) {
      that.order_detail.push({ "edit": true, "product_id": null, "price": null, "package": null, "unit": null, "purity": null, "stock": null, "purpose": null, "note": null })
      // } else {
      //   this.$message({
      //     type: 'info',
      //     message: '最多添加2条询盘'
      //   });
      // }
    },
    // 刪除询盘报价
    handleDeleQuotation(row) {
      //只能删除未提交的报价
      this.$confirm('此操作将删除该行, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.order_detail.splice(row.$index, 1)
        this.$store.commit("user/SET_CHEMICALS_INFO", this.$store.state.user.productsInfo.splice(row.$index, 1));
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
    handleCreate() {
      let that = this;
      let chemicalsInfoList = this.$store.state.user.productsInfo;
      if (!that.companiesInfo.id) {
        this.$notify({
          title: '提示信息',
          message: '请填写供应商公司信息！',
          type: 'error',
          duration: 3000
        })
        return;
      } else if (!that.vendor_id) {
        this.$notify({
          title: '提示信息',
          message: '请从下拉选项中选择供应商联系人！',
          type: 'error',
          duration: 3000
        })
        return;
      } else if (!that.finance_account_id) {
        this.$notify({
          title: '提示信息',
          message: '请填写付款账户！',
          type: 'error',
          duration: 3000
        })
        return;
      }
      if (!chemicalsInfoList) {
        this.$notify({
          title: '提示信息',
          message: '请填采购商品信息，并在下拉框中选中商品!',
          type: 'error',
          duration: 4000
        })
        return
      } else if (!that.order_detail[0].package) {
        this.$notify({
          title: '提示信息',
          message: '请填写数量/包装！',
          type: 'error',
          duration: 3000
        })
        return;
      } else if (!that.order_detail[0].unit) {
        this.$notify({
          title: '提示信息',
          message: '请从下拉选项中选择单位！',
          type: 'error',
          duration: 3000
        })
        return;
      } else if (!that.order_detail[0].purity) {
        this.$notify({
          title: '提示信息',
          message: '请填写纯度！',
          type: 'error',
          duration: 3000
        })
        return;
      } else if (!that.order_detail[0].price) {
        this.$notify({
          title: '提示信息',
          message: '请填写价格！',
          type: 'error',
          duration: 3000
        })
        return;
      } else {
        chemicalsInfoList.forEach((item, index) => {
          that.order_detail[index].product_id = item.id
        });
      }
      let tem = {
        "finance_account_id": that.finance_account_id,
        "vendor_company_id": that.companiesInfo.id,
        "vendor_id": that.vendor_id,
        "payment_type": that.payment_type,
        "currency_type": that.currency_type,
        "invoice_type": that.invoice_type,
        "purchase_channel": that.purchase_channel,
        "transit_method": that.transit_method,
        "note": that.note,
        "order_detail": that.order_detail,
      }
      createOrders(tem).then(response => {
        if (response.code == 0) {
          this.onClose();
          this.$message({
            message: '创建成功！',
            type: 'success'
          });
        }
      })
    }
  }
}

</script>
