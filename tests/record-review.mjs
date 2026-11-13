import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const baseline = process.argv.includes("--baseline");
const live = process.argv.includes("--live");
const uiOnly = process.argv.includes("--ui-only");
const checkRubric = !baseline && !uiOnly;
const bundledPlaywright = join(homedir(), ".cache", "codex-runtimes", "codex-primary-runtime", "dependencies", "node", "node_modules", "playwright", "index.mjs");
const playwrightPath = process.env.RYAN_PLAYWRIGHT_PATH || (existsSync(bundledPlaywright) ? bundledPlaywright : "");
const { chromium, webkit, devices } = playwrightPath
  ? await import(pathToFileURL(resolve(playwrightPath)))
  : await import("playwright");
const browserPath = process.env.RYAN_BROWSER_PATH || (process.platform === "win32"
  ? join(process.env["ProgramFiles(x86)"] || "C:/Program Files (x86)", "Microsoft", "Edge", "Application", "msedge.exe")
  : "");

const pages = new Map([
  ["/", await readFile(join(root, "index.html"))],
  ["/mobile/", await readFile(join(root, "mobile", "index.html"))],
]);
const staticFiles = new Map([...pages].map(([route, bytes]) => [route, { bytes, contentType: "text/html; charset=utf-8" }]));
for (const [file, contentType] of [
  ["record-review.css", "text/css; charset=utf-8"],
  ["record-review.js", "text/javascript; charset=utf-8"],
  ["record-review-model.js", "text/javascript; charset=utf-8"],
]) {
  const path = join(root, file);
  if (existsSync(path)) staticFiles.set("/" + file, { bytes: await readFile(path), contentType });
}
const server = live ? null : createServer((request, response) => {
  const source = request.method === "GET" && staticFiles.get(request.url);
  if (!source) {
    response.writeHead(request.url === "/favicon.ico" ? 204 : 404).end();
    return;
  }
  response.writeHead(200, { "content-type": source.contentType }).end(source.bytes);
});
if (server) await new Promise((resolveListen, rejectListen) => {
  server.once("error", rejectListen);
  server.listen(0, "127.0.0.1", resolveListen);
});
const baseUrl = new URL(live ? "https://seiryu1318.github.io/Ryan_record/" : "http://127.0.0.1:" + server.address().port + "/");
const siteUrl = route => new URL(route.replace(/^\//, ""), baseUrl);
const allowedRequests = new Set([...staticFiles.keys(), "/favicon.ico"].map(route => siteUrl(route).href));

const inquiry = "수온에 따라 효모 발효 속도가 달라지는 이유를 질문함. 교과서의 효소 단원을 참고해 온도만 다르게 설정하고 같은 양의 효모에서 발생한 기체 부피를 세 차례 측정함. 측정값을 표로 비교하여 수온이 높은 조건에서 기체 부피가 더 큰 이유를 효소 활성과 연결해 해석함. 첫 측정에서 온도계 위치가 달라 오차가 생긴 한계를 확인하고 센서 위치를 통일해 재측정하여 편차가 줄어든 결과를 표에 표시함.";
const action = "교내 기후 활동에서 자료 정리 역할을 맡아 기상 관측 자료 두 종류를 날짜별로 정리하고 표로 작성함. 완성한 표를 모둠 발표 자료로 제출함.";
const praise = "평소 학습에 관심이 많고 모든 활동에 성실하게 참여하며 탐구 역량이 뛰어나 여러 친구에게 모범적임.";
const planned = "대기오염 농도의 변화를 확인하기 위해 공개 자료를 비교할 계획이며 측정 결과를 표로 정리할 예정임.";
const borrowed = "교사가 대기오염 농도를 비교하고 감소 원인을 분석함. 학생은 교사의 결과를 듣고 관심을 보임.";
const verifiedNull = "두 집단의 평균 차이가 있는지 질문함. 동일한 조건에서 각 집단을 3회 측정했으나 두 집단 차이가 나타나지 않아 가설이 지지되지 않았음을 확인함.";
const notPerformed = "두 집단의 빛과 물을 같게 두고 성장 길이를 측정하려고 했으나 실제로 측정하지 못함. 두 집단의 결과를 비교할 수 없었음을 기록함.";
const behaviorOutcome = "교내 모둠 활동에서 말하지 못하는 친구의 의견을 묻고 역할을 나눔. 이후 친구가 발표에 참여함.";
const behaviorFollowUp = behaviorOutcome + " 다음 모둠 회의에서도 의견을 먼저 묻고 역할을 조정함. 이후 그 친구가 맡은 자료를 직접 설명하고 모둠원 전원이 발표에 참여함.";
const inquiryAndFuture = "교실 환기에 따라 미세먼지 값이 달라지는 이유를 질문함. 창문을 열기 전과 후의 먼지 농도를 3회 측정해 표로 정리함. 환기 후 농도가 낮아진 결과를 근거로 교실의 공기 흐름이 달라졌다고 해석함. 다음에는 측정 기간을 늘릴 계획임.";
const disjoint = "급식 잔반의 양을 3일간 측정하고 측정값을 표로 정리함. 별개의 활동으로 소설 주인공의 판단을 시대적 배경과 연결해 해석함.";
const rewriteInput = "2025년 6월 14일, 생명과학 활동에서 pH 7.4 조건의 E. coli 배양 결과를 조사함. 배양 과정의 원인 조사를 진행함. 메모 제목 ‘조사를 진행함’을 인용해 집락 지름 24mm를 표로 작성함.";
const rewriteExpected = rewriteInput.replace("조사를 진행함", "조사함");
const scannerFixtures = {
  quoted: "수업 자료에 실린 ‘하천의 오염 수치를 3회 측정해 감소 원인을 분석하고 보고서를 완성함.’이라는 문장을 읽고 소감을 적음.",
  title: "활동 안내문에서 『미세먼지 농도를 3회 측정하여 그래프로 작성함』이라는 보고서 제목을 보고 관심을 보임.",
  switchWeak: "교사가 실내 조도 수치를 3회 측정하여 표를 완성함; 학생은 교사의 설명을 듣고 흥미를 보임.",
  ownWorkAfterQuote: "자료 제목 『기후 변화와 대응』을 읽고 지역별 관측 수치를 3회 비교하여 변화 폭을 표로 작성함.",
  switchGood: "교사가 실내 조도 수치를 3회 측정하여 표를 완성함; 학생은 표의 수치를 이용해 창가와 복도 쪽의 평균 조도를 직접 계산하고 차이를 비교표로 정리함.",
  leadingTeacher: "학생은 교사가 조도를 3회 측정해 표를 완성한 장면을 보고 관심을 보임.",
  leadingStudent: "학생은 교사가 측정한 조도 수치를 이용해 창가와 복도 쪽의 평균 조도를 직접 계산하고 차이를 비교표로 정리함.",
  headings: "[측정 활동]\n급식 잔반의 양을 3일간 측정하여 측정값을 표로 정리함.\n[독서 활동]\n소설 주인공의 판단을 시대적 배경과 연결해 해석함.",
  bullets: "  - 용액 pH 7.4 조건을 설정함\r\n  - E. coli 집락을 3회 관찰함\r\n  - 집락 지름 24mm를 표로 정리함.",
};
const sentinel = "qa-private-record-77453@example.invalid";
const embeddedLogoHash = "22576888ac832c05976e90a75f49baef8ecd85fa5c9493880f4ccc961a6736f2";

function isLogo(data) {
  return createHash("sha256").update(Buffer.from(data, "base64")).digest("hex") === embeddedLogoHash;
}

async function assertMotionPolicy(page, label, expectedScope = null) {
  const activity = await page.evaluate(({ expectedScope, maxDuration }) => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const activeScope = reduced ? null : expectedScope;
    const scopeOf = element => window.__recordReviewMotionScope(element);
    const timed = (duration, delay, iterations) => duration * iterations + Math.max(0, delay);
    const report = [];
    const styles = [document.documentElement, ...document.querySelectorAll("body, body *")];
    const milliseconds = value => parseFloat(value) * (value.trim().endsWith("ms") ? 1 : 1000);
    for (const element of styles) {
      if (!element.getClientRects().length) continue;
      for (const pseudo of [null, "::before", "::after"]) {
        const style = getComputedStyle(element, pseudo);
        if (pseudo && ["none", "normal"].includes(style.content)) continue;
        const name = (element.id || element.classList[0] || element.tagName) + (pseudo || "");
        if (style.scrollBehavior === "smooth") report.push(name + " smooth scroll");
        for (const kind of ["animation", "transition"]) {
          const properties = (kind === "animation" ? style.animationName : style.transitionProperty).split(/,\s*/);
          const durations = style[kind + "Duration"].split(",").map(milliseconds);
          const delays = style[kind + "Delay"].split(",").map(milliseconds);
          const counts = kind === "animation" ? style.animationIterationCount.split(",") : ["1"];
          properties.forEach((property, i) => {
            const duration = durations[i % durations.length];
            if (property === "none" || duration === 0) return;
            const iterations = counts[i % counts.length].trim() === "infinite" ? Infinity : Number(counts[i % counts.length]);
            const total = timed(duration, delays[i % delays.length], iterations);
            if (!activeScope || scopeOf(element) !== activeScope || total > maxDuration || iterations !== 1) {
              report.push(name + " " + kind + " " + property + " " + total + "ms");
            }
          });
        }
      }
    }
    const events = window.__recordReviewMotionCalls;
    const badCalls = events.filter(event => event.scope === null || event.reduced
      || (event.duration != null && (event.duration > maxDuration || event.iterations !== 1)));
    return { report: [...new Set(report)].slice(0, 12), badCalls };
  }, { expectedScope, maxDuration: 800 });
  assert.deepEqual(activity, { report: [], badCalls: [] }, label + " contains out-of-scope, looping, or excessive motion");
}

async function assertMotionTriggered(page, scope, target) {
  if (await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)) return;
  await page.waitForFunction(({ scope, target }) =>
    window.__recordReviewMotionCalls.some(event => event.scope === scope && (!target || event.target === target)),
  { scope, target }, { timeout: 3000 });
}

