import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import * as THREE from 'three'
import AssemblyViewer, { type AssemblyViewerHandle } from '../../components/assembly/AssemblyViewer'
import toolSelectIcon from '/src/assets/Study/viewer-tool-select.png'
import toolHandIcon from '/src/assets/Study/viewer-tool-hand.png'
import toolChatIcon from '/src/assets/Study/viewer-tool-chat.png'
import toolAiIcon from '/src/assets/Study/viewer-tool-ai.png'
import noteEditIcon from '/src/assets/Study/note-edit.png'
import noteDeleteIcon from '/src/assets/Study/note-delete.png'
import { projectConfigs } from '../../data/projects'
import {
  askChat,
  createStudySession,
  createStudyNote,
  getChatHistory,
  getMaterialParts,
  getStudyNotes,
  getStudyHomeAll,
  getStudySessionParts,
  updateStudyNote,
  deleteStudyNote,
  saveStudySession,
} from '../../entities/study/api/studyApi'
import type { MaterialPart, StudySession, StudySessionPart } from '../../entities/study/types'
import './Study.css'
import * as S from './Study.style'

type Note = {
  id: string | number
  text: string
  parentName?: string | null
}

type NoteEditorState = {
  id: string | number | null
  text: string
  x: number
  y: number
  visible: boolean
}

