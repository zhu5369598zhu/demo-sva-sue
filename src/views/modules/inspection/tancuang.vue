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
                <el-form-item>
                  <el-input v-model="dataForm.discName"
                            placeholder="状态"
                            clearable
                            size="mini"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button @click="search()"
                             size="mini">查询</el-button>
                 
                  <el-button @click="exportExcelHandle(detailId)"
                            
                             size="mini">导出报告</el-button>
                </el-form-item>

                <el-form-item>
                  <span>实盘资产: {{ totalPage }} 个</span>
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
        prop="name"
        header-align="center"
        align="center"
        label="状态"
      >
      </el-table-column>
      <el-table-column
        prop="deviceCode"
        header-align="center"
        align="center"
        label="资产编码"
      >
      </el-table-column>
      <el-table-column
        prop="propertyName"
        header-align="center"
        align="center"
        label="资产名称"
      >
      </el-table-column>
      <el-table-column
        prop="discCode"
        header-align="center"
        align="center"
        label="规格型号"
      >
      </el-table-column>
      <el-table-column
        prop="zoneName"
        header-align="center"
        align="center"
        label="盘区名称"
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
        prop="userName"
        header-align="center"
        align="center"
        label="盘点人员"
      >
      </el-table-column>
      <el-table-column
        prop="startTime"
        header-align="center"
        align="center"
        label="盘点时间"
      >
      </el-table-column>
    <el-table-column
        prop="medias"
        header-align="center"
        align="center"
        width="90"
        label="附件">
        <template slot-scope="scope" style="display: inline-block;white-space:normal;">
          <template v-for="item in scope.row.medias">
            <i style="cursor:pointer" @click="view(item.type, item.guid, scope.row.inspectionTypeId)">
              <icon-svg
                :name="changeImg(item.type)"
                style="font-size:16px;"></icon-svg>
            </i>
            <span>&nbsp;</span>
          </template>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="panRemark"
        header-align="center"
        align="center"
        label="盘点备注"
      >
      </el-table-column> -->
                
              </el-table>
              <el-pagination @size-change="sizeChangeHandle"
                             @current-change="currentChangeHandle"
                             :current-page="pageIndex"
                             :page-sizes="[10, 20, 50, 100]"
                             :page-size="pageSize"
                             :total="totalPage"
                             layout="total, sizes, prev, pager, next, jumper">
              </el-pagination>
                <viewMedia v-if="viewMediaVisible" ref="viewMedia" ></viewMedia>
                 <viewChart v-if="viewChartVisible" ref="viewChart" ></viewChart>
            </div>
        
          </div>
        </template>
    
</template>

<script>
import { formatDate } from '@/utils'
import viewMedia from './viewmedias'
import viewChart from './viewcharts'
export default {
  data () {
    return {
      dataForm: {
      
      
      },
      dataList:[],
      detailId: "", //上一页接收到的行id
      viewMediaVisible: false,
      viewChartVisible: false,
      dataListLoading: false,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,

    }
  },
  components: {  
     viewMedia,
     viewChart
  },
  activated () {
   this.detailId = this.$route.params.data.id;
    this.getLineList(this.detailId);
  },
  methods: {

       view (type, url, inspectionTypeId) {
        console.log(inspectionTypeId)
        if (type !== 'data') {
          this.viewMediaVisible = true
          this.$nextTick(() => {
            this.$refs.viewMedia.init(type, url)
          })
        } else {
          var inspectionType = 'acc'
          if (inspectionTypeId === 4) {
            inspectionType = 'acc'
          } else if (inspectionTypeId === 5) {
            inspectionType = 'speed'
          } else if (inspectionTypeId === 6) {
            inspectionType = 'distance'
          }
          this.viewChartVisible = true
          this.$nextTick(() => {
            console.log(inspectionType)
            this.$refs.viewChart.init(inspectionType, url)
          })
        }
      },
      changeImg (type) {
        if (type === 'jpg') {
          return 'chakan'
        }
        if (type === 'png') {
          return 'chakan'
        }
        if (type === 'mp3') {
          return 'shengyin'
        }
        if (type === 'data') {
          return 'tubiao'
        }
        if (type === 'video') {
          return 'video'
        }
      },


    search () {
      this.dataForm.lineId = null
      this.getLineList(this.detailId)
    },
    // 获取数据列表
    getLineList (lineId) {
       console.log(lineId);
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/inspection/panappresult/list'),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'discName': this.dataForm.discName,
          'lineId': lineId
        })
      }).then(({ data }) => {
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

     formatJson (filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      exportToExcel (list) {
        console.log(list)
        this.downloadLoading = true
        require.ensure([], () => {
          const { export_json_to_excel } = require('@/vendor/Export2Excel')
          const tHeader = ['状态<name>', '资产编码<propetty_name>', '规格型号<disc_code>','盘区名称<disc_name>','所属机构<dept_name>','盘点人员<user_name>','盘点时间<end_time>']
          const filterVal = ['name', 'propettyName', 'discCode','discName','deptName','userName','endTime']
          const data = this.formatJson(filterVal, list)
          let filename = formatDate(new Date(), 'yyyyMMddhhmmss')
          export_json_to_excel({
            header: tHeader,
            data,
            filename: filename,
            autoWidth: true,
            bookType: 'xlsx'
          })
          this.downloadLoading = false
        })
      },
      exportExcelHandle (lineId) {
        
        this.$http({
          url: this.$http.adornUrl('/inspection/panappresult/export'),
          method: 'get',
          params: this.$http.adornParams({
             'lineId': lineId
           })
        }).then(({data}) => {
          console.log('data %o', data)
          if (data && data.code === 0) {
            this.exportToExcel(data.list)
          } else {
            this.$message.error(data.msg)
          }
        })
      },




    handleDeptSelect (val) {
      this.dataForm.lineId = val
      this.pageIndex = 1
      this.getLineList(this.detailId)
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getLineList(this.detailId)
    },
   
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getLineList(this.detailId)
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
     
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
