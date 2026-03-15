import { NextResponse } from 'next/server';

type YouTubePayload = {
  subscriberCount: string;
  latestVideoId: string;
  latestVideoTitle: string;
  latestVideoThumbnail: string;
  channelUrl: string;
};

type ScrapedLatestVideo = {
  latestVideoId: string;
  latestVideoTitle: string;
  latestVideoThumbnail: string;
};

const CHANNEL_ID = 'UCkZ8ISvm1sH1Ny02DPzQoA';
const getChannelUrl = (channelId: string) => `https://www.youtube.com/channel/${channelId}`;
const CHANNEL_URL = getChannelUrl(CHANNEL_ID);

const FALLBACK: YouTubePayload = {
  subscriberCount: '--',
  latestVideoId: '',
  latestVideoTitle: '',
  latestVideoThumbnail: '',
  channelUrl: CHANNEL_URL
};

function normalizeSubscriberLabel(raw: string) {
  const arabicDigits = '٠١٢٣٤٥٦٧٨٩';
  const normalizedDigits = raw.replace(/[٠-٩]/g, (digit) => String(arabicDigits.indexOf(digit)));
  const cleaned = normalizedDigits.replace(/\s+/g, ' ').trim();
  const match = cleaned.match(/([\d,.]+)\s*([KMB]|thousand|million|billion|ألف|مليون|مليار)?/i);

  if (!match) {
    return cleaned;
  }

  const normalizedNumber = match[1]
    .replace(/[٬،]/g, '')
    .replace(/(\d)[.](?=\d{3}(?:\D|$))/g, '$1')
    .replace(/(\d),(?=\d{3}(?:\D|$))/g, '$1')
    .replace(/[٫]/g, '.');

  const base = Number(normalizedNumber);

  if (!Number.isFinite(base) || base <= 0) {
    return cleaned;
  }

  const suffix = match[2]?.toLowerCase();
  const multiplier =
    suffix === 'k' || suffix === 'thousand' || suffix === 'ألف'
      ? 1_000
      : suffix === 'm' || suffix === 'million' || suffix === 'مليون'
        ? 1_000_000
        : suffix === 'b' || suffix === 'billion' || suffix === 'مليار'
          ? 1_000_000_000
          : 1;
  const numeric = base * multiplier;

  if (!Number.isFinite(numeric) || numeric <= 0) {
    return cleaned;
  }

  return numeric.toLocaleString();
}

function extractTextFromSubscriberObject(value: unknown): string | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const textNode = value as {
    simpleText?: unknown;
    label?: unknown;
    runs?: Array<{ text?: unknown }>;
    accessibility?: {
      accessibilityData?: {
        label?: unknown;
      };
    };
  };

  if (typeof textNode.simpleText === 'string' && textNode.simpleText.trim()) {
    return textNode.simpleText;
  }

  if (typeof textNode.label === 'string' && textNode.label.trim()) {
    return textNode.label;
  }

  const accessibilityLabel = textNode.accessibility?.accessibilityData?.label;
  if (typeof accessibilityLabel === 'string' && accessibilityLabel.trim()) {
    return accessibilityLabel;
  }

  const runsText = textNode.runs
    ?.map((run) => run?.text)
    .filter((text): text is string => typeof text === 'string')
    .join(' ')
    .trim();

  return runsText || null;
}

function findSubscriberTextDeep(value: unknown): string | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findSubscriberTextDeep(item);
      if (found) {
        return found;
      }
    }
    return null;
  }

  const record = value as Record<string, unknown>;
  const direct = extractTextFromSubscriberObject(record.subscriberCountText);
  if (direct) {
    return direct;
  }

  for (const nested of Object.values(record)) {
    const found = findSubscriberTextDeep(nested);
    if (found) {
      return found;
    }
  }

  return null;
}

