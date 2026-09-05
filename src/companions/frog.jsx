import React from "react";

// Palettes for the hours of the day. The phone's clock decides.
const PALETTES = {
  morning: { paper: "#E3DBCF", paperDeep: "#D4C9BB", ink: "#2B2D2A", inkSoft: "#5A5851", mist: "#C4B5AB", band: "#E0B7A6", sun: "#E8B98A", moss: "#6B7F4A", mossDeep: "#4E5F36", tea: "#A0724F", stars: false, name: "Morning." },
  noon:    { paper: "#DCD9D0", paperDeep: "#CFCBC0", ink: "#2B2D2A", inkSoft: "#55584F", mist: "#B8BBB3", band: null,      sun: "#E9DDB8", moss: "#6B7F4A", mossDeep: "#4E5F36", tea: "#A0724F", stars: false, name: "Noon." },
  evening: { paper: "#D9CDBF", paperDeep: "#C9B9A8", ink: "#2B2D2A", inkSoft: "#5A5148", mist: "#B39D8F", band: "#D6A672", sun: "#DDA062", moss: "#647645", mossDeep: "#485833", tea: "#A0724F", stars: false, name: "Evening." },
  dusk:    { paper: "#B8AAAE", paperDeep: "#A6979C", ink: "#2B2D2A", inkSoft: "#4C4548", mist: "#8F8087", band: "#C98E8A", sun: "#C97D68", moss: "#5D6E41", mossDeep: "#425032", tea: "#A0724F", stars: true,  name: "Dusk." },
  night:   { paper: "#3E444C", paperDeep: "#333940", ink: "#D9D6CC", inkSoft: "#A6A9A3", mist: "#5A626B", band: null,      sun: null,      moss: "#556742", mossDeep: "#3A4830", tea: "#B78A63", stars: true,  name: "Night." },
};

const LINES = {
  any: [
    "The frog is here.", "Still here.", "Nothing to do yet.", "Sitting, as usual.", "Nowhere to go.",
    "Same rock, different mountain.", "The frog has been waiting. Not for you, particularly.",
    "It is what it looks like.", "Nothing has happened. Good.", "The frog is not thinking about anything.",
    "One rock is enough.", "The frog did not come from anywhere.", "Whatever you brought, put it down here.",
    "The mountain has no opinion.", "Nothing is missing.", "The frog is doing exactly this.",
    "You are on time.", "The rock is where it was.", "This is the place.", "The frog blinks. That's the news.",
    "", "", "",
  ],
  morning: ["Morning. The frog got here first.", "Early. The mist hasn't decided.", "The sun is up. So is the frog.", "First light on the rock."],
  noon: ["Noon. Nothing to add.", "The sun is high. The frog is low.", "Full daylight, and still nothing to do."],
  evening: ["Evening. The frog is still here.", "The light is going. The frog is staying.", "Long shadows. Short thoughts."],
  dusk: ["Dusk. The first star, if you look.", "Almost dark. The frog doesn't need the light.", "The day is closing quietly."],
  night: ["Night. Frog and moon, both up.", "Dark. The frog is a shape on the rock.", "Stars, a rock, a frog. Enough.", "The moon is doing its part."],
  rain: ["Rain. The frog is fine with it.", "Rain on the rock. The frog is the same colour wet.", "It's raining on everyone equally."],
  wind: ["A wind through the pass.", "The wind is passing. So is everything.", "Something moving in the grass. Not the frog."],
  leaves: ["Leaves coming down.", "The tree is letting go. The frog is watching.", "One leaf, then another. No hurry."],
  tea: ["Tea. Nothing else.", "The tea is warm. That's the whole plan.", "Tea first. Then more tea, maybe."],
  house: ["Someone lives here. They're not home.", "A house with no one in it. Still a house."],
  stream: ["The stream is going somewhere. The frog isn't.", "Water passing. Same water, never the same."],
  field: ["A field. Somebody planted it. Nobody's around.", "Grass, all the way to the mist."],
  onsen: ["The water is warm. The frog is warmer.", "Steam, stones, frog.", "The spring doesn't ask what you did today.", "Soaking. That's the practice for now."],
};

const FONT = `"Noto Serif SC", "Songti SC", "PingFang SC", "Source Han Serif", "SimSun", Georgia, "Times New Roman", serif`;

