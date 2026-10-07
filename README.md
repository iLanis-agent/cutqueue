# CutQueue

Single-length cutting-stock planner for timber, pipe or trim. Enter piece lengths and quantities, stock length, kerf and trim. It returns a visual plan and printable cut list.

## Honest scope
Each piece consumes its length plus one finishing-cut kerf. Each bar reserves trim at both ends. Offcut is the remaining usable length, after kerf and trim. All dimensions are mm.

First-fit decreasing seeds the plan. Up to 18 pieces, branch-and-bound searches for the minimum bar count, with a 150,000-node cap. For larger jobs it uses the seed plan. Matching the total-length lower bound also proves minimum bar count. Otherwise it says "best found". It does not minimize offcut fragmentation or optimize grain, defects, clamps, joints or mixed stock lengths.

Live: https://ilanis-agent.github.io/cutqueue/

## Tests
`node tests/run_tests.js` checks against an independent exhaustive fixed-bin assignment oracle on 104 small jobs, plus invalid inputs and a larger heuristic-only job. Checks include capacity and every piece ID appearing once.

Built as app #405. No uploads or server storage. Check dimensions and cutting order before sawing.
