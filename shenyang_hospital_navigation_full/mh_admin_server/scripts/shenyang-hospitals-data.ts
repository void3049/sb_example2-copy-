/**
 * PURE DATA - the real Shenyang hospital list (names, coordinates, type,
 * services, etc.) with no database/network code in this file at all.
 *
 * Split out from seed-shenyang-hospitals.ts specifically so this data can
 * be imported safely (e.g. by scripts/validate-shenyang-seed.ts) without
 * ever triggering that script's main() - which connects to the database
 * and performs a live delete+insert the moment the file that contains it
 * is run. Importing pure data here has no side effects.
 *
 * Coordinates are WGS84 (plain GPS lat/lng) - the same system this app's
 * map/distance code already assumes (see hospital.controller.ts's
 * haversineDistanceKm and the /nearby endpoint).
 *
 * `type` is a broad, usually-obvious-from-the-name institution
 * classification (see TYPE_DEPARTMENT_DEFAULTS) - separate from
 * `services`, which is the specific, VERIFIED department list actually
 * used to filter "near me" results (see mh_engine/src/lib/serviceMapping.ts).
 * A hospital only gets non-empty `services` where that's been actually
 * verified - being "general" (or any type) does NOT imply a given service.
 */

export type HospitalType =
    | "general"
    | "mental_health_specialty"
    | "cancer"
    | "orthopedics"
    | "oral_dental"
    | "maternal_child"
    | "traditional_chinese_medicine"
    | "anorectal"
    | "ophthalmology";

/** Placeholder department/specialty text per institution type - accurate
 * at the "what kind of hospital is this" level, even though specific
 * per-hospital department data isn't available yet. */
export const TYPE_DEPARTMENT_DEFAULTS: Record<HospitalType, { department: string; specialty: string }> = {
    general: { department: "General Medicine", specialty: "General hospital services" },
    mental_health_specialty: {
        department: "Psychiatry (Inpatient & Outpatient)",
        specialty: "Psychiatric diagnosis, treatment, and mental health rehabilitation",
    },
    cancer: { department: "Oncology", specialty: "Cancer treatment" },
    orthopedics: { department: "Orthopedics", specialty: "Orthopedic care" },
    oral_dental: { department: "Stomatology", specialty: "Dental and oral health" },
    maternal_child: { department: "Obstetrics/Gynecology & Pediatrics", specialty: "Maternal and child health" },
    traditional_chinese_medicine: {
        department: "Traditional Chinese Medicine",
        specialty: "TCM diagnosis and treatment",
    },
    anorectal: { department: "Anorectal Surgery", specialty: "Anorectal/proctology care" },
    ophthalmology: { department: "Ophthalmology", specialty: "Eye care and vision services" },
};

export interface ShenyangHospitalSeed {
    name: string;
    nameEn: string;
    namePinyin: string;
    latitude: number;
    longitude: number;
    type: HospitalType;
    /** Only set (non-empty) where actually verified - see file header. */
    services?: string[];
    /** Overrides TYPE_DEPARTMENT_DEFAULTS for this one hospital, when
     * something more specific than the generic per-type text is known -
     * currently just the mental health center, so it reads as real
     * detail rather than the same boilerplate every "general" hospital
     * would otherwise show. */
    department?: string;
    specialty?: string;
    /** District within Shenyang, where verified. Optional because the
     * original 23 hospitals never had this captured - left unset for
     * those (they'll continue to insert as district: null, same as
     * before); populated for hospitals added afterward where a district
     * was confirmed during research. */
    district?: string;
    /** Free-text citation of where name/address/coordinates for this
     * entry came from - only present on hospitals added after the
     * original 23 (which predate this field). Not stored in the
     * database; exists purely so this file stays self-documenting about
     * provenance for anyone reviewing/auditing the data later. */
    source?: string;
}

