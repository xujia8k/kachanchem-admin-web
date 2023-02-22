<template>
  <!-- 收付款账户信息 -->
  <el-autocomplete v-model="state" :fetch-suggestions="querySearchAsync" placeholder="请输入收付款账户" :trigger-on-focus="false" @select="handleSelect"></el-autocomplete>
</template>
<script>
import { mapState } from 'vuex';
import { accountsList } from '@/api/remote-search'
import Pagination from '@/components/Pagination'
export default {
  props: {
    userId: {
      default: '',
      type: String
    }
  },
  data() {
    return {
      state: ''
    };
  },
  methods: {
    querySearchAsync(queryString, cb) {
      if (queryString != "") {
        const tempData = {
          account_name: queryString,
          page: 1,
          limit: 50
        }
        accountsList(tempData).then(response => {
          let callBackArr = [];
          let res = response.data.page_datas;
          res.forEach((item) => {
            // if (item.name_cn.indexOf(queryString) > -1) {
            callBackArr.push({
              value: item.account_name,
              id: item.id,
              finance_account_id: item.id,
              account_name: item.account_name,
              is_default: item.is_default
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
      this.$store.commit("user/SET_ACCOUNTS_INFO", item);
    }
  },
  destroyed() {
    this.state = '';
  }
};

</script>
