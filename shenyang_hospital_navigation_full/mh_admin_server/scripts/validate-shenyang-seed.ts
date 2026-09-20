/**
 * Local, read-only validation for SHENYANG_HOSPITALS in
 * seed-shenyang-hospitals.ts - checks the data BEFORE it's ever sent to
 * a database. Run with: npx tsx scripts/validate-shenyang-seed.ts
 *
 * Does not touch the network or any database - pure in-memory checks.
 */
import { SHENYANG_HOSPITALS } from "./shenyang-hospitals-data";

let failures = 0;
function check(label: string, pass: boolean, detail?: string) {
    const icon = pass ? "✅" : "❌";
    console.log(`${icon} ${label}${detail ? ` - ${detail}` : ""}`);
    if (!pass) failures++;
}

// 1. Exact expected count.
const EXPECTED_TOTAL = 50; // 23 original + 27 newly added (verified count, not the initially-targeted 30 - see report)
check(
    `Exactly ${EXPECTED_TOTAL} total Shenyang seed objects`,
    SHENYANG_HOSPITALS.length === EXPECTED_TOTAL,
    `found ${SHENYANG_HOSPITALS.length}`
);

// 2. Unique normalized names (trim + collapse whitespace).
function normalize(name: string) {
    return name.trim().replace(/\s+/g, "");
}
const nameCounts = new Map<string, number>();
for (const h of SHENYANG_HOSPITALS) {
    const n = normalize(h.name);
    nameCounts.set(n, (nameCounts.get(n) ?? 0) + 1);
}
const dupeNames = [...nameCounts.entries()].filter(([, count]) => count > 1);
check(
    `${SHENYANG_HOSPITALS.length} unique normalized hospital names`,
    dupeNames.length === 0,
    dupeNames.length ? `duplicates: ${dupeNames.map(([n, c]) => `${n} (x${c})`).join(", ")}` : undefined
);

// 3. No null/undefined/NaN latitude or longitude.
const missingLat = SHENYANG_HOSPITALS.filter((h) => h.latitude == null || Number.isNaN(h.latitude));
check("No null latitude", missingLat.length === 0, missingLat.map((h) => h.name).join(", "));
const missingLng = SHENYANG_HOSPITALS.filter((h) => h.longitude == null || Number.isNaN(h.longitude));
check("No null longitude", missingLng.length === 0, missingLng.map((h) => h.name).join(", "));

// 4. Latitude/longitude within valid global ranges.
const badLatRange = SHENYANG_HOSPITALS.filter((h) => h.latitude < -90 || h.latitude > 90);
check("All latitudes within [-90, 90]", badLatRange.length === 0, badLatRange.map((h) => h.name).join(", "));
const badLngRange = SHENYANG_HOSPITALS.filter((h) => h.longitude < -180 || h.longitude > 180);
check("All longitudes within [-180, 180]", badLngRange.length === 0, badLngRange.map((h) => h.name).join(", "));

// 5. Coordinates plausibly around Shenyang/Liaoning - Liaoning province
// spans roughly lat 38.7-43.5, lng 118.8-125.8. Kangping County (the
// northernmost entry here) sits near the top of that range.
const SHENYANG_LIAONING_BOUNDS = { minLat: 38.5, maxLat: 43.6, minLng: 118.5, maxLng: 126.0 };
const outOfRegion = SHENYANG_HOSPITALS.filter(
    (h) =>
        h.latitude < SHENYANG_LIAONING_BOUNDS.minLat ||
        h.latitude > SHENYANG_LIAONING_BOUNDS.maxLat ||
        h.longitude < SHENYANG_LIAONING_BOUNDS.minLng ||
        h.longitude > SHENYANG_LIAONING_BOUNDS.maxLng
);
check(
    "All coordinates plausibly within Liaoning/Shenyang region",
    outOfRegion.length === 0,
    outOfRegion.map((h) => `${h.name} (${h.latitude}, ${h.longitude})`).join(", ")
);

// 6. No duplicate coordinates, UNLESS they genuinely represent
// different campuses of the same named institution (allowed by
// checking whether the hospital names share a common "base name" -
// here, approximated by requiring an exact coordinate match to also
// have overlapping name text; anything else is flagged for review).
const coordMap = new Map<string, string[]>();
for (const h of SHENYANG_HOSPITALS) {
    const key = `${h.latitude.toFixed(5)},${h.longitude.toFixed(5)}`;
    coordMap.set(key, [...(coordMap.get(key) ?? []), h.name]);
}
const coordDupes = [...coordMap.entries()].filter(([, names]) => names.length > 1);
check(
    "No duplicate coordinates across different-named hospitals",
    coordDupes.length === 0,
    coordDupes.map(([coord, names]) => `${coord} shared by: ${names.join(" / ")}`).join("; ")
);

// 7. Every hospital has a non-empty English name and pinyin (schema
// convention already established by the original 23).
const missingEn = SHENYANG_HOSPITALS.filter((h) => !h.nameEn?.trim());
check("Every hospital has a nameEn", missingEn.length === 0, missingEn.map((h) => h.name).join(", "));
const missingPinyin = SHENYANG_HOSPITALS.filter((h) => !h.namePinyin?.trim());
check("Every hospital has a namePinyin", missingPinyin.length === 0, missingPinyin.map((h) => h.name).join(", "));

console.log(
    failures === 0
        ? `\nAll checks passed. ${SHENYANG_HOSPITALS.length} hospitals validated.`
        : `\n${failures} check(s) FAILED. Do not run seed-shenyang until these are fixed.`
);
process.exit(failures === 0 ? 0 : 1);
