import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      "nav.dashboard": "Dashboard",
      "nav.assets": "Assets", 
      "nav.clients": "Clients",
      "nav.contracts": "Contracts",
      "nav.payments": "Payments",
      "nav.settings": "Settings",
      "nav.help": "Help",
      
      // Common
      "common.save": "Save",
      "common.cancel": "Cancel",
      "common.delete": "Delete",
      "common.edit": "Edit",
      "common.add": "Add",
      "common.search": "Search",
      "common.filter": "Filter",
      "common.export": "Export",
      "common.active": "Active",
      "common.inactive": "Inactive",
      "common.loading": "Loading...",
      
      // Buttons
      "button.search": "Search",
      "button.reset": "Reset",
      
      // Settings
      "settings.title": "Application Settings",
      "settings.description": "Configure your application preferences. Changes are automatically saved.",
      "settings.interface": "Interface & Display",
      "settings.language": "Language",
      "settings.data": "Data & Export", 
      "settings.notifications": "Notifications",
      "settings.system": "System",
      
      // Interface Settings
      "settings.theme.title": "Application Theme",
      "settings.theme.description": "Choose the overall color scheme and styling for the entire application.",
      "settings.table.title": "Table Style", 
      "settings.table.description": "Adjust the spacing and borders for all tables in the application.",
      "settings.table.compact": "Compact Table",
      "settings.table.comfortable": "Comfortable Table",
      "settings.table.spacious": "Spacious Table",
      "settings.dateFormat.title": "Date & Currency Format",
      "settings.dateFormat.label": "Date Format",
      "settings.currency.label": "Currency",
      "settings.preview.title": "Preview",
      "settings.preview.description": "See how your selected theme and table style will look.",
      
      // Language Settings
      "settings.language.title": "Language Settings",
      "settings.language.description": "Select your preferred language for the application interface.",
      "settings.language.interface": "Interface Language",
      "settings.language.regional": "Regional Settings",
      "settings.language.note": "Note: Language changes require a page refresh to take full effect.",
      
      // Data Settings
      "settings.export.title": "Export Settings",
      "settings.export.format": "Default Export Format",
      "settings.pagination.title": "Pagination Settings", 
      "settings.pagination.pageSize": "Default Page Size",
      "settings.refresh.title": "Data Refresh",
      "settings.refresh.interval": "Auto-refresh Interval (seconds)",
      
      // Notification Settings
      "settings.emailNotifications.title": "Email Notifications",
      "settings.emailNotifications.description": "Configure when you want to receive email notifications.",
      "settings.emailNotifications.updates": "Email notifications for important updates",
      "settings.systemAlerts.title": "System Alerts",
      "settings.systemAlerts.description": "Control in-app notifications and alerts.",
      "settings.systemAlerts.warnings": "Show system alerts and warnings",
      
      // System Settings
      "settings.session.title": "Session Settings",
      "settings.session.timeout": "Session Timeout (minutes)",
      "settings.autoSave.title": "Auto-Save",
      "settings.autoSave.description": "Configure automatic saving behavior for forms and data entry.",
      "settings.autoSave.enable": "Enable auto-save for forms",
      
      // Help Modal
      "help.title": "Keyboard Shortcuts & Help",
      "help.entityManagement": "Entity Management",
      "help.navigation": "Navigation",
      "help.usageNotes": "Usage Notes",
      "help.interfaceTips": "Interface Tips",
      "help.version": "Version Information",
      "help.addRecord": "Add new record",
      "help.deleteRecord": "Delete record",
      "help.saveChanges": "Save changes / Confirm action",
      "help.cancelEditing": "Cancel editing",
      "help.editRecord": "Edit record",
      "help.doubleClick": "Double-click on any row",
      
      // Status and labels
      "status.version": "Version",
      "status.build": "Build", 
      "status.time": "Time",
      "status.mode": "Mode",
      "status.development": "Development",
      "status.production": "Production",
      
      // Table columns
      "table.name": "Name",
      "table.nationalId": "National ID (CNP)",
      "table.email": "Email",
      "table.phoneNumber": "Phone Number",
      "table.address": "Address", 
      "table.type": "Type",
      "table.rooms": "Rooms",
      "table.bathrooms": "Bathrooms",
      "table.surface": "Surface (m²)",
      "table.floor": "Floor",
      "table.built": "Built",
      "table.description": "Description",
      "table.client": "Client",
      "table.asset": "Asset", 
      "table.startDate": "Start Date",
      "table.endDate": "End Date",
      "table.rentAmount": "Rent Amount",
      "table.investment": "Investment Amount",
      "table.deposit": "Deposit Amount",
      "table.active": "Active",
      "table.notes": "Notes",
      "table.dueDate": "Due Date",
      "table.maintenance": "Maintenance",
      "table.naturalGas": "Natural Gas", 
      "table.electricity": "Electricity",
      "table.water": "Water",
      "table.other": "Other",
      "table.total": "Total",
      "table.paid": "Paid Amount",
      "table.remaining": "Remaining",
      "table.isPaid": "Is Paid",
      "table.paymentDate": "Payment Date",
      
      // Terminal messages
      "terminal.noMessages": "No messages yet",
      
      // Dashboard
      "dashboard.placeholder": "To be implemented",
      
      // Login & Auth
      "auth.login": "Login",
      "auth.logout": "Logout", 
      "auth.loginToEstopia": "Login to Estopia",
      "login.username": "Username",
      "login.password": "Password",
      "login.usernameRequired": "Please enter your username",
      "login.passwordRequired": "Please enter your password",
      "login.usernamePlaceholder": "Enter your username",
      "login.passwordPlaceholder": "Enter your password",
      "login.signIn": "Sign In",
      "login.forgotPassword": "Contact admin for password reset",
      "role.admin": "Administrator",
      "role.user": "User",
      "nav.users": "Users"
    }
  },
  ro: {
    translation: {
      // Navigation
      "nav.dashboard": "Tablou",
      "nav.assets": "Active",
      "nav.clients": "Clienți", 
      "nav.contracts": "Contracte",
      "nav.payments": "Plăți",
      "nav.settings": "Setări",
      "nav.help": "Ajutor",
      
      // Common
      "common.save": "Salvează",
      "common.cancel": "Anulează",
      "common.delete": "Șterge", 
      "common.edit": "Editează",
      "common.add": "Adaugă",
      "common.search": "Caută",
      "common.filter": "Filtru",
      "common.export": "Exportă",
      "common.active": "Activ",
      "common.inactive": "Inactiv",
      "common.loading": "Se încarcă...",
      
      // Buttons
      "button.search": "Caută",
      "button.reset": "Resetează",
      
      // Settings
      "settings.title": "Setări Aplicație",
      "settings.description": "Configurați preferințele aplicației. Modificările sunt salvate automat.",
      "settings.interface": "Interfață și Afișare",
      "settings.language": "Limbă",
      "settings.data": "Date și Export",
      "settings.notifications": "Notificări", 
      "settings.system": "Sistem",
      
      // Interface Settings
      "settings.theme.title": "Tema Aplicației",
      "settings.theme.description": "Alegeți schema de culori și stilul pentru întreaga aplicație.",
      "settings.table.title": "Stilul Tabelelor",
      "settings.table.description": "Ajustați spațierea și marginile pentru toate tabelele din aplicație.",
      "settings.table.compact": "Tabel Compact",
      "settings.table.comfortable": "Tabel Confortabil", 
      "settings.table.spacious": "Tabel Spațios",
      "settings.dateFormat.title": "Format Dată și Monedă",
      "settings.dateFormat.label": "Format Dată",
      "settings.currency.label": "Monedă",
      "settings.preview.title": "Previzualizare",
      "settings.preview.description": "Vedeți cum vor arăta tema și stilul tabelelor selectate.",
      
      // Language Settings  
      "settings.language.title": "Setări Limbă",
      "settings.language.description": "Selectați limba preferată pentru interfața aplicației.",
      "settings.language.interface": "Limba Interfață",
      "settings.language.regional": "Setări Regionale",
      "settings.language.note": "Notă: Modificările de limbă necesită o reîmprospătare a paginii pentru a avea efect complet.",
      
      // Data Settings
      "settings.export.title": "Setări Export",
      "settings.export.format": "Format Export Implicit",
      "settings.pagination.title": "Setări Paginare",
      "settings.pagination.pageSize": "Dimensiune Pagină Implicită", 
      "settings.refresh.title": "Actualizare Date",
      "settings.refresh.interval": "Interval Auto-actualizare (secunde)",
      
      // Notification Settings
      "settings.emailNotifications.title": "Notificări Email",
      "settings.emailNotifications.description": "Configurați când doriți să primiți notificări prin email.",
      "settings.emailNotifications.updates": "Notificări email pentru actualizări importante",
      "settings.systemAlerts.title": "Alerte Sistem",
      "settings.systemAlerts.description": "Controlați notificările și alertele din aplicație.",
      "settings.systemAlerts.warnings": "Afișați alertele și avertismentele de sistem",
      
      // System Settings
      "settings.session.title": "Setări Sesiune",
      "settings.session.timeout": "Expirare Sesiune (minute)",
      "settings.autoSave.title": "Auto-Salvare", 
      "settings.autoSave.description": "Configurați comportamentul de salvare automată pentru formulare și introducerea datelor.",
      "settings.autoSave.enable": "Activați auto-salvarea pentru formulare",
      
      // Help Modal
      "help.title": "Scurtături Tastatură și Ajutor",
      "help.entityManagement": "Gestionarea Entităților",
      "help.navigation": "Navigare",
      "help.usageNotes": "Note de Utilizare",
      "help.interfaceTips": "Sfaturi Interfață",
      "help.version": "Informații Versiune",
      "help.addRecord": "Adaugă înregistrare nouă",
      "help.deleteRecord": "Șterge înregistrarea",
      "help.saveChanges": "Salvează modificările / Confirmă acțiunea",
      "help.cancelEditing": "Anulează editarea", 
      "help.editRecord": "Editează înregistrarea",
      "help.doubleClick": "Dublu-clic pe orice rând",
      
      // Status and labels
      "status.version": "Versiune",
      "status.build": "Build",
      "status.time": "Ora", 
      "status.mode": "Mod",
      "status.development": "Dezvoltare",
      "status.production": "Producție",
      
      // Table columns
      "table.name": "Nume",
      "table.nationalId": "CNP",
      "table.email": "Email",
      "table.phoneNumber": "Telefon",
      "table.address": "Adresă", 
      "table.type": "Tip",
      "table.rooms": "Camere",
      "table.bathrooms": "Băi",
      "table.surface": "Suprafață (m²)",
      "table.floor": "Etaj",
      "table.built": "Construit",
      "table.description": "Descriere",
      "table.client": "Client",
      "table.asset": "Proprietate",
      "table.startDate": "Data început",
      "table.endDate": "Data sfârșit", 
      "table.rentAmount": "Suma chirie",
      "table.investment": "Suma investiție",
      "table.deposit": "Suma depozit",
      "table.active": "Activ",
      "table.notes": "Note",
      "table.dueDate": "Data scadență",
      "table.maintenance": "Întreținere",
      "table.naturalGas": "Gaze naturale",
      "table.electricity": "Electricitate",
      "table.water": "Apă",
      "table.other": "Altele",
      "table.total": "Total",
      "table.paid": "Suma plătită",
      "table.remaining": "Rămas",
      "table.isPaid": "Plătit",
      "table.paymentDate": "Data plății",
      
      // Terminal messages
      "terminal.noMessages": "Niciun mesaj încă",
      
      // Dashboard
      "dashboard.placeholder": "În curs de implementare"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    debug: true, // Enable debug mode to see what's happening
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false // Disable suspense to prevent render delays
    }
  });

export default i18n;