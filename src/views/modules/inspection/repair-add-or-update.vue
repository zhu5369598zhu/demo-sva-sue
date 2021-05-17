<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"

    :close-on-click-modal="false"
    v-dialog-drag
    append-to-body="true"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="检修类型" prop="type">
      <el-input size="mini" v-model="dataForm.type" placeholder="检修类型"></el-input>
    </el-form-item>
   <el-form-item label="周期"  prop="periodType">
      <el-select v-model="dataForm.periodType"  placeholder="周期">
        <el-option
          v-for="item in periodTypeList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="结束时间" prop="endTime">
      <el-date-picker
      v-model="dataForm.endTime"
      type="date" value-format="yyyy-MM-dd"
      placeholder="选择日期">
    </el-date-picker>
      </el-form-item>
    <el-form-item label="检修时长" prop="burning">
      <el-input size="mini" v-model="dataForm.burning" placeholder="检修时长"></el-input>
    </el-form-item>
       <el-form-item label="检修内容" prop="content">
      <el-input size="mini" v-model="dataForm.content" placeholder="检修内容"></el-input>
      </el-form-item>
     <el-form-item label="检修负责人" prop="repairName">
      <el-input size="mini" v-model="dataForm.repairName" placeholder="检修负责人"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :disabled="isHttp">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { treeDataTranslate } from '@/utils'
  export default {
    data () {
      return {
        isHttp: false,
        visible: false,
        isModify: true,
        isShowDeptTree: false,
        dataList: [],
        periodTypeList: [{'id': 1, 'name': '1'}, {'id': 2, 'name': '3'}, {'id': 3, 'name': '7'},{'id': 4, 'name': '15'}, {'id': 5, 'name': '30'}, {'id': 6, 'name': '60'}],
        deptListTreeProps: {
          label: 'name',
          children: 'children'
        },
        dataForm: {
          id: 0,
          type: '',
          content: '',
          repairName: '',
          burning: '',
          periodType: '',
          endTime: '',
          deviceId: 0
        },
        
        dataRule: {
          type: [
            { required: true, message: '检修类型不能为空', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '检修内容不能为空', trigger: 'blur' }
          ],
          burning: [
            { required: true, message: '检修时长不能为空', trigger: 'change' }
          ],
          periodType: [
            { required: true, message: '检修周期不能为空', trigger: 'change' }
          ],
          repairName: [
            { required: true, message: '检修负责人不能为空', trigger: 'blur'}
          ],
          endTime: [
            { required: true, message: '结束时间不能为空', trigger: 'blur'}
          ]
        },
        startDatePicker: this.beginDate()
      }
    },
    // mounted () {
    //   this.getDataList()      // 部门查询
    // },
    
    methods: {
      handleStartTimeChange (val) {
        this.dataForm.repairtime = val
      },
      beginDate () {
        return {
          disabledDate (time) {
            return time.getTime() > Date.now()//  开始时间不选时，结束时间最大值小于等于当天
          }
        }
      },
    
      init (id,deviceId,isModify) {
        this.isModify = isModify;
        this.dataForm.id = id || 0
        this.dataForm.deviceId = deviceId
        this.visible = true
        this.isHttp = false
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/inspection/repair/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.type = data.repair.type
                this.dataForm.content = data.repair.content
                this.dataForm.repairName = data.repair.repairName
                this.dataForm.deviceId = data.repair.deviceId
                this.dataForm.endTime = data.repair.endTime
                this.dataForm.periodType = data.repair.periodType
                this.dataForm.burning = data.repair.burning
                // this.deptListTreeSetCurrentNode()
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.isHttp = true
            console.log(this.dataForm.id)
            this.$http({
              url: this.$http.adornUrl(`/inspection/repair/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'type': this.dataForm.type,
                'content': this.dataForm.content,
                'repairName': this.dataForm.repairName,
                'periodType': this.dataForm.periodType,
                'burning': this.dataForm.burning,
                'endTime': this.dataForm.endTime,
                'deviceId': this.dataForm.deviceId
              })
            }).then(({data}) => {
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
            })
          }
        })
      }
    }
  }
</script>
