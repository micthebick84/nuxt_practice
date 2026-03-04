// Server-side batch endpoint: combines all 13 transport dashboard queries into ONE response.
// Includes a short TTL cache to deduplicate rapid-fire requests from Nuxt re-initialization.

interface CacheEntry {
  data: any;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 5000; // 5 seconds

function getCached(key: string): any | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data;
  }
  cache.delete(key);
  return null;
}

function setCache(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() });
  // Cleanup old entries
  if (cache.size > 50) {
    const now = Date.now();
    for (const [k, v] of cache) {
      if (now - v.timestamp > CACHE_TTL) cache.delete(k);
    }
  }
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const startDate = query.startDate as string || '';
  const endDate = query.endDate as string || '';
  const qs = `startDate=${startDate}&endDate=${endDate}`;

  // Check cache first
  const cacheKey = `transport-batch:${qs}`;
  const cached = getCached(cacheKey);
  if (cached) {
    return cached;
  }

  // Forward authorization header
  const auth = getHeader(event, 'authorization');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (auth) {
    headers['Authorization'] = auth;
  }

  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl || 'http://localhost:8080';
  const BASE = `${apiBaseUrl}/api/transport`;

  const fetchOne = async (path: string) => {
    try {
      const res: any = await $fetch(`${BASE}/${path}?${qs}`, { headers });
      return res?.data ?? res ?? [];
    } catch {
      return [];
    }
  };

  const fetchObj = async (path: string) => {
    try {
      const res: any = await $fetch(`${BASE}/${path}?${qs}`, { headers });
      return res?.data ?? res ?? {};
    } catch {
      return {};
    }
  };

  // Execute all 13 queries in parallel on the server side
  const [
    daily, dayOfWeek, hourlyStats, dayLines, ticketType, cardType,
    topBoarding, stationImbalance, routeEfficiency, hourTicketCross,
    lineTopStations, freeFare, rawSummary,
  ] = await Promise.all([
    fetchOne('daily'),
    fetchOne('stats/day-of-week'),
    fetchOne('stats/hourly'),
    fetchOne('day-lines'),
    fetchOne('stats/ticket-type'),
    fetchOne('stats/card-type'),
    fetchOne('stats/top-boarding-stations'),
    fetchOne('stats/station-imbalance'),
    fetchOne('stats/route-efficiency'),
    fetchOne('stats/hour-ticket-cross'),
    fetchOne('lines/top-stations'),
    fetchOne('stats/free-fare'),
    fetchObj('stats/raw-summary'),
  ]);

  const result = {
    daily, dayOfWeek, hourlyStats, dayLines, ticketType, cardType,
    topBoarding, stationImbalance, routeEfficiency, hourTicketCross,
    lineTopStations, freeFare, rawSummary,
  };

  // Cache the result
  setCache(cacheKey, result);

  return result;
});
