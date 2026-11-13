# 라이언의 기록 분석

[PC](https://seiryu1318.github.io/Ryan_record/) · [모바일](https://seiryu1318.github.io/Ryan_record/mobile/)

학교생활기록부 문구의 행동, 결과, 판단 근거를 점검하고 보완 위치와 작성 틀을 제안합니다. 학생부 문구는 브라우저에서 처리합니다. 엄격 모드는 A/B/C, 평범 모드는 A/B를 우수, C와 미작성을 미흡으로 표시합니다. 대결의 100점 비교는 별도의 기록 구조 점검입니다.

[평가 기준과 자료 검증](docs/rubric-evidence.md)을 참조하세요. UI는 GDWEB의 [디지털 정부서비스 UI/UX 가이드라인](https://www.gdweb.co.kr/sub/view.asp?str_no=22102)과 [서울사이버대학교 입학지원센터](https://www.gdweb.co.kr/sub/view.asp?Txt_fgbn=7&str_no=27102)를 참고했습니다.

활성 페이지는 `index.html`, `mobile/index.html`이며 두 페이지가 `record-review.css`와 `record-review.js`를 공유합니다. 번호가 붙은 최신 HTML은 두 자산이 내장되어 오프라인에서도 열 수 있습니다.

```sh
node tools/build-offline.mjs
node tools/build-offline.mjs --check
node tests/record-review.mjs --webkit --offline
```

브라우저 검사에는 Playwright와 Chromium(또는 Edge), 선택 사항인 WebKit이 필요합니다. Pages는 `main` 브랜치의 루트에서 자동 배포됩니다.
