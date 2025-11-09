import React, { useState } from "react";
import { AppProvider, useApp } from "./contexts/AppContext";
import { Toaster } from "./components/ui/sonner";

// Auth Pages
import { LoginPage } from "./components/auth/LoginPage";
import { SignUpPage } from "./components/auth/SignUpPage";
import { ForgotPasswordPage } from "./components/auth/ForgotPasswordPage";

// Layout Components
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { MobileNav } from "./components/MobileNav";

// Main Pages
import { DashboardPage } from "./components/dashboard/DashboardPage";
import { EquipmentListPage } from "./components/equipment/EquipmentListPage";
import { EquipmentDetailPage } from "./components/equipment/EquipmentDetailPage";
import { EquipmentFormPage } from "./components/equipment/EquipmentFormPage";
import { DeleteConfirmDialog } from "./components/equipment/DeleteConfirmDialog";
import { RequestFormPage } from "./components/requests/RequestFormPage";
import { MyLoansPage } from "./components/requests/MyLoansPage";
import { RequestsPage } from "./components/requests/RequestsPage";
import { ReturnsPage } from "./components/returns/ReturnsPage";

import { Sheet, SheetContent } from "./components/ui/sheet";

function AppContent() {
  const { currentUser } = useApp();
  const [currentPage, setCurrentPage] = useState("login");
  const [pageData, setPageData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteItem, setDeleteItem] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleNavigate = (page, data) => {
    setCurrentPage(page);
    setPageData(data);
    setMobileMenuOpen(false);

    // Handle delete confirmation
    if (page === "equipment-delete" && data) {
      setDeleteItem(data);
      setShowDeleteDialog(true);
      return;
    }

    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteSuccess = () => {
    setShowDeleteDialog(false);
    setDeleteItem(null);
    handleNavigate("dashboard");
  };

  // Auth Pages
  if (!currentUser) {
    if (currentPage === "signup") {
      return <SignUpPage onNavigate={handleNavigate} />;
    }
    if (currentPage === "forgot-password") {
      return <ForgotPasswordPage onNavigate={handleNavigate} />;
    }
    return <LoginPage onNavigate={handleNavigate} />;
  }

  // Main App Layout
  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return (
          <DashboardPage
            searchQuery={searchQuery}
            onNavigate={handleNavigate}
          />
        );

      case "equipment":
        return (
          <EquipmentListPage onNavigate={handleNavigate} />
        );

      case "equipment-detail":
        return pageData ? (
          <EquipmentDetailPage
            equipment={pageData}
            onNavigate={handleNavigate}
          />
        ) : (
          <DashboardPage
            searchQuery={searchQuery}
            onNavigate={handleNavigate}
          />
        );

      case "equipment-add":
        return (
          <EquipmentFormPage onNavigate={handleNavigate} />
        );

      case "equipment-edit":
        return pageData ? (
          <EquipmentFormPage
            equipment={pageData}
            onNavigate={handleNavigate}
          />
        ) : (
          <DashboardPage
            searchQuery={searchQuery}
            onNavigate={handleNavigate}
          />
        );

      case "request-form":
        return pageData ? (
          <RequestFormPage
            equipment={pageData}
            onNavigate={handleNavigate}
          />
        ) : (
          <DashboardPage
            searchQuery={searchQuery}
            onNavigate={handleNavigate}
          />
        );

      case "my-loans":
        return <MyLoansPage onNavigate={handleNavigate} />;

      case "requests":
        return <RequestsPage onNavigate={handleNavigate} />;

      case "returns":
        return <ReturnsPage onNavigate={handleNavigate} />;

      case "settings":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-gray-900 mb-2">Settings</h1>
              <p className="text-gray-600">
                Manage your account and preferences
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <p className="text-gray-500">
                Settings page coming soon...
              </p>
            </div>
          </div>
        );

      case "reports":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-gray-900 mb-2">Reports</h1>
              <p className="text-gray-600">
                View analytics and generate reports
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <p className="text-gray-500">
                Reports page coming soon...
              </p>
            </div>
          </div>
        );

      default:
        return (
          <DashboardPage
            searchQuery={searchQuery}
            onNavigate={handleNavigate}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          collapsed={sidebarCollapsed}
        />
      </div>

      {/* Mobile Sidebar */}
      <Sheet
        open={mobileMenuOpen}
        onOpenChange={setMobileMenuOpen}
      >
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar
            currentPage={currentPage}
            onNavigate={handleNavigate}
          />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          onSearch={setSearchQuery}
          onMenuToggle={() => setMobileMenuOpen(true)}
          showMenuButton
        />

        <main className="flex-1 p-4 lg:p-8 pb-24 lg:pb-8">
          {renderPage()}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <MobileNav
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onMenuOpen={() => setMobileMenuOpen(true)}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        equipment={deleteItem}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onSuccess={handleDeleteSuccess}
      />

      {/* Toast Notifications */}
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
