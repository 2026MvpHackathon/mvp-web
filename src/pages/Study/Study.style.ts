import styled from 'styled-components'
import * as token from "@/shared/values/token";
import expenseToggleExpand from "@/assets/Study/expense-toggle-expand.png";
import expenseToggleCollapse from "@/assets/Study/expense-toggle-collapse.png";

export const PageBody = styled.div`
  flex: 1;
  padding: 0 32px 32px;
  margin-top: -10px;

  @media (max-width: 1200px) {
    padding: 0 20px 24px;
    margin-top: 0;
  }
`

export const ContentGrid = styled.div<{ $expanded?: boolean }>`
  display: grid;
  grid-template-columns: ${({ $expanded }) =>
    $expanded ? 'minmax(0, 1fr)' : '400px minmax(0, 1fr)'};
  gap: 18px;
  /* 3D 카드가 오른쪽 벽에 붙도록 페이지 우측 패딩만큼 그리드를 오른쪽으로 확장 */
  margin-right: -32px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    margin-right: -20px;
  }
`

export const LeftColumn = styled.div`
  display: grid;
  gap: 20px;
`

export const CenterColumn = styled.div`
  display: grid;
  gap: 0;
`

const cardBorderStyle = '1px solid #104912'

export const Card = styled.section`
  background: #202020;
  border-radius: 18px;
  border: none;
  box-shadow: none;
`

export const CardHeader = styled.div`
  padding: 18px 18px 10px;
  ${token.typography("body", "lg", "semibold")}
  color: ${token.colors.secondary.alternative};
  display: flex;
  align-items: center;
  gap: 8px;
`

export const PartsCard = styled(Card)<{ $expanded?: boolean }>`
  border: ${({ $expanded }) => ($expanded ? 'none' : `1px solid ${token.colors.secondary.normal}`)};
  height: ${({ $expanded }) => ($expanded ? '760px' : '400px')};
  display: grid;
  grid-template-rows: auto 1fr;

  @media (max-width: 1200px) {
    height: ${({ $expanded }) => ($expanded ? 'auto' : '360px')};
    max-height: 70vh;
  }
`

export const PartsFetchError = styled.div`
  padding: 10px 14px;
  margin: 0 14px 8px;
  border-radius: 8px;
  background: rgba(220, 80, 80, 0.15);
  border: 1px solid rgba(220, 80, 80, 0.4);
  color: #f0a0a0;
  ${token.typography("caption", "lg", "medium")}
  line-height: 1.4;
`

export const PartsList = styled.div<{ $expanded?: boolean }>`
  padding: 0 14px 16px;
  display: grid;
  gap: ${({ $expanded }) => ($expanded ? '12px' : '10px')};
  grid-template-columns: ${({ $expanded }) =>
    $expanded ? 'repeat(2, minmax(0, 1fr))' : '1fr'};
  overflow-y: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
`

export const PartRow = styled.button<{ $active?: boolean; $expanded?: boolean }>`
  display: grid;
  grid-template-columns: ${({ $expanded }) => ($expanded ? '1fr' : '38px 1fr')};
  grid-template-rows: ${({ $expanded }) => ($expanded ? 'auto 1fr' : 'auto')};
  grid-template-areas: ${({ $expanded }) =>
    $expanded ? "'title' 'icon'" : "'icon title'"};
  gap: ${({ $expanded }) => ($expanded ? '6px' : '10px')};
  align-items: ${({ $expanded }) => ($expanded ? 'start' : 'center')};
  justify-items: ${({ $expanded }) => ($expanded ? 'stretch' : 'stretch')};
  padding: ${({ $expanded }) => ($expanded ? '12px 10px' : '10px 12px')};
  border-radius: 12px;
  border: 1px solid ${({ $active }) => ($active ? 'rgba(109, 167, 117, 0.6)' : 'transparent')};
  background: ${({ $active }) => ($active ? 'rgba(109, 167, 117, 0.15)' : '#282828')};
  color: #e6e8ee;
  text-align: ${({ $expanded }) => ($expanded ? 'center' : 'left')};
  cursor: pointer;
`

