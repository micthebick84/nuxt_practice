export default defineEventHandler(async (event) => {
  const path = event.context.params?.path || '';
  const targetUrl = `http://localhost:8080/${path}`;

  const query = getQuery(event);
  const queryString = new URLSearchParams(query as Record<string, string>).toString();
  const url = queryString ? `${targetUrl}?${queryString}` : targetUrl;

  const method = event.method;
  const headers: Record<string, string> = {};

  // Forward authorization header
  const auth = getHeader(event, 'authorization');
  if (auth) {
    headers['Authorization'] = auth;
  }
  headers['Content-Type'] = 'application/json';

  const fetchOptions: RequestInit = {
    method,
    headers,
  };

  if (method !== 'GET' && method !== 'HEAD') {
    try {
      const body = await readBody(event);
      if (body) {
        fetchOptions.body = JSON.stringify(body);
      }
    } catch {
      // no body
    }
  }

  const response = await $fetch.raw(url, {
    ...fetchOptions,
    ignoreResponseError: true,
  } as any);

  setResponseStatus(event, response.status);
  return response._data;
});
