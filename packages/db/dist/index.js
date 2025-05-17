import { Prisma as P, PrismaClient } from "@prisma/client";
function getPrismaClient() {
    if (!global._prismaClient_) {
        global._prismaClient_ = new PrismaClient();
    }
    return global._prismaClient_;
}
export const Prisma = P;
export class Db {
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
//# sourceMappingURL=index.js.map