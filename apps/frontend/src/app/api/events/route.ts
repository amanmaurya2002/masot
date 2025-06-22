import { NextResponse } from "next/server";

interface EventData {
  title: string;
  date: string;
  time: string;
  venue: string;
  category?: string;
  description?: string;
  image?: string;
  url?: string;
}

interface TicketmasterEvent {
  name: string;
  dates: {
    start: {
      localDate: string;
      localTime: string;
    };
  };
  _embedded?: {
    venues?: Array<{
      name: string;
    }>;
  };
  classifications?: Array<{
    segment?: {
      name: string;
    };
  }>;
  images?: Array<{
    url: string;
  }>;
  url?: string;
}

interface TicketmasterResponse {
  _embedded?: {
    events?: TicketmasterEvent[];
  };
}

export async function GET() {
  const apiKey = process.env.TICKETMASTER_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "Missing TICKETMASTER_API_KEY env var" }, { status: 500 });
  }

  const url = `https://app.ticketmaster.com/discovery/v2/events.json?city=Chandigarh&countryCode=IN&apikey=${apiKey}&size=20`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch events" }, { status: 502 });
    }

    const data: TicketmasterResponse = await res.json();

    const events = (data._embedded?.events || []).map((event: TicketmasterEvent, idx: number) => ({
      id: idx,
      title: event.name,
      date: event.dates.start.localDate,
      time: event.dates.start.localTime,
      venue: event._embedded?.venues?.[0]?.name || "TBD",
      category: event.classifications?.[0]?.segment?.name,
      description: `Event in Chandigarh`,
      image: event.images?.[0]?.url,
      url: event.url
    }));

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const eventData: EventData = await request.json();
    
    // Validate required fields
    if (!eventData.title || !eventData.date || !eventData.time || !eventData.venue) {
      return NextResponse.json(
        { error: "Missing required fields: title, date, time, venue" },
        { status: 400 }
      );
    }

    // Return the event data with a generated ID
    const newEvent = {
      id: Date.now(),
      ...eventData
    };

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 