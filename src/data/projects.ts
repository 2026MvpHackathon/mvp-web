export const layoutDefaults = {
  armDistance: 180,
  legDistance: 260,
  motorHeight: 60,
  bladeHeight: 100
};

export const droneManualDefaults = {
  "Main frame": { pos: [0, 0, 0], rot: [0, 0, 0], scale: 1.0 },
  "Main frame MIR": { pos: [0, 0, 13], rot: [0, 0, 0], scale: 1.0 },
  "Leg 1": { pos: [47, -58, 1], rot: [90, -114, 0], scale: 0.3 },
  "Leg 2": { pos: [-46, -58, 1], rot: [90, 116, 0], scale: 0.3 },
  "Leg 3": { pos: [42, 47, 1], rot: [-90, -140, 180], scale: 0.3 },
  "Leg 4": { pos: [-43, 48, 1], rot: [90, 38, 0], scale: 0.3 },
  "Arm 1": { pos: [-50, 57, 12], rot: [90, 56, 180], scale: 0.11 },
  "Arm 2": { pos: [49, 55, 12], rot: [90, 56, 180], scale: 0.11 },
  "Arm 3": { pos: [-56, -63, 12], rot: [90, -45, 180], scale: 0.11 },
  "Arm 4": { pos: [57, -62, 12], rot: [90, -135, 180], scale: 0.11 },
  "Blade 1": { pos: [-50, 57, 16], rot: [90, 45, 0], scale: 0.5 },
  "Blade 2": { pos: [49, 55, 16], rot: [90, 135, 0], scale: 0.5 },
  "Blade 3": { pos: [-56, -63, 16], rot: [90, -45, 0], scale: 0.5 },
  "Blade 4": { pos: [57, -62, 16], rot: [90, -135, 0], scale: 0.5 },
  "Gearing 1": { pos: [51, -60, 5], rot: [-90, 45, 180], scale: 0.1 },
  "Gearing 2": { pos: [-50, -60, 4], rot: [90, 135, 0], scale: 0.1 },
  "Gearing 3": { pos: [-46, 52, 5], rot: [90, -45, 0], scale: 0.1 },
  "Gearing 4": { pos: [44, 50, 5], rot: [90, -135, 0], scale: 0.1 },
  "Beater disc 1": { pos: [0, 61, 7], rot: [-180, -90, 180], scale: 0.12 },
  "Nut 1": { pos: [-35.66, 38.07, 9.75], rot: [90, 0, 0], scale: 0.03 },
  "Nut 2": { pos: [35.6, 38.04, 10.0], rot: [90, 0, 0], scale: 0.03 },
  "Nut 3": { pos: [35.59, -53.21, 10.0], rot: [90, 0, 0], scale: 0.03 },
  "Nut 4": { pos: [-35.58, -53.15, 10.0], rot: [90, 0, 0], scale: 0.03 },
  "Screw 1": { pos: [-35.57, 37.99, 1.7], rot: [-90, 0, 0], scale: 0.02 },
  "Screw 2": { pos: [35.57, 38.11, 1.7], rot: [-90, 0, 0], scale: 0.02 },
  "Screw 3": { pos: [35.75, -53.26, 1.7], rot: [-90, 0, 0], scale: 0.02 },
  "Screw 4": { pos: [-35.51, -53.18, 1.7], rot: [-90, 0, 0], scale: 0.02 },
  xyz: { pos: [0.46, 8.64, -0.3], rot: [90, 0, 0], scale: 0.15 }
};

export const suspensionManualDefaults = {
  BASE: { pos: [-8.29, -30.23, -10.99], rot: [0, 0, 0], scale: 1.0 },
  NUT: { pos: [-8.6, 72.32, -11.15], rot: [0, 0, 0], scale: 0.49 },
  ROD: { pos: [-7.62, 60.35, -11.16], rot: [0, 0, 0], scale: 1.0 },
  SPRING: { pos: [-8.41, 7.04, -8.98], rot: [0, 0, 0], scale: 1.0 },
  "Rod Cap": { pos: [-7.59, -75.04, -10.13], rot: [0, 0, 90], scale: 1.86 }
};

