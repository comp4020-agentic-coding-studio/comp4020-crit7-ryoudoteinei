# Crit 7 reflection

## What breakthrough moved the work forward?

The useful turning point was deciding exactly which MyTimetable state the prototype was allowed to represent. I had initially thought about replacing class allocation, but the real service also controls enrolment, availability and changes made by other students. I narrowed the app to a personal planning draft. That made the end-to-end task concrete: enter a course activity, store it in SQLite, reload the page, and see a clash when another time overlaps.

The starter guestbook proved that the platform could save data. I asked the agent to change the model and routes so each visitor's draft is stored separately, without collecting names or ANU credentials. The first remote builds exposed a Docker copy-order error and then a missing Git executable in the builder's test environment. Correcting the copy step and running the application contracts there let me verify the behaviour on the same Linux path as the deployment. Seeing my saved slot return after a real Fly reload was the evidence that the new workflow existed beyond the page.

## What changed about the developer I want to be?

I want to make a system's state understandable to the person using it. A polished "Saved" message would be misleading if it implied a class had been allocated, or if another visitor could see my draft. This prototype made me treat wording, database ownership and verification as one design decision. The agent helped produce the code; my responsibility was to set that boundary and check the running result.
