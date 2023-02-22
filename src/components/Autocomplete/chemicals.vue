<template>
  <!-- 化学品 -->
  <el-autocomplete v-model="currentSearch" :fetch-suggestions="querySearchAsync" placeholder="请输入内容" :trigger-on-focus="false" @select="handleSelect" :debounce="800">
    <template slot-scope="{ item }">
      <div>
        <span style="float: left">{{ item.name }}</span>
        <span style="float: left;margin-left:15px;color: #1C9B70;">{{ item.name_cn }}</span>
        <span style="float: left;margin-left:15px;color: #FFBA00; font-size: 13px">{{ item.cas }}</span>
      </div>
    </template>
  </el-autocomplete>
</template>
<script>
import { mapState } from 'vuex';
import { chemicalsList } from '@/api/remote-search'
import Pagination from '@/components/Pagination'
export default {
  props: {
    state: {
      default: '',
      type: Number
    }
  },
  watch: {
    state(newVal, oldVal) {
      this.currentSearch = newVal;
    }
  },
  data() {
    return {
      currentSearch: this.state
    };
  },
  computed: {
    ...mapState(['user/chemicalsInfo']),
    chemicalsInfo() {
      return this.$store.state.user.chemicalsInfo;
    },
  },
  methods: {
    querySearchAsync(queryString, cb) {
      if (queryString != "") {
        const tempData = {
          q: queryString,
          page: 1,
          limit: 50
        }
        chemicalsList(tempData).then(response => {
          let callBackArr = [];
          let res = response.data.page_datas;
          res.forEach((item) => {
            // if (item.name_cn.indexOf(queryString) > -1) {
            callBackArr.push({
              value: item.name,
              cas: item.cas,
              id: item.id,
              chemical_id: item.id,
              formula: item.formula,
              mdl: item.mdl,
              molecular_weight: item.molecular_weight,
              name: item.name,
              name_cn: item.name_cn,
              smiles: item.smiles,
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
      let tem = [];
      if (this.$store.state.user.chemicalsInfo) {
        tem = tem.concat(this.$store.state.user.chemicalsInfo);
      }
      tem.push(item)
      this.$store.commit("user/SET_CHEMICALS_INFO", tem);
    }
  },
  destroyed() {
    this.state = '';
  }
};

</script>
