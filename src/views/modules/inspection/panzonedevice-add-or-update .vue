<template>
  <el-dialog
    v-dialog-drag
    :title="'绑定'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body
  >
    <div>
      <DeviceZoneTree
        @TreeSelectEvent="treeSelectHandle"
        ref="trees"
        v-if="this.isDrawBack === false"
        :lineId="dataForm.panZoneId"
      ></DeviceZoneTree>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import DeviceZoneTree from "@/components/devicezone-tree";
export default {
  data() {
    return {
      dataForm: {
        key: "",
        select: "deviceName",
        deptId: 0,
        panZoneId: 0,
      },
      isDrawBack: false,
      drawBackClass: "el-icon-d-arrow-left",
      selectList: [
        { lable: "设备名称", value: "deviceName" },
        { lable: "设备编码", value: "deviceCode" },
      ],
      visible: false,
      deviceList: [],
      deviceListLoading: false,
      deviceListSelections: [],
      selectDeviceList: [],
    };
  },

  components: {
    DeviceZoneTree,
  },
  methods: {
    onDrawBack() {
      this.isDrawBack = !this.isDrawBack;
      if (this.isDrawBack) {
        this.oldPercent = this.curPercent;
        this.curPercent = 2.5;
        this.drawBackClass = "el-icon-d-arrow-right";
      } else {
        this.drawBackClass = "el-icon-d-arrow-left";
        this.curPercent = this.oldPercent;
      }
      this.$refs.splitPane.setPercent(this.curPercent);
    },
    treeSelectHandle(val) {
      // if (val.type === "device") {
      //   this.dataForm.deviceId = val.id;
      //   this.pageIndex = 1;
      // } else {
      //   this.dataForm.deviceId = 0;
      // }
    },
    rowStyle({ row, rowIndex }) {
      return "height:40px";
    },
    cellStyle() {
      return "padding:0";
    },
    init(deptId, panZoneId) {
      console.log(deptId);
      if (this.$refs.trees) {
        this.$refs.trees.getDeviceList(panZoneId);
      }
      this.dataForm.deptId = deptId;
      this.dataForm.panZoneId = panZoneId;
      this.visible = true;
      console.log("dataForm: %o", this.dataForm);
    },
    // 获取设备列表

    // 多选
    deviceSelectionChangeHandle(val) {
      this.deviceListSelections = val;
    },
    dataFormSubmit() {
      this.deviceListSelections = this.$refs.trees.$refs.tree.getCheckedNodes();
      let arr = [];
      this.deviceListSelections.forEach((item) => {
        if (!item.children) {
          arr.push(item.id);
        }
      });
      // return;
      if (this.deviceListSelections.length > 0) {
        this.visible = false;
        this.deviceList = [];
        this.$emit("DeviceBindEvent", arr);
        this.deviceListSelections = [];
      } else {
        this.$alert("您没有选中需要绑定的设备");
      }
    },
  },
   

  watch: {
    "dataForm.panZoneId": function (newVal, oldVal) {
      this.deviceList = [];
    },
  },
};
</script>
<style>
.el-select .el-input {
  width: 110px;
}
.query {
  margin-bottom: 15px;
}
</style>
