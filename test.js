const Mcp = require('./lib/mcp')

const mcp = new Mcp({appId: 1, secretKey: 'bbmCaaacHJnLTydddKrLLUGLddagYRA', endpoint: 'http://t03-api.xlmc.xunlei.com/api/'})


mcp.post('admin/op/common/enum/dataList', {type: 'user_type'}).then(res=>{console.log(res)})