<template>
  <el-drawer title="表格视图设置" :visible.sync="showComponent" :with-header="false" :before-close="handleClose" size="30%">
    <div class="setView_head">
      <div class="fl">
        <p class="title">表格视图设置</p>
        <p class="describe">注：按需调整列、筛选条件的显示与隐藏，仅对您个人生效</p>
      </div>
      <el-button plain type="success" icon="el-icon-check" @click="" class="fr" style="margin-top: 1rem;" @click="updateEmployeeSetting">
        保存设置
      </el-button>
    </div>
    <div class="setView">
      <div class="section_title">
        筛选条件 显示/隐藏
      </div>
      <el-checkbox-group v-model="check_search_terms" v-if="viewData">
        <el-row :gutter="20">
          <el-col :span="8" :xs="24" v-for="(value, key, index) in viewData.search_terms" :key="index">
            <el-checkbox :label="key">{{key}}</el-checkbox>
          </el-col>
        </el-row>
      </el-checkbox-group>
      <div class="section_title">
        表格列 显示/隐藏
      </div>
      <el-checkbox-group v-model="check_list_terms" v-if="viewData">
        <el-row :gutter="20">
          <el-col :span="8" :xs="24" v-for="(value, key, index) in viewData.list_terms" :key="index">
            <el-checkbox :label="key">{{key}}</el-checkbox>
          </el-col>
        </el-row>
      </el-checkbox-group>
    </div>
  </el-drawer>
</template>
<script>
import { getEmployeeSetting, updateEmployeeSetting } from '@/api/commons'

export default {
  name: 'setView',
  components: {},
  props: {
    showFlag: {
      type: Boolean
    },
    viewData: {
      type: Object
    }
  },
  data() {
    return {
      check_search_terms: [],
      check_list_terms: [],
      showComponent: false,
      SettingList: null,
    }
  },
  watch: {
    showFlag(newVal, oldVal) {
      if (newVal) {
        this.showComponent = true;
        this.getEmployeeSetting()
      } else {
        this.showComponent = false;
        this.handleClose();
      }
    }
  },
  mounted() {},
  methods: {
    getEmployeeSetting() {
      let tempData = {
        apply_module_name: this.viewData.name
      }
      getEmployeeSetting(tempData).then(response => {
        if (response.code == 0) {
          let data = response.data
          //用户设置过视图
          if (data.id) {
            this.SettingList = data
            this.check_search_terms = data.search_terms
            this.check_list_terms = data.list_terms
            //设置搜索勾选项值
            // if (data.search_terms) {
            //   let tem1 = [];
            //   for (var i in data.search_terms) {
            //     tem1.push(i)
            //   }
            //   this.check_search_terms = tem1
            //   console.log("tem1--",tem1)
            //   console.log("check_search_terms--",this.check_search_terms)
            // }
            // //设置列表勾选项值
            // if (data.list_terms) {
            //   let tem2 = [];
            //   for (var i in data.list_terms) {
            //     tem2.push(i)
            //   }
            //   this.check_list_terms = tem2
            //   console.log("tem2--",tem2)
            //   console.log("check_list_terms--",this.check_list_terms)
            // }
          } else {
            //设置搜索勾选项值
            if (this.viewData.search_terms) {
              let tem1 = [];
              for (var i in this.viewData.search_terms) {
                tem1.push(i)
              }
              this.check_search_terms = tem1
            }
            //设置列表勾选项值
            if (this.viewData.list_terms) {
              let tem2 = [];
              for (var i in this.viewData.list_terms) {
                tem2.push(i)
              }
              this.check_list_terms = tem2
            }
          }
        }
      })
    },
    //更新用户个人设置
    updateEmployeeSetting() {
      if (this.check_list_terms.length <1) {
          this.$message({
            type: 'success',
            message: '请勾选表格列!'
          });
          return;
        }
      let tempData = {
        apply_module_name: this.viewData.name,
        use_default: this.viewData.use_default, //是否使用默认配置，1-是，0-否
        search_terms_setting: this.check_search_terms, //传用户勾选的页面筛选条件配置项，key为筛选条件中文名称，value为列表接口对应该筛选条件提供的搜索条件值
        list_terms_setting: this.check_list_terms //传用户勾选的页面表格列配置项,key为列中文名称，value为列对应列表接口的返回值
      }
      updateEmployeeSetting(tempData).then(response => {
        if (response.code == 0) {
          this.$message({
            type: 'success',
            message: '视图保存成功!'
          });
          this.handleClose();
            this.$emit('closeChange', this.check_search_terms,this.check_list_terms)
        }
      })
    },
    handleClose() {
        this.showComponent = false;
        this.temp = {};
        this.$emit('closeChildDialog')
    },
    closeViewer() {
      this.showViewer = false
    }
  }
}

</script>
<style lang="scss" scoped>
.setView_head {
  overflow: hidden;
  padding: 0 30px;
  border-bottom: 1px solid #ddd;

  .title {
    color: #333;
    font-weight: bold;
  }

  .describe {
    font-size: 12px;
    color: red
  }
}

.setView {
  padding: 0 30px;

  .section_title {
    font-size: 12px;
    color: #666;
    font-weight: bold;
    margin-top: 24px;
    margin-bottom: 8px;
  }
}

</style>
