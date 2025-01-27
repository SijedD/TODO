import { type Insertable, type Kysely, Transaction } from "kysely";
import { DB, Objectives } from "../../common/types/kysely/db.type";
import { getOptionsSchema } from "./schemas/getOptions.schema";
import { updateObjectiveSchema } from "./schemas/updateObjective.schema";

type InsertableObjectivesRowType = Insertable<Objectives>;

export async function insert(con: Kysely<DB> | Transaction<DB>, entity: InsertableObjectivesRowType) {
    return await con.insertInto("objectives").returningAll().values(entity).executeTakeFirstOrThrow();
}

export async function findById(con: Kysely<DB> | Transaction<DB>, id: string) {
    return con.selectFrom("objectives").selectAll().where("id", "=", id).executeTakeFirst();
}

export async function update(con: Kysely<DB> | Transaction<DB>, id: string, updatedObjective: updateObjectiveSchema) {
    return await con
        .updateTable("objectives")
        .returningAll()
        .set({ ...updatedObjective, updatedAt: `now()` })
        .where("id", "=", id)
        .executeTakeFirst();
}

export async function findAllTasks(con: Kysely<DB> | Transaction<DB>, options: getOptionsSchema) {
    const sortBy = options.sortBy ?? "createdAt";
    const order = options.order ?? "asc";

    let query = con.selectFrom("objectives").selectAll();

    if (options.search) {
        query = query.where("title", "ilike", `%${options.search}%`);
    }

    if (options.isCompleted !== undefined) {
        query = query.where("isCompleted", "=", options.isCompleted);
    }

    query = query.orderBy(sortBy, order);

    query = query.limit(options.limit ?? 10).offset(options.offset ?? 0);

    const tasks = await query.execute();
    return tasks;
}

export async function deleteObjective(con: Kysely<DB> | Transaction<DB>, id: string) {
    await con.deleteFrom("objectives").where("id", "=", id).execute();
}
