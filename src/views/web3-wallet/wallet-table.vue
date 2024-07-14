<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="walletListQuery.address" placeholder="地址" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="walletListQuery.pwd" placeholder="密码" type="password" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="walletListQuery.project" placeholder="项目" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in projectList" :key="item.key" :label="item" :value="item" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="handleShowHide">
        显示/隐藏
      </el-checkbox>
    </div>
    <el-table
      :key="tableKey"
      :data="walletList"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="index" prop="index" sortable="custom" align="center" width="110px">
        <template slot-scope="{row}">
          <span>{{ row.index }}</span>
        </template>
      </el-table-column>
      <el-table-column label="address" min-width="200px">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showPublicKey" label="public_key" min-width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.publicKey }}</span>
        </template>
      </el-table-column>
      <el-table-column label="private_key" min-width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ showReviewer ? row.privateKey : '*****************************' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="phrase" min-width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ showReviewer ? row.phrase : '*****************************' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="project" width="80px">
        <template slot-scope="{row}">
          <span>{{ row.project }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

import { fetchProject, fetchWalletList } from '@/api/web3-wallet'
import waves from '@/directive/waves'

export default {
  name: 'ComplexTable',
  components: { },
  directives: { waves },
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
      showReviewer: false,
      tableKey: 0,
      isHeadless: false,
      showPublicKey: false,
      projectList: null,
      walletList: null,
      walletListQuery: {
        project: null,
        address: null,
        pwd: null
      },
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      downloadLoading: false
    }
  },
  created() {
    this.checkHeadlessModel()
    this.getProjects()
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
    getProjects() {
      // 获取项目列表
      this.listLoading = true
      fetchProject().then(response => {
        this.projectList = response.data
      })
    },
    getWalletList() {
      // 获取项目列表
      this.listLoading = true
      fetchWalletList(this.walletListQuery).then(response => {
        console.log(response.data)
        this.walletList = response.data
        this.total = response.data.total
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getWalletList()
    },
    handleShowHide() {
      if (this.showReviewer) {
        console.log(this.showReviewer)
      }
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['index', 'address', 'private', 'phrase', 'project']
        const filterVal = ['index', 'address', 'private', 'phrase', 'project']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'wallet-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.walletList.map(v => filterVal.map(j => {
        return v[j]
      }))
    }
  }
}
</script>
