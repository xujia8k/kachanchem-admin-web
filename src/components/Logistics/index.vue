<template>
  <el-drawer title="我是标题" :visible.sync="showComponent" :with-header="false" :before-close="handleClose" size="50%">
    <div v-if="has_logi_info">
      <el-row :gutter="20">
        <el-col :span="20" class='tr mt20'>
          <el-button type="success" @click="addExpress()">
            新增快递信息
          </el-button>
          <el-button type="danger" @click="delExpress()">
            删除
          </el-button>
        </el-col>
        <el-col :span="20">
          <!-- 快递信息 -->
          <div class="showLogistics">
            <el-radio-group v-model="showLogistics" @change="changeLogistics">
              <el-radio :label="index" v-for="(item, index) in logisticsInfo" :key="index">{{ item.express_name }}{{ item.courier_num }}</el-radio>
            </el-radio-group>
          </div>
          <span style="display: block;text-align: center;margin: 50px auto" v-if="activities && activities.length == 0">{{query_message}}，<span style="color: #9B1C1C">请检查快递单号和物流公司是否正确！</span></span>
          <el-timeline :reverse="reverse" v-else>
            <el-timeline-item v-for="(activity, index) in activities" :key="index" :timestamp="activity.time">
              {{activity.context}}
            </el-timeline-item>
          </el-timeline>
        </el-col>
      </el-row>
    </div>
    <div v-else>
      <span style="display: block;text-align: center;margin: 50px auto">暂无关联的快递记录</span>
       
      <el-form label-width="80px" style="width: 100%;margin-left: 20px" label-position="right" :rules="rules" :model="temp2" ref="dataForm">
       <el-row :gutter="20">
          <el-col :span="20" :offset="2">
            <el-form-item label="快递单号" prop="courier_num">
              <el-input v-model="temp2.courier_num"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20" :offset="2">
            <el-form-item label="快递公司" prop="express_code">
              <el-select v-model="temp2.express_code" placeholder="快递公司" style="width: 100%;" @change="changeExpress">
                <el-option v-for="item in retchProvincesList" :key="item.value" :label="item.key" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="20" :offset="2" v-if="showPhone">
            <el-form-item label="手机号码">
              <el-input v-model="temp2.phone"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20" :offset="2" class='tr'>
            <el-button type="primary" @click="createLogistics">
              确认
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-drawer title="新增快递信息" :append-to-body="true" :before-close="handleClose2" :visible.sync="innerDrawer">
      <el-form label-width="80px" label-position="right" :rules="rules" :model="temp2" ref="dataForm">
        <el-row :gutter="20">
          <el-col :span="20" :offset="2">
            <el-form-item label="快递单号" prop="courier_num">
              <el-input v-model="temp2.courier_num"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20" :offset="2">
            <el-form-item label="快递公司" prop="express_code">
              <el-select v-model="temp2.express_code" placeholder="快递公司" style="width: 100%;" @change="changeExpress">
                <el-option v-for="item in retchProvincesList" :key="item.value" :label="item.key" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="20" :offset="2" v-if="showPhone">
            <el-form-item label="手机号码">
              <el-input v-model="temp2.phone"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20" :offset="2" class='tr'>
            <el-button type="primary" @click="createLogistics">
              确认
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-drawer>
  </el-drawer>
</template>
<script>
import { fetchProvinces, enterLogisticsInformation, deleteLogisticsInfo, queryExpress, getLogisticsInfo } from '@/api/commons'

