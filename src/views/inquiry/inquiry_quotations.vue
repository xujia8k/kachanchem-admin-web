<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model.trim="listQuery.inquiry_no" placeholder="请输入询盘订单号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model.trim="listQuery.q" placeholder="请输入产品名/CAS号" style="width: 200px;margin-left: 5px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model.trim="listQuery.company_name" placeholder="请输入客户名称" style="width: 200px;margin-left: 5px;" class="filter-item" @keyup.enter.native="handleFilter"/>
     <!--  <el-date-picker v-model="date" value-format="yyyy-MM-dd HH:mm:ss" class="filter-item ml10" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" style="width: 250px;margin-left: 5px;"/> -->
      <el-button class="filter-item ml10" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <div class="fr">
        <el-button plain type="success" icon="el-icon-refresh" @click="refresh">
          刷新
        </el-button>
        <!-- <el-button plain type="warning" icon="el-icon-circle-plus-outline" @click="showFlag = true">
          新增
        </el-button> -->
      </div>
    </div>
    <el-table ref="multipleTable" v-loading="listLoading" :data="list" element-loading-text="拼命加载中" border fit highlight-current-row stripe class="cp" @row-dblclick="showTable" resizable="true">
      <el-table-column align="center" label="询盘订单号" width="145">
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
      </el-table-column>
      <el-table-column label="公司名称" min-width="200px" align="center" :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{scope.row.company_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户名称" min-width="200px" align="center" :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{ scope.row.first_name}}{{scope.row.last_name }}</span>
        </template>
      </el-table-column> -->
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
      <el-table-column label="操作" width="150px" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="small" @click.stop.prevent="showTable(row)">
            查看详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 创建询盘 -->
    <Inquiry :showFlag="showFlag" @closeChildDialog="closeChildDialog" />
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>
<script>
import { fetchQuotationsList, createInquiries, inquiriesDetails, quotationDetails, addQuotation, updateQuotation, deleteInquiries } from '@/api/inquiry'
import { parseTime,isInArray } from '@/utils'
import Pagination from '@/components/Pagination'
import Inquiry from '@/components/Inquiry'
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
      dialogFormVisible: false,
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
      fetchQuotationsList(this.listQuery).then(response => {
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
      this.$router.push({ path: '/inquiry/inquiry_quotations_detailed', query: { id: row.id } });
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
