module.exports = {
    chainWebpack: config => {
        const imageRule = config.module.rule('images');
        imageRule.uses.clear();
        imageRule.use('file-loader').loader('file-loader');
    }
};
