<template>
    <!-- 员工信息 -->
  <el-autocomplete v-model="company_Name" :fetch-suggestions="querySearchAsync" placeholder="请输入员工信息,并在下拉框中选中" :trigger-on-focus="false" @select="handleSelect"></el-autocomplete>
</template>
<script>
import { mapState } from 'vuex';
import { fetchList } from '@/api/hr'
import Pagination from '@/components/Pagination'
export default { 
  model: {
    prop: 'companyName',
    event: 'change-data'
  },
  props: {
    companyId: {
      default: '',
      type: Number
    },
    companyName: {
      default: '',
      type: String
    }
  },
  watch: {
    companyName(newVal, oldVal) {
      console.log('newVal---',newVal)
      this.company_Name =newVal
    }
  },
  data() {
    return {
      company_Id: this.companyId,
      company_Name: this.companyName
    };
  },
  methods: {
    querySearchAsync(queryString, cb) {
      if (queryString != "") {
        const tempData = {
          name: queryString,
          page: 1,
          limit: 50
        }
        fetchList(tempData).then(response => {
          let callBackArr = [];
          let res = response.data.page_datas;
          res.forEach((item) => {
            // if (item.name_cn.indexOf(queryString) > -1) {
            callBackArr.push({
              value: item.name,
              id: item.id,
            });
            // }
          });
          if (callBackArr.length == 0) {
            cb([{ value: "暂无数据", id: "暂无数据" }]);
          } else {
            cb(callBackArr);
          }
        })
      }
    },
    handleSelect(item) {
      this.$store.commit("user/SET_EMPLOYEES_INFO", item);
      this.$emit('change-data', item)
    }
  },
  destroyed() {
    this.company_Id = '';
  }
};

</script>
