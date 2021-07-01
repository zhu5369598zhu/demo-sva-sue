<template>
<div>
  <div
    class="site-wrapper"
    :class="{ 'site-sidebar--fold': sidebarFold }"
    v-loading.fullscreen.lock="loading"
    element-loading-text="拼命加载中"
    v-show="homeRoter"
  >
    <template v-if="!loading">
      <main-navbar/>
      <main-sidebar/>
      <div
        class="site-content__wrapper"
        :style="{ 'min-height': documentClientHeight + 'px' }"
      >
        <main-content v-if="!homeRoter"/>
      </div>
    </template>
  </div>
  <div v-if="homeRoter"><main-content /></div>
</div>

</template>

<script>
import MainNavbar from "./main-navbar";
import MainSidebar from "./main-sidebar";
import MainContent from "./main-content";
export default {
  data() {
    return {
      loading: true,
      homeRoter: false,
    };
  },
  components: {
    MainNavbar,
    MainSidebar,
    MainContent,
  },
  computed: {
    documentClientHeight: {
      get() {
        return this.$store.state.common.documentClientHeight;
      },
      set(val) {
        this.$store.commit("common/updateDocumentClientHeight", val);
      },
    },
    sidebarFold: {
      get() {
        return this.$store.state.common.sidebarFold;
      },
    },
    userId: {
      get() {
        return this.$store.state.user.id;
      },
      set(val) {
        this.$store.commit("user/updateId", val);
      },
    },
    userName: {
      get() {
        return this.$store.state.user.name;
      },
      set(val) {
        this.$store.commit("user/updateName", val);
      },
    },
  },
  created() {
    this.getUserInfo();
  },
  mounted() {
        console.log(this.$route.path);
    if (this.$route.path == "/home") {
      this.homeRoter = true;
    }
    this.resetDocumentClientHeight();
  },
  methods: {
    resize() {
      this.documentClientHeight = document.documentElement["clientHeight"];
      console.log("documentClientHeight", this.documentClientHeight);
    },
    // 重置窗口可视高度
    resetDocumentClientHeight() {
      this.documentClientHeight = document.documentElement["clientHeight"];
      this.$nextTick(function () {
        if (window.addEventListener) {
          window.addEventListener("resize", this.resize, false);
        } else {
          window.attachEvent("onresize", this.resize);
        }
      });
    },
    // 获取当前管理员信息
    getUserInfo() {
      this.$http({
        url: this.$http.adornUrl("/sys/user/info"),
        method: "get",
        params: this.$http.adornParams(),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.loading = false;
          this.userId = data.user.userId;
          this.userName = data.user.username;
        }
      });
    },
  },
};
</script>
