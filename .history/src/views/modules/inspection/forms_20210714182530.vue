<template>
 <div>图片</div>
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


