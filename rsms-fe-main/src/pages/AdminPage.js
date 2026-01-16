import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";
import Header from "../components/admin/Header";
import Overview from "../components/admin/Overview";
import UserManagementPage from "../components/admin/UserManagement";
import PatientsManagement from "../components/admin/PatientsManagement";
import PatientForm from "../components/admin/PatientForm";
import RegistrationsView from "../components/admin/RegistrationsView";
import MedicinesManagement from "../components/admin/MedicinesManagement";

const AdminPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="lg:pl-64">
        <Header setSidebarOpen={setSidebarOpen} />

        <main className="py-6 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/patients" element={<PatientsManagement />} />
            <Route path="/patients/new" element={<PatientForm />} />
            <Route path="/patients/edit/:id" element={<PatientForm />} />
            <Route path="/registrations" element={<RegistrationsView />} />
            <Route path="/medicines" element={<MedicinesManagement />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
