<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="" prop="outidSensor">
      <el-input v-model="dataForm.outidSensor" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="X轴值" prop="vaueX">
      <el-input v-model="dataForm.vaueX" placeholder="X轴值"></el-input>
    </el-form-item>
    <el-form-item label="Y轴值" prop="vaueY">
      <el-input v-model="dataForm.vaueY" placeholder="Y轴值"></el-input>
    </el-form-item>
    <el-form-item label="Z轴值" prop="vaueZ">
      <el-input v-model="dataForm.vaueZ" placeholder="Z轴值"></el-input>
    </el-form-item>
    <el-form-item label="温度值" prop="valueTemp">
      <el-input v-model="dataForm.valueTemp" placeholder="温度值"></el-input>
    </el-form-item>
    <el-form-item label="时间戳" prop="time">
      <el-input v-model="dataForm.time" placeholder="时间戳"></el-input>
    </el-form-item>
    <el-form-item label="异常等级" prop="error">
      <el-input v-model="dataForm.error" placeholder="异常等级"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :disabled="isHttp">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        isHttp: false,
        visible: false,
        dataForm: {
          idolSensorData: 0,
          outidSensor: '',
          vaueX: '',
          vaueY: '',
          vaueZ: '',
          valueTemp: '',
          time: '',
          error: ''
        },
        dataRule: {
          outidSensor: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          vaueX: [
            { required: true, message: 'X轴值不能为空', trigger: 'blur' }
          ],
          vaueY: [
            { required: true, message: 'Y轴值不能为空', trigger: 'blur' }
          ],
          vaueZ: [
            { required: true, message: 'Z轴值不能为空', trigger: 'blur' }
          ],
          valueTemp: [
            { required: true, message: '温度值不能为空', trigger: 'blur' }
          ],
          time: [
            { required: true, message: '时间戳不能为空', trigger: 'blur' }
          ],
          error: [
            { required: true, message: '异常等级不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.idolSensorData = id || 0
        this.visible = true
        this.isHttp = false
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.idolSensorData) {
            this.$http({
              url: this.$http.adornUrl(`/olmonitoring/olsensordata/info/${this.dataForm.idolSensorData}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.outidSensor = data.olsensordata.outidSensor
                this.dataForm.vaueX = data.olsensordata.vaueX
                this.dataForm.vaueY = data.olsensordata.vaueY
                this.dataForm.vaueZ = data.olsensordata.vaueZ
                this.dataForm.valueTemp = data.olsensordata.valueTemp
                this.dataForm.time = data.olsensordata.time
                this.dataForm.error = data.olsensordata.error
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
            this.$http({
              url: this.$http.adornUrl(`/olmonitoring/olsensordata/${!this.dataForm.idolSensorData ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'idolSensorData': this.dataForm.idolSensorData || undefined,
                'outidSensor': this.dataForm.outidSensor,
                'vaueX': this.dataForm.vaueX,
                'vaueY': this.dataForm.vaueY,
                'vaueZ': this.dataForm.vaueZ,
                'valueTemp': this.dataForm.valueTemp,
                'time': this.dataForm.time,
                'error': this.dataForm.error
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