export const PartIcon = styled.div<{ $expanded?: boolean }>`
  grid-area: ${({ $expanded }) => ($expanded ? 'icon' : 'auto')};
  width: ${({ $expanded }) => ($expanded ? '80px' : '36px')};
  height: ${({ $expanded }) => ($expanded ? '80px' : '36px')};
  border-radius: 10px;
  background: #282828;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  display: grid;
  place-items: center;
  margin: ${({ $expanded }) => ($expanded ? '0 auto' : '0')};
`

export const PartMeta = styled.div<{ $expanded?: boolean }>`
  grid-area: ${({ $expanded }) => ($expanded ? 'title' : 'auto')};
  display: grid;
  gap: 4px;
  justify-items: ${({ $expanded }) => ($expanded ? 'start' : 'stretch')};
`

export const PartTitle = styled.div`
  ${token.typography("body", "md", "semibold")}
  color: ${token.colors.secondary.assistive};
`

export const PartDesc = styled.div`
  ${token.typography("caption", "md", "medium")}
  color: ${token.colors.secondary.alternative};
`

export const PartsDetail = styled.div`
  padding: 16px 16px 10px;
  display: grid;
  gap: 10px;
`

export const PartsDetailSection = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto auto;
  height: auto;
`

export const PartsDetailLabel = styled.div`
  ${token.typography("body", "lg", "semibold")}
  color: ${token.colors.secondary.alternative};
`

export const PartsDetailImage = styled.div`
  width: 140px;
  height: 140px;
  margin: 0 auto;
  border-radius: 16px;
  background: #282828;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
`

export const PartsDetailTitle = styled.div`
  ${token.typography("body", "md", "semibold")}
  color: ${token.colors.main.normal};
  text-align: center;
`

export const PartsDetailDesc = styled.div`
  font-size: 12px;
  ${token.typography("caption", "md", "medium")}
  color: ${token.colors.secondary.assistive};
  line-height: 1.4;
  text-align: center;
`

export const PartsDivider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin: 0 16px;
`

export const PartsSectionLabel = styled.div`
  padding: 6px 16px 2px;
  ${token.typography("body", "lg", "semibold")}
  color: #8aa191;
`

export const AiCard = styled(Card)<{ $expanded?: boolean; $compact?: boolean }>`
  border: ${({ $expanded }) => ($expanded ? 'none' : cardBorderStyle)};
  height: ${({ $compact, $expanded }) =>
    $compact ? '410px' : $expanded ? '360px' : '400px'};
  display: flex;
  flex-direction: column;
  padding-bottom: 10px;
  min-height: 0;
  overflow: hidden;

  @media (max-width: 1200px) {
    height: ${({ $compact, $expanded }) =>
      $compact ? '360px' : $expanded ? '320px' : '360px'};
  }
`

export const AiHeader = styled.span`
  padding: 18px 20px;
  ${token.typography("body", "lg", "semibold")}
  color: ${token.colors.main.normal};
  ${token.flexCenter}
  gap: 0.5rem;
  justify-content: space-between;
`

export const AiImg = styled.img`
  width: 1.2rem;
  height: 1.2rem;
`

export const AiHeaderContainer = styled.div`
  ${token.flexCenter}
  gap: 0.7rem;

`

export const AiBadge = styled.span`
  ${token.typography("caption", "lg", "medium")}
  color: #6da775;
`

export const AiBody = styled.div`
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  ${token.typography("caption", "lg", "medium")}
  overflow-y: auto;
  flex: 1;
  min-height: 0;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
`

export const AiBodySpacer = styled.div`
  flex: 1 1 0;
  min-height: 0;
`

export const AiBodyInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  flex-shrink: 0;
`

export const AiPromptBar = styled.form`
  margin: auto 16px 15px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-radius: 14px;
  border: 1px solid rgba(109, 167, 117, 0.4);
  background: #1b1b1b;
