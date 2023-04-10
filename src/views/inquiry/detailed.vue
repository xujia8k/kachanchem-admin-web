<template>
  <div class="app-container">
    <el-row>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>询盘订单详情</span>
        </div>
        <div style="margin-bottom:50px;">
          <!-- 订单详情 -->
          <el-form :model="list" class="demo-form-inline" label-width="100px">
            <el-row :gutter="20">
              <el-col :span="6" :xs="24">
                <el-form-item label="询盘订单id">
                  <el-input :disabled="true" v-model="list.id" />
                </el-form-item>
              </el-col>
              <el-col :span="6" :xs="24">
                <el-form-item label="询盘订单号">
                  <el-input :disabled="true" v-model="list.inquiry_no" />
                </el-form-item>
              </el-col>
              <el-col :span="6" :xs="24">
                <el-form-item label="客户">
                  <el-input :disabled="true" v-model="list.company_name" />
                </el-form-item>
              </el-col>
              <!--   <el-col :span="6" :xs="24">
                <el-form-item label="联系人">
                  <el-input :disabled="true" v-model="list.company_name" />
                </el-form-item>
              </el-col> -->
              <el-col :span="6" :xs="24">
                <el-form-item label="联系人邮箱">
                  <el-input :disabled="true" v-model="list.email" />
                </el-form-item>
              </el-col>
              <el-col :span="6" :xs="24">
                <el-form-item label="联系人手机号">
                  <el-input :disabled="true" v-model="list.phone" />
                </el-form-item>
              </el-col>
              <el-col :span="6" :xs="24">
                <el-form-item label="备注">
                  <el-input :disabled="true" v-model="list.note" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div class="ovh">
            <div class="ovh fr">
              <template>
                <el-button type="warning" @click="handleCreateSalesOrder()" v-preventReClick v-if="list.status == 1">生成订单预览</el-button>
                <el-button type="success" @click="handleSendQuotation()" v-preventReClick v-if="list.status == 0">发送报价</el-button>
                <el-button type="success" @click="handleRelateCustomer()" v-preventReClick v-if="!list.customer_id">关联客户</el-button>
              </template>
            </div>
          </div>
          <!-- 商品信息 -->
          <div class="card">
            <el-row :gutter="20">
              <el-col :span="10" :xs="24">
                <div class="item"><label class="name">询问产品名:</label>{{ list.product_name }}</div>
              </el-col>
              <el-col :span="4" :xs="24">
                <div class="item"><label class="name">询问CAS号:</label>{{ list.cas }}</div>
              </el-col>
              <el-col :span="4" :xs="24">
                <div class="item"><label class="name">CAS号:</label>{{ list.cas }}</div>
              </el-col>
              <el-col :span="3" :xs="24">
                <div class="item"><label class="name">纯度:</label>{{ list.purity }}</div>
              </el-col>
              <el-col :span="3" :xs="24">
                <div class="item"><label class="name">数量:</label>{{ list.package_str }}</div>
              </el-col>
              <el-col :span="10" :xs="24">
                <div class="item"><label class="name">备注:</label>{{ list.note }}</div>
              </el-col>
              <el-col :span="12" :xs="24" v-if="list.status != 3">
                <div class="item"><label class="name">操作:</label>
                  <el-button type="success" size="mini" @click="getQuotationHistories(list.id)">历史报价</el-button>
                  <el-button type="primary" size="mini" @click="handleCreate(list.inquiry_quotations)">添加报价/修改报价</el-button>
                </div>
              </el-col>
            </el-row>
            <!-- 报价信息 -->
            <el-table :data="list.inquiry_quotations" type="index" style="width: 100%;margin-top: 10px" @selection-change="handleSelectionChange($event,index)" border>
              <el-table-column type="selection" width="39" />
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-form label-position="right" inline class="demo-table-expand">
                    <el-form-item label="产品性状">
                      <span>{{ props.row.appear_shape }}</span>
                    </el-form-item>
                    <el-form-item label="汇率">
                      <span>{{ props.row.exchange_rate }}</span>
                    </el-form-item>
                    <el-form-item label="采购报价/汇率">
                      <span>{{ props.row.cost_price }}</span>
                    </el-form-item>
                    <el-form-item label="采购报价">
                      <span>{{ props.row.cost_price_usd }}</span>
                    </el-form-item>
                    <el-form-item label="利润">
                      <span>{{ props.row.profit }}</span>
                    </el-form-item>
                    <el-form-item label="运费">
                      <span>{{ props.row.shipping_fee }}</span>
                    </el-form-item>
                    <el-form-item label="操作费">
                      <span>{{ props.row.operating_fee }}</span>
                    </el-form-item>
                    <!-- <el-form-item label="检测项目">
                      <span>{{ props.row.testing_project }}</span>
                    </el-form-item> -->
                    <el-form-item label="检测费">
                      <span>{{ props.row.testing_fee }}</span>
                    </el-form-item>
                    <el-form-item label="是否报关">
                      <span>{{ props.row.is_declare | statusFilter}}</span>
                    </el-form-item>
                    <el-form-item label="报关费">
                      <span>{{ props.row.declare_fee }}</span>
                    </el-form-item>
                    <!--  <el-form-item label="鉴定项目">
                      <span>{{ props.row.appraisal_project }}</span>
                    </el-form-item> -->
                    <el-form-item label="鉴定费">
                      <span>{{ props.row.appraisal_fee }}</span>
                    </el-form-item>
                    <el-form-item label="银行手续费">
                      <span>{{ props.row.bank_fee }}</span>
                    </el-form-item>
                    <el-form-item label="是否危险品">
                      <span>{{ props.row.is_dangerous | statusFilter}}</span>
                    </el-form-item>
                    <el-form-item label="存储条件">
                      <span>{{ props.row.storage }}</span>
                    </el-form-item>
                    <el-form-item label="监管条件">
                      <span>{{ props.row.is_take_charge | isTtakeChargeFilter}}</span>
                    </el-form-item>
                    <el-form-item label="HS编码">
                      <span>{{ props.row.hs_code }}</span>
                    </el-form-item>
                    <el-form-item label="原产国">
                      <span>{{ props.row.country }}</span>
                    </el-form-item>
                    <el-form-item label="是否定制">
                      <span>{{ props.row.is_customized | isCustomizedFilter}}</span>
                    </el-form-item>
                    <el-form-item label="货期">
                      <span>{{ props.row.stock }}</span>
                    </el-form-item>
                    <el-form-item label="报价术语">
                      <span>{{ props.row.incoterms }}</span>
                    </el-form-item>
                    <el-form-item label="采购备注">
                      <span>{{ props.row.purchase_note }}</span>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column align="center" label="供应商">
                <template slot-scope="scope">
                  <span>{{ scope.row.vendor_company_name }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="报价时间">
                <template slot-scope="scope">
                  <span>{{ scope.row.created_at }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="价格">
                <template slot-scope="scope" >
                  <span v-if="scope.row.price == 0">/</span>
                  <span v-else>{{ scope.row.price }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="采购报价">
                <template slot-scope="scope">
                  {{ scope.row.cost_price }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="规格">
                <template slot-scope="scope">
                  {{ scope.row.package }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="纯度">
                <template slot-scope="scope">
                  {{ scope.row.purity }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="备注">
                <template slot-scope="scope">
                  {{ scope.row.note }}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <!-- 新增修改完善报价 -->
        <el-dialog title="报价列表" :visible.sync="dialogFormVisible" width="90%" :close-on-click-modal="false" @close="handleClose">
          <!-- <el-button class="filter-item" style="margin-left: 10px; margin-bottom: 20px" type="warning" icon="el-icon-circle-plus-outline" @click="handleCreateQuotation">添加报价</el-button> -->
          <!-- 报价信息 -->
          <el-table v-loading="listLoading" :data="quotationList" border highlight-current-row style="width: 100%;">
            <el-table-column label="供应商" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.vendor_company_name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="采购报价" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.cost_price }}</span>
              </template>
            </el-table-column>
            <el-table-column label="总价" align="center">
              <template slot-scope="scope" v-if="scope.row.price == 0">/</template>
              <template slot-scope="scope" v-else>
                {{ scope.row.price }}
              </template>
            </el-table-column>
            <!-- <el-table-column label="货币类型" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.currency_type }}</span>
              </template>
            </el-table-column> -->
            <el-table-column label="数量" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.package }}</span>
              </template>
            </el-table-column>
            <el-table-column label="纯度" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.purity }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="运输方式" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.transport_mode }}</span>
              </template>
            </el-table-column> -->
            <el-table-column label="利润" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.profit }}</span>
              </template>
            </el-table-column>
            <el-table-column label="运费" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.shipping_fee }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作费" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.operating_fee }}</span>
              </template>
            </el-table-column>
            <el-table-column label="检测费" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.testing_fee }}</span>
              </template>
            </el-table-column>
            <el-table-column label="银行手续费" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.bank_fee }}</span>
              </template>
            </el-table-column>
            <el-table-column label="鉴定费" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.appraisal_fee }}</span>
              </template>
            </el-table-column>
            <el-table-column label="报关费" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.declare_fee }}</span>
              </template>
            </el-table-column>
            <el-table-column label="货期" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.stock }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
              <template slot-scope="{row}">
                <el-button type="primary" size="small" @click="handleUpdateQuotation(row)">
                  编辑
                </el-button>
                <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">
              取消
            </el-button>
          </div>
        </el-dialog>
        <!-- 报价详情 -->
        <el-dialog title="报价详情" :visible.sync="dialogFormVisible3" width="80%" :close-on-click-modal="false">
          <el-form ref="dataForm" :model="quotation" label-position="right" label-width="100px" style=" margin-left:40px;">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="供应商">
                  <el-input v-model="quotation.vendor_company_name" placeholder="请输入供应商！" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="数量">
                  <el-input v-model="quotation.package" placeholder="请输入数量！" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="纯度">
                  <el-input v-model="quotation.purity" placeholder="请输入纯度！" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="总价">
                  <el-input v-model="computePrice" placeholder="请输入价格！" :disabled="true" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="采购报价/汇率">
                  <el-input v-model="quotation.cost_price_usd" placeholder="请输入采购报价/汇率！" />
                </el-form-item>
              </el-col>
              <!--<el-col :span="8">
                <el-form-item label="采购报价">
                  <el-input v-model="quotation.cost_price" placeholder="请输入采购报价！" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="货币类型">
                  <el-select v-model="quotation.currency_type" placeholder="请选择币种" style="width: 100%;">
                    <el-option v-for="item in company_currency_type" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="汇率">
                  <el-input v-model="quotation.exchange_rate" placeholder="请输入汇率！" />
                </el-form-item>
              </el-col> -->
              <el-col :span="8">
                <el-form-item label="利润">
                  <el-input v-model="quotation.profit" placeholder="请输入利润！" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="运费">
                  <el-input v-model="quotation.shipping_fee" placeholder="请输入运费！" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="操作费">
                  <el-input v-model="quotation.operating_fee" placeholder="请输入操作费！" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="检测项目">
                  <el-select v-model="quotation.testing_project" placeholder="请选择检测项目" style="width: 100%;" @change="testing_projectChange">
                    <el-option v-for="item in testingFeeList" :key="item.testing_project" :label="item.testing_project" :value="item.testing_fee" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="鉴定项目">
                  <el-select v-model="quotation.appraisal_project" placeholder="请选择鉴定项目" style="width: 100%;" @change="appraisal_projectChange">
                    <el-option v-for="(item, index) in appraisalFeeList" :key="index" :label="item.appraisal_project" :value="item.appraisal_fee" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="银行手续费">
                  <el-input v-model="quotation.bank_fee" placeholder="请输入银行手续费！" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="是否危险品" prop="is_dangerous">
                  <el-radio-group v-model="quotation.is_dangerous">
                    <el-radio :label="0">
                      否
                    </el-radio>
                    <el-radio :label="1">
                      是
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="监管条件" prop="is_take_charge">
                  <el-radio-group v-model="quotation.is_take_charge">
                    <el-radio :label="0">
                      无
                    </el-radio>
                    <el-radio :label="1">
                      有
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="是否报关" prop="is_declare">
                  <el-radio-group v-model="quotation.is_declare" @change="changeDeclare">
                    <el-radio :label="0">
                      否
                    </el-radio>
                    <el-radio :label="1">
                      是
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <!-- <el-input v-model="quotation.declare_fee" placeholder="请输入报关费！" /> -->
              </el-col>
              <el-col :span="8">
                <el-form-item label="是否定制" prop="is_customized">
                  <el-radio-group v-model="quotation.is_customized">
                    <el-radio :label="0">
                      现货
                    </el-radio>
                    <el-radio :label="1">
                      定制
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="货期">
                  <el-input v-model="quotation.stock" placeholder="请输入货期！" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="存储条件">
                  <!-- <el-input v-model="quotation.storage" placeholder="请输入存储条件！" /> -->
                  <el-select v-model="quotation.storage" placeholder="请选择存储条件" style="width: 100%;">
                    <el-option v-for="(item, index) in storageList" :key="index" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="产品性状">
                  <el-input v-model="quotation.appear_shape" placeholder="请输入产品性状！" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="HS编码">
                  <el-input v-model="quotation.hs_code" placeholder="请输入HS编码！" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="原产国">
                  <el-input v-model="quotation.country" placeholder="请输入原产国！" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="运输方式">
                  <el-select v-model="quotation.transport_mode" placeholder="请选择运输方式" style="width: 100%;">
                    <el-option v-for="item in transportModeList" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="报价贸易术语">
                  <el-select v-model="quotation.incoterms" placeholder="请选择报价贸易术语" style="width: 100%;">
                    <el-option v-for="item in incotermsList" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="备注">
                  <el-input v-model="quotation.note" placeholder="请输入备注！" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible3 = false">
              取消
            </el-button>
            <el-button type="primary" @click="updateQuotation(quotation,quotation.inquiry_quotation_id)">
              确认
            </el-button>
          </div>
        </el-dialog>
        <!-- 历史报价 -->
        <el-drawer :visible.sync="drawer" :with-header="false" :append-to-body="true" :modal-append-to-body="false" size="70%">
          <el-tabs type="border-card">
            <el-tab-pane label="历史报价">
              <el-table :data="quotationHistories" style="width: 100%" element-loading-text="拼命加载中" border fit highlight-current-row stripe class="us cp">
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
        <!-- 订单生成 -->
        <el-dialog title="生成销售订单" :visible.sync="dialogFormVisible2" width="90%" :close-on-click-modal="false" @close="handleClose">
          <p style="color:red">注：请检查订单信息，点击确定按钮将生成销售订单</p>
          <div class="card">
            <el-row :gutter="20">
              <el-col :span="10" :xs="24">
                <div class="item"><label class="name">询问产品名:</label>{{ list.product_name }}</div>
              </el-col>
              <el-col :span="4" :xs="24">
                <div class="item"><label class="name">询问CAS号:</label>{{ list.cas }}</div>
              </el-col>
              <el-col :span="4" :xs="24">
                <div class="item"><label class="name">CAS号:</label>{{ list.cas }}</div>
              </el-col>
              <el-col :span="3" :xs="24">
                <div class="item"><label class="name">纯度:</label>{{ list.purity }}</div>
              </el-col>
              <el-col :span="3" :xs="24">
                <div class="item"><label class="name">数量:</label>{{ list.package_str }}</div>
              </el-col>
              <el-col :span="10" :xs="24">
                <div class="item"><label class="name">备注:</label>{{ list.note }}</div>
              </el-col>
            </el-row>
            <!-- 报价信息 -->
            <el-table :data="selectRFQ" type="index" style="width: 100%;margin-top: 10px" border>
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-form label-position="right" inline class="demo-table-expand">
                    <el-form-item label="产品性状">
                      <span>{{ props.row.appear_shape }}</span>
                    </el-form-item>
                    <el-form-item label="汇率">
                      <span>{{ props.row.exchange_rate }}</span>
                    </el-form-item>
                    <el-form-item label="采购报价/汇率">
                      <span>{{ props.row.cost_price }}</span>
                    </el-form-item>
                    <el-form-item label="采购报价">
                      <span>{{ props.row.cost_price_usd }}</span>
                    </el-form-item>
                    <el-form-item label="利润">
                      <span>{{ props.row.profit }}</span>
                    </el-form-item>
                    <el-form-item label="运费">
                      <span>{{ props.row.shipping_fee }}</span>
                    </el-form-item>
                    <el-form-item label="操作费">
                      <span>{{ props.row.operating_fee }}</span>
                    </el-form-item>
                    <!-- <el-form-item label="检测项目">
                      <span>{{ props.row.testing_project }}</span>
                    </el-form-item> -->
                    <el-form-item label="检测费">
                      <span>{{ props.row.testing_fee }}</span>
                    </el-form-item>
                    <el-form-item label="是否报关">
                      <span>{{ props.row.is_declare | statusFilter}}</span>
                    </el-form-item>
                    <el-form-item label="报关费">
                      <span>{{ props.row.declare_fee }}</span>
                    </el-form-item>
                    <!--  <el-form-item label="鉴定项目">
                      <span>{{ props.row.appraisal_project }}</span>
                    </el-form-item> -->
                    <el-form-item label="鉴定费">
                      <span>{{ props.row.appraisal_fee }}</span>
                    </el-form-item>
                    <el-form-item label="银行手续费">
                      <span>{{ props.row.bank_fee }}</span>
                    </el-form-item>
                    <el-form-item label="是否危险品">
                      <span>{{ props.row.is_dangerous | statusFilter}}</span>
                    </el-form-item>
                    <el-form-item label="存储条件">
                      <span>{{ props.row.storage }}</span>
                    </el-form-item>
                    <el-form-item label="监管条件">
                      <span>{{ props.row.is_take_charge | isTtakeChargeFilter}}</span>
                    </el-form-item>
                    <el-form-item label="HS编码">
                      <span>{{ props.row.hs_code }}</span>
                    </el-form-item>
                    <el-form-item label="原产国">
                      <span>{{ props.row.country }}</span>
                    </el-form-item>
                    <el-form-item label="是否定制">
                      <span>{{ props.row.is_customized | isCustomizedFilter}}</span>
                    </el-form-item>
                    <el-form-item label="货期">
                      <span>{{ props.row.stock }}</span>
                    </el-form-item>
                    <el-form-item label="报价术语">
                      <span>{{ props.row.incoterms }}</span>
                    </el-form-item>
                    <el-form-item label="采购备注">
                      <span>{{ props.row.purchase_note }}</span>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column align="center" label="供应商">
                <template slot-scope="scope">
                  <span>{{ scope.row.vendor_company_name }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="报价时间">
                <template slot-scope="scope">
                  <span>{{ scope.row.created_at }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="价格">
                <template slot-scope="scope" v-if="scope.row.price == 0">/</template>
                <template slot-scope="scope" v-else>
                  {{ scope.row.price }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="采购报价">
                <template slot-scope="scope">
                  {{ scope.row.cost_price }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="规格">
                <template slot-scope="scope">
                  {{ scope.row.package }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="纯度">
                <template slot-scope="scope">
                  {{ scope.row.purity }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="备注">
                <template slot-scope="scope">
                  {{ scope.row.note }}
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-form :model="temp1" label-position="right" label-width="110px">
            <el-row :gutter="20">
              <el-col :xs="24" :span="12">
                <el-form-item label="开票类型" prop="delivery_mobile">
                  <el-select v-model="temp1.invoice_type" placeholder="开票类型" style="width: 100%;" @change="invoiceTypeChange">
                    <el-option v-for="(item, index) in invoiceType" :key="index" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :span="12">
                <el-form-item label="付款方式" prop="delivery_mobile">
                  <el-select v-model="temp1.payment_type" placeholder="付款方式" style="width: 100%;">
                    <el-option v-for="item in paymentType" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :span="12">
                <el-form-item label="发票寄送地址" prop="invoice_address">
                  <el-select v-model="temp1.invoice_address" filterable placeholder="请选择收票地址" v-if="invoicesList.length>0">
                    <el-option v-for="item in invoicesList" :key="item.id" :label="item.company_name" :value="item.id" />
                  </el-select>
                  <el-input type="textarea" :rows="2" placeholder="请输入收票地址信息" v-model="temp1.invoice_address" v-else>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :span="12">
                <el-form-item label="收货地址" prop="ship_address">
                   <el-select v-model="temp1.ship_address" placeholder="收货地址" style="width: 100%;" v-if="addressList.length>0">
                <el-option v-for="item in addressList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
                  <el-input type="textarea" :rows="2" placeholder="请输入收货地址" v-model="temp1.ship_address" v-else>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :span="24">
                <el-form-item label="备注">
                  <el-input v-model="temp1.note" type="textarea" show-word-limit />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible2 = false">
              取消
            </el-button>
            <el-button type="primary" @click="createSalesOrder()" v-preventReClick>
              确认
            </el-button>
          </div>
        </el-dialog>
      </el-card>
    </el-row>
    <el-dialog title="分配询盘订单负责人" :visible.sync="dialogFormVisible4" :close-on-click-modal="false" width="30%">
      <el-select v-model="customer_id" filterable placeholder="请选择客户">
        <el-option v-for="item in customerList" :key="item.id" :label="item.company_name" :value="item.id">
        </el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible4 = false">
          关闭
        </el-button>
        <el-button type="primary" @click="updateRelateCustomer()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { inquiriesDetails, quotationsDetails, addQuotation, updateInquiriesQuotation, createCustomerOrder, cancelOrder, quotationHistories, testingFee, appraisalFee, exchangeRate, sendQuotation, updateRelateCustomer } from '@/api/inquiry'
import companies from '@/components/Autocomplete/companies'
import contacts from '@/components/Autocomplete/contacts'
import Pagination from '@/components/Pagination'
import { isInArray, parseTime } from '@/utils'
import { fetchCustomers } from '@/api/commons'
import { getName, getToken } from '@/utils/auth'
import { getCustomers } from '@/api/crm'
import { fetchAddressesList, fetchInvoicesList } from '@/api/crm'

export default {
  name: 'Profile',
  components: { companies, Pagination, contacts },
  props: {
    id: {
      default: false,
      type: String
    }
  },
  data() {
    return {
      props: {
        lazy: true,
        lazyLoad: this.lazyLoad
      },
      address: '1',
      // computePrice: 0,//成本价 + 具体利润 + 运费 +操作费 + 检测费 + 报关费（0/30usd） + 运输鉴定报告费 + 银行手续费
      note: null, //采购询价 备注
      pageStatus: null, //当前页面状态，add新增，edit编辑
      quotationHistories: null, //历史报价列表
      quotationDetailsInfo: null, //报价详情信息
      inquiry_detail_quotation_ids: [], //选中报价详情
      tem_quotation_ids: [], //临时数组存放报价详情
      companiesStatus: true, //是否可以修改供应商id 
      userName: getName(), //当前登录用户名字
      company_currency_type: [{
        "id": 1,
        "name": 'CNY'
      }, {
        "id": 2,
        "name": 'USD'
      }, {
        "id": 3,
        "name": 'INR'
      }, {
        "id": 4,
        "name": 'EUR'
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
      storageList: [{
        "value": '常温',
        "label": '常温'
      }, {
        "value": '2-8度',
        "label": '2-8度'
      }, {
        "value": '-20度',
        "label": '-20度'
      }],
      paymentType: [{
        "value": 0,
        "label": '款到发货'
      }, {
        "value": 1,
        "label": '预付30%货款'
      }, {
        "value": 2,
        "label": '预付50%货款'
      }],
      invoiceType: [{
        value: 1,
        label: '增值税普通发票(13%)'
      }, {
        value: 2,
        label: '增值税普通发票(3%)'
      }, {
        value: 3,
        label: '增值税专用发票(13%)'
      }, {
        value: 4,
        label: '不开票'
      }],
      incotermsList: [{
        value: 'EXW',
        label: 'EXW'
      }, {
        value: 'FOB',
        label: 'FOB'
      }, {
        value: 'CIF',
        label: 'CIF'
      }, {
        value: 'CPT',
        label: 'CPT'
      }, {
        value: 'CIP',
        label: 'CIP'
      }, {
        value: 'DAP',
        label: 'DAP'
      }, {
        value: 'DDP',
        label: 'DDP'
      }],
      transportModeList: [{
        value: 'by Courier',
        label: 'by Courier'
      }, {
        value: 'by Sea',
        label: 'by Sea'
      }, {
        value: 'by Express',
        label: 'by Express'
      }],
      quotationQuery: {
        inquiry_detail_quotation_id: null,
        price: null,
        package: null,
        unit: null,
        purity: null,
        note: null
      },
      list: {
        id: null,
        "inquiry_source": null,
        "created_at": null,
        "level": null,
        "company_name_cn": null,
        "employee_name": null,
        "contact_name": null,
        "contact_email": null,
        "company_trade_type": null,
        "company_country": null,
        "company_currency_type": null,
        "company_note": null,
        "inquiry_details": null
      },
      groupList: null,
      listLoading: true,
      total: 0,
      order: {
        user: '',
        importance: 1,
        rating: 4
      },
      listQuery: {
        page: 1,
        limit: 20
      },
      total2: 0,
      listQuery2: {
        page: 1,
        limit: 10
      },
      quotationList: '', //报价详情
      quotationList: {
        quotation_details: null,
        purchase_inquiries: null
      }, //报价详情
      temp: {
        leader_id: '',
        name: ''
      }, //报价详情
      temp1: {
        inquiry_quotation_ids: '',
        payment_type: 0,
        invoice_type: 1,
        invoice_address: '',
        ship_address: '',
        note: ''
      },
      temp2: {
        id: null,
        name: null,
        mobile: null,
        province: null,
        city: null,
        district: null,
        address: null,
        is_default: 1
      },
      temp3: {
        company_name: null,
        tax_no: null,
        mobile: null,
        company_address: null,
        bank: null,
        account_no: null,
        delivery_address: null,
        delivery_country: null,
        delivery_contact: null,
        delivery_mobile: null,
        category: null,
        delivery_email: null,
        fax: null,
        is_default: 0,
        active: 0,
        page: 1,
        limit: 100
      },
      textMap: {
        update: '完善报价',
        create: '添加报价'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      dialogFormVisible2: false,
      dialogFormVisible3: false,
      dialogFormVisible4: false,
      downloadLoading: false,
      selectRFQ: [],
      testingFeeList: [],
      appraisalFeeList: [],
      exchangeRateList: '',
      quotation: {
        "inquiry_id": null,
        "inquiry_quotation_id": null,
        "vendor_company_name": null,
        "price": null,
        "package": null,
        "purity": null,
        "appear_shape": null,
        "purchase_note": null,
        "note": null,
        "created_at": null,
        "cost_price": null,
        "exchange_rate": null,
        "cost_price_usd": null,
        "incoterms": null,
        "transport_mode": null,
        "profit": null,
        "shipping_fee": null,
        "operating_fee": null,
        "testing_project": null,
        "testing_fee": null,
        "declare_fee": null,
        "appraisal_project": null,
        "appraisal_fee": null,
        "bank_fee": null,
        "storage": null,
        "hs_code": null,
        "country": null,
        "is_declare": 0,
        "is_dangerous": 0,
        "is_take_charge": 1,
        "is_customized": 0,
        "stock": null
      },
      drawer: false,
      customer_id: null,
      customerList: [],
      addressList: [],
      invoicesList: []
    }
  },
  watch: {
    companiesInfo(newVal, oldVal) {
      this.vendor_id = null;
      this.contactsList = null;
    }
  },
  computed: {
    ...mapState(['user/contactsInfo', 'user/companiesInfo']),
    companiesInfo() {
      return this.$store.state.user.companiesInfo;
    },
    contactsInfo() {
      return this.$store.state.user.contactsInfo;
    },
    computePrice() {
      // 成本价 + 具体利润 + 运费 +操作费 + 检测费 + 报关费（0/30usd） + 运输鉴定报告费 + 银行手续费  = total price
      return parseFloat(parseFloat(parseFloat(this.quotation.cost_price_usd) + parseFloat(this.quotation.profit) + parseFloat(this.quotation.shipping_fee) + parseFloat(this.quotation.operating_fee) + parseFloat(this.quotation.testing_fee) + parseFloat(this.quotation.declare_fee) + parseFloat(this.quotation.appraisal_fee) + parseFloat(this.quotation.bank_fee)).toFixed(2))
    }
  },
  created() {
    let that = this;
    if (that.$route.query.id) {
      that.id = that.$route.query.id;
      that.listQuery.id = that.$route.query.id;
      that.getList()
      that.pageStatus = 'edit';
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      this.listQuery.id = this.$route.query.id;
      inquiriesDetails(this.listQuery).then(response => {
        let data = response.data;

        this.list = data
        this.listLoading = false
      })
    },
    resetTemp() {
      this.customer_id = null;
      this.listQuery = {
        page: 1,
        limit: 20
      }
      this.addressList = [];
      this.invoicesList = [];
      this.selectRFQ = [];
      this.temp = {
        leader_id: '',
        name: ''
      }
      this.quotation = {
        "inquiry_id": null,
        "inquiry_quotation_id": null,
        "vendor_company_name": null,
        "price": null,
        "package": null,
        "purity": null,
        "appear_shape": null,
        "purchase_note": null,
        "note": null,
        "created_at": null,
        "cost_price": null,
        "exchange_rate": null,
        "cost_price_usd": null,
        "incoterms": null,
        "transport_mode": null,
        "profit": null,
        "shipping_fee": null,
        "operating_fee": null,
        "testing_project": null,
        "testing_fee": null,
        "declare_fee": null,
        "appraisal_project": null,
        "appraisal_fee": null,
        "bank_fee": null,
        "storage": null,
        "hs_code": null,
        "country": null,
        "is_declare": 0,
        "is_dangerous": 0,
        "is_take_charge": 1,
        "is_customized": 0,
        "stock": null
      }
    },
    // 关闭弹窗回调
    handleClose() {
      this.refresh();
    },
    refresh() {
      let that = this;
      that.resetTemp()
      that.id = that.$route.query.id;
      that.listQuery.id = that.$route.query.id;
      that.listQuery.page = 1
      that.getList()
    },
    handleCreate(data) {
      let that = this;
      that.resetTemp()
      that.quotationList = data
      that.dialogFormVisible = true
    },
    handleAddQuotation(val) {
      // 添加询盘报价
      let that = this;
      that.quotationList.push({
        'add': true,
        'edit': true,
        'del': true,
        "id": null,
        'vendor_company_name': null,
        'price': null,
        'currency_type': null,
        'package': null,
        'purity': null,
        'stock': null,
        'note': null,
      })
    },
    handleCreateQuotation() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible3 = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    //编辑报价信息
    handleUpdateQuotation(row) {
      this.quotation = Object.assign({}, row)
      this.computePrice = this.quotation.price;
      this.dialogStatus = 'update'
      this.dialogFormVisible3 = true
      //格式化数据
      this.quotation.testing_fee = parseFloat(this.quotation.testing_fee)
      this.quotation.appraisal_fee = parseFloat(this.quotation.appraisal_fee)
      // 是否报关，1-是，0-否
      if (this.quotation.is_declare == 1) {
        this.quotation.declare_fee = 30
      } else {
        this.quotation.declare_fee = 0
      }
      testingFee().then(response => {
        this.testingFeeList = response.data.value
      })
      appraisalFee().then(response => {
        this.appraisalFeeList = response.data.value
      })
      exchangeRate().then(response => {
        this.exchangeRateList = response.data.value
      })
    },
    //修改报价
    updateQuotation(row, id) {
      // 修改询盘报价
      this.quotation.price = this.computePrice;
      row.inquiry_quotation_id = row.inquiry_quotation_id
      updateInquiriesQuotation(row, id).then(response => {
        this.dialogFormVisible = false
        this.dialogFormVisible3 = false
        this.getList();
        this.$message({
          message: '修改成功！',
          type: 'success'
        });
      })
    },
    // 历史报价列表
    getQuotationHistories(id) {
      const that = this
      that.resetTemp();
      let tem = {
        id: that.id
      }
      quotationHistories(tem).then(response => {
        if (response.code == 0) {
          that.quotationHistories = response.data.page_datas;
          that.total2 = response.data.total_count
          that.drawer = true
        }
      })
    },
    handleSelectionChange(rows, index) {
      let tem2 = rows;
      let spanArr = [];
      //提取数组
      tem2.forEach((item, index) => {
        spanArr.push(item.inquiry_quotation_id)
      });
      this.inquiry_detail_quotation_ids = spanArr
    },
    handleCurrentChange(row, column, e, singleTable) {
      let that = this;
      let tem = singleTable
      //点击选中
      that.$nextTick().then(function() {
        that.$refs[tem][0].toggleRowSelection(row);
      })
    },
    // 开票类型改变，获取对应收票地址信息
    invoiceTypeChange(row) {
      let tem = [];
      this.temInvoicesList.forEach((item, index) => {
        if (row == item.category) {
          tem.push(item)
        }
      })
      this.invoicesList = tem;
      tem.length > 0 ? this.temp1.invoice_name = tem[0].company_name : this.temp1.invoice_name = '';
      tem.length > 0 ? this.temp1.invoice_id = tem[0].id : this.temp1.invoice_id = '';
    },
    //打开销售订单弹窗
    handleCreateSalesOrder() {
      const that = this
      if (that.inquiry_detail_quotation_ids.length < 1) {
        that.$message.error('请勾选报价明细！');
        return
      }
      let tem = {
        id: this.list.customer_id,
        limit: 100
      }
      fetchAddressesList(tem).then(response => {
        if (response.code == 0) {
          let data = response.data.page_datas;
          //选中默认收货地址
          data.forEach((item, index) => {
            // if (item.is_default == 1) {
            //   that.temp1.address_id = item.id;
            // }
            item.label = item.province + item.city + item.district + item.address
            item.value = item.id
          })
          that.addressList = data;
        }
      })
      fetchInvoicesList(tem).then(response => {
        if (response.code == 0) {
          let data = response.data.page_datas;
          let tem = [];
          that.temInvoicesList = data
          //默认选中开票类型为1
          data.forEach((item, index) => {
            if (item.category == 1) {
              tem.push(item)
            }
          })
          that.invoicesList = tem;
          tem.length > 0 ? that.temp1.invoice_id = tem[0].id : '';
          tem.length > 0 ? that.temp1.invoice_name = tem[0].company_name : '';
        }
      })
      that.dialogFormVisible2 = true
      let list = that.list.inquiry_quotations;
      for (var y = 0; y < that.inquiry_detail_quotation_ids.length; y++) {
        for (var i = 0; i < list.length; i++) {
          if (list[i].inquiry_quotation_id == that.inquiry_detail_quotation_ids[y]) {
            that.selectRFQ.push(list[i])
          }
        }
      }
      tem.id = that.list.company_id;
    },
    //生成销售订单
    createSalesOrder() {
      // // 开票类型为不开票，收票地址信息为空
      if (this.temp1.invoice_type != 4 && !this.temp1.invoice_address) {
        this.$message.error('请选择收票地址信息');
        return;
      }
      //生成销售订单
      if (this.inquiry_detail_quotation_ids) {
        this.temp1.inquiry_quotation_ids = this.inquiry_detail_quotation_ids;
      }
      this.dialogFormVisible2 = false
      createCustomerOrder(this.temp1).then(response => {
        this.$message({
          message: '新增成功！',
          type: 'success'
        });
        //跳转到销售订单详情
        this.$router.push({ path: '/customer_order/customer_orders', query: {} });
      })
    },
    testing_projectChange(val) {
      if (val) {
        this.quotation.testing_fee = val
      }
    },
    appraisal_projectChange(val) {
      if (val) {
        console.log(val)
        this.quotation.appraisal_fee = val
      }
    },
    changeDeclare(val) {
      if (val == 1) {
        console.log(val)
        this.quotation.declare_fee = 30
      } else {
        console.log(val)
        this.quotation.declare_fee = 0
      }
    },
    handleSendQuotation() {
      const that = this
      if (that.inquiry_detail_quotation_ids.length < 1) {
        that.$message.error('请勾选报价明细！');
        return
      }
      let tem = {
        inquiry_quotation_ids: that.inquiry_detail_quotation_ids
      }
      // console.log(tem)
      // console.log(that.inquiry_detail_quotation_ids)
      sendQuotation(tem).then(response => {
        if (response.code == 0) {
          that.$message({
            message: '发送成功！',
            type: 'success'
          });
        }
      })
    },
    //显示关联客户
    handleRelateCustomer(row) {
      const that = this
      that.quotation = Object.assign({}, row)
      let tem = {
        limit: 1000
      }
      getCustomers(tem).then(response => {
        if (response.code == 0) {
          that.customerList = response.data.page_datas
          that.dialogFormVisible4 = true
        }
      })

    },
    updateRelateCustomer() {
      const that = this
      let tem = {
        customer_id: that.customer_id
      }
      updateRelateCustomer(that.list.id, tem).then(response => {
        if (response.code == 0) {
          that.dialogFormVisible4 = false
          that.getList()
          that.$message({
            message: '关联成功！',
            type: 'success'
          });
        }
      })
    },
  }
}

</script>
<style>
.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 100px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

</style>
<style lang="scss" scoped>
.card {
  margin-top: 20px;
  margin-bottom: 40px;
  border-radius: 4px;
  border: 1px solid #e6ebf5;
  padding: 20px;

  .item {
    color: #454545;
    word-break: break-all;
  }

  .name {
    display: inline-block;
    width: 90px;
    text-align: right;
    font-size: 14px;
    // color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
  }

  .el-button--mini {
    padding: 4px 8px;
  }
}

</style>
