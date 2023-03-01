<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model.trim="listQuery.title" placeholder="主标题" style="width: 200px;" class="filter-item" @keyup.enter.native="getList" />
      <el-input v-model.trim="listQuery.subtitle" placeholder="副标题" style="width: 200px;margin-left: 10px;" class="filter-item" @keyup.enter.native="getList" />
      <el-button class="filter-item ml10" type="primary" icon="el-icon-search" @click="getList">
        搜索
      </el-button>
      <div class="fr">
        <el-button plain type="success" icon="el-icon-refresh" @click="refresh">
          刷新
        </el-button>
        <el-button plain type="warning" icon="el-icon-circle-plus-outline" @click="handleCreate">
          新增
        </el-button>
      </div>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" :data="list" border highlight-current-row style="width: 100%;">
      <el-table-column label="ID" prop="id" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="主标题" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="副标题" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.subtitle }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="banner图片">
          <template slot-scope="scope">
            <el-image-viewer v-if="showViewer" :on-close="closeViewer" :url-list="srcList" z-index="3000" />
            <img :src="scope.row.img_url" @click="onPreview(scope.row.img_url)" style="display: block;max-width:110px;height:auto;margin: 0 auto">
          </template>
        </el-table-column>
      <el-table-column label="排序" align="center" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.weight }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否显示" align="center" width="100px">
        <template slot-scope="scope">
          <span class="c-red" v-if="scope.row.is_display == 0">{{ scope.row.is_display | showFilter }}</span>
          <span v-else>{{ scope.row.is_display | showFilter }}</span>
        </template>
      </el-table-column>
      <!--  <el-table-column label="加入时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.joined_on | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="small" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="right" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="主标题" prop="title">
              <el-input v-model="temp.title" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="副标题" prop="subtitle">
              <el-input v-model="temp.subtitle" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序" prop="weight">
              <el-input v-model="temp.weight" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否显示" prop="is_display">
              <el-radio-group v-model="temp.is_display">
                <el-radio :label="1">
                  启用
                </el-radio>
                <el-radio :label="0">
                  不启用
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="banner图片" prop="img">
              <Upload v-model="temp.img_url" :id="temp.id" type="Banner" attachmentEntityType="Banner" :value="temp.img_url" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { fetchList, create, update,destroyBanners } from '@/api/frontEnd'
import Upload from '@/components/Upload/SingleImage'
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
import { parseTime, showFilter } from '@/utils'
import Pagination from '@/components/Pagination'

export default {
  name: 'ComplexTable',
  components: { Pagination,Upload,ElImageViewer },
  data() {
    return {
      srcList: [],
      showViewer: false,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        title: '',
        subtitle: '',
        page: 1,
        limit: 20
      },
      temp: {
        title: '',
        subtitle: '',
        weight: '',
        is_display: 1,
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑banner信息',
        create: '创建banner信息'
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
      fetchList(this.listQuery).then(response => {
        this.list = response.data.page_datas
        this.total = response.data.total_count
        this.listLoading = false
      })
    },
    resetTemp() {
      this.listQuery = {
        title: '',
        subtitle: '',
        page: 1,
        limit: 20
      }
      this.temp = {
        title: '',
        subtitle: '',
        weight: '',
        is_display: 1,
      }
    },
    refresh() {
      this.resetTemp()
      this.listQuery.page = 1
      this.getList()
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.img_url = this.$store.state.user.attachment;
          create(this.temp).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.img_url = this.$store.state.user.attachment;
          const tempData = Object.assign({}, this.temp)
          update(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
          })
        }
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除banner, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        destroyBanners(row).then(response => {
          if (response.code == 0) {
            this.$message({
              type: 'success',
              message: '操作成功!'
            });
            this.getList();
          } else {
            this.$message({
              type: 'info',
              message: '取消错误！'
            });
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消操作'
        });
      });
    },
    onPreview(img) {
      this.srcList = [];
      this.srcList.push(img)
      this.showViewer = true
    },
    closeViewer() {
      this.showViewer = false
    }
  }
};
</script>
