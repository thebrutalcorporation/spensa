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
const connect_redis_1 = __importDefault(require("connect-redis"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const ioredis_1 = __importDefault(require("ioredis"));
const express_session_1 = __importDefault(require("express-session"));
const type_graphql_1 = require("type-graphql");
const constants_1 = require("./constants");
const orm_config_1 = __importDefault(require("./orm.config"));
const apollo_server_express_1 = require("apollo-server-express");
const transaction_1 = require("./resolvers/transaction");
const user_1 = require("./resolvers/user");
const Application = () => {
    let orm;
    let host;
    let apolloServer;
    let server;
    const getOrm = () => {
        return new Promise((resolve, reject) => {
            if (!orm) {
                reject();
            }
            resolve(orm);
        });
    };
    const getApolloServer = () => {
        return new Promise((resolve, reject) => {
            if (!apolloServer) {
                reject();
            }
            resolve(apolloServer);
        });
    };
    const connect = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            orm = yield core_1.MikroORM.init(orm_config_1.default);
            const migrator = orm.getMigrator();
            const migrations = yield migrator.getPendingMigrations();
            if (migrations && migrations.length > 0) {
                yield migrator.up();
            }
        }
        catch (error) {
            console.error("📌 Could not connect to the database", error);
            throw Error(error);
        }
    });
    const init = () => __awaiter(void 0, void 0, void 0, function* () {
        const RedisStore = connect_redis_1.default(express_session_1.default);
        const redis = new ioredis_1.default();
        host = express_1.default();
        host.use(cors_1.default({
            origin: "http://localhost:3000",
            credentials: true,
        }));
        try {
            host.use(express_session_1.default({
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
            apolloServer = new apollo_server_express_1.ApolloServer({
                schema: yield type_graphql_1.buildSchema({
                    resolvers: [transaction_1.TransactionResolver, user_1.UserResolver],
                    validate: false,
                }),
                context: ({ req, res }) => ({ em: orm.em, req, res, redis }),
            });
            apolloServer.applyMiddleware({
                app: host,
                cors: false,
            });
            if (process.env.NODE_ENV === "test") {
                server = host.listen(0);
                const { port } = server.address();
                console.log(`Listening on ${port}`);
            }
            else {
                server = host.listen(4000, () => {
                    console.log(`Server running on port: 4000`);
                });
            }
        }
        catch (error) {
            console.error("📌 Could not start server", error);
        }
    });
    return Object.freeze({
        init,
        connect,
        getOrm,
        getApolloServer,
    });
};
exports.default = Application;
//# sourceMappingURL=application.js.map