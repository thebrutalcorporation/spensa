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
const core_1 = require("@mikro-orm/core");
const mikro_orm_config_1 = __importDefault(require("./mikro-orm.config"));
const express_1 = __importDefault(require("express"));
require("dotenv-safe/config");
const apollo_server_express_1 = require("apollo-server-express");
const createSchema_1 = require("./utils/createSchema");
const ioredis_1 = __importDefault(require("ioredis"));
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const cors_1 = __importDefault(require("cors"));
const constants_1 = require("./constants");
const RedisStore = connect_redis_1.default(express_session_1.default);
const redis = new ioredis_1.default();
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const orm = yield core_1.MikroORM.init(mikro_orm_config_1.default);
    yield orm.getMigrator().up();
    const port = parseInt(process.env.PORT);
    const app = express_1.default();
    app.use(cors_1.default({
        origin: "http://localhost:3000",
        credentials: true,
    }));
    app.use(express_session_1.default({
        name: constants_1.COOKIE_NAME,
        cookie: {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
        },
        resave: false,
        saveUninitialized: false,
        secret: "supersecretkey2342",
        store: new RedisStore({
            client: redis,
            disableTouch: true,
        }),
    }));
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: yield createSchema_1.createSchema(),
        context: ({ req, res }) => ({ em: orm.em, req, res, redis }),
    });
    apolloServer.applyMiddleware({
        app,
        cors: false,
    });
    app.listen(port, () => {
        console.log(`Server running on port: ${port}`);
    });
});
main().catch((err) => console.log(err));
//# sourceMappingURL=index.js.map