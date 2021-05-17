<template>
  <div class="mod-pda"
       style="height: 100%;">
    <div class="show-data-content">
      <split-pane split="vertical"
                  ref="splitPane"
                  :min-percent="0"
                  :default-percent="curPercent"
                  @resize="resize">
        <template slot="paneL">
          <div class="show-left">
   
            </div>
            <depttree @deptSelectEvent="handleDeptSelect"
                      v-if="this.isDrawBack===false"></depttree>
          </div>
        </template>
        <template slot="paneR">
          <div class="show-data-table">
            <div class="show-data-up">
              <el-form :inline="true"
                       :model="dataForm"
                       @keyup.enter.native="getLineList()">
                  <el-form-item label="" prop="isInspected">
              <el-select v-model="dataForm.isInspected" size="mini" placeholder="完成模式" clearable>
                  <el-option
                  v-for="item in statusList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                  </el-option>
              </el-select>
        </el-form-item>
          <el-form-item>
                    <el-button @click="search()"
                    size="mini">查询</el-button>  
            </el-form-item>
                <el-form-item>
                  
                 
                  <el-button @click="exportExcelHandle(detailId,detaTurnId,inspectionDate)"
                            
                             size="mini">导出数据</el-button>
                </el-form-item>

              </el-form>
               <el-table
      ref="table"
      :height="tableHeight"
      :data="dataList"
      border
      v-loading="dataListLoading"
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
        prop="statusName"
        header-align="center"
        align="center"
        label="状态"
      >
      </el-table-column>
      <el-table-column
        prop="deviceName"
        header-align="center"
        align="center"
        label="巡点名称"
      >
      </el-table-column>
      <el-table-column
        prop="inspectItemCount"
        header-align="center"
        align="center"
        label="巡项总数"
      >
      </el-table-column>
      <el-table-column
        prop="inspectedItemCount"
        header-align="center"
        align="center"
        label="未检数量"
      >
      </el-table-column>
      <el-table-column
        prop="endTime"
        header-align="center"
        align="center"
        label="巡检时间"
      >
      </el-table-column>
      <el-table-column
        prop="userName"
        header-align="center"
        align="center"
        label="巡检人员"
      >
      </el-table-column>
              </el-table>
              <el-pagination @size-change="sizeChangeHandle"
                             @current-change="currentChangeHandle"
                             :current-page="pageIndex"
                             :page-sizes="[10, 20, 50, 100]"
                             :page-size="pageSize"
                             :total="totalPage"
                             layout="total, sizes, prev, pager, next, jumper">
              </el-pagination>
            </div>
        
          </div>
        </template>
    
</template>

<script>
import { formatDate } from "@/utils";
export default {
  data() {
    return {
      dataForm: {
        isInspected:''
      },
      dataList: [],
      detailId: "", //上一页接收到的行id
      detaTurnId: "",
      inspectionDate: "",
      dataListLoading: false,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      statusList: [{'id': 0, 'name': '未检项'}, {'id': 1, 'name': '已检项'}
      , {'id': 2, 'name': '备用'}],
    };
  },

  activated() {
    let data = this.$route.params.data;
    console.log("接收参数");
    console.log(data);
    console.log("接收参数");
    this.detailId = data.lineId;
    this.detaTurnId = data.turnId;
    this.inspectionDate = data.turnEndTime;
    console.log(data.lineId);
    console.log(data.turnId);
    // console.log(data.turnEndTime);
    this.getLineList(this.detailId, this.detaTurnId, this.inspectionDate);
   
    
  
  },
  methods: {
    // 获取数据列表
     search () {
      this.getLineList(this.detailId, this.detaTurnId, this.inspectionDate)
    },
    getLineList(lineId, turnId, inspectionDate) {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/inspection/inspectiontaskdevice/deviceList"),
        method: "get",
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          isInspected: this.dataForm.isInspected,
          lineId: lineId,
          turnId: turnId,
          inspectionDate: inspectionDate,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list;
          this.totalPage = data.page.totalCount;
        } else {
          this.dataList = [];
          this.totalPage = 0;
        }
        this.dataListLoading = false;
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
          "状态<status_name>",
          "巡点名称<device_name>",
          "巡项总数<inspect_item_count>",
          "未检数量<inspected_item_count>",
          "巡检时间<end_time>",
          "巡检人员<user_name>"
        ];
        const filterVal = [
          "statusName",
          "deviceName",
          "inspectItemCount",
          "inspectedItemCount",
          "endTime",
          "userName"
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
    exportExcelHandle(lineId,turnId, inspectionDate) {
      this.$http({
        url: this.$http.adornUrl("/inspection/inspectiontaskdevice/export"),
        method: "get",
        params: this.$http.adornParams({
          lineId: lineId,
          turnId: turnId,
          isInspected: this.dataForm.isInspected,
          inspectionDate: inspectionDate
        }),
      }).then(({ data }) => {
        console.log("data %o", data);
        if (data && data.code === 0) {
          this.exportToExcel(data.list);
        } else {
          this.$message.error(data.msg);
        }
      });
    },

    handleDeptSelect(val) {
      this.dataForm.lineId = val;
      this.pageIndex = 1;
      this.getLineList(this.detailId, this.detaTurnId, this.inspectionDate);
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getLineList(this.detailId, this.detaTurnId, this.inspectionDate);
    },

    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getLineList(this.detailId, this.detaTurnId, this.inspectionDate);
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val;
    },

    rowStyle({ row, rowIndex }) {
      return "height:40px";
    },
    cellStyle() {
      return "padding:0";
    },
  },

  mounted: function () {
    this.$nextTick(function () {
      this.tableHeight =
        window.innerHeight - this.$refs.table.$el.offsetTop - 105 - 32 - 20;

      let self = this;
      window.onresize = function () {
        self.tableHeight =
          window.innerHeight - self.$refs.table.$el.offsetTop - 105 - 32 - 20;
      };
    });
  },
};
</script>

<style scoped="">
@media screen and (max-width: 1360px) {
  .el-table {
    height: calc(100vh - 270px) !important;
  }
}
</style>