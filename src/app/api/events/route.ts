import { NextResponse } from "next/server";
// @ts-ignore – cheerio types may not be present at build time
import * as cheerio from "cheerio";

// This route requires full Node.js APIs (cheerio) so opt-out of the edge runtime
export const runtime = "nodejs";

export async function GET() {
  const apiKey = process.env.TICKETMASTER_API_KEY;

  // Helper that normalises the structure expected by the frontend
  const normalise = (raw: any) => ({
    id: raw.id ?? raw.url ?? String(Math.random()),
    title: raw.title ?? raw.name ?? "",
    date: raw.date ?? raw.startDate?.split("T")[0] ?? "",
    time: raw.time ?? raw.startDate?.split("T")[1]?.slice(0, 5) ?? "",
    venue: raw.venue ?? raw.location?.name ?? "",
    description: raw.description ?? "",
    category: raw.category ?? raw.eventStatus ?? "",
    price: raw.price ?? "",
  });

  /**
   * Fallback: Scrape AllEvents.in for the latest Chandigarh events.
   */
  const scrapeAllEvents = async () => {
    try {
      const pageResp = await fetch("https://allevents.in/chandigarh/all");
      if (!pageResp.ok) throw new Error("AllEvents HTTP " + pageResp.status);

      const html = await pageResp.text();
      const $ = cheerio.load(html);

      const scraped: any[] = [];

      // AllEvents embeds every card as JSON-LD inside <script type="application/ld+json">
      $("script[type='application/ld+json']").each((_idx: number, el: cheerio.Element) => {
        try {
          const json = JSON.parse($(el).html() || "{}");
          const arr = Array.isArray(json) ? json : [json];
          arr.forEach((o: any) => {
            if (o["@type"] === "Event") {
              scraped.push(o);
            }
          });
        } catch {
          /* ignore malformed */
        }
      });

      return scraped.slice(0, 20).map(normalise);
    } catch (err) {
      console.error("AllEvents scrape failed", err);
      return [];
    }
  };

  // 1) Try Ticketmaster first if key exists
  if (apiKey) {
    try {
      const tmURL = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&city=Chandigarh&countryCode=IN&size=20&sort=date,asc`;
      const resp = await fetch(tmURL, { next: { revalidate: 60 * 60 } });
      if (resp.ok) {
        const raw = await resp.json();
        const list = raw?._embedded?.events ?? [];
        if (list.length) {
          const events = list.map((e: any) => {
            const venue = e._embedded?.venues?.[0];
            const priceRange = e.priceRanges?.[0];
            return normalise({
              id: e.id,
              title: e.name,
              date: e.dates?.start?.localDate ?? "",
              time: e.dates?.start?.localTime ?? "",
              venue: venue?.name ?? "",
              description: e.info ?? "",
              category: e.classifications?.[0]?.segment?.name ?? "",
              price: priceRange ? `${priceRange.min}-${priceRange.max} ${priceRange.currency}` : "",
            });
          });
          return NextResponse.json(events);
        }
      }
    } catch (err) {
      console.warn("Ticketmaster lookup failed, falling back", err);
    }
  }

  // 2) Fallback to scraping AllEvents
  const fallback = await scrapeAllEvents();
  if (fallback.length) {
    return NextResponse.json(fallback);
  }

  return NextResponse.json({ error: "No events found." }, { status: 404 });
} 