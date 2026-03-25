import { useState, useEffect, useRef } from "react";

const DAJIA_SCHEDULE = [
  { date: "4/17（五）", lunar: "三月初二", event: "起駕", time: "22:05", location: "大甲鎮瀾宮", desc: "起駕典禮，媽祖鑾轎正式出發", color: "#E63946" },
  { date: "4/18（六）", lunar: "三月初三", event: "駐駕", time: "深夜", location: "彰化南瑤宮", desc: "第一天行程，抵達彰化南瑤宮駐駕", color: "#457B9D" },
  { date: "4/19（日）", lunar: "三月初四", event: "駐駕", time: "深夜", location: "西螺福興宮", desc: "經彰化市區前往雲林西螺", color: "#457B9D" },
  { date: "4/20（一）", lunar: "三月初五", event: "抵達", time: "—", location: "新港奉天宮", desc: "抵達嘉義新港奉天宮，進香目的地", color: "#2A9D8F" },
  { date: "4/21（二）", lunar: "三月初六", event: "祝壽大典", time: "08:00", location: "新港奉天宮", desc: "祝壽大典，為媽祖祝壽，開始回程", color: "#E9C46A" },
  { date: "4/22（三）", lunar: "三月初七", event: "回程駐駕", time: "—", location: "西螺福興宮", desc: "回程第一站", color: "#F4A261" },
  { date: "4/23（四）", lunar: "三月初八", event: "回程駐駕", time: "—", location: "北斗奠安宮", desc: "回程經北斗鎮", color: "#F4A261" },
  { date: "4/24（五）", lunar: "三月初九", event: "回程駐駕", time: "—", location: "彰化天后宮", desc: "回程經彰化市", color: "#F4A261" },
  { date: "4/25（六）", lunar: "三月初十", event: "回程駐駕", time: "—", location: "清水朝興宮", desc: "回程最後一站", color: "#F4A261" },
  { date: "4/26（日）", lunar: "三月十一", event: "回鑾安座", time: "—", location: "大甲鎮瀾宮", desc: "回到大甲鎮瀾宮，安座典禮，圓滿結束", color: "#E63946" },
];

const BST_SCHEDULE = [
  { date: "4/12（日）", lunar: "二月廿六", event: "登轎起駕", time: "23:55", location: "白沙屯拱天宮", desc: "登轎起駕出發，展開進香之旅", color: "#E63946" },
  { date: "4/13（一）", lunar: "二月廿七", event: "南下行程", time: "00:10", location: "路線不固定", desc: "凌晨正式出發，路線由媽祖指引", color: "#D63384" },
  { date: "4/14（二）", lunar: "二月廿八", event: "南下行程", time: "—", location: "路線不固定", desc: "繼續南下，粉紅超跑全速前進", color: "#D63384" },
  { date: "4/15（三）", lunar: "二月廿九", event: "南下行程", time: "—", location: "路線不固定", desc: "逐漸接近雲林北港", color: "#D63384" },
  { date: "4/16（四）", lunar: "二月三十", event: "抵達北港", time: "11:00", location: "北港朝天宮", desc: "抵達北港朝天宮", color: "#2A9D8F" },
  { date: "4/17（五）", lunar: "三月初一", event: "進火", time: "00:10", location: "北港朝天宮", desc: "進火儀式完成", color: "#E9C46A" },
  { date: "4/18（六）", lunar: "三月初二", event: "回程", time: "—", location: "路線不固定", desc: "展開回程，路線同樣由媽祖指引", color: "#F4A261" },
  { date: "4/19（日）", lunar: "三月初三", event: "回程", time: "—", location: "路線不固定", desc: "回程途中", color: "#F4A261" },
  { date: "4/20（一）", lunar: "三月初四", event: "回宮", time: "16:10", location: "白沙屯拱天宮", desc: "回到拱天宮，圓滿完成進香", color: "#E63946" },
];

