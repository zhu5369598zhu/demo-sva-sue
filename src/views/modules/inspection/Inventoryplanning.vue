<template>
  <div class="mod-inspection-line" style="height: 100%">
    <div class="show-data-content">
      <split-pane
        split="vertical"
        ref="splitPane"
        :min-percent="0"
        :default-percent="curPercent"
        @resize="resize"
      >
        <template slot="paneL">
          <div class="show-left">
            <div class="org_title">
              <span
                v-if="this.isDrawBack === false"
                style="vertical-align: middle"
                >机构列表</span
              ><i
                :class="drawBackClass"
                style="float: right; cursor: pointer"
                @click="onDrawBack"
              ></i>
            </div>
            <depttree
              @deptSelectEvent="handleDeptSelect"
              v-if="this.isDrawBack === false"
            ></depttree>
          </div>
        </template>
        <template slot="paneR">
          <div class="show-data-table">
            <div class="show-data-up" style="flex: 1">
              <el-form
                :inline="true"
                :model="lineForm"
                @keyup.enter.native="search()"
              >
                <el-form-item>
                  <el-input
                    v-model="lineForm.name"
                    placeholder="名称"
                    clearable
                    size="mini"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button @click="search()" size="mini">查询</el-button>
                  <el-button
                    v-if="isAuth('inspection:panline:save')"
                    @click="lineAddOrUpdateHandle()"
                    size="mini"
                    >新增</el-button
                  >

                  <el-button
                    v-if="isAuth('inspection:panline:publish')"
                    @click="linePublish()"
                    :icon="publishIcon"
                    size="mini"
                    >{{ publishName }}</el-button
                  >
                  <el-button
                    v-if="isAuth('inspection:panline:delete')"
                    type="warning"
                    @click="deleteHandle()"
                    :disabled="dataListSelections.length <= 0"
                    size="mini"
                    >批量删除</el-button
                  >
                </el-form-item>
              </el-form>
              <!--height="calc(100% - 50px) !important"-->
              <el-table
                ref="table"
                :height="tableHeight"
                :data="lineList"
                border
                v-loading="lineListLoading"
                highlight-current-row
                @current-change="lineSelectionChangeHandle"
                @selection-change="selectionChangeHandle"
                :cell-style="cellStyle"
                :row-style="rowStyle"
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
                  type="index"
                  header-align="center"
                  align="center"
                  width="80"
                >
                </el-table-column>
                <el-table-column
                  prop="name"
                  header-align="center"
                  align="center"
                  label="盘点名称"
                >
                </el-table-column>
                <el-table-column
                  prop="deptName"
                  header-align="center"
                  align="center"
                  label="所属机构"
                >
                </el-table-column>
                <el-table-column
                  prop="typeName"
                  header-align="center"
                  align="center"
                  label="盘点类型"
                >
                </el-table-column>
                <el-table-column
                  prop="isInspect"
                  header-align="center"
                  align="center"
                  label="允许手工盘点"
                >
                  <template slot-scope="scope">
                    <span v-if="scope.row.isInspect === 0" style="color: red"
                      >否</span
                    >
                    <span
                      v-if="scope.row.isInspect === 1"
                      style="color: darkgreen"
                      >是</span
                    >
                  </template>
                </el-table-column>
                <el-table-column
                  prop="statusId"
                  header-align="center"
                  align="center"
                  label="状态"
                >
                  <template slot-scope="scope">
                    <el-switch
                      v-model="lineList[scope.$index].statusId"
                      :active-value="1" :inactive-value="0"
                      :disabled="scope.row.isPublish === 0"
                      class="switch"
                      active-text="完成"
                      width="70"
                      inactive-text="未完成"
                      @click.stop.native
                      @change="wancheng(scope.row)"
                    >
                    </el-switch>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="isPublish"
                  header-align="center"
                  align="center"
                  width="80"
                  label="发布"
                >
                  <template slot-scope="scope">
                    <el-tooltip
                      effect="dark"
                      content="未发布"
                      placement="top-start"
                    >
                      <span
                        class="el-icon-edit-outline"
                        v-if="scope.row.isPublish === 0"
                        style="font-size: 16px"
                      ></span>
                    </el-tooltip>
                    <el-tooltip
                      effect="light"
                      content="已发布"
                      placement="top-start"
                    >
                      <span
                        class="el-icon-check"
                        v-if="scope.row.isPublish === 1"
                        style="color: darkgreen; font-size: 16px"
                      ></span>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="createTime"
                  header-align="center"
                  align="center"
                  label="创建时间"
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
                      v-if="isAuth('inspection:panline:delete')"
                      type="text"
                      size="mini"
                      @click="deleteHandle(scope.row.id)"
                      >删除</el-button
                    >
                    <el-button
                      v-if="
                        isAuth('inspection:panline:save') &&
                        scope.row.isPublish === 0
                      "
                      type="text"
                      size="mini"
                      @click="lineAddOrUpdateHandle(scope.row.id)"
                      >修改</el-button
                    >
                    <el-button
                      type="text"
                      size="mini"
                      @click.stop="pdaDetail(scope.row.id)"
                      >详情</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                @size-change="lineSizeChangeHandle"
                @current-change="lineCurrentChangeHandle"
                :current-page="linePageIndex"
                :page-sizes="[5, 10, 20, 50]"
                :page-size="linePageSize"
                :total="lineTotalPage"
                style="margin-bottom: 5px"
                layout="total, sizes, prev, pager, next, jumper"
              >
              </el-pagination>
            </div>
            <div
              class="show-data-down"
              style="flex: 1; display: flex; flex-direction: column"
            >
              <el-tabs
                type="border-card"
                v-model="activeTab"
                @tab-click="tabSelectChangeHandle"
                class="xunxian"
                style="height: 100%"
              >
                <el-tab-pane label="人员" name="class">
                  <div class="mod-class-group bottom_data">
                    <el-form :inline="true">
                      <el-form-item>
                        <el-button
                          v-if="
                            isAuth('inspection:pangroup:save') &&
                            isPublish === 0
                          "
                          @click="classGroupAddOrUpdateHandle()"
                          :disabled="lineForm.panLineId <= 0"
                          size="mini"
                          >新增</el-button
                        >
                        <el-button
                          v-if="
                            isAuth('inspection:pangroup:delete') &&
                            isPublish === 0
                          "
                          type="warning"
                          @click="classGroupDeleteHandle()"
                          :disabled="classGroupListSelections.length <= 0"
                          size="mini"
                          >批量解绑</el-button
                        >
                      </el-form-item>
                    </el-form>
                    <el-table
                      :data="classGroupList"
                      border
                      height="10px"
                      v-loading="classGroupListLoading"
                      @selection-change="classGroupSelectionChangeHandle"
                      :cell-style="cellStyle"
                      :row-style="rowStyle"
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
                        type="index"
                        header-align="center"
                        align="center"
                      >
                      </el-table-column>
                      <el-table-column
                        prop="name"
                        header-align="center"
                        align="center"
                        label="盘线名称"
                      >
                      </el-table-column>
                      <el-table-column
                        prop="workerNames"
                        header-align="center"
                        align="center"
                        label="用户"
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
                            v-if="
                              isAuth('inspection:pangroup:save') &&
                              isPublish === 0
                            "
                            type="text"
                            size="mini"
                            @click="classGroupAddOrUpdateHandle(scope.row.id)"
                            >修改</el-button
                          >
                          <el-button
                            v-if="
                              isAuth('inspection:pangroup:delete') &&
                              isPublish === 0
                            "
                            type="text"
                            size="mini"
                            @click="classGroupDeleteHandle(scope.row.id)"
                            >解绑</el-button
                          >
                        </template>
                      </el-table-column>
                    </el-table>
                    <el-pagination
                      @size-change="classGroupSizeChangeHandle"
                      @current-change="classGroupCurrentChangeHandle"
                      :current-page="classGroupPageIndex"
                      :page-sizes="[5, 10, 20, 50]"
                      :page-size="classGroupPageSize"
                      :total="classGroupTotalPage"
                      layout="total, sizes, prev, pager, next, jumper"
                    >
                    </el-pagination>
                    <!-- 弹窗, 新增 / 修改 -->
                    <ClassGroupAddOrUpdate
                      v-if="classGroupAddOrUpdateVisible"
                      ref="classGroupAddOrUpdate"
                      @refreshDataList="getClassGroupList"
                    ></ClassGroupAddOrUpdate>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="盘区" name="zone">
                  <div class="mod-line-zone bottom_data">
                    <el-form :inline="true">
                      <el-form-item>
                        <el-button
                          v-if="
                            isAuth('inspection:panlinezone:save') &&
                            isPublish === 0
                          "
                          @click="zoneBindAddOrUpdateHandle()"
                          :disabled="lineForm.panLineId <= 0"
                          size="mini"
                          >绑定</el-button
                        >
                        <el-button
                          v-if="
                            isAuth('inspection:panlinezone:delete') &&
                            isPublish === 0
                          "
                          type="warning"
                          @click="lineZoneDeleteHandle()"
                          :disabled="lineZoneListSelections.length <= 0"
                          size="mini"
                          >批量解绑</el-button
                        >
                      </el-form-item>
                    </el-form>
                    <el-table
                      height="360"
                      :data="lineZoneList"
                      border
                      v-loading="lineZoneListLoading"
                      @selection-change="lineZoneSelectionChangeHandle"
                      :cell-style="cellStyle"
                      :row-style="rowStyle"
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
                        type="index"
                        header-align="center"
                        align="center"
                      >
                      </el-table-column>
                      <el-table-column
                        prop="panZoneName"
                        header-align="center"
                        align="center"
                        label="名称"
                      >
                        <template slot-scope="scope">
                          <a
                            href="#"
                            style="text-decoration: none; color: black"
                            ><span
                              @click="clickToZone(scope.row.panZoneName)"
                              >{{ scope.row.panZoneName }}</span
                            ></a
                          >
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="panZoneCode"
                        header-align="center"
                        align="center"
                        label="编码"
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
                            v-if="
                              isAuth('inspection:panlinezone:delete') &&
                              isPublish === 0
                            "
                            type="text"
                            size="mini"
                            @click="lineZoneDeleteHandle(scope.row.id)"
                            >解绑</el-button
                          >
                        </template>
                      </el-table-column>
                    </el-table>
                    <el-pagination
                      @size-change="lineZoneSizeChangeHandle"
                      @current-change="lineZoneCurrentChangeHandle"
                      :current-page="lineZonePageIndex"
                      :page-sizes="[5, 10, 20, 50]"
                      :page-size="lineZonePageSize"
                      :total="lineZoneTotalPage"
                      layout="total, sizes, prev, pager, next, jumper"
                    >
                    </el-pagination>
                    <!-- 弹窗, 新增 / 修改 -->
                    <ZoneBindAddOrUpdate
                      v-if="lineZoneAddOrUpdateVisible"
                      v-model="lineZoneAddOrUpdateVisible"
                      ref="zoneBindAddOrUpdate"
                      @refreshDataList="getLineZoneList"
                      @ZoneBindEvent="zoneBindEvent"
                    ></ZoneBindAddOrUpdate>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="PDA" name="pda">
                  <div class="mod-line-pda bottom_data">
                    <el-form :inline="true">
                      <el-form-item>
                        <el-button
                          v-if="
                            isAuth('inspection:panpublish:save') &&
                            isPublish === 0
                          "
                          @click="pdaBindAddOrUpdateHandle()"
                          :disabled="lineForm.panLineId <= 0"
                          size="mini"
                          >绑定</el-button
                        >
                        <el-button
                          v-if="
                            isAuth('inspection:panpublish:delete') &&
                            isPublish === 0
                          "
                          type="warning"
                          @click="pdaDeleteHandle()"
                          :disabled="linePdaListSelections.length <= 0"
                          size="mini"
                          >批量解绑</el-button
                        >
                      </el-form-item>
                    </el-form>
                    <el-table
                      height="360"
                      :data="linePdaList"
                      border
                      v-loading="linePdaListLoading"
                      @selection-change="linePdaSelectionChangeHandle"
                      :cell-style="cellStyle"
                      :row-style="rowStyle"
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
                        type="index"
                        header-align="center"
                        align="center"
                      >
                      </el-table-column>
                      <el-table-column
                        prop="pdaName"
                        header-align="center"
                        align="center"
                        label="Pda名称"
                      >
                        <template slot-scope="scope">
                          <a
                            href="#"
                            style="text-decoration: none; color: black"
                            ><span @click="clickToPda(scope.row.pdaName)">{{
                              scope.row.pdaName
                            }}</span></a
                          >
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="pdaMac"
                        header-align="center"
                        align="center"
                        label="pda地址"
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
                            v-if="
                              isAuth('inspection:panpublish:delete') &&
                              isPublish === 0
                            "
                            type="text"
                            size="mini"
                            @click="pdaDeleteHandle(scope.row.id)"
                            >解绑</el-button
                          >
                        </template>
                      </el-table-column>
                    </el-table>
                    <el-pagination
                      @size-change="linePdaSizeChangeHandle"
                      @current-change="linePdaCurrentChangeHandle"
                      :current-page="linePdaPageIndex"
                      :page-sizes="[5, 10, 20, 50]"
                      :page-size="linePdaPageSize"
                      :total="linePdaTotalPage"
                      layout="total, sizes, prev, pager, next, jumper"
                    >
                    </el-pagination>
                    <!-- 弹窗, 新增 / 修改 -->
                    <LineAddOrUpdate
                      v-if="lineAddOrUpdateVisible"
                      ref="lineAddOrUpdate"
                      @refreshDataList="getLineList(lineForm.deptId)"
                    ></LineAddOrUpdate>
                    <PdaAddOrUpdate
                      v-if="linePdaAddOrUpdateVisible"
                      ref="pdaBindAddOrUpdate"
                      @refreshDataList="getLinePdaList"
                      @PdaBindEvent="pdaBindEvent"
                    ></PdaAddOrUpdate>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </template>
      </split-pane>
    </div>
  </div>
