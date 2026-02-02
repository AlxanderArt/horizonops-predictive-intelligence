import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Download, Trash2, Search, Clock } from 'lucide-react';

type LogEntry = {
  id: string;
  timestamp: string;
  level: 'debug' | 'info' | 'warning' | 'error' | 'critical';
  source: string;
  message: string;
  metadata?: Record<string, unknown>;
};

const MOCK_LOGS: LogEntry[] = [
  { id: '1', timestamp: new Date().toISOString(), level: 'info', source: 'SYSTEM', message: 'Telemetry ingestion pipeline healthy' },
  { id: '2', timestamp: new Date(Date.now() - 5000).toISOString(), level: 'debug', source: 'ML-ENGINE', message: 'Model inference completed in 45ms' },
  { id: '3', timestamp: new Date(Date.now() - 10000).toISOString(), level: 'warning', source: 'SENSOR-GW', message: 'CNC-ALPHA-921: Sensor reading delay detected (>100ms)' },
  { id: '4', timestamp: new Date(Date.now() - 15000).toISOString(), level: 'info', source: 'API', message: 'Health check passed for all endpoints' },
  { id: '5', timestamp: new Date(Date.now() - 20000).toISOString(), level: 'error', source: 'DATABASE', message: 'Connection pool exhausted, scaling up' },
  { id: '6', timestamp: new Date(Date.now() - 25000).toISOString(), level: 'info', source: 'SCHEDULER', message: 'Cron job executed: feature_aggregation' },
  { id: '7', timestamp: new Date(Date.now() - 30000).toISOString(), level: 'critical', source: 'ALERT', message: 'Anomaly detected on CNC-BETA-102, prediction confidence 0.92' },
  { id: '8', timestamp: new Date(Date.now() - 35000).toISOString(), level: 'info', source: 'AUTH', message: 'User session refreshed: operator@horizonops.com' },
  { id: '9', timestamp: new Date(Date.now() - 40000).toISOString(), level: 'debug', source: 'CACHE', message: 'Redis cache hit ratio: 94.2%' },
  { id: '10', timestamp: new Date(Date.now() - 45000).toISOString(), level: 'warning', source: 'RESOURCE', message: 'Memory usage approaching threshold (82%)' },
];

