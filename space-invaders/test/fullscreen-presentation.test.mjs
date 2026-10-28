import test from "node:test";
import assert from "node:assert/strict";
import { fitPresentationFrame } from "../src/ui/presentation.js";

test("fullscreen presentation fills 16:9 and 16:10 monitors", () => {
  for (const aspect of [16 / 9, 16 / 10]) {
    const frame = fitPresentationFrame(aspect * 900, 900);
    assert.equal(frame.width, aspect * 900);
    assert.equal(frame.height, 900);
    assert.equal(frame.aspect, aspect);
  }
});

test("fullscreen presentation clamps outside monitor ratios to 16:9–16:10", () => {
  const ultraWide = fitPresentationFrame(2400, 900);
  assert.equal(ultraWide.aspect, 16 / 9);
  assert.equal(ultraWide.width, 1600);
  assert.equal(ultraWide.height, 900);

  const narrow = fitPresentationFrame(1200, 1200);
  assert.equal(narrow.aspect, 16 / 10);
  assert.equal(narrow.width, 1200);
  assert.equal(narrow.height, 750);
});
