<script setup>

</script>

<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="submitInfo.pwd" placeholder="密码" type="password" style="width: 200px;" class="filter-item" />
      <el-input v-model="submitInfo.project" placeholder="项目名称" style="width: 200px;margin-left: 10px;" class="filter-item" />
      <el-input v-model="submitInfo.remark" placeholder="备注（可选）" style="width: 200px;margin-left: 10px;" class="filter-item" />
      <el-button class="filter-item" type="primary" style="margin-left: 10px" icon="el-icon-download" :loading="submitLoading" @click="submit">
        提交
      </el-button>
    </div>
    <el-input v-model="inputWallet" type="textarea" placeholder="格式：地址,私钥,助记词" :rows="20" style="width: 100%; margin-top: 10px;" class="filter-item" @input="walletInputChange" />
    <div>
      <span>{{ walletLineHint }}</span>
    </div>
  </div>
</template>
<style scoped lang="scss">

</style>

<script>

import { submitWalletList } from '@/api/web3-wallet'

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
      submitInfo: {
        project: '',
        pwd: '',
        remark: '',
        walletList: []
      },
      submitLoading: false,
      inputWallet: null,
      walletLineHint: ''
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
      if (this.submitInfo.pwd == null || this.submitInfo.pwd === '') {
        this.$alert('请输入密码')
        return
      }
      if (this.submitInfo.project == null || this.submitInfo.project === '') {
        this.$alert('请输入项目名称')
        return
      }
      if (this.submitInfo.walletList.length === 0) {
        this.$alert('请填写正确的钱包信息')
        return
      }
      this.submitLoading = true
      submitWalletList(this.submitInfo).then(response => {
        this.submitLoading = false
        this.inputWallet = ''
        this.submitInfo.project = ''
        this.submitInfo.pwd = ''
        this.submitInfo.remark = ''
        this.submitInfo.walletList = []
        this.$notify({
          title: '提醒',
          message: '钱包提交成功',
          duration: 1000
        })
      })
    }
  }
}
</script>
