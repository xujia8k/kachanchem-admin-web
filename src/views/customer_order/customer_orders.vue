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
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="right" inline class="demo-table-expand">
            <el-form-item label="产品名称">
              <span>{{ props.row.product_name }}</span>
            </el-form-item>
            <el-form-item label="产品cas号">
              <span>{{ props.row.cas }}</span>
            </el-form-item>
            <el-form-item label="包装">
              <span>{{ props.row.package }}</span>
            </el-form-item>
            <el-form-item label="纯度">
              <span>{{ props.row.purity }}</span>
            </el-form-item>
            <el-form-item label="收货地址">
              <span>{{ props.row.order_no }}</span>
            </el-form-item>
            <el-form-item label="发票类型">
              <span>{{ props.row.invoice_type  | invoiceTypeFilter}}</span>
            </el-form-item>
            <el-form-item label="收票地址">
              <span>{{ props.row.order_no }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
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
       <el-table-column label="支付状态" align="center">
        <template slot-scope="scope">
           <span class="c-red" v-if="scope.row.payment_status == 0">{{ scope.row.payment_status | paymentStatusFilter }}</span>
          <span class="c-green" v-if="scope.row.payment_status == 1">{{ scope.row.payment_status | paymentStatusFilter }}</span>
          <span class="c-dark-blue" v-if="scope.row.payment_status == 2">{{ scope.row.payment_status | paymentStatusFilter }}</span>
        </template>
      </el-table-column>
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
      <el-table-column label="操作" align="center" width="100" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="small" @click="handleUpdate(row)">
            收款
          </el-button>
          <!-- <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
      <el-dialog title="录入收款信息" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:40px;">
        <el-form-item label="收款金额" prop="received_amount">
          <el-input v-model="temp.received_amount" placeholder="请输入收款金额！" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateReceived()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { fetchList,updateReceivedAmount } from '@/api/order'
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
      dialogFormVisible: false,
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
      temp: {}
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
        created_start_at: '',
        created_end_at: '',
        page: 1,
        limit: 20
      }
      this.temp = {
        received_amount:0
      }
    },
    refresh() {
      this.resetTemp()
      this.listQuery.page = 1
      this.getList()
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateReceived() {
      let tem ={
        id:this.temp.id,
        received_amount:this.temp.received_amount,
      }
      updateReceivedAmount(tem).then(response => {
        this.refresh()
      })
    }
  }
};

</script>
<style>
   .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>