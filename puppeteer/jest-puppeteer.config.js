/**
 * Jest-Puppeteer Configuration for Estopia Testing
 * Optimized for both headless CI/CD and local debugging
 */

module.exports = {
  launch: {
    // Headless mode - can be overridden with HEADLESS=false
    headless: process.env.HEADLESS !== "false",
    
    // Slow down operations for debugging
    slowMo: process.env.SLOWMO ? parseInt(process.env.SLOWMO, 10) : 0,
    
    // Open DevTools when debugging
    devtools: process.env.DEVTOOLS === "true",
    
    // Browser product (chrome or firefox)
    product: "chrome",
    
    // Browser window size
    defaultViewport: {
      width: 1920,
      height: 1080
    },
    
    // Chrome launch arguments
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-web-security",
      "--disable-features=VizDisplayCompositor",
      "--window-size=1920,1080"
    ]
  },
  
  // Browser context options
  browserContext: "default",
  
  // Exit on page error
  exitOnPageError: false,
  
  // Server configuration (disabled - using external server)
  // server: process.env.CI ? undefined : {
  //   command: "echo 'Using existing server at https://sirbu.tplinkdns.com'",
  //   port: 3000,
  //   launchTimeout: 10000,
  //   debug: true
  // }
};