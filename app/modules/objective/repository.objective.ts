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

export function validateUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}

export async function findAllTasks(
    db: Kysely<DB> | Transaction<DB>,
    options: {
        search?: string;
        sortBy: string;
        order: string;
        limit: number;
        offset: number;
        is_completed?: boolean;
    }
) {
    let query = db
        .selectFrom('objectives')
        .selectAll();


    if (options.search) {
        query = query.where('title', 'ilike', `%${options.search}%`);
    }


    if (options.is_completed !== undefined) {
        query = query.where('is_completed', '=', options.is_completed);
    }


    query = query.orderBy(options.sortBy, options.order);


    query = query.limit(options.limit).offset(options.offset);


    const tasks = await query.execute();
    return tasks;
}
