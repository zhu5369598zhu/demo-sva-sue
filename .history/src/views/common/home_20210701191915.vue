<!--  -->
<template>
  <div class="box">
    <div class="nav">
      <div class="change-type">
        <div class="type-left" :class="+'' + menuC ? 'showListType' : ' '">
          <ul>
            <li
              @click="gotoRouteHandle(item.list[0])"
              v-for="(item, index) in menuList"
              :key="index"
            >
              <a>{{ item.name }}</a
              ><span></span>
            </li>
          </ul>
        </div>
        <div class="type-right" @click="menuClick">
          <p><i class="el-icon-menu"></i>菜单</p>
        </div>
      </div>
    </div>
    <div class="head">
      <div class="logo_box">
        <img src="~@/assets/img/logo.png" alt="" />
      </div>
      <h1 class="title">HcoAladin 智慧云点巡检管理系统</h1>
      <div class="screen_btn" @click="screenShow()">全屏切换</div>
      <div class="user_box">
        <el-dropdown :show-timeout="0" placement="bottom">
          <span class="el-dropdown-link">
            <img v-if="purl !== ''" @click="" :src="purl" :alt="userName" />
            <img
              v-else
              @click=""
              src="~@/assets/img/avatar.png"
              :alt="userName"
            />

            {{ userName }}
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="updatePasswordHandle()" style="color: #333"
              >修改密码</el-dropdown-item
            >
            <el-dropdown-item @click.native="logoutHandle()" style="color: #333"
              >退出</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="main">
      <div class="maint">
        <div class="mt1">
          <div class="mt1bg"></div>
          <div class="tit_box">
            <div class="tit">
              <img src="~@static/static/icon.png" alt="" />
              <span>设备状态</span>
            </div>
          </div>
          <div class="mtbox" id="deviceStatus"></div>
        </div>
        <div class="mt2">
          <div class="bg1"></div>
          <div class="bg2"></div>
          <div class="bg3">
            <img src="~@static/static/sj.png" alt="" />
            <span>巡检看板</span>
          </div>
          <div class="bg4"></div>
          <div class="bg5"></div>
          <div class="btn_list">
            <div class="btn">
              <img src="~@static/static/s.png" alt="" />
              <span>本日</span>
            </div>
            <div class="btn">
              <img src="~@static/static/s.png" alt="" />
              <span>本周</span>
            </div>
            <div class="btn">
              <img src="~@static/static/s.png" alt="" />
              <span>本月</span>
            </div>
            <div class="btn">
              <img src="~@static/static/s.png" alt="" />
              <span>本年</span>
            </div>
          </div>
          <div class="suspension1">
            <div class="data_box">77%</div>
            <div class="tit_box">
              <span>完成率</span>
              <img class="img2" src="~@static/static/r_86.png" alt="" />
            </div>
          </div>
          <div class="suspension2">
            <div class="tit_box">
              <span>漏检率</span>
              <img class="img2" src="~@static/static/r_86.png" alt="" />
            </div>
            <div class="data_box">77%</div>
          </div>
          <div class="suspension3">
            <div class="data_box">77%</div>
            <div class="tit_box">
              <span>缺勤率</span>
              <img class="img2" src="~@static/static/r_86.png" alt="" />
            </div>
          </div>
        </div>
        <div class="mt3">
          <div class="tit_box">
            <div class="tit">
              <img src="~@static/static/icon.png" alt="" />
              <span>异常排名(TOP 5)</span>
            </div>
          </div>
          <div class="mtbox" id="abnormal"></div>
        </div>
      </div>
      <div class="mainb">
        <div class="mbbox">
          <div class="tit_box">
            <div class="tit">
              <img src="~@static/static/icon.png" alt="" />
              <span>设备异常趋势</span>
            </div>
            <div class="btn_box">
              <div class="titr_btn">周</div>
              <div class="titr_btn">月</div>
              <div class="titr_btn">年</div>
            </div>
          </div>
          <div class="cheart_box" id="abnormalTrend"></div>
        </div>
        <div class="mbbox">
          <div class="tit_box">
            <div class="tit">
              <img src="~@static/static/icon.png" alt="" />
              <span>巡检完成率趋势</span>
            </div>
            <div class="btn_box">
              <div class="titr_btn">周</div>
              <div class="titr_btn">月</div>
              <div class="titr_btn">年</div>
            </div>
          </div>
          <div class="cheart_box" id="carryOut"></div>
        </div>
        <div class="mbbox">
          <div class="tit_box">
            <div class="tit">
              <img src="~@static/static/icon.png" alt="" />
              <span>缺勤周期表</span>
            </div>
            <div class="btn_box">
              <div @click="getAbsent('week')" class="titr_btn">周</div>
              <div @click="getAbsent('month')" class="titr_btn">月</div>
              <div @click="getAbsent('year')" class="titr_btn">年</div>
            </div>
          </div>
          <div class="cheart_box" id="absent"></div>
        </div>
        <div class="mbbox">
          <div class="tit_box">
            <div class="tit">
              <img src="~@static/static/icon.png" alt="" />
              <span>漏检周期表</span>
            </div>
            <div class="btn_box">
              <div class="titr_btn">周</div>
              <div class="titr_btn">月</div>
              <div class="titr_btn">年</div>
            </div>
          </div>
          <div class="cheart_box" id="missed"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import "@static/static/flexible.js";
