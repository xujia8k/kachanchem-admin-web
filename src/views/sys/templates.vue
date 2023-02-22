<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model.trim="listQuery.name" placeholder="模板设置名称" style="width: 250px;" class="filter-item" @keyup.enter.native="getList" />
      <el-input v-model.trim="listQuery.entity_type" placeholder="所属业务" style="width: 250px;margin-left: 10px;" class="filter-item" @keyup.enter.native="getList" />
      <el-button class="filter-item ml40" type="primary" icon="el-icon-search" @click="getList">
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
      <!-- <el-table-column label="所属业务" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.entity_type }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="模板设置姓名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="内容图片" align="center">
        <template slot-scope="scope">
          <el-image-viewer v-if="showViewer"  :on-close="closeViewer" :url-list="srcList" />
          <img v-if="scope.row.img_label_ary.length>0" :src="scope.row.img_label_ary[0].src"  @click="onPreview(scope.row.img_label_ary[0].src)" style="display: block;max-width:110px;height:auto;"  >
        </template>
      </el-table-column>
      <el-table-column label="公章图片" align="center">
        <template slot-scope="scope">
          <img v-if="scope.row.img_label_ary.length>1" :src="scope.row.img_label_ary[1].src"  @click="onPreview(scope.row.img_label_ary[1].src)" style="display: block;max-width:110px;height:auto;"  >
        </template>
      </el-table-column> -->
      <el-table-column label="显示名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.display_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.updated_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否启用" align="center" width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.is_enabled | statusFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.note }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="small" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="success" size="small" @click="handleRouter(row)">
            预览模板
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="90%" :with-header="false" :append-to-body="true" :modal-append-to-body="false" :close-on-click-modal="false">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="模板名称" prop="name">
              <el-input v-model="temp.name" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="显示名称" prop="display_name">
              <el-input v-model="temp.display_name" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属业务" prop="entity_type">
              <el-select v-model="temp.entity_type" class="filter-item" placeholder="请选择所属小组" style="width:100%;">
                <el-option v-for="item in entityType" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据源sql" prop="sql_config">
              <el-input v-model="temp.sql_config" type="textarea" :rows="15" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模板html" prop="html_config">
              <el-input v-model="temp.html_config" type="textarea" :rows="15" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="note">
              <el-input v-model="temp.note" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否启用" prop="is_enabled">
              <el-radio-group v-model="temp.is_enabled">
                <el-radio :label="1">
                  启用
                </el-radio>
                <el-radio :label="0">
                  不启用
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
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :title="template" :visible.sync="dialogFormVisible1" width="90%" :with-header="false" :append-to-body="true" :modal-append-to-body="false" :close-on-click-modal="false">
      <div class="book-title" v-html="contract"></div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">
          取消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { fetchList, create, update, uploadAttachment, attachmentList } from '@/api/sys'
import Pagination from '@/components/Pagination'
import ElImageViewer from "element-ui/packages/image/src/image-viewer";

export default {
  name: 'ComplexTable',
  components: { Pagination,ElImageViewer },
  data() {
    return {
      contract: '',
      template: '',
      srcList: [],
      showViewer: false,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        name: '',
        entity_type: '',
        page: 1,
        limit: 20
      },
      temp: {
        name: '',
        display_name: '',
        entity_type: '',
        sql_config: '',
        html_config: '',
        note: '',
        is_enabled: 1
      },
      entityType: [{
        value: 'CustomerOrder',
        label: '销售订单模块'
      },{
        value: 'Product',
        label: '产品管理模块'
      }],
      dialogFormVisible: false,
      dialogFormVisible1: false,
      dialogStatus: '',
      textMap: {
        update: '编辑信息',
        create: '创建信息'
      },
      rules: {
        entity_type: [{ required: true, message: '所属业务不能为空', trigger: 'change' }],
        name: [{ required: true, message: '模板名称不能为空', trigger: 'change' }],
        display_name: [{ required: true, message: '模板显示名称不能为空', trigger: 'change' }],
        sql_config: [{ required: true, message: '数据源sql不能为空', trigger: 'change' }],
        html_config: [{ required: true, message: '模板html不能为空', trigger: 'change' }]
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
        name: '',
        entity_type: '',
        page: 1,
        limit: 20
      }
      this.temp = {
        name: '',
        display_name: '',
        entity_type: '',
        sql_config: '',
        html_config: '',
        note: '',
        is_enabled: 1
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
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          create(this.temp).then(response => {
            if (response.code == 0) {
              this.getList()
              this.dialogFormVisible = false
              this.$notify({
                title: '提示信息',
                message: '创建成功！',
                type: 'success',
                duration: 2000
              })
            }
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
    handleRouter(row) {
      this.dialogFormVisible1 = true;
      this.template = row.name;
      this.contract = row.html_config;
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          update(tempData).then(() => {
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
    onPreview(img) {
      this.srcList=[];
      this.srcList.push(img)
     this.showViewer = true
    },
    closeViewer() {
     this.showViewer = false
    }
  }
}

</script>
