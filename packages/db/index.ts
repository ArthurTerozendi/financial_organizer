import { Prisma as P, PrismaClient } from "@prisma/client";

declare global {
  var _prismaClient_: PrismaClient;
}

function getPrismaClient() {
  if (!global._prismaClient_) {
    global._prismaClient_ = new PrismaClient();
  }

  return global._prismaClient_;
}

export const Prisma = P;

export class Db {
  private static self: Db;

  static get instance() {
    if (!this.self) {
      this.self = new Db();
    }

    return this.self.ref;
  }
  
  private constructor(private ref: PrismaClient = getPrismaClient()) {}
}


export namespace Db {}