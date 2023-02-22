<template>
  <el-dialog title="出库单预览" :visible.sync="dialogVisible" :before-close="onClose" width="80%" :close-on-click-modal="false">
    <div ref="print" contenteditable="true">
      <div style="width: 800px;margin: 0px auto;font-size: 10pt;border: 0px solid red;">
        <table style="width: 100%;">
          <tbody>
            <!-- <tr>
              <td style="font-size: 20pt; text-align: center; font-weight: bolder;">武汉贝尔卡生物医药有限公司</td>
            </tr> -->
            <tr>
              <td style="font-size: 20pt; text-align: center; font-weight: bolder;">出库（复核）单</td>
            </tr>
            <tr>
              <td>
                <hr>
              </td>
            </tr>
          </tbody>
        </table>
        <table style="width: 100%; margin-top: 40px;" v-if="printDATA.customer">
          <tbody>
            <tr>
              <td style="width: 13%; font-weight:bolder;">客户名称：</td>
              <td style="width: 25%;">{{ printDATA.customer.customer_name }}</td>
              <td style="width: 20%;" v-if="printDATA.customer.ship_address"> {{ printDATA.customer.ship_address[1] }}</td>
              <td v-if="printDATA.customer.ship_address"> {{ printDATA.customer.ship_address[2] }}</td>
              <td style=" font-weight:bolder;">出库日期：</td>
              <td>{{ new Date() | parseTime('{y}-{m}-{d}') }}</td>
            </tr>
            <tr>
              <td style=" font-weight:bolder;padding-top: 20px">收货地址：</td>
              <td colspan="5" style="padding-top: 20px" v-if="printDATA.customer.ship_address">{{ printDATA.customer.ship_address[0] }}</td>
            </tr>
          </tbody>
        </table>
        <table style="border-left: #000 1px solid; border-top: #000 1px solid; text-align: left;width:100%;font-size:10px ;margin-top:30px; " cellspacing="0" cellpadding="0">
          <tbody>
            <tr>
              <th style="width: 50px; border-bottom: #000 1px solid; border-right: #000 1px solid;text-align:center;background-color:gainsboro; height:30px;">订单号</th>
              <th style="width: 40%; border-bottom: #000 1px solid; border-right: #000 1px solid;text-align:center;background-color:gainsboro; height:30px;">产品名</th>
              <th style="width: 30px; border-bottom: #000 1px solid; border-right: #000 1px solid;text-align:center;background-color:gainsboro; height:30px;">数量</th>
              <th style="width: 40px; border-bottom: #000 1px solid; border-right: #000 1px solid;text-align:center;background-color:gainsboro; height:30px; ">库位</th>
            </tr>
            <tr  v-for="(item, index) in printDATA.chemocalsList" :key="index">

              <td style="border-right: #000 1px solid;border-bottom: #000 1px solid; text-align: center;">{{ printDATA.customer.order_no || '-'}}</td>
              <td style="border-bottom: #000 1px solid; border-right: #000 1px solid; padding:6px; text-align: center;">
                {{ item.chemical_name_cn || item.chemical_name }}
              </td>
              <td style="border-bottom: #000 1px solid; border-right: #000 1px solid; padding:6px; text-align: center">
               {{ item.init_package }}{{ item.unit  | unitFilter}}
              </td>
              <td style="border-right: #000 1px solid;border-bottom: #000 1px solid; padding: 2px 0px 2px 5px; text-align: center;">
                {{ item.storehouse }}
              </td>
            </tr>
            <tr>
              <td style="border-right: #000 1px solid;border-bottom: #000 1px solid; padding: 3px; background-color:gainsboro; text-align: center;">备注</td>
              <td colspan="5" style="border-right: #000 1px solid;border-bottom: #000 1px solid; padding: 3px; text-align: center;"></td>
            </tr>
            <!-- <tr>
            </tr>
            <tr>
              <td colspan="6" style=" font-weight:bolder; border-right: #000 1px solid;border-bottom: #000 1px solid; padding: 3px;">以上产品请核对数量，如果质量问题，请在一周内联系本公司，逾期视为默认无质量问题！</td>
            </tr>
            <tr>
            </tr> -->
          </tbody>
        </table>
        <!-- <table style="width: 100%; margin-top: 20px; margin-bottom:100px;">
          <tbody>
            <tr>
              <td style="width: 35%; font-weight:bolder; text-align: right;">白联 发货单位留存，红联随货</td>
            </tr>
            <tr>
              <td style="width: 35%; font-weight:bolder;  text-align: right;">销售单位及经手人：刘宇</td>
            </tr>
          </tbody>
        </table> -->
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onClose">
        取消
      </el-button>
      <el-button type="primary" @click="handlePrint()">
        确认打印
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import { Print } from '@/utils/print'

export default {
  name: 'inquiry',
  props: {
    showFlag: {
      type: Boolean
    },
    printData: {
      type: Object
    }
  },
  watch: {
    showFlag(newVal, oldVal) {
      this.dialogVisible = newVal
    },
    printData(newVal, oldVal) {
      this.printDATA = newVal
    }
  },
  data() {
    return {
      dialogVisible: false,
      printDATA: this.printData,
    }
  },
  mounted() {},
  methods: {
    onClose() {
      this.dialogVisible = false;
      this.$emit('closeChildDialog');
    },
    handlePrint() {
      Print(this.$refs.print)
    }
  }
}

</script>
