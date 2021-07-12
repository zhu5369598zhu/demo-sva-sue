<template>
  <nav class="site-navbar"
       :class="'site-navbar--' + navbarLayoutType">
    <div class="site-navbar__header">
      <h1 class="site-navbar__brand"
          @click="$router.push({ name: 'home' })">
        <!--<a  v-if="sidebarFold===false" class="site-navbar__brand-lg" href="javascript:;"></a>-->
        <a v-if="sidebarFold === false"
           class="site-navbar__brand-lg"
           href="javascript:;"><img style="height: 35px"
               src="../../static/img/logo.png" /></a>
        <a v-if="sidebarFold === true"
           class="site-navbar__brand-mini"
           href="javascript:;"><img style="height: 30px"
               src="../../static/img/tologo.png" />
          <!--巡检-->
        </a>
      </h1>
    </div>
    <div class="site-navbar__body clearfix">
      <el-menu class="site-navbar__menu"
               mode="horizontal">
        <el-menu-item class="site-navbar__switch"
                      index="0"
                      @click="sidebarFold = !sidebarFold">
          <icon-svg name="zhedie"></icon-svg>
          <span style="padding-left: 10px; font-size: 14px">HcoAladin 智慧云点巡检管理系统</span>
        </el-menu-item>
      </el-menu>
      <el-menu class="site-navbar__menu site-navbar__menu--right"
               mode="horizontal">
        <el-menu-item class="site-navbar__avatar"
                      index="3">
          <!-- 铃铛 -->
          <!-- 铃铛换了换地方 -->
          <div class="ld_box">
            <img src="~@/assets/img/ld.png"
                 @click="chagelogold()" />
            <div class="news">{{ totalPage }}</div>
          </div>
          <el-dropdown class="user_box"
                       :show-timeout="0"
                       placement="bottom">
            <div class="el-dropdown-link">
              <img v-if="purl !== ''"
                   @click="chagelogo()"
                   :src="purl"
                   :alt="userName" />
              <img v-else
                   @click="chagelogo()"
                   src="~@/assets/img/avatar.png"
                   :alt="userName" />

              {{ userName }}
            </div>

            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="updatePasswordHandle()">修改密码</el-dropdown-item>
              <el-dropdown-item @click.native="logoutHandle()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
      </el-menu>
    </div>
    <el-dialog title="提示"
               border
               v-dialog-drag
               :visible.sync="neiceng"
               append-to-body>
      <el-table ref="multipleTable"
                :data="dataList"
                tooltip-effect="dark"
                :border="true"
                style="width: 100%">
        <el-table-column label="序号"
                         type="index"
                         header-align="center"
                         align="center"
                         width="50">
        </el-table-column>
        <el-table-column prop="deviceName"
                         label="消息名称"> </el-table-column>
        <el-table-column prop="type"
                         label="检修类型"> </el-table-column>
        <el-table-column header-align="center"
                         align="center"
                         width="150"
                         label="操作">
          <template slot-scope="scope">
            <el-button type="text"
                       size="mini"
                       @click="deleteHandle(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
        <div align="right">
          <el-pagination @size-change="sizeChangeHandle"
                         @current-change="currentChangeHandle"
                         :current-page="pageIndex"
                         :page-sizes="[10, 20, 50, 100]"
                         :page-size="pageSize"
                         :total="totalPage"
                         layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
        </div>
      </el-table>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="neiceng = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 弹窗, 修改密码 -->
    <update-password v-if="updatePassowrdVisible"
                     ref="updatePassowrd"></update-password>
    <Logo v-if="logoVisible"
          ref="Logo"></Logo>
  </nav>
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

<style>
/* 直接从调试页面粘贴厉害 */
.user_box {
  display: flex;
  align-items: center;
}
.bangding_box {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.ld_box {
  width: 30px;
  height: 30px;
  display: inline-block;
  position: relative;
  margin-right: 25px;
}
.news {
  position: absolute;
  width: 18px;
  height: 18px;
  right: -3px;
  top: -3px;
  background: red;
  border-radius: 50%;
  color: #fff;
  line-height: 18px;
  text-align: center;
  font-size: 12px;
  border: 1px solid red;
}
.ld_box img {
  width: 100%;
  height: 100%;
  display: block;
}
/* .ld_dialog {
  z-index: 9999;
}
.el-dialog {
  z-index: 99999;
} */
</style>