import { sql } from 'drizzle-orm';
import { db } from '../backend/src/db/connection';

// Invocado por el cron de Vercel (ver vercel.json) para que Supabase
// registre actividad y no pause el proyecto. `SELECT 1` no escribe nada.
export default async (req, res) => {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.authorization !== `Bearer ${secret}`) {
    return res.status(401).json({ ok: false });
  }

  try {
    await db.execute(sql`select 1`);
    return res.status(200).json({ ok: true, at: new Date().toISOString() });
  } catch (e) {
    console.log('Error en keepalive de la base de datos', e);
    return res.status(500).json({ ok: false });
  }
};