async function assertReadableContrast(page, selectors, label) {
  await page.waitForFunction(() => document.getAnimations().every(animation => animation.playState !== "running"));
  const failures = await page.evaluate(items => {
    const parse = value => (value.match(/[\d.]+/g) || []).map(Number);
    const blend = (front, back) => {
      const alpha = front[3] ?? 1;
      return [0, 1, 2].map(i => front[i] * alpha + back[i] * (1 - alpha));
    };
    const lightness = rgb => rgb.reduce((sum, value, i) => {
      const srgb = value / 255;
      return sum + [0.2126, 0.7152, 0.0722][i] * (srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4);
    }, 0);
    const failures = [];
    for (const selector of items) {
      const node = document.querySelector(selector);
      if (!node?.getClientRects().length) {
        failures.push({ selector, error: "missing or hidden" });
        continue;
      }
      const style = getComputedStyle(node);
      const backgrounds = [];
      for (let element = node; element; element = element.parentElement) {
        const color = parse(getComputedStyle(element).backgroundColor);
        backgrounds.unshift(color);
        if ((color[3] ?? 1) === 1) break;
      }
      const background = backgrounds.reduce((back, color) => blend(color, back), [255, 255, 255]);
      const foreground = blend(parse(style.color), background);
      const values = [lightness(foreground), lightness(background)];
      const contrast = (Math.max(...values) + 0.05) / (Math.min(...values) + 0.05);
      const size = parseFloat(style.fontSize);
      const minimum = size >= 24 || size >= 18.67 && Number(style.fontWeight) >= 700 ? 3 : 4.5;
      if (contrast < minimum) failures.push({ selector, contrast: Number(contrast.toFixed(2)), minimum });
    }
    return failures;
  }, selectors);
  assert.deepEqual(failures, [], label + " text contrast");
}
async function assertFitsViewport(page, label) {
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, label + " must fit its viewport");
}

