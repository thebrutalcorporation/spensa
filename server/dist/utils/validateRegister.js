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
exports.validateRegister = void 0;
const validateEmail_1 = require("./validateEmail");
const validateRegister = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const { valid: isEmailValid } = yield validateEmail_1.validateEmail(options.email);
    if (!isEmailValid) {
        return [
            {
                field: "email",
                message: "invalid email",
            },
        ];
    }
    if (options.username.length <= 2) {
        return [
            {
                field: "username",
                message: "length must be greater than 2",
            },
        ];
    }
    if (options.username.includes("@")) {
        return [
            {
                field: "username",
                message: "cannot include an @",
            },
        ];
    }
    if (options.password.length <= 5) {
        return [
            {
                field: "password",
                message: "length must be at least 6 characters",
            },
        ];
    }
    return null;
});
exports.validateRegister = validateRegister;
//# sourceMappingURL=validateRegister.js.map