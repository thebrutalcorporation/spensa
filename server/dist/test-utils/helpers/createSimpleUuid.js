"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createSimpleUuid = (value) => {
    const format = "00000000-0000-0000-0000-000000000000";
    const valueString = value.toString();
    return `${format.substring(0, format.length - valueString.length)}${valueString}`;
};
exports.default = createSimpleUuid;
//# sourceMappingURL=createSimpleUuid.js.map