import { Kysely, Transaction } from "kysely";
import { DB } from "../../common/types/kysely/db.type";

export async function insertAccess(con: Kysely<DB> | Transaction<DB>, objectiveId: string, userId: string): Promise<void> {
    await con.insertInto("user-objective-shares").values({ objectiveId, userId }).execute();
}

export async function findAccessRecord(con: Kysely<DB>, objectiveId: string, userId: string) {
    return await con.selectFrom("user-objective-shares").select("id").where("objectiveId", "=", objectiveId).where("userId", "=", userId).executeTakeFirst();
}

export async function accessExists(con: Kysely<DB> | Transaction<DB>, objectiveId: string, userId: string): Promise<boolean> {
    const record = await con.selectFrom("user-objective-shares").select("id").where("objectiveId", "=", objectiveId).where("userId", "=", userId).executeTakeFirst();
    return !!record;
}

export async function revokeAccess(con: Kysely<DB> | Transaction<DB>, objectiveId: string, userId: string) {
    await con.deleteFrom("user-objective-shares").where("objectiveId", "=", objectiveId).where("userId", "=", userId).execute();
}

export async function getAccessList(con: Kysely<DB>, objectiveId: string): Promise<{ userId: string }[]> {
    return await con.selectFrom("user-objective-shares").select("userId").where("objectiveId", "=", objectiveId).execute();
}

export async function getUserById(con: Kysely<DB>, userId: string) {
    return await con.selectFrom("users").select("email").where("id", "=", userId).executeTakeFirst();
}
