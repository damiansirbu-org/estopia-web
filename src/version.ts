// Auto-generated version info - DO NOT EDIT MANUALLY
export const VERSION_INFO = {
  "version": "1.0.0",
  "buildDate": "2025-08-10T22:45:01.747Z",
  "buildTimestamp": 1754865901747,
  "isDev": false,
  "mode": "production"
} as const;

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