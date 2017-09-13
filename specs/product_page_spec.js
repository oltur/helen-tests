"use strict";
var out = require('../tools/out.js').getInstance();
var until = require('selenium-webdriver').until;

var db = require('../tools/db.js').getInstance();

var loginModel = require('../models/login-model.js').getInstance();
var mainPageModel = require('../models/main-page-model.js').getInstance();
var pageUrls = require('../models/page-urls-model.js').getInstance();

describe('MSM site smoke test', function () {

  var testData = require('../json/test-data.json');
  var currentSpec;

  var context = {};
  var out = require('../tools/out.js').getInstance();
  var driver = browser.driver;
  var helpers = require('../tools/helpers.js').getInstance(browser, out, context);

  // #region shorthands
  // shorthands
  var c = context;
  var o = out;
  var b = browser;
  var d = driver;
  var h = helpers;
  // #endregion

  beforeEach(() => {
    out.group();
    d.ignoreSynchronization = true;
    h.logoutIfNeeded()
  });

  afterEach(() => {
    out.groupEnd();
  });

  // currentSpec = it('should get the Db versions', h.getHandler(currentSpec, (done) => {
  //   out.log(`Test name: '${currentSpec.description}'`);
  //   db.getData().then(data => {
  //     out.log("The FreedomSite version is: " + data);
  //     done()
  //   });
  // }));

  currentSpec = it('should login, open a Product page and use Go to store button', h.getHandler(currentSpec, (done) => {
    out.log(`Test name: 'should login, open a Product page and use Go to store button'`);
    h.login()
      .then(() => {
        return h.testProductPagesAndGoToStore(testData.goToStore.productIds, 0);
      })
      .then(() => done());
  }));

});