import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Scanner from "./components/Scanner";
import Inventory from "./components/Inventory";
import Alerts from "./components/Alerts";
import Settings from "./components/Settings";
import ProtectedLayout from "./utils/ProtectedLayout";
import Landing from "./components/landing/Landing";

/**
 * Point d'entrée de l'application.
 * - "/" est la page d'accueil marketing (publique).
 * - "/login" est public.
 * - Les pages de l'app partagent ProtectedLayout (garde + barre de nav).
 */

export default function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pages publiques */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Pages protégées : garde d'auth + navigation communes */}
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/scan" element={<Scanner />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Inconnu -> accueil */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
