<template>
  <div class="box">
    <div class="head">
      <div class="logo_box"
           @click="$router.push({ name: 'home' })">
        <img src="~@/assets/img/logo.png"
             alt="" />
      </div>
      <h1 class="title"
          style="margin:0">HcoAladin 智慧云点巡检管理系统</h1>
      <div class="head_btn_l">
        <div class="screen_btn"
             @click="$router.push({ name: 'home' })">首页</div>
        <div class="screen_btn"
             @click="screenShow()">智能巡检</div>
        <div class="screen_btn"
             @click="screenShow()">无线检测</div>
      </div>
      <div class="head_btn_r">
        <div class="screen_btn"
             @click="screenShow()">资产盘点</div>
        <div class="screen_btn"
             @click="screenShow()">设备润滑</div>
        <div class="screen_btn"
             @click="screenShow()">全屏切换</div>
      </div>
      <div class="user_box">
        <el-dropdown :show-timeout="0"
                     placement="bottom">
          <span class="el-dropdown-link">
            <img v-if="purl !== ''"
                 @click=""
                 :src="purl"
                 :alt="userName" />
            <img v-else
                 @click=""
                 src="~@/assets/img/avatar.png"
                 :alt="userName" />

            {{ userName }}
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="updatePasswordHandle()"
                              style="color: #333">修改密码</el-dropdown-item>
            <el-dropdown-item @click.native="logoutHandle()"
                              style="color: #333">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import UpdatePassword from "./main-navbar-update-password";
import { clearLoginInfo } from "@/utils";
import Logo from "./main-logo";
export default {
  data () {
    return {
      neiceng: false,
      updatePassowrdVisible: false,
      logoVisible: false,
      updatePassowrdVisible: false,
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      type: "",
      purl: "",
      filelist: [],
      fullscreen: false, //全屏
    };
  },
  components: {
    UpdatePassword,
    UpdatePassword,
    Logo,
  },
  created () {
    this.getDataList();
    this.getPicList();
  },
  computed: {
    navbarLayoutType: {
      get () {
        return this.$store.state.common.navbarLayoutType;
      },
    },
    sidebarFold: {
      get () {
        return this.$store.state.common.sidebarFold;
      },
      set (val) {
        this.$store.commit("common/updateSidebarFold", val);
      },
    },
    mainTabs: {
      get () {
        return this.$store.state.common.mainTabs;
      },
      set (val) {
        this.$store.commit("common/updateMainTabs", val);
      },
    },
    userName: {
      get () {
        return this.$store.state.user.name;
      },
    },
    userId: {
      get () {
        return this.$store.state.user.id;
      },
    },
  },
  methods: {
    screenShow () {
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
    chagelogold () {
      this.neiceng = true;
    },

    // 获取数据列表
    getDataList () {
      this.$http({
        url: this.$http.adornUrl("/inspection/repairnews/list"),
        method: "get",
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          type: this.type,
          deviceName: this.deviceName,
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
    },

    deleteHandle (id) {
      var ids = id
        ? [id]
        : this.ListSelections.map((item) => {
          return item.id;
        });
      this.$confirm(`确定解绑?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl("/inspection/repairnews/delete"),
          method: "post",
          data: this.$http.adornData(ids, false),
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: "操作成功",
              type: "success",
              duration: 1500,
              onClose: () => {
                this.getDataList();
              },
            });
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val;
      this.getDataList();
    },

    // 修改密码
    updatePasswordHandle () {
      this.updatePassowrdVisible = true;
      this.$nextTick(() => {
        this.$refs.updatePassowrd.init();
      });
    },
    // 退出
    logoutHandle () {
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
        .catch(() => { });
    },
    chagelogo () {
      this.logoVisible = true;
      this.$nextTick(() => {
        this.$refs.Logo.init();
      });
    },
    getPicList () {
      this.filelist = [];
      this.$http({
        url: this.$http.adornUrl("/sys/userpic/list"),
        method: "get",
        params: this.$http.adornParams({
          userId: this.userId,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.fileList = data.piclist.map((item) => {
            item.name = item.url;
            item.url = this.$http.adornUrl(
              `/sys/userpic/pic.png?uuid=${item.url}`
            );
            this.purl = item.url;
            return item;
          });
        } else {
          this.fileList = [];
        }
      });
    },
  },
};
</script>
 
<style lang="scss">
.box {
  position: fixed;
  background: #04233c;
  width: 100%;
  height: 1.875rem;
  z-index: 920;
  // margin-top: 20px;
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
</style>