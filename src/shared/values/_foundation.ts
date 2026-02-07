/**
 *
 * 예시:
 *   color: ${colors.text.black};
 *   background-color: ${colors.background.f5};
 */
export const colors = {
  main: {
    normal: "#E7EFDA",
    alternative: "#0D2D1E",
    assistive: "#3D5E3F",
  },

  secondary: {
    normal: "#3D5F3E",
    alternative: "#779B7F",
    assistive: "#B7C9B9",
  },

  text: {
    normal: "#F7F5F2",
    strong: "#70D586",
    neutral: "#7D8A80",
    alternative: "#899F8B",
    alternative2: "#616161",
    disabled: "#D1D1D1",
  },

  line: {
    normal: "#646764",
    neutral: "#3D5F3E",
    alternative: "#104912",
    alternative2: "#464545",
    alternative3: "#202020",
  },

  fill: {
    normal: "#ACACAC",
    neutral: "#7D8A80",
    alternative: "#348B76",
    assistive: "#2C362E",
    alternative2: "#303030",
    alternative3: "#131A13",
    alternative4: "#151515",
  },

  background: {
    Dark: "#080808",
  },

  state: {
    error: "#CC2121",
    info: "#1A74DD",
    success: "#27D272",
    warning: "#D4A42E",
  },
} as const;

export type colors = typeof colors;
