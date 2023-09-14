==============
Readme...

WORK IN PROGRESS

PLEASE DO NOT CHANGE ANYTHING IN THIS PROJECT WITHOUT DISCUSSION FIRST

Thanks,

# Steve

========
RUNNING:
========

http://localhost:3001/?backend=tequity_fakelocal&debug

(debug enables the debug bounds and text tracking)

============
CODE LAYOUT:
============

NB No code should **EVER** refer directly to the core's source files outside of core.

CORE exposes parts of System and Frontend that are needed
If they are not exposed they have no need to be referenced (or you explain why they are needed and I'll look to make them available)

When things are added to CORE use the relative pathing method and NOT @/ style pathing.

NB No code should **EVER** refer directly to the core's source files outside of core.
^^
Yes, again here because it must not happen.

# SYSTEM FOLDER:

System is for all base code related to the system logic and core handling
System should not be modified without very good reason, for now at least, other than by me (Steve)

# FRONTEND FOLDER:

Frontend is for the core stuff that is to be reusable in the front end of the game

======================
LOGIC VS DISPLAY LOGIC
======================

Code that runs purely for display purposes can execute in the display tick

Code the runs for logic purposes (i.e. game or sequence control) should run in the logic tick

Code with runs for both purposes should be refactored into two paths
