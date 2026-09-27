import React from "react";

// Palettes for the hours of the day. The phone's clock decides. The coat is Pantha Bak's own.
const PALETTES = {
  morning: { paper: "#E3DBCF", paperDeep: "#D4C9BB", ink: "#2B2D2A", inkSoft: "#5A5851", mist: "#C4B5AB", band: "#E0B7A6", sun: "#E8B98A", moss: "#6B7F4A", mossDeep: "#4E5F36", tea: "#A0724F", coat: "#2A2828", coatEdge: "#171616", cream: "#F2EBDF", nose: "#D9A3A7", eye: "#B9B75E", stars: false, name: "Morning." },
  noon:    { paper: "#DCD9D0", paperDeep: "#CFCBC0", ink: "#2B2D2A", inkSoft: "#55584F", mist: "#B8BBB3", band: null,      sun: "#E9DDB8", moss: "#6B7F4A", mossDeep: "#4E5F36", tea: "#A0724F", coat: "#2A2828", coatEdge: "#171616", cream: "#F1EEE6", nose: "#D9A3A7", eye: "#B9B75E", stars: false, name: "Noon." },
  evening: { paper: "#D9CDBF", paperDeep: "#C9B9A8", ink: "#2B2D2A", inkSoft: "#5A5148", mist: "#B39D8F", band: "#D6A672", sun: "#DDA062", moss: "#647645", mossDeep: "#485833", tea: "#A0724F", coat: "#2A2828", coatEdge: "#171616", cream: "#EFE3D2", nose: "#D19A9E", eye: "#B5B25E", stars: false, name: "Evening." },
  dusk:    { paper: "#B8AAAE", paperDeep: "#A6979C", ink: "#2B2D2A", inkSoft: "#4C4548", mist: "#8F8087", band: "#C98E8A", sun: "#C97D68", moss: "#5D6E41", mossDeep: "#425032", tea: "#A0724F", coat: "#262426", coatEdge: "#4A4448", cream: "#E4DAD8", nose: "#C4939A", eye: "#B5B25E", stars: true,  name: "Dusk." },
  night:   { paper: "#3E444C", paperDeep: "#333940", ink: "#D9D6CC", inkSoft: "#A6A9A3", mist: "#5A626B", band: null,      sun: null,      moss: "#556742", mossDeep: "#3A4830", tea: "#B78A63", coat: "#22252A", coatEdge: "#6B7178", cream: "#CFC9BE", nose: "#B98A8E", eye: "#C8C66C", stars: true,  name: "Night." },
};

const LINES = {
  any: [
    "Pantha Bak is here.", "Still here.", "Nothing to do yet.", "Sitting, as usual.", "Nowhere to go.",
    "Same rock, different mountain.", "Pantha Bak has been waiting. Not for you, particularly.",
    "It is what it looks like.", "Nothing has happened. Good.", "Pantha Bak is not thinking about anything.",
    "One rock is enough.", "Pantha Bak did not come from anywhere.", "Whatever you brought, put it down here.",
    "The mountain has no opinion.", "Nothing is missing.", "Pantha Bak is doing exactly this.",
    "You are on time.", "The rock is where it was.", "This is the place.", "Pantha Bak blinks, slowly. That's the news.",
    "An ear turned. Then turned back.", "Pantha Bak has found the warm part of the rock.",
    "", "", "",
  ],
  morning: ["Morning. Pantha Bak got here first.", "Early. The mist hasn't decided.", "The sun is up. Pantha Bak is considering it.", "First light on the rock."],
  noon: ["Noon. Nothing to add.", "The sun is high. Pantha Bak is in the warm spot.", "Full daylight, and still nothing to do."],
  evening: ["Evening. Pantha Bak is still here.", "The light is going. Pantha Bak is staying.", "Long shadows. Short thoughts."],
  dusk: ["Dusk. The first star, if you look.", "Almost dark. Pantha Bak doesn't need the light.", "The day is closing quietly."],
  night: ["Night. Pantha Bak and the moon, both up.", "Dark. Pantha Bak is two eyes on the rock.", "Stars, a rock, a cat. Enough.", "The moon is doing its part."],
  rain: ["Rain. Pantha Bak has opinions about it.", "Rain on the rock. Pantha Bak is staying dry, somehow.", "It's raining on everyone equally."],
  wind: ["A wind through the pass.", "The wind is passing. So is everything.", "Something moving in the grass. Pantha Bak's ears noticed."],
  leaves: ["Leaves coming down.", "The tree is letting go. Pantha Bak is watching one leaf.", "One leaf, then another. No hurry."],
  tea: ["Tea. Nothing else.", "The tea is warm. That's the whole plan.", "Tea first. Pantha Bak would prefer fish."],
  house: ["Someone lives here. They're not home.", "A house with no one in it. Still a house."],
  stream: ["The stream is going somewhere. Pantha Bak isn't.", "Water passing. Pantha Bak is keeping its paws out of it."],
  field: ["A field. Somebody planted it. Nobody's around.", "Grass, all the way to the mist."],
  onsen: ["The water is warm. Pantha Bak is surprised to be in it.", "Steam, stones, cat.", "The spring doesn't ask what you did today.", "Soaking. That's the practice for now."],
};

