import type { ApiConfig } from "./shared";

export const API_CONFIG: ApiConfig = {
  name: "hl-vaults",
  slug: "hl-vaults",
  description: "Hyperliquid vault summaries — APR, TVL, PnL, followers.",
  version: "1.0.0",
  routes: [
    {
      method: "GET",
      path: "/api/vaults",
      price: "$0.003",
      description: "Get Hyperliquid vault summaries sorted by APR",
      toolName: "hyperliquid_get_vault_data",
      toolDescription: "Use this when you need Hyperliquid vault performance data. Returns all vault summaries including APR, total PnL, TVL, followers, and leader address, sorted by APR descending. Do NOT use for whale positions — use hyperliquid_track_whale_positions. Do NOT use for funding rates — use perp_get_funding_rates.",
      inputSchema: {
        type: "object",
        properties: {
          limit: { type: "number", description: "Max vaults to return (default: 20)" },
        },
      },
    },
  ],
};
