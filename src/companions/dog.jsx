import React from "react";

// Palettes for the hours of the day. The phone's clock decides.
const PALETTES = {
  morning: { paper: "#E3DBCF", paperDeep: "#D4C9BB", ink: "#2B2D2A", inkSoft: "#5A5851", mist: "#C4B5AB", band: "#E0B7A6", sun: "#E8B98A", moss: "#6B7F4A", mossDeep: "#4E5F36", tea: "#A0724F", coat: "#C98B52", coatDeep: "#8F5E33", cream: "#EFE6D6", stars: false, name: "Morning." },
  noon:    { paper: "#DCD9D0", paperDeep: "#CFCBC0", ink: "#2B2D2A", inkSoft: "#55584F", mist: "#B8BBB3", band: null,      sun: "#E9DDB8", moss: "#6B7F4A", mossDeep: "#4E5F36", tea: "#A0724F", coat: "#C98B52", coatDeep: "#8F5E33", cream: "#EFE6D6", stars: false, name: "Noon." },
  evening: { paper: "#D9CDBF", paperDeep: "#C9B9A8", ink: "#2B2D2A", inkSoft: "#5A5148", mist: "#B39D8F", band: "#D6A672", sun: "#DDA062", moss: "#647645", mossDeep: "#485833", tea: "#A0724F", coat: "#BF824B", coatDeep: "#875730", cream: "#E9DCC8", stars: false, name: "Evening." },
  dusk:    { paper: "#B8AAAE", paperDeep: "#A6979C", ink: "#2B2D2A", inkSoft: "#4C4548", mist: "#8F8087", band: "#C98E8A", sun: "#C97D68", moss: "#5D6E41", mossDeep: "#425032", tea: "#A0724F", coat: "#A9743F", coatDeep: "#74492A", cream: "#D3C6B6", stars: true,  name: "Dusk." },
  night:   { paper: "#3E444C", paperDeep: "#333940", ink: "#D9D6CC", inkSoft: "#A6A9A3", mist: "#5A626B", band: null,      sun: null,      moss: "#556742", mossDeep: "#3A4830", tea: "#B78A63", coat: "#9A6B44", coatDeep: "#5E3F24", cream: "#C9BFAE", stars: true,  name: "Night." },
};

const LINES = {
  any: [
    "The dog is here.", "Still here.", "Nothing to do yet.", "Sitting, as usual.", "Nowhere to go.",
    "Same rock, different mountain.", "The dog has been waiting. Not for you, particularly.",
    "It is what it looks like.", "Nothing has happened. Good.", "The dog is not thinking about anything.",
    "One rock is enough.", "The dog did not come from anywhere.", "Whatever you brought, put it down here.",
    "The mountain has no opinion.", "Nothing is missing.", "The dog is doing exactly this.",
    "You are on time.", "The rock is where it was.", "This is the place.", "The dog's ears moved. That's the news.",
    "The dog heard something. It was nothing.", "A good dog. Not that anyone asked.",
    "", "", "",
  ],
  morning: ["Morning. The dog got here first.", "Early. The mist hasn't decided.", "The sun is up. So is the dog.", "First light on the rock."],
  noon: ["Noon. Nothing to add.", "The sun is high. The dog is dozing.", "Full daylight, and still nothing to do."],
  evening: ["Evening. The dog is still here.", "The light is going. The dog is staying.", "Long shadows. Short thoughts."],
  dusk: ["Dusk. The first star, if you look.", "Almost dark. The dog doesn't need the light.", "The day is closing quietly."],
  night: ["Night. Dog and moon, both up.", "Dark. The dog is a shape on the rock.", "Stars, a rock, a dog. Enough.", "The moon is doing its part."],
  rain: ["Rain. The dog is fine with it.", "Rain on the rock. The dog is a darker colour wet.", "It's raining on everyone equally."],
  wind: ["A wind through the pass.", "The wind is passing. So is everything.", "Something moving in the grass. The dog noticed. Then didn't."],
  leaves: ["Leaves coming down.", "The tree is letting go. The dog is watching.", "One leaf, then another. No hurry."],
  tea: ["Tea. Nothing else.", "The tea is warm. That's the whole plan.", "Tea first. Then more tea, maybe."],
  house: ["Someone lives here. They're not home.", "A house with no one in it. Still a house."],
  stream: ["The stream is going somewhere. The dog isn't.", "Water passing. Same water, never the same."],
  field: ["A field. Somebody planted it. Nobody's around.", "Grass, all the way to the mist."],
  onsen: ["The water is warm. The dog is warmer.", "Steam, stones, dog.", "The spring doesn't ask what you did today.", "Soaking. That's the practice for now."],
};

