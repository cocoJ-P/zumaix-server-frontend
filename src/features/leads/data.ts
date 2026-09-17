import type { EnterpriseLead } from './types';

export const ENTERPRISE_LEADS: EnterpriseLead[] = [
  {
    id: 'lead-zumaix',
    enterpriseId: 'ent-zumaix',
    signal: 'in_progress',
    summary:
      '连续查看「高新技术企业认定辅导」，接受发现后已点击继续办理。行为已经从关注变成明确的服务事项。',
    implication:
      '线索已进入服务办理，不必再当新意向跟。关注办理进度即可。',
    focusContent: '高新技术企业认定辅导',
    lastActionLabel: '继续办理',
    lastAtLabel: '今天 16:19',
    events: [
      {
        id: 'ev-z1',
        atLabel: '9月12日 10:08',
        kind: 'view_discovery',
        title: '查看发现「高新技术企业认定辅导」',
      },
      {
        id: 'ev-z2',
        atLabel: '9月12日 10:11',
        kind: 'open_content',
        title: '打开认定条件与材料说明',
      },
      {
        id: 'ev-z3',
        atLabel: '9月13日 09:40',
        kind: 'revisit',
        title: '再次进入同一发现',
      },
      {
        id: 'ev-z4',
        atLabel: '9月13日 09:42',
        kind: 'save_discovery',
        title: '接受发现',
      },
      {
        id: 'ev-z5',
        atLabel: '今天 16:19',
        kind: 'continue_service',
        title: '解析完成后点击继续办理',
      },
    ],
  },
  {
    id: 'lead-yunshu',
    enterpriseId: 'ent-yunshu',
    signal: 'in_progress',
    summary:
      '主动提交科技型中小企业信贷相关材料，解析成功后继续办理。需求不是浏览出来的，是企业自己说出来的。',
    implication:
      '已形成服务事项。优先核对适用对象，而不是再推同类内容。',
    focusContent: '科技型中小企业信用贷对接',
    lastActionLabel: '提交并继续办理',
    lastAtLabel: '昨天 18:06',
    events: [
      {
        id: 'ev-y1',
        atLabel: '昨天 17:51',
        kind: 'submit',
        title: '提交文本：科技型中小企业贷款需求',
      },
      {
        id: 'ev-y2',
        atLabel: '昨天 17:58',
        kind: 'open_content',
        title: '查看解析结果中的申请条件',
      },
      {
        id: 'ev-y3',
        atLabel: '昨天 18:06',
        kind: 'continue_service',
        title: '点击继续办理',
      },
    ],
  },
  {
    id: 'lead-beichen',
    enterpriseId: 'ent-beichen-data',
    signal: 'high_intent',
    summary:
      '三天内四次打开数据要素专项，并保存了发现，但还没有继续办理。关注很深，动作停在「看懂」而不是「要办」。',
    implication:
      '适合作为可投放对象，补一条更贴近授权运营场景的说明，而不是重复推同一政策标题。',
    focusContent: '2026 年度科技创新专项 / 数据要素场景',
    lastActionLabel: '保存发现',
    lastAtLabel: '今天 09:20',
    events: [
      {
        id: 'ev-b1',
        atLabel: '9月14日 11:02',
        kind: 'view_discovery',
        title: '查看发现「2026 年度科技创新专项」',
      },
      {
        id: 'ev-b2',
        atLabel: '9月14日 11:06',
        kind: 'open_content',
        title: '打开申报对象与支持方向',
      },
      {
        id: 'ev-b3',
        atLabel: '9月15日 08:44',
        kind: 'revisit',
        title: '再次阅读同一政策',
      },
      {
        id: 'ev-b4',
        atLabel: '今天 09:18',
        kind: 'revisit',
        title: '第三次回到政策详情',
      },
      {
        id: 'ev-b5',
        atLabel: '今天 09:20',
        kind: 'save_discovery',
        title: '保存发现',
      },
    ],
  },
  {
    id: 'lead-lingbo',
    enterpriseId: 'ent-lingbo',
    signal: 'high_intent',
    summary:
      '对投融资路演表现出明确兴趣：多次打开活动页，并查看早期团队辅导相关发现。还没有提交材料。',
    implication:
      '活动窗口短，适合确认是否仍可投放路演信息，而不是立刻建立服务事项。',
    focusContent: '投融资路演周',
    lastActionLabel: '反复打开活动',
    lastAtLabel: '今天 08:31',
    events: [
      {
        id: 'ev-l1',
        atLabel: '9月13日 16:12',
        kind: 'view_discovery',
        title: '查看发现「投融资路演周」',
      },
      {
        id: 'ev-l2',
        atLabel: '9月14日 09:05',
        kind: 'open_content',
        title: '打开路演日程',
      },
      {
        id: 'ev-l3',
        atLabel: '今天 08:31',
        kind: 'revisit',
        title: '再次进入活动详情',
      },
    ],
  },
  {
    id: 'lead-jinmen',
    enterpriseId: 'ent-jinmen',
    signal: 'follow_up',
    summary:
      '看过智能制造专项后选择稍后，七天没有再打开。兴趣曾经出现，但行为已经冷却。',
    implication:
      '不要连续推送同一专项。若再投放，需要更具体的研发加计扣除或认定口径，而不是标题重复。',
    focusContent: '智能制造专项 / 研发加计扣除',
    lastActionLabel: '稍后处理',
    lastAtLabel: '9月9日 14:22',
    events: [
      {
        id: 'ev-j1',
        atLabel: '9月8日 11:18',
        kind: 'view_discovery',
        title: '查看发现「智能制造专项」',
      },
      {
        id: 'ev-j2',
        atLabel: '9月8日 11:21',
        kind: 'open_content',
        title: '浏览支持方向',
      },
      {
        id: 'ev-j3',
        atLabel: '9月9日 14:22',
        kind: 'defer_discovery',
        title: '选择稍后',
      },
    ],
  },
  {
    id: 'lead-xiyuan',
    enterpriseId: 'ent-xiyuan',
    signal: 'follow_up',
    summary:
      '打开专精特新培育政策后很快离开，没有保存，也没有二次访问。更像是扫过，而不是认真评估。',
    implication:
      '当前信号弱。等企业有入园确认或再次打开相关内容后，再判断是否值得投放。',
    focusContent: '专精特新中小企业培育',
    lastActionLabel: '打开后离开',
    lastAtLabel: '9月11日 19:03',
    events: [
      {
        id: 'ev-x1',
        atLabel: '9月11日 19:02',
        kind: 'view_discovery',
        title: '查看发现「专精特新中小企业培育」',
      },
      {
        id: 'ev-x2',
        atLabel: '9月11日 19:03',
        kind: 'open_content',
        title: '停留不足一分钟后离开',
      },
    ],
  },
  {
    id: 'lead-huitong',
    enterpriseId: 'ent-huitong',
    signal: 'watching',
    summary:
      '只看过一次智慧城市相关政策，没有保存或回访。有场馆系统背景，但还看不出明确办理意愿。',
    implication:
      '保持观察。有更贴近场馆运营的内容时再投，避免把普通政策当线索。',
    focusContent: '智慧城市 / 场馆运营',
    lastActionLabel: '查看发现',
    lastAtLabel: '9月10日 15:47',
    events: [
      {
        id: 'ev-h1',
        atLabel: '9月10日 15:47',
        kind: 'view_discovery',
        title: '查看发现「智慧城市相关政策」',
      },
    ],
  },
  {
    id: 'lead-zhanmai',
    enterpriseId: 'ent-zhanmai',
    signal: 'watching',
    summary:
      '浏览过文化科技融合专项，停留较短，没有接受发现。内容相关，行为强度不够。',
    implication:
      '还不是线索。可继续留在观察名单，等出现保存、回访或提交再升级。',
    focusContent: '文化科技融合专项',
    lastActionLabel: '短暂浏览',
    lastAtLabel: '9月12日 13:16',
    events: [
      {
        id: 'ev-zh1',
        atLabel: '9月12日 13:14',
        kind: 'view_discovery',
        title: '查看发现「文化科技融合专项」',
      },
      {
        id: 'ev-zh2',
        atLabel: '9月12日 13:16',
        kind: 'open_content',
        title: '打开正文后很快返回',
      },
    ],
  },
];
