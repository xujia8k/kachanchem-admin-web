<template>
  <div>
    <el-drawer title="我是标题" :visible.sync="showComponent" :with-header="false" :before-close="handleClose" size="50%">
      <div class="print_template">
        <p class="desc">文件模板</p>
        <el-card shadow="hover" v-for="item in templateSimple" class="card">
          <div class="ovh">
            <div class="fl">
              <p style="margin: 0;">{{ item.display_name }}</p>
              <p class="remark">描述:{{ item.note || '无'}}</p>
            </div>
            <div class="fr">
              <!-- <el-link :href="handleRouter(item)" target="_blank" class="el-button el-button--success el-button--mini" style="color: #fff; line-height: 14px;">使用模板</el-link> -->
              <!-- <el-button plain type="primary" size="mini" icon="el-icon-refresh" @click="refresh">打印</el-button> -->
              <el-button plain type="success" size="mini" icon="el-icon-files" @click="getContractData(item)">使用模板</el-button>
            </div>
          </div>
        </el-card>
      </div>
    </el-drawer>
    <el-dialog title="模板设置" :visible.sync="dialogFormVisible" width="80%" :close-on-click-modal="false">
      <div class="ovh noprint mb10">
        <!-- <el-button type="primary" size="mini" @click="billPrintClick" id="no-print" class="fr mr20" v-if="setUp==false">打印</el-button> -->
        <div class="fll">
          <el-button-group>
            <el-button size="mini" plain @click="addTable1Row()" type="success">添加表头</el-button>
            <el-button size="mini" plain @click="delTable1Row()" type="danger">删除表头</el-button>
          </el-button-group>
        </div>
        <div class="flr">
          <el-button-group>
            <el-button size="mini" plain @click="addTable2Row()" type="success">添加检测项</el-button>
            <el-button size="mini" plain @click="delTable2Row()" type="danger">删除检测项</el-button>
          </el-button-group>
        </div>
      </div>
      <div id="PrintContent" contenteditable="true" style="padding: 18px;background-color: #f0f0f0;">
        <div class="book-title" v-html="contract"></div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible=false">
          取消
        </el-button>
        <el-button type="primary" @click="createData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import Print from 'print-js'
import { getSearchContract, getContract, uploadContractFile } from '@/api/commons'

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
      contract: null,
      setUp: false,//true开启打印模板配置
      dialogFormVisible: false,
      showComponent: false,
      template_id: null,//模板ID
      templateSimple: null
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
    // getContractData() {
    //   this.listLoading = true
    //   let tem = {
    //     entity_type: this.printData
    //   }
    //   getContract(tem).then(response => {
    //     if (response.code == 0) {
    //       this.templateSimple = response.data.page_datas
    //     }
    //   })
    // },
    handleRouter(item) {
      let href = this.$router.resolve({
        path: '/sys/coaTemplate',
        query: { type: this.printData.entity_type, rid: this.printData.rid, template_id: item.id }
      });
      // window.open(href.href, '_blank')
      return href.href;
    },
    handleClose() {
      this.showComponent = false;
      this.innerDrawer = false;
      this.$emit('closeChildDialog')
    },
    getContractData(item) {
      let that = this;
      that.template_id = item.id;
      let tem = {
        template_id: item.id,
        rid: this.printData.rid
      }
      getContract(tem).then(response => {
        if (response.code == 0) {
          that.dialogFormVisible = true;
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
    },
    addTable1Row() {
        let table1 = document.getElementById("table1");
        let row = document.createElement("tr");
        let td = [];
        for (let i = 0; i < 4; i++) {
            td[i] = document.createElement("td");
            td[i].innerHTML = '';
            if ((i + 1) % 2 != 0)
                td[i].setAttribute("style", "border-right: black 1px solid; border-bottom: black 1px solid; width: 15%;  padding:2px 10px;height: 24px;")
            else
                td[i].setAttribute("style", "border-right: black 1px solid; border-bottom: black 1px solid; width: 35%;  padding:2px 10px;height: 24px;")
            row.appendChild(td[i]);
        }
        table1.appendChild(row);
    },
    addTable2Row() {
        let table2 = document.getElementById("table2");
        let length = table2.rows.length;
        let row = table2.insertRow(length - 1);
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        cell1.innerHTML = "";
        cell2.innerHTML = "";
        cell3.innerHTML = "";
        cell1.setAttribute("style", "border-right: black 1px solid; border-bottom: black 1px solid; width: 20%; padding:  2px 10px;height: 24px;");
        cell2.setAttribute("style", "border-right: black 1px solid; border-bottom: black 1px solid; width: 60%; padding:  2px 10px;height: 24px;");
        cell3.setAttribute("style", "border-right: black 1px solid; border-bottom: black 1px solid;padding:2px 10px;height: 24px; ");

    },
    delTable1Row() {
        // let table1 = document.getElementById("table1").deleteRow(-1);debugger
        let table1 = document.getElementById("table1");
        let length = table1.rows.length;
        if (length > 2)
            table1.deleteRow(-1);

    },delTable2Row() {
        let table2 = document.getElementById("table2");
        let length = table2.rows.length;
        if (length > 3)
            table2.deleteRow(length - 2);

    },
    createData(){
      //上传模板附件
      let that = this;
      let tem = {
        template_id: that.template_id,//模板id
        rid: that.printData.rid,//表示详情页对象主键id
        rids: that.printData.rid,//表示对象主键id数组
        drid: that.printData.rid//表示对象明细主键id
      }
      uploadContractFile(tem).then(response => {
        if (response.code == 0) {
              that.$message({
                type: 'success',
                message: '成功设置模板!'
              });
              that.dialogFormVisible = false
        }
      })
    }
  }
}

</script>
<style lang="scss" scoped>
.print_template {
  padding: 20px 30px;

  .card {
    position: relative;
    margin-bottom: 10px;
  }

  .bts {
    position: absolute;
    right: 20px;
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
<style type="text/css">
@media screen and (-webkit-min-device-pixel-ratio: 0) {
  * {
    text-shadow: .01em .00em .0em #999 !important
  }
}

</style>