async function analyze(page, text, { enter = false, duel = false } = {}) {
  const expectCanonical = checkRubric && !duel;
  await page.locator("#recordText").fill(text);
  const button = page.locator("#analyzeButton");
  assert.equal(await button.isEnabled(), true, "analyze should be enabled after completing inputs");
  if (enter) await page.locator("#recordText").press("Enter");
  else await button.click({ force: baseline });
  await page.locator("#results").waitFor({ state: "visible" });
  await page.waitForFunction(() => document.getElementById("analyzeButton").getAttribute("aria-busy") !== "true");
  if (expectCanonical) await page.waitForFunction(() => document.getElementById("results").dataset.canonicalGrade);
  const result = await page.evaluate(() => ({
    grade: document.getElementById("precisionGrade").textContent.trim(),
    internal: document.getElementById("results").dataset.canonicalGrade || null,
    score: Number(document.getElementById("results").dataset.canonicalScore),
    rationale: document.getElementById("precisionRationale").textContent.trim(),
    evidence: document.getElementById("precisionEvidence").textContent.trim(),
    suggestions: [...document.querySelectorAll("#precisionSuggestions li")].map(item => item.textContent.trim()),
    revision: document.querySelector("#retakeExampleText .review-rewrite-text")?.textContent.trim() || "",
    guidance: [...document.querySelectorAll("#retakePlacementGuide li")].map(item => item.textContent.trim()),
  }));
  if (expectCanonical) assert.match(result.internal, /^[ABC]$/);
  if (expectCanonical) assert.ok(Number.isFinite(result.score) && result.score >= 0 && result.score <= 100);
  if (expectCanonical) assert.ok(result.rationale.length >= 15 && result.suggestions.some(item => item.length >= 12), "missing substantive rationale/suggestions: " + JSON.stringify({grade:result.grade,rationale:result.rationale,suggestions:result.suggestions}));
  for (const match of result.evidence.matchAll(/“([^”]+)”/g)) {
    assert.ok(text.includes(match[1]), "quoted result evidence must occur in the input");
  }
  return result;
}