`

export const AiPromptInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: ${token.colors.text.normal};
  ${token.typography("caption", "lg", "medium")}

  &::placeholder {
    color: ${token.colors.text.alternative2};
  }
`
export const AiChatBubble = styled.div`
  background: #cfe0d6;
  color: #1b1f1b;
  padding: 10px 12px;
  border-radius: 10px;
  ${token.typography("caption", "lg", "medium")}
  line-height: 1.4;
  align-self: flex-start;
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const AiChatText = styled.div`
  white-space: pre-wrap;
  
`

export const AiQuizAction = styled.button`
  ${token.typography("caption", "sm", "medium")}
  color: rgba(207, 224, 214, 0.7);
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  align-self: flex-start;
  text-decoration: underline;

  &:hover {
    color: rgba(207, 224, 214, 0.95);
  }

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    cursor: default;
    opacity: 0.5;
  }
`

export const AiChatBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-self: flex-start;
`

export const AiUserBubble = styled.div`
  background-color: ${token.colors.secondary.normal};
  color: ${token.colors.text.normal};
  padding: 10px 15px;
  border-radius: 10px;
  ${token.typography("caption", "md", "medium")}
  line-height: 1.4;
  align-self: flex-end;
`

export const ViewerCard = styled(Card)<{ $expanded?: boolean }>`
  position: relative;
  width: ${({ $expanded }) => ($expanded ? 'calc(100% + 40px)' : '100%')};
  margin: ${({ $expanded }) => ($expanded ? '0 -20px' : '0')};
  height: ${({ $expanded }) => ($expanded ? '920px' : 'calc(clamp(580px, 72vh, 840px) + 40px)')};
  min-height: ${({ $expanded }) => ($expanded ? '920px' : '0')};
  max-height: ${({ $expanded }) => ($expanded ? '920px' : 'none')};
  border: ${cardBorderStyle};

  display: grid;
  grid-template-rows: auto 1fr auto;
  overflow: hidden;

  @media (max-width: 1200px) {
    width: 100%;
    margin: 0;
    height: ${({ $expanded }) =>
      $expanded ? 'clamp(540px, 70vh, 840px)' : 'clamp(520px, 70vh, 700px)'};
    min-height: ${({ $expanded }) => ($expanded ? '540px' : '0')};
    max-height: none;
  }
`

export const ViewerHeader = styled.div`
  padding: 18px 20px 10px;
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  column-gap: 12px;
  row-gap: 4px;
  align-items: center;
`


export const ViewerDivider = styled.div`
  width: 2px;
  height: 16px;
  background: rgba(109, 167, 117, 0.6);
`

export const ViewerDescription = styled.div`
  ${token.typography("caption", "md", "medium")}
  color: ${token.colors.secondary.assistive};
  line-height: 1.4;

  min-width: 0;
  max-width: 1000px;
  word-break: keep-all;
`


export const ViewerBody = styled.div`
  position: relative;
  height: 100%;
  min-height: 0;
`

export const ExpandedPanels = styled.div`
  position: absolute;
  inset: 20px 18px 20px 18px;
  pointer-events: none;
  z-index: 3;

  @media (max-width: 1200px) {
    position: static;
    inset: auto;
    display: grid;
    gap: 12px;
    margin: 12px 12px 0;
    pointer-events: auto;
  }
`

export const ExpandedLeftPanel = styled.div`
  position: absolute;
  left: 65px;
  top: 0;
  width: 300px;
  pointer-events: auto;

  @media (max-width: 1200px) {
    position: static;
    width: 100%;
  }
`


export const ExpandedRightPanel = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  width: 320px;
  display: grid;
  gap: 12px;
  pointer-events: auto;

  @media (max-width: 1200px) {
    position: static;
    width: 100%;
  }
`

export const ViewerToolbar = styled.div`
  position: absolute;
  left: 18px;
  top: 20px;
  display: grid;
  gap: 10px;
  background: #090909;
  padding: 8px;
  border-radius: 12px;
  border: 1px solid #505050;
  z-index: 3;

  @media (max-width: 1200px) {
    left: 12px;
    top: 12px;
  }
