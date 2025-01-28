import { Kysely, Transaction } from "kysely";
import { DB } from "../../common/types/kysely/db.type";

export async function insertAccess(con: Kysely<DB> | Transaction<DB>, objective_id: string, user_id: string): Promise<void> {
    await con.insertInto("objective_access").values({ objective_id, user_id }).execute();
}

export async function findAccessRecord(con: Kysely<DB>, objectiveId: string, userId: string): Promise<{ id: string } | null> {
    return await con.selectFrom("objective_access").select("id").where("objective_id", "=", objectiveId).where("user_id", "=", userId).executeTakeFirst();
}

export async function accessExists(con: Kysely<DB> | Transaction<DB>, objectiveId: string, userId: string): Promise<boolean> {
    await con.selectFrom("objective_access").select("id").where("objective_id", "=", objectiveId).where("user_id", "=", userId).executeTakeFirst();
}

export async function revokeAccess(con: Kysely<DB> | Transaction<DB>, objectiveId: string, userId: string) {
    await con.deleteFrom("objective_access").where("objective_id", "=", objectiveId).where("user_id", "=", userId).execute();
}
