<template>
  <div class="app-container">
    <div class="filter-container">
     <!--  <el-input v-model.trim="listQuery.first_name" placeholder="first_name" style="width: 150px;" class="filter-item" @keyup.enter.native="getList" /> -->
      <el-date-picker v-model="date" class="filter-item ml10" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" />
      <el-button class="filter-item ml40" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <div class="fr">
        <el-button plain type="success" icon="el-icon-refresh" @click="refresh">
          刷新
        </el-button>
        <!-- <el-button class="filter-item" style="margin-left: 10px;" type="warning" icon="el-icon-edit-outline" @click="handleCreate">
          新增
        </el-button> -->
      </div>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" :data="list" border highlight-current-row style="width: 100%;">
      <el-table-column label="ID" prop="id" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center">
         <template slot-scope="scope">
          <!--订单状态，0-未确认，1-已确认，4-订单完成，5-取消 -->
          <span class="c-info" v-if="scope.row.order_status == 0">{{ scope.row.order_status | customerOrderStatusFilter }}</span>
          <span class="c-dark-blue" v-if="scope.row.order_status == 1">{{ scope.row.order_status | customerOrderStatusFilter }}</span>
          <span class="c-green" v-if="scope.row.order_status == 4">{{ scope.row.order_status | customerOrderStatusFilter }}</span>
          <span class="c-red" v-if="scope.row.order_status == 5">{{ scope.row.order_status | customerOrderStatusFilter }}</span>
        </template>
      </el-table-column>
     <!--  <el-table-column label="支付状态" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.payment_status | paymentStatusFilter }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="订单编号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.order_no }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单总额" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.amount}}</span>
        </template>
      </el-table-column>
      <el-table-column label="货币类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.currency_type | currencyFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实际收款金额" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.received_amount }}</span>
        </template>
      </el-table-column>
     <!--  <el-table-column label="收款时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.received_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发票类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.invoice_type | invoiceTypeFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="发票寄送地址" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.invoice_address }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户备注" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.note }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="small" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>
<script>
import { fetchList } from '@/api/order'
import Pagination from '@/components/Pagination'

export default {
  name: 'ComplexTable',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      date: null,
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
        page: 1,
        limit: 20
      },
      temp: {
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.page_datas
        this.total = response.data.total_count
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.listQuery.created_start_at = this.date[0];
      this.listQuery.created_end_at = this.date[1];
      this.getList()
    },
    resetTemp() {
      this.listQuery = {
        created_start_at:'',
        created_end_at:'',
        page: 1,
        limit: 20
      }
      this.temp = {
      }
    },
    refresh() {
      this.resetTemp()
      this.listQuery.page = 1
      this.getList()
    },
  }
};

</script>
