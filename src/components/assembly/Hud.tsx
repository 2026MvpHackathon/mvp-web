// @ts-nocheck
export default function Hud({
  projects,
  projectId,
  onProjectChange,
  status,
  isAssemble,
  onAssemble,
  onDisassemble,
  editMode,
  onToggleEdit,
  transformMode,
  onTransformMode,
  explodeScale,
  onExplodeScale,
  parts,
  selectionOptions,
  selectedSelectionKey,
  onSelectPart,
  transformValues,
  onTransformChange,
  speed,
  onSpeedChange,
  noteMode,
  onToggleNote,
  notes,
  onDeleteNote,
  activeNoteId,
  onSaveLayout,
  onLoadLayout,
  onSaveDefaultLayout,
  onCopyDefaultLayout,
  partOptions,
  selectedPartFile,
  onPartFileChange,
  partCount,
  onPartCountChange,
  isGroupSelected,
  groupMode,
  onToggleGroupMode,
  groupName,
  onGroupNameChange,
  groupSelection,
  onToggleGroupPart,
  groups,
  onCreateGroup,
  onRemoveGroup,
  selectedPartName,
  isSelectedHidden,
  onToggleSelectedVisibility,
  onIsolateSelected,
  onShowAllParts
}) {
  const handleNoWheel = (event) => {
    event.preventDefault();
    event.currentTarget.blur();
  };

  return (
    <div
      id="hud"
      onWheelCapture={(event) => event.stopPropagation()}
      onPointerDownCapture={(event) => event.stopPropagation()}
    >
      <h1>SIMVEX</h1>
      <div className="row">
        <button className={isAssemble ? "active" : ""} onClick={onAssemble}>
          조립
        </button>
        <button className={!isAssemble ? "active" : ""} onClick={onDisassemble}>
          분해
        </button>
      </div>
      <label>
        <span>프로젝트</span>
      </label>
      <select
        value={projectId}
        onChange={(e) => onProjectChange(e.target.value)}
        onWheel={handleNoWheel}
      >
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.label}
          </option>
        ))}
      </select>
      <div className="row">
        <button onClick={onToggleEdit}>편집 모드: {editMode ? "ON" : "OFF"}</button>
      </div>
      <div className="row">
        <button
          className={transformMode === "translate" ? "active" : ""}
          onClick={() => onTransformMode("translate")}
        >
          이동
        </button>
        <button
          className={transformMode === "rotate" ? "active" : ""}
          onClick={() => onTransformMode("rotate")}
        >
          회전
        </button>
        <button
          className={transformMode === "scale" ? "active" : ""}
          onClick={() => onTransformMode("scale")}
        >
          스케일
        </button>
      </div>
      <div className="row">
        <button className={noteMode ? "active" : ""} onClick={onToggleNote}>
          메모 모드: {noteMode ? "ON" : "OFF"}
        </button>
      </div>
      <div className="row">
        <button onClick={onSaveLayout}>변경사항 저장</button>
        <button onClick={onLoadLayout}>저장 불러오기</button>
      </div>
      <div className="row">
        <button onClick={onSaveDefaultLayout}>기본 에셋 저장</button>
        <button onClick={onCopyDefaultLayout}>기본값 코드 복사</button>
      </div>
      <div className="row">
        <button className={groupMode ? "active" : ""} onClick={onToggleGroupMode}>
          그룹화: {groupMode ? "ON" : "OFF"}
        </button>
      </div>
      {partOptions?.length > 0 && (
        <>
          <label>
            <span>부품 선택</span>
          </label>
          <select value={selectedPartFile} onChange={(e) => onPartFileChange(e.target.value)}>
            {partOptions.map((file) => (
              <option key={file} value={file}>
                {file.replace(/\.glb$/i, "")}
              </option>
            ))}
          </select>
          <label>
            <span>부품 개수</span>
            <input
              className="value-input"
              type="number"
              min="1"
              max="50"
              step="1"
              value={partCount}
              onWheel={handleNoWheel}
              onChange={(e) => onPartCountChange(Number(e.target.value))}
            />
          </label>
        </>
      )}
      {groupMode && (
        <>
          <label>
            <span>그룹 이름</span>
            <input
              className="value-input"
              type="text"
              value={groupName}
              onWheel={handleNoWheel}
              onChange={(e) => onGroupNameChange(e.target.value)}
              placeholder="예: 핀 세트"
            />
          </label>
          <label>
            <span>그룹 부품 선택</span>
          </label>
          <div className="group-parts">
            {parts.map((name) => (
              <label key={name} className="row">
                <input
                  type="checkbox"
                  checked={groupSelection.includes(name)}
                  onChange={() => onToggleGroupPart(name)}
                />
                <span>{name}</span>
              </label>
            ))}
          </div>
          <div className="row">
            <button onClick={onCreateGroup}>그룹 생성</button>
          </div>
          {groups.length > 0 && (
            <>
              <label>
                <span>그룹 목록</span>
              </label>
              {groups.map((group) => (
                <div key={group.id} className="row">
                  <span className="note-label">
                    {group.name} ({group.parts.length})
                  </span>
                  <button onClick={() => onRemoveGroup(group.id)}>해제</button>
                </div>
              ))}
            </>
          )}
        </>
      )}
      {noteMode && (
        <div id="noteHint">메모 모드: 클릭 후 바로 입력 · 드래그 이동</div>
      )}
      <label>
        <span>분해 거리</span>
        <span>{explodeScale.toFixed(1)}x</span>
      </label>
      <input
        type="range"
        min="0.4"
        max="2.4"
        step="0.1"
        value={explodeScale}
        onChange={(e) => onExplodeScale(Number(e.target.value))}
      />
      <label>
        <span>선택 파트</span>
      </label>
      <select
        value={selectedSelectionKey}
        onChange={(e) => onSelectPart(e.target.value)}
        onWheel={handleNoWheel}
      >
        {selectionOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="row">
        <button
          onClick={onToggleSelectedVisibility}
          disabled={isGroupSelected || !selectedPartName}
        >
          {isSelectedHidden ? "선택 파트 표시" : "선택 파트 숨기기"}
        </button>
        <button onClick={onShowAllParts} disabled={isGroupSelected}>
          전체 표시
        </button>
      </div>
      <div className="row">
        <button onClick={onIsolateSelected} disabled={isGroupSelected || !selectedPartName}>
          선택만 남기기
        </button>
      </div>
      <label>
        <span>위치 X</span>
        <input
          className="value-input"
          type="number"
          min="-400"
          max="400"
          step="0.01"
          value={transformValues.posX}
          onChange={(e) => onTransformChange({ posX: Number(e.target.value) })}
        />
      </label>
      <input
        type="range"
        min="-400"
        max="400"
        step="0.01"
        value={transformValues.posX}
        onChange={(e) => onTransformChange({ posX: Number(e.target.value) })}
      />
      <label>
        <span>위치 Y</span>
        <input
          className="value-input"
          type="number"
          min="-400"
          max="400"
          step="0.01"
          value={transformValues.posY}
          onChange={(e) => onTransformChange({ posY: Number(e.target.value) })}
        />
      </label>
      <input
        type="range"
        min="-400"
        max="400"
        step="0.01"
        value={transformValues.posY}
        onChange={(e) => onTransformChange({ posY: Number(e.target.value) })}
      />
      <label>
        <span>위치 Z</span>
        <input
          className="value-input"
          type="number"
          min="-400"
          max="400"
          step="0.01"
          value={transformValues.posZ}
          onChange={(e) => onTransformChange({ posZ: Number(e.target.value) })}
        />
      </label>
      <input
        type="range"
        min="-400"
        max="400"
        step="0.01"
        value={transformValues.posZ}
        onChange={(e) => onTransformChange({ posZ: Number(e.target.value) })}
      />
      <label>
        <span>회전 X</span>
        <input
          className="value-input"
          type="number"
          min="-180"
          max="180"
          step="1"
          value={transformValues.rotX}
          disabled={isGroupSelected}
          onChange={(e) => onTransformChange({ rotX: Number(e.target.value) })}
        />
      </label>
      <input
        type="range"
        min="-180"
        max="180"
        step="1"
        value={transformValues.rotX}
        disabled={isGroupSelected}
        onChange={(e) => onTransformChange({ rotX: Number(e.target.value) })}
      />
      <label>
        <span>회전 Y</span>
        <input
          className="value-input"
          type="number"
          min="-180"
          max="180"
          step="1"
          value={transformValues.rotY}
          disabled={isGroupSelected}
          onChange={(e) => onTransformChange({ rotY: Number(e.target.value) })}
        />
      </label>
      <input
        type="range"
        min="-180"
        max="180"
        step="1"
        value={transformValues.rotY}
        disabled={isGroupSelected}
        onChange={(e) => onTransformChange({ rotY: Number(e.target.value) })}
      />
      <label>
        <span>회전 Z</span>
        <input
          className="value-input"
          type="number"
          min="-180"
          max="180"
          step="1"
          value={transformValues.rotZ}
          disabled={isGroupSelected}
          onChange={(e) => onTransformChange({ rotZ: Number(e.target.value) })}
        />
      </label>
      <input
        type="range"
        min="-180"
        max="180"
        step="1"
        value={transformValues.rotZ}
        disabled={isGroupSelected}
        onChange={(e) => onTransformChange({ rotZ: Number(e.target.value) })}
      />
      <label>
        <span>스케일</span>
        <input
          className="value-input"
          type="number"
          min="0.01"
          max="3.0"
          step="0.01"
          value={transformValues.scale}
          disabled={isGroupSelected}
          onChange={(e) => {
            const value = Number(e.target.value);
            onTransformChange({
              scale: value,
              scaleX: value,
              scaleY: value,
              scaleZ: value
            });
          }}
        />
      </label>
      <input
        type="range"
        min="0.01"
        max="3.0"
        step="0.01"
        value={transformValues.scale}
        disabled={isGroupSelected}
        onChange={(e) => {
          const value = Number(e.target.value);
          onTransformChange({
            scale: value,
            scaleX: value,
            scaleY: value,
            scaleZ: value
          });
        }}
      />
      {transformMode === "scale" && (
        <>
          <label>
            <span>스케일 X</span>
            <input
              className="value-input"
              type="number"
              min="0.01"
              max="3.0"
              step="0.01"
              value={transformValues.scaleX}
              disabled={isGroupSelected}
              onChange={(e) => onTransformChange({ scaleX: Number(e.target.value) })}
            />
          </label>
          <label>
            <span>스케일 Y</span>
            <input
              className="value-input"
              type="number"
              min="0.01"
              max="3.0"
              step="0.01"
              value={transformValues.scaleY}
              disabled={isGroupSelected}
              onChange={(e) => onTransformChange({ scaleY: Number(e.target.value) })}
            />
          </label>
          <label>
            <span>스케일 Z</span>
            <input
              className="value-input"
              type="number"
              min="0.01"
              max="3.0"
              step="0.01"
              value={transformValues.scaleZ}
              disabled={isGroupSelected}
              onChange={(e) => onTransformChange({ scaleZ: Number(e.target.value) })}
            />
          </label>
        </>
      )}
      <label>
        <span>애니메이션 속도</span>
        <span>{speed.toFixed(1)}x</span>
      </label>
      <input
        type="range"
        min="0.4"
        max="2.0"
        step="0.1"
        value={speed}
        onChange={(e) => onSpeedChange(Number(e.target.value))}
      />
      {notes.length > 0 && (
        <>
          <label>
            <span>메모 목록</span>
          </label>
          {notes.map((note) => (
            <div key={note.id} className="row">
              <span className="note-label">{note.text || "메모"}</span>
              <button
                className={activeNoteId === note.id ? "active" : ""}
                onClick={() => onDeleteNote(note.id)}
              >
                삭제
              </button>
            </div>
          ))}
        </>
      )}
      <div id="status">{status}</div>
    </div>
  );
}