export const leafSpringManualDefaults = {
  "Clamp-Center": { pos: [-12.77, -0.2, -7.7], rot: [90, 90, 0], scale: 0.6, scaleX: 0.6, scaleY: 0.6, scaleZ: 0.6 },
  "Clamp-Primary 1": { pos: [-56.7, 0, -18.37], rot: [90, -90, 0], scale: 0.31, scaleX: 0.31, scaleY: 0.31, scaleZ: 0.31 },
  "Clamp-Primary 2": { pos: [33.67, 0, -18.37], rot: [90, 90, 0], scale: 0.31, scaleX: 0.31, scaleY: 0.31, scaleZ: 0.31 },
  "Clamp-Secondary 1": { pos: [-105.5, -0.01, -9.76], rot: [90, 90, 0], scale: 0.3, scaleX: 0.3, scaleY: 0.3, scaleZ: 0.3 },
  "Clamp-Secondary 2": { pos: [78.71, 0, -8.71], rot: [90, 90, 0], scale: 0.3, scaleX: 0.3, scaleY: 0.3, scaleZ: 0.3 },
  "Leaf-Layer": { pos: [0, 0, 0], rot: [90, -90, 0], scale: 3, scaleX: 3, scaleY: 3, scaleZ: 3 },
  "Support-Chassis Rigid": { pos: [-167.25, 0, 22.52], rot: [-90, 90, 0], scale: 0.28, scaleX: 0.28, scaleY: 0.28, scaleZ: 0.28 },
  "Support-Chassis": { pos: [204.1, 0, 60.79], rot: [-90, 90, 0], scale: 0.42, scaleX: 0.42, scaleY: 0.42, scaleZ: 0.42 },
  "Support-Rubber 60mm": { pos: [204.1, 0, 50.05], rot: [90, 90, 0], scale: 0.25, scaleX: 0.25, scaleY: 0.25, scaleZ: 0.25 },
  "Support-Rubber": { pos: [169.96, 0, 30.3], rot: [90, 90, 0], scale: 0.22, scaleX: 0.22, scaleY: 0.22, scaleZ: 0.22 },
  "Support 1": { pos: [187, -15.57, 40.03], rot: [90, 0, 120], scale: 0.48, scaleX: 0.48, scaleY: 0.48, scaleZ: 0.48 },
  "Support 2": { pos: [187, 15.35, 40.03], rot: [90, 0, -60], scale: 0.48, scaleX: 0.48, scaleY: 0.48, scaleZ: 0.48 },
  "Pin 1": { pos: [-167, 0, 14.06], rot: [0, 0, 90], scale: 0.35, scaleX: 0.35, scaleY: 0.16, scaleZ: 0.16 },
  "Pin 2": { pos: [-12.66, 0, -26.41], rot: [0, 90, 0], scale: 0.36, scaleX: 0.36, scaleY: 0.14, scaleZ: 0.14 },
  "Pin 3": { pos: [169.89, 0, 29.89], rot: [0, 0, 90], scale: 0.34, scaleX: 0.34, scaleY: 0.16, scaleZ: 0.16 },
  "Pin 4": { pos: [203.94, 0, 49.79], rot: [0, 0, 90], scale: 0.45, scaleX: 0.45, scaleY: 0.16, scaleZ: 0.16 }
};

export const robotArmManualDefaults = {
  base: { pos: [0, 0, 0], rot: [90, 0, 0], scale: 1.0 },
  Part2: { pos: [0, -24.89, 48.0], rot: [90, 0, 0], scale: 1.0 },
  Part3: { pos: [-12.37, -21.85, 107.97], rot: [-130, 0, 90], scale: 1.25 },
  Part4: { pos: [11.38, -20.96, 170.5], rot: [83, 0, 0], scale: 1.0 },
  Part5: { pos: [11.66, -103.94, 190.28], rot: [83, 0, 0], scale: 0.54 },
  Part6: { pos: [11.61, -136.6, 186.24], rot: [19, 0, 0], scale: 0.39 },
  Part7: { pos: [11.49, -161.67, 177.4], rot: [109, 0, 0], scale: 0.27 },
  "Part8 1": { pos: [0, -181.4, 170.18], rot: [19, 0, -15], scale: 0.34 },
  "Part8 2": { pos: [23, -181.4, 170.18], rot: [19, 180, -15], scale: 0.34 }
};

