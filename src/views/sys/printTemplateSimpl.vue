<template>
  <div class="app-container">
    <!-- <div class="imgAry" id="no-print">
      <el-image style="width: 100px; height: 100px" :src="img.src" v-for="img in imgAry" :key="img.id"></el-image>
    </div> -->
    <div class="ovh mb20">
      <el-button type="primary" size="mini" @click="billPrintClick" id="no-print" class="fr mr20" v-if="setUp==false">打印</el-button>
      <!-- <el-button type="success" size="mini" @click="exportWord" id="no-print" class="fr mr20" v-if="setUp==false">导出word文档</el-button> -->
    </div>
    <div id="PrintContent" contenteditable="true" style="padding: 18px;background-color: #f0f0f0;">
      <div class="preview" v-html="contract" ref="preview"></div>
    </div>
  </div>
</template>
<script>
  // import 'https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.js'
  // import $ from 'jquery'
  import print from 'print-js'
import { getSearchContract, getContract } from '@/api/commons'
import Pagination from '@/components/Pagination'

export default {
    name: 'ComplexTable',
    components: { Pagination },
    data() {
        return {
          Total: 4000,
          contract: null,
          setUp: false,//true开启打印模板配置
          imgAry: null
        }
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
      this.$nextTick(() => {
         var total_container = document.getElementById("total_value")
      var new_total = this.numberToChinese(total_container.innerHTML) + "(￥" + total_container.innerHTML+ ")";
      total_container.innerHTML=new_total;
        }) 
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
    },
    numberToChinese(str) {
        var num = parseFloat(str);
        var strOutput = ""
          , strUnit = "仟佰拾亿仟佰拾万仟佰拾元角分";
        num += "00";
        var intPos = num.indexOf(".");
        if (intPos >= 0) {
            num = num.substring(0, intPos) + num.substr(intPos + 1, 2)
        }
        strUnit = strUnit.substr(strUnit.length - num.length);
        for (var i = 0; i < num.length; i++) {
            strOutput += "零壹贰叁肆伍陆柒捌玖".substr(num.substr(i, 1), 1) + strUnit.substr(i, 1)
        }
        return strOutput.replace(/零角零分$/, "整").replace(/零[仟佰拾]/g, "零").replace(/零{2,}/g, "零").replace(/零([亿|万])/g, "$1").replace(/零+元/, "元").replace(/亿零{0,3}万/, "亿").replace(/^元/, "零元")
    }
    //导出word文档
    // exportWord() {
    //     let html =this.$refs.preview.outerHTML;
    //   var page = '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>' + html + '</body></html>'
    //   var converted = htmlDocx.asBlob(page);
    //   // 用 FielSaver.js里的保存方法 进行输出
    //   saveAs(converted, '合同.docx');
    //  // console.log(this.$refs.preview);
    // }
  }
}

</script>
<style type="text/css">
@media screen and (-webkit-min-device-pixel-ratio: 0) {
  * {
    text-shadow: .01em .00em .0em #999 !important
  }
}

</style>
