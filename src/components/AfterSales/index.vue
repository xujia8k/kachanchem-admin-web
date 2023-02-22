<template>
  <el-dialog title="处理题订单" width="70%" :close-on-click-modal="false" :visible.sync="dialogVisible" :before-close="onClose">
    <el-descriptions class="margin-top" title="订单信息" :column="2" size="medium" border  style="margin-left: 20px;margin-right: 20px">
      <el-descriptions-item>
        <template slot="label">订单编号</template>
        kooriookami
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">订单状态</template>
        已确认
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">客户信息</template>
        医药科技（上海）有限公司 kevin@net-chem.com_1 kevin
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">供应商信息</template>
        生物医药科技有限公司 marketing@leyan.com.cn_1 黄姗（客服） 15026709576
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">产品信息</template>
        120-46-7二苯甲酰甲烷 98%
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">包装/金额</template>
        包装：30g | 纯度：98% | 客户价：￥120.0增值税发票(13%) | 成本价：￥100.0增值税发票(13%) |
      </el-descriptions-item>
    </el-descriptions>
    <div class="el-descriptions__title mt20 mb20 ml20">售后信息</div>
    <el-form label-width="100px" style="margin-left: 20px">
      <el-row :gutter="20">
        <el-col :span="20">
          <el-form-item label="售后申请原因">
            <el-select v-model="reason" placeholder="售后申请原因" style="width: 100%;">
              <el-option v-for="item in reasonList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="售后处理说明">
            <el-input v-model="illustrate" type="textarea" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="售后申请凭证">
            <Upload v-model="attachment_id" :id="attachment_id" :value="attachment_id" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onClose">取消</el-button>
      <el-button type="success" icon="el-icon-check" @click="handleCreate">提交</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { mapState } from 'vuex';
import { financeAccounts } from '@/api/finance'

import Upload from '@/components/Upload/SingleImage'
export default {
  name: 'inquiry',
  components: { Upload },
  props: {
    showFlag: {
      type: Boolean
    }
  },
  watch: {
    showFlag(newVal, oldVal) {
      this.dialogVisible = newVal
      newVal ? this.showComponent = true : this.showComponent = false;
    }
  },
  data() {
    return {
      attachment_id: null,
      illustrate: null,
      dialogVisible: false,
      reason: null,
      reasonList: [{
        "value": 0,
        "label": '质量问题'
      }, {
        "value": 1,
        "label": '包装问题'
      }, {
        "value": 2,
        "label": '货期问题'
      }, {
        "value": 3,
        "label": '物流问题'
      }, {
        "value": 4,
        "label": '换货'
      }, {
        "value": 5,
        "label": '其他'
      }],
      rules2: {
        reason: [{ required: true, message: '售后申请原因不能为空', trigger: 'blur' }],
        illustrate: [{ required: true, message: '售后处理说明不能为空', trigger: 'blur' }]
      },
    }
  },
  mounted() {},
  methods: {
    onClose() {
      this.reason = null;
      this.illustrate = null;
      this.attachment_id = null;
      this.$emit('closeChildDialog')
    },
    handleCreate() {
      let that = this;

    }
  }
}

</script>
<style lang="scss" scoped>
</style>
