// conf.js
exports.config = {
  framework: 'jasmine',
  seleniumAddress: 'http://localhost:4445/wd/hub',
  specs: [
    // 'specs/smoke_test_spec.js',
    // 'specs/product_page_spec.js',
    //'specs/composite_products_spec.js',
	'specs/calculator.js'
  ],
  multiCapabilities: [
    // {
    //   browserName: 'firefox'
    // },
    {
      browserName: 'chrome',
    }
  ],
  jasmineNodeOpts: {
    defaultTimeoutInterval: 300000,
    showColors: true,
    isVerbose: true

  }
}