// Matches the data in 0_map_api_example/leaflet-displacement-calculator/hospitals.js,
// plus English/pinyin translations.
export const SHENYANG_HOSPITALS: ShenyangHospitalSeed[] = [
    {
        name: "中国医科大学附属第一医院",
        nameEn: "The First Affiliated Hospital of China Medical University",
        namePinyin: "Zhōngguó Yīkē Dàxué Fùshǔ Dì-yī Yīyuàn",
        latitude: 41.792898,
        longitude: 123.405202,
        type: "general",
    },
    {
        name: "中国医科大学附属盛京医院南湖院区",
        nameEn: "Shengjing Hospital of China Medical University, Nanhu Campus",
        namePinyin: "Zhōngguó Yīkē Dàxué Fùshǔ Shèngjīng Yīyuàn Nánhú Yuànqū",
        latitude: 41.770663,
        longitude: 123.420123,
        type: "general",
    },
    {
        name: "辽宁省人民医院",
        nameEn: "Liaoning Provincial People's Hospital",
        namePinyin: "Liáoníng Shěng Rénmín Yīyuàn",
        latitude: 41.773602,
        longitude: 123.447294,
        type: "general",
    },
    {
        name: "沈阳医学院附属中心医院",
        nameEn: "Central Hospital Affiliated to Shenyang Medical College",
        namePinyin: "Shěnyáng Yīxuéyuàn Fùshǔ Zhōngxīn Yīyuàn",
        latitude: 41.798450,
        longitude: 123.341010,
        type: "general",
    },
    {
        name: "沈阳市第一人民医院",
        nameEn: "Shenyang First People's Hospital",
        namePinyin: "Shěnyáng Shì Dì-yī Rénmín Yīyuàn",
        latitude: 41.813336,
        longitude: 123.459142,
        type: "general",
    },
    {
        name: "沈阳市第四人民医院",
        nameEn: "Shenyang Fourth People's Hospital",
        namePinyin: "Shěnyáng Shì Dì-sì Rénmín Yīyuàn",
        latitude: 41.817997,
        longitude: 123.414230,
        type: "general",
    },
    {
        name: "沈阳市第六人民医院",
        nameEn: "Shenyang Sixth People's Hospital",
        namePinyin: "Shěnyáng Shì Dì-liù Rénmín Yīyuàn",
        latitude: 41.769585,
        longitude: 123.395452,
        type: "general",
    },
    {
        name: "沈阳市第十人民医院",
        nameEn: "Shenyang Tenth People's Hospital",
        namePinyin: "Shěnyáng Shì Dì-shí Rénmín Yīyuàn",
        latitude: 41.828452,
        longitude: 123.466407,
        type: "general",
    },
    {
        name: "沈阳市儿童医院",
        nameEn: "Shenyang Children's Hospital",
        namePinyin: "Shěnyáng Shì Értóng Yīyuàn",
        latitude: 41.830970,
        longitude: 123.428470,
        type: "maternal_child",
    },
    {
        name: "沈阳市妇婴医院",
        nameEn: "Shenyang Women's and Children's Hospital",
        namePinyin: "Shěnyáng Shì Fùyīng Yīyuàn",
        latitude: 41.786216,
        longitude: 123.454707,
        type: "maternal_child",
    },
    {
        name: "中国医科大学附属第四医院",
        nameEn: "The Fourth Affiliated Hospital of China Medical University",
        namePinyin: "Zhōngguó Yīkē Dàxué Fùshǔ Dì-sì Yīyuàn",
        latitude: 41.831220,
        longitude: 123.455770,
        type: "general",
    },
    {
        name: "辽宁省肿瘤医院",
        nameEn: "Liaoning Cancer Hospital",
        namePinyin: "Liáoníng Shěng Zhǒngliú Yīyuàn",
        latitude: 41.791731,
        longitude: 123.466831,
        type: "cancer",
    },
    {
        name: "辽宁中医药大学附属医院",
        nameEn: "Affiliated Hospital of Liaoning University of Traditional Chinese Medicine",
        namePinyin: "Liáoníng Zhōngyīyào Dàxué Fùshǔ Yīyuàn",
        latitude: 41.828998,
        longitude: 123.424500,
        type: "traditional_chinese_medicine",
    },
    {
        name: "沈阳医学院附属第二医院",
        nameEn: "Second Affiliated Hospital of Shenyang Medical College",
        namePinyin: "Shěnyáng Yīxuéyuàn Fùshǔ Dì-èr Yīyuàn",
        latitude: 41.800610,
        longitude: 123.411350,
        type: "general",
    },
    {
        name: "沈阳市第五人民医院",
        nameEn: "Shenyang Fifth People's Hospital",
        namePinyin: "Shěnyáng Shì Dì-wǔ Rénmín Yīyuàn",
        latitude: 41.785952,
        longitude: 123.347284,
        type: "general",
    },
    {
        name: "沈阳市第七人民医院",
        nameEn: "Shenyang Seventh People's Hospital",
        namePinyin: "Shěnyáng Shì Dì-qī Rénmín Yīyuàn",
        latitude: 41.786670,
        longitude: 123.418960,
        type: "general",
    },
    {
        name: "沈阳市第九人民医院",
        nameEn: "Shenyang Ninth People's Hospital",
        namePinyin: "Shěnyáng Shì Dì-jiǔ Rénmín Yīyuàn",
        latitude: 41.791003,
        longitude: 123.330243,
        type: "general",
    },
    {
        name: "沈阳市红十字会医院",
        nameEn: "Shenyang Red Cross Hospital",
        namePinyin: "Shěnyáng Shì Hóng Shízìhuì Yīyuàn",
        latitude: 41.797000,
        longitude: 123.431700,
        type: "general",
    },
    {
        name: "沈阳市中医院",
        nameEn: "Shenyang Hospital of Traditional Chinese Medicine",
        namePinyin: "Shěnyáng Shì Zhōngyīyuàn",
        latitude: 41.772366,
        longitude: 123.422640,
        type: "traditional_chinese_medicine",
    },
    {
        name: "沈阳市骨科医院",
        nameEn: "Shenyang Orthopedic Hospital",
        namePinyin: "Shěnyáng Shì Gǔkē Yīyuàn",
        latitude: 41.818449,
        longitude: 123.477362,
        type: "orthopedics",
    },
    {
        name: "沈阳市精神卫生中心",
        nameEn: "Shenyang Mental Health Center",
        namePinyin: "Shěnyáng Shì Jīngshén Wèishēng Zhōngxīn",
        latitude: 41.739350,
        longitude: 123.487120,
        type: "mental_health_specialty",
        services: ["psychiatry", "psychology"],
        department: "Psychiatry — Inpatient, Outpatient & Crisis Intervention",
        specialty:
            "Shenyang's dedicated public psychiatric hospital — psychiatric diagnosis, medication management, therapy, and inpatient mental health treatment",
    },
    {
        name: "沈阳二四二医院",
        nameEn: "Shenyang 242 Hospital",
        namePinyin: "Shěnyáng Èrsìèr Yīyuàn",
        latitude: 41.863140,
        longitude: 123.416300,
        type: "general",
    },
    {
        name: "沈阳市苏家屯区中心医院",
        nameEn: "Sujiatun District Central Hospital, Shenyang",
        namePinyin: "Shěnyáng Shì Sūjiātún Qū Zhōngxīn Yīyuàn",
        latitude: 41.661790,
        longitude: 123.340880,
        type: "general",
    },

    // ================================================================
    // Batch 2: 28 additional hospitals (added after the original 23).
    // ================================================================
    // Every entry below has a `source` note showing exactly where its
    // name/address/coordinates came from. Two verification tiers were
    // used, both starting from real, cited addresses - never invented:
    //
    //   "OSM POI match" - Nominatim (OpenStreetMap) had this hospital
    //   mapped as a named point of interest; searching its name directly
    //   returned it. Highest precision (building-level).
    //
    //   "<gov/official address> + street-level geocode" - an address was
    //   first confirmed from an authoritative source (the Shenyang
    //   Municipal Government's official tertiary-hospital list, or the
    //   hospital's own/a medical-directory page for non-tertiary ones),
    //   then that address's STREET (not exact house number - OSM's
    //   China coverage rarely has house-number-level data) was geocoded.
    //   Calibration check: for a hospital with a known-good OSM POI
    //   match (Shenyang Jishuitan Hospital), this street-level method
    //   landed ~190m from the true point - accurate enough for a
    //   "nearby hospitals" feature, but NOT building-exact. Treat these
    //   coordinates as "correct street/block," not "correct doorway."
    //
    // Two candidates from the original research pool were DROPPED, not
    // guessed: 沈阳市沈北新区中心医院 and 法库县中心医院 both have real,
    // confirmed addresses (from the official government list) but no
    // usable OSM match at name OR street level - no coordinate could be
    // verified, so per instructions they were excluded rather than
    // estimated.
    //
    // 沈阳市肛肠医院 was also considered (real, address-verified: 南京北
    // 街9号, 和平区) but deliberately left out here: its street-level
    // geocode would have landed on the EXACT SAME coordinate as 中国医
    // 科大学附属口腔医院 below (same street, different house number,
    // and this method can't distinguish the two) - inserting it would
    // have created a false duplicate-location pair for two genuinely
    // different institutions, which the validation script below
    // specifically checks for.
    {
        name: "中国医科大学附属第一医院浑南院区",
        nameEn: "The First Affiliated Hospital of China Medical University, Hunnan Campus",
        namePinyin: "Zhōngguó Yīkē Dàxué Fùshǔ Dì-yī Yīyuàn Húnnán Yuànqū",
        district: "浑南区",
        latitude: 41.645939,
        longitude: 123.423624,
        type: "general",
        source: "Address: Shenyang Municipal Government tertiary-hospital list (浑南区白塔一街210号); coordinates: Nominatim street-level geocode of 白塔一街, 浑南区",
    },
    {
        name: "中国医科大学附属盛京医院滑翔院区",
        nameEn: "Shengjing Hospital of China Medical University, Huaxiang Campus",
        namePinyin: "Zhōngguó Yīkē Dàxué Fùshǔ Shèngjīng Yīyuàn Huáxiáng Yuànqū",
        district: "铁西区",
        latitude: 41.770886,
        longitude: 123.355833,
        type: "general",
        source: "Nominatim OSM POI match (amenity=hospital) for 中国医科大学附属盛京医院（滑翔院区）; address on record (铁西区滑翔路39号) matches Shenyang Municipal Government tertiary-hospital list",
    },
    {
        name: "中国医科大学附属盛京医院沈北院区",
        nameEn: "Shengjing Hospital of China Medical University, Shenbei Campus",
        namePinyin: "Zhōngguó Yīkē Dàxué Fùshǔ Shèngjīng Yīyuàn Shěnběi Yuànqū",
        district: "沈北新区",
        latitude: 41.944929,
        longitude: 123.398085,
        type: "general",
        source: "Nominatim OSM POI match (amenity=hospital) for 中国医科大学附属盛京医院（沈北院区）; address on record (沈北新区蒲河大道16号) matches Shenyang Municipal Government tertiary-hospital list",
    },
    {
        name: "辽宁中医药大学附属第二医院",
        nameEn: "Second Affiliated Hospital of Liaoning University of Traditional Chinese Medicine",
        namePinyin: "Liáoníng Zhōngyīyào Dàxué Fùshǔ Dì-èr Yīyuàn",
        district: "于洪区",
        latitude: 41.874348,
        longitude: 123.410188,
        type: "traditional_chinese_medicine",
        source: "Address: Shenyang Municipal Government tertiary-hospital list, cross-checked against hospital directory search (于洪区黄河北大街60号); coordinates: Nominatim street-level geocode",
    },
    {
        name: "辽宁中医药大学附属第三医院",
        nameEn: "Third Affiliated Hospital of Liaoning University of Traditional Chinese Medicine",
        namePinyin: "Liáoníng Zhōngyīyào Dàxué Fùshǔ Dì-sān Yīyuàn",
        district: "和平区",
        latitude: 41.787883,
        longitude: 123.417726,
        type: "traditional_chinese_medicine",
        source: "Address: Shenyang Municipal Government tertiary-hospital list, west campus (和平区十一纬路35号); coordinates: Nominatim street-level geocode",
    },
    {
        name: "辽宁中医药大学附属第四医院",
        nameEn: "Fourth Affiliated Hospital of Liaoning University of Traditional Chinese Medicine",
        namePinyin: "Liáoníng Zhōngyīyào Dàxué Fùshǔ Dì-sì Yīyuàn",
        district: "苏家屯区",
        latitude: 41.661443,
        longitude: 123.325136,
        type: "traditional_chinese_medicine",
        source: "Address: Shenyang Municipal Government tertiary-hospital list (苏家屯区雪松路9号); coordinates: Nominatim street-level geocode",
    },
    {
        name: "辽宁省金秋医院",
        nameEn: "Liaoning Jinqiu Hospital (Provincial Geriatric Hospital)",
        namePinyin: "Liáoníng Shěng Jīnqiū Yīyuàn",
        district: "沈河区",
        latitude: 41.769045,
        longitude: 123.443536,
        type: "general",
        department: "Geriatric Medicine",
        specialty: "Liaoning's largest dedicated geriatric care center - elder critical care, multi-organ/functional decline, comprehensive geriatric assessment and rehabilitation",
        source: "Address: Shenyang Municipal Government tertiary-hospital list (沈河区小南街317号); specialty confirmed via hospital's own site (辽宁省老年病医院); coordinates: Nominatim street-level geocode",
    },
    {
        name: "中国医科大学附属口腔医院",
        nameEn: "Stomatological Hospital of China Medical University",
        namePinyin: "Zhōngguó Yīkē Dàxué Fùshǔ Kǒuqiāng Yīyuàn",
        district: "和平区",
        latitude: 41.802022,
        longitude: 123.410342,
        type: "oral_dental",
        source: "Address: Shenyang Municipal Government tertiary-hospital list (和平区南京北街117号); coordinates: Nominatim street-level geocode",
    },
    {
        name: "辽宁省妇幼保健院",
        nameEn: "Liaoning Provincial Maternal and Child Health Hospital",
        namePinyin: "Liáoníng Shěng Fùyòu Bǎojiànyuàn",
        district: "和平区",
        latitude: 41.766024,
        longitude: 123.387679,
        type: "maternal_child",
        source: "Address: Shenyang Municipal Government tertiary-hospital list (和平区砂阳路240号); coordinates: Nominatim street-level geocode",
    },
    {
        name: "沈阳市口腔医院",
        nameEn: "Shenyang Stomatological Hospital",
        namePinyin: "Shěnyáng Shì Kǒuqiāng Yīyuàn",
        district: "和平区",
        latitude: 41.796253,
        longitude: 123.413446,
        type: "oral_dental",
        source: "Address: Shenyang Municipal Government tertiary-hospital list, Heping campus (和平区中山路138号); coordinates: Nominatim street-level geocode",
    },
    {
        name: "沈阳市妇幼保健院",
        nameEn: "Shenyang Maternal and Child Health Hospital",
        namePinyin: "Shěnyáng Shì Fùyòu Bǎojiànyuàn",
        district: "沈河区",
        latitude: 41.790652,
        longitude: 123.436482,
        type: "maternal_child",
        source: "Address: Shenyang Municipal Government tertiary-hospital list, Shenhe campus (沈河区沈州路41号); coordinates: Nominatim street-level geocode. Distinct institution from 沈阳市妇婴医院 already in this dataset - confirmed as two separate entries on the same official government list, each with its own address.",
    },
    {
        name: "沈阳市安宁医院",
        nameEn: "Shenyang Anning Hospital",
        namePinyin: "Shěnyáng Shì Ānníng Yīyuàn",
        district: "沈北新区",
        latitude: 41.930331,
        longitude: 123.569037,
        type: "mental_health_specialty",
        services: ["psychiatry", "psychology"],
        department: "Psychiatry, Geriatric Psychiatry & Substance Dependence",
        specialty: "Shenyang's other dedicated psychiatric specialty hospital (a.k.a. 沈阳市中西医结合精神卫生中心) - psychiatric/psychological care, geriatric psychiatry, and voluntary substance-dependence treatment",
        source: "Address: Shenyang Municipal Government tertiary-hospital list (沈北新区辉山大街134号); specialty confirmed via hospital directory search; coordinates: Nominatim street-level geocode",
    },
    {
        name: "沈阳市第二中医医院",
        nameEn: "Shenyang Second Hospital of Traditional Chinese Medicine",
        namePinyin: "Shěnyáng Shì Dì-èr Zhōngyī Yīyuàn",
        district: "苏家屯区",
        latitude: 41.663840,
        longitude: 123.341179,
        type: "traditional_chinese_medicine",
        source: "Address: Shenyang Municipal Government tertiary-hospital list (苏家屯区雪松路49号); coordinates: Nominatim street-level geocode. Also referred to as 辽宁省血栓病中西医结合医疗中心 (an alternate/subsidiary name for the same institution) - inserted once, under its primary official name, to avoid double-counting.",
    },
    {
        name: "沈阳市苏家屯区妇婴医院",
        nameEn: "Sujiatun District Women's and Children's Hospital, Shenyang",
        namePinyin: "Shěnyáng Shì Sūjiātún Qū Fùyīng Yīyuàn",
        district: "苏家屯区",
        latitude: 41.666139,
        longitude: 123.338286,
        type: "maternal_child",
        source: "Address: Shenyang Municipal Government tertiary-hospital list (苏家屯区海棠街68号); coordinates: Nominatim street-level geocode",
    },
    {
        name: "康平县人民医院",
        nameEn: "Kangping County People's Hospital",
        namePinyin: "Kāngpíng Xiàn Rénmín Yīyuàn",
        district: "康平县",
        latitude: 42.760328,
        longitude: 123.342319,
        type: "general",
        source: "Address: Shenyang Municipal Government tertiary-hospital list (康平县中心街461号); coordinates: Nominatim street-level geocode of a closely-matching nearby street name (中心北街, not an exact match to 中心街) - LOWER CONFIDENCE on precise placement than other entries here, though district/county-level location is solid.",
    },
    {
        name: "中国人民解放军北部战区总医院",
        nameEn: "Northern Theater Command General Hospital",
        namePinyin: "Zhōngguó Rénmín Jiěfàngjūn Běibù Zhànqū Zǒng Yīyuàn",
        district: "沈河区",
        latitude: 41.768746,
        longitude: 123.438649,
        type: "general",
        source: "Address: hospital directory search, main campus (沈河区文化路83号); coordinates: Nominatim street-level geocode. One of Shenyang's largest military-affiliated general hospitals (formerly 沈阳军区总医院).",
    },
    {
        name: "中国人民解放军北部战区空军医院",
        nameEn: "Northern Theater Command Air Force Hospital",
        namePinyin: "Zhōngguó Rénmín Jiěfàngjūn Běibù Zhànqū Kōngjūn Yīyuàn",
        district: "大东区",
        latitude: 41.787652,
        longitude: 123.486288,
        type: "general",
        source: "Address: hospital directory search (大东区小河沿路46号); coordinates: Nominatim street-level geocode",
    },
    {
        name: "沈阳市沈河区人民医院",
        nameEn: "Shenhe District People's Hospital, Shenyang",
        namePinyin: "Shěnyáng Shì Shěnhé Qū Rénmín Yīyuàn",
        district: "沈河区",
        latitude: 41.796666,
        longitude: 123.447606,
        type: "general",
        source: "Address: hospital directory search (沈河区正阳街200号); coordinates: Nominatim street-level geocode",
    },
    {
        name: "辽宁电力中心医院",
        nameEn: "Liaoning Electric Power Central Hospital",
        namePinyin: "Liáoníng Diànlì Zhōngxīn Yīyuàn",
        district: "和平区",
        latitude: 41.764521,
        longitude: 123.401380,
        type: "general",
        source: "Address: hospital directory search (和平区望湖路2号); coordinates: Nominatim street-level geocode",
    },
    {
        name: "沈阳何氏眼科医院",
        nameEn: "Shenyang He Eye Hospital",
        namePinyin: "Shěnyáng Héshì Yǎnkē Yīyuàn",
        district: "于洪区",
        latitude: 41.879891,
        longitude: 123.408414,
        type: "ophthalmology",
        source: "Nominatim OSM POI match (amenity=hospital) for 何氏眼科医院, correctly located in Shenyang",
    },
    {
        name: "辽宁爱尔眼科医院",
        nameEn: "Liaoning Aier Eye Hospital",
        namePinyin: "Liáoníng Ài'ěr Yǎnkē Yīyuàn",
        district: "和平区",
        latitude: 41.795097,
        longitude: 123.412443,
        type: "ophthalmology",
        source: "Address: hospital directory search (和平区和平北大街99号); coordinates: Nominatim street-level geocode",
    },
    {
        name: "沈阳兴齐眼科医院",
        nameEn: "Shenyang Xingqi Eye Hospital",
        namePinyin: "Shěnyáng Xīngqí Yǎnkē Yīyuàn",
        district: "和平区",
        latitude: 41.767937,
        longitude: 123.421471,
        type: "ophthalmology",
        source: "Address: hospital directory search (和平区三好街136号); coordinates: Nominatim street-level geocode",
    },
    {
        name: "沈阳维康医院",
        nameEn: "Shenyang Weikang Hospital",
        namePinyin: "Shěnyáng Wéikāng Yīyuàn",
        district: "铁西区",
        latitude: 41.796806,
        longitude: 123.366943,
        type: "general",
        source: "Nominatim OSM POI match (amenity=hospital) for 沈阳维康医院, Tiexi campus (a second campus exists in 沈北新区 per the same search - this entry is the Tiexi one only)",
    },
    {
        name: "沈阳积水潭医院",
        nameEn: "Shenyang Jishuitan Hospital",
        namePinyin: "Shěnyáng Jīshuǐtán Yīyuàn",
        district: "铁西区",
        latitude: 41.728289,
        longitude: 123.251187,
        type: "orthopedics",
        source: "Nominatim OSM POI match (amenity=hospital) for 沈阳积水潭医院 - this was the calibration reference point used to validate the street-level geocoding method for other entries in this batch",
    },
    {
        name: "沈阳市浑南区医院",
        nameEn: "Shenyang Hunnan District Hospital",
        namePinyin: "Shěnyáng Shì Húnnán Qū Yīyuàn",
        district: "浑南区",
        latitude: 41.725864,
        longitude: 123.443230,
        type: "general",
        source: "Nominatim OSM POI match (amenity=hospital) for 沈阳市浑南区医院",
    },
    {
        name: "浑南区中心医院",
        nameEn: "Hunnan District Central Hospital",
        namePinyin: "Húnnán Qū Zhōngxīn Yīyuàn",
        district: "沈河区",
        latitude: 41.771956,
        longitude: 123.472769,
        type: "general",
        source: "Nominatim OSM POI match (amenity=hospital) for 浑南区中心医院 - NOTE: despite its name, OSM's address for this POI places it in 沈河区 (Shenhe District), not 浑南区 (Hunnan District); flagging this discrepancy rather than silently resolving it. Confirmed as a genuinely separate institution from 沈阳市浑南区医院 above (different address, different coordinates, ~5km apart).",
    },
    {
        name: "中一东北国际医院",
        nameEn: "Zhongyi Northeast International Hospital",
        namePinyin: "Zhōngyī Dōngběi Guójì Yīyuàn",
        district: "浑南区",
        latitude: 41.744736,
        longitude: 123.457519,
        type: "general",
        source: "Address: hospital directory search, Hunnan main campus (浑南区天赐街2号) - hospital also has branch locations in 皇姑区 and 和平区 not included here; coordinates: Nominatim street-level geocode",
    },
];