</template>

<script>
import depttree from "@/components/dept-tree";
import PdaAddOrUpdate from "./panpublish-pda";
import LineAddOrUpdate from "./panline-add-or-update";
import ClassGroupAddOrUpdate from "./pangroup-add-or-update";
import ZoneBindAddOrUpdate from "./panbind-add-or-update";
import ViewPublish from "./panlinepublish";
import splitPane from "@/components/split-pane";
export default {
  data() {
    return {
      lineForm: {
        panLineId: null,
        deptId: null,
        name: null,

      },
      dataListSelections: [],
      isPublish: 0,
      publishIcon: "el-icon-circle-check-outline",
      publishName: "发布计划",
      isDrawBack: false,
      drawBackClass: "el-icon-d-arrow-left",
      curPercent: 12,
      oldPercent: 16,
      lineList: [],
      classGroupList: [],
      lineZoneList: [],
      linePdaList: [],
      linePageIndex: 1,
      linePageSize: 5,
      lineTotalPage: 0,
      classGroupPageIndex: 1,
      classGroupPageSize: 5,
      classGroupTotalPage: 0,
      lineZonePageIndex: 1,
      lineZonePageSize: 5,
      lineZoneTotalPage: 0,
      linePdaPageIndex: 1,
      linePdaPageSize: 5,
      linePdaTotalPage: 0,
      lineListLoading: false,

      classGroupListLoading: false,

      lineZoneListLoading: false,
      linePdaListLoading: false,
      lineListSelections: [],
      turnListSelections: [],
      classGroupListSelections: [],
      periodListSelections: [],
      lineZoneListSelections: [],
      linePdaListSelections: [],
      lineAddOrUpdateVisible: false,
      turnAddOrUpdateVisible: false,
      // viewPublishVisible: false,
      classGroupAddOrUpdateVisible: false,
      periodAddOrUpdateVisible: false,
      lineZoneAddOrUpdateVisible: false,
      linePdaAddOrUpdateVisible: false,
      activeTab: "class",
      lineSelected: false,
    };
  },
  components: {
    depttree,
    PdaAddOrUpdate,
    LineAddOrUpdate,
    ClassGroupAddOrUpdate,
    ZoneBindAddOrUpdate,
    ViewPublish,
    splitPane,
  },
  activated() {
    this.getLineList();
  },
  methods: {
    wancheng(e) {
      console.log(e)
      this.$http({
        url: this.$http.adornUrl("/inspection/panline/panlinelist"),
        method: "post",
        data: this.$http.adornData({ id: e.id, statusId: e.statusId?1:0 }),
      });
    },
    pdaDetail(id) {
      // 查看详情
      console.log(id);
      this.$router.push({ name: "inspection-pad" });
    },
    // 删除
    deleteHandle(id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map((item) => {
            return item.id;
          });
      this.$confirm(`确定删除?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl("/inspection/panline/delete"),
          method: "post",
          data: this.$http.adornData(ids, false),
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: "操作成功",
              type: "success",
              duration: 1500,
              onClose: () => {
                this.getLineList();
              },
            });
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    },
    selectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    search() {
      this.lineForm.deptId = null;
      this.getLineList(null);
    },
    onDrawBack() {
      this.isDrawBack = !this.isDrawBack;
      if (this.isDrawBack) {
        this.oldPercent = this.curPercent;
        this.curPercent = 2.5;
        this.drawBackClass = "el-icon-d-arrow-right";
      } else {
        this.drawBackClass = "el-icon-d-arrow-left";
        this.curPercent = this.oldPercent;
      }
      this.$refs.splitPane.setPercent(this.curPercent);
    },
    resize(val) {
      this.curPercent = val;
      console.log(val);
    },
    // 关闭下载详情
    // closeMain () {
    //   console.log(this.viewPublishVisible)
    //   this.viewPublishVisible = false
    // },
    // 获取数据列表
    getLineList(deptId) {
      this.lineListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/inspection/panline/list"),
        method: "get",
        params: this.$http.adornParams({
          page: this.linePageIndex,
          limit: this.linePageSize,
          deptId: deptId,
          name: this.lineForm.name,
        }),
      }).then(({ data }) => {
        console.log(data)
        if (data && data.code === 0) {
          this.lineList = data.page.list;
          this.lineTotalPage = data.page.totalCount;
        } else {
          this.lineList = [];
          this.lineTotalPage = 0;
        }
        this.lineListLoading = false;
      });
    },

    getClassGroupList() {
      this.classGroupListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/inspection/pangroup/list"),
        method: "get",
        params: this.$http.adornParams({
          page: this.classGroupPageIndex,
          limit: this.classGroupPageSize,
          panLineId: this.lineForm.panLineId,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.classGroupList = data.page.list;
          this.classGroupTotalPage = data.page.totalCount;
        } else {
          this.classGroupList = [];
          this.classGroupTotalPage = 0;
        }
        this.classGroupListLoading = false;
      });
    },

    getLineZoneList() {
      this.lineZoneListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/inspection/panlinezone/list"),
        method: "get",
        params: this.$http.adornParams({
          page: this.lineZonePageIndex,
          limit: this.lineZonePageSize,
          panLineId: this.lineForm.panLineId,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.lineZoneList = data.page.list;
          this.lineZoneTotalPage = data.page.totalCount;
        } else {
          this.lineZoneList = [];
          this.lineZoneTotalPage = 0;
        }
        this.lineZoneListLoading = false;
      });
    },
    getLinePdaList() {
      this.linePdaListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/inspection/panpublish/list"),
        method: "get",
        params: this.$http.adornParams({
          page: this.linePdaPageIndex,
          limit: this.linePdaPageSize,
          panLineId: this.lineForm.panLineId,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.linePdaList = data.page.list;
          this.linePdaTotalPage = data.page.totalCount;
        } else {
          this.linePdaList = [];
          this.linePdaTotalPage = 0;
        }
        this.linePdaListLoading = false;
      });
    },
    // 每页数
    lineSizeChangeHandle(val) {
      this.linePageSize = val;
      this.linePageIndex = 1;
      this.getLineList(this.lineForm.deptId);
    },
    // 每页数

    // 每页数
    classGroupSizeChangeHandle(val) {
      this.classGroupPageSize = val;
      this.classGroupPageIndex = 1;
      this.getClassGroupList();
    },
    // 每页数

    // 每页数
    lineZoneSizeChangeHandle(val) {
      this.lineZonePageSize = val;
      this.lineZonePageIndex = 1;
      this.getLineZoneList();
    },
    // 每页数
    linePdaSizeChangeHandle(val) {
      this.linePdaPageSize = val;
      this.linePdaPageIndex = 1;
      this.getLinePdaList();
    },
    // 当前页
    lineCurrentChangeHandle(val) {
      this.linePageIndex = val;
      console.log("选择了线路" + this.lineSelected);
      if (this.lineSelected) {
        // 选择了线路
        this.lineForm.deptId = null;
        this.getLineList(null);
      } else {
        this.getLineList(this.lineForm.deptId);
      }
    },
    // 当前页
    turnCurrentChangeHandle(val) {
      this.turnPageIndex = val;
      this.getTurnList();
    },
    // 当前页
    classGroupCurrentChangeHandle(val) {
      this.classGroupPageIndex = val;
      this.getClassGroupList();
    },
    // 当前页
    lineZoneCurrentChangeHandle(val) {
      this.lineZonePageIndex = val;
      this.getLineZoneList();
    },
    // 当前页
    linePdaCurrentChangeHandle(val) {
      this.linePdaPageIndex = val;
      this.getLinePdaList();
    },
    // 选择线路
    lineSelectionChangeHandle(val) {
      console.log(val);
      if (val != null) {
        this.isPublish = val.isPublish;
        if (val.isPublish === 0) {
          this.publishIcon = "el-icon-circle-check-outline";
          this.publishName = "发布计划";
        } else {
          this.publishIcon = "el-icon-edit-outline";
          this.publishName = "修改计划";
        }
        this.lineForm.deptId = val.deptId;
        this.lineSelected = true;
        this.lineForm.panLineId = val.id;
        this.getDataList();
      } else {
        this.lineForm.panLineId = 0;
        this.lineSelected = false;
      }
    },

    // 多选
    classGroupSelectionChangeHandle(val) {
      this.classGroupListSelections = val;
    },

    // 多选
    lineZoneSelectionChangeHandle(val) {
      this.lineZoneListSelections = val;
    },
    // 多选
    linePdaSelectionChangeHandle(val) {
      this.linePdaListSelections = val;
    },
    // 新增 / 修改
    lineAddOrUpdateHandle(id) {
      console.log(id);
      this.lineAddOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.lineAddOrUpdate.getDeptList();
        this.$refs.lineAddOrUpdate.init(id);
      });
    },

    // viewPublish (panLineId) {
    //   this.viewPublishVisible = true
    //   this.$nextTick(() => {
    //     this.$refs.viewPublish
    //     this.$refs.viewPublish.getDataList(panLineId)
    //   })
    // },
    classGroupAddOrUpdateHandle(id) {
      this.classGroupAddOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.classGroupAddOrUpdate.dataForm.panLineId = this.lineForm.panLineId;
        this.$refs.classGroupAddOrUpdate.getUserList();
        this.$refs.classGroupAddOrUpdate.init(id, this.lineForm.deptId);
      });
    },

    zoneBindAddOrUpdateHandle(id) {
      this.lineZoneAddOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.zoneBindAddOrUpdate.dataForm.panLineId = this.lineForm.panLineId;
        this.$refs.zoneBindAddOrUpdate.init(this.lineForm.deptId);
      });
    },
    pdaBindAddOrUpdateHandle(id) {
      this.linePdaAddOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.pdaBindAddOrUpdate.dataForm.panLineId = this.lineForm.panLineId;
        this.$refs.pdaBindAddOrUpdate.init(this.lineForm.deptId);
      });
    },
    handleDeptSelect(val) {
      this.lineList = [];
      this.turnList = [];
      this.classGroupList = [];
      this.periodList = [];
      this.lineForm.panLineId = 0;
      this.lineForm.deptId = val;
      this.lineSelected = false;
      this.linePageIndex = 1;
      this.getLineList(this.lineForm.deptId);
    },
    tabSelectChangeHandle(val) {
      this.classGroupPageIndex = 1;
      this.periodPageIndex = 1;
      this.turnPageIndex = 1;
      this.lineZonePageIndex = 1;
      this.linePdaPageIndex = 1;
      this.getDataList();
    },
    rowStyle({ row, rowIndex }) {
      return "height:25px";
    },
    cellStyle() {
      return "padding:0";
    },
    getDataList() {
      if (this.activeTab === "turn") {
        this.getTurnList();
      }
      if (this.activeTab === "class") {
        this.getClassGroupList();
      }
      if (this.activeTab === "period") {
        this.getPeriodList();
      }
      if (this.activeTab === "zone") {
        this.getLineZoneList();
      }
      if (this.activeTab === "pda") {
        this.getLinePdaList();
      }
    },
    // 删除

    // 删除
    lineZoneDeleteHandle(id) {
      var ids = id
        ? [id]
        : this.lineZoneListSelections.map((item) => {
            return item.id;
          });
      this.$confirm(`确定解绑?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl("/inspection/panlinezone/delete"),
          method: "post",
          data: this.$http.adornData(ids, false),
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: "操作成功",
              type: "success",
              duration: 1500,
              onClose: () => {
                this.getLineZoneList();
              },
            });
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    },
    // 删除
    lineDeleteHandle(id) {
      var ids = id
        ? [id]
        : this.lineListSelections.map((item) => {
            return item.id;
          });
      this.$confirm(`确定删除?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl("/inspection/panline/delete"),
          method: "post",
          data: this.$http.adornData(ids, false),
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: "操作成功",
              type: "success",
              duration: 1500,
              onClose: () => {
                this.getLineList(this.lineForm.deptId);
              },
            });
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    },

    // 删除
    classGroupDeleteHandle(id) {
      var ids = id
        ? [id]
        : this.classGroupListSelections.map((item) => {
            return item.id;
          });
      this.$confirm(`确定解绑?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl("/inspection/pangroup/delete"),
          method: "post",
          data: this.$http.adornData(ids, false),
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: "操作成功",
              type: "success",
              duration: 1500,
              onClose: () => {
                this.getClassGroupList();
              },
            });
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    },
    // 删除
    pdaDeleteHandle(id) {
      var ids = id
        ? [id]
        : this.linePdaListSelections.map((item) => {
            return item.id;
          });
      this.$confirm(`确定解绑?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl("/inspection/panpublish/delete"),
          method: "post",
          data: this.$http.adornData(ids, false),
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: "操作成功",
              type: "success",
              duration: 1500,
              onClose: () => {
                this.getLinePdaList();
              },
            });
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    },
    zoneBindEvent(val) {
      var zoneIds = val.map((item) => {
        return item.panZoneId;
      });
      if (zoneIds.length > 0) {
        this.$http({
          url: this.$http.adornUrl("/inspection/panlinezone/bind"),
          method: "post",
          params: this.$http.adornParams({
            panLineId: this.lineForm.panLineId,
          }),
          data: this.$http.adornData(zoneIds, false),
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: "操作成功",
              type: "success",
              duration: 1500,
              onClose: () => {
                this.getLineZoneList();
              },
            });
          } else {
            this.$message.error(data.msg);
          }
        });
      }
    },
    pdaBindEvent(val) {
      var pdaIds = val.map((item) => {
        return item.pdaId;
      });
      this.$http({
        url: this.$http.adornUrl("/inspection/panpublish/bind"),
        method: "post",
        params: this.$http.adornParams({
          panLineId: this.lineForm.panLineId,
        }),
        data: this.$http.adornData(pdaIds, false),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: "操作成功",
            type: "success",
            duration: 1500,
            onClose: () => {
              this.getLinePdaList();
            },
          });
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    linePublish() {
      if (this.lineForm.panLineId === 0 || this.lineForm.panLineId === null) {
        this.$alert("请选择线路");
        return;
      }
      if (this.publishName === "修改计划") {
        this.$confirm(`确定将线路由已发布状态改为编操状态作?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl("/inspection/panline/update"),
            method: "post",
            data: this.$http.adornData({
              id: this.lineForm.panLineId,
              isPublish: 0,
            }),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  console.log("选择了线路" + this.lineSelected);
                  if (this.lineSelected) {
                    // 选择了线路
                    this.lineForm.deptId = null;
                    this.getLineList(null);
                  } else {
                    this.getLineList(this.lineForm.deptId);
                  }
                  // this.getLineList(null)
                  this.isPublish = 0;
                },
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        });
      }

      if (this.publishName === "发布计划") {
        this.$http({
          url: this.$http.adornUrl(
            `/inspection/panline/publish/${this.lineForm.panLineId}`
          ),
          method: "post",
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: "操作成功",
              type: "success",
              duration: 1500,
              onClose: () => {
                // this.getLineList(this.lineForm.deptId)
                console.log("选择了线路" + this.lineSelected);
                if (this.lineSelected) {
                  // 选择了线路
                  this.lineForm.deptId = null;
                  this.getLineList(null);
                } else {
                  this.getLineList(this.lineForm.deptId);
                }
                // this.getLineList(null)
                this.isPublish = 1;
              },
            });
          } else {
            this.$message.error(data.msg);
          }
        });
      }
    },
    // 跳转到 对应的巡区页面
    clickToZone(panZoneName) {
      if (this.isAuth("inspection:panzone:list")) {
        this.$router.push({
          name: "inspection-paneling",
          params: { panZoneName: panZoneName },
        });
      } else {
        this.$alert("您没有开通页面权限");
      }
    },
    // 跳转到 对应的Pda 页面
    clickToPda(pdaName) {
      if (this.isAuth("inspection:pda:list")) {
        this.$router.push({
          name: "inspection-pda",
          params: { pdaName: pdaName },
        });
      } else {
        this.$alert("您没有开通页面权限");
      }
    },
  },
};
</script>

<style scoped="" lang="scss">
// 开关
.switch /deep/ .el-switch__label {
  position: absolute;
  color: #fff !important;
  z-index: 1;
  display: none;
}
.switch /deep/ .is-active {
  display: block;
}
.switch /deep/ .el-switch__label--left span {
  margin-left: 20px;
}
.mod-inspection-line {
  .el-form {
    /deep/ .el-form-item {
      margin-bottom: 5px;
    }
  }
  .el-tabs {
    /deep/ .el-tabs__item {
      height: 30px;
      line-height: 30px;
    }
  }
  .bottom_data {
    height: 100%;
    display: flex;
    flex-direction: column;
    .el-table {
      flex: 1;
      // /deep/ .cell{
      //   min-height: 32px;
      // }
    }
  }
  /deep/ .el-table--medium th {
    padding: 4px 0;
  }
}
.show-data-up {
  margin: 0 !important;
}
.site-content .show-data-table {
  padding: 10px;
}
.site-wrapper .el-pagination {
  margin-top: 8px;
}
.xunxian {
  /deep/ .el-tabs__content {
    height: calc(100% - 29px);
    .el-tab-pane {
      height: 100%;
    }
  }
}
</style>


