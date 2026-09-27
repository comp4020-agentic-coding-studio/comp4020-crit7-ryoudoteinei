# Slotwise

Slotwise is an unofficial planning space for the part of ANU MyTimetable where a student weighs tutorial and lab times against the rest of their week. Enter a course code, activity, day and time; keep a draft; and see clashes before making a real allocation. The draft survives a reload because it is stored in SQLite on the app's Fly volume.

## What good looks like here

The useful moment is when two activities overlap and a student can see the conflict without re-entering everything. Saving must change server state, a fresh load must show the same data, and removing a time must clear the right entry. A visitor in another browser must not see or remove this draft. An invalid time or course code must not create a row.

The interface should work with a keyboard and at both the desktop and phone marking sizes. Clear language matters as much as the database: a saved draft is not an ANU allocation. I chose to let students enter the times they are considering because the prototype has no authorised feed of live class offerings or availability. It never asks for an ANU login, a student number or the names of other students.

## Boundaries and source

ANU describes [MyTimetable](https://www.anu.edu.au/students/program-administration/timetabling/01-access-and-support-for-mytimetable) as the official place to view class timetables and allocate small teaching activities. Slotwise helps with the earlier planning decision. Once a draft makes sense, the student returns to the official system to request an actual class allocation. The illustrated timetable and example course code here are samples, not live ANU records.

One anonymous browser cookie connects a visitor to their server-side draft for 30 days. Clearing that cookie removes the browser's way back to the draft; this prototype has no account recovery. The cookie is HttpOnly and does not contain the timetable itself. App state remains on the course-managed volume during a normal restart or redeploy.

The automated checks in `spec/` protect validation, persistence, visitor separation and the supplied accessibility floor. Whether the planner feels calmer than the original allocation task remains a judgement to test with people.
