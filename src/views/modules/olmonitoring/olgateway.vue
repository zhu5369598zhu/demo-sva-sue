<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="参数名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('olmonitoring:olgateway:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('olmonitoring:olgateway:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="idolGateway"
        header-align="center"
        align="center"
        label="">
      </el-table-column>
      <el-table-column
        prop="ipaddress"
        header-align="center"
        align="center"
        label="网关IP">
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
              prop="ifonline"
              header-align="center"
              align="center"
              label="状态">
          <template slot-scope="scope">
<!--            <span>{{scope.row.items[1]}}</span>-->
<!--            {{items[0].lable}}-->
          <el-tag
                  v-for="ip in items"
                  v-if="ip.address==scope.row.ipaddress"
                  v-model="items"
                  :key="ip.lable"
                 :type="ip.type"
                  effect="dark"
                  lable="ip.label">
            {{ ip.lable}}
          </el-tag>
          </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.idolGateway)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.idolGateway)">删除</el-button>
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
      <audio ref="audio"  :src="getaudio1" controls="controls" v-show=true></audio>

      <el-collapse  accordion>
          <el-collapse-item title="设置预警声音">
                    <el-upload
                            ref="upload1"
                            :action="uploadUrl"
                            :on-success="handleSuccess1"
                            :on-error="handleError1"
                            :on-change="handleChange1"
                            :on-remove="handleRemove1"
                            :auto-upload="false"
                            :limit="1"
                            :data="audioForm1"
                            :on-exceed="handleExceed1"
                            :file-list="fileList1"
                            accept=".mp3"
                            style="width:400px;">
                        <el-button slot="trigger" size="mini">选取文件</el-button>
                        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload1()">上传到服务器</el-button>
                        <div slot="tip" class="el-upload__tip">警告提示音（只能上传.mp3文件，且不超过500kb）</div>
                    </el-upload>
              <el-upload
                      ref="upload2"
                      :action="uploadUrl"
                      :on-success="handleSuccess2"
                      :on-error="handleError2"
                      :on-change="handleChange2"
                      :on-remove="handleRemove2"
                      :auto-upload="false"
                      :limit="1"
                      :data="audioForm2"
                      :on-exceed="handleExceed2"
                      :file-list="fileList2"
                      accept=".mp3"
                      style="width:400px;">
                  <el-button slot="trigger" size="mini">选取文件</el-button>
                  <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload2()">上传到服务器</el-button>
                  <div slot="tip" class="el-upload__tip">错误提示音（只能上传.mp3文件，且不超过500kb）</div>
              </el-upload>
              <el-upload
                      ref="upload3"
                      :action="uploadUrl"
                      :on-success="handleSuccess3"
                      :on-error="handleError3"
                      :on-change="handleChange3"
                      :on-remove="handleRemove3"
                      :auto-upload="false"
                      :limit="1"
                      :data="audioForm3"
                      :on-exceed="handleExceed3"
                      :file-list="fileList3"
                      accept=".mp3"
                      style="width:400px;">
                  <el-button slot="trigger" size="mini">选取文件</el-button>
                  <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload3()">上传到服务器</el-button>
                  <div slot="tip" class="el-upload__tip">紧急提示音（只能上传.mp3文件，且不超过500kb）</div>
              </el-upload>
          </el-collapse-item>
      </el-collapse>
  </div>
</template>

