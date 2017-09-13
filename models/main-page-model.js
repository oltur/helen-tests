"use strict";
class ProductCell {
    $getSpecificCompositeName(text) { return by.xpath('//b[text()="' + text + '"]'); }
    get $cashbackLabel() { return by.css('.BundleCashbakLabel'); }
    get $quantity() { return by.css('.Quantity'); }
    get $addBtnWrp() { return by.css('.AddBtnWrp'); }
    get $removeBtnWrp() { return by.css('.RemoveBtnWrp'); }
    get $simpleAdd() {return by.css('.Add'); }
}

class MainPageModel {
    constructor() {
        this.productCell = new ProductCell();
    }

    get $listTitle() { return by.id('ListTitle') };
    get $ngMspProductCell() { return by.css('.NgMspProductCell') };
    get $labelText() { return by.css('.LabelText'); }
    $getProductCell(productId) { return by.xpath('//li[@productid="' + productId + '"]'); }

    get productId() { return "productid"; }

}

exports.getInstance = () => new MainPageModel();