const FONT = `"Noto Serif JP", "Hiragino Mincho ProN", "Yu Mincho", "Source Han Serif", "Noto Serif SC", Georgia, "Times New Roman", serif`;

// Classical texts (all pre-modern, public domain). English is a plain reading, not a scholarly translation.
const TEXTS = [
  { id: "wm1", zh: "趙州和尚、因みに僧問ふ、狗子に還た仏性有りや無しや。州云く、無。", en: "A monk asked Zhaozhou: does a dog have Buddha-nature? Zhaozhou said: mu.", src: "無門関 · 第一則" },
  { id: "bs1", zh: "古池や　蛙飛びこむ　水の音", en: "An old pond. A frog jumps in. The sound of water.", src: "松尾芭蕉" },
  { id: "bs2", zh: "閑さや　岩にしみ入る　蝉の声", en: "Stillness. The cicada's cry sinks into the rock.", src: "松尾芭蕉" },
  { id: "bs3", zh: "物言えば　唇寒し　秋の風", en: "Say something, and the lips go cold. Autumn wind.", src: "松尾芭蕉" },
  { id: "rk1", zh: "盗人に　取り残されし　窓の月", en: "The thief left it behind — the moon at the window.", src: "良寛" },
  { id: "rk2", zh: "散る桜　残る桜も　散る桜", en: "Falling blossoms. The blossoms that remain are falling too.", src: "良寛" },
  { id: "rk3", zh: "うらを見せ　おもてを見せて　散るもみぢ", en: "Showing its back, showing its front, the maple leaf falls.", src: "良寛" },
  { id: "rk4", zh: "焚くほどは　風がもてくる　落葉かな", en: "Enough for a fire — the wind brings the fallen leaves.", src: "良寛" },
  { id: "dg1", zh: "自己をならふといふは、自己をわするるなり。", en: "To study yourself is to forget yourself.", src: "道元 · 現成公案" },
  { id: "dg2", zh: "春は花　夏ほととぎす　秋は月　冬雪さえて　冷しかりけり", en: "Spring, blossoms. Summer, the cuckoo. Autumn, the moon. Winter, snow, clear and cold.", src: "道元 · 本来面目" },
  { id: "dg3", zh: "学道の人は、先ず須らく貧なるべし。", en: "One who studies the Way should first be poor.", src: "道元 · 正法眼蔵随聞記" },
  { id: "ik1", zh: "門松は　冥土の旅の　一里塚　めでたくもあり　めでたくもなし", en: "The New Year pine: a milestone on the road to the grave. Auspicious, and not.", src: "一休" },
  { id: "hk1", zh: "衆生本来仏なり。", en: "All beings are Buddha from the start.", src: "白隠 · 坐禅和讃" },
  { id: "is1", zh: "やれ打つな　蠅が手をすり　足をする", en: "Don't swat it. The fly wrings its hands, wrings its feet.", src: "小林一茶" },
  { id: "is2", zh: "露の世は　露の世ながら　さりながら", en: "This dewdrop world is a dewdrop world. And yet. And yet.", src: "小林一茶" },
  { id: "bu1", zh: "菜の花や　月は東に　日は西に", en: "Rape blossoms. The moon in the east, the sun in the west.", src: "与謝蕪村" },
  { id: "kc1", zh: "ゆく河の流れは絶えずして、しかももとの水にあらず。", en: "The river flows without ceasing, and yet the water is never the same.", src: "鴨長明 · 方丈記" },
  { id: "ym", zh: "日日是好日。", en: "Every day is a good day.", src: "雲門 · 碧巌録" },
];

