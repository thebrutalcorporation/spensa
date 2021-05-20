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
exports.dropSchemaAndInitializeDb = void 0;
const dropSchemaAndInitializeDb = (orm) => __awaiter(void 0, void 0, void 0, function* () {
    yield orm.getSchemaGenerator().dropSchema(true, true);
    const migrator = orm.getMigrator();
    const migrations = yield migrator.getPendingMigrations();
    if (migrations && migrations.length > 0) {
        yield migrator.up();
    }
    yield orm.getSchemaGenerator().updateSchema();
});
exports.dropSchemaAndInitializeDb = dropSchemaAndInitializeDb;
//# sourceMappingURL=dropSchemaAndInitializeDb.js.map