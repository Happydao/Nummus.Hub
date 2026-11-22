# Nummus.Hub
Nummus Hub - ZEC accumulation and supply reduction
https://happydao.github.io/Nummus.Hub/

## ZEC data

Monitoring resumes from November 22, 2026. The Hub imports ZEC balances, USD
values and transaction lists from `Happydao/Nummus.VaultDAO/data/status.json`.
The expected asset is ZEC with Solana mint
`A7bdiYdS5GjqGFtxf17ppRHtDKPkkRqbKtR27dxvQXaS`; wallet fields are
`zec_balance`, `zec_usd_value` and `last_zec_transfers`.
Burn and supply data still come from `Happydao/Nummus.burn`.

The sync workflow runs every 30 minutes or manually and validates imported
JSON before committing. HTTP failures or incompatible asset data stop the sync.

## Historical freeze

November 17–21, 2026 remains the frozen period in the source dashboards.
The original November 17 Hub snapshot is preserved in Git commit `dfd43c8b`.
This Hub has no daily chart or time series; it displays the latest imported
snapshot. Historical series are managed in their source repositories.
