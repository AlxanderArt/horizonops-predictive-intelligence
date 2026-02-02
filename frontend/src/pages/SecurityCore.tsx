import React, { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Key,
  Eye,
  Activity,
  Clock,
  User
} from 'lucide-react';

type SecurityEvent = {
  id: string;
  timestamp: string;
  type: 'access' | 'alert' | 'audit' | 'config';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  user?: string;
  resolved: boolean;
};

export function SecurityCore() {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [securityScore, setSecurityScore] = useState(94);
  const [activeThreats, setActiveThreats] = useState(0);

  useEffect(() => {
    // Simulate security events
    const mockEvents: SecurityEvent[] = [
      { id: '1', timestamp: new Date().toISOString(), type: 'access', severity: 'low', message: 'User login: operator@horizonops.com', user: 'operator', resolved: true },
      { id: '2', timestamp: new Date(Date.now() - 300000).toISOString(), type: 'audit', severity: 'low', message: 'Configuration backup completed', resolved: true },
      { id: '3', timestamp: new Date(Date.now() - 600000).toISOString(), type: 'alert', severity: 'medium', message: 'Multiple failed login attempts detected', user: 'unknown', resolved: false },
      { id: '4', timestamp: new Date(Date.now() - 900000).toISOString(), type: 'config', severity: 'low', message: 'Firewall rules updated', user: 'admin', resolved: true },
      { id: '5', timestamp: new Date(Date.now() - 1200000).toISOString(), type: 'access', severity: 'low', message: 'API key rotation completed', resolved: true },
      { id: '6', timestamp: new Date(Date.now() - 1800000).toISOString(), type: 'alert', severity: 'high', message: 'Unusual network traffic pattern detected', resolved: false },
    ];
    setEvents(mockEvents);
    setActiveThreats(mockEvents.filter(e => !e.resolved && e.severity !== 'low').length);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'access': return User;
      case 'alert': return AlertTriangle;
      case 'audit': return Eye;
      case 'config': return Key;
      default: return Activity;
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Security Core</h1>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-medium">
            System security monitoring
          </p>
        </div>
        <div
          className={`px-3 md:px-4 py-2 rounded border flex items-center gap-2 md:gap-3 self-start ${
            activeThreats === 0
              ? 'border-[#3FB950]/20 bg-[#3FB950]/5 text-[#3FB950]'
              : 'border-orange-500/20 bg-orange-500/5 text-orange-500'
          }`}
          role="status"
          aria-live="polite"
        >
          <Shield size={16} aria-hidden="true" />
          <span className="text-xs font-bold uppercase tracking-widest">
            {activeThreats === 0 ? 'SECURE' : `${activeThreats} THREATS`}
          </span>
        </div>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <article className="command-card p-4 md:p-6" aria-label={`Security Score: ${securityScore}%`}>
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <Shield size={20} className="text-[#4fa3d1]" aria-hidden="true" />
            <span className="text-xs px-2 py-1 bg-[#3FB950]/10 text-[#3FB950] rounded font-bold">HEALTHY</span>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-white">{securityScore}%</div>
          <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Security Score</div>
        </article>

        <article className="command-card p-4 md:p-6" aria-label="Encryption Level: 256-bit">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <Lock size={20} className="text-[#4fa3d1]" aria-hidden="true" />
          </div>
          <div className="text-2xl md:text-3xl font-bold text-white">256-bit</div>
          <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Encryption</div>
        </article>

        <article className="command-card p-4 md:p-6" aria-label="Active Sessions: 12">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <Key size={20} className="text-[#4fa3d1]" aria-hidden="true" />
          </div>
          <div className="text-2xl md:text-3xl font-bold text-white">12</div>
          <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Sessions</div>
        </article>

        <article className="command-card p-4 md:p-6" aria-label={`Active Threats: ${activeThreats}`}>
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <AlertTriangle size={20} className={activeThreats > 0 ? 'text-orange-500' : 'text-[#3FB950]'} aria-hidden="true" />
          </div>
          <div className={`text-2xl md:text-3xl font-bold ${activeThreats > 0 ? 'text-orange-500' : 'text-[#3FB950]'}`}>
            {activeThreats}
          </div>
          <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Threats</div>
        </article>
      </div>

      {/* Security Event Log & Policies */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 command-card p-4 md:p-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-4 md:mb-6">Security Event Log</h3>
          <div
            className="space-y-2 md:space-y-3 max-h-[300px] md:max-h-[400px] overflow-y-auto"
            role="log"
            aria-label="Security events"
          >
            {events.length === 0 && (
              <p className="text-slate-500 text-sm italic py-4 text-center">No security events to display.</p>
            )}
            {events.map((event) => {
              const Icon = getTypeIcon(event.type);
              return (
                <div
                  key={event.id}
                  className="flex items-start gap-3 md:gap-4 p-2 md:p-3 bg-white/[0.02] rounded border border-white/5 hover:bg-white/[0.04] transition-colors"
                >
                  <div className={`p-1.5 md:p-2 rounded shrink-0 ${getSeverityColor(event.severity)}`}>
                    <Icon size={14} aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm text-white font-medium break-all">{event.message}</span>
                      {!event.resolved && (
                        <span className="text-xs px-1.5 py-0.5 bg-orange-500/20 text-orange-500 rounded font-bold uppercase shrink-0">
                          Unresolved
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock size={10} aria-hidden="true" />
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </span>
                      {event.user && (
                        <span className="flex items-center gap-1">
                          <User size={10} aria-hidden="true" />
                          {event.user}
                        </span>
                      )}
                      <span className={`uppercase font-bold ${getSeverityColor(event.severity).split(' ')[0]}`}>
                        {event.severity}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center shrink-0">
                    {event.resolved ? (
                      <CheckCircle size={16} className="text-[#3FB950]" aria-label="Resolved" />
                    ) : (
                      <XCircle size={16} className="text-slate-600" aria-label="Unresolved" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="command-card p-4 md:p-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-4 md:mb-6">Access Policies</h3>
          <div className="space-y-3 md:space-y-4">
            <PolicyItem label="MFA Required" status="enabled" />
            <PolicyItem label="Session Timeout" status="30 min" />
            <PolicyItem label="IP Whitelist" status="enabled" />
            <PolicyItem label="Rate Limiting" status="100/min" />
            <PolicyItem label="Audit Logging" status="enabled" />
            <PolicyItem label="Encryption" status="AES-256" />
          </div>
        </div>
      </div>

      {/* Network Security */}
      <div className="command-card p-4 md:p-6">
        <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-4 md:mb-6">Network Security Status</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <NetworkStatus label="Firewall" status="active" value="2,341 blocked" />
          <NetworkStatus label="IDS/IPS" status="active" value="0 intrusions" />
          <NetworkStatus label="VPN Gateway" status="active" value="8 tunnels" />
          <NetworkStatus label="SSL/TLS" status="active" value="TLS 1.3" />
        </div>
      </div>
    </div>
  );
}

function PolicyItem({ label, status }: { label: string; status: string }) {
  const isEnabled = status === 'enabled' || status.includes('min') || status.includes('AES');
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5">
      <span className="text-sm text-slate-400">{label}</span>
      <span className={`text-xs font-bold uppercase ${isEnabled ? 'text-[#3FB950]' : 'text-slate-500'}`}>
        {status}
      </span>
    </div>
  );
}

function NetworkStatus({ label, status, value }: { label: string; status: string; value: string }) {
  return (
    <article
      className="bg-white/[0.02] p-3 md:p-4 rounded border border-white/5"
      aria-label={`${label}: ${value}, ${status}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <div
          className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-[#3FB950]' : 'bg-red-500'}`}
          aria-hidden="true"
        />
        <span className="text-xs text-slate-500 uppercase font-bold">{label}</span>
      </div>
      <div className="text-sm font-medium text-white">{value}</div>
    </article>
  );
}
