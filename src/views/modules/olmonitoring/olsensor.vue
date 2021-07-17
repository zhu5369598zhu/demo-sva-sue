<template>
  <div class="mod-zone" style="height: 100%;">
    <div class="show-data-content">
      <split-pane split="vertical" ref="splitPane" :min-percent="0" :default-percent="curPercent" @resize="resize">
        <template slot="paneL" >
          <div class="show-left" style="height: calc(100% - 15px);">

            <div class="show-left" style="height: calc(100% - 15px);">
              <div class="org_title">
                <span v-if="this.isDrawBack===false">网关列表</span><i :class="drawBackClass" style="float:right;cursor:pointer;" @click="onDrawBack"></i>
              </div>
              <olwgtree @deptSelectEvent="handleDeptSelect" v-if="this.isDrawBack===false"></olwgtree>
            </div>

          </div>
        </template>
        <template slot="paneR" >
          <div class="show-data-table">
            <div class="show-data-up" style="flex: 1;">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="参数名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="search()">查询</el-button>
        <el-button v-if="isAuth('olmonitoring:olsensor:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('olmonitoring:olsensor:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-upload
                class="device-import"
                accept=".xlsx,.xls"
                :action="this.$http.adornUrl(`/olmonitoring/olsensor/upload?token=${this.$cookie.get('token')}`)"
                :file-list="importFileList"
                :on-success="UploadSuccessHandle">
          <el-button size="mini">导入</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <el-table
            :data="dataList"
            border
            v-loading="dataListLoading"
            @selection-change="selectionChangeHandle"
            height="100%"
            style="width: 100%;">
      <el-table-column
              type="selection"
              header-align="center"
              align="center"
              width="50">
      </el-table-column>
      <el-table-column
              v-if="false"
              prop="idolSensor"
              header-align="center"
              align="center"
              label="">
      </el-table-column>
      <el-table-column
              v-if="false"
              prop="outid"
              header-align="center"
              align="center"
              label="">
      </el-table-column>
      <el-table-column
              prop="areaid"
              header-align="center"
              align="center"
              label="区域ID">
      </el-table-column>
      <el-table-column
              prop="gwId"
              header-align="center"
              align="center"
              label="网关ID">
      </el-table-column>
      <el-table-column
              prop="nodeid"
              header-align="center"
              align="center"
              label="节点ID">
      </el-table-column>
      <el-table-column
              prop="nodename"
              header-align="center"
              align="center"
              label="节点名">
      </el-table-column>
      <el-table-column
              prop="rfChannel"
              header-align="center"
              align="center"
              label="无线通道">
      </el-table-column>
      <el-table-column
              prop="dataRate"
              header-align="center"
              align="center"
              label="无线速率">
      </el-table-column>
      <el-table-column
              prop="txPower"
              header-align="center"
              align="center"
              label="发射功率">
      </el-table-column>
      <el-table-column
              prop="serilBaudrate"
              header-align="center"
              align="center"
              label="串口速率">
      </el-table-column>
      <el-table-column
              prop="thresholdXU"
              header-align="center"
              align="center"
              label="X轴上限阈值">
      </el-table-column>
      <el-table-column
              prop="thresholdXD"
              header-align="center"
              align="center"
              label="X轴下限阈值">
      </el-table-column>
      <el-table-column
              prop="thresholdTemp"
              header-align="center"
              align="center"
              label="温度阈值">
      </el-table-column>
      <el-table-column
              fixed="right"
              header-align="center"
              align="center"
              width="150"
              label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.idolSensor)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.idolSensor)">删除</el-button>
        </template>
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
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
              <importResult v-if="importResultVisible" ref="importResult" @refreshDataList="getDataList"></importResult>
  </div>
  </div>
        </template>
      </split-pane>
    </div>
  </div>
</template>

<script>
  import AddOrUpdate from './olsensor-add-or-update'
  import importResult from './import-result'
  import splitPane from '@/components/split-pane'
  import olwgtree from '@/components/olwg-tree'

  export default {
    data () {
      return {
        dataForm: {
          key: '',
          wgId: null
        },
        isDrawBack: false,
        oldPercent: 16,
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        curPercent: 12,
        drawBackClass: 'el-icon-d-arrow-left',
        importFileList: [],
        importResultVisible: false
      }
    },
    components: {
      olwgtree,
      AddOrUpdate,
      splitPane,
      importResult
    },
    activated () {
      this.getDataList()
    },
    methods: {
       search () {
        this.getDataList()
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
      handleDeptSelect (val) {
        this.dataList = []
        this.dataForm.wgId = val
        this.pageIndex = 1
        this.getDataList()
        // console.log('得到TREE值'+val)
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/olmonitoring/olsensor/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key,
            'wgId':this.dataForm.wgId
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
      resize (val) {
        this.curPercent = val
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
      UploadSuccessHandle (response, file, fileList) {
        console.log('success')
        this.importFileList = []
        if (response.code > 0) {
          this.$message.error(response.msg)
        } else {
          var count = response.list.length
          this.$confirm(`上传成功，将要导入${count}条数据, 是否继续导入?`, '提示', {
            confirmButtonText: '导入',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            console.log('data %o', response.list)
            this.importExcelHandle(response.list)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取导入'
            })
          })
        }
      },
      importExcelHandle (list) {
        this.$http({
          url: this.$http.adornUrl('/olmonitoring/olsensor/import'),
          method: 'post',
          data: this.$http.adornData(list, false)
        }).then(({data}) => {
          console.log('import result %o', data)
          if (data && data.code === 0) {
            this.importResultHandle(data.result)
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      // 导入结果
      importResultHandle (result) {
        this.importResultVisible = true
        this.$nextTick(() => {
          this.$refs.importResult.init(result)
        })
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.idolSensor
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/olmonitoring/olsensor/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },

    }

  }
</script>