type AiMessage = {
  id: string
  role: 'user' | 'assistant'
  text: string
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
  const [searchParams] = useSearchParams()
  const urlMaterialId = searchParams.get('materialId')
  const projectIdFromMaterial = useMemo(() => {
    if (!urlMaterialId) return null
    const mid = Number(urlMaterialId)
    if (!Number.isFinite(mid)) return null
    const entry = Object.entries(projectConfigs).find(
      ([, config]) => config.materialId === mid,
    )
    return entry?.[0] ?? null
  }, [urlMaterialId])

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

  const [projectId, setProjectId] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    const mid = params.get('materialId')
    if (mid) {
      const num = Number(mid)
      if (Number.isFinite(num)) {
        const entry = Object.entries(projectConfigs).find(
          ([, config]) => config.materialId === num,
        )
        if (entry) return entry[0]
      }
    }
    return localStorage.getItem('assembly-last-project') || 'drone'
  })

  // URL에 materialId가 있으면 해당 material의 project로 전환 (직접 /study 접근 후 쿼리 변경 등)
  useEffect(() => {
    if (projectIdFromMaterial && projectIdFromMaterial !== projectId) {
      setProjectId(projectIdFromMaterial)
      localStorage.setItem('assembly-last-project', projectIdFromMaterial)
    }
  }, [projectIdFromMaterial, projectId])
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
  const noteIdMapRef = useRef<Record<number, number>>({})
  const prevNotesRef = useRef<Note[]>([])
  const isHydratingNotesRef = useRef(false)
  const [notePanelOpen, setNotePanelOpen] = useState(true)
  const expenseToggleOn = expanded
  const [partThumbnails, setPartThumbnails] = useState<Record<string, string>>({})
  const [viewMode, setViewMode] = useState<'single' | 'assembly'>('assembly')
  const [aiPanelOpen, setAiPanelOpen] = useState(true)
  const [aiMessages, setAiMessages] = useState<AiMessage[]>([
    {
      id: 'ai-1',
      role: 'assistant',
      text: '무엇이 궁금한가요? 편하게 질문해 주세요.',
    },
  ])
  const [aiPromptInput, setAiPromptInput] = useState('')
  const [bottomPromptInput, setBottomPromptInput] = useState('')
  const [studySession, setStudySession] = useState<StudySession | null>(null)
  const [studySessionId, setStudySessionId] = useState<number | null>(null)
  const [materialPartsByBase, setMaterialPartsByBase] = useState<Record<string, MaterialPart>>({})
  const [sessionPartsByBase, setSessionPartsByBase] = useState<
    Record<string, StudySessionPart>
  >({})
  const sessionPartNameById = useMemo(() => {
    const map = new Map<number, string>()
    Object.values(sessionPartsByBase).forEach((part) => {
      if (!map.has(part.sessionPartId)) {
        map.set(part.sessionPartId, part.name)
      }
    })
    return map
  }, [sessionPartsByBase])
  const latestCameraRef = useRef<{
    position: [number, number, number]
    quaternion: [number, number, number, number]
    target: [number, number, number]
    zoom: number
  } | null>(null)
  const saveTimerRef = useRef<number | null>(null)

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

  const materialId = projectConfig?.materialId
  const activeMaterialId = studySession?.materialId ?? materialId

  const resolveBaseName = (name: string) => normalizePartName(name)

  const resolveSessionPartId = (parentName?: string | null) => {
    if (!parentName) return null
    const base = resolveBaseName(parentName)
    return (
      sessionPartsByBase[parentName]?.sessionPartId ||
      sessionPartsByBase[base]?.sessionPartId ||
      sessionPartsByBase[parentName.toLowerCase()]?.sessionPartId ||
      sessionPartsByBase[base.toLowerCase()]?.sessionPartId ||
      null
    )
  }

  const toRole = (messageType?: string) =>
    messageType?.toLowerCase().includes('user') ? 'user' : 'assistant'

  const quaternionToEulerDegrees = (rotation: [number, number, number, number]) => {
    const [x, y, z, w] = rotation
    const quaternion = new THREE.Quaternion(x, y, z, w)
    const euler = new THREE.Euler().setFromQuaternion(quaternion, 'XYZ')
    return [
      Math.round(THREE.MathUtils.radToDeg(euler.x)),
      Math.round(THREE.MathUtils.radToDeg(euler.y)),
      Math.round(THREE.MathUtils.radToDeg(euler.z)),
    ] as [number, number, number]
  }

  const resolveRotationDegrees = (rotation: number[]) => {
    if (rotation.length === 4) {
      const maxAbs = Math.max(...rotation.map((value) => Math.abs(value)))
      if (maxAbs > 1.1) {
        return [rotation[0], rotation[1], rotation[2]] as [number, number, number]
      }
      return quaternionToEulerDegrees(rotation as [number, number, number, number])
    }
    if (rotation.length === 3) {
      return [rotation[0], rotation[1], rotation[2]] as [number, number, number]
    }
    return [0, 0, 0] as [number, number, number]
  }

  const queueSaveSession = () => {
    if (!studySessionId || !latestCameraRef.current) return
    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current)
    saveTimerRef.current = window.setTimeout(async () => {
      const cameraState = latestCameraRef.current
      if (!cameraState) return
      try {
        await saveStudySession(studySessionId, {
          view: viewMode === 'single' ? 'SINGLE_VIEW' : 'ASSEMBLY_VIEW',
          position: cameraState.position,
          quaternion: cameraState.quaternion,
          target: cameraState.target,
          zoom: cameraState.zoom,
        })
      } catch (error) {
        console.error('학습 세션 저장 실패', error)
      }
    }, 600)
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

  const handleSwipeMode = () => {
    if (viewMode === 'single') return
    setEditMode(false)
    viewerRef.current?.setEditMode?.(false)
  }

  const handleSelectMode = () => {
    if (viewMode === 'single') return
    setEditMode(true)
    viewerRef.current?.setEditMode?.(true)
    viewerRef.current?.setTransformMode?.('translate')
  }

  const handleToggleNote = () => {
    const next = !noteMode
    setNoteMode(next)
    viewerRef.current?.setNoteMode?.(next)
    if (!next) {
      setNoteEditor((prev) => ({ ...prev, visible: false, id: null }))
    }
  }

  const handleActiveNote = (id: string | number | null) => {
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

  const handleEditNote = (id: string | number) => {
    if (!noteMode) {
      setNoteMode(true)
      viewerRef.current?.setNoteMode?.(true)
    }
    handleActiveNote(id)
  }

  const handleDeleteNote = async (id: string | number) => {
    viewerRef.current?.deleteNote?.(id)
    if (noteEditor.id === id) {
      setNoteEditor((prev) => ({ ...prev, visible: false, id: null }))
    }
    const localId = Number(id)
    const serverId = noteIdMapRef.current[localId]
    if (!studySessionId || !Number.isFinite(localId) || !serverId) return
    try {
      await deleteStudyNote(studySessionId, serverId)
      delete noteIdMapRef.current[localId]
    } catch (error) {
      console.error('노트 삭제 실패', error)
    }
  }

  const handleNoteEditorChange = (value: string) => {
    setNoteEditor((prev) => ({ ...prev, text: value }))
    if (noteEditor.id) {
      viewerRef.current?.updateNote?.(noteEditor.id, value)
    }
  }

  const handleNoteSubmit = async () => {
    if (!noteEditor.id) return
    viewerRef.current?.updateNote?.(noteEditor.id, noteEditor.text)
    setNoteEditor((prev) => ({ ...prev, visible: false }))
    const localId = Number(noteEditor.id)
    const mappedId = noteIdMapRef.current[localId]
    if (!studySessionId || !Number.isFinite(localId)) return
    if (!mappedId) {
      const note = notes.find((item) => item.id === noteEditor.id)
      const sessionPartId = resolveSessionPartId(note?.parentName)
      const position = viewerRef.current?.getNoteWorldPosition?.(localId)
      if (!sessionPartId || !position) return
      try {
        const response = await createStudyNote(studySessionId, {
          sessionPartId,
          x: position[0],
          y: position[1],
          z: position[2],
          text: noteEditor.text || '',
        })
        const serverId = response.data.noteId
        noteIdMapRef.current[localId] = serverId
        isHydratingNotesRef.current = true
        viewerRef.current?.replaceNoteId?.(localId, serverId)
      } catch (error) {
        console.error('노트 생성 실패', error)
      } finally {
        isHydratingNotesRef.current = false
      }
      return
    }
    try {
      await updateStudyNote(studySessionId, mappedId, noteEditor.text)
    } catch (error) {
      console.error('노트 수정 실패', error)
    }
  }

  const handleNotesChange = async (nextNotes: Note[]) => {
    setNotes(nextNotes)
    if (isHydratingNotesRef.current) {
      prevNotesRef.current = nextNotes
      return
    }
    const prevIds = new Set(prevNotesRef.current.map((note) => note.id))
    const addedNotes = nextNotes.filter((note) => !prevIds.has(note.id))
    prevNotesRef.current = nextNotes
    if (!addedNotes.length) return
    if (!studySessionId) return
    for (const note of addedNotes) {
      const localId = Number(note.id)
      if (!Number.isFinite(localId)) continue
      const sessionPartId = resolveSessionPartId(note.parentName)
      const position = viewerRef.current?.getNoteWorldPosition?.(localId)
      if (!sessionPartId || !position) continue
      try {
        const response = await createStudyNote(studySessionId, {
          sessionPartId,
          x: position[0],
          y: position[1],
          z: position[2],
          text: note.text || '',
        })
        const serverId = response.data.noteId
        noteIdMapRef.current[localId] = serverId
        isHydratingNotesRef.current = true
        viewerRef.current?.replaceNoteId?.(localId, serverId)
        if (noteEditor.id === note.id) {
          setNoteEditor((prev) => ({ ...prev, id: serverId }))
        }
      } catch (error) {
        console.error('노트 생성 실패', error)
      } finally {
        isHydratingNotesRef.current = false
      }
    }
  }

  const handleCameraChange = (state: {
    position: [number, number, number]
    quaternion: [number, number, number, number]
    target: [number, number, number]
    zoom: number
  }) => {
    latestCameraRef.current = state
    queueSaveSession()
  }

  const handleSendAiMessage = async (rawText: string, source: 'ai' | 'bottom') => {
    const text = rawText.trim()
    if (!text) return
    const userMessage: AiMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
    }
    setAiMessages((prev) => [...prev, userMessage])
    if (source === 'ai') {
      setAiPromptInput('')
    } else {
      setBottomPromptInput('')
    }
    if (!studySessionId || !activeMaterialId) {
      const fallbackMessage: AiMessage = {
        id: `assistant-${Date.now() + 1}`,
        role: 'assistant',
        text: '세션 정보가 아직 준비되지 않았어요. 잠시 후 다시 시도해 주세요.',
      }
      setAiMessages((prev) => [...prev, fallbackMessage])
      return
    }
    const selectedPartName = parts[selectedIndex] || ''
    const selectedBase = selectedPartName ? resolveBaseName(selectedPartName) : ''
    const selectedModelId =
      (selectedBase && sessionPartsByBase[selectedBase]?.modelId) ||
      (selectedBase && materialPartsByBase[selectedBase]?.modelId)
    try {
      const response = await askChat({
        studySessionId,
        question: text,
        materialId: activeMaterialId,
        modelId: selectedModelId || undefined,
      })
      const assistantMessage: AiMessage = {
        id: `assistant-${response.data.messageId}`,
        role: toRole(response.data.messageType),
        text: response.data.messageContent,
      }
      setAiMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('AI 질문 실패', error)
      const fallbackMessage: AiMessage = {
        id: `assistant-${Date.now() + 1}`,
        role: 'assistant',
        text: '지금은 답변을 가져올 수 없어요. 잠시 후 다시 시도해 주세요.',
      }
      setAiMessages((prev) => [...prev, fallbackMessage])
    }
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
    let cancelled = false
    const createSession = async () => {
      if (!materialId) {
        console.warn('materialId가 없어 학습 세션을 생성하지 않습니다.')
        setStudySession(null)
        setStudySessionId(null)
        return
      }
      try {
        const response = await createStudySession(materialId)
        if (cancelled) return
        setStudySession(response.data)
        setStudySessionId(response.data.sessionId)
      } catch (error) {
        if (cancelled) return
        if (axios.isAxiosError(error)) {
          const responseData = error.response?.data
          const candidate = (responseData?.data ?? responseData) as StudySession | undefined
          if (candidate && typeof candidate === 'object' && 'sessionId' in candidate) {
            setStudySession(candidate)
            setStudySessionId(candidate.sessionId)
            return
          }
          if (error.response?.status === 409) {
            try {
              const homeResponse = await getStudyHomeAll()
              const match = homeResponse.data.find((item) => item.materialId === materialId)
              if (match) {
                setStudySessionId(match.sessionId)
              } else {
                console.warn('세션이 이미 존재하지만 sessionId를 찾지 못했습니다.', responseData)
              }
            } catch (homeError) {
              console.warn('세션이 이미 존재하지만 sessionId를 조회하지 못했습니다.', homeError)
            }
            return
          }
        }
        console.error('학습 세션 생성 실패', error)
      } finally {
        // no-op
      }
    }
    createSession()
    return () => {
      cancelled = true
    }
  }, [materialId])

  useEffect(() => {
    let cancelled = false
    const fetchMaterialParts = async () => {
      if (!activeMaterialId) {
        setMaterialPartsByBase({})
        return
      }
      try {
        const response = await getMaterialParts(activeMaterialId)
        if (cancelled) return
        const next: Record<string, MaterialPart> = {}
        response.data.forEach((part) => {
          next[resolveBaseName(part.name)] = part
        })
        setMaterialPartsByBase(next)
      } catch (error) {
        console.error('부품 목록 조회 실패', error)
      }
    }
    fetchMaterialParts()
    return () => {
      cancelled = true
    }
  }, [activeMaterialId])

  useEffect(() => {
    let cancelled = false
    const fetchSessionData = async () => {
      if (!studySessionId) return
      try {
        const [partsResponse, chatResponse] = await Promise.all([
          getStudySessionParts(studySessionId),
          getChatHistory(studySessionId),
        ])
        if (cancelled) return
        const nextParts: Record<string, StudySessionPart> = {}
        partsResponse.data.forEach((part) => {
          const base = resolveBaseName(part.name)
          const lower = part.name.toLowerCase()
          const baseLower = base.toLowerCase()
          nextParts[part.name] = part
          nextParts[base] = part
          nextParts[lower] = part
          nextParts[baseLower] = part
          nextParts[part.name.replace(/\s+/g, '').toLowerCase()] = part
          nextParts[base.replace(/\s+/g, '').toLowerCase()] = part
        })
        setSessionPartsByBase(nextParts)
        if (chatResponse.data.length > 0) {
          const nextMessages: AiMessage[] = chatResponse.data.map((message) => ({
            id: `${message.messageId}`,
            role: toRole(message.messageType),
            text: message.messageContent,
          }))
          setAiMessages(nextMessages)
        }
      } catch (error) {
        console.error('세션 데이터 조회 실패', error)
      }
    }
    fetchSessionData()
    return () => {
      cancelled = true
    }
  }, [studySessionId])

  useEffect(() => {
    let cancelled = false
    const fetchNotes = async () => {
      if (!studySessionId) return
      try {
        const response = await getStudyNotes(studySessionId)
        if (cancelled) return
        const mappedNotes = response.data.map((note) => ({
          id: note.noteId,
          text: note.text,
          position: note.position,
          parentName: sessionPartNameById.get(note.sessionPartId) ?? null,
        }))
        isHydratingNotesRef.current = true
        viewerRef.current?.setNotesFromServer?.(mappedNotes)
        noteIdMapRef.current = response.data.reduce<Record<number, number>>((acc, note) => {
          acc[note.noteId] = note.noteId
          return acc
        }, {})
      } catch (error) {
        console.error('노트 목록 조회 실패', error)
      } finally {
        isHydratingNotesRef.current = false
      }
    }
    fetchNotes()
    return () => {
      cancelled = true
    }
  }, [studySessionId, sessionPartNameById])

  useEffect(() => {
    if (!studySession || !viewerRef.current?.setCameraState) return
    viewerRef.current.setCameraState({
      position: studySession.position,
      quaternion: studySession.quaternion,
      target: studySession.target,
      zoom: studySession.zoom,
    })
  }, [studySession])

  useEffect(() => {
    if (!parts.length || Object.keys(sessionPartsByBase).length === 0) return
    const transforms: ViewerTransforms = {}
    const hiddenParts: string[] = []
    parts.forEach((partName) => {
      const base = resolveBaseName(partName)
      const keyCandidates = [
        partName,
        base,
        partName.toLowerCase(),
        base.toLowerCase(),
        partName.replace(/\s+/g, '').toLowerCase(),
        base.replace(/\s+/g, '').toLowerCase(),
      ]
      const sessionPart = keyCandidates
        .map((key) => sessionPartsByBase[key])
        .find((value) => value)
      if (!sessionPart) return
      const rot = resolveRotationDegrees(sessionPart.rotation as unknown as number[])
      const scale = Array.isArray(sessionPart.scale) ? sessionPart.scale : []
      transforms[partName] = {
        pos: sessionPart.position,
        rot,
        scaleX: scale[0],
        scaleY: scale[1],
        scaleZ: scale[2],
      }
      if (!sessionPart.isVisible) hiddenParts.push(partName)
    })
    viewerRef.current?.applyTransformsByName?.(transforms)
    if (hiddenParts.length) {
      viewerRef.current?.setHiddenParts?.(hiddenParts)
    }
  }, [parts, sessionPartsByBase])

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
      {expanded ? (
        <S.PartsDetailSection>
          {(() => {
            const selectedBase =
              displaySelectedIndex >= 0
                ? normalizePartName(parts[displaySelectedIndex] || '')
                : uniqueParts[0]?.base || ''
            const selectedPart =
              uniqueParts.find((item) => item.base === selectedBase) || uniqueParts[0]
            const selectedLabel = selectedPart?.base || 'Main Frame'
            const selectedMeta = materialPartsByBase[selectedLabel]
            const selectedThumb =
              selectedMeta?.imageUrl ||
              partThumbnails[selectedLabel] ||
              getPartIconSvg(selectedLabel)
            const selectedDesc =
              selectedMeta?.detail || selectedMeta?.description || partDescription
            return (
              <S.PartsDetail>
                <S.PartsDetailLabel>Detail</S.PartsDetailLabel>
                <S.PartsDetailImage style={{ backgroundImage: `url(${selectedThumb})` }} />
                <S.PartsDetailTitle>{selectedLabel}</S.PartsDetailTitle>
                <S.PartsDetailDesc>{selectedDesc}</S.PartsDetailDesc>
              </S.PartsDetail>
            )
          })()}
          <S.PartsDivider />
          <S.PartsSectionLabel>Parts</S.PartsSectionLabel>
        </S.PartsDetailSection>
      ) : (
        <S.CardHeader>Parts</S.CardHeader>
      )}
      <S.PartsList $expanded={expanded}>
        {uniqueParts.map((part) => (
          <S.PartRow
            key={part.base}
            $expanded={expanded}
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
              $expanded={expanded}
              style={{
                backgroundImage: `url(${
                  materialPartsByBase[part.base]?.imageUrl ||
                  partThumbnails[part.base] ||
                  getPartIconSvg(part.base)
                })`,
              }}
            />
            <S.PartMeta $expanded={expanded}>
              <S.PartTitle>{part.base}</S.PartTitle>
              {!expanded && (
                <S.PartDesc>
                  {materialPartsByBase[part.base]?.description || partDescription}
                </S.PartDesc>
              )}
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
        {aiMessages.length === 0 ? (
          <S.PartDesc>무엇이 궁금한가요?</S.PartDesc>
        ) : (
          aiMessages.map((message) =>
            message.role === 'assistant' ? (
              <S.AiChatBubble key={message.id}>{message.text}</S.AiChatBubble>
            ) : (
              <S.AiUserBubble key={message.id}>{message.text}</S.AiUserBubble>
            ),
          )
        )}
      </S.AiBody>
      {showPrompt && (
        <S.AiPromptBar
          onSubmit={(event) => {
            event.preventDefault()
            handleSendAiMessage(aiPromptInput, 'ai')
          }}
        >
          <S.AiPromptInput
            value={aiPromptInput}
            placeholder="무엇이 궁금한가요?"
            onChange={(event) => setAiPromptInput(event.target.value)}
          />
          <S.ChatSend type="submit" disabled={!aiPromptInput.trim()}>
            ↗
          </S.ChatSend>
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
                {!expenseToggleOn ? (
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
                ) : (
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
                )}
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
                    {noteEditor.visible && noteMode && (
                      <S.NoteEditorPanel>
                        <S.NoteEditorInput
                          placeholder="메모 입력"
                          value={noteEditor.text}
                          onChange={(event) => handleNoteEditorChange(event.target.value)}
                        />
                        <S.NoteEditorActions>
                          <S.NoteEditorButton type="button" onClick={handleNoteSubmit}>
                            저장
                          </S.NoteEditorButton>
                        </S.NoteEditorActions>
                      </S.NoteEditorPanel>
                    )}
                    <S.NoteList>
                    {notes.slice(0, 4).map((note) => (
                      <S.NoteItem key={note.id}>
                        <S.NoteMeta>
                          <span>{note.parentName || '알 수 없는 부품'}</span>
                          <S.NoteActions>
                            <S.NoteActionButton
                              type="button"
                              aria-label="note edit"
                              $icon={noteEditIcon}
                              onClick={() => handleEditNote(note.id)}
                            />
                            <S.NoteActionButton
                              type="button"
                              aria-label="note delete"
                              $icon={noteDeleteIcon}
                              onClick={() => handleDeleteNote(note.id)}
                            />
                          </S.NoteActions>
                        </S.NoteMeta>
                        <S.NoteBody>{note.text ? note.text : '메모가 없습니다.'}</S.NoteBody>
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
                    {aiPanelOpen && (
                      <S.ExpandedLeftPanel>{renderAiCard(true, true, true)}</S.ExpandedLeftPanel>
                    )}
                    <S.ExpandedRightPanel>
                      {renderPartsCard(true)}
                    </S.ExpandedRightPanel>
                  </S.ExpandedPanels>
                )}

                <AssemblyViewer
                  ref={viewerRef}
                  projectId={safeProjectId}
                  partOverrides={partOverrides}
                  onStatusChange={setStatus}
                  onCameraChange={handleCameraChange}
                  onPartsChange={(nextParts: string[]) => {
                    setParts(nextParts)
                    if (nextParts.length) {
                      setSelectedIndex(-1)
                      viewerRef.current?.setSelectedIndex?.(-1)
                    }
                    if (Object.keys(sessionPartsByBase).length === 0) {
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
                  onNotesChange={(nextNotes: unknown[]) => handleNotesChange(nextNotes as Note[])}
                  onActiveNoteChange={handleActiveNote}
                />

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
              <S.BottomChat
                onSubmit={(event) => {
                  event.preventDefault()
                  handleSendAiMessage(bottomPromptInput, 'bottom')
                }}
              >
                <S.ChatInput
                  value={bottomPromptInput}
                  placeholder="무엇이 궁금한가요?"
                  onChange={(event) => setBottomPromptInput(event.target.value)}
                />
                <S.ChatSend type="submit" disabled={!bottomPromptInput.trim()}>
                  ↗
                </S.ChatSend>
              </S.BottomChat>
            )}
        </S.CenterColumn>
      </S.ContentGrid>
    </S.PageBody>
  )
}

export const StudyPage = () => <StudyLayout expanded={false} />
export const StudyExpensePage = () => <StudyLayout expanded />
