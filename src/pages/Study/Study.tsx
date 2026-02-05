import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import AssemblyViewer from '../../components/assembly/AssemblyViewer'
import { projectConfigs } from '../../data/projects'
import './Study.css'
import * as S from './Study.style'

type Note = {
  id: string
  text: string
}

type NoteEditorState = {
  id: string | null
  text: string
  x: number
  y: number
  visible: boolean
}

type PartOverridesByProject = Record<string, Record<string, number>>

type ViewerTransforms = Record<
  string,
  {
    pos?: [number, number, number]
    rot?: [number, number, number]
    scale?: number
    scaleX?: number
    scaleY?: number
    scaleZ?: number
  }
>

type ViewerRef = {
  setProject?: (id: string, options?: { partOverrides?: Record<string, number> }) => void
  getCurrentTransforms?: () => ViewerTransforms
  applyTransformsByName?: (transforms: ViewerTransforms) => void
  setSelectedIndex?: (index: number) => void
  setExplodeScale?: (value: number) => void
  setSpeed?: (value: number) => void
  setTarget?: (value: number) => void
  setEditMode?: (value: boolean) => void
  setTransformMode?: (mode: string) => void
  setNoteMode?: (value: boolean) => void
  updateNote?: (id: string, text: string) => void
  getNoteScreenPosition?: (id: string) => { x: number; y: number; visible: boolean }
  deleteNote?: (id: string) => void
  setGroupSelection?: (names: string[]) => void
  getPartThumbnail?: (name: string, size?: number) => string | null
}

