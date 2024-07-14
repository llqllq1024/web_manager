<script setup>

</script>

<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="submitInfo.type" placeholder="钱包类型" clearable class="filter-item" style="width: 110px">
        <el-option v-for="item in walletTypes" :key="item" :label="item" :value="item" />
      </el-select>
      <el-input v-model="submitInfo.number" placeholder="数量" type="number" style="width: 100px;margin-left: 10px;" class="filter-item" />
      <el-input v-model="submitInfo.pwd" placeholder="密码" type="password" style="width: 140px;margin-left: 10px;" class="filter-item" />
      <el-input v-model="submitInfo.project" placeholder="项目名称" style="width: 200px;margin-left: 10px;" class="filter-item" />
      <el-input v-model="submitInfo.remark" placeholder="备注（可选）" style="width: 200px;margin-left: 10px;" class="filter-item" />
      <el-button class="filter-item" type="primary" style="margin-left: 10px" icon="el-icon-download" :loading="submitLoading" @click="submit">
        提交
      </el-button>
    </div>
  </div>
</template>
<style scoped lang="scss">

</style>

<script>

import { crateEvmAddress } from '@/utils/evm-utils'

export default {
  name: 'ComplexTable',
  components: { },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      walletTypes: ['evm', 'sol', 'apt'],
      submitInfo: {
        type: '',
        number: '0',
        project: '',
        pwd: '',
        remark: ''
      },
      submitLoading: false
    }
  },
  created() {
    this.checkHeadlessModel()
  },
  methods: {
    checkHeadlessModel() {
      // 判断是否是隐身模式
      // 判断是否是隐身模式
      // 获取浏览器的User-Agent字符串
      const userAgent = navigator.userAgent

      // 检查User-Agent字符串中是否包含"Chrome"和"Chrome PDF Viewer"
      // 如果只有"Chrome"，则通常表示非无痕模式
      // 如果还有"Chrome PDF Viewer"，则很可能是在无痕模式下用于PDF阅读
      const handless_status = /Chrome/.test(userAgent) && /Chrome PDF Viewer/.test(userAgent)
      console.log(handless_status)
    },
    walletInputChange() {
      this.submitInfo.walletList = this.inputWallet.split('\n')
      this.walletLineHint = '共' + (this.walletList.length) + '行数据'
      this.submitInfo.walletList.forEach((item, index) => {
        if (item.trim().split(',').length < 2) {
          this.walletLineHint = '第' + (index + 1) + '行，格式错误'
        }
      })
      console.log(this.submitInfo.walletList)
    },
    submit() {
      console.log(this.submitInfo.walletList)
      if (this.submitInfo.type == null || this.submitInfo.type === '') {
        this.$alert('请选择钱包类型')
        return
      }
      if (this.submitInfo.pwd == null || this.submitInfo.pwd === '') {
        this.$alert('请输入密码')
        return
      }
      if (this.submitInfo.project == null || this.submitInfo.project === '') {
        this.$alert('请输入项目名称')
        return
      }
      // this.submitLoading = true
      crateEvmAddress()
    }
  }
}
</script>
