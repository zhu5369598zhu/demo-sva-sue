<template>
  <div class="mod-pda" style="height: 100%;">
    <div class="show-data-content">
      <split-pane split="vertical" ref="splitPane" :min-percent="0" :default-percent="curPercent" @resize="resize">
        <template slot="paneL">
          <div class="show-left">

          </div>
          <depttree @deptSelectEvent="handleDeptSelect" v-if="this.isDrawBack===false"></depttree>
    </div>
</template>
<template slot="paneR">
  <div class="show-data-table">
    <div class="show-data-up">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getLineList()">
        <!-- <el-form-item label="" prop="isInspected">
          <el-select v-model="dataForm.isInspected" size="mini" placeholder="完成模式" clearable>
            <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item>
          <el-button @click="search()" size="mini">查询</el-button>
        </el-form-item> -->
        <!-- <el-form-item>
          <el-button @click="exportExcelHandle(detailId,detaTurnId,inspectionDate)" size="mini">导出数据</el-button>
        </el-form-item> -->
        <el-form-item>
          <el-button @click="exportExcelReportHandle(detailId,detaTurnId,inspectionDate)" size="mini">报表数据</el-button>
        </el-form-item>
      </el-form>
      <el-table ref="table" :height="tableHeight" :data="dataList" border v-loading="dataListLoading"
        @selection-change="selectionChangeHandle" :cell-style="cellStyle" :row-style="rowStyle" style="width: 100%">
        <el-table-column type="selection" header-align="center" align="center" width="50">
        </el-table-column>
        <el-table-column type="index" header-align="center" align="center" width="80">
        </el-table-column>
        <el-table-column prop="name" header-align="center" align="center" label="名称">
        </el-table-column>
        <el-table-column prop="power" header-align="center" align="center" label="功率">
        </el-table-column>
        <el-table-column prop="frontTemp" header-align="center" align="center" label="前轴承温度">
        </el-table-column>
        <el-table-column prop="backTemp" header-align="center" align="center" label="后轴承温度">
        </el-table-column>
        <el-table-column prop="frontVibration" header-align="center" align="center" label="前轴承振动">
        </el-table-column>
        <el-table-column prop="backVibration" header-align="center" align="center" label="后轴承振动">
        </el-table-column>
         <el-table-column prop="statorTemp" header-align="center" align="center" label="定子温度">
        </el-table-column>
        <el-table-column prop="runElect" header-align="center" align="center" label="运行电流">
        </el-table-column>
        <el-table-column prop="rateEect" header-align="center" align="center" label="额定电流">
        </el-table-column>
        <el-table-column prop="aboSituation" header-align="center" align="center" label="异常情况">
        </el-table-column>

         <el-table-column prop="person" header-align="center" align="center" label="巡检人">
        </el-table-column>
        <el-table-column prop="inspectTime" header-align="center" align="center" label="巡检时间">
        </el-table-column>
        <el-table-column prop="worker" header-align="center" align="center" label="岗位工确认">
        </el-table-column>
        <el-table-column prop="remark" header-align="center" align="center" label="备注">
        </el-table-column>

      </el-table>
      <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>

  </div>
</template>



<script>
  import { formatDate } from "@/utils";
  export default {
    data() {
      return {
        dataForm: {
          isInspected: ''
        },
        dataList: [],
        detailId: "", //上一页接收到的行id
        detaTurnId: "",
        inspectionDate: "",
        dataListLoading: false,
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
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
      console.log(data.turnEndTime);
      this.getLineList(this.detailId, this.detaTurnId, this.inspectionDate);


    },
    methods: {
      // 获取数据列表
      search() {

        this.getLineList(this.detailId, this.detaTurnId, this.inspectionDate)
      },
      getLineList(lineId, turnId, inspectionDate) {
        
        this.dataListLoading = true;
        this.$http({
          url: this.$http.adornUrl("/inspection/inspectiontaskdevice/exportReportList"),
          method: "get",
          params: this.$http.adornParams({
            page: this.pageIndex,
            limit: this.pageSize,
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
     
      exportReportToExcel(list) {
        this.downloadLoading = true;        
        require.ensure([], () => {
          const { export_json_to_excel } = require("@/vendor/Export2ExcelReport");
          const multiHeader = [
          [
            "",
            "",
            "",
            "",
            "",
            "电仪车间重点设备巡检表",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            ""
          ]
        ];
        const multiHeader2 = [
          [ "","","","","","","","","","","","","","",""],
        ];
          const tHeader = [
            "序号",
            "名称",
            "功率",
            "前轴承温度",
            "后轴承温度",
            "前轴承振动",
            "后轴承振动",
            "定子温度",
            "运行电流",
            "额定电流",
            "异常情况",
            "巡检人",
            "巡检时间",
            "岗位工确认",
            "备注"
          ];
          const filterVal = [
            "id",
            "name",
            "power",
            "frontTemp",
            "backTemp",
            "frontVibration",
            "backVibration",
            "statorTemp",
            "runElect",
            "rateEect",
            "aboSituation",
            "person",
            "inspectTime",
            "worker",
            "remark"
          ];
          const data = this.formatJson(filterVal, list);
          const merges = ["F1:H1","K2:L2"];
          let filename = formatDate(new Date(), "yyyyMMddhhmmss");
          export_json_to_excel(list[0],{
            multiHeader,
            multiHeader2,
            header: tHeader,
            data,
            merges,
            filename: filename,
            autoWidth: true,
            bookType: "xlsx",
          });
          this.downloadLoading = false;
        });
      },
     
      exportExcelReportHandle(lineId, turnId, inspectionDate){
        this.$http({
          url: this.$http.adornUrl("/inspection/inspectiontaskdevice/exportReport"),
          method: "get",
          params: this.$http.adornParams({
            lineId: lineId,
            turnId: turnId,
            inspectionDate: inspectionDate
          }),
        }).then(({ data }) => {
          console.log("data %o", data);
          if (data && data.code === 0) {
            this.exportReportToExcel(data.list);
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