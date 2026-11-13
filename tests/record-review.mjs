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
const targetBrowsers = new Set(process.argv.filter(arg => arg.startsWith("--browser=")).map(arg => arg.split("=")[1]));
const runs = name => targetBrowsers.size === 0 || targetBrowsers.has(name);
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
  ["background2.jpg", "image/jpeg"],
  ["goom.jpg", "image/jpeg"],
]) {
  const path = join(root, file);
  if (existsSync(path)) staticFiles.set("/" + file, { bytes: await readFile(path), contentType });
}
const server = live ? null : createServer((request, response) => {
  const url = new URL(request.url, "http://localhost/");
  const source = request.method === "GET" && staticFiles.get(url.pathname);
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
const allowedRequests = new Set([...staticFiles.keys(), "/favicon.ico",
  "/record-review.css?v=32", "/record-review.js?v=32"].map(route => siteUrl(route).href));

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
const rewriteInput = "2025년 6월 14일, 생명과학 활동에서 pH 7.4 조건의 E. coli 배양 결과를 조사함. 배양 과정의 원인 조사를 진행함. 메모 제목 ‘조사를 진행함’을 인용해 집락 지름 24mm를 표로 작성함. 다른 조건에서도 관찰을 실시함.";
const firstRewrite = rewriteInput.replace("조사를 진행함", "조사함");
const rewriteExpected = firstRewrite.replace("관찰을 실시함", "관찰함");
const rewriteHighlights = [
  { text: "조사함", start: rewriteInput.indexOf("조사를 진행함") },
  { text: "관찰함", start: firstRewrite.indexOf("관찰을 실시함") },
];
const joinedInput = "같은 조건에서 E. coli 집락 지름을 3회 측정해 비교표를 작성함. 작성한 비교표를 모둠 회의에서 발표함.";
const joinedExpected = "같은 조건에서 E. coli 집락 지름을 3회 측정해 비교표를 작성하고 모둠 회의에서 발표함.";
const outOfOrderInput = "결과: 집락 지름이 3.0mm에서 4.5mm로 늘어난 것을 확인함.\n방법: 같은 온도에서 집락 지름을 3회 측정함.";
const reorderedExpected = "수행 방법: 같은 온도에서 집락 지름을 3회 측정함.\n결과: 집락 지름이 3.0mm에서 4.5mm로 늘어난 것을 확인함.";
const mixedActorRewrite = "학생은 보고서를 작성함. 작성한 보고서를 교사가 검토하고 발표함.";
const sequenceInput = "용액의 pH 7.4 조건에서 E. coli 집락을 3회 측정하였으며, 그 결과 평균 지름 24mm를 기록함.";
const sequenceExpected = sequenceInput.replace("측정하였으며,", "측정함.");
const unrelatedRewrite = "결과: 국어 발표에 참여함.\n방법: 미세먼지 농도를 3회 측정함.";
const borrowedRewrite = "결과: 저자가 실험에서 차이가 나타난 것을 설명함.\n방법: 학생은 논문을 읽고 자료를 분류함.";

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
const titleImageHash = "70da7dc0f4e94442349071898ba5382dd63bbeb8c6e426b61e11dad691f85d2a";
const backgroundImageHash = "4a95e38838c2af29661f03875405bee08f450e55836f1f539904d0b5c59f952d";
const gisResult = "GIS로 서울 자치구의 산림 면적과 탄소 흡수량 자료를 비교함. 산림 면적이 비슷한 자치구에서도 탄소 흡수량이 감소하는 사례를 발견하여 토지 이용 유형과 수종 차이를 비교함. 자치구별 수치를 표로 정리함.";
const decimalDuel = "같은 배양 조건에서 E. coli 집락의 지름을 3회 관찰함. 평균 지름 3.0mm와 4.5mm를 비교해 차이를 표로 정리함. 발표 자료에 “3.0mm에서 변화가 시작됨”을 인용함.";
const dirtyPaste = "\ufeff생명과학\u00a0  활동에서 pH 7.4 조건으로 E. co\u00adli 집락을 관찰함.\r\n\r\n\r\n  집락\u200b   지름을 24mm로 기록하고 ‘측정 결과’와 \"control\"을 비교함.  ";
const cleanPaste = "생명과학 활동에서 pH 7.4 조건으로 E. coli 집락을 관찰함.\n\n집락 지름을 24mm로 기록하고 ‘측정 결과’와 \"control\"을 비교함.";

const wrappedLines = [
  "화학 수업에서 산과 염기의 반응을 관찰한 뒤 용액의 산성도에 따라 생기는 변화가 다른 이유를 시각",
  "화하는 방법을 찾고 교과서에서 확인한 원리를 적용하여 같은 양의 용액에 넣은 시약의 양과 흡",
  "수량의 변화를 표로 정리함. 실험을 반복하면서 용액의 온도와 시약의 양을 동일하게 유지하면 변",
  "함이 적어지는 것을 확인하고 첫 측정과 비교함.",
];
const intentionalStructure = "\n\n- 1차 실험: pH 7.4로 설정함.\n- 2차 실험: pH 7.4에서 3회 측정함.";
const wrappedPaste = wrappedLines.join("\r\n") + intentionalStructure;
const unwrappedPaste = wrappedLines.join("") + intentionalStructure;

const deliberateLineBreak = "자료를 비교해 서로 다른 결과가 나타난 원인을 조사하고 관찰값의 범위와 단위를 확인하여 조별 보고서에 정리함.\n수업에서 다음 주의 실험 계획을 설명하고 기록에 필요한 역할과 시간 등을 친구들과 논의하여 합의함.";

function hash(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
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
async function assertBrandAndBackground(page, label, offline = false) {
  const logo = page.locator(".brand img.brand-logo");
  await logo.waitFor({ state: "visible" });
  const asset = await logo.evaluate(image => ({
    source: image.currentSrc,
    width: image.naturalWidth,
    height: image.naturalHeight,
    alternate: image.getAttribute("alt"),
    centerOffset: Math.abs((image.getBoundingClientRect().top + image.getBoundingClientRect().bottom
      - document.querySelector(".brand h1").getBoundingClientRect().top - document.querySelector(".brand h1").getBoundingClientRect().bottom) / 2),
  }));
  assert.ok(asset.width > 0 && asset.height > 0 && asset.alternate !== null, label + " rendered title image");
  assert.ok(asset.centerOffset <= 12, label + " title and image align vertically");
  assert.equal(await page.locator("img[src$='goom.jpg'], img.brand-logo").count(), 1, "고옴 is only shown by the title");
  if (offline) {
    assert.match(asset.source, /^data:image\/jpeg;base64,/);
    assert.equal(hash(Buffer.from(asset.source.split(",")[1], "base64")), titleImageHash);
  } else {
    assert.match(asset.source, /\/goom\.jpg$/);
  }
  const wall = await page.evaluate(() => {
    const style = getComputedStyle(document.body, "::before");
    const { position, top, right, bottom, left, backgroundImage, backgroundPosition, backgroundSize } = style;
    return { position, top, right, bottom, left, backgroundImage, backgroundPosition, backgroundSize };
  });
  assert.deepEqual([wall.position, wall.top, wall.right, wall.bottom, wall.left], ["fixed", "0px", "0px", "0px", "0px"], label + " fixed background fills the viewport");
  assert.match(wall.backgroundPosition.split(",").at(-1).trim(), /^(?:50%|center)/, label + " background image is centered horizontally " + JSON.stringify({ position: wall.backgroundPosition, image: wall.backgroundImage.slice(0, 100) }));
  assert.match(wall.backgroundSize, /cover/, label + " background covers the viewport");
  assert.match(wall.backgroundImage, /gradient\(/, label + " has a tint layer");
  if (offline) {
    const encoded = wall.backgroundImage.match(/data:image\/jpeg;base64,([a-z0-9+/=]+)/i)?.[1];
    assert.ok(encoded, "offline background is embedded");
    assert.equal(hash(Buffer.from(encoded, "base64")), backgroundImageHash);
  } else {
    assert.match(wall.backgroundImage, /\/background2\.jpg/);
  }
}

async function assertCenteredFlow(page, label, { results = false, duel = false } = {}) {
  const layout = await page.evaluate(({ results, duel }) => {
    const selectors = [".app-shell", ".topbar", ...(results ? ["#results"] : ["#analysisPanel .global-tools", "#analysisPanel .setup-card"])];
    const rectangle = node => {
      const {left, right, width, top, bottom, height} = node.getBoundingClientRect();
      return {left, right, width, top, bottom, height};
    };
    const cards = selectors.map(selector => rectangle(document.querySelector(selector)));
    const buttons = [...document.querySelectorAll("#levelButtons > button")].filter(node => node.getClientRects().length).map(rectangle);
    const visibleFormRows = [...document.querySelectorAll(".setup-card > .section, .setup-card > .action-row")]
      .filter(node => node.getClientRects().length).map(rectangle).sort((a,b) => a.top-b.top);
    const duelPanels = duel ? ["#duelTotalMeter", "#duelMetricGrid"]
      .map(selector => document.querySelector(selector)).filter(node => node?.getClientRects().length).map(rectangle) : [];
    const top = document.querySelector(".topbar");
    return { cards, buttons, visibleFormRows, duelPanels, viewWidth: document.documentElement.clientWidth,
      sticky: getComputedStyle(top).position };
  }, { results, duel });
  for (const {left, right, width} of layout.cards) {
    assert.ok(width > 0 && Math.abs(left - (layout.viewWidth - right)) <= 3, label + " centered card " + JSON.stringify({ left, right, width }));
    assert.ok(Math.abs(width - layout.cards[0].width) <= 3, label + " aligned card widths");
  }
  assert.equal(layout.sticky, "sticky", label + " sticky categorized header");
  if (results) {
    assert.ok(layout.cards[2].top - layout.cards[1].bottom <= 48, label + " no blank band above results");
    assert.equal(layout.buttons.length, 0, "input controls are hidden in the results category");
  } else {
    assert.equal(layout.buttons.length, 3, "all evaluation buttons are shown");
    assert.ok(Math.max(...layout.buttons.map(button => button.width)) - Math.min(...layout.buttons.map(button => button.width)) <= 4,
      label + " equal evaluation button widths");
    assert.ok(Math.max(...layout.buttons.map(button => button.top)) - Math.min(...layout.buttons.map(button => button.top)) <= 3,
      label + " evaluation buttons share a row");
    for (const [index, row] of layout.visibleFormRows.entries()) {
      if (index) assert.ok(row.top - layout.visibleFormRows[index - 1].bottom <= 48, label + " no blank form band between consecutive controls");
    }
  }
  if (duel) assert.equal(layout.duelPanels.length, 2, label + " duel total and metrics stay visible");
}

async function pasteInField(textarea, text, { html = "", range = null } = {}) {
  return textarea.evaluate((element, { text, html, range }) => {
    element.focus();
    const [start, end] = range || [0, element.value.length];
    element.setSelectionRange(start, end);
    const clipboardData = new DataTransfer();
    clipboardData.setData("text/plain", text);
    if (html) clipboardData.setData("text/html", html);
    const event = new ClipboardEvent("paste", { clipboardData, bubbles: true, cancelable: true });
    if (element.dispatchEvent(event)) {
      element.setRangeText(text, start, end, "end");
      element.dispatchEvent(new InputEvent("input", { inputType: "insertFromPaste", bubbles: true, data: text }));
    }
    return element.value;
  }, { text, html, range });
}

async function assertPasteFormatting(page) {
  const field = page.locator("#recordText");
  const actual = await pasteInField(field, dirtyPaste, { html: "<p>discard clipboard formatting</p>" });
  assert.equal(actual, cleanPaste, "paste removes invisible and duplicated whitespace and preserves decimals, quotes, and paragraph break");
  assert.equal(await pasteInField(field, deliberateLineBreak), deliberateLineBreak, "a deliberate break between finished sentences remains intact");
  await field.fill("앞에 [교체할 부분] 뒤에");
  assert.equal(await pasteInField(field, "측정값\u00a0  7.4", { range: [3, 11] }), "앞에 측정값 7.4 뒤에",
    "pasting replaces the selection and leaves surrounding content untouched");
  assert.equal(await pasteInField(field, wrappedPaste), unwrappedPaste, "visually prewrapped Hangul reflows without losing blank paragraphs or list items");
  const justification = await field.evaluate(element => getComputedStyle(element).textAlign);
  assert.equal(justification, "justify", "pasted text is justified");
  await field.blur();
  assert.equal(await field.inputValue(), unwrappedPaste, "blur does not mutate reformatted text or numeric punctuation");
}

async function assertDuelEvidence(page, label) {
  const quote = page.locator("#duelQuote");
  const note = page.locator("#duelNote");
  const cards = page.locator("#duelMetricGrid .duel-metric-card");
  const verifyQuotes = async source => {
    const citations = await page.locator("#duelQuote .duel-evidence-text:visible, #duelMetricGrid .duel-evidence-text:visible, #duelMetricGrid strong.duel-emphasis:visible").allTextContents();
    for (const citation of citations) {
      const text = citation.replace(/^“|”$/g, "").trim();
      assert.ok(source.includes(text), label + " duel excerpt must be present in the input");
      assert.doesNotMatch(text, /^(?:0mm|5mm|coli\s)|(?:\d\.|“[^”]+)$/);
    }
  };

  await analyze(page, praise, { duel: true });
  await page.locator("#duelPanel").waitFor({ state: "visible" });
  assert.equal(await quote.isVisible(), false, label + " no empty representative evidence card");
  assert.equal(await cards.locator(".duel-evidence-text, strong.duel-emphasis").count(), 0, label + " generic praise does not produce fake metric evidence");
  const weakNote = await note.innerText();
  assert.match(weakNote, /무엇|학생이|학생의|행동|결과|자료|확인|써|적/);
  assert.doesNotMatch(weakNote, /1차 결론 미확인|합격 가능성|대표 장면이 부족/);
  assert.ok(await note.locator("mark.review-key-highlight").count() > 0, "duel action guidance is marked when evidence is missing");

  await analyze(page, gisResult, { duel: true });
  const duelText = await page.locator("#duelPanel").innerText();
  assert.match(duelText, /흡수량이 감소하는 사례를 발견/);
  assert.doesNotMatch(duelText, /1차 결론 미확인|대표 장면이 부족/);
  assert.equal(await cards.count(), 4, label + " four distinct duel dimensions");
  assert.equal(await quote.isVisible(), true, label + " verified result is visible");
  assert.match(await quote.locator(".duel-evidence-text").innerText(), /흡수량이 감소하는 사례를 발견/);
  const duelMarks = await quote.locator("mark.review-key-highlight").allTextContents();
  assert.ok(duelMarks.some(item => /흡수량이 감소하는 사례를 발견/.test(item) && gisResult.includes(item)), "duel result highlights exact evidence");
  await verifyQuotes(gisResult);

  await analyze(page, decimalDuel, { duel: true });
  await verifyQuotes(decimalDuel);
  const evidence = await page.locator("#duelQuote .duel-evidence-text:visible, #duelMetricGrid .duel-evidence-text:visible, #duelMetricGrid .duel-emphasis:visible").allTextContents();
  assert.ok(evidence.some(item => /E\. coli|3\.0mm|4\.5mm/.test(item)), "decimal or abbreviation appears intact in duel evidence");
}

async function assertLightweightSections(page, selectors, label) {
  const enclosed = await page.evaluate(items => items.flatMap(selector => {
    const elements = [...document.querySelectorAll(selector)].filter(element => element.getClientRects().length);
    return elements.flatMap(element => {
      const style = getComputedStyle(element);
      const sides = ["Top", "Right", "Bottom", "Left"].filter(side =>
        !["none", "hidden"].includes(style["border" + side + "Style"]) && parseFloat(style["border" + side + "Width"]) > 0);
      return sides.length === 4 || style.boxShadow !== "none" ? [selector] : [];
    });
  }), selectors);
  assert.deepEqual(enclosed, [], label + " sections do not use nested frames or shadows");
}

async function assertExactHighlight(page, source, expected, changes) {
  const text = page.locator("#retakeExampleText .review-rewrite-text");
  const ranges = await text.evaluate(element => {
    return [...element.querySelectorAll("mark.review-edit-highlight")].map(mark => {
      const before = document.createRange();
      before.setStart(element, 0);
      before.setEndBefore(mark);
      return { text: mark.textContent, start: before.toString().length };
    });
  });
  assert.equal(await text.textContent(), expected, "highlight does not change rewrite text or whitespace");
  assert.deepEqual(ranges, changes, "only the replacement at its exact rewritten offset is marked");
  for (const token of ["pH 7.4", "E. coli", "24mm", "‘조사를 진행함’"]) {
    if (source.includes(token)) assert.ok(expected.includes(token), token + " stays intact");
  }
  assert.equal(await page.locator("#retakePlacementGuide .review-edit-highlight, .review-change-list .review-edit-highlight").count(), 0,
    "original evidence and suggested fill-in material are not marked as edits");
  if (changes.length) {
    const selector = ".review-rewrite-text mark.review-edit-highlight";
    await assertReadableContrast(page, [selector], "highlight");
    const visibleColor = await page.locator(selector).first().evaluate(mark => {
      const style = getComputedStyle(mark);
      const parent = getComputedStyle(mark.parentElement);
      const distinctFill = !["transparent", "rgba(0, 0, 0, 0)"].includes(style.backgroundColor)
        && style.backgroundColor !== parent.backgroundColor;
      return distinctFill || (style.backgroundImage !== "none" && style.backgroundImage !== parent.backgroundImage);
    });
    assert.equal(visibleColor, true, "the semantic highlight is visibly distinct");
  }
}

async function assertTrackProfile(page, strict) {
  const details = page.locator("#v25MoreAnalysis");
  if (await details.getAttribute("open") === null) await details.locator("summary").click();
  const title = page.locator("#profileTitle");
  const track = page.locator("#profileSelectedTrack");
  const grade = page.locator("#profileTrackGrade");
  assert.equal(await title.innerText(), "희망 계열과의 관련성");
  assert.equal(await track.isVisible(), true);
  assert.equal(await grade.isVisible(), true);
  assert.equal(await track.innerText(), "이공계열");
  assert.match(await grade.innerText(), strict ? /^[ABC]$/ : /^(우수|미흡)$/);
  assert.doesNotMatch(await title.innerText(), /,|이공계열|우수|미흡/);
}

async function assertKeyHighlight(page, source, revised) {
  const key = page.locator("mark.review-key-highlight");
  const evidence = await page.locator("#precisionEvidence").innerText();
  const evidenceMarks = await page.locator("#precisionEvidence mark.review-key-highlight").allTextContents();
  assert.ok(evidenceMarks.length > 0, "source evidence has a visible secondary mark");
  for (const marked of evidenceMarks) {
    const raw = marked.replace(/^“|”$/g, "").trim();
    assert.ok(source.includes(raw) && evidence.includes(marked), "mark retains exact wording from the user's input");
  }
  assert.ok(await page.locator("#precisionSuggestions li:first-child mark.review-key-highlight").count() > 0, "the first useful suggestion is marked");
  const suggestion = await page.locator("#precisionSuggestions li:first-child").innerText();
  assert.equal(suggestion, revised.suggestions[0], "secondary marking does not change the suggestion");
  const placeholders = await page.locator("#reviewCompletionExample mark.review-key-highlight").allTextContents();
  assert.ok(placeholders.length > 0 && placeholders.every(text => /^\[[^\]]+\]$/.test(text)), "the completion draft highlights only fact placeholders");
  const questions = await page.locator(".review-followup-question mark.review-key-highlight").allTextContents();
  assert.ok(questions.length === 1 && questions[0].trim().length > 2, "the first meaningful follow-up question is marked");
  assert.equal(await page.locator(".review-rewrite-text mark.review-key-highlight, .review-change-list mark.review-key-highlight").count(), 0,
    "secondary highlights do not mix into the edited wording");
  assert.equal(await key.first().isVisible(), true);
  const styles = await page.evaluate(() => ["mark.review-key-highlight", "mark.review-edit-highlight"].map(selector => {
    const style = getComputedStyle(document.querySelector(selector));
    return [style.backgroundColor, style.backgroundImage];
  }));
  assert.notDeepEqual(styles[0], styles[1], "pale key and actual-edit highlights have different styling");
  assert.ok(!["transparent", "rgba(0, 0, 0, 0)"].includes(styles[0][0]) || styles[0][1] !== "none", "key highlight has a visible pale fill");
  await assertReadableContrast(page, ["#precisionEvidence mark.review-key-highlight"], "key highlight");
}

async function assertStructuralRewrite(page, example) {
  const fixtures = [
    { input: joinedInput, expected: joinedExpected, changes: [{ text: "작성하고", start: joinedExpected.indexOf("작성하고") }], kind: "문장 연결" },
    { input: outOfOrderInput, expected: reorderedExpected, changes: [{ text: reorderedExpected, start: 0 }], kind: "순서 정리" },
    { input: sequenceInput, expected: sequenceExpected, changes: [{ text: "측정함.", start: sequenceExpected.indexOf("측정함.") }], kind: "문장 나누기" },
    ...[mixedActorRewrite, unrelatedRewrite, borrowedRewrite].map(input => ({ input, expected: input, changes: [] })),
  ];
  for (const {input, expected, changes, kind} of fixtures) {
    await analyze(page, input);
    if (await example.getAttribute("open") === null) await example.locator("summary").click();
    await assertExactHighlight(page, input, expected, changes);
    const editNotes = await page.locator(".review-change-list li").allTextContents();
    if (kind) assert.ok(editNotes.some(note => note.includes(kind)), kind + " is explained as a structural edit");
    else assert.equal(editNotes.length, 0, "unrelated scenes and different actors stay separate");
  }
}

async function assertDownloadedHighlight(page, report, expected, changes) {
  const parsed = await page.evaluate(reportText => {
    const doc = new DOMParser().parseFromString(reportText, "text/html");
    const rewrite = doc.querySelector(".review-rewrite-text");
    return {
      plain: rewrite?.textContent,
      marks: [...doc.querySelectorAll(".review-rewrite-text mark.review-edit-highlight")].map(mark => mark.textContent),
      source: doc.querySelector(".source-record")?.textContent,
      sourceMarks: doc.querySelectorAll(".source-record mark.review-edit-highlight, .source-record mark.review-key-highlight").length,
      keyMarks: doc.querySelectorAll("#precisionEvidence mark.review-key-highlight, #precisionSuggestions mark.review-key-highlight").length,
      stylesheet: [...doc.querySelectorAll("style")].map(style => style.textContent).join("\n"),
    };
  }, report);
  assert.equal(parsed.plain, expected, "download includes the unaltered rewritten text");
  assert.deepEqual(parsed.marks, changes.map(change => change.text), "download preserves semantic marks");
  assert.ok(parsed.source?.includes(rewriteInput) && parsed.sourceMarks === 0, "download keeps original text unmarked");
  assert.match(parsed.stylesheet, /\.review-edit-highlight\s*\{[^}]*background/i, "download styles the semantic mark without site CSS");
  assert.ok(parsed.keyMarks > 0, "download keeps key evidence and suggestion marks");
  assert.match(parsed.stylesheet, /\.review-key-highlight\s*\{[^}]*background/i, "download styles pale marks without site CSS");
}

async function assertFitsViewport(page, label) {
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, label + " must fit its viewport");
}

const reviewTabs = { analysis: "#analysisTab", results: "#resultsTab", guide: "#guideTab" };
const activeReviewSection = page => page.evaluate(() => document.body.dataset.reviewSection || null);
async function openReviewSection(page, section) {
  const select = page.locator("#reviewSectionSelect");
  if (!baseline && await select.isVisible()) {
    if (await select.inputValue() !== section) await select.selectOption(section);
    assert.equal(await select.inputValue(), section);
  } else {
    const tab = page.locator(reviewTabs[section]);
    if (await tab.getAttribute("aria-selected") !== "true") await tab.click();
    assert.equal(await tab.getAttribute("aria-selected"), "true");
  }
  if (!baseline) await page.waitForFunction(name => document.body.dataset.reviewSection === name, section);
}

async function analyze(page, text, { enter = false, duel = false } = {}) {
  const expectCanonical = checkRubric && !duel;
  if (!baseline) await openReviewSection(page, "analysis");
  await page.locator("#recordText").fill(text);
  const button = page.locator("#analyzeButton");
  assert.equal(await button.isEnabled(), true, "analyze should be enabled after completing inputs");
  if (enter) await page.locator("#recordText").press("Enter");
  else await button.click({ force: baseline });
  await page.locator("#results").waitFor({ state: "visible" });
  if (!baseline) await page.waitForFunction(() => document.body.dataset.reviewSection === "results");
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
      if ((document.body?.dataset.reviewSection === "guide" || document.getElementById("guideTab")?.getAttribute("aria-selected") === "true")
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
    if (live) assert.match(await page.title(), mobile ? /ver\.25$/ : /ver\.32$/);
    await assertBrandAndBackground(page, label);
    await assertCenteredFlow(page, label + " initial screen");
    await assertLightweightSections(page, [".global-tools", ".setup-card"], label + " input");
    assert.ok(await page.locator("#recordText").evaluate(field => parseFloat(getComputedStyle(field).borderTopWidth) > 0), "text field keeps its visible boundary");
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
    const sectionSelect = page.locator("#reviewSectionSelect");
    if (!baseline) {
      assert.equal(await activeReviewSection(page), "analysis");
      assert.equal(await page.locator("#results").isVisible(), false);
      assert.equal(await page.locator("#guidePanel").isVisible(), false);
      assert.equal(await sectionSelect.isVisible(), Boolean(mobile), "mobile uses the dropdown");
      assert.equal(await mainTab.isVisible(), !mobile, "desktop uses the three tabs");
      if (!mobile) assert.equal(await page.locator("#resultsTab").isVisible(), true);
    }
    if (!baseline) {
      await openReviewSection(page, "results");
      assert.equal(await page.locator("#results").isVisible(), false, "empty results never show a stale analysis");
      assert.equal(await page.locator("#resultEmpty").isVisible(), true, "results explain how to start when empty");
      await page.locator("#resultInputButton").click();
      assert.equal(await activeReviewSection(page), "analysis");
      assert.equal(await page.locator("#recordText").evaluate(field => field === document.activeElement), true);
      if (!mobile) {
        await mainTab.press("ArrowRight");
        assert.equal(await activeReviewSection(page), "results");
        assert.equal(await page.locator("#resultsTab").evaluate(tab => tab === document.activeElement), true);
        await page.locator("#resultsTab").press("ArrowRight");
        assert.equal(await activeReviewSection(page), "guide");
        assert.equal(await page.locator("#guideTab").evaluate(tab => tab === document.activeElement), true);
      }
    }
    await openReviewSection(page, "guide");
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
      await assertReadableContrast(page, [mobile ? "#reviewSectionSelect" : "#guideTab", "#guidePanel h2"], label + " guide");
      await assertLightweightSections(page, ["#guidePanel .usage-card"], label + " guide");
    }
    await openReviewSection(page, "analysis");
    if (!baseline) await assertMotionPolicy(page, label + " return to analysis");

    const analyzeButton = page.locator("#analyzeButton");
    const textarea = page.locator("#recordText");
    if (!baseline) {
      await assertPasteFormatting(page);
      await textarea.fill("");
    }
    assert.equal(await analyzeButton.isDisabled(), true);
    await textarea.fill("짧은 문구");
    assert.equal(await analyzeButton.isDisabled(), true);
    if (!baseline) await openReviewSection(page, "analysis");
    await page.locator("[data-area='overall']").click();
    await page.locator("#sampleButton").click();
    assert.ok((await textarea.inputValue()).length > 30, "sample fills the selected area");
    await page.locator("#clearButton").click();
    assert.equal(await textarea.inputValue(), "");
    assert.equal(await analyzeButton.isDisabled(), true);

    await page.locator("[data-target='science']").click();
    if (!baseline) await openReviewSection(page, "analysis");
    await page.locator("[data-level='strict']").click();
    assert.equal(await page.locator("[data-level='strict']").getAttribute("aria-pressed"), "true");
    if (!baseline) await assertReadableContrast(page, [mobile ? "#reviewSectionSelect" : "#analysisTab", "[data-level='strict']", "[data-area='overall']", "#recordText"], label + " analysis");
    const strong = await analyze(page, inquiry, { enter: !mobile });
    if (!baseline) {
      await assertCenteredFlow(page, label + " ordinary result", { results: true });
      await assertLightweightSections(page, ["#precisionReviewPanel", ".self-review-box", ".self-review-rationale"], label + " ordinary result");
      await assertMotionPolicy(page, label + " ordinary result");
      await assertReadableContrast(page, ["#precisionGrade", "#precisionRationale"], label + " ordinary result");
      await assertTrackProfile(page, true);
      assert.equal(await textarea.isVisible(), false, "records are not shown alongside results");
      await openReviewSection(page, "guide");
      assert.equal(await page.locator("#results").isVisible(), false);
      await openReviewSection(page, "analysis");
      assert.equal(await textarea.inputValue(), inquiry, "navigating back preserves the entered record");
      assert.equal(await page.locator("[data-area='overall']").getAttribute("aria-pressed"), "true");
      assert.equal(await page.locator("[data-level='strict']").getAttribute("aria-pressed"), "true");
      await openReviewSection(page, "results");
      assert.equal(await page.locator("#precisionGrade").innerText(), strong.grade, "navigating preserves the previous results");
      const sticky = await page.evaluate(() => {
        const header = document.querySelector(".topbar");
        window.scrollTo(0, 400);
        return { scroll: window.scrollY, top: header.getBoundingClientRect().top };
      });
      assert.ok(sticky.scroll < 100 || (sticky.top >= -1 && sticky.top <= 20), label + " header remains visible while scrolling");
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
      if (!baseline) await openReviewSection(page, "analysis");
      await page.locator("[data-area='behavior']").click();
      const behavior = await analyze(page, behaviorOutcome);
      assert.match(behavior.grade, /^[AB]$/, "a brief observable community outcome establishes positive evidence");
      assert.ok(behavior.evidence.includes("친구가 발표에 참여함"), "evaluation must cite the peer's observed response");
      assert.equal((await analyze(page, behaviorFollowUp)).grade, "A", "observed participation across meetings can establish strong evidence");
      const behaviorGaps = await analyze(page, action);
      assert.ok(behaviorGaps.guidance.some(item => /상대|공동체|학급|반응/.test(item)),
        "behavior feedback should ask for directly observed effects on others");
      if (!baseline) await openReviewSection(page, "analysis");
      await page.locator("[data-area='career']").click();
      const careerGaps = await analyze(page, action);
      assert.ok(careerGaps.guidance.some(item => /진로|관심 분야|판단 기준/.test(item)),
        "career feedback should connect the evidence to an exploration question or decision");
      if (!baseline) await openReviewSection(page, "analysis");
      await page.locator("[data-area='overall']").click();
    }

    if (!baseline) await openReviewSection(page, "analysis");

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
      const renderedAnchors = await page.locator("#retakePlacementGuide mark:not(.review-key-highlight)").allTextContents();
      assert.ok(renderedAnchors.length, "at least one specific source sentence anchors the advice");
      for (const anchor of renderedAnchors) {
        const quote = anchor.match(/“([\s\S]+)”/);
        assert.ok(quote && rewriteInput.includes(quote[1]), "a guidance anchor must quote original wording exactly");
      }
      const example = page.locator("#retakeExamplePanel");
      if (await example.getAttribute("open") === null) await example.locator("summary").click();
      assert.equal(await page.locator(".review-rewrite-text").isVisible(), true);
      await assertExactHighlight(page, rewriteInput, rewriteExpected, rewriteHighlights);
      await assertTrackProfile(page, false);
      await assertKeyHighlight(page, rewriteInput, revised);
      assert.match(await page.locator("#retakeWarningText").textContent(), /대괄호.*사실/);
      const changes = page.locator(".review-change-list li");
      assert.equal(await changes.count(), 2, "the quoted occurrence does not become a suggested edit");
      assert.match(await changes.nth(1).innerText(), /수정 전.*관찰을 실시함.*수정 후.*관찰함/s);
      const change = await changes.first().innerText();
      assert.match(change, /수정 전.*조사를 진행함.*수정 후.*조사함/s);
      assert.ok(change.trim().split("\n").at(-1).trim().length >= 12, "the safe edit has a visible explanation");
      const followUp = await page.locator(".review-followup-question").allTextContents();
      const reasons = await page.locator(".review-guidance-reason").allTextContents();
      assert.ok(followUp.length && followUp.every(item => /\?/.test(item)), "missing evidence is phrased as a concrete question");
      assert.equal(reasons.length, followUp.length, "every question is paired with a reason");
      assert.ok(reasons.every(item => item.replace("보완하는 이유", "").trim().length >= 12));
      const completionExample = page.locator("#reviewCompletionExample");
      assert.equal(await completionExample.isVisible(), true, "the missing-fact example is shown separately");
      const exampleText = await completionExample.innerText();
      assert.match(exampleText, /이어 쓸 원문.*덧붙일 문장.*\[/s);
      assert.equal(await completionExample.locator("mark.review-edit-highlight").count(), 0, "unverified fill-ins are never marked as completed edits");
      await page.locator("#copyButton").click();
      const copied = await page.evaluate(() => window.__recordReviewCopiedText);
      assert.ok(copied.includes(revised.grade) && copied.includes(revised.rationale), "copied summary uses the visible decision and rationale");
      const [download] = await Promise.all([
        page.waitForEvent("download"),
        page.locator("#downloadButton").click(),
      ]);
      assert.match(download.suggestedFilename(), /라이언의_기록_분석_.*\.html$/);
      const report = await readFile(await download.path(), "utf8");
      await assertDownloadedHighlight(page, report, rewriteExpected, rewriteHighlights);
      assert.ok(report.includes(revised.rationale), "download contains the visible decision rationale");

      await analyze(page, inquiry);
      if (await example.getAttribute("open") === null) await example.locator("summary").click();
      await assertExactHighlight(page, inquiry, inquiry, []);
      assert.equal(await page.locator(".review-change-list li").count(), 0, "unchanged wording never inherits old highlights or edit notes");
      await assertStructuralRewrite(page, example);
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
    if (!baseline) await openReviewSection(page, "analysis");
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
      const guide = await page.locator("#levelGuide").innerText();
      assert.match(guide, /100점/);
      assert.match(guide, /네 가지|4가지/);
      await assertCenteredFlow(page, label + " duel input");
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
      await assertReadableContrast(page, ["#resultHeading", "#duelTotalScore", "#duelTotalGrade", "#duelFitSummary"], label + " duel result");
      await assertCenteredFlow(page, label + " duel result", { results: true, duel: true });
      await assertLightweightSections(page, ["#duelPanel", ".duel-metric-card", ".duel-profile-card"], label + " duel result");
      await assertDuelEvidence(page, label);
    }

    if (!baseline) await openReviewSection(page, "analysis");

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
    await openReviewSection(page, "guide");
    await page.locator("#guidePanel").waitFor({ state: "visible" });
    await assertMotionPolicy(page, label + " guide");
    await openReviewSection(page, "analysis");
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
    ["라이언의_기록_분석_ver.32.html", { width: 1366, height: 900 }],
    [join("mobile", "라이언의_기록_분석_모바일_ver.25.html"), { width: 390, height: 844 }],
  ];
  for (const [relative, viewport] of numberedCopies) {
    const context = await browser.newContext({ viewport, offline: true });
    try {
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", error => errors.push(error.message));
      await page.goto(pathToFileURL(join(root, relative)).href, { waitUntil: "load" });
      await page.waitForFunction(() => Boolean(window.RyanRecordReview));
      if (!baseline) await openReviewSection(page, "analysis");
      await page.locator("[data-area='overall']").click();
      await page.locator("[data-target='science']").click();
      if (!baseline) await openReviewSection(page, "analysis");
      await page.locator("[data-level='strict']").click();
      const result = await analyze(page, inquiry);
      assert.equal(result.grade, "A");
      await analyze(page, rewriteInput);
      const example = page.locator("#retakeExamplePanel");
      if (await example.getAttribute("open") === null) await example.locator("summary").click();
      await assertExactHighlight(page, rewriteInput, rewriteExpected, rewriteHighlights);
      await assertFitsViewport(page, relative);
      await assertBrandAndBackground(page, relative, true);
      assert.deepEqual(errors, [], "offline numbered copy browser errors");
      console.log(JSON.stringify({ offlineCopy: relative, grade: result.grade }));
    } finally {
      await context.close();
    }
  }
}

try {
  if (!baseline && !live) {
    assert.equal(hash(staticFiles.get("/goom.jpg")?.bytes || Buffer.alloc(0)), titleImageHash, "title image is the requested original file");
    assert.equal(hash(staticFiles.get("/background2.jpg")?.bytes || Buffer.alloc(0)), backgroundImageHash, "fixed background is the requested original file");
  }
  const desktop = await chromium.launch({ headless: true, ...(existsSync(browserPath) ? { executablePath: browserPath } : {}) });
  try {
    if (runs("desktop")) await runModeFlow(desktop, { route: "/", label: "Chromium desktop" });
    if (runs("mobile")) await runModeFlow(desktop, { route: "/mobile/", mobile: true, label: "Chromium mobile" });
    if (!baseline && runs("desktop")) await runReducedMotion(desktop, { route: "/", label: "Chromium desktop" });
    if (process.argv.includes("--offline")) await runOfflineCopies(desktop);
  } finally {
    await desktop.close();
  }
  if (process.argv.includes("--webkit") && runs("webkit")) {
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
  if (server) await new Promise(resolveClose => {
    server.close(resolveClose);
    server.closeAllConnections();
  });
}
