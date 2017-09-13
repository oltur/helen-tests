class LoginModel {
    constructor() {
    }

    get $iframeForm() { return by.id("iframeForm") };
    get $Email() { return by.id("Email") };
    get $PasswordLogin() { return by.id("PasswordLogin") };
    get $SignInButton() { return by.id("SignInButton") };
    get $ContinueButton() { return by.id("ContinueButton") };
    get $StartShoppingBtn() { return by.className("StartShoppingBtn") };
}
exports.getInstance = () => new LoginModel();