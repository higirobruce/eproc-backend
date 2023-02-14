"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sapLogin = exports.COOKIE = exports.SESSION_ID = void 0;
var config = {
    "CompanyDB": "Z_TEST_IREMBO_DB",
    "UserName": "manager",
    "Password": "K1g@li@123"
};
function sapLogin() {
    fetch('https://192.168.20.181:50000/b1s/v1/Login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(config)
    })
        .then((res) => __awaiter(this, void 0, void 0, function* () {
        let resJson = yield res.json();
        exports.SESSION_ID = resJson === null || resJson === void 0 ? void 0 : resJson.SessionId;
        exports.COOKIE = res.headers.get('set-cookie');
        console.log(resJson);
        console.log('Logged in', exports.SESSION_ID, exports.COOKIE);
    })).catch(err => {
        console.log(err);
    });
}
exports.sapLogin = sapLogin;
