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
exports.clearDatabaseTable = void 0;
const clearDatabaseTable = (orm, entity) => __awaiter(void 0, void 0, void 0, function* () {
    const records = yield orm.em.find(entity, {});
    for (const record of records) {
        yield orm.em.remove(record);
    }
    yield orm.em.flush();
});
exports.clearDatabaseTable = clearDatabaseTable;
//# sourceMappingURL=clearDatabaseTable.js.map