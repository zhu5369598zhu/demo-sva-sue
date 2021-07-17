<template>
  <div class="common-dept">
    <el-tree
      :data="wgList"
      :props="deptListTreeProps"
      node-key="idol_gateway"
      ref="deptListTree"
      :indent="12"
      @current-change="deptListTreeCurrentChangeHandle"
      :default-expand-all="false"
      :highlight-current="true"
      :expand-on-click-node="false">
    </el-tree>
  </div>
</template>

<script>
  import TableTreeColumn from '@/components/table-tree-column'
  import { treeDataTranslate } from '@/utils'
  export default {
    data () {
      return {
        dataForm: {
          name: ''
        },
        deptListLoading: false,
        deptListTreeProps: {
          label: 'IpAddress',
          children: 'children'
        },
      }
    },
    components: {
      TableTreeColumn
    },
    created ()
    {
      // console.log("创建TREE")
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.$http({
          url: this.$http.adornUrl('/olmonitoring/olgateway/tree'),
          method: 'get'
        }).then(({data}) => {
          this.wgList =data.tree_wg;

        })
      },
      // 部门树选中
      deptListTreeCurrentChangeHandle (data, node) {
        this.$emit('deptSelectEvent', data.Gw_ID)
      }
    },
    computed: {
      wgList:{
        get () { return this.$store.state.olwg.wgList },
        set (val) { this.$store.commit('olwg/updatewgList', val) }
      }
    }
}
</script>

<style>
  .common-dept {
    min-height: 300px;
    width: 100%;
    border-top: 1px solid #ebeef5;
  }
  .el-tree-node:focus>.el-tree-node__content{
    background-color: rgb(231, 247, 251);
  }
</style>
