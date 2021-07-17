<template>
  <div class="warp">
    <div class="svg_box">
      <img class="bg_img" src="~@/assets/img/3.svg" alt />
      <div
        v-for="(item,i) in this.nodeSensor"
        :key="'node_date_box'+i"
        :class="'node_date_box node_date_box'+i+' '+[item.hover?'hover':'']"
      >
        <div :class="'node_date_title '+[item.hover?'hover':'']" :title="item.name">{{item.name}}</div>
        <div class="node_date">
          <div class="shock" :title="item.shock">震动：{{item.shock}}</div>
          <div class="temperature" :title="item.temperature">温度：{{item.temperature}}</div>
        </div>
      </div>
      <div
        v-for="(item,i) in this.nodeSensor"
        :key="'node'+i"
        :class="'node node'+i+' '+item.type+' '+[item.flicker?'flicker':'']"
        @click.stop="goStatusDetail(item.name)"
        @mouseenter="nodeEnter(i)"
        @mouseleave="nodeLeave(i)"
      ></div>
      <olsensortoview ref="olsensorToview"></olsensortoview>
    </div>
  </div>
</template>

<script>
  import olsensortoview from './olsensor-to-view'
export default {
  props: {},
  data() {
    return {
      // type:状态类型 danger危险（红色） warning警告（黄色）正常，无类名（灰色）
      // flicker：是否闪烁 true（闪烁）
      // name：数据框标题
      // shock：数据框震动参数
      // temperature：数据框温度参数
      // hover: 鼠标移入

    };
  },
  computed: {
    nodeSensor:{
      get () { return this.$store.state.olwg.nodeData3 },
      set (val) { this.$store.commit('olwg/updateNode3Data', val) }
    }
  },
  created() {
    console.log(this.$route.params.id); //接收主页的煅烧炉索引
    // this.$axios("/地址", {
    //   params: {
    //     //参数
    //     // id:'123',
    //   }
    // })
    //   .then(function(res) {
    //     console.log(res);
    //     //this.nodeData= res.data.data
    //   })
    //   .catch(function(error) {
    //     console.log(error);
    //   });
  },
  mounted() {},
  watch: {},
  methods: {
    goStatusDetail(nodename) {
      this.$nextTick(() => {
        console.log("根据节点名查询:"+nodename)
        this.$refs.olsensorToview.get_node(nodename)
      })
    },
    nodeEnter(i) {
      this.nodeSensor[i].hover = true;
    },
    nodeLeave(i) {
      this.nodeSensor[i].hover = false;
    }
  },
  components: {olsensortoview}
};
</script>

