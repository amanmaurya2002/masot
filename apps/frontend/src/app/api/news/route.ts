import { NextResponse } from "next/server";

interface NewsArticle {
  title: string;
  url: string;
  source: {
    name: string;
  };
  publishedAt: string;
  urlToImage?: string;
}

interface NewsApiResponse {
  articles: NewsArticle[];
}

export async function GET() {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "Missing NEWS_API_KEY env var" }, { status: 500 });
  }

  const url = `https://newsapi.org/v2/everything?q=chandigarh&language=en&sortBy=publishedAt&pageSize=10&apiKey=${apiKey}`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch news" }, { status: 502 });
    }

    const data: NewsApiResponse = await res.json();

    const articles = (data.articles || []).map((a: NewsArticle, idx: number) => ({
      id: idx, // simple index id for frontend keys
      title: a.title,
      url: a.url,
      source: a.source?.name ?? "Unknown",
      publishedAt: a.publishedAt,
      image: a.urlToImage ?? "",
    }));

    return NextResponse.json(articles);
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 