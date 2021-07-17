<template>
  <div class="mod-config">
    <el-form
      :inline="true"
      :model="dataForm"
      @keyup.enter.native="getDataList()"
    >
      <el-form-item label="开始时间:" prop="startTime">
        <el-date-picker
          v-model="dataForm.startTime"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          placeholder="选择日期时间"
        >
        </el-date-picker>
        <!-- <el-date-picker v-model="dataForm.startTime"  type="datetime" value-format="yyyy-MM-dd 00:00:00" @change="handleStartTimeChange" :picker-options="startDatePicker" style="width:140px;"></el-date-picker> -->
      </el-form-item>
      <el-form-item label="到:" prop="endTime">
        <el-date-picker
          v-model="dataForm.endTime"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          placeholder="选择日期时间"
        >
        </el-date-picker>
        <!-- <el-date-picker
          v-model="dataForm.endTime"
          type="datetime"
          value-format="yyyy-MM-dd 00:00:00"
          @change="handleEndTimeChange"
          :picker-options="startDatePicker"
          style="width: 140px"
        ></el-date-picker> -->
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="dataForm.key"
          placeholder="参数名"
          clearable
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button
          v-if="isAuth('olmonitoring:olsensordata:save')"
          type="primary"
          @click="addOrUpdateHandle()"
          >新增</el-button
        >
        <el-button
          v-if="isAuth('olmonitoring:olsensordata:delete')"
          type="danger"
          @click="deleteHandle()"
          :disabled="dataListSelections.length <= 0"
          >批量删除</el-button
        >
      </el-form-item>
      <el-button @click="exportExcelHandle()">导出</el-button>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      height ="100%"
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
        prop="nodeName"
        header-align="center"
        align="center"
        label="节点名称"
      >
      </el-table-column>
      <el-table-column
        width=""
        prop="outidSensor"
        header-align="center"
        align="center"
        label="节点ID"
      >
      </el-table-column>
      <el-table-column
        prop="vaue"
        header-align="center"
        align="center"
        label="轴值"
      >
      </el-table-column>

      <el-table-column
        prop="valueTemp"
        header-align="center"
        align="center"
        label="温度值"
      >
      </el-table-column>
      <el-table-column
        prop="time"
        header-align="center"
        align="center"
        label="时间戳"
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
            size="small"
            @click="addOrUpdateHandle(scope.row.idolSensorData)"
            >修改</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="deleteHandle(scope.row.idolSensorData)"
            >删除</el-button
          >
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
      layout="total, sizes, prev, pager, next, jumper"
    >
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="getDataList"
    ></add-or-update>
  </div>
</template>

<script>
import { formatDate } from '@/utils'
  import AddOrUpdate from './olsensordata-add-or-update'
  export default {
    data () {
      return {
        dataForm: {
          startTime:'',
           endTime:'',
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
    components: {
      AddOrUpdate
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表

       beginDate () {
        return {
          disabledDate (time) {
            return time.getTime() > Date.now() // 开始时间不选时，结束时间最大值小于等于当天
          }
        }
      },
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/olmonitoring/olsensordata/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key,
            'startTime': this.dataForm.startTime,
            'endTime': this.dataForm.endTime
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
      exportExcelHandle (key,startTime,endTime) {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/olmonitoring/olsensordata/export'),
          method: 'get',
          params: this.$http.adornParams({
            'key': this.dataForm.key,
            'startTime': this.dataForm.startTime,
            'endTime': this.dataForm.endTime
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

      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.idolSensorData
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/olmonitoring/olsensordata/delete'),
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
      }
    }
  }
</script>
