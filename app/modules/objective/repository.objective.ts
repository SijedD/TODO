import { type Insertable, type Kysely, Transaction } from "kysely";
import { DB, Objectives } from "../../common/types/kysely/db.type";


type InsertableObjectivesRowType = Insertable<Objectives>;

export async function insert(con: Kysely<DB> | Transaction<DB>, entity: InsertableObjectivesRowType) {
    return await con.insertInto("objectives").returningAll().values(entity).executeTakeFirstOrThrow();
}

export async function findById(con: any, id: string) {
    return con.selectFrom("objectives").selectAll().where("id", "=", id).executeTakeFirst();
}

export async function update(con: any, id: string, updatedObjective: any) {
    return con.updateTable("objectives").set(updatedObjective).where("id", "=", id)
        .returning(["id", "title", "description", "notifyAt", "isCompleted"])
        .executeTakeFirst();
}