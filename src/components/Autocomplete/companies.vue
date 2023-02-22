<template>
  <!-- 供应商信息 -->
  <el-autocomplete v-model="supplier_name" :fetch-suggestions="querySearchAsync" placeholder="请输入供应商名字" :trigger-on-focus="false" @select="handleSelect" v-if="isShow"></el-autocomplete>
</template>
<script>
import { mapState } from 'vuex';
import { vendorList } from '@/api/remote-search'
import Pagination from '@/components/Pagination'
export default {
  props: {
    disabled: {
      default: true,
      type: Boolean
    },
    state: {
      default: '',
      type: String
    }
  },
  watch: {
    disabled(newVal, oldVal) {
      // console.log("newVal--",newVal)
      this.isShow = newVal;
    },
    state(newVal, oldVal) {
      // console.log("state--",newVal)
      this.supplier_name = newVal;
    }
  },
  data() {
    return {
      supplier_name: this.state,
      isShow: this.disabled
    };
  },
  methods: {
    querySearchAsync(queryString, cb) {
      if (queryString != "") {
        const tempData = {
          q: queryString,
          page: 1,
          limit: 50
        }
        vendorList(tempData).then(response => {
          let callBackArr = [];
          let res = response.data.page_datas;
          res.forEach((item) => {
            callBackArr.push({
              value: item.name_cn,
              id: item.id,
            });
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
      this.$store.commit("user/SET_COMPANIES_INFO", item);
    }
  },
  destroyed() {
    this.state = '';
  }
};

</script>
