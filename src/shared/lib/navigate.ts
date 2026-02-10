let navigateFunction: ((to: string) => void) | null = null;

export const setNavigateFunction = (navigate: (to: string) => void) => {
  navigateFunction = navigate;
};

export const navigate = (to: string) => {
  if (navigateFunction) {
    navigateFunction(to);
  } else {
    console.error("navigateFunction not initialized.");
  }
};
