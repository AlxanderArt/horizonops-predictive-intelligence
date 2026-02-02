import React, { useState } from 'react';
import { Save, RotateCcw, AlertTriangle, Info, Bell, Database, Cpu, Shield, CheckCircle } from 'lucide-react';

type ParameterSection = {
  id: string;
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  params: Parameter[];
};

type Parameter = {
  id: string;
  label: string;
  description: string;
  type: 'number' | 'text' | 'toggle' | 'select';
  value: number | string | boolean;
  options?: string[];
  min?: number;
  max?: number;
  unit?: string;
};

const PARAMETER_SECTIONS: ParameterSection[] = [
  {
    id: 'alerts',
    title: 'Alert Thresholds',
    icon: Bell,
    params: [
      { id: 'vib_warn', label: 'Vibration Warning', description: 'Threshold for vibration warning alerts', type: 'number', value: 30, min: 10, max: 100, unit: 'mm/s' },
      { id: 'vib_crit', label: 'Vibration Critical', description: 'Threshold for critical vibration alerts', type: 'number', value: 50, min: 20, max: 100, unit: 'mm/s' },
      { id: 'temp_warn', label: 'Temperature Warning', description: 'Threshold for temperature warning', type: 'number', value: 55, min: 30, max: 80, unit: '°C' },
      { id: 'temp_crit', label: 'Temperature Critical', description: 'Threshold for critical temperature', type: 'number', value: 65, min: 40, max: 90, unit: '°C' },
      { id: 'kurtosis_thresh', label: 'Kurtosis Threshold', description: 'Bearing health indicator threshold', type: 'number', value: 4.5, min: 3, max: 10, unit: '' },
    ]
  },
  {
    id: 'model',
    title: 'ML Model Settings',
    icon: Cpu,
    params: [
      { id: 'prediction_window', label: 'Prediction Window', description: 'Hours ahead for failure prediction', type: 'number', value: 72, min: 24, max: 168, unit: 'hours' },
      { id: 'confidence_thresh', label: 'Confidence Threshold', description: 'Minimum confidence for alerts', type: 'number', value: 0.75, min: 0.5, max: 0.99, unit: '' },
      { id: 'model_version', label: 'Model Version', description: 'Active prediction model', type: 'select', value: 'v1.2.0', options: ['v1.0.0', 'v1.1.0', 'v1.2.0', 'v2.0.0-beta'] },
      { id: 'retrain_enabled', label: 'Auto Retrain', description: 'Enable automatic model retraining', type: 'toggle', value: true },
    ]
  },
  {
    id: 'data',
    title: 'Data Collection',
    icon: Database,
    params: [
      { id: 'sample_rate', label: 'Telemetry Sample Rate', description: 'Sensor data collection frequency', type: 'select', value: '1Hz', options: ['0.1Hz', '1Hz', '10Hz', '100Hz'] },
      { id: 'retention_days', label: 'Data Retention', description: 'Days to retain historical data', type: 'number', value: 90, min: 30, max: 365, unit: 'days' },
      { id: 'batch_size', label: 'Batch Size', description: 'Records per batch upload', type: 'number', value: 1000, min: 100, max: 10000, unit: 'records' },
      { id: 'compression', label: 'Data Compression', description: 'Enable telemetry compression', type: 'toggle', value: true },
    ]
  },
  {
    id: 'security',
    title: 'Security Settings',
    icon: Shield,
    params: [
      { id: 'session_timeout', label: 'Session Timeout', description: 'Auto-logout after inactivity', type: 'number', value: 30, min: 5, max: 120, unit: 'min' },
      { id: 'mfa_required', label: 'Require MFA', description: 'Enforce multi-factor authentication', type: 'toggle', value: true },
      { id: 'api_rate_limit', label: 'API Rate Limit', description: 'Maximum API requests per minute', type: 'number', value: 100, min: 10, max: 1000, unit: '/min' },
      { id: 'audit_logging', label: 'Audit Logging', description: 'Log all user actions', type: 'toggle', value: true },
    ]
  },
];

