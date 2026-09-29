import os from 'os';
import { getDBStatus } from '../config/db.js';

export const getTelemetry = async (req, res) => {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const memoryUsagePercent = Math.round((usedMem / totalMem) * 100);

  const cpus = os.cpus();
  const cpuModel = cpus[0]?.model || 'Generic Processor';
  const cpuSpeed = cpus[0]?.speed || 0;
  const cpuCores = cpus.length;

  res.status(200).json({
    success: true,
    telemetry: {
      hostname: os.hostname(),
      platform: os.platform(),
      release: os.release(),
      arch: os.arch(),
      uptimeSeconds: os.uptime(),
      processUptimeSeconds: Math.floor(process.uptime()),
      cpu: {
        model: cpuModel,
        cores: cpuCores,
        speedMHz: cpuSpeed,
      },
      memory: {
        totalGB: (totalMem / (1024 ** 3)).toFixed(1),
        usedGB: (usedMem / (1024 ** 3)).toFixed(1),
        freeGB: (freeMem / (1024 ** 3)).toFixed(1),
        percentUsed: memoryUsagePercent,
      },
      database: {
        status: getDBStatus() ? 'connected' : 'disconnected',
        engine: 'MongoDB',
      },
      timestamp: new Date().toISOString(),
    },
  });
};
