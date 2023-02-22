<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model.trim="listQuery.operator_name" placeholder="员工姓名" style="width: 250px;" class="filter-item" @keyup.enter.native="getList" v-if="showSearchData[0] && showSearchData[0].istrue" />
      <el-input v-model.trim="listQuery.operate_module_name" placeholder="模块名称" style="width: 250px;" class="filter-item" @keyup.enter.native="getList" v-if="showSearchData[1] && showSearchData[1].istrue" />
      <el-input v-model.trim="listQuery.operate_name" placeholder="操作名称" style="width: 250px;" class="filter-item" @keyup.enter.native="getList" v-if="showSearchData[2] && showSearchData[2].istrue" />
      <el-date-picker v-model="date" value-format="yyyy-MM-dd HH:mm:ss" class="filter-item ml10" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" style="width: 250px;margin-left: 5px;" v-if="showSearchData[3] && showSearchData[3].istrue" />
      <el-button class="filter-item ml20" type="primary" icon="el-icon-search" @click="getList">
        搜索
      </el-button>
      <div class="fr mb10">
        <el-button plain type="success" icon="el-icon-refresh" @click="refresh">
          刷新
        </el-button>
      </div>
    </div>
    <el-table v-loading="listLoading" :data="list" border highlight-current-row style="width: 100%;">
      <el-table-column label="ID" prop="id" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作员工姓名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.operator_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作模块" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.operate_module_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.operate_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作对象名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.operate_obj_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>
<script>
import { adminOperateLogs } from '@/api/sys'
import Pagination from '@/components/Pagination'
import SetView from '@/components/SetView'
import { getEmployeeSetting, updateEmployeeSetting } from '@/api/commons'
import { parseTime, isInArray } from '@/utils'
import defaultViewData from '@/static/defaultViewData.json' // 默认视图数据

export default {
  name: 'ComplexTable',
  components: { Pagination },
  data() {
    return {
      showSearchData: null, //展示搜索数据
      showSettingFlag: false, //视图设置
      checkedSearchData: null, //选中搜索数据
      viewData: null, //视图数据
      list: null,
      total: 0,
      listLoading: true,  
      date: null,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      listQuery: {
        operator_name: null,
        operate_module_name: null,
        operate_name: null,        
        created_start_at: null,
        created_end_at: null,
        page: 1,
        limit: 20
      }
    }
  },
  created() {
    this.getList()
    this.getEmployeeSetting()
  },
  methods: {
    handleFilter() {
      this.listQuery.page = 1
      if (this.date) {
        this.listQuery.created_start_at = this.date[0];
        this.listQuery.created_end_at = this.date[1];
      }
      this.getList()
    },
    getList() {
      this.listLoading = true
      adminOperateLogs(this.listQuery).then(response => {
        this.list = response.data.page_datas
        this.total = response.data.total_count
        this.listLoading = false
      })
    },
    resetTemp() {
      this.listQuery = {
        operator_name: null,
        operate_module_name: null,
        operate_name: null,        
        created_start_at: null,
        created_end_at: null,
        page: 1,
        limit: 20
      }
    },
    refresh() {
      this.resetTemp()
      this.listQuery.page = 1
      this.getList()
    },

    getEmployeeSetting() {
      let path = this.$route.path;
      let tempData = {
        apply_module_name: '/api/admin/v1' + path
      }
      getEmployeeSetting(tempData).then(response => {
        if (response.code == 0) {
          let data = response.data
          //用户设置过视图
          if (data.id) {
            this.checkedSearchData = data
          }
          this.filterData()
        }
      })
    },
    //获取对应视图数据
    getViewData() {
      if (defaultViewData) {
        let path = this.$route.path;
        let splicePath = path.split("/")[1] + '_' + path.split("/")[2];
        for (var i in defaultViewData) {
          if (i == splicePath) {
            return defaultViewData[i]
          }
        }
      }
    },
    //过滤搜索数据
    filterData() {
      let viewData = this.getViewData();
      //过滤搜索数据
      var searchArr = Object.entries(viewData.search_terms); //对象转化为数组
      var searchArr1 = [];
      //如果未设置显示数据，就显示全部
      if (this.checkedSearchData && this.checkedSearchData.search_terms) {
        let search_terms = this.checkedSearchData.search_terms; //接口返回选中数据
        for (var i = 0; i < searchArr.length; i++) {
          if (isInArray(search_terms, searchArr[i][0])) {
            searchArr1.push({
              key: searchArr[i],
              istrue: true
            })
          } else {
            searchArr1.push({
              key: searchArr[i],
              istrue: false
            })
          }
        }
      } else {
        searchArr.forEach(v => {
          searchArr1.push({
            istrue: true
          })
        });
      }
      //过滤列表数据
      var tableArr = Object.entries(viewData.list_terms); //对象转化为数组
      var tableArr1 = [];
      //如果未设置显示数据，就显示全部
      if (this.checkedSearchData && this.checkedSearchData.list_terms) {
        let list_terms = this.checkedSearchData.list_terms; //接口返回选中数据
        for (var i = 0; i < tableArr.length; i++) {
          if (isInArray(list_terms, tableArr[i][0])) {
            tableArr1.push({
              key: tableArr[i],
              istrue: true
            })
          } else {
            tableArr1.push({
              key: tableArr[i],
              istrue: false
            })
          }
        }
      } else {
        tableArr.forEach(v => {
          tableArr1.push({
            istrue: true
          })
        });
      }
      this.showSearchData = searchArr1;
      this.showtableData = tableArr1;
    },
    handleShowSetting() {
      let path = this.$route.path;
      let viewData = this.getViewData();
      this.viewData = {
        name: '/api/admin/v1' + path,
        use_default: 0,
        search_terms: viewData.search_terms,
        list_terms: viewData.list_terms,
        search_terms_setting: [],
        list_terms_setting: [],
      }
      this.showSettingFlag = true
    },
    closeCom(msg) {
      this.viewData.search_terms_setting = msg[0];
      this.viewData.list_terms_setting = msg[1];
    }
  }
}

</script>