async function openPage(browser, { route, mobile, device, label, reducedMotion = "no-preference" }) {
  const context = await browser.newContext({
    ...(device || (mobile ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }
      : { viewport: { width: 1366, height: 900 } })),
    reducedMotion,
    serviceWorkers: "block",
  });
  await context.addInitScript(() => {
    const motionCalls = [];
    window.__recordReviewMotionCalls = motionCalls;
    window.__recordReviewCopiedText = "";
    Object.defineProperty(navigator, "clipboard", { value: {
      writeText: async value => { window.__recordReviewCopiedText = String(value); },
    } });
    const scopeOf = element => {
      if (!(element instanceof Element)) return null;
      if (document.getElementById("guideTab")?.getAttribute("aria-selected") === "true"
          && element.closest("#guideTab, #guidePanel")) return "guide";
      if (document.body?.dataset.evaluationMode === "duel" && element.closest("#duelButton, #duelPanel")) return "duel";
      return null;
    };
    window.__recordReviewMotionScope = scopeOf;
    const record = (kind, target, duration, iterations = 1) => motionCalls.push({
      kind, scope: scopeOf(target), target: target?.id || target?.classList[0] || null, duration, iterations,
      reduced: matchMedia("(prefers-reduced-motion: reduce)").matches,
    });
    for (const event of ["animationstart", "transitionrun"]) {
      document.addEventListener(event, change => record(event, change.target, null), true);
    }
    for (const [target, name] of [[Element.prototype, "scrollIntoView"], [Element.prototype, "scrollTo"], [window, "scrollTo"]]) {
      const original = target[name];
      if (typeof original !== "function") continue;
      target[name] = function (...args) {
        if (args[0]?.behavior === "smooth") record(name, null, null);
        return original.apply(this, args);
      };
    }
    const animate = Element.prototype.animate;
    if (typeof animate === "function") {
      Element.prototype.animate = function (...args) {
        const animation = animate.apply(this, args);
        const timing = animation.effect.getComputedTiming();
        if (timing.endTime > 0) record("animate", this, timing.endTime, timing.iterations);
        return animation;
      };
    }
  });
  const attempts = [];
  const errors = [];
  await context.route("**/*", requestRoute => {
    const request = requestRoute.request();
    const url = new URL(request.url());
    if (request.method() === "GET" && allowedRequests.has(url.href)) {
      return requestRoute.continue();
    }
    attempts.push({ origin: url.origin, method: request.method(), type: request.resourceType() });
    return requestRoute.abort();
  });
  if (typeof context.routeWebSocket === "function") {
    await context.routeWebSocket("**/*", socket => {
      attempts.push({ type: "websocket" });
      socket.close();
    });
  }
  const page = await context.newPage();
  page.setDefaultTimeout(12000);
  page.on("pageerror", error => errors.push(error.message));
  if (typeof context.routeWebSocket !== "function") page.on("websocket", () => attempts.push({ type: "websocket" }));
  page.on("console", message => {
    if (message.type() === "error" && !message.text().includes("Failed to load resource")) errors.push(message.text());
  });
  await page.goto(siteUrl(route).href, { waitUntil: "load" });
  await page.waitForFunction(() => Boolean(document.getElementById("recordText")));
  await assertFitsViewport(page, label + " initial screen");
  if (!baseline) {
    if (live) assert.match(await page.title(), mobile ? /ver\.23$/ : /ver\.30$/);
    assert.equal(await page.locator("img.logo, img[alt='라이언 캐릭터'], [src*='고옴']").count(), 0, "removed image must be absent");
    await assertMotionPolicy(page, label + " initial screen");
  }
  return { context, page, attempts, errors };
}