export const StudyPage = () => {
  const viewerRef = useRef<ViewerRef | null>(null)
  const progressRef = useRef<HTMLInputElement | null>(null)
  const [progressWidth, setProgressWidth] = useState(0)
  const projects = useMemo(
    () =>
      Object.entries(projectConfigs).map(([id, config]) => ({
        id,
        label: config.label,
      })),
    [],
  )

  const [projectId, setProjectId] = useState(
    () => localStorage.getItem('assembly-last-project') || 'drone',
  )
  const [partOverridesByProject, setPartOverridesByProject] =
    useState<PartOverridesByProject>(() => {
    const raw = localStorage.getItem('assembly-part-overrides')
    if (!raw) return {}
    try {
      return JSON.parse(raw)
    } catch {
      return {}
    }
  })
  const [, setStatus] = useState('로딩 중...')
  const [parts, setParts] = useState<string[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [explodePercent, setExplodePercent] = useState(0)
  const [, setIsAssemble] = useState(true)
  const [editMode, setEditMode] = useState(true)
  const [transformMode, setTransformMode] = useState('translate')
  const [noteMode, setNoteMode] = useState(false)
  const [notes, setNotes] = useState<Note[]>([])
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null)
  const [noteEditor, setNoteEditor] = useState<NoteEditorState>({
    id: null,
    text: '',
    x: 0,
    y: 0,
    visible: false,
  })
  const [partThumbnails, setPartThumbnails] = useState<Record<string, string>>({})

  const storageKey = `assembly-layout-${projectId}`
  const defaultStorageKey = `assembly-default-layout-${projectId}`
  const projectConfig = projectConfigs[projectId as keyof typeof projectConfigs]
  const projectLabel = projectConfig?.label ?? projectId
  const projectDescriptions: Record<string, string> = {
    drone:
      '드론(Drone)은 조종사가 탑승하지 않고 무선전파 유도를 통해 원격 제어하거나 자율 비행하는 무인 항공기(UAV) 또는 무인 항공 시스템(UAS)을 의미합니다. 초기엔 군사용으로 개발되었으나 현재는 촬영, 방제, 물류 배송, 취미용 등 다양한 분야에 활용되는 4차 산업 핵심 기기입니다.',
  }
  const projectDescription =
    projectDescriptions[projectId] ?? '프로젝트 설명이 준비 중입니다.'
  const partDescription = '드론의 주요 부품으로 기능 설명이 제공됩니다.'

  const normalizePartName = (name: string) => name.replace(/\s*\d+$/, '').trim()

  const uniqueParts = parts.reduce(
    (acc, name) => {
      const isRobotArm = projectId === 'robotArm'
      const base = isRobotArm
        ? name.startsWith('Part8') || name === 'Part8'
          ? 'Part8'
          : name
        : normalizePartName(name)
      if (!acc.seen.has(base)) {
        acc.seen.add(base)
        acc.items.push({ name, base })
      }
      return acc
    },
    { seen: new Set<string>(), items: [] as { name: string; base: string }[] },
  ).items

  const getPartIconSvg = (name: string) => {
    const lower = name.toLowerCase()
    let color = '#6ea8fe'
    let shape = 'frame'
    if (lower.includes('gear')) {
      color = '#c67b3d'
      shape = 'gear'
    } else if (lower.includes('blade')) {
      color = '#c8cdd6'
      shape = 'blade'
    } else if (lower.includes('leg')) {
      color = '#9aa3b2'
      shape = 'leg'
    } else if (lower.includes('frame')) {
      color = '#6ea8fe'
      shape = 'frame'
    }

    let iconPath = ''
    if (shape === 'gear') {
      iconPath = `
        <circle cx="32" cy="32" r="12" fill="${color}" />
        <circle cx="32" cy="32" r="5" fill="#1c241f" />
        <rect x="30" y="6" width="4" height="8" rx="2" fill="${color}" />
        <rect x="30" y="50" width="4" height="8" rx="2" fill="${color}" />
        <rect x="6" y="30" width="8" height="4" rx="2" fill="${color}" />
        <rect x="50" y="30" width="8" height="4" rx="2" fill="${color}" />
      `
    } else if (shape === 'blade') {
      iconPath = `
        <rect x="10" y="28" width="44" height="8" rx="4" fill="${color}" />
        <circle cx="32" cy="32" r="4" fill="#2a2f2d" />
      `
    } else if (shape === 'leg') {
      iconPath = `
        <rect x="18" y="12" width="10" height="30" rx="4" fill="${color}" />
        <rect x="18" y="34" width="24" height="8" rx="4" fill="${color}" />
      `
    } else {
      iconPath = `
        <rect x="22" y="8" width="20" height="32" rx="6" fill="${color}" />
        <rect x="12" y="26" width="40" height="8" rx="4" fill="${color}" />
      `
    }

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
        ${iconPath}
      </svg>
    `
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
  }
  const thumbWidth = 58
  const progressLeft = progressWidth
    ? ((progressWidth - thumbWidth) * explodePercent) / 100 + thumbWidth / 2
    : explodePercent
  const partOverrides = partOverridesByProject[projectId] ?? projectConfig?.defaultOverrides

  const handleProjectChange = (id: string) => {
    setProjectId(id)
    localStorage.setItem('assembly-last-project', id)
    viewerRef.current?.setProject(id, { partOverrides: partOverridesByProject[id] })
  }

  const handleSelectPart = (index: number) => {
    setSelectedIndex(index)
    viewerRef.current?.setSelectedIndex(index)
  }

  const percentToScale = (percent: number) => 0.2 + (1.8 * percent) / 100

  const handleExplodeScale = (percent: number) => {
    const nextPercent = Math.min(100, Math.max(0, percent))
    const scale = percentToScale(nextPercent)
    setExplodePercent(nextPercent)
    viewerRef.current?.setExplodeScale(scale)
    if (nextPercent <= 1) {
      setIsAssemble(true)
      viewerRef.current?.setTarget(0)
    } else {
      setIsAssemble(false)
      viewerRef.current?.setTarget(1)
    }
  }

  const handleToggleEdit = () => {
    const next = !editMode
    setEditMode(next)
    viewerRef.current?.setEditMode(next)
  }

  const handleTransformMode = (mode: string) => {
    setTransformMode(mode)
    viewerRef.current?.setTransformMode(mode)
  }

  const handleToggleNote = () => {
    const next = !noteMode
    setNoteMode(next)
    viewerRef.current?.setNoteMode(next)
    if (!next) {
      setNoteEditor((prev) => ({ ...prev, visible: false, id: null }))
    }
  }

  const handleActiveNote = (id: string) => {
    setActiveNoteId(id)
    if (!id) {
      setNoteEditor((prev) => ({ ...prev, visible: false, id: null }))
      return
    }
    const note = notes.find((item) => item.id === id)
    setNoteEditor((prev) => ({
      id,
      text: note?.text ?? '',
      x: prev.x,
      y: prev.y,
      visible: true,
    }))
  }

  const handleNoteEditorChange = (value: string) => {
    setNoteEditor((prev) => ({ ...prev, text: value }))
    if (noteEditor.id) {
      viewerRef.current?.updateNote(noteEditor.id, value)
    }
  }

  const handleNoteSubmit = () => {
    if (!noteEditor.id) return
    viewerRef.current?.updateNote(noteEditor.id, noteEditor.text)
    setNoteEditor((prev) => ({ ...prev, visible: false }))
  }

  useEffect(() => {
    if (!noteEditor.visible || !noteEditor.id) return
    let frameId: number
    const tick = () => {
      const pos = viewerRef.current?.getNoteScreenPosition(noteEditor.id)
      if (pos && pos.visible) {
        setNoteEditor((prev) => {
          if (!prev.visible) return prev
          const deltaX = Math.abs(prev.x - pos.x)
          const deltaY = Math.abs(prev.y - pos.y)
          if (deltaX < 0.5 && deltaY < 0.5) return prev
          return { ...prev, x: pos.x, y: pos.y }
        })
      }
      frameId = requestAnimationFrame(tick)
    }
    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [noteEditor.visible, noteEditor.id])

  useEffect(() => {
    if (!noteEditor.visible || !noteEditor.id) return
    const note = notes.find((item) => item.id === noteEditor.id)
    if (!note) return
    setNoteEditor((prev) => {
      if (prev.text === note.text) return prev
      return { ...prev, text: note.text ?? '' }
    })
  }, [notes, noteEditor.visible, noteEditor.id])

  useEffect(() => {
    const updateWidth = () => {
      if (!progressRef.current) return
      setProgressWidth(progressRef.current.clientWidth)
    }
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  return (
    <S.StudyWrapper>
      <S.NavBar>
        <S.Brand>SIMVEX</S.Brand>
        <S.NavMenu>
          <S.NavItem>Home</S.NavItem>
          <S.NavItem $active>Study</S.NavItem>
        </S.NavMenu>
        <S.LogoutButton>로그아웃</S.LogoutButton>
      </S.NavBar>

      <S.PageBody>
        <S.ContentGrid>
          <S.LeftColumn>
            <S.PartsCard>
              <S.CardHeader>Parts</S.CardHeader>
              <S.PartsList>
                {uniqueParts.map((part) => (
                  <S.PartRow
                    key={part.base}
                    $active={normalizePartName(parts[selectedIndex] || '') === part.base}
                    onClick={() =>
                      handleSelectPart(parts.findIndex((item) => normalizePartName(item) === part.base))
                    }
                  >
                    <S.PartIcon
                      style={{
                        backgroundImage: `url(${
                          partThumbnails[part.name] || getPartIconSvg(part.base)
                        })`,
                      }}
                    />
                    <S.PartMeta>
                      <S.PartTitle>{part.base}</S.PartTitle>
                    <S.PartDesc>{partDescription}</S.PartDesc>
                    </S.PartMeta>
                  </S.PartRow>
                ))}
              </S.PartsList>
            </S.PartsCard>

            <S.AiCard>
              <S.AiHeader>
                <span>AI Assistant</span>
                <S.AiBadge>AI</S.AiBadge>
              </S.AiHeader>
              <S.AiBody>
                <S.PartDesc>드론 정의가 뭐야?</S.PartDesc>
                <S.AiChatBubble>
                  RTH(Return To Home)는 드론이 자동으로 홈 포인트로 복귀하는 기능입니다. GPS
                  신호가 안정적으로 확보된 후에 복귀하도록 설정합니다.
                </S.AiChatBubble>
                <S.PartDesc>무엇이 궁금한가요?</S.PartDesc>
              </S.AiBody>
            </S.AiCard>
          </S.LeftColumn>

          <S.CenterColumn>
            <S.ViewerCard>
              <S.ViewerHeader>
                <span>{projectLabel}</span>
                <S.ViewerDivider />
                <S.ViewerDescription>{projectDescription}</S.ViewerDescription>
                <S.ProjectSelect
                  value={projectId}
                  onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                    handleProjectChange(event.target.value)
                  }
                >
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.label}
                    </option>
                  ))}
                </S.ProjectSelect>
              </S.ViewerHeader>
              <S.ViewerBody>
                <S.ViewerToolbar>
                  <S.ToolbarButton $active={editMode} onClick={handleToggleEdit}>
                    ✋
                  </S.ToolbarButton>
                  <S.ToolbarButton
                    $active={transformMode === 'translate'}
                    onClick={() => handleTransformMode('translate')}
                  >
                    ↔
                  </S.ToolbarButton>
                  <S.ToolbarButton
                    $active={transformMode === 'rotate'}
                    onClick={() => handleTransformMode('rotate')}
                  >
                    ⟳
                  </S.ToolbarButton>
                  <S.ToolbarButton
                    $active={transformMode === 'scale'}
                    onClick={() => handleTransformMode('scale')}
                  >
                    ⤢
                  </S.ToolbarButton>
                  <S.ToolbarButton $active={noteMode} onClick={handleToggleNote}>
                    ✎
                  </S.ToolbarButton>
                </S.ViewerToolbar>

                <S.NotePanel>
                  <S.NoteHeader>
                    <span>note</span>
                    <S.NoteToggle>⌄</S.NoteToggle>
                  </S.NoteHeader>
                  <S.NoteSearch placeholder="검색" />
                  <S.NoteList>
                    {notes.slice(0, 4).map((note) => (
                      <S.NoteItem key={note.id}>
                        {note.text || '메모 show'}
                        {note.id === activeNoteId ? ' · 선택됨' : ''}
                      </S.NoteItem>
                    ))}
                    {!notes.length && <S.NoteItem>메모가 없습니다.</S.NoteItem>}
                  </S.NoteList>
                </S.NotePanel>

                <AssemblyViewer
                  ref={viewerRef}
                  projectId={projectId}
                  partOverrides={partOverrides}
                  onStatusChange={setStatus}
                  onPartsChange={(nextParts) => {
                    setParts(nextParts)
                    if (viewerRef.current?.getPartThumbnail) {
                      const nextThumbs: Record<string, string> = {}
                      nextParts.forEach((partName) => {
                        const thumb = viewerRef.current?.getPartThumbnail?.(partName, 64)
                        if (thumb) {
                          nextThumbs[partName] = thumb
                        }
                      })
                      setPartThumbnails(nextThumbs)
                    }
                    if (nextParts.length) {
                      setSelectedIndex(0)
                    }
                    const raw =
                      localStorage.getItem(storageKey) ||
                      localStorage.getItem(defaultStorageKey)
                    if (raw) {
                      try {
                        const transforms = JSON.parse(raw)
                        viewerRef.current?.applyTransformsByName?.(transforms)
                        setStatus('로컬 저장값 적용')
                      } catch (error) {
                        console.error('레이아웃 자동 불러오기 실패', error)
                      }
                    }
                  }}
                  onSelectedChange={(index) => {
                    setSelectedIndex(index)
                  }}
                  onNotesChange={(nextNotes) => setNotes(nextNotes as Note[])}
                  onActiveNoteChange={handleActiveNote}
                />

                {noteEditor.visible && noteMode && (
                  <div
                    className="note-editor"
                    style={{ left: `${noteEditor.x}px`, top: `${noteEditor.y}px` }}
                    onMouseDown={(event) => event.stopPropagation()}
                  >
                    <div className="note-editor__avatar" />
                    <div className="note-editor__bubble">
                      <textarea
                        className="note-editor__input"
                        placeholder="메모 생성"
                        rows={1}
                        value={noteEditor.text}
                        onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                          handleNoteEditorChange(event.target.value)
                        }
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' && !event.shiftKey) {
                            event.preventDefault()
                            handleNoteSubmit()
                          }
                          if (event.key === 'Escape') {
                            event.preventDefault()
                            setNoteEditor((prev) => ({ ...prev, visible: false }))
                          }
                        }}
                      />
                      <button
                        className="note-editor__send"
                        type="button"
                        onClick={handleNoteSubmit}
                      >
                        ↗
                      </button>
                    </div>
                  </div>
                )}

                <S.ViewerFooter>
                  <S.ProgressRow>
                    <S.ProgressWrap>
                      <S.ProgressLabel style={{ left: `${progressLeft}px` }}>
                        {Math.round(explodePercent)}%
                      </S.ProgressLabel>
                      <S.ProgressBar
                        ref={progressRef}
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        value={explodePercent}
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                          handleExplodeScale(Number(event.target.value))
                        }
                      />
                    </S.ProgressWrap>
                  </S.ProgressRow>
                </S.ViewerFooter>
              </S.ViewerBody>
            </S.ViewerCard>

            <S.BottomChat>
              <S.ChatPlaceholder>무엇이 궁금한가요?</S.ChatPlaceholder>
              <S.ChatTag>{projectLabel}</S.ChatTag>
              <S.ChatSend>↗</S.ChatSend>
            </S.BottomChat>
          </S.CenterColumn>
        </S.ContentGrid>
      </S.PageBody>
    </S.StudyWrapper>
  )
}