const TEMPLES = [
  { name: "大甲鎮瀾宮", type: "dajia", role: "起駕 / 回鑾", address: "台中市大甲區順天路158號", desc: "台灣媽祖信仰代表廟宇，建於1730年，國家重要民俗文化資產。每年遶境出發地與終點。", highlight: true },
  { name: "彰化南瑤宮", type: "dajia", role: "去程第一站駐駕", address: "彰化縣彰化市南瑤路43號", desc: "彰化重要媽祖廟，去程第一天駐駕宮廟。" },
  { name: "西螺福興宮", type: "dajia", role: "去程/回程駐駕", address: "雲林縣西螺鎮延平路180號", desc: "又稱太平媽，去程與回程皆駐駕。" },
  { name: "新港奉天宮", type: "dajia", role: "目的地・祝壽大典", address: "嘉義縣新港鄉大興路75號", desc: "遶境終點站，1988年後取代北港成為進香目的地。4/21舉行祝壽大典。", highlight: true },
  { name: "北斗奠安宮", type: "dajia", role: "回程駐駕", address: "彰化縣北斗鎮光復路76號", desc: "回程駐駕宮廟之一，位於北斗市區。" },
  { name: "彰化天后宮", type: "dajia", role: "回程駐駕", address: "彰化縣彰化市永福里中華路239巷19號", desc: "彰化歷史悠久的媽祖廟，回程駐駕。" },
  { name: "清水朝興宮", type: "dajia", role: "回程最後駐駕", address: "台中市清水區中山路92號", desc: "回到大甲前最後一站駐駕宮廟。" },
  { name: "白沙屯拱天宮", type: "bst", role: "起駕 / 回宮", address: "苗栗縣通霄鎮白東里8號", desc: "建於1863年（同治二年），白沙屯信仰中心。媽祖進香出發地，擁有200多年進香歷史。", highlight: true },
  { name: "北港朝天宮", type: "bst", role: "進香目的地", address: "雲林縣北港鎮中山路178號", desc: "白沙屯媽祖進香目的地，台灣最知名的媽祖廟之一，香火鼎盛。", highlight: true },
];

const EQUIPMENT = [
  { category: "衣著", icon: "👕", items: ["排汗衣物（輕便、吸汗、透氣）", "寬鬆運動褲", "薄外套 / 防曬外套", "袖套防曬", "遮陽帽", "輕便雨衣", "換洗衣物 2-3 套"] },
  { category: "鞋襪", icon: "👟", items: ["舒適好走的運動鞋（建議大半號）", "五指襪減少磨擦", "備用鞋襪 2-3 雙", "可加一層鞋墊增加緩衝", "腳底貼酸痛貼布防水泡"] },
  { category: "隨身物品", icon: "🎒", items: ["輕量後背包", "毛巾（擦汗、遮頸防曬）", "水壺", "個人藥品", "防曬乳", "面紙 / 濕紙巾", "行動電源與充電線", "健保卡 / 身分證"] },
  { category: "選配裝備", icon: "⭐", items: ["登山杖（減輕膝蓋負擔）", "護膝", "消炎止痛藥", "小型手電筒 / 頭燈", "進香旗（鎮瀾宮領取）", "耳塞（夜間休息用）", "塑膠袋（防水用）"] },
];

const TABOOS = [
  { icon: "🥬", text: "出發前三天茹素淨身" },
  { icon: "🚫", text: "進香期間禁飲酒、賭博" },
  { icon: "🙏", text: "勿觸摸媽祖鑾轎" },
  { icon: "💬", text: "言行有禮，說話恭敬" },
  { icon: "🏠", text: "服喪未滿一年者避免參加" },
  { icon: "♻️", text: "垃圾不落地，珍惜供給資源" },
];

