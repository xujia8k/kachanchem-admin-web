<template>
  <el-drawer title="附件" :visible.sync="showComponent" :with-header="false" :before-close="handleClose" size="30%">
    <div class="main">
    <div v-if="has_data">
      <el-row type="flex" class="row-bg mb20 mr20" justify="end">
        <el-col :span="10" class='tr mt20'>
          <el-button type="success" @click="addAnnex()">
            新增附件
          </el-button>
        </el-col>
      </el-row>
      <p style="color: red;" v-if="annexList.length>0">注：点击文件名可预览/下载</p>
      <el-row  :gutter="20">
        <el-col :span="12" v-for="(item, index) in annexList" :key="item">
          <el-card :body-style="{ padding: '0' }" class="mb10">
            <el-image-viewer v-if="showViewer" :on-close="closeViewer" :url-list="srcList" />
            <el-image :src="item.path" @click="onPreview(item.path)" :fit="contain" class="image"></el-image>
            <div style="padding: 14px;border-top: 1px solid #eee;">
              <!-- <span>{{item.name}}</span> -->
              <a class="el-upload-list__item-name" :href="item.path" :download="item.path">{{item.name}}
                    </a>
              <div class="bottom clearfix">
                <time class="time">上传人：{{item.up_name}}</time>
                <el-button type="text" size="mini" class="fr p0 c-red" @click="delAnnex(item)"  v-if="annexData.type != 'CustomerOrder'">删除</el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div v-else>
      <span style="display: block;text-align: center;margin: 50px auto"></span>
      <el-form label-width="80px" label-position="right" :model="temp" ref="dataForm">
        <el-row :gutter="24">
          <el-col :span="22">
            <el-form-item label="附件">
              <Upload v-model="temp.attachment_id" :id="temp.attachment_id" :value="temp.attachment_id" />
            </el-form-item>
          </el-col>
          <el-col :span="22" class='tr'>
            <el-button type="primary" @click="createAnnex">
              提交
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-drawer title="上传附件" :append-to-body="true" :before-close="handleClose2" :visible.sync="innerDrawer">
      <el-form label-width="80px" label-position="right" :model="temp" ref="dataForm">
        <el-row :gutter="24">
          <el-col :span="22">
            <el-form-item label="附件">
              <Upload v-model="temp.attachment_id" :id="temp.attachment_id" :value="temp.attachment_id" />
            </el-form-item>
          </el-col>
          <el-col :span="22" class='tr'>
            <el-button type="primary" @click="createAnnex">
              提交
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-drawer>
    </div>
  </el-drawer>
</template>
<script>
import { getAttachmentList } from '@/api/commons'
import { PO_relate_attachment, PO_delete_attachment, FP_relate_attachment, FP_delete_attachment } from '@/api/annex'
import Upload from '@/components/Upload/SingleImage'
import ElImageViewer from "element-ui/packages/image/src/image-viewer";

