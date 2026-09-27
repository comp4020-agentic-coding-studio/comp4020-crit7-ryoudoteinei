# Process overview

## What I built

I built Slotwise, an unofficial companion to ANU MyTimetable. Students can save teaching times, see clashes and return to the same draft after a reload. The app covers planning before official class allocation.

## How I directed the work

I read the C7 brief and ANU's MyTimetable guidance before choosing this slice. The official system manages enrolment-dependent allocations and changing availability. I kept the prototype to a personal draft: students enter activity details themselves, and the site never claims live seat counts or a confirmed allocation. I made that boundary explicit in CLAUDE.md and the public README.

The starter guestbook already persisted data. I kept its migration and asked the agent to add a `saved_slots` table instead of storing choices only in the browser. Each row belongs to an anonymous browser key, checked on every write. In [6188357](https://github.com/comp4020-agentic-coding-studio/comp4020-crit7-ryoudoteinei/commit/6188357), the schema, validation and overlap rule make adjacent classes compatible while marking actual clashes.

I then directed the agent to connect form, database and refreshed page. The HTTP checks in [4d2c1ed](https://github.com/comp4020-agentic-coding-studio/comp4020-crit7-ryoudoteinei/commit/4d2c1ed) cover persistence, invalid times, clashes and separation between browsers. An early Fly build caught a Docker copy-order error; a later run showed that unrelated maintainer test fixtures needed Git inside the builder. I corrected the copy order and ran the application tests in the remote build. All 22 app checks passed.

Finally, I used the deployed app: I saved a time, reloaded, and added an overlapping time. The Fly database retained both and the interface marked their conflict. Automated checks establish persistence and basic accessibility; I still need to judge whether a student understands that this is a draft and must allocate in MyTimetable.
