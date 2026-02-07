import styled from 'styled-components'

export const StudyWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #0b0c0b;
  color: #e6e8ee;
  display: flex;
  flex-direction: column;
`

export const NavBar = styled.header`
  height: 64px;
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  align-items: center;
  padding: 0 32px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`

export const Brand = styled.div`
  font-weight: 700;
  letter-spacing: 0.5px;
  font-size: 18px;
`

export const NavMenu = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  font-size: 14px;
  color: #aeb8cc;
`

export const NavItem = styled.div<{ $active?: boolean }>`
  color: ${({ $active }) => ($active ? '#e6e8ee' : '#aeb8cc')};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
`

export const LogoutButton = styled.button`
  justify-self: end;
  padding: 6px 14px;
  border-radius: 10px;
  border: 1px solid rgba(110, 168, 254, 0.2);
  background: transparent;
  color: #c9d3e6;
  font-size: 12px;
`

export const PageBody = styled.div`
  flex: 1;
  padding: 24px 32px 32px;
`

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 400px minmax(0, 1fr);
  gap: 18px;
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
  background: #151515;
  border-radius: 18px;
  border: 1px solid #104912;
  box-shadow: 0 0 0 1px #104912;
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

export const PartsCard = styled(Card)`
  height: 400px;
  display: grid;
  grid-template-rows: auto 1fr;
`

export const PartsList = styled.div`
  padding: 0 14px 16px;
  display: grid;
  gap: 10px;
  overflow-y: auto;
`

export const PartRow = styled.button<{ $active?: boolean }>`
  display: grid;
  grid-template-columns: 38px 1fr;
  gap: 10px;
  align-items: center;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid ${({ $active }) => ($active ? 'rgba(109, 167, 117, 0.6)' : 'transparent')};
  background: ${({ $active }) => ($active ? 'rgba(109, 167, 117, 0.15)' : '#1b1b1b')};
  color: #e6e8ee;
  text-align: left;
  cursor: pointer;
`

export const PartIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #1c241f;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  display: grid;
  place-items: center;
  color: #6da775;
  font-size: 12px;
`

export const PartMeta = styled.div`
  display: grid;
  gap: 4px;
`

export const PartTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
`

export const PartDesc = styled.div`
  font-size: 10px;
  color: #9ca3af;
`

export const AiCard = styled(Card)`
  height: 400px;
  display: grid;
  grid-template-rows: auto 1fr;
  padding-bottom: 16px;
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
  display: grid;
  gap: 10px;
  font-size: 12px;
  overflow-y: auto;
`

export const AiChatBubble = styled.div`
  background: #cfe0d6;
  color: #1b1f1b;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 11px;
  line-height: 1.4;
`

export const ViewerCard = styled(Card)`
  position: relative;
  min-height: 520px;
  display: grid;
  grid-template-rows: auto 1fr auto;
  overflow: hidden;
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
`

export const ViewerToolbar = styled.div`
  position: absolute;
  left: 18px;
  top: 20px;
  display: grid;
  gap: 10px;
  background: #1b1b1b;
  padding: 8px;
  border-radius: 12px;
  border: 1px solid rgba(109, 167, 117, 0.35);
  z-index: 3;
`

export const ToolbarButton = styled.button<{ $active?: boolean }>`
  width: 30px;
  height: 30px;
  border-radius: 9px;
  border: 1px solid ${({ $active }) => ($active ? '#6da775' : 'transparent')};
  background: ${({ $active }) => ($active ? 'rgba(109, 167, 117, 0.25)' : '#202020')};
  color: #c9d3e6;
  cursor: pointer;
  font-size: 12px;
`

export const NotePanel = styled.div`
  position: absolute;
  right: 64px;
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

export const NoteToggleOutside = styled.button`
  position: absolute;
  right: 5px;
  top: 30px;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 1px solid rgba(109, 167, 117, 0.5);
  background: rgba(109, 167, 117, 0.35);
  color: #cfe0d6;
  font-size: 28px;
  line-height: 1;
  display: grid;
  place-items: center;
  cursor: pointer;
  z-index: 4;
`

export const NoteToggleIcon = styled.span`
  display: inline-block;
  transform: translateY(-10px);
`

export const NoteSearch = styled.input`
  width: 45%;
  margin-left: 110px;
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

export const ViewerFooter = styled.div`
  position: absolute;
  left: 18px;
  right: 18px;
  bottom: 16px;
  display: grid;
  gap: 6px;
  font-size: 11px;
  color: #aeb8cc;
  z-index: 3;
`

export const ProgressRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
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

export const BottomChat = styled(Card)`
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
`
