export const RECENT_MOCK_DATA = [
  {
    id: 1,
    title: "Drone",
    detail: "원격 제어하거나 자율 비행하는 무인 항공기",
    time: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10분 전
    image: "/src/assets/drone.png",
  },
  {
    id: 2,
    title: "Robot Arm",
    detail: "산업용 자동화 로봇 팔",
    time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2시간 전
    image: "/src/assets/robot.png",
  },
];