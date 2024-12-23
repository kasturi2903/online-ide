// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
// });
// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   base: '/',
//   plugins: [react()],
//   server: {
//     port: 3000,
//   },
//   build: {
//     outDir: 'build',
//   },
// });
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Base URL for your app; modify if deploying to a subdirectory
  base: '/',
  
  // Plugins for Vite
  plugins: [react()],
  
  // Development server configuration
  server: {
    port: 3000, // Change port if needed
    host: '0.0.0.0', // Allow LAN access for testing on other devices
  },
  
  // Build options
  build: {
    outDir: 'build', // Directory for production build output
  },
  
  // Resolve configuration for aliases
  resolve: {
    alias: {
      '@components': '/src/components', // Simplify imports for components
      '@utils': '/src/utils', // Simplify imports for utility functions
    },
  },
  
  // Dependency optimization
  optimizeDeps: {
    include: ['xterm', 'socket.io-client'], // Pre-bundle these dependencies
  },
});
