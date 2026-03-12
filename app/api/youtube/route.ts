import { NextResponse } from 'next/server';

type YouTubePayload = {
  subscriberCount: string;
  latestVideoId: string;
  latestVideoTitle: string;
  latestVideoThumbnail: string;
  channelUrl: string;
};

const CHANNEL_ID = 'UCKz8ISvm1sH1iNyo2DPzQoA';
const CHANNEL_URL = `https://www.youtube.com/channel/${CHANNEL_ID}`;

const FALLBACK: YouTubePayload = {
  subscriberCount: '--',
  latestVideoId: 'DWcJFNfaw9c',
  latestVideoTitle: 'Latest upload from Ramzi ZRT',
  latestVideoThumbnail: 'https://i.ytimg.com/vi/DWcJFNfaw9c/maxresdefault.jpg',
  channelUrl: CHANNEL_URL
};

function normalizeSubscriberLabel(raw: string) {
  const cleaned = raw.replace(/\s+/g, ' ').trim();
  const match = cleaned.match(/([\d,.]+)/);

  if (!match) {
    return cleaned;
  }

  const numeric = Number(match[1].replace(/,/g, ''));

  if (!Number.isFinite(numeric) || numeric <= 0) {
    return cleaned;
  }

  return numeric.toLocaleString();
}

async function scrapeSubscriberCount() {
  const pageRes = await fetch(CHANNEL_URL, {
    headers: {
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'accept-language': 'en-US,en;q=0.9'
    },
    next: { revalidate: 900 }
  });

  if (!pageRes.ok) {
    return null;
  }

  const html = await pageRes.text();
  const patterns = [
    /"subscriberCountText"\s*:\s*\{\s*"simpleText"\s*:\s*"([^"]+)"/,
    /"subscriberCountText"\s*:\s*\{[^{}]*"label"\s*:\s*"([^"]+)"/,
    /"subscriberCountText"\s*:\s*\{\s*"runs"\s*:\s*\[\{\s*"text"\s*:\s*"([^"]+)"/
  ];

  for (const pattern of patterns) {
    const found = html.match(pattern)?.[1];
    if (found) {
      return normalizeSubscriberLabel(found);
    }
  }

  return null;
}

export async function GET() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID || CHANNEL_ID;

  if (!apiKey) {
    try {
      const realSubscriberCount = await scrapeSubscriberCount();

      if (realSubscriberCount) {
        return NextResponse.json({
          ...FALLBACK,
          subscriberCount: realSubscriberCount,
          source: 'youtube-channel-scrape'
        });
      }
    } catch {
      // fallback below
    }

    return NextResponse.json({ ...FALLBACK, source: 'fallback' });
  }

  try {
    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${channelId}&key=${apiKey}`,
      { next: { revalidate: 900 } }
    );

    const latestVideoRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=1&order=date&type=video&key=${apiKey}`,
      { next: { revalidate: 900 } }
    );

    if (!channelRes.ok || !latestVideoRes.ok) {
      return NextResponse.json({ ...FALLBACK, source: 'fallback' });
    }

    const channelData = await channelRes.json();
    const latestVideoData = await latestVideoRes.json();

    const channel = channelData?.items?.[0];
    const video = latestVideoData?.items?.[0];

    if (!channel || !video) {
      return NextResponse.json({ ...FALLBACK, source: 'fallback' });
    }

    const data: YouTubePayload = {
      subscriberCount: Number(channel.statistics?.subscriberCount || 0).toLocaleString(),
      latestVideoId: video.id?.videoId || FALLBACK.latestVideoId,
      latestVideoTitle: video.snippet?.title || FALLBACK.latestVideoTitle,
      latestVideoThumbnail:
        video.snippet?.thumbnails?.high?.url ||
        video.snippet?.thumbnails?.medium?.url ||
        FALLBACK.latestVideoThumbnail,
      channelUrl: CHANNEL_URL
    };

    return NextResponse.json({ ...data, source: 'youtube-api' });
  } catch {
    return NextResponse.json({ ...FALLBACK, source: 'fallback' });
  }
}
