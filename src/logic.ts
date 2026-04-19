import type { Hono } from "hono";


// ATXP: requirePayment only fires inside an ATXP context (set by atxpHono middleware).
// For raw x402 requests, the existing @x402/hono middleware handles the gate.
// If neither protocol is active (ATXP_CONNECTION unset), tryRequirePayment is a no-op.
async function tryRequirePayment(price: number): Promise<void> {
  if (!process.env.ATXP_CONNECTION) return;
  try {
    const { requirePayment } = await import("@atxp/server");
    const BigNumber = (await import("bignumber.js")).default;
    await requirePayment({ price: BigNumber(price) });
  } catch (e: any) {
    if (e?.code === -30402) throw e;
  }
}

interface VaultSummary {
  vaultAddress: string;
  name: string;
  leader: string;
  apr: number;
  aprFormatted: string;
  totalPnl: number;
  followers: number;
  tvl: number;
  tvlFormatted: string;
}

// Cache
let cachedData: { vaults: VaultSummary[]; timestamp: number } | null = null;
const CACHE_TTL = 60 * 1000; // 60 seconds

async function fetchVaultSummaries(): Promise<VaultSummary[]> {
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
    return cachedData.vaults;
  }

  const resp = await fetch("https://api.hyperliquid.xyz/info", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "vaultSummaries" }),
  });

  if (!resp.ok) {
    throw new Error(`Hyperliquid API error: ${resp.status}`);
  }

  const raw = await resp.json() as any[];

  const vaults: VaultSummary[] = raw.map((v: any) => {
    const tvl = parseFloat(v.tvl || "0");
    const totalPnl = parseFloat(v.allTimePnl || "0");
    // APR estimate: annualized from total PnL vs TVL
    // Use portfolio value and PnL to estimate
    const apr = tvl > 0 ? (totalPnl / tvl) * 100 : 0;

    return {
      vaultAddress: v.vaultAddress || v.vault || "",
      name: v.name || "Unknown",
      leader: v.leader || "",
      apr: Math.round(apr * 100) / 100,
      aprFormatted: `${apr.toFixed(2)}%`,
      totalPnl: Math.round(totalPnl * 100) / 100,
      followers: parseInt(v.followers || "0"),
      tvl: Math.round(tvl * 100) / 100,
      tvlFormatted: formatUsd(tvl),
    };
  });

  // Sort by APR descending
  vaults.sort((a, b) => b.apr - a.apr);

  cachedData = { vaults, timestamp: Date.now() };
  return vaults;
}

function formatUsd(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
}

export function registerRoutes(app: Hono) {
  app.get("/api/vaults", async (c) => {
    await tryRequirePayment(0.003);
    const limit = parseInt(c.req.query("limit") || "20");

    try {
      const vaults = await fetchVaultSummaries();
      const limited = vaults.slice(0, Math.min(limit, 100));

      return c.json({
        count: limited.length,
        totalVaults: vaults.length,
        sortedBy: "apr_descending",
        vaults: limited,
        cachedUntil: new Date(Date.now() + CACHE_TTL).toISOString(),
      });
    } catch (err: any) {
      return c.json({ error: "Failed to fetch Hyperliquid vaults", details: err.message }, 502);
    }
  });
}
