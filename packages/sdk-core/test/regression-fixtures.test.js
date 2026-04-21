import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  parseBankCard,
  parseDriverLicenseAuto,
  parseGeneral,
  parseIdCard,
} from "../src/index.js";

function readFixture(...segments) {
  return readFileSync(resolve(import.meta.dirname, "fixtures", ...segments), "utf8");
}

test("general regression fixtures stay parseable across sample variants", () => {
  const normal = parseGeneral(readFixture("general", "normal.txt"));
  const blurry = parseGeneral(readFixture("general", "blurry.txt"));
  const wrongType = parseGeneral(readFixture("general", "wrong-type.txt"));

  assert.equal(normal.valid, true);
  assert.equal(normal.extracted.emails[0], "test@example.com");
  assert.equal(normal.extracted.phones[0].number, "13800138000");

  assert.equal(blurry.valid, true);
  assert.equal(blurry.extracted.emails[0], "test@example.com");
  assert.equal(blurry.extracted.phones[0].number, "13800138000");

  assert.equal(wrongType.valid, true);
  assert.match(wrongType.rawText, /公民身份号码/);
});

test("idCard regression fixtures cover normal blurry and wrong-type cases", () => {
  const normalText = readFixture("idCard", "normal.txt");
  const blurryText = readFixture("idCard", "blurry.txt");
  const wrongTypeText = readFixture("idCard", "wrong-type.txt");

  const normal = parseIdCard(normalText, normalText.split(" "));
  const blurry = parseIdCard(blurryText, blurryText.split(" "));
  const wrongType = parseIdCard(wrongTypeText, wrongTypeText.split(" "));

  assert.equal(normal.side, "front");
  assert.equal(normal.valid, true);
  assert.equal(normal.idNumber, "11010519491231002X");

  assert.equal(blurry.side, "front");
  assert.equal(blurry.valid, true);
  assert.equal(blurry.name, "张三");

  assert.equal(wrongType.valid, false);
  assert.equal(wrongType.isIdCard, false);
});

test("bankCard regression fixtures cover normal blurry and wrong-type cases", () => {
  const normal = parseBankCard(readFixture("bankCard", "normal.txt"));
  const blurry = parseBankCard(readFixture("bankCard", "blurry.txt"));
  const wrongType = parseBankCard(readFixture("bankCard", "wrong-type.txt"));

  assert.equal(normal.valid, true);
  assert.equal(normal.bankName, "中国农业银行");
  assert.equal(normal.cardNumber, "6228480402564890018");

  assert.equal(blurry.valid, true);
  assert.equal(blurry.bankName, "中国农业银行");

  assert.equal(Boolean(wrongType.valid), false);
  assert.equal(Boolean(wrongType.isBankCard), false);
});

test("driverLicense regression fixtures cover normal blurry and wrong-type cases", () => {
  const normalText = readFixture("driverLicense", "normal.txt");
  const blurryText = readFixture("driverLicense", "blurry.txt");
  const wrongTypeText = readFixture("driverLicense", "wrong-type.txt");

  const normal = parseDriverLicenseAuto(normalText, normalText.split(" "));
  const blurry = parseDriverLicenseAuto(blurryText, blurryText.split(" "));
  const wrongType = parseDriverLicenseAuto(wrongTypeText, wrongTypeText.split(" "));

  assert.equal(normal.valid, true);
  assert.equal(normal.page, "main");
  assert.equal(normal.licenseClass, "C1");

  assert.equal(blurry.valid, true);
  assert.equal(blurry.page, "main");
  assert.equal(blurry.name, "张三");

  assert.equal(wrongType.valid, false);
  assert.equal(wrongType.isDriverLicense, false);
});
