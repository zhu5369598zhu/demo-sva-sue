<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item prop="nodeName">
        <el-input v-model="dataForm.nodeName" placeholder="节点名称" clearable></el-input>
      </el-form-item>
       <el-select v-model="dataForm.selectStatusName"  @change="warningTypeSelectChange" placeholder="请选择告警类型" :disabled=node_set>
            <el-option label="全部" value="全部"></el-option>
            <el-option label="温度告警" value="温度告警"></el-option>
            <el-option label="震动告警" value="震动告警"></el-option>
            <el-option label="电量告警" value="电量告警"></el-option>
            <el-option label="通信告警" value="通信告警"></el-option>
        </el-select>
       <el-form-item prop="startTime">
          <el-date-picker v-model="dataForm.startTime" type="date" value-format="yyyy-MM-dd" @change="handleStartTimeChange" :picker-options="startDatePicker" style="width:140px;"></el-date-picker>
        </el-form-item>
      <el-form-item>
        <el-button @click="search()">查询</el-button>
      </el-form-item> 
     <el-form-item>
         <el-button @click="exportExcelHandle()">导出</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      height ="100%"
      style="width: 100%;">
      <el-table-column
                type="index"
                width="50"
                lable="">
              </el-table-column>
       <el-table-column
        prop="nodeName"
        header-align="center"
        align="center"
        label="节点名称">
      </el-table-column>
      <el-table-column
        prop="statusName"
        header-align="center"
        align="center"
        label="告警类型">
      </el-table-column>
      <el-table-column
        prop="vaue"
        header-align="center"
        align="center"
        label="震动报警值">
         <template slot-scope="scope">
          <span v-if="scope.row.communicationWarning === 1">--</span> 
          <span v-else-if="scope.row.statusVaue === 1" style="color: #00ff2b">{{scope.row.vaue}}</span>  
          <span v-else-if="scope.row.statusVaue === 2" style="color: red">{{scope.row.vaue}}</span>                  
          <span v-else>{{scope.row.vaue}}</span>                
        </template>
      </el-table-column>
      <el-table-column
        prop="valueTemp"
        header-align="center"
        align="center"
        label="温度报警值"
      >
      <template slot-scope="scope">
        <span v-if="scope.row.communicationWarning === 1">--</span> 
          <span v-else-if="scope.row.statusTemp === 1" style="color: #00ff2b">{{scope.row.valueTemp}}</span>  
          <span v-else-if="scope.row.statusTemp === 2" style="color: red">{{scope.row.valueTemp}}</span>                  
          <span v-else>{{scope.row.valueTemp}}</span>                
        </template>
      </el-table-column>

       <el-table-column
        prop="battery"
        header-align="center"
        align="center"
        label="电量报警值"
      >
      <template slot-scope="scope">
          <span v-if="scope.row.communicationWarning === 1">--</span> 
          <span v-else-if="scope.row.lowPowerWarning === 0" style="color: #00ff2b">{{scope.row.battery}}</span>  
          <span v-else-if="scope.row.lowPowerWarning === 1" style="color: red">{{scope.row.battery}}</span>                  
          <span v-else>{{scope.row.valueTemp}}</span>                
      </template>
      </el-table-column>
      <el-table-column
        prop="time"
        header-align="center"
        align="center"
        label="时间">
      </el-table-column>
      <el-table-column
        prop="gwId"
        header-align="center"
        align="center"
        label="网关ID">
      </el-table-column>
      <el-table-column
        prop="nodeId"
        header-align="center"
        align="center"
        label="节点ID">
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
  </div>
</template>

<script>
import { formatDate } from '@/utils'
  export default {
    data () {
      return {
        dataForm: {
          key: ''
        },
   
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
   
    activated () {
      this.getDataList()
    },
    methods: {
       search () {
        this.getDataList()
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
         url: this.$http.adornUrl('/olmonitoring/olsensordata/listRecord'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'nodeName': this.dataForm.nodeName,
            'startTime': this.dataForm.startTime,
            'selectStatusName':this.dataForm.selectStatusName
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      
      // 导出节点ID
      exportToExcel (list) {
        this.dataListLoading = true
        require.ensure([], () => {
          const { export_json_to_excel } = require('@/vendor/Export2Excel')
          const tHeader = ['节点名称', '节点ID', '轴值', '温度值', '时间戳']
          const filterVal = ['nodeName', 'outidSensor', 'vaue', 'valueTemp', 'time']
          const data = this.formatJson(filterVal, list)
          let filename = formatDate(new Date(), 'yyyyMMddhhmmss')
          export_json_to_excel({
            header: tHeader,
            data,
            filename: filename,
            autoWidth: true,
            bookType: 'xlsx'
          })
          this.dataListLoading = false
        })
      },
      formatJson (filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      // 获取数据列表 导出数据
      exportExcelHandle () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/olmonitoring/olsensordata/exports'),
          method: 'get',
          params: this.$http.adornParams({
            'selectStatusName': this.dataForm.selectStatusName,
            'startTime': this.dataForm.startTime,
            'nodeName': this.dataForm.nodeName
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.exportToExcel(data.list)
          } else {
            this.$message.error(data.msg)
          }
          this.dataListLoading = false
        })
      },

      warningTypeSelectChange(val){
         return val;
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
 
   
    }
  }
</script>