import $ from "jquery";
import { clearLoginInfo } from "@/utils";
export default {
  data() {
    return {
      deviceStatusLine: null, //设备状态
      abnormalTrend: null, //异常趋势
      absent: null, //缺勤周期
      missed: null, //漏检周期
      abnormal: null, //异常排名
      carryOut: null, //完成
      fullscreen: false, //全屏
      purl: "",
      userName: "用户名",
      dynamicMenuRoutes: [],
      menuC: false,
    };
  },
  created() {
    this.menuList = JSON.parse(sessionStorage.getItem("menuList") || "[]");
    this.dynamicMenuRoutes = JSON.parse(
      sessionStorage.getItem("dynamicMenuRoutes") || "[]"
    );
  },
  components: {},

  computed: {
    // userName: {
    //   get () { return this.$store.state.user.name }
    // },
    menuList: {
      get() {
        return this.$store.state.common.menuList;
      },
      set(val) {
        this.$store.commit("common/updateMenuList", val);
      },
    },
  },

  beforeCreate() {},

  mounted() {
    this.getDeviceStatus();//设备状态
    this.getAbnormalTrend();//异常趋势
    this.getAbsent();//缺勤周期
    this.getMissed();//漏检周期
    this.getAbnormal();//异常排名
    this.getCarryOut();//完成率

  },
  activated() {
    if (this.deviceStatusLine) {
      this.deviceStatusLine.resize();
    }
    if (this.abnormalTrend) {
      this.abnormalTrend.resize();
    }
    if (this.absent) {
      this.absent.resize();
    }
    if (this.missed) {
      this.missed.resize();
    }
    if (this.abnormal) {
      this.abnormal.resize();
    }
    if (this.carryOut) {
      this.carryOut.resize();
    }
  },

  methods: {

      updatePasswordHandle() {
      this.updatePassowrdVisible = true;
      this.$nextTick(() => {
        this.$refs.updatePassowrd.init();
      });
    },
    // 退出
    logoutHandle() {
      this.$confirm(`确定进行[退出]操作?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl("/sys/logout"),
            method: "post",
            data: this.$http.adornData(),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              clearLoginInfo();
              this.$router.push({ name: "login" });
            }
          });
        })
        .catch(() => {});
    },
    menuClick() {
      //菜单点击
      this.menuC = !this.menuC;
    },
    // 通过menuId与动态(菜单)路由进行匹配跳转至指定路由
    gotoRouteHandle(menu) {
      let route = this.dynamicMenuRoutes.filter(
        (item) => item.meta.menuId === menu.menuId
      );
      if (route.length < 1) {
        route = this.dynamicMenuRoutes.filter(
          (item) => item.meta.menuId === menu.list[0].menuId
        );
      }

      if (route.length >= 1) {
        this.$router.push({ name: route[0].name });
      }
    },
    screenShow() {
      //全屏方法
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    },
    async getDeviceStatus() { //设备状态
      let bdata = ''
      await this.$http({
        url: this.$http.adornUrl("/inspection/device/getDeviceStatus"),
        method: "get",
      }).then(({ data }) => {
        if (data && data.code === 0) {
          bdata = data.list[0]
        } else {
        }
      });
      console.log(bdata)
      //设备状态
      var option = {
        tooltip: {
          trigger: "item",
        },
        legend: {
          bottom: "5%",
          left: "center",
          data: ["总数", "运行", "备用", "检修", "其他"],
          textStyle: {
            // color: '#24dcf7',
            color: "#ffffff",
          },
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: ["36%", "45%"],
            color: [
              "#b1b712",
              "#1dadff",
              "#24dcf7",
              "#c37a1c",
              "#1c8ac3",
              "#12b796",
            ],
            center: ["50%", "43%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderWidth: 5, //间隔 不好使
              borderColor: "#fff",
            },

            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "40",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: bdata.sum, name: "总数" },
              { value: bdata.run, name: "运行" },
              { value: bdata.standby, name: "备用" },
              { value: bdata.overhaul, name: "检修" },
              { value: bdata.other, name: "其他" },
            ],
          },
        ],
      };
      this.deviceStatusLine = echarts.init(
        document.getElementById("deviceStatus")
      );
      this.deviceStatusLine.setOption(option);
      window.addEventListener("resize", () => {
        this.deviceStatusLine.resize();
      });
    },
   getDataList() {  //巡检看板
      this.$http({
        url: this.$http.adornUrl("/dataAnalysis/homeDataAnalysis/inspectionBoardData"),
        method: "get",
        params: this.$http.adornParams({
        //需要 本日 本周 本月 本年参数
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
         
        } else {
          
        }
      });
    },

    getAbnormal() { //异常排名
      this.$http({
        url: this.$http.adornUrl("/inspection/device/getexceptiontop"),
        method: "get",
        params: this.$http.adornParams({
          //
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list;
          this.totalPage = data.page.totalCount;
        } else {
          this.dataList = [];
          this.totalPage = 0;
        }
      });
      //异常排名
      var option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: 0,
          top: "20%",
          containLabel: true,
        },
        xAxis: {
          show: false,
        },
        yAxis: {
          type: "category",
          data: [
            "No.1 异常名称",
            "No.1 异常名称",
            "No.1 异常名称",
            "No.1 异常名称",
            "No.1 异常名称",
          ],
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: "#24dcf7",
          },
        },
        series: [
          {
            name: "2011年",
            type: "bar",
            data: [18203, 23489, 29034, 104970, 131744],
            showBackground: true,
            backgroundStyle: {
              color: "rgba(180, 180, 180, 0.2)",
            },
            barWidth: "15%",
            itemStyle: {
              normal: {
                color: "#24dcf7",
              },
            },
          },
          // {
          //   name: '2012年',
          //   type: 'bar',
          //   data: [19325, 23438, 31000, 121594, 134141, 681807]
          // }
        ],
      };
      this.abnormal = echarts.init(document.getElementById("abnormal"));
      this.abnormal.setOption(option);
      window.addEventListener("resize", () => {
        this.abnormal.resize();
      });
    },
    getAbnormalTrend() {
      //异常趋势

       this.$http({
        url: this.$http.adornUrl("/dataAnalysis/homeDataAnalysis/deviceExceptionTrendData"),
        method: "get",
        params: this.$http.adornParams({
           //需要  本周 本月 本年参数
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
        
        } else {
          
        }
      });
      var option = {
        // title: {
        //   text: '折线图堆叠'
        // },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          right: 0,
          top: "10%",
          data: ["邮件营销", "联盟广告"],
          textStyle: {
            color: "#fff",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          top: "30%",
          bottom: 0,
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月"],
          axisLabel: {
            color: "#fff",
            fontSize: "12",
          },
          axisLine: {
            lineStyle: {
              color: "rgba(215,215,255,.5)",
            },
          },
          axisTick: {
            show: false,
          },
        },
        yAxis: {
          type: "value",
          axisLine: {
            show: false,
          },
          axisLabel: {
            color: "#fff",
            fontSize: "12",
          },
          axisTick: {
            show: false,
            alignWithLabel: false,
          },
          splitLine: {
            lineStyle: {
              color: "#141e25",
              type: "dashed",
            },
          },
        },
        series: [
          {
            name: "邮件营销",
            type: "line",
            data: [120, 182, 101, 134, 90, 230, 210],
            lineStyle: {
              color: "#00FF00",
            },
          },
          {
            name: "联盟广告",
            type: "line",
            data: [220, 182, 191, 234, 290, 330, 310],
            lineStyle: {
              color: "#00FF00",
            },
          },
        ],
      };
      this.abnormalTrend = echarts.init(
        document.getElementById("abnormalTrend")
      );
      this.abnormalTrend.setOption(option);
      window.addEventListener("resize", () => {
        this.abnormalTrend.resize();
      });
    },

    getCarryOut() {
      //完成趋势
       this.$http({
        url: this.$http.adornUrl("/dataAnalysis/homeDataAnalysis/inspectedRateTrendData"),
        method: "get",
        params: this.$http.adornParams({
           //需要 本周 本月 本年参数
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
         
        } else {
         
        }
      });
      var option = {
        // title: {
        //   text: '折线图堆叠'
        // },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          right: 0,
          top: "10%",
          data: ["邮件营销", "联盟广告"],
          textStyle: {
            color: "#fff",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          top: "30%",
          bottom: 0,
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月"],
          axisLabel: {
            color: "#fff",
            fontSize: "12",
          },
          axisLine: {
            lineStyle: {
              color: "rgba(215,215,255,.5)",
            },
          },
          axisTick: {
            show: false,
          },
        },
        yAxis: {
          type: "value",
          axisLine: {
            show: false,
          },
          axisLabel: {
            color: "#fff",
            fontSize: "12",
          },
          axisTick: {
            show: false,
            alignWithLabel: false,
          },
          splitLine: {
            lineStyle: {
              color: "#141e25",
              type: "dashed",
            },
          },
        },
        series: [
          {
            name: "邮件营销",
            type: "line",
            data: [120, 182, 101, 134, 90, 230, 210],
            lineStyle: {
              color: "#00FF00",
            },
          },
          {
            name: "联盟广告",
            type: "line",
            data: [220, 182, 191, 234, 290, 330, 310],
            lineStyle: {
              color: "#00FF00",
            },
          },
        ],
      };
      this.carryOut = echarts.init(document.getElementById("carryOut"));
      this.carryOut.setOption(option);
      window.addEventListener("resize", () => {
        this.carryOut.resize();
      });
    },
    getAbsent(flag) {
      alert()
      var xAxisData;
      var seriesData;
      //缺勤周期表
       this.$http({
        url: this.$http.adornUrl("/dataAnalysis/homeDataAnalysis/inspectionAbsenceData"),
        method: "get",
        params: this.$http.adornParams({
          //需要 本周 本月 本年参数
          'flag' : flag
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(data)
          xAxisData = JSON.stringify(data.data.xAxis);
          seriesData = JSON.stringify(data.data.series);
          console.log(seriesData)
        } else {
          return
        }
      });
      var option = {
        color: ["#ffffff"],
        xAxis: {
          type: "category",
          data: xAxisData,
          axisLabel: {
            color: "#fff",
            fontSize: "12",
          },
          axisLine: {
            lineStyle: {
              color: "rgba(215,215,255,.5)",
            },
          },
          axisTick: {
            show: false,
          },
        },
        yAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "rgba(215,215,255,.5)",
            },
          },
          axisLabel: {
            color: "#fff",
            fontSize: "12",
            show: false,
          },
          axisTick: {
            show: false,
            alignWithLabel: false,
          },
          splitLine: {
            show: false,
          },
        },
        grid: {
          left: "0%",
          top: "25%",
          right: "0%",
          bottom: "0%",
          containLabel: true,
        },
        series: [
          {
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  1,
                  0,
                  0,
                  [
                    {
                      offset: 0,
                      color: "#021c33", // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "#24dcf7", // 100% 处的颜色
                    },
                  ],
                  false
                ),
              },
            },
            data: seriesData,
            type: "bar",
            barWidth: "20%",
          },
        ],
        tooltip: {
          show: true,
          trigger: "axis",
        },
      };
      this.absent = echarts.init(document.getElementById("absent"));
      this.absent.setOption(option);
      window.addEventListener("resize", () => {
        this.absent.resize();
      });
    },
    getMissed() {
      //漏检周期
       this.$http({
        url: this.$http.adornUrl("/dataAnalysis/homeDataAnalysis/missingInspectionData"),
        method: "get",
        params: this.$http.adornParams({
       //需要 本周 本月 本年参数
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
         
        } else {
       
        }
      });
      var option = {
        color: ["#ffffff"],
        xAxis: {
          type: "category",
          data: ["1月", "2月", "3月", "4月", "5月", "6月"],
          axisLabel: {
            color: "#fff",
            fontSize: "12",
          },
          axisLine: {
            lineStyle: {
              color: "rgba(215,215,255,.5)",
            },
          },
          axisTick: {
            show: false,
          },
        },
        yAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "rgba(215,215,255,.5)",
            },
          },
          axisLabel: {
            color: "#fff",
            fontSize: "12",
            show: false,
          },
          axisTick: {
            show: false,
            alignWithLabel: false,
          },
          splitLine: {
            show: false,
          },
        },
        grid: {
          left: "0%",
          top: "25%",
          right: "0%",
          bottom: "0%",
          containLabel: true,
        },
        series: [
          {
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  1,
                  0,
                  0,
                  [
                    {
                      offset: 0,
                      color: "#021c33", // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "#24dcf7", // 100% 处的颜色
                    },
                  ],
                  false
                ),
              },
            },
            data: [120, 200, 150, 80, 70, 110, 130],
            type: "bar",
            barWidth: "20%",
          },
        ],
        tooltip: {
          show: true,
          trigger: "axis",
        },
      };
      this.missed = echarts.init(document.getElementById("missed"));
      this.missed.setOption(option);
      window.addEventListener("resize", () => {
        this.missed.resize();
      });
    },
  },
};
// $(function () {
//   $(".type-right").click(function () {
//     console.log('菜单')
//     $(this).prev(".type-left").toggleClass("showListType");
//   });
//   $(".type-left ul li").click(function () {
//     $(this).addClass("active").siblings("li").removeClass("active");
//   });
// });
</script>

<style lang='scss' scoped>
@import "../../../static/static/datouwang.scss";
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  color: #fff;
}
.box {
  position: relative;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow-y: auto;
  background: url(~@static/static/bg.png) no-repeat top center;
  background-size: 100% 100%;
  line-height: 1.15;
}

.head {
  position: relative;
  width: 100%;
  height: 1.875rem;
  background: url(~@static/static/bt.png) no-repeat center center;
  background-size: 90% auto;
  .logo_box {
    top: -8px;
    left: 0;
    position: absolute;

    img {
      width: 124px;
      height: 63px;
    }
  }
  .user_box {
    position: absolute;
    right: 10px;
    top: 8px;
    img {
      width: 35px;
      height: 35px;
      border-radius: 50%;
    }
  }
  .title {
    text-align: center;
    height: 1.25rem;
    line-height: 1.25rem;
    color: #fff;
    font-size: 0.45rem;
  }

  .screen_btn {
    position: absolute;
    right: 25%;
    top: 0.0625rem;
    width: 1.25rem;
    height: 0.625rem;
    text-align: center;
    line-height: 0.625rem;
    margin-right: 0.1875rem;
    height: 0.5625rem;
    background: url(~@static/static/d.png) no-repeat;
    background-size: 100% 100%;
    cursor: pointer;
    display: flex;
    justify-content: center;
    padding: 0 0.125rem;
    align-items: center;
    color: #fff;
    font-size: 0.2rem;
    transition: all 0.1s;
    &:hover {
      transform: scale(1.1);
    }
  }
}

.main {
  min-width: 1024px;
  max-width: 1920px;
}

@keyframes mt1bg {
  0% {
    transform: translate(-50%, -50%) rotate(0);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

.maint {
  display: flex;
  height: 5.625rem;
  margin: 0 auto;
  margin-top: 0.375rem;
  .mt1 {
    flex: 2.5;
    padding: 0.25rem;
    position: relative;
    .mt1bg {
      width: 2.75rem;
      height: 2.75rem;
      background: url(~@static/static/q_15.png) no-repeat center center;
      background-size: 2.75rem 2.75rem;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      animation: mt1bg 25s linear infinite;
    }
    .tit_box {
      height: 0.625rem;
      background: url(~@static/static/icon1.png) no-repeat bottom center;
      background-size: 100% auto;
      .tit {
        display: flex;
        img {
          height: 0.25rem;
          width: 0.15rem;
          margin-right: 0.125rem;
        }
        span {
          font-size: 0.25rem;
          color: #fff;
        }
      }
    }
    .mtbox {
      height: 4.5rem;
      width: 100%;
    }
  }
  @keyframes bg2 {
    0% {
      transform: translate(-50%, -50%) rotate(0);
    }
    100% {
      transform: translate(-50%, -50%) rotate(360deg);
    }
    // 100% {
    //   transform: translate(-50%, -50%) rotate(0deg);
    // }
  }

  @keyframes bg3 {
    0% {
      transform: translate(-50%, -50%) scale(1);
    }
    50% {
      transform: translate(-50%, -50%) scale(1.1);
    }
    100% {
      transform: translate(-50%, -50%) scale(1);
    }
  }

  @keyframes bg3Img {
    0% {
      transform: translate(-50%, -50%) scale(1);
    }
    50% {
      transform: translate(-50%, -50%) scale(0.8);
    }
    100% {
      transform: translate(-50%, -50%) scale(1);
    }
  }
  .mt2 {
    flex: 4;
    // background: #ccc;
    position: relative;
    .bg1 {
      position: absolute;
      width: 100%;
      height: 100%;
      background: url(~@static/static/bj.png) no-repeat center center;
      background-size: 60% auto;
    }
    .bg2 {
      position: absolute;
      width: 8rem;
      height: 4.3rem;
      left: 50%;
      top: 55%;
      transform: translate(-50%, -50%);
      background: url(~@static/static/ty.png) no-repeat center center;
      background-size: 100% 100%;
      // animation: bg2 4s linear infinite;
    }
    .bg3 {
      position: absolute;
      height: 2.375rem;
      width: 2.1625rem;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      background: url(~@static/static/f.png) no-repeat center center;
      background-size: 100% 100%;
      animation: bg3 4s linear infinite;
      text-align: center;
      line-height: 2.375rem;
      font-size: 0.2rem;
      img {
        width: 1.25rem;
        height: 1.125rem;
        position: absolute;
        left: 50%;
        top: 55%;
        transform: translate(-50%, -50%);
        animation: bg3Img 4s linear infinite;
      }
    }
    .bg4 {
      position: absolute;
      width: 1.2875rem;
      height: 100%;
      left: 0;
      top: 0;
      background: url(~@static/static/L.png) no-repeat left top;
      background-size: 100% 100%;
    }
    .bg5 {
      position: absolute;
      width: 1.2875rem;
      height: 100%;
      right: 0;
      top: 0;
      background: url(~@static/static/R.png) no-repeat right top;
      background-size: 100% 100%;
    }

    .btn_list {
      width: 6.25rem;
      margin: 0 auto;
      display: flex;
      position: relative;
      z-index: 99;
      margin-top: -0.25rem;
      .btn {
        flex: 1;
        margin-right: 0.1875rem;
        height: 0.5625rem;
        background: url(~@static/static/d.png) no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
        display: flex;
        justify-content: center;
        padding: 0 0.125rem;
        align-items: center;
        color: #fff;
        font-size: 0.2rem;
        transition: all 0.1s;
        &:hover {
          transform: scale(1.1);
        }
        img {
          width: 0.25rem;
          height: 0.25rem;
          margin-right: 0.0625rem;
        }
        &:last-child {
          margin: 0;
        }
      }
    }

    @keyframes suspension1 {
      0% {
        transform: translateY(9%);
      }
      50% {
        transform: translateY(19%);
      }
      100% {
        transform: translateY(9%);
      }
    }

    @keyframes suspension2 {
      0% {
        transform: translateY(19%);
      }
      50% {
        transform: translateY(9%);
      }
      100% {
        transform: translateY(19%);
      }
    }

    @keyframes suspension3 {
      0% {
        transform: translateY(12%);
      }
      50% {
        transform: translateY(0%);
      }
      100% {
        transform: translateY(12%);
      }
    }

    .suspension1 {
      position: absolute;
      left: 12%;
      top: 9%;
      display: flex;
      animation: suspension1 3s linear infinite;
      .data_box {
        width: 0.75rem;
        height: 0.75rem;
        margin-right: 0.0625rem;
        text-align: center;
        line-height: 0.75rem;
        background: url(~@static/static/q.png) no-repeat;
        background-size: 100% 100%;
      }
      .tit_box {
        color: #27caff;
        display: flex;
        flex-direction: column;
        margin-top: 0.125rem;
        .img2 {
          margin-top: 0.0625rem;
          width: 1.5rem;
          height: auto;
        }
      }
    }

    .suspension2 {
      position: absolute;
      right: 9%;
      top: 19%;
      display: flex;
      animation: suspension2 3s linear infinite;
      .data_box {
        width: 0.75rem;
        height: 0.75rem;

        text-align: center;
        line-height: 0.75rem;
        background: url(~@static/static/q.png) no-repeat;
        background-size: 100% 100%;
      }
      .tit_box {
        color: #27caff;
        display: flex;
        flex-direction: column;
        margin-top: 0.125rem;
        text-align: right;
        margin-right: 0.0625rem;
        .img2 {
          margin-top: 0.0625rem;
          width: 1.5rem;
          height: auto;
          transform: rotateY(180deg);
        }
      }
    }

    .suspension3 {
      position: absolute;
      left: 12%;
      bottom: 12%;
      display: flex;
      animation: suspension3 3s linear infinite;
      .data_box {
        width: 0.75rem;
        height: 0.75rem;
        margin-right: 0.0625rem;
        text-align: center;
        line-height: 0.75rem;
        background: url(~@static/static/q.png) no-repeat;
        background-size: 100% 100%;
      }
      .tit_box {
        color: #27caff;
        display: flex;
        flex-direction: column;
        margin-top: 0.125rem;
        .img2 {
          margin-top: -0.375rem;
          width: 1.5rem;
          height: auto;
          transform: rotateX(180deg);
        }
      }
    }
  }
  .mt3 {
    flex: 2.5;
    padding: 0.25rem;
    .tit_box {
      height: 0.625rem;
      background: url(~@static/static/icon1.png) no-repeat bottom center;
      background-size: 100% auto;
      .tit {
        display: flex;
        img {
          height: 0.25rem;
          width: 0.15rem;
          margin-right: 0.125rem;
        }
        span {
          font-size: 0.25rem;
          color: #fff;
        }
      }
    }
    .mtbox {
      height: 4.5rem;
      width: 100%;
    }
  }
}

.mainb {
  display: flex;
  padding: 0.25rem;
  .mbbox {
    flex: 1;
    height: 5rem;
    margin-right: 0.25rem;
    &:last-child {
      margin-right: 0;
    }
    .tit_box {
      height: 0.625rem;
      background: url(~@static/static/icon1.png) no-repeat bottom center;
      background-size: 100% auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .tit {
        display: flex;
        img {
          height: 0.25rem;
          width: 0.15rem;
          margin-right: 0.125rem;
        }
        span {
          font-size: 0.25rem;
          color: #fff;
        }
      }
      .btn_box {
        display: flex;
        .titr_btn {
          background: #331f33;
          text-align: center;
          height: 0.35rem;
          width: 0.75rem;
          margin-right: 0.0625rem;
          line-height: 0.35rem;
          border: 1px solid #1f9ecc;
          color: #1f9ecc;
          cursor: pointer;
          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
    .cheart_box {
      height: 4.375rem;
      width: 100%;
    }
  }
}
</style>