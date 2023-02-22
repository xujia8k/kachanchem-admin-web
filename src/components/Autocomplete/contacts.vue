<template>
  <!-- 公司联系人信息搜索 -->
  <el-autocomplete v-model="contacts_name" :fetch-suggestions="querySearchAsync" placeholder="请输入公司联系人" :trigger-on-focus="false" @select="handleSelect">
    <template slot-scope="{ item }">
      <div>
        <span style="float: left;margin-right:15px;color: #5c85ad; font-size: 14px" v-if="item.company_name">公司名称:{{ item.company_name }}</span>
        <span style="float: left;margin-right:15px;color: #FFBA00; font-size: 14px" v-if="item.value">客户名称:{{ item.value }}</span>
        <span style="float: left;margin-right:15px;color: #1C9B70;font-size: 14px" v-if="item.tel">电话:{{ item.tel }}</span>
      </div>
    </template>
  </el-autocomplete>
</template>
<script>
import { mapState } from 'vuex';
import { searchCustomer } from '@/api/remote-search'
import Pagination from '@/components/Pagination'
export default {
  props: {
    userId: {
      default: '',
      type: String
    },
    state: {
      default: '',
      type: String
    }
  },
  data() {
    return {
      contacts_name: this.state
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
        searchCustomer(tempData).then(response => {
          let callBackArr = [];
          let res = response.data.page_datas;
          res.forEach((item) => {
            // if (item.name_cn.indexOf(queryString) > -1) {
            callBackArr.push({
              value: item.company_name+'_'+item.first_name+item.last_name,
              tel: item.phone,
              email: item.email,
              id: item.id,
              company_name: item.company_name || item.company_name_cn,
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
      this.$store.commit("user/SET_CONTACTS_INFO", item);
    }
  },
  destroyed() {
    this.state = '';
  }
};

</script>
