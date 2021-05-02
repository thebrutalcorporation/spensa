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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmail = void 0;
const deep_email_validator_1 = __importDefault(require("deep-email-validator"));
const validateEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield deep_email_validator_1.default({
        email,
        validateRegex: true,
        validateMx: false,
        validateTypo: true,
        validateDisposable: true,
        validateSMTP: true,
    });
    return response;
});
exports.validateEmail = validateEmail;
//# sourceMappingURL=validateEmail.js.map