export default {
  name: 'RightPanel',
  props: {
    showFlag: {
      type: Boolean
    },
    expressData: {
      type: Object
    }
  },
  data() {
    return {
      query_message: null, //快递错误信息
      innerDrawer: false, //显示新增快递信息
      showLogistics: 0, //显示的物流信息
      showComponent: false,
      reverse: true,
      has_logi_info: null, //是否有快递信息
      showPhone: false, //快递信息录入是否输入手机号
      logisticsInfo: [], //快递新消息
      retchProvincesList: null,
      isShowExpress: false, //是否显示快递信息
      temp2: {}, //存放物流信息
      activities: null,
      isShowExpress: false, //是否显示快递信息
      rules: {
        courier_num: [{ required: true, message: '快递单号不能为空', trigger: 'blur' }],
        express_code: [{ required: true, message: '快递公司不能为空', trigger: 'blur' }]
      }
    }
  },
  watch: {
    showFlag(newVal, oldVal) {
      // newVal ? this.showComponent = true : this.showComponent = false;
      if (newVal) {
        this.showComponent = true;
        if (this.expressData.has_logi_info == 1) {
          //查询快递信息
          this.showExpress();
        } else {
          this.has_logi_info == 0;
        }
        //获取快递信息
        this.getFetchProvincesList();
      } else {
        this.showComponent = false;
        this.handleClose();
      }
    }
  },
  mounted() {
    //查询快递信息
    this.showExpress();
    //获取快递信息
    this.getFetchProvincesList();
  },
  methods: {
    //获取快递列表
    getFetchProvincesList() {
      fetchProvinces().then(response => {
        let tem = [];
        for (let i in response.data.express_companies) {
          let o = {};
          o.value = response.data.express_companies[i];
          o.key = i;
          tem.push(o)
        }
        this.retchProvincesList = tem
      })
    },
    //录入物流信息
    createLogistics() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp2.entity_id = this.expressData.id;
          this.temp2.entity_type = this.expressData.entity_type;
          enterLogisticsInformation(this.temp2).then(response => {
            this.handleClose();
            this.$notify({
              title: '提示信息',
              message: '物流信息录入成功！',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    async showExpress() {
      this.isShowExpress = true
      if(this.expressData){
        let tem = {
          entity_type: this.expressData.entity_type,
          entity_id: this.expressData.id,
        }
        //查询快递信息
        await getLogisticsInfo(tem).then(response => {
          if (response.data.page_datas) {
            this.logistics_info_id = response.data.page_datas[0].logistics_info_id;
            this.logisticsInfo = response.data.page_datas
            this.getQueryExpress()
          }
        })
      }
    },
    //查询快递信息
    async getQueryExpress() {
      let tem = {
        logistics_info_id: this.logistics_info_id
      }
      await queryExpress(tem).then(response => {
        this.has_logi_info = 1;
        this.activities = response.data.logistics_infos
        this.query_message = response.data.query_message
      })
    },
    changeLogistics(value) {
      //切换快递信息
      this.logistics_info_id = this.logisticsInfo[value].logistics_info_id;
      this.getQueryExpress()
    },
    //删除快递信息
    delExpress(item) {
      let tem = {
        logistics_info_id: this.logistics_info_id
      }
      deleteLogisticsInfo(tem).then(response => {

        if (response.code == 0) {
          this.handleClose();
          this.$message({
            type: 'success',
            message: '成功删除快递信息!'
          });
          this.showLogistics = 0;
          this.query_message = null;
          this.logisticsInfo = null;
          this.activities = null;
          // this.activities = response.data.logistics_infos

        }
      })
    },
    //新增快递信息
    addExpress(item) {
      this.innerDrawer = true
      //获取快递信息
      this.getFetchProvincesList();
    },
    changeExpress(val) {
      val == 'shunfengkuaiyun' || val == 'shunfeng' ? this.showPhone = true : this.showPhone = false
      let obj = {};
      obj = this.retchProvincesList.find((item) => {
        return item.value === val; //筛选出匹配数据
      });
      this.temp2.express_name = obj.key;
    },
    handleClose() {
      this.showComponent = false;
      this.innerDrawer = false;
      this.temp2 = {};
      this.showLogistics = 0;
      this.has_logi_info = '';
      this.activities = '';
      this.$emit('closeChildDialog')
    },
    handleClose2() {
      this.innerDrawer = false;
      this.temp2 = {};
    }
  }
}

</script>
<style>
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

</style>
