<template>
  <div class="drone" style="height: 100%;">
    <div class="show-data-table">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
       <el-form-item prop="createTime">
      <el-date-picker v-model="dataForm.createTime" value-format="yyyy-MM-dd" @change="handleStartTimeChange" :picker-options="startDatePicker" style="width:140px;"></el-date-picker>
    </el-form-item>
      <el-form-item prop="droneName">
        <el-input v-model="dataForm.droneName" placeholder="请输入内容" clearable ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()" type="primary"  icon="el-icon-search">查询</el-button>
      </el-form-item>
       <el-form-item>
        <div align="center">
          <el-upload
            class="upload-document"
            :action="this.$http.adornUrl(`/inspection/pdf/upload?token=${this.$cookie.get('token')}`)"
            :file-list="fileList"
            :on-success="uploadSuccessHandle"
            :on-error="uploadErrorHandle"
            :data="uploadParams">
            <el-button  type="primary" v-if="!disabled" ><i class="el-icon-upload el-icon--right"></i>上传</el-button>
          </el-upload>
        </div>
      </el-form-item>
    </el-form>
    <el-table
      ref="table"
      :height="tableHeight"
      :data="dataList"
      border
      :cell-style="cellStyle"
      :row-style="rowStyle"
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="index"
        header-align="center"
        align="center"
        width="80">
      </el-table-column>
      <el-table-column
        prop="droneName"
        header-align="center"
        align="center"
        label="文件名称">
      </el-table-column>
      <el-table-column
        prop="userName"
        header-align="center"
        align="center"
        label="上传者">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="上传时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
          <template slot-scope="scope">
          <el-button icon="el-icon-download" v-if="isAuth('inspection:pdf:delete')" type="text" size="mini" @click="downloadHandle(scope.row.guid)">下载</el-button>
          <el-button icon="el-icon-delete" v-if="isAuth('inspection:pdf:delete') && !disabled" type="text" size="mini" @click="deleteHandle(scope.row.guid)">删除</el-button>
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
    
  </div>
  </div>
</template>

 <script>
  export default {
    props: {
      disabled: {
        type: Boolean
      }
    },
    data () {
      return {
        fileList: [],
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListSelections: [],
        dataForm:{
          droneName:'',
          createTime:'',
          guid:''
        }
      }
       
    },
    created () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.$http({
          url: this.$http.adornUrl('/inspection/pdf/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'droneName': this.dataForm.droneName,
            'createTime': this.dataForm.createTime
           
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
        })
      },
      downloadHandle (guid) {
        let a = document.createElement('a')
        a.href = this.$http.adornUrl(`/inspection/pdf/download?uuid=${guid}&token=${this.$cookie.get('token')}`)
        a.click()
      },
    
      deleteHandle (guid) {
         var ids = guid ? [guid] : this.dataListSelections.map(item => {
          return item.guid
        })
        this.$confirm(`确定删除?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        this.$http({
          url: this.$http.adornUrl(`/inspection/pdf/delete/${guid}?token=${this.$cookie.get('token')}`),
          method: 'get',
          params: this.$http.adornParams()
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
      uploadSuccessHandle (response, file, fileList) {
        console.log(file)
        this.fileList = []
        if (response.code > 0) {
          this.$message.error(response.msg)
        } else {
          this.getDataList()
        }
      },
      uploadErrorHandle (err, file, fileList) {
        this.$message.error(err)
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
      selectionChangeHandle () {
        this.dataListSelections = val
      },
      rowStyle ({row, rowIndex}) {
        return 'height:25px;padding:0;'
      },
      cellStyle () {
        return 'padding:0'
      }
    },
    watch: {
       function (newVal, oldVal) {
        this.getDataList()
      }
    }
  }
</script>

<style>
  .pagecontrol {
    margin-top: 10px;
  }
</style>


