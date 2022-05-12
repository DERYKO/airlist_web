const path = require('path')

module.exports = {
    configureWebpack: {
        output: {
            libraryExport: 'default'
        },
        resolve: {
            alias: {
                'vue$': 'vue/dist/vue.esm.js', // 'vue/dist/vue.common.js' for webpack 1
                'Mixins': path.join(__dirname, './src/mixins'),
            }
        },

    }
}
