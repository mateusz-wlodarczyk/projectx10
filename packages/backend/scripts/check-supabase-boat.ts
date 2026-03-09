/**
 * One-off: query Supabase boats_list for a slug and print raw response.
 * Run from backend: npx ts-node scripts/check-supabase-boat.ts [slug]
 */
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const slug = process.argv[2] || "fountaine-pajot-astrea-42-cata-del-mar";
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_KEY;

if (!url || !key) {
  console.error("Missing SUPABASE_URL or SUPABASE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(url!, key!);

async function main() {
  console.log("Querying boats_list for slug:", JSON.stringify(slug));
  console.log("SUPABASE_URL (host):", url!.replace(/^https:\/\//, "").split(".")[0]);

  const { data, error } = await supabase
    .from("boats_list")
    .select("*")
    .eq("slug", slug)
    .limit(5);

  console.log("\n--- Supabase raw response ---");
  console.log("error:", error ? { message: error.message, code: error.code, details: error.details } : null);
  console.log("data is array:", Array.isArray(data));
  console.log("data length:", data?.length ?? 0);
  if (data?.length) {
    console.log("first row keys:", Object.keys(data[0]).slice(0, 20));
    console.log("first row (slug, title, priceFrom):", {
      slug: data[0].slug,
      title: data[0].title,
      priceFrom: data[0].priceFrom,
    });
  }
  console.log(JSON.stringify({ data, error }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
