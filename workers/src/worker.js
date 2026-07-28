/** @import { PlatformProxy } from "wrangler" */

// Must match ids in src/static/snippets.ts
const SNIPPET_IDS = ['ts-dedupe', 'ts-unwrap', 'js-tally', 'js-fetch', 'rust-match', 'rust-iter'];
const BLOCKED_INITIALS = new Set([
  'ASS', 'CNT', 'COK', 'CUM', 'DIC', 'DIK', 'FAG',
  'FCK', 'FUC', 'FUK', 'JIZ', 'KKK', 'NIG', 'SEX', 'TIT', 'TWT',
]);

const json = (body, status, corsHeaders) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'content-type': 'application/json' },
  });

export default {
  /**
   * @param {Request} request
   * @param {PlatformProxy['env']} env
   * @param {PlatformProxy['ctx']} ctx
   */
  async fetch(request, env, ctx) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": env.LOCAL ? "http://localhost:3000" : 'https://wattry.com',
      "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
      "Access-Control-Max-Age": "86400",
      "Access-Control-Allow-Headers": "*"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    if (url.pathname === '/typetest/board' && request.method === 'GET') {
      const { results } = await env.DB.prepare(
        'SELECT initials, wpm, accuracy, created_at FROM scores ORDER BY wpm DESC, accuracy DESC LIMIT 20'
      ).all();

      return json({ scores: results }, 200, corsHeaders);
    }

    if (url.pathname === '/typetest/score' && request.method === 'POST') {
      const ip = request.headers.get('cf-connecting-ip') ?? 'unknown';
      const { success } = await env.SCORE_RATE_LIMITER.limit({ key: ip });

      if (!success) {
        return json({ error: 'rate limited — try again in a minute' }, 429, corsHeaders);
      }

      let body;
      try {
        body = await request.json();
      } catch {
        return json({ error: 'invalid JSON' }, 400, corsHeaders);
      }

      const { initials, wpm, accuracy, snippetId } = body ?? {};

      if (typeof initials !== 'string' || !/^[A-Z]{3}$/.test(initials)) {
        return json({ error: 'initials must be exactly 3 characters A-Z' }, 400, corsHeaders);
      }
      if (BLOCKED_INITIALS.has(initials)) {
        return json({ error: 'pick different initials' }, 400, corsHeaders);
      }
      if (typeof wpm !== 'number' || !Number.isFinite(wpm) || wpm <= 0 || wpm > 250) {
        return json({ error: 'implausible wpm' }, 400, corsHeaders);
      }
      if (typeof accuracy !== 'number' || !Number.isFinite(accuracy) || accuracy < 0 || accuracy > 100) {
        return json({ error: 'implausible accuracy' }, 400, corsHeaders);
      }
      if (!SNIPPET_IDS.includes(snippetId)) {
        return json({ error: 'unknown snippet' }, 400, corsHeaders);
      }

      await env.DB.prepare(
        "INSERT INTO scores (initials, wpm, accuracy, snippet_id, created_at) VALUES (?1, ?2, ?3, ?4, datetime('now'))"
      ).bind(initials, wpm, accuracy, snippetId).run();

      return json({ ok: true }, 201, corsHeaders);
    }

    // Existing hello response — the terminal `fetch` command depends on it.
    return json({ data: 'Hello World!' }, 200, corsHeaders);
  }
};
