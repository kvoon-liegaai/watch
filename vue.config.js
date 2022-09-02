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
}