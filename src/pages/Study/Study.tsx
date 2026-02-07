import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import AssemblyViewer, { type AssemblyViewerHandle } from '../../components/assembly/AssemblyViewer'
import toolSelectIcon from '/src/assets/viewer-tool-select.png'
import toolHandIcon from '/src/assets/viewer-tool-hand.png'
import toolChatIcon from '/src/assets/viewer-tool-chat.png'
import toolAiIcon from '/src/assets/viewer-tool-ai.png'
import { projectConfigs } from '../../data/projects'
import './Study.css'
import * as S from './Study.style'

type Note = {
  id: string
  text: string
  parentName?: string | null
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

const StudyLayout = ({ expanded }: { expanded: boolean }) => {
  const navigate = useNavigate()
  const viewerRef = useRef<AssemblyViewerHandle | null>(null)
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
  const safeProjectId = Object.prototype.hasOwnProperty.call(projectConfigs, projectId)
    ? projectId
    : 'drone'
  const [partOverridesByProject] = useState<PartOverridesByProject>(() => {
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
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [explodePercent, setExplodePercent] = useState(0)
  const [, setIsAssemble] = useState(true)
  const [editMode, setEditMode] = useState(true)
  const [noteMode, setNoteMode] = useState(false)
  const [notes, setNotes] = useState<Note[]>([])
  const [noteEditor, setNoteEditor] = useState<NoteEditorState>({
    id: null,
    text: '',
    x: 0,
    y: 0,
    visible: false,
  })
  const [notePanelOpen, setNotePanelOpen] = useState(true)
  const expenseToggleOn = expanded
  const [partThumbnails, setPartThumbnails] = useState<Record<string, string>>({})
  const [viewMode, setViewMode] = useState<'single' | 'assembly'>('assembly')
  const [aiPanelOpen, setAiPanelOpen] = useState(true)

  const storageKey = `assembly-layout-${safeProjectId}`
  const defaultStorageKey = `assembly-default-layout-${safeProjectId}`
  const projectConfig = projectConfigs[safeProjectId as keyof typeof projectConfigs]
  const projectLabel = projectConfig?.label ?? safeProjectId
  const projectDescriptions: Record<string, string> = {
    drone:
      '드론(Drone)은 조종사가 탑승하지 않고 무선전파 유도를 통해 원격 제어하거나 자율 비행하는 무인 항공기(UAV) 또는 무인 항공 시스템(UAS)을 의미합니다. 초기엔 군사용으로 개발되었으나 현재는 촬영, 방제, 물류 배송, 취미용 등 다양한 분야에 활용되는 4차 산업 핵심 기기입니다.',
  }
  const projectDescription =
    projectDescriptions[safeProjectId] ?? '프로젝트 설명이 준비 중입니다.'
  const partDescription = '드론의 주요 부품으로 기능 설명이 제공됩니다.'

  const normalizePartName = (name: string) => {
    if (safeProjectId === 'robotArm') {
      if (name.startsWith('Part8')) return 'Part8'
      return name
    }
    if (safeProjectId === 'robotGripper') {
      if (name.toLowerCase().startsWith('gear link')) return name
    }
    return name.replace(/\s*\d+$/, '').trim()
  }

  const uniqueParts = parts.reduce(
    (acc, name) => {
      const isRobotArm = safeProjectId === 'robotArm'
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

  const displaySelectedIndex =
    viewMode === 'single'
      ? selectedIndex >= 0
        ? selectedIndex
        : parts.length > 0
          ? 0
          : -1
      : selectedIndex

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

  const getPartThumbnailCandidates = (baseName: string) => {
    if (!projectConfig?.basePath) return []
    const isLeafSpringPin = safeProjectId === 'leafSpring' && baseName === 'Spring Pin'
    const basePath = isLeafSpringPin ? '/assets/Robot Gripper' : projectConfig.basePath
    const candidates = new Set<string>()
    const addCandidate = (name: string) => {
      if (!name) return
      candidates.add(encodeURI(`${basePath}/${name}.png`))
    }
    const addCaseVariants = (name: string) => {
      addCandidate(name)
      const lower = name.toLowerCase()
      if (lower !== name) addCandidate(lower)
    }
    const trimmed = baseName.replace(/\s+/g, ' ').trim()
    if (isLeafSpringPin) {
      addCaseVariants('Pin')
    } else {
      addCaseVariants(trimmed)
    }
    if (baseName.includes(' MIR')) {
      addCaseVariants(baseName.replace(' MIR', '_MIR'))
    }
    if (safeProjectId === 'drone') {
      const droneAliases: Record<string, string> = {
        Arm: 'Arm gear',
        Blade: 'Impellar Blade',
        'Beater disc': 'Beater disc',
        Gearing: 'Gearing',
        Leg: 'Leg',
        'Main frame': 'Main frame',
        'Main frame MIR': 'Main frame_MIR',
        Nut: 'Nut',
        Screw: 'Screw',
        xyz: 'xyz',
      }
      const alias = droneAliases[baseName]
      if (alias) addCaseVariants(alias)
      if (baseName === 'Main frame MIR') {
        addCandidate('main frame_MIR')
      }
      if (baseName === 'Beater disc') addCaseVariants('bester disc')
    }
    if (safeProjectId === 'v4Engine') {
      if (baseName === 'Piston Pin') addCaseVariants('poston pin')
    }
    return Array.from(candidates)
  }

  const resolvePartThumbnail = (baseName: string) =>
    new Promise<string | null>((resolve) => {
      const candidates = getPartThumbnailCandidates(baseName)
      if (!candidates.length) {
        resolve(null)
        return
      }
      let index = 0
      const tryNext = () => {
        if (index >= candidates.length) {
          resolve(null)
          return
        }
        const url = candidates[index]
        index += 1
        const img = new Image()
        img.onload = () => resolve(url)
        img.onerror = () => tryNext()
        img.src = url
      }
      tryNext()
    })
  const thumbWidth = 58
  const progressLeft = progressWidth
    ? ((progressWidth - thumbWidth) * explodePercent) / 100 + thumbWidth / 2
    : explodePercent
  const partOverrides = partOverridesByProject[safeProjectId] ?? projectConfig?.defaultOverrides

  const handleExpenseToggle = () => {
    navigate(expanded ? '/study' : '/study/expense')
  }

  const handleProjectChange = (id: string) => {
    setProjectId(id)
    localStorage.setItem('assembly-last-project', id)
    viewerRef.current?.setProject?.(id, { partOverrides: partOverridesByProject[id] })
  }

  const handleSelectPart = (index: number) => {
    setSelectedIndex(index)
    viewerRef.current?.setSelectedIndex?.(index)
    if (viewMode === 'single' && index >= 0) {
      const name = parts[index]
      if (name) {
        viewerRef.current?.setHiddenParts?.(parts.filter((_, idx) => idx !== index))
        viewerRef.current?.focusOnPart?.(name)
      }
    }
  }

  const percentToScale = (percent: number) => 0.2 + (1.8 * percent) / 100

  const handleExplodeScale = (percent: number) => {
    const nextPercent = Math.min(100, Math.max(0, percent))
    const scale = percentToScale(nextPercent)
    setExplodePercent(nextPercent)
    viewerRef.current?.setExplodeScale?.(scale)
    if (nextPercent <= 1) {
      setIsAssemble(true)
      viewerRef.current?.setTarget?.(0)
    } else {
      setIsAssemble(false)
      viewerRef.current?.setTarget?.(1)
    }
  }

  const handleSelectMode = () => {
    if (viewMode === 'single') return
    setEditMode(true)
    viewerRef.current?.setEditMode?.(true)
    viewerRef.current?.setTransformMode?.('translate')
  }

  const handleSwipeMode = () => {
    if (viewMode === 'single') return
    setEditMode(false)
    viewerRef.current?.setEditMode?.(false)
  }

  const handleToggleNote = () => {
    const next = !noteMode
    setNoteMode(next)
    viewerRef.current?.setNoteMode?.(next)
    if (!next) {
      setNoteEditor((prev) => ({ ...prev, visible: false, id: null }))
    }
  }

  const handleActiveNote = (id: string | null) => {
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
      viewerRef.current?.updateNote?.(noteEditor.id, value)
    }
  }

  const handleNoteSubmit = () => {
    if (!noteEditor.id) return
    viewerRef.current?.updateNote?.(noteEditor.id, noteEditor.text)
    setNoteEditor((prev) => ({ ...prev, visible: false }))
  }

  useEffect(() => {
    if (!noteEditor.visible || !noteEditor.id) return
    const noteId = noteEditor.id
    let frameId: number
    const tick = () => {
      const pos = viewerRef.current?.getNoteScreenPosition?.(noteId)
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
    let cancelled = false
    const loadThumbnails = async () => {
      if (!parts.length) {
        setPartThumbnails({})
        return
      }
      const unique = parts.reduce(
        (acc, name) => {
          const isRobotArm = safeProjectId === 'robotArm'
          const base = isRobotArm
            ? name.startsWith('Part8') || name === 'Part8'
              ? 'Part8'
              : name
            : normalizePartName(name)
          if (!acc.seen.has(base)) {
            acc.seen.add(base)
            acc.items.push(base)
          }
          return acc
        },
        { seen: new Set<string>(), items: [] as string[] },
      ).items
      const entries = await Promise.all(
        unique.map(async (base) => [base, await resolvePartThumbnail(base)] as const),
      )
      if (cancelled) return
      const nextThumbs: Record<string, string> = {}
      entries.forEach(([base, url]) => {
        if (url) nextThumbs[base] = url
      })
      setPartThumbnails(nextThumbs)
    }
    loadThumbnails()
    return () => {
      cancelled = true
    }
  }, [projectId, parts])

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

  useEffect(() => {
    setViewMode('assembly')
    setSelectedIndex(-1)
  }, [])

  const prevViewModeRef = useRef<'single' | 'assembly'>('assembly')
  useEffect(() => {
    if (viewMode === 'assembly' && prevViewModeRef.current === 'single') {
      viewerRef.current?.focusOnScene?.()
    }
    prevViewModeRef.current = viewMode
  }, [viewMode])

  useEffect(() => {
    if (safeProjectId !== projectId) {
      setProjectId(safeProjectId)
      localStorage.setItem('assembly-last-project', safeProjectId)
    }
  }, [projectId, safeProjectId])

  useEffect(() => {
    if (!parts.length) return
    viewerRef.current?.setViewMode?.(viewMode)
    if (viewMode === 'single') {
      if (editMode) {
        setEditMode(false)
        viewerRef.current?.setEditMode?.(false)
      }
      if (selectedIndex < 0) {
        const fallbackIndex = parts.length > 0 ? 0 : -1
        const fallbackName = fallbackIndex >= 0 ? parts[fallbackIndex] : ''
        viewerRef.current?.setSelectedIndex?.(-1)
        if (!fallbackName) return
        viewerRef.current?.setHiddenParts?.(
          parts.filter((_, idx) => idx !== fallbackIndex),
        )
        viewerRef.current?.focusOnPart?.(fallbackName)
        return
      }
      const name = parts[selectedIndex]
      if (!name) return
      viewerRef.current?.setSelectedIndex?.(selectedIndex)
      viewerRef.current?.setHiddenParts?.(parts.filter((_, idx) => idx !== selectedIndex))
      viewerRef.current?.focusOnPart?.(name)
      return
    }
    viewerRef.current?.setHiddenParts?.([])
    if (selectedIndex >= 0) {
      viewerRef.current?.setSelectedIndex?.(selectedIndex)
    }
  }, [viewMode, parts, selectedIndex])

  const renderPartsCard = (expanded: boolean) => (
    <S.PartsCard $expanded={expanded}>
      <S.CardHeader>Parts</S.CardHeader>
      <S.PartsList>
        {uniqueParts.map((part) => (
          <S.PartRow
            key={part.base}
            $active={
              displaySelectedIndex >= 0 &&
              normalizePartName(parts[displaySelectedIndex] || '') === part.base
            }
            onClick={() => {
              const nextIndex = parts.findIndex(
                (item) => normalizePartName(item) === part.base,
              )
              if (selectedIndex === nextIndex) {
                setSelectedIndex(-1)
                viewerRef.current?.setSelectedIndex?.(-1)
                return
              }
              handleSelectPart(nextIndex)
            }}
          >
            <S.PartIcon
              style={{
                backgroundImage: `url(${
                  partThumbnails[part.base] || getPartIconSvg(part.base)
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
  )

  const renderAiCard = (expanded: boolean, compact = false, showPrompt = false) => (
    <S.AiCard $expanded={expanded} $compact={compact}>
      <S.AiHeader>
        <span>AI Assistant</span>
        <S.AiBadge>AI</S.AiBadge>
      </S.AiHeader>
      <S.AiBody>
        <S.PartDesc>드론 정의가 뭐야?</S.PartDesc>
        <S.AiChatBubble>
          RTH(Return To Home)는 드론이 자동으로 홈 포인트로 복귀하는 기능입니다. GPS 신호가
          안정적으로 확보된 후에 복귀하도록 설정합니다.
        </S.AiChatBubble>
        <S.PartDesc>무엇이 궁금한가요?</S.PartDesc>
      </S.AiBody>
      {showPrompt && (
        <S.AiPromptBar>
          <S.AiPromptPlaceholder>무엇이 궁금한가요?</S.AiPromptPlaceholder>
          <S.ChatSend>↗</S.ChatSend>
        </S.AiPromptBar>
      )}
    </S.AiCard>
  )

  return (
    <S.PageBody>
      <S.ContentGrid $expanded={expenseToggleOn}>
        {!expenseToggleOn && (
          <S.LeftColumn>
            {renderPartsCard(false)}
            {renderAiCard(false)}
          </S.LeftColumn>
        )}

        <S.CenterColumn>
          <S.ViewerCard $expanded={expenseToggleOn}>
              <S.ViewerHeader>
                <span>{projectLabel}</span>
                <S.ViewerDivider />
                <S.ViewerDescription>{projectDescription}</S.ViewerDescription>
                <S.ProjectSelect
                  value={safeProjectId}
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
                  {expenseToggleOn ? (
                    <>
                      <S.ToolbarButton
                        $active={editMode}
                        onClick={handleSelectMode}
                        disabled={viewMode === 'single'}
                      >
                        <S.ToolbarIcon src={toolSelectIcon} alt="" />
                      </S.ToolbarButton>
                      <S.ToolbarButton
                        $active={!editMode}
                        onClick={handleSwipeMode}
                        disabled={viewMode === 'single'}
                      >
                        <S.ToolbarIcon src={toolHandIcon} alt="" />
                      </S.ToolbarButton>
                      <S.ToolbarButton $active={noteMode} onClick={handleToggleNote}>
                        <S.ToolbarIcon src={toolChatIcon} alt="" />
                      </S.ToolbarButton>
                      <S.ToolbarDivider />
                      <S.ToolbarButton
                        type="button"
                        $active={aiPanelOpen}
                        onClick={() => setAiPanelOpen((prev) => !prev)}
                      >
                        <S.ToolbarIcon src={toolAiIcon} alt="" />
                      </S.ToolbarButton>
                    </>
                  ) : (
                    <>
                      <S.ToolbarButton
                        $active={editMode}
                        onClick={handleSelectMode}
                        disabled={viewMode === 'single'}
                      >
                        <S.ToolbarIcon src={toolSelectIcon} alt="" />
                      </S.ToolbarButton>
                      <S.ToolbarButton
                        $active={!editMode}
                        onClick={handleSwipeMode}
                        disabled={viewMode === 'single'}
                      >
                        <S.ToolbarIcon src={toolHandIcon} alt="" />
                      </S.ToolbarButton>
                      <S.ToolbarButton $active={noteMode} onClick={handleToggleNote}>
                        <S.ToolbarIcon src={toolChatIcon} alt="" />
                      </S.ToolbarButton>
                    </>
                  )}
                </S.ViewerToolbar>
                {!expenseToggleOn && (
                  <S.ViewModeToggle>
                    <S.ViewModeButton
                      $active={viewMode === 'single'}
                      onClick={() => setViewMode('single')}
                    >
                      단일 부품
                    </S.ViewModeButton>
                    <S.ViewModeButton
                      $active={viewMode === 'assembly'}
                      onClick={() => setViewMode('assembly')}
                    >
                      조립도
                    </S.ViewModeButton>
                  </S.ViewModeToggle>
                )}

                <S.NoteToggleOutside
                  type="button"
                  $shifted={expenseToggleOn}
                  onClick={() => setNotePanelOpen((prev) => !prev)}
                >
                  <S.NoteToggleIcon>⌄</S.NoteToggleIcon>
                </S.NoteToggleOutside>
                {!expenseToggleOn && (
                  <S.ExpenseToggleOutside
                    type="button"
                    aria-label="expense toggle"
                    title="expense toggle"
                    data-active={expenseToggleOn}
                    $shifted={expenseToggleOn}
                    onClick={handleExpenseToggle}
                  />
                )}
                {notePanelOpen && (
                  <S.NotePanel $shifted={expenseToggleOn}>
                    <S.NoteHeader>
                      <span>note</span>
                      <S.NoteSearch placeholder="검색" />
                    </S.NoteHeader>
                    <S.NoteList>
                    {notes.slice(0, 4).map((note) => (
                        <S.NoteItem key={note.id}>
                        <S.NoteMeta>
                          <span>{note.parentName || '알 수 없는 부품'}</span>
                        </S.NoteMeta>
                          <S.NoteBody>{note.text || '메모 show 메모 show 메모 show'}</S.NoteBody>
                        </S.NoteItem>
                      ))}
                    {!notes.length && (
                      <S.NoteEmpty>
                        <S.NoteBody>메모가 없습니다.</S.NoteBody>
                      </S.NoteEmpty>
                    )}
                    </S.NoteList>
                  </S.NotePanel>
                )}

                {expenseToggleOn && (
                  <S.ExpandedPanels>
                    {aiPanelOpen ? (
                      <S.ExpandedLeftPanel>{renderAiCard(true, true, true)}</S.ExpandedLeftPanel>
                    ) : (
                      <S.AiCollapsedBadge type="button" onClick={() => setAiPanelOpen(true)}>
                        AI
                      </S.AiCollapsedBadge>
                    )}
                    <S.ExpandedRightPanel>
                      <S.ExpandedViewModeToggle>
                        <S.ViewModeButton
                          $active={viewMode === 'single'}
                          onClick={() => setViewMode('single')}
                        >
                          단일 부품
                        </S.ViewModeButton>
                        <S.ViewModeButton
                          $active={viewMode === 'assembly'}
                          onClick={() => setViewMode('assembly')}
                        >
                          조립도
                        </S.ViewModeButton>
                      </S.ExpandedViewModeToggle>
                      {renderPartsCard(true)}
                    </S.ExpandedRightPanel>
                  </S.ExpandedPanels>
                )}

                <AssemblyViewer
                  ref={viewerRef}
                  projectId={safeProjectId}
                  partOverrides={partOverrides}
                  onStatusChange={setStatus}
                  onPartsChange={(nextParts: string[]) => {
                    setParts(nextParts)
                    if (nextParts.length) {
                      setSelectedIndex(-1)
                      viewerRef.current?.setSelectedIndex?.(-1)
                    }
                    const raw =
                      localStorage.getItem(storageKey) ||
                      localStorage.getItem(defaultStorageKey)
                    if (raw) {
                      try {
                        const transforms = JSON.parse(raw)
                        if (safeProjectId === 'leafSpring') {
                          const remapped: ViewerTransforms = {}
                          Object.entries(transforms).forEach(([name, values]) => {
                            if (name.startsWith('Pin ')) {
                              remapped[`Spring Pin ${name.replace('Pin ', '')}`] =
                                values as ViewerTransforms[string]
                            } else {
                              remapped[name] = values as ViewerTransforms[string]
                            }
                          })
                          viewerRef.current?.applyTransformsByName?.(remapped)
                        } else if (safeProjectId === 'robotGripper') {
                          const filtered: ViewerTransforms = {}
                          Object.entries(transforms).forEach(([name, values]) => {
                            if (name.startsWith('Spring Pin ')) return
                            filtered[name] = values as ViewerTransforms[string]
                          })
                          viewerRef.current?.applyTransformsByName?.(filtered)
                        } else {
                          viewerRef.current?.applyTransformsByName?.(transforms)
                        }
                        setStatus('로컬 저장값 적용')
                      } catch (error) {
                        console.error('레이아웃 자동 불러오기 실패', error)
                      }
                    }
                    if (safeProjectId === 'drone') {
                      const manualDefaults = projectConfig?.manualDefaults as
                        | Record<string, { pos?: number[]; rot?: number[]; scale?: number; scaleX?: number; scaleY?: number; scaleZ?: number }>
                        | undefined
                      if (manualDefaults) {
                        const hardwareOverrides: ViewerTransforms = {}
                        Object.entries(manualDefaults).forEach(([name, values]) => {
                          if (!name.startsWith('Nut ') && !name.startsWith('Screw ')) return
                          const pos =
                            Array.isArray(values.pos) && values.pos.length === 3
                              ? (values.pos as [number, number, number])
                              : undefined
                          const rot =
                            Array.isArray(values.rot) && values.rot.length === 3
                              ? (values.rot as [number, number, number])
                              : undefined
                          hardwareOverrides[name] = {
                            pos,
                            rot,
                            scale: values.scale,
                            scaleX: values.scaleX,
                            scaleY: values.scaleY,
                            scaleZ: values.scaleZ,
                          }
                        })
                        if (Object.keys(hardwareOverrides).length > 0) {
                          viewerRef.current?.applyTransformsByName?.(hardwareOverrides)
                        }
                      }
                    }
                  }}
                  onSelectedChange={(index: number) => {
                    setSelectedIndex(index)
                  }}
                  onNotesChange={(nextNotes: unknown[]) => setNotes(nextNotes as Note[])}
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

                <S.ViewerFooter $expanded={expenseToggleOn}>
                  <S.ProgressRow $expanded={expenseToggleOn}>
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
                  {expenseToggleOn && (
                    <S.ExpenseToggleOutside
                      type="button"
                      aria-label="expense toggle"
                      title="expense toggle"
                      data-active={expenseToggleOn}
                      $shifted={expenseToggleOn}
                      onClick={handleExpenseToggle}
                    />
                  )}
                </S.ViewerFooter>
              </S.ViewerBody>
          </S.ViewerCard>

            {!expenseToggleOn && (
              <S.BottomChat>
                <S.ChatPlaceholder>무엇이 궁금한가요?</S.ChatPlaceholder>
                <S.ChatSend>↗</S.ChatSend>
              </S.BottomChat>
            )}
        </S.CenterColumn>
      </S.ContentGrid>
    </S.PageBody>
  )
}

export const StudyPage = () => <StudyLayout expanded={false} />
export const StudyExpensePage = () => <StudyLayout expanded />
