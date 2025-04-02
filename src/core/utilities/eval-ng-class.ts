interface NgClassCondition {
  class: string;
  enabled: boolean;
}

export function evalNgClass(
  classConfig: Record<string, boolean> | NgClassCondition[],
): string {
  if (Array.isArray(classConfig)) {
    return classConfig
      .reduce((acc, curr) => {
        if (curr.enabled) {
          acc.push(curr.class);
        }
        return acc;
      }, [] as string[])
      .join(' ');
  } else {
    return Object.keys(classConfig)
      .reduce((acc, curr) => {
        if (classConfig[curr] === true) {
          acc.push(curr);
        }
        return acc;
      }, [] as string[])
      .join(' ');
  }
}
