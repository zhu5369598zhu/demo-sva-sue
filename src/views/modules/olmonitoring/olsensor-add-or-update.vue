<template>
  <el-dialog width="30%"
    :title="!dataForm.idolSensor ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="" prop="outid" v-if="false">
      <el-input v-model="dataForm.outid" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="区域ID" prop="areaid" v-if="false">
      <el-input v-model="dataForm.areaid" placeholder="区域ID"></el-input>
    </el-form-item>
    <el-form-item label="网关ID" prop="gwId">
<!--      <el-input v-model="dataForm.gwId" placeholder="网关ID" type="number"></el-input>-->
        <el-select v-model="dataForm.gwId" placeholder="网关ID" :disabled=node_set>
            <el-option
                    v-for="item in this.wgList"
                    :key="item.Gw_ID"
                    :label="item.IpAddress"
                    :value="item.Gw_ID">
            </el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="节点ID" prop="nodeid">
      <el-input v-model="dataForm.nodeid" placeholder="节点ID" type="number" :disabled=node_set></el-input>
    </el-form-item>
    <el-form-item label="无线通道" prop="rfChannel">
      <el-input v-model="dataForm.rfChannel" placeholder="无线通道" type="number" :disabled=node_set></el-input>
    </el-form-item>
    <el-form-item label="无线速率" prop="dataRate">
<!--      <el-input v-model="dataForm.dataRate" placeholder="无线速率"></el-input>-->
        <el-select v-model="dataForm.dataRate" placeholder="无线速率" :disabled=node_set>
            <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="发射功率" prop="txPower">
      <el-input v-model="dataForm.txPower" placeholder="发射功率" type="number" :disabled=node_set></el-input>
    </el-form-item>
    <el-form-item label="串口速率" prop="serilBaudrate">
<!--      <el-input v-model="dataForm.serilBaudrate" placeholder="串口速率"></el-input>-->
        <el-select v-model="dataForm.serilBaudrate" placeholder="串口速率" :disabled=node_set>
            <el-option
                    v-for="item in options_seril"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
        </el-select>
        <el-button type="primary" @click="Set_NodeSubmit()" style="float:right" :disabled=node_set>设置</el-button>
        <el-button type="primary" @click="open_set()" style=" margin-right: 13px;float: right">开启设置</el-button>
    </el-form-item>
        <el-form-item label="节点名" prop="nodename">
            <!--      <el-input v-model="dataForm.nodename" placeholder="节点名"></el-input>-->
            <el-select v-model="dataForm.nodename" filterable placeholder="节点名">
                <el-option
                        v-for="item in this.node_name"
                        :key="item.value"
                        :label="item.value"
                        :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
    <el-form-item label="X轴上阈值" prop="thresholdXU">
      <el-input v-model="dataForm.thresholdXU" placeholder="X轴上限阈值"></el-input>
    </el-form-item>
    <el-form-item label="X轴下阈值" prop="thresholdXD">
      <el-input v-model="dataForm.thresholdXD" placeholder="X轴下限阈值"></el-input>
    </el-form-item>
    <el-form-item label="温度阈值" prop="thresholdTemp">
      <el-input v-model="dataForm.thresholdTemp" placeholder="温度阈值"></el-input>
    </el-form-item>
     <el-form-item label="温度补偿系数" prop="tempco">
      <el-input v-model="dataForm.tempco" placeholder="温度补偿系数"></el-input>
    </el-form-item>
     <el-form-item label="振动补偿系数" prop="vibco">
      <el-input v-model="dataForm.vibco" placeholder="振动补偿系数"></el-input>
    </el-form-item>
    </el-form>
      <span slot="footer"  class="dialog-footer">
          <el-button type="primary" @click="Set_Nodethreshold()">设置</el-button>
