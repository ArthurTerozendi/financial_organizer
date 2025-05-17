import { Prisma as P, PrismaClient } from "@prisma/client";
declare global {
    var _prismaClient_: PrismaClient;
}
export declare const Prisma: typeof P;
export declare class Db {
    private ref;
    private static self;
    static get instance(): PrismaClient<P.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
    private constructor();
}
export declare namespace Db { }
