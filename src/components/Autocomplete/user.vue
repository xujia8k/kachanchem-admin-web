<template>
    <!-- 用户信息 -->
  <el-autocomplete v-model="user_Id" :fetch-suggestions="querySearchAsync" placeholder="请输入公司名称,并在下拉框中选中" :trigger-on-focus="false" @select="handleSelect"></el-autocomplete>
</template>
<script>
import { mapState } from 'vuex';
import { searchUser } from '@/api/remote-search'
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
      user_Id: this.userId
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
        searchUser(tempData).then(response => {
          let callBackArr = [];
          let res = response.data.page_datas;
          res.forEach((item) => {
            // if (item.name_cn.indexOf(queryString) > -1) {
            callBackArr.push({
              value: item.name_cn,
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
      this.$store.commit("user/SET_CUSTOMER_INFO", item);
    }
  },
  destroyed() {
    this.user_Id = '';
    this.$store.commit("user/SET_CUSTOMER_INFO", '');
  }
};

</script>
