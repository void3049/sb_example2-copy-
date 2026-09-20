/**
 * One-time data migration: replaces the single generic "Shenyang Mental
 * Health Center" placeholder row (and, on re-run, any earlier copies of
 * these same rows) with real Shenyang hospitals - name, English
 * translation, pinyin, and coordinates all sourced and cited directly (see
 * shenyang-hospitals-data.ts for the actual data and per-hospital source
 * notes).
 *
 * This file now contains ONLY the database logic (connect, delete,
 * insert) - the hospital data itself lives in shenyang-hospitals-data.ts,
 * a plain data file with no side effects, so it can be safely imported
 * elsewhere (e.g. by validate-shenyang-seed.ts) without accidentally
 * triggering the live database operation below.
 *
 * Run with: npm run seed-shenyang   (from mh_admin_server/)
 * Safe to re-run: it deletes any existing rows matching these exact
 * Chinese names (plus the old generic placeholder) before inserting, so
 * running it again just refreshes this list rather than creating
 * duplicates.
 */
import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import { inArray } from "drizzle-orm";
import postgres from "postgres";
import environments from "../src/environments";
import { hospitalsTable } from "../src/db/schema";
import { SHENYANG_HOSPITALS, TYPE_DEPARTMENT_DEFAULTS } from "./shenyang-hospitals-data";

const client = postgres(environments.DATABASE_URL as string);
const db = drizzle(client);

async function main() {
    const namesToClear = [
        "Shenyang Mental Health Center", // the original generic placeholder
        ...SHENYANG_HOSPITALS.map((h) => h.name),
    ];

    console.log("Removing any existing rows with these names (placeholder + this list)...");
    const removed = await db
        .delete(hospitalsTable)
        .where(inArray(hospitalsTable.name, namesToClear))
        .returning({ id: hospitalsTable.id });
    console.log(`Removed ${removed.length} row(s).`);

    console.log(`Inserting ${SHENYANG_HOSPITALS.length} real Shenyang hospitals...`);
    const inserted = await db
        .insert(hospitalsTable)
        .values(
            SHENYANG_HOSPITALS.map((hospital) => ({
                name: hospital.name,
                nameEn: hospital.nameEn,
                namePinyin: hospital.namePinyin,
                city: "Shenyang",
                district: hospital.district ?? null,
                department: hospital.department ?? TYPE_DEPARTMENT_DEFAULTS[hospital.type].department,
                specialty: hospital.specialty ?? TYPE_DEPARTMENT_DEFAULTS[hospital.type].specialty,
                address: null,
                addressEn: null,
                phone: null,
                website: null,
                verified: "needs verification",
                // Not a new guess - this just states the same reality the
                // legacy `verified` field above already recorded ("needs
                // verification") in the new three-state field instead.
                // None of these have been individually checked against a
                // primary source in person, so none get upgraded to
                // "partial" or "verified" here.
                verificationStatus: "unverified",
                type: hospital.type,
                services: hospital.services ?? [],
                latitude: hospital.latitude,
                longitude: hospital.longitude,
                isActive: true,
            }))
        )
        .returning({ id: hospitalsTable.id, name: hospitalsTable.name });

    inserted.forEach((row) => console.log(`  [${row.id}] ${row.name}`));
    console.log(`\nDone. Inserted ${inserted.length} hospital(s).`);
    await client.end();
}

main().catch((error) => {
    console.error("Seeding Shenyang hospitals failed:", error);
    process.exit(1);
});
