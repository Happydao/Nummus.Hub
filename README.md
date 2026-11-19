# Nummus.Hub
Nummus Hub - tBTC accumulation and supply reduction
https://happydao.github.io/Nummus.Hub/

## Dashboard maintenance

During the community's transition to Zcash (ZEC), all displayed figures and
transaction lists are frozen at the latest Hub snapshot available on November 17,
2026 (UTC), commit `dfd43c8b`. The three files in `data/` are restored verbatim
from that commit. Source timestamps are preserved: Vault status at 09:57 UTC and
price/supply at 13:58:52 UTC. This Hub has no daily chart or daily time series;
subsequent visits display the same frozen figures.

The `sync-data.yml` schedule is removed and its job is guarded with `if: ${{ false }}`
so manual runs also cannot overwrite the snapshot. To resume updates after the
transition, remove the guard, restore the documented cron schedule, and update
the dashboard content and maintenance banner together. Linked dashboards are
managed in their own repositories.
