import { readFile, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const read = file => readFile(new URL(file, root), "utf8");
const [cssSource, js, background, logo] = await Promise.all([
  read("record-review.css"), read("record-review.js"),
  readFile(new URL("background2.jpg",root)), readFile(new URL("goom.jpg",root)),
]);
const imageData = bytes => "data:image/jpeg;base64,"+bytes.toString("base64");
const css = cssSource.replaceAll("./background2.jpg",imageData(background));
if (/<\/style/i.test(css) || /<\/script/i.test(js)) throw new Error("Unexpected closing tag in assets");
for (const [entry, path, output] of [
  ["index.html","./","라이언의_기록_분석_ver.32.html"],
  ["mobile/index.html","../","mobile/라이언의_기록_분석_모바일_ver.25.html"],
]) {
  const input = await read(entry);
  const style = '<link rel="stylesheet" href="'+path+'record-review.css?v=32">';
  const script = '<script defer src="'+path+'record-review.js?v=32"></script>';
  const brand = 'src="'+path+'goom.jpg"';
  if (!input.includes(style) || !input.includes(script) || !input.includes(brand) || css === cssSource) throw new Error("Missing asset link in "+entry);
  const source = input.replace(style, () => '<style id="recordReviewStyles">\n'+css+'\n</style>')
    .replace(script, () => '<script id="recordReviewRuntime">\n'+js+'\n</script>')
    .replace(brand, () => 'src="'+imageData(logo)+'"');
  const target = new URL(output,root);
  if (process.argv.includes("--check")) {
    if ((await read(output)).replace(/\r\n/g,"\n") !== source.replace(/\r\n/g,"\n")) throw new Error("Stale offline copy: "+output);
  } else {
    await writeFile(target,source);
  }
}
