<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model.trim="listQuery.name" placeholder="名字" style="width: 250px;" class="filter-item" @keyup.enter.native="getList" v-if="showSearchData[0] && showSearchData[0].istrue" />
      <el-input v-model.trim="listQuery.cas" placeholder="CAS" style="width: 250px; margin-left: 10px" class="filter-item" @keyup.enter.native="getList" v-if="showSearchData[1] && showSearchData[1].istrue" />
      <el-button class="filter-item ml20" type="primary" icon="el-icon-search" @click="getList">
        搜索
      </el-button>
      <div class="fr">
        <el-button plain type="success" icon="el-icon-upload2" @click="dialogFormVisible3 = true" v-preventReClick v-if="userName == '管理员' || userName == 'admin'">
          上传产品
        </el-button>
        <el-button plain type="success" icon="el-icon-refresh" @click="refresh">
          刷新
        </el-button>
        <el-button plain type="primary" icon="el-icon-set-up" @click="handleShowSetting">
          视图
        </el-button>
        <el-button plain type="warning" icon="el-icon-document-add" @click="handleCreate">
          新增
        </el-button>
      </div>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" :data="list" border highlight-current-row style="width: 100%;" @row-dblclick="handleUpdate">
      <el-table-column label="化学品ID" width="80" align="center" v-if="showtableData[0] && showtableData[0].istrue">
        <template slot-scope="scope">
          <span>{{ scope.row.chemical_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品编号" width="110px" align="center" v-if="showtableData[1] && showtableData[1].istrue">
        <template slot-scope="scope">
          <span>{{ scope.row.product_no }}</span>
        </template>
      </el-table-column>
      <el-table-column label="CAS号" width="110px" align="center" v-if="showtableData[2] && showtableData[2].istrue">
        <template slot-scope="scope">
          <span>{{ scope.row.cas }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品英文名" align="center" :show-overflow-tooltip='true' v-if="showtableData[3] && showtableData[3].istrue">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品中文名" align="center" :show-overflow-tooltip='true' v-if="showtableData[4] && showtableData[4].istrue">
        <template slot-scope="scope">
          <span>{{ scope.row.name_cn }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标准纯度" align="center" width="90px" v-if="showtableData[5] && showtableData[5].istrue">
        <template slot-scope="scope">
          <span v-if="scope.row.purity">{{ scope.row.purity }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="分子式" align="center" width="100px" v-if="showtableData[6] && showtableData[6].istrue">
        <template slot-scope="scope">
          <span>{{ scope.row.formula }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="分子量" align="center" width="90px" v-if="showtableData[6] && showtableData[6].istrue">
        <template slot-scope="scope">
          <span>{{ scope.row.molecular_weight }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品类型" align="center" width="90px" v-if="showtableData[7] && showtableData[7].istrue">
        <template slot-scope="scope">
          <span>{{ scope.row.category | categoryFilter1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="违禁类型" align="center" width="60px" v-if="showtableData[8] && showtableData[8].istrue">
        <template slot-scope="scope">
          <span>{{ scope.row.ban_category | prohibitedTypeFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="计量单位" align="center" width="60px" v-if="showtableData[9] && showtableData[9].istrue">
        <template slot-scope="scope">
          <span>{{ scope.row.unit | unitFilter}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="简化分子线性输入规范" align="center" v-if="showtableData[11] && showtableData[11].istrue">
        <template slot-scope="scope">
          <span>{{ scope.row.smiles }}</span>
        </template>
      </el-table-column>
      <el-table-column label="MDL编号" align="center" v-if="showtableData[12] && showtableData[12].istrue">
        <template slot-scope="scope">
          <span>{{ scope.row.mdl }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标准规格" align="center" v-if="showtableData[13] && showtableData[13].istrue">
        <template slot-scope="scope">
          <span>{{ scope.row.package_str }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标准货期" align="center" v-if="showtableData[14] && showtableData[14].istrue">
        <template slot-scope="scope">
          <span>{{ scope.row.stock }}</span>
        </template>
      </el-table-column>
      <el-table-column label="外观" align="center" v-if="showtableData[11] && showtableData[11].istrue">
        <template slot-scope="scope">
          <span>{{ scope.row.appearance }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="是否有效" align="center" width="60px" v-if="showtableData[10] && showtableData[10].istrue">
        <template slot-scope="scope">
          <span>{{ scope.row.active | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否免检" align="center" width="60px" v-if="showtableData[11] && showtableData[11].istrue">
        <template slot-scope="scope">
          <span>{{ scope.row.is_exemption | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否核实" align="center" width="60px" v-if="showtableData[12] && showtableData[12].istrue">
        <template slot-scope="scope">
          <span>{{ scope.row.is_verify | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="优势产品" align="center" width="60px" v-if="showtableData[13] && showtableData[13].istrue">
        <template slot-scope="scope">
          <span>{{ scope.row.is_advantage | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" width="90px" :show-overflow-tooltip='true' v-if="showtableData[14] && showtableData[14].istrue">
        <template slot-scope="scope">
          <span>{{ scope.row.note }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="small" @click="handleUpdate(row)">
            编辑
          </el-button>
          <!-- <el-button type="success" size="small" @click="showTable(row)">
            查看
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="80%" :close-on-click-modal="false">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="24" :xs="24">
            <el-form-item label="化学品信息" prop="chemical_id">
              <!-- <el-input v-model="temp.chemical_id" placeholder="请输入化学品名称进行模糊搜索"/> -->
              <chemicals style="width:100%" v-if="showComponent" :state="temp.name_cn || temp.name" />
            </el-form-item>
          </el-col>
          <el-col :span="6" :xs="24">
            <el-form-item label="CAS号" prop="cas">
              <el-input v-model="temp.cas" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="6" :xs="24">
            <el-form-item label="产品编号" prop="product_no">
              <el-input v-model="temp.product_no" />
            </el-form-item>
          </el-col> -->
          <el-col :span="6" :xs="24">
            <el-form-item label="产品英文名" prop="name">
              <el-input v-model="temp.name" />
            </el-form-item>
          </el-col>
          <el-col :span="6" :xs="24">
            <el-form-item label="产品中文名" prop="name_cn">
              <el-input v-model="temp.name_cn" />
            </el-form-item>
          </el-col>
          <el-col :span="6" :xs="24">
            <el-form-item label="MDL编号" prop="mdl">
              <el-input v-model="temp.mdl" />
            </el-form-item>
          </el-col>
          <el-col :span="6" :xs="24">
            <el-form-item label="分子式" prop="formula">
              <el-input v-model="temp.formula" />
            </el-form-item>
          </el-col>
          <el-col :span="6" :xs="24">
            <el-form-item label="分子量" prop="molecular_weight">
              <el-input v-model="temp.molecular_weight" />
            </el-form-item>
          </el-col>
          <el-col :span="6" :xs="24">
            <el-form-item label="违禁类型" prop="ban_category">
              <el-select v-model="temp.ban_category" placeholder="违禁类型" style="width: 100%;">
                <el-option v-for="item in banCategoryList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" :xs="24">
            <el-form-item label="产品类型" prop="category">
              <el-select v-model="temp.category" placeholder="违禁类型" style="width: 100%;">
                <el-option v-for="item in categoryList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" :xs="24">
            <el-form-item label="默认计量单位" prop="unit">
              <el-select v-model="temp.unit" placeholder="违禁类型" style="width: 100%;">
                <el-option v-for="item in unitList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" :xs="24">
            <el-form-item label="smiles" prop="smiles">
              <el-input v-model="temp.smiles" />
            </el-form-item>
          </el-col>
          <el-col :span="6" :xs="24">
            <el-form-item label="标准规格" prop="package_str">
              <el-input v-model="temp.package_str" />
            </el-form-item>
          </el-col>
          <el-col :span="6" :xs="24">
            <el-form-item label="标准货期" prop="stock">
              <el-input v-model="temp.stock" />
            </el-form-item>
          </el-col>
          <el-col :span="6" :xs="24">
            <el-form-item label="外观" prop="appearance">
              <el-input v-model="temp.appearance" />
            </el-form-item>
          </el-col>
          <el-col :span="6" :xs="24">
            <el-form-item label="简化分子线性输入规范" prop="smiles">
              <el-input v-model="temp.smiles" />
            </el-form-item>
          </el-col>
          <el-col :span="6" :xs="24">
            <el-form-item label="标准纯度" prop="purity">
              <el-input v-model="temp.purity" />
            </el-form-item>
          </el-col>
          <el-col :span="12" :xs="24">
            <el-form-item label="备注" prop="note">
              <el-input v-model="temp.note" />
            </el-form-item>
          </el-col>
          <el-col :span="6" :xs="24">
            <el-form-item label="是否有效" prop="active">
              <el-radio-group v-model="temp.active">
                <el-radio :label="0">
                  无效
                </el-radio>
                <el-radio :label="1">
                  有效
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="6" :xs="24">
            <el-form-item label="是否免检" prop="is_exemption">
              <el-radio-group v-model="temp.is_exemption">
                <el-radio :label="0">
                  否
                </el-radio>
                <el-radio :label="1">
                  是
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="6" :xs="24">
            <el-form-item label="是否核实" prop="is_verify">
              <el-radio-group v-model="temp.is_verify">
                <el-radio :label="0">
                  否
                </el-radio>
                <el-radio :label="1">
                  是
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="6" :xs="24">
            <el-form-item label="是否优势产品" prop="is_advantage">
              <el-radio-group v-model="temp.is_advantage">
                <el-radio :label="0">
                  否
                </el-radio>
                <el-radio :label="1">
                  是
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" :xs="24">
            <el-form-item label="上传COA文件" prop="attachment_id">
              <div class="attachment_list">
                <ul class="el-upload-list el-upload-list--text">
                  <li tabindex="0" class="el-upload-list__item is-success" v-for="item in attachment_list" :key="item.id">
                    <a class="el-upload-list__item-name" :href="item.path" :download="item.path"><i class="el-icon-document"></i>{{item.name}}
                    </a>
                    <!-- <label class="el-upload-list__item-status-label"><i class="el-icon-upload-success el-icon-circle-check"></i></label><i class="el-icon-close"></i><i class="el-icon-close-tip">按 delete 键可删除</i> -->
                  </li>
                </ul>
              </div>
              <Upload :id="temp.id" :value="temp.id" type="Product" />
              <p style="color:red;margin: 0">注:请先提交产品信息后再传COA文件,如果已上传文件，通过点击文件名可以下载文件到本地！</p>
              <el-button type="success" icon="el-icon-files" @click="showFilesDialog(temp)">设置COA模板</el-button>
            </el-form-item>
          </el-col>
          <!--  <el-col :span="12" :xs="24">
            <el-form-item label="设置COA模板" prop="attachment_id">
              <el-button type="success" icon="el-icon-files" @click="showFilesDialog(list)">设置COA模板</el-button>
            </el-form-item>
          </el-col> -->
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
    <!-- 上传产品信息 -->
    <el-dialog title="上传产品信息" :visible.sync="dialogFormVisible3" :close-on-click-modal="false" width="50%" :before-close="handleClose">
      <el-upload class="upload-demo" ref="upload" :action="uploadUrl" :headers="headers" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList" :auto-upload="false" :on-success="handleSuccess">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button> -->
        <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeUploadDialog">
          取消
        </el-button>
        <el-button type="primary" @click="submitUpload" v-preventReClick>
          上传到服务器
        </el-button>
      </div>
    </el-dialog>
    <!-- 附件信息 -->
    <File :showFlag="showFlag3" @closeChildDialog="closeChildDialog" :printData="printData" />
    <!-- 视图设置 -->
    <SetView :showFlag="showSettingFlag" @closeChildDialog="closeChildDialog" :viewData="viewData" @closeChange="closeCom(arguments)" />
  </div>
</template>
<script>
import { mapState } from 'vuex';
import Upload from '@/components/Upload/SingleImage2'
import { fetchList, create, update } from '@/api/chem'
import { getName, getToken } from '@/utils/auth'
import { getAttachmentList } from '@/api/commons'
import Pagination from '@/components/Pagination'
import chemicals from '@/components/Autocomplete/chemicals'
import File from "@/components/File"
import { getEmployeeSetting, updateEmployeeSetting } from '@/api/commons'
import SetView from '@/components/SetView'
import { parseTime, isInArray } from '@/utils'
import defaultViewData from '@/static/defaultViewData.json' // 默认视图数据

export default {
  name: 'ComplexTable',
  props: {
    showFlag: {
      type: Boolean
    }
  },
  components: { Pagination, chemicals, Upload, File, SetView },
  data() {
    return {
      showSearchData: null, //展示搜索数据
      showSettingFlag: false, //视图设置
      checkedSearchData: null, //选中搜索数据
      viewData: null, //视图数据
      showFlag3: false, //是否显示附件信息
      printData: null, //打印信息
      showComponent: true,
      attachment_list: null, //获取附件列表
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      limitNum: 1, // 上传excell时，同时允许上传的最大数
      fileList: [], // excel文件列表
      uploadUrl: null, //上传请求地址
      userName: getName(), //当前登录用户名字
      headers: {
        Authorization: getToken()
      },
      listQuery: {
        name: '',
        cas: '',
        page: 1,
        limit: 20
      },
      banCategoryList: [{
        "value": 0,
        "label": '不禁'
      }, {
        "value": 1,
        "label": '内贸禁止'
      }, {
        "value": 2,
        "label": '外贸禁止'
      }, {
        "value": 3,
        "label": '全部禁止'
      }],
      categoryList: [{
        "value": 0,
        "label": '办公用品'
      }, {
        "value": 1,
        "label": '制剂'
      }, {
        "value": 2,
        "label": '标准品'
      }, {
        "value": 3,
        "label": '对照品'
      }, {
        "value": 4,
        "label": '原料'
      }],
      unitList: [{
        "value": 1,
        "label": 'mg'
      }, {
        "value": 2,
        "label": 'g'
      }, {
        "value": 3,
        "label": 'kg'
      }, {
        "value": 4,
        "label": 'ML'
      }, {
        "value": 5,
        "label": 'L'
      }, {
        "value": 6,
        "label": 'T'
      }, {
        "value": 7,
        "label": 'mm'
      }, {
        "value": 8,
        "label": 'cm'
      }, {
        "value": 9,
        "label": 'm'
      }, {
        "value": 10,
        "label": '支'
      }, {
        "value": 11,
        "label": '瓶'
      }, {
        "value": 12,
        "label": '个'
      }, {
        "value": 13,
        "label": '把'
      }, {
        "value": 14,
        "label": '套'
      }, {
        "value": 15,
        "label": '组'
      }, {
        "value": 16,
        "label": '盒'
      }, {
        "value": 17,
        "label": '台'
      }, {
        "value": 18,
        "label": '包'
      }],
      temp: {
        "chemical_id": null,
        "cas": null,
        "name": null,
        "name_cn": null,
        "mdl": null,
        "formula": null,
        "molecular_weight": null,
        "smiles": null,
        "note": null,
        "ban_category": 0,
        "category": 4,
        "unit": 1,
        "purity": null,
        "package_str": null,
        "stock": null,
        "appearance": null,
        "active": 1,
        "attachment_id": null,
        "is_exemption": 0,
        "is_verify": 0,
        "is_advantage": 0
      },
      dialogFormVisible: false,
      dialogFormVisible3: false,
      dialogStatus: '',
      textMap: {
        update: '编辑产品信息',
        create: '创建产品信息'
      },
      pvData: [],
      rules: {
        cas: [{ required: true, message: 'CAS号不能为空', trigger: 'change' }],
        name_cn: [{ required: true, message: '产品中文名不能为空', trigger: 'change' }],
        name: [{ required: true, message: ' 产品英文名不能为空', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  computed: {
    ...mapState(['user/chemicalsInfo']),
    chemicalsInfo() {
      let info = this.$store.state.user.chemicalsInfo;
      if (info) {
        this.temp.chemical_id = info[0].id;
        this.temp.cas = info[0].cas;
        this.temp.name = info[0].name;
        this.temp.name_cn = info[0].name_cn;
        this.temp.formula = info[0].formula;
        this.temp.molecular_weight = info[0].molecular_weight;
        this.temp.mdl = info[0].mdl;
        this.temp.smiles = info[0].smiles;
      }
      return info;
    }
  },
  watch: {
    showFlag(newVal, oldVal) {
      newVal ? this.showComponent = true : this.showComponent = false;
      this.dialogVisible = newVal
    },
    '$store.state.user.attachmentId': function(newVal, oldVal) {
      console.log("newVal", newVal);
      //获取附件列表
      let tem = {
        "attachment_entity_type": 'Product',
        "attachment_entity_id": this.temp.id,
      }
      getAttachmentList(tem).then(response => {
        if (response.code == 0) {
          this.attachment_list = response.data.page_datas
        }
      })
    }
  },
  created() {
    this.getList()
    this.getEmployeeSetting()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        let data = response.data.page_datas
        this.list = data
        this.total = response.data.total_count
        this.listLoading = false
      })
    },
    resetTemp() {
      this.attachment_list = null
      this.listQuery = {
        name: '',
        cas: '',
        page: 1,
        limit: 20
      }
      this.temp = {
        "chemical_id": null,
        "cas": null,
        "name": null,
        "name_cn": null,
        "mdl": null,
        "formula": null,
        "molecular_weight": null,
        "smiles": null,
        "note": null,
        "ban_category": 0,
        "category": 4,
        "unit": 1,
        "purity": null,
        "package_str": null,
        "stock": null,
        "appearance": null,
        "active": 1,
        "is_exemption": 0,
        "is_verify": 0,
        "is_advantage": 0
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
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          create(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$store.commit("user/SET_CHEMICALS_INFO", null);
            this.getList();
            this.$notify({
              title: 'Success',
              message: '添加成功！',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      row.chemical_id = row.chemical_id ? row.chemical_id.toString() : null;
      this.temp = Object.assign({}, row)
      //获取附件列表
      let tem = {
        "attachment_entity_type": 'Product',
        "attachment_entity_id": row.id,
      }
      getAttachmentList(tem).then(response => {
        if (response.code == 0) {
          this.attachment_list = response.data.page_datas
        }
      })
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    showTable(row) {
      this.$router.push({ path: '/chem/products_detailed', query: { chemical_id: row.chemical_id, id: row.id } });
    },
    closeDialog() {
      this.resetTemp()
      //关闭弹窗方法
      this.$store.commit("user/SET_CHEMICALS_INFO", null);
      this.refresh();
      this.dialogFormVisible = false
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          update(tempData).then(() => {
            this.$store.commit("user/SET_CHEMICALS_INFO", null);
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
    //显示附件信息弹窗
    showFilesDialog(row) {
      this.printData = {
        entity_type: 'Product',
        rid: row.id
      }
      this.showFlag3 = true
    },
    /**
     * 接受子组件调用的关闭弹出框方法
     */
    closeChildDialog() {
      this.showFlag = false
      this.showFlag2 = false
      this.showFlag3 = false
      this.getList()
      this.showSettingFlag = false
      this.getEmployeeSetting();
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
    },
    handleClose(done) {
      // dialog 关闭回调
      done()
      this.activeName = 'customer'
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
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
    //关闭导入客户弹窗
    closeUploadDialog() {
      this.fileList = []
      this.dialogFormVisible3 = false
    },
    //导入客户信息
    submitUpload() {
     let that = this;
      that.uploadUrl = process.env.VUE_APP_BASE_API+"/api/admin/v1/chem/products/import";
      that.$nextTick(function () {
        that.$refs.upload.submit();
      })

    },
  }
}

</script>
