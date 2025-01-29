import { Kysely, Transaction } from "kysely";
import { DB } from "../../common/types/kysely/db.type";

export async function insertAccess(con: Kysely<DB> | Transaction<DB>, objective_id: string, user_id: string): Promise<void> {
    await con.insertInto("objective_access").values({ objective_id, user_id }).execute();
}

export async function findAccessRecord(con: Kysely<DB>, objectiveId: string, userId: string): Promise<{ id: string } | null> {
    return await con.selectFrom("objective_access").select("id").where("objective_id", "=", objectiveId).where("user_id", "=", userId).executeTakeFirst();
}

export async function accessExists(con: Kysely<DB> | Transaction<DB>, objectiveId: string, userId: string): Promise<boolean> {
    const record = await con.selectFrom("objective_access").select("id").where("objective_id", "=", objectiveId).where("user_id", "=", userId).executeTakeFirst();

    return !!record;
}

export async function revokeAccess(con: Kysely<DB> | Transaction<DB>, objectiveId: string, userId: string) {
    await con.deleteFrom("objective_access").where("objective_id", "=", objectiveId).where("user_id", "=", userId).execute();
}

export async function getAccessList(con: Kysely<DB>, objectiveId: string): Promise<{ user_id: string }[]> {
    return await con.selectFrom("objective_access").select("user_id").where("objective_id", "=", objectiveId).execute();
}

export async function getUserById(con: Kysely<DB>, userId: string): Promise<{ email: string } | null> {
    return await con.selectFrom("users").select("email").where("id", "=", userId).executeTakeFirst();
}
