<template>
  <el-dialog width="80%"
    :title="'查看【' + dataForm.nodename+ '】'"
    :close-on-click-modal="false"
    :visible.sync="visible">
      <el-row>
          <el-col :span="18">
              <el-row>
                  <div class="charline_style">
                      <Chart v-show="hasdata_z===true" id="data_value_z" ref="data_value_z" align="center" title_text="震动"></Chart>
                      <div class="no-data" align="center" v-show="hasdata_z===false">暂无数据</div>
                  </div>
              </el-row>
              <el-row>
                  <div class="charline_style">
                      <Chart v-show="hasdata_temp===true" id="temp" ref="temp" align="center" title_text="温度"></Chart>
                      <div class="no-data" align="center" v-show="hasdata_temp===false">暂无数据</div>
                  </div>
              </el-row>
          </el-col>
          <el-col :span="6">
              <el-row>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
    <el-form-item label="" prop="outid" v-if="false">
      <el-input v-model="dataForm.outid" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="区域ID" prop="areaid" v-if="false">
      <el-input v-model="dataForm.areaid" placeholder="区域ID" :disabled="true"></el-input>
    </el-form-item>
    <el-form-item label="网关ID" prop="gwId">
<!--      <el-input v-model="dataForm.gwId" placeholder="网关ID" type="number"></el-input>-->
        <el-select v-model="dataForm.gwId" placeholder="网关ID" :disabled="true">
            <el-option
                    v-for="item in this.wgList"
                    :key="item.Gw_ID"
                    :label="item.IpAddress"
                    :value="item.Gw_ID">
            </el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="节点ID" prop="nodeid">
      <el-input v-model="dataForm.nodeid" placeholder="节点ID" type="number" :disabled="true"></el-input>
    </el-form-item>
    <el-form-item label="节点名" prop="nodename">
<!--      <el-input v-model="dataForm.nodename" placeholder="节点名"></el-input>-->
        <el-select v-model="dataForm.nodename" filterable placeholder="节点名" :disabled="true">
            <el-option
                    v-for="item in this.node_name"
                    :key="item.value"
                    :label="item.value"
                    :value="item.value">
            </el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="无线通道" prop="rfChannel">
      <el-input v-model="dataForm.rfChannel" placeholder="无线通道" type="number" :disabled="true"></el-input>
    </el-form-item>
    <el-form-item label="无线速率" prop="dataRate">
<!--      <el-input v-model="dataForm.dataRate" placeholder="无线速率"></el-input>-->
        <el-select v-model="dataForm.dataRate" placeholder="无线速率" :disabled="true">
            <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="发射功率" prop="txPower">
      <el-input v-model="dataForm.txPower" placeholder="发射功率" type="number" :disabled="true"></el-input>
    </el-form-item>
    <el-form-item label="串口速率" prop="serilBaudrate">
<!--      <el-input v-model="dataForm.serilBaudrate" placeholder="串口速率"></el-input>-->
        <el-select v-model="dataForm.serilBaudrate" placeholder="串口速率" :disabled="true">
            <el-option
                    v-for="item in options_seril"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
        </el-select>
    </el-form-item>

    <el-form-item label="X轴上阈值" prop="thresholdXU">
      <el-input v-model="dataForm.thresholdXU" placeholder="轴上限阈值" :disabled="true"></el-input>
    </el-form-item>
    <el-form-item label="X轴下阈值" prop="thresholdXD">

      <el-input v-model="dataForm.thresholdXD" placeholder="轴下限阈值" :disabled="true"></el-input>
    </el-form-item>
    <el-form-item label="温度阈值" prop="thresholdTemp">
      <el-input v-model="dataForm.thresholdTemp" placeholder="温度阈值" :disabled="true"></el-input>
    </el-form-item>
    </el-form>
              </el-row>
              <el-row>
                  <el-row>
                  <span>
                  按日期显示
                      </span>
                      <el-date-picker
                              v-model="data_value"
                              type="datetimerange"
                              :picker-options="pickerOptions"
                              range-separator="至"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期"
                              align="center">
                      </el-date-picker>
                  </el-row>
                  <!-- <el-row >
                      <el-button type="primary" @click="getdata()" style="float:right">查询</el-button>
                  </el-row> -->
                  <el-row>
                      <el-col :span="12">
                      <el-button type="primary" @click="exportExcelHandle()" style="float:right">导出异常报告</el-button>
                          </el-col>
                      <el-col :span="12">
                      <el-button type="primary" @click="getdata()" style="float:right">查询</el-button>
                         </el-col>   
                  </el-row>
                  <el-row>
                      <!-- <el-col>
                      <el-button type="primary" @click="exportExcelHandle()" style="float:right">导出异常报告</el-button>
                          </el-col> -->
                      
                          <!-- <el-button type="primary" @click="booking_sensor()" style="float:right">查找传感器</el-button> -->
                
                  </el-row>
              </el-row>
          </el-col>
      </el-row>
