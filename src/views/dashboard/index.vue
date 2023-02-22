<template>
  <div class="dashboard-container welcome">
    <!-- <component :is="currentRole" /> -->
     <!-- <el-menu  class="el-menu-demo" mode="horizontal"  background-color="#369" text-color="#fff" active-text-color="#ffd04b">
    <el-menu-item index="1">
      <a href="/inquiry/inquiries">询盘订单</a>
    </el-menu-item>
    <el-submenu index="2">
      <template slot="title">采购管理</template>
      <el-menu-item index="2-1">
        <a href="/purchase/purchase_inquiries">
          采购询价
        </a>
      </el-menu-item>
      <el-menu-item index="2-2">
        <a href="/purchase/orders">
          采购订单
        </a>
      </el-menu-item>
    </el-submenu>
    <el-menu-item index="3">
      <a href="/customer/orders">
        销售订单
      </a>
    </el-menu-item>
    <el-submenu index="4">
      <template slot="title">财务管理</template>
      <el-menu-item index="4-1">
        <a href="/finance/finance_bills">
          销项发票
        </a>
      </el-menu-item>
      <el-menu-item index="4-2">
        <a href="/finance/finance_invoices">
          进项发票
        </a>
      </el-menu-item>
      <el-menu-item index="4-3">
        <a href="/finance/finance_payment_applications">
          付款单申请
        </a>
      </el-menu-item>
      <el-menu-item index="4-4">
        <a href="/finance/finance_payments">
          付款单
        </a>
      </el-menu-item>
      <el-menu-item index="4-5">
        <a href="/finance/finance_receipts">
          收款单
        </a>
      </el-menu-item>
      <el-menu-item index="4-6">
        <a href="/finance/finance_accounts">
          收付款账户管理
        </a>
      </el-menu-item>
    </el-submenu>
    <el-submenu index="5">
      <template slot="title">仓库管理</template>
      <el-menu-item index="5-1">
        <a href="/warehouse/customer_orderss">
          待出库订单
        </a>
      </el-menu-item>
      <el-menu-item index="5-2">
        <a href="/warehouse/order_details">
          在途采购订单
        </a>
      </el-menu-item>
      <el-menu-item index="5-3">
        <a href="/warehouse/outbound_orders">
          出库单
        </a>
      </el-menu-item>
      <el-menu-item index="5-4">
        <a href="/warehouse/warehousing_orders">
          入库单
        </a>
      </el-menu-item>
      <el-menu-item index="5-5">
        <a href="/warehouse/inventories">
          库存单
        </a>
      </el-menu-item>
      <el-menu-item index="5-6">
        <a href="/warehouse/storehouses">
          仓库管理
        </a>
      </el-menu-item>
      <el-menu-item index="5-7">
        <a href="/warehouse/inventory_checks">
          库存盘点
        </a>
      </el-menu-item>
      <el-menu-item index="5-8">
        <a href="/warehouse/inventory_prepacks">
          库存分装
        </a>
      </el-menu-item>
    </el-submenu>
  </el-menu> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import adminDashboard from './admin'
// import editorDashboard from './editor'

export default {
  name: 'Dashboard',
  // components: { adminDashboard, editorDashboard },
  data() {
    return {
      // currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    // if (!this.roles.includes('admin')) {
    //   this.currentRole = 'editorDashboard'
    // }
  }
}
</script>

<style lang="scss" scoped>
// .el-menu-demo {
//   margin: 50px;
// }

// .el-menu-item {
//   padding: 0;
// }

// .el-menu-item a {
//   display: block;
//   padding: 0 50px;
// }

// .el-submenu__title i {
//   color: #ffffff;
// }

.welcome {
  overflow: hidden;
  position: relative;
  width: 100%;
  min-height: calc(100vh - 84px);
  background-position: 25%;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url("~@/assets/welcome.png");
}

</style>
