import { assertEquals } from "https://deno.land/std@0.172.0/testing/asserts.ts";

import {
  initStream,
  getStream,
  addEvent,
  replaceStream,
  connectStream,
} from "./index.js";
import { pipe } from "./pipe.js";

Deno.test("get null stream", () => {
  const events = getStream(storageMock());
  assertEquals(events, null);
});

Deno.test("connectStream to null stream", () => {
  const events = pipe(connectStream, getStream)(storageMock());
  assertEquals(events, []);
});

Deno.test("connectStream to existing stream", () => {
  const events = pipe(
    initStream,
    (storage) =>
      addEvent(storage, {
        data: [1, 2, 3],
        type: "test",
        metadata: {},
      }),
    connectStream,
    getStream
  )(storageMock());

  assertEquals(events, [
    {
      data: [1, 2, 3],
      type: "test",
      metadata: {},
    },
  ]);
});

Deno.test("init & get stream", () => {
  const events = pipe(initStream, getStream)(storageMock());
  assertEquals(events, []);
});

Deno.test("init > add > get stream", () => {
  const events = pipe(
    initStream,
    (storage) =>
      addEvent(storage, {
        data: [1, 2, 3],
        type: "test",
        metadata: {},
      }),
    (storage) =>
      addEvent(storage, {
        data: [4, 5, 6],
        type: "test2",
        metadata: {},
      }),
    getStream
  )(storageMock());

  assertEquals(events, [
    {
      data: [1, 2, 3],
      type: "test",
      metadata: {},
    },
    {
      data: [4, 5, 6],
      type: "test2",
      metadata: {},
    },
  ]);
});

Deno.test("init > add > init stream", () => {
  const events = pipe(
    initStream,
    (storage) =>
      addEvent(storage, {
        data: [1, 2, 3],
        type: "test",
        metadata: {},
      }),
    (storage) =>
      addEvent(storage, {
        data: [4, 5, 6],
        type: "test2",
        metadata: {},
      }),
    initStream,
    getStream
  )(storageMock());

  assertEquals(events, []);
});

Deno.test("replace stream", () => {
  const events = pipe(
    initStream,
    (storage) => replaceStream(storage, ["a", "b"]),
    getStream
  )(storageMock());
  assertEquals(events, ["a", "b"]);
});

Deno.test("add invalid payload", () => {
  const events = pipe(
    initStream,
    (storage) =>
      // @ts-ignore
      addEvent(storage, {
        data: [1, 2, 3],
      }),
    getStream
  )(storageMock());
  assertEquals(events, []);
});

function storageMock() {
  let storage = {};

  return {
    setItem: function (key, value) {
      storage[key] = value || "";
    },
    getItem: function (key) {
      return key in storage ? storage[key] : null;
    },
    removeItem: function (key) {
      delete storage[key];
    },
    get length() {
      return Object.keys(storage).length;
    },
    key: function (i) {
      const keys = Object.keys(storage);
      return keys[i] || null;
    },
  };
}
