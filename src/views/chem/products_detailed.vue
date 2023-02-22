<template>
  <div class="app-container">
    <el-row>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>产品详情</span>
        </div>
        <div style="margin-bottom:50px;">
          <!-- 订单详情 -->
          <el-form :model="list" class="demo-form-inline" label-width="100px">
            <el-row :gutter="20">
              <el-col :span="6" :xs="24">
                <el-form-item label="分装号">
                  <el-input :disabled="true" v-model="list.prepack_no" />
                </el-form-item>
              </el-col>
              <el-col :span="6" :xs="24">
                <el-form-item label="产品编号">
                  <el-input :disabled="true" v-model="list.inventory_prepacks[0].product_no" v-if="list.inventory_prepacks[0]" />
                  <el-input :disabled="true" v-model="list.product_no" v-else />
                </el-form-item>
              </el-col>
              <el-col :span="6" :xs="24">
                <el-form-item label="产品名称">
                  <el-input :disabled="true" v-model="list.inventory_prepacks[0].product_name" v-if="list.inventory_prepacks[0]" />
                  <el-input :disabled="true" v-model="list.product_name" v-else />
                </el-form-item>
              </el-col>
              <el-col :span="6" :xs="24">
                <el-form-item label="Cas号">
                  <el-input :disabled="true" v-model="list.inventory_prepacks[0].cas" v-if="list.inventory_prepacks[0]" />
                  <el-input :disabled="true" v-model="list.cas" v-else />
                </el-form-item>
              </el-col>
              <el-col :span="6" :xs="24">
                <el-form-item label="分装日期">
                  <el-date-picker v-model="list.updated_at" type="date" placeholder="选择日期" style="width: 100%;" value-format="yyyy-MM-dd HH:mm:ss" :disabled="true" />
                </el-form-item>
              </el-col>
              <el-col :span="6" :xs="24">
                <el-form-item label="操作员">
                  <el-input :disabled="true" v-model="list.employee_name" />
                </el-form-item>
              </el-col>
              <el-col :span="12" :xs="24">
                <el-form-item label="备注">
                  <el-input v-model="list.mark" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div class="clearfix">
            <el-button-group class="fl" v-if="list.prepack_status == 0">
              <el-button type="success" icon="el-icon-plus" size="mini" @click="addSource">添加来源</el-button>
            </el-button-group>
          </div>



        </div>
      </el-card>
    </el-row>

  </div>
</template>
<script>

export default {
  name: 'Profile',
  components: {  },
  data() {
    return {
      storehouseLists: [], // 仓库及库位信息
      tem_inventory: [], //临时数组存放库存清单
      inventoryDetailList: null,
      prepack_no: null, //分装作业id
      pageStatus: 'update', //页面状态
      list: {
        id: null,
        chemical_name: null,
        package_str: null,
        cas: null,
        purity: null,
        mark: null,
        purchase_name: null,
        status: null,
        has_quotation: null,
        prepack_status: 0,
        inventory_prepacks: [],
        inventory_prepack_details: []
      },
      listLoading: true,
      total: 0,
      dialogFormVisible: false,
      temp: {
        leader_id: '',
        name: ''
      },
      temp2: {
        batch_no: null,
        product_no: null,
        product_name: null,
        cas: null,
        storehouse_name: null
      },
      downloadLoading: false,
      rules: {}
    }
  },
  created() {
    let that = this;
    if (that.$route.query.id) {
      that.id = that.$route.query.id;
    }
    if (that.$route.query.prepack_no) {
      that.prepack_no = that.$route.query.prepack_no;
      that.pageStatus = 'update';
      that.getList();
    } else {
      that.pageStatus = 'add';
    }
    that.getStorehouseList();
  },
  methods: {
    getList() {
      let tem = {
        prepack_no: this.prepack_no
      }
      prepackDetail(tem).then(response => {
        let data = response.data;
        //库位信息写入
        for (var i = 0; i < data.inventory_prepack_details.length; i++) {
          data.inventory_prepack_details[i].storehouse = [data.inventory_prepack_details[i].storehouse_id, data.inventory_prepack_details[i].storehouse_detail_id]
        }
        this.list = data;
        this.listLoading = false
      })
    },
    resetTemp() {
      this.temp = {
        leader_id: '',
        name: ''
      }
    },
    refresh() {
      let that = this;
      that.resetTemp()
      that.id = that.$route.query.id;
      that.getList()
    }
  }
}

</script>
<style lang="scss" scoped>

</style>
