# Slotwise: C7 working rules

## Scope and source

- Improve one slice of the ANU MyTimetable experience: preparing a weekly
  tutorial/lab schedule, seeing overlaps and retaining a draft across reloads.
- This is an unofficial student planner. It does not connect to ANU systems,
  submit allocation requests, claim live seat counts or confirm enrolment.
- ANU's student MyTimetable guide is the reference for the real system and its
  language. Use sample activities and clearly label them as examples.
- Keep the app small: enter a course code, teaching activity, day and start/end
  time; save it; show conflicts; allow removal. No accounts or real student data.

## Data and correctness

- SQLite on the course-managed volume is the source of truth. Browser state is
  only a view; a saved slot must survive a fresh GET and a Fly redeploy.
- Keep the starter's existing migration and table so deployed data is not lost.
  Change the Drizzle schema, generate and commit a new migration, and verify it
  upgrades the existing Fly database.
- Anonymous browser cookies partition drafts. No visitor may read or remove
  another visitor's entries through the public routes.
- Interpret intervals as half-open: 10:00–11:00 and 11:00–12:00 do not clash.
  Validate all POST data on the server. A failed form must not write a row.
- Use Post/Redirect/Get for forms. Keep core saving functional without client
  JavaScript; progressive extras must not determine whether a plan persists.
- Never store names, university IDs, authentication secrets or payment details.
  Do not echo the Fly token in logs, tests, documentation or tool outputs.

## Implementation and evidence

- Preserve the starter's Fly machine, volume, Dockerfile and deployment shape.
  The app remains Astro + Drizzle + SQLite as provisioned.
- Update `spec/routes.ts` for every new page. Replace starter-specific
  guestbook checks with contracts that exercise persistence, clashes and
  visitor isolation against the built HTTP server.
- Make small, meaningful commits as work lands. Run available checks and
  inspect both 1920×1080 and 390×844 viewports. Tests cover mechanics; actual
  readability, interaction clarity and the fidelity of the ANU analogy need
  human review.