const FONT = `"Noto Serif SC", "Songti SC", "PingFang SC", "Source Han Serif", "SimSun", Georgia, "Times New Roman", serif`;

// Classical texts (all pre-modern, public domain). English is a plain reading, not a scholarly translation.
const TEXTS = [
  // cats
  { id: "ly1", zh: "溪柴火軟蠻氈暖，我與狸奴不出門。", en: "The brushwood fire is soft, the felt rug is warm. The cat and I are not going out.", src: "陸游 · 十一月四日風雨大作" },
  { id: "ly2", zh: "裹鹽迎得小狸奴，盡護山房萬卷書。慚愧家貧策勳薄，寒無氈坐食無魚。", en: "I paid a little salt to bring the kitten home; now it guards every book in my mountain room. I'm ashamed the reward is so poor: no rug against the cold, no fish to eat.", src: "陸游 · 贈貓" },
  { id: "ly3", zh: "薄荷時時醉，氍毹夜夜溫。前生舊童子，伴我老山村。", en: "Drunk on mint now and then, warm on the rug every night. A companion from some earlier life, growing old with me in this mountain village.", src: "陸游 · 得貓於近村以雪兒名之戲為作詩" },
  { id: "htj", zh: "秋來鼠輩欺貓死，窺甕翻盤攪夜眠。聞道狸奴將數子，買魚穿柳聘銜蟬。", en: "Since autumn the mice act as if the cat were dead — into the jars, over the plates, into my sleep. I hear your cat has kittens. I'll string a fish on a willow twig and ask for one.", src: "黃庭堅 · 乞貓" },
  // sitting still
  { id: "lb", zh: "眾鳥高飛盡，孤雲獨去閒。相看兩不厭，只有敬亭山。", en: "The birds have flown high and gone; one cloud drifts off at its ease. We look at each other and never tire — only me and Jingting Mountain.", src: "李白 · 獨坐敬亭山" },
  { id: "ww2", zh: "獨坐幽篁裏，彈琴復長嘯。深林人不知，明月來相照。", en: "Sitting alone in the dark bamboo, I play the qin and whistle long. No one knows I'm deep in the wood; the bright moon comes to shine on me.", src: "王維 · 竹里館" },
  { id: "ww3", zh: "人閒桂花落，夜靜春山空。月出驚山鳥，時鳴春澗中。", en: "No one busy; the osmanthus falls. The night is still, the spring mountain empty. The moon comes out and startles a mountain bird, which calls now and then by the spring stream.", src: "王維 · 鳥鳴澗" },
  { id: "ww4", zh: "行到水窮處，坐看雲起時。", en: "Walk to where the water ends. Sit and watch the clouds come up.", src: "王維 · 終南別業" },
  { id: "tyn", zh: "採菊東籬下，悠然見南山。", en: "Picking chrysanthemums by the east fence, I look up, at ease, and there is the southern mountain.", src: "陶淵明 · 飲酒 · 其五" },
  { id: "tyn2", zh: "此中有真意，欲辨已忘言。", en: "There is something true in this. I go to say it, and the words are gone.", src: "陶淵明 · 飲酒 · 其五" },
  { id: "lzy", zh: "千山鳥飛絕，萬徑人蹤滅。孤舟蓑笠翁，獨釣寒江雪。", en: "A thousand mountains, no birds flying. Ten thousand paths, no footprints. One boat, an old man in a straw cape, fishing alone in the cold river snow.", src: "柳宗元 · 江雪" },
  { id: "mhr", zh: "春眠不覺曉，處處聞啼鳥。夜來風雨聲，花落知多少。", en: "Spring sleep, and I missed the dawn. Birds calling everywhere. There was wind and rain in the night. How many blossoms fell, I wonder.", src: "孟浩然 · 春曉" },
  { id: "jd", zh: "松下問童子，言師採藥去。只在此山中，雲深不知處。", en: "Under the pines I asked the boy. He said his master had gone for herbs — somewhere on this mountain, in cloud too deep to know where.", src: "賈島 · 尋隱者不遇" },
  { id: "xxm", zh: "至道無難，唯嫌揀擇。但莫憎愛，洞然明白。", en: "The great Way is not difficult; it only dislikes picking and choosing. Just don't love and hate, and it is wide open and clear.", src: "僧璨 · 信心銘" },
  { id: "ss", zh: "回首向來蕭瑟處，歸去，也無風雨也無晴。", en: "I look back at the place where the storm was. Going home: no wind and rain, and no clear sky either.", src: "蘇軾 · 定風波" },
  { id: "wyw", zh: "春潮帶雨晚來急，野渡無人舟自橫。", en: "The spring tide, full of rain, rises fast at evening. No one at the wild crossing; the boat turns by itself.", src: "韋應物 · 滁州西澗" },
];

