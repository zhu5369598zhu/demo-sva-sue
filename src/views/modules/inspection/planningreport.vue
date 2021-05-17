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
                       @keyup.enter.native="getDataList()">
                <el-form-item>
                  <el-input v-model="dataForm.discName"
                            placeholder="盘点单名称"
                            clearable
                            size="mini"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button @click="search()"
                             size="mini">查询</el-button>
                 
                  <el-button @click="exportExcelHandle()"
                            
                             size="mini">导出报告</el-button>
                </el-form-item>
              </el-form>
              <el-table ref="table"
                        :height="tableHeight"
                        :data="dataList"
                        border
                        v-loading="dataListLoading"
                        @selection-change="selectionChangeHandle"
                        @row-click="rowSelect"
                        :cell-style="cellStyle"
                        :row-style="rowStyle"
                        style="width: 100%;">
                <el-table-column type="selection"
                                 header-align="center"
                                 align="center"
                                 width="50">
                </el-table-column>
                <el-table-column type="index"
                                 header-align="center"
                                 align="center"
                                 width="80">
                </el-table-column>
                <el-table-column prop="discName"
                                 header-align="center"
                                 align="center"
                                 label="盘点单名称">
                       
                </el-table-column>
                <el-table-column prop="createTime"
                                 header-align="center"
                                 align="center"
                                 label="盘点时间">
                </el-table-column>
                <el-table-column prop="discCountAnswer"
                                 header-align="center"
                                 align="center"
                                 label="应盘数量">
                </el-table-column>
                <el-table-column prop="discCountReal"
                                 header-align="center"
                                 align="center"
                                 label="实盘数量">
                </el-table-column>
                <el-table-column prop="disCount"
                                 header-align="center"
                                 align="center"
                                 label="未盘/亏盘数量">
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
import AddOrUpdate from './tancuang'
import splitPane from '@/components/split-pane'
export default {
  data () {
    return {
      dataForm: {
      
        discName: null,
        createTime: '',
        discCountAnswer: '',
        discCountReal:'',
        disCount:'',
        arrtemp:[]
      },
      dataList:[],
      dataListSelections:[]

    }
  },
  components: {

    AddOrUpdate,
    splitPane
  },
  activated () {
    // 接收巡线传递过来的数据
    this.dataForm.pdaName = this.$route.params.pdaName
    this.getDataList()
  },
  methods: {
    rowSelect(e){
      console.log(e)
      if (this.isAuth("inspection:discforms:list")) {
        this.$router.push({
          name: "inspection-tancuang",
          params: { data: e },
        });
      } else {
        this.$alert("您没有开通页面权限");
      }
    },
    complete (id) { // 完成
      console.log(id)
    },
    onDrawBack () {
      this.isDrawBack = !this.isDrawBack
      if (this.isDrawBack) {
        this.oldPercent = this.curPercent
        this.curPercent = 2.5
        this.drawBackClass = 'el-icon-d-arrow-right'
      } else {
        this.drawBackClass = 'el-icon-d-arrow-left'
        this.curPercent = this.oldPercent
      }
      this.$refs.splitPane.setPercent(this.curPercent)
    },
    resize (val) {
      this.curPercent = val
    },
    search () {
      this.dataForm.deptId = null
      this.getDataList()
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/inspection/discforms/list'),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'discName': this.dataForm.discName,
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
          const tHeader = ['盘点单名称<disc_name>', '盘点时间<create_time>', '应盘数量<disc_count_answer>','实盘数量<disc_count_real>','未盘亏盘数量<dis_count>']
          const filterVal = ['discName', 'createTime', 'discCountAnswer','discCountReal','disCount']
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
      exportExcelHandle () {
        // console.log(val)
      // console.log(id)
        //  var ids = id
        // ? [id]
        // : this.dataListSelections.map((item) => {
        //     return item.id;
        //   });
        // console.log(this.dataListSelections);
        // var arrtemp = [];
        // if(this.dataListSelections.length != 0){
        //     for(var item of this.dataListSelections){
        //       arrtemp.push(item.id);
        //     }
        // }
        // console.log(arrtemp)
        this.$http({
          url: this.$http.adornUrl('/inspection/discforms/export'),
          method: 'get',
          params: this.$http.adornParams({
            // 'arrtemp': this.dataForm.arrtemp
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
      this.dataForm.deptId = val
      this.pageIndex = 1
      this.getDataList()
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
      // console.log(val)
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
