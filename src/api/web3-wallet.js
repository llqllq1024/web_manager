import request from '@/utils/request'

export function fetchProject() {
  return request({
    url: 'http://127.0.0.1:5000/wallet/projects',
    method: 'get'
  })
}

export function fetchWalletList(data) {
  return request({
    url: 'http://127.0.0.1:5000/wallet/list',
    method: 'post',
    data
  })
}

export function submitWalletList(data) {
  return request({
    url: 'http://127.0.0.1:5000/wallet/insert',
    method: 'post',
    data
  })
}