<style scoped lang="less">
@keyframes warning {
  from {
    background-image: linear-gradient(to top, black, yellow, black);
  }
  50% {
    background-image: linear-gradient(to top, yellow, orange, yellow);
    // opacity: 0.9;
  }
  to {
    background-image: linear-gradient(to top, black, yellow, black);
  }
}
@keyframes danger {
  from {
    background-image: linear-gradient(to top, black, yellow, black);
  }
  50% {
    background-image: linear-gradient(to top, #ff6600, red, #ff6600);
    // opacity: 0.9;
  }
  to {
    background-image: linear-gradient(to top, black, yellow, black);
  }
}
.node {
  //通用节点样式
  position: absolute;
  height: 3%;
  width: 0.7%;
  border: 1px solid #000;
  background-image: linear-gradient(to top, black, #ccc, black);
  transition: all 0.2s;
  cursor: pointer;
  left: 0%;
  top: 0%;
  z-index: 999;
}
.warning {
  background-image: linear-gradient(to top, black, yellow, black);
}
.danger {
  background-image: linear-gradient(to top, black, red, black);
}
.warning.flicker {
  animation: warning 500ms infinite;
}
.danger.flicker {
  animation: danger 500ms infinite;
}
.node:hover {
  transform: scale(2);
  z-index: 9999999999;
}
.svg_box {
  min-width: 75rem;
  position: relative;
  overflow: hidden;
  background-color: #c0c0c0;
  box-sizing: border-box;
  background: url(~@/assets/img/3.svg) no-repeat;
  background-size: 100% auto;
  .bg_img {
    opacity: 0;
    width: 100%;
    height: 100%;
  }
  .node_date_box {
    position: absolute;
    width: 6.5%;
    height: 7.5%;
    border: 1px solid #000;
    left: 0;
    top: 0;
    // font-size: 0.8rem;
    font-size: 0.625rem;
  }
  .node_date_box.hover {
    border: 1px solid #ff2222;
    color: #fff;
  }
  .node_date_title {
    border-bottom: 1px solid #000;
    width: 100%;
    padding: 0;
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    height: 35%;
  }
  .node_date_title.hover {
    border-bottom: 1px solid red;
  }
  .node_date {
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
  .node_date > div {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .node_date_box0 {
    left: 13%;
    top: 12%;
  }
  .node_date_box1 {
    left: 27%;
    top: 14%;
  }
  .node_date_box2 {
    left: 38.5%;
    top: 17%;
  }
  .node_date_box3 {
    left: 5.5%;
    top: 23%;
  }
  .node_date_box4 {
    left: 38.5%;
    top: 25.5%;
  }

  .node_date_box5 {
    left: 5.5%;
    top: 31.5%;
  }
  .node_date_box6 {
    left: 38.5%;
    top: 33.5%;
  }
  .node_date_box7 {
    left: 11%;
    top: 57.5%;
  }

  .node_date_box8 {
    left: 11%;
    top: 78.5%;
  }
  .node_date_box9 {
    left: 45%;
    top: 88.5%;
  }
  .node_date_box10 {
    left: 79%;
    top: 50.5%;
  }
  .node_date_box11 {
    left: 52%;
    top: 88.5%;
  }
  .node_date_box12 {
    left: 25.8%;
    top: 41.5%;
  }
  .node_date_box13 {
    left: 33.5%;
    top: 41.5%;
  }
  .node_date_box14 {
    left: 61.5%;
    top: 41.5%;
  }
  .node_date_box15 {
    left: 69.5%;
    top: 41.5%;
  }
  .node_date_box16 {
    left: 25.8%;
    top: 87%;
  }
  .node_date_box17 {
    left: 33.5%;
    top: 87%;
  }
  .node_date_box18 {
    left: 61.5%;
    top: 87%;
  }
  .node_date_box19 {
    left: 69.5%;
    top: 87%;
  }
  .node_date_box20 {
    left: 84.5%;
    top: 79%;
  }
  .node_date_box21 {
    left: 84.5%;
    top: 88%;
  }
  .node0 {
    left: 19.1%;
    top: 21.1%;
  }
  .node1 {
    left: 25.88%;
    top: 21.1%;
  }
  .node2 {
    left: 34%;
    top: 25.6%;
  }
  .node3 {
    left: 13.3%;
    top: 28.6%;
  }
  .node4 {
    left: 32.4%;
    top: 28.6%;
  }
  .node5 {
    left: 13.3%;
    top: 32.7%;
  }
  .node6 {
    left: 32.4%;
    top: 32.3%;
  }
  .node7 {
    left: 17%;
    top: 71.7%;
    height: 4%;
    width: 1.1%;
  }

  .node8 {
    left: 19.1%;
    top: 62.7%;
    height: 10%;
    width: 0.8%;
  }
  .node9 {
    left: 50.3%;
    top: 81%;
    height: 6.5%;
  }
  .node10 {
    left: 78.77%;
    top: 59%;
    height: 1.5%;
    width: 2%;
  }
  .node11 {
    left: 52.3%;
    top: 81%;
    height: 6.5%;
  }
  .node12 {
    left: 31.9%;
    top: 49.1%;
  }

  .node13 {
    left: 33.06%;
    top: 49.1%;
  }
  .node14 {
    left: 67.86%;
    top: 49.1%;
  }
  .node15 {
    left: 69%;
    top: 49.1%;
  }
  .node16 {
    left: 31.9%;
    top: 83.1%;
  }
  .node17 {
    left: 33.06%;
    top: 83.1%;
  }
  .node18 {
    left: 67.86%;
    top: 83.1%;
  }
  .node19 {
    left: 69%;
    top: 83.1%;
  }
  .node20 {
    left: 78.77%;
    top: 90.8%;
    height: 1.5%;
    width: 2%;
  }
  .node21 {
    left: 80.3%;
    top: 93%;
    height: 1.5%;
    width: 2%;
  }
}
</style>
