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
exports.populateLookupTables = void 0;
const Category_1 = require("./entities/Category");
const populateLookupTables = (orm) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield orm.em.find(Category_1.Category, {});
    if (categories.length > 0) {
        return;
    }
    try {
        const categories = [];
        for (const category in Category_1.CategoryName) {
            if (category.includes("SHARED")) {
                categories.push(orm.em.create(Category_1.Category, {
                    type: "income",
                    name: Category_1.CategoryName[category],
                }));
                categories.push(orm.em.create(Category_1.Category, {
                    type: "expense",
                    name: Category_1.CategoryName[category],
                }));
            }
            else if (category.includes("EXPENSE")) {
                categories.push(orm.em.create(Category_1.Category, {
                    type: "expense",
                    name: Category_1.CategoryName[category],
                }));
            }
            else if (category.includes("INCOME")) {
                categories.push(orm.em.create(Category_1.Category, {
                    type: "income",
                    name: Category_1.CategoryName[category],
                }));
            }
        }
        yield orm.em.persistAndFlush(categories);
    }
    catch (error) {
        console.error("📌 Could not populate the database", error);
        throw Error(error);
    }
});
exports.populateLookupTables = populateLookupTables;
//# sourceMappingURL=populateLookupTables.js.map