import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Plugin to generate version info at build time
const versionPlugin = () => ({
  name: 'version-plugin',
  buildStart() {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
    const versionInfo = {
      version: packageJson.version,
      buildDate: new Date().toISOString(),
      buildTimestamp: Date.now(),
      isDev: false,
      mode: 'production'
    };
    
    const versionContent = `// Auto-generated version info - DO NOT EDIT MANUALLY
export const VERSION_INFO = ${JSON.stringify(versionInfo, null, 2)} as const;

export const getVersionString = (): string => {
  const date = new Date(VERSION_INFO.buildDate);
  const formattedDate = date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  return \`Estopia v\${VERSION_INFO.version} (\${formattedDate})\`;
};

export const getShortVersionString = (): string => {
  return \`v\${VERSION_INFO.version}\`;
};`;

    fs.writeFileSync(path.resolve('src/version.ts'), versionContent);
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), versionPlugin()],
  server: {
    port: 5173,
    host: '0.0.0.0', // Allow external connections
    strictPort: true, // Fail if port is in use instead of trying another
  },
  preview: {
    port: 3000,
    host: '0.0.0.0'
  },
  build: {
    // Ensure assets are properly hashed and served
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        // Consistent asset naming for cache busting
        assetFileNames: 'assets/[name]-[hash].[ext]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js'
      }
    }
  }
})