// Calendar component for April 2026
function CalendarView({ activeTab }) {
  const dajiaStart = 17, dajiaEnd = 26;
  const bstStart = 12, bstEnd = 20;
  
  const days = ["日", "一", "二", "三", "四", "五", "六"];
  // April 2026 starts on Wednesday (index 3)
  const startDayOfWeek = 3;
  const totalDays = 30;

  const cells = [];
  for (let i = 0; i < startDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);

  const getDayClass = (d) => {
    if (!d) return "";
    const isDajia = d >= dajiaStart && d <= dajiaEnd;
    const isBst = d >= bstStart && d <= bstEnd;
    if (activeTab === "all") {
      if (isDajia && isBst) return "both";
      if (isDajia) return "dajia";
      if (isBst) return "bst";
    } else if (activeTab === "dajia") {
      if (isDajia) return "dajia";
    } else {
      if (isBst) return "bst";
    }
    return "";
  };

  const getLabel = (d) => {
    if (d === 12) return "白起駕";
    if (d === 16) return "白到港";
    if (d === 17) return "甲起駕";
    if (d === 20 && (activeTab === "all" || activeTab === "bst")) return "白回宮";
    if (d === 21) return "祝壽典";
    if (d === 26) return "甲回鑾";
    return "";
  };

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <span style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Noto Serif TC', serif", color: "var(--ink)" }}>2026 年 4 月</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
        {days.map(d => (
          <div key={d} style={{ textAlign: "center", fontWeight: 700, fontSize: 13, padding: "6px 0", color: "var(--muted)", fontFamily: "'Noto Sans TC', sans-serif" }}>{d}</div>
        ))}
        {cells.map((d, i) => {
          const cls = getDayClass(d);
          const label = d ? getLabel(d) : "";
          const bg = cls === "dajia" ? "var(--dajia)" : cls === "bst" ? "var(--bst)" : cls === "both" ? "var(--both)" : "transparent";
          const textC = cls ? "#fff" : d ? "var(--ink)" : "transparent";
          const isToday = d === 25; // March 25 context
          return (
            <div key={i} style={{
              textAlign: "center", padding: "8px 2px", borderRadius: 10,
              background: bg, color: textC, position: "relative",
              minHeight: 54, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
              border: cls ? "none" : d ? "1px solid var(--border)" : "none",
              opacity: d ? 1 : 0,
            }}>
              <span style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Noto Sans TC', sans-serif" }}>{d || ""}</span>
              {label && <span style={{ fontSize: 9, fontWeight: 700, marginTop: 2, lineHeight: 1.1, letterSpacing: -0.3 }}>{label}</span>}
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 16, flexWrap: "wrap" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
          <span style={{ width: 14, height: 14, borderRadius: 4, background: "var(--dajia)", display: "inline-block" }} /> 大甲媽祖遶境
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
          <span style={{ width: 14, height: 14, borderRadius: 4, background: "var(--bst)", display: "inline-block" }} /> 白沙屯媽祖進香
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
          <span style={{ width: 14, height: 14, borderRadius: 4, background: "var(--both)", display: "inline-block" }} /> 兩者重疊
        </span>
      </div>
    </div>
  );
}

function ScheduleTimeline({ schedule, accentVar }) {
  return (
    <div style={{ position: "relative", paddingLeft: 24 }}>
      <div style={{ position: "absolute", left: 9, top: 8, bottom: 8, width: 3, background: `var(--${accentVar})`, opacity: 0.25, borderRadius: 2 }} />
      {schedule.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 16, marginBottom: 14, position: "relative", alignItems: "flex-start" }}>
          <div style={{
            width: 20, height: 20, borderRadius: "50%", background: item.color,
            border: "3px solid var(--card-bg)", position: "absolute", left: -24, top: 2,
            boxShadow: `0 0 0 2px ${item.color}44`, zIndex: 1, flexShrink: 0
          }} />
          <div style={{
            flex: 1, background: "var(--card-bg)", borderRadius: 12, padding: "12px 16px",
            border: "1px solid var(--border)", boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 4 }}>
              <span style={{ fontWeight: 800, fontSize: 14, color: item.color, fontFamily: "'Noto Sans TC', sans-serif" }}>{item.date}</span>
              <span style={{ fontSize: 11, color: "var(--muted)", fontFamily: "'Noto Sans TC', sans-serif" }}>農曆{item.lunar}</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: 15, marginTop: 4, fontFamily: "'Noto Serif TC', serif", color: "var(--ink)" }}>{item.event} — {item.location}</div>
            {item.time !== "—" && <div style={{ fontSize: 12, color: item.color, fontWeight: 600, marginTop: 2 }}>⏰ {item.time}</div>}
            <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4, lineHeight: 1.5 }}>{item.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TempleCard({ temple }) {
  return (
    <div style={{
      background: "var(--card-bg)", borderRadius: 14, padding: "18px 20px",
      border: temple.highlight ? `2px solid ${temple.type === "dajia" ? "var(--dajia)" : "var(--bst)"}` : "1px solid var(--border)",
      boxShadow: temple.highlight ? `0 4px 20px ${temple.type === "dajia" ? "var(--dajia)" : "var(--bst)"}22` : "0 1px 4px rgba(0,0,0,0.04)",
      transition: "transform 0.2s", position: "relative", overflow: "hidden"
    }}>
      {temple.highlight && <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 4,
        background: temple.type === "dajia" ? "var(--dajia)" : "var(--bst)"
      }} />}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
            background: temple.type === "dajia" ? "var(--dajia)" : "var(--bst)",
            color: "#fff", textTransform: "uppercase", letterSpacing: 0.5
          }}>{temple.type === "dajia" ? "大甲" : "白沙屯"}</span>
          <h3 style={{ fontSize: 18, fontWeight: 800, marginTop: 8, fontFamily: "'Noto Serif TC', serif", color: "var(--ink)", lineHeight: 1.3 }}>{temple.name}</h3>
        </div>
        <span style={{ fontSize: 24 }}>🏛️</span>
      </div>
      <div style={{ fontSize: 12, color: temple.type === "dajia" ? "var(--dajia)" : "var(--bst)", fontWeight: 700, marginTop: 4 }}>{temple.role}</div>
      <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 8, lineHeight: 1.6 }}>{temple.desc}</p>
      <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}>
        📍 {temple.address}
      </div>
    </div>
  );
}

function Section({ id, children }) {
  return (
    <section id={id} style={{ marginBottom: 48, scrollMarginTop: 80 }}>
      {children}
    </section>
  );
}

function SectionTitle({ children, emoji }) {
  return (
    <h2 style={{
      fontSize: 26, fontWeight: 900, fontFamily: "'Noto Serif TC', serif",
      color: "var(--ink)", marginBottom: 20, display: "flex", alignItems: "center", gap: 10,
      lineHeight: 1.3
    }}>
      <span style={{ fontSize: 28 }}>{emoji}</span> {children}
    </h2>
  );
}

export default function MazuPilgrimage() {
  const [activeTab, setActiveTab] = useState("all");
  const [scheduleTab, setScheduleTab] = useState("dajia");
  const [templeFilter, setTempleFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(false);

  const navItems = [
    { id: "calendar", label: "行事曆", icon: "📅" },
    { id: "schedule", label: "行程表", icon: "🗺️" },
    { id: "temples", label: "廟宇資訊", icon: "🏛️" },
    { id: "equipment", label: "裝備建議", icon: "🎒" },
    { id: "transport", label: "交通住宿", icon: "🚃" },
    { id: "taboos", label: "禁忌須知", icon: "⚠️" },
  ];

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const filteredTemples = templeFilter === "all" ? TEMPLES : TEMPLES.filter(t => t.type === templeFilter);

  const tabStyle = (active) => ({
    padding: "8px 18px", borderRadius: 24, border: "none", cursor: "pointer",
    fontWeight: 700, fontSize: 13, fontFamily: "'Noto Sans TC', sans-serif",
    background: active ? "var(--ink)" : "var(--card-bg)",
    color: active ? "var(--bg)" : "var(--muted)",
    transition: "all 0.2s", whiteSpace: "nowrap",
    boxShadow: active ? "0 2px 8px rgba(0,0,0,0.15)" : "none"
  });

  return (
    <div style={{
      "--bg": darkMode ? "#0f0f0f" : "#FFF8F0",
      "--card-bg": darkMode ? "#1a1a1a" : "#FFFFFF",
      "--ink": darkMode ? "#f5f0e8" : "#1a1a1a",
      "--muted": darkMode ? "#999" : "#666",
      "--border": darkMode ? "#2a2a2a" : "#e8e0d4",
      "--dajia": "#C53030",
      "--bst": "#D63384",
      "--both": "#7C3AED",
      "--nav-bg": darkMode ? "rgba(15,15,15,0.92)" : "rgba(255,248,240,0.92)",
      fontFamily: "'Noto Sans TC', 'Helvetica Neue', sans-serif",
      background: "var(--bg)", color: "var(--ink)", minHeight: "100vh",
      transition: "all 0.3s"
    }}>
      {/* Hero Header */}
      <div style={{
        background: darkMode
          ? "linear-gradient(135deg, #1a0a0a 0%, #0f0f0f 50%, #0a0a1a 100%)"
          : "linear-gradient(135deg, #FFF0E0 0%, #FFF8F0 40%, #FFE8E8 70%, #FFF0F5 100%)",
        padding: "48px 20px 36px", textAlign: "center", position: "relative", overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%",
          background: "var(--dajia)", opacity: 0.06, filter: "blur(40px)"
        }} />
        <div style={{
          position: "absolute", bottom: -40, left: -40, width: 160, height: 160, borderRadius: "50%",
          background: "var(--bst)", opacity: 0.06, filter: "blur(40px)"
        }} />
        <div style={{ fontSize: 48, marginBottom: 8 }}>🙏</div>
        <h1 style={{
          fontSize: 32, fontWeight: 900, fontFamily: "'Noto Serif TC', serif",
          lineHeight: 1.3, letterSpacing: 2, color: "var(--ink)", position: "relative"
        }}>
          2026 媽祖遶境進香
        </h1>
        <p style={{
          fontSize: 15, color: "var(--muted)", marginTop: 10, fontWeight: 500, lineHeight: 1.6
        }}>
          大甲鎮瀾宮 9天8夜 ✦ 白沙屯拱天宮 8天7夜
        </p>
        <div style={{
          display: "flex", gap: 8, justifyContent: "center", marginTop: 18, flexWrap: "wrap"
        }}>
          <span style={{ padding: "5px 14px", borderRadius: 20, background: "var(--dajia)", color: "#fff", fontSize: 12, fontWeight: 700 }}>大甲 4/17–4/26</span>
          <span style={{ padding: "5px 14px", borderRadius: 20, background: "var(--bst)", color: "#fff", fontSize: 12, fontWeight: 700 }}>白沙屯 4/12–4/20</span>
        </div>
        <button onClick={() => setDarkMode(!darkMode)} style={{
          position: "absolute", top: 16, right: 16, background: "var(--card-bg)",
          border: "1px solid var(--border)", borderRadius: "50%", width: 36, height: 36,
          cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
        }}>
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>

      {/* Navigation */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100, background: "var(--nav-bg)",
        backdropFilter: "blur(16px)", borderBottom: "1px solid var(--border)",
        padding: "10px 0", overflowX: "auto"
      }}>
        <div style={{ display: "flex", gap: 4, padding: "0 16px", maxWidth: 800, margin: "0 auto", overflowX: "auto" }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => scrollTo(item.id)} style={{
              padding: "6px 12px", borderRadius: 20, border: "1px solid var(--border)",
              background: "var(--card-bg)", cursor: "pointer", whiteSpace: "nowrap",
              fontSize: 12, fontWeight: 600, color: "var(--ink)", fontFamily: "'Noto Sans TC', sans-serif",
              display: "flex", alignItems: "center", gap: 4, transition: "all 0.15s"
            }}>
              <span style={{ fontSize: 14 }}>{item.icon}</span> {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 20px" }}>

        {/* Calendar Section */}
        <Section id="calendar">
          <SectionTitle emoji="📅">行事曆總覽</SectionTitle>
          <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 16, lineHeight: 1.7 }}>
            兩大媽祖進香活動在 4 月中旬有數天重疊。切換下方標籤查看各活動日期。
          </p>
          <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
            {[["all", "全部"], ["dajia", "大甲"], ["bst", "白沙屯"]].map(([k, l]) => (
              <button key={k} onClick={() => setActiveTab(k)} style={tabStyle(activeTab === k)}>{l}</button>
            ))}
          </div>
          <CalendarView activeTab={activeTab} />
        </Section>

        {/* Schedule Section */}
        <Section id="schedule">
          <SectionTitle emoji="🗺️">詳細行程表</SectionTitle>
          <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
            {[["dajia", "大甲 9天8夜"], ["bst", "白沙屯 8天7夜"]].map(([k, l]) => (
              <button key={k} onClick={() => setScheduleTab(k)} style={tabStyle(scheduleTab === k)}>{l}</button>
            ))}
          </div>
          {scheduleTab === "dajia" ? (
            <>
              <div style={{
                background: "linear-gradient(135deg, #C5303015, #C5303008)", borderRadius: 14,
                padding: "16px 18px", marginBottom: 20, border: "1px solid #C5303020"
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--dajia)", marginBottom: 4 }}>大甲鎮瀾宮媽祖遶境進香</div>
                <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>
                  全程約 340 公里｜經台中、彰化、雲林、嘉義 4 縣市｜2026年主題：「善」
                </div>
              </div>
              <ScheduleTimeline schedule={DAJIA_SCHEDULE} accentVar="dajia" />
            </>
          ) : (
            <>
              <div style={{
                background: "linear-gradient(135deg, #D6338415, #D6338408)", borderRadius: 14,
                padding: "16px 18px", marginBottom: 20, border: "1px solid #D6338420"
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--bst)", marginBottom: 4 }}>白沙屯拱天宮媽祖進香 — 粉紅超跑 🚗💨</div>
                <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>
                  全程約 300–400 公里｜路線不固定，全憑媽祖指引｜今年爐主媽首度隨行
                </div>
              </div>
              <ScheduleTimeline schedule={BST_SCHEDULE} accentVar="bst" />
            </>
          )}
        </Section>

        {/* Temples Section */}
        <Section id="temples">
          <SectionTitle emoji="🏛️">廟宇資訊</SectionTitle>
          <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
            {[["all", "全部"], ["dajia", "大甲路線"], ["bst", "白沙屯路線"]].map(([k, l]) => (
              <button key={k} onClick={() => setTempleFilter(k)} style={tabStyle(templeFilter === k)}>{l}</button>
            ))}
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            {filteredTemples.map((t, i) => <TempleCard key={i} temple={t} />)}
          </div>
        </Section>

        {/* Equipment Section */}
        <Section id="equipment">
          <SectionTitle emoji="🎒">行前裝備建議</SectionTitle>
          <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 20, lineHeight: 1.7 }}>
            長途徒步進香，充足的裝備準備至關重要。背包務必輕量化，以下為建議攜帶物品。
          </p>
          <div style={{ display: "grid", gap: 14 }}>
            {EQUIPMENT.map((cat, i) => (
              <div key={i} style={{
                background: "var(--card-bg)", borderRadius: 14, padding: "18px 20px",
                border: "1px solid var(--border)"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 24 }}>{cat.icon}</span>
                  <span style={{ fontSize: 17, fontWeight: 800, fontFamily: "'Noto Serif TC', serif", color: "var(--ink)" }}>{cat.category}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {cat.items.map((item, j) => (
                    <div key={j} style={{ fontSize: 13, color: "var(--muted)", paddingLeft: 12, lineHeight: 1.5, position: "relative" }}>
                      <span style={{ position: "absolute", left: 0, color: "var(--dajia)", fontWeight: 700 }}>·</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Transport Section */}
        <Section id="transport">
          <SectionTitle emoji="🚃">交通與住宿資訊</SectionTitle>

          <div style={{
            background: "var(--card-bg)", borderRadius: 14, padding: "18px 20px",
            border: "1px solid var(--border)", marginBottom: 14
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, fontFamily: "'Noto Serif TC', serif", marginBottom: 10, color: "var(--dajia)" }}>🔴 大甲媽祖 — 交通方式</h3>
            <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.8 }}>
              <strong style={{ color: "var(--ink)" }}>台鐵：</strong>搭至大甲站，步行約 5 分鐘至鎮瀾宮。北部可停車苑裡站，中南部可停台中港、清水、沙鹿站轉乘區間車。<br/>
              <strong style={{ color: "var(--ink)" }}>高鐵：</strong>至新烏日站轉乘台鐵或公車 93 號至大甲。<br/>
              <strong style={{ color: "var(--ink)" }}>接駁車：</strong>台中市公車加開「朝富停車場↔大甲體育場」接駁車，約 20-30 分鐘一班。大甲體育場至市區有免費接駁車。<br/>
              <strong style={{ color: "var(--ink)" }}>停車場：</strong>大甲火車站後方空地（汽車 80 位、機車 180 位），步行 5 分鐘至鎮瀾宮。
            </div>
          </div>

          <div style={{
            background: "var(--card-bg)", borderRadius: 14, padding: "18px 20px",
            border: "1px solid var(--border)", marginBottom: 14
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, fontFamily: "'Noto Serif TC', serif", marginBottom: 10, color: "var(--bst)" }}>🩷 白沙屯媽祖 — 交通方式</h3>
            <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.8 }}>
              <strong style={{ color: "var(--ink)" }}>台鐵：</strong>搭至白沙屯站，步行約 10 分鐘至拱天宮。<br/>
              <strong style={{ color: "var(--ink)" }}>自駕：</strong>可購掛車輛用進香紅布條（100 元）方便識別。<br/>
              <strong style={{ color: "var(--ink)" }}>遊覽車：</strong>報名步行專用遊覽車（每人 2,700 元），全程跟隨提供座位與行李空間，服務至第 7 天。<br/>
              <strong style={{ color: "var(--ink)" }}>一日體驗：</strong>東南旅遊等旅行社提供北中南專車接送一日遊行程，$699 起。
            </div>
          </div>

          <div style={{
            background: "var(--card-bg)", borderRadius: 14, padding: "18px 20px",
            border: "1px solid var(--border)", marginBottom: 14
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, fontFamily: "'Noto Serif TC', serif", marginBottom: 10, color: "var(--ink)" }}>🏨 住宿方式</h3>
            <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.8 }}>
              <strong style={{ color: "var(--ink)" }}>沿途宮廟：</strong>部分宮廟提供香客大樓，先到先住，建議提前到達。<br/>
              <strong style={{ color: "var(--ink)" }}>學校與社區活動中心：</strong>遶境沿途會開放讓信眾休息過夜。<br/>
              <strong style={{ color: "var(--ink)" }}>旅社民宿：</strong>住宿費約 200–1,000 元不等，建議提早預訂。<br/>
              <strong style={{ color: "var(--ink)" }}>席地而睡：</strong>許多香客會在廟前廣場、騎樓席地休息，可攜帶輕便睡袋或地墊。<br/>
              <strong style={{ color: "var(--ink)" }}>白沙屯特別提醒：</strong>因路線不固定，住宿地點每晚不同，多由遊覽車司機決定。
            </div>
          </div>

          <div style={{
            background: "var(--card-bg)", borderRadius: 14, padding: "18px 20px",
            border: "1px solid var(--border)"
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, fontFamily: "'Noto Serif TC', serif", marginBottom: 10, color: "var(--ink)" }}>📱 實用工具 App</h3>
            <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.8 }}>
              <strong style={{ color: "var(--dajia)" }}>大甲媽祖：</strong>「大甲媽祖遶境 APP」— GPS 即時定位鑾轎位置，iOS / Android 皆有。<br/>
              <strong style={{ color: "var(--bst)" }}>白沙屯媽祖：</strong>「白沙屯媽祖 APP」（官方）或「白沙屯 GPS 即時定位」APP — 神轎定位、接駁、涼水、廁所資訊。<br/>
              <strong style={{ color: "var(--ink)" }}>直播：</strong>YouTube 搜尋「白沙屯媽祖網路電視台」或「大甲媽祖」可觀看全程直播。
            </div>
          </div>
        </Section>

        {/* Taboos Section */}
        <Section id="taboos">
          <SectionTitle emoji="⚠️">進香禁忌與須知</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
            {TABOOS.map((t, i) => (
              <div key={i} style={{
                background: "var(--card-bg)", borderRadius: 12, padding: "14px 16px",
                border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10
              }}>
                <span style={{ fontSize: 22 }}>{t.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", lineHeight: 1.4 }}>{t.text}</span>
              </div>
            ))}
          </div>
          <div style={{
            background: "linear-gradient(135deg, #E9C46A15, #E9C46A08)", borderRadius: 14,
            padding: "16px 18px", marginTop: 16, border: "1px solid #E9C46A30"
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#B7791F", marginBottom: 6 }}>💡 新手小提醒</div>
            <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7 }}>
              不需要全程走完！可以選擇分段參加，利用週末安排一日或兩日體驗。大甲媽祖遶境無需報名即可隨行；白沙屯進香建議至拱天宮完成報名手續（3/11–4/9），名字才會寫入疏文。體力有限者可搭配遊覽車或旅行社的一日遊行程參與。
            </div>
          </div>
        </Section>

        {/* Footer */}
        <div style={{
          textAlign: "center", padding: "32px 0 48px", borderTop: "1px solid var(--border)",
          marginTop: 32
        }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🙏</div>
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
            媽祖保庇，平安順利<br />
            <span style={{ fontSize: 11 }}>資料來源：大甲鎮瀾宮官網、白沙屯拱天宮官方臉書、交通部觀光局</span>
          </p>
        </div>
      </div>
    </div>
  );
}
