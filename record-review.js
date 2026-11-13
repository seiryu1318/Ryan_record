/* Ryan Record: evidence-based review. Runs locally in the browser; no I/O. */
(function (root) {
  "use strict";
  const VERSION = "v32-record-evidence@1";
  const AREAS = {
    overall: { label:"전반 분석", start:"어떤 수업·관찰에서 어떤 질문이나 문제가 생겼는지", method:"학생이 선택한 기준·자료·방법", depth:"결과를 통해 무엇을 판단했고 그 근거가 무엇인지" },
    autonomy: { label:"자율활동", start:"학급이나 학교에서 어떤 필요를 발견했는지", method:"학생이 맡은 역할과 직접 제안하거나 조정한 방법", depth:"학생의 조치 뒤 학급 운영이나 구성원 참여가 어떻게 달라졌는지" },
    career: { label:"진로활동", start:"어떤 진로 질문이 생겼는지", method:"비교·체험·탐구에서 학생이 확인한 자료나 판단 기준", depth:"확인한 사실을 바탕으로 관심 분야나 진로 판단이 어떻게 구체화됐는지" },
    club: { label:"동아리활동", start:"동아리에서 해결하려던 질문이나 과제", method:"팀 결과와 구분되는 학생의 역할·방법·기여", depth:"학생의 기여나 피드백이 산출물 또는 다음 실행에 어떤 영향을 주었는지" },
    subject: { label:"교과 세특", start:"수업의 어떤 개념에서 질문이 생겼는지", method:"선택 교과의 개념을 적용한 대상·기준·수행 방법", depth:"교과 개념으로 관찰한 결과를 어떻게 설명하거나 판단했는지" },
    behavior: { label:"행동특성", start:"어떤 어려움이나 필요를 교사가 관찰했는지", method:"그때 학생이 직접 한 행동이나 상대와 소통한 방법", depth:"상대의 반응, 공동체 변화, 이어진 실천 중 관찰된 모습" }
  };
  const WRITING = {
    overall: {reason:"같은 활동에서 관찰한 결과를 행동과 연결하면 무엇이 달라졌는지 확인할 수 있습니다.",question:"어떤 기준이나 조건으로 무엇을 비교했고, 그 결과 어떤 차이를 직접 확인했나요?",pattern:"[활동 대상]을 [기준]으로 비교해 [직접 확인한 차이]를 정리함."},
    autonomy: {reason:"직책보다 학생이 발견한 문제와 제안이 학급 운영에 미친 영향이 근거가 됩니다.",question:"어떤 불편이 있었고, 학생이 누구의 의견을 듣거나 어떤 절차를 바꾼 뒤 무엇을 관찰했나요?",pattern:"[학급의 필요]를 확인하고 [학생이 제안한 절차]를 적용함. 이후 [관찰된 반응이나 운영 변화]를 확인함."},
    career: {reason:"체험이나 발표의 제목만으로는 탐색을 통해 판단이 어떻게 바뀌었는지 확인하기 어렵습니다.",question:"어떤 자료나 실제 경험을 바탕으로 진로 대안을 비교했고, 그 뒤 관심 분야나 선택 기준이 어떻게 달라졌나요?",pattern:"[비교한 자료나 경험]을 [비교 기준]에 따라 살펴보고 [진로에 대한 판단이나 달라진 선택 기준]을 정리함."},
    club: {reason:"모둠이 낸 성과와 학생이 맡아 완성한 부분을 분리하면 협업 속 기여가 선명해집니다.",question:"학생이 맡은 부분은 무엇이며, 팀원의 의견이나 실제 사용자의 반응을 받아 어떤 선택을 했나요?",pattern:"모둠에서 [학생이 맡은 부분]을 담당해 [직접 한 일]을 함. [받은 의견]을 반영해 [실제로 바꾼 부분]을 수정함."},
    subject: {reason:"수업 개념이 실제 수행의 기준이 되어야 과목과 활동의 연결이 드러납니다.",question:"수업의 어떤 개념을 어느 자료에 적용했고, 그 근거가 해석이나 결론을 어떻게 뒷받침하나요?",pattern:"[수업 개념]을 [분석 대상]에 적용해 [직접 확인한 근거]를 찾고 [결과의 해석]을 설명함."},
    behavior: {reason:"추상적인 평가어보다 교사가 관찰한 행동과 상대의 반응이 학생의 태도를 잘 보여 줍니다.",question:"어떤 상황에서 학생이 누구에게 어떻게 도움을 주었고, 상대의 반응이나 비슷한 상황에서 이어진 실천은 무엇이었나요?",pattern:"[관찰된 상황]에서 [구체적인 행동]을 함. 이후 [관찰된 반응 또는 실제로 이어진 행동]을 보임."}
  };
  const SUBJECT_WRITING = [
    [/^(?:korean|국어|문학|독서|화법|언어와\s*매체)$/i,{reason:"작품이나 글의 주제를 소개하는 것보다 장면, 대사, 서술 또는 표현이 해석을 지지하는 방식이 중요합니다.",question:"어느 장면, 대사 또는 표현을 근거로 어떤 해석을 했나요? 다른 해석도 가능했다면 무엇으로 구분했나요?",pattern:"[장면이나 표현]을 [교과 개념]으로 읽고, [구체 근거]에서 [해석]을 도출함."}],
    [/^(?:english|영어|japanese|chinese|german|french|spanish|russian|arabic|vietnamese)$/i,{reason:"영어 등 외국어를 사용했다는 사실보다 원문의 표현을 해석하거나 독자에 맞게 표현을 선택한 과정이 근거가 됩니다.",question:"어떤 표현이나 구문을 비교했나요? 의미 차이를 확인하고 번역, 글쓰기, 발표에 어떻게 반영했나요?",pattern:"[원문의 표현]과 [다른 표현]을 [의미나 쓰임]으로 비교하고, [그 차이]를 [번역, 글쓰기 또는 발표]에 반영함."}],
    [/^(?:math|수학|대수|기하|미적분|확률과\s*통계)$/i,{reason:"다른 풀이, 반례, 단위 환산과 조건 점검도 수학에서 검증 근거가 됩니다.",question:"풀이에 필요한 가정은 무엇이었나요? 다른 풀이, 반례 또는 단위 확인으로 결론이 성립하는 범위를 확인했나요?",pattern:"[가정이나 단위]를 정해 [개념과 풀이 방법]을 적용하고 [다른 풀이, 반례 또는 조건]으로 [결론의 범위]를 확인함."}],
    [/^(?:history|한국사|세계사|역사|social|사회|ethics|윤리)$/i,{reason:"자료의 결론을 요약하는 데서 나아가 출처, 관점, 조사 조건의 차이가 판단에 미친 영향을 보여 줄 수 있습니다.",question:"어떤 출처나 관점을 어떤 기준으로 대조했나요? 자료가 뒷받침하는 결론과 아직 확인할 수 없는 부분은 무엇인가요?",pattern:"[두 자료나 관점]의 [출처나 비교 기준]을 대조해 [근거로 설명할 수 있는 해석]을 정리함."}],
    [/^(?:science|과학|물리|화학|생명|지구과학|정보|information)$/i,{reason:"실험이나 구현의 제목보다 비교 조건과 관찰값, 결과에 영향을 준 조건을 분리해서 쓰면 수행을 확인하기 쉽습니다.",question:"무엇을 바꾸고 무엇을 같게 두었나요? 측정값, 오류 또는 실행 결과에서 무엇을 확인했나요?",pattern:"[같게 유지한 조건]에서 [비교하거나 바꾼 조건]을 달리해 [관찰값이나 실행 결과]를 확인함."}]
  ];
  const NEXT_DETAIL = {
    start:{reason:"활동의 이름만으로는 학생이 해결하려던 질문이나 문제를 알기 어렵습니다.",question:"수업 내용, 자료 또는 관찰에서 무엇이 예상과 달랐나요?"},
    action:{reason:"구체적인 역할과 선택 기준이 있으면 참여 사실과 학생의 실제 수행을 구분할 수 있습니다.",question:"학생이 직접 선택한 대상, 자료, 기준, 절차는 각각 무엇인가요?"},
    result:{reason:"결과물 이름, 출처의 결론, 앞으로의 계획은 학생이 실제로 확인한 결과와 구분해야 합니다.",question:"같은 활동에서 관찰하거나 만든 결과는 무엇인가요? 수치가 없다면 관찰 가능한 차이, 산출물의 내용 또는 상대의 반응을 확인하세요."},
    depth:{reason:"학생이 어떤 근거로 해석하거나 판단을 바꾸었는지 밝혀야 배운 점을 확인할 수 있습니다.",question:"어떤 결과가 기존 판단을 뒷받침하거나 바꾸었나요? 실제로 후속 활동을 했다면 전후 차이는 무엇인가요?"},
    course:{reason:"교과명만 적으면 교과에서 배운 개념을 활동에 적용했는지 알기 어렵습니다.",question:"교과 개념을 어느 자료나 과제에 적용했고, 어떤 수행 또는 결론에 도움이 되었나요?"},
    role:{reason:"모둠 성과를 개인 성과로 옮기면 학생이 한 일을 확인하기 어렵습니다.",question:"모둠에서 학생이 맡아 작성, 수정, 설명하거나 합의한 부분을 구분할 수 있나요?"}
  };
  const NULL_FINDING = /(?:차이(?:가|는)?\s*(?:없|나타나지\s*않|확인되지\s*않)|가설.{0,20}(?:지지되지\s*않|기각|반박|맞지\s*않)|상관(?:관계)?(?:가|는)?\s*(?:없|나타나지\s*않)|(?:예상|예측)(?:과|이)?\s*(?:달랐|일치하지\s*않))/;
  const GROUP = /학급|학년|모둠|팀|조원|팀원|동아리|친구|후배|학생회|구성원|급우|공동체|회의/;
  const ACTION = /질문|관찰|측정|비교|대조|분석|검토|검증|분류|표시|정리|수집|조사|인터뷰|면담|설문|계산|설계|선정|제작|작성|발표|공유|설명|해석|도출|적용|실험|구현|제안|조정|중재|협의|안내|기록|수정|보완|고쳐|바꾸|바꿔|나누|묻|물어|물었|경청|지원|돕|도와|도왔|함께\s*연습|다시\s*확인|읽|연결|표로\s*만|연습|참여|역할.{0,9}맡|지도|되짚|재구성/;
  const DONE = /(?:함|했|하였|하고|하여|해|한(?:\s|$)|하며|할\s*때|만듦|남김|읽(?:음|고|어)|바꿔|바꿈|바꾸어|고쳐|나눔|나누어|나눠|물어|물음|도와|도움|도왔|맡음|밝힘|적음|줄임|늘림|줄어|늘어|나타남|됐|됨|갖춤|보였|이끌|들어주|되짚)/;
  const PLAN = /하고자|해\s*보고자|하려(?:고|는)\s*(?:계획|예정|의지)|할\s*(?:계획|예정|것임)|계획(?:만|을\s*세|임|했|함|하였)|예정(?:임|이다|이었)|다짐|계획\s*중/;
  const NEG = /하지\s*못(?:함|했|하였|하고|해)|못했|못하였|미실시|미완료|수행하지\s*않|실행하지\s*않|확인하지\s*않|확인되지\s*않|완성하지\s*않|실시하지\s*않|작성하지\s*않|측정하지\s*않|결과(?:가|는|를)?\s*(?:없|얻지\s*못)|확인할\s*수\s*없/;
  const SOURCE_ACTOR = /(?:^|[\s“"‘'(])(?:논문|기사|연구|공식\s*자료|자료|책|도서|보고서|연구진|저자|전문가|학자)(?:에서(?:는|도)?|에\s*따르면|은|는|이|가)(?=\s)/;
  const OTHER_ACTOR = /(?:^|\s)(?:교사|선생님|담임|모둠|팀|친구|팀원|조원|동아리원|부원|상대|급우|후배)(?:이|가|은|는)(?=\s)/;
  const EXPLICIT_STUDENT = /(?:^|\s)(?:학생|본인|자신|본\s*학생)(?:은|는|이|가)(?=\s)/;
  const STUDENT_RETURN = /(?:스스로|직접|자발적으로|본인이|자신이|본인(?:은|도)|학생(?:은|이))(?=\s)/;
  const OBSERVED = /(?:참여|발언|사용|실행|채택|공유|제출|발표|수행|발송|반영)(?:함|했|하였|하여|하고|됨|되었|하게\s*됨)|(?:증가|감소|줄어|줄고|늘어|늘고|늘었|낮아|높아|달라|개선|완화|해결|유지|완료|완성|멈추|다시\s*참여|응답|의견을\s*냄|답변을\s*함)/;
  const METHOD = /비교|대조|분석|검증|측정|분류|선정|실험|관찰|설문|면담|인터뷰|계산|설계|제작|작성|적용|조정|중재|안내|재구성|확인\s*절차|조건|기준|표시|설명|공유|역할.{0,9}나누|의견.{0,9}(?:묻|물어|물음)|도와|돕|도움|기록|바꿔|고쳐|수정|보완/;
  const RESULT = /(?:확인|발견|도출|밝힘|증명|설명|판단|파악|드러|나타|줄어|줄었|늘어|늘었|높아|낮아|증가|감소|달라|완성|제작|작성|공유|발표|개선|해결|반영|유지|참여|응답|채택|선택|완료|정리|기록|만듦|정함|남김)/;
  const INSIGHT = /(?:원인|이유|한계|관계|경향|차이|효과|의미|근거|조건|영향|오차|반례|특징|범위|관점|역할|판단\s*기준|필요성|타당성|적절성).{0,42}(?:설명|해석|판단|도출|지적|밝힘|파악|분석|확인|제시|정리|구분)|(?:이를\s*(?:바탕으로|통해|토대로)|때문이라고|근거로).{3,52}(?:해석|설명|판단|제시|도출|확인|구분)|(?:관점을\s*바꾸|진로\s*선택의\s*기준|일반화.{0,14}(?:어렵|제한))/;
  const TRIGGER = /궁금|의문|질문|어려움|필요(?:를|성|한\s*상황)|불편|갈등|문제(?:가|를|점|로)|맡아|계기로|예상과\s*달|차이를\s*발견|동기|참여하지\s*못|발언이\s*적/;
  const SOURCE = /(?:책|원문|교과서|도서|기사|사료|자료|통계|보고서|공개\s*데이터).{0,26}(?:읽|참고|찾|수집|대조|비교|적용|분석|검토)/;
  const LIMIT = /한계|오류|오차|반례|제약|불일치|표본.{0,10}(?:적|좁|치우)|예상과\s*달|부족|재작업|누락/;
  const CHANGE = /수정|보완|바꾸|바꿔|고쳐|재구성|조정|변경|통제|통일|조건을\s*맞/;
  const RERUN = /(?:재(?:실험|분석|측정|계산|적용|실행|검증|비교)|다시\s*(?:실험|분석|측정|계산|비교|적용|실행|검증|확인)|전후.{0,12}(?:비교|대조))/;
  const FOLLOW = /(?:다음\s*(?:(?:학급|모둠|동아리)\s*)?(?:회의|수업|활동|과제|토론|실험)|후속\s*(?:활동|과제|탐구)|다른\s*(?:모둠|자료|상황|사례|학급)|이후|반복|지속|매번|여러\s*차례|꾸준히)/;
  const BOUNDARY = /^(?:한편|별개(?:의|로)?|별도의|별도로|또\s*다른|다른\s*(?:수업|과목|활동|과제|영역)에서는?|각각의\s*활동에서는?)/;
  const TRANSITION = /^(?:그\s*결과|이를\s*(?:바탕으로|통해|토대로)|이에|이후|따라서|이어서|또한|이때|다만|반면|그러나|한편|다음\s*(?:회의|수업|활동|과제)|별도로|별개의)/;
  const PRAISE = /우수|탁월|돋보|훌륭|모범|성실|적극|역량|뛰어나|인상적|열심히|기대됨/;
  const GENERIC = /(?:^|\s)(?:다양한|여러|관련|구체적인|유의미한|의미\s*있는|좋은|긍정적인|탐구|분석|비교|방법|내용|결과|활동|자료|성과|과정|학생|스스로|직접|적극적으로|성실하게|성공적으로|역량|열심히|주도적으로|질문|문제|각종|참여|완성|개선|역할|수행|사용|진행|문항|의견|차이|도출|확인|조사|실험|설계|측정|제작|발표|작성|정리|검증|분류|계산|적용|협력)(?:에서|에게|으로|부터|까지|하며|하여|하고|하였|했|한|해|함|이|가|을|를|에|의|은|는|도|로|와|과|만|임)*(?=\s|[,.!?]|$)/g;
  const MEASURE = /(?:\d+(?:[.,]\d+)?\s*(?:%|％|명|개|건|회|초|분|시간|점|배|mm|cm|mL|kg|mol|도|㎖|℃)|(?:pH|R²)\s*[=:]?\s*\d)/i;
  const DETAIL = /(?:조건|기준|항목|비율|평균|표본|빈도|오차|변인|전후|그래프|도표|체크리스트|설문지|공유표|일정표|표로|분류표|기록표|안내문|발표문|역할표|비교표|보고서|산출물|원문|사료|문항|코드|모형|장면|근거|서술\s*방식)/;
  const GENERIC_OUTCOME = /(?:결과(?:를|가)?\s*(?:도출|확인|정리)|차이(?:를|가)?\s*(?:확인|발견)|성과(?:를|가)?\s*(?:이룸|거둠|냄)|보고서(?:를|가)?\s*(?:작성|완성)|결과물(?:을|이)?\s*(?:제작|완성)|개선함)\s*[.!?。]?\s*$/;
  const QUOTE = /“[^”]*”|‘[^’]*’|「[^」]*」|『[^』]*』|《[^》]*》|(?<![A-Za-z0-9])"[^"\n]*"|(?<![A-Za-z0-9])'[^'\n]*'/g;
  const SENTENCE_BREAK = /[.!?。！？](?:[”’」』"')\]])*(?=\s|$)|\r?\n|(?<=[가-힣](?:함|됨|임|였음|했음))\s+(?=(?:그\s*결과|이를\s*(?:바탕으로|통해)|이후|한편|다음\s*(?:회의|활동|수업)|또\s*다른|별도로)\s)/gu;
  const CLAUSE_BREAK = /[;；]|[,，](?=\s|그\s*결과|이후|이를)|\s+(?=(?:그\s*결과|이를\s*(?:바탕으로|통해|토대로)|그러나|한편|다만|별도로|별개의|별도의)\s)|(?<=(?:했으나|하였으나|했지만|하였지만|않았으나|못했으나|못했지만))\s+|(?<=(?:하였고|했으며|하였으며|했으며|하였으나|했으나|하였지만|했지만|했고|함))\s+(?=(?:학생|본인|교사|담임|친구|팀원|조원|모둠|팀)(?:은|는|이|가)\s)/gu;
  const ABBREV = /(?:\b[A-Za-z]|\b(?:vs|etc|Mr|Ms|Dr|Fig|No)|\b(?:[A-Za-z]\.){1,3}[A-Za-z])\.$/i;
  const HEADING = /^(?:[\u2022▪◆#*\s-]*)(?:(?:\[\s*([^\]\r\n]{1,26})\s*\]|【\s*([^】\r\n]{1,26})\s*】)|((?:(?:제?\s*\d+\s*(?:차|번째)|[가나다라]\s*[.)])\s*)?(?:자율(?:활동)?|진로(?:활동)?|동아리(?:활동)?|교과\s*세특|교과별\s*세부능력\s*및\s*특기사항|행동특성(?:\s*및\s*종합의견)?|(?:활동|사례|장면|과제)\s*\d+))\s*[:：])/;
  const HEADING_LABEL = /자율|진로|동아리|세특|세부능력|행동특성|종합의견|활동|사례|장면|과제|수업|단원/;
  const PASTE_BREAK = /^(?:[-*•▪◆◦‣]\s|\d{1,2}[.)]\s|[①-⑳]\s?|[가나다라][.)]\s|(?:\[[^\]]{1,35}\]|【[^】]{1,35}】)|(?:자율활동|진로활동|동아리활동|교과\s*세특|행동특성|종합의견)\s*[:：])/;
  const WRAP_TOKENS = new Set(("시각화 흡수량 탐구활동 구성원 결과물 교육과정 실험조건 실험결과 측정값 측정기기 공공데이터 온실가스 이산화탄소 산림면적 기후변화 지구온난화 시뮬레이션 프로그램 고등학교 교과서 보고서 비교표 분류표 안내문 논설문 자료집 재검증 재측정 재실험 재분석 미세먼지 시간대 기상자료 인공지능 수학적 통계적 환경공학 활용하여 변화함 변함 발견하여 확인하여 측정하여 계산하여 분석하여 비교하여 관찰하여 설명하여 정리하여 설계하여 작성하여 활용함 활용하는 작용함 작용함을 시사함 파악하고 기록하고 자치구 자치구별 지역별 흡수량의 흡수량도").split(" "));
  const WRAP_END = /(?:함|됨|임|했음|였음|않음|없음)[.!?。！？]?$|[.!?。！？:：;；]$/;
  const WRAP_LINK = /^(?:그리고|그러나|하지만|한편|이후|또한|따라서|반면|특히|그 결과|이를|의견을|연구 과정에서)\s/;
  const WRAP_PARTICLE = /^(?:하고|하는|하며|하여|했던|하였|했으며|한|할|한가|됨|되는|되어|함을|함으로|함|처럼|과|와|에서|의|이|가|은|는|을|를|으로|로|도|이나|에|에게|까지|부터|만|며|으며|고|였)[가-힣]*(?:\s|[,.!?。！？]|$)/;
  const WRAP_STANDALONE = /^(?:수|좀|더|각|두|세|첫|그|이|또|한|및|등|중|뒤|전|후|앞|내|간|왜|잘|새|곧|못|안|늘|모든|이런|관련|해당|학생|내용|분석|비교|탐구|기록|공동체|과정|자료|문제|결과|활동|조건|산림|탄소|흡수|관찰|방식|기준|문장|차이|변화|의미|원인|사례|정리|시각)$/;
  const ROLE_DEPENDENT = /(?:말|설명|자료|기록|결과|수치|의견|방식|이야기|사례|과정|장면|상황|때|모습|내용)(?:을|를|이|가|에|로|으로|에서|처럼|과|와|도|만)?(?:\s|$)/;
  const BORROWED_WRAP = /(?:했다고|하였다고|했다는|하였다는|확인했다는|밝혔다고|발표했다는|나타났다고).{0,26}(?:적혀|쓰여|제시|듣|들었|읽|인용|옮겨|요약|소개)/;
  const WATCHED = /(?:결과|장면|모습|설명|발표|시범)(?:을|를)?\s*(?:보고|보며|보았|듣고|들으며|들었|읽고|읽으며|인용|관찰만)/;
  const COMMUNITY_ACTION = /의견|역할|도움|돕|도와|경청|안내|제안|조정|중재|협의|공유|분담|알려|먼저\s*말|연습|참여.{0,8}이끌|맡아/;
  const REASON_ACTION = /(?:비교|대조|분석|분류|계산|해석|검증|추론|논증|평가|관찰|측정|설명|재구성|설계|적용)/;
  const EXCLUDED = /(?:수상|장학금|지원\s*대학|합격|내신|석차|등급|수능|모의고사)/;
  const textOf = value => String(value == null ? "" : value);
  const normalize = value => value.normalize("NFC").replace(/\s+/g," ").trim();
  const has = (rx,text) => rx.test(text);
  const escape = value => textOf(value).replace(/[&<>"']/g,ch => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" })[ch]);
  const keyHighlight = value => '<mark class="review-key-highlight">'+escape(value)+'</mark>';
  function highlightSlots(value) {
    let html = "", cursor = 0;
    for (const part of value.matchAll(/\[[^\]\r\n]+\]/g)) {
      html += escape(value.slice(cursor,part.index))+keyHighlight(part[0]);
      cursor = part.index+part[0].length;
    }
    return html+escape(value.slice(cursor));
  }

  function cleanPastedText(value) {
    // Copy from PDF/HWP often contains formatting-only breaks and spaces.
    // No spelling correction is applied to ordinary paragraphs or numbered lists.
    const source = textOf(value).replace(/\r\n?|\u2028/g,"\n").replace(/\u2029/g,"\n\n")
      .replace(/\u00ad[ \t]*\n[ \t]*/g,"").replace(/[\u00ad\u200b\u2060\ufeff]/g,"")
      .replace(/[\t\u00a0\u1680\u2000-\u200a\u202f\u205f\u3000]/g," ");
    const lineWidth = s => [...s].reduce((n,c) => n+(/[가-힣\u1100-\u11ff\u2e80-\u9fff]/.test(c) ? 2 : 1),0);
    const cleanLine = line => line.replace(/ {2,}/g," ").trim();
    function join(left,right) {
      const a = left.match(/[가-힣]+$/)?.[0] || "";
      const b = right.match(/^[가-힣]+/)?.[0] || "";
      const merged = a+b;
      const known = a && b && [...WRAP_TOKENS].some(word => word.length > a.length && merged.startsWith(word));
      if (known || /\d[.,]$/.test(left) && /^\d/.test(right) || /^[,.;!?。！？%)\]”’]/.test(right)) return "";
      if (!a || !b || WRAP_LINK.test(right) || WRAP_END.test(left)) return " ";
      if (WRAP_PARTICLE.test(right) && !WRAP_STANDALONE.test(b) && (/^[가-힣]{1,3}$/.test(a) || /^(?:함을|되는|하여|하고|하는|하였|했으며)/.test(b))) return "";
      if (a.length <= 2 && b.length >= 2 && !WRAP_STANDALONE.test(a)
        && !/(?:으로|에서|에게|부터|까지|하고|하며|하면|보다)$/.test(a)
        && !/^(?:그|이|저|한|더|몇|각|각각|다른|같은|여러|모든|해당|관련|새로운|매우|통해|위해|경우|방법|사례)$/.test(b)) return "";
      return " ";
    }
    function reflow(lines) {
      if (lines.length < 2) return lines.join("\n");
      const widths = lines.map(lineWidth);
      const regular = widths.slice(0,-1).sort((a,b) => a-b);
      const typical = regular[Math.floor(regular.length/2)];
      const packed = regular.filter(width => Math.abs(width-typical) <= Math.max(7,typical*.13)).length;
      const apparentWrap = typical >= 36 && packed >= Math.ceil(regular.length*.75) && widths.at(-1) <= typical*1.16
        && (lines.length >= 3 || (!WRAP_END.test(lines[0]) && (widths[1] < widths[0] || lineWidth(lines[0]) >= 60)));
      if (!apparentWrap) return lines.join("\n");
      return lines.slice(1).reduce((out,right,i) => out+join(lines[i],right)+right,lines[0]);
    }
    return source.split(/\n[ ]*\n(?:[ ]*\n)*/).map(block => {
      const groups = [];
      for (const line of block.split("\n").map(cleanLine).filter(Boolean)) {
        if (!groups.length || PASTE_BREAK.test(line)) groups.push([]);
        groups.at(-1).push(line);
      }
      return groups.map(reflow).join("\n");
    }).filter(Boolean).join("\n\n");
  }

  function bindPaste(field) {
    field?.addEventListener("paste",event => {
      const value = event.clipboardData?.getData("text/plain");
      if (value == null || value === "") return;
      const cleaned = cleanPastedText(value);
      if (cleaned === value) return;
      event.preventDefault();
      field.setRangeText(cleaned,field.selectionStart,field.selectionEnd,"end");
      field.dispatchEvent(new Event("input",{bubbles:true}));
    });
  }

  function spans(input, pattern, start = 0, sentence = false, probe = input) {
    const out = [];
    const matches = new RegExp(pattern.source, pattern.flags);
    let at = 0;
    function push(left,right) {
      const raw = input.slice(left,right);
      const trim = raw.trim();
      if (!trim) return;
      const leading = raw.length - raw.trimStart().length;
      out.push({ span:trim, start:start+left+leading, end:start+left+leading+trim.length });
    }
    for (const match of probe.matchAll(matches)) {
      const pos = match.index;
      const stop = pos + match[0].length;
      if (sentence && match[0].startsWith(".") && ABBREV.test(input.slice(Math.max(0,pos-12),pos+1))) continue;
      if (sentence && match[0] === "." && /(?:^|\n)\s*(?:[•▪◆*-]\s*)?\d{1,2}\.$/.test(input.slice(Math.max(0,pos-9),pos+1))) continue;
      const punctuation = sentence && /^[.!?。！？]/.test(match[0]);
      push(at,punctuation ? stop : pos);
      at = stop;
    }
    push(at,input.length);
    return out;
  }

  function contentTokens(text) {
    return text.replace(GENERIC," ").match(/[가-힣]{2,}|[A-Za-z]{3,}|\d+(?:[.,]\d+)?/g) || [];
  }

  const blankQuoted = value => value.replace(/[^\r\n]/g," ");
  function scanQuotes(text) {
    const quoted = [...text.matchAll(QUOTE)];
    const allMasked = text.replace(QUOTE,match => match.replace(/[^\r\n]/g,"~"));
    const evidenceSafe = text.replace(QUOTE,match => /[.!?。！？]|(?:측정|작성|분석|제작|실험|확인|발견|비교|발표|감소|증가|완성|개선)(?:함|했|하였|하는|한|된|됨)|[0-9]+\s*[%％]/.test(match)
      ? blankQuoted(match) : match);
    return {allMasked,evidenceSafe,masked:quoted.length > 0 && evidenceSafe !== text};
  }

  function actors(text,index,prior) {
    const matchOf = (rx,kind) => {
      const match = rx.exec(text);
      return match ? {kind,at:match.index,end:match.index+match[0].length} : null;
    };
    const candidates = [
      matchOf(SOURCE_ACTOR,"source"),matchOf(OTHER_ACTOR,"peer"),matchOf(EXPLICIT_STUDENT,"student")
    ].filter(Boolean).sort((a,b) => a.at-b.at);
    const subject = candidates[0];
    const returnMatch = STUDENT_RETURN.exec(text);
    if (subject?.kind === "student") {
      // The whitespace preceding the primary subject may be part of the matched token.
      const embedded = matchOf(SOURCE_ACTOR,"source") || matchOf(OTHER_ACTOR,"peer");
      if (embedded && !(returnMatch && returnMatch.index > embedded.at) && (BORROWED_WRAP.test(text) || WATCHED.test(text))
        && !/(?:활용|이용|바탕으로|토대로|근거로).{0,35}(?:계산|검증|비교|분석|측정|제작|해석)/.test(text)) return embedded.kind;
      return "student";
    }
    if (subject && subject.kind !== "student") {
      if (candidates.some(item => item.kind === "student" && item.at > subject.at)) return "student";
      const remainder = text.slice(subject.end,subject.end+72);
      if (subject.kind === "peer" && /(?:상황|장면|때)(?:에서|에|는)?\s/.test(remainder)) return "student";
      // "교사가 측정한 값을 바탕으로 직접 계산함": source input and student work are distinct.
      if (returnMatch && returnMatch.index > subject.at && ROLE_DEPENDENT.test(remainder)
        && /활용|이용|바탕|토대로|근거로|대조|기준으로|받아|이어/.test(remainder)) return "student";
      return subject.kind;
    }
    if (returnMatch) return "student";
    if (prior?.actor === "source" && (prior.index === index || TRANSITION.test(text))) return "source";
    if (prior?.actor === "peer" && prior.index === index) return "peer";
    return "student";
  }

  function scan(input, comparison = false) {
    const quotes = scanQuotes(input);
    const sentences = spans(input,SENTENCE_BREAK,0,true,quotes.allMasked);
    const frames = [];
    const groups = [];
    let group = null;
    let prior = null;
    for (const [index,sentence] of sentences.entries()) {
      const label = HEADING.exec(sentence.span);
      const heading = label && HEADING_LABEL.test(label[1] || label[2] || label[3] || "");
      if (heading) { group = null; prior = null; }
      const skip = heading ? label[0].length : 0;
      for (const span of spans(sentence.span.slice(skip),CLAUSE_BREAK,sentence.start+skip,false,quotes.allMasked.slice(sentence.start+skip,sentence.end))) {
        const text = normalize(quotes.evidenceSafe.slice(span.start,span.end));
        if (!text) continue;
        if (!group || BOUNDARY.test(text)) {
          group = [];
          groups.push(group);
          prior = null;
        }
        const actor = actors(text,index,prior);
        const purpose = /하고자\s+(.{5,})/.exec(text)?.[1];
        const plan = PLAN.test(text) && !(purpose && /(?:함|하였음|했음|됨|밝힘)[.!?。！？]?$/.test(purpose) && ACTION.test(purpose) && !PLAN.test(purpose));
        const validNull = NULL_FINDING.test(text) && (/측정|비교|분석|검증|실험|관찰|조사|조건|표본/.test(text) || Boolean(prior?.method))
          && /확인|판단|결과|나타나|정리|해석|기각/.test(text)
          && !/(?:실험|비교|분석|측정|조사|수행)(?:을|를)?\s*(?:하지\s*않|하지\s*못|못했|미실시)/.test(text);
        const neg = NEG.test(text) && !validNull;
        const forbiddenOnly = EXCLUDED.test(text) && !METHOD.test(text.replace(EXCLUDED,""));
        const borrowed = BORROWED_WRAP.test(text) && !/직접.{0,28}(?:비교|계산|작성|측정|분석|제작|해석|검증)/.test(text);
        const done = !plan && !neg && !forbiddenOnly && !borrowed && DONE.test(text);
        const action = done && actor === "student" && ACTION.test(text);
        const tokens = contentTokens(text);
        const specificity = tokens.length >= 2 || DETAIL.test(text) || MEASURE.test(text);
        const concreteAction = action && (METHOD.test(text) || SOURCE.test(text) || COMMUNITY_ACTION.test(text)) && specificity;
        const starts = TRIGGER.test(text);
        const method = concreteAction && (METHOD.test(text) || COMMUNITY_ACTION.test(text));
        const artifact = /(?:보고서|제안서|발표문|발표\s*자료|안내문|비교표|요약표|결과표|집계표|일정표|기록표|표로|그래프로|분류표|역할표|산출물|영상|장치|모형|지도|코드|프로그램|체크리스트|설문지|카드뉴스|공유표|자료집)/.test(text)
          && /제작|작성|구현|정리|완성|만들|만듦|공유|발표/.test(text) && tokens.length >= 3;
        const observation = MEASURE.test(text) || artifact || validNull
          || (comparison && /(?:증가|감소|줄어|늘어|늘었|낮아|높아|달라|완화|개선|유지).{0,22}(?:사례|관계|경향|조건|모습|반응).{0,16}(?:발견|확인|관찰|정리|파악)|(?:사례|관계|경향|조건).{0,22}(?:발견|확인|관찰|파악)/.test(text) && tokens.length >= 4)
          || (RERUN.test(text) && /(?:줄어든|줄었|늘어난|늘었|높아진|낮아진|달라진|일치|개선|편차|오차).{0,20}(?:결과|표에|표시|확인|기록)/.test(text))
          || (RESULT.test(text) && /(?:[다는]고\s*(?:확인|판단|설명)|(?:[다는]는|[었였]다는|았다는)\s*(?:점|것|사실)|(?:높|낮|많|적|줄|늘|달라|차이|같|비슷|유지|달성).{0,22}(?:확인|발견|나타|보였|설명|파악)|(?:나타남|밝힘|완성함|개선됨|반영됨|해결함))/.test(text) && tokens.length >= 2);
        const ownResult = done && actor === "student" && observation && (RESULT.test(text) || validNull)
          && (!GENERIC_OUTCOME.test(text) || artifact || MEASURE.test(text) || DETAIL.test(text) && tokens.length >= 4);
        const peerOutcome = actor !== "source" && OBSERVED.test(text) && specificity && !plan && !neg
          && (actor === "peer" || /참여|발언|응답|반응|운영|누락|혼선|이견|구성원|모둠|학급|회의|분담/.test(text))
          && !/적극적으로\s*참여함|성실하게\s*참여함/.test(text);
        const interpretation = done && actor === "student" && specificity && INSIGHT.test(text) && (REASON_ACTION.test(text) || /근거|판단|때문/.test(text));
        const item = { ...span,index,text,actor,plan,neg,borrowed,validNull,done,action,method,ownResult,peerOutcome,interpretation,specificity,
          starts,source:action && SOURCE.test(text),groupContext:GROUP.test(text),community:action && COMMUNITY_ACTION.test(text),
          limit:LIMIT.test(text) && actor === "student" && !plan && !neg,
          change:action && CHANGE.test(text), rerun:action && RERUN.test(text),
          follow:action && FOLLOW.test(text),link:TRANSITION.test(text),artifact, tokens:tokens.length };
        group.push(item); frames.push(item); prior = item;
      }
    }
    return {frames,groups,quotes};
  }

  function route(group, communityMode) {
    let best = null;
    for (const [i, action] of group.entries()) {
      if (!(communityMode ? action.community && action.specificity : action.method)) continue;
      const nearby = group.slice(Math.max(0,i-2),i+3);
      const end = group.slice(i,i+3).find(f => communityMode ? f.peerOutcome && (f !== action || f.ownResult || /(?:줄어|줄고|늘어|늘고|달라|반영|참여하게|발언하게|참여율)/.test(f.text)) : f.ownResult);
      const start = nearby.slice(0,nearby.indexOf(action)+1).find(f => f.actor === "student" && (f.starts || f.source || (communityMode && f.groupContext)));
      if (communityMode && !nearby.some(f => f.groupContext)) continue;
      const resultIndex = end ? group.indexOf(end) : i;
      const tail = group.slice(resultIndex,resultIndex+5);
      const judgment = end && tail.find(f => f.interpretation);
      const limitIndex = end ? tail.findIndex(f => f.limit) : -1;
      const changeIndex = limitIndex >= 0 ? tail.findIndex((f,j) => j >= limitIndex && f.change) : -1;
      const rechecked = changeIndex >= 0 && tail.find((f,j) => j >= changeIndex && f.rerun && (f.ownResult || tail[j+1]?.ownResult));
      const follow = end && tail.find((f,j) => j > 0 && f.follow && (communityMode ? f.peerOutcome || tail[j+1]?.peerOutcome : f.ownResult || tail[j+1]?.ownResult));
      const depth = Boolean(judgment || rechecked || follow);
      const score = (end ? 6 : 0)+(start ? 2 : 0)+(depth ? 4 : 0)+(rechecked || follow ? 1 : 0)+(action.tokens >= 4 ? 1 : 0);
      const candidate = {action,end,start,judgment,rechecked,follow,depth,score,community:communityMode};
      if (!best || candidate.score > best.score) best = candidate;
    }
    return best;
  }

  function scanComparison(value, area) {
    const source = textOf(value);
    const {frames,groups,quotes} = scan(source,true);
    const belongs = frame => frame && !frame.plan && !frame.neg && !frame.borrowed && (frame.actor === "student" || frame.peerOutcome);
    const usable = frames.filter(belongs);
    const best = groups.flatMap(group => [area === "behavior" ? null : route(group,false),route(group,true)])
      .filter(Boolean).sort((a,b) => b.score-a.score)[0];
    const result = best?.end || usable.find(f => f.ownResult) || null;
    const next = best?.rechecked || best?.follow || null;
    const method = best?.action || usable.find(f => f.method) || null;
    const own = frame => frame?.actor === "student" && belongs(frame);
    const learning = usable.find(f => own(f) && f.source) || null;
    const trigger = best?.start || usable.find(f => own(f) && f.starts) || null;
    const interpretation = best?.judgment || (result && usable.find(f => own(f) && f.interpretation && f.start >= result.start && f.index <= result.index + 1)) || null;
    const reflection = usable.find(f => own(f) && f.limit) || null;
    const sentences = spans(source,SENTENCE_BREAK,0,true,quotes.allMasked);
    const quoteResult = result && frames.filter(frame => frame.index === result.index).every(frame => frame.actor === result.actor && !frame.plan && !frame.borrowed)
      ? sentences[result.index]?.span || result.span : result?.span || "";
    return {
      sentences:sentences.map(item => item.span),
      trigger:trigger?.span || "", learning:learning?.span || "", method:method?.span || "", result:quoteResult,
      interpretation:interpretation?.span || "", next:next?.span || "", reflection:reflection?.span || "",
      community:Boolean(best?.community), verifiedResult:Boolean(result)
    };
  }

  function renderComparison(report, raw, doc) {
    const byId = id => doc.getElementById(id);
    const scan = report.scannedEvidence || scanComparison(raw,report.area);
    const summary = byId("duelFitSummary");
    if (summary) summary.textContent = scan.verifiedResult
      ? scan.community ? "학생이 한 행동과 그 뒤의 반응이 기록에 드러납니다."
        : scan.next ? "학생이 직접 확인한 결과와 이를 바탕으로 이어 간 활동이 드러납니다."
          : "학생이 관찰하거나 비교해 얻은 결과가 기록에 드러납니다."
      : scan.method ? "수행 과정은 보이지만 관찰한 결과가 아직 드러나지 않습니다."
        : "활동에 참여했다는 설명만으로는 학생이 맡은 일을 알기 어렵습니다.";
    const quote = byId("duelQuote");
    if (quote) {
      quote.hidden = !scan.result;
      quote.innerHTML = scan.result ? '<strong>확인한 결과</strong><span class="duel-evidence-text">'+keyHighlight(scan.result)+'</span>' : "";
    }
    const note = byId("duelNote");
    const priority = scan.verifiedResult
      ? !scan.interpretation && !scan.next ? "관찰한 차이를 어떤 근거로 해석했는지 덧붙여 주세요."
        : !scan.next ? "그 판단을 다시 확인했거나 다른 활동에 적용했다면 무엇을 했는지 이어 써 주세요." : ""
      : scan.method ? "수행 문장 뒤에 직접 관찰한 차이, 완성한 결과물, 또는 상대의 반응을 적어 주세요."
        : "활동 이름 뒤에 학생이 직접 선택하거나 수행한 일부터 구체적으로 적어 주세요.";
    if (note) {
      note.hidden = !priority;
      note.innerHTML = priority ? '<strong>먼저 보완할 부분</strong><span>'+keyHighlight(priority)+'</span>' : "";
    }
  }

  function evidence(item) {
    if (!item) return null;
    // Output only exact user substrings, at stable offsets; never paraphrase a quote.
    const span = item.span.length <= 170 ? item.span : item.span.slice(0,170).trimEnd();
    return {span,start:item.start,end:item.start+span.length};
  }

  const SAFE_WORDING = new Map([
      ["조사를 진행함","조사함"],["분석을 실시함","분석함"],["탐구를 진행함","탐구함"],
      ["발표를 진행함","발표함"],["실험을 진행함","실험함"],["토론을 진행함","토론함"],
      ["비교를 실시함","비교함"],["관찰을 실시함","관찰함"],
      ["측정을 실시함","측정함"],["자료를 수집하는 활동을 함","자료를 수집함"],
      ["설문 조사를 실시함","설문 조사함"],["내용을 정리하는 활동을 함","내용을 정리함"],
      ["의견을 나누는 활동을 함","의견을 나눔"],["발표를 실시함","발표함"],
      ["기사내용","기사 내용"],["추가조사","추가 조사"]
  ]);
  const WORDING_RX = new RegExp([...SAFE_WORDING.keys()].sort((a,b) => b.length-a.length).join("|"),"g");
  const COMPLETED_VERB = "분석|비교|측정|관찰|조사|수집|분류|검토|검증|실험|제작|작성|발표|공유|기록|정리|설계|적용|계산|확인|설명|파악|도출|발견|조정|제안|안내|수정|보완";
  const SEQUENCE_EDIT = new RegExp("(?:^|\\s)("+COMPLETED_VERB+")(하였으며|했으며|하였고|했고|하였으나|했으나|하였지만|했지만|하며|하고|하지만|하였음|했음|함)[ \\t]*,?[ \\t]+(?=(?:그\\s*결과|이를\\s*(?:바탕으로|통해|토대로)|이후|이어서|이에|따라서|그러나|다만|반면|(?:학생|교사|팀원|모둠|친구|상대)(?:은|는|이|가))\\s)","g");
  const CONTRAST_EDIT = new RegExp("(?:^|\\s)("+COMPLETED_VERB+")(?:하였으나|했으나|하였지만|했지만|하지만),[ \\t]+(?=[가-힣])","g");
  const MERGE_EDIT = /(?:^|\s)((?:[\p{L}\p{N}·-]{1,24}\s+){0,2}(?:비교표|기록표|분류표|발표\s*자료|결과표|보고서|발표문|설문지|안내문|요약표|포스터|표|그래프|모형))를 (작성|제작|정리)함[.。][ \t]+\2한 ([^.\r\n!?。！？]{1,48}?)를[ \t]+(?=[^.\r\n!?。！？]{0,45}(?:발표|제출|공유|게시|설명|배포)(?:함|하였음|했음)(?=[.。!?！？\s]|$))/gu;
  const LABELED_ORDER_EDIT = /^(?:확인한\s*결과|관찰\s*결과|결과)[：:][ \t]+([^\r\n]+)(\r?\n)(?:수행\s*방법|탐구\s*방법|조사\s*방법|방법)[：:][ \t]+([^\r\n]+)/gm;
  const NO_SPLIT_CONTEXT = /(?:않|못|아니|않을|해야|하려|예정|계획|수\s*있|수\s*없|가능|우려|필요|추정|가정|가설|혹은|또는|없이)/;
  const REPORTING_SUFFIX = /(?:다고|라고|다는|라는|하도록).{0,28}(?:설명|진술|기록|언급|주장|보도|작성|가정|제안|발표|답변)(?:함|했|하였|됨|하였음|한|하는)|(?:다고|라는|다는).{0,25}(?:내용|자료|보도|기사).{0,18}(?:읽|듣|옮기|인용|요약)/;
  const OUTSIDE_WRITER = /(?:^|\s)(?:동료|부모|형제|선배|후배|연구자|사서|진행자|멘토|대표|담당자|친구들|조원들|팀원들)(?:은|는|이|가)\s/;
  const GENERIC_LINK = /^(?:학생|본인|활동|방법|과정|결과|수치|기준|자료|정리|설명|사례|의견|관찰|수행|확인|시간|조건|비교|측정|나타나|늘어난|줄어든|도출|검토)$/;
  function sharedSubject(a,b) {
    const content = value => new Set(contentTokens(value)
      .map(word => word.replace(/(?:에서|으로|에게|부터|까지|에는|에도|[의이가은는을를에로와과도만])$/u,""))
      .filter(word => /[A-Za-z가-힣]{2}/.test(word) && !GENERIC_LINK.test(word)));
    const second = content(b);
    return [...content(a)].filter(word => second.has(word)).length >= 2;
  }

  function rewrite(original) {
    const edits = [];
    const patches = [];
    const safeQuotes = [...original.matchAll(QUOTE)].map(match => [match.index,match.index+match[0].length]);
    const add = (at,end,after,reason,type) => {
      if (safeQuotes.some(([start,stop]) => at < stop && end > start)
        || patches.some(item => at < item.stop && end > item.at)) return;
      patches.push({at,stop:end,after,reason,type});
    };
    for (const match of original.matchAll(LABELED_ORDER_EDIT)) {
      const [,finding,line,method] = match;
      if (!ACTION.test(method) || !DONE.test(method) || PLAN.test(method) || NEG.test(method) || !RESULT.test(finding)
        || /^(?:이|그|앞선|위의|해당)\s/.test(method) || BOUNDARY.test(method) || BOUNDARY.test(finding)
        || [method,finding].some(value => SOURCE_ACTOR.test(value) || OTHER_ACTOR.test(value) || BORROWED_WRAP.test(value))
        || !sharedSubject(method,finding)) continue;
      add(match.index,match.index+match[0].length,"수행 방법: "+method+line+"결과: "+finding,
        "같은 활동에서 따로 적은 방법과 결과를 수행 순서대로 배치했습니다.","순서 정리");
    }
    for (const match of original.matchAll(MERGE_EDIT)) {
      const [full,object,action,repeated] = match;
      const noun = object.trim().split(/\s+/).at(-1);
      if (repeated.trim() !== object.trim() && repeated.trim() !== noun) continue;
      const contextBefore = original.slice(Math.max(0,match.index-160),match.index).split(/(?:[.!?。！？]\s+|\r?\n)/u).at(-1) || "";
      const sourceSentence = contextBefore+full;
      const next = original.slice(match.index+full.length).split(/[.\r\n!?。！？]/,1)[0];
      const boundary = match.index+full.length+next.length;
      if (safeQuotes.some(([start,stop]) => start < boundary && stop > match.index)
        || [sourceSentence,next].some(value => OTHER_ACTOR.test(value) || SOURCE_ACTOR.test(value) || OUTSIDE_WRITER.test(value))
        || EXPLICIT_STUDENT.test(next)
        || PLAN.test(next) || NEG.test(next) || BOUNDARY.test(next.trim())) continue;
      const at = match.index+full.indexOf(action+"함",object.length);
      if (at < match.index) continue;
      add(at,match.index+full.length,action+"하고 ",
        "앞 문장에서 만든 결과물을 다시 언급한 부분을 줄이고, 이어서 한 일을 연결했습니다.","문장 연결");
    }
    const embedded = (from,to) => {
      const tail = original.slice(to);
      const next = exactSentences(tail)[0] || tail;
      const prior = original.slice(Math.max(0,from-180),from).split(/(?:[.!?。！？]\s+|\r?\n)/u).at(-1) || "";
      return REPORTING_SUFFIX.test(next) || Boolean((SOURCE_ACTOR.test(prior) || OTHER_ACTOR.test(prior))
        && /(?:라고|다고|한\s*(?:자료|기사|설명|내용)|읽음|들음|소개함|인용함)/.test(next));
    };
    for (const match of original.matchAll(SEQUENCE_EDIT)) {
      const [full,action,ending] = match;
      const at = match.index+full.indexOf(action);
      const tail = original.slice(match.index+full.length);
      if (!full.includes(",") && /^(?:학생|교사|팀원|모둠|친구|상대)(?:은|는|이|가)\s/.test(tail)) continue;
      const next = tail.split(/[.\r\n!?。！？]/,1)[0];
      if (embedded(at,match.index+full.length) || /^(?:하고|하며|하지만)$/.test(ending)
        && (!DONE.test(next) || NO_SPLIT_CONTEXT.test(next))) continue;
      if (/(?:으나|지만)/.test(full) && !/^(?:그러나|다만|반면)\s/.test(tail)) continue;
      add(at,match.index+full.length,action+"함. ",
        "학생의 수행과 그 뒤의 결과나 다른 사람의 행동을 별도 문장으로 나눴습니다.","문장 나누기");
    }
    for (const match of original.matchAll(CONTRAST_EDIT)) {
      const [full,action] = match;
      const at = match.index+full.indexOf(action);
      const tail = original.slice(match.index+full.length);
      if (/^(?:그러나|다만|반면)\s/.test(tail) || embedded(at,match.index+full.length)) continue;
      add(at,match.index+full.length,action+"함. 다만 ",
        "관찰이나 판단과 그에 대한 예외를 별도 문장으로 나눴습니다.","문장 나누기");
    }
    for (const match of original.matchAll(WORDING_RX)) {
        const before = match[0];
        const offset = match.index;
        if (/\S/.test(original.charAt(offset-1))) continue;
        const tail = original.slice(offset+before.length);
        if (/함$/.test(before) && !/^(?:[\s.,;!?。！？]|$)/.test(tail)) continue;
        if (!/함$/.test(before) && !/^(?:(?:은|는|이|가|을|를|에|으로|과|와|도|만)?(?:[\s.,;!?。！？]|$))/.test(tail)) continue;
        add(offset,offset+before.length,SAFE_WORDING.get(before),
          /함$/.test(before) ? "같은 행동을 뜻하는 표현을 짧게 다듬었습니다." : "단어를 띄어 써서 읽기 쉽게 했습니다.","표현 정리");
    }
    let plain = "", from = 0;
    for (const patch of patches.sort((a,b) => a.at-b.at)) {
      plain += original.slice(from,patch.at);
      const start = plain.length;
      plain += patch.after;
      const end = plain.trimEnd().length;
      edits.push({before:original.slice(patch.at,patch.stop).trimEnd(),after:plain.slice(start,end),start,end,reason:patch.reason,type:patch.type});
      from = patch.stop;
    }
    plain += original.slice(from);
    return {plain,edits};
  }

  function highlightedRevision(revision) {
    let at = 0;
    let html = "";
    for (const {start,end} of revision.edits) {
      html += escape(revision.plain.slice(at,start))
        + '<mark class="review-edit-highlight">'+escape(revision.plain.slice(start,end))+'</mark>';
      at = end;
    }
    return html + escape(revision.plain.slice(at));
  }

  function assess(payload = {}) {
    const text = textOf(payload.text);
    const area = Object.hasOwn(AREAS,payload.area) ? payload.area : "overall";
    const profile = AREAS[area];
    const writing = (area === "subject" && SUBJECT_WRITING.find(([rx]) => rx.test(textOf(payload.subject).trim()))?.[1]) || WRITING[area];
    const {frames,groups,quotes} = scan(text);
    const community = area === "behavior" || area === "autonomy" || area === "overall" || area === "club";
    const candidates = groups.flatMap(group => area === "behavior" ? [route(group,true)] : community ? [route(group,false),route(group,true)] : [route(group,false)]).filter(Boolean);
    const best = candidates.sort((a,b) => b.score-a.score || Number(b.community && area === "autonomy")-Number(a.community && area === "autonomy"))[0];
    const action = best?.action || frames.find(f => f.action && !PRAISE.test(f.text));
    const start = best?.start;
    const end = best?.end;
    const depth = best?.judgment || best?.rechecked || best?.follow;
    const source = frames.find(f => f.actor === "source");
    const other = frames.find(f => f.actor === "peer");
    const plan = frames.find(f => f.plan);
    const neg = frames.find(f => f.neg);
    const course = area === "subject" && payload.courseFit?.valid ? payload.courseFit : null;
    const courseLink = course ? course.subjectFit >= 80 && (course.courseFit == null || course.courseFit >= 70) : null;
    const decisionRole = action && /(?:직접|스스로|맡아|맡은|선택|제안|조정|설계|작성|제작|도와|조사|검증|측정|분석|분류)/.test(action.text);
    const careerDepth = depth && /진로|직업|전공|직무|관심|분야|필요|선택|판단|기준|더\s*탐구|다음/.test(depth.text);
    const communityDepth = best?.community && end && (best.follow || (start && action && /조정|중재|제안|선택|정해|정함|기준|분담|나눠|나누|물어|묻|이유|바꾸|바꿔/.test(action.text) && end.tokens >= 2));
    const hasRoleInClub = area !== "club" || decisionRole || !groups.some(group => group.some(f => f.groupContext));
    const areaDepth = area === "behavior" ? communityDepth
      : area === "career" ? careerDepth || (depth && (best.rechecked || best.follow))
        : best?.community ? communityDepth || depth : depth;
    const strong = Boolean(end && start && areaDepth && hasRoleInClub && courseLink !== false);
    const blank = !/[가-힣A-Za-z0-9]/.test(text);
    let legacy = payload.legacy;
    if (!Object.hasOwn(payload,"legacy") && !blank && typeof root.__ryanQaAssessV28 === "function") {
      legacy = root.__ryanQaAssessV28({text:quotes.evidenceSafe,area,mode:"strict",subject:payload.subject});
    }
    const legacyGrade = legacy?.strictGrade;
    const legacyHasScene = legacy?.flags?.coreScene || legacy?.eventSummary?.studentEpisodeCount > 0;
    const hasBorrowedAction = frames.some(f => f.borrowed || f.actor !== "student" && ACTION.test(f.text) && DONE.test(f.text));
    const explicitlyObservedOther = frames.some(f => f.actor !== "student" && EXPLICIT_STUDENT.test(f.text) && WATCHED.test(f.text));
    const strongOwnershipBoundary = !end && (quotes.masked && !best?.action || explicitlyObservedOther);
    const clearlyUncompleted = !end && !action && (plan || neg || source || other);
    let grade = blank ? "미작성" : strong ? "A" : end ? "B" : "C";
    if (!blank && /^[ABC]$/.test(legacyGrade || "")) {
      if (strongOwnershipBoundary || clearlyUncompleted && (legacyGrade === "C" || legacy?.flags?.hardC || !legacyHasScene)) grade = "C";
      else {
        grade = legacyGrade;
        const legacyInterpretation = legacyHasScene && Number(legacy?.dimensions?.interpretation) >= 80;
        const explicitOwnership = end && best?.action && /(?:직접|스스로|학생은|본인은).{0,58}(?:계산|검증|비교|분석|측정|제작|해석|작성|제안|조정|정리)/.test(best.action.text);
        const linkedBullets = end && best?.action && /^(?:[-*•▪◆]|\d+[.)])\s/.test(best.action.span)
          && /^(?:[-*•▪◆]|\d+[.)])\s/.test(end.span) && best.action !== end && (end.artifact || MEASURE.test(end.text));
        const confirmedEpisode = Boolean(end && (Number(legacy?.dimensions?.agency) >= 80 || best?.community || explicitOwnership || end.validNull || linkedBullets));
        if (legacyGrade === "C" && (confirmedEpisode || (end && (plan || groups.length > 1)) || (legacyInterpretation && !plan && !neg && !source && !legacy?.flags?.hardC))) grade = "B";
        if (strong && (best?.rechecked || area === "behavior" && best?.community && best?.follow || plan && !legacy?.flags?.otherActorOnly && !legacy?.flags?.sourceAttributionLeak)) grade = "A";
      }
    }
    if (grade === "A" && courseLink === false) grade = "B";
    const normalGrade = grade === "A" || grade === "B" ? "우수" : "미흡";
    const displayGrade = payload.mode === "strict" ? grade : normalGrade;
    const rawScore = grade === "A" ? Math.min(100,85+Number(!!best?.rechecked)*5+Number(!!best?.follow)*4+Number(!!best?.judgment)*3+Math.min(3,best?.action?.tokens || 0))
      : grade === "B" ? Math.min(84,60+Number(!!start)*6+Number(!!depth)*7+Number(!!best?.action?.specificity)*3+Number(!!best?.action?.tokens && best.action.tokens >= 4)*3+Number(courseLink === true)*3)
        : blank ? 0 : Math.min(59,12+Number(!!action)*15+Number(!!best)*13+Number(frames.some(f => f.starts))*6+Number(!!depth)*8);
    const score = grade === legacyGrade && !end && Number.isFinite(legacy?.score) ? legacy.score : rawScore;
    const resultGap = !end && quotes.masked && !best?.action ? "인용문이나 제목 속 행동은 학생이 직접 한 일로 판단하지 않았습니다."
      : !end && plan ? "계획만 나온 부분은 실행이나 결과로 세지 않았습니다."
      : !end && neg ? "하지 못했거나 확인하지 못한 부분은 결과로 세지 않았습니다."
      : !end && source ? "자료가 제시한 결과와 학생이 직접 확인한 결과가 구분되지 않습니다."
      : !end && (other || hasBorrowedAction) ? "다른 사람의 행동은 학생 개인의 수행으로 세지 않았습니다."
      : !end ? "학생이 한 일 뒤에 직접 확인한 변화, 관찰 내용 또는 산출물이 구체적으로 드러나지 않습니다."
        : "수행이나 산출물 일부는 보이지만 학생에게 귀속되는 행동과 결과의 연결이 충분히 뚜렷하지 않습니다.";
    const rationale = !blank && !end && grade !== "C" && grade === legacyGrade && legacy?.rationale ? legacy.rationale
      : blank ? "평가할 기록이 입력되지 않았습니다."
      : grade === "A" ? best?.community ? "공동체의 필요, 학생이 선택한 행동, 관찰된 변화가 한 장면으로 이어집니다."
        : best?.rechecked ? "질문에 맞는 방법으로 얻은 결과를 점검하고, 방법을 바꾼 뒤 다시 확인한 과정까지 드러납니다."
          : "활동의 계기, 학생이 선택한 방법, 직접 확인한 결과와 판단이 한 흐름으로 이어집니다."
        : grade === "B" ? courseLink === false ? "학생의 수행과 결과는 보이지만 선택 교과의 개념이 방법과 결과에 어떻게 쓰였는지 충분히 드러나지 않습니다."
          : !hasRoleInClub ? "동아리 활동의 결과는 보이지만 학생 개인의 역할과 기여는 더 구체적으로 밝혀야 합니다."
            : "학생이 한 일과 확인한 결과는 보입니다. " + (!start ? "활동을 시작한 이유나 질문을 더 밝혀 주세요." : "이 결과를 어떻게 해석했거나 다음 행동에 반영했는지 더 밝혀 주세요.")
          : resultGap;
    const support = [
      ["start","상황과 질문",start, start ? (end ? "A" : "B") : "C", start ? "활동을 시작한 상황이나 질문이 드러납니다." : "활동의 출발점이 구체적으로 연결되지 않습니다."],
      ["method","학생의 행동과 방법",best?.action || action, best?.action ? (end ? "A" : "B") : action ? "B" : "C",best?.action ? "학생이 실제로 선택한 행동이나 방법이 드러납니다." : action ? "수행은 드러나지만 역할·기준·대상이 구체적이지 않습니다." : "학생이 실제로 한 일을 확인할 근거가 부족합니다."],
      ["result",best?.community || area === "behavior" ? "행동 뒤 관찰된 변화" : "직접 확인한 결과",end || source || other || plan || neg,end ? "A" : "C",end ? "학생의 행동에 이어 확인한 결과가 드러납니다." : resultGap],
      ["depth",best?.community || area === "behavior" ? "공동체에 준 영향" : "해석과 후속 점검",depth || (communityDepth ? end : null),areaDepth ? "A" : end ? "B" : "C",areaDepth ? "관찰된 변화나 결과에 대한 판단이 행동과 연결됩니다." : "결과에 대한 해석이나 이후 실제 행동은 충분히 확인되지 않습니다."]
    ];
    if (area === "subject") support.push(["courseFit","교과 개념의 적용",courseLink ? best?.action : null,courseLink === true ? "A" : courseLink === false ? "C" : "B",courseLink === true ? "선택 교과의 개념과 수행 근거가 연결됩니다." : courseLink === false ? "선택 교과의 개념·자료·방법이 수행에 쓰인 장면이 부족합니다." : "구체 과목과 수행의 연결은 별도 확인이 필요합니다."]);
    const cards = support.map(([key,title,item,rank,assessment]) => ({key,title,grade:rank,
      evidence:evidence(item)?.span || "원문 근거 미확인",assessment}));
    const gaps = [];
    const add = (key,title,item,position,what,example) => gaps.push({key,title,anchor:evidence(item),position,what,example});
    if (courseLink === false) add("course","교과 개념 적용",best?.action || action,"수행 문장 안",profile.method+"을 밝혀 주세요.","[선택 교과의 개념]을 [수행 대상]에 적용하여 [판단 기준]으로 사용함.");
    if (!best?.action) add("action","학생이 직접 한 일",action || source || other || frames[0],"활동 소개 뒤","다음 내용을 실제로 확인되는 범위에서 써 주세요: "+profile.method+".",area === "behavior" ? "[관찰된 상황]에서 [학생이 직접 한 행동]을 함." : "[대상·조건]을 [학생이 선택한 방법]으로 살핌.");
    if (!end || grade === "C") add("result","행동 뒤 확인한 결과",best?.action || action || source || plan || neg,"학생의 행동 뒤",resultGap+" 실제로 확인한 반응·관찰·산출물만 이어 쓰세요.",area === "behavior" || area === "autonomy" ? "그 뒤 [실제로 관찰된 상대의 반응이나 학급의 변화]가 나타남." : "[직접 확인한 차이·수치·산출물]을 확인함.");
    if (!start) add("start","출발 상황 또는 질문",action || frames[0],"첫 활동을 설명하기 전","다음 내용을 밝혀 주세요: "+profile.start+".","[수업·관찰·공동체 상황]에서 [구체 질문이나 필요]를 발견함.");
    if (end && (!areaDepth || grade === "B" && start && courseLink !== false && hasRoleInClub)) {
      const hasInterpretation = Boolean(areaDepth);
      add("depth",hasInterpretation ? "판단을 뒷받침하는 근거" : "결과에 대한 판단",depth || end,"결과를 설명한 문장 뒤",
        hasInterpretation ? "어떤 자료나 관찰을 근거로 그렇게 판단했는지 더 구체적으로 적어 주세요." : profile.depth+" 확인해 보세요. 후속 행동은 실제로 한 경우에만 적으세요.",
        area === "behavior" ? "[관찰된 반응]을 바탕으로 [다음에 실제로 이어 간 행동]을 함." : "[직접 확인한 결과]를 근거로 [당시 내린 판단이나 실제 수정]을 설명함.");
    }
    if (!hasRoleInClub) add("role","팀과 개인의 역할 구분",action,"팀 활동을 설명한 문장 뒤","팀 전체의 성과와 학생 개인이 맡아 완성한 부분을 구분해 주세요.","모둠 과제에서 [학생의 담당 역할]을 맡아 [학생의 결과물]을 완성함.");
    const legacyEvidence = (legacy?.evidence || []).filter(item => item?.span && text.slice(item.start,item.end) === item.span);
    const useLegacyEvidence = grade !== "C" && !end && legacyEvidence.length > 0;
    const guidance = gaps.filter(item => !useLegacyEvidence || !["result","action"].includes(item.key)).slice(0,3).map(item => {
      const specialized = ["course","depth","role"].includes(item.key) || item.key === "result" && area !== "overall";
      const detail = specialized ? writing : NEXT_DETAIL[item.key];
      return {...item,reason:detail.reason,question:detail.question,example:specialized ? writing.pattern : item.example};
    });
    const evidenceList = [...[end,best?.action,depth,start].map(evidence),...(useLegacyEvidence ? legacyEvidence : []),...[source,other,plan,neg,action,frames[0]].map(evidence)]
      .filter(Boolean).filter((item,i,arr) => arr.findIndex(e => e.start === item.start) === i).slice(0,3);
    if (useLegacyEvidence) {
      for (const card of cards) {
        if (card.key !== "result" && card.key !== "method") continue;
        const original = (legacy.cards || []).find(item =>
          typeof item.evidence === "string" && text.includes(item.evidence) && item.evidence.length > 8
          && (card.key === "result" ? /result|결과/.test(item.key+" "+item.title) : /process|method|수행|방법/.test(item.key+" "+item.title)));
        card.grade = original?.grade === "A" && grade === "A" ? "A" : "B";
        card.evidence = original?.evidence || legacyEvidence[0].span;
        card.assessment = "원문의 앞뒤 맥락에서 수행과 결과를 확인할 수 있습니다.";
      }
    }
    const strengths = [best?.action && "학생이 직접 선택한 행동이나 방법이 드러납니다.",(end || useLegacyEvidence) && "직접 확인한 결과를 행동과 연결했습니다.",areaDepth && (best?.community ? "공동체에 나타난 변화나 이어진 실천이 드러납니다." : "결과에 대한 해석이나 후속 점검이 드러납니다.")].filter(Boolean);
    const reasoning = [
      best?.action && end ? {label:"확인한 연결",text:best.community ? "학생이 한 행동과 상대의 반응 또는 공동체에 나타난 변화를 같은 활동에서 확인했습니다." : "학생이 선택한 방법과 그 방법으로 얻은 결과를 같은 활동에서 확인했습니다."} : null,
      end && depth ? {label:"결과를 해석한 근거",text:best.rechecked ? "한계나 오류를 살핀 뒤 방법을 바꾸고 결과를 다시 확인했습니다." : best.follow ? "앞선 결과를 다음 행동에 반영하고 후속 결과를 남겼습니다." : "확인한 결과를 바탕으로 판단하거나 의미를 설명한 부분이 있습니다."} : null,
      frames.some(f => f.plan) ? {label:"계획",text:"이미 한 활동과 이후에 하려는 일은 구분해 읽었습니다."} : null,
      source && !end ? {label:"결과의 주체",text:"자료나 다른 사람이 제시한 결론은 학생이 직접 얻은 결과로 인정하지 않았습니다."} : null,
      quotes.masked ? {label:"인용과 실제 수행",text:"제목이나 인용에 들어 있는 행동과 결과는 해당 문구를 작성한 학생의 것으로 판단하지 않았습니다."} : null,
      groups.length > 1 ? {label:"여러 활동",text:"다른 활동의 결과를 가져와 앞 활동의 근거로 묶지 않았습니다."} : null,
      guidance[0] ? {label:"가장 먼저 보완할 근거",text:guidance[0].reason} : null,
    ].filter(Boolean).slice(0,3);
    return {engineVersion:VERSION,area,areaLabel:profile.label,strictGrade:grade,normalGrade,displayGrade,score,rationale,cards,evidence:evidenceList,reasoning,
      strengths:strengths.length ? strengths : ["뚜렷한 행동·결과의 연결을 아직 확인하지 못했습니다."],
      weaknesses:guidance.length ? guidance.map(item => ({
        result:resultGap,action:"학생 개인이 맡거나 선택한 일이 구체적으로 확인되지 않습니다.",
        start:"활동의 계기나 출발 질문이 분명하지 않습니다.",depth:"결과에 대한 판단이나 그 이후 변화가 충분히 드러나지 않습니다.",
        course:"선택 교과의 개념과 수행 방법의 연결이 부족합니다.",role:"팀 성과와 학생 개인의 기여가 구분되지 않습니다."
      })[item.key]) : ["이 문구에서 우선 보완할 근거는 확인되지 않았습니다."],
      suggestions:guidance.length ? guidance.map(item => item.what) : ["수치와 자료 출처를 다시 확인한 뒤, 현재 문장의 행동과 결과 연결을 유지하세요."],
      guidance,revision:rewrite(text),flags:{completedEpisode:Boolean(end),supportedDepth:Boolean(areaDepth),courseLink,plannedOnly:Boolean(plan&&!end),sourceOnly:Boolean(source&&!end),negatedOnly:Boolean(neg&&!end),communityRoute:Boolean(best?.community),sceneCount:groups.length,quotedActionExcluded:quotes.masked,borrowedActionSeparated:hasBorrowedAction}};
  }

  function renderRevision(canonical, doc) {
    const byId = id => doc.getElementById(id);
    const panel = byId("retakeExamplePanel");
    if (!panel) return;
    const {revision,guidance,evidence:anchors} = canonical;
    const body = byId("retakeExampleText");
    const guide = byId("retakePlacementGuide");
    const source = byId("retakeSourceAnchors");
    if (body) body.innerHTML = '<h3>원문을 바탕으로 고친 문장</h3><p class="review-rewrite-text">'+highlightedRevision(revision)+'</p>'
      + (revision.edits.length ? '<ul class="review-change-list">'+revision.edits.map(edit =>
        '<li><strong>'+escape(edit.type)+'</strong><span class="review-change-pair"><span><b>수정 전</b> “'+escape(edit.before)
        +'”</span><span><b>수정 후</b> “'+escape(edit.after)+'”</span></span><span>'+escape(edit.reason)+'</span></li>').join("")+'</ul>' : '');
    const sample = byId("reviewCompletionExample");
    if (sample) {
      const candidate = guidance.find(item => item.anchor && ["result","depth","role","course"].includes(item.key));
      sample.hidden = !candidate;
      sample.innerHTML = candidate ? '<h3>확인한 사실을 덧붙이는 예시</h3><p><strong>이어 쓸 원문</strong> '+escape(candidate.anchor.span)
        +'</p><p><strong>덧붙일 문장</strong> '+highlightSlots(candidate.example)+'</p>' : '';
    }
    if (guide) guide.innerHTML = guidance.length ? guidance.map(item => '<li><strong>'+escape(item.title)+'</strong>'
      + (item.anchor ? '<mark>원문 “'+escape(item.anchor.span)+'”</mark>' : '')
      + '<span><b>보완할 위치</b> '+escape(item.position)+'</span><span class="review-guidance-reason"><b>보완하는 이유</b> '+escape(item.reason)+'</span>'
      + '<span><b>수정 방향</b> '+escape(item.what)+'</span><span class="review-followup-question"><b>확인할 사실</b> '+(item === guidance[0] ? keyHighlight(item.question) : escape(item.question))+'</span>'
      + '<em><b>작성 틀</b> '+escape(item.example)+'</em></li>').join("")
      : '<li>현재 구조를 유지하고, 실제 관찰한 사실과 일치하는지만 확인하세요.</li>';
    if (source) source.innerHTML = anchors.length ? anchors.map(item => '<li>“'+escape(item.span)+'”</li>').join("") : '<li>연결할 원문 근거를 확인하지 못했습니다.</li>';
    const warning = byId("retakeWarningText");
    if (warning) warning.textContent = "대괄호가 있는 문장은 작성 틀입니다. 확인할 사실을 채우기 전에는 기록에 넣지 마세요.";
    const status = byId("retakeStatus");
    if (status) status.textContent = revision.edits.length ? "형광펜으로 표시한 "+revision.edits.length+"곳을 다듬었습니다." : "자동으로 바꾼 표현은 없습니다.";
    panel.dataset.ready = "true";
  }

  function render(canonical, doc) {
    const byId = id => doc.getElementById(id);
    const put = (id,value) => { const el = byId(id); if (el) el.textContent = value; };
    const writeList = (id,values,highlightFirst = false) => {
      const el = byId(id);
      if (el) el.innerHTML = values.map((item,i) => '<li>'+(highlightFirst && i === 0 ? keyHighlight(item) : escape(item))+'</li>').join("");
    };
    const grade = canonical.displayGrade;
    const scoreText = "기록 근거 충족도 "+canonical.score+"%";
    const strictMode = grade === canonical.strictGrade;
    const shown = g => strictMode ? g : g === "C" ? "미흡" : "우수";
    byId("precisionReviewPanel")?.classList.add("show");
    put("precisionGrade",grade);
    put("gradeValue",grade);
    put("precisionConfidence",scoreText);
    put("scoreValue",scoreText);
    put("precisionRationale",canonical.rationale);
    const explanation = byId("precisionReasoning");
    if (explanation) {
      explanation.hidden = !canonical.reasoning.length;
      explanation.innerHTML = canonical.reasoning.map(item => '<li><strong>'+escape(item.label)+'</strong> '+escape(item.text)+'</li>').join("");
    }
    put("gradeLabel",canonical.rationale);
    put("reviewText",canonical.rationale);
    put("modeBadge",canonical.areaLabel);
    put("scoreScope","학생의 행동, 그 뒤의 결과, 평가 영역에 맞는 판단이 같은 활동에서 얼마나 이어지는지 보여 줍니다.");
    put("resultStatus",grade+" 판정, "+scoreText);
    writeList("precisionStrengths",canonical.strengths);
    writeList("precisionWeaknesses",canonical.weaknesses);
    writeList("precisionSuggestions",canonical.suggestions,canonical.guidance.length > 0);
    writeList("priorityList",canonical.suggestions);
    const evidenceBox = byId("precisionEvidence");
    if (evidenceBox) {
      const quotes = canonical.evidence.slice(0,2).map((e,i) => "“"+(i === 0 ? keyHighlight(e.span) : escape(e.span))+"”");
      evidenceBox.innerHTML = "<strong>원문에서 확인한 근거</strong><span>"+(quotes.join(" ") || "연결할 직접 근거가 부족합니다.")+"</span>";
    }
    const bar = byId("scoreMeter");
    if (bar) {
      bar.style.width = canonical.score+"%";
      bar.parentElement?.setAttribute("aria-valuenow",String(canonical.score));
      bar.parentElement?.setAttribute("aria-valuetext",grade+" 판정, "+scoreText);
      bar.parentElement?.setAttribute("aria-label","기록 근거 충족도");
    }
    const grid = byId("reviewCards");
    if (grid) grid.innerHTML = canonical.cards.map(card => {
      const tone = card.grade === "A" ? "is-good" : card.grade === "B" ? "is-mid" : "is-low";
      return '<section class="review-case-card '+tone+'"><div class="review-case-head"><h3>'+escape(card.title)
        +'</h3><span class="review-case-grade">'+shown(card.grade)+'</span></div><p class="review-case-evidence"><strong>근거</strong> '
        +escape(card.evidence)+'</p><p class="review-case-assessment"><strong>판단</strong> '+escape(card.assessment)+'</p></section>';
    }).join("");
    const detail = byId("detailBody");
    if (detail) detail.innerHTML = canonical.cards.map(card => '<tr><th scope="row">'+escape(card.title)+'</th><td><span class="rating-pill">'
      +shown(card.grade)+'</span></td><td>'+escape(card.assessment)+'</td><td>'+escape(card.evidence)+'</td></tr>').join("");
    const results = byId("results");
    if (results) {
      results.dataset.canonicalGrade = canonical.strictGrade;
      results.dataset.canonicalScore = String(canonical.score);
      results.dataset.engine = canonical.engineVersion;
    }
    renderRevision(canonical,doc);
  }

  const exactSentences = value => {
    const source = textOf(value);
    return spans(source,SENTENCE_BREAK,0,true,scanQuotes(source).allMasked).map(item => item.span);
  };
  root.RyanRecordReview = Object.freeze({version:VERSION,assess,render,cleanPastedText,scanComparison,renderComparison,exactSentences});
  if (typeof document === "object") {
    const attach = () => bindPaste(document.getElementById("recordText"));
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded",attach,{once:true});
    else attach();
  }
  if (typeof module === "object" && module.exports) module.exports = root.RyanRecordReview;
})(typeof window === "object" ? window : globalThis);
