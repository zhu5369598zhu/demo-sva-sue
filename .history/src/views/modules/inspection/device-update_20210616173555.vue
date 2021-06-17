<template>
  <el-dialog
    class="device-update"
    :title="isModify ? '修改' : '查看'"
    v-dialog-drag
    :close-on-click-modal="false"
    :visible.sync="visible"
    :show-close="true"
    append-to-body
  >
    <el-tabs
      type="border-card"
      value="device"
      ref="tabs"
      @tab-click="TabsClickHandle"
    >
      <el-tab-pane label="设备台账" name="device" actived="true">
        <el-tabs
          type="border-card"
          value="devicepane"
          @tab-click="docTabsClickHandle"
        >
          <el-tab-pane label="设备资料" name="devicepane" actived="true">
            <div class="device-form">
              <el-form
                :model="dataForm"
                :rules="dataRule"
                ref="dataForm"
                @keyup.enter.native="dataFormSubmit()"
                label-width="80px"
              >
                <el-row class="device-pic">
                  <el-col :span="16">
                    <el-form-item label="设备图片:" style="margin-bottom: 5px">
                      <el-upload
                        :action="
                          this.$http.adornUrl(
                            `/inspection/devicepic/upload?token=${this.$cookie.get(
                              'token'
                            )}`
                          )
                        "
                        accept="image/jpeg,image/gif,image/png"
                        list-type="picture-card"
                        :before-upload="onBeforeUpload"
                        :on-remove="uploadRemoveHandle"
                        :on-success="uploadSuccessHandle"
                        :on-error="uploadErrorHandle"
                        :before-remove="uploadBeforeRemoveHandle"
                        :file-list="fileList"
                        :disabled="!isModify"
                        :data="uploadParams"
                      >
                        <i class="el-icon-plus"></i>
                      </el-upload>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="二维码:" style="margin-bottom: 5px">
                      <div class="device-qrcode-contain">
                        <a style="cursor: pointer">
                          <img
                            class="device-qrcode"
                            :src="getQrcode(dataForm.deviceId)"
                          />
                        </a>
                        <div class="gen-qrcode" align="center">
                          <el-button
                            :disabled="!isModify"
                            type="success"
                            @click="createQrcode(dataForm.deviceId)"
                            style="margin-bottom: 5px; width: 110px"
                            >生成二维码</el-button
                          >
                        </div>
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="device-info">
                  <el-col :span="8">
                    <el-form-item label="设备名称:" prop="deviceName">
                      <el-input
                        size="mini"
                        v-model="dataForm.deviceName"
                        placeholder="设备名称"
                        :disabled="!isModify"
                        clearable
                        style="width: 140px"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="设备等级:" prop="deviceLevel">
                      <div class="formHeader">
                        <el-select
                          v-model="dataForm.deviceLevel"
                          placeholder="设备等级"
                          :disabled="!isModify"
                          clearable
                          size="mini"
                        >
                          <el-option
                            v-for="item in deviceLevelList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                          >
                          </el-option>
                        </el-select>
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="所属机构:" prop="deptName">
                      <!-- <el-popover
                        ref="deptListPopover"
                        placement="bottom-start"
                        trigger="click"
                        v-model="isShowDeptTree">
                        <el-tree
                          :data="deptList"
                          :props="deptListTreeProps"
                          node-key="deptId"
                          ref="deptListTree"
                          class="tree"
                          @current-change="deptListTreeCurrentChangeHandle"
                          :default-expand-all="false"
                          :highlight-current="true"
                          :expand-on-click-node="false" clearable style="width:140px;">
                        </el-tree>
                      </el-popover> -->
                      <!-- <el-input size="mini" v-model="dataForm.deptName" v-popover:deptListPopover :readonly="true" placeholder="所属机构" class="dept-list__input" :disabled="!isModify" clearable style="width:140px;" ></el-input> -->
                      <el-input
                        v-model="dataForm.deptName"
                        v-popover:deptListPopover
                        :readonly="true"
                        placeholder="点击选择所属机构"
                        class="dept-list__input"
                        size="mini"
                        style="width: 140px"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="资产名称:" prop="propertyName">
                      <el-input
                        size="mini"
                        v-model="dataForm.propertyName"
                        placeholder="资产名称"
                        :disabled="!isModify"
                        clearable
                        style="width: 140px"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="设备编号:" prop="deviceNum">
                      <el-input
                        size="mini"
                        v-model="dataForm.deviceNum"
                        placeholder="设备编号"
                        :disabled="!isModify"
                        :readonly="true"
                        clearable
                        style="width: 140px"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="设备编码:" prop="deviceCode">
                      <el-input
                        size="mini"
                        v-model="dataForm.deviceCode"
                        placeholder="设备编码"
                        :disabled="!isModify"
                        clearable
                        style="width: 140px"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="设备规格:" prop="deviceUnit">
                      <el-input
                        size="mini"
                        v-model="dataForm.deviceUnit"
                        placeholder="设备规格"
                        :disabled="!isModify"
                        clearable
                        style="width: 140px"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="生产厂家:" prop="deviceManufacturer">
                      <el-input
                        size="mini"
                        v-model="dataForm.deviceManufacturer"
                        placeholder="生产厂家"
                        :disabled="!isModify"
                        clearable
                        style="width: 140px"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="供货商:" prop="deviceSupplier">
                      <el-input
                        size="mini"
                        v-model="dataForm.deviceSupplier"
                        placeholder="供货商"
                        :disabled="!isModify"
                        clearable
                        style="width: 140px"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="设备模型:" prop="deviceModel">
                      <el-input
                        size="mini"
                        v-model="dataForm.deviceModel"
                        placeholder="设备模型"
                        :disabled="!isModify"
                        clearable
                        style="width: 140px"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      label="责任人:"
                      prop="deviceMaster"
                      :readonly="isModify"
                    >
                      <el-input
                        size="mini"
                        v-model="dataForm.deviceMaster"
                        placeholder="责任人"
                        :disabled="!isModify"
                        clearable
                        style="width: 140px"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="生产日期:" prop="manufactureDate">
                      <el-date-picker
                        v-model="dataForm.manufactureDate"
                        type="date"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择生产日期"
                        @change="handleDateChange"
                        :disabled="!isModify"
                        clearable
                        style="width: 140px"
                        size="mini"
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>

                <!-- 动态添加项目 -->
                <!-- 不止一个项目，用div包裹起来  定义了dataForm.dynamiCItem这个下边请求就的用它接 -->
                <div v-for="(item, index) in dataForm.dynamicItem" :key="index">
                  <el-row>
                    <el-col>
                      <el-row>
                        <el-col :span="8">
                          <el-form-item label="特性">
                            <el-input
                              size="mini"
                              :disabled="!isModify"
                              v-model="item.featureNum"
                              placeholder="特征"
                              clearable
                              style="width: 140px"
                            >
                            </el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item label="特性内容">
                            <el-input
                              size="mini"
                              type="textarea"
                              autosize
                              :disabled="!isModify"
                              v-model="item.featureContent"
                              placeholder="特征内容"
                              clearable
                            >
                            </el-input>
                          </el-form-item>
                        </el-col>
                        <!-- <el-button type="text" style="width:85px;" @click="deleteItem(item, index)">删除特性</el-button> -->

                        <el-button
                          type="text"
                          style="width: 85px"
                          @click="deleteItem(item, index)"
                          :disabled="!isModify"
                          >删除特性</el-button
                        >
                      </el-row>
                    </el-col>
                  </el-row>
                </div>

                <el-button
                  type="text"
                  style="width: 85px"
                  :disabled="!isModify"
                  @click="addItem"
                  >添加特性</el-button
                >

                <el-row>
                  <el-col :span="8">
                    <el-form-item label="是否巡检:" prop="isInspect">
                      <el-switch
                        v-model="dataForm.isInspect"
                        placeholder="是否巡检"
                        :disabled="!isModify"
                        clearable
                        style="width: 140px"
                      ></el-switch>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="看板显示:" prop="isShowDashboard">
                      <el-switch
                        v-model="dataForm.isShowDashboard"
                        :disabled="!isModify"
                        clearable
                        style="width: 140px"
                      ></el-switch>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      label="点检卡码:"
                      prop="cardCode"
                      :readonly="isModify"
                    >
                      <el-input
                        size="mini"
                        v-model="dataForm.cardCode"
                        placeholder="点检卡码"
                        :disabled="!isModify"
                        clearable
                        style="width: 140px"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <div class="show-device-chart" style="padding-bottom: 0px">
                      <div class="charts">
                        <div class="chart-up">
                          <div class="chart-header">
                            <span class="char-title">设备指标趋势</span>
                            <el-form
                              :inline="true"
                              :model="dataForm"
                              align="center"
                              class="shebie"
                              id="shebiex"
                            >
                              <el-form-item>
                                <el-select
                                  v-model="dataForm.itemName"
                                  placeholder="巡检项"
                                  @change="itemSelectChange"
                                  style="width: 140px"
                                >
                                  <el-option
                                    v-for="item in itemList"
                                    :disabled="!isModify"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                  >
                                  </el-option>
                                </el-select>
                              </el-form-item>
                            </el-form>
                            <div class="filter" style="display: flex">
                              <el-form
                                :model="dataForm"
                                @keyup.enter.native="getDataList()"
                                style="
                                  display: flex;
                                  align-items: center;
                                  justify-content: center;
                                  height: 40px;
                                  padding-right: 20px;
                                  padding-top: 20px;
                                "
                              >
                                <el-form-item
                                  label="开始时间:"
                                  prop="inspectionStartTime"
                                  style="
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                  "
                                >
                                  <el-date-picker
                                    :disabled="!isModify"
                                    v-model="dataForm.inspectionStartTime"
                                    size="mini"
                                    type="date"
                                    value-format="yyyy-MM-dd 00:00:00"
                                    :picker-options="startDatePicker"
                                    style="width: 140px"
                                  ></el-date-picker>
                                </el-form-item>
                                <el-form-item
                                  label="结束时间"
                                  prop="inspectionEndTime"
                                  style="
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                  "
                                >
                                  <el-date-picker
                                    :disabled="!isModify"
                                    v-model="dataForm.inspectionEndTime"
                                    size="mini"
                                    type="date"
                                    value-format="yyyy-MM-dd 00:00:00"
                                    :picker-options="startDatePicker"
                                    style="width: 140px"
                                  ></el-date-picker>
                                </el-form-item>
                                <el-form-item
                                  style="
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                  "
                                >
                                  <el-button size="mini" @click="itemSearch()"
                                    >查询</el-button
                                  >
                                </el-form-item>
                              </el-form>
                              <!--<el-radio-group size="mini" @change="inspectionRadioChange" v-model="inspectionFilter" style="display: inline;vertical-align: text-bottom;">
                              <el-radio-button v-for="period in inspectionPeriodList" :label="period" :key="period"></el-radio-button>
                            </el-radio-group>-->
                            </div>
                          </div>
                        </div>
                        <div class="chart-down chartInspection">
                          <chartline
                            v-show="hasInspectionData === true"
                            id="chartInspection"
                            ref="chartInspection"
                            align="center"
                            :category="inspectionCategory"
                            :series="inspectionSeries"
                          ></chartline>
                          <div
                            class="no-data"
                            align="center"
                            v-show="hasInspectionData === false"
                          >
                            暂无数据
                          </div>
                        </div>
                      </div>
                    </div>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item>
                      <div align="center">
                        <el-button
                          v-if="this.isModify === true"
                          @click="visible = false"
                          >取消</el-button
                        >
                        <el-button
                          type="primary"
                          v-if="this.isModify === true"
                          @click="dataFormSubmit()"
                          :disabled="isHttp"
                          >保存</el-button
                        >
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </el-tab-pane>
          <el-tab-pane label="日常维护" name="maintain">
            <order-device
              :disabled="!isModify"
              ref="orderDevice"
              :deviceId="dataForm.deviceId"
            ></order-device>
          </el-tab-pane>
          <el-tab-pane label="检修信息" name="repair">
            <p>检修设置</p>
            <hr />
            <el-form>
              <el-row>
                <el-col :span="2">
                  <el-form-item>
                    <el-button @click="handleNewRepair()" type="primary"
                      >新增</el-button
                    >
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item>
                    <el-button
                      @click="repairDeleteHandle()"
                      :disabled="repairListSelections.length <= 0"
                      type="primary"
                      >删除</el-button
                    >
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <el-table
              height="360"
              :data="repairList"
              @selection-change="repairSelectionChangeHandle"
              border
              highlight-current-row
              style="width: 100%"
            >
              <el-table-column
                type="selection"
                header-align="center"
                align="center"
                width="50"
              >
              </el-table-column>
              <el-table-column
                prop="type"
                header-align="center"
                align="center"
                label="检修类型"
              >
              </el-table-column>
              <el-table-column
                prop="content"
                header-align="center"
                align="center"
                label="检修内容"
              >
              </el-table-column>
              <el-table-column
                prop="periodType"
                header-align="center"
                align="center"
                label="巡检周期"
              >
              </el-table-column>
              <el-table-column
                prop="endTime"
                header-align="center"
                align="center"
                label="结束时间"
              >
              </el-table-column>
              <el-table-column
                prop="burning"
                header-align="center"
                align="center"
                label="检修时长"
              >
              </el-table-column>
              <el-table-column
                prop="content"
                header-align="center"
                align="center"
                label="检修内容"
              >
              </el-table-column>
              <el-table-column
                prop="repairName"
                header-align="center"
                align="center"
                label="检修负责人"
              >
              </el-table-column>
              <el-table-column
                fixed="right"
                header-align="center"
                align="center"
                width="150"
                label="操作"
              >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="mini"
                    @click="handleNewRepair(scope.row.id)"
                    >修改</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <div align="right">
              <el-pagination
                class="pagecontrol"
                @size-change="sizeChangeHandle"
                @current-change="currentChangeHandle"
                :current-page="repairPageIndex"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="repairPageSize"
                :total="repairTotalPage"
                layout="total, sizes, prev, pager, next, jumper"
              >
              </el-pagination>
            </div>
            <!-- 上面是第一个页面下面是二个 -->
            <p>检修记录</p>
            <hr />
            <el-form>
              <el-row>
                <el-col :span="2">
                  <el-form-item>
                    <el-button
                      v-if="isAuth('inspection:repairrecord:save')"
                      @click="handleNewRecord()"
                      type="primary"
                      >新增</el-button
                    >
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item>
                    <el-button
                      @click="recordDeleteHandle()"
                      :disabled="recordListSelections.length <= 0"
                      type="primary"
                      >删除</el-button
                    >
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item>
                    <el-button @click="exportExcelHandle()" type="primary"
                      >导出</el-button
                    >
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <el-table
              height="360"
              :data="recordList"
              border
              @selection-change="recordSelectionChangeHandle"
              highlight-current-row
              style="width: 100%"
            >
              <el-table-column
                type="selection"
                header-align="center"
                align="center"
                width="50"
              >
              </el-table-column>
              <el-table-column
                prop="repairNum"
                header-align="center"
                align="center"
                label="编号"
              >
              </el-table-column>
              <el-table-column
                prop="type"
                header-align="center"
                align="center"
                label="检修类型"
              >
              </el-table-column>
              <el-table-column
                prop="createTime"
                header-align="center"
                align="center"
                label="开始时间"
              >
              </el-table-column>
              <el-table-column
                prop="endTime"
                header-align="center"
                align="center"
                label="结束时间"
              >
              </el-table-column>
              <el-table-column
                prop="content"
                header-align="center"
                align="center"
                label="检修内容"
              >
              </el-table-column>
              <el-table-column
                prop="parts"
                header-align="center"
                align="center"
                label="更换部件"
              >
              </el-table-column>

              <el-table-column
                prop="principal"
                header-align="center"
                align="center"
                label="检修负责人"
              >
              </el-table-column>
              <el-table-column
                fixed="right"
                header-align="center"
                align="center"
                width="150"
                label="操作"
              >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="mini"
                    @click="handleNewRecord(scope.row.id)"
                    >修改</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <div align="right">
              <el-pagination
                class="pagecontrol"
                @size-change="sizeChangeHandle"
                @current-change="currentChangeHandle"
                :current-page="recordPageIndex"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="recordPageSize"
                :total="recordTotalPage"
                layout="total, sizes, prev, pager, next, jumper"
              >
              </el-pagination>
            </div>
            <!-- 这里是控制区那个两个页面的 -->
            <add-or-update
              v-if="addOrUpdateVisible"
              ref="addOrUpdate"
              @refreshDataList="getRepairList"
            ></add-or-update>
            <add-update
              v-if="addUpdateVisible"
              ref="addUpdate"
              @refreshDataList="getRecordList"
            ></add-update>
            <!--<div align="center" class="repair-footer">
              <el-button v-if="this.isModify===true" @click="visible = false">取消</el-button>
             &lt;!&ndash; <el-button type="primary" v-if="this.isModify===true" @click="dataFormSubmit()" :disabled="isHttp">保存</el-button>&ndash;&gt;
            </div>-->
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane label="设备资料" name="document">
        <el-tabs
          type="border-card"
          v-model="activeTab"
          ref="documentTabs"
          @tab-click="documentTabsClickHandle"
        >
          <el-tab-pane label="出厂资料" name="birth" actived="true">
            <deviceDocument
              :disabled="!isModify"
              ref="documentBirth"
              :deviceId="dataForm.deviceId"
            ></deviceDocument>
          </el-tab-pane>
          <el-tab-pane label="调试资料" name="debug" actived="true">
            <deviceDocument
              :disabled="!isModify"
              ref="documentDebug"
              :deviceId="dataForm.deviceId"
            ></deviceDocument>
          </el-tab-pane>
          <el-tab-pane label="维护保养资料" name="maintain" actived="true">
            <deviceDocument
              :disabled="!isModify"
              ref="documentMaintain"
              :deviceId="dataForm.deviceId"
            ></deviceDocument>
          </el-tab-pane>
          <el-tab-pane label="故障维修资料" name="trouble" actived="true">
            <deviceDocument
              :disabled="!isModify"
              ref="documentTrouble"
              :deviceId="dataForm.deviceId"
            ></deviceDocument>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>