`

export const ViewModeToggle = styled.div`
  position: absolute;
  left: 76px;
  top: 20px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  padding: 6px;
  border-radius: 16px;
  border: 1px solid rgba(109, 167, 117, 0.45);
  background: #1b1b1b;
  z-index: 3;

  @media (max-width: 1200px) {
    left: 72px;
    top: 12px;
  }
`

export const ExpandedViewModeToggle = styled(ViewModeToggle)`
  position: static;
  transform: translateX(-37px);
`

export const ViewModeButton = styled.button<{ $active?: boolean }>`
  min-width: 110px;
  padding: 8px 14px;
  border-radius: 12px;
  border: 1px solid ${({ $active }) => ($active ? '#6da775' : 'transparent')};
  background: ${({ $active }) => ($active ? 'rgba(109, 167, 117, 0.2)' : 'transparent')};
  color: ${({ $active }) => ($active ? '#cfe0d6' : '#a3b5aa')};
  ${token.typography("caption", "lg", "medium")}
  font-weight: 600;
  cursor: pointer;
`

export const ToolbarButton = styled.button<{ $active?: boolean }>`
  width: 30px;
  height: 30px;
  border-radius: 9px;
  background: ${({ $active }) => ($active ? token.colors.secondary.normal : '#090909')};
  color: #c9d3e6;
  cursor: pointer;
  ${token.typography("caption", "lg", "medium")}

  ${token.flexCenter}
  box-sizing: border-box;
`

export const ToolbarIcon = styled.img`
  width: 0.8rem;
  height: 0.8rem;
  display: block;
  transform: none;
`

export const ToolbarIcon2 = styled.img`
  width: 1.1875rem;
  height: 1.1875rem;
  display: block;
  transform: none;
`


export const ToolbarDivider = styled.div`
  width: 60%;
  height: 1px;
  background: rgba(109, 167, 117, 0.35);
  margin: 6px auto;
`

export const NotePanel = styled.div<{ $shifted?: boolean }>`
  position: absolute;
  right: ${({ $shifted }) => ($shifted ? '409px' : '64px')};
  top: 26px;
  width: 280px;
  min-height: 260px;
  background: #1b1b1b;
  border-radius: 22px;
  border: 1px solid rgba(109, 167, 117, 0.4);
  padding: 16px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  z-index: 3;

  @media (max-width: 1200px) {
    right: 20px;
    top: 80px;
    width: min(280px, 80vw);
  }
`

export const NoteHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* gap: 18px; */
  ${token.typography("body", "md", "semibold")}
  color: ${token.colors.text.normal};
`

export const NoteToggleOutside = styled.button<{ $shifted?: boolean }>`
  position: absolute;
  right: ${({ $shifted }) => ($shifted ? '360px' : '15px')};
  top: ${({ $shifted }) => ($shifted ? '30px' : '30px')};
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 1px solid rgba(109, 167, 117, 0.5);
  background: rgba(109, 167, 117, 0.35);
  color: #cfe0d6;
  font-size: 64px;
  line-height: 1;
  display: grid;
  place-items: center;
  cursor: pointer;
  z-index: 4;

  @media (max-width: 1200px) {
    right: 10px;
  }
`

export const NoteToggleIcon = styled.img`
  width: 0.1rem, ;
  height: 0.5rem;
  display: block;
`

export const ExpenseToggleOutside = styled.button<{ $shifted?: boolean }>`
  position: ${({ $shifted }) => ($shifted ? "static" : "absolute")};
  right: ${({ $shifted }) => ($shifted ? "auto" : "15px")};
  top: ${({ $shifted }) =>
    $shifted ? "auto" : "calc(clamp(360px, 60vh, 590px) + 30px)"};

  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 1px solid #303030;

  background-color: #303030;
  background-image: ${({ $shifted }) =>
    $shifted
      ? `url(${expenseToggleCollapse})`
      : `url(${expenseToggleExpand})`};

  background-repeat: no-repeat;
  background-position: center;
  background-size: 1rem;


  display: grid;
  place-items: center;
  cursor: pointer;
  z-index: 9999;
`;


