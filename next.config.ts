import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false as any,
  /* config options here */
  // Suppress "Cross origin request detected" warnings by allowing local IPs
  allowedDevOrigins: [
    "localhost:3000",
    "127.0.0.1:3000",
    ...(() => {
      const os = require('os');
      try {
        const nets = os.networkInterfaces();
        const results: string[] = [];
        for (const name of Object.keys(nets)) {
          for (const net of nets[name] || []) {
            if (net.family === 'IPv4' && !net.internal) {
              results.push(net.address);
              results.push(`${net.address}:3000`);
              results.push(`http://${net.address}:3000`);
            }
          }
        }
        return results;
      } catch {
        return [];
      }
    })()
  ],
};

export default nextConfig;