export default {
  name: 'RightPanel',
  components: { Upload, ElImageViewer },
  props: {
    showFlag: {
      type: Boolean
    },
    annexData: {
      type: Boolean
    }
  },
  data() {
    return {
      showComponent: false,
      innerDrawer: false, //子组件是否显示
      annexList: false, //子组件是否显示
      has_data: false,
      srcList: [],
      showViewer: false,
      temp: {
        attachment_id: null
      }
    }
  },
  watch: {
    showFlag(newVal, oldVal) {
      // newVal ? this.showComponent = true : this.showComponent = false;
      if (newVal) {
        this.showComponent = true;
        //获取快递信息
        this.getAttachmentList();
      } else {
        this.showComponent = false;
        this.handleClose();
      }
    }
  },
  mounted() {},
  methods: {
    //获取附件列表
    getAttachmentList() {
      // const tempData = Object.assign({}, this.annexData)
      let tempData = {
        attachment_entity_type: this.annexData.type,
        attachment_entity_id: this.annexData.id
      }
      getAttachmentList(tempData).then(response => {
        if (response.code == 0) {
          let data = response.data.page_datas
          this.annexList = data
          // data.length > 0 ? this.has_data = true : this.has_data = false;
          //销售订单不显示上传
          // debugger
          if(data.length > 0 || this.annexData.type == 'CustomerOrder'){
            this.has_data = true
          }else{
            this.has_data = false
          }
          // for (const v of this.data) {
          //     this.srcList.push(v.path)
          //   }
        }
      })
    },
    //关联附件
    createAnnex() {
      if (!this.$store.state.user.attachmentId) {
        this.$notify({
          title: '提示信息',
          message: '请上传附件！',
          type: 'error',
          duration: 4000
        })
        return;
      }
      this.temp.attachment_id = this.$store.state.user.attachmentId;
      const tempData = Object.assign({}, this.temp)
      //采购订单
      if (this.annexData.type == 'Order') {
        PO_relate_attachment(this.annexData.id, tempData).then(response => {
          if (response.code == 0) {
            this.handleClose();
            this.$notify({
              title: '提示信息',
              message: '成功关联附件',
              type: 'success',
              duration: 2000
            })
          }
        })
      } else if (this.annexData.type == 'CustomerOrder') {
      //   let tempData = {
      //   attachment_entity_type: this.annexData.type,
      //   attachment_entity_id: this.annexData.id
      // }
      //   //销售订单
      //   uploadAttachment(this.annexData.id, tempData).then(response => {
      //     if (response.code == 0) {
      //       this.handleClose();
      //       this.$notify({
      //         title: '提示信息',
      //         message: '成功关联附件',
      //         type: 'success',
      //         duration: 2000
      //       })
      //     }
      //   })
      } else {
        // 关联付款单附件
        FP_relate_attachment(this.annexData.id, tempData).then(response => {
          if (response.code == 0) {
            this.handleClose();
            this.$notify({
              title: '提示信息',
              message: '成功关联附件',
              type: 'success',
              duration: 2000
            })
          }
        })
      }

    },
    //删除附件信息
    delAnnex(item) {
      let tem = {
        attachment_id: item.id
      }
      if (this.annexData.type == 'Order') {
        PO_delete_attachment(this.annexData.id, tem).then(response => {
          if (response.code == 0) {
            this.$message({
              type: 'success',
              message: '成功删除附件信息!'
            });
            this.activities = response.data.logistics_infos
            this.handleClose();
          }
        })
      } else {
        FP_delete_attachment(this.annexData.id, tem).then(response => {
          if (response.code == 0) {
            this.$message({
              type: 'success',
              message: '成功删除附件信息!'
            });
            this.activities = response.data.logistics_infos
            this.handleClose();
          }
        })
      }
    },
    //新增附件信息
    addAnnex(item) {
      this.innerDrawer = true
    },
    handleClose() {
      this.showComponent = false;
      this.innerDrawer = false;
      this.temp = {};
      this.$emit('closeChildDialog')
      this.$store.commit("user/SET_ATTACHMENT_Id", '');
    },
    handleClose2() {
      this.innerDrawer = false;
      this.temp = {};
      this.$store.commit("user/SET_ATTACHMENT_Id", '');
    },
    onPreview(img) {
      this.srcList = [];
      this.srcList.push(img)
      this.showViewer = true
    },
    closeViewer() {
      this.showViewer = false
    }
  }
}

</script>
<style>
.main{
  padding:0 30px;
}
.showRightPanel {
  overflow: hidden;
  position: relative;
  width: calc(100% - 15px);
}

</style>
<style lang="scss" scoped>
.rightPanel-background {
  position: fixed;
  top: 0;
  left: 0;
  opacity: 0;
  transition: opacity 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
  background: rgba(0, 0, 0, 0.2);
  z-index: -1;
}

.rightPanel {
  width: 100%;
  max-width: 260px;
  height: 100vh;
  position: fixed;
  top: 0;
  right: 0;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.05);
  transition: all 0.25s cubic-bezier(0.7, 0.3, 0.1, 1);
  transform: translate(100%);
  background: #fff;
  z-index: 40000;
}

.show {
  transition: all 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);

  .rightPanel-background {
    z-index: 20000;
    opacity: 1;
    width: 100%;
    height: 100%;
  }

  .rightPanel {
    transform: translate(0);
  }
}

.showLogistics {
  margin: 40px auto;
  text-align: center;
}

.showLogistics .el-radio__label {
  font-size: 24px;
}

.handle-button {
  width: 40px;
  height: 40px;
  position: absolute;
  left: -40px;
  text-align: center;
  font-size: 24px;
  border-radius: 8px 0 0 8px !important;
  z-index: 0;
  pointer-events: auto;
  cursor: pointer;
  color: #fff;
  line-height: 40px;

  i {
    font-size: 22px;
    line-height: 40px;
  }
}

.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  height: 151px;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

</style>
