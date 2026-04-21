import test from "node:test";
import assert from "node:assert/strict";

import {
  OCRError,
  OCR_ERROR_CODES,
  parseBankCard,
  parseDriverLicenseAuto,
  parseGeneral,
  parseIdCard,
  validateBankCard,
} from "../src/index.js";

test("parseGeneral returns a stable general result shape", () => {
  const result = parseGeneral(
    "联系电话 13800138000\n邮箱 test@example.com\n日期 2026-04-21"
  );

  assert.equal(result.valid, true);
  assert.equal(result.lines.length, 3);
  assert.equal(result.extracted.emails[0], "test@example.com");
  assert.equal(result.extracted.phones[0].number, "13800138000");
  assert.equal(result.extracted.dates[0].formatted, "2026-04-21");
});

test("parseIdCard handles front and back side payloads", () => {
  const front = parseIdCard(
    "姓名 张三 性别 男 民族 汉 出生 1949年12月31日 住址 北京市朝阳区建国路88号 公民身份号码 11010519491231002X",
    [
      "姓名 张三",
      "性别 男",
      "民族 汉",
      "出生 1949年12月31日",
      "住址 北京市朝阳区建国路88号",
      "公民身份号码 11010519491231002X",
    ]
  );
  const back = parseIdCard(
    "中华人民共和国居民身份证 签发机关 北京市公安局朝阳分局 有效期限 2020.01.01-2040.01.01",
    [
      "中华人民共和国居民身份证",
      "签发机关 北京市公安局朝阳分局",
      "有效期限 2020.01.01-2040.01.01",
    ]
  );

  assert.equal(front.side, "front");
  assert.equal(front.name, "张三");
  assert.equal(front.idNumber, "11010519491231002X");
  assert.equal(front.valid, true);

  assert.equal(back.side, "back");
  assert.equal(back.authority, "北京市公安局朝阳分局");
  assert.deepEqual(back.validPeriod, {
    start: "2020.01.01",
    end: "2040.01.01",
  });
  assert.equal(back.valid, true);
});

test("parseBankCard extracts number, bank metadata, and validation", () => {
  const result = parseBankCard(
    "中国农业银行 卡号 6228 4804 0256 4890 018 有效期 12/99 持卡人 张三"
  );

  assert.equal(result.cardNumber, "6228480402564890018");
  assert.equal(result.bankName, "中国农业银行");
  assert.equal(result.cardType, "借记卡");
  assert.equal(result.expiryDate, "12/99");
  assert.equal(result.valid, true);
  assert.equal(validateBankCard(result.cardNumber).valid, true);
});

test("parseDriverLicenseAuto preserves key structured fields", () => {
  const text =
    "中华人民共和国机动车驾驶证 姓名 张三 性别 男 国籍 中国 住址 北京市朝阳区建国路88号 出生日期 1990-01-01 初次领证日期 2012-05-06 准驾车型 C1 有效期限 2020-05-06至2030-05-06 证号 110101199001011234";
  const result = parseDriverLicenseAuto(text, text.split(" "));

  assert.equal(result.page, "main");
  assert.equal(result.name, "张三");
  assert.equal(result.licenseClass, "C1");
  assert.equal(result.licenseClassDesc, "小型汽车");
  assert.deepEqual(result.validPeriod, {
    start: "2020.05.06",
    end: "2030.05.06",
  });
  assert.equal(result.valid, true);
});

test("error codes stay frozen and OCRError preserves code", () => {
  assert.deepEqual(OCR_ERROR_CODES, [
    "ASSET_LOAD_FAILED",
    "ENGINE_INIT_FAILED",
    "UNSUPPORTED_IMAGE_SOURCE",
    "RECOGNIZE_TIMEOUT",
    "BRIDGE_ERROR",
    "PARSE_ERROR",
  ]);

  const error = new OCRError("PARSE_ERROR", "broken payload");
  assert.equal(error.code, "PARSE_ERROR");
  assert.equal(error.message, "broken payload");
});
