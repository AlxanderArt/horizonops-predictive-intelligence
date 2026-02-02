import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { CommandConsole } from './pages/CommandConsole';
import { LiveTelemetry } from './pages/LiveTelemetry';
import { SecurityCore } from './pages/SecurityCore';
import { FleetNetwork } from './pages/FleetNetwork';
import { KernelLogs } from './pages/KernelLogs';
import { Parameters } from './pages/Parameters';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<CommandConsole />} />
            <Route path="telemetry" element={<LiveTelemetry />} />
            <Route path="security" element={<SecurityCore />} />
            <Route path="fleet" element={<FleetNetwork />} />
            <Route path="logs" element={<KernelLogs />} />
            <Route path="parameters" element={<Parameters />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
