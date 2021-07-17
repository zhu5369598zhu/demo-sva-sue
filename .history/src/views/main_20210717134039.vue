<template>
  <div
    class="site-wrapper"
    :class="{ 'site-sidebar--fold': sidebarFold }"
    v-loading.fullscreen.lock="loading"
    element-loading-text="拼命加载中">
    <template v-if="!loading">
      <main-navbar />
      <main-sidebar />
      <div class="site-content__wrapper" :style="{ 'min-height': documentClientHeight + 'px' }">
        <main-content />
      </div>
    </template>
    <audio ref="audio1"  :src="getaudio1" controls="controls" v-show=false></audio>
    <audio ref="audio2"  :src="getaudio2" controls="controls" v-show=false></audio>
    <audio ref="audio3"  :src="getaudio3" controls="controls" v-show=false></audio>
  </div>
</template>

<script>
  import MainNavbar from './main-navbar'
  import MainSidebar from './main-sidebar'
  import MainContent from './main-content'
  import cloneDeep from 'lodash/cloneDeep'
  export default {
    data () {
      return {
        loading: true,
        ipoline:[],
        outline:[],
        items_copy: [],
        getaudio1: this.$http.adornUrl(`/olmonitoring/olwarningaudio/warning1.mp3`),
        getaudio2: this.$http.adornUrl(`/olmonitoring/olwarningaudio/warning2.mp3`),
        getaudio3: this.$http.adornUrl(`/olmonitoring/olwarningaudio/warning3.mp3`)
      }
    },
    components: {
      MainNavbar,
      MainSidebar,
      MainContent,
      cloneDeep
    },
    computed: {
      documentClientHeight: {
        get () { return this.$store.state.common.documentClientHeight },
        set (val) { this.$store.commit('common/updateDocumentClientHeight', val) }
      },
      sidebarFold: {
        get () { return this.$store.state.common.sidebarFold }
      },
      userId: {
        get () { return this.$store.state.user.id },
        set (val) { this.$store.commit('user/updateId', val) }
      },
      userName: {
        get () { return this.$store.state.user.name },
        set (val) { this.$store.commit('user/updateName', val) }
      },
        items:{
          get () { return this.$store.state.olwg.items },
          set (val) { this.$store.commit('olwg/updateitems', val) }
        },
      outl:{
        get () { return this.$store.state.olwg.outl },
        set (val) { this.$store.commit('olwg/updateoutl', val) }
      },
      nodeSensor1:{
        get () { return this.$store.state.olwg.nodeData1 },
        set (val) { this.$store.commit('olwg/updateNode1Data', val) }
      },
      nodeSensor2:{
        get () { return this.$store.state.olwg.nodeData2 },
        set (val) { this.$store.commit('olwg/updateNode2Data', val) }
      },
      nodeSensor3:{
        get () { return this.$store.state.olwg.nodeData3 },
        set (val) { this.$store.commit('olwg/updateNode3Data', val) }
      },
      nodeSensor4:{
        get () { return this.$store.state.olwg.nodeData4 },
        set (val) { this.$store.commit('olwg/updateNode4Data', val) }
      },
      nodeSensor5:{
        get () { return this.$store.state.olwg.nodeData5 },
        set (val) { this.$store.commit('olwg/updateNode5Data', val) }
      },
      nodeSensorbelt:{
        get () { return this.$store.state.olwg.nodeData_belt },
        set (val) { this.$store.commit('olwg/updateNodebeltData', val) }
      }
    },
    created () {
      this.getUserInfo()
      // this.initWebSocket()
    },
    destroyed () {
      //  this.websocketclose()
    },
    mounted () {
      this.resetDocumentClientHeight()
    },
    methods: {
      resize () {
        this.documentClientHeight = document.documentElement['clientHeight']
        console.log('documentClientHeight', this.documentClientHeight)
      },
      // 重置窗口可视高度
      resetDocumentClientHeight () {
        this.documentClientHeight = document.documentElement['clientHeight']
        this.$nextTick(function () {
          if (window.addEventListener) {
            window.addEventListener('resize', this.resize, false)
          } else {
            window.attachEvent('onresize', this.resize)
          }
        })
      },
      // 获取当前管理员信息
      getUserInfo () {
        this.$http({
          url: this.$http.adornUrl('/sys/user/info'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.loading = false
            this.userId = data.user.userId
            this.userName = data.user.username
          }
        })
      },
      initWebSocket: function () {
        // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
        this.websock = new WebSocket('ws://192.168.0.6:5009/sva/websocket');
      //  this.websock = new WebSocket('ws://192.168.200.40:5009/sva/websocket');
       this.websock.onopen = this.websocketonopen;
        this.websock.onerror = this.websocketonerror;
        this.websock.onmessage = this.websocketonmessage;
        this.websock.onclose = this.websocketclose;
      },
      websocketonopen: function () {
        console.log("WebSocket连接成功");
        // this.websocketsend("来自客户端的数据")
      },
      websocketonerror: function (e) {
        console.log("WebSocket连接发生错误"+e.code);
      },
      websocketonmessage: function (e) {
        // console.log("======="+e)
        // console.log("WebSocket接收数据:"+e.data);
        var command=e.data.split(":");
        if(command[0]=="Send_wg_state")
        {
          // items!== undefined && items!== null&&
          // if(this.items.length>0)
          // {
            this.items_copy=cloneDeep(this.items);
            // console.log("数组长度："+this.items.length);
          this.ipoline =command[1].split(",");
          for(var i=0;i<this.items.length;i++)
          {
            var flag=false;
            for(var j=0;j<this.ipoline.length;j++)
            {
              if((this.items[i].address)==this.ipoline[j])
              {
                flag=true;
              }
            }
            if(flag)
            {
               // this.items_copy=this.copyDeep(this.items);
               this.items_copy[i].type='success';
               this.items_copy[i].lable='在线';
               // this.items=this.copyDeep(this.items_copy);
            }else
            {
              // this.items_copy=this.copyDeep(this.items);
              this.items_copy[i].type='danger';
              this.items_copy[i].lable='离线';
              // this.items=this.copyDeep(this.items_copy);
            }

          }
          this.outline=[];
          for(var t=0;t<this.ipoline.length;t++)
          {
            var fflag=false;
            for(var c=0;c<this.items.length;c++)
            {
              if(this.ipoline[t]==this.items[c].address)
              {
                fflag=true;
                break;
              }else
              {
                fflag=false;
              }
            }
            if(!fflag)
            {
              console.log("查找到outline："+this.ipoline[t]);
              this.outline.push(this.ipoline[t]);
              this.outl=cloneDeep(this.outline);
            }
          }
            this.items=cloneDeep(this.items_copy);
          }else if(command[0]=="Send_sensor_state")
        {
          var value=command[1].split(",");
          var index=parseInt(value[0]);
          var value_z=value[3];
          var value_temp=value[4];
          var lowpowerwarning=parseInt(value[5]);
          var tempwarning=parseInt(value[6]);
          var x_u_warning=parseInt(value[7]);
          var x_d_warning=parseInt(value[8]);
       
          var type="success";
          var flicker=true;
          var get_name='';
          if(x_u_warning||x_d_warning||tempwarning)
          {
            type="danger";
            flicker=true;
          }else if(lowpowerwarning)
          {
            type="warning";
            flicker=true;
          }

          var shock=value_z;
          var temperature=value_temp;

          console.log("测试index数据:"+value[0])
          // if(index<23) //1--22                       0
          // {
          //   this.nodeSensor1[index-1].type=type;
          //   this.nodeSensor1[index-1].flicker=flicker;
          //   this.nodeSensor1[index-1].shock=shock+" mm/s";
          //   this.nodeSensor1[index-1].temperature=temperature+" °C";
          //   get_name=this.nodeSensor1[index-1].name;
          // }
          // else if(index>22&&index<45) //23--44      1
          // {
          //   this.nodeSensor2[index-22-1].type=type;
          //   this.nodeSensor2[index-22-1].flicker=flicker;
          //   this.nodeSensor2[index-22-1].shock=shock+" mm/s";
          //   this.nodeSensor2[index-22-1].temperature=temperature+" °C";
          //   get_name=this.nodeSensor2[index-22-1].name;
          // }else if(index>44&&index<67)    //45--66   2
          // {
          //   this.nodeSensor3[index-44-1].type=type;
          //   this.nodeSensor3[index-44-1].flicker=flicker;
          //   this.nodeSensor3[index-44-1].shock=shock+" mm/s";
          //   this.nodeSensor3[index-44-1].temperature=temperature+" °C";
          //   get_name=this.nodeSensor3[index-44-1].name;
          // }else if(index>66&&index<89)    //67--88   3
          // {
          //   this.nodeSensor4[index-66-1].type=type;
          //   this.nodeSensor4[index-66-1].flicker=flicker;
          //   this.nodeSensor4[index-66-1].shock=shock+" mm/s";
          //   this.nodeSensor4[index-66-1].temperature=temperature+" °C";
          //   get_name=this.nodeSensor4[index-66-1].name;
          // }else if(index>88&&index<111)          //89--110              4
          // {
          //   this.nodeSensor5[index-88-1].type=type;
          //   this.nodeSensor5[index-88-1].flicker=flicker;
          //   this.nodeSensor5[index-88-1].shock=shock+" mm/s";
          //   this.nodeSensor5[index-88-1].temperature=temperature+" °C";
          //   get_name=this.nodeSensor5[index-88-1].name;
          // }else                      //111--140
          // {
          //   this.nodeSensorbelt[index-110-1].type=type;
          //   this.nodeSensorbelt[index-110-1].flicker=flicker;
          //   this.nodeSensorbelt[index-110-1].shock=shock+" mm/s";
          //   this.nodeSensorbelt[index-110-1].temperature=temperature+" °C";
          //   get_name=this.nodeSensorbelt[index-110-1].name;
          // }



          if(x_u_warning||x_d_warniy_u_wng||tempwarning)
          {
            this.$refs.audio2.play();
            this.$notify({
              title: '警告',
              message:get_name+' 工作异常',
              type: 'warning'
            });
          }else if(lowpowerwarning)
          {
            this.$refs.audio3.play();
            this.$notify({
              title: '警告',
              message:get_name+' 低电量',
              type: 'warning'
            });
          }

        }else if(command[0]=="Sensor_trans_warning")
        {
          var value=command[1].split(",");
          var index=parseInt(value[0]);
          // var warning=parseInt(value[1]);
          // var alarm_type=parseInt(value[2]);

          var type="";
          var flicker=false;
          var shock="---";
          var temperature="-";
          var get_name='';
          if(index<23) //1--22                       0
          {
            this.nodeSensor1[index-1].type=type;
            this.nodeSensor1[index-1].flicker=flicker;
            this.nodeSensor1[index-1].shock=shock+" mm/s";
            this.nodeSensor1[index-1].temperature=temperature+" °C";
            get_name=this.nodeSensor1[index-1].name;
          }
          else if(index>22&&index<45) //23--44      1
          {
            this.nodeSensor2[index-22-1].type=type;
            this.nodeSensor2[index-22-1].flicker=flicker;
            this.nodeSensor2[index-22-1].shock=shock+" mm/s";
            this.nodeSensor2[index-22-1].temperature=temperature+" °C";
            get_name=this.nodeSensor2[index-22-1].name;
          }else if(index>44&&index<67)    //45--66   2
          {
            this.nodeSensor3[index-44-1].type=type;
            this.nodeSensor3[index-44-1].flicker=flicker;
            this.nodeSensor3[index-44-1].shock=shock+" mm/s";
            this.nodeSensor3[index-44-1].temperature=temperature+" °C";
            get_name=this.nodeSensor3[index-44-1].name;
          }else if(index>66&&index<89)    //67--88   3
          {
            this.nodeSensor4[index-66-1].type=type;
            this.nodeSensor4[index-66-1].flicker=flicker;
            this.nodeSensor4[index-66-1].shock=shock+" mm/s";
            this.nodeSensor4[index-66-1].temperature=temperature+" °C";
            get_name=this.nodeSensor4[index-66-1].name;
          }else if(index>88&&index<111)          //89--110              4
          {
            this.nodeSensor5[index-88-1].type=type;
            this.nodeSensor5[index-88-1].flicker=flicker;
            this.nodeSensor5[index-88-1].shock=shock+" mm/s";
            this.nodeSensor5[index-88-1].temperature=temperature+" °C";
            get_name=this.nodeSensor5[index-88-1].name;
          }else                      //111--140
          {
            this.nodeSensorbelt[index-110-1].type=type;
            this.nodeSensorbelt[index-110-1].flicker=flicker;
            this.nodeSensorbelt[index-110-1].shock=shock+" mm/s";
            this.nodeSensorbelt[index-110-1].temperature=temperature+" °C";
            get_name=this.nodeSensorbelt[index-110-1].name;
          }
          this.$refs.audio1.play();
          this.$notify({
            title: '警告',
            message: '传感器:'+get_name+' 通信警告',
            type: 'warning'
          });
        }
        // }
      },
      websocketclose: function (e) {
        this.websock.close();
        console.log("connection closed (" + e.code + ")");
      },
      websocketsend (Data) { // 数据发送
        this.websock.send(Data)
      },
      // copyDeep(templateData) {
      //   // templateData 是要复制的数组或对象，这样的数组或者对象就是指向新的地址的
      //   return JSON.parse(JSON.stringify(templateData));
      // }
    }
  }
</script>