export function Parameters() {
  const [sections, setSections] = useState(PARAMETER_SECTIONS);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeSection, setActiveSection] = useState('alerts');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const updateParam = (sectionId: string, paramId: string, value: number | string | boolean) => {
    setSections(prev => prev.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          params: section.params.map(param =>
            param.id === paramId ? { ...param, value } : param
          )
        };
      }
      return section;
    }));
    setHasChanges(true);
    setSaveStatus('idle');
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    // Simulate API save
    await new Promise(resolve => setTimeout(resolve, 500));
    setHasChanges(false);
    setSaveStatus('saved');
    // Reset status after 3 seconds
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  const handleReset = () => {
    setSections(PARAMETER_SECTIONS);
    setHasChanges(false);
    setSaveStatus('idle');
  };

  const currentSection = sections.find(s => s.id === activeSection);

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Parameters</h1>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-medium">
            System configuration & thresholds
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:gap-3 self-start">
          {hasChanges && (
            <span className="text-xs text-yellow-500 flex items-center gap-1" role="status">
              <AlertTriangle size={12} aria-hidden="true" />
              Unsaved changes
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="text-xs text-[#3FB950] flex items-center gap-1" role="status" aria-live="polite">
              <CheckCircle size={12} aria-hidden="true" />
              Saved successfully
            </span>
          )}
          <button
            onClick={handleReset}
            className="px-3 md:px-4 py-2 bg-[#151d29] border border-white/10 text-slate-400 text-xs font-bold uppercase tracking-widest rounded hover:text-white transition-all flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4fa3d1]"
            aria-label="Reset all parameters to defaults"
          >
            <RotateCcw size={14} aria-hidden="true" />
            <span className="hidden sm:inline">Reset</span>
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges || saveStatus === 'saving'}
            className="px-3 md:px-4 py-2 bg-[#4fa3d1] text-white text-xs font-bold uppercase tracking-widest rounded hover:bg-[#4389b1] transition-all flex items-center gap-2 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4fa3d1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1320]"
            aria-label={saveStatus === 'saving' ? 'Saving changes...' : 'Save changes'}
          >
            <Save size={14} aria-hidden="true" />
            <span className="hidden sm:inline">{saveStatus === 'saving' ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Section Navigation */}
        <nav className="command-card p-3 md:p-4" aria-label="Parameter categories">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 md:mb-4 px-2">Categories</h3>
          <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 md:gap-3 px-3 py-2 md:py-2.5 rounded text-xs md:text-sm transition-all whitespace-nowrap lg:w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4fa3d1] ${
                    activeSection === section.id
                      ? 'bg-[#4fa3d1]/10 text-[#4fa3d1] lg:border-l-2 lg:border-[#4fa3d1]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                  aria-pressed={activeSection === section.id}
                  aria-label={`${section.title} settings`}
                >
                  <Icon size={16} aria-hidden="true" />
                  <span className="font-medium">{section.title}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Parameter Editor */}
        <div className="lg:col-span-3 command-card p-4 md:p-6">
          {currentSection && (
            <>
              <div className="flex items-center gap-3 mb-4 md:mb-6 pb-3 md:pb-4 border-b border-white/5">
                <currentSection.icon size={20} className="text-[#4fa3d1]" aria-hidden="true" />
                <h2 className="text-base md:text-lg font-bold text-white">{currentSection.title}</h2>
              </div>

              <div className="space-y-4 md:space-y-6">
                {currentSection.params.map((param) => (
                  <div
                    key={param.id}
                    className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-8 pb-4 border-b border-white/5"
                  >
                    <div className="flex-1">
                      <label
                        htmlFor={`param-${param.id}`}
                        className="text-sm font-medium text-white block mb-1"
                      >
                        {param.label}
                      </label>
                      <p className="text-xs text-slate-500">{param.description}</p>
                    </div>
                    <div className="w-full md:w-48 shrink-0">
                      {param.type === 'number' && (
                        <div className="flex items-center gap-2">
                          <input
                            id={`param-${param.id}`}
                            type="number"
                            value={param.value as number}
                            onChange={(e) => updateParam(currentSection.id, param.id, parseFloat(e.target.value))}
                            min={param.min}
                            max={param.max}
                            step={(param.value as number) < 1 ? 0.01 : 1}
                            className="w-full px-3 py-2 bg-[#151d29] border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#4fa3d1] focus:ring-1 focus:ring-[#4fa3d1]"
                            aria-describedby={param.unit ? `${param.id}-unit` : undefined}
                          />
                          {param.unit && (
                            <span id={`${param.id}-unit`} className="text-xs text-slate-500 whitespace-nowrap">
                              {param.unit}
                            </span>
                          )}
                        </div>
                      )}

                      {param.type === 'text' && (
                        <input
                          id={`param-${param.id}`}
                          type="text"
                          value={param.value as string}
                          onChange={(e) => updateParam(currentSection.id, param.id, e.target.value)}
                          className="w-full px-3 py-2 bg-[#151d29] border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#4fa3d1] focus:ring-1 focus:ring-[#4fa3d1]"
                        />
                      )}

                      {param.type === 'select' && (
                        <select
                          id={`param-${param.id}`}
                          value={param.value as string}
                          onChange={(e) => updateParam(currentSection.id, param.id, e.target.value)}
                          className="w-full px-3 py-2 bg-[#151d29] border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#4fa3d1] focus:ring-1 focus:ring-[#4fa3d1]"
                        >
                          {param.options?.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      )}

                      {param.type === 'toggle' && (
                        <button
                          id={`param-${param.id}`}
                          onClick={() => updateParam(currentSection.id, param.id, !(param.value as boolean))}
                          role="switch"
                          aria-checked={param.value as boolean}
                          aria-label={`${param.label}: ${param.value ? 'enabled' : 'disabled'}`}
                          className={`relative w-12 h-6 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4fa3d1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1624] ${
                            param.value ? 'bg-[#4fa3d1]' : 'bg-slate-700'
                          }`}
                        >
                          <div
                            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                              param.value ? 'translate-x-7' : 'translate-x-1'
                            }`}
                            aria-hidden="true"
                          />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div
        className="command-card p-3 md:p-4 border-[#4fa3d1]/20 bg-[#4fa3d1]/5 flex items-start gap-3"
        role="note"
      >
        <Info size={16} className="text-[#4fa3d1] mt-0.5 shrink-0" aria-hidden="true" />
        <div>
          <p className="text-sm text-white font-medium">Configuration Note</p>
          <p className="text-xs text-slate-400 mt-1">
            Changes to alert thresholds take effect immediately. ML model settings may require a model reload.
            Data collection changes will be applied on the next ingestion cycle.
          </p>
        </div>
      </div>
    </div>
  );
}