const CLASSICAL = TEXTS;
const MODERN_FILLED = [];
const ALL = [...CLASSICAL];

// ---------- Pantha Bak: a black-and-white cat, big head, small loaf of a body ----------
const n = (v) => Math.round(v * 100) / 100;
const ease = { calcMode: "spline", keySplines: "0.45 0 0.55 1;0.45 0 0.55 1" };

// While sitting, the tail comes from behind, lies round the front of the paws, and ends clear of the body.
// Every so often the tip lifts, or swishes, then settles.
const TAIL = {
  rest: "M16 8 Q20.5 17.4 10.5 18.6 Q0 19.8 -10 19.4 Q-17 19.1 -19.9 17.8 Q-21.8 16.8 -21.3 15.3",
  lift: "M16 8 Q20.5 17.4 10.5 18.6 Q0 19.8 -10 19.4 Q-17 19.1 -20 17.6 Q-22.6 15.9 -21.6 13.9",
  small: "M16 8 Q20.5 17.4 10.5 18.6 Q0 19.8 -10 19.4 Q-17 19.1 -19.95 17.7 Q-22.2 16.4 -21.5 14.6",
  out: "M16 8 Q20.5 17.4 10.5 18.6 Q0 19.8 -10 19.4 Q-17 19.1 -20 18 Q-22.4 17.6 -23.1 16",
};
const TAIL_VALUES = [TAIL.rest, TAIL.rest, TAIL.lift, TAIL.rest, TAIL.rest, TAIL.out, TAIL.small, TAIL.rest, TAIL.rest].join(";");
const TAIL_TIMES = "0;0.30;0.33;0.37;0.72;0.75;0.78;0.82;1";
const TAIL_SPLINES = Array(8).fill("0.45 0 0.55 1").join(";");

function Paw({ P, x, dy = 0 }) {
  return (
    <g transform={`translate(0 ${dy})`}>
      <path d={`M${n(x - 5.2)} 15.2 Q${n(x - 5.9)} 9.6 ${x} 9.4 Q${n(x + 5.9)} 9.6 ${n(x + 5.2)} 15.2 Q${x} 16.6 ${n(x - 5.2)} 15.2 Z`} fill={P.cream} stroke={P.coatEdge} strokeWidth="0.6" strokeLinejoin="round" />
      <path d={`M${n(x - 1.8)} 15.7 Q${n(x - 2.1)} 14.2 ${n(x - 1.6)} 13.1 M${n(x + 1.8)} 15.7 Q${n(x + 2.1)} 14.2 ${n(x + 1.6)} 13.1`} fill="none" stroke={P.coatEdge} strokeWidth="0.55" strokeLinecap="round" opacity="0.55" />
    </g>
  );
}

