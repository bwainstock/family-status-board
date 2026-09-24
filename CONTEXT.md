# Family Status Board

A wall-mounted e-paper board that shows one pre-literate child what her day looks like:
the weather, what's for school lunch, and whether anything special is happening.
Everything is chosen so it can be understood without reading words.

## Language

### The audience

**Viewer**:
The pre-literate child the board is designed for. She cannot read, so any information
carried only by words is information she does not receive.
_Avoid_: user, reader, kid

**Caregiver**:
An adult who reads the board over the Viewer's shoulder, maintains it, and recharges it.
Secondary audience: never the reason a piece of information is on the board.
_Avoid_: parent, admin, owner

### The device

**Board**:
The physical wall-mounted unit: e-paper panel, controller, and battery. The thing the
Viewer walks up to.
_Avoid_: dashboard, display, screen, device

**Frame**:
One complete rendered image occupying the whole panel, produced away from the Board and
sent to it ready to draw. The Board never composes a Frame itself.
_Avoid_: image, render, bitmap, screen

**Refresh**:
One full cycle of the Board waking, fetching a Frame, drawing it, and sleeping again.
The Board does nothing else, ever.
_Avoid_: update, sync, poll, tick

**Refresh Window**:
A time of day at which a Refresh is expected to happen, chosen around when the Viewer
actually looks at the Board rather than around the clock.
_Avoid_: schedule, cron, interval

**Stale Frame**:
A Frame still displayed after the facts it describes have changed — usually because a
Refresh failed. E-paper holds its last image with no power, so a Stale Frame is
indistinguishable from a correct one unless the Board says otherwise.
_Avoid_: cached frame, old image

### What's on it

**Glyph**:
A picture standing for one fact, drawn to be understood by the Viewer with no words.
The primary carrier of meaning on the Board.
_Avoid_: icon, symbol, image, pictogram

**Caption**:
The one or two words printed with a Glyph. Read by the Caregiver, and by the Viewer only
as a thing she is learning to recognise. A Caption may never be the only carrier of a fact.
_Avoid_: label, text, description, title

**Entrée**:
The single dish chosen to stand for a whole day's school lunch. A day's real menu lists
many items; the Board shows exactly one.
_Avoid_: meal, menu item, lunch, dish

**Sleeps**:
The count of nights between today and a thing worth waiting for. The Viewer's unit of
future time: she has no grip on dates, but complete command of how many more times she
has to go to bed.
_Avoid_: days until, countdown, days remaining

### Where the facts come from

**PTO Calendar**:
The Trace Elementary PTO's public Google Calendar. It is an organisation's working
calendar, not the school's academic calendar: it carries fundraisers and committee
meetings, and it does **not** say when school is closed.
_Avoid_: school calendar, events calendar

**School Calendar**:
The district's academic calendar, which is what actually determines Non-School Days.
A separate source from the PTO Calendar, and the only authority on whether there is
school. Confusing the two is the mistake this glossary exists to prevent.
_Avoid_: district calendar, academic calendar, PTO calendar

**Kid-Relevant Event**:
An entry on the PTO Calendar that changes the Viewer's own day — something she will see,
attend, or be asked to dress for. Most entries are not: the default is to show nothing.
_Avoid_: event, activity, happening

**Non-School Day**:
A weekday on which the Viewer has no school. Both an answer the Board gives directly and
a thing worth counting Sleeps toward, which makes it the most load-bearing fact the
Board knows.
_Avoid_: holiday, day off, closure, break

**Minimum Day**:
A school day that ends early. Distinct from a Non-School Day: there is school, and there
is an Entrée. The district sets these per school level, and some apply to secondary
students only, so whether a given date is a Minimum Day depends on who is being asked
about.
_Avoid_: early release, short day, half day, early dismissal