export const NoteSearch = styled.input`
  width: calc(45% + 60px);
  margin-left: 50px;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid #2a2f2d;
  background: #222222;
  color: #e6e8ee;
  font-size: 13px;
`

export const NoteEditorPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  border-radius: 14px;
  border: 1px solid #2a2f2d;
  background: #232323;
`

export const NoteEditorInput = styled.textarea`
  width: 100%;
  min-height: 64px;
  border: none;
  background: transparent;
  color: #e6e8ee;
  font-size: 14px;
  line-height: 1.4;
  resize: vertical;
  outline: none;
`

export const NoteEditorActions = styled.div`
  display: flex;
  justify-content: flex-end;
`

export const NoteEditorButton = styled.button`
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid rgba(109, 167, 117, 0.6);
  background: rgba(109, 167, 117, 0.2);
  color: #d9e4d6;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
`

export const NoteList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  max-height: 220px;
  overflow-y: auto;
  align-items: stretch;
`

export const NoteItem = styled.div`
  display: grid;
  gap: 8px;
`

export const NoteEmpty = styled.div`
  min-height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  ${token.typography("caption", "sm", "semibold")}
`

export const NoteMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  ${token.typography("body", "md", "semibold")}
  color: #8b8f94;

  span {
    flex: 1;
    min-width: 0;
  }
`

export const NoteActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

export const NoteActionButton = styled.button<{ $icon: string }>`
  width: 20px;
  height: 20px;
  padding: 0;
  border: none;
  background-color: transparent;
  background-image: url(${({ $icon }) => $icon});
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  display: grid;
  place-items: center;
  cursor: pointer;
  flex-shrink: 0;
`

export const NoteBody = styled.div`
  font-size: 22px;
  line-height: 1.4;
  color: #d9e4d6;
  white-space: normal;
  word-break: break-word;
`

/** 선택된 부품 좌표 표시 - expense일 때 expense toggle 바로 위에 붙임 */
export const SelectedPartCoords = styled.div<{ $expanded?: boolean }>`
  position: absolute;
  left: auto;
  right: 18px;
  width: fit-content;
  max-width: calc(100% - 36px);
  /* 일반: 푸터 위. expense: ViewerFooter(45px) + ExpenseToggle(39px) + 간격(6px) = toggle 바로 위 */
  bottom: ${({ $expanded }) => ($expanded ? '90px' : '52px')};
  /* expense일 때 푸터와 같이 왼쪽으로 밀어서 toggle 바로 위에 맞춤 */
  transform: ${({ $expanded }) => ($expanded ? 'translateX(-325px)' : 'none')};
  z-index: 3;
  padding: 8px 8px 8px 12px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.75);
  font-family: ui-monospace, monospace;
  ${token.typography("caption", "md", "medium")}
  line-height: 1.5;
  color: #90ee90;
  pointer-events: none;

  @media (max-width: 1200px) {
    transform: none;
  }
`

export const ViewerFooter = styled.div<{ $expanded?: boolean }>`
  position: absolute;
  left: 18px;
  right: 18px;
  bottom: ${({ $expanded }) => ($expanded ? '45px' : '16px')};
  display: ${({ $expanded }) => ($expanded ? 'flex' : 'grid')};
  align-items: ${({ $expanded }) => ($expanded ? 'center' : 'stretch')};
  justify-content: ${({ $expanded }) => ($expanded ? 'center' : 'stretch')};
  gap: ${({ $expanded }) => ($expanded ? '12px' : '6px')};
  font-size: 11px;
  color: #aeb8cc;
  z-index: 4;
  transform: ${({ $expanded }) => ($expanded ? 'translateX(-175px)' : 'none')};

  @media (max-width: 1200px) {
    transform: none;
    bottom: 16px;
  }
`

export const ProgressRow = styled.div<{ $expanded?: boolean; $hidden?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0;
  width: ${({ $expanded }) => ($expanded ? 'calc(100% - 500px)' : '100%')};
  min-width: ${({ $expanded }) => ($expanded ? '360px' : 'auto')};
  margin: 0;
  visibility: ${({ $hidden }) => ($hidden ? 'hidden' : 'visible')};
  pointer-events: ${({ $hidden }) => ($hidden ? 'none' : 'auto')};

  @media (max-width: 1200px) {
    width: 100%;
    min-width: 0;
  }
`