<!--      <span slot="footer"  class="dialog-footer">-->
<!--      <el-button @click="visible = false">取消</el-button>-->
<!--    </span>-->
  </el-dialog>
</template>

<script>
    import Chart from '@/components/charts/line-runtime'
    import { formatDate } from '@/utils'
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
          thresholdxU: 0,
          thresholdxD: 0,
          thresholdTemp: 0
        },
          time_z:[],
          time_temp:[],
          acceleration_z:[],
          acceleration_temp:[],
          hasdata_z:false,
          hasdata_temp:false,

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
        
          thresholdxD: [
            { required: true, message: 'Z轴下限阈值不能为空', trigger: 'blur' }
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
        //   pickerOptions: {
        //       shortcuts: [{
        //           text: '最近一天',
        //           onClick(picker) {
        //               const end = new Date();
        //               const start = new Date();
        //               start.setTime(start.getTime() - 3600 * 1000 * 24);
        //               picker.$emit('pick', [start, end]);
        //           }
        //       }, {
        //           text: '最近一个月',
        //           onClick(picker) {
        //               const end = new Date();
        //               const start = new Date();
        //               start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        //               picker.$emit('pick', [start, end]);
        //           }
        //       }, {
        //           text: '最近三个月',
        //           onClick(picker) {
        //               const end = new Date();
        //               const start = new Date();
        //               start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
        //               picker.$emit('pick', [start, end]);
        //           }
        //       }]
        //   },
          data_value: null
      }
    },
    components: {
        Chart
    },
      created () {
      console.log("初始页面数据")

      },
    methods: {
        get_node(nodename)
        {
            // console.log('执行get_node函数')
            // this.$refs['dataForm'].resetFields()
            this.isHttp = false
            this.$nextTick(() => {
                if (nodename) {
                    this.$http({
                        url: this.$http.adornUrl(`/olmonitoring/olsensor/info_byname/${nodename}`),
                        method: 'get',
                        params: this.$http.adornParams()
                    }).then(({data}) => {
                        if (data && data.code === 0) {

                            if (data.olSensor == null) {
                                this.$message({
                                    message: '当前节点不存在',
                                    type: 'warning',
                                    duration: 2000,
                                })
                                this.visible = false
                            } else {
                                this.dataForm.idolSensor = data.olSensor.idolSensor
                                this.dataForm.outid = data.olSensor.outid
                                this.dataForm.areaid = data.olSensor.areaid
                                this.dataForm.gwId = data.olSensor.gwId
                                this.dataForm.nodeid = data.olSensor.nodeid
                                this.dataForm.nodename = data.olSensor.nodename
                                this.dataForm.rfChannel = data.olSensor.rfChannel
                                this.dataForm.dataRate = data.olSensor.dataRate
                                this.dataForm.txPower = data.olSensor.txPower
                                this.dataForm.serilBaudrate = data.olSensor.serilBaudrate
                                this.dataForm.thresholdXU = data.olSensor.thresholdXU
                                this.dataForm.thresholdXD = data.olSensor.thresholdXD
                                this.dataForm.thresholdTemp = data.olSensor.thresholdTemp
                                this.$http({
                                    url: this.$http.adornUrl(`/olmonitoring/olsensordata/info_bydataname/${nodename}`),
                                    method: 'get',
                                    params: this.$http.adornParams()
                                }).then(({data}) => {
                                    if (data && data.code === 0) {
                                        this.time_z=[];
                                        this.time_temp=[];
                                        this.acceleration_z=[];
                                        this.acceleration_temp=[];
                                        if (data.olSensorData.length > 0) {
                                            this.hasdata_z = true;
                                            this.hasdata_temp = true;
                                            for (let item of data.olSensorData) {
                                                this.time_z.push(item.time)
                                                this.time_temp.push(item.time)
                                                this.acceleration_z.push(item.vaue)
                                                this.acceleration_temp.push(item.valueTemp)
                                            }

                                            this.visible = true
                                            this.init();
                                        } else {
                                            this.hasdata_z = false;
                                            this.hasdata_temp = false;
                                        }
                                    }
                                })
                            }
                        }
                    })
                }
            })
        },
        exportToExcel (list) {
            this.downloadLoading = true
            require.ensure([], () => {
                const { export_json_to_excel } = require('@/vendor/Export2Excel')
                const tHeader = ['加速度','温度','时间','低电压告警','温度告警','上限告警','下限告警']
                const filterVal = ['vaue','valueTemp','time','lowPowerWarning','tempWarning','xwarningU','xwarningD']
                const data =this.formatJson(filterVal, list)
                console.log('转换后的数据:'+data)
                let filename = formatDate(new Date(), 'yyyyMMddhhmmss')
                export_json_to_excel({
                    header: tHeader,
                    data,
                    filename: this.dataForm.nodename+" "+filename,
                    autoWidth: true,
                    bookType: 'xlsx'
                })
                this.downloadLoading = false
            })
        },
        // 获取数据列表
        exportExcelHandle () {
            this.$http({
                url: this.$http.adornUrl(`/olmonitoring/olsensordata/get_warning/${this.dataForm.idolSensor}`),
                method: 'get',
                params: this.$http.adornParams()
            }).then(({data}) => {
                console.log('data %o', data)
                if (data && data.code === 0) {
                    this.exportToExcel(data.olSensorData)
                } else {
                    this.$message.error(data.msg)
                }
            })
        },
        booking_sensor () {
            const loading = this.$loading({
                lock: true,
                text: '正在启动寻找，请耐心等待',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });

            this.$http({
                url: this.$http.adornUrl(`/olmonitoring/olgateway/booking_sensor/${this.dataForm.idolSensor}`),
                method: 'get',
                timeout:1000*60*60,
                params: this.$http.adornParams()
            }).then(({data}) => {
                if (data && data.code === 0) {
                    if(data.result==='OK')
                    {
                        this.$message({
                            message: '开启成功',
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
                            message: '开启失败',
                            type: 'warning',
                            duration: 1500,
                            // onClose: () => {
                            //     this.visible = false
                            //     this.$emit('refreshDataList')
                            // }
                        })
                    }
                    loading.close();
                }

            })
        },
      init (nodename) {
          this.$nextTick(() => {
              this.drawChart()
          })
      },
        drawChart () {
           
            if(this.hasdata_z===true)
            {
                this.$nextTick(() => {
                    this.$refs.data_value_z.initChart('data_value_z',this.time_z,this.acceleration_z)
                })
            }
            if(this.hasdata_temp===true)
            {
                this.$nextTick(() => {
                    this.$refs.temp.initChart('temp',this.time_temp,this.acceleration_temp)
                })
            }

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
        getdata()
        {
        
            if(this.data_value!=null)
            {
                 // console.log(this.dateFormat(this.data_value[0]));
                let time_start=this.dateFormat(this.data_value[0])
                let time_end=this.dateFormat(this.data_value[1])
                this.isHttp = true
                this.$http({
                    url: this.$http.adornUrl(`/olmonitoring/olsensordata/get_data`),
                    method: 'post',
                    data: this.$http.adornData({
                        time_start,
                        time_end
                    })
                }).then(({data}) => {
                    console.log("数据",data)
                    if (data && data.code === 0) {
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            duration: 1500,
                        })

                        this.time_z=[];
                        this.time_temp=[];
                        this.acceleration_z=[];
                        this.acceleration_temp=[];
                        if (data.olSensorData.length > 0) {
                            this.hasdata_z = true;
                            this.hasdata_temp = true;
                            for (let item of data.olSensorData) {
                                this.time_z.push(item.time)
                                this.time_temp.push(item.time)
                                this.acceleration_z.push(item.vaue)
                                this.acceleration_temp.push(item.valueTemp)
                            }
                            // console.log("得到数据:"+data.olSensorData.length)
                            // this.visible = true
  
                            this.$refs.data_value_z.update_option(this.time_z,this.acceleration_z);
                            this.$refs.temp.update_option(this.time_temp,this.acceleration_temp);
                        } else {
                            this.hasdata_x = false;
                            this.hasdata_temp = false;
                        }
                    } else {
                        this.$message.error(data.msg)
                    }
                })
            }else
            {
                console.log("无日期数据");
            }
        },
        dateFormat:function(date) {
            let year=date.getFullYear();
            /* 在日期格式中，月份是从0开始的，因此要加0
             * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
             * */
            let month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
            let day=date.getDate()<10 ? "0"+date.getDate() : date.getDate();
            let hours=date.getHours()<10 ? "0"+date.getHours() : date.getHours();
            let minutes=date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
            let seconds=date.getSeconds()<10 ? "0"+date.getSeconds() : date.getSeconds();
            // 拼接
            return year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds;
        },
        formatJson (filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => v[j]))
            // return filterVal.map(j=>jsonData[j])
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
    .charline_style
    {
        width: 100%;
        height: 200px;
    }
    .charts {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }
    .chart-up {
        width: 100%;
        height: 15%;
        min-height: 56px;
    }
    /* .chart-header {
        /*position: relative;*/
        /*padding-bottom:14px;*/
        /*border-bottom:1px solid #E1E1E1;*/
        /*padding: 14px;*/
        /*margin-bottom: 3px;*/
        /*min-width: 100px;*/
        /*display: flex;*/
        /*justify-content: space-between;*/

    .el-row {
        margin-bottom: 20px;
    }
    .el-col {
        border-radius: 4px;
    }
    .char-title {
        font-family: MicrosoftYaHei;
        font-size: 10px;
        color: #333333;
        letter-spacing: 0.14px;
        text-align: center;
        padding-bottom:14px;
        border-bottom:2px solid #2097F2
    }
  
    #data_value_z{
        height: calc(100% + 150px);
        width: 100%;
    }
    #temp{
        margin-top: 130px;
        height: calc(100% + 150px);
        width: 100%;
    }

    .dialog-footer {
        margin-right: 50px;
    }

</style>