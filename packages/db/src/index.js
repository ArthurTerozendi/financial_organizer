"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Db = exports.Prisma = void 0;
const client_1 = require("@prisma/client");
function getPrismaClient() {
    if (!global._prismaClient_) {
        global._prismaClient_ = new client_1.PrismaClient();
    }
    return global._prismaClient_;
}
exports.Prisma = client_1.Prisma;
class Db {
    ref;
    static self;
    static get instance() {
        if (!this.self) {
            this.self = new Db();
        }
        return this.self.ref;
    }
    constructor(ref = getPrismaClient()) {
        this.ref = ref;
    }
}
exports.Db = Db;
