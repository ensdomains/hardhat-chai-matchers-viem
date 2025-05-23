const isUnnamedArgs = (args: unknown): args is unknown[] => {
  return Array.isArray(args) && args.length > 0;
};

export const formatArgs = (args: unknown) => {
  if (!args || typeof args !== "object") return "";
  if (isUnnamedArgs(args)) return args.map((arg) => `${arg}`).join(", ");
  return Object.entries(args)
    .map(([key, value]) => `${key}=${value.toString()}`)
    .join(", ");
};
