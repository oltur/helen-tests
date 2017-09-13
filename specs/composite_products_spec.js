"use strict";
var until = require('selenium-webdriver').until;
var mainPage = require('../models/main-page-model.js').getInstance();
var pageUrls = require('../models/page-urls-model.js').getInstance();

var db = require('../tools/db.js').getInstance();

describe('MSM site composite products test', function () {

  var testData = require('../json/test-data.json');
  var currentSpec;

  var context = {};
  var out = require('../tools/out.js').getInstance();
  var driver = browser.driver;
  var browser2 = browser.forkNewDriverInstance(false, false);
  var driver2 = browser2.driver;
  var helpers = require('../tools/helpers.js').getInstance(browser, out, context);
  var helpers2 = require('../tools/helpers.js').getInstance(browser2, out, context);

  // #region shorthands
  // shorthands
  var c = context;
  var o = out;
  var b = browser;
  var d = driver;
  var b2 = browser2;
  var d2 = driver2;
  var h = helpers;
  var h2 = helpers2;
  // #endregion

  beforeEach(() => {
    o.group();
    d.ignoreSynchronization = true;
    d2.ignoreSynchronization = true;
    b.waitForAngularEnabled(false);
    b2.waitForAngularEnabled(false);
    d.get(h.getStartPage());
    d2.get(h2.getStartPage());
    h.logoutIfNeeded();
    h2.logoutIfNeeded();
    // h.logout()
    // h2.logout()
    // d.get(h.getStartPage());
    // d2.get(h2.getStartPage());
  });

  afterEach(() => {
    o.groupEnd();
  });

  currentSpec = it('should add composite to basket correctly', h.getHandler(currentSpec, (done) => {
    o.log(`Test name: '${currentSpec.description}'`);

    o.log(`Reading test data from DB`);
    db.getData(testData.db.csFreedomSite, 'select TOP 1 CompositeProductID, Name from DpnCompositeProduct order by CompositeProductID asc')
      .then(recordsets => {
        c.compositeId = recordsets[0][0]["CompositeProductID"];
        c.compositeText = recordsets[0][0]["Name"];

        return Promise.all([h.checkStartPage(), h2.checkStartPage()]);
      })
      .then(() => {
        o.log("In the beginning opening Product Page to hunt for composite parts");
        return d.get(h.getAbsoluteUrl(pageUrls.getProductPage(c.compositeId)))
      })
      .then(() => {
        o.log("Getting all product parts' cells");
        return d.findElements(mainPage.$ngMspProductCell);
      })
      .then((elems) => {
        o.log("Getting their productid attributes");
        c.partElements = elems;

        const promises = c.partElements.map(x => x.getAttribute(mainPage.productId));

        return Promise.all(promises);
      })
      .then(values => {
        o.log("Getting the values");

        const ids = values.map(x => parseInt(x));

        c.compositePartIds = ids;//[3738, 8794];
        //c.compositePartQuantities = { [3738]: 1, [8794]: 2 };

      })
      .then(() => {
        o.log("Getting all product parts' quantity labels");
        let promises = c.partElements.map(x => h2.findAndGetText(mainPage.$labelText, x));
        return Promise.all(promises);
      })
      .then(values => {
        o.log("Getting the values");

        const quantities = values.map(x => parseInt(x.substring(1)));

        let result = {};
        for (let i = 0; i < quantities.length; i++) {
          result[c.compositePartIds[i]] = quantities[i];
        }

        c.compositePartQuantities = result;
        delete c.partElements;
      })
      .then(() => {
        o.log("Opening My Top Offers");
        return d.get(h.getAbsoluteUrl(pageUrls.myTopOffers))
      })
      .then(() => {
        o.log(`Finding composite cell of #${c.compositeId}`);
        return h.findAndWaitForVisible(mainPage.$getProductCell(c.compositeId))
      })
      .then(productCell => {
        c.productCell = productCell;
        o.log(`Checking if composite has correct text of '${c.compositeText}'`);
        return h.findAndWaitForVisible(mainPage.productCell.$getSpecificCompositeName(c.compositeText), c.productCell);
      })
      .then(() => {
        o.log(`Checking if composite has cashback label`);
        return h.findAndWaitForVisible(mainPage.productCell.$cashbackLabel, c.productCell);
      })
      .then(() => {
        o.log("Finding composite Quantity element and getting its text");
        return h.findAndGetText(mainPage.productCell.$quantity, c.productCell, 1000)
          .then(quantity => {
            Promise.resolve(quanitity);
          },
          (error) => {
            Promise.resolve(0);
          });
      })
      .then(quantity => {
        o.log(`Saving composite quantity of ${quantity}`);
        c.quantity = parseInt(quantity);
      })
      .then(() => {
        return h2.getProductsDataFromBasket(c.compositePartIds);
      })
      .then(basketQuantities => {
        o.log(`Saving products quantities of composite parts ${JSON.stringify(basketQuantities)}`);
        c.basketQuantities = basketQuantities;
        return Promise.resolve(null);
      })
      .then(() => {
        o.log("Adding one more item of composite product to basket");
        return h.findAndClick(mainPage.productCell.$addBtnWrp, c.productCell, 1000)
          .then(() => {
            return Promise.resolve(null);
          },
          (error) => {
            // "+" noy found - maybe quantity is zero now? Press simple mode button
            return h.findAndClick(mainPage.productCell.$simpleAdd, c.productCell);
          });
      })
      .then(() => {
        o.log("Waiting a bit and Finding composite Quantity element and Getting its text again");
        d.sleep(3000);
        return h.findAndGetText(mainPage.productCell.$quantity, c.productCell)
          .then((quantity) => {
            return Promise.resolve(quantity);
          },
          (error) => {
            return Promise.resolve(0);
          });
      })
      .then(quantity => {
        o.log(`Comparing new composite quantity and old composite quantity plus one (${quantity} vs. ${c.quantity + 1})`);
        expect(parseInt(quantity)).toEqual(c.quantity + 1);

        o.log(`Updating composite quantity of ${quantity}`);
        c.quantity = parseInt(quantity);

        return Promise.resolve(true);
      })
      .then(() => {
        return h2.getProductsDataFromBasket(c.compositePartIds);
      })
      .then(quantities => {
        c.compositePartIds.forEach(element => {
          o.log(`Checking if #${element} quantity (${quantities[element]}) is old #${element} quantity plus ${c.compositePartQuantities[element]} (${parseInt(c.basketQuantities[element]) + c.compositePartQuantities[element]})`);
          expect(parseInt(quantities[element])).toEqual(parseInt(c.basketQuantities[element]) + c.compositePartQuantities[element]);
        })
      })
      .then(() => {
        o.log("Removing one item of composite product from basket");
        return h.findAndClick(mainPage.productCell.$removeBtnWrp, c.productCell);
      })
      .then(() => {
        o.log("Waiting a bit and Finding composite Quantity element and Getting its text again");
        d.sleep(3000);
        return h.findAndGetText(mainPage.productCell.$quantity, c.productCell)
      })
      .then(quantity => {
        o.log(`Comparing new composite quantity and old composite quantity minus one (${quantity} vs. ${c.quantity - 1})`);
        expect(parseInt(quantity)).toEqual(c.quantity - 1);
      })
      .then(() => done(),
      error => {
        throw new Error("Test failed. Reason: " + error)
      });
  }));
});