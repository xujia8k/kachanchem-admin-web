<template>
  <el-dialog title="创建询盘" width="80%" :close-on-click-modal="false" :visible.sync="dialogVisible" :before-close="onClose">
    <el-form label-width="80px">
      <el-row :gutter="20">
        <el-col :span="16" :xs="24">
          <el-form-item label="客户">
            <contacts style="width:100%" v-if="showComponent" />
          </el-form-item>
        </el-col>
        <el-col :span="8" :xs="24">
          <el-form-item label="备注">
            <el-input v-model="note" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="ovh" style="margin-bottom: 20px">
      <span class="dib" style="line-height: 36px;font-size: 16px;">询盘商品信息</span>
      <el-button-group class="fr">
        <!-- <el-button type="warning" icon="el-icon-circle-plus-outline" @click="handleAddQuotation">添加商品行</el-button> -->
        <!-- <el-button type="success" icon="el-icon-check" @click="handleCreate">保存</el-button> -->
      </el-button-group>
    </div>
    <el-table :data="inquiry_details" element-loading-text="拼命加载中" border fit highlight-current-row stripe class="us cp" style="width: 100%">
      <el-table-column align="center" label="产品名称" min-width="350">
        <template slot-scope="scope">
          <template>
            <products style="width:100%" v-if="showComponent" :index="scope.$index" />
          </template>
        </template>
      </el-table-column>
      <el-table-column align="center" label="数量" width="150">
        <template slot-scope="scope">
          <template>
            <el-input-number v-model="scope.row.package" :min="1" class="edit-input" size="small"></el-input-number>
          </template>
        </template>
      </el-table-column>
      <el-table-column align="center" label="单位" width="150">
        <template slot-scope="scope">
          <template>
            <el-select v-model="scope.row.unit" filterable placeholder="请选择单位" class="tc">
              <el-option v-for="item in unitList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </template>
      </el-table-column>
      <el-table-column align="center" label="纯度" width="150">
        <template slot-scope="scope">
          <template>
            <el-input v-model="scope.row.purity" class="tc" size="small" />
          </template>
        </template>
      </el-table-column>
      <!--  <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="handleDeleQuotation(scope)">删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onClose">取消</el-button>
      <el-button type="success" icon="el-icon-check" @click="handleCreate" v-preventReClick>保存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { mapState } from 'vuex';
import { createInquiries } from '@/api/inquiry'
import contacts from '@/components/Autocomplete/contacts'
import products from '@/components/Autocomplete/products'

export default {
  name: 'inquiry',
  props: {
    showFlag: {
      type: Boolean
    }
  },
  components: { contacts, products },
  computed: {
    ...mapState(['user/contactsInfo', 'user/productsInfo']),
    contactsInfo() {
      return this.$store.state.user.contactsInfo;
    },
    productsInfo() {
      return this.$store.state.user.productsInfo;
    },
  },
  watch: {
    showFlag(newVal, oldVal) {
      newVal ? this.showComponent = true : this.showComponent = false;
      this.dialogVisible = newVal
    }
  },
  data() {
    return {
      source: null, //询盘来源
      note: null,
      showComponent: true,
      userId: null,
      id: null,
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
      inquiry_details: [
        { "edit": true, "product_id": null, "cas": null, "package": null, "unit": null, "purity": null }
      ],
      rules2: {
        userId: [{ required: true, message: '客户不能为空', trigger: 'blur' }],
        cas: [{ required: true, message: 'CAS号不能为空', trigger: 'blur' }],
        package: [{ required: true, message: '包装不能为空', trigger: 'blur' }],
        unit: [{ required: true, message: '单位不能为空', trigger: 'blur' }],
        purity: [{ required: true, message: '纯度不能为空', trigger: 'blur' }],
        product_id: [{ required: true, message: '化学品id不能为空', trigger: 'blur' }]
      },
    }
  },
  mounted() {},
  methods: {
    handleAddQuotation(val) {
      // 添加询盘报价
      let that = this;
      // if (that.inquiry_details.length < 2) {
      //   that.inquiry_details.push({ "edit": true, "product_id": null, "cas": null, "package": null, "unit": null, "purity": null })
      // } else {
      //   this.$message({
      //     type: 'info',
      //     message: '最多添加2条询盘'
      //   });
      // }
      that.inquiry_details.push({ "edit": true, "product_id": null, "cas": null, "package": null, "unit": null, "purity": null })
    },
    // 刪除询盘报价
    handleDeleQuotation(row) {
      //只能删除未提交的报价
      this.$confirm('此操作将删除该行, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        this.inquiry_details.splice(row.$index, 1)
        this.$store.commit("user/SET_PRODUCTS_INFO", this.$store.state.user.productsInfo.splice(row.$index, 1));

      }).catch(action => {
        if (action === 'cancel') {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        }
      });
    },
    resetTemp() {
      this.$store.commit("user/SET_CUSTOMER_INFO", null);
      this.$store.commit("user/SET_CHEMICALS_INFO", null);
      this.inquiry_details = [
        { "edit": true, "product_id": null, "cas": null, "package": null, "unit": null, "purity": null }
      ];
      this.source = null;
    },
    onClose() {
      this.resetTemp();
      this.showComponent = false;
      this.$store.commit("user/SET_PRODUCTS_INFO", '');
      this.$emit('closeChildDialog')
    },
    handleCreate() {
      let that = this;
      // if (!that.contactsInfo) {
      //   that.$notify({
      //     title: '提示信息',
      //     message: '请输入公司联系人，并在下拉菜单中选中！',
      //     type: 'error',
      //     duration: 4000
      //   })
      //   return
      // }
      if (!that.productsInfo) {
        that.$notify({
          title: '提示信息',
          message: '请输入询盘商品信息！',
          type: 'error',
          duration: 4000
        })
        return
      } else {
        that.productsInfo.forEach(function(item, i) {
          that.inquiry_details[i].product_id = item.id;
          that.inquiry_details[i].cas = item.cas;
        });
      }
      if (!that.inquiry_details[0].package) {
        that.$notify({
          title: '提示信息',
          message: '请输入询盘商品规格！',
          type: 'error',
          duration: 3000
        })
        return
      }
      if (!that.inquiry_details[0].unit) {
        that.$notify({
          title: '提示信息',
          message: '请输入询盘商品单位！',
          type: 'error',
          duration: 3000
        })
        return
      }
      if (!that.inquiry_details[0].purity) {
        that.$notify({
          title: '提示信息',
          message: '请输入询盘商品纯度！',
          type: 'error',
          duration: 3000
        })
        return
      }
      let tem = {
        'customer_id': that.contactsInfo ? that.contactsInfo.id : '',
        'product_id': that.inquiry_details[0].product_id,
        'package': that.inquiry_details[0].package + that.unitList[that.inquiry_details[0].unit-1].label,
        'purity': that.inquiry_details[0].purity,
        'note': that.note,
        'inquiry_details': that.inquiry_details
      }
      createInquiries(tem).then(response => {
        if (response.code == 0) {
          that.$message({
            message: '创建成功！',
            type: 'success'
          });
          that.resetTemp();
          that.onClose();
        }
      })
    }
  }
}

</script>
<style lang="scss">
.el-input-number {
  width: 99% !important
}

.el-input-number--small .el-input-number__increase,
.el-input-number--small .el-input-number__decrease {
  display: none
}

.el-input-number--small .el-input__inner {
  padding: 0
}

</style>