export function KernelLogs() {
  const [logs, setLogs] = useState<LogEntry[]>(MOCK_LOGS);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate new logs coming in
    const interval = setInterval(() => {
      const sources = ['SYSTEM', 'ML-ENGINE', 'SENSOR-GW', 'API', 'DATABASE', 'SCHEDULER', 'AUTH', 'CACHE'];
      const levels: LogEntry['level'][] = ['debug', 'info', 'info', 'info', 'warning', 'error'];
      const messages = [
        'Heartbeat check completed',
        'Feature vector computed for CNC-ALPHA-921',
        'WebSocket connection established',
        'Batch prediction completed for 8 machines',
        'Cache invalidation triggered',
        'Metric export to Prometheus successful',
      ];

      const newLog: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        level: levels[Math.floor(Math.random() * levels.length)],
        source: sources[Math.floor(Math.random() * sources.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
      };

      setLogs(prev => [newLog, ...prev].slice(0, 100));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = 0;
    }
  }, [logs, autoScroll]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'debug': return 'text-slate-500 bg-slate-500/10';
      case 'info': return 'text-[#4fa3d1] bg-[#4fa3d1]/10';
      case 'warning': return 'text-yellow-500 bg-yellow-500/10';
      case 'error': return 'text-orange-500 bg-orange-500/10';
      case 'critical': return 'text-red-500 bg-red-500/10';
      default: return 'text-slate-400 bg-slate-500/10';
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesFilter = filter === 'all' || log.level === filter;
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.source.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const logCounts = {
    all: logs.length,
    debug: logs.filter(l => l.level === 'debug').length,
    info: logs.filter(l => l.level === 'info').length,
    warning: logs.filter(l => l.level === 'warning').length,
    error: logs.filter(l => l.level === 'error').length,
    critical: logs.filter(l => l.level === 'critical').length,
  };

  const handleDownload = () => {
    const logText = filteredLogs.map(log =>
      `[${new Date(log.timestamp).toISOString()}] [${log.level.toUpperCase()}] [${log.source}] ${log.message}`
    ).join('\n');

    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kernel-logs-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Kernel Logs</h1>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-medium">
            System event stream • {logs.length} entries
          </p>
        </div>
        <div className="flex items-center gap-2 md:gap-3 self-start">
          <button
            onClick={handleDownload}
            className="p-2 bg-[#151d29] border border-white/10 rounded text-slate-400 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4fa3d1]"
            aria-label="Download logs"
          >
            <Download size={16} aria-hidden="true" />
          </button>
          <button
            onClick={handleClearLogs}
            className="p-2 bg-[#151d29] border border-white/10 rounded text-slate-400 hover:text-red-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4fa3d1]"
            aria-label="Clear all logs"
          >
            <Trash2 size={16} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
        <div className="flex items-center bg-[#151d29] border border-white/10 rounded px-3 py-2 flex-1 max-w-full md:max-w-md">
          <Search size={14} className="text-slate-500 mr-2 shrink-0" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-full text-white focus:ring-0"
            aria-label="Search logs"
          />
        </div>

        <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
          {(['all', 'debug', 'info', 'warning', 'error', 'critical'] as const).map((level) => (
            <button
              key={level}
              onClick={() => setFilter(level)}
              className={`px-2 md:px-3 py-1.5 rounded text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4fa3d1] ${
                filter === level
                  ? level === 'all' ? 'bg-[#4fa3d1] text-white' : getLevelColor(level)
                  : 'bg-white/5 text-slate-500 hover:text-white'
              }`}
              aria-pressed={filter === level}
              aria-label={`Filter by ${level} (${logCounts[level]} logs)`}
            >
              <span className="hidden sm:inline">{level}</span>
              <span className="sm:hidden">{level.slice(0, 3)}</span>
              <span className="ml-1">({logCounts[level]})</span>
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer shrink-0">
          <input
            type="checkbox"
            checked={autoScroll}
            onChange={(e) => setAutoScroll(e.target.checked)}
            className="rounded bg-[#151d29] border-white/20 focus:ring-[#4fa3d1] focus:ring-offset-0"
            aria-describedby="autoscroll-desc"
          />
          <span id="autoscroll-desc">Auto-scroll</span>
        </label>
      </div>

      {/* Log Stream */}
      <div className="command-card p-0 overflow-hidden">
        <div className="bg-[#0d1624] px-3 md:px-4 py-2 md:py-3 border-b border-white/5 flex items-center gap-2">
          <Terminal size={14} className="text-[#4fa3d1]" aria-hidden="true" />
          <span className="text-xs font-bold text-white uppercase tracking-widest">Live Stream</span>
          <div className="ml-auto flex items-center gap-2" role="status" aria-live="polite">
            <div className="w-2 h-2 rounded-full bg-[#3FB950] animate-pulse" aria-hidden="true" />
            <span className="text-[10px] text-slate-500">Connected</span>
          </div>
        </div>

        <div
          ref={logContainerRef}
          className="h-[300px] md:h-[400px] lg:h-[500px] overflow-y-auto font-mono text-[10px] md:text-[11px]"
          role="log"
          aria-label="Kernel log entries"
          aria-live="polite"
        >
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="flex flex-col md:flex-row md:items-start gap-1 md:gap-4 px-3 md:px-4 py-2 border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-2 md:gap-4 shrink-0">
                <span className="text-slate-600 whitespace-nowrap flex items-center gap-1">
                  <Clock size={10} aria-hidden="true" />
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${getLevelColor(log.level)}`}>
                  {log.level}
                </span>
                <span className="text-[#4fa3d1] font-bold whitespace-nowrap">[{log.source}]</span>
              </div>
              <span className="text-slate-400 flex-1 break-all md:break-normal">{log.message}</span>
            </div>
          ))}

          {filteredLogs.length === 0 && (
            <div className="flex items-center justify-center h-full text-slate-600 p-4 text-center">
              {logs.length === 0 ? 'No logs recorded yet' : 'No logs matching current filters'}
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-4" role="region" aria-label="Log statistics">
        <article className="command-card p-3 md:p-4" aria-label={`Debug logs: ${logCounts.debug}`}>
          <div className="text-base md:text-lg font-bold text-slate-400">{logCounts.debug}</div>
          <div className="text-[9px] md:text-[10px] text-slate-600 uppercase">Debug</div>
        </article>
        <article className="command-card p-3 md:p-4" aria-label={`Info logs: ${logCounts.info}`}>
          <div className="text-base md:text-lg font-bold text-[#4fa3d1]">{logCounts.info}</div>
          <div className="text-[9px] md:text-[10px] text-slate-600 uppercase">Info</div>
        </article>
        <article className="command-card p-3 md:p-4" aria-label={`Warning logs: ${logCounts.warning}`}>
          <div className="text-base md:text-lg font-bold text-yellow-500">{logCounts.warning}</div>
          <div className="text-[9px] md:text-[10px] text-slate-600 uppercase">Warning</div>
        </article>
        <article className="command-card p-3 md:p-4 hidden md:block" aria-label={`Error logs: ${logCounts.error}`}>
          <div className="text-lg font-bold text-orange-500">{logCounts.error}</div>
          <div className="text-[10px] text-slate-600 uppercase">Error</div>
        </article>
        <article className="command-card p-3 md:p-4 hidden md:block" aria-label={`Critical logs: ${logCounts.critical}`}>
          <div className="text-lg font-bold text-red-500">{logCounts.critical}</div>
          <div className="text-[10px] text-slate-600 uppercase">Critical</div>
        </article>
      </div>

      {/* Mobile: Error/Critical combined */}
      <div className="grid grid-cols-2 gap-2 md:hidden" role="region" aria-label="Error statistics">
        <article className="command-card p-3" aria-label={`Error logs: ${logCounts.error}`}>
          <div className="text-base font-bold text-orange-500">{logCounts.error}</div>
          <div className="text-[9px] text-slate-600 uppercase">Error</div>
        </article>
        <article className="command-card p-3" aria-label={`Critical logs: ${logCounts.critical}`}>
          <div className="text-base font-bold text-red-500">{logCounts.critical}</div>
          <div className="text-[9px] text-slate-600 uppercase">Critical</div>
        </article>
      </div>
    </div>
  );
}
