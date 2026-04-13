import type { ApiConfig } from "./shared";

export const API_CONFIG: ApiConfig = {
  name: "hl-vaults",
  slug: "hl-vaults",
  description: "Hyperliquid vault performance -- APR, TVL, total PnL, followers, leader info. Sorted by best returns.",
  version: "1.0.0",
  routes: [
    {
      method: "GET",
      path: "/api/vaults",
      price: "$0.003",
      description: "Get Hyperliquid vault summaries sorted by APR",
      toolName: "hyperliquid_get_vault_data",
      toolDescription: `Use this when you need Hyperliquid vault performance data to compare yield strategies. Returns all vault summaries sorted by APR descending with key performance metrics.

1. vaults: array of vault objects sorted by APR
2. Each vault contains: name, address, apr (annualized %), totalPnl, tvl (total value locked), followers, leaderAddress
3. totalVaults: number of active vaults
4. averageApr: mean APR across all vaults
5. totalTvl: combined TVL across all vaults

Example output: {"vaults":[{"name":"Alpha Vault","address":"0xabc...","apr":145.2,"totalPnl":890000,"tvl":2500000,"followers":342,"leaderAddress":"0xdef..."}],"totalVaults":85,"averageApr":42.5,"totalTvl":180000000}

Use this FOR comparing Hyperliquid vault yields, identifying top-performing vault managers, or researching copy-trading strategies on HL.

Do NOT use for whale positions -- use hyperliquid_track_whale_positions. Do NOT use for market prices/funding -- use hyperliquid_get_market_data. Do NOT use for DeFi yields on EVM -- use defi_find_best_yields.`,
      inputSchema: {
        type: "object",
        properties: {
          limit: { type: "number", description: "Max vaults to return (default: 20)" },
        },
      },
      outputSchema: {
          "type": "object",
          "properties": {
            "count": {
              "type": "number",
              "description": "Number of vaults returned"
            },
            "totalVaults": {
              "type": "number",
              "description": "Total vaults available"
            },
            "sortedBy": {
              "type": "string",
              "description": "Sort order"
            },
            "vaults": {
              "type": "array",
              "items": {
                "type": "object"
              }
            },
            "cachedUntil": {
              "type": "string"
            }
          },
          "required": [
            "count",
            "vaults"
          ]
        },
    },
  ],
};
