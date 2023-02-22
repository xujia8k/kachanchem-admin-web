<template>
  <div class="app-container">
    <el-row>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>销售订单详细</span>
          <el-tag size="mini" type="warning" v-if="list.payment_status == 0">未付款</el-tag>
          <el-tag size="mini" type="warning" v-if="list.payment_status == 1">完全付款</el-tag>
          <el-tag size="mini" type="primary" v-if="list.payment_status == 2">部分付款</el-tag>
          <el-tag size="mini" type="warning" v-if="list.invoice_status == 0">待开票</el-tag>
          <el-tag size="mini" type="primary" v-if="list.invoice_status == 1">部分开票</el-tag>
          <el-tag size="mini" type="success" v-if="list.invoice_status == 2">完全开票</el-tag>
          <el-tag size="mini" type="success" v-if="list.invoice_status == 3">不开票</el-tag>
          <el-tag size="mini" type="danger" v-if="list.order_status == 5">取消</el-tag>
          <div class="ovh fr" v-if="list.order_status != 5">
            <el-button-group style="margin-left: 50px" class="fr">
              <el-button type="success" @click="handleCreateFinance()" v-if="list.payment_status != 1">收款</el-button>
              <el-button type="success" @click="handleFinanceReceiptDetails()">收款审核记录</el-button>
              <el-button type="danger" @click="updatePurchase(2)" v-if="list.status == 1">销售结束</el-button>
              <el-button type="warning" @click="updatePurchase(1)" v-if="list.status == 2">取消销售结束</el-button>
            </el-button-group>
          </div>
        </div>
        <div style="margin-bottom:50px;">
          <!-- 订单详情 -->
          <el-form :model="list" class="demo-form-inline" label-width="100px">
            <el-row :gutter="20">
              <el-col :span="6" :xs="24">
                <el-form-item label="销售订单ID">
                  <el-input :disabled="true" v-model="list.id" />
                </el-form-item>
              </el-col>
              <el-col :span="6" :xs="24">
                <el-form-item label="销售订单号">
                  <el-input :disabled="true" v-model="list.order_no" />
                </el-form-item>
              </el-col>
              <el-col :span="6" :xs="24">
                <el-form-item label="客户">
                  <el-input :disabled="true" v-model="list.customer_name" />
                </el-form-item>
              </el-col>
              <el-col :span="6" :xs="24">
                <el-form-item label="联系人名称">
                  <el-input :disabled="true" v-model="list.contact_name" />
                </el-form-item>
              </el-col>
              <el-col :span="6" :xs="24">
                <el-form-item label="订单总价价格">
                  <el-input :disabled="true" v-model="list.amount" />
                </el-form-item>
              </el-col>
              <el-col :span="6" :xs="24">
                <el-form-item label="实际收款金额">
                  <el-input :disabled="true" v-model="list.received_amount" />
                </el-form-item>
              </el-col>
              <el-col :span="6" :xs="24">
                <el-form-item label="币种">
                  <el-input :disabled="true" v-model="list.currency_type" />
                </el-form-item>
              </el-col>
              <el-col :span="6" :xs="24">
                <el-form-item label="业务员名称">
                  <el-input :disabled="true" v-model="list.employee_name" />
                </el-form-item>
              </el-col>
              <el-col :span="6" :xs="24">
                <el-form-item label="下单日期">
                  <el-input :disabled="true" v-model="list.created_at" />
                </el-form-item>
              </el-col>
              <el-col :span="6" :xs="24">
                <el-form-item label="付款方式">
                  <el-input :disabled="true" v-model="list.payment_type" />
                </el-form-item>
              </el-col>
              <!-- <el-col :span="6" :xs="24">
                <el-form-item label="支付状态">
                  <el-input :disabled="true" v-model="list.payment_status" />
                </el-form-item>
              </el-col> -->
              <el-col :span="12" :xs="24">
                <el-form-item label="收货信息">
                  <el-input :disabled="true" v-model="list.ship_address" type="textarea" show-word-limit />
                </el-form-item>
              </el-col>
              <el-col :span="12" :xs="24">
                <el-form-item label="备注">
                  <el-input :disabled="true" v-model="list.note" type="textarea" show-word-limit />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div class="clearfix">
            <el-button-group class="fl">
              <el-button type="primary" icon="el-icon-printer" @click="print(list)">打印</el-button>
              <el-button type="primary" icon="el-icon-files" @click="showFilesListsDialog(list)">附件</el-button>
              <el-badge is-dot v-if="list.has_logi_info">
                <el-button type="primary" @click="showLogisticsDialog(list)">快递<i class="el-icon-upload" /></el-button>
              </el-badge>
              <el-badge v-else>
                <el-button class="item" type="primary" @click="showLogisticsDialog(list)">快递<i class="el-icon-upload" /></el-button>
              </el-badge>
            </el-button-group>
          </div>
          <!-- 商品信息 -->
          <el-table :data="list.detail_info" style="width: 100%;margin-top:30px;" border>
            <el-table-column align="center" label="Cas No.">
              <template slot-scope="scope">
                {{ scope.row.cas }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="中文名称">
              <template slot-scope="scope">
                {{ scope.row.chemical_name_cn }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="英文名称">
              <template slot-scope="scope">
                {{ scope.row.chemical_name }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="数量规格">
              <template slot-scope="scope">
                {{ scope.row.package_str}}
              </template>
            </el-table-column>
            <el-table-column align="center" label="纯度">
              <template slot-scope="scope">
                {{ scope.row.purity }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="产品编号">
              <template slot-scope="scope">
                {{ scope.row.product_no }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="{row}">
                <el-button type="success" icon="el-icon-files" @click="showFilesDialog(row)">绑定COA</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </el-row>
    <el-dialog title="创建收款单明细" :visible.sync="dialogFormVisible1" width="50%" :close-on-click-modal="false">
      <el-form ref="dataForm" label-position="right" label-width="110px" style="margin-left:20px;" :rules="rules1" :model="temp3">
        <el-form-item label="收款账户" prop="finance_account_id">
          <!-- <accounts :state="temp3.finance_account_id" style="width:100%" /> -->
          <el-select v-model="temp3.finance_account_id" placeholder="收款账户" style="width: 100%;" prop="finance_account_id">
            <el-option v-for="item in accountsList" :key="item.id" :label="item.account_name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="收款金额" prop="amount">
          <el-input v-model="temp3.amount" />
        </el-form-item>
        <el-form-item label="附件" prop="attachment_id">
          <!-- <el-input v-model="temp3.attachment_id" /> -->
          <Upload v-model="temp3.attachment_id" :id="temp3.attachment_id" :value="temp3.attachment_id" />
        </el-form-item>
        <el-row v-for="item in temp3.detail_info">
          <el-col :xs="12" :sm="12" :lg="12">
            <el-form-item label="真实品名开发票" prop="is_real_name_invoice">
              <el-radio-group v-model="item.is_real_name_invoice" @change="handleChanges()">
                <el-radio label="0">
                  否
                </el-radio>
                <el-radio label="1">
                  是
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="12">
            <el-form-item label="开票品名" prop="invoice_chemical_name">
              <el-input v-model="item.invoice_chemical_name" @input="handleChanges()" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="note">
          <el-input v-model="temp3.note" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelCreateFinance()">
          取消
        </el-button>
        <el-button type="primary" @click="createFinance()">
          确认
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="历史收款记录" :rules="rules" :model="temp3" :visible.sync="dialogFormVisible2" width="50%">
      <el-table :data="financeReceiptList" style="width: 100%;margin-top:30px;" border>
        <el-table-column align="center" label="收款单明细id">
          <template slot-scope="scope">
            {{ scope.row.finance_receipt_detail_id }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="审核状态">
          <template slot-scope="scope">
            <span class="c-info" v-if="scope.row.approve_status == 0">{{ scope.row.approve_status | approveStatusFilter3}}</span>
            <span class="c-green" v-if="scope.row.approve_status == 1">{{ scope.row.approve_status | approveStatusFilter3}}</span>
            <span class="c-red" v-if="scope.row.approve_status == 2">{{ scope.row.approve_status | approveStatusFilter3}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="收款凭证">
          <template slot-scope="scope">
            <el-image-viewer v-if="showViewer" :on-close="closeViewer" :url-list="srcList" z-index="3000" />
            <img :src="scope.row.img_url" @click="onPreview(scope.row.img_url)" style="display: block;max-width:110px;height:auto;margin: 0 auto">
          </template>
        </el-table-column>
        <el-table-column align="center" label="审核备注">
          <template slot-scope="scope">
            {{ scope.row.approve_note }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="收款单明细金额">
          <template slot-scope="scope">
            {{ scope.row.amount }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="收款账号号码">
          <template slot-scope="scope">
            {{ scope.row.account_no }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="备注">
          <template slot-scope="scope">
            {{ scope.row.note}}
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">
          取消
        </el-button>
      </div>
    </el-dialog>
    <!-- 物流信息 -->
    <Logistics :showFlag="showFlag" @closeChildDialog="closeChildDialog" :expressData="expressData" />
    <!-- 打印信息 -->
    <Concordat :showFlag="showFlag2" @closeChildDialog="closeChildDialog" :printData="printData" />
    <!-- 附件列表信息 -->
    <PublicAnnex :showFlag="showFlag4" @closeChildDialog="closeChildDialog" :annexData="annexData" />
    <el-drawer title="我是标题" :visible.sync="showFlag3" :with-header="false" :before-close="closeChildDialog" size="50%">
      <div class="print_template">
        <p class="desc">文件模板</p>
        <el-card shadow="hover" v-for="item in templateSimple" class="card">
          <div class="ovh">
            <div class="fl">
              <p style="margin: 0;">{{ item.name }}</p>
              <p class="remark">上传人:{{ item.up_name || '无'}}</p>
              <p class="remark" v-if="item.note">描述:{{ item.note}}</p>
            </div>
            <div class="fr">
              <!-- <el-link :href="handleRouter(item)" target="_blank" class="el-button el-button--success el-button--mini" style="color: #fff; line-height: 14px;">使用模板</el-link> -->
              <!-- <el-button plain type="primary" size="mini" icon="el-icon-refresh" @click="refresh">打印</el-button> -->
              <el-button plain type="success" size="mini" icon="el-icon-files" @click="setCopyAttachment(item)">绑定模板</el-button>
            </div>
          </div>
        </el-card>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { fetchDetails, getLogisticsInfo, deleteLogisticsInfo, createCustomerLogisticsInfo, createFinanceReceiptDetail, financeReceiptDetails } from '@/api/customer'
import { fetchProvinces, queryExpress, getAttachmentList, copyAttachment } from '@/api/commons'
import accounts from '@/components/Autocomplete/accounts'
import Upload from '@/components/Upload/SingleImage'
import Logistics from '@/components/Logistics'
import { financeAccounts } from '@/api/finance' //收款账户信息
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
import Concordat from "@/components/Print/concordat";
import PublicAnnex from "@/components/Annex/PublicAnnex";

export default {
  name: 'Profile',
  components: { accounts, Upload, Logistics, ElImageViewer, Concordat, PublicAnnex },
  data() {
    var validate = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('收款金额不能为空'));
      } else if (value > (this.list.amount - this.list.received_amount)) {
        callback(new Error('收款金额不能大于订单未收款金额!'));
      } else {
        callback();
      }
    };
    return {
      srcList: [],
      showViewer: false,
      accountsList: null, //收款地址列表
      showFlag: false, //是否显示物流信息
      expressData: null, //显示物流信息
      financeReceiptList: null, //历史审核记录
      showFlag2: false, //是否显示合同信息
      showFlag3: false, //是否显示coa模板信息
      showFlag4: false, //是否显示附件列表信息
      printData: null, //打印信息
      annexData: null, //附件信息
      temp3: {
        finance_account_id: null,
        amount: null,
        attachment_id: null,
        note: null,
        detail_info: []
      }, //存放创建收款单明细
      activities: null,
      id: null, //采购订单id
      list: {
        id: null,
        chemical_name: null,
        package_str: null,
        cas: null,
        purity: null,
        note: null,
        purchase_name: null,
        status: null,
        has_quotation: null,
      },
      listLoading: true,
      total: 0,
      temp: {
        leader_id: '',
        name: ''
      },
      dialogFormVisible1: false,
      dialogFormVisible2: false,
      downloadLoading: false,
      rules1: {
        amount: [{ required: true, message: '收款金额不能为空', trigger: 'blur' }],
        finance_account_id: [{ required: true, message: '收款账户不能为空', trigger: 'blur' }]
      },
      rules: {
        name: [{ required: true, message: '小组名称不能为空', trigger: 'blur' }],
        leader_id: [{ required: true, message: '组长id不能为空', trigger: 'blur' }]
      },
      templateSimple: null
    }
  },
  watch: {
    accountsInfo(newVal, oldVal) {}
  },
  computed: {
    ...mapState(['user/accountsInfo']),
    accountsInfo() {
      return this.$store.state.user.accountsInfo;
    },
    payment: {
      get: function() {
        return this.list.payment_type
      },
      set: function(value) {
        const statusMap = ['款到发货', '预付30%货款', '预付50%货款']
        console.log("statusMap[value]", statusMap[value])
        this.this.list.payment_type = statusMap[value]
      },
    }
  },
  created() {
    let that = this;
    if (that.$route.query.id) {
      that.id = that.$route.query.id;
      that.getList()
    } else {
      // that.pageStatus = 'add';
    }
  },
  methods: {
    getList() {
      fetchDetails(this.id).then(response => {
        let data = response.data
        const statusMap1 = ['款到发货', '预付30%货款', '预付50%货款']
        const statusMap2 = ['CNY', 'USD', 'INR', 'EUR']
        data.payment_type = statusMap1[data.payment_type]
        data.currency_type = statusMap2[data.currency_type - 1]
        this.list = response.data
        this.listLoading = false
      })
    },
    resetTemp() {
      this.temp = {
        leader_id: '',
        name: ''
      }
    },
    refresh() {
      let that = this;
      that.resetTemp()
      that.id = that.$route.query.id;
      that.getList()
    },
    handleFinanceReceiptDetails() {
      let tem = {
        id: this.id
      }
      financeReceiptDetails(tem).then(response => {
        this.financeReceiptList = response.data.page_datas
        this.dialogFormVisible2 = true
      })
    },
    handleCreate() {},
    handleSelectionChange(val) {
      // this.multipleSelection = val;
    },
    //更新采购询价状态
    updatePurchase(status) {
      let that = this;
      let tem = {
        status: status
      }
      updateInquiries(that.id, tem).then(response => {
        that.list.status = response.data.status;
      })
    },
    handleCreateFinance() {
      let that = this;
      that.temp3.id = that.list.id
      let list = that.list.detail_info;
      for (var i = 0; i < list.length; i++) {
        that.temp3.detail_info[i] = {
          order_detail_id: list[i].order_detail_id,
          is_real_name_invoice: '1',
          invoice_chemical_name: list[i].chemical_name_cn || list[i].chemical_name,
        }
      }
      let tem = {
        page: 1,
        limit: 100
      }
      //获取收款地址列表
      financeAccounts(tem).then(response => {
        if (response.code == 0) {
          that.accountsList = response.data.page_datas;
        }
      })
      that.dialogFormVisible1 = true
    },
    cancelCreateFinance() {
      this.dialogFormVisible1 = false;
      this.temp3.attachment_id = ''
      this.temp3.finance_account_id = ''
      this.$store.commit("user/SET_ATTACHMENT_Id", '');
    },
    //创建收款单明细
    createFinance() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.temp3.amount > (this.list.amount - this.list.received_amount)) {
            this.$notify({
              title: '提示信息',
              message: '收款金额不能大于订单未收款金额',
              type: 'error',
              duration: 4000
            })
            return
          }
          if (!this.temp3.attachment_id) {
            this.$notify({
              title: '提示信息',
              message: '附件未上传',
              type: 'error',
              duration: 4000
            })
            return
          }
          this.temp3.attachment_id = this.$store.state.user.attachmentId;
          const tempData = Object.assign({}, this.temp3)
          createFinanceReceiptDetail(tempData).then(response => {
            if (response.code == 0) {
              this.$message({
                type: 'success',
                message: '成功创建收款单明细!'
              });
              this.dialogFormVisible1 = false
              this.temp3 = {
                finance_account_id: null,
                amount: null,
                attachment_id: null,
                note: null,
                detail_info: []
              }
            }
            this.temp3.attachment_id = ''
            this.temp3.finance_account_id = ''
            this.$store.commit("user/SET_ATTACHMENT_Id", '');
          })
        }
      });
    },
    //显示快递信息弹窗
    showLogisticsDialog(row) {
      this.expressData = {
        id: row.id,
        has_logi_info: row.has_logi_info,
        entity_type: 'CustomerOrder'
      }
      this.showFlag = true
    },
    //显示附件信息弹窗
    showFilesDialog(row) {
      let tem = {
        attachment_entity_type: 'Product',
        attachment_entity_id: row.product_id
      }
      getAttachmentList(tem).then(response => {
        if (response.code == 0) {
          this.showFlag3 = true
          this.templateSimple = response.data.page_datas
        }
      })
    },
    //关联现有附件
    setCopyAttachment(item) {
      let tem = {
        source_attachment_id: item.id,
        attachment_entity_type: 'CustomerOrder',
        attachment_entity_id: this.list.id
      }
      copyAttachment(tem).then(response => {
        if (response.code == 0) {
          this.$message({
            type: 'success',
            message: '成功关联现有附件!'
          });
          this.showFlag3 = false
        }
      })
    },
    // print(row) {
    //   this.printData = {
    //     entity_type: 'Product',
    //     rid: row.id
    //   }
    //   this.showFlag4 = true
    // },
    print(row) {
      this.printData = {
        entity_type: 'CustomerOrder',
        rid: row.id
      }
      this.showFlag2 = true
    },
    showFilesListsDialog(row) {
      //显示附件列表
      this.annexData = {
        type: 'CustomerOrder',
        id: row.id
      }
      this.showFlag4 = true
    },
    /**
     * 接受子组件调用的关闭弹出框方法
     */
    closeChildDialog() {
      this.showFlag = false
      this.showFlag2 = false
      this.showFlag3 = false
      this.showFlag4 = false
      this.getList()
    },
    // 取值
    handleChanges() {
      this.$forceUpdate();
    },
    onPreview(img) {
      this.srcList = [];
      this.srcList.push(img)
      this.showViewer = true
    },
    closeViewer() {
      this.showViewer = false
    }
  }
}

</script>
<style lang="scss" scoped>
.print_template {
  padding: 20px 30px;

  .card {
    position: relative;
    margin-bottom: 10px;
  }

  .bts {
    position: absolute;
    right: 20px;
  }

  .desc {
    font-size: 16px;
    color: #454545;
  }

  .remark {
    margin: 10px 0 0 0;
    font-size: 12px;
    color: #999;
  }
}

</style>
