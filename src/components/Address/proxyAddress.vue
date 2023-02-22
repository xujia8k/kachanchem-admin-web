<template>
  <div class="ovh">
    <div class="tr">
      <el-button plain style="margin-left: 10px;" type="warning" icon="el-icon-circle-plus-outline" @click="handleCreate">
        新增收货地址
      </el-button>
    </div>
    <!-- 客户信息 -->
    <el-table :data="list" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="姓名">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系方式">
        <template slot-scope="scope">
          {{ scope.row.mobile }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="省市区"  :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          {{ scope.row.province }}{{ scope.row.city }}{{ scope.row.district }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="地址详情"  :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          {{ scope.row.address }}
        </template>
      </el-table-column>
      <!--是否需要展示在首页，1-是，0-否 -->
      <el-table-column align="center" label="默认地址" width="80">
        <template slot-scope="scope">
          {{ scope.row.is_default | statusFilter }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="110">
        <template slot-scope="{row}">
          <el-button type="primary" size="small" @click="handleUpdate(row)">
            修改
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="60%" :append-to-body="true">
      <el-form ref="rules" :rules="rules" :model="temp" label-position="right" label-width="110px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="temp.name" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="联系方式" prop="mobile">
              <el-input v-model="temp.mobile" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="地址" prop="PCD">
              <el-cascader v-model="temp.province_city_district" :props="props" @change="handleChange" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="默认地址" prop="is_default">
              <el-radio-group v-model="temp.is_default">
                <el-radio :label="0">
                  否
                </el-radio>
                <el-radio :label="1">
                  是
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="省份" prop="province">
              <el-input v-model="temp.province" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="城市" prop="city">
              <el-input v-model="temp.city" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地区" prop="district">
              <el-input v-model="temp.district" />
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="地址详细" prop="address">
              <el-input v-model="temp.address" type="textarea" show-word-limit />
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
import { addClass, removeClass } from '@/utils'
import { forwardCompaniesAddressesList, createForwardCompaniesAddress, updateForwardCompaniesAddress } from '@/api/crm'
import { fetchProvinces, fetchCities, fetchDistricts } from '@/api/address'
import Pagination from '@/components/Pagination'
export default {
  name: 'Customer',
  components: { Pagination },
  props: {
    id: {
      default: false,
      type: String
    }
  },
  data() {
    return {
      address: null, // 存放选中地址信息
      props: {
        lazy: true,
        lazyLoad: this.lazyLoad
      },
      list: null,
      total: 0,
      listQuery: {
        page: 1,
        limit: 5
      },
      temp: {
        page: 1,
        limit: 5
      },
      dialogStatus: '',
      dialogFormVisible: false,
      downloadLoading: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        mobile: [{ required: true, message: '电话不能为空', trigger: 'blur' }],
        address: [{ required: true, message: '地址不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {},
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      const that = this
      that.listLoading = true
      that.listQuery.id = that.id
      forwardCompaniesAddressesList(that.listQuery).then(response => {
        that.list = response.data.page_datas
        that.total = response.data.total_count
        that.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.listQuery = {
        page: 1,
        limit: 5
      }
      this.temp = {
        id: null,
        name: null,
        mobile: null,
        province: null,
        city: null,
        district: null,
        address: null,
        is_default: 1,
        page: 1,
        limit: 5
      }
    },
    handleUpdate(row) {
      this.companyId = row.id
      row.province_city_district = [row.province, row.city, row.district]
      row.address_id = row.id
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.address = [row.province, row.city, row.district]
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['rules'].clearValidate()
      })
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['rules'].clearValidate()
      })
    },
    createData() {
      const that = this
      that.$refs['rules'].validate((valid) => {
        if (valid) {
          that.temp.province = that.address[0]
          that.temp.city = that.address[1]
          that.temp.district = that.address[2]
          createForwardCompaniesAddress(that.id,that.temp).then(() => {
            that.getList()
            that.dialogFormVisible = false
            that.$notify({
              title: 'Success',
              message: '创建成功！',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    updateData() {
      const that = this
      that.$refs['rules'].validate((valid) => {
        if (valid) {
          that.temp.province = that.address[0]
          that.temp.city = that.address[1]
          that.temp.district = that.address[2]
          const tempData = Object.assign({}, that.temp)
          updateForwardCompaniesAddress(that.id, tempData).then(() => {
            for (const v of that.list) {
              if (v.id === that.temp.id) {
                const index = that.list.indexOf(v)
                that.list.splice(index, 1, that.temp)
                break
              }
            }
            that.$notify({
              title: 'Success',
              message: '修改成功！',
              type: 'success',
              duration: 2000
            })
            that.dialogFormVisible = false
          })
        }
      })
    },
    lazyLoad(node, resolve) {
      const that = this
      setTimeout(() => {
        if (node.level == 0) {
          that.getProvinces(node, resolve)
        } else if (node.level == 1) {
          that.getCities(node.value, node, resolve)
        } else if (node.level == 2) {
          that.getDistricts(node.value, node, resolve)
        } else {
          resolve(node)
        }
      }, 10)
    },
    // 获取省份信息
    getProvinces(node, resolve) {
      const that = this
      fetchProvinces().then(response => {
        if (response.code == 0) {
          const nodes = response.data.provinces.map(item => ({
            value: item,
            label: item
          }))
          resolve(nodes)
        }
      })
    },
    // 获取城市信息
    getCities(name, node, resolve) {
      const that = this
      const tem = {
        province_name: name
      }
      fetchCities(tem).then(response => {
        if (response.code == 0) {
          const nodes = response.data.cities.map(item => ({
            value: item,
            label: item
          }))
          resolve(nodes)
        }
      })
    },
    // 获取区域信息
    getDistricts(name, node, resolve) {
      const that = this

      const tem = {
        city_name: name
      }
      fetchDistricts(tem).then(response => {
        if (response.code == 0) {
          const nodes = response.data.districts.map(item => ({
            value: item,
            label: item,
            leaf: node.level >= 2
          }))
          resolve(nodes)
        }
      })
    },
    handleChange(value) {
      this.address = value
    }
  }
}

</script>
