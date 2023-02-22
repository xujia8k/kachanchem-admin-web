<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model.trim="listQuery.name" placeholder="名字" style="width: 250px;margin-right: 10px" class="filter-item" @keyup.enter.native="getList" />
      <el-input v-model.trim="listQuery.cas" placeholder="Cas" style="width: 250px;margin-right: 10px" class="filter-item" @keyup.enter.native="getList" />
      <el-button class="filter-item ml40" type="primary" icon="el-icon-search" @click="getList">
        搜索
      </el-button>
      <div class="fr">
        <el-button plain type="success" icon="el-icon-refresh" @click="refresh">
          刷新
        </el-button>
        <el-button plain type="info" @click="handleClassifyList">
          产品分类管理
        </el-button>
        <el-button plain type="success" icon="el-icon-upload2" @click="dialogFormVisible3 = true" v-preventReClick v-if="userName == '管理员' || userName == 'admin'">
          上传产品
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
      <!-- <el-table-column label="目录号" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.catalog_no }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="名称" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="价格" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ '$'+scope.row.reference_price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="CAS" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cas }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品图片" width="130px" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.img_url" style="display: block;max-width:110px;height:auto;">
        </template>
      </el-table-column>
      <el-table-column label="纯度" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.purity}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="产品规格" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.specification}}</span>
        </template>
      </el-table-column>
       <el-table-column label="MF" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.mf}}</span>
        </template>
      </el-table-column>
      <el-table-column label="MW" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.mw}}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="产品分类" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.classify}}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ Number(scope.row.weight) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否优势产品" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.is_advantage | statusFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="250" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="success" size="small" @click="getQuotationHistories(row.id)">历史报价</el-button>
          <el-button type="primary" size="small" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="danger" size="small" @click="handleDeleteGoods(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="90%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="名称" prop="name">
              <el-input v-model="temp.name" placeholder="请输入名称！" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="价格" prop="reference_price">
              <el-input v-model="temp.reference_price" placeholder="请输入价格！" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Cas号" prop="cas">
              <el-input v-model="temp.cas" placeholder="请输入Cas号！" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="MF" prop="mf">
              <el-input v-model="temp.mf" placeholder="请输入MF" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="MW" prop="mw">
              <el-input v-model="temp.mw" placeholder="请输入MW" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="产品分类" prop="classify">
              <!-- <el-input v-model="temp.classify" placeholder="请输入产品分类" /> -->
              <el-select v-model="temp.classify" placeholder="产品分类" style="width: 100%;">
                <el-option v-for="item in classifyList" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="排序" prop="weight">
              <el-input v-model="temp.weight" placeholder="请输入排序" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否优势产品" prop="is_advantage">
              <el-radio-group v-model="temp.is_advantage">
                <el-radio label="0">否</el-radio>
                <el-radio label="1">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品图片" prop="img">
              <Upload v-model="temp.product_img_url" :id="temp.id" attachmentEntityType="Product Img" :value="temp.product_img_url" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="coa附件" prop="img">
              <Upload2 v-model="temp.coa_url" :id="temp.id" attachmentEntityType="Product" type="COA" :value="temp.coa_url" />
              <!-- <input type="file" class="upload-file" @change="setUploadAttachment($event,'COA',temp.id,'coa_url')" /> -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="msds附件" prop="img">
              <Upload2 v-model="temp.msds_url" :id="temp.id" attachmentEntityType="Product" type="MSDS" :value="temp.msds_url" />
              <!-- <input type="file" class="upload-file" @change="setUploadAttachment($event,'MSDS',temp.id,'msds_url')" /> -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="testReport附件" prop="img">
              <Upload2 v-model="temp.test_report_url" :id="temp.id" attachmentEntityType="Product" type="Test Report" :value="temp.test_report_url" />
              <!-- <input type="file" class="upload-file" @change="setUploadAttachment($event,'Test Report',temp.id,'test_report_url')" /> -->
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <p style="width: 100px;text-align: right;font-weight: 700;font-size: 14px;color: #606266;line-height: 40px;padding: 0 12px 0 0;-webkit-box-sizing: border-box; box-sizing: border-box;">产品规格</p>
      <div class="vue-quill-editor">
        <quill-editor ref="mwQuillEditor" :options="editorOption" v-model="temp.specification" @change="onEditorChange($event)" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
    <!-- 上传产品信息 -->
    <!-- <el-dialog title="上传产品信息" :visible.sync="dialogFormVisible3" :close-on-click-modal="false" width="50%">
      <input type="file" accept=".xls,.xlsx" class="upload-file" @change="changeExcel($event)" />
      <div>{{ goodsUploadStatus }}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible3 = false">
          取消
        </el-button>
      </div>
    </el-dialog> -->
    <!-- 上传产品信息 -->
    <el-dialog title="上传产品信息" :visible.sync="dialogFormVisible3" :close-on-click-modal="false" width="50%" :before-close="handleClose">
      <el-upload class="upload-demo" ref="upload" :action="uploadUrl" :headers="headers" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList" :auto-upload="false" :on-success="handleSuccess">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button> -->
        <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible3 = false">
          取消
        </el-button>
        <el-button type="primary" @click="submitUpload" v-preventReClick>
          上传到服务器
        </el-button>
      </div>
    </el-dialog>
    <!-- 产品分类 -->
    <el-dialog title="产品分类" :visible.sync="dialogFormVisible4" :close-on-click-modal="false" width="50%">
      <div v-for="(tag, index) in classifyList" style="display: inline-block;    padding: 0 10px;">
        <el-tag :key="tag" closable :disable-transitions="false" @close="handleClose(tag)" @click="handleChecks(tag)">
          {{tag}}
        </el-tag>
        <!-- <el-input class="input-new-tag"  v-model="classifyList[index]" ref="saveTagInput" size="small">
        </el-input> -->
      </div>
      <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新增产品分类</el-button>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible4 = false">
          取消
        </el-button>
        <el-button type="primary" @click="handleUpdateClassify()">
          确认
        </el-button>
      </div>
    </el-dialog>
    <!-- 历史报价 -->
    <el-drawer :visible.sync="drawer" :with-header="false" :append-to-body="true" :modal-append-to-body="false" size="70%">
      <el-tabs type="border-card">
        <el-tab-pane label="历史报价">
          <el-table :data="quotationHistoriesList" style="width: 100%" element-loading-text="拼命加载中" border fit highlight-current-row stripe class="us cp">
            <template slot="empty">没有历史报价</template>
            <el-table-column align="center" prop="vendor_company_name" label="供应商名称">
            </el-table-column>
            <el-table-column align="center" prop="purity" label="纯度" width="80">
            </el-table-column>
            <el-table-column align="center" prop="package" label="规格" width="80">
            </el-table-column>
            <el-table-column align="center" prop="price" label="总价" width="100">
            </el-table-column>
            <el-table-column align="center" prop="stock" label="备货周期" width="50">
            </el-table-column>
            <el-table-column align="center" prop="created_at" label="报价时间" width="100">
            </el-table-column>
            <el-table-column align="center" prop="note" label="备注" width="200">
            </el-table-column>
          </el-table>
          <pagination v-if="total2>0" :total="total2" :page.sync="listQuery2.page" :limit.sync="listQuery2.limit" @pagination="getQuotationHistories()" />
        </el-tab-pane>
      </el-tabs>
    </el-drawer>
  </div>