export const ProgressWrap = styled.div`
  position: relative;
  flex: 1;
  padding-top: 18px;
  width: 100%;
`

export const ProgressLabel = styled.div`
  position: absolute;
  top: 0;
  font-size: 12px;
  color: #d1d5db;
  transform: translateX(-50%);
  pointer-events: none;
`

export const ProgressBar = styled.input`
  width: 95%;
  appearance: none;
  height: 12px;
  border-radius: 999px;
  background: #3a3a3a;
  outline: none;

  &::-webkit-slider-runnable-track {
    height: 12px;
    border-radius: 999px;
    background: #3a3a3a;
  }

  &::-webkit-slider-thumb {
    appearance: none;
    width: 58px;
    height: 12px;
    border-radius: 999px;
    background: #c9c9c9;
    border: 1px solid #b0b0b0;
    margin-top: 0;
  }

  &::-moz-range-track {
    height: 12px;
    border-radius: 999px;
    background: #3a3a3a;
  }

  &::-moz-range-thumb {
    width: 58px;
    height: 12px;
    border-radius: 999px;
    background: #c9c9c9;
    border: 1px solid #b0b0b0;
  }
`

export const BottomChat = styled.form`
  background: ${token.colors.background.Dark};
  border-radius: 18px;
  border: 1px solid ${token.colors.secondary.normal};
  box-shadow: none;
  padding: 0px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`

export const ChatPlaceholder = styled.div`
  color: #7b849a;
  ${token.typography("caption", "lg", "medium")};
`

export const ChatInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: ${token.colors.text.normal};
  ${token.typography("body", "md", "medium")};

  &::placeholder {
    color: ${token.colors.line.normal};;
  }
`
export const ChatTag = styled.span`
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(109, 167, 117, 0.2);
  color: #cfe0d6;
  ${token.typography("caption", "md", "medium")}
`

export const ChatSend = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid rgba(109, 167, 117, 0.4);
  background: #1b1b1b;
  color: #cfe0d6;
  display: grid;
  place-items: center;
  ${token.typography("caption", "lg", "medium")}
  cursor: pointer;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`


export const ViewModeSlider = styled.div`
  position: absolute;
  left: 76px;
  top: 20px;

  width: 13.5rem;
  height: 2.5rem;
  padding: 0.5rem;

  display: inline-flex;
  align-items: center;
  gap: 0;

  border: 1px solid rgba(109, 167, 117, 0.45);
  border-radius: ${token.shapes.large};
  background: #1b1b1b;

  z-index: 3;

  @media (max-width: 1200px) {
    left: 72px;
    top: 12px;
  }
`;

export const ViewModeSliderTrack = styled.div<{ $index: number }>`
  position: absolute;
  top: 50%;
  left: 0.5rem;

  height: 1.6rem;
  width: 6.125rem;

  transform: translateY(-50%) translateX(${({ $index }) => `${$index * 100}%`});
  transition: transform 0.25s ease;

  background: ${token.colors.background.Dark};
  border-radius: ${token.shapes.small};
  border: 1px solid ${token.colors.line.alternative};

  pointer-events: none;
`;

export const ViewModeSliderOption = styled.button<{ $active: boolean }>`
  position: relative;
  z-index: 1;
  min-width: 6.125rem;

  padding: 0.275rem 0.75rem 0.475rem 0.75rem;

  ${token.typography("body", "sm", "medium")};
  color: ${({ $active }) =>
    $active ? token.colors.text.strong : token.colors.text.alternative};

  background: transparent;
  border: none;
  border-radius: ${token.shapes.small};
  cursor: pointer;
  transition: color 0.2s ease;
`;


/* 확장 모드용 (Expanded) */
export const ExpandedViewModeSlider = styled(ViewModeSlider)`
  position: static;
  transform: translateX(-37px);
`;
