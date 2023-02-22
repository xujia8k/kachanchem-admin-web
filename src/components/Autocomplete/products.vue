<template>
  <!-- 化学品 -->
  <el-autocomplete v-model="currentSearch" :fetch-suggestions="querySearchAsync" placeholder="请输入化学品信息，并在下拉列表中选中" :trigger-on-focus="false" @select="handleSelect" @input="(queryString, cb) => { input(queryString, subscript);}" :debounce="800">
    <template slot-scope="{ item }">
      <div>
        <!-- <span style="float: left;margin-left:15px;color: #5c85ad; font-size: 13px">({{ item.product_no }})</span> -->
        <span style="float: left">{{ item.name }}</span>
        <span style="float: left;margin-left:15px;color: #1C9B70;">{{ item.name_cn }}</span>
        <span style="float: left;margin-left:15px;color: #FFBA00; font-size: 13px">{{ item.cas }}</span>
      </div>
    </template>
  </el-autocomplete>
</template>
<script>
import { mapState } from 'vuex';
import { productsList } from '@/api/remote-search'
import Pagination from '@/components/Pagination'
export default {
  props: {
    state: {
      default: '',
      type: Number
    },
    index: {
      default: '',
      type: Number
    }
  },
  data() {
    return {
      currentSearch: this.state,
      subscript: this.index,
    };
  },
  computed: {
    ...mapState(['user/productsInfo']),
    productsInfo() {
      return this.$store.state.user.productsInfo;
    },
  },
  methods: {
    input(queryString,subscript){
      //如果清空了输入框的内容，就删除vuex指定下标的值
      if (queryString == "") {
        let temp = this.$store.state.user.productsInfo;
        temp.splice(subscript,1,null);
        this.$store.commit("user/SET_PRODUCTS_INFO", temp);
      }
    },
    querySearchAsync(queryString, cb) {
      if (queryString != "") {
        const tempData = {
          q: queryString,
          page: 1,
          limit: 50
        }
        productsList(tempData).then(response => {
          let callBackArr = [];
          let res = response.data.page_datas;
          res.forEach((item) => {

            callBackArr.push({
              value: item.name+'_'+item.cas,
              cas: item.cas,
              id: item.id,
              index: this.subscript>=0? this.subscript: '',
              chemical_id: item.id,
              formula: item.formula,
              mdl: item.mdl,
              // product_no: item.product_no,
              molecular_weight: item.molecular_weight,
              name: item.name,
              name_cn: item.name_cn,
              smiles: item.smiles,
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
      let tem = [];
      if (this.$store.state.user.productsInfo) {
        tem = tem.concat(this.$store.state.user.productsInfo);
        tem.splice(item.index,1,item);
      } else {
        tem.push(item)
      }
      this.$store.commit("user/SET_PRODUCTS_INFO", tem);
    }
  },
  destroyed() {
    this.state = '';
  },
  // 点击clearable清空小图标按钮以后，继续重新在输入框中输入数据，querySearch会触发，但是cb函数不会触发
    // 这样的话就会出现发请求了，也获取数据了，但是input框的输入建议下拉框不呈现在页面上的问题，所以解决方法就是
    // 只要用户点击了
    blurForBug(subscript){
      document.activeElement.blur()
      this.$store.commit("user/SET_PRODUCTS_INFO", this.$store.state.user.productsInfo.splice(subscript, 1));
    }
};
</script>