// @ts-nocheck
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { layoutDefaults, projectConfigs } from "../../data/projects";

class AssemblyEngine {
  constructor(canvas, callbacks) {
    this.canvas = canvas;
    this.callbacks = callbacks;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0b0e14);
    this.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 2000);
    this.camera.position.set(260, 180, 260);
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = true;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.7;
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.environmentTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environment = this.environmentTexture;
    pmrem.dispose();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.target.set(0, 60, 0);
    this.controls.minDistance = 10;
    this.controls.maxDistance = 2000000;

    this.transformControls = new TransformControls(this.camera, this.renderer.domElement);
    this.transformControls.setMode("translate");
    this.transformControls.setSpace("local");
    this.transformControls.size = 1.6;
    this.transformControls.visible = true;
    this.transformControls.enabled = true;
    this.transformControls.addEventListener("dragging-changed", (event) => {
      this.controls.enabled = !event.value;
    });
    this.transformControls.addEventListener("objectChange", () => {
      const obj = this.transformControls.object;
      if (!obj) return;
      if (obj.userData?.groupPivot && this.groupSelection.length) {
        if (!this.groupPivotPosition) {
          this.groupPivotPosition = obj.position.clone();
          return;
        }
        const delta = obj.position.clone().sub(this.groupPivotPosition);
        if (delta.lengthSq() > 0) {
          this.groupSelection.forEach((name) => {
            const part = this.parts.find((item) => item.name === name);
            if (!part?.object) return;
            part.object.position.add(delta);
            part.basePosition = part.object.position.clone();
          });
          this.groupPivotPosition = obj.position.clone();
          if (this.callbacks?.onGroupTransformChange) {
            this.callbacks.onGroupTransformChange({
              posX: Number(obj.position.x.toFixed(2)),
              posY: Number(obj.position.y.toFixed(2)),
              posZ: Number(obj.position.z.toFixed(2))
            });
          }
        }
        return;
      }
      if (obj.userData?.noteId) {
        return;
      }
      const index = this.parts.findIndex((part) => part.object === obj);
      if (index >= 0) {
        const part = this.parts[index];
        part.basePosition = obj.position.clone();
        part.baseRotation = obj.rotation.clone();
        part.baseScale = obj.scale.clone();
        this.emitSelection(index);
      }
    });
    this.transformControls.addEventListener("mouseDown", () => {
      this.controls.enabled = false;
    });
    this.transformControls.addEventListener("mouseUp", () => {
      this.controls.enabled = true;
    });
    this.scene.add(this.transformControls);

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
    keyLight.position.set(200, 300, 120);
    keyLight.castShadow = true;
    this.scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x9bbcff, 0.6);
    rimLight.position.set(-200, 120, -160);
    this.scene.add(rimLight);

    const grid = new THREE.GridHelper(400, 20, 0xd0d4db, 0xe6e8ee);
    grid.position.y = -1;
    grid.material.transparent = true;
    grid.material.opacity = 0.35;
    this.scene.add(grid);

    this.loader = new GLTFLoader();
    this.group = new THREE.Group();
    this.scene.add(this.group);
    this.selectable = [];
    this.currentBasePath = ".";
    this.currentProjectId = "drone";
    this.manualDefaults = {};
    this.layout = { ...layoutDefaults };
    this.state = {
      loaded: 0,
      total: 0,
      target: 0,
      current: 0,
      speed: 1.0,
      explodeScale: 1.0,
      selectedIndex: -1
    };
    this.parts = [];
    this.notes = [];
    this.noteMode = false;
    this.noteText = "";
    this.noteId = 1;
    this.hoveredNoteId = null;
    this.activeNoteId = null;
    this.loadToken = 0;
    this.editMode = true;
    this.enableRobotGripperOverrides = false;
    this.groupSelection = [];
    this.groupPivot = null;
    this.groupPivotPosition = null;
    this.viewMode = "assembly";
    this.highlightedParts = [];
    this.dimmedParts = [];
    this.outlineColor = new THREE.Color(0x6ea8fe);

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.renderer.domElement.addEventListener("pointerdown", this.onPointerDown, { passive: false });
    this.renderer.domElement.addEventListener("pointermove", this.onPointerMove, { passive: false });

    this.clock = new THREE.Clock();
    this.animate = this.animate.bind(this);
    this.isDisposed = false;
    this.rafId = null;
    this.animate();
    this.handleResize = this.resize.bind(this);
    this.resize();
    window.addEventListener("resize", this.handleResize);
  }

  dispose() {
    this.isDisposed = true;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    this.renderer.domElement.removeEventListener("pointerdown", this.onPointerDown);
    this.renderer.domElement.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("resize", this.handleResize);
    this.renderer.dispose();
  }

  resize() {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    const { clientWidth, clientHeight } = parent;
    this.renderer.setSize(clientWidth, clientHeight, false);
    this.camera.aspect = clientWidth / clientHeight;
    this.camera.updateProjectionMatrix();
  }

  emitStatus(text) {
    if (this.callbacks?.onStatusChange) {
      this.callbacks.onStatusChange(text);
    }
  }

  emitParts() {
    if (this.callbacks?.onPartsChange) {
      this.callbacks.onPartsChange(this.parts.map((part) => part.name));
    }
  }

  emitSelection(index) {
    const part = this.parts[index];
    if (!part || !part.object || !this.callbacks?.onSelectedChange) return;
    this.callbacks.onSelectedChange(index, {
      posX: Number(part.object.position.x.toFixed(2)),
      posY: Number(part.object.position.y.toFixed(2)),
      posZ: Number(part.object.position.z.toFixed(2)),
      rotX: Number(THREE.MathUtils.radToDeg(part.object.rotation.x).toFixed(0)),
      rotY: Number(THREE.MathUtils.radToDeg(part.object.rotation.y).toFixed(0)),
      rotZ: Number(THREE.MathUtils.radToDeg(part.object.rotation.z).toFixed(0)),
      scale: Number(part.object.scale.x.toFixed(2)),
      scaleX: Number(part.object.scale.x.toFixed(2)),
      scaleY: Number(part.object.scale.y.toFixed(2)),
      scaleZ: Number(part.object.scale.z.toFixed(2))
    });
  }

  emitNotes() {
    if (this.callbacks?.onNotesChange) {
      this.callbacks.onNotesChange(
        this.notes.map((note) => ({
          id: note.id,
          text: note.text,
          parentName: note.parentName || null
        }))
      );
    }
  }

  emitActiveNote(id) {
    if (this.callbacks?.onActiveNoteChange) {
      this.callbacks.onActiveNoteChange(id);
    }
  }

  setHoveredNote(noteId) {
    if (noteId === this.hoveredNoteId) return;
    this.hoveredNoteId = noteId;
    this.notes.forEach((note) => {
      if (!note.sprite?.material) return;
      const isHovered = note.id === noteId;
      note.sprite.material.map = isHovered ? note.full : note.compact;
      note.sprite.material.needsUpdate = true;
      note.sprite.scale.set(isHovered ? 42 : 16, isHovered ? 18 : 12, 1);
    });
  }

  createNoteTexture(text, mode = "full") {
    const isCompact = mode === "compact";
    const width = isCompact ? 96 : 300;
    const height = isCompact ? 72 : 96;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, width, height);

    const drawRoundedRect = (x, y, w, h, r) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    };

    if (isCompact) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.98)";
      ctx.strokeStyle = "rgba(30, 34, 45, 0.18)";
      ctx.lineWidth = 2;
      drawRoundedRect(6, 6, width - 12, height - 14, 18);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "rgba(255, 255, 255, 0.98)";
      ctx.beginPath();
      ctx.moveTo(28, height - 8);
      ctx.lineTo(18, height - 2);
      ctx.lineTo(40, height - 4);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#7b5b4e";
      ctx.beginPath();
      ctx.arc(34, 34, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "12px 'Noto Sans KR', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
    } else {
      ctx.fillStyle = "rgba(255, 255, 255, 0.98)";
      ctx.strokeStyle = "rgba(30, 34, 45, 0.12)";
      ctx.lineWidth = 2;
      drawRoundedRect(2, 2, width - 4, height - 4, 18);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#7b5b4e";
      ctx.beginPath();
      ctx.arc(40, 40, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "12px 'Noto Sans KR', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "#111827";
      ctx.font = "14px 'Noto Sans KR', sans-serif";
      ctx.fillStyle = "#1f2937";
      ctx.font = "16px 'Noto Sans KR', sans-serif";
      const lines = String(text || "").split("\n").filter(Boolean);
      const display = lines.length ? lines : ["(메모 없음)"];
      display.slice(0, 2).forEach((line, index) => {
        ctx.fillText(line.slice(0, 22), 70, 58 + index * 22);
      });
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  createNoteSprite(text) {
    const texture = this.createNoteTexture(text, "compact");
    const material = new THREE.SpriteMaterial({
      map: texture,
      depthTest: false
    });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(16, 12, 1);
    return sprite;
  }

  resolveNoteTarget(hitObject) {
    let target = hitObject;
    while (target?.parent && target.parent !== this.group) {
      target = target.parent;
    }
    return target;
  }

  addNoteAt(point, hitObject) {
    const text = this.noteText || "";
    const sprite = this.createNoteSprite(text);
    const target = this.resolveNoteTarget(hitObject);
    if (target) {
      const localPoint = target.worldToLocal(point.clone());
      sprite.position.copy(localPoint);
      target.add(sprite);
    } else {
      sprite.position.copy(point);
      this.scene.add(sprite);
    }
    sprite.renderOrder = 10;
    sprite.userData.noteId = this.noteId;
    const note = {
      id: this.noteId++,
      text,
      parentName: target?.userData?.name || target?.name || null,
      sprite,
      compact: this.createNoteTexture(text, "compact"),
      full: this.createNoteTexture(text, "full")
    };
    this.notes.push(note);
    this.activeNoteId = note.id;
    this.emitNotes();
    this.emitActiveNote(note.id);
    this.setHoveredNote(note.id);
  }

  updateNote(id, text) {
    const note = this.notes.find((item) => item.id === id);
    if (!note) return;
    note.text = text;
    if (note.compact) note.compact.dispose();
    if (note.full) note.full.dispose();
    note.compact = this.createNoteTexture(text, "compact");
    note.full = this.createNoteTexture(text, "full");
    const isHovered = this.hoveredNoteId === id;
    note.sprite.material.map = isHovered ? note.full : note.compact;
    note.sprite.material.needsUpdate = true;
    this.emitNotes();
  }

  deleteNote(id) {
    const index = this.notes.findIndex((item) => item.id === id);
    if (index < 0) return;
    const note = this.notes[index];
    if (note.sprite?.parent) {
      note.sprite.parent.remove(note.sprite);
    } else {
      this.scene.remove(note.sprite);
    }
    if (note.compact) note.compact.dispose();
    if (note.full) note.full.dispose();
    if (note.sprite?.material) {
      note.sprite.material.dispose();
    }
    this.notes.splice(index, 1);
    if (this.hoveredNoteId === id) {
      this.hoveredNoteId = null;
    }
    if (this.activeNoteId === id) {
      this.activeNoteId = null;
      this.emitActiveNote(null);
    }
    this.emitNotes();
  }

  clearNotes() {
    this.notes.forEach((note) => {
      if (note.sprite?.parent) {
        note.sprite.parent.remove(note.sprite);
      } else {
        this.scene.remove(note.sprite);
      }
      if (note.compact) note.compact.dispose();
      if (note.full) note.full.dispose();
      if (note.sprite?.material) {
        note.sprite.material.dispose();
      }
    });
    this.notes = [];
    this.hoveredNoteId = null;
    this.activeNoteId = null;
    this.emitActiveNote(null);
    this.emitNotes();
  }

  buildSimpleParts(files) {
    return files.map((item, index) => {
      const file = typeof item === "string" ? item : item.file;
      const baseFile = file.split("/").pop();
      const name =
        typeof item === "string"
          ? baseFile.replace(/\.glb$/i, "")
          : item.name || baseFile.replace(/\.glb$/i, "");
      const angle = (index / Math.max(files.length, 1)) * Math.PI * 2;
      const radius = 80;
      return {
        name,
        file,
        baseOffset: new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius),
        explode: new THREE.Vector3(0, 0, 0)
      };
    });
  }

  buildDroneParts() {
    let parts = [
      { name: "Main frame", file: "Main frame.glb", explode: new THREE.Vector3(0, 0, 0) },
      { name: "Main frame MIR", file: "Main frame_MIR.glb", explode: new THREE.Vector3(0, 0, 0) },
      { name: "Nut", file: "Screw.glb", explode: new THREE.Vector3(-80, 40, -80) },
      { name: "Screw", file: "Nut.glb", explode: new THREE.Vector3(80, 40, -80) },
      { name: "xyz", file: "xyz.glb", explode: new THREE.Vector3(0, 0, -160) }
    ];

    try {
      const armDirs = [
        new THREE.Vector3(1, 0, 1).normalize(),
        new THREE.Vector3(-1, 0, 1).normalize(),
        new THREE.Vector3(1, 0, -1).normalize(),
        new THREE.Vector3(-1, 0, -1).normalize()
      ];

      const getOffsets = (dir) => {
        const armPos = dir.clone().multiplyScalar(this.layout.armDistance);
        const legPos = dir.clone().multiplyScalar(this.layout.legDistance);
        const motorPos = legPos.clone().add(new THREE.Vector3(0, this.layout.motorHeight, 0));
        const bladePos = legPos.clone().add(new THREE.Vector3(0, this.layout.bladeHeight, 0));
        return { armPos, legPos, motorPos, bladePos };
      };

      const armParts = armDirs.flatMap((dir, index) => {
        const yaw = Math.atan2(dir.z, dir.x);
        const offsets = getOffsets(dir);
        const explode = dir.clone().multiplyScalar(180);
        return [
          {
            name: `Arm ${index + 1}`,
            file: "Arm gear.glb",
            baseOffset: offsets.armPos,
            baseRotation: new THREE.Euler(0, yaw, 0),
            explode,
            meta: { kind: "arm", dir }
          },
          {
            name: `Leg ${index + 1}`,
            file: "Leg.glb",
            baseOffset: offsets.legPos,
            baseRotation: new THREE.Euler(0, yaw, 0),
            explode,
            meta: { kind: "leg", dir }
          },
          {
            name: `Gearing ${index + 1}`,
            file: "Gearing.glb",
            baseOffset: offsets.motorPos,
            baseRotation: new THREE.Euler(0, yaw, 0),
            explode,
            meta: { kind: "motor", dir }
          },
          {
            name: `Blade ${index + 1}`,
            file: "Impellar Blade.glb",
            baseOffset: offsets.bladePos,
            baseRotation: new THREE.Euler(Math.PI / 2, yaw, 0),
            explode,
            meta: { kind: "blade", dir }
          }
        ];
      });

      const hardwareOffsets = armDirs.map((dir) =>
        dir.clone().multiplyScalar(this.layout.armDistance * 0.7).add(new THREE.Vector3(0, -8, 0))
      );
      const nuts = hardwareOffsets.map((offset, index) => ({
        name: `Nut ${index + 1}`,
        file: "Screw.glb",
        baseOffset: offset,
        baseRotation: new THREE.Euler(0, 0, 0),
        explode: offset.clone().normalize().multiplyScalar(120)
      }));
      const screws = hardwareOffsets.map((offset, index) => ({
        name: `Screw ${index + 1}`,
        file: "Nut.glb",
        baseOffset: offset.clone().add(new THREE.Vector3(0, 6, 0)),
        baseRotation: new THREE.Euler(0, 0, 0),
        explode: offset.clone().normalize().multiplyScalar(120)
      }));

      parts = [
        { name: "Main frame", file: "Main frame.glb", explode: new THREE.Vector3(0, 0, 0) },
        { name: "Main frame MIR", file: "Main frame_MIR.glb", explode: new THREE.Vector3(0, 0, 0) },
        ...armParts,
        { name: "Beater disc 1", file: "Beater disc.glb", explode: new THREE.Vector3(0, 0, 0) },
        ...nuts,
        ...screws,
        { name: "xyz", file: "xyz.glb", explode: new THREE.Vector3(0, 0, -160) }
      ];
    } catch (error) {
      console.error("Parts build error", error);
      this.emitStatus(`구성 오류: ${error.message}`);
    }

    return parts;
  }

  createRodCapMesh() {
    const group = new THREE.Group();
    const metal = new THREE.MeshStandardMaterial({ color: 0xc9ccd2, metalness: 0.6, roughness: 0.35 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x6d7077, metalness: 0.3, roughness: 0.65 });
    const deep = new THREE.MeshStandardMaterial({ color: 0x0b0e14, metalness: 0.0, roughness: 1.0 });

    const addBore = (position, axis, radius, length) => {
      const bore = new THREE.Mesh(
        new THREE.CylinderGeometry(radius, radius, length, 24, 1, true),
        dark
      );
      const cap = new THREE.Mesh(new THREE.CircleGeometry(radius, 24), deep);
      const pos = position.clone();
      if (axis === "x") {
        bore.rotation.z = Math.PI / 2;
        cap.rotation.y = Math.PI / 2;
        cap.position.set(pos.x - length * 0.45, pos.y, pos.z);
      } else if (axis === "y") {
        cap.rotation.x = Math.PI / 2;
        cap.position.set(pos.x, pos.y - length * 0.45, pos.z);
      }
      bore.position.copy(pos);
      bore.userData.rodCapHole = true;
      cap.userData.rodCapHole = true;
      group.add(bore);
      group.add(cap);
    };

    const body = new THREE.Mesh(new THREE.CylinderGeometry(10, 10, 18, 32), metal);
    body.rotation.z = Math.PI / 2;
    group.add(body);

    const flange = new THREE.Mesh(new THREE.CylinderGeometry(16, 16, 3, 32), metal);
    flange.position.x = 10;
    flange.rotation.z = Math.PI / 2;
    group.add(flange);

    const boss = new THREE.Mesh(new THREE.CylinderGeometry(6, 6, 8, 24), metal);
    boss.position.x = -10;
    boss.rotation.z = Math.PI / 2;
    group.add(boss);

    addBore(new THREE.Vector3(-10, 0, 0), "x", 3.2, 10);
    addBore(new THREE.Vector3(10, 0, 0), "x", 3.8, 6);

    const sideBossLeft = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 6, 24), metal);
    sideBossLeft.position.y = 8;
    sideBossLeft.rotation.x = Math.PI / 2;
    group.add(sideBossLeft);
    addBore(new THREE.Vector3(0, 8, 0), "y", 2.2, 8);

    const sideBossRight = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 6, 24), metal);
    sideBossRight.position.y = -8;
    sideBossRight.rotation.x = Math.PI / 2;
    group.add(sideBossRight);
    addBore(new THREE.Vector3(0, -8, 0), "y", 2.2, 8);

    return group;
  }

  buildSuspensionParts() {
    return this.buildSimpleParts(["BASE.glb", "NUT.glb", "ROD.glb", "SPRING.glb"]);
  }

  buildRobotArmParts() {
    const baseParts = this.buildSimpleParts([
      "base.glb",
      "Part2.glb",
      "Part3.glb",
      "Part4.glb",
      "Part5.glb",
      "Part6.glb",
      "Part7.glb"
    ]);
    const part8a = { name: "Part8 1", file: "Part8.glb", explode: new THREE.Vector3(0, 0, 0) };
    const part8b = { name: "Part8 2", file: "Part8.glb", explode: new THREE.Vector3(0, 0, 0) };
    return [...baseParts, part8a, part8b];
  }

  buildV4EngineParts() {
    const baseParts = this.buildSimpleParts(["Crankshaft.glb"]);
    const bolts = Array.from({ length: 8 }, (_, index) => ({
      name: `Conrod Bolt ${index + 1}`,
      file: "Conrod Bolt.glb",
      explode: new THREE.Vector3(0, 0, 0)
    }));
    const rings = Array.from({ length: 12 }, (_, index) => ({
      name: `Piston Ring ${index + 1}`,
      file: "Piston Ring.glb",
      explode: new THREE.Vector3(0, 0, 0)
    }));
    const caps = Array.from({ length: 4 }, (_, index) => ({
      name: `Connecting Rod Cap ${index + 1}`,
      file: "Connecting Rod Cap.glb",
      explode: new THREE.Vector3(0, 0, 0)
    }));
    const rods = Array.from({ length: 4 }, (_, index) => ({
      name: `Connecting Rod ${index + 1}`,
      file: "Connecting Rod.glb",
      explode: new THREE.Vector3(0, 0, 0)
    }));
    const pins = Array.from({ length: 4 }, (_, index) => ({
      name: `Piston Pin ${index + 1}`,
      file: "Piston Pin.glb",
      explode: new THREE.Vector3(0, 0, 0)
    }));
    const pistons = Array.from({ length: 4 }, (_, index) => ({
      name: `Piston ${index + 1}`,
      file: "Piston.glb",
      explode: new THREE.Vector3(0, 0, 0)
    }));
    return [...baseParts, ...rings, ...bolts, ...caps, ...rods, ...pins, ...pistons];
  }

  buildParts(config) {
    if (config.type === "drone") return this.buildDroneParts();
    if (config.type === "suspension") return this.buildSuspensionParts();
    if (config.type === "robotArm") return this.buildRobotArmParts();
    if (config.type === "v4Engine") return this.buildV4EngineParts();
    if (config.type === "simple") {
      const files = config.files || [];
      const overrides = this.partOverrides || {};
      const expanded = [];
      files.forEach((file) => {
        const filePath = typeof file === "string" ? file : file.file;
        const baseFile = filePath.split("/").pop();
        const count = Number.isFinite(overrides[filePath])
          ? Math.max(1, overrides[filePath])
          : Number.isFinite(overrides[baseFile])
            ? Math.max(1, overrides[baseFile])
            : 1;
        if (count <= 1) {
          expanded.push(file);
          return;
        }
        let baseName = (typeof file === "object" && file.name)
          ? file.name
          : baseFile.replace(/\.glb$/i, "");
        if (this.currentProjectId === "leafSpring" && baseFile === "Pin.glb") {
          baseName = "Spring Pin";
        }
        for (let idx = 1; idx <= count; idx += 1) {
          expanded.push({ file: filePath, name: `${baseName} ${idx}` });
        }
      });
      return this.buildSimpleParts(expanded);
    }
    return [];
  }

  getFirstMeshMaterial(object) {
    let found = null;
    object.traverse((child) => {
      if (found) return;
      if (child.isMesh && child.material) {
        found = Array.isArray(child.material) ? child.material[0] : child.material;
      }
    });
    return found;
  }

  syncRodCapMaterial() {
    if (this.currentProjectId !== "suspension") return;
    const rodPart = this.parts.find((part) => part.name === "ROD");
    const capPart = this.parts.find((part) => part.name === "Rod Cap");
    if (!rodPart || !capPart || !rodPart.object || !capPart.object) return;
    const rodMaterial = this.getFirstMeshMaterial(rodPart.object);
    if (!rodMaterial) return;

    const baseMaterial = rodMaterial.clone();
    baseMaterial.side = THREE.DoubleSide;
    const holeMaterial = rodMaterial.clone();
    if (holeMaterial.color) {
      holeMaterial.color.multiplyScalar(0.35);
    }
    if ("roughness" in holeMaterial) {
      holeMaterial.roughness = Math.min(1, holeMaterial.roughness + 0.3);
    }
    if ("metalness" in holeMaterial) {
      holeMaterial.metalness = Math.max(0, holeMaterial.metalness - 0.2);
    }
    holeMaterial.side = THREE.DoubleSide;

    capPart.object.traverse((child) => {
      if (!child.isMesh) return;
      if (child.userData && child.userData.rodCapHole) {
        child.material = holeMaterial.clone();
      } else {
        child.material = baseMaterial.clone();
      }
    });
  }

  updateStatus(extra = "") {
    if (this.state.loaded === this.state.total) {
      this.emitStatus(extra ? `준비 완료 · ${extra}` : "준비 완료");
      return;
    }
    this.emitStatus(`로딩 중... (${this.state.loaded}/${this.state.total})`);
  }

  prepareObject(part, object) {
    object.traverse((child) => {
      child.visible = true;
      if (child.layers) child.layers.enable(0);
      if (child.isMesh || child.isLine || child.isLineSegments || child.isPoints) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.frustumCulled = false;
        if (child.geometry && child.geometry.computeVertexNormals) {
          child.geometry.computeVertexNormals();
        }
        if (!child.material) {
          const hasVertexColors = Boolean(child.geometry?.attributes?.color);
          child.material = new THREE.MeshStandardMaterial({
            color: 0x9bbcff,
            vertexColors: hasVertexColors,
            metalness: 0.2,
            roughness: 0.6
          });
          child.material.side = THREE.DoubleSide;
        } else if (
          !["v4Engine", "leafSpring"].includes(this.currentProjectId) &&
          Array.isArray(child.material)
        ) {
          child.material.forEach((mat) => {
            if ("envMapIntensity" in mat) {
              mat.envMapIntensity = 0.15;
            }
            if ("metalness" in mat && "roughness" in mat && mat.metalness <= 0.2) {
              mat.roughness = Math.max(mat.roughness ?? 0, 0.7);
            }
          });
        } else if (!["v4Engine", "leafSpring"].includes(this.currentProjectId)) {
          if ("envMapIntensity" in child.material) {
            child.material.envMapIntensity = 0.15;
          }
          if (
            "metalness" in child.material &&
            "roughness" in child.material &&
            child.material.metalness <= 0.2
          ) {
            child.material.roughness = Math.max(child.material.roughness ?? 0, 0.7);
          }
        }
      }
    });

    this.applyMaterialOverrides(part, object);

    let objectBox = new THREE.Box3().setFromObject(object);
    let objectSize = objectBox.getSize(new THREE.Vector3());
    let objectMaxDim = Math.max(objectSize.x, objectSize.y, objectSize.z);
    if (Number.isFinite(objectMaxDim) && objectMaxDim > 0) {
      if (objectMaxDim < 5) {
        const scale = 120 / objectMaxDim;
        object.scale.setScalar(scale);
      } else if (objectMaxDim > 2000) {
        const scale = 300 / objectMaxDim;
        object.scale.setScalar(scale);
      }
    }
    object.updateMatrixWorld(true);
    objectBox = new THREE.Box3().setFromObject(object);
    const objectCenter = objectBox.getCenter(new THREE.Vector3());
    const pivot = new THREE.Group();
    pivot.add(object);
    object.position.sub(objectCenter);
    pivot.updateMatrixWorld(true);

    part.object = pivot;
    part.object.name = part.name;
    part.object.userData.name = part.name;
    const manual = this.manualDefaults[part.name];
    if (manual) {
      part.manual = true;
      part.baseOffset = new THREE.Vector3(...manual.pos);
      part.baseRotation = new THREE.Euler(
        THREE.MathUtils.degToRad(manual.rot[0]),
        THREE.MathUtils.degToRad(manual.rot[1]),
        THREE.MathUtils.degToRad(manual.rot[2])
      );
      if (
        Number.isFinite(manual.scaleX) &&
        Number.isFinite(manual.scaleY) &&
        Number.isFinite(manual.scaleZ)
      ) {
        part.baseScale = new THREE.Vector3(manual.scaleX, manual.scaleY, manual.scaleZ);
      } else {
        part.baseScale = new THREE.Vector3(manual.scale, manual.scale, manual.scale);
      }
    }
    if (part.baseOffset) {
      pivot.position.copy(part.baseOffset);
    }
    if (part.baseRotation) {
      pivot.rotation.copy(part.baseRotation);
    }
    if (part.baseScale) {
      pivot.scale.copy(part.baseScale);
    }
    part.basePosition = pivot.position.clone();
    part.baseRotation = pivot.rotation.clone();
    part.baseScale = pivot.scale.clone();
    this.group.add(pivot);
    this.selectable.push(pivot);
    this.state.loaded += 1;
    this.updateStatus();
  }

  applyMaterialOverrides(part, object) {
    if (this.currentProjectId === "leafSpring") {
      const name = part.name || "";
      const targetNames = [
        "Support-Chassis Rigid",
        "Support-Chassis",
        "Clamp-Center",
        "Clamp-Primary 1",
        "Clamp-Primary 2",
        "Clamp-Secondary 1",
        "Clamp-Secondary 2",
        "Leaf-Layer"
      ];
      if (!targetNames.includes(name)) return;
      const override = name === "Leaf-Layer"
        ? { color: 0x5b5b5b, metalness: 0.1, roughness: 0.75 }
        : { color: 0xfaf6df, metalness: 0.1, roughness: 0.75 };
      object.traverse((child) => {
        if (!child.isMesh) return;
        const material = new THREE.MeshStandardMaterial({
          color: override.color,
          metalness: override.metalness,
          roughness: override.roughness
        });
        material.side = THREE.DoubleSide;
        child.material = material;
      });
      return;
    }
    if (this.currentProjectId !== "robotGripper") return;
    if (!this.enableRobotGripperOverrides) return;
    const name = part.name || "";
    let override = null;
    if (name.startsWith("Base Gear")) {
      override = { color: 0x2b2f36, metalness: 0.35, roughness: 0.45 };
    } else if (name.startsWith("Base Plate")) {
      override = { color: 0x9aa0a6, metalness: 0.15, roughness: 0.65 };
    } else if (name.startsWith("Pin ")) {
      override = { color: 0xc2c6cc, metalness: 0.85, roughness: 0.25 };
    } else if (name === "Base Mounting bracket") {
      override = { color: 0x5f6fd6, metalness: 0.1, roughness: 0.6 };
    }
    if (!override) return;

    object.traverse((child) => {
      if (!child.isMesh) return;
      const material = new THREE.MeshStandardMaterial({
        color: override.color,
        metalness: override.metalness,
        roughness: override.roughness
      });
      material.side = THREE.DoubleSide;
      child.material = material;
    });
  }

  loadPart(part, token) {
    if (part.factory) {
      return new Promise((resolve, reject) => {
        try {
          const object = part.factory();
          if (token !== this.loadToken) {
            resolve();
            return;
          }
          this.prepareObject(part, object);
          resolve();
        } catch (error) {
          console.error(`Failed to build ${part.name}`, error);
          reject(error);
        }
      });
    }
    const path = part.file?.startsWith("/")
      ? part.file
      : this.currentBasePath && this.currentBasePath !== "."
        ? `${this.currentBasePath}/${part.file}`
        : part.file;
    const url = encodeURI(path);
    return new Promise((resolve, reject) => {
      this.loader.load(
        url,
        (gltf) => {
          if (token !== this.loadToken) {
            resolve();
            return;
          }
          this.prepareObject(part, gltf.scene);
          resolve();
        },
        undefined,
        (error) => {
          console.error(`Failed to load ${part.file}`, error);
          reject(error);
        }
      );
    });
  }

  async loadAll(token) {
    this.updateStatus();
    for (const part of this.parts) {
      if (token !== this.loadToken) return;
      await this.loadPart(part, token);
    }
    if (token !== this.loadToken) return;
    this.updateLayout();
    this.group.rotation.set(-Math.PI / 2, 0, 0);
    this.centerGroup(this.group);
    for (const part of this.parts) {
      if (part.object) {
        part.basePosition = part.object.position.clone();
      }
    }
    this.fitCameraToObject(this.group, this.camera, this.controls);
    if (this.currentProjectId === "drone") {
      this.setDefaultDroneCamera();
    }
    this.updateStatus("준비 완료");
    this.emitParts();
    this.setSelectedIndex(-1);
    this.syncRodCapMaterial();
  }

  resetScene() {
    this.transformControls.detach();
    if (this.group) {
      this.scene.remove(this.group);
    }
    this.group = new THREE.Group();
    this.scene.add(this.group);
    this.selectable = [];
  }

  async setProject(projectId, options = {}) {
    const config = projectConfigs[projectId];
    if (!config) return;
    this.scene.background = new THREE.Color(0x0b0e14);
    const noEnvironmentProjects = new Set(["v4Engine", "leafSpring"]);
    if (noEnvironmentProjects.has(projectId)) {
      this.scene.environment = null;
    } else {
      this.scene.environment = this.environmentTexture;
    }
    this.loadToken += 1;
    const token = this.loadToken;
    this.currentProjectId = projectId;
    this.currentBasePath = config.basePath || ".";
    this.manualDefaults = config.manualDefaults || {};
    this.partOverrides = options.partOverrides || null;
    this.parts = this.buildParts(config);
    this.state.loaded = 0;
    this.state.total = this.parts.length;
    this.state.current = 0;
    this.state.target = 0;
    this.resetScene();
    this.clearNotes();
    await this.loadAll(token);
  }

  onPointerDown(event) {
    if (this.noteMode) {
      event.preventDefault();
      event.stopPropagation();
      const rect = this.renderer.domElement.getBoundingClientRect();
      this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      this.raycaster.setFromCamera(this.pointer, this.camera);
      const noteHits = this.raycaster.intersectObjects(
        this.notes.map((note) => note.sprite),
        false
      );
      if (noteHits.length) {
        const noteId = noteHits[0].object?.userData?.noteId ?? null;
        if (noteId) {
          this.activeNoteId = noteId;
          this.emitActiveNote(noteId);
          this.setHoveredNote(noteId);
          this.transformControls.attach(noteHits[0].object);
        }
        return;
      }
      const hits = this.raycaster.intersectObjects(this.selectable, true);
      if (hits.length) {
        this.addNoteAt(hits[0].point, hits[0].object);
        const note = this.notes.find((item) => item.id === this.activeNoteId);
        if (note) {
          this.transformControls.attach(note.sprite);
        }
      }
      return;
    }
    if (this.groupSelection.length) {
      return;
    }
    if (!this.editMode) return;
    event.preventDefault();
    event.stopPropagation();
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hits = this.raycaster.intersectObjects(this.selectable, true);
    if (!hits.length) return;
    const hit = hits[0].object;
    let target = hit;
    while (target.parent && target.parent !== this.group) {
      target = target.parent;
    }
    if (target) {
      this.transformControls.attach(target);
      const index = this.parts.findIndex((part) => part.object === target);
      if (index >= 0) {
        this.setSelectedIndex(index);
      }
    }
  }

  onPointerMove(event) {
    if (!this.notes.length) return;
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const sprites = this.notes.map((note) => note.sprite);
    const hits = this.raycaster.intersectObjects(sprites, false);
    const hit = hits[0]?.object;
    const hoveredId = hit?.userData?.noteId ?? null;
    this.setHoveredNote(hoveredId);
  }

  getNoteScreenPosition(noteId) {
    const note = this.notes.find((item) => item.id === noteId);
    if (!note || !note.sprite) return null;
    const position = new THREE.Vector3();
    note.sprite.getWorldPosition(position);
    position.project(this.camera);
    const rect = this.renderer.domElement.getBoundingClientRect();
    const x = (position.x * 0.5 + 0.5) * rect.width + rect.left;
    const y = (-position.y * 0.5 + 0.5) * rect.height + rect.top;
    const visible = position.z < 1;
    return { x, y, visible };
  }

  centerGroup(object) {
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    let scale = 1;
    if (maxDim > 1000) {
      scale = 300 / maxDim;
    } else if (maxDim > 0 && maxDim < 50) {
      scale = 200 / maxDim;
    }
    object.scale.setScalar(scale);
    object.position.sub(center.multiplyScalar(scale));
  }

  fitCameraToObject(object, cameraToFit, controlsToFit, distanceScale = 1, minDistance = 80) {
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    if (!Number.isFinite(maxDim) || maxDim === 0) {
      cameraToFit.position.set(200, 140, 200);
      cameraToFit.near = 0.1;
      cameraToFit.far = 100000;
      cameraToFit.updateProjectionMatrix();
      controlsToFit.target.set(0, 0, 0);
      controlsToFit.update();
      return "bbox 없음";
    }
    const fov = cameraToFit.fov * (Math.PI / 180);
    const cameraZ = Math.abs((maxDim / 2) / Math.tan(fov / 2)) * 1.15;
    const scaledZ = cameraZ * Math.max(0.2, distanceScale);
    const safeZ = Math.min(Math.max(scaledZ, minDistance), 1000000);

    cameraToFit.position.set(center.x + safeZ, center.y + safeZ * 0.5, center.z + safeZ);
    cameraToFit.near = Math.max(safeZ / 1000, 0.1);
    cameraToFit.far = Math.max(safeZ * 1000, 2000);
    cameraToFit.updateProjectionMatrix();

    controlsToFit.target.copy(center);
    controlsToFit.update();
    return `bbox ${size.x.toFixed(1)}·${size.y.toFixed(1)}·${size.z.toFixed(1)}`;
  }

  setDefaultDroneCamera() {
    if (!this.group) return;
    const box = new THREE.Box3().setFromObject(this.group);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    if (!Number.isFinite(maxDim) || maxDim === 0) return;
    const fov = this.camera.fov * (Math.PI / 180);
    const cameraZ = Math.abs((maxDim / 2) / Math.tan(fov / 2)) * 1.15;
    const safeZ = Math.min(Math.max(cameraZ, 120), 1000000);
    const dir = new THREE.Vector3(-1, 0.35, -1).normalize();
    this.camera.position.copy(center.clone().add(dir.multiplyScalar(safeZ)));
    this.camera.near = Math.max(safeZ / 1000, 0.1);
    this.camera.far = Math.max(safeZ * 1000, 2000);
    this.camera.updateProjectionMatrix();
    this.controls.target.copy(center);
    this.controls.update();
  }

  updateLayout() {
    for (const part of this.parts) {
      if (part.manual) continue;
      if (!part.meta) continue;
      const dir = part.meta.dir;
      const armPos = dir.clone().multiplyScalar(this.layout.armDistance);
      const legPos = dir.clone().multiplyScalar(this.layout.legDistance);
      const motorPos = legPos.clone().add(new THREE.Vector3(0, this.layout.motorHeight, 0));
      const bladePos = legPos.clone().add(new THREE.Vector3(0, this.layout.bladeHeight, 0));
      if (part.meta.kind === "arm") part.baseOffset = armPos;
      if (part.meta.kind === "leg") part.baseOffset = legPos;
      if (part.meta.kind === "motor") part.baseOffset = motorPos;
      if (part.meta.kind === "blade") part.baseOffset = bladePos;
      if (part.object) {
        part.object.position.copy(part.baseOffset);
        part.basePosition = part.object.position.clone();
      }
    }
    this.applyExplode(this.state.current);
  }

  applyExplode(amount) {
    for (let index = 0; index < this.parts.length; index += 1) {
      const part = this.parts[index];
      if (!part.object) continue;
      let offset = part.explode ? part.explode.clone() : new THREE.Vector3(0, 0, 0);
      let effectiveAmount = amount;
      if (this.currentProjectId === "leafSpring") {
        if (part.basePosition) {
          offset = part.basePosition.clone().normalize().multiplyScalar(80);
        }
      } else if (this.currentProjectId === "suspension") {
        if (part.name === "ROD") {
          offset = new THREE.Vector3(0, 185, 0);
        } else if (part.name === "SPRING") {
          offset = new THREE.Vector3(0, 100, 0);
        } else if (part.name === "NUT") {
          offset = new THREE.Vector3(0, 270, 0);
        } else if (part.name === "BASE") {
          offset = new THREE.Vector3(0, 0, 0);
        } else if (part.name === "Rod Cap") {
          offset = new THREE.Vector3(0, -70, 0);
        }
      } else if (this.currentProjectId === "robotGripper") {
        if (part.name === "Base Gear") {
          offset = new THREE.Vector3(0, 0, -50);
        } else if (part.name === "Gripper 1") {
          offset = new THREE.Vector3(0, 0, -80);
        } else if (part.name === "Gripper 2") {
          offset = new THREE.Vector3(0, 0, -50);
        } else if (part.name === "Base Mounting bracket") {
          offset = new THREE.Vector3(0, 0, 80);
        } else if (part.name === "Gear link 1") {
          offset = new THREE.Vector3(0, 0, 130);
        } else if (part.name === "Gear link 2") {
          offset = new THREE.Vector3(0, 0, 60);
        } else if (part.name === "Link 1") {
          offset = new THREE.Vector3(0, 0, 100);
        } else if (part.name === "Link 2") {
          offset = new THREE.Vector3(0, 0, 80);
        } else if (part.name === "Base Plate 2") {
          offset = new THREE.Vector3(0, 0, 40);
        } else if (part.name.startsWith("Pin ")) {
          offset = new THREE.Vector3(0, 0, 180);
        } else {
          offset = new THREE.Vector3(0, 0, 0);
        }
      } else if (this.currentProjectId === "robotArm") {
        if (part.name === "base") {
          offset = new THREE.Vector3(0, 0, -80);
        } else if (part.name === "Part3") {
          offset = new THREE.Vector3(-80, 0, 0);
        } else if (part.name === "Part5") {
          offset = new THREE.Vector3(0, -80, 0);
        } else if (part.name === "Part6") {
          offset = new THREE.Vector3(0, -120, 0);
        } else if (part.name === "Part7") {
          offset = new THREE.Vector3(0, -160, 0);
        } else if (part.name === "Part8 1") {
          offset = new THREE.Vector3(-80, 0, 0);
        } else if (part.name === "Part8 2") {
          offset = new THREE.Vector3(80, 0, 0);
        }
      } else if (this.currentProjectId === "v4Engine") {
        const delayOthers = 0.4;
        if (part.name.startsWith("Piston Ring ")) {
          const ringIndex = Number(part.name.split(" ")[2]);
          if ([1, 4, 7, 10].includes(ringIndex)) {
            offset = new THREE.Vector3(0, 0, 80);
          } else if ([2, 5, 8, 11].includes(ringIndex)) {
            offset = new THREE.Vector3(0, 0, 65);
          } else if ([3, 6, 9, 12].includes(ringIndex)) {
            offset = new THREE.Vector3(0, 0, 55);
          }
          effectiveAmount = Math.max(0, (amount - delayOthers) / (1 - delayOthers));
        } else if (part.name.startsWith("Piston Pin ")) {
          const pinIndex = Number(part.name.split(" ")[2]);
          if ([1, 2].includes(pinIndex)) {
            offset = new THREE.Vector3(-50, 0, 0);
          } else if ([3, 4].includes(pinIndex)) {
            offset = new THREE.Vector3(50, 0, 0);
          }
        } else if (part.name.startsWith("Piston ")) {
          offset = new THREE.Vector3(0, 0, 40);
          effectiveAmount = Math.max(0, (amount - delayOthers) / (1 - delayOthers));
        } else if (part.name.startsWith("Conrod Bolt ")) {
          offset = new THREE.Vector3(0, 0, 50);
          effectiveAmount = Math.max(0, (amount - delayOthers) / (1 - delayOthers));
        } else if (part.name.startsWith("Connecting Rod Cap ")) {
          offset = new THREE.Vector3(0, 0, -50);
          effectiveAmount = Math.max(0, (amount - delayOthers) / (1 - delayOthers));
        } else if (part.name.startsWith("Connecting Rod ")) {
          offset = new THREE.Vector3(0, 0, 20);
          effectiveAmount = Math.max(0, (amount - delayOthers) / (1 - delayOthers));
        }
      } else {
        if (part.name.startsWith("Blade")) {
          offset = new THREE.Vector3(0, 0, 70);
        } else if (part.name.startsWith("Arm")) {
          offset = new THREE.Vector3(0, 0, 50);
        } else if (part.name.startsWith("Gearing")) {
          offset = new THREE.Vector3(0, 0, -35);
        } else if (part.name === "Leg 1" || part.name === "Leg 3") {
          offset = new THREE.Vector3(60, 0, 0);
        } else if (part.name === "Leg 2" || part.name === "Leg 4") {
          offset = new THREE.Vector3(-60, 0, 0);
        } else if (part.name.startsWith("Nut")) {
          offset = new THREE.Vector3(0, 0, 40);
        } else if (part.name.startsWith("Screw")) {
          offset = new THREE.Vector3(0, 0, -60);
        } else if (part.name.startsWith("Beater disc")) {
          offset = new THREE.Vector3(0, 50, 0);
        } else if (part.name === "Main frame") {
          offset = new THREE.Vector3(0, 0, -20);
        } else if (part.name === "Main frame MIR") {
          offset = new THREE.Vector3(0, 0, 20);
        } else if (part.name === "xyz") {
          offset = new THREE.Vector3(0, 0, 0);
        }
      }
      offset.multiplyScalar(effectiveAmount * this.state.explodeScale);
      part.object.position.copy(part.basePosition).add(offset);
    }
  }

  setSelectedIndex(index) {
    if (index < 0) {
      if (this.highlightedParts.length) {
        this.highlightedParts.forEach((part) => this.setPartHighlight(part, false));
        this.highlightedParts = [];
      }
      if (this.dimmedParts.length) {
        this.dimmedParts.forEach((part) => this.setPartDim(part, false));
        this.dimmedParts = [];
      }
      this.transformControls.detach();
      return;
    }
    if (index === this.state.selectedIndex && this.highlightedParts.length) {
      this.highlightedParts.forEach((part) => this.setPartHighlight(part, false));
      this.highlightedParts = [];
      if (this.dimmedParts.length) {
        this.dimmedParts.forEach((part) => this.setPartDim(part, false));
        this.dimmedParts = [];
      }
      this.transformControls.detach();
      this.emitSelection(index);
      return;
    }
    if (this.highlightedParts.length) {
      this.highlightedParts.forEach((part) => this.setPartHighlight(part, false));
      this.highlightedParts = [];
    }
    if (this.dimmedParts.length) {
      this.dimmedParts.forEach((part) => this.setPartDim(part, false));
      this.dimmedParts = [];
    }
    this.state.selectedIndex = index;
    const part = this.parts[index];
    if (!part || !part.object) return;
    if (this.viewMode === "single") {
      this.transformControls.detach();
      this.emitSelection(index);
      return;
    }
    this.transformControls.attach(part.object);
    const baseName = this.normalizeHighlightName(part.name);
    const dimTargets = this.parts.filter(
      (item) => this.normalizeHighlightName(item.name) !== baseName
    );
    dimTargets.forEach((target) => this.setPartDim(target, true));
    this.dimmedParts = dimTargets;
    this.emitSelection(index);
  }

  setGroupSelection(names = []) {
    this.groupSelection = Array.isArray(names) ? names : [];
    if (!this.groupSelection.length) {
      if (this.groupPivot) {
        this.transformControls.detach();
        this.scene.remove(this.groupPivot);
        this.groupPivot = null;
        this.groupPivotPosition = null;
      }
      return;
    }
    if (!this.groupPivot) {
      this.groupPivot = new THREE.Object3D();
      this.groupPivot.userData.groupPivot = true;
      this.scene.add(this.groupPivot);
    }
    const center = this.groupSelection.reduce(
      (acc, name) => {
        const part = this.parts.find((item) => item.name === name);
        if (!part?.object) return acc;
        acc.x += part.object.position.x;
        acc.y += part.object.position.y;
        acc.z += part.object.position.z;
        acc.count += 1;
        return acc;
      },
      { x: 0, y: 0, z: 0, count: 0 }
    );
    if (!center.count) return;
    this.groupPivot.position.set(center.x / center.count, center.y / center.count, center.z / center.count);
    this.groupPivotPosition = this.groupPivot.position.clone();
    this.transformControls.attach(this.groupPivot);
    this.transformControls.setMode("translate");
  }

  setPartVisibility(name, visible) {
    const part = this.parts.find((item) => item.name === name);
    if (!part?.object) return;
    part.object.visible = visible;
    if (!visible && this.transformControls.object === part.object) {
      this.transformControls.detach();
    }
  }

  setPartHighlight(part, enabled) {
    if (!part?.object) return;
    if (part.outlineGroup) {
      this.detachOutline(part);
    }
    part.object.traverse((child) => {
      if (!child.isMesh || !child.material) return;
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((mat) => {
        if (!("emissive" in mat)) return;
        if (!mat.userData.__origEmissive) {
          mat.userData.__origEmissive = mat.emissive.clone();
          mat.userData.__origEmissiveIntensity = mat.emissiveIntensity ?? 0;
        }
        if (enabled) {
          const baseColor = mat.color ? mat.color.clone() : new THREE.Color(0xffffff);
          mat.emissive.copy(baseColor);
          mat.emissiveIntensity = 1.2;
        } else if (mat.userData.__origEmissive) {
          mat.emissive.copy(mat.userData.__origEmissive);
          mat.emissiveIntensity = mat.userData.__origEmissiveIntensity ?? 0;
        }
        mat.needsUpdate = true;
      });
    });
  }

  setPartDim(part, enabled) {
    if (!part?.object) return;
    part.object.traverse((child) => {
      if (!child.isMesh || !child.material) return;
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((mat) => {
        if (!mat.userData.__origOpacity) {
          mat.userData.__origOpacity = mat.opacity ?? 1;
          mat.userData.__origTransparent = Boolean(mat.transparent);
        }
        if (enabled) {
          mat.transparent = true;
          mat.opacity = 0.13;
        } else {
          mat.opacity = mat.userData.__origOpacity ?? 1;
          mat.transparent = mat.userData.__origTransparent ?? false;
        }
        mat.needsUpdate = true;
      });
    });
  }

  detachOutline(part) {
    if (!part?.outlineGroup || !part.object) return;
    part.object.remove(part.outlineGroup);
    part.outlineGroup.traverse((child) => {
      if (child.material?.dispose) child.material.dispose();
    });
    part.outlineGroup = null;
  }

  normalizeHighlightName(name) {
    if (this.currentProjectId === "robotArm") {
      if (name.startsWith("Part8")) return "Part8";
      return name;
    }
    if (this.currentProjectId === "robotGripper") {
      if (name.toLowerCase().startsWith("gear link")) return name;
    }
    return name.replace(/\s*\d+$/, "").trim();
  }

  setHiddenParts(names = []) {
    const hidden = new Set(names);
    this.parts.forEach((part) => {
      if (!part?.object) return;
      part.object.visible = !hidden.has(part.name);
    });
  }

  setViewMode(mode) {
    this.viewMode = mode === "single" ? "single" : "assembly";
    if (this.viewMode === "single") {
      this.editMode = false;
      this.transformControls.visible = false;
      this.transformControls.enabled = false;
      this.transformControls.detach();
    }
  }

  applySinglePartRotation(part) {
    if (!part?.object) return;
    if (part.baseRotation) {
      part.object.rotation.copy(part.baseRotation);
    }
  }

  focusOnPart(name) {
    const part = this.parts.find((item) => item.name === name);
    if (!part?.object) return;
    this.applySinglePartRotation(part);
    const lower = String(name).toLowerCase();
    const isHardware = lower.startsWith("nut") || lower.startsWith("screw");
    const distanceScale = isHardware ? 0.35 : 1;
    const minDistance = isHardware ? 18 : 80;
    this.fitCameraToObject(part.object, this.camera, this.controls, distanceScale, minDistance);
    if (this.viewMode === "single" && lower.startsWith("beater disc")) {
      const target = this.controls.target.clone();
      const offset = this.camera.position.clone().sub(target);
      const rotated = new THREE.Vector3(-offset.x, offset.y, -offset.z);
      this.camera.position.copy(target.clone().add(rotated));
      this.camera.updateProjectionMatrix();
      this.controls.update();
    }
  }

  focusOnScene() {
    if (!this.group) return;
    this.parts.forEach((part) => this.applySinglePartRotation(part));
    if (this.currentProjectId === "drone") {
      this.setDefaultDroneCamera();
      return;
    }
    this.fitCameraToObject(this.group, this.camera, this.controls);
  }

  applySelectedTransform(values) {
    const part = this.parts[this.state.selectedIndex];
    if (!part || !part.object) return;
    part.object.position.set(values.posX, values.posY, values.posZ);
    part.object.rotation.set(
      THREE.MathUtils.degToRad(values.rotX),
      THREE.MathUtils.degToRad(values.rotY),
      THREE.MathUtils.degToRad(values.rotZ)
    );
    const hasScaleX = Number.isFinite(values.scaleX);
    const hasScaleY = Number.isFinite(values.scaleY);
    const hasScaleZ = Number.isFinite(values.scaleZ);
    if (hasScaleX || hasScaleY || hasScaleZ) {
      const current = part.object.scale;
      part.object.scale.set(
        hasScaleX ? values.scaleX : current.x,
        hasScaleY ? values.scaleY : current.y,
        hasScaleZ ? values.scaleZ : current.z
      );
    } else if (Number.isFinite(values.scale)) {
      part.object.scale.setScalar(values.scale);
    }
    part.basePosition = part.object.position.clone();
    part.baseRotation = part.object.rotation.clone();
    part.baseScale = part.object.scale.clone();
    this.applyExplode(this.state.current);
  }

  setTarget(value) {
    this.state.target = value;
  }

  setExplodeScale(value) {
    this.state.explodeScale = value;
  }

  setSpeed(value) {
    this.state.speed = value;
  }

  setEditMode(value) {
    this.editMode = value;
    this.transformControls.visible = value;
    this.transformControls.enabled = value;
  }

  setNoteMode(value) {
    this.noteMode = value;
    if (!value) {
      this.activeNoteId = null;
      this.emitActiveNote(null);
    }
  }

  setNoteText(value) {
    this.noteText = value;
  }

  setTransformMode(mode) {
    this.transformControls.setMode(mode);
  }

  getCurrentTransforms() {
    const transforms = {};
    this.parts.forEach((part) => {
      if (!part?.object) return;
      transforms[part.name] = {
        pos: [
          Number(part.object.position.x.toFixed(2)),
          Number(part.object.position.y.toFixed(2)),
          Number(part.object.position.z.toFixed(2))
        ],
        rot: [
          Number(THREE.MathUtils.radToDeg(part.object.rotation.x).toFixed(0)),
          Number(THREE.MathUtils.radToDeg(part.object.rotation.y).toFixed(0)),
          Number(THREE.MathUtils.radToDeg(part.object.rotation.z).toFixed(0))
        ],
        scale: Number(part.object.scale.x.toFixed(2)),
        scaleX: Number(part.object.scale.x.toFixed(2)),
        scaleY: Number(part.object.scale.y.toFixed(2)),
        scaleZ: Number(part.object.scale.z.toFixed(2))
      };
    });
    return transforms;
  }

  applyTransformsByName(transforms) {
    if (!transforms) return;
    this.parts.forEach((part) => {
      const data = transforms[part.name];
      if (!data || !part?.object) return;
      const [posX, posY, posZ] = data.pos || [];
      const [rotX, rotY, rotZ] = data.rot || [];
      const scale = data.scale;
      const hasScaleX = Number.isFinite(data.scaleX);
      const hasScaleY = Number.isFinite(data.scaleY);
      const hasScaleZ = Number.isFinite(data.scaleZ);
      if ([posX, posY, posZ].every((v) => Number.isFinite(v))) {
        part.object.position.set(posX, posY, posZ);
      }
      if ([rotX, rotY, rotZ].every((v) => Number.isFinite(v))) {
        part.object.rotation.set(
          THREE.MathUtils.degToRad(rotX),
          THREE.MathUtils.degToRad(rotY),
          THREE.MathUtils.degToRad(rotZ)
        );
      }
      if (hasScaleX || hasScaleY || hasScaleZ) {
        const current = part.object.scale;
        part.object.scale.set(
          hasScaleX ? data.scaleX : current.x,
          hasScaleY ? data.scaleY : current.y,
          hasScaleZ ? data.scaleZ : current.z
        );
      } else if (Number.isFinite(scale)) {
        part.object.scale.setScalar(scale);
      }
      part.basePosition = part.object.position.clone();
      part.baseRotation = part.object.rotation.clone();
      part.baseScale = part.object.scale.clone();
    });
    this.applyExplode(this.state.current);
    this.emitSelection(this.state.selectedIndex);
  }

  animate() {
    if (this.isDisposed) return;
    this.rafId = requestAnimationFrame(this.animate);
    const delta = this.clock.getDelta();
    const step = delta * 1.2 * this.state.speed;
    this.state.current += (this.state.target - this.state.current) * Math.min(step, 1);
    this.applyExplode(this.state.current);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

type AssemblyViewerProps = {
  projectId: string
  partOverrides?: Record<string, number>
  onStatusChange?: (text: string) => void
  onPartsChange?: (parts: string[]) => void
  onSelectedChange?: (index: number, values?: unknown) => void
  onNotesChange?: (notes: unknown[]) => void
  onActiveNoteChange?: (id: string | null) => void
  onGroupTransformChange?: (values: { posX: number; posY: number; posZ: number }) => void
}

export type AssemblyViewerHandle = {
  setProject?: (id: string, options?: { partOverrides?: Record<string, number> }) => void
  setTarget?: (value: number) => void
  setExplodeScale?: (value: number) => void
  setSpeed?: (value: number) => void
  setEditMode?: (value: boolean) => void
  setTransformMode?: (mode: string) => void
  setSelectedIndex?: (index: number) => void
  setGroupSelection?: (names: string[]) => void
  setPartVisibility?: (name: string, visible: boolean) => void
  setHiddenParts?: (names: string[]) => void
  setViewMode?: (mode: "single" | "assembly") => void
  applySelectedTransform?: (values: unknown) => void
  setNoteMode?: (value: boolean) => void
  setNoteText?: (value: string) => void
  updateNote?: (id: string, text: string) => void
  deleteNote?: (id: string) => void
  getNoteScreenPosition?: (id: string) => { x: number; y: number; visible: boolean } | null
  getCurrentTransforms?: () => unknown
  applyTransformsByName?: (transforms: Record<string, unknown>) => void
  focusOnPart?: (name: string) => void
  focusOnScene?: () => void
}

const AssemblyViewer = forwardRef<AssemblyViewerHandle, AssemblyViewerProps>(function AssemblyViewer(
  {
    projectId,
    partOverrides,
    onStatusChange,
    onPartsChange,
    onSelectedChange,
    onNotesChange,
    onActiveNoteChange,
    onGroupTransformChange
  },
  ref
) {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    engineRef.current = new AssemblyEngine(canvasRef.current, {
      onStatusChange,
      onPartsChange,
      onSelectedChange,
      onNotesChange,
      onActiveNoteChange,
      onGroupTransformChange
    });
    return () => {
      engineRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (!engineRef.current) return;
    engineRef.current.setProject(projectId, { partOverrides });
  }, [projectId, partOverrides]);

  useImperativeHandle(ref, () => ({
    setProject: (id, options) => engineRef.current?.setProject(id, options),
    setTarget: (value) => engineRef.current?.setTarget(value),
    setExplodeScale: (value) => engineRef.current?.setExplodeScale(value),
    setSpeed: (value) => engineRef.current?.setSpeed(value),
    setEditMode: (value) => engineRef.current?.setEditMode(value),
    setTransformMode: (mode) => engineRef.current?.setTransformMode(mode),
    setSelectedIndex: (index) => engineRef.current?.setSelectedIndex(index),
    setGroupSelection: (names) => engineRef.current?.setGroupSelection(names),
    setPartVisibility: (name, visible) => engineRef.current?.setPartVisibility(name, visible),
    setHiddenParts: (names) => engineRef.current?.setHiddenParts(names),
    setViewMode: (mode) => engineRef.current?.setViewMode(mode),
    applySelectedTransform: (values) => engineRef.current?.applySelectedTransform(values),
    setNoteMode: (value) => engineRef.current?.setNoteMode(value),
    setNoteText: (value) => engineRef.current?.setNoteText(value),
    updateNote: (id, text) => engineRef.current?.updateNote(id, text),
    deleteNote: (id) => engineRef.current?.deleteNote(id),
    getNoteScreenPosition: (id) => engineRef.current?.getNoteScreenPosition(id),
    getCurrentTransforms: () => engineRef.current?.getCurrentTransforms(),
    applyTransformsByName: (transforms) => engineRef.current?.applyTransformsByName(transforms),
    focusOnPart: (name) => engineRef.current?.focusOnPart(name),
    focusOnScene: () => engineRef.current?.focusOnScene()
  }));

  return <canvas ref={canvasRef} id="canvas" />;
});

export default AssemblyViewer;