export const v4EngineManualDefaults = {
  Crankshaft: { pos: [0, 0, 0], rot: [0, 0, 0], scale: 1.0 },
  "Connecting Rod Cap 1": { pos: [-28.25, -10.28, -6.16], rot: [90, 90, -12], scale: 0.18 },
  "Connecting Rod Cap 2": { pos: [-5.04, 10.13, -6.62], rot: [90, 90, 12], scale: 0.18 },
  "Connecting Rod Cap 3": { pos: [18.18, 10.88, -5.95], rot: [90, 90, 16], scale: 0.18 },
  "Connecting Rod Cap 4": { pos: [41.46, -9.93, -6.16], rot: [90, 90, -9], scale: 0.18 },
  "Connecting Rod 1": { pos: [-28.25, -3.5, 25.35], rot: [90, 90, -12], scale: 0.42 },
  "Connecting Rod 2": { pos: [-5.04, 3.46, 24.83], rot: [90, 90, 12], scale: 0.42 },
  "Connecting Rod 3": { pos: [18.18, 2.13, 24.57], rot: [90, 90, 16], scale: 0.42 },
  "Connecting Rod 4": { pos: [41.46, -4.95, 25.09], rot: [90, 90, -9], scale: 0.42 },
  "Conrod Bolt 1": { pos: [-28.25, -16.23, 4.9], rot: [90, 90, -12], scale: 0.09 },
  "Conrod Bolt 2": { pos: [-28.25, 0.06, 1.65], rot: [90, 90, -12], scale: 0.09 },
  "Conrod Bolt 3": { pos: [-5.04, 0.15, 1.04], rot: [90, 90, 13], scale: 0.09 },
  "Conrod Bolt 4": { pos: [-5.04, 16.54, 4.5], rot: [90, 90, 12], scale: 0.09 },
  "Conrod Bolt 5": { pos: [18.18, 16.55, 5.1], rot: [90, 90, 16], scale: 0.09 },
  "Conrod Bolt 6": { pos: [18.18, 0.42, 0.51], rot: [90, 90, 16], scale: 0.09 },
  "Conrod Bolt 7": { pos: [41.46, -17.0, 4.07], rot: [90, 90, -9], scale: 0.09 },
  "Conrod Bolt 8": { pos: [41.46, 0.11, 1.39], rot: [90, 90, -9], scale: 0.09 },
  "Piston 1": { pos: [-28.25, 0.68, 49.78], rot: [90, 90, 0], scale: 0.18 },
  "Piston 2": { pos: [-5.04, -0.71, 49.16], rot: [90, 90, 0], scale: 0.18 },
  "Piston 3": { pos: [18.18, -3.4, 48.6], rot: [90, 90, 0], scale: 0.18 },
  "Piston 4": { pos: [41.46, -1.83, 49.62], rot: [90, 90, 0], scale: 0.18 },
  "Piston Pin 1": { pos: [-28.25, 0.62, 45.1], rot: [90, 90, 0], scale: 0.15 },
  "Piston Pin 2": { pos: [-5.04, -0.65, 44.4], rot: [90, 90, 0], scale: 0.15 },
  "Piston Pin 3": { pos: [18.18, -3.4, 43.96], rot: [90, 90, 0], scale: 0.15 },
  "Piston Pin 4": { pos: [41.46, -1.82, 45.04], rot: [90, 90, 0], scale: 0.15 },
  "Piston Ring 1": { pos: [-28.25, 0.68, 57.3], rot: [90, 0, 0], scale: 0.16 },
  "Piston Ring 2": { pos: [-28.25, 0.68, 54.65], rot: [90, 0, 0], scale: 0.16 },
  "Piston Ring 3": { pos: [-28.25, 0.68, 52.03], rot: [90, 0, 0], scale: 0.16 },
  "Piston Ring 4": { pos: [-5.04, -0.71, 56.68], rot: [90, 0, 0], scale: 0.16 },
  "Piston Ring 5": { pos: [-5.04, -0.71, 54.05], rot: [90, 0, 0], scale: 0.16 },
  "Piston Ring 6": { pos: [-5.04, -0.71, 51.4], rot: [90, 0, 0], scale: 0.16 },
  "Piston Ring 7": { pos: [18.18, -3.4, 56.12], rot: [90, 0, 0], scale: 0.16 },
  "Piston Ring 8": { pos: [18.18, -3.4, 53.48], rot: [90, 0, 0], scale: 0.16 },
  "Piston Ring 9": { pos: [18.18, -3.4, 50.87], rot: [90, 0, 0], scale: 0.16 },
  "Piston Ring 10": { pos: [41.46, -1.83, 57.14], rot: [90, 0, 0], scale: 0.16 },
  "Piston Ring 11": { pos: [41.46, -1.83, 54.51], rot: [90, 0, 0], scale: 0.16 },
  "Piston Ring 12": { pos: [41.46, -1.83, 51.86], rot: [90, 0, 0], scale: 0.16 }
};

