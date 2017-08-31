/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const {
  createNode,
  getChildren,
  makeNodesForEntries,
  shouldLoadItemEntries,
} = require("../../utils/node");

const gripMapStubs = require("../../../reps/stubs/grip-map");
const gripArrayStubs = require("../../../reps/stubs/grip-array");
const gripStubs = require("../../../reps/stubs/grip");

describe("shouldLoadItemEntries", () => {
  it("returns true for an entries node", () => {
    const mapStubNode = createNode(null, "map", "/", {
      value: gripMapStubs.get("20-entries Map")
    });
    const entriesNode = makeNodesForEntries(mapStubNode);
    expect(shouldLoadItemEntries(entriesNode)).toBeTruthy();
  });

  it("returns false for an already loaded entries node", () => {
    const mapStubNode = createNode(null, "map", "/", {
      value: gripMapStubs.get("20-entries Map")
    });
    const entriesNode = makeNodesForEntries(mapStubNode);
    const loadedProperties = new Map([[entriesNode.path, true]]);
    expect(shouldLoadItemEntries(entriesNode, loadedProperties)).toBeFalsy();
  });

  it("returns false for an entries node on a map which has everything in preview", () => {
    const mapStubNode = createNode(null, "map", "/", {
      value: gripMapStubs.get("testSymbolKeyedMap")
    });
    const entriesNode = makeNodesForEntries(mapStubNode);
    expect(shouldLoadItemEntries(entriesNode)).toBeFalsy();
  });

  it("returns false for an entries node on a set which has everything in preview", () => {
    const setStubNode = createNode(null, "set", "/", {
      value: gripArrayStubs.get("new Set([1,2,3,4])")
    });
    const entriesNode = makeNodesForEntries(setStubNode);
    expect(shouldLoadItemEntries(entriesNode)).toBeFalsy();
  });

  it("returns false for a Set node", () => {
    const setStubNode = createNode(null, "set", "/", {
      value: gripArrayStubs.get("new Set([1,2,3,4])")
    });
    expect(shouldLoadItemEntries(setStubNode)).toBeFalsy();
  });

  it("returns false for a Map node", () => {
    const mapStubNode = createNode(null, "map", "/", {
      value: gripMapStubs.get("20-entries Map")
    });
    expect(shouldLoadItemEntries(mapStubNode)).toBeFalsy();
  });

  it("returns false for an array", () => {
    const node = createNode(null, "array", "/", {
      value: gripMapStubs.get("testMaxProps")
    });
    expect(shouldLoadItemEntries(node)).toBeFalsy();
  });

  it("returns false for an object", () => {
    const node = createNode(null, "array", "/", {
      value: gripStubs.get("testMaxProps")
    });
    expect(shouldLoadItemEntries(node)).toBeFalsy();
  });

  it("returns false for an entries node with buckets", () => {
    const mapStubNode = createNode(null, "map", "/", {
      value: gripMapStubs.get("234-entries Map")
    });
    const entriesNode = makeNodesForEntries(mapStubNode);
    expect(shouldLoadItemEntries(entriesNode)).toBeFalsy();
  });

  it("returns true for an entries bucket node", () => {
    const mapStubNode = createNode(null, "map", "/", {
      value: gripMapStubs.get("234-entries Map")
    });
    const entriesNode = makeNodesForEntries(mapStubNode);
    const bucketNodes = getChildren({item: entriesNode});

    // Make sure we do have a bucket.
    expect(bucketNodes[0].name).toBe("[0…99]");
    expect(shouldLoadItemEntries(bucketNodes[0])).toBeTruthy();
  });

  it("returns false for an entries bucket node with sub-buckets", () => {
    const mapStubNode = createNode(null, "map", "/", {
      value: gripMapStubs.get("23456-entries Map")
    });
    const entriesNode = makeNodesForEntries(mapStubNode);
    const bucketNodes = getChildren({item: entriesNode});

    // Make sure we do have a bucket.
    expect(bucketNodes[0].name).toBe("[0…999]");
    expect(shouldLoadItemEntries(bucketNodes[0])).toBeFalsy();
  });

  it("returns true for an entries sub-bucket node", () => {
    const mapStubNode = createNode(null, "map", "/", {
      value: gripMapStubs.get("23456-entries Map")
    });
    const entriesNode = makeNodesForEntries(mapStubNode);
    const bucketNodes = getChildren({item: entriesNode});
    // Make sure we do have a bucket.
    expect(bucketNodes[0].name).toBe("[0…999]");

    // Get the sub-buckets
    const subBucketNodes = getChildren({item: bucketNodes[0]});
    // Make sure we do have a bucket.
    expect(subBucketNodes[0].name).toBe("[0…99]");
    expect(shouldLoadItemEntries(subBucketNodes[0])).toBeTruthy();
  });
});