async function assertScannerBoundaries(page) {
  const results = await page.evaluate(fixtures => Object.fromEntries(Object.entries(fixtures).map(([key,text]) => {
    const result = window.RyanRecordReview.assess({ text, area: "overall", mode: "strict" });
    return [key, { grade: result.strictGrade, flags: result.flags, revision: result.revision.plain, evidence: result.evidence }];
  })), scannerFixtures);
  for (const key of ["quoted", "title", "switchWeak", "leadingTeacher"]) {
    assert.equal(results[key].grade, "C", key + " must not earn credit for quoted or third-party activity");
    assert.equal(results[key].flags.completedEpisode, false, key + " has no completed student evidence");
  }
  for (const key of ["switchGood", "leadingStudent"]) {
    assert.match(results[key].grade, /^[AB]$/, key + " credits the student's own calculation");
    assert.ok(results[key].evidence.some(item => /직접 계산|비교표/.test(item.span)), key + " must quote the student's independent analysis");
  }
  assert.match(results.ownWorkAfterQuote.grade, /^[AB]$/, "a quoted title does not erase independently completed work");
  assert.ok(results.ownWorkAfterQuote.evidence.some(item => item.span.includes("변화 폭을 표로 작성함")));
  assert.equal(results.headings.grade, "B", "heading boundaries keep separate interpretation from elevating a measurement");
  assert.ok(results.headings.flags.sceneCount >= 2, "two headings must separate activities");
  assert.ok(!results.headings.evidence.some(item => /^\[.*\]$/.test(item.span) || item.span.includes("소설 주인공")),
    "headings and unrelated activities are not evidence for the measured outcome");
  assert.match(results.bullets.grade, /^[AB]$/, "short related bullets can form one episode");
  assert.equal(results.bullets.revision, scannerFixtures.bullets, "the revision preserves bullets, decimal, abbreviation and unit");
  assert.ok(results.bullets.evidence.some(item => item.span.includes("24mm")), "short measured outcome is retained");
  for (const [key, result] of Object.entries(results)) {
    for (const { span, start, end } of result.evidence) {
      assert.equal(scannerFixtures[key].slice(start, end), span, key + " evidence offsets must identify exact raw input");
    }
  }
}

