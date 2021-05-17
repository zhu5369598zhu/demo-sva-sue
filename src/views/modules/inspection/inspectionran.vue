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
               <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item label="开始时间:" prop="startTime">
          <el-date-picker v-model="dataForm.startTime" size="mini" type="date" value-format="yyyy-MM-dd 00:00:00" @change="handleStartTimeChange" :picker-options="startDatePicker" style="width:140px;" clearable></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker v-model="dataForm.endTime" size="mini" type="date" value-format="yyyy-MM-dd 00:00:00" @change="handleEndTimeChange" :picker-options="startDatePicker" style="width:140px;" clearable></el-date-picker>
        </el-form-item>
         <el-form-item label="" prop="status">
            <el-select v-model="dataForm.status" size="mini" placeholder="完成模式" clearable>
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
                  <el-button @click="searchs()"
                  size="mini" type="primary" :disabled="dataListSelections.length <= 0">下发临时巡检计划</el-button>  
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
        prop="factoryName"
        header-align="center"
        align="center"
        label="工厂名称">
      </el-table-column>
      <el-table-column
        prop="deptName"
        header-align="center"
        align="center"
        label="部门名称">
      </el-table-column>
      <el-table-column
        prop="workshopName"
        header-align="center"
        align="center"
        label="车间名称">
      </el-table-column>
      <el-table-column
        prop="itemName"
        header-align="center"
        align="center"
        label="巡项名称">
      </el-table-column>
      <el-table-column
        prop="deviceName"
        header-align="center"
        align="center"
        label="设备名称">
      </el-table-column>
      <el-table-column
        prop="userName"
        header-align="center"
        align="center"
        label="巡检人员">
      </el-table-column>
      <el-table-column
        prop="deviceCode"
        header-align="center"
        align="center"
        label="设备编码">
      </el-table-column>
      <el-table-column
        prop="statusName"
        header-align="center"
        align="center"
        label="状态名称">
      </el-table-column>
      <el-table-column
        prop="startTime"
        header-align="center"
        align="center"
        label="开始时间">
      </el-table-column>
      <el-table-column
        prop="endTime"
        header-align="center"
        align="center"
        label="结束时间">
      </el-table-column>
       <el-table-column
        prop="userName"
        header-align="center"
        align="center"
        label="巡检人员">
      </el-table-column>
        <el-table-column
        prop="pdaMac"
        header-align="center"
        align="center"
        label="PDA">
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
import { formatDate } from '@/utils'
export default {
  data () {
    return {
      dataForm: {
      status:'',
      startTime: null,
      endTime: '',
      
      },
      dataList:[],
      detailId: "", //上一页接收到的行id
      viewMediaVisible: false,
      viewChartVisible: false,
      dataListLoading: false,
      dataListSelections:[],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      statusList: [{'id': 1, 'name': '未处理'}, {'id': 2, 'name': '执行中'}, {'id': 3, 'name': '也处理'}],
    }
  },
  
  activated () {
      this.dataForm.endTime = new Date()
      this.dataForm.startTime = new Date()
      this.dataForm.startTime.setDate(this.dataForm.endTime.getDate() - 7)
      this.getDataList()
    },
  methods: {
       beginDate () {
        return {
          disabledDate (time) {
            return time.getTime() > Date.now() // 开始时间不选时，结束时间最大值小于等于当天
          }
        }
      },

    searchs (id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map((item) => {
            return item.id;
          });
         this.$http({
          url: this.$http.adornUrl("/inspection/temp/saves"),
          method: "post",
          data: this.$http.adornData(ids, false),
        }).then(({ data }) => {
           if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
        });
    },
    search () {
      this.getDataList()
    },
     getDataList () {
         let startTime = new Date(this.dataForm.startTime)
        startTime = formatDate(startTime, 'yyyy-MM-dd')
        let endTime = new Date(this.dataForm.endTime)
        endTime = formatDate(endTime, 'yyyy-MM-dd')
        if (startTime === 'NaN-aN-aN' || startTime === '1970-01-01') {
          startTime = ''
        }
        if (endTime === 'NaN-aN-aN' || endTime === '1970-01-01') {
          endTime = ''
        }else{
          let time = formatDate(new Date(), 'yyyy-MM-dd')  // 当日时间
          if(endTime < time){
            endTime = new Date(this.dataForm.endTime)
            endTime.setDate(endTime.getDate()+ 1)
            endTime = formatDate(endTime, 'yyyy-MM-dd')
            console.log('查询时间'+ endTime)
          }
        }
        if(endTime !=='' && endTime<startTime) {
          this.$message.error('结束时间不能小于开始时间')
          return
        }
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/inspection/tempinterface/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key,
            'status': this.dataForm.status,
            'startTime': startTime,
            'endTime': endTime
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
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
    rowStyle ({ row, rowIndex }) {
      return 'height:40px'
    },
    cellStyle () {
      return 'padding:0'
    },

  },
    
  mounted: function () {
    this.$nextTick(function () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 105 - 32 - 20

      let self = this
      window.onresize = function () {
        self.tableHeight = window.innerHeight - self.$refs.table.$el.offsetTop - 105 - 32 - 20
      }
    })
  }
}
</script>

<style scoped="">
@media screen and (max-width: 1360px) {
  .el-table {
    height: calc(100vh - 270px) !important;
  }
}
</style>