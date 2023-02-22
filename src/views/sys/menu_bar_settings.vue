<template>
  <div class="app-container">
    <div class="filter-container">
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
      <el-table-column label="一级菜单" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.menu_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="二级菜单" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.children_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否显示" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.is_active==0" class="c-red">{{ scope.row.is_active | showFilter}}</span>
          <span v-else>{{ scope.row.is_active | showFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="small" @click="handleUpdate(row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog title="菜单栏设置" :visible.sync="dialogFormVisible" width="50%" :with-header="false" :append-to-body="true" :modal-append-to-body="false" :close-on-click-modal="false">
      <p class="c-red mt0">注:1.排序方式影响左侧菜单显示顺序。2.是否显示影响左侧菜单功能是否显示</p>
      <el-form ref="dataForm" :model="temp" label-position="right" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="一级菜单" prop="menu_name">
              <el-input v-model="temp.menu_name" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="二级菜单" prop="children_name">
              <el-input v-model="temp.children_name" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序" prop="sort">
              <el-input v-model="temp.sort" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否显示" prop="is_active">
              <el-radio-group v-model="temp.is_active">
                <el-radio :label="0">
                  不显示
                </el-radio>
                <el-radio :label="1">
                  显示
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { menuBarSettingsList, updateMenuBarSettings } from '@/api/sys'
import Pagination from '@/components/Pagination'

export default {
  name: 'ComplexTable',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      dialogFormVisible: false,
      spanArr: [], // 在data里面定义
      listQuery: {
        page: 1,
        limit: 20
      },
      temp: {
        id: null,
        sort: null,
        is_active: null
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      menuBarSettingsList(this.listQuery).then(response => {
        this.list = response.data.page_datas
        this.total = response.data.total_count
        this.listLoading = false
      })
    },
    resetTemp() {
      this.listQuery = {
        page: 1,
        limit: 20
      }
      this.temp = {
        id: null,
        sort: null,
        is_active: null
      }
    },
    refresh() {
      this.resetTemp()
      this.listQuery.page = 1
      this.getList()
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateMenuBarSettings(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.$notify({
              title: '提示信息',
              message: '更新成功！',
              type: 'success',
              duration: 2000
            })
            this.dialogFormVisible = false
          })
        }
      })
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) { // 项目列也进行合并(第1列)
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    }
  }
}

</script>
