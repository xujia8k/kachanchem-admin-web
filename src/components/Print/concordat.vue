<template>
  <el-drawer title="我是标题" :visible.sync="showComponent" :with-header="false" :before-close="handleClose" size="50%">
    <div class="print_template">
      <p class="desc">打印模板</p>
      <el-card shadow="hover" v-for="item in templateSimple" class="card">
        <div class="ovh">
          <div class="fl">
            <p style="margin: 0;">{{ item.display_name }}</p>
            <p class="remark">描述:{{ item.note || '无'}}</p>
          </div>
          <div class="fr">
            <el-link :href="handleRouter(item)" target="_blank" class="el-button el-button--success el-button--mini" style="color: #fff; line-height: 14px;">查看</el-link>
            <!-- <el-button plain type="primary" size="mini" icon="el-icon-refresh" @click="refresh">打印</el-button> -->
          </div>
        </div>
      </el-card>
    </div>
  </el-drawer>
</template>
<script>
  import Print from 'print-js'
import { getSearchContract, getContract } from '@/api/commons'

export default {
  name: 'RightPanel',
  props: {
    showFlag: {
      type: Boolean
    },
    printData: {
      type: Object
    }
  },
  data() {
    return {
      showComponent: false,
      templateSimple: null //快递错误信息
    }
  },
  watch: {
    showFlag(newVal, oldVal) {
      if (newVal) {
        this.showComponent = true;
        //获取快递信息
        this.getTemplate();
      } else {
        this.showComponent = false;
        this.handleClose();
      }
    }
  },
  mounted() {},
  methods: {
    //获取快递列表
    getTemplate() {
      this.listLoading = true
      let tem = {
        entity_type: this.printData.entity_type
      }
      getSearchContract(tem).then(response => {
        if (response.code == 0) {
          this.templateSimple = response.data.page_datas
        }
      })
    },
    getContractData() {
      this.listLoading = true
      let tem = {
        entity_type: this.printData
      }
      getContract(tem).then(response => {
        if (response.code == 0) {
          this.templateSimple = response.data.page_datas
        }
      })
    },
    handleRouter(item) {
      let href = this.$router.resolve({
        path: '/sys/printTemplateSimpl',
        query: { type: this.printData.entity_type, rid: this.printData.rid, template_id: item.id }
      });
      // window.open(href.href, '_blank')
      return href.href;
    },
    handleClose() {
      this.showComponent = false;
      this.innerDrawer = false;
      this.$emit('closeChildDialog')
    }
  }
}

</script>
<style lang="scss" scoped>
.print_template {
  padding: 20px 30px;
  .card{
    position: relative;
    margin-bottom: 10px;
  }
  .bts{
    position: absolute;right: 20px;
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
