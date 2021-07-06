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
      <div class="head_btn_l">
        <div class="screen_btn" @click="screenShow()">首页</div>
        <div class="screen_btn" @click="screenShow()">智能巡检</div>
        <div class="screen_btn" @click="screenShow()">无线检测</div>
      </div>
      <div class="head_btn_r">
        <div class="screen_btn" @click="screenShow()">资产盘点</div>
        <div class="screen_btn" @click="screenShow()">设备润滑</div>
        <div class="screen_btn" @click="screenShow()">全屏切换</div>
      </div>
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
            <el-dropdown-item
              @click.native="updatePasswordHandle()"
              style="color: #333"
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
      <div class="panel_box">
        <div class="data_item">
          <div class="tit">设备总数</div>
          <div class="data">
            <span class="txt1">{{ equipmentAll }}</span>
            台
          </div>
        </div>
        <div class="data_item">
          <div class="tit">故障台数</div>
          <div class="data">
            <span class="txt1">{{ equipmentMal }}</span>
            台
          </div>
        </div>
      </div>
      <div class="work_box">
        <div class="work_order">
          <div class="work_title">
            <img src="~@static/static/icon.png" alt="" /> <span>工单列表</span>
          </div>
          <div class="work_lsit">
            <div class="work_item">待受理： 56条</div>
            <div class="work_item">待上报： 36条</div>
            <div class="work_item">待审核： 23条</div>
          </div>
        </div>
        <div class="work_order">
          <div class="work_title"><img src="~@static/static/icon.png" alt="" /> <span>缺陷列表</span></div>
          <div class="work_lsit">
            <div class="work_item">填报缺陷： 56条</div>
            <div class="work_item">巡检异常： 36条</div>
          </div>
        </div>
      </div>
      <div class="maint">
        <div class="mt1">
          <div class="mt1bg"></div>
          <div class="tit_box">
            <div class="tit">
              <img src="~@static/static/icon.png" alt="" />
              <span>设备分布</span>
            </div>
            <div class="btn_box">
              <div
                @click="getDeviceGroupData('status')"
                class="titr_btn"
                :class="active6 == 'status' ? 'btnA' : ''"
              >
                状态
              </div>
              <div
                @click="getDeviceGroupData('level')"
                class="titr_btn"
                :class="active6 == 'level' ? 'btnA' : ''"
              >
                等级
              </div>
              <div
                @click="getDeviceGroupData('dept')"
                class="titr_btn"
                :class="active6 == 'dept' ? 'btnA' : ''"
              >
                部门
              </div>
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
            <div
              @click="getDataList('date')"
              key=""
              class="btn"
              :class="active == 'date' ? 'btnA' : ''"
            >
              <img src="~@static/static/s.png" alt="" />
              <span>本日</span>
            </div>
            <div
              @click="getDataList('week')"
              class="btn"
              :class="active == 'week' ? 'btnA' : ''"
            >
              <img src="~@static/static/s.png" alt="" />
              <span>本周</span>
            </div>
            <div
              @click="getDataList('month')"
              class="btn"
              :class="active == 'month' ? 'btnA' : ''"
            >
              <img src="~@static/static/s.png" alt="" />
              <span>本月</span>
            </div>
            <div
              @click="getDataList('year')"
              class="btn"
              :class="active == 'year' ? 'btnA' : ''"
            >
              <img src="~@static/static/s.png" alt="" />
              <span>本年</span>
            </div>
          </div>
          <div class="suspension1">
            <div id="inspectedDiv" class="data_box">{{ inspectedRate }}</div>
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
            <div id="missingInspectDiv" class="data_box">
              {{ missingInspectRate }}
            </div>
          </div>
          <div class="suspension3">
            <div id="absenceDiv" class="data_box">{{ absenceRate }}</div>
            <div class="tit_box">
              <span>缺勤率</span>
              <img class="img2" src="~@static/static/r_86.png" alt="" />
            </div>
          </div>
          <div class="suspension4">
            <div class="tit_box">
              <span>故障率</span>
              <img class="img2" src="~@static/static/r_86.png" alt="" />
            </div>
            <div id="missingInspect" class="data_box">{{ exceptionRate }}</div>
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
              <div
                @click="getAbnormalTrend('week')"
                class="titr_btn"
                :class="active1 == 'week' ? 'btnA' : ''"
              >
                周
              </div>
              <div
                @click="getAbnormalTrend('month')"
                class="titr_btn"
                :class="active1 == 'month' ? 'btnA' : ''"
              >
                月
              </div>
              <div
                @click="getAbnormalTrend('year')"
                class="titr_btn"
                :class="active1 == 'year' ? 'btnA' : ''"
              >
                年
              </div>
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
              <div
                @click="getCarryOut('week')"
                class="titr_btn"
                :class="active2 == 'week' ? 'btnA' : ''"
              >
                周
              </div>
              <div
                @click="getCarryOut('month')"
                class="titr_btn"
                :class="active2 == 'month' ? 'btnA' : ''"
              >
                月
              </div>
              <div
                @click="getCarryOut('year')"
                class="titr_btn"
                :class="active2 == 'year' ? 'btnA' : ''"
              >
                年
              </div>
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
              <div
                @click="getAbsent('week')"
                class="titr_btn"
                :class="active3 == 'week' ? 'btnA' : ''"
              >
                周
              </div>
              <div
                @click="getAbsent('month')"
                class="titr_btn"
                :class="active3 == 'month' ? 'btnA' : ''"
              >
                月
              </div>
              <div
                @click="getAbsent('year')"
                class="titr_btn"
                :class="active3 == 'year' ? 'btnA' : ''"
              >
                年
              </div>
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
              <div
                @click="getMissed('week')"
                class="titr_btn"
                :class="active4 == 'week' ? 'btnA' : ''"
              >
                周
              </div>
              <div
                @click="getMissed('month')"
                class="titr_btn"
                :class="active4 == 'month' ? 'btnA' : ''"
              >
                月
              </div>
              <div
                @click="getMissed('year')"
                class="titr_btn"
                :class="active4 == 'year' ? 'btnA' : ''"
              >
                年
              </div>
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
      dynamicMenuRoutes: [],
      menuC: false,
      inspectedRate: "",
      missingInspectRate: "",
      absenceRate: "",
      exceptionRate: "",
      active: "date",
      active1: "week",
      active2: "week",
      active3: "week",
      active4: "week",
      active6: "status",
      equipmentAll: "", //设备总数
      equipmentMal: "", //设备故障数
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
    userName: {
      get() {
        return this.$store.state.user.name;
      },
    },
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
    this.getDeviceData();
    this.getDeviceGroupData("status"); //分组设备环状图
    this.getAbnormalTrend("week"); //异常趋势
    this.getAbsent("week"); //缺勤周期
    this.getMissed("week"); //漏检周期
    this.getAbnormal(); //异常排名
    this.getCarryOut("week"); //完成率
    this.getDataList("date");
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
    getDeviceData() {
      this.$http({
        url: this.$http.adornUrl(
          "/dataAnalysis/homeDataAnalysis/getDeviceData"
        ),
        method: "get",
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.equipmentAll = data.data.deviceCount;
          this.equipmentMal = data.data.exceptionDeviceCount;
          this.drawDeviceDataChar(deviceData, deviceGroupName);
        } else {
        }
      });
    },
    getDeviceGroupData(flag) {
      this.active6 = flag;
      this.$http({
        url: this.$http.adornUrl(
          "/dataAnalysis/homeDataAnalysis/getGroupDeviceData"
        ),
        method: "get",
        params: this.$http.adornParams({
          flag: flag,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          var deviceData = data.data.series;
          var deviceGroupName = data.data.xAxis;
          this.drawDeviceDataChar(deviceData, deviceGroupName);
        } else {
        }
      });
    },
    drawDeviceDataChar(deviceData, deviceGroupName) {
      //设备状态
      var option = {
        tooltip: {
          trigger: "item",
        },
        legend: {
          bottom: "0%",
          left: "center",
          data: deviceGroupName,
          textStyle: {
            // color: '#24dcf7',
            color: "#ffffff",
          },
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: ["48%", "60%"],
            color: [
              "#b1b712",
              "#1dadff",
              "#24dcf7",
              "#c37a1c",
              "#1c8ac3",
              "#12b796",
            ],
            center: ["50%", "46%"],
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
            data: deviceData,
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
    getDataList(flag) {
      this.active = flag;
      //巡检看板
      this.$http({
        url: this.$http.adornUrl(
          "/dataAnalysis/homeDataAnalysis/inspectionBoardData"
        ),
        method: "get",
        params: this.$http.adornParams({
          //需要 本日 本周 本月 本年参数
          flag: flag,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.inspectedRate = data.data.inspectedRate;
          this.missingInspectRate = data.data.missingInspectRate;
          this.absenceRate = data.data.absenceRate;
          this.exceptionRate = data.data.exceptionRate;
        } else {
          return;
        }
      });
    },

    getAbnormal() {
      //异常排名
      this.$http({
        url: this.$http.adornUrl(
          "/dataAnalysis/homeDataAnalysis/getdeviceexception"
        ),
        method: "get",
        params: this.$http.adornParams({
          //
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          var deviceNameData = data.data.deviceName;
          var exceptionDeviceData = data.data.num;
          this.drawAbnormalChar(deviceNameData, exceptionDeviceData);
        } else {
          this.dataList = [];
          this.totalPage = 0;
        }
      });
    },
    drawAbnormalChar(deviceNameData, exceptionDeviceData) {
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
          bottom: "0%",
          top: "12%",
          containLabel: true,
        },
        xAxis: {
          show: false,
        },
        yAxis: {
          type: "category",
          data: deviceNameData,
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          offset: 150,
          axisLabel: {
            color: "#24dcf7",
            align: "left",
          },
        },
        series: [
          {
            name: "异常数",
            type: "bar",
            data: exceptionDeviceData,
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
        ],
      };
      this.abnormal = echarts.init(document.getElementById("abnormal"));
      this.abnormal.setOption(option);
      window.addEventListener("resize", () => {
        this.abnormal.resize();
      });
    },
    getAbnormalTrend(flag) {
      //异常趋势
      this.active1 = flag;
      this.$http({
        url: this.$http.adornUrl(
          "/dataAnalysis/homeDataAnalysis/deviceExceptionTrendData"
        ),
        method: "get",
        params: this.$http.adornParams({
          //需要  本周 本月 本年参数
          flag: flag,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          var xAxisData = data.data.xAxis;
          var seriesData = data.data.series;
          this.drawAbnormalTrendChar(xAxisData, seriesData);
        } else {
          return;
        }
      });
    },
    drawAbnormalTrendChar(xAxisData, seriesData) {
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
          data: ["设备异常"],
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
            name: "设备异常",
            type: "line",
            data: seriesData,
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

    getCarryOut(flag) {
      this.active2 = flag;
      //完成率趋势
      this.$http({
        url: this.$http.adornUrl(
          "/dataAnalysis/homeDataAnalysis/inspectedRateTrendData"
        ),
        method: "get",
        params: this.$http.adornParams({
          //需要 本周 本月 本年参数
          flag: flag,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          var xAxisData = data.data.xAxis;
          var seriesData = data.data.series;
          this.drawCarryOutChar(xAxisData, seriesData);
        } else {
          return;
        }
      });
    },
    drawCarryOutChar(xAxisData, seriesData) {
      var option = {
        // title: {
        //   text: '折线图堆叠'
        // },
        tooltip: {
          trigger: "axis",
          formatter: "{c}%",
        },
        legend: {
          right: 0,
          top: "10%",
          data: ["完成率"],
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
            name: "完成率",
            type: "line",
            data: seriesData,
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
      this.active3 = flag;
      //缺勤周期表
      this.$http({
        url: this.$http.adornUrl(
          "/dataAnalysis/homeDataAnalysis/inspectionAbsenceData"
        ),
        method: "get",
        async: false,
        params: this.$http.adornParams({
          //需要 本周 本月 本年参数
          flag: flag,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          var xAxisData = data.data.xAxis;
          var seriesData = data.data.series;
          this.drawAbsentChar(xAxisData, seriesData);
        } else {
          return;
        }
      });
    },
    drawAbsentChar(xAxisData, seriesData) {
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
            // show: false,
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
    getMissed(flag) {
      this.active4 = flag;
      //漏检周期
      this.$http({
        url: this.$http.adornUrl(
          "/dataAnalysis/homeDataAnalysis/missingInspectionData"
        ),
        method: "get",
        params: this.$http.adornParams({
          //需要 本周 本月 本年参数
          flag: flag,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          var xAxisData = data.data.xAxis;
          var seriesData = data.data.series;
          this.drawMissChar(xAxisData, seriesData);
        } else {
          return;
        }
      });
    },
    drawMissChar(xAxisData, seriesData) {
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
            // show: false,
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
      this.missed = echarts.init(document.getElementById("missed"));
      this.missed.setOption(option);
      window.addEventListener("resize", () => {
        this.missed.resize();
      });
    },
  },
};
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
  .head_btn_l {
    position: absolute;
    top: 0.0625rem;
    left: 8%;
    display: flex;
    align-items: center;
    .screen_btn {
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
      margin-right: 0.25rem;
      &:hover {
        transform: scale(1.1);
      }
    }
  }
  .head_btn_r {
    position: absolute;
    top: 0.0625rem;
    right: 8%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .screen_btn {
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
      margin-left: 0.25rem;
      &:hover {
        transform: scale(1.1);
      }
    }
  }
}

.main {
  min-width: 1024px;
  max-width: 1920px;
  margin-top: 0.75rem;
  position: relative;
  .panel_box {
    position: absolute;
    top: -1.25rem;
    width: 6.75rem;
    padding: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .data_item {
      width: 2.575rem;
      height: 1.4875rem;
      background: url(~@static/static/aaa.png) no-repeat center center;
      background-size: 100% 100%;
      padding: 0.2rem 0.125rem 0.25rem 0.2rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .tit {
        font-size: 0.25rem;
        color: #fff;
      }
      .data {
        font-size: 0.25rem;
        color: #fff;
        text-align: right;
        .txt1 {
          font-weight: bold;
          font-style: italic;
          font-size: 0.5375rem;
          color: #f6ac19;
          margin-right: 0.1rem;
        }
      }
    }
  }
  .work_box {
    position: absolute;
    top: -1.25rem;
    right: 0;
    width: 6.75rem;
    padding: 0.25rem;
  }
  .work_order {
    margin-bottom: 0.25rem;
    .work_title {
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
      margin-bottom: 0.2rem;
    }
    .work_lsit {
      display: flex;
      align-items: center;
      padding-left: 0.275rem;
      .work_item {
        font-size: 0.2rem;
        margin-right: 0.18rem;
        color: #24dcf7;
      }
    }
  }
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
  align-items: flex-end;
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
      top: 53.5%;
      transform: translate(-50%, -53.5%);
      animation: mt1bg 25s linear infinite;
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
          &.btnA {
            color: #fff;
          }
        }
      }
    }
    .mtbox {
      height: 3.5rem;
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
    height: 5.8rem;
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
        color: #1f9ecc;
        font-size: 0.2rem;
        transition: all 0.1s;
        span {
          color: #1f9ecc;
        }
        &.btnA {
          span {
            color: #fff;
          }
        }
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

    @keyframes suspension4 {
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
    .suspension4 {
      position: absolute;
      right: 7%;
      bottom: 6%;
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
          margin-top: -0.38rem;
          width: 1.5rem;
          height: auto;
          transform: rotateY(180deg) rotateX(180deg);
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
      height: 3.5rem;
      width: 100%;
    }
  }
}

.mainb {
  display: flex;
  padding: 0.25rem;
  .mbbox {
    flex: 1;
    height: 4rem;
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
          &.btnA {
            color: #fff;
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