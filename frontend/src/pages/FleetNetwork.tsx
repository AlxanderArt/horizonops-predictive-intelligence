import React, { useState, useEffect } from 'react';
import { Globe, Server, AlertCircle, MapPin, RefreshCw, Loader2, AlertTriangle } from 'lucide-react';
import { API_BASE } from '../config';

type MachineStatus = {
  machine_id: string;
  health_score: number;
  status: string;
  location: string;
  last_alert: string | null;
};

type FleetSummary = {
  total_machines: number;
  optimal: number;
  good: number;
  moderate: number;
  degraded: number;
  critical: number;
  average_health: number;
};

export function FleetNetwork() {
  const [machines, setMachines] = useState<MachineStatus[]>([]);
  const [summary, setSummary] = useState<FleetSummary | null>(null);
  const [selectedMachine, setSelectedMachine] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFleetHealth();
    const interval = setInterval(fetchFleetHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchFleetHealth = async () => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE}/health/fleet`);

      if (!response.ok) {
        throw new Error(`Failed to fetch fleet data (${response.status})`);
      }

      const data = await response.json();
      setMachines(data.machines || []);
      setSummary(data.summary);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch fleet health';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'bg-emerald-500';
      case 'good': return 'bg-[#3FB950]';
      case 'moderate': return 'bg-yellow-500';
      case 'degraded': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'optimal': return 'border-emerald-500/20 bg-emerald-500/5';
      case 'good': return 'border-[#3FB950]/20 bg-[#3FB950]/5';
      case 'moderate': return 'border-yellow-500/20 bg-yellow-500/5';
      case 'degraded': return 'border-orange-500/20 bg-orange-500/5';
      case 'critical': return 'border-red-500/20 bg-red-500/5';
      default: return 'border-slate-500/20 bg-slate-500/5';
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Fleet Network</h1>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-medium">
            {summary?.total_machines || 0} assets online
          </p>
        </div>
        <button
          onClick={fetchFleetHealth}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 md:px-4 py-2 bg-[#4fa3d1] text-white text-xs font-bold uppercase tracking-widest rounded hover:bg-[#4389b1] transition-all disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#4fa3d1] self-start"
          aria-label="Refresh fleet data"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} aria-hidden="true" />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-center gap-3" role="alert">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" aria-hidden="true" />
          <div className="flex-1">
            <p className="text-red-400 text-sm font-medium">{error}</p>
          </div>
          <button
            onClick={fetchFleetHealth}
            className="text-red-400 hover:text-red-300 text-sm font-medium underline focus:outline-none"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && !error && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-[#4fa3d1] animate-spin" aria-hidden="true" />
          <span className="ml-3 text-slate-400">Loading fleet data...</span>
        </div>
      )}

      {/* Content */}
      {!isLoading && !error && (
        <>
          {/* Fleet Summary */}
          {summary && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 md:gap-4">
              <SummaryCard label="Total Fleet" value={summary.total_machines} />
              <SummaryCard label="Optimal" value={summary.optimal} color="text-emerald-500" />
              <SummaryCard label="Good" value={summary.good} color="text-[#3FB950]" />
              <SummaryCard label="Moderate" value={summary.moderate} color="text-yellow-500" />
              <SummaryCard label="Degraded" value={summary.degraded} color="text-orange-500" />
              <SummaryCard label="Critical" value={summary.critical} color="text-red-500" />
              <SummaryCard
                label="Avg Health"
                value={`${summary.average_health.toFixed(1)}%`}
                color="text-[#4fa3d1]"
                highlight
              />
            </div>
          )}

          {/* Empty State */}
          {machines.length === 0 && (
            <div className="command-card p-8 text-center">
              <Server className="w-12 h-12 text-slate-600 mx-auto mb-4" aria-hidden="true" />
              <p className="text-slate-400 text-sm">No machines found in the fleet.</p>
              <p className="text-slate-500 text-xs mt-1">Machines will appear as they connect to the network.</p>
            </div>
          )}

          {/* Machine Grid */}
          {machines.length > 0 && (
            <div className="command-card p-4 md:p-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-4 md:mb-6">Fleet Status Grid</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                {machines.map((machine) => (
                  <button
                    key={machine.machine_id}
                    onClick={() => setSelectedMachine(machine.machine_id === selectedMachine ? null : machine.machine_id)}
                    className={`p-3 md:p-4 rounded border text-left transition-all hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4fa3d1] ${
                      selectedMachine === machine.machine_id
                        ? 'border-[#4fa3d1] bg-[#4fa3d1]/10 ring-1 ring-[#4fa3d1]'
                        : getStatusBg(machine.status)
                    }`}
                    aria-pressed={selectedMachine === machine.machine_id}
                    aria-label={`${machine.machine_id}, health ${machine.health_score.toFixed(0)}%, status ${machine.status}`}
                  >
                    <div className="flex items-center justify-between mb-2 md:mb-3">
                      <Server size={18} className="text-slate-400" aria-hidden="true" />
                      <div
                        className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full ${getStatusColor(machine.status)}`}
                        aria-hidden="true"
                      />
                    </div>
                    <div className="text-sm font-bold text-white mb-1 truncate">{machine.machine_id}</div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2 md:mb-3">
                      <MapPin size={10} aria-hidden="true" />
                      <span className="truncate">{machine.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-lg md:text-xl font-bold text-white">{machine.health_score.toFixed(0)}%</div>
                      <span className={`text-xs px-2 py-0.5 rounded font-bold uppercase ${
                        machine.status === 'optimal' || machine.status === 'good'
                          ? 'bg-[#3FB950]/20 text-[#3FB950]'
                          : machine.status === 'moderate'
                          ? 'bg-yellow-500/20 text-yellow-500'
                          : 'bg-red-500/20 text-red-500'
                      }`}>
                        {machine.status}
                      </span>
                    </div>
                    {machine.last_alert && (
                      <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-white/5 flex items-center gap-2 text-xs text-orange-500">
                        <AlertCircle size={12} aria-hidden="true" />
                        <span>Alert active</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Network Topology & Connection Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <div className="command-card p-4 md:p-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-4 md:mb-6">Network Topology</h3>
              <div className="h-[200px] md:h-[250px] lg:h-[300px] flex items-center justify-center border border-dashed border-white/10 rounded">
                <div className="text-center px-4">
                  <Globe size={40} className="text-slate-600 mx-auto mb-3 md:mb-4" aria-hidden="true" />
                  <p className="text-sm text-slate-500">Network topology visualization</p>
                  <p className="text-xs text-slate-600 mt-1">Industrial ethernet connected</p>
                </div>
              </div>
            </div>

            <div className="command-card p-4 md:p-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-4 md:mb-6">Connection Status</h3>
              <div className="space-y-3 md:space-y-4">
                <ConnectionStatus label="Primary Gateway" ip="192.168.1.1" latency="2ms" status="connected" />
                <ConnectionStatus label="Backup Gateway" ip="192.168.1.2" latency="4ms" status="standby" />
                <ConnectionStatus label="SCADA Server" ip="192.168.10.50" latency="8ms" status="connected" />
                <ConnectionStatus label="Historian DB" ip="192.168.10.100" latency="12ms" status="connected" />
                <ConnectionStatus label="Cloud Sync" ip="cloud.horizonops.io" latency="45ms" status="connected" />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  color = 'text-white',
  highlight = false
}: {
  label: string;
  value: number | string;
  color?: string;
  highlight?: boolean;
}) {
  return (
    <article
      className={`command-card p-3 md:p-4 ${highlight ? 'border-[#4fa3d1]/20 bg-[#4fa3d1]/5' : ''}`}
      aria-label={`${label}: ${value}`}
    >
      <div className={`text-xl md:text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-slate-500 uppercase tracking-widest">{label}</div>
    </article>
  );
}

function ConnectionStatus({
  label,
  ip,
  latency,
  status
}: {
  label: string;
  ip: string;
  latency: string;
  status: 'connected' | 'standby' | 'disconnected';
}) {
  return (
    <div className="flex items-center justify-between py-2 md:py-3 border-b border-white/5">
      <div className="flex items-center gap-2 md:gap-3 min-w-0">
        <div
          className={`w-2 h-2 rounded-full shrink-0 ${
            status === 'connected' ? 'bg-[#3FB950]' :
            status === 'standby' ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          aria-hidden="true"
        />
        <div className="min-w-0">
          <div className="text-sm text-white font-medium truncate">{label}</div>
          <div className="text-xs text-slate-500 font-mono truncate">{ip}</div>
        </div>
      </div>
      <div className="text-right shrink-0 ml-2">
        <div className="text-sm text-white font-medium">{latency}</div>
        <div className={`text-xs font-bold uppercase ${
          status === 'connected' ? 'text-[#3FB950]' :
          status === 'standby' ? 'text-yellow-500' : 'text-red-500'
        }`}>
          {status}
        </div>
      </div>
    </div>
  );
}