async function runModeFlow(browser, options) {
  const { page, context, attempts, errors } = await openPage(browser, options);
  const { label, mobile } = options;
  try {
    if (checkRubric) await assertScannerBoundaries(page);
    const viewSwitch = await page.locator(".version-switch-button").getAttribute("href");
    assert.match(viewSwitch, mobile ? /(?:\/Ryan_record\/|\.\.\/)$/ : /(?:\/Ryan_record\/)?mobile\/$/);
    const mainTab = page.locator("#analysisTab");
    const guideTab = page.locator("#guideTab");
    await guideTab.click();
    assert.equal(await guideTab.getAttribute("aria-selected"), "true");
    const guide = page.locator("#guidePanel");
    assert.equal(await guide.isVisible(), true);
    if (!baseline) {
      const guideText = await guide.innerText();
      assert.ok(guideText.replace(/\s/g, "").length <= 1100, "the guide fits a short reading flow");
      assert.doesNotMatch(guideText, /·|[56]\s*(?:가지|단계|항목|카드)/);
      assert.equal(await guide.locator(".v25-guide-steps > li").count(), 3);
      assert.equal(await guide.locator("tbody tr").count(), 6);
      for (const section of ["엄격과 평범의 차이", "라이언과의 대결", "영역별로 확인할 근거", "수정안 적용하기"]) {
        assert.ok(guideText.includes(section), "missing guide section: " + section);
      }
      assert.match(guideText, /평가 영역을 고르지 않고.*100점/s);
      assert.match(guideText, /대괄호.*확인한 내용/s);
      await assertMotionTriggered(page, "guide", "guidePanel");
      await assertMotionPolicy(page, label + " guide", "guide");
      await assertReadableContrast(page, ["#guideTab", "#guidePanel h2"], label + " guide");
    }
    await mainTab.click();
    assert.equal(await mainTab.getAttribute("aria-selected"), "true");
    if (!baseline) await assertMotionPolicy(page, label + " return to analysis");

    const analyzeButton = page.locator("#analyzeButton");
    const textarea = page.locator("#recordText");
    assert.equal(await analyzeButton.isDisabled(), true);
    await textarea.fill("짧은 문구");
    assert.equal(await analyzeButton.isDisabled(), true);
    await page.locator("[data-area='overall']").click();
    await page.locator("#sampleButton").click();
    assert.ok((await textarea.inputValue()).length > 30, "sample fills the selected area");
    await page.locator("#clearButton").click();
    assert.equal(await textarea.inputValue(), "");
    assert.equal(await analyzeButton.isDisabled(), true);

    await page.locator("[data-target='science']").click();
    await page.locator("[data-level='strict']").click();
    assert.equal(await page.locator("[data-level='strict']").getAttribute("aria-pressed"), "true");
    if (!baseline) await assertReadableContrast(page, ["#analysisTab", "[data-level='strict']", "[data-area='overall']", "#recordText"], label + " analysis");
    const strong = await analyze(page, inquiry, { enter: !mobile });
    if (!baseline) {
      await assertMotionPolicy(page, label + " ordinary result");
      await assertReadableContrast(page, ["#precisionGrade", "#precisionRationale"], label + " ordinary result");
    }
    const middle = await analyze(page, action);
    const weak = await analyze(page, praise);
    if (checkRubric) assert.equal(strong.grade, strong.internal);
    if (checkRubric) assert.equal(middle.grade, middle.internal);
    if (checkRubric) assert.equal(weak.grade, "C");
    if (checkRubric) assert.ok(strong.score > weak.score, "linked evidence should outrank generic praise");
    if (checkRubric) {
      assert.equal(strong.grade, "A");
      assert.equal(middle.grade, "B");
    }
    if (checkRubric) {
      assert.notDeepEqual(strong.suggestions, weak.suggestions, "feedback must change when evidence changes");
      assert.ok(strong.revision && weak.revision, "the results must show a rewrite or a specific evidence prompt");
      assert.notEqual(strong.revision, weak.revision, "the rewrite must respond to the input evidence");
      assert.equal((await analyze(page, inquiryAndFuture)).grade, "A", "an unrelated future idea cannot nullify the completed inquiry");
      const separate = await analyze(page, disjoint);
      assert.equal(separate.grade, "B", "an unrelated interpretation cannot elevate the first activity");
      assert.ok(!separate.evidence.includes("소설 주인공"), "unrelated literature evidence must not be applied to the measurement");
      await page.locator("[data-area='behavior']").click();
      const behavior = await analyze(page, behaviorOutcome);
      assert.match(behavior.grade, /^[AB]$/, "a brief observable community outcome establishes positive evidence");
      assert.ok(behavior.evidence.includes("친구가 발표에 참여함"), "evaluation must cite the peer's observed response");
      assert.equal((await analyze(page, behaviorFollowUp)).grade, "A", "observed participation across meetings can establish strong evidence");
      const behaviorGaps = await analyze(page, action);
      assert.ok(behaviorGaps.guidance.some(item => /상대|공동체|학급|반응/.test(item)),
        "behavior feedback should ask for directly observed effects on others");
      await page.locator("[data-area='career']").click();
      const careerGaps = await analyze(page, action);
      assert.ok(careerGaps.guidance.some(item => /진로|관심 분야|판단 기준/.test(item)),
        "career feedback should connect the evidence to an exploration question or decision");
      await page.locator("[data-area='overall']").click();
    }

    await page.locator("[data-level='normal']").click();
    const normalWeak = await analyze(page, praise);
    if (checkRubric) assert.equal(normalWeak.grade, "미흡");
    const normalStrong = await analyze(page, inquiry);
    const normalMiddle = await analyze(page, action);
    if (checkRubric) {
      assert.equal(normalStrong.grade, "우수");
      assert.equal(normalMiddle.grade, "우수");
      assert.equal(normalMiddle.internal, "B");
    }
    if (checkRubric) assert.equal(normalStrong.internal, strong.internal);
    if (checkRubric) assert.equal(normalStrong.score, strong.score);
    const normalPlanned = await analyze(page, planned);
    if (checkRubric) assert.equal(normalPlanned.grade, "미흡", "future plans do not establish completed work");
    const normalBorrowed = await analyze(page, borrowed);
    if (checkRubric) assert.equal(normalBorrowed.grade, "미흡", "the teacher's work cannot be credited to the student");

    if (checkRubric) {
      const revised = await analyze(page, rewriteInput);
      assert.equal(revised.revision, rewriteExpected, "a safe wording edit must preserve dates, decimals, numeric units, abbreviations, and quotes");
      assert.ok(!revised.revision.includes("["), "unconfirmed details must not be inserted into the polished record");
      assert.ok(revised.guidance.some(item => /위치.*확인할 사실.*\[/.test(item)), "new details are requested as fill-in guidance");
      const renderedAnchors = await page.locator("#retakePlacementGuide mark").allTextContents();
      assert.ok(renderedAnchors.length, "at least one specific source sentence anchors the advice");
      for (const anchor of renderedAnchors) {
        const quote = anchor.match(/“([\s\S]+)”/);
        assert.ok(quote && rewriteInput.includes(quote[1]), "a guidance anchor must quote original wording exactly");
      }
      const example = page.locator("#retakeExamplePanel");
      if (await example.getAttribute("open") === null) await example.locator("summary").click();
      assert.equal(await page.locator(".review-rewrite-text").isVisible(), true);
      assert.match(await page.locator("#retakeWarningText").textContent(), /대괄호.*사실/);
      const changes = page.locator(".review-change-list li");
      assert.equal(await changes.count(), 1, "the quoted occurrence does not become a suggested edit");
      const change = await changes.first().innerText();
      assert.match(change, /수정 전.*조사를 진행함.*수정 후.*조사함/s);
      assert.ok(change.trim().split("\n").at(-1).trim().length >= 12, "the safe edit has a visible explanation");
      const followUp = await page.locator(".review-followup-question").allTextContents();
      const reasons = await page.locator(".review-guidance-reason").allTextContents();
      assert.ok(followUp.length && followUp.every(item => /\?/.test(item)), "missing evidence is phrased as a concrete question");
      assert.equal(reasons.length, followUp.length, "every question is paired with a reason");
      assert.ok(reasons.every(item => item.replace("보완하는 이유", "").trim().length >= 12));
      await page.locator("#copyButton").click();
      const copied = await page.evaluate(() => window.__recordReviewCopiedText);
      assert.ok(copied.includes(revised.grade) && copied.includes(revised.rationale), "copied summary uses the visible decision and rationale");
      const [download] = await Promise.all([
        page.waitForEvent("download"),
        page.locator("#downloadButton").click(),
      ]);
      assert.match(download.suggestedFilename(), /라이언의_기록_분석_.*\.html$/);
      const report = await readFile(await download.path(), "utf8");
      assert.ok(report.includes(rewriteInput) && report.includes(rewriteExpected), "download includes source and safe rewrite");
      assert.ok(report.includes(revised.rationale), "download contains the visible decision rationale");
    }

    const samplePrivateInput = inquiry + " 검증용 식별 표식 " + sentinel;
    await analyze(page, samplePrivateInput);
    const persistence = await page.evaluate(async token => ({
      local: JSON.stringify({ ...localStorage }).includes(token),
      session: JSON.stringify({ ...sessionStorage }).includes(token),
      cookie: document.cookie.includes(token),
      db: typeof indexedDB.databases === "function" ? (await indexedDB.databases()).length : 0,
    }), sentinel);
    assert.deepEqual(persistence, { local: false, session: false, cookie: false, db: 0 });

    const confirm = page.locator("#subjectSettingsDialog .dialog-confirm");
    await page.locator("[data-area='subject']").click();
    await page.locator("#subjectSettingsDialog").waitFor({ state: "visible" });
    await page.waitForFunction(() => document.getElementById("analyzeButton").disabled);
    assert.equal(await page.locator("#curriculumSubjectV22").isDisabled(), true);
    await page.locator("#curriculumRevisionV22").selectOption("2022");
    await page.locator("#curriculumSubjectV22").selectOption("english");
    await confirm.click();
    await page.locator("#subjectSettingsDialog").waitFor({ state: "hidden" });
    await page.waitForFunction(() => !document.getElementById("analyzeButton").disabled);
    if (checkRubric) {
      const subjectResult = await analyze(page, inquiry);
      assert.ok(subjectResult.internal !== "A", "unrelated scientific inquiry cannot earn top marks for English");
      assert.ok(subjectResult.suggestions.some(item => /교과|개념/.test(item)), "course mismatch should receive specific feedback");
      assert.ok(subjectResult.guidance.some(item => /교과|영어/.test(item) && /수행|비교|해석/.test(item)),
        "the course change should produce actionable subject-specific advice");
      const subjectQuestions = await page.locator(".review-followup-question").allTextContents();
      assert.ok(subjectQuestions.some(item => /표현|구문|번역/.test(item)),
        "the selected English subject should yield a specific follow-up question");
    }

    await page.reload({ waitUntil: "load" });
    assert.equal(await textarea.inputValue(), "", "input must not survive a reload");
    const duelButton = page.locator("#duelButton");
    const buttonColor = async () => duelButton.evaluate(el => {
      const { color, backgroundColor, backgroundImage, borderColor } = getComputedStyle(el);
      return [color, backgroundColor, backgroundImage, borderColor];
    });
    const before = await buttonColor();
    await duelButton.click();
    assert.equal(await duelButton.getAttribute("aria-pressed"), "true");
    if (!baseline) {
      assert.notDeepEqual(await buttonColor(), before, "duel mode should change the button colors");
      await assertMotionTriggered(page, "duel");
      await assertMotionPolicy(page, label + " duel activation", "duel");
    }
    await page.locator("[data-target='science']").click();
    await analyze(page, inquiry, { duel: true });
    await page.locator("#duelPanel").waitFor({ state: "visible" });
    const duelScore = Number(await page.locator("#duelTotalMeter").getAttribute("aria-valuenow"));
    assert.ok(duelScore > 0 && duelScore <= 100, "duel provides a score out of 100");
    await assertFitsViewport(page, label + " duel result");
    if (!baseline) {
      await assertMotionTriggered(page, "duel", "duelPanel");
      await assertMotionPolicy(page, label + " duel result", "duel");
      await assertReadableContrast(page, ["#duelButton", "#resultHeading", "#duelTotalScore", "#duelTotalGrade", "#duelStrengths li"], label + " duel result");
    }

    await page.locator("[data-level='strict']").click();
    await page.locator("#duelPanel").waitFor({ state: "hidden" });
    assert.equal(await duelButton.getAttribute("aria-pressed"), "false");
    if (!baseline) await assertMotionPolicy(page, label + " after exiting duel");
    const switches = { strict: [strong.grade, middle.grade, weak.grade], normal: [normalStrong.grade, normalWeak.grade] };
    assert.deepEqual(errors, [], label + " browser errors");
    assert.deepEqual(attempts, [], label + " attempted network requests beyond the page itself");
    console.log(JSON.stringify({ label, switches, duelScore, browserErrors: errors.length, outboundRequests: attempts.length }));
  } finally {
    await context.close();
  }
}

async function runReducedMotion(browser, options) {
  const { page, context, attempts, errors } = await openPage(browser, { ...options, reducedMotion: "reduce" });
  const label = options.label + " reduced motion";
  try {
    await page.locator("#guideTab").click();
    await page.locator("#guidePanel").waitFor({ state: "visible" });
    await assertMotionPolicy(page, label + " guide");
    await page.locator("#analysisTab").click();
    await page.locator("#duelButton").click();
    await assertMotionPolicy(page, label + " duel activation");
    await page.locator("[data-target='science']").click();
    await analyze(page, inquiry, { duel: true });
    await page.locator("#duelPanel").waitFor({ state: "visible" });
    await assertMotionPolicy(page, label + " duel result");
    assert.deepEqual(errors, [], label + " browser errors");
    assert.deepEqual(attempts, [], label + " attempted network requests");
    console.log(JSON.stringify({ label, animations: 0, outboundRequests: attempts.length }));
  } finally {
    await context.close();
  }
}

async function runOfflineCopies(browser) {
  const numberedCopies = [
    ["라이언의_기록_분석_ver.30.html", { width: 1366, height: 900 }],
    [join("mobile", "라이언의_기록_분석_모바일_ver.23.html"), { width: 390, height: 844 }],
  ];
  for (const [relative, viewport] of numberedCopies) {
    const context = await browser.newContext({ viewport, offline: true });
    try {
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", error => errors.push(error.message));
      await page.goto(pathToFileURL(join(root, relative)).href, { waitUntil: "load" });
      await page.waitForFunction(() => Boolean(window.RyanRecordReview));
      await page.locator("[data-area='overall']").click();
      await page.locator("[data-target='science']").click();
      await page.locator("[data-level='strict']").click();
      const result = await analyze(page, inquiry);
      assert.equal(result.grade, "A");
      await assertFitsViewport(page, relative);
      assert.deepEqual(errors, [], "offline numbered copy browser errors");
      console.log(JSON.stringify({ offlineCopy: relative, grade: result.grade }));
    } finally {
      await context.close();
    }
  }
}

try {
  if (!baseline && !live) {
    for (const [route, bytes] of pages) {
      const source = bytes.toString("utf8");
      assert.ok(![...source.matchAll(/data:image\/\w+;base64,([A-Za-z0-9+/=]+)/g)].some(match => isLogo(match[1])), route + " must not embed the removed image");
    }
  }
  const desktop = await chromium.launch({ headless: true, ...(existsSync(browserPath) ? { executablePath: browserPath } : {}) });
  try {
    await runModeFlow(desktop, { route: "/", label: "Chromium desktop" });
    await runModeFlow(desktop, { route: "/mobile/", mobile: true, label: "Chromium mobile" });
    if (!baseline) await runReducedMotion(desktop, { route: "/", label: "Chromium desktop" });
    if (process.argv.includes("--offline")) await runOfflineCopies(desktop);
  } finally {
    await desktop.close();
  }
  if (process.argv.includes("--webkit")) {
    const safari = await webkit.launch({ headless: true });
    try {
      const options = { route: "/mobile/", mobile: true, device: devices["iPhone 13"], label: "WebKit iPhone 13" };
      await runModeFlow(safari, options);
      if (!baseline) await runReducedMotion(safari, options);
    } finally {
      await safari.close();
    }
  }
} finally {
  if (server) await new Promise(resolveClose => server.close(resolveClose));
}
