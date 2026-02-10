import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── 인터페이스 및 타입 정의 ──────────────────────────────────────────────────

interface Product {
  id: string;
  title: string;
  image: string;
  selected: boolean;
}

interface AIAnswer {
  id: string;
  selected: boolean;
  answerText: string;
}

interface Favorite {
  id: string;
  title: string;
  type: "db" | "ai";
}

interface WrongAnswer {
  id: string;
  title: string;
  type: "db" | "ai";
}

interface ToastState {
  msg: string;
  type: "info" | "success";
}

// ── 더미 데이터 ─────────────────────────────────────────────────────────────

const DRONE_IMG =
  "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=200&q=80";

const mockProducts: Product[] = [
  { id: "1", title: "Drone", image: DRONE_IMG, selected: true },
  { id: "2", title: "Drone", image: DRONE_IMG, selected: true },
  { id: "3", title: "Drone", image: DRONE_IMG, selected: false },
  { id: "4", title: "Drone", image: DRONE_IMG, selected: false },
  { id: "5", title: "Drone", image: DRONE_IMG, selected: false },
  { id: "6", title: "Drone", image: DRONE_IMG, selected: false },
];

const mockAIAnswers: AIAnswer[] = [
  {
    id: "ai1",
    selected: true,
    answerText: `RTH(Return To Home)\n드론이 자동으로 이륙 지점(Home Point)으로 복귀하는 기능.\n비정상 상황 발생 시 기체가 스스로 판단하여 안전 복귀를 수행함.`,
  },
  {
    id: "ai2",
    selected: false,
    answerText: `📍 Home Point(홈 포인트)\n이륙 시 GPS를 통해 기록되는 위치.\nRTH의 최종 목적지는 항상 Home Point로 설정됨.`,
  },
  {
    id: "ai3",
    selected: false,
    answerText: `🔄 RTH 작동 주요 상황\n1. 조종자 수동 RTH\n조종자가 RTH 버튼을 눌러 직접 실행.`,
  },
  {
    id: "ai4",
    selected: false,
    answerText: `⚡저전압 RTH (Low Battery RTH)\n배터리 잔량이 설정된 기준 이하로 감소 시 자동 실행.`,
  },
];

const mockFavorites: Favorite[] = [
  { id: "fav1", title: "RTH 개요", type: "db" },
  { id: "fav2", title: "GPS 설정", type: "ai" },
  { id: "fav3", title: "배터리 관리", type: "ai" },
];

const mockWrongAnswers: WrongAnswer[] = [
  { id: "wr1", title: "센서 보정", type: "db" },
  { id: "wr2", title: "고도 제한", type: "ai" },
  { id: "wr3", title: "전파 방해", type: "ai" },
];

// ── 아이콘 컴포넌트 (타입 명시) ──────────────────────────────────────────────

const DBIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="2" y="3" width="12" height="3" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
    <rect x="2" y="8.5" width="12" height="3" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
    <line x1="5" y1="4.5" x2="11" y2="4.5" stroke="currentColor" strokeWidth="1" />
    <line x1="5" y1="10" x2="11" y2="10" stroke="currentColor" strokeWidth="1" />
  </svg>
);

const AIIcon = () => (
  <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
    <rect x="1" y="2" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" />
    <path d="M11 5h4M11 9h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <text x="3.5" y="10" fontSize="6" fill="currentColor" fontWeight="bold">AI</text>
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill={filled ? "#4ADE80" : "none"} stroke="#4ADE80" strokeWidth="1.2">
    <path d="M7 1.5l1.5 3 3.5.5-2.5 2.5.5 3.5L7 9.5l-3 1.5.5-3.5L2 5l3.5-.5L7 1.5z" />
  </svg>
);

const DotIcon = ({ color = "#ef4444" }: { color?: string }) => (
  <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: color, flexShrink: 0 }} />
);

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────────