// Classical texts (all pre-modern, public domain). English is a plain reading, not a scholarly translation.
const TEXTS = [
  { id: "wm1", zh: "趙州和尚因僧問：狗子還有佛性也無？州云：無。", en: "A monk asked Zhaozhou: does a dog have Buddha-nature? Zhaozhou said: wu.", src: "無門關 · 第一則" },
  { id: "wm7", zh: "州云：喫粥了也未？僧云：喫粥了也。州云：洗鉢盂去。", en: "Zhaozhou: have you eaten your porridge? The monk: I have. Zhaozhou: then go wash your bowl.", src: "無門關 · 第七則" },
  { id: "wm19", zh: "南泉因趙州問：如何是道？泉云：平常心是道。", en: "Zhaozhou asked Nanquan: what is the Way? Nanquan said: ordinary mind is the Way.", src: "無門關 · 第十九則" },
  { id: "wm29", zh: "一云幡動，一云風動。祖云：不是風動，不是幡動，仁者心動。", en: "One monk said the flag moves; the other said the wind moves. The Patriarch said: not the wind, not the flag. Your mind moves.", src: "無門關 · 第二十九則" },
  { id: "wm37", zh: "趙州因僧問：如何是祖師西來意？州云：庭前柏樹子。", en: "A monk asked Zhaozhou: why did the Patriarch come from the west? Zhaozhou said: the cypress in the yard.", src: "無門關 · 第三十七則" },
  { id: "wm23", zh: "不思善，不思惡，正與麼時，那箇是明上座本來面目？", en: "Not thinking good, not thinking bad — right at this moment, what is your original face?", src: "無門關 · 第二十三則" },
  { id: "wm18", zh: "洞山因僧問：如何是佛？山云：麻三斤。", en: "A monk asked Dongshan: what is Buddha? Dongshan said: three pounds of flax.", src: "無門關 · 第十八則" },
  { id: "wm3", zh: "俱胝和尚凡有詰問，唯舉一指。", en: "Whenever Master Juzhi was asked anything, he only raised one finger.", src: "無門關 · 第三則" },
  { id: "wm16", zh: "雲門曰：世界恁麼廣闊，因甚向鐘聲裏披七條？", en: "Yunmen said: the world is this wide. Why do you put on your robe at the sound of the bell?", src: "無門關 · 第十六則" },
  { id: "zz", zh: "師問新到：曾到此間麼？云：曾到。師云：喫茶去。", en: "Zhaozhou asked a newcomer: have you been here before? Yes. Zhaozhou said: go drink tea.", src: "趙州錄" },
  { id: "by1", zh: "梁武帝問達磨大師：如何是聖諦第一義？磨云：廓然無聖。", en: "Emperor Wu asked Bodhidharma: what is the highest truth? Bodhidharma said: vast emptiness, nothing holy.", src: "碧巖錄 · 第一則" },
  { id: "tj", zh: "菩提本無樹，明鏡亦非臺，本來無一物，何處惹塵埃。", en: "Bodhi is not a tree; the bright mirror has no stand. Originally there is not one thing — where could dust settle?", src: "六祖壇經" },
  { id: "hs", zh: "吾心似秋月，碧潭清皎潔。無物堪比倫，教我如何說。", en: "My mind is like the autumn moon, a clear pool, bright and pure. Nothing compares to it. How would you have me say it?", src: "寒山詩" },
  { id: "ww", zh: "空山不見人，但聞人語響。返景入深林，復照青苔上。", en: "Empty mountain, no one seen — only the sound of voices. Late light enters the deep wood and falls again on the moss.", src: "王維 · 鹿柴" },
  // plainer, closer to the ground
  { id: "ym", zh: "日日是好日。", en: "Every day is a good day.", src: "雲門廣錄" },
  { id: "pang", zh: "神通並妙用，運水及搬柴。", en: "Miracles and wonders: carrying water, hauling firewood.", src: "龐居士語錄" },
  { id: "bz", zh: "一日不作，一日不食。", en: "A day without work is a day without eating.", src: "百丈懷海" },
  { id: "lj", zh: "隨處作主，立處皆真。", en: "Be at home wherever you are, and wherever you stand is the real thing.", src: "臨濟錄" },
  { id: "tj2", zh: "若真修道人，不見世間過。", en: "One who truly walks the path does not go looking for the faults of the world.", src: "六祖壇經" },
  { id: "dg", zh: "自己をならふといふは、自己をわするるなり。", en: "To study yourself is to forget yourself.", src: "道元 · 現成公案" },
  { id: "rk", zh: "盗人に取り残されし窓の月", en: "The thief left it behind — the moon at the window.", src: "良寬" },
  { id: "hs2", zh: "人問寒山道，寒山路不通。", en: "People ask the way to Cold Mountain. The road to Cold Mountain doesn't go through.", src: "寒山詩" },
];