function parseSubscriberFromInitialData(html: string): string | null {
  const blockMatch = html.match(/(?:var\s+)?ytInitialData\s*=\s*(\{[\s\S]*?\})\s*;\s*<\/script>/);

  if (!blockMatch?.[1]) {
    return null;
  }

  try {
    const initialData = JSON.parse(blockMatch[1]);
    const found = findSubscriberTextDeep(initialData);

    return found ? normalizeSubscriberLabel(found) : null;
  } catch {
    return null;
  }
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

  const metaDescriptionCount =
    html.match(/<meta\s+name="description"\s+content="([^"]+)"/i)?.[1] ||
    html.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i)?.[1];

  if (metaDescriptionCount) {
    const parsedMetaDescription = normalizeSubscriberLabel(decodeXmlEntities(metaDescriptionCount));
    if (parsedMetaDescription && parsedMetaDescription !== metaDescriptionCount) {
      return parsedMetaDescription;
    }
  }

  const parsedInitialDataValue = parseSubscriberFromInitialData(html);
  if (parsedInitialDataValue) {
    return parsedInitialDataValue;
  }

  const patterns = [
    /"subscriberCountText"\s*:\s*\{\s*"simpleText"\s*:\s*"([^"]+)"/,
    /"subscriberCountText"\s*:\s*\{[^{}]*"label"\s*:\s*"([^"]+)"/,
    /"subscriberCountText"\s*:\s*\{\s*"runs"\s*:\s*\[\{\s*"text"\s*:\s*"([^"]+)"/,
    /"subscriberCountText"\s*:\s*\{[\s\S]*?"accessibilityData"\s*:\s*\{\s*"label"\s*:\s*"([^"]+)"/
  ];

  for (const pattern of patterns) {
    const found = html.match(pattern)?.[1];
    if (found) {
      return normalizeSubscriberLabel(found);
    }
  }

  return null;
}

function decodeXmlEntities(value: string) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

async function scrapeLatestVideoFromFeed(channelId: string): Promise<ScrapedLatestVideo | null> {
  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  const feedRes = await fetch(feedUrl, {
    next: { revalidate: 900 }
  });

  if (!feedRes.ok) {
    return null;
  }

  const xml = await feedRes.text();
  const idMatch = xml.match(/<yt:videoId>\s*([^<\s]+)\s*<\/yt:videoId>/i);
  const titleMatch = xml.match(/<entry>[\s\S]*?<title>([\s\S]*?)<\/title>/i);

  const latestVideoId = idMatch?.[1]?.trim();
  if (!latestVideoId) {
    return null;
  }

  return {
    latestVideoId,
    latestVideoTitle: decodeXmlEntities(titleMatch?.[1]?.trim() || 'Latest upload from Ramzi ZRT'),
    latestVideoThumbnail: `https://i.ytimg.com/vi/${latestVideoId}/hqdefault.jpg`
  };
}

export async function GET() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID || CHANNEL_ID;

  if (!apiKey) {
    const payload: YouTubePayload = { ...FALLBACK, channelUrl: getChannelUrl(channelId) };
    let hasRssLatestVideo = false;

    const [subscriberResult, latestVideoResult] = await Promise.allSettled([
      scrapeSubscriberCount(),
      scrapeLatestVideoFromFeed(channelId)
    ]);

    if (subscriberResult.status === 'fulfilled' && subscriberResult.value) {
      payload.subscriberCount = subscriberResult.value;
    }

    if (latestVideoResult.status === 'fulfilled' && latestVideoResult.value) {
      payload.latestVideoId = latestVideoResult.value.latestVideoId;
      payload.latestVideoTitle = latestVideoResult.value.latestVideoTitle;
      payload.latestVideoThumbnail = latestVideoResult.value.latestVideoThumbnail;
      hasRssLatestVideo = true;
    }

    return NextResponse.json({
      ...payload,
      source: hasRssLatestVideo ? 'rss' : 'fallback'
    });
  }

  try {
    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${channelId}&key=${apiKey}`,
      { next: { revalidate: 900 } }
    );

    if (!channelRes.ok) {
      return NextResponse.json({ ...FALLBACK, source: 'fallback' });
    }

    const channelData = await channelRes.json();
    const channel = channelData?.items?.[0];

    if (!channel) {
      return NextResponse.json({ ...FALLBACK, source: 'fallback' });
    }

    const latestVideo = await scrapeLatestVideoFromFeed(channelId);

    const data: YouTubePayload = {
      subscriberCount: Number(channel.statistics?.subscriberCount || 0).toLocaleString(),
      latestVideoId: latestVideo?.latestVideoId || FALLBACK.latestVideoId,
      latestVideoTitle: latestVideo?.latestVideoTitle || FALLBACK.latestVideoTitle,
      latestVideoThumbnail: latestVideo?.latestVideoThumbnail || FALLBACK.latestVideoThumbnail,
      channelUrl: getChannelUrl(channelId)
    };

    return NextResponse.json({ ...data, source: latestVideo ? 'rss' : 'fallback' });
  } catch {
    return NextResponse.json({ ...FALLBACK, source: 'fallback' });
  }
}
