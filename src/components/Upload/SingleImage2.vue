<template>
  <div class="upload-container">
    <el-upload class="upload-demo" :data="dataObj" drag :action="upload_qiniu_url" :show-file-list="false" :on-success="handleImageSuccess" :on-error="handleError" :before-upload="beforeUpload" :headers="headers">
      <a v-if="fileUrl" :href="fileUrl" download>{{fileUrl}}</a>
      <div v-else class="el-default">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </div>
    </el-upload>
  </div>
</template>
<script>
// import { getToken, uploadAttachment } from '@/api/qiniu'

import { uploadAttachment } from '@/api/commons'

import { getName, getToken } from '@/utils/auth'

export default {
  name: 'SingleImageUpload',
  props: {
    value: {
      type: String,
      default: ''
    },
    id: {
      type: Number,
      default: ''
    },
    attachmentEntityType: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      upload_qiniu_url:process.env.VUE_APP_BASE_API+"/api/admin/v1/commons/upload_attachment",
      headers:{
        Authorization:getToken()
      },
      dataObj:{
        file:'',
        attachment_entity_type:'',
        attachment_entity_id:'',
        customize_type:'',
      },
      tempUrl: ''
    }
  },
  computed: {
    fileUrl() {
      return this.value
    }
  },
  methods: {
    rmIme() {
      this.emitInput('')
    },
    emitInput(val) {
      this.$emit('input', val)
    },
    handleImageSuccess(response, file) {
      this.emitInput(URL.createObjectURL(file.raw))
      if(this.type == "COA"){
        this.$store.commit("user/SET_ATTACHMENT_COA", this.dataObj.file);
      }else if(this.type == "MSDS"){
        this.$store.commit("user/SET_ATTACHMENT_MSDS", this.dataObj.file);
      }else if(this.type == "TestReport"){
        this.$store.commit("user/SET_ATTACHMENT_TEST_REPORT", this.dataObj.file);
      }else{
        this.$store.commit("user/SET_ATTACHMENT", this.dataObj.file);
      }
    },
    handleError: function(res) {
      this.$message({
        message: "上传失败",
        duration: 2000,
        type: "warning"
      });
    },
    beforeUpload(file) {
      // const isJPG = file.type === 'image/jpeg';
      // const isPNG = file.type === 'image/png';
      // const isLt2M = file.size / 1024 / 1024 < 2;

      // if (isJPG == isPNG) {
      //   this.$message.error('上传图片只能是 JPG/PNG 格式!');
      //   return false
      // }
      // if (!isLt2M) {
      //   this.$message.error('上传图片大小不能超过 2MB!');
      //   return false;
      // }
      this.dataObj.file = this.value;
      this.dataObj.attachment_entity_type = this.attachmentEntityType||'';
      this.dataObj.attachment_entity_id = this.id;
      this.dataObj.customize_type = this.type || '';
    }
  }
};

</script>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.upload-container {
  width: 100%;
  position: relative;
  @include clearfix;

  .image-uploader {
    width: 60%;
    float: left;
  }

  .img {
    object-fit: contain;
    vertical-align: top;
    width: 100%;
    height: 100%;
  }

  .image-preview {
    width: 200px;
    height: 200px;
    position: relative;
    border: 1px dashed #d9d9d9;
    float: left;
    margin-left: 50px;

    .image-preview-wrapper {
      position: relative;
      width: 100%;
      height: 100%;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .image-preview-action {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      cursor: default;
      text-align: center;
      color: #fff;
      opacity: 0;
      font-size: 20px;
      background-color: rgba(0, 0, 0, .5);
      transition: opacity .3s;
      cursor: pointer;
      text-align: center;
      line-height: 200px;

      .el-icon-delete {
        font-size: 36px;
      }
    }

    &:hover {
      .image-preview-action {
        opacity: 1;
      }
    }
  }
}

</style>
