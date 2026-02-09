import styled from 'styled-components'

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

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`

export const LeftColumn = styled.div`
  display: grid;
  gap: 18px;
`

export const CenterColumn = styled.div`
  display: grid;
  gap: 14px;
`

export const Card = styled.section`
  background: #202020;
  border-radius: 18px;
  border: none;
  box-shadow: none;
`

export const CardHeader = styled.div`
  padding: 18px 18px 10px;
  font-weight: 600;
  font-size: 14px;
  color: #c9d3e6;
  display: flex;
  align-items: center;
  gap: 8px;
`

export const PartsCard = styled(Card)<{ $expanded?: boolean }>`
  height: ${({ $expanded }) => ($expanded ? '760px' : '400px')};
  display: grid;
  grid-template-rows: auto 1fr;

  @media (max-width: 1200px) {
    height: ${({ $expanded }) => ($expanded ? 'auto' : '360px')};
    max-height: 70vh;
  }
`

export const PartsList = styled.div<{ $expanded?: boolean }>`
  padding: 0 14px 16px;
  display: grid;
  gap: ${({ $expanded }) => ($expanded ? '12px' : '10px')};
  grid-template-columns: ${({ $expanded }) =>
    $expanded ? 'repeat(2, minmax(0, 1fr))' : '1fr'};
  overflow-y: auto;
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
  color: #6da775;
  font-size: 12px;
  margin: ${({ $expanded }) => ($expanded ? '0 auto' : '0')};
`

export const PartMeta = styled.div<{ $expanded?: boolean }>`
  grid-area: ${({ $expanded }) => ($expanded ? 'title' : 'auto')};
  display: grid;
  gap: 4px;
  justify-items: ${({ $expanded }) => ($expanded ? 'start' : 'stretch')};
`

export const PartTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
`

export const PartDesc = styled.div`
  font-size: 10px;
  color: #9ca3af;
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
  font-size: 16px;
  font-weight: 600;
  color: #8aa191;
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
  font-size: 14px;
  font-weight: 600;
  color: #e6e8ee;
  text-align: center;
`

export const PartsDetailDesc = styled.div`
  font-size: 12px;
  color: #aeb8cc;
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
  font-size: 14px;
  font-weight: 600;
  color: #8aa191;
`

export const AiCard = styled(Card)<{ $expanded?: boolean; $compact?: boolean }>`
  height: ${({ $compact, $expanded }) =>
    $compact ? '410px' : $expanded ? '360px' : '400px'};
  display: flex;
  flex-direction: column;
  padding-bottom: 0;

  @media (max-width: 1200px) {
    height: ${({ $compact, $expanded }) =>
      $compact ? '360px' : $expanded ? '320px' : '360px'};
  }
`

export const AiHeader = styled(CardHeader)`
  justify-content: space-between;
`

export const AiBadge = styled.span`
  font-size: 12px;
  color: #6da775;
`

export const AiBody = styled.div`
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 12px;
  overflow-y: auto;
  flex: 1;
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

export const AiPromptPlaceholder = styled.div`
  color: #7b849a;
  font-size: 12px;
`

export const AiPromptInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: #e6e8ee;
  font-size: 12px;

  &::placeholder {
    color: #7b849a;
  }
`
export const AiChatBubble = styled.div`
  background: #cfe0d6;
  color: #1b1f1b;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 11px;
  line-height: 1.4;
  align-self: flex-start;
`

export const AiUserBubble = styled.div`
  background: rgba(109, 167, 117, 0.18);
  color: #e6e8ee;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 11px;
  line-height: 1.4;
  align-self: flex-end;
`

export const ViewerCard = styled(Card)<{ $expanded?: boolean }>`
  position: relative;
  width: ${({ $expanded }) => ($expanded ? 'calc(100% + 40px)' : '100%')};
  margin: ${({ $expanded }) => ($expanded ? '0 -20px' : '0')};
  height: ${({ $expanded }) => ($expanded ? '920px' : 'clamp(560px, 72vh, 820px)')};
  min-height: ${({ $expanded }) => ($expanded ? '920px' : '0')};
  max-height: ${({ $expanded }) => ($expanded ? '920px' : 'none')};
  border: ${({ $expanded }) => ($expanded ? '1px solid #104912' : 'none')};
  box-shadow: ${({ $expanded }) => ($expanded ? '0 0 0 1px #104912' : 'none')};
  display: grid;
  grid-template-rows: auto 1fr auto;
  overflow: hidden;

  @media (max-width: 1200px) {
    width: 100%;
    margin: 0;
    height: ${({ $expanded }) =>
      $expanded ? 'clamp(520px, 70vh, 820px)' : 'clamp(500px, 70vh, 680px)'};
    min-height: ${({ $expanded }) => ($expanded ? '520px' : '0')};
    max-height: none;
  }
`

