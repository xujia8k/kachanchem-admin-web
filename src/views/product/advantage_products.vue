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
          <img :src="scope.row.product_img_url" style="display: block;max-width:110px;height:auto;">
        </template>
      </el-table-column>
      <el-table-column label="纯度" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.purity}}</span>
        </template>
      </el-table-column>
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
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="small" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="danger" size="small" @click="handleDeleteGoods(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="90%" :before-close="onClose">
      <el-form ref="dataForm" :model="temp" label-position="right" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="产品名称" prop="name">
              <products style="width:100%" v-if="dialogStatus=='create' && showComponent"/>
              <el-input v-model="temp.name" placeholder="请输入名称！" v-else/>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="dialogStatus=='update'">
            <el-form-item label="Cas号" prop="cas">
              <el-input v-model="temp.cas" placeholder="请输入Cas号！" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="价格" prop="reference_price">
              <el-input v-model="temp.reference_price" placeholder="请输入价格！" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="排序" prop="weight">
              <el-input v-model="temp.weight" placeholder="请输入排序" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onClose">
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
import { mapState } from 'vuex';
import { fetchAdvantageProductsList, createAdvantageProducts, updateAdvantageProducts, deleteAdvantageProducts } from '@/api/product'
import { fetchClassifyList } from '@/api/commons'
import Pagination from '@/components/Pagination'
import products from '@/components/Autocomplete/products'

export default {
  name: 'ComplexTable',
  components: { Pagination, products },
  computed: {
    ...mapState(['user/productsInfo']),
    productsInfo() {
      return this.$store.state.user.productsInfo;
    },
  },  
  props: {
    showFlag: {
      type: Boolean
    }
  },
  watch: {
    showFlag(newVal, oldVal) {
      debugger
      console.log(newVal, oldVal)
      newVal ? this.showComponent = true : this.showComponent = false;
      this.dialogVisible = newVal
    }
  },
  data() {
    return {
      showComponent: true,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
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
        weight: null,
        mf: null,
        mw: null,
        classify: null,
        coa_url: null, //coa附件地址
        msds_url: null, //msds附件地址
        test_report_url: null, //report附件地址
        is_advantage: 0
      },
      dialogFormVisible: false,
      dialogStatus: '',
      inputVisible: false,
      inputValue: '',
      textMap: {
        update: '编辑商品信息',
        create: '创建商品信息'
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
      fetchAdvantageProductsList(this.listQuery).then(response => {
        this.list = response.data.page_datas
        this.total = response.data.total_count
        this.listLoading = false
      })
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
        weight: null,
        mf: null,
        mw: null,
        classify: null,
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
      this.showComponent = true
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let tem ={
            product_id:this.$store.state.user.productsInfo[0].id,
            weight:this.temp.weight ||1
          }
          createAdvantageProducts(tem).then(() => {
            this.dialogFormVisible = false
            this.getList()
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
        deleteAdvantageProducts(row).then(response => {
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
          updateAdvantageProducts(this.temp, this.temp.id).then(() => {
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
    onClose() {
      this.resetTemp();
      this.showComponent = false;
      this.$store.commit("user/SET_PRODUCTS_INFO", '');
      this.$emit('closeChildDialog')
      this.dialogFormVisible = false
    },
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