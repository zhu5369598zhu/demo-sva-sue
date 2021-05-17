<template>
  <el-dialog
    :title="!dataForm.id ? '巡项' : '巡项'"
    :close-on-click-modal="false"
    v-dialog-drag
    append-to-body="true"
    :visible.sync="visible"
  >
    <div class="bangding_box">
      <el-button type="primary" @click="itemAddOrUpdateHandle()"
        >绑定巡项</el-button
      >

      <el-button
        type="primary"
        @click="timeDeleteHandle()"
        :disabled="timeListSelections.length <= 0"
        >解绑巡项</el-button
      >
    </div>
    <el-table
      :data="timeList"
      border
      v-dialog-drag
      @selection-change="timeSelectionChangeHandle"
      highlight-current-row
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
        fixed
        type="index"
        header-align="center"
        align="center"
        width="50"
      >
      </el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="巡检内容"
      >
      </el-table-column>
      <el-table-column
        prop="unit"
        header-align="center"
        align="center"
        label="单位"
      >
      </el-table-column>
    </el-table>
    <div align="right">
      <el-pagination
        class="pagecontrol"
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="timePageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="timePageSize"
        :total="timeTotalPage"
        layout="total, sizes, prev, pager, next, jumper"
      >
      </el-pagination>
    </div>
    <el-dialog
      :title="bangding ? '绑定巡点' : '解绑巡点'"
      :visible.sync="neiceng"
      @selection-change="handleSelectionChange"
      append-to-body
    >
      <div class="neiceng_header">
        <el-button
          type="primary"
          icon="el-icon-search"
          style="z-index: 10"
          @click="searchC"
          >搜索</el-button
        >
      </div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
        highlight-current-row
        :border="true"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="name" label="巡检内容"> </el-table-column>

        <el-table-column prop="unit" label="单位"> </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="neiceng = false">取 消</el-button>
        <el-button type="primary" @click="bangdingSub()">确定</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
import { treeDataTranslate } from "@/utils";
export default {
  data() {
    return {
      timeList:[],
      tableData:[],
      isHttp: false,
      neiceng: false,
      visible: false,
      isShowDeptTree: false,
      timeTotalPage: 0,
      timePageIndex: 1,
      timePageSize: 10,
      itmeListSelections:[],
      timeListSelections:[],
      dataList: [],
      deptListTreeProps: {
        label: "name",
        children: "children",
      },
      dataForm: {
        id: 0,
        key: '',
        select: 'deviceName'
      },
     
    };
  },
//   mounted() {
//     this.getDataList(); // 部门查询
//   },
  methods: {
    handleStartTimeChange(val) {
      this.dataForm.repairtime = val;
    },
    beginDate() {
      return {
        disabledDate(time) {
          return time.getTime() > Date.now(); //  开始时间不选时，结束时间最大值小于等于当天
        },
      };
    },
    timeSelectionChangeHandle (val) {
        this.timeListSelections = val;
      },
    handleSelectionChange(val){
        this.itmeListSelections = val
        console.log(va)
    },
     itemAddOrUpdateHandle (){
       this.neiceng = true;
       //添加了个重置
       this.tableData = []
     },
   

     searchC() {
      this.$http({
        url: this.$http.adornUrl("/inspection/inspectionitem/selectunbind"),
        method: "get",
        params: this.$http.adornParams({
          'id': this.dataForm.id,
          'filter': this.dataForm.select,
          'key': this.dataForm.key
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.tableData = data.timeList;
          console.log(timeList)
        } else {
          this.tableData = [];
           this.$message.error(data.msg)
        
        }
         
      });
    },

    
     // 每页数
    sizeChangeHandle(val) {
      this.timePageSize = val;
      this.timePageIndex = 1;
      this.getTimeList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.timePageIndex = val;
      this.getTimeList();
    },
     getTimeList() {
      this.$http({
        url: this.$http.adornUrl("/inspection/time/list"),
        method: "get",
        params: this.$http.adornParams({
        'id': this.dataForm.id,
        'page': this.timePageIndex,
        'limit': this.timePageSize,
        'key': this.dataForm.key
        }),
      }).then(({ data }) => {
        console.log(data.page.list);
        if (data && data.code === 0) {
          this.timeList = data.page.list;
          this.timeTotalPage = data.page.totalCount;
        } else {
          this.timeList = [];
          this.timeTotalPage = 0;
        }
      });
    },
      timeDeleteHandle(id) {
      var ids = id
        ? [id]
        : this.timeListSelections.map((item) => {
            return item.id;
          });
       this.$confirm(`确定解绑?`, '提示', {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        this.$http({
          url: this.$http.adornUrl("/inspection/time/delete"),
          method: "post",
          data: this.$http.adornData(ids, false),
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: "操作成功",
              type: "success",
              duration: 1500,
              onClose: () => {
                this.getTimeList();
              },
            });
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    },


    init(id) {
        console.log(id)
      this.dataForm.id = id || 0;
      this.visible = true;
      this.isHttp = false;
      this.$nextTick(() => {
          this.$http({
            url: this.$http.adornUrl(
              `/inspection/time/info/${this.dataForm.id}`
            ),
            method: "get",
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.getTimeList() 
            }
          });
        
      });
    },
    // timeId一直是空问题出在返回要是id 就可以了
    
     bangdingSub(val) {
       console.log(val)
       var timeId = val
        ? [timeId]
        : this.itmeListSelections.map((item) => {
          // console.log(item.id)
            return item.id;
          });
          console.log(this.$http.adornData(timeId, false))
            this.$http({
              url: this.$http.adornUrl('/inspection/time/bind'),
              method: 'post',
              params: this.$http.adornParams({
               'id': this.dataForm.id
              }),
              data: this.$http.adornData(timeId, false)
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.neiceng = false
                    // this.$emit('refreshDataList')
                    // this.searchC()
                    this.tableData = []
                    this.getTimeList() 
                  }
                })
              } else {
                this.$message.error(data.msg)
                 
              }
            })
          }
      
      }
      
    }

</script>
<style>
.bangding_box {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.neiceng_header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
</style>

