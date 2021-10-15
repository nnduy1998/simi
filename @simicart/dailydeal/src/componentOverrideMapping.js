/**
 * Mappings for overwrites
 * example: [`@magento/venia-ui/lib/components/Main/main.js`]: './lib/components/Main/main.js'
 */
module.exports = componentOverride = {
    [`@magento/venia-ui/lib/components/Header/header.js`]:'@simicart/dailydeal/src/override/Header/header.js',
    [`@magento/venia-ui/lib/components/Main/main.js`]:'@simicart/dailydeal/src/override/Main/main.js',
    [`@magento/venia-ui/lib/components/CategoryList/categoryList.js`]:'@simicart/dailydeal/src/override/CategoryList/categoryList.js',
};
