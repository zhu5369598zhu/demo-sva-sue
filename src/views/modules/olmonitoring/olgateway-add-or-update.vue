<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="网关IP" prop="ipaddress">
<!--      <el-input v-model="dataForm.ipaddress" placeholder="网关IP"></el-input>-->
      <el-select v-model="dataForm.ipaddress" placeholder="请选择">
        <el-option
                v-for="item in this.outl"
                v-if="item!=''"
                :key="item"
                :label="item"
                :value="item">
        </el-option>
      </el-select>
        <el-button type="primary" @click="get_wg_config()" >读取</el-button>
        <el-button type="primary" @click="set_wg_config()" >设置</el-button>
    </el-form-item>
    <el-form-item label="区域ID" prop="areaid">
      <el-input v-model="dataForm.areaid" placeholder="区域ID"></el-input>
    </el-form-item>
    <el-form-item label="网关ID" prop="gwId">
      <el-input v-model="dataForm.gwId" placeholder="网关ID"></el-input>
    </el-form-item>
    <el-form-item label="无线通道" prop="rfChannel">
      <el-input v-model="dataForm.rfChannel" placeholder="无线通道"></el-input>
    </el-form-item>
    <el-form-item label="无线速率" prop="dataRate">
      <el-input v-model="dataForm.dataRate" placeholder="无线速率"></el-input>
    </el-form-item>
    <el-form-item label="发射功率" prop="txPower">
      <el-input v-model="dataForm.txPower" placeholder="发射功率"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :disabled="isHttp">确定</el-button>
    </span>
  </el-dialog>
</template>
<!--this.$parent.ipoline[0]-->
<script>
  export default {
    data () {
      return {
        isHttp: false,
        visible: false,
        dataForm: {
          idolGateway: 0,
          ipaddress: '',
          areaid: '',
          gwId: '',
          rfChannel: '',
          dataRate: '',
          txPower: ''
        },
        dataRule: {
          ipaddress: [
            { required: true, message: '网关IP不能为空', trigger: 'blur' }
          ],
          areaid: [
            { required: true, message: '区域ID不能为空', trigger: 'blur' }
          ],
          gwId: [
            { required: true, message: '网关ID不能为空', trigger: 'blur' }
          ],
          rfChannel: [
            { required: true, message: '无线通道不能为空', trigger: 'blur' }
          ],
          dataRate: [
            { required: true, message: '无线速率不能为空', trigger: 'blur' }
          ],
          txPower: [
            { required: true, message: '发射功率不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.idolGateway = id || 0
        this.visible = true
        this.isHttp = false
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.idolGateway) {
            this.$http({
              url: this.$http.adornUrl(`/olmonitoring/olgateway/info/${this.dataForm.idolGateway}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.ipaddress = data.olGateway.ipaddress
                this.dataForm.areaid = data.olGateway.areaid
                this.dataForm.gwId = data.olGateway.gwId
                this.dataForm.rfChannel = data.olGateway.rfChannel
                this.dataForm.dataRate = data.olGateway.dataRate
                this.dataForm.txPower = data.olGateway.txPower
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
              url: this.$http.adornUrl(`/olmonitoring/olgateway/${!this.dataForm.idolGateway ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'idolGateway': this.dataForm.idolGateway || undefined,
                'ipaddress': this.dataForm.ipaddress,
                'areaid': this.dataForm.areaid,
                'gwId': this.dataForm.gwId,
                'rfChannel': this.dataForm.rfChannel,
                'dataRate': this.dataForm.dataRate,
                'txPower': this.dataForm.txPower
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
      },

           get_wg_config () {
               this.$http({
                   url: this.$http.adornUrl(`/olmonitoring/olgateway/get_config/${this.dataForm.ipaddress}`),
                   method: 'get',
                   params: this.$http.adornParams()
               }).then(({data}) => {
                   if (data && data.code === 0) {
                       this.dataForm.ipaddress = data.olGateway.ipaddress
                       this.dataForm.areaid = data.olGateway.areaid
                       this.dataForm.gwId = data.olGateway.gwId
                       this.dataForm.rfChannel = data.olGateway.rfChannel
                       this.dataForm.dataRate = data.olGateway.dataRate
                       this.dataForm.txPower = data.olGateway.txPower
                   }
               })
        },
        set_wg_config () {
            this.$http({
                url: this.$http.adornUrl(`/olmonitoring/olgateway/get_config/set`),
                method: 'post',
                data: this.$http.adornData({
                    'idolGateway': this.dataForm.idolGateway || undefined,
                    'ipaddress': this.dataForm.ipaddress,
                    'areaid': this.dataForm.areaid,
                    'gwId': this.dataForm.gwId,
                    'rfChannel': this.dataForm.rfChannel,
                    'dataRate': this.dataForm.dataRate,
                    'txPower': this.dataForm.txPower
                })
            }).then(({data}) => {
                if (data && data.code === 0) {
                    if(data.result==='OK')
                    {
                        this.$message({
                            message: '设置成功',
                            type: 'success',
                            duration: 1500,
                            // onClose: () => {
                            //     this.visible = false
                            //     this.$emit('refreshDataList')
                            // }
                        })
                    }else
                    {
                        this.$message({
                            message: '设置失败',
                            type: 'warning',
                            duration: 1500,
                            // onClose: () => {
                            //     this.visible = false
                            //     this.$emit('refreshDataList')
                            // }
                        })
                    }
                }
            })
        }
    },
      computed: {
          outl:{
              get () { return this.$store.state.olwg.outl },
              set (val) { this.$store.commit('olwg/updateoutl', val) }
          }
      }
  }
</script>
