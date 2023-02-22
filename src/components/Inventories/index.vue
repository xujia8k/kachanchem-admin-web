<template>
  <div>
    <div class="filter-container">
      <el-input v-model.trim="listQuery.name" placeholder="产品信息" style="width: 200px;" class="filter-item" @keyup.enter.native="getList" />
      <el-input v-model.trim="listQuery.username" placeholder="编号/批号" style="width: 200px;" class="filter-item" @keyup.enter.native="getList" />
      <el-input v-model.trim="listQuery.username" placeholder="仓管员/业务员" style="width: 200px;" class="filter-item" @keyup.enter.native="getList" />
      <el-date-picker v-model="date" value-format="yyyy-MM-dd HH:mm:ss" class="filter-item" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="入库从日期" end-placeholder="入库至日期" :picker-options="pickerOptions" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getList">
        搜索
      </el-button>
      <el-button class="filter-item" type="success" icon="el-icon-refresh" @click="refresh">
        刷新
      </el-button>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" :data="list" border highlight-current-row style="width: 100%;" @selection-change="showTable" @current-change="showTable">
      <el-table-column label="入库时间" width="100px" align="center">
        <template slot-scope="scope">
          <!-- <span>{{ scope.row.joined_on | parseTime('{y}-{m}-{d}') }}</span> -->
          <span>2021-08-26</span>
        </template>
      </el-table-column>
      <el-table-column label="数量" width="80px" align="center">
        <template slot-scope="scope">
          <span>1233</span>
        </template>
      </el-table-column>
      <el-table-column label="单位" width="50px" align="center">
        <template slot-scope="scope">
          <span>克</span>
        </template>
      </el-table-column>
      <el-table-column label="含税单价" align="center">
        <template slot-scope="scope">
          <span>3.6</span>
        </template>
      </el-table-column>
      <el-table-column label="未税单价" align="center">
        <template slot-scope="scope">
          <span>3.6</span>
        </template>
      </el-table-column>
      <el-table-column label="批号" width="110px" align="center">
        <template slot-scope="scope">
          <span>210826009</span>
        </template>
      </el-table-column>
      <el-table-column label="产品编号" width="110px" align="center">
        <template slot-scope="scope">
          <span>BCR51668</span>
        </template>
      </el-table-column>
      <el-table-column label="存放位置" width="110px" align="center">
        <template slot-scope="scope">
          <span>A1</span>
        </template>
      </el-table-column>
      <el-table-column label="所在仓库" width="110px" align="center">
        <template slot-scope="scope">
          <span>A1</span>
        </template>
      </el-table-column>
      <el-table-column label="分装详情" width="110px" align="center">
        <template slot-scope="scope">
          <span>220克*1</span>
        </template>
      </el-table-column>
      <el-table-column label="CAS No." width="110px" align="center">
        <template slot-scope="scope">
          <span>244-2-3</span>
        </template>
      </el-table-column>
      <el-table-column label="中文名" width="110px" align="center">
        <template slot-scope="scope">
          <span>大力补</span>
        </template>
      </el-table-column>
      <el-table-column label="英文名" width="110px" align="center">
        <template slot-scope="scope">
          <span>Androsta-1</span>
        </template>
      </el-table-column>
      <el-table-column label="纯度" width="110px" align="center">
        <template slot-scope="scope">
          <span>95%</span>
        </template>
      </el-table-column>
      <el-table-column label="业务员" width="90px" align="center">
        <template slot-scope="scope">
          <span>大刘</span>
        </template>
      </el-table-column>
      <el-table-column label="仓库员" width="90px" align="center">
        <template slot-scope="scope">
          <span>田晓</span>
        </template>
      </el-table-column>
      <el-table-column label="供应商名称" width="110px" align="center">
        <template slot-scope="scope">
          <span>A1-1</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="scope">
          <span>A1-1</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="small" @click="showTable(row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>
<script>
import { fetchTeamsList } from '@/api/tems'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'

export default {
  name: 'ComplexTable',
  components: { Pagination },
  props: {
    id: {
      default: false,
      type: String
    }
  },
  data() {
    return {
      roleId: null, // 编辑的角色ID
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        name: '',
        username: '',
        position_id: null,
        page: 1,
        limit: 20
      },
      temp: {
        username: '',
        name: '',
        position_id: '',
        team_id: '',
        password: '',
        password_confirmation: '',
        birthday: new Date(),
        joined_on: new Date(),
        mobile: '',
        office_tel: '',
        qq_num: '',
        job_status: 1, // 在职状态, 1:在职, -1:离职
        is_enabled: 1 // 是否启用，1-是，0-否
      },
      textMap: {
        update: '编辑员工信息',
        create: '创建员工信息'
      },
      date: null, // 询盘开始时间-结束时间
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
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchTeamsList(this.listQuery).then(response => {
        this.list = response.data.page_datas
        this.total = response.data.total_count
        this.listLoading = false
      })
    },
    showTable(row) {
      this.$router.push({ path: '/warehouse/outbound_detailed', query: { id: row.id } });
    },
    resetTemp() {
      this.listQuery = {
        page: 1,
        limit: 20
      }
      this.temp = {}
    },
    refresh() {
      this.resetTemp()
      this.listQuery.page = 1
      this.getList()
    }
  }
}

</script>
