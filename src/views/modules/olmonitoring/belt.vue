<template>
  <div class="warp">
    <div class="svg_box">
      <img class="bg_img" src="~@/assets/img/2.svg" alt />
      <div
        v-for="(item,i) in this.nodeSensor"
        :key="'belt_node'+i"
        :class="'belt_node belt_node'+i+' '+item.type+' '+[item.flicker?'flicker':'']"
        @click.stop="goStatusDetail(item.name)"
        @mouseenter="nodeEnter(i)"
        @mouseleave="nodeLeave(i)"
      ></div>
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
      <div class="calciner calciner1" @click="goCalciner(0)">
        <div>1#预混器</div>
        <div>1#煅烧炉</div>
      </div>
      <div class="calciner calciner2" @click="goCalciner(1)">
        <div>2#预混器</div>
        <div>2#煅烧炉</div>
      </div>
      <div class="calciner calciner3" @click="goCalciner(2)">
        <div>3#预混器</div>
        <div>3#煅烧炉</div>
      </div>
      <div class="calciner calciner4" @click="goCalciner(3)">
        <div>4#预混器</div>
        <div>4#煅烧炉</div>
      </div>
      <div class="calciner calciner5" @click="goCalciner(4)">
        <div>5#预混器</div>
        <div>5#煅烧炉</div>
      </div>
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
    };
  },
  computed: {
    nodeSensor:{
      get () { return this.$store.state.olwg.nodeData_belt },
      set (val) { this.$store.commit('olwg/updateNodebeltData', val) }
    }
  },
  created() {},
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
    },
    goCalciner(i) {
      this.$router.push({
        name: "calcinerDetail"+i,
        // params: {
        //   id: i
        // }
      });
    }
  },
  components: {olsensortoview}
};
</script>