<script>
import { formatDate } from "@/utils";
import { treeDataTranslate } from "@/utils";
import deviceDocument from "@/components/device/document";
import orderDevice from "@/components/device/orderdevice";
import AddOrUpdate from "./repair-add-or-update";
import chartline from "@/components/charts/lines";
import AddUpdate from "./record-add-or-update";
// 从这里引入
export default {
  // 计算节点
  computed: {
    editTable() {
      return this.$refs.editTable;
    },
  },
  // 创建节点
  created() {
    this.dataForm.inspectionEndTime = new Date();
    this.dataForm.inspectionStartTime = new Date();
    this.dataForm.inspectionStartTime.setDate(
      this.dataForm.inspectionEndTime.getDate() - 7
    );
  },
  // 数据返回
  data() {
    return {
      repairList: [],
      recordList: [],
      addOrUpdateVisible: false,
      addUpdateVisible: false,
      isModify: true,
      isHttp: false,
      visible: false,
      isShowDeptTree: false,
      deviceLevelList: [],
      deptList: [],
      fileList: [],
      itemList: [],
      // deviceFeatureList: [],
      startDatePicker: this.beginDate(),
      hasInspectionData: false,
      inspectionCategory: [],
      repairListSelections: [],
      recordListSelections: [],
      inspectionSeries: [],
      repairTotalPage: 0,
      repairPageIndex: 1,
      repairPageSize: 10,
      recordTotalPage: 0,
      recordPageIndex: 1,
      recordPageSize: 10,
      deptListTreeProps: {
        label: "name",
        children: "children",
      },
      // dataForm所以绑定的数据变量
      dataForm: {
        deviceId: null,
        category: 0,
        deviceName: "",
        deviceNum: "",
        deviceCode: "",
        deviceUnit: "",
        deviceManufacturer: "",
        deviceSupplier: "",
        deviceLevel: "",
        deviceDept: "",
        deptName: "",
        deviceModel: "",
        deviceMaster: "",
        cardCode: "",
        isInspect: "",
        isShowDashboard: "",
        masterId: "",
        manufactureDate: "",
        createTime: "",
        itemId: 0,
        itemName: "",
        propertyName: "",
        inspectionStartTime: "",
        inspectionEndTime: "",
        dynamicItem: [],
      },
      // 表格的切换
      activeTab: "birth",
      deviceTab: "device",
      // 上传参数
      uploadParams: {
        deviceId: null,
      },
      // 校验数据
      dataRule: {
        deviceName: [
          { required: true, message: "设备名称不能为空", trigger: "change" },
        ],
        deviceLevel: [
          { required: true, message: "设备等级不能为空", trigger: "blur" },
        ],
        deptName: [
          { required: true, message: "所属机构不能为空", trigger: "change" },
        ],
        deviceCode: [
          { required: true, message: "设备编码不能为空", trigger: "blur" },
        ],
      },
    };
  },
  // 组件引入
  components: {
    deviceDocument,
    orderDevice,
    AddOrUpdate,
    AddUpdate,
    chartline,
  },
  // 方法
  methods: {
    beginDate() {
      return {
        disabledDate(time) {
          return time.getTime() > Date.now(); // 开始时间不选时，结束时间最大值小于等于当天
        },
      };
    },
    // 获取特性数据列表
    getdeviceFeatureList() {
      this.$http({
        url: this.$http.adornUrl("/inspection/devicefeature/list"),
        method: "get",
        params: this.$http.adornParams({
          deviceId: this.dataForm.deviceId,
        }),
      }).then(({ data }) => {
        this.dataForm.dynamicItem = data.page.list;
        console.log(data.page.list);
        // if (data && data.code === 0) {
        //   this.dataForm.dynamicItem  = data.page.list
        //   // this.repairTotalPage = data.page.totalCount
        // } else {
        //   this.deviceFeatureList = []
        //   // this.repairTotalPage = 0
        // }
      });
    },

    addItem() {
      this.dataForm.dynamicItem.push({
        featureContent: "",
        featureNum: "",
      });
    },
    deleteItem(item, index) {
      this.dataForm.dynamicItem.splice(index, 1);
      console.log(this.dataForm.dynamicItem);
    },
    //  },//小刘给改的这个请求之前是根据ID删除，现在是根据Item项的index来删除的携带参数改了改
    //  deleteItem (item, index) {
    //   this.$confirm(`确定删除?`, '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     console.log("dfdsf"+item.id)
    //     this.$http({
    //       url: this.$http.adornUrl('/inspection/devicefeature/delete'),
    //       method: 'post',
    //       params: this.$http.adornParams({
    //        'ids': item.id,
    //       //  前端传的是ids 后端也是这个接的
    //     })
    //     }).then(({data}) => {
    //       if (data && data.code === 0) {
    //         this.$message({
    //           message: '操作成功',
    //           type: 'success',
    //           duration: 1500,
    //           onClose: () => {
    //             this.getdeviceFeatureList()
    //           }
    //         })
    //       } else {
    //         this.$message.error(data.msg)
    //       }
    //     })
    //   })
    // },

    // 核对选择数据
    checkSelection() {
      if (this.selection && this.selection.length) {
        return true;
      } else {
        this.$message.error("请先选择数据");
      }
    },
    // 操作编译一行
    handleEditRows() {
      if (this.checkSelection()) {
        this.editTable.editRows(this.selection);
      }
    },

    repairSelectionChangeHandle(val) {
      this.repairListSelections = val;
    },
    // 获取数据列表
    getRepairList() {
      this.$http({
        url: this.$http.adornUrl("/inspection/repair/list"),
        method: "get",
        params: this.$http.adornParams({
          deviceId: this.dataForm.deviceId,
          page: this.repairPageIndex,
          limit: this.repairPageSize,
        }),
      }).then(({ data }) => {
        console.log(data.page.list);
        if (data && data.code === 0) {
          this.repairList = data.page.list;
          this.repairTotalPage = data.page.totalCount;
        } else {
          this.repairList = [];
          this.repairTotalPage = 0;
        }
      });
    },
    // 修理删除操作
    repairDeleteHandle(id) {
      var ids = id
        ? [id]
        : this.repairListSelections.map((item) => {
            return item.id;
          });
      this.$confirm(
        `确定对[id=${ids.join(",")}]进行[${id ? "删除" : "批量删除"}]操作?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        this.$http({
          url: this.$http.adornUrl("/inspection/repair/delete"),
          method: "post",
          data: this.$http.adornData(ids, false),
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: "操作成功",
              type: "success",
              duration: 1500,
              onClose: () => {
                this.getRepairList();
              },
            });
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    },
    // 操作对象新增 第一个页面从这里传值
    handleNewRepair(id) {
      console.log(id);
      //什么也没传为什么会有值呢
      // return
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        // this.$refs.addOrUpdate.getRepairList()
        this.$refs.addOrUpdate.init(id, this.dataForm.deviceId);
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
    exportToExcel(list) {
      this.downloadLoading = true;
      require.ensure([], () => {
        const { export_json_to_excel } = require("@/vendor/Export2Excel");
        const tHeader = [
          "编号<repair_num>",
          "检修类别<type>",
          "开始时间<create_time>",
          "结束时间<end_time>",
          "检修内容<content>",
          "更换部件<parts>",
          "检修负责人<principal>",
        ];
        const filterVal = [
          "repairNum",
          "type",
          "createTime",
          "endTime",
          "content",
          "parts",
          "principal",
        ];
        const data = this.formatJson(filterVal, list);
        let filename = formatDate(new Date(), "yyyyMMddhhmmss");
        export_json_to_excel({
          header: tHeader,
          data,
          filename: filename,
          autoWidth: true,
          bookType: "xlsx",
        });
        this.downloadLoading = false;
      });
    },

    exportExcelHandle() {
      this.$http({
        url: this.$http.adornUrl("/inspection/repairrecord/export"),
        method: "get",
        params: this.$http.adornParams({
          deviceId: this.dataForm.deviceId,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.exportToExcel(data.list);
        } else {
          this.$message.error(data.msg);
        }
      });
    },

    recordSelectionChangeHandle(val) {
      this.recordListSelections = val;
    },

    recordDeleteHandle(id) {
      var ids = id
        ? [id]
        : this.recordListSelections.map((item) => {
            return item.id;
          });
      this.$confirm(
        `确定对[id=${ids.join(",")}]进行[${id ? "删除" : "批量删除"}]操作?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        this.$http({
          url: this.$http.adornUrl("/inspection/repairrecord/delete"),
          method: "post",
          data: this.$http.adornData(ids, false),
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: "操作成功",
              type: "success",
              duration: 1500,
              onClose: () => {
                this.getRecordList();
              },
            });
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    },

    getRecordList() {
      this.$http({
        url: this.$http.adornUrl("/inspection/repairrecord/list"),
        method: "get",
        params: this.$http.adornParams({
          deviceId: this.dataForm.deviceId,
          page: this.recordPageIndex,
          limit: this.recordPageSize,
        }),
      }).then(({ data }) => {
        console.log(data.page.list);
        if (data && data.code === 0) {
          this.recordList = data.page.list;
          this.recordTotalPage = data.page.totalCount;
        } else {
          this.recordList = [];
          this.recordTotalPage = 0;
        }
      });
    },

    // 第二个
    handleNewRecord(id) {
      this.addUpdateVisible = true;
      this.$nextTick(() => {
        // this.$refs.addOrUpdate.getRepairList()
        this.$refs.addUpdate.init(id, this.dataForm.deviceId);
      });
    },
    // 每页数
    sizeChangeHandle(val) {
      this.recordPageSize = val;
      this.recordPageIndex = 1;
      this.getRecrodList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.recordPageIndex = val;
      this.getRecordList();
    },

    //在之前上传
    onBeforeUpload(file) {
      const isIMAGE = file.type === "image/jpeg" || "image/gif" || "image/png";
      if (!isIMAGE) {
        this.$message.error("上传文件只能是图片格式!");
      }
      return isIMAGE;
    },
    TabsClickHandle(tab) {
      if (tab.label === "设备资料") {
        this.activeTab = "birth";
        this.$refs.documentBirth.getDataList(0);
      } else if (tab.label === "设备资料") {
        this.activeTab = "repair";
        this.$refs.editTable.getDataList(0);
      }
      if (tab.label === "设备台账") {
        this.activeTab = "device";
        this.$refs.orderDevice.getDataList(this.dataForm.deviceId);
      }
    },
    docTabsClickHandle(tab) {
      if ((tab.label = "日常检修")) {
        // this.getRepairDeviceList()
        this.getRepairList();
        this.getRecordList();
      }
    },

    documentTabsClickHandle(tab) {
      if (tab.label === "出厂资料") {
        this.$refs.documentBirth.getDataList(0);
      }
      if (tab.label === "调试资料") {
        this.$refs.documentDebug.getDataList(1);
      }
      if (tab.label === "维护保养资料") {
        this.$refs.documentMaintain.getDataList(2);
      }
      if (tab.label === "故障维修资料") {
        this.$refs.documentTrouble.getDataList(3);
      }
    },
    uploadBeforeRemoveHandle(file, filelist) {
      return this.$confirm(`确定删除文件${file.name}?`);
    },
    uploadRemoveHandle(file, filelist) {
      this.$http({
        url: this.$http.adornUrl(`/inspection/devicepic/delete/${file.name}`),
        method: "post",
        params: this.$http.adornParams(),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: "操作成功",
            type: "success",
            duration: 1500,
          });
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    uploadSuccessHandle(response, file, fileList) {
      if (response.code > 0) {
        this.$message.error(response.msg);
      }
    },
    uploadErrorHandle(err, file, fileList) {
      this.$message.error(err);
    },
    getQrcode(deviceId) {
      var random = Math.random();
      return this.$http.adornUrl(
        `/inspection/deviceqrcode/qrcode.png?deviceId=${deviceId}&random=${random}`
      );
    },
    createQrcode(deviceId) {
      this.$http({
        url: this.$http.adornUrl("/inspection/device/createqrcode"),
        method: "get",
        params: this.$http.adornParams({
          deviceId: this.dataForm.deviceId,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.init(deviceId, this.isModify);
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    getPicList() {
      this.filelist = [];
      this.$http({
        url: this.$http.adornUrl("/inspection/devicepic/list"),
        method: "get",
        params: this.$http.adornParams({
          deviceId: this.dataForm.deviceId,
          category: this.uploadParams.category,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.fileList = data.piclist.map((item) => {
            item.name = item.url;
            item.url = this.$http.adornUrl(
              `/inspection/devicepic/pic.png?uuid=${item.url}`
            );
            return item;
          });
        } else {
          this.fileList = [];
        }
      });
    },
    // 每页数
    sizeChangeHandle(val) {
      this.repairPageSize = val;
      this.repairPageIndex = 1;
      this.getRepairList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.repairPageIndex = val;
      this.getRepairList();
    },
    // 获取设备级别
    getDeviceLevelList() {
      this.$http({
        url: this.$http.adornUrl("/setting/devicelevel/list"),
        method: "get",
        params: this.$http.adornParams(),
      }).then(({ data }) => {
        this.deviceLevelList = data.page.list;
      });
    },
    // 获取部门列表
    getDeptList() {
      this.$http({
        url: this.$http.adornUrl("/sys/dept/list"),
        method: "get",
        params: this.$http.adornParams(),
      }).then(({ data }) => {
        this.deptList = treeDataTranslate(data, "deptId");
      });
    },
    // 初始化 页面加载是初试化哪些主要是我是在表单上新加的功能
    init(id, isModify) {
      this.fileList = [];
      this.isModify = isModify;
      this.dataForm.deviceId = id || 0;
      this.uploadParams.deviceId = this.dataForm.deviceId;
      this.visible = true;
      this.isHttp = false;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        if (this.dataForm.deviceId) {
          this.$http({
            url: this.$http.adornUrl(
              `/inspection/device/info/${this.dataForm.deviceId}`
            ),
            method: "get",
            params: this.$http.adornParams(),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.deviceName = data.device.deviceName;
              this.dataForm.deviceNum = data.device.deviceNum;
              this.dataForm.deviceCode = data.device.deviceCode;
              this.dataForm.deviceUnit = data.device.deviceUnit;
              this.dataForm.deviceManufacturer = data.device.deviceManufacturer;
              this.dataForm.deviceSupplier = data.device.deviceSupplier;
              this.dataForm.deviceLevel = data.device.deviceLevel;
              this.dataForm.deviceDept = data.device.deviceDept;
              this.dataForm.deptName = data.device.deptName;
              this.dataForm.deviceModel = data.device.deviceModel;
              this.dataForm.isInspect = data.device.isInspect;
              this.dataForm.isShowDashboard = data.device.isShowDashboard;
              this.dataForm.manufactureDate = data.device.manufactureDate;
              this.dataForm.deviceMaster = data.device.deviceMaster;
              this.dataForm.createTime = data.device.createTime;
              this.dataForm.cardCode = data.device.cardCode;
              this.dataForm.propertyName = data.device.propertyName;
              // 必须调用这个
              this.getItemsByDevice();
              this.getdeviceFeatureList();

              this.getPicList();
              if (data.device.isInspect === 1) {
                this.dataForm.isInspect = true;
              } else {
                this.dataForm.isInspect = false;
              }
              if (data.device.isShowDashboard === 1) {
                this.dataForm.isShowDashboard = true;
              } else {
                this.dataForm.isShowDashboard = false;
              }
              // this.deptListTreeSetCurrentNode()
            }
          });
        }
      });
    },
    // 部门树选中
    deptListTreeCurrentChangeHandle(data, node) {
      this.dataForm.deviceDept = data.deptId;
      this.dataForm.deptName = data.name;
      this.isShowDeptTree = false;
    },
    // 部门树设置当前选中节点
    // deptListTreeSetCurrentNode () {
    //   this.$refs.deptListTree.setCurrentKey(this.dataForm.deviceDept)
    //   this.dataForm.deptName = (this.$refs.deptListTree.getCurrentNode() || {})['name']
    // },
    handleDateChange(val) {
      this.dataForm.manufactureDate = val;
    },
    // 获取 巡检项 数据列表
    getItemsByDevice() {
      console.log("执行了1");
      this.$http({
        url: this.$http.adornUrl("/inspection/inspectionitem/getitemsbydevice"),
        method: "get",
        params: this.$http.adornParams({
          deviceId: this.dataForm.deviceId,
        }),
      }).then(({ data }) => {
        console.log("执行了。");
        if (data.list.length > 0) {
          /*for(var i = data.list.length - 1; i > 0; i--){
              if (data.list[i].inspectionType === 2 || data.list[i].inspectionType === 8 || data.list[i].inspectionType === 9 ) {
                 data.list.splice(i,1)
              }
            }*/
          this.dataForm.itemName = data.list[0].name;
          this.dataForm.itemId = data.list[0].id;
          this.itemList = data.list;
          if (this.dataForm.itemId > 0) {
            this.$nextTick(function () {
              this.getDeviceInspection();
            });
          } else {
            // 没有巡检项
            this.hasInspectionData = false;
          }
        } else {
          this.hasInspectionData = false;
        }
      });
    },
    itemSelectChange(val) {
      this.dataForm.itemId = val;
      this.getDeviceInspection();
    },
    itemSearch() {
      this.getDeviceInspection();
    },
    getDeviceInspection() {
      this.series = [];
      console.log("巡检项id==" + this.dataForm.itemId);
      this.$http({
        url: this.$http.adornUrl("/inspection/inspectionresult/selectbyitem"),
        method: "get",
        params: this.$http.adornParams({
          itemId: this.dataForm.itemId,
          deviceId: this.dataForm.deviceId,
          startTime: this.dataForm.inspectionStartTime,
          endTime: this.dataForm.inspectionEndTime,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(data.data.category);
          console.log(data.data.series);
          this.hasInspectionData = false;
          this.ids = data.data.ids;
          this.inspectionCategory = data.data.category;
          this.inspectionSeries = data.data.series;
          if (this.inspectionSeries.length > 0) {
            this.hasInspectionData = true;
          } else {
            this.hasInspectionData = false;
          }
          this.drawChart();
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    drawChart() {
      if (this.hasInspectionData === true) {
        this.$nextTick(() => {
          this.$refs.chartInspection.initChart("chartInspection");
        });
      }
    },
    inspectionRadioChange(val) {
      let today = new Date();
      if (val === "本周") {
        this.inspectionStartTime = getFirstDayOfWeek(today);
      } else if (val === "本月") {
        this.inspectionStartTime = getFirstDayOfMonth(today);
      } else if (val === "本年") {
        this.inspectionStartTime = getFirstDayOfYear(today);
      } else if (val === "全部") {
        this.inspectionStartTime = "";
      }
      if (this.dataForm.itemId !== "") {
        this.getDeviceInspection();
      }
    },
    // 表单提交
    dataFormSubmit() {
      console.log(this.dataForm.dynamicItem);
      var isInspect = 0;
      var isShowDashboard = 0;
      if (this.dataForm.isInspect === true) {
        isInspect = 1;
      } else {
        isInspect = 0;
      }
      if (this.dataForm.isShowDashboard === true) {
        isShowDashboard = 1;
      } else {
        isShowDashboard = 0;
      }
      // 提交的时候 拿这个数组  这地方和你的后台字段对好， 看看要什么样的
      //  不要每次添加特性的时候去请求接口  那样是不行
      console.log(this.dataForm.deviceId);
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.isHttp = true;
          this.$http({
            url: this.$http.adornUrl(
              `/inspection/device/${
                !this.dataForm.deviceId ? "save" : "update"
              }`
            ),
            method: "post",
            data: this.$http.adornData({
              deviceEntity: {
                deviceId: this.dataForm.deviceId || undefined,
                deviceName: this.dataForm.deviceName,
                deviceNum: this.dataForm.deviceNum,
                deviceCode: this.dataForm.deviceCode,
                deviceUnit: this.dataForm.deviceUnit,
                deviceManufacturer: this.dataForm.deviceManufacturer,
                deviceSupplier: this.dataForm.deviceSupplier,
                deviceLevel: this.dataForm.deviceLevel,
                deviceDept: this.dataForm.deviceDept,
                deviceModel: this.dataForm.deviceModel,
                isInspect: isInspect,
                isShowDashboard: isShowDashboard,
                masterId: this.dataForm.masterId,
                manufactureDate: this.dataForm.manufactureDate,
                deviceMaster: this.dataForm.deviceMaster,
                createTime: this.dataForm.createTime,
                cardCode: this.dataForm.cardCode,
                propertyName: this.dataForm.propertyName,
              },
              dynamicItem: this.dataForm.dynamicItem,
              // 'id': this.dataForm.id
            }),
          }).then(({ data }) => {
            this.isHttp = false;
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.visible = false;

                  this.$emit("refreshDataList");
                },
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    },
  },
};
</script>

<style>
.show-device-chart {
  height: 300px;
}
.chart-down {
  width: 100%;
  height: 85%;
}
#chartInspection {
  height: calc(200px + 50px);
  width: 100%;
}
.chartInspection {
  display: flex;
  align-items: center;
  justify-content: center;
}
.device-pic {
  margin-bottom: 5px;
}
.device-info {
  border-top: 1px dashed #c0ccda;
  margin-top: 5px;
  padding-top: 10px;
}
.device-qrcode-contain {
  width: 110px;
  height: 110px;
  border: 1px dashed #c0ccda;
}
.device-qrcode {
  width: 100%;
  height: 100%;
}
.gen-qrcode {
  margin-top: 5px;
  margin-bottom: 5px;
}
.device-form {
  height: 100%;
}
.device-update .el-dialog__body {
  padding-left: 0px;
  padding-top: 0px;
  padding-right: 0px;
  padding-bottom: 0px;
}
.tree {
  overflow-y: scroll;
  width: 280px;
  height: 200px;
}
.repair-footer {
  margin: 30px;
}
.formHeader .el-input {
  width: 140px;
}
</style>