// ---------- Your collection ----------
// Paraphrases of the teaching, so each is labelled "after". Add lines here; empty ones are ignored.
const MODERN = [
  // Notes in the spirit of Shunryu Suzuki, in plain words of our own — labelled "after", not quoted.
  { id: "sz-01", zh: "自分を忘れれば、まわりのすべてとひとつになる。", en: "When you forget yourself, you become one with everything around you.", src: "after Shunryu Suzuki / 鈴木俊隆" },
  { id: "sz-02", zh: "修行は何かを得るためではなく、本来の性質をあらわすためにある。", en: "The purpose of practice is not to attain something, but to express your true nature.", src: "after Shunryu Suzuki / 鈴木俊隆" },
  { id: "sz-03", zh: "禅は日常からの逃避ではない。日常への全き注意である。", en: "Zen is not an escape from ordinary life; it is complete attention to ordinary life.", src: "after Shunryu Suzuki / 鈴木俊隆" },
  { id: "sz-04", zh: "何かをするときは、自分の痕跡を残さぬほどに、それに身をあずける。", en: "When you do something, give yourself completely to it, without leaving a trace of yourself behind.", src: "after Shunryu Suzuki / 鈴木俊隆" },
  { id: "sz-05", zh: "心の雑草に感謝すること。やがてそれが修行を肥やす。", en: "You should be grateful for the weeds in your mind, because they eventually enrich your practice.", src: "after Shunryu Suzuki / 鈴木俊隆" },
  { id: "sz-06", zh: "外の何ものも、あなたを悩ませることはできない。波を立てるのは自分の心だ。", en: "Nothing outside yourself can create your trouble; it is your own mind that creates the waves.", src: "after Shunryu Suzuki / 鈴木俊隆" },
  { id: "sz-07", zh: "不完全な存在をとおして、完全な存在を見いだす。", en: "We should find perfect existence through imperfect existence.", src: "after Shunryu Suzuki / 鈴木俊隆" },
  { id: "sz-08", zh: "すべては変わる。それを本当に受け入れたとき、変化のなかで落ち着いていられる。", en: "Everything changes. When you truly accept this, you can find composure within change.", src: "after Shunryu Suzuki / 鈴木俊隆" },
  { id: "sz-09", zh: "いちばん大切なのは、何が本当に大切かを見つけること。", en: "The most important thing is to discover what is truly important.", src: "after Shunryu Suzuki / 鈴木俊隆" },
  { id: "sz-10", zh: "修行のとき、誰か別の人になろうとしない。いまある心で、ただ坐る。", en: "When you practice, don't try to become someone else. Simply practice with the mind you have now.", src: "after Shunryu Suzuki / 鈴木俊隆" },
  { id: "sz-11", zh: "自分を外の物のように調べることはできない。修行を生きるほかない。", en: "You cannot study yourself as though you were an object outside yourself; you must live the practice.", src: "after Shunryu Suzuki / 鈴木俊隆" },
  { id: "sz-12", zh: "修行は得るためではない。見ることを妨げているものを手放すためだ。", en: "Our practice is not about gaining something. It is about letting go of what prevents us from seeing clearly.", src: "after Shunryu Suzuki / 鈴木俊隆" },
  { id: "sz-13", zh: "していることに全く入りこんでいるとき、自分のことを考える必要はない。", en: "When you are completely involved in what you are doing, there is no need to think about yourself.", src: "after Shunryu Suzuki / 鈴木俊隆" },
  { id: "sz-14", zh: "何かを扱うには、きつく握るより、じゅうぶんな場所を与えるほうがよい。", en: "The way to control something is often to give it enough space rather than trying to hold it tightly.", src: "after Shunryu Suzuki / 鈴木俊隆" },
  { id: "sz-15", zh: "ある結果に執着しないとき、本当の自由がある。", en: "True freedom comes when you are not attached to a particular result.", src: "after Shunryu Suzuki / 鈴木俊隆" },
  { id: "sz-16", zh: "成功したから修行するのではない。また始める心があるから修行する。", en: "We practice not because we have succeeded, but because we are willing to begin again.", src: "after Shunryu Suzuki / 鈴木俊隆" },
  { id: "sz-17", zh: "修行のひとときは、まったく自分自身であるひとときだ。", en: "A moment of practice is a moment of completely being yourself.", src: "after Shunryu Suzuki / 鈴木俊隆" },
  { id: "sz-18", zh: "坐るとき、静かになろうとしない。ただ坐り、静けさも乱れも、そのままにしておく。", en: "When you sit, don't try to become calm. Simply sit, and let calmness and disturbance be what they are.", src: "after Shunryu Suzuki / 鈴木俊隆" },
  { id: "sz-19", zh: "初心は、次に何が起こるかを知ろうと固執しない。", en: "The beginner's mind does not insist on knowing what will happen next.", src: "after Shunryu Suzuki / 鈴木俊隆" },
  { id: "sz-20", zh: "自分をまるごと受け入れたとき、ほかのすべてを受け入れはじめる。", en: "When you accept yourself completely, you can begin to accept everything else.", src: "after Shunryu Suzuki / 鈴木俊隆" },
  { id: "sz-21", zh: "いのちはいつも今ここで起こっている。修行する場所はほかにない。", en: "Our life is always happening here and now; there is nowhere else to practice.", src: "after Shunryu Suzuki / 鈴木俊隆" },
  { id: "sz-22", zh: "考えを消そうとしない。起こり、消えるままに、つかまない。", en: "Don't try to eliminate your thoughts. Let them arise and disappear without holding onto them.", src: "after Shunryu Suzuki / 鈴木俊隆" },
  { id: "sz-23", zh: "禅の修行は経験を積むことではなく、ひとつひとつの経験に全く出会うことだ。", en: "The practice of Zen is not to accumulate experiences, but to meet each experience completely.", src: "after Shunryu Suzuki / 鈴木俊隆" },
  { id: "sz-24", zh: "外に何かを求めるのをやめたとき、何も欠けていなかったと気づくかもしれない。", en: "When you stop seeking something outside yourself, you may discover that nothing was missing.", src: "after Shunryu Suzuki / 鈴木俊隆" },
  { id: "sz-25", zh: "無常を知るいちばんの方法は、考えることではなく、ともに生きることだ。", en: "The best way to understand impermanence is not merely to think about it, but to live with it.", src: "after Shunryu Suzuki / 鈴木俊隆" },
  { id: "sz-26", zh: "よい修行はあなたを特別にはしない。もっと徹底して平凡にする。", en: "A good practice does not make you special; it makes you more completely ordinary.", src: "after Shunryu Suzuki / 鈴木俊隆" },
  { id: "sz-27", zh: "初心があれば、どの瞬間も新しい。期待した形に無理に合わせないから。", en: "When you have beginner's mind, every moment is fresh because you are not forcing it to be what you expect.", src: "after Shunryu Suzuki / 鈴木俊隆" },
];