<style scoped lang="less">
.warp {
  position: relative;
}
.svg_box {
  min-width: 75rem;
  position: relative;
  overflow: hidden;
  background-color: #c0c0c0;
  box-sizing: border-box;
  background: url(~@/assets/img/2.svg) no-repeat;
  background-size: 100% auto;
  .bg_img {
    opacity: 0;
    width: 100%;
    height: 100%;
  }
}
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
.calciner {
  position: absolute;
  top: 0%;
  left: 0%;
  width: 5%;
  height: 9%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  font-size: 0.8rem;
  cursor: pointer;
}
.calciner1 {
  position: absolute;
  top: 24%;
  left: 55.1%;
}
.calciner2 {
  position: absolute;
  top: 24%;
  left: 63.2%;
}
.calciner3 {
  position: absolute;
  top: 24%;
  left: 71.3%;
}
.calciner4 {
  position: absolute;
  top: 24%;
  left: 79.4%;
}
.calciner5 {
  position: absolute;
  top: 24%;
  left: 87.5%;
}
.node_date_box {
  position: absolute;
  width: 7.5%;
  height: 8.5%;
  border: 1px solid #000;
  left: 0;
  top: 0;
  font-size: 0.625rem;
  // transition: all 0.1s;
}
.node_date_box.hover {
  border: 1px solid red;
  color: #ddd;
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
  // transition: all 0.1s;
}
.node_date_title.hover {
  border-bottom: 1px solid red;
}
.node_date {
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 2%;
}
.node_date > div {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.belt_node {
  position: absolute;
  height: 3.5%;
  width: 0.6%;
  border: 1px solid #000;
  background-image: linear-gradient(to top, black, #ccc, black);
  transition: all 0.2s;
  cursor: pointer;
  left: 0%;
  top: 0%;
  z-index: 999;
}
.node_date_box27 {
  left: 36%;
  top: 4%;
}
.node_date_box0 {
  left: 36%;
  top: 14%;
}
.node_date_box1 {
  left: 48%;
  top: 4%;
}
.node_date_box2 {
  left: 44%;
  top: 21%;
}
.node_date_box3 {
  left: 87%;
  top: 3%;
}
.node_date_box4 {
  left: 78%;
  top: 3%;
}
.node_date_box5 {
  left: 2%;
  top: 62%;
}
.node_date_box6 {
  left: 2%;
  top: 72%;
}
.node_date_box7 {
  left: 2%;
  top: 82%;
}
.node_date_box8 {
  left: 12%;
  top: 82%;
}
.node_date_box9 {
  left: 12%;
  top: 72%;
}
.node_date_box10 {
  left: 12%;
  top: 62%;
}
.node_date_box11 {
  left: 20%;
  top: 5%;
}
.node_date_box12 {
  left: 20%;
  top: 15%;
}
.node_date_box13 {
  left: 20%;
  top: 25%;
}
.node_date_box14 {
  left: 28%;
  top: 25%;
}
.node_date_box15 {
  left: 28%;
  top: 15%;
}

.node_date_box16 {
  left: 28%;
  top: 5%;
}
.node_date_box17 {
  left: 47%;
  top: 31%;
}
.node_date_box18 {
  left: 39%;
  top: 31%;
}
.node_date_box19 {
  left: 55%;
  top: 43.4%;
}
.node_date_box20 {
  left: 50%;
  top: 56.2%;
}
.node_date_box21 {
  left: 65%;
  top: 54.9%;
}
.node_date_box22 {
  left: 60%;
  top: 67.9%;
}
.node_date_box23 {
  left: 73%;
  top: 66.5%;
}
.node_date_box24 {
  left: 68%;
  top: 79.5%;
}
.node_date_box25 {
  left: 82%;
  top: 78.2%;
}
.node_date_box26 {
  left: 75%;
  top: 90%;
}
.node_date_box28 {
  left: 2%;
  top: 52%;
}
.node_date_box29 {
  left: 12%;
  top: 52%;
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
.belt_node:hover {
  transform: scale(2);
  z-index: 9999999999;
}
.belt_node27:hover,
.belt_node28:hover,
.belt_node29:hover {
  transform: scale(0.7);
}
.belt_node0 {
  left: 44.2%;
  top: 10.5%;
  height: 1.5%;
  width: 2%;
}
.belt_node1 {
  left: 44.2%;
  top: 12.5%;
  height: 1%;
  width: 2%;
}
.belt_node2 {
  left: 44.2%;
  top: 18.5%;
  height: 1%;
  width: 2%;
}
.belt_node3 {
  left: 92.3%;
  top: 12.5%;
  height: 1%;
  width: 2%;
}
.belt_node4 {
  left: 92.3%;
  top: 18.5%;
  height: 1%;
  width: 2%;
}
.belt_node5 {
  left: 3.4%;
  top: 46.5%;
}
.belt_node6 {
  left: 4.1%;
  top: 46.5%;
}
.belt_node7 {
  left: 7.9%;
  top: 46.5%;
}
.belt_node8 {
  left: 12.9%;
  top: 46.5%;
}
.belt_node9 {
  left: 16.8%;
  top: 46.5%;
}
.belt_node10 {
  left: 17.5%;
  top: 46.5%;
}
.belt_node11 {
  left: 23.8%;
  top: 34.1%;
}
.belt_node12 {
  left: 24.5%;
  top: 34.1%;
}
.belt_node13 {
  left: 28%;
  top: 34.1%;
}
.belt_node14 {
  left: 28.9%;
  top: 34.1%;
}
.belt_node15 {
  left: 32.4%;
  top: 34.1%;
}
.belt_node16 {
  left: 33.3%;
  top: 34.1%;
}
.belt_node17 {
  left: 50.2%;
  top: 40.3%;
  height: 1.5%;
  width: 2.5%;
}
.belt_node18 {
  left: 50.2%;
  top: 43.1%;
  height: 1.5%;
  width: 2.5%;
}
.belt_node19 {
  left: 55.2%;
  top: 52%;
  height: 1.5%;
  width: 2.5%;
}
.belt_node20 {
  left: 55.2%;
  top: 54.5%;
  height: 1.5%;
  width: 2.5%;
}
.belt_node21 {
  left: 64.7%;
  top: 63.5%;
  height: 1.5%;
  width: 2.5%;
}
.belt_node22 {
  left: 64.7%;
  top: 66.4%;
  height: 1.5%;
  width: 2.5%;
}
.belt_node23 {
  left: 73.1%;
  top: 75.2%;
  height: 1.5%;
  width: 2.5%;
}
.belt_node24 {
  left: 73.1%;
  top: 78%;
  height: 1.5%;
  width: 2.5%;
}
.belt_node25 {
  left: 82.8%;
  top: 87%;
  height: 1.5%;
  width: 2.5%;
}
.belt_node26 {
  left: 82.8%;
  top: 89.3%;
  height: 1.5%;
  width: 2.5%;
}
.belt_node27 {
  left: 44.1%;
  top: 6.5%;
  height: 3.9%;
  width: 2%;
  border-radius: 50%;
  opacity: 0.4;
}
.belt_node28 {
  left: 1.2%;
  top: 46.5%;
  height: 3.9%;
  width: 2%;
  border-radius: 50%;
  opacity: 0.4;
}
.belt_node29 {
  left: 18.2%;
  top: 46.5%;
  height: 3.9%;
  width: 2%;
  border-radius: 50%;
  opacity: 0.4;
}
</style>
