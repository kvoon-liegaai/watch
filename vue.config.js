module.exports = {
  productionSourceMap: false,
  publicPath: './',
  outputDir: 'dists',
  assetsDir: 'assets',
  css:{
    loaderOptions:{
      sass:{
        //全局变量等样式
        additionalData:`
          @import "@/assets/styles/const.scss";
        `
      }
    }
  },
  devServer: {
    proxy: {  //配置跨域
      '/api': {
        target: 'http://openapi.miwitracker.com',
        changOrigin: true,  //允许跨域
        // pathRewrite: {
        //   '^/v1/sessions': '' 
        // },
      },
    }
  }
}