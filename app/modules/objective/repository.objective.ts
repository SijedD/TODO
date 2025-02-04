import { type Insertable, type Kysely, Transaction, Updateable } from "kysely";
import { DB, Objectives } from "../../common/types/kysely/db.type";
import { getOptionsSchema } from "./schemas/getOptions.schema";

type InsertableObjectivesRowType = Insertable<Objectives>;

export async function insert(con: Kysely<DB> | Transaction<DB>, entity: InsertableObjectivesRowType) {
    return await con.insertInto("objectives").returningAll().values(entity).executeTakeFirstOrThrow();
}

export async function findById(con: Kysely<DB> | Transaction<DB>, id: string) {
    return con.selectFrom("objectives").selectAll().where("id", "=", id).executeTakeFirst();
}

export async function update(con: Kysely<DB> | Transaction<DB>, id: string, entity: Updateable<Objectives>) {
    return await con
        .updateTable("objectives")
        .returningAll()
        .set({ ...entity, updatedAt: `now()` })
        .where("id", "=", id)
        .executeTakeFirst();
}

export async function findAllTasks(con: Kysely<DB> | Transaction<DB>, options: getOptionsSchema) {
    let query = con.selectFrom("objectives").selectAll();

    if (options.search) {
        query = query.where("title", "ilike", `%${options.search}%`);
    }

    if (options.isCompleted !== undefined) {
        query = query.where("objectives.isCompleted", "=", options.isCompleted);
    }

    query = query.orderBy(options.sortBy, options.order);

    query = query.limit(options.limit).offset(options.offset);

    return await query.execute();
}

export async function deleteObjective(con: Kysely<DB> | Transaction<DB>, id: string) {
    await con.deleteFrom("objectives").where("id", "=", id).execute();
}