// ---------- Your collection ----------
// Paraphrases of the teaching, so each is labelled "after". Add lines here; empty ones are ignored.
const MODERN = [
  // ---- Shunryu Suzuki ----
  // two of the book's own lines, for you to fill in from your copy if you want them:
  { id: "sz-00a", zh: "", en: "", src: "Shunryu Suzuki, Zen Mind, Beginner's Mind" },
  { id: "sz-00b", zh: "", en: "", src: "Shunryu Suzuki, Zen Mind, Beginner's Mind" },
  { id: "sz-01", zh: "忘了自己，便與周遭萬物合而為一。", en: "When you forget yourself, you become one with everything around you.", src: "after Shunryu Suzuki" },
  { id: "sz-02", zh: "修行不是為了得到什麼，而是讓真實的本性顯露出來。", en: "The purpose of practice is not to attain something, but to express your true nature.", src: "after Shunryu Suzuki" },
  { id: "sz-03", zh: "禪不是逃離平常生活，而是對平常生活的全然專注。", en: "Zen is not an escape from ordinary life; it is complete attention to ordinary life.", src: "after Shunryu Suzuki" },
  { id: "sz-04", zh: "做一件事，就全然投入，不留下自己的痕跡。", en: "When you do something, give yourself completely to it, without leaving a trace of yourself behind.", src: "after Shunryu Suzuki" },
  { id: "sz-05", zh: "要感謝心中的雜草，它們終會滋養你的修行。", en: "You should be grateful for the weeds in your mind, because they eventually enrich your practice.", src: "after Shunryu Suzuki" },
  { id: "sz-06", zh: "外頭沒有什麼能給你煩惱；起浪的是你自己的心。", en: "Nothing outside yourself can create your trouble; it is your own mind that creates the waves.", src: "after Shunryu Suzuki" },
  { id: "sz-07", zh: "要在不圓滿的存在裏，找到圓滿的存在。", en: "We should find perfect existence through imperfect existence.", src: "after Shunryu Suzuki" },
  { id: "sz-08", zh: "一切都在變。真正接受這一點，便能在變化中安住。", en: "Everything changes. When you truly accept this, you can find composure within change.", src: "after Shunryu Suzuki" },
  { id: "sz-09", zh: "最要緊的，是弄清楚什麼才真正要緊。", en: "The most important thing is to discover what is truly important.", src: "after Shunryu Suzuki" },
  { id: "sz-10", zh: "修行時，不要試著變成別人。就用你此刻的心去修。", en: "When you practice, don't try to become someone else. Simply practice with the mind you have now.", src: "after Shunryu Suzuki" },
  { id: "sz-11", zh: "你不能把自己當作身外的一件東西來研究；你得親身活在修行裏。", en: "You cannot study yourself as though you were an object outside yourself; you must live the practice.", src: "after Shunryu Suzuki" },
  { id: "sz-12", zh: "修行不是為了獲得，而是放下那些遮住眼睛的東西。", en: "Our practice is not about gaining something. It is about letting go of what prevents us from seeing clearly.", src: "after Shunryu Suzuki" },
  { id: "sz-13", zh: "全心投入手上的事時，就不必去想自己了。", en: "When you are completely involved in what you are doing, there is no need to think about yourself.", src: "after Shunryu Suzuki" },
  { id: "sz-14", zh: "要掌握一樣東西，往往是給它足夠的空間，而不是緊緊抓住。", en: "The way to control something is often to give it enough space rather than trying to hold it tightly.", src: "after Shunryu Suzuki" },
  { id: "sz-15", zh: "不執著於某個結果，才有真正的自由。", en: "True freedom comes when you are not attached to a particular result.", src: "after Shunryu Suzuki" },
  { id: "sz-16", zh: "我們修行，不是因為已經成功，而是因為願意重新開始。", en: "We practice not because we have succeeded, but because we are willing to begin again.", src: "after Shunryu Suzuki" },
  { id: "sz-17", zh: "修行的每一刻，都是全然做自己的一刻。", en: "A moment of practice is a moment of completely being yourself.", src: "after Shunryu Suzuki" },
  { id: "sz-18", zh: "坐的時候，不要試著變得平靜。只管坐，讓平靜與擾動各是其所是。", en: "When you sit, don't try to become calm. Simply sit, and let calmness and disturbance be what they are.", src: "after Shunryu Suzuki" },
  { id: "sz-19", zh: "初心不強求知道接下來會發生什麼。", en: "The beginner's mind does not insist on knowing what will happen next.", src: "after Shunryu Suzuki" },
  { id: "sz-20", zh: "完全接受了自己，才開始能接受其他一切。", en: "When you accept yourself completely, you can begin to accept everything else.", src: "after Shunryu Suzuki" },
  { id: "sz-21", zh: "生命永遠在此時此地發生；沒有別的地方可以修行。", en: "Our life is always happening here and now; there is nowhere else to practice.", src: "after Shunryu Suzuki" },
  { id: "sz-22", zh: "不要試著消滅念頭。讓它們生起、消散，不去抓住。", en: "Don't try to eliminate your thoughts. Let them arise and disappear without holding onto them.", src: "after Shunryu Suzuki" },
  { id: "sz-23", zh: "禪的修行不是累積經驗，而是完整地遇見每一次經驗。", en: "The practice of Zen is not to accumulate experiences, but to meet each experience completely.", src: "after Shunryu Suzuki" },
  { id: "sz-24", zh: "不再向外尋求時，你也許會發現，從來沒有缺少過什麼。", en: "When you stop seeking something outside yourself, you may discover that nothing was missing.", src: "after Shunryu Suzuki" },
  { id: "sz-25", zh: "理解無常最好的方法，不是想它，而是與它一起生活。", en: "The best way to understand impermanence is not merely to think about it, but to live with it.", src: "after Shunryu Suzuki" },
  { id: "sz-26", zh: "好的修行不會讓你變得特別；它讓你更徹底地平常。", en: "A good practice does not make you special; it makes you more completely ordinary.", src: "after Shunryu Suzuki" },
  { id: "sz-27", zh: "有初心，每一刻都是新的，因為你不強迫它成為你所預期的樣子。", en: "When you have beginner's mind, every moment is fresh because you are not forcing it to be what you expect.", src: "after Shunryu Suzuki" },

  // ---- Seung Sahn ----
  { id: "ss-01", zh: "不知道時，心是清楚的。以為知道了，心就複雜起來。", en: "When you don't know, your mind is clear. When you think you know, your mind becomes complicated.", src: "after Seung Sahn" },
  { id: "ss-02", zh: "保持不知道的心，自己的想法製造出來的問題就會少一些。", en: "Keep a don't-know mind, and you will have fewer problems created by your own thinking.", src: "after Seung Sahn" },
  { id: "ss-03", zh: "失去不知道的心，就開始在沒有問題的地方製造問題。", en: "When you lose your don't-know mind, you begin creating problems where there were none.", src: "after Seung Sahn" },
  { id: "ss-04", zh: "問自己：「我是什麼？」不要滿足於一個頭腦上的答案。", en: "Ask yourself, ‘What am I?’ and don't be satisfied with an intellectual answer.", src: "after Seung Sahn" },
  { id: "ss-05", zh: "吃飯時只管吃飯，睡覺時只管睡覺，做事時只管做事。", en: "When you eat, just eat. When you sleep, just sleep. When you work, just work.", src: "after Seung Sahn" },
  { id: "ss-06", zh: "不造作，不執取，不排斥。", en: "Don't make anything. Don't cling to anything. Don't reject anything.", src: "after Seung Sahn" },
  { id: "ss-07", zh: "生氣時，不要試著變成一個不生氣的人。只是清楚地看見那個氣。", en: "When you are angry, don't try to become someone who isn't angry. Just see the anger clearly.", src: "after Seung Sahn" },
  { id: "ss-08", zh: "你的意見會擋住你，看不見正在發生的事。", en: "Your opinions can prevent you from seeing what is actually happening.", src: "after Seung Sahn" },
  { id: "ss-09", zh: "放下你的意見，心就清楚得足以看見眼前的處境。", en: "Put down your opinions and your mind becomes clear enough to see the situation.", src: "after Seung Sahn" },
  { id: "ss-10", zh: "不知道，你便自由，能回應處境，而不是跟隨自己的假設。", en: "If you don't know, you are free to respond to the situation instead of following your assumptions.", src: "after Seung Sahn" },
  { id: "ss-11", zh: "心清楚了，處境就清楚了，你也就知道該做什麼。", en: "When your mind is clear, your situation is clear, and you know what to do.", src: "after Seung Sahn" },
  { id: "ss-12", zh: "不要不停地檢查自己。只管做該做的事。", en: "Don't check yourself constantly. Just do what needs to be done.", src: "after Seung Sahn" },
  { id: "ss-13", zh: "有人餓了，給他吃的；有人渴了，給他喝的。", en: "If someone is hungry, feed them. If someone is thirsty, give them something to drink.", src: "after Seung Sahn" },
  { id: "ss-14", zh: "修行的目的，不是為自己開悟，而是幫助一切眾生。", en: "The purpose of practice is not to become enlightened for yourself, but to help all beings.", src: "after Seung Sahn" },
  { id: "ss-15", zh: "連你對禪的理解，也不要執著。", en: "Don't become attached even to your understanding of Zen.", src: "after Seung Sahn" },
  { id: "ss-16", zh: "不再造作「我」與「我的」，自己與他人之間的隔閡便不再那麼堅實。", en: "When you stop making ‘I’ and ‘my,’ the separation between yourself and others becomes less solid.", src: "after Seung Sahn" },
  { id: "ss-17", zh: "你的思想自成一個世界；別把那個世界當成真實。", en: "Your thinking creates a world of its own; don't confuse that world with reality.", src: "after Seung Sahn" },
  { id: "ss-18", zh: "過去已經過去，未來還沒到來。此刻你能做什麼？", en: "The past is already gone and the future has not arrived. What can you do right now?", src: "after Seung Sahn" },
  { id: "ss-19", zh: "不要一輩子都在檢查自己做得對不對。看清處境，然後行動。", en: "Don't spend your life checking whether you are doing the right thing. See the situation and act.", src: "after Seung Sahn" },
  { id: "ss-20", zh: "遇到困難的處境，不要用自己的想法把困難放大。", en: "When you encounter a difficult situation, don't make the difficulty bigger with your thinking.", src: "after Seung Sahn" },
  { id: "ss-21", zh: "清楚的心不是沒有念頭，而是不被念頭所控制。", en: "A clear mind doesn't mean having no thoughts; it means not being controlled by them.", src: "after Seung Sahn" },
  { id: "ss-22", zh: "不要試著留住好的經驗，也不要試著推開壞的。", en: "Don't try to hold onto good experiences and don't try to push away bad ones.", src: "after Seung Sahn" },
  { id: "ss-23", zh: "遇見一個人時，不要遇見你對他的想法。遇見那個真正在眼前的人。", en: "When you meet another person, don't meet your idea of them. Meet the person who is actually there.", src: "after Seung Sahn" },
  { id: "ss-24", zh: "看見什麼，只管看見；聽見什麼，只管聽見。", en: "When you see something, just see it. When you hear something, just hear it.", src: "after Seung Sahn" },
  { id: "ss-25", zh: "不要把自己弄得特別。只管完全做自己，完全在此刻。", en: "Don't make yourself special. Just be completely yourself and completely present.", src: "after Seung Sahn" },
  { id: "ss-26", zh: "執著於自己是對的，就無法從處境中學到東西。", en: "If you are attached to being right, you cannot learn from the situation.", src: "after Seung Sahn" },
  { id: "ss-27", zh: "不知道的心，是願意遇見每一刻，而不事先要求答案。", en: "Don't-know mind means being willing to meet each moment without demanding an answer beforehand.", src: "after Seung Sahn" },
  { id: "ss-28", zh: "禪不是逃避問題，而是看清處境，正確地回應。", en: "Zen is not about escaping your problems; it is about seeing your situation clearly and responding correctly.", src: "after Seung Sahn" },
  { id: "ss-29", zh: "大疑問不是用言語回答的，而是用生命活出來的。", en: "The great question is not something you answer with words; it is something you live.", src: "after Seung Sahn" },
  { id: "ss-30", zh: "幫助一個人時，不要編一個自己是好人的故事。只管幫。", en: "When you help someone, don't make a story about yourself being a good person. Just help.", src: "after Seung Sahn" },
];

