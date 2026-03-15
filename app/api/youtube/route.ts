import { NextResponse } from 'next/server';

type YouTubeRssResponse = {
  latestVideoId: string;
  latestVideoThumbnail: string;
  latestVideoUrl: string;
  latestVideoTitle: string;
};

const CHANNEL_HANDLE_URL = 'https://youtube.com/@ramzizrt';
const FALLBACK_VIDEO_ID = 'DWcJFNfaw9c';
const FALLBACK: YouTubeRssResponse = {
  latestVideoId: FALLBACK_VIDEO_ID,
  latestVideoThumbnail: `https://i.ytimg.com/vi/${FALLBACK_VIDEO_ID}/hqdefault.jpg`,
  latestVideoUrl: `https://youtube.com/watch?v=${FALLBACK_VIDEO_ID}`,
  latestVideoTitle: 'Latest upload from Ramzi ZRT'
};

async function fetchText(url: string): Promise<string | null> {
  const response = await fetch(url, {
    next: { revalidate: 3600 }
  });

  if (!response.ok) {
    return null;
  }

  return response.text();
}

function extractChannelId(channelHtml: string): string | null {
  const canonicalMatch = channelHtml.match(
    /<link\s+rel=["']canonical["']\s+href=["']https:\/\/www\.youtube\.com\/channel\/([^"']+)["']/i
  );

  return canonicalMatch?.[1] ?? null;
}

function extractLatestVideoId(rssXml: string): string | null {
  const match = rssXml.match(/<yt:videoId>([^<]+)<\/yt:videoId>/i);
  return match?.[1]?.trim() || null;
}

function buildPayload(videoId: string): YouTubeRssResponse {
  return {
    latestVideoId: videoId,
    latestVideoThumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    latestVideoUrl: `https://youtube.com/watch?v=${videoId}`,
    latestVideoTitle: 'Latest upload from Ramzi ZRT'
  };
}

export async function GET() {
  try {
    const channelHtml = await fetchText(CHANNEL_HANDLE_URL);
    if (!channelHtml) {
      return NextResponse.json(FALLBACK);
    }

    const channelId = extractChannelId(channelHtml);
    if (!channelId) {
      return NextResponse.json(FALLBACK);
    }

    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const rssXml = await fetchText(rssUrl);

    if (!rssXml) {
      return NextResponse.json(FALLBACK);
    }

    const latestVideoId = extractLatestVideoId(rssXml);
    if (!latestVideoId) {
      return NextResponse.json(FALLBACK);
    }

    return NextResponse.json(buildPayload(latestVideoId));
  } catch {
    return NextResponse.json(FALLBACK);
  }
}
