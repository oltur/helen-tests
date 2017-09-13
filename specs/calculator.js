// spec.js
describe('Protractor Demo App', function () {
  var firstNumber = element(by.model('first'));
  var secondNumber = element(by.model('second'));
  var goButton = element(by.id('gobutton'));
  var latestResult = element(by.binding('latest'));
  var history = element.all(by.repeater('result in memory'));

  function add(a, b) {
    firstNumber.sendKeys(a.toString());
    secondNumber.sendKeys(b.toString());
    goButton.click();
  }

  beforeEach(function () {
    browser.get('http://juliemr.github.io/protractor-demo/');
  });

  it('should have a history', function () {
    for(const t in Array.from(Array(5).keys())) {
      add(t, parseInt(t)+1);
    }

    expect(history.count()).toEqual(5);

    expect(history.last().getText()).toContain('0 + 1');
  });

  it('should show an alert', () => {
    browser.executeScript('alert("alert")');
    var EC = protractor.ExpectedConditions;
    // Waits for an alert pops up.
    browser.wait(EC.alertIsPresent(), 5000);

    var alertDialog = browser.switchTo().alert();

    expect(alertDialog.getText()).toEqual("alert");
  });

});