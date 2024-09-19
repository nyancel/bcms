```json
{
  "event_type": "user-added",
  "data": {
    // some arbitrary data for the event
  },
  "submitter_id": "undefined",
  "timestamp": 1239871236451.10231
}
```

The event subsystem handles telemetry, logging and historical data, and contains
ordered information about what happened within the system at which times.

The events overarching goal is to let other systems state what happened, and when.
for instance that a user saved a draft of an article, or that a user uploaded some media,
or that a non-"logged in" client requested to see some content on the server.

as well as password reset requests, email change requests, and other relevant information.
this logging and telemtry exists in order for the system to perform its own health-checks.
as well as providing valuable feedback to the editorial users. (what articles are popular,
how much time do users spend creating content, etc etc.)

things you should be able to do include:

- posting an event alongside an event-type or key.
- retrieving events within x timeframe or based off some key
- retrieving a specific event based on an ID
- subscribing to an event-type or key

Events NEVER "expire", there is no modification or alteration of events
