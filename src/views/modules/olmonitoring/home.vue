<template>
  <div class="wrap" style="height: 100%">
    <audio
      ref="audio1"
      :src="getaudio1"
      controls="controls"
      v-show="false"
    ></audio>
    <audio
      ref="audio2"
      :src="getaudio2"
      controls="controls"
      v-show="false"
    ></audio>
    <audio
      ref="audio3"
      :src="getaudio3"
      controls="controls"
      v-show="false"
    ></audio>
    <div class="img-box">
      <img src="~@/assets/img/bg.png" alt="" />
      <div class="view-title">振动温度在线监测</div>
      <div class="pump-box">
        <div
          :class="'pump-item' + ' ' + 'item' + (i + 1)"
          v-for="(item, i) in nodeList"
          :key="i"
        >
          <div class="pump-name" :title="item.title">{{ item.title }}</div>
          <div
            :class="
              'axis1' +
              ' ' +
              [item.zhou[0].status == 1 ? 'normal' : ''] +
              ' ' +
              [item.zhou[0].status == 2 ? 'danger' : '']
            "
            @click="qianzhou(item.zhou[0])"
            :title="item.title + '前轴'"
          ></div>
          <div
            :class="
              'axis2' +
              ' ' +
              [item.zhou[1].status == 1 ? 'normal' : ''] +
              ' ' +
              [item.zhou[1].status == 2 ? 'danger' : '']
            "
            @click="houzhou(item.zhou[1])"
            :title="item.title + '后轴'"
          ></div>
          <div
            :class="
              'zhoudata1' +
              ' ' +
              [item.zhou[0].status == 1 ? 'normal' : ''] +
              ' ' +
              [item.zhou[0].status == 2 ? 'danger' : '']
            "
          >
            <span
              :class="
                'zhoudata_text ' +
                [item.zhou[0].statusTemp == 1 ? 'normal' : ''] +
                ' ' +
                [item.zhou[0].statusTemp == 2 ? 'danger' : '']
              "
              >{{ item.zhou[0].temperature }}</span
            ><span style="color: #ffffff">°C</span><br /><span
              :class="
                'zhoudata_text ' +
                [item.zhou[0].statusVaue == 1 ? 'normal' : ''] +
                ' ' +
                [item.zhou[0].statusVaue == 2 ? 'danger' : '']
              "
              >{{ item.zhou[0].shock }}</span
            ><span style="color: #ffffff">mm/s</span>
          </div>
          <div
            :class="
              'zhoudata2' +
              ' ' +
              [item.zhou[1].status == 1 ? 'normal' : ''] +
              ' ' +
              [item.zhou[1].status == 2 ? 'danger' : '']
            "
          >
            <span
              :class="
                'zhoudata_text ' +
                [item.zhou[1].statusTemp == 1 ? 'normal' : ''] +
                ' ' +
                [item.zhou[1].statusTemp == 2 ? 'danger' : '']
              "
              >{{ item.zhou[1].temperature }}</span
            ><span style="color: #ffffff">°C</span><br /><span
              :class="
                'zhoudata_text ' +
                [item.zhou[1].statusVaue == 1 ? 'normal' : ''] +
                ' ' +
                [item.zhou[1].statusVaue == 2 ? 'danger' : '']
              "
              >{{ item.zhou[1].shock }}</span
            ><span style="color: #ffffff">mm/s</span>
          </div>
        </div>
      </div>
      <div
        :class="'room-list' + ' ' + 'item' + (i + 1)"
        v-for="(item, i) in room"
        :key="i"
      >
        {{ item }}
      </div>
      <olsensortoview ref="olsensorToview"></olsensortoview>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import olsensortoview from "./olsensor-to-view";
