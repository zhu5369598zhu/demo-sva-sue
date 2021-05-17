<template>
  <el-dialog
    v-dialog-drag
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="盘点名称" prop="name">
      <el-input v-model="dataForm.name" placeholder="盘点名称" size="mini"></el-input>
    </el-form-item>
    <el-form-item label="盘点类型" prop="type">
      <el-select v-model="dataForm.type" placeholder="盘点类型" size="mini">
        <el-option
          v-for="item in TypeList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="所属机构" prop="deptName" v-if="dataForm.id == 0" >
      <el-popover
        ref="deptListPopover"
        placement="bottom-start"
        trigger="click"
        v-model="isShowDeptTree">
        <el-tree
          :data="deptList"
          :props="deptListTreeProps"
          node-key="deptId"
          ref="deptListTree"
          class="tree"
          @current-change="deptListTreeCurrentChangeHandle"
          :default-expand-all="false"
          :highlight-current="true"
          :expand-on-click-node="false">
        </el-tree>
      </el-popover>
      <el-input  v-model="dataForm.deptName" v-popover:deptListPopover :readonly="true" placeholder="点击选择所属机构" class="dept-list__input" size="mini"></el-input>
    </el-form-item>
       <el-form-item label="允许手动盘点" prop="isInspect">
            <el-switch v-model="dataForm.isInspect" placeholder="允许手动盘点" clearable style="width:140px;"></el-switch>
       </el-form-item>
       
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :disabled="isHttp">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { treeDataTranslate } from '@/utils'
  export default {
    data () {
      return {
        isHttp: false,
        visible: false,
        isShowDeptTree: false,
        deptList: [],
        TypeList: [{'id': 0, 'name': '扫码'}, {'id': 1, 'name': 'RFID'}],
        deptListTreeProps: {
          label: 'name',
          children: 'children'
        },
        dataForm: {
          id: 0,
          guid: '',
          name: '',
          type: '',
          deptId: 0,
          deptName: '',
          periodType: '',
          // periodTypeName: '',
          remark: '',
          createTime: '',
          updateTime: '',
          isInspect: '',
          orderNum: 0
        },
        dataRule: {
          name: [
            { required: true, message: '盘点计划不能为空', trigger: 'change' }
          ],
          type: [
            { required: true, message: '计划类型不能为空', trigger: 'change' }
          ],
          deptName: [
            { required: true, message: '所属机构不能为空', trigger: 'change' }
          ]
        }
      }
    },
    methods: {
       // 获取部门列表
      getDeptList () {
        this.$http({
          url: this.$http.adornUrl('/sys/dept/list'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.deptList = treeDataTranslate(data, 'deptId')
        })
      },
      init (id) {
         console.log(id)
        this.dataForm.id = id || 0
        this.visible = true
        this.isHttp = false
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/inspection/panline/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.guid = data.panLine.guid
                this.dataForm.name = data.panLine.name
                this.dataForm.type = data.panLine.type
                this.dataForm.deptId = data.panLine.deptId
                this.dataForm.deptName = data.panLine.deptName
                this.dataForm.isInspect = data.panLine.isInspect
                this.dataForm.remark = data.panLine.remark
                this.dataForm.createTime = data.panLine.createTime
                this.dataForm.updateTime = data.panLine.updateTime
                this.dataForm.orderNum = data.panLine.orderNum
                if(data.panLine.isInspect = 1){
                    this.dataForm.isInspect = true
                }else{
                   this.dataForm.isInspect = false
                }
              }
            })
          }
        })
      },
      // 部门树选中
      deptListTreeCurrentChangeHandle (data, node) {
        this.dataForm.deptId = data.deptId
        this.dataForm.deptName = data.name
        this.isShowDeptTree = false
      },
      // 部门树设置当前选中节点
      deptListTreeSetCurrentNode () {
        this.$refs.deptListTree.setCurrentKey(this.dataForm.deptId)
        this.dataForm.deptName = (this.$refs.deptListTree.getCurrentNode() || {})['name']
      },
      // 表单提交
      dataFormSubmit () {
        var isInspect = 0
        if(this.dataForm.isInspect ===true){
             isInspect = 1
        }else{
              isInspect = 0
        }
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.isHttp = true
            this.$http({
              url: this.$http.adornUrl(`/inspection/panline/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'guid': this.dataForm.guid,
                'name': this.dataForm.name,
                'type': this.dataForm.type,
                'deptId': this.dataForm.deptId,
                'isInspect': isInspect,
                'remark': this.dataForm.remark,
                'orderNum': this.dataForm.orderNum
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>
<style>
  .tree{
    overflow-y: scroll;
    width:280px;
    height: 200px;
  }
</style>
