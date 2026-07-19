# Hyperliquid Vaults API

[![MCP Server](https://img.shields.io/badge/MCP-server-blue)](https://hl-vaults.api.klymax402.com/mcp)
[![x402](https://img.shields.io/badge/payments-x402-6E56CF)](https://x402.org)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)

Hyperliquid vault summaries — APR, TVL, PnL, followers. Pay-per-call via [x402](https://x402.org) (USDC on Base L2) -- no API key, no signup, no rate-limit wall.

Part of the [klymax402](https://klymax402.com) marketplace -- 100 x402 micropayment APIs for AI agents, one wallet, USDC on Base.

## Quickstart -- MCP

Add to your MCP client config (Claude Desktop, Cursor, ElizaOS, etc.):

```json
{
  "mcpServers": {
    "hl-vaults": {
      "url": "https://hl-vaults.api.klymax402.com/mcp"
    }
  }
}
```

## Quickstart -- HTTP (x402)

```bash
curl "https://hl-vaults.api.klymax402.com/api/vaults"
# -> 402 Payment Required, with an x402 payment challenge in the response body
```

Any x402-aware client ([`@x402/fetch`](https://www.npmjs.com/package/@x402/fetch), [`x402-agent-tools`](https://www.npmjs.com/package/x402-agent-tools), ATXP) handles the 402 -> sign -> retry cycle automatically.

## Tools

| Tool | Method | Path | Price | Description |
|---|---|---|---|---|
| `hyperliquid_get_vault_data` | GET | `/api/vaults` | $0.008 | Get Hyperliquid vault summaries sorted by APR |

### `hyperliquid_get_vault_data`

Use this when you need Hyperliquid vault performance data. Returns all vault summaries including APR, total PnL, TVL, followers, and leader address, sorted by APR descending. Do NOT use for whale positions — use hyperliquid_track_whale_positions. Do NOT use for funding rates — use perp_get_funding_rates.

**Parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `limit` | number | no | Max vaults to return (default: 20) |

## Example agent prompts

- "Hyperliquid vault performance data"

## Payment

- Protocol: [x402](https://x402.org) -- HTTP-native pay-per-call, no signup, no API key
- Network: Base L2 (`eip155:8453`)
- Asset: USDC
- Facilitator: Coinbase CDP (primary), PayAI (fallback)

## Part of klymax402

100 x402 micropayment APIs for AI agents -- one wallet, USDC on Base, zero signup.

- Catalog: https://klymax402.com/llms.txt
- Full API reference: https://klymax402.com/llms-full.txt
- Live stats: https://klymax402.com/stats

## License

MIT
