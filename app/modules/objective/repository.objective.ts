import { type Insertable, type Kysely, Transaction, Updateable } from "kysely";
import { DB, Objectives } from "../../common/types/kysely/db.type";
import { objectiveSchema } from "./schemas/objective.schema";
import { optionsSchema } from "./schemas/options.schema";

type InsertableObjectivesRowType = Insertable<Objectives>;

export async function insert(con: Kysely<DB> | Transaction<DB>, entity: InsertableObjectivesRowType) {
    return await con.insertInto("objectives").returningAll().values(entity).executeTakeFirstOrThrow();
}

export async function findById(con: Kysely<DB> | Transaction<DB>, id: string) {
    return con.selectFrom("objectives").selectAll().where("id", "=", id).executeTakeFirst();
}

export async function update(con: Kysely<DB> | Transaction<DB>, id: string, updatedObjective: Updateable<objectiveSchema>) {
    const existingObjective = await con.selectFrom("objectives").select(["id", "title", "description", "notifyAt", "isCompleted"]).where("id", "=", id).executeTakeFirst();

    const mergedObjective: Updateable<objectiveSchema> = {
        title: updatedObjective.title ?? existingObjective.title,
        description: updatedObjective.description ?? existingObjective.description,
        notifyAt: updatedObjective.notifyAt ?? existingObjective.notifyAt,
        isCompleted: updatedObjective.isCompleted ?? existingObjective.isCompleted
    };

    return con.updateTable("objectives").set(mergedObjective).where("id", "=", id).returning(["id", "title", "description", "notifyAt", "isCompleted"]).executeTakeFirst();
}

export async function findAllTasks(con: Kysely<DB> | Transaction<DB>, options: optionsSchema) {
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
