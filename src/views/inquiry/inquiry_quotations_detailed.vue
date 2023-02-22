<template>
  <div class="app-container">
    <el-row>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>询盘订单详情</span>
        </div>
        <div style="margin-bottom:50px;">
          <!-- 订单详情 -->
          <el-form :model="list" class="demo-form-inline" label-width="100px">
            <el-row :gutter="20">
              <el-col :span="6" :xs="24">
                <el-form-item label="询盘订单id">
                  <el-input :disabled="true" v-model="list.id" />
                </el-form-item>
              </el-col>
              <el-col :span="6" :xs="24">
                <el-form-item label="询盘订单号">
                  <el-input :disabled="true" v-model="list.inquiry_no" />
                </el-form-item>
              </el-col>
              <el-col :span="6" :xs="24">
                <el-form-item label="公司名称">
                  <el-input :disabled="true" v-model="list.company_name" />
                </el-form-item>
              </el-col>
              <el-col :span="6" :xs="24">
                <el-form-item label="联系人邮箱">
                  <el-input :disabled="true" v-model="list.email" />
                </el-form-item>
              </el-col>
              <el-col :span="6" :xs="24" v-if="list.first_name">
                <el-form-item label="first_name">
                  <el-input :disabled="true" v-model="list.first_name" />
                </el-form-item>
              </el-col>
              <el-col :span="6" :xs="24" v-if="list.last_name">
                <el-form-item label="last_name">
                  <el-input :disabled="true" v-model="list.last_name" />
                </el-form-item>
              </el-col>
              <el-col :span="6" :xs="24">
                <el-form-item label="联系人手机号">
                  <el-input :disabled="true" v-model="list.phone" />
                </el-form-item>
              </el-col>
              <el-col :span="12" :xs="24">
                <el-form-item label="备注">
                  <el-input :disabled="true" v-model="list.note" type="textarea" show-word-limit />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div class="ovh">
            <div class="ovh fr">
             <!--  <template>
                <el-button type="warning" @click="handleCreateSalesOrder()" v-preventReClick v-if="list.status == 1">生成销售订单</el-button>
              </template> -->
              </el-button-group>
            </div>
          </div>
          <!-- 商品信息 -->
          <div class="card">
            <el-row :gutter="20">
              <el-col :span="10" :xs="24">
                <div class="item"><label class="name">询问产品名:</label>{{ list.product_name }}</div>
              </el-col>
              <el-col :span="4" :xs="24">
                <div class="item"><label class="name">询问CAS号:</label>{{ list.cas }}</div>
              </el-col>
              <el-col :span="4" :xs="24">
                <div class="item"><label class="name">CAS号:</label>{{ list.cas }}</div>
              </el-col>
              <el-col :span="3" :xs="24">
                <div class="item"><label class="name">纯度:</label>{{ list.purity }}</div>
              </el-col>
              <el-col :span="3" :xs="24">
                <div class="item"><label class="name">数量:</label>{{ list.package_str }}</div>
              </el-col>
              <el-col :span="10" :xs="24">
                <div class="item"><label class="name">备注:</label>{{ list.note }}</div>
              </el-col>
              <el-col :span="12" :xs="24" v-if="list.status != 3">
                <div class="item"><label class="name">操作:</label>
                  <el-button type="success" size="mini" @click="getQuotationHistories(list.id)">历史报价</el-button>
                  <el-button type="primary" size="mini" @click="handleCreate(item,list.id)">添加报价/修改报价</el-button>
                </div>
              </el-col>
            </el-row>
            <!-- 报价信息 -->
            <el-table :data="list.inquiry_quotations" type="index" style="width: 100%;margin-top: 10px"  @selection-change="handleSelectionChange($event,index)" border>
              <el-table-column type="selection" width="39" />
              <!--  <el-table-column align="center" label="询盘报价id">
                <template slot-scope="scope">
                  <span>{{ scope.row.inquiry_quotation_id }}</span>
                </template>
              </el-table-column> -->
              <el-table-column align="center" label="供应商">
                <template slot-scope="scope">
                  <span>{{ scope.row.vendor_company_name }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="价格">
                <template slot-scope="scope">
                  {{ scope.row.price }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="规格">
                <template slot-scope="scope">
                  {{ scope.row.package }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="纯度">
                <template slot-scope="scope">
                  {{ scope.row.purity }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="备注">
                <template slot-scope="scope">
                  {{ scope.row.note }}
                </template>
              </el-table-column>
              <!-- <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="updateQuotation(scope,list.id)">修改报价</el-button>
                </template>
              </el-table-column> -->
            </el-table>
          </div>
        </div>
        <el-drawer :visible.sync="drawer" :with-header="false" :append-to-body="true" :modal-append-to-body="false" size="70%">
          <el-tabs type="border-card">
            <el-tab-pane label="历史报价">
              <el-table :data="quotationHistories" style="width: 100%" element-loading-text="拼命加载中" border fit highlight-current-row stripe class="us cp" @row-dblclick="handleQuotationHistories">
                <template slot="empty">没有历史报价</template>
                <el-table-column align="center" prop="vendor_company_name" label="供应商名称">
                </el-table-column>
                <el-table-column align="center" prop="purity" label="纯度" width="80">
                </el-table-column>
                <el-table-column align="center" prop="package" label="规格" width="80">
                </el-table-column>
                <el-table-column align="center" prop="price" label="总价" width="100">
                </el-table-column>
                <el-table-column align="center" prop="stock" label="备货周期" width="50">
                </el-table-column>
                <el-table-column align="center" prop="created_at" label="报价时间" width="100">
                </el-table-column>
                <el-table-column align="center" prop="note" label="备注" width="200">
                </el-table-column>
              </el-table>
              <pagination v-if="total2>0" :total="total2" :page.sync="listQuery2.page" :limit.sync="listQuery2.limit" @pagination="getQuotationHistories()" />
            </el-tab-pane>
          </el-tabs>
        </el-drawer>
        <!-- 新增修改完善报价 -->
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="80%" :close-on-click-modal="false" @close="handleClose">
          <el-button class="filter-item" style="margin-left: 10px; margin-bottom: 20px" type="warning" icon="el-icon-circle-plus-outline" @click="handleAddQuotation">添加报价行</el-button>
          <!-- 报价信息 -->
          <el-table :data="quotationList" style="width: 100%;" border>
            <el-table-column align="center" label="供应商">
              <template slot-scope="scope">
                <template v-if=" scope.row.edit">
                  <el-input v-model="scope.row.vendor_company_name" class="edit-input" size="small" placeholder="请输入供应商" />
                </template>
                <span v-else>{{ scope.row.vendor_company_name }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="价格" width="125px">
              <template slot-scope="scope">
                <template v-if=" scope.row.edit">
                  <el-input v-model="scope.row.price" class="edit-input" size="small" placeholder="请输入价格" />
                </template>
                <span v-else>{{ scope.row.price }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="货币类型" width="125px">
              <template slot-scope="scope">
                <template v-if="scope.row.edit">
                  <el-select v-model="scope.row.currency_type" placeholder="币种" style="width: 100%;">
                    <el-option v-for="item in company_currency_type" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </template>
                <span v-else>{{ scope.row.currency_type }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="数量" width="125px">
              <template slot-scope="scope">
                <template v-if="scope.row.edit">
                  <el-input v-model="scope.row.package" class="edit-input" size="small" placeholder="请输入数量" />
                </template>
                <span v-else>{{ scope.row.package }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="纯度" width="125px">
              <template slot-scope="scope">
                <template v-if=" scope.row.edit">
                  <el-input v-model="scope.row.purity" class="edit-input" size="small" placeholder="请输入纯度" />
                </template>
                <span v-else>{{ scope.row.purity }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="货期" width="125px">
              <template slot-scope="scope">
                <template v-if=" scope.row.edit">
                  <el-input v-model="scope.row.stock" class="edit-input" size="small" placeholder="请输入货期" />
                </template>
                <span v-else>{{ scope.row.stock }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="备注">
              <template slot-scope="scope">
                <template v-if=" scope.row.edit">
                  <el-input v-model="scope.row.note" class="edit-input" size="small" placeholder="请输入备注" />
                </template>
                <span v-else>{{ scope.row.note }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button type="success" size="mini" icon="el-icon-circle-check-outline" @click="handleUpdateQuotation(scope,list.inquiry_id)" v-if="scope.row.edit">保存报价</el-button>
                <el-button type="primary" size="mini" @click="scope.row.edit=!scope.row.edit" v-else>修改报价</el-button>
                <el-button type="danger" size="mini" @click="handleDeleQuotation(scope)" v-if="scope.row.del">删除报价</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">
              取消
            </el-button>
          </div>
        </el-dialog>
        <!-- 订单生成 -->
        <el-dialog title="生成销售订单" :visible.sync="dialogFormVisible2" width="60%" :close-on-click-modal="false" @close="handleClose">
          <el-form  :model="temp1" label-position="right" label-width="110px">
            <el-row :gutter="20">
              <el-col :xs="24" :span="12">
                <el-form-item label="开票类型" prop="delivery_mobile">
                  <el-select v-model="temp1.invoice_type" placeholder="开票类型" style="width: 100%;" @change="invoiceTypeChange">
                    <el-option v-for="item in invoiceType" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :span="12">
                <el-form-item label="付款方式" prop="delivery_mobile">
                  <el-select v-model="temp1.payment_type" placeholder="付款方式" style="width: 100%;">
                    <el-option v-for="item in paymentType" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :span="12">
                <el-form-item label="发票寄送地址" prop="invoice_address">
                  <el-input type="textarea" :rows="2" placeholder="请输入收票地址信息" v-model="temp1.invoice_address">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :span="12" v-if="address==1">
                <el-form-item label="收货地址" prop="ship_address">
                <el-input type="textarea" :rows="2" placeholder="请输入收货地址" v-model="temp1.ship_address">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :span="24">
                <el-form-item label="备注">
                  <el-input v-model="temp1.note" type="textarea" show-word-limit />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible2 = false">
              取消
            </el-button>
            <el-button type="primary" @click="createSalesOrder()">
              确认
            </el-button>
          </div>
        </el-dialog>
      </el-card>
    </el-row>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { inquiryQuotations, quotationsDetails, addQuotation, updateQuotation, createCustomerOrder, cancelOrder, quotationHistories } from '@/api/inquiry'
import companies from '@/components/Autocomplete/companies'
import contacts from '@/components/Autocomplete/contacts'
import Pagination from '@/components/Pagination'
import { isInArray, parseTime } from '@/utils'

export default {
  name: 'Profile',
  components: { companies, Pagination, contacts },
  props: {
    id: {
      default: false,
      type: String
    }
  },
  data() {
    return {
      props: {
        lazy: true,
        lazyLoad: this.lazyLoad
      },
      address: '1',
      note: null, //采购询价 备注
      pageStatus: null, //当前页面状态，add新增，edit编辑
      quotationHistories: null, //历史报价列表
      quotationDetailsInfo: null, //报价详情信息
      inquiry_detail_quotation_ids: [], //选中报价详情
      companiesStatus: true, //是否可以修改供应商id
      company_currency_type: [{
        "id": 1,
        "name": 'CNY'
      }, {
        "id": 2,
        "name": 'USD'
      }, {
        "id": 3,
        "name": 'INR'
      }, {
        "id": 4,
        "name": 'EUR'
      }],
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
      paymentType: [{
        "value": 0,
        "label": '款到发货'
      }, {
        "value": 1,
        "label": '预付30%货款'
      }, {
        "value": 2,
        "label": '预付50%货款'
      }],
      invoiceType: [{
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
      quotationQuery: {
        inquiry_detail_quotation_id: null,
        price: null,
        package: null,
        unit: null,
        purity: null,
        note: null
      },
      list: {
        id: null,
        "inquiry_source": null,
        "created_at": null,
        "level": null,
        "company_name_cn": null,
        "employee_name": null,
        "contact_name": null,
        "contact_email": null,
        "company_trade_type": null,
        "company_country": null,
        "company_currency_type": null,
        "company_note": null,
        "inquiry_details": null
      },
      groupList: null,
      listLoading: true,
      total: 0,
      order: {
        user: '',
        importance: 1,
        rating: 4
      },
      listQuery: {
        page: 1,
        limit: 20
      },
      total2: 0,
      listQuery2: {
        page: 1,
        limit: 10
      },
      quotationList: '', //报价详情
      temp: {
        leader_id: '',
        name: ''
      }, //报价详情
      temp1: {
        inquiry_quotation_ids: '',
        payment_type: 0,
        invoice_type: 1,
        invoice_address: '',
        ship_address: '',
        note: ''
      },
      temp2: {
        id: null,
        name: null,
        mobile: null,
        province: null,
        city: null,
        district: null,
        address: null,
        is_default: 1
      },
      temp3: {
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
        category: null,
        delivery_email: null,
        fax: null,
        is_default: 0,
        active: 0,
        page: 1,
        limit: 100
      },
      textMap: {
        update: '完善报价',
        create: '添加报价'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      dialogFormVisible2: false,
      downloadLoading: false,
      drawer: false
    }
  },
  watch: {
    companiesInfo(newVal, oldVal) {
      this.vendor_id = null;
      this.contactsList = null;
    }
  },
  computed: {
    ...mapState(['user/contactsInfo', 'user/companiesInfo']),
    companiesInfo() {
      return this.$store.state.user.companiesInfo;
    },
    contactsInfo() {
      return this.$store.state.user.contactsInfo;
    }
  },
  created() {
    let that = this;
    if (that.$route.query.id) {
      that.id = that.$route.query.id;
      that.listQuery.id = that.$route.query.id;
      that.getList()
      that.pageStatus = 'edit';
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      inquiryQuotations(this.listQuery).then(response => {
        let data = response.data;
        this.list = data
        this.listLoading = false
      })
    },
    resetTemp() {
      this.listQuery = {
        page: 1,
        limit: 20
      }
      this.temp = {
        leader_id: '',
        name: ''
      }
    },
    // 关闭弹窗回调
    handleClose() {
      this.refresh();
    },
    refresh() {
      let that = this;
      that.resetTemp()
      that.id = that.$route.query.id;
      that.listQuery.id = that.$route.query.id;
      that.listQuery.page = 1
      that.getList()
    },
    // 选中历史报价
    async handleQuotationHistories(row) {
      let that = this;
    },
    handleCreate(row, id) {
      let that = this;
      that.resetTemp()
      that.dialogStatus = 'create'
      that.dialogFormVisible = true
      let tem = {
        'id': that.id
      }
      quotationsDetails(tem).then(response => {
        let data = response.data.page_datas;
        for (const v of data) {
          v.edit = 'false'
        }
        that.quotationList = data
        that.dialogStatus = 'update'
        that.dialogFormVisible = true
      })
    },
    // 历史报价列表
    getQuotationHistories(id) {
      const that = this
      that.resetTemp();
      let tem = {
        id: that.id
      }
      quotationHistories(tem).then(response => {
        if (response.code == 0) {
          that.quotationHistories = response.data.page_datas;
          that.total2 = response.data.total_count
          that.drawer = true
        }
      })
    },
    handleAddQuotation(val) {
      // 添加询盘报价
      let that = this;
      that.quotationList.push({
        'add': true,
        'edit': true,
        'del': true,
        "id": null,
        'vendor_company_name': null,
        'price': null,
        'currency_type': null,
        'package': null,
        'purity': null,
        'stock': null,
        'note': null,
      })
    },
    handleUpdateQuotation(row, id) {
      //判断是新增还是修改
      if (row.row.add) {
        if (!row.row.vendor_company_name) {
          this.$notify({
            title: '提示信息',
            message: '请输入供应商名称！',
            type: 'error',
            duration: 3000
          })
          return
        } else if (!row.row.price) {
          this.$notify({
            title: '提示信息',
            message: '请输入价格！',
            type: 'error',
            duration: 3000
          })
          return
        } else if (!row.row.currency_type) {
          this.$notify({
            title: '提示信息',
            message: '请输入货币类型！',
            type: 'error',
            duration: 3000
          })
          return
        } else if (!row.row.package) {
          this.$notify({
            title: '提示信息',
            message: '请输入包装数量！',
            type: 'error',
            duration: 3000
          })
          return
        } else if (!row.row.purity) {
          this.$notify({
            title: '提示信息',
            message: '请输入纯度！',
            type: 'error',
            duration: 3000
          })
          return
        }
        // 添加询盘报价
        let tem = {
          'vendor_company_name': row.row.vendor_company_name || null,
          'price': row.row.price || null,
          'package': row.row.package || null,
          'currency_type': row.row.currency_type || null,
          'purity': row.row.purity || null,
          "stock": row.row.stock || null,
          'note': row.row.note || null
        }
        addQuotation(tem, this.id).then(response => {
          let data = response.data;
          data.edit = false;
          row.row.edit = !row.row.edit;
          row.row.del = false;
          // row.row = data;
          for (const v of this.quotationList.quotation_details) {
            //如果询报价详情id为空
            if (v.inquiry_detail_quotation_id == data.inquiry_detail_quotation_id || !v.inquiry_detail_quotation_id) {
              const index = this.quotationList.quotation_details.indexOf(v)
              this.quotationList.quotation_details.splice(index, 1, data)
              break
            }
          }
          this.$message({
            message: '新增成功！',
            type: 'success'
          });
        })
      } else {
        // 修改询盘报价
        let tem = {
          'inquiry_quotation_id': row.row.inquiry_quotation_id,
          'vendor_company_name': row.row.vendor_company_name,
          'price': row.row.price,
          'currency_type': row.row.currency_type,
          'package': row.row.package,
          'purity': row.row.purity,
          'stock': row.row.stock,
          'note': row.row.note,
          'edit': false,
        }
        updateQuotation(tem, id).then(response => {
          let data = response.data;
          data.edit = false;
          row.row.edit = !row.row.edit;
          this.$message({
            message: '修改成功！',
            type: 'success'
          });
        })
      }
    },
    handleSelectionChange(rows, index) {
      let tem2 = rows;
      let spanArr = [];
      //提取数组
      tem2.forEach((item, index) => {
        spanArr.push(item.inquiry_quotation_id)
      });
      this.inquiry_detail_quotation_ids = spanArr
    },
    handleCurrentChange(row, column, e, singleTable) {
      let that = this;
      let tem = singleTable
      //点击选中
      that.$nextTick().then(function() {
        that.$refs[tem][0].toggleRowSelection(row);
      })
    },
    // 开票类型改变，获取对应收票地址信息
    invoiceTypeChange(row) {
      let tem = [];
      this.temInvoicesList.forEach((item, index) => {
        if (row == item.category) {
          tem.push(item)
        }
      })
      this.invoicesList = tem;
      tem.length > 0 ? this.temp1.invoice_name = tem[0].company_name : this.temp1.invoice_name = '';
      tem.length > 0 ? this.temp1.invoice_id = tem[0].id : this.temp1.invoice_id = '';
    },
    //打开销售订单弹窗
    handleCreateSalesOrder() {
      const that = this
      if (that.inquiry_detail_quotation_ids.length < 1) {
        that.$message.error('请勾选报价明细！');
        return
      }
      that.dialogFormVisible2 = true
      let tem = {
        page: 1,
        limit: 100
      }
      tem.id = that.list.company_id;
    },
    //生成销售订单
    createSalesOrder() {
      // // 开票类型为不开票，收票地址信息为空
      if (this.temp1.invoice_type != 4 && !this.temp1.invoice_address) {
        this.$message.error('请选择收票地址信息');
        return;
      }
      //生成销售订单
      if (this.inquiry_detail_quotation_ids) {
        this.temp1.inquiry_quotation_ids = this.inquiry_detail_quotation_ids;
      }
          createCustomerOrder(this.temp1).then(response => {
            this.dialogFormVisible2 = false
            this.$message({
              message: '新增成功！',
              type: 'success'
            });
            //跳转到销售订单详情
            this.$router.push({ path: '/customer_order/customer_orders', query: {} });
          })
    },
  }
}

</script>
<style lang="scss" scoped>
.card {
  margin-top: 20px;
  margin-bottom: 40px;
  border-radius: 4px;
  border: 1px solid #e6ebf5;
  padding: 20px;

  .item {
    color: #454545;
    word-break: break-all;
  }

  .name {
    display: inline-block;
    width: 90px;
    text-align: right;
    font-size: 14px;
    // color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
  }

  .el-button--mini {
    padding: 4px 8px;
  }
}

</style>
