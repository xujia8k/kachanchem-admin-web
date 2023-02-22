<template>
  <div class="app-container">
    <!-- <div class="imgAry" id="no-print">
      <el-image style="width: 100px; height: 100px" :src="img.src" v-for="img in imgAry" :key="img.id"></el-image>
    </div> -->
    <div class="ovh mb20">
      <el-button type="primary" size="mini" @click="billPrintClick" id="no-print" class="fr mr20" v-if="setUp==false">打印</el-button>
    </div>
    <div id="PrintContent" contenteditable="true" style="padding: 18px;background-color: #f0f0f0;">
      <div class="book-title" v-html="contract"></div>
    </div>
  </div>
</template>
<script>
  import print from 'print-js'
import { getSearchContract, getContract } from '@/api/commons'
import Pagination from '@/components/Pagination'

export default {
    name: 'ComplexTable',
    components: { Pagination },
    data() {
    return {
      contract: null,
      setUp: false,//true开启打印模板配置
      imgAry: null
    }
    },
    mounted:function () {
        // let that = this;
        // if (that.$route.query.rid) {
        //     this.getContractData(that.$route.query)
        // } else {
        //     this.$notify({
        //         title: '提示信息',
        //         message: '获取失败请从新获取！',
        //         type: 'error',
        //         duration: 4000
        //     })
        // }
    },
  created() {
    let that = this;
    if (that.$route.query.rid) {
      this.getContractData(that.$route.query)
    } else {
      this.$notify({
        title: '提示信息',
        message: '获取失败请从新获取！',
        type: 'error',
        duration: 4000
      })
    }

  },
  methods: {
    getContractData() {
      let that = this;
      that.listLoading = true
      let tem = {
        template_id: that.$route.query.template_id,
        rid: that.$route.query.rid
      }
      getContract(tem).then(response => {
        if (response.code == 0) {

          that.contract = response.data.html_config
          that.imgAry = response.data.img_label_ary
        }
      })
    },
    billPrintClick() {
      const style = '@page {margin:0};'
      printJS({
        printable: 'PrintContent',
        type: 'html',
        header: '',
        scanStyles: false,
        targetStyles: ['*'],
        style
      });
    },
    handleSetUp() {
      this.setUp=true;
    }
  }
}

</script>

