import { type Insertable, type Kysely, Transaction } from "kysely";
import { DB, Objectives } from "../../common/types/kysely/db.type";
import {optionsSchema} from "./schemas/options.schema";


type InsertableObjectivesRowType = Insertable<Objectives>;

export async function insert(con: Kysely<DB> | Transaction<DB>, entity: InsertableObjectivesRowType) {
    return await con.insertInto("objectives").returningAll().values(entity).executeTakeFirstOrThrow();
}

export async function findById(con: Kysely<DB> | Transaction<DB>, id: string) {
    return con.selectFrom("objectives").selectAll().where("id", "=", id).executeTakeFirst();
}

export async function update(con: Kysely<DB> | Transaction<DB>, id: string, updatedObjective: any) {
    return con.updateTable("objectives").set(updatedObjective).where("id", "=", id)
        .returning(["id", "title", "description", "notifyAt", "isCompleted"])
        .executeTakeFirst();
}


export async function findAllTasks(con: Kysely<DB> | Transaction<DB>, options: optionsSchema) {
    let query = con
        .selectFrom('objectives')
        .selectAll();


    if (options.search) {
        query = query.where('title', 'ilike', `%${options.search}%`);
    }


    if (options.isCompleted !== undefined) {
        query = query.where('isCompleted', '=', options.isCompleted);
    }


    query = query.orderBy(options.sortBy, options.order);


    query = query.limit(options.limit).offset(options.offset);


    const tasks = await query.execute();
    return tasks;
}
