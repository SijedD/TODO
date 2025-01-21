import { type Insertable, type Kysely, Transaction } from "kysely";
import { DB, Objectives } from "../../common/types/kysely/db.type";

type InsertableObjectivesRowType = Insertable<Objectives>;

export async function insert(con: Kysely<DB> | Transaction<DB>, entity: InsertableObjectivesRowType) {
    return await con.insertInto("objectives").returningAll().values(entity).executeTakeFirstOrThrow();
}