export default {
  data() {
    return {
      getaudio1: this.$http.adornUrl(
        `/olmonitoring/olwarningaudio/warning1.mp3`
      ),
      getaudio2: this.$http.adornUrl(
        `/olmonitoring/olwarningaudio/warning2.mp3`
      ),
      getaudio3: this.$http.adornUrl(
        `/olmonitoring/olwarningaudio/warning3.mp3`
      ),
      nodeList: [
        {
          title: "1号熄焦泵",
          zhou: [
            {
              nodeId: 39,
              status: "",
              temperature: "",
              shock: "",
            },
            {
              nodeId: 40,
              status: "",
              temperature: "",
              shock: "",
            },
          ],
        },
        {
          title: "2号熄焦泵",
          zhou: [
            {
              nodeId: 41,
              status: "",
              temperature: "",
              shock: "",
            },
            {
              nodeId: 42,
              status: "",
              temperature: "",
              shock: "",
            },
          ],
        },
        {
          title: "1号烟气脱硫引风机",
          zhou: [
            {
              nodeId: 1,
              status: "",
              temperature: "",
              shock: "",
            },
            {
              nodeId: 2,
              status: "",
              temperature: "",
              shock: "",
            },
          ],
        },
        {
          title: "2号烟气脱硫引风机",
          zhou: [
            {
              nodeId: 3,
              status: "",
              temperature: "",
              shock: "",
            },
            {
              nodeId: 4,
              status: "",
              temperature: "",
              shock: "",
            },
          ],
        },
        {
          title: "1号脱硫液循环泵",
          zhou: [
            {
              nodeId: 17,
              status: "",
              temperature: "",
              shock: "",
            },
            {
              nodeId: 18,
              status: "",
              temperature: "",
              shock: "",
            },
          ],
        },
        {
          title: "2号脱硫液循环泵",
          zhou: [
            {
              nodeId: 19,
              status: "",
              temperature: "",
              shock: "",
            },
            {
              nodeId: 20,
              status: "",
              temperature: "",
              shock: "",
            },
          ],
        },
        {
          title: "3号脱硫液循环泵",
          zhou: [
            {
              nodeId: 21,
              status: "",
              temperature: "",
              shock: "",
            },
            {
              nodeId: 22,
              status: "",
              temperature: "",
              shock: "",
            },
          ],
        },
        {
          title: "1号精煤破碎机",
          zhou: [
            {
              nodeId: 49,
              status: "",
              temperature: "",
              shock: "",
            },
            {
              nodeId: 50,
              status: "",
              temperature: "",
              shock: "",
            },
          ],
        },
        {
          title: "2号精煤破碎机",
          zhou: [
            {
              nodeId: 47,
              status: "",
              temperature: "",
              shock: "",
            },
            {
              nodeId: 48,
              status: "",
              temperature: "",
              shock: "",
            },
          ],
        },
        {
          title: "1号除尘风机",
          zhou: [
            {
              nodeId: 5,
              status: "",
              temperature: "",
              shock: "",
            },
            {
              nodeId: 6,
              status: "",
              temperature: "",
              shock: "",
            },
          ],
        },
        {
          title: "2号除尘风机",
          zhou: [
            {
              nodeId: 7,
              status: "",
              temperature: "",
              shock: "",
            },
            {
              nodeId: 8,
              status: "",
              temperature: "",
              shock: "",
            },
          ],
        },
        {
          title: "1号循环水泵",
          zhou: [
            {
              nodeId: 29,
              status: "",
              temperature: "",
              shock: "",
            },
            {
              nodeId: 30,
              status: "",
              temperature: "",
              shock: "",
            },
          ],
        },
        {
          title: "2号循环水泵",
          zhou: [
            {
              nodeId: 31,
              status: "",
              temperature: "",
              shock: "",
            },
            {
              nodeId: 32,
              status: "",
              temperature: "",
              shock: "",
            },
          ],
        },
        {
          title: "3号循环水泵",
          zhou: [
            {
              nodeId: 33,
              status: "",
              temperature: "",
              shock: "",
            },
            {
              nodeId: 34,
              status: "",
              temperature: "",
              shock: "",
            },
          ],
        },
        {
          title: "1号低温水泵",
          zhou: [
            {
              nodeId: 35,
              status: "",
              temperature: "",
              shock: "",
            },
            {
              nodeId: 36,
              status: "",
              temperature: "",
              shock: "",
            },
          ],
        },
        {
          title: "2号低温水泵",
          zhou: [
            {
              nodeId: 37,
              status: "",
              temperature: "",
              shock: "",
            },
            {
              nodeId: 38,
              status: "",
              temperature: "",
              shock: "",
            },
          ],
        },
        {
          title: "1号超细破",
          zhou: [
            {
              nodeId: 43,
              status: "",
              temperature: "",
              shock: "",
            },
            {
              nodeId: 44,
              status: "",
              temperature: "",
              shock: "",
            },
          ],
        },
        {
          title: "2号超细破",
          zhou: [
            {
              nodeId: 45,
              status: "",
              temperature: "",
              shock: "",
            },
            {
              nodeId: 46,
              status: "",
              temperature: "",
              shock: "",
            },
          ],
        },
        {
          title: "1号煤气鼓风机",
          zhou: [
            {
              nodeId: 23,
              status: "",
              temperature: "",
              shock: "",
            },
            {
              nodeId: 24,
              status: "",
              temperature: "",
              shock: "",
            },
          ],
        },
        {
          title: "2号煤气鼓风机",
          zhou: [
            {
              nodeId: 25,
              status: "",
              temperature: "",
              shock: "",
            },
            {
              nodeId: 26,
              status: "",
              temperature: "",
              shock: "",
            },
          ],
        },
        {
          title: "3号煤气鼓风机",
          zhou: [
            {
              nodeId: 27,
              status: "",
              temperature: "",
              shock: "",
            },
            {
              nodeId: 28,
              status: "",
              temperature: "",
              shock: "",
            },
          ],
        },
        {
          title: "1号高压氨水泵",
          zhou: [
            {
              nodeId: 9,
              status: "",
              temperature: "",
              shock: "",
            },
            {
              nodeId: 10,
              status: "",
              temperature: "",
              shock: "",
            },
          ],
        },
        {
          title: "1号循环氨水泵",
          zhou: [
            {
              nodeId: 13,
              status: "",
              temperature: "",
              shock: "",
            },
            {
              nodeId: 14,
              status: "",
              temperature: "",
              shock: "",
            },
          ],
        },
        {
          title: "2号循环氨水泵",
          zhou: [
            {
              nodeId: 15,
              status: "",
              temperature: "",
              shock: "",
            },
            {
              nodeId: 16,
              status: "",
              temperature: "",
              shock: "",
            },
          ],
        },
        {
          title: "2号高压氨水泵",
          zhou: [
            {
              nodeId: 11,
              status: "",
              temperature: "",
              shock: "",
            },
            {
              nodeId: 12,
              status: "",
              temperature: "",
              shock: "",
            },
          ],
        },
      ],
      arr1: [],
      arr2: [],
      room: [
        "熄焦泵",
        "烟气脱硫",
        "煤气脱硫",
        "大破",
        "地面除尘站",
        "循环水泵房",
        "小破",
        "煤气鼓风机",
        "冷凝泵房",
      ],
    };
  },
  components: {
    olsensortoview,
  },
  created() {
    // let arr = [
    //   "30,0.98,31.95,1,1,1",
    //   "30,0.98,31.95,1,1,1",
    //   "30,0.98,31.95,1,1,1",
    //   "32,0.31,32.55,1,1,1",
    //   "33,0.32,31.5,1,1,1",
    //   "32,0.31,32.55,1,1,1",
    //   "33,0.32,31.5,1,1,1",
    //   "34,0.42,32.1,1,1,1",
    //   "35,0.8,31.65,1,1,1",
    //   "37,0.55,32.4,1,1,1",
    //   "31,0.24,31.8,1,1,1",
    //   "36,0.38,-0.15,1,1,1",
    // ];
    // let arr2 = [
    //   "34,0.42,32.1,1,1,1",
    //   "35,0.8,31.65,1,1,1",
    //   "37,0.55,32.4,1,1,1",
    //   "31,0.24,31.8,1,1,1",
    //   "36,0.38,-0.15,1,1,1",
    // ];
    // console.log(this.unique(arr));
    // console.log(this.toRemove(arr, arr2));
  },
  activated() {
    this.getdata();
    this.initWebSocket();
    // console.log(this.nodeSensor1)
    // this.$refs.olsensorToview.get_node('1号循环水泵前轴');
  },
  computed: {
    nodeSensor1: {
      get() {
        return this.$store.state.olwg.nodeData1;
      },
      set(val) {
        this.$store.commit("olwg/updateNode1Data", val);
      },
    },
  },
  methods: {
    toRemove(a, b) {
      let c = [];
      for (let i of a) {
        if (b.indexOf(i) === -1) {
          c.push(i);
        }
      }
      return c;
    },
    unique(arr) {
      if (!Array.isArray(arr)) {
        console.log("type error!");
        return;
      }
      var array = [];
      for (var i = 0; i < arr.length; i++) {
        if (array.indexOf(arr[i]) === -1) {
          array.push(arr[i]);
        }
      }
      return array;
    },
    initWebSocket: function () {
      console.log(111);
      // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
      // this.websock = new WebSocket("ws://1.180.141.146:5009/sva/websocket");
      //  this.websock = new WebSocket("ws://192.168.31.181:5009/sva/websocket");
       this.websock = new WebSocket('ws://192.168.200.40:5009/sva/websocket');
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
      console.log("WebSocket连接发生错误" + e.code);
    },
    websocketonmessage: function (e) {
      var command = e.data.split(":");
      let type = command[0];
      let data = command[1].split(",");
      console.log(type);
      console.log(data);
      if (type == "Send_sensor_state") {
        let nodeData = {
          nodeId: data[0],
          status: data[3],
          temperature: data[2],
          shock: data[1],
          nodename: data[8] == 1 ? data[7] + "后轴" : data[7] + "前轴",
          statusTemp: data[4],
          statusVaue: data[5],
        };
        if (nodeData.status == 2) {
          this.$refs.audio2.play();
          this.$notify({
            title: "警告",
            message: "传感器:" + data[7] + " 工作异常",
            type: "warning",
          });
        } else if (data[6] == 1) {
          this.$refs.audio3.play();
          this.$notify({
            title: "警告",
            message: "传感器:" + data[7] + " 低电量",
            type: "warning",
          });
        }
        this.nodeList.forEach((element, index) => {
          if (element.title == data[7]) {
            this.$set(this.nodeList[index].zhou, parseInt(data[8]), nodeData);
            this.$forceUpdate();
          }
        });
      } else if (type == "Sensor_trans_warning") {
        this.$refs.audio1.play();
        this.$notify({
          title: "警告",
          message: "传感器:" + data[4] + " 通信异常",
          type: "warning",
        });
        let nodeData = {
          nodeId: data[0],
          status: data[3],
          temperature: "",
          shock: "",
          nodename: data[5] == 1 ? data[4] + "后轴" : data[4] + "前轴",
          statusTemp: 0,
          statusVaue: 0,
        };
        this.nodeList.forEach((element, index) => {
          if (element.title == data[4]) {
            this.$set(this.nodeList[index].zhou, parseInt(data[5]), nodeData);
            this.$forceUpdate();
           
          }
        });
      }
    },
    websocketclose: function (e) {
      this.websock.close();
      console.log("connection closed (" + e.code + ")");
    },
    getdata() {
      this.$http({
        url: this.$http.adornUrl(`/olmonitoring/olsensordata/lists`),
        method: "get",
        data: this.$http.adornData({
          // time_start,
          // time_end,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(this.nodeList);
          console.log(data.list);
          let arr = [];
          let listData = data.list;
          for (var i = 0; i < listData.length; i += 2) {
            arr.push(listData.slice(i, i + 2));
          }
          console.log(arr);
          this.nodeList.forEach((element, index) => {
            element.zhou[0].status = arr[index][0].statusId;
            element.zhou[0].temperature = arr[index][0].valueTemp;
            element.zhou[0].shock = arr[index][0].vaue;
            element.zhou[0].nodename = element.title + "前轴";
            element.zhou[0].statusTemp = arr[index][0].statusTemp;
            element.zhou[0].statusVaue = arr[index][0].statusVaue;
            element.zhou[1].status = arr[index][1].statusId;
            element.zhou[1].temperature = arr[index][1].valueTemp;
            element.zhou[1].shock = arr[index][1].vaue;
            element.zhou[1].nodename = element.title + "后轴";
            element.zhou[1].statusTemp = arr[index][1].statusTemp;
            element.zhou[1].statusVaue = arr[index][1].statusVaue;
          });
          console.log(this.nodeList);
        } else {
        }
      });
    },
    qianzhou(data) {
      console.log(data);
      this.$nextTick(() => {
        console.log("根据节点名查询:" + data.nodename);
        this.$refs.olsensorToview.get_node(data.nodename);
      });
    },
    houzhou(data) {
      this.$nextTick(() => {
        console.log("根据节点名查询:" + data.nodename);
        this.$refs.olsensorToview.get_node(data.nodename);
      });
      console.log(data);
    },
  },
  computed: {},
  watch: {},
  mounted: function () {},
};
</script>
<style lang="less" scoped>
@keyframes danger {
  from {
    background: #ccc;
  }
  50% {
    background: #ff002a;
  }
  to {
    background: #ccc;
  }
}
.wrap {
  background: #404351;
  position: relative;
}
.view-title {
  text-align: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 40px;
  font-weight: bold;
  color: #fff;
  top: 50px;
  letter-spacing: 15px;
}
.right-tabel {
  position: absolute;
  left: 1230px;
  top: 10px;
}
.img-box {
  max-width: 1740px;
  min-width: 1740px;
  height: auto;
  position: relative;
  .room-list {
    position: absolute;
    // color: #66ff66;
    color: #ffffff;
    font-size: 23px;
    font-weight: bold;
    &.item1 {
      left: 361px;
      top: 278px;
    }
    &.item2 {
      left: 797px;
      top: 278px;
    }
    &.item3 {
      left: 1439px;
      top: 278px;
    }
    &.item4 {
      left: 335px;
      top: 504px;
    }
    &.item5 {
      left: 747px;
      top: 504px;
    }
    &.item6 {
      left: 1436px;
      top: 504px;
    }
    &.item7 {
      left: 287px;
      top: 762px;
    }
    &.item8 {
      left: 802px;
      top: 762px;
    }
    &.item9 {
      left: 1499px;
      top: 762px;
    }
  }
  img {
    width: 100%;
    height: auto;
    display: block;
  }
  .pump-box {
    width: 1740px;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    .pump-item {
      position: absolute;
      transition: all 0.2s;
      cursor: pointer;
      color: #fff;
      .pump-name {
        position: absolute;
        top: -28px;
        overflow: hidden;
        width: 200px;
        margin-left: -20px;
        font-size: 16px;
      }
      .axis1,
      .axis2 {
        position: absolute;
        width: 17px;
        height: 17px;
        background: #ccc;
        border-radius: 50%;
        transition: all 0.2s;
        &:hover {
          transform: scale(1.2);
          background: #fff;
        }
        &.danger {
          animation: danger 500ms infinite;
        }
        &.normal {
          background: #00ff2b;
        }
        &.flicker {
          animation: danger 500ms infinite;
        }
      }
      .zhoudata1 {
        position: absolute;
        right: -80px;
        top: 10px;
        width: 80px;
        color: #ccc;
        font-size: 14px;
        font-weight: bold;
        &.danger {
          color: red;
        }
        &.normal {
          color: #00ff2b;
        }
      }
      .zhoudata2 {
        position: absolute;
        right: -80px;
        bottom: 15px;
        width: 80px;
        color: #ccc;
        font-size: 14px;
        font-weight: bold;
        &.danger {
          color: red;
        }
        &.normal {
          color: #00ff2b;
        }
      }
      .zhoudata_text {
        color: #ccc;
        &.danger {
          color: red;
        }
        &.normal {
          color: #00ff2b;
        }
      }
      .axis1 {
        left: 8%;
        top: 20%;
      }
      .axis2 {
        left: 8%;
        bottom: 20%;
      }
      &:hover {
        background: rgba(#000, 0.2);
      }
      &.item1 {
        width: 50px;
        height: 100px;
        transform: skewX(-10deg);
        left: 241px;
        top: 182px;
        .pump-name {
          transform: skewX(10deg);
        }
      }
      &.item2 {
        width: 50px;
        height: 100px;
        transform: skewX(-8deg);
        left: 360px;
        top: 182px;
        .pump-name {
          transform: skewX(8deg);
        }
      }
      &.item3 {
        width: 50px;
        height: 100px;
        transform: skewX(-5deg);
        left: 604px;
        top: 182px;
        .pump-name {
          transform: skewX(5deg);
        }
        .axis1,
        .axis2 {
          left: 20%;
        }
      }
      &.item4 {
        width: 50px;
        height: 100px;
        transform: skewX(-1deg);
        left: 771px;
        top: 182px;
        .pump-name {
          transform: skewX(1deg);
        }
        .axis1,
        .axis2 {
          left: 25%;
        }
      }
      &.item5 {
        width: 50px;
        height: 100px;
        transform: skewX(4deg);
        left: 1062px;
        top: 182px;
        .pump-name {
          transform: skewX(-4deg);
        }
        .axis1,
        .axis2 {
          left: 35%;
        }
      }
      &.item6 {
        width: 50px;
        height: 100px;
        transform: skewX(6deg);
        left: 1233px;
        top: 182px;
        .pump-name {
          transform: skewX(-6deg);
        }
        .axis1,
        .axis2 {
          left: 40%;
        }
      }
      &.item7 {
        width: 50px;
        height: 100px;
        transform: skewX(7deg);
        left: 1385px;
        top: 182px;
        .pump-name {
          transform: skewX(-7deg);
        }
        .axis1,
        .axis2 {
          left: 50%;
        }
      }
      &.item8 {
        width: 50px;
        height: 100px;
        transform: skewX(-10deg);
        left: 204px;
        top: 400px;
        .pump-name {
          transform: skewX(10deg);
          top: -39px;
        }
      }
      &.item9 {
        width: 50px;
        height: 100px;
        transform: skewX(-8deg);
        left: 333px;
        top: 400px;
        .pump-name {
          transform: skewX(8deg);
          top: -39px;
        }
      }
      &.item10 {
        width: 50px;
        height: 100px;
        transform: skewX(-4deg);
        left: 590px;
        top: 400px;
        .pump-name {
          transform: skewX(4deg);
          top: -39px;
        }
        .axis1,
        .axis2 {
          left: 25%;
        }
      }
      &.item11 {
        width: 50px;
        height: 110px;
        transform: skewX(-1deg);
        left: 768px;
        top: 400px;
        .pump-name {
          transform: skewX(1deg);
          top: -39px;
        }
        .axis1,
        .axis2 {
          left: 25%;
        }
      }
      &.item12 {
        width: 50px;
        height: 110px;
        transform: skewX(2deg);
        left: 1025px;
        top: 400px;
        .pump-name {
          transform: skewX(-2deg);
          top: -39px;
        }
        .axis1,
        .axis2 {
          left: 40%;
        }
      }
      &.item13 {
        width: 50px;
        height: 110px;
        transform: skewX(4deg);
        left: 1141px;
        top: 400px;
        .pump-name {
          transform: skewX(-6deg);
          top: -39px;
        }
        .axis1,
        .axis2 {
          left: 30%;
        }
      }
      &.item14 {
        width: 50px;
        height: 110px;
        transform: skewX(6deg);
        left: 1260px;
        top: 400px;
        .pump-name {
          transform: skewX(-6deg);
          top: -39px;
        }
        .axis1,
        .axis2 {
          left: 40%;
        }
      }
      &.item15 {
        width: 50px;
        height: 110px;
        transform: skewX(8deg);
        left: 1378px;
        top: 400px;
        .pump-name {
          transform: skewX(-8deg);
          top: -39px;
        }
        .axis1,
        .axis2 {
          left: 40%;
        }
      }
      &.item16 {
        width: 50px;
        height: 110px;
        transform: skewX(10deg);
        left: 1492px;
        top: 400px;
        .pump-name {
          transform: skewX(-10deg);
          top: -39px;
        }
        .axis1,
        .axis2 {
          left: 50%;
        }
      }
      &.item17 {
        width: 50px;
        height: 120px;
        transform: skewX(-11deg);
        left: 160px;
        top: 642px;
        .pump-name {
          transform: skewX(11deg);
          top: -42px;
        }
      }
      &.item18 {
        width: 50px;
        height: 120px;
        transform: skewX(-9deg);
        left: 299px;
        top: 642px;
        .pump-name {
          transform: skewX(9deg);
          top: -42px;
        }
      }
      &.item19 {
        width: 50px;
        height: 120px;
        transform: skewX(-5deg);
        left: 548px;
        top: 642px;
        .pump-name {
          transform: skewX(5deg);
          top: -42px;
        }
        .axis1,
        .axis2 {
          left: 10%;
        }
      }
      &.item20 {
        width: 53px;
        height: 120px;
        transform: skewX(-3deg);
        left: 674px;
        top: 642px;
        .pump-name {
          transform: skewX(3deg);
          top: -42px;
        }
        .axis1,
        .axis2 {
          left: 20%;
        }
      }
      &.item21 {
        width: 53px;
        height: 120px;
        transform: skewX(-1deg);
        left: 793px;
        top: 642px;
        .pump-name {
          transform: skewX(1deg);
          top: -42px;
        }
        .axis1,
        .axis2 {
          left: 20%;
        }
      }
      &.item22 {
        width: 53px;
        height: 120px;
        transform: skewX(3deg);
        left: 1038px;
        top: 642px;
        .pump-name {
          transform: skewX(-3deg);
          top: -42px;
        }
        .axis1,
        .axis2 {
          left: 40%;
        }
      }
      &.item23 {
        width: 53px;
        height: 120px;
        transform: skewX(5deg);
        left: 1202px;
        top: 642px;
        .pump-name {
          transform: skewX(-5deg);
          top: -42px;
        }
        .axis1,
        .axis2 {
          left: 40%;
        }
      }
      &.item24 {
        width: 53px;
        height: 120px;
        transform: skewX(8deg);
        left: 1358px;
        top: 642px;
        .pump-name {
          transform: skewX(-8deg);
          top: -42px;
        }
        .axis1,
        .axis2 {
          left: 40%;
        }
      }
      &.item25 {
        width: 53px;
        height: 120px;
        transform: skewX(10deg);
        left: 1495px;
        top: 642px;
        .pump-name {
          transform: skewX(-7deg);
          top: -42px;
        }
        .axis1,
        .axis2 {
          left: 50%;
        }
      }
    }
  }
}
</style>