<!--      <el-button @click="visible = false">取消</el-button>-->
<!--      <el-button type="primary" @click="dataFormSubmit()" :disabled="isHttp">确定</el-button>-->
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
          idolSensor: 0,
          outid: 1,
          areaid: 1,
          gwId: '',
          nodeid: '',
          nodename: '',
          rfChannel: 1,
          dataRate: 3,
          txPower: 127,
          serilBaudrate: 6,
          thresholdXU: 0,
          thresholdXD: 0,
          thresholdTemp: 0,
          vibco: 0,
          tempco: 0,
          thresholdTemp: 0
        },
          time_x:[],
          time_y:[],
          time_z:[],
          time_temp:[],
          acceleration_x:[],
          acceleration_y:[],
          acceleration_z:[],
          acceleration_temp:[],
          hasdata_x:false,
          hasdata_y:false,
          hasdata_z:false,
          hasdata_temp:false,
          node_set:true,
          last_wg:'',
          last_node:'',
        dataRule: {
          // outid: [
          //   { required: true, message: '不能为空', trigger: 'blur' }
          // ],
          // areaid: [
          //   { required: true, message: '区域ID不能为空', trigger: 'blur' }
          // ],
          gwId: [
            // { required: true, message: '网关ID不能为空', trigger: 'blur' }
              { maxvalue: 10, minvalue:1,ms:'网关ID不能为空',validator: this.checkvalue, trigger: 'blur' }
          ],
          nodeid: [
              { maxvalue: 64, minvalue:1,ms:'节点ID不能为空',validator: this.checkvalue, trigger: 'blur' }
          ],
          nodename: [
            { required: true, message: '节点名不能为空', trigger: 'blur' }
          ],
          rfChannel: [
              { maxvalue: 39, minvalue:0,ms:'无线通道不能为空',validator: this.checkvalue, trigger: 'blur' }
          ],
          dataRate: [
            // { required: true, message: '无线速率不能为空', trigger: 'blur' }
          ],
          txPower: [
            // { required: true, message: '发射功率不能为空', trigger: 'blur' }
              { maxvalue: 127, minvalue:1,ms:'发射功率不能为空',validator: this.checkvalue, trigger: 'blur' }
          ],
          serilBaudrate: [
            { required: true, message: '串口速率不能为空', trigger: 'blur' }
          ],
          thresholdXU: [
            { required: true, message: 'X轴上限阈值不能为空', trigger: 'blur' }
          ],
          thresholdXD: [
            { required: true, message: 'X轴下限阈值不能为空', trigger: 'blur' }
          ],
          thresholdTemp: [
            { required: true, message: '温度阈值不能为空', trigger: 'blur' }
          ]
        },
         node_name:[
              { value:"1号熄焦泵前轴"},
              { value:"1号熄焦泵后轴" },
              { value:"2号熄焦泵前轴" },
              { value:"2号熄焦泵后轴"},
              { value:"1号烟气脱硫引风机前轴"},
              { value:"1号烟气脱硫引风机后轴"},
              { value:"2号烟气脱硫引风机前轴"},
              { value:"2号烟气脱硫引风机后轴"},
              { value:"1号脱硫液循环泵前轴" },
              { value:"1号脱硫液循环泵后轴"},
              { value:"2号脱硫液循环泵前轴"},
              { value:"2号脱硫液循环泵后轴"},
              { value:"3号脱硫液循环泵前轴"},
              { value:"3号脱硫液循环泵后轴"},
              { value:"1号精煤破碎机前轴"},
              { value:"1号精煤破碎机后轴"},
              { value:"2号精煤破碎机前轴"},
              { value:"2号精煤破碎机后轴"},
              { value:"1号除尘风机前轴"},
              { value:"1号除尘风机后轴"},
              { value:"2号除尘风机前轴" },
              { value:"2号除尘风机后轴" },
              { value:"1号循环水泵前轴"},
              { value:"1号循环水泵后轴" },
              { value:"2号循环水泵前轴" },
              { value:"2号循环水泵后轴"},
              { value:"3号循环水泵前轴"},
              { value:"3号循环水泵后轴"},
              { value:"1号低温水泵前轴"},
              { value:"1号低温水泵后轴"},
              { value:"2号低温水泵前轴" },
              { value:"2号低温水泵后轴"},
              { value:"1号超细破前轴"},
              { value:"1号超细破后轴"},
              { value:"2号超细破前轴"},
              { value:"1号超细破后轴"},
              { value:"1号煤气鼓风机前轴"},
              { value:"1号煤气鼓风机后轴"},
              { value:"2号煤气鼓风机前轴"},
              { value:"2号煤气鼓风机后轴"},
              { value:"3号煤气鼓风机前轴"},
              { value:"3号煤气鼓风机后轴"},
              { value:"1号高压氨水泵前轴" },
              { value:"1号高压氨水泵后轴" },
              { value:"1号循环氨水泵前轴"},
              { value:"1号循环氨水泵后轴" },
              { value:"2号循环氨水泵前轴" },
              { value:"2号循环氨水泵后轴"},
              { value:"2号高压氨水泵前轴"},
              { value:"2号高压氨水泵后轴"},
          ],
          options: [{
              value: 0,
              label: '115200 bps'
          }, {
              value: 1,
              label: '250k bps'
          }, {
              value: 2,
              label: '500k bps'
          }, {
              value: 3,
              label: '1M bps'
          }],
          options_seril: [{
              value: 1,
              label: '1200'
          }, {
              value: 2,
              label: '2400'
          }, {
              value: 3,
              label: '4800'
          }, {
              value: 4,
              label: '9600'
          }, {
              value: 5,
              label: '38400'
          }, {
              value: 6,
              label: '115200'
          }],
      }
    },
    components: {

    },
      created () {
      console.log("初始页面数据")

      },
    methods: {
      init (id) {
        this.dataForm.idolSensor = id || 0
        this.visible = true
        this.isHttp = false
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.idolSensor) {
            this.$http({
              url: this.$http.adornUrl(`/olmonitoring/olsensor/info/${this.dataForm.idolSensor}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.outid = data.olSensor.outid
                this.dataForm.areaid =data.olSensor.areaid
                this.dataForm.gwId = data.olSensor.gwId
                this.dataForm.nodeid = data.olSensor.nodeid
                this.dataForm.nodename = data.olSensor.nodename
                this.dataForm.rfChannel = data.olSensor.rfChannel
                this.dataForm.dataRate = data.olSensor.dataRate
                this.dataForm.txPower = data.olSensor.txPower
                this.dataForm.serilBaudrate = data.olSensor.serilBaudrate
                this.dataForm.thresholdXU = data.olSensor.thresholdXU
                this.dataForm.thresholdXD = data.olSensor.thresholdXD
                this.dataForm.tempco = data.olSensor.tempco
                this.dataForm.vibco = data.olSensor.vibco
                this.dataForm.thresholdTemp = data.olSensor.thresholdTemp
                this.last_wg=data.olSensor.gwId
                this.last_node=data.olSensor.nodeid
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
              url: this.$http.adornUrl(`/olmonitoring/olsensor/${!this.dataForm.idolSensor ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'idolSensor': this.dataForm.idolSensor || undefined,
                'outid': this.dataForm.outid,
                'areaid': this.dataForm.areaid,
                'gwId': this.dataForm.gwId,
                'nodeid': this.dataForm.nodeid,
                'nodename': this.dataForm.nodename,
                'rfChannel': this.dataForm.rfChannel,
                'dataRate': this.dataForm.dataRate,
                'txPower': this.dataForm.txPower,
                'serilBaudrate': this.dataForm.serilBaudrate,
                'thresholdXU': this.dataForm.thresholdXU,
                'thresholdXD': this.dataForm.thresholdXD,
                'tempco': this.dataForm.tempco,
                'vibco': this.dataForm.vibco,
                'thresholdTemp': this.dataForm.thresholdTemp
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
        Set_NodeSubmit () {
            this.$http({
                url: this.$http.adornUrl(`/olmonitoring/olgateway/get_config/setsensor`),
                method: 'get',
                params: this.$http.adornParams({
                    'last_wg':this.last_wg,
                    'last_node':this.last_node,
                    'GW_ID': this.dataForm.gwId,
                    'Node_ID': this.dataForm.nodeid,
                    'rf_channel': this.dataForm.rfChannel,
                    'data_rate': this.dataForm.dataRate,
                    'tx_power': this.dataForm.txPower,
                    'serial_baud': this.dataForm.serilBaudrate,
                    'node_name':this.dataForm.nodename
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
                        this.last_wg=this.dataForm.gwId;
                        this.last_node=this.dataForm.nodeid;
                        this.node_set=true;
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
        },
          Set_Nodethreshold () {
            const loading = this.$loading({
                lock: true,
                text: '正在上传数据',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });

               this.$http({
                url: this.$http.adornUrl(`/olmonitoring/olgateway/get_config/setsensor_threshold`),
                method: 'get',
                timeout:1000*60*60,
                params: this.$http.adornParams({
                    'wg_id': this.dataForm.gwId,
                    'node_id':this.dataForm.nodeid,
                    'x_u': this.dataForm.thresholdXU,
                    'x_d': this.dataForm.thresholdXD,
                    'tempco': this.dataForm.tempco,
                    'vibco': this.dataForm.vibco,
                    'temp':this.dataForm.thresholdTemp
                })
            }).then(({data}) => {
                if (data && data.code === 0) {
                    if(data.result==='OK')
                    {
                        this.$message({
                            message: '设置成功',
                            type: 'success',
                            duration: 1500,
                            onClose: () => {
                                this.visible = false
                                this.$emit('refreshDataList')
                            }
                        })
                        this.last_wg=this.dataForm.gwId;
                        this.last_node=this.dataForm.nodeid;
                        this.node_set=true;
                    }else
                    {
                        this.$message({
                            message: '设置失败',
                            type: 'warning',
                            duration: 1500,
                            onClose: () => {
                                this.visible = false
                                this.$emit('refreshDataList')
                            }
                        })
                    }
                    loading.close();
                }
            })


        },
        checkvalue(rule,value,callback)
        {
            if(!value)
            {
                return callback(new Error(rule.ms));
            }
            // if (!Number.isInteger(value)) {
            //     callback(new Error('请输入数字值'));
            // }else
            // {
            if(rule.maxvalue<value||rule.minvalue>value)
            {
                callback(new Error('值范围'+rule.minvalue+'~'+rule.maxvalue));
            }else
            {
                callback();
            }
            // }
        },
        get_sensor_config () {
            this.$http({
                url: this.$http.adornUrl(`/olmonitoring/olgateway/get_config/sensor`),
                method: 'post',
                data: this.$http.adornData({
                    'idolSensor': this.dataForm.idolSensor || undefined,
                    'outid': 1,//this.dataForm.outid,
                    'areaid':1,// this.dataForm.areaid,
                    'gwId': this.dataForm.gwId,
                    'nodeid': this.dataForm.nodeid,
                    'nodename': this.dataForm.nodename,
                    'rfChannel': this.dataForm.rfChannel,
                    'dataRate': this.dataForm.dataRate,
                    'txPower': this.dataForm.txPower,
                    'serilBaudrate': this.dataForm.serilBaudrate,
                    'thresholdXU': this.dataForm.thresholdXU,
                    'thresholdXD': this.dataForm.thresholdXD,
                    'thresholdYU': this.dataForm.thresholdYU,
                    'thresholdYD': this.dataForm.thresholdYD,
                    'thresholdZU': this.dataForm.thresholdZU,
                    'thresholdZD': this.dataForm.thresholdZD,
                    'thresholdTemp': this.dataForm.thresholdTemp
                })
            }).then(({data}) => {
                if (data && data.code === 0) {
                    if(data.result==='OK')
                    {
                        this.node_set=false;
                        this.$message({
                            type: 'info',
                            message: '开启成功'
                        });
                    }else
                    {
                        this.node_set=true;
                        this.$message({
                            type: 'info',
                            message: '开启失败'
                        });
                    }
                }
            })
        },
        open_set() {
            const h = this.$createElement;
            this.$msgbox({
                title: '注意',
                message: h('p', null, [
                    h('span',  { style: 'color:royalblue;font-size : 10pt' }, '请确保此节点已进入 设置 模式,此操作将对节点模式进行验证')
                ]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        // instance.confirmButtonLoading = true;
                        // instance.confirmButtonText = '验证中...';
                        done();
                        this.get_sensor_config();
                        // instance.confirmButtonLoading = false;

                    } else {
                        done();
                    }
                }
            })
            //     .then(action => {
            //     if( this.node_set==false) {
            //         this.$message({
            //             type: 'info',
            //             message: '开启成功'
            //         });
            //     }else if(this.node_set==true)
            //     {
            //         this.$message({
            //             type: 'info',
            //             message: '开启失败'
            //         });
            //     }
            // });
        }
    },
      computed: {
          wgList:{
              get () { return this.$store.state.olwg.wgList },
              set (val) { this.$store.commit('olwg/updatewgList', val) }
          }
      }
  }
</script>
<style>
        .dialog-footer {
        margin-right: 0px;
    }

</style>