export default function SimvexQuizPage() {
  const navigate = useNavigate();
  const [category, setCategory] = useState<"db" | "ai">("db");
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [aiAnswers, setAiAnswers] = useState<AIAnswer[]>(mockAIAnswers);
  const [isFavoriteIncluded, setIsFavoriteIncluded] = useState(true);
  const [isWrongAnswerIncluded, setIsWrongAnswerIncluded] = useState(false);
  const [numberOfProblems, setNumberOfProblems] = useState("8");
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (msg: string, type: "info" | "success" = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const isAllSelected = products.every((p) => p.selected) && products.length > 0;
  const handleProductToggle = (id: string) =>
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p)));
  const handleSelectAllToggle = () =>
    setProducts((prev) => prev.map((p) => ({ ...p, selected: !isAllSelected })));

  const isAllAISelected = aiAnswers.every((a) => a.selected) && aiAnswers.length > 0;
  const handleAIToggle = (id: string) =>
    setAiAnswers((prev) => prev.map((a) => (a.id === id ? { ...a, selected: !a.selected } : a)));
  const handleSelectAllAIToggle = () =>
    setAiAnswers((prev) => prev.map((a) => ({ ...a, selected: !isAllAISelected })));

  const handleStartQuiz = () => {
    const selectedProducts = products.filter((p) => p.selected);
    const selectedAI = aiAnswers.filter((a) => a.selected);
    if (category === "db" && selectedProducts.length === 0) {
      showToast("Object를 선택해 주세요", "info");
      return;
    }
    if (category === "ai" && selectedAI.length === 0) {
      showToast("AI 답변을 선택해 주세요", "info");
      return;
    }
    showToast("퀴즈가 시작되었습니다!", "success");
      navigate("/quiz/during");
    console.log("Quiz Started with:", { category, numberOfProblems });
  };

  const isAllCurrent = category === "db" ? isAllSelected : isAllAISelected;
  const handleSelectAll = category === "db" ? handleSelectAllToggle : handleSelectAllAIToggle;

  return (
    <div style={styles.root}>
      <div style={styles.body}>
        <aside style={styles.leftPanel}>
          <div style={styles.rateCard}>
            <div style={styles.rateValue}>66.7%</div>
            <div style={styles.rateDesc}>3 문제 중 2 문제 맞혔어요!</div>
          </div>
          <SideList title="즐겨찾기" total={7} items={mockFavorites} iconEl={<StarIcon filled />} />
          <SideList title="오답" total={7} items={mockWrongAnswers} iconEl={<DotIcon />} />
        </aside>

        <main style={styles.main}>
          <div style={styles.headerRow}>
            <h2 style={styles.pageTitle}>퀴즈 범위 설정</h2>
            <div style={styles.categoryToggle}>
              <button
                style={{ ...styles.toggleBtn, ...(category === "db" ? styles.toggleBtnActive : {}) }}
                onClick={() => setCategory("db")}
              >
                제품별
              </button>
              <button
                style={{ ...styles.toggleBtn, ...(category === "ai" ? styles.toggleBtnActive : {}) }}
                onClick={() => setCategory("ai")}
              >
                AI Quiz
              </button>
            </div>
          </div>

          <div style={styles.selectAllRow}>
            <SelectCircle selected={isAllCurrent} onToggle={handleSelectAll} label="전체" />
          </div>

          {category === "db" ? (
            <div style={styles.productGrid}>
              {products.map((p) => (
                <ProductCard key={p.id} product={p} onToggle={handleProductToggle} />
              ))}
            </div>
          ) : (
            <div style={styles.aiGrid}>
              {aiAnswers.map((a) => (
                <AIAnswerCard key={a.id} answer={a} onToggle={handleAIToggle} />
              ))}
            </div>
          )}

          <div style={styles.checkboxRow}>
            <SquareCheckbox
              checked={isFavoriteIncluded}
              onToggle={() => setIsFavoriteIncluded((v) => !v)}
              label="즐겨찾기 포함"
              color="#4ADE80"
            />
            <SquareCheckbox
              checked={isWrongAnswerIncluded}
              onToggle={() => setIsWrongAnswerIncluded((v) => !v)}
              label="오답 포함"
              color="#6b7280"
            />
          </div>

          <div style={styles.problemRow}>
            <select
              value={numberOfProblems}
              onChange={(e) => setNumberOfProblems(e.target.value)}
              style={styles.problemSelect}
            >
              {["5", "8", "10", "15", "20"].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <span style={styles.problemLabel}>문제</span>
          </div>

          <div style={styles.startBtnWrapper}>
            <button style={styles.startBtn} onClick={handleStartQuiz}>
              퀴즈 시작
            </button>
          </div>
        </main>
      </div>

      {toast && (
        <div style={{ ...styles.toast, backgroundColor: toast.type === "success" ? "#166534" : "#1e3a5f" }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

// ── 서브 컴포넌트 (Props 타입 정의 필수) ──────────────────────────────────────────

interface SideListProps {
  title: string;
  total: number;
  items: (Favorite | WrongAnswer)[];
  iconEl: React.ReactNode;
}
function SideList({ title, total, items, iconEl }: SideListProps) {
  return (
    <div style={styles.sideList}>
      <div style={styles.sideListHeader}>
        <span style={styles.sideListTitle}>{title}</span>
        <span style={styles.sideListTotal}>총 {total}문제</span>
      </div>
      {items.map((item) => (
        <div key={item.id} style={styles.sideListItem}>
          <span style={{ color: "#9ca3af", display: "flex", alignItems: "center" }}>
            {item.type === "db" ? <DBIcon /> : <AIIcon />}
          </span>
          <span style={styles.sideListItemText}>{item.title}</span>
          {iconEl}
        </div>
      ))}
    </div>
  );
}

interface SelectCircleProps {
  selected: boolean;
  onToggle: () => void;
  label: string;
}
function SelectCircle({ selected, onToggle, label }: SelectCircleProps) {
  return (
    <div style={styles.selectCircleWrap} onClick={onToggle}>
      <div style={{ ...styles.circle, ...(selected ? styles.circleSelected : styles.circleUnselected) }}>
        {selected && <CheckIcon />}
      </div>
      <span style={styles.selectLabel}>{label}</span>
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  onToggle: (id: string) => void;
}
function ProductCard({ product, onToggle }: ProductCardProps) {
  return (
    <div
      style={{ ...styles.productCard, ...(product.selected ? styles.productCardSelected : {}) }}
      onClick={() => onToggle(product.id)}
    >
      <div style={styles.productCardHeader}>
        <span style={styles.productTitle}>{product.title}</span>
        <div style={{ ...styles.productCheck, ...(product.selected ? styles.productCheckSelected : styles.productCheckUnselected) }}>
          {product.selected && <CheckIcon />}
        </div>
      </div>
      <img src={product.image} alt={product.title} style={styles.productImg} />
    </div>
  );
}

interface AIAnswerCardProps {
  answer: AIAnswer;
  onToggle: (id: string) => void;
}
function AIAnswerCard({ answer, onToggle }: AIAnswerCardProps) {
  return (
    <div
      style={{ ...styles.aiCard, ...(answer.selected ? styles.aiCardSelected : {}) }}
      onClick={() => onToggle(answer.id)}
    >
      <div style={styles.aiCardInner}>
        <div style={styles.aiCardTopRow}>
          <span style={{ color: "#4ADE80", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
            <AIIcon />
          </span>
          <div style={{ ...styles.productCheck, ...(answer.selected ? styles.productCheckSelected : styles.productCheckUnselected) }}>
            {answer.selected && <CheckIcon />}
          </div>
        </div>
        <p style={styles.aiCardText}>{answer.answerText}</p>
      </div>
    </div>
  );
}

interface SquareCheckboxProps {
  checked: boolean;
  onToggle: () => void;
  label: string;
  color: string;
}
function SquareCheckbox({ checked, onToggle, label, color }: SquareCheckboxProps) {
  return (
    <div style={styles.checkboxWrap} onClick={onToggle}>
      <div style={{ ...styles.squareBox, ...(checked ? { backgroundColor: color, borderColor: color } : {}) }}>
        {checked && <CheckIcon />}
      </div>
      <span style={styles.checkboxLabel}>{label}</span>
    </div>
  );
}

// ── 스타일 정의 (변동 없음) ──────────────────────────────────────────────────

const styles: { [key: string]: React.CSSProperties } = {
  root: {
    minHeight: "100vh",
    backgroundColor: "#0d0d0d",
    color: "#e5e7eb",
    fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif",
  },
  body: {
    display: "flex",
    flex: 1,
    padding: "24px 28px",
    gap: 24,
    width: "100%",
    minHeight: "100vh",
    boxSizing: "border-box",
  },
  leftPanel: { width: 220, flexShrink: 0, display: "flex", flexDirection: "column", gap: 20 },
  rateCard: { backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 12, padding: "20px 16px", textAlign: "center" },
  rateValue: { fontSize: 32, fontWeight: 700, color: "#4ADE80", lineHeight: 1.2 },
  rateDesc: { fontSize: 12, color: "#6b7280", marginTop: 6 },
  sideList: { backgroundColor: "#111", border: "1px solid #1f2937", borderRadius: 10, padding: "14px 12px" },
  sideListHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, paddingBottom: 8, borderBottom: "1px solid #1f2937" },
  sideListTitle: { fontSize: 13, fontWeight: 600, color: "#d1d5db" },
  sideListTotal: { fontSize: 11, color: "#6b7280" },
  sideListItem: { display: "flex", alignItems: "center", gap: 8, padding: "6px 0" },
  sideListItemText: { fontSize: 13, color: "#9ca3af", flex: 1 },
  main: { flex: 1, display: "flex", flexDirection: "column", gap: 16 },
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  pageTitle: { fontSize: 20, fontWeight: 700, color: "#fff", margin: 0 },
  categoryToggle: { display: "flex", backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, overflow: "hidden" },
  toggleBtn: { padding: "8px 24px", fontSize: 13, fontWeight: 500, cursor: "pointer", backgroundColor: "transparent", border: "none", color: "#6b7280", transition: "all 0.15s" },
  toggleBtnActive: { backgroundColor: "#4ADE80", color: "#0d0d0d", fontWeight: 700 },
  selectAllRow: { marginBottom: 2 },
  selectCircleWrap: { display: "flex", alignItems: "center", gap: 8, cursor: "pointer", width: "fit-content" },
  circle: { width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" },
  circleSelected: { backgroundColor: "#4ADE80", border: "2px solid #4ADE80" },
  circleUnselected: { backgroundColor: "transparent", border: "2px solid #374151" },
  selectLabel: { fontSize: 13, color: "#9ca3af" },
  productGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 },
  productCard: { backgroundColor: "#111", border: "1px solid #2a2a2a", borderRadius: 10, padding: 12, cursor: "pointer", transition: "border-color 0.15s", userSelect: "none" },
  productCardSelected: { borderColor: "#4ADE80" },
  productCardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  productTitle: { fontSize: 14, fontWeight: 600, color: "#e5e7eb" },
  productCheck: { width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  productCheckSelected: { backgroundColor: "#4ADE80", border: "2px solid #4ADE80" },
  productCheckUnselected: { backgroundColor: "transparent", border: "2px solid #374151" },
  productImg: { width: "100%", height: 100, objectFit: "contain", borderRadius: 6, filter: "brightness(0.9)" },
  aiGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 },
  aiCard: { backgroundColor: "#111", border: "1px solid #2a2a2a", borderRadius: 10, cursor: "pointer", transition: "border-color 0.15s", userSelect: "none", height: 320, overflow: "hidden" },
  aiCardSelected: { borderColor: "#4ADE80" },
  aiCardInner: { padding: "12px 12px", height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 8 },
  aiCardTopRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  aiCardText: { fontSize: 11.5, color: "#d1d5db", lineHeight: 1.65, whiteSpace: "pre-line", overflow: "hidden", flex: 1, margin: 0 },
  checkboxRow: { display: "flex", gap: 24, alignItems: "center" },
  checkboxWrap: { display: "flex", alignItems: "center", gap: 8, cursor: "pointer", userSelect: "none" },
  squareBox: { width: 18, height: 18, borderRadius: 4, border: "1.5px solid #374151", backgroundColor: "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" },
  checkboxLabel: { fontSize: 13, color: "#9ca3af" },
  problemRow: { display: "flex", alignItems: "center", gap: 10 },
  problemSelect: { backgroundColor: "#1a1a1a", border: "1px solid #374151", color: "#e5e7eb", padding: "8px 28px 8px 12px", borderRadius: 6, fontSize: 14, cursor: "pointer", appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236b7280' strokeWidth='1.5' fill='none' strokeLinecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", paddingRight: 34 },
  problemLabel: { fontSize: 14, color: "#9ca3af" },
  startBtnWrapper: { display: "flex", justifyContent: "flex-end", marginTop: 4 },
  startBtn: { backgroundColor: "#4ADE80", color: "#0d0d0d", border: "none", padding: "12px 32px", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "opacity 0.15s" },
  toast: { position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)", padding: "12px 24px", borderRadius: 8, fontSize: 14, color: "#fff", zIndex: 9999, boxShadow: "0 4px 20px rgba(0,0,0,0.4)" },
};