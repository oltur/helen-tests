"use strict";
class PageUrlsModel {
    constructor() {
    }

    getProductPage(productId) { return `/product/${productId}`; }

    get myTopOffers() { return '/shelf/PersonalOffers_my_top_offers'; }

    get reviewCart() { return '/Checkout/ReviewCart.aspx'; }

}
exports.getInstance = () => new PageUrlsModel();
