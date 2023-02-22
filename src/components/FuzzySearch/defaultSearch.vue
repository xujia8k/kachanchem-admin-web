<template>
  <div>
    <el-form :inline="true" :model="data" class="demo-form-inline" v-if="data.length>0">
        <div class="dib" v-for="(item,index) in data" :label="item.name" :key="index">
          <el-form-item v-if="item.view_type==='text' || item.view_type==='文本框'">
            <el-input v-model="item.default_value" style="width:200px" :placeholder="'请输入'+item.name" />
          </el-form-item>
          <el-form-item v-else-if="item.view_type==='select' || item.view_type==='下拉框'" :label="item.name">
            <el-select v-model="item.default_value">
              <el-option v-for="(opt, index) in item.view_value" :key="index" :value="opt.key" :label="opt.label" />
            </el-select>
          </el-form-item>
          <el-form-item v-else-if="item.view_type==='time' || item.view_type==='时间框'" :label="item.name">
            <el-date-picker v-model="item.default_value" type="date" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
        </div>
        <el-form-item>
            <el-button type="primary" @click="handleSearch" class="filter-item">
              查询
            </el-button>
        </el-form-item>
    </el-form>
  </div>
</template>
<script>
import Moment from 'moment'
export default {
  name: "fuzzySearch",
  props: {
    data: {
      type: Object,
      default () {
        return { formItems: [] };
      }
    },
  },
  data() {
    return {};
  },
  watch: {},
  methods: {
    handleSearch() {
      let self = this;
      let searchParams = [];
      let params = {};
      searchParams = self.data;
      for (let i in searchParams) {
        let value = searchParams[i].default_value;
        if (!value || value === "") { //去除空值
          if (typeof(value) != "boolean") { //布尔值需要保留
            continue;
          }
        }
        params[searchParams[i].key] = value;
      }
      // console.log('params---',params)
      this.$emit("fuzzySearch", params);
    },
  }
};

</script>
