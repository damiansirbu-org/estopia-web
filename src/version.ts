// Auto-generated version info - DO NOT EDIT MANUALLY
const getBuildInfo = () => {
  const isDev = import.meta.env.DEV;
  const now = new Date();
  
  return {
    version: '1.0.0',
    buildDate: isDev ? now.toISOString() : '2025-08-10T15:35:38.156Z',
    buildTimestamp: isDev ? now.getTime() : 1754840138157,
    isDev,
    mode: import.meta.env.MODE
  };
};

export const VERSION_INFO = getBuildInfo();

export const getVersionString = (): string => {
  const date = new Date(VERSION_INFO.buildDate);
  const formattedDate = date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  return `Estopia v${VERSION_INFO.version} (${formattedDate})`;
};

export const getShortVersionString = (): string => {
  return `v${VERSION_INFO.version}`;
};