export const robotGripperManualDefaults = {
  "Base Gear": { pos: [-14.66, 26.54, 2.61], rot: [90, 7, 90], scale: 0.28 },
  "Base Mounting bracket": { pos: [0, 58.54, 15.77], rot: [90, -90, 0], scale: 0.32 },
  "Base Plate 1": { pos: [0, 0, 0], rot: [0, 0, -180], scale: 1 },
  "Base Plate 2": { pos: [0, 0, 5.27], rot: [0, 0, -180], scale: 1 },
  "Gear link 1": { pos: [-26.11, -31.88, 11.02], rot: [-90, 0, 90], scale: 0.78 },
  "Gear link 2": { pos: [26.32, -31.53, 11.02], rot: [180, 0, 82], scale: 0.76 },
  "Gripper 1": { pos: [-17.08, -107.16, 3.66], rot: [0, 180, -116], scale: 0.74 },
  "Gripper 2": { pos: [17.38, -106.67, 3.66], rot: [0, 0, -116], scale: 0.74 },
  "Link 1": { pos: [-10.25, -76.48, 10.32], rot: [90, -2, 90], scale: 0.48 },
  "Link 2": { pos: [10.83, -76.48, 10.32], rot: [90, 2, 90], scale: 0.48 },
  "Pin 1": { pos: [-11.64, 52.45, 5.61], rot: [0, 90, 0], scale: 0.17 },
  "Pin 2": { pos: [10.1, 52.45, 5.61], rot: [0, 90, 0], scale: 0.17 },
  "Pin 3": { pos: [-26.23, -12.43, 5.61], rot: [0, 90, 0], scale: 0.17 },
  "Pin 4": { pos: [26.12, -12.43, 5.61], rot: [0, 90, 0], scale: 0.17 },
  "Pin 5": { pos: [-9.44, -52.87, 5.01], rot: [0, 90, 0], scale: 0.16 },
  "Pin 6": { pos: [10.13, -52.87, 5.01], rot: [0, 90, 0], scale: 0.16 },
  "Pin 7": { pos: [-25.99, -71.05, 6.47], rot: [0, 90, 0], scale: 0.16 },
  "Pin 8": { pos: [26.54, -70.3, 6.47], rot: [0, 90, 0], scale: 0.16 },
  "Pin 9": { pos: [-10.87, -99.96, 5.83], rot: [0, 90, 0], scale: 0.15 },
  "Pin 10": { pos: [11.9, -99.96, 5.83], rot: [0, 90, 0], scale: 0.16 }
};

export const machineViceManualDefaults = {
  "Part1 Fuhrung": { pos: [-1.2, 0, 12.89], rot: [0, 0, 0], scale: 0.76 },
  "Part1 1": { pos: [136.84, -31.43, 9.72], rot: [180, 0, 0], scale: 0.17 },
  "Part1 2": { pos: [195.13, 0, 72.77], rot: [0, 0, 0], scale: 1 },
  "Part2 Feste Backe": { pos: [51.93, 0, 20.96], rot: [90, -90, 0], scale: 0.4 },
  "Part3-lose backe": { pos: [-14.55, 0, 27.56], rot: [90, -90, 0], scale: 0.41 },
  "Part4 spindelsockel": { pos: [-53.43, 0, 21.24], rot: [90, 90, 0], scale: 0.3 },
  "Part5-Spannbacke 1": { pos: [45.75, 0, 32.99], rot: [90, -90, 0], scale: 0.42 },
  "Part5-Spannbacke 2": { pos: [-0.5, 0, 33.16], rot: [90, 90, 0], scale: 0.42 },
  "Part6-fuhrungschiene 1": { pos: [-14.63, -18.5, 14.11], rot: [0, 0, 0], scale: 0.27 },
  "Part6-fuhrungschiene 2": { pos: [-14.63, 18.51, 14.16], rot: [0, 0, 180], scale: 0.27 },
  "Part7-TrapezSpindel": { pos: [-71.29, 0, 31.98], rot: [0, -90, 45], scale: 0.83 },
  "Part8-grundplatte": { pos: [0.02, 0, 6.44], rot: [0, 0, 0], scale: 1 },
  "Part9-Druckhulse 1": { pos: [-26.25, -21.42, 10.99], rot: [0, 180, 0], scale: 0.04 },
  "Part9-Druckhulse 2": { pos: [-2.36, -21.42, 10.99], rot: [0, 180, 0], scale: 0.04 },
  "Part9-Druckhulse 3": { pos: [-26.25, 21.4, 10.99], rot: [0, 180, 0], scale: 0.04 },
  "Part9-Druckhulse 4": { pos: [-2.36, 21.4, 10.99], rot: [0, 180, 0], scale: 0.04 },
  "Part9-Druckhulse 5": { pos: [-30.53, 8.11, 4.09], rot: [0, 0, 0], scale: 0.03 },
  "Part9-Druckhulse 6": { pos: [-30.53, -8.11, 4.09], rot: [0, 0, 0], scale: 0.03 },
  "Part9-Druckhulse 7": { pos: [-1.23, -8.11, 4.09], rot: [0, 0, 0], scale: 0.03 },
  "Part9-Druckhulse 8": { pos: [-1.23, 8.11, 4.09], rot: [0, 0, 0], scale: 0.03 },
  "Part9-Druckhulse 9": { pos: [28.16, 8.11, 4.09], rot: [0, 0, 0], scale: 0.03 },
  "Part9-Druckhulse 10": { pos: [28.16, -8.11, 4.09], rot: [0, 0, 0], scale: 0.03 }
};

