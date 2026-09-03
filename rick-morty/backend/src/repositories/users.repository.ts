import { InsertUser, SelectUser, Users } from '../db/schema'
import { and, eq, sql } from 'drizzle-orm'
import { db } from '../db/connection'

export async function selectUsers(fields: Partial<InsertUser>): Promise<SelectUser[]> {
  try {
    const conditions: any[] = [];

    if (fields.id) conditions.push(eq(Users.id, `${fields.id}`));
    if (fields.email) conditions.push(eq(Users.email, fields.email));
    if (fields.name) conditions.push(eq(Users.name, fields.name))

    if (conditions.length > 0) {
      return db.select().from(Users).where(and(...conditions))
    } else {
      return db.select().from(Users);
    }
  } catch (e) {
    console.log('Error selecting clients at users repository', e);
    throw e;
  }
}

export async function createUser(user: InsertUser) {
  try {
    const [newUsuario] = await db.insert(Users).values(user).returning()

    return newUsuario
  } catch (e) {
    console.error(e); throw e
  }
}

export async function existsEmail(email: string) {
  try {
    const exists = await db.execute(
      sql`SELECT 1 FROM users WHERE email = ${email} LIMIT 1`
    )

    return exists.rows.length > 0;
  } catch (e) {
    console.error('Error pinging at bd', e)
    throw e
  }
}