<script>
  import AddOrUpdate from './olgateway-add-or-update'
  export default {
    data () {
      return {
        dataForm: {
          key: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        set_warning_audio:true,
        items_copy: [
          // { type: 'success',address:'192.168.0.123',lable:'在线'},
          // { type: 'danger',address:'192.168.0.333' ,lable:'离线'},
          // { type: 'danger',address:'192.168.0.31'  ,lable:'离线'}
        ],
          uploadUrl: this.$http.adornUrl(`/olmonitoring/olwarningaudio/upload?token=${this.$cookie.get('token')}`),
          fileList1: [],
          fileList2: [],
          fileList3: [],
          audioForm1: {
              audioId: '1'
          },
          audioForm2: {
              audioId: '2'
          },
          audioForm3: {
              audioId: '3'
          },
          getaudio1: this.$http.adornUrl(`/olmonitoring/olwarningaudio/warning1.mp3`)
        //   ipoline:[],
        //   outline:[]
      }
    },
      created() { // 页面创建生命周期函数
          // this.initWebSocket()
      },
      destroyed: function () { // 离开页面生命周期函数
          // this.websocketclose();
      },
    components: {
      AddOrUpdate
    },
    activated () {
      this.getDataList()
    },
    methods: {

      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/olmonitoring/olgateway/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
            this.items_copy=[];
            for(var i=0;i<this.dataList.length;i++)
            {
             this.items_copy.push({type:'danger',address:this.dataList[i].ipaddress,lable:"离线"})
            }
              for(var i=0;i<this.items.length;i++)
              {
                  for(var t=0;t<this.items_copy.length;t++)
                  {
                      if(this.items[i].address==this.items_copy[t].address)
                      {
                          this.items_copy[t].type=this.items[i].type;
                          this.items_copy[t].lable=this.items[i].lable;
                      }
                  }
              }
            this.items=this.items_copy;
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
            // this.websocketsend("ask_wg_state");
        })
      },
        // onPlay () {
        //     this.audio.playing = true
        // },
        // // 当音频暂停
        // onPause () {
        //     this.audio.playing = false
        // },
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
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.idolGateway
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/olmonitoring/olgateway/delete'),
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
        handleChange1 (file, fileList) {
            this.fileList1 = fileList.slice()
        },
        handleChange2 (file, fileList) {
            this.fileList2 = fileList.slice()
        },
        handleChange3 (file, fileList) {
            this.fileList3 = fileList.slice()
        },
        handleRemove1 (file, fileList) {
            this.fileList1 = fileList.slice()
        },
        handleRemove2 (file, fileList) {
            this.fileList2 = fileList.slice()
        },
        handleRemove3 (file, fileList) {
            this.fileList3 = fileList.slice()
        },
        handleSuccess1 (response, file, fileList) {
            this.$refs.upload1.clearFiles()
            if (response.code > 0) {
                this.$message.error('上传失败,' + response.msg)
            } else {
                this.$message.success('上传成功')
                this.getData()
            }
        },
        handleSuccess2 (response, file, fileList) {
            this.$refs.upload2.clearFiles()
            if (response.code > 0) {
                this.$message.error('上传失败,' + response.msg)
            } else {
                this.$message.success('上传成功')
                this.getData()
            }
        },
        handleSuccess3 (response, file, fileList) {
            this.$refs.upload3.clearFiles()
            if (response.code > 0) {
                this.$message.error('上传失败,' + response.msg)
            } else {
                this.$message.success('上传成功')
                this.getData()
            }
        },
        handleError1 (err, file, fileList) {
            this.$refs.upload1.clearFiles()
            this.$message.error('上传失败' + err)
        },
        handleError2 (err, file, fileList) {
            this.$refs.upload2.clearFiles()
            this.$message.error('上传失败' + err)
        },
        handleError3 (err, file, fileList) {
            this.$refs.upload3.clearFiles()
            this.$message.error('上传失败' + err)
        },
        handleExceed1(files, fileList) {
            this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        handleExceed2(files, fileList) {
            this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        handleExceed3(files, fileList) {
            this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        submitUpload1() {
            if(this.fileList1.length >0) {
                this.$refs.upload1.submit();
                // this.fileList1=[];
            }else{
                this.$message.error('文件缺失')
            }
        },
        submitUpload2() {
            if(this.fileList2.length >0) {
                this.$refs.upload2.submit();
                // this.fileList2=[];
            }else{
                this.$message.error('文件缺失')
            }
        },
        submitUpload3() {
            if(this.fileList3.length >0) {
                this.$refs.upload3.submit();
                // this.fileList3=[];
            }else{
                this.$message.error('文件缺失')
            }
        },
        // initWebSocket: function () {
        //     // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
        //     this.websock = new WebSocket('ws://localhost:8080/sva/websocket');
        //     this.websock.onopen = this.websocketonopen;
        //     this.websock.onerror = this.websocketonerror;
        //     this.websock.onmessage = this.websocketonmessage;
        //     this.websock.onclose = this.websocketclose;
        // },
        // websocketonopen: function () {
        //     console.log("WebSocket连接成功");
        //     // this.websocketsend("来自客户端的数据")
        // },
        // websocketonerror: function (e) {
        //     console.log("WebSocket连接发生错误"+e.code);
        // },
        // websocketonmessage: function (e) {
        //      console.log("WebSocket接收数据:"+e.data);
        //      var command=e.data.split(":");
        //     if(command[0]=="Send_wg_state")
        //     {
        //         this.ipoline =command[1].split(",");
        //         for(var i=0;i<this.items.length;i++)
        //         {
        //             var flag=false;
        //             for(var j=0;j<this.ipoline.length;j++)
        //             {
        //                 if((this.items[i].address)==this.ipoline[j])
        //                 {
        //                     flag=true;
        //                 }
        //             }
        //             if(flag)
        //             {
        //                 this.items[i].type='success';
        //                 this.items[i].lable='在线';
        //             }else
        //             {
        //                 this.items[i].type='danger';
        //                 this.items[i].lable='离线';
        //             }
        //
        //         }
        //         this.outline=[];
        //         for(var t=0;t<this.ipoline.length;t++)
        //         {
        //             var fflag=false;
        //             for(var c=0;c<this.items.length;c++)
        //             {
        //                 if(this.ipoline[t]==this.items[c].address)
        //                 {
        //                     fflag=true;
        //                     break;
        //                 }else
        //                 {
        //                     fflag=false;
        //                 }
        //             }
        //             if(!fflag)
        //             {
        //                 console.log("查找到outline："+this.ipoline[t]);
        //                 this.outline.push(this.ipoline[t]);
        //             }
        //         }
        //     }
        //
        //
        //
        // },
        // websocketclose: function (e) {
        //     this.websock.close();
        //     console.log("connection closed (" + e.code + ")");
        // },
        // websocketsend (Data) { // 数据发送
        //     this.websock.send(Data)
        // }

    },
      computed: {
          items:{
              get () { return this.$store.state.olwg.items },
              set (val) { this.$store.commit('olwg/updateitems', val) }
          }
      }
  }
</script>