// The two collections together.
const CLASSICAL = TEXTS;
const MODERN_FILLED = MODERN.filter((t) => t.en && t.en.trim());
const ALL = [...CLASSICAL, ...MODERN_FILLED];

// A round dog, dozing on its rock. Ears up, cream front, tail tucked at its side.
function Shiba({ P, eyesClosed, reduced }) {
  const dur = eyesClosed ? "9s" : "5.5s";
  const ease = { calcMode: "spline", keySplines: "0.45 0 0.55 1;0.45 0 0.55 1" };
  return (
    <g transform="translate(0 -4)">
      {/* tail: still, mostly; every so often a small wag */}
      <g>
        {!reduced && !eyesClosed && (
          <animateTransform attributeName="transform" type="rotate"
            values="0 20 4;0 20 4;-6 20 4;6 20 4;-5 20 4;4 20 4;0 20 4;0 20 4"
            keyTimes="0;0.86;0.88;0.9;0.92;0.94;0.96;1"
            dur="17s" repeatCount="indefinite" />
        )}
        <circle cx="26" cy="0" r="5" fill={P.coat} stroke={P.coatDeep} strokeWidth="1" />
        <circle cx="26" cy="0" r="2" fill={P.cream} />
      </g>
      {/* body, breathing */}
      <g>
        {!reduced && <animateTransform attributeName="transform" type="scale" values="1 1;1.02 1.035;1 1" dur={dur} repeatCount="indefinite" {...ease} additive="sum" />}
        <path d="M-30 6 Q-30 -26 0 -28 Q30 -26 30 6 Q30 12 22 12 L-22 12 Q-30 12 -30 6 Z" fill={P.coat} stroke={P.coatDeep} strokeWidth="1" />
        <path d="M-18 12 Q-16 -6 0 -6 Q16 -6 18 12 Z" fill={P.cream} />
        {/* ears */}
        <path d="M-22 -18 L-19 -30 L-11 -22 Z M22 -18 L19 -30 L11 -22 Z" fill={P.coat} stroke={P.coatDeep} strokeWidth="1" strokeLinejoin="round" />
        <path d="M-20 -20 L-18.5 -27 L-13.5 -22 Z M20 -20 L18.5 -27 L13.5 -22 Z" fill={P.cream} opacity="0.7" />
        {/* eyes */}
        {eyesClosed ? (
          <g>
            <path d="M-11 -12 Q-8 -9 -5 -12 M5 -12 Q8 -9 11 -12" fill="none" stroke={P.ink} strokeWidth="1.2" strokeLinecap="round" />
            <path d="M-10 -10.4 Q-8 -9.8 -6 -10.4 M6 -10.4 Q8 -9.8 10 -10.4" fill="none" stroke={P.paper} strokeWidth="0.6" strokeLinecap="round" opacity="0.9" />
          </g>
        ) : (
          <g fill={P.ink}>
            <circle cx="-8" cy="-11.5" r="1.7">
              {!reduced && <animate attributeName="r" values="1.7;1.7;0.2;1.7;1.7" keyTimes="0;0.92;0.95;0.98;1" dur="6s" repeatCount="indefinite" />}
            </circle>
            <circle cx="8" cy="-11.5" r="1.7">
              {!reduced && <animate attributeName="r" values="1.7;1.7;0.2;1.7;1.7" keyTimes="0;0.92;0.95;0.98;1" dur="6s" repeatCount="indefinite" />}
            </circle>
          </g>
        )}
        <ellipse cx="0" cy="-5" rx="2.2" ry="1.6" fill={P.ink} />
        <path d="M-8 0 Q0 4 8 0" fill="none" stroke={P.coatDeep} strokeWidth="0.9" strokeLinecap="round" />
      </g>
    </g>
  );
}


export default {
  id: "dog",
  name: "dog",
  title: "山のいぬ",
  aria: "A place in the mountains, a rock, and a dog",
  blurb: "A dog. Zen lines and haiku, in Japanese.",
  other: {"name":"frog","article":"a"},
  font: FONT,
  palettes: PALETTES,
  lines: LINES,
  classical: CLASSICAL,
  modernFilled: MODERN_FILLED,
  all: ALL,
  storageKey: "yamanoinu-state",
  onsen: {"x":272,"y":222},
  Creature: Shiba,
};