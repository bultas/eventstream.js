# EventStream inside browser

## Example

```javascript
import { getStream, addEvent, connectStream } from "./index.js";

pipe(
  connectStream,
  (storage) =>
    addEvent(storage, {
      data: [1, 2, 3],
      type: "eventType",
      metadata: {},
    }),
  (storage) =>
    addEvent(storage, {
      data: [4, 5, 6],
      type: "eventType",
      metadata: {},
    }),
  getStream
)(localStorage);
```

## Test (Deno)

```
deno test
```