// One eye, drawn around its own centre so it can blink. side: -1 left, 1 right. Lifts at the outer corner.
function Eye({ P, side, reduced }) {
  const s = side;
  return (
    <g transform={`translate(${n(11.8 * s)} -25)`}>
      <g>
        {!reduced && <animateTransform attributeName="transform" type="scale" values="1 1;1 1;1 0.1;1 1;1 1" keyTimes="0;0.92;0.95;0.98;1" dur="6s" repeatCount="indefinite" />}
        <path d={`M${n(5.8 * s)} -2.4 Q${n(-3.4 * s)} -8.4 ${n(-5.8 * s)} 2.4 Q${n(3.3 * s)} 8.4 ${n(5.8 * s)} -2.4 Z`} fill={P.eye} />
        <ellipse cx={n(-0.1 * s)} cy="0.1" rx="2" ry="4.2" fill={P.coat} />
        <circle cx="-1" cy="-2.2" r="1.1" fill={P.cream} />
        <circle cx="1" cy="2.4" r="0.45" fill={P.cream} opacity="0.8" />
      </g>
    </g>
  );
}

function Head({ P, eyesClosed, reduced }) {
  return (
    <g>
      {/* ears: wide, rounded tips */}
      <path d="M-19.5 -30 Q-24 -46 -20.5 -49 Q-18.5 -50 -16 -47.5 L-6 -39.5 Z M19.5 -30 Q24 -46 20.5 -49 Q18.5 -50 16 -47.5 L6 -39.5 Z" fill={P.coat} stroke={P.coatEdge} strokeWidth="0.8" strokeLinejoin="round" />
      <path d="M-17.5 -33 Q-20.5 -43 -19 -45.5 L-10 -38.5 Z M17.5 -33 Q20.5 -43 19 -45.5 L10 -38.5 Z" fill={P.nose} opacity="0.32" />
      {/* a big round head, and the white blaze down the middle */}
      <ellipse cx="0" cy="-23" rx="22" ry="18.5" fill={P.coat} stroke={P.coatEdge} strokeWidth="0.8" />
      <path d="M-1.8 -41.3 L1.8 -41.3 L3 -24 Q10.5 -21 10.2 -12 Q7 -5.3 0 -5.3 Q-7 -5.3 -10.2 -12 Q-10.5 -21 -3 -24 Z" fill={P.cream} />
      <ellipse cx="-14.5" cy="-14.5" rx="3.2" ry="1.7" fill={P.nose} opacity="0.55" />
      <ellipse cx="14.5" cy="-14.5" rx="3.2" ry="1.7" fill={P.nose} opacity="0.55" />
      {eyesClosed ? (
        <g fill="none" stroke={P.cream} strokeWidth="1.7" strokeLinecap="round">
          <path d="M-7.4 -22 Q-13.2 -19.6 -16 -25.6" />
          <path d="M7.4 -22 Q13.2 -19.6 16 -25.6" />
        </g>
      ) : (
        <g>
          <Eye P={P} side={-1} reduced={reduced} />
          <Eye P={P} side={1} reduced={reduced} />
        </g>
      )}
      <path d="M-1.8 -14.4 Q0 -15.4 1.8 -14.4 Q1.1 -12.3 0 -12.3 Q-1.1 -12.3 -1.8 -14.4 Z" fill={P.nose} />
      <path d="M-3 -11 Q-1.5 -9.2 0 -11 Q1.5 -9.2 3 -11" fill="none" stroke={P.coat} strokeWidth="0.85" strokeLinecap="round" />
      <g fill="none" stroke={P.cream} strokeWidth="0.5" strokeLinecap="round" opacity="0.5">
        <path d="M-11.5 -12.8 Q-17 -13.8 -24 -15.5 M-11.5 -11.3 Q-17 -11.3 -24 -10.8 M11.5 -12.8 Q17 -13.8 24 -15.5 M11.5 -11.3 Q17 -11.3 24 -10.8" />
      </g>
    </g>
  );
}