export const projectConfigs = {
  drone: {
    label: "Drone",
    basePath: "/assets/Drone",
    type: "drone",
    manualDefaults: droneManualDefaults
  },
  leafSpring: {
    label: "Leaf Spring",
    basePath: "/assets/Leaf Spring",
    type: "simple",
    manualDefaults: leafSpringManualDefaults,
    defaultOverrides: {
      "Clamp-Primary.glb": 2,
      "Clamp-Secondary.glb": 2,
      "Support.glb": 2,
      "Pin.glb": 4
    },
    files: [
      "Clamp-Center.glb",
      "Clamp-Primary.glb",
      "Clamp-Secondary.glb",
      "Leaf-Layer.glb",
      "Support-Chassis Rigid.glb",
      "Support-Chassis.glb",
      "Support-Rubber 60mm.glb",
      "Support-Rubber.glb",
      "Support.glb",
      "/assets/Robot Gripper/Pin.glb"
    ]
  },
  machineVice: {
    label: "Machine Vice",
    basePath: "/assets/Machine Vice",
    type: "simple",
    manualDefaults: machineViceManualDefaults,
    defaultOverrides: {
      "Part1.glb": 2,
      "Part5-Spannbacke.glb": 2,
      "Part6-fuhrungschiene.glb": 2,
      "Part9-Druckhulse.glb": 10
    },
    files: [
      "Part1 Fuhrung.glb",
      "Part1.glb",
      "Part2 Feste Backe.glb",
      "Part3-lose backe.glb",
      "Part4 spindelsockel.glb",
      "Part5-Spannbacke.glb",
      "Part6-fuhrungschiene.glb",
      "Part7-TrapezSpindel.glb",
      "Part8-grundplatte.glb",
      "Part9-Druckhulse.glb"
    ]
  },
  robotArm: {
    label: "Robot Arm",
    basePath: "/assets/Robot Arm",
    type: "robotArm",
    manualDefaults: robotArmManualDefaults
  },
  robotGripper: {
    label: "Robot Gripper",
    basePath: "/assets/Robot Gripper",
    type: "simple",
    manualDefaults: robotGripperManualDefaults,
    defaultOverrides: {
      "Base Plate.glb": 2,
      "Gripper.glb": 2,
      "Link.glb": 2,
      "Pin.glb": 10
    },
    files: [
      "Base Gear.glb",
      "Base Mounting bracket.glb",
      "Base Plate.glb",
      "Gear link 1.glb",
      "Gear link 2.glb",
      "Gripper.glb",
      "Link.glb",
      "Pin.glb"
    ]
  },
  suspension: {
    label: "Suspension",
    basePath: "/assets/Suspension",
    type: "suspension",
    manualDefaults: suspensionManualDefaults
  },
  v4Engine: {
    label: "V4 Engine",
    basePath: "/assets/V4_Engine",
    type: "v4Engine",
    manualDefaults: v4EngineManualDefaults
  }
};