// The two collections together.
const CLASSICAL = TEXTS;
const MODERN_FILLED = MODERN.filter((t) => t.en && t.en.trim());
const ALL = [...CLASSICAL, ...MODERN_FILLED];

// The frog: a body that breathes, a head that lifts a little, eyes that blink or close.
function Frog({ P, eyesClosed, reduced, inWater }) {
  return (
    <g>
      {inWater ? (
        <ellipse cx="0" cy="0" rx="20" ry="13" fill={P.moss} stroke={P.mossDeep} strokeWidth="1" />
      ) : (
        <ellipse cx="0" cy="0" rx="20" ry="13" fill={P.moss} stroke={P.mossDeep} strokeWidth="1">
          {!reduced && <animate attributeName="rx" values="20;21;20" dur={eyesClosed ? "9s" : "5.5s"} repeatCount="indefinite" calcMode="spline" keySplines="0.45 0 0.55 1;0.45 0 0.55 1" />}
          {!reduced && <animate attributeName="ry" values="13;13.8;13" dur={eyesClosed ? "9s" : "5.5s"} repeatCount="indefinite" calcMode="spline" keySplines="0.45 0 0.55 1;0.45 0 0.55 1" />}
          {!reduced && <animate attributeName="cy" values="0;-0.7;0" dur={eyesClosed ? "9s" : "5.5s"} repeatCount="indefinite" calcMode="spline" keySplines="0.45 0 0.55 1;0.45 0 0.55 1" />}
        </ellipse>
      )}
        <g>
          {!reduced && <animateTransform attributeName="transform" type="translate" values="0 0;0 -0.7;0 0" dur={eyesClosed ? "9s" : "5.5s"} repeatCount="indefinite" calcMode="spline" keySplines="0.45 0 0.55 1;0.45 0 0.55 1" />}
        <ellipse cx="0" cy="-10" rx="15" ry="10" fill={P.moss} stroke={P.mossDeep} strokeWidth="1" />
        <circle cx="-7" cy="-17" r="4.5" fill={P.moss} stroke={P.mossDeep} strokeWidth="1" />
        <circle cx="7" cy="-17" r="4.5" fill={P.moss} stroke={P.mossDeep} strokeWidth="1" />
        {eyesClosed ? (
          <g>
            <g stroke={P.ink} strokeWidth="1.3" strokeLinecap="round" fill="none">
              <path d="M-9.5 -17 Q-7 -15 -4.5 -17" />
              <path d="M4.5 -17 Q7 -15 9.5 -17" />
            </g>
            <g stroke={P.paper} strokeWidth="0.7" strokeLinecap="round" opacity="0.9" fill="none">
              <path d="M-8.6 -15.6 Q-7 -14.9 -5.4 -15.6" />
              <path d="M5.4 -15.6 Q7 -14.9 8.6 -15.6" />
            </g>
          </g>
        ) : (
          <g fill={P.ink}>
            <circle cx="-7" cy="-17" r="1.8">
              {!reduced && <animate attributeName="r" values="1.8;1.8;0.2;1.8;1.8" keyTimes="0;0.92;0.95;0.98;1" dur="6s" repeatCount="indefinite" />}
            </circle>
            <circle cx="7" cy="-17" r="1.8">
              {!reduced && <animate attributeName="r" values="1.8;1.8;0.2;1.8;1.8" keyTimes="0;0.92;0.95;0.98;1" dur="6s" repeatCount="indefinite" />}
            </circle>
          </g>
        )}
        <path d="M-6 -5 Q0 -2 6 -5" stroke={P.mossDeep} strokeWidth="1" fill="none" strokeLinecap="round" />
        </g>
      {!inWater && (
        <path d="M-14 -4 Q0 4 14 -6" stroke={P.tea} strokeWidth="1.6" fill="none" />
      )}
    </g>
  );
}

export default {
  id: "frog",
  name: "frog",
  title: "山中蛙",
  aria: "A place in the mountains, a rock, and a frog",
  blurb: "A frog. Chan lines, in Chinese.",
  other: {"name":"dog","article":"a"},
  font: FONT,
  palettes: PALETTES,
  lines: LINES,
  classical: CLASSICAL,
  modernFilled: MODERN_FILLED,
  all: ALL,
  storageKey: "chan-frog-sam-state",
  onsen: {"x":272,"y":226},
  Creature: Frog,
};