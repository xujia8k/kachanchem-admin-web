<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model.trim="listQuery.inquiry_no" placeholder="请输入询盘订单号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model.trim="listQuery.q" placeholder="请输入产品名/CAS号" style="width: 200px;margin-left: 5px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model.trim="listQuery.company_name" placeholder="请输入客户名称" style="width: 200px;margin-left: 5px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <!--  <el-date-picker v-model="date" value-format="yyyy-MM-dd HH:mm:ss" class="filter-item ml10" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" style="width: 250px;margin-left: 5px;"/> -->
      <el-button class="filter-item ml10" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <div class="fr">
        <el-button plain type="success" icon="el-icon-refresh" @click="refresh">
          刷新
        </el-button>
        <el-button plain type="info" @click="handleOrderSettings">
          订单设置
        </el-button>
        <el-button plain type="success" @click="handleSendQuotation">
          批量发送报价
        </el-button>
        <!-- <el-button plain :loading="downloadLoading" type="primary" icon="el-icon-download" @click="handleDownload">
          导出
        </el-button> -->
        <el-button plain type="warning" icon="el-icon-circle-plus-outline" @click="showFlag = true">
          新增
        </el-button>
      </div>
    </div>
    <el-table ref="multipleTable" v-loading="listLoading" :data="list" element-loading-text="拼命加载中" border fit highlight-current-row stripe class="cp" @row-dblclick="showTable" resizable="true">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table :data="props.row.inquiry_quotations" type="index" style="width: 100%;margin-top: 10px" @select="handleSelectionChange" border>
              <el-table-column type="selection" width="39" />
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-form label-position="right" inline class="demo-table-expand">
                    <el-form-item label="产品性状">
                      <span>{{ props.row.appear_shape }}</span>
                    </el-form-item>
                    <el-form-item label="汇率">
                      <span>{{ props.row.exchange_rate }}</span>
                    </el-form-item>
                    <el-form-item label="采购报价/汇率">
                      <span>{{ props.row.cost_price }}</span>
                    </el-form-item>
                    <el-form-item label="采购报价">
                      <span>{{ props.row.cost_price_usd }}</span>
                    </el-form-item>
                    <el-form-item label="利润">
                      <span>{{ props.row.profit }}</span>
                    </el-form-item>
                    <el-form-item label="运费">
                      <span>{{ props.row.shipping_fee }}</span>
                    </el-form-item>
                    <el-form-item label="操作费">
                      <span>{{ props.row.operating_fee }}</span>
                    </el-form-item>
                    <!-- <el-form-item label="检测项目">
                      <span>{{ props.row.testing_project }}</span>
                    </el-form-item> -->
                    <el-form-item label="检测费">
                      <span>{{ props.row.testing_fee }}</span>
                    </el-form-item>
                    <el-form-item label="是否报关">
                      <span>{{ props.row.is_declare | statusFilter}}</span>
                    </el-form-item>
                    <el-form-item label="报关费">
                      <span>{{ props.row.declare_fee }}</span>
                    </el-form-item>
                   <!--  <el-form-item label="鉴定项目">
                      <span>{{ props.row.appraisal_project }}</span>
                    </el-form-item> -->
                    <el-form-item label="鉴定费">
                      <span>{{ props.row.appraisal_fee }}</span>
                    </el-form-item>
                    <el-form-item label="银行手续费">
                      <span>{{ props.row.bank_fee }}</span>
                    </el-form-item>
                    <el-form-item label="是否危险品">
                      <span>{{ props.row.is_dangerous | statusFilter}}</span>
                    </el-form-item>
                    <el-form-item label="存储条件">
                      <span>{{ props.row.storage }}</span>
                    </el-form-item>
                    <el-form-item label="监管条件">
                      <span>{{ props.row.is_take_charge | isTtakeChargeFilter}}</span>
                    </el-form-item>
                    <el-form-item label="HS编码">
                      <span>{{ props.row.hs_code }}</span>
                    </el-form-item>
                    <el-form-item label="原产国">
                      <span>{{ props.row.country }}</span>
                    </el-form-item>
                    <el-form-item label="是否定制">
                      <span>{{ props.row.is_customized | isCustomizedFilter}}</span>
                    </el-form-item>
                    <el-form-item label="货期">
                      <span>{{ props.row.stock }}</span>
                    </el-form-item>
                    <el-form-item label="报价术语">
                      <span>{{ props.row.incoterms }}</span>
                    </el-form-item>
                    <el-form-item label="采购备注">
                      <span>{{ props.row.purchase_note }}</span>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column align="center" label="供应商">
                <template slot-scope="scope">
                  <span>{{ scope.row.vendor_company_name }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="报价时间">
                <template slot-scope="scope">
                  <span>{{ scope.row.created_at }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="价格">
                <template slot-scope="scope" v-if="scope.row.price == 0">/</template>
                <template slot-scope="scope" v-else>
                  {{ scope.row.price }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="采购报价">
                <template slot-scope="scope">
                  {{ scope.row.cost_price }}
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
            </el-table>
        </template>
      </el-table-column>
      <el-table-column align="center" label="询盘订单号" width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.inquiry_no }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报价状态" width="90px" align="center">
        <template slot-scope="scope">
          <!-- 0-未报价，1-已报价，2-已完成，3-已放弃 -->
          <span class="c-red" v-if="scope.row.status==0">{{ scope.row.status | priceStatusFilter }}</span>
          <span class="c-dark-blue" v-if="scope.row.status==1">{{ scope.row.status | priceStatusFilter }}</span>
          <span v-if="scope.row.status==2">{{ scope.row.status | priceStatusFilter }}</span>
          <span class="c-red" v-if="scope.row.status==3">{{ scope.row.status | priceStatusFilter }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="询价日期" width="95px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column> -->
     <!--  <el-table-column label="发送报价时间" min-width="90px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.send_quotation_at }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="公司名称" min-width="200px" align="center" :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{scope.row.company_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户名称" min-width="100px" align="center" :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{ scope.row.first_name}}{{scope.row.last_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="询问产品名" min-width="200px" align="center" :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span class="toe">{{ scope.row.product_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="CAS号" min-width="100px" align="center" :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{ scope.row.cas }}</span>
        </template>
      </el-table-column>
      <el-table-column label="纯度" min-width="90px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.purity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数量" min-width="90px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.package }}</span>
        </template>
      </el-table-column>
      <el-table-column label="负责人" min-width="90px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.employee_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100px" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="success" size="small" @click="handleUpdate3(row)">
            分配
          </el-button>
          <el-button type="primary" class="mt10" size="small" @click.stop.prevent="showTable(row)">
            查看详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 创建询盘 -->
    <Inquiry :showFlag="showFlag" @closeChildDialog="closeChildDialog" />
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!-- 订单设置 -->
    <el-dialog title="订单设置" :visible.sync="dialogFormVisible2" :close-on-click-modal="false" width="50%">
      <el-button plain type="success" @click="dialogFormVisible3 = true">
        设置检测费
      </el-button>
      <el-button plain type="success" @click="dialogFormVisible4 = true">
        设置运输报告鉴定费
      </el-button>
      <el-button plain type="success" @click="dialogFormVisible5 = true">
        设置汇率
      </el-button>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">
          取消
        </el-button>
      </div>
    </el-dialog>
    <!-- 设置检测费 -->
    <el-dialog title="设置检测费" :close-on-click-modal="false" :visible.sync="dialogFormVisible3" width="70%">
      <el-form ref="dataForm" :model="temp" label-position="right" label-width="100px">
        <el-row :gutter="20" v-for="(item, index) in testingFeeList">
          <el-col :span="8">
            <el-form-item label="测试项目" prop="testing_project" :span="8">
              <el-input v-model="item.testing_project"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="测试费" prop="testing_fee">
              <el-input v-model="item.testing_fee" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button type="warning" icon="el-icon-delete" @click.prevent="removeItem(item)" v-if="index>0">删除</el-button>
            <el-button plain type="success" icon="el-icon-circle-plus-outline" @click="addItem" v-if="index == (testingFeeList.length-1)">新增</el-button>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible3 = false">
          取消
        </el-button>
        <el-button type="primary" @click="handleUpdateTestingFee()">
          确认
        </el-button>
      </div>
    </el-dialog>
    <!-- 设置运输报告鉴定费 -->
    <el-dialog title="设置运输报告鉴定费" :close-on-click-modal="false" :visible.sync="dialogFormVisible4" width="70%">
      <el-form ref="dataForm" :model="temp" label-position="right" label-width="100px">
        <el-row :gutter="20" v-for="(item, index) in appraisalFeeList">
          <el-col :span="8">
            <el-form-item label="项目" :span="8">
              <el-input v-model="item.appraisal_project"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="费用" prop="order_no">
              <el-input v-model="item.appraisal_fee" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button type="warning" icon="el-icon-delete" @click.prevent="removeItem1(item)" v-if="index>0">删除</el-button>
            <el-button plain type="success" icon="el-icon-circle-plus-outline" @click="addItem1" v-if="index == (appraisalFeeList.length-1)">新增</el-button>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible4 = false">
          取消
        </el-button>
        <el-button type="primary" @click="handleUpdateAppraisalFee()">
          确认
        </el-button>
      </div>
    </el-dialog>
    <!-- 设置汇率 -->
    <el-dialog title="设置汇率" :close-on-click-modal="false" :visible.sync="dialogFormVisible5" width="70%">
      <el-form ref="dataForm" label-position="right" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="汇率" :span="8">
              <el-input v-model="exchangeRateList"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible5 = false">
          取消
        </el-button>
        <el-button type="primary" @click="handleUpdateExchangeRate()">
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="分配询盘订单负责人" :visible.sync="dialogFormVisible6" :close-on-click-modal="false" width="30%">
      <el-select ref="select" v-model="employeeId" placeholder="请选择员工">
        <el-option v-for="item in employeeList" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible6 = false">
          关闭
        </el-button>
        <el-button type="primary" @click="updateDistributeEmployee()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { fetchList, createInquiries, inquiriesDetails, quotationDetails, addQuotation, updateQuotation, deleteInquiries, testingFee, updateTestingFee, appraisalFee, updateAppraisalFee, exchangeRate, updateExchangeRate,updateDistributeEemployee,sendQuotation2 } from '@/api/inquiry'
import { parseTime, isInArray } from '@/utils'
import Pagination from '@/components/Pagination'
import Inquiry from '@/components/Inquiry'
import { updateDistributeEmployee } from '@/api/crm'
import { fetchHRList } from '@/api/hr'

export default {
  name: '询盘订单',
  components: { Pagination, Inquiry },
  data() {
    return {
      list: null,
      total: 0,
      showFlag: false, //创建询盘
      listLoading: true,
      type: [{ label: '内贸', key: '1' }, { label: '外贸', key: '2' }],
      userinfoList: null, // 员工列表
      date: null, // 询盘开始时间-结束时间
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      listQuery: {
        inquiry_no: null, // 询盘订单号
        product_id: null, // 产品名/CAS号
        company_name: null, // 客户公司名称
        page: 1,
        limit: 20
      },
      temp: {},
      employeeId: null,
      employeeList: {},
      inquiry_detail_quotation_ids: [], //选中报价详情
      dialogFormVisible: false,
      dialogFormVisible2: false,
      dialogFormVisible3: false,
      dialogFormVisible4: false,
      dialogFormVisible5: false,
      dialogFormVisible6: false,
      testingFeeList: [{
        "testing_project": "",
        "testing_fee": null
      }],
      appraisalFeeList: [{
        "appraisal_project": "",
        "appraisal_fee": null
      }],
      exchangeRateList: '',
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        let data = response.data.page_datas
        for (const v of data) {
          if (v.purity && v.purity.indexOf("%") == -1) {
            v.purity = v.purity + '%'
          }
        }
        this.list = data
        this.total = response.data.total_count
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      if (this.date) {
        this.listQuery.created_start_at = this.date[0];
        this.listQuery.created_end_at = this.date[1];
      }
      this.getList()
    },
    resetTemp() {
      this.temp = {}
      this.listQuery = {
        inquiry_no: null, // 询盘订单号
        product_id: null, // 产品名/CAS号
        company_name: null, // 客户公司名称
        page: 1,
        limit: 20
      }
      this.inquiry_detail_quotation_ids=[];
      this.date = null;
      this.getList()
    },
    refresh() {
      this.resetTemp()
      this.listQuery.page = 1
      this.getList()
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
          update(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
          })
        }
      })
    },
    showTable(row) {
      this.$router.push({ path: '/inquiry/detailed', query: { id: row.id } });
    },
    /**
     * 接受子组件调用的关闭弹出框方法
     */
    closeChildDialog() {
      this.listQuery.page = 1
      this.getList()
      this.$store.commit("user/SET_PRODUCTS_INFO", '');
      this.showFlag = false
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['下单日期', '供应商', '联系人', '数量', '金额', 'cas', '名字']
        const filterVal = ['created_at', 'supplier_name', 'contact_name', 'package_str', 'price', 'cas', 'chemical_name_cn']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'created_at') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    handleOrderSettings() {
      this.dialogFormVisible2 = true
      testingFee().then(response => {
        let data =response.data.value;
        if(response.data.value.length>0){
          this.testingFeeList =data
        }
      })
      appraisalFee().then(response => {
        let data =response.data.value;
        if(response.data.value>0){
          this.appraisalFeeList =data
        }
      })
      exchangeRate().then(response => {
        this.exchangeRateList = response.data.value
      })
    },
    handleUpdateTestingFee() {
      let tem = {
        value: this.testingFeeList
      }
      updateTestingFee(tem).then(response => {
        this.dialogFormVisible3 = false
        this.handleOrderSettings()
        this.$notify({
          title: 'Success',
          message: '修改成功！',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleUpdateAppraisalFee() {
      let tem = {
        value: this.appraisalFeeList
      }
      updateAppraisalFee(tem).then(response => {
        this.dialogFormVisible4 = false
        this.handleOrderSettings()
        this.$notify({
          title: 'Success',
          message: '修改成功！',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleUpdateExchangeRate() {
      let tem = {
        value: this.exchangeRateList
      }
      updateExchangeRate(tem).then(response => {
        this.dialogFormVisible5 = false
        this.handleOrderSettings()
        this.$notify({
          title: 'Success',
          message: '修改成功！',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleSelectionChange(selection, row) {
      let tem = selection;
      let spanArr = this.inquiry_detail_quotation_ids;
      if(selection.indexOf(row)>-1){
        tem.forEach((item, index) => {
          spanArr.push(item.inquiry_quotation_id);
        });
      }else{
        let newSet = new Set(spanArr)
        newSet.delete(row.inquiry_quotation_id)
        spanArr = [...newSet]
      }
      this.inquiry_detail_quotation_ids = Array.from(new Set(spanArr));
    },
    handleSendQuotation() {
      const that = this
      if (that.inquiry_detail_quotation_ids.length < 1) {
        that.$message.error('请勾选报价明细！');
        return
      }
      let tem ={
        inquiry_quotation_ids:that.inquiry_detail_quotation_ids
      }
      // console.log(tem)
      console.log(that.inquiry_detail_quotation_ids)
      sendQuotation2(tem).then(response => {
        if(response.code == 0){
        this.inquiry_detail_quotation_ids=[];
          that.$message({
            message: '发送成功！',
            type: 'success'
          });
        }
      })
    },
    removeItem(item) {
      var index = this.testingFeeList.indexOf(item)
      if (index !== -1) {
        this.testingFeeList.splice(index, 1)
      }
    },
    addItem() {
      this.testingFeeList.push({
        testing_project: '',
        testing_fee: ''
      });
    },
    removeItem1(item) {
      var index = this.appraisalFeeList.indexOf(item)
      if (index !== -1) {
        this.appraisalFeeList.splice(index, 1)
      }
    },
    addItem1() {
      this.appraisalFeeList.push({
        appraisal_project: '',
        appraisal_fee: ''
      });
    },
    handleUpdate3(row) {
      this.temp = Object.assign({}, row)
      this.$nextTick(() => {
        let tem = {
          limit: 1000
        }
        fetchHRList(tem).then(response => {
          this.dialogFormVisible6 = true
          this.employeeList = response.data.page_datas
          this.listLoading = false
        })
      })
    },
    updateDistributeEmployee() {
      let tem = {
        employee_id: this.employeeId
      }
      updateDistributeEemployee(this.temp.id, tem).then(() => {
        this.$notify({
          title: 'Success',
          message: '修改成功！',
          type: 'success',
          duration: 2000
        })
        this.getList()
        this.dialogFormVisible6 = false
      })
    },
  }
}

</script>
<style lang="scss" scoped>
.productInfo {
  width: 100%;

  ul {
    list-style: none;

    li {
      display: inline-block;
      width: 23%;
    }
  }
}

</style>