</template>
<script>
import { fetchList, create, updateGoods, deleteGoods, updateClassify, fetchQuotationHistoriesList } from '@/api/product'
import { fetchClassifyList } from '@/api/commons'
import { uploadAttachment } from '@/api/qiniu'
import Pagination from '@/components/Pagination'
import Upload from '@/components/Upload/SingleImage'
import Upload2 from '@/components/Upload/SingleImage2'
import { getName, getToken } from '@/utils/auth'
import * as XLSX from 'xlsx'

import { quillEditor, Quill } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
const tableData = {}; //存放文件数据
// import SelectImages from '@/components/SelectImages/index'
// 设置字体大小
const fontSizeStyle = Quill.import('attributors/style/size') // 引入这个后会把样式写在style上
fontSizeStyle.whitelist = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px']
Quill.register(fontSizeStyle, true)
// 设置字体样式
const Font = Quill.import('attributors/style/font') // 引入这个后会把样式写在style上
const fonts = [
  'SimSun',
  'SimHei',
  'Microsoft-YaHei',
  'KaiTi',
  'FangSong'
]
Font.whitelist = fonts // 将字体加入到白名单
Quill.register(Font, true)
// 工具栏
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线 -----['bold', 'italic', 'underline', 'strike']
  [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色-----[{ color: [] }, { background: [] }]
  [{ align: [] }], // 对齐方式-----[{ align: [] }]
  [{ size: fontSizeStyle.whitelist }], // 字体大小-----[{ size: ['small', false, 'large', 'huge'] }]
  [{ font: fonts }], // 字体种类-----[{ font: [] }]
  [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
  [{ direction: 'ltl' }], // 文本方向-----[{'direction': 'rtl'}]
  [{ direction: 'rtl' }], // 文本方向-----[{'direction': 'rtl'}]
  [{ indent: '-1' }, { indent: '+1' }], // 缩进-----[{ indent: '-1' }, { indent: '+1' }]
  [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表-----[{ list: 'ordered' }, { list: 'bullet' }]
  [{ script: 'sub' }, { script: 'super' }], // 上标/下标-----[{ script: 'sub' }, { script: 'super' }]
  ['blockquote', 'code-block'], // 引用  代码块-----['blockquote', 'code-block']
  ['clean'], // 清除文本格式-----['clean']
  ['link', 'image', 'video'] // 链接、图片、视频-----['link', 'image', 'video']
]
export default {
  name: 'ComplexTable',
  components: { Pagination, Upload, Upload2, quillEditor },
  data() {
    return {
      html: this.value,
      editorOption: {
        // theme: 'snow',
        // readOnly:true,
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              image: this.handleImgUpload
            }
          }
        }
      },
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery2: {
        page: 1,
        limit: 10
      },
      quotationHistoriesList: null, //历史报价列表
      total2: 0,
      drawer: false,
      listQuery: {
        name: null,
        cas: null,
        page: 1,
        limit: 20
      },
      temp: {
        id: null,
        name: null,
        classify: null,
        reference_price: null,
        cas: null,
        purity: null,
        img_url: null,
        specification: null,
        weight: 1,
        mf: null,
        mw: null,
        classify: null,
        fileList: [], // excel文件列表
        coa_url: null, //coa附件地址
        msds_url: null, //msds附件地址
        test_report_url: null, //report附件地址
        is_advantage: 0
      },
      dialogFormVisible: false,
      userName: getName(), //当前登录用户名字
      headers: {
        Authorization: getToken()
      },
      goodsUploadStatus: '', //上传状态
      updateError: '', //上传错误数据
      uploadUrl: null, //上传请求地址
      dialogFormVisible3: false,
      dialogFormVisible4: false,
      dialogStatus: '',
      classifyList: '',
      inputVisible: false,
      inputValue: '',
      textMap: {
        update: '编辑商品信息',
        create: '创建商品信息'
      },
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.getClassifyList()
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
    handleClassifyList() {
      this.dialogFormVisible4 = true
    },
    resetTemp() {
      this.listQuery = {
        name: null,
        cas: null,
        page: 1,
        limit: 20
      }
      this.temp = {
        id: null,
        name: null,
        classify: null,
        reference_price: null,
        cas: null,
        purity: null,
        img_url: null,
        specification: null,
        weight: 1,
        mf: null,
        mw: null,
        classify: null,
        coa_url: null, //coa附件地址
        msds_url: null, //msds附件地址
        test_report_url: null, //report附件地址
        is_advantage: 0
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
          // this.temp.coa_url = this.$store.state.user.attachmentCOA;
          // this.temp.msds_url = this.$store.state.user.attachmentMSDS;
          // this.temp.test_report_url = this.$store.state.user.attachmentTestReport;
          create(this.temp).then(() => {
            // this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '创建成功！',
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
    //删除商品
    handleDeleteGoods(row) {
      this.$confirm('此操作将永久删除商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteGoods(row).then(response => {
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
    updateData(id) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateGoods(this.temp, this.temp.id).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.$notify({
              title: 'Success',
              message: '修改成功！',
              type: 'success',
              duration: 2000
            })
            this.dialogFormVisible = false
          })
        }
      })
    },
    handleSuccess(res, file) {
      this.getList()
      this.fileList = []
      this.dialogFormVisible3 = false
      this.$notify({
        title: 'Success',
        message: '导入客户信息成功！',
        type: 'success',
        duration: 5000
      })
    },
    //导入产品信息
    submitUpload() {
      let that = this;
      that.uploadUrl = process.env.VUE_APP_BASE_API + "/api/admin/v1/product/products/import";
      that.$nextTick(function() {
        that.$refs.upload.submit();
      })
    },
    changeExcel(e) {
      let files = e.target.files;
      if (files.length <= 0) {
        return false
      } else if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
        console.log('上传格式不正确，请上传xls或者xlsx格式')
        return false
      }
      // 读取表格
      let fileReader = new FileReader()
      fileReader.onload = ev => {
        let workbook = XLSX.read(ev.target.result, {
          type: "binary"
        })
        let wsname = workbook.SheetNames[0]
        let ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname])
        // console.log('ws:', ws) // 转换成json的数据
        // this.dealExcel(ws) //对数据进行自己需要的操作 
        tableData.value = ws
        // console.log('tableData:', tableData) // 转换成json的数据
        this.goodsUploadStatus = '正在启动上传，请稍后······'
        let finished = 0
        for (const i in tableData.value) {
          this.createGoods(tableData.value[i]).then((data) => {
            finished++
            this.goodsUploadStatus = '正在上传数据，共' + tableData.value.length + '个，已完成' + finished + '个'
          })
        }

      }
      fileReader.readAsBinaryString(files[0])
    },
    async createGoods(data) {
      let temp = {
        name: data.name || '',
        reference_price: data.reference_price || '',
        cas: data.cas || '',
        img_url: data.img_url || '',
        content: data.content || '',
        describe: data.describe || '',
        note: data.note || '',
        appearance: data.appearance || '',
        weight: data.weight || '',
        category: data.category || '',
        kind: data.kind || '',
        agent: data.agent || '',
        active: 1
      }
      await create(temp).then(response => {
        if (response.code == 0) {} else {
          this.updateError.push(temp)
          console.log('updateError', updateError)
        }
      })
    },
    dealExcel(ws) {
      let keymap = { // 我们要转换的开头
        "员工": "name",
        "工号": 'num',
        "登录账号": 'account',
        "部门": 'department'
      }
      ws.forEach(sourceObj => {
        Object.keys(sourceObj).map(keys => {
          let newKey = keymap[keys]
          if (newKey) {
            sourceObj[newKey] = sourceObj[keys]
            delete sourceObj[keys]
          }
        })
      })
      tableData.value = ws
      // console.log('tableData:', tableData) // 转换成json的数据
    },
    // 失去焦点事件
    onEditorBlur(quill) {
      console.log('editor blur!', quill)
    },
    // 获得焦点事件
    onEditorFocus(quill) {
      console.log('editor focus!', quill)
    },
    // 准备富文本编辑器
    onEditorReady(quill) {
      console.log('editor ready!', quill)
    },
    // 内容改变事件
    onEditorChange({ quill, html, text }) {
      // console.log('editor change!', quill, html, text)
      this.content = html
    },
    setUploadAttachment(e, type, id) {
      // 上传之前要处理一下文件 因为文件是二进制的，要利用 FormData 实例对象进行处理
      // const formData = new FormData();
      // // append方法把文件添加到 FormData实例对象中 第一个参数：文件名 第二个参数：要上传的文件
      // formData.append("file", e.target.files[0]);
      let formFile = new FormData();
      formFile.append("file", e.target.files[0]);
      let tem = {
        attachment_entity_type: 'Product',
        attachment_entity_id: id || '',
        file: formFile,
        customize_type: type || '',
      }
      console.log(tem)
      // uploadAttachment(tem).then(response => {
      //   if (response.code == 0) {
      //     // if (type == 'COA') {
      //     //   this.temp.coa_url = response.data.url;
      //     // } else if (type == 'MSDS') {
      //     //   this.temp.msds_url = response.data.url;
      //     // } else if (type == 'Test Report') {
      //     //   this.temp.test_report_url = response.data.url;
      //     // }
      //   }
      // })
    },
    getClassifyList() {
      fetchClassifyList().then(response => {
        this.classifyList = response.data.value
      })
    },
    getQuotationHistories(id) {
      this.listQuery2.id = id
      fetchQuotationHistoriesList(this.listQuery2).then(response => {
        if (response.code == 0) {
          this.quotationHistoriesList = response.data.page_datas;
          this.total2 = response.data.total_count
          this.drawer = true
        }
      })
    },
    handleUpdateClassify(tag) {
      let tem = {
        value: this.classifyList
      }
      updateClassify(tem).then(response => {
        this.dialogFormVisible4 = false
        this.$notify({
          title: 'Success',
          message: '修改成功！',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleClose(tag) {
      this.classifyList.splice(this.classifyList.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.classifyList.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    handleChecks(tag) {

    }

  }
}

</script>
<style>
.el-tag+.el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

</style>
<style lang="scss">
.vue-quill-editor {
  .quill-editor {
    line-height: normal;

    .ql-container.ql-snow {
      line-height: normal !important;
      height: 350px !important;
      font-size: 14px;
    }

    .ql-snow {
      .ql-tooltip[data-mode=link]::before {
        content: "请输入链接地址:";
      }

      .ql-tooltip.ql-editing a.ql-action::after {
        border-right: 0px;
        content: '保存';
        padding-right: 0px;
      }

      .ql-tooltip[data-mode=video]::before {
        content: "请输入视频地址:";
      }

      .ql-picker.ql-size {

        .ql-picker-label[data-value="12px"]::before,
        .ql-picker-item[data-value="12px"]::before {
          content: '12px';
        }

        .ql-picker-label[data-value="14px"]::before,
        .ql-picker-item[data-value="14px"]::before {
          content: '14px';
        }

        .ql-picker-label[data-value="16px"]::before,
        .ql-picker-item[data-value="16px"]::before {
          content: '16px';
        }

        .ql-picker-label[data-value="18px"]::before,
        .ql-picker-item[data-value="18px"]::before {
          content: '18px';
        }

        .ql-picker-label[data-value="20px"]::before,
        .ql-picker-item[data-value="20px"]::before {
          content: '20px';
        }

        .ql-picker-label[data-value="24px"]::before,
        .ql-picker-item[data-value="24px"]::before {
          content: '24px';
        }

        .ql-picker-label[data-value="28px"]::before,
        .ql-picker-item[data-value="28px"]::before {
          content: '28px';
        }

        .ql-picker-label[data-value="32px"]::before,
        .ql-picker-item[data-value="32px"]::before {
          content: '32px';
        }

        .ql-picker-label[data-value="36px"]::before,
        .ql-picker-item[data-value="36px"]::before {
          content: '36px';
        }
      }

      .ql-picker.ql-header {

        .ql-picker-label::before,
        .ql-picker-item::before {
          content: '文本';
        }

        .ql-picker-label[data-value="1"]::before,
        .ql-picker-item[data-value="1"]::before {
          content: '标题1';
        }

        .ql-picker-label[data-value="2"]::before,
        .ql-picker-item[data-value="2"]::before {
          content: '标题2';
        }

        .ql-picker-label[data-value="3"]::before,
        .ql-picker-item[data-value="3"]::before {
          content: '标题3';
        }

        .ql-picker-label[data-value="4"]::before,
        .ql-picker-item[data-value="4"]::before {
          content: '标题4';
        }

        .ql-picker-label[data-value="5"]::before,
        .ql-picker-item[data-value="5"]::before {
          content: '标题5';
        }

        .ql-picker-label[data-value="6"]::before,
        .ql-picker-item[data-value="6"]::before {
          content: '标题6';
        }
      }

      .ql-picker.ql-font {

        .ql-picker-label[data-value="SimSun"]::before,
        .ql-picker-item[data-value="SimSun"]::before {
          content: "宋体";
          font-family: "SimSun" !important;
        }

        .ql-picker-label[data-value="SimHei"]::before,
        .ql-picker-item[data-value="SimHei"]::before {
          content: "黑体";
          font-family: "SimHei";
        }

        .ql-picker-label[data-value="Microsoft-YaHei"]::before,
        .ql-picker-item[data-value="Microsoft-YaHei"]::before {
          content: "微软雅黑";
          font-family: "Microsoft YaHei";
        }

        .ql-picker-label[data-value="KaiTi"]::before,
        .ql-picker-item[data-value="KaiTi"]::before {
          content: "楷体";
          font-family: "KaiTi" !important;
        }

        .ql-picker-label[data-value="FangSong"]::before,
        .ql-picker-item[data-value="FangSong"]::before {
          content: "仿宋";
          font-family: "FangSong";
        }
      }
    }

    .ql-align-center {
      text-align: center;
    }

    .ql-align-right {
      text-align: right;
    }

    .ql-align-left {
      text-align: left;
    }
  }
}

</style>
