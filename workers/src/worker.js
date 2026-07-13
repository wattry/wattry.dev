/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

/** @import { PlatformProxy } from "wrangler" */

export default {
  /**
   * @param {unknown} request
   * @param {PlatformProxy['env']} env
   * @param {PlatformProxy['ctx']} ctx
   */
  async fetch(request, env, ctx) {
    // You can view your logs in the Observability dashboard
    const corsHeaders = {
      "Access-Control-Allow-Origin": env.LOCAL ? "http://localhost:3000" : 'https://wattry.com',
      "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
      "Access-Control-Max-Age": "86400",
      "Access-Control-Allow-Headers": "*"
    };
    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const res = new Response(JSON.stringify({ data: 'Hello World!' }));

    for (const [key, value] of Object.entries(corsHeaders)) {
      res.headers.set(key, value);
    }

    res.headers.set('content-type', 'application/json')

    return res;
  }
};