export const ViewerHeader = styled.div`
  padding: 18px 20px 10px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`

export const ViewerDivider = styled.div`
  width: 2px;
  height: 16px;
  background: rgba(109, 167, 117, 0.6);
`

export const ViewerDescription = styled.div`
  font-size: 11px;
  color: #aeb8cc;
  line-height: 1.4;
  flex: 1;
`

export const ProjectSelect = styled.select`
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(109, 167, 117, 0.35);
  background: #141414;
  color: #cfe0d6;
  font-size: 11px;
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
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
`

export const ToolbarButton = styled.button<{ $active?: boolean }>`
  width: 30px;
  height: 30px;
  border-radius: 9px;
  border: 1px solid ${({ $active }) => ($active ? '#6da775' : 'transparent')};
  background: ${({ $active }) => ($active ? 'rgba(109, 167, 117, 0.25)' : '#090909')};
  color: #c9d3e6;
  cursor: pointer;
  font-size: 12px;
`

export const ToolbarIcon = styled.img`
  width: 22px;
  height: 18px;
  display: block;
  transform: translateX(2px);
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
  justify-content: flex-start;
  gap: 18px;
  font-size: 28px;
  font-weight: 600;
  color: #e6e8ee;
  margin-top: 0;
`

export const NoteToggleOutside = styled.button<{ $shifted?: boolean }>`
  position: absolute;
  right: ${({ $shifted }) => ($shifted ? '350px' : '5px')};
  top: ${({ $shifted }) => ($shifted ? '30px' : '30px')};
  width: 52px;
  height: 52px;
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

export const NoteToggleIcon = styled.span`
  display: inline-block;
  transform: translateY(-23px);
`

export const ExpenseToggleOutside = styled.button<{ $shifted?: boolean }>`
  position: ${({ $shifted }) => ($shifted ? 'static' : 'absolute')};
  right: ${({ $shifted }) => ($shifted ? 'auto' : '15px')};
  top: ${({ $shifted }) => ($shifted ? 'auto' : 'clamp(360px, 60vh, 590px)')};
  width: 39px;
  height: 39px;
  border-radius: 50%;
  border: 1px solid #303030;
  background-color: #303030;
  background-image: ${({ $shifted }) =>
    $shifted
      ? "url(\"/src/assets/Study/expense-toggle-expand.png\")"
      : "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><circle cx='32' cy='32' r='32' fill='%232b2f2b'/><path d='M14 38v12h12' stroke='%237fb08a' stroke-width='6' stroke-linecap='round' stroke-linejoin='round' fill='none'/><path d='M50 26v-12h-12' stroke='%237fb08a' stroke-width='6' stroke-linecap='round' stroke-linejoin='round' fill='none'/></svg>\")"};
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100%;
  color: transparent;
  font-size: 0;
  line-height: 1;
  display: grid;
  place-items: center;
  cursor: pointer;
  z-index: 4;
`

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
`

export const NoteMeta = styled.div`
  display: flex;
  justify-content: flex-start;
  font-size: 16px;
  color: #8b8f94;
`

export const NoteBody = styled.div`
  font-size: 22px;
  line-height: 1.4;
  color: #d9e4d6;
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

export const ProgressRow = styled.div<{ $expanded?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0;
  width: ${({ $expanded }) => ($expanded ? 'calc(100% - 500px)' : '100%')};
  min-width: ${({ $expanded }) => ($expanded ? '360px' : 'auto')};
  margin: 0;

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
  width: 100%;
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
  background: #202020;
  border-radius: 18px;
  border: none;
  box-shadow: none;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`

export const ChatPlaceholder = styled.div`
  color: #7b849a;
  font-size: 12px;
`

export const ChatInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: #e6e8ee;
  font-size: 12px;

  &::placeholder {
    color: #7b849a;
  }
`
export const ChatTag = styled.span`
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(109, 167, 117, 0.2);
  color: #cfe0d6;
  font-size: 11px;
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
  font-size: 12px;
  cursor: pointer;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`
