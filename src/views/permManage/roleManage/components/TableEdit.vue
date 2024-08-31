<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="500px" @close="close">
    <el-form ref="form" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="角色名" prop="roleName">
        <el-input v-model.trim="form.roleName" autocomplete="off" />
      </el-form-item>
      <template v-if="title == '编辑'">
        <el-form-item label="是否禁用" prop="roleIsDelete">
          <el-select v-model="form.roleIsDelete" placeholder="请选择是否禁用">
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
      </template>
      <tree-transfer
        :default-props="transferProps"
        :from_data="fromItemList"
        node_key="id"
        pid="parentId"
        :title="['未选择菜单', '已选择菜单']"
        :to_data="toItemList"
      />
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { editRole, getMenus } from '@/api/roleManage'
  import treeTransfer from 'el-tree-transfer'

  export default {
    name: 'TableEdit',
    components: {
      treeTransfer,
    },
    data() {
      return {
        form: {
          roleName: '',
          roleIsDelete: '',
          itemAddIds: [],
          itemRmIds: [],
        },
        rules: {
          roleName: [{ required: true, trigger: 'blur', message: '请输入角色名' }],
        },
        title: '',
        dialogFormVisible: false,
        userPhone: '',
        fromItemList: [],
        toItemList: [],
        itemAddIds: [],
        itemRmIds: [],
        toIds: [],
        transferProps: {
          label: 'title',
        },
      }
    },
    created() {},
    methods: {
      showEdit(row) {
        if (!row) {
          this.title = '添加'
        } else {
          this.title = '编辑'
          this.form = Object.assign({}, row)
          //将0 1转为字符串，防止提交时获取不到值
          this.form.roleIsDelete = row.roleIsDelete.toString()
        }
        this.fetchData()
        this.dialogFormVisible = true
      },
      close() {
        this.$refs['form'].resetFields()
        this.form = this.$options.data().form
        this.dialogFormVisible = false
        this.$emit('fetch-data')
      },
      save() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            const ids = []
            this.getIds(ids, this.toItemList)
            this.form.itemAddIds = ids

            const { msg } = await editRole(this.form)
            this.$baseMessage(msg, 'success')
            this.$refs['form'].resetFields()
            this.dialogFormVisible = false
            this.$emit('fetch-data')
            this.form = this.$options.data().form
          } else {
            return false
          }
        })
      },
      async fetchData() {
        const { data } = await getMenus(this.form)
        const { fromItems, toItems } = data
        this.fromItemList = fromItems ? fromItems : []
        this.toItemList = toItems ? toItems : []
      },
      getIds(ids, toData) {
        for (let item of toData) {
          ids.push(item.id)
          if (item.children.length > 0) {
            this.getIds(ids, item.children)
          }
        }
      },
    },
  }
</script>