// Awake: paws apart, tail curled at the left side (the teapot is on the right). Sitting: paws folded together, tail round the front.
// In the hot spring, only the head shows above the water.
function Cat({ P, eyesClosed, reduced, inWater }) {
  const dur = eyesClosed ? "9s" : "5.5s";
  if (inWater) return <Head P={P} eyesClosed={eyesClosed} reduced={reduced} />;
  return (
    <g>
      {!eyesClosed && (
        <g>
          <path d="M-15 11 Q-30 12.5 -29.5 2.5 Q-29 -3 -24 -2.4" fill="none" stroke={P.coat} strokeWidth="3.8" strokeLinecap="round" />
          <path d="M-15 11 Q-30 12.5 -29.5 2.5 Q-29 -3 -24 -2.4" fill="none" stroke={P.coatEdge} strokeWidth="0.6" strokeLinecap="round" opacity="0.5" />
        </g>
      )}
      {eyesClosed && (
        <g>
          <path d={TAIL.rest} fill="none" stroke={P.coat} strokeWidth="3.3" strokeLinecap="round">
            {!reduced && <animate attributeName="d" values={TAIL_VALUES} keyTimes={TAIL_TIMES} calcMode="spline" keySplines={TAIL_SPLINES} dur="22s" repeatCount="indefinite" />}
          </path>
          <path d={TAIL.rest} fill="none" stroke={P.coatEdge} strokeWidth="0.6" strokeLinecap="round" opacity="0.6">
            {!reduced && <animate attributeName="d" values={TAIL_VALUES} keyTimes={TAIL_TIMES} calcMode="spline" keySplines={TAIL_SPLINES} dur="22s" repeatCount="indefinite" />}
          </path>
        </g>
      )}
      {/* body, breathing from where it meets the rock */}
      <g transform="translate(0 15)">
        <g>
          {!reduced && <animateTransform attributeName="transform" type="scale" values="1 1;1.015 1.03;1 1" dur={dur} repeatCount="indefinite" {...ease} />}
          <g transform="translate(0 -15)">
            <path d="M-19.5 10 Q-21 -6 -8 -8.5 L8 -8.5 Q21 -6 19.5 10 Q19.5 15 13.5 15 L-13.5 15 Q-19.5 15 -19.5 10 Z" fill={P.coat} stroke={P.coatEdge} strokeWidth="0.8" />
            <path d="M-9.5 15 Q-12 -1 0 -4 Q12 -1 9.5 15 Z" fill={P.cream} />
          </g>
        </g>
      </g>
      {eyesClosed ? (
        <g>
          <Paw P={P} x={-3.4} dy={0.4} />
          <Paw P={P} x={3.4} dy={-0.6} />
        </g>
      ) : (
        <g>
          <Paw P={P} x={-7} />
          <Paw P={P} x={7} />
        </g>
      )}
      {/* the head lifts a little with each breath */}
      <g>
        {!reduced && <animateTransform attributeName="transform" type="translate" values="0 0;0 -0.6;0 0" dur={dur} repeatCount="indefinite" {...ease} />}
        <Head P={P} eyesClosed={eyesClosed} reduced={reduced} />
      </g>
    </g>
  );
}

export default {
  id: "cat",
  name: "cat",
  called: "Pantha Bak",
  intro: "a cat called Pantha Bak",
  title: "Pantha Bak",
  aria: "A place in the mountains, a rock, and a cat",
  blurb: "A rescued cat. Old poems, in Chinese.",
  // Who Pantha is, told in About.
  story: [
    "Pantha was a rescue. Before, there was the street: the rain, the noise, and hands it learned not to trust.",
    "Then Bak Jian Xun carried it home. A bowl, a blanket, a quiet corner to sleep in, and a surname to share. Pantha Bak.",
    "Some of the old fear came along anyway. When it stirs, Pantha climbs the mountain, finds its rock, folds its paws, and sits until its mind is still again. It isn't trying to forget. Only to let the fear grow smaller than the mountain.",
    "The first person Pantha invited up was Jian Xun. It will be grateful for the rest of its nine lives, though, being a cat, it will never say so. There is room on the rock for you, too.",
  ],
  font: FONT,
  palettes: PALETTES,
  lines: LINES,
  classical: CLASSICAL,
  modernFilled: MODERN_FILLED,
  all: ALL,
  storageKey: "pantha-bak-state",
  onsen: { x: 272, y: 234 },
  portraitViewBox: "-54 -52 108 76",
  Creature: Cat,
};
