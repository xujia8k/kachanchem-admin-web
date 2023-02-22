<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model.trim="listQuery.order_no" placeholder="请输入订单编号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" v-if="showSearchData[0] && showSearchData[0].istrue" />
      <el-input v-model.trim="listQuery.q" placeholder="请输入产品名/CAS号" style="width: 200px;margin-left: 5px;" class="filter-item" @keyup.enter.native="handleFilter" v-if="showSearchData[1] && showSearchData[1].istrue" />
      <el-input v-model.trim="listQuery.employee_name" placeholder="请输入员工名称" style="width: 145px;margin-left: 5px;" class="filter-item" @keyup.enter.native="handleFilter" v-if="showSearchData[2] && showSearchData[2].istrue" />
      <el-date-picker v-model="date" value-format="yyyy-MM-dd HH:mm:ss" class="filter-item ml10" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" style="width: 250px;margin-left: 5px;" v-if="showSearchData[3] && showSearchData[3].istrue" />
      <!-- <el-button class="filter-item ml0" :loading="downloadLoading" size="small" type="danger" @click="showFlag = true">
        转问题订单
      </el-button> -->
      <el-button class="filter-item ml10" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <div class="fr">
        <el-button plain class="filter-item" type="success" icon="el-icon-refresh" @click="refresh">
          刷新
        </el-button>
        <el-button plain class="filter-item" type="primary" icon="el-icon-set-up" @click="handleShowSetting">
          视图
        </el-button>
        <!-- <el-button plain :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
          导出
        </el-button> -->
      </div>
    </div>
    <el-table ref="multipleTable" v-loading="listLoading" :data="list" element-loading-text="拼命加载中" border fit highlight-current-row stripe class="cp" @row-dblclick="showTable">
      <!-- <el-table-column type="selection" align="center" />
      <el-table-column label="ID" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column> -->
      <el-table-column align="center" label="销售订单号" width="80" v-if="showtableData[0] && showtableData[0].istrue">
        <template slot-scope="scope">
          <span>{{ scope.row.order_no }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="90px" v-if="showtableData[1] && showtableData[1].istrue">
        <template slot-scope="scope">
          <span class="c-info" v-if="scope.row.order_status == 0">{{ scope.row.order_status | customerOrderStatusFilter }}</span>
          <span class="c-dark-blue" v-if="scope.row.order_status == 1">{{ scope.row.order_status | customerOrderStatusFilter }}</span>
          <span class="c-info" v-if="scope.row.order_status == 2">{{ scope.row.order_status | customerOrderStatusFilter }}</span>
          <span class="c-red" v-if="scope.row.order_status == 3">{{ scope.row.order_status | customerOrderStatusFilter }}</span>
          <span class="c-green" v-if="scope.row.order_status == 4">{{ scope.row.order_status | customerOrderStatusFilter }}</span>
          <span class="c-red" v-if="scope.row.order_status == 5">{{ scope.row.order_status | customerOrderStatusFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单日期" width="95px" align="center" v-if="showtableData[2] && showtableData[2].istrue">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户名称" align="center" width="150px" :show-overflow-tooltip='true' v-if="showtableData[3] && showtableData[3].istrue">
        <template slot-scope="scope">
          <span>{{ scope.row.customer_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="业务员" width="90px" align="center" v-if="showtableData[4] && showtableData[4].istrue">
        <template slot-scope="scope">
          <span>{{ scope.row.employee_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单金额" align="center" width="110px" v-if="showtableData[5] && showtableData[5].istrue">
        <template slot-scope="scope">
          <span>{{ scope.row.amount}}{{ scope.row.currency_type | currencyTypeFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付状态" align="center" width="80px" v-if="showtableData[6] && showtableData[6].istrue">
        <template slot-scope="scope">
          <span class="c-red" v-if="scope.row.payment_status == 0">未付款</span>
          <span class="c-green" v-if="scope.row.payment_status == 1">完全付款</span>
          <span class="c-info" v-if="scope.row.payment_status == 2">部分付款</span>
        </template>
      </el-table-column>
      <el-table-column label="付款方式" align="center" width="95px" v-if="showtableData[7] && showtableData[7].istrue">
        <template slot-scope="scope">
          <span>{{ scope.row.payment_type | paymentTypeFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="开票状态" align="center" width="80px" v-if="showtableData[8] && showtableData[8].istrue">
        <template slot-scope="scope">
          <span class="c-red" v-if="scope.row.invoice_status == 0">{{ scope.row.invoice_status | invoiceStatusFilter3 }}</span>
          <span class="c-green" v-if="scope.row.invoice_status == 1">{{ scope.row.invoice_status | invoiceStatusFilter3 }}</span>
          <span class="c-info" v-if="scope.row.invoice_status == 2">{{ scope.row.invoice_status | invoiceStatusFilter3 }}</span>
          <span class="c-green" v-if="scope.row.invoice_status == 3">{{ scope.row.invoice_status | invoiceStatusFilter3 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人" align="center" width="80px" v-if="showtableData[9] && showtableData[9].istrue">
        <template slot-scope="scope">
          <span>{{ scope.row.contact_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否关注" align="center" width="80px" v-if="showtableData[10] && showtableData[10].istrue">
        <template slot-scope="scope">
          <el-link type="primary" v-if="scope.row.is_followed ==0" @click="handleFollow(scope.row)">关注</el-link>
          <el-link type="success" v-else @click="handleUnfollow(scope.row)">取消关注</el-link>
        </template>
      </el-table-column>
      <el-table-column label="商品信息" align="center" v-if="showtableData[11] && showtableData[11].istrue">
        <template slot-scope="scope">
          <div class="table_info tl" v-for="(item, index) in scope.row.detail_info" :key="index">
            <p>CAS号:<span>{{ item.cas}}</span></p>
            <p class="toe">中文名:<span>{{ item.chemical_name_cn}}</span></p>
            <p class="toe">英文名:<span>{{ item.chemical_name}}</span></p>
            <p v-if="item.package_str">规格:<span>{{ item.package_str }}</span></p>
            <p v-if="item.purity">纯度:<span>{{ item.purity }}</span></p>
          </div>
        </template>
        <!-- <template slot-scope="scope">
          <div class="table_info tl" v-for="(item, index) in scope.row.detail_info" :key="index">
            <el-tooltip placement="top">
              <div slot="content">
                中文名:<span>{{ item.chemical_name_cn}}</span><br/>
                英文名:<span>{{ item.chemical_name}}</span>
              </div>
              <div>
                <p>CAS号:<span>{{ item.cas}}</span></p>
                <p class="toe">中文名:<span>{{ item.chemical_name_cn}}</span></p>
                <p class="toe">英文名:<span>{{ item.chemical_name}}</span></p>
                <p v-if="item.package_str">规格:<span>{{ item.package_str }}</span></p>
                <p v-if="item.purity">纯度:<span>{{ item.purity }}</span></p>
              </div>
            </el-tooltip>
          </div>
        </template> -->
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150">
        <template slot-scope="{row}">
          <el-button class="filter-item mb20" size="small" type="primary" @click="showTable(row)">
            查看详情
          </el-button>
          <el-button class="filter-item ml0" :loading="downloadLoading" size="small" type="danger" @click="handleCancelOrder(row)" v-if="row.order_status == 0 || row.order_status == 1">
            销售结束
          </el-button>
          <!-- <el-button class="filter-item ml0" :loading="downloadLoading" size="small" type="danger"  @click="showFlag = true">
            转问题订单
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 视图设置 -->
    <SetView :showFlag="showSettingFlag" @closeChildDialog="closeChildDialog" :viewData="viewData" @closeChange="closeCom(arguments)" />
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <AfterSales :showFlag="showFlag" @closeChildDialog="closeChildDialog" />
  </div>
</template>
<script>
import { fetchList, create, update, cancelOrder, createFinanceReceiptDetail, follow, unfollow } from '@/api/customer'
import Pagination from '@/components/Pagination'
import AfterSales from '@/components/AfterSales'
import { getEmployeeSetting, updateEmployeeSetting } from '@/api/commons'
import SetView from '@/components/SetView'
import { parseTime, isInArray } from '@/utils'
import defaultViewData from '@/static/defaultViewData.json' // 默认视图数据

export default {
  name: '销售订单',
  components: { Pagination, AfterSales, SetView },
  data() {
    return {
      showSearchData: null, //展示搜索数据
      showSettingFlag: false, //视图设置
      checkedSearchData: null, //选中搜索数据
      viewData: null, //视图数据
      showFlag: false,
      list: null,
      total: 0,
      listLoading: true,
      companyTradeType: [{ label: '内贸', key: '0' }, { label: '外贸', key: '1' }],
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
      filterEmployees: null, //过滤员工用作搜索操作
      listQuery: {
        q: '',
        order_no: '',
        employee_id: '', // 业务员id
        company_trade_type: '', //0-内贸，1-外贸
        created_start_at: '',
        created_end_at: '',
        page: 1,
        limit: 20
      },
      temp: {},
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {},
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.getEmployeeSetting()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        let data = response.data.page_datas
        for (const v of data) {
          for (const info of v.detail_info) {
            if (info.purity.indexOf("%") == -1) {
              info.purity = info.purity + '%'
            }
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
      this.listQuery = {
        q: '',
        order_no: '',
        employee_id: '', // 业务员id
        company_trade_type: '', //0-内贸，1-外贸
        created_start_at: '',
        created_end_at: '',
        page: 1,
        limit: 20
      }
      this.temp = {}
    },
    refresh() {
      this.resetTemp()
      this.listQuery.page = 1
      this.getList()
    },
    handleDelete(row) {
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    showTable(row) {
      this.$router.push({ path: '/customer/order_detailed', query: { id: row.id } });
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },

    /**
     * 接受子组件调用的关闭弹出框方法
     */
    closeChildDialog() {
      this.listQuery.page = 1
      this.getList()
      this.showFlag = false
      this.showSettingFlag = false
      this.getEmployeeSetting();
    },
    //取消订单
    handleCancelOrder(row) {
      this.$confirm('此操作将永久取消订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        cancelOrder(row.id).then(response => {
          if (response.code == 0) {
            this.$message({
              type: 'success',
              message: '取消成功!'
            });
            this.getList();
          } else {
            this.$message({
              type: 'info',
              message: '取消错误！'
            });
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已关闭取消'
        });
      });
    },
    //关注订单
    handleFollow(row) {
      // let tem = {
      //   follow:status
      // }
      follow(row).then(response => {
        if (response.code == 0) {
          this.$message({
            type: 'success',
            message: '关注成功!'
          });
          this.getList();
        }
      })
    },
    //取消关注订单
    handleUnfollow(row) {
      // let tem = {
      //   follow:status
      // }
      unfollow(row).then(response => {
        if (response.code == 0) {
          this.$message({
            type: 'success',
            message: '取消关注成功!'
          });
          this.getList();
        }
      })
    },
    getEmployeeSetting() {
      let path = this.$route.path;
      let tempData = {
        apply_module_name: '/api/admin/v1' + path
      }
      getEmployeeSetting(tempData).then(response => {
        if (response.code == 0) {
          let data = response.data
          //用户设置过视图
          if (data.id) {
            this.checkedSearchData = data
          }
          this.filterData()
        }
      })
    },
    //获取对应视图数据
    getViewData() {
      if (defaultViewData) {
        let path = this.$route.path;
        let splicePath = path.split("/")[1] + '_' + path.split("/")[2];
        for (var i in defaultViewData) {
          if (i == splicePath) {
            return defaultViewData[i]
          }
        }
      }
    },
    //过滤搜索数据
    filterData() {
      let viewData = this.getViewData();
      //过滤搜索数据
      var searchArr = Object.entries(viewData.search_terms); //对象转化为数组
      var searchArr1 = [];
      //如果未设置显示数据，就显示全部
      if (this.checkedSearchData && this.checkedSearchData.search_terms) {
        let search_terms = this.checkedSearchData.search_terms; //接口返回选中数据
        for (var i = 0; i < searchArr.length; i++) {
          if (isInArray(search_terms, searchArr[i][0])) {
            searchArr1.push({
              key: searchArr[i],
              istrue: true
            })
          } else {
            searchArr1.push({
              key: searchArr[i],
              istrue: false
            })
          }
        }
      } else {
        searchArr.forEach(v => {
          searchArr1.push({
            istrue: true
          })
        });
      }
      //过滤列表数据
      var tableArr = Object.entries(viewData.list_terms); //对象转化为数组
      var tableArr1 = [];
      //如果未设置显示数据，就显示全部
      if (this.checkedSearchData && this.checkedSearchData.list_terms) {
        let list_terms = this.checkedSearchData.list_terms; //接口返回选中数据
        for (var i = 0; i < tableArr.length; i++) {
          if (isInArray(list_terms, tableArr[i][0])) {
            tableArr1.push({
              key: tableArr[i],
              istrue: true
            })
          } else {
            tableArr1.push({
              key: tableArr[i],
              istrue: false
            })
          }
        }
      } else {
        tableArr.forEach(v => {
          tableArr1.push({
            istrue: true
          })
        });
      }
      this.showSearchData = searchArr1;
      this.showtableData = tableArr1;
    },
    handleShowSetting() {
      let path = this.$route.path;
      let viewData = this.getViewData();
      this.viewData = {
        name: '/api/admin/v1' + path,
        use_default: 0,
        search_terms: viewData.search_terms,
        list_terms: viewData.list_terms,
        search_terms_setting: [],
        list_terms_setting: [],
      }
      this.showSettingFlag = true
    },
    closeCom(msg) {
      this.viewData.search_terms_setting = msg[0];
      this.viewData.list_terms_setting = msg[1];
    }
  }
}

</script>
