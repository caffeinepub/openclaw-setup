export type Language = "en" | "id" | "ar" | "ru" | "zh";

export const LANGUAGES: {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  dir: "ltr" | "rtl";
}[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇬🇧",
    dir: "ltr",
  },
  {
    code: "id",
    name: "Indonesian",
    nativeName: "Bahasa Indonesia",
    flag: "🇮🇩",
    dir: "ltr",
  },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦", dir: "rtl" },
  {
    code: "ru",
    name: "Russian",
    nativeName: "Русский",
    flag: "🇷🇺",
    dir: "ltr",
  },
  {
    code: "zh",
    name: "Chinese",
    nativeName: "中文",
    flag: "🇨🇳",
    dir: "ltr",
  },
];

export type TranslationKey = {
  // Navbar
  nav: {
    home: string;
    features: string;
    pricing: string;
    setup: string;
    config: string;
    docs: string;
    changelog: string;
    integrations: string;
    login: string;
    logout: string;
    connecting: string;
    admin: string;
    lightMode: string;
    darkMode: string;
  };
  // Hero
  hero: {
    badge: string;
    subtitle: string;
    downloads: string;
    downloadNow: string;
    viewDocs: string;
  };
  // Features
  features: {
    sectionLabel: string;
    sectionTitle1: string;
    sectionTitle2: string;
    sectionDesc: string;
    autoDetect: { title: string; desc: string };
    multiPlatform: { title: string; desc: string };
    realtimeConfig: { title: string; desc: string };
    pluginSystem: { title: string; desc: string };
    cloudSync: { title: string; desc: string };
    community: { title: string; desc: string };
    whatsappChatbot: { title: string; desc: string };
    openclawApi: { title: string; desc: string };
  };
  // Pricing
  pricing: {
    sectionLabel: string;
    sectionTitle1: string;
    sectionTitle2: string;
    sectionTitle3: string;
    sectionDesc: string;
    mostPopular: string;
    active: string;
    activeLabel: string;
    activeSince: string;
    perMonth: string;
    loginToBuy: string;
    upgradeTo: string;
    downgradeTo: string;
    buyNow: string;
    loading: string;
    processing: string;
    bottomNote: string;
    bottomNoteHighlight: string;
    silver: { tagline: string };
    gold: { tagline: string };
    platinum: { tagline: string };
    silverFeatures: string[];
    goldFeatures: string[];
    platinumFeatures: string[];
    toastLoginRequired: string;
    toastSuccess: string;
    toastError: string;
    choosePayment: string;
    confirmPayment: string;
    acceptedPayments: string;
    paymentProcessing: string;
    selectMethod: string;
    paymentStep1Label: string;
    paymentStep2Label: string;
    cardNumber: string;
    cardName: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    paypalUsername: string;
    bitcoinWallet: string;
    qrisTitle: string;
    qrisInfo: string;
    iHaveTransferred: string;
    back: string;
    continue: string;
    cardError: string;
  };
  // Setup
  setup: {
    sectionLabel: string;
    sectionTitle1: string;
    sectionTitle2: string;
    sectionDesc: string;
    download: string;
    free: string;
    downloads: string;
    copiedToClipboard: string;
    windows: StepGroup;
    macos: StepGroup;
    linux: StepGroup;
  };
  // Config
  config: {
    sectionLabel: string;
    sectionTitle: string;
    sectionDesc: string;
  };
  // Docs
  docs: {
    sectionLabel: string;
    sectionTitle: string;
    sectionDesc: string;
    tabQuickStart: string;
    tabConfigRef: string;
    tabAdvanced: string;
    tabFAQ: string;
    copied: string;
    configOptions: {
      title: string;
      desc: string;
      colOption: string;
      colType: string;
      colDefault: string;
      colDescription: string;
    };
    quickStartSteps: Array<{ title: string; desc: string }>;
    advancedSections: Array<{ title: string; desc?: string }>;
    descriptions: Record<string, string>;
  };
  // Changelog
  changelog: {
    sectionLabel: string;
    sectionTitle: string;
    sectionDesc: string;
    latest: string;
    showLess: string;
    viewAll: string;
    releases: string;
    typeMajor: string;
    typeMinor: string;
    typePatch: string;
  };
  // Stats
  stats: {
    totalDownloads: string;
    savedConfigs: string;
    activeSessions: string;
    downloadsDesc: string;
    configsDesc: string;
    sessionsDesc: string;
  };
  // Footer
  footer: {
    description: string;
    resources: string;
    documentation: string;
    discordCommunity: string;
    bugReports: string;
    platformStatus: string;
    api: string;
    cloudSync: string;
    pluginRegistry: string;
    operational: string;
    copyright: string;
    builtWith: string;
  };
  // WorkWithEverything
  workWith: {
    sectionLabel: string;
    sectionTitle: string;
    sectionDesc: string;
    requestIntegration: string;
    requestIntegrationTitle: string;
    platformName: string;
    websiteUrl: string;
    useCase: string;
    yourEmail: string;
    submitRequest: string;
    requestSubmitted: string;
    getStarted: string;
    keyFeatures: string;
    useCases: string;
    availableNow: string;
    viewDetails: string;
  };
  // Partner / Subscribe section
  partner: {
    stayUpdated: string;
    stayUpdatedDesc: string;
    emailPlaceholder: string;
    subscribe: string;
    successMsg: string;
    errorMsg: string;
  };
  // Admin
  admin: {
    title: string;
    close: string;
  };
  // Dashboard
  dashboard: {
    title: string;
    overview: string;
    savedConfigs: string;
    chatbotSetup: string;
    profileName: string;
    profileBio: string;
    saveProfile: string;
    savingProfile: string;
    membershipTier: string;
    memberSince: string;
    noConfigs: string;
    deleteConfig: string;
    navButton: string;
    profileSaved: string;
    profileError: string;
    noMembership: string;
    principal: string;
  };
  // Chatbot
  chatbot: {
    title: string;
    description: string;
    phoneLabel: string;
    phonePlaceholder: string;
    enableToggle: string;
    saveConfig: string;
    deleteConfig: string;
    howItWorks: string;
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    lockedTitle: string;
    lockedDesc: string;
    upgradeCta: string;
    savedSuccess: string;
    deletedSuccess: string;
    error: string;
    currentNumber: string;
    status: string;
    active: string;
    inactive: string;
    saving: string;
    deleting: string;
  };
};

type StepGroup = {
  steps: Array<{ title: string; note?: string }>;
};

const en: TranslationKey = {
  nav: {
    home: "Home",
    features: "Features",
    pricing: "Pricing",
    setup: "Setup",
    config: "Config",
    docs: "Docs",
    changelog: "Changelog",
    integrations: "Integrations",
    login: "Login",
    logout: "Logout",
    connecting: "Connecting...",
    admin: "Admin",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
  },
  hero: {
    badge: "Latest Release",
    subtitle: "The Ultimate Claw Configuration Tool.",
    downloads: "Downloads",
    downloadNow: "Download Now",
    viewDocs: "View Docs",
  },
  features: {
    sectionLabel: "Why ClawPro",
    sectionTitle1: "Powerful ",
    sectionTitle2: "Features",
    sectionDesc:
      "Everything you need to configure, deploy, and manage your claw hardware at scale.",
    autoDetect: {
      title: "Auto-Detection",
      desc: "Automatically identifies and configures connected hardware on startup. Zero manual setup required.",
    },
    multiPlatform: {
      title: "Multi-Platform",
      desc: "Seamless support for Windows, macOS, and Linux. One tool, every platform.",
    },
    realtimeConfig: {
      title: "Real-time Config",
      desc: "Live preview of your configuration changes as you make them. No restarts needed.",
    },
    pluginSystem: {
      title: "Plugin System",
      desc: "Extend ClawPro with a rich plugin ecosystem. Audio, visual, haptic, and more.",
    },
    cloudSync: {
      title: "Cloud Sync",
      desc: "Store and sync your configurations across all devices via ICP blockchain storage.",
    },
    community: {
      title: "Community",
      desc: "Join 100,000+ active users sharing configurations, plugins, and tips.",
    },
    whatsappChatbot: {
      title: "WhatsApp Chatbot",
      desc: "Deploy your own WhatsApp chatbot directly from your membership dashboard. Respond to customers instantly, 24/7.",
    },
    openclawApi: {
      title: "ClawPro API",
      desc: "Integrate ClawPro into any workflow via our REST API. Access device status, push configs, and automate at scale.",
    },
  },
  pricing: {
    sectionLabel: "Membership",
    sectionTitle1: "Choose ",
    sectionTitle2: "Your ",
    sectionTitle3: "Plan",
    sectionDesc:
      "Get full access to ClawPro with a membership plan that suits your needs. Pay with ICP, stored on blockchain.",
    mostPopular: "Most Popular",
    active: "Active",
    activeLabel: "Membership Active",
    activeSince: "Active since",
    perMonth: "/mo",
    loginToBuy: "Login to Purchase",
    upgradeTo: "Upgrade to",
    downgradeTo: "Downgrade to",
    buyNow: "Buy Now",
    loading: "Loading...",
    processing: "Processing...",
    bottomNote: "Prices in USD. ",
    bottomNoteHighlight: "No hidden fees.",
    silver: { tagline: "Start your journey" },
    gold: { tagline: "Most popular" },
    platinum: { tagline: "Full & exclusive access" },
    silverFeatures: [
      "Download ClawPro",
      "Basic config builder",
      "Community support",
      "5 saved configs",
    ],
    goldFeatures: [
      "All Silver features",
      "Priority support",
      "50 saved configs",
      "Early access updates",
      "Advanced config templates",
    ],
    platinumFeatures: [
      "All Gold features",
      "Lifetime updates",
      "Unlimited saved configs",
      "Direct developer support",
      "Exclusive beta features",
      "Custom config presets",
    ],
    toastLoginRequired: "Please login first to purchase membership.",
    toastSuccess: "membership activated successfully!",
    toastError: "Failed to activate membership. Try again.",
    choosePayment: "Choose Payment Method",
    confirmPayment: "Confirm Payment",
    acceptedPayments: "Accepted payments",
    paymentProcessing: "Processing payment...",
    selectMethod: "Select a payment method to continue",
    paymentStep1Label: "Choose payment method",
    paymentStep2Label: "Payment details",
    cardNumber: "Card number",
    cardName: "Full name on card",
    expiryMonth: "Month",
    expiryYear: "Year",
    cvv: "CVV",
    paypalUsername: "PayPal username or email",
    bitcoinWallet: "Bitcoin wallet address",
    qrisTitle: "Bank Transfer / QRIS",
    qrisInfo:
      "Transfer the exact amount. Include your username as transfer note.",
    iHaveTransferred: "I have transferred",
    back: "Back",
    continue: "Continue",
    cardError: "Please fill in all card details correctly",
  },
  setup: {
    sectionLabel: "Get Started",
    sectionTitle1: "Setup & ",
    sectionTitle2: "Download",
    sectionDesc:
      "Install ClawPro on your platform in minutes. Works on all major operating systems.",
    download: "Download",
    free: "Free",
    downloads: "downloads",
    copiedToClipboard: "Copied to clipboard!",
    windows: {
      steps: [
        {
          title: "Download the Windows installer",
          note: "Or download the .exe installer from GitHub Releases",
        },
        {
          title: "Run setup and accept UAC prompt",
          note: "The installer will guide you through the setup wizard",
        },
        { title: "Configure PATH environment variable" },
        { title: "Launch ClawPro" },
      ],
    },
    macos: {
      steps: [
        { title: "Install via Homebrew (recommended)" },
        {
          title: "Or download the .dmg installer",
          note: "Drag ClawPro.app to your Applications folder",
        },
        { title: "Run initial setup" },
        {
          title: "Grant required permissions",
          note: "System Preferences → Security & Privacy → Allow ClawPro",
        },
      ],
    },
    linux: {
      steps: [
        { title: "Install via apt (Debian/Ubuntu)" },
        { title: "Or install via Snap" },
        { title: "Set executable permissions" },
        { title: "Initialize and run" },
      ],
    },
  },
  config: {
    sectionLabel: "Configuration",
    sectionTitle: "Config Builder",
    sectionDesc: "Build your configuration interactively and save it on-chain.",
  },
  docs: {
    sectionLabel: "Reference",
    sectionTitle: "Documentation",
    sectionDesc: "Everything you need to know about ClawPro in one place.",
    tabQuickStart: "Quick Start",
    tabConfigRef: "Config Ref",
    tabAdvanced: "Advanced",
    tabFAQ: "FAQ",
    copied: "Copied!",
    configOptions: {
      title: "Configuration Options",
      desc: "All available ClawPro configuration properties",
      colOption: "Option",
      colType: "Type",
      colDefault: "Default",
      colDescription: "Description",
    },
    quickStartSteps: [
      {
        title: "Install ClawPro",
        desc: "Install via your preferred package manager",
      },
      {
        title: "Initialize Your First Config",
        desc: "Run the interactive setup wizard",
      },
      {
        title: "Start ClawPro",
        desc: "Launch the daemon and connect to your hardware",
      },
      {
        title: "Customize Your Configuration",
        desc: "Edit the config file or use the web UI",
      },
    ],
    advancedSections: [
      { title: "CLI Flags Reference" },
      {
        title: "Scripting & Automation",
        desc: "Use ClawPro in CI/CD pipelines or automated scripts:",
      },
      { title: "Plugin Development" },
    ],
    descriptions: {
      sensitivity: "Claw sensitivity (1–100)",
      performanceMode: 'Mode: "normal" | "performance" | "ultra"',
      autoDetect: "Auto-detect hardware on startup",
      plugins: "Enabled plugins list",
      theme: 'UI theme: "dark" | "light" | "system" | "neon"',
      logLevel: 'Log verbosity: "debug" | "info" | "warn" | "error"',
      os: "Target operating system override",
      cloudSync: "Enable cloud sync via ICP",
    },
  },
  changelog: {
    sectionLabel: "What's New",
    sectionTitle: "Changelog",
    sectionDesc: "Track every improvement, fix, and new feature in ClawPro.",
    latest: "Latest",
    showLess: "Show Less",
    viewAll: "View All",
    releases: "Releases",
    typeMajor: "Major",
    typeMinor: "Minor",
    typePatch: "Patch",
  },
  stats: {
    totalDownloads: "Total Downloads",
    savedConfigs: "Saved Configs",
    activeSessions: "Active Sessions",
    downloadsDesc: "Across all platforms",
    configsDesc: "Stored on-chain",
    sessionsDesc: "Right now",
  },
  footer: {
    description:
      "The ultimate claw configuration tool for developers and power users. Multi-platform, extensible, blockchain-powered.",
    resources: "Resources",
    documentation: "Documentation",
    discordCommunity: "Discord Community",
    bugReports: "Bug Reports",
    platformStatus: "Platform Status",
    api: "API",
    cloudSync: "Cloud Sync",
    pluginRegistry: "Plugin Registry",
    operational: "Operational",
    copyright: "ClawPro. Open source under MIT License.",
    builtWith: "Built with",
  },
  workWith: {
    sectionLabel: "Integrations",
    sectionTitle: "Works With Everything",
    sectionDesc:
      "ClawPro integrates seamlessly with your favorite platforms and apps",
    requestIntegration: "Request Integration",
    requestIntegrationTitle: "Request an Integration",
    platformName: "Platform Name",
    websiteUrl: "Website URL (optional)",
    useCase: "How would you use this integration?",
    yourEmail: "Your email (optional)",
    submitRequest: "Submit Request",
    requestSubmitted: "Request submitted! We'll review it soon.",
    getStarted: "Get Started",
    keyFeatures: "Key Features",
    useCases: "Use Cases",
    availableNow: "Available",
    viewDetails: "View Details",
  },
  partner: {
    stayUpdated: "Stay Updated",
    stayUpdatedDesc:
      "Get the latest ClawPro updates, tips, and releases directly to your inbox.",
    emailPlaceholder: "Enter your email address",
    subscribe: "Subscribe",
    successMsg: "You're subscribed! Welcome to ClawPro updates.",
    errorMsg: "Please enter a valid email address.",
  },
  admin: {
    title: "Admin Panel",
    close: "Close",
  },
  dashboard: {
    title: "Member Dashboard",
    overview: "Overview",
    savedConfigs: "Saved Configs",
    chatbotSetup: "Chatbot Setup",
    profileName: "Display Name",
    profileBio: "Bio",
    saveProfile: "Save Profile",
    savingProfile: "Saving...",
    membershipTier: "Membership Tier",
    memberSince: "Member since",
    noConfigs: "No saved configurations yet.",
    deleteConfig: "Delete",
    navButton: "Dashboard",
    profileSaved: "Profile saved successfully!",
    profileError: "Failed to save profile.",
    noMembership: "No active membership",
    principal: "Principal ID",
  },
  chatbot: {
    title: "WhatsApp Chatbot Setup",
    description:
      "Configure your personal WhatsApp chatbot. Once set up, customers can reach your bot directly via WhatsApp.",
    phoneLabel: "WhatsApp Number",
    phonePlaceholder: "+62 812 3456 7890",
    enableToggle: "Enable Chatbot",
    saveConfig: "Save Configuration",
    deleteConfig: "Remove Chatbot",
    howItWorks: "How It Works",
    step1: "Enter your WhatsApp phone number with country code",
    step2: "Toggle the chatbot enable switch",
    step3: "Click Save Configuration to store your settings",
    step4:
      "Send a message to our official bot at wa.me/+6285781237934 to activate",
    lockedTitle: "Members Only Feature",
    lockedDesc:
      "Upgrade to Silver, Gold, or Platinum to unlock WhatsApp chatbot setup.",
    upgradeCta: "View Plans",
    savedSuccess: "Chatbot configuration saved!",
    deletedSuccess: "Chatbot configuration removed.",
    error: "Failed to save. Please try again.",
    currentNumber: "Current number:",
    status: "Status:",
    active: "Active",
    inactive: "Inactive",
    saving: "Saving...",
    deleting: "Removing...",
  },
};

const id: TranslationKey = {
  nav: {
    home: "Beranda",
    features: "Fitur",
    pricing: "Harga",
    setup: "Pemasangan",
    config: "Konfigurasi",
    docs: "Dokumentasi",
    changelog: "Riwayat",
    integrations: "Integrasi",
    login: "Masuk",
    logout: "Keluar",
    connecting: "Menghubungkan...",
    admin: "Admin",
    lightMode: "Mode Terang",
    darkMode: "Mode Gelap",
  },
  hero: {
    badge: "Rilis Terbaru",
    subtitle: "Alat Konfigurasi Claw Terbaik.",
    downloads: "Unduhan",
    downloadNow: "Unduh Sekarang",
    viewDocs: "Lihat Dokumentasi",
  },
  features: {
    sectionLabel: "Mengapa ClawPro",
    sectionTitle1: "Fitur yang ",
    sectionTitle2: "Powerful",
    sectionDesc:
      "Semua yang kamu butuhkan untuk mengkonfigurasi, menerapkan, dan mengelola hardware claw secara skala besar.",
    autoDetect: {
      title: "Deteksi Otomatis",
      desc: "Secara otomatis mendeteksi dan mengkonfigurasi hardware yang terhubung saat startup. Tidak perlu pengaturan manual.",
    },
    multiPlatform: {
      title: "Multi-Platform",
      desc: "Dukungan penuh untuk Windows, macOS, dan Linux. Satu alat, semua platform.",
    },
    realtimeConfig: {
      title: "Konfigurasi Real-time",
      desc: "Pratinjau langsung perubahan konfigurasi saat kamu membuatnya. Tidak perlu restart.",
    },
    pluginSystem: {
      title: "Sistem Plugin",
      desc: "Perluas ClawPro dengan ekosistem plugin yang kaya. Audio, visual, haptic, dan lainnya.",
    },
    cloudSync: {
      title: "Sinkronisasi Cloud",
      desc: "Simpan dan sinkronkan konfigurasi di semua perangkat melalui penyimpanan blockchain ICP.",
    },
    community: {
      title: "Komunitas",
      desc: "Bergabung dengan 100.000+ pengguna aktif yang berbagi konfigurasi, plugin, dan tips.",
    },
    whatsappChatbot: {
      title: "Chatbot WhatsApp",
      desc: "Deploy chatbot WhatsApp pribadimu langsung dari dashboard member. Balas pelanggan secara otomatis, 24/7.",
    },
    openclawApi: {
      title: "API ClawPro",
      desc: "Integrasikan ClawPro ke workflow apapun via REST API. Akses status perangkat, push konfigurasi, dan otomasi skala besar.",
    },
  },
  pricing: {
    sectionLabel: "Keanggotaan",
    sectionTitle1: "Pilih ",
    sectionTitle2: "Paket ",
    sectionTitle3: "Kamu",
    sectionDesc:
      "Dapatkan akses penuh ke ClawPro dengan paket membership yang sesuai kebutuhanmu. Bayar dengan ICP, simpan di blockchain.",
    mostPopular: "Paling Populer",
    active: "Aktif",
    activeLabel: "Membership Aktif",
    activeSince: "Aktif sejak",
    perMonth: "/bln",
    loginToBuy: "Login untuk Membeli",
    upgradeTo: "Upgrade ke",
    downgradeTo: "Downgrade ke",
    buyNow: "Beli Sekarang",
    loading: "Memuat...",
    processing: "Memproses...",
    bottomNote: "Harga dalam USD. ",
    bottomNoteHighlight: "Tidak ada biaya tersembunyi.",
    silver: { tagline: "Mulai perjalananmu" },
    gold: { tagline: "Paling populer" },
    platinum: { tagline: "Akses penuh & eksklusif" },
    silverFeatures: [
      "Unduh ClawPro",
      "Config builder dasar",
      "Dukungan komunitas",
      "5 konfigurasi tersimpan",
    ],
    goldFeatures: [
      "Semua fitur Silver",
      "Dukungan prioritas",
      "50 konfigurasi tersimpan",
      "Akses awal pembaruan",
      "Template konfigurasi lanjutan",
    ],
    platinumFeatures: [
      "Semua fitur Gold",
      "Pembaruan seumur hidup",
      "Konfigurasi tersimpan tak terbatas",
      "Dukungan developer langsung",
      "Fitur beta eksklusif",
      "Preset konfigurasi kustom",
    ],
    toastLoginRequired:
      "Silakan login terlebih dahulu untuk membeli membership.",
    toastSuccess: "membership berhasil diaktifkan!",
    toastError: "Gagal mengaktifkan membership. Coba lagi.",
    choosePayment: "Pilih Metode Pembayaran",
    confirmPayment: "Konfirmasi Pembayaran",
    acceptedPayments: "Metode pembayaran",
    paymentProcessing: "Memproses pembayaran...",
    selectMethod: "Pilih metode pembayaran untuk melanjutkan",
    paymentStep1Label: "Pilih metode pembayaran",
    paymentStep2Label: "Detail pembayaran",
    cardNumber: "Nomor kartu",
    cardName: "Nama lengkap di kartu",
    expiryMonth: "Bulan",
    expiryYear: "Tahun",
    cvv: "CVV",
    paypalUsername: "Username atau email PayPal",
    bitcoinWallet: "Alamat dompet Bitcoin",
    qrisTitle: "Transfer Bank / QRIS",
    qrisInfo:
      "Transfer jumlah yang tepat. Cantumkan username Anda sebagai catatan transfer.",
    iHaveTransferred: "Saya sudah transfer",
    back: "Kembali",
    continue: "Lanjutkan",
    cardError: "Harap isi semua detail kartu dengan benar",
  },
  setup: {
    sectionLabel: "Mulai",
    sectionTitle1: "Pemasangan & ",
    sectionTitle2: "Unduhan",
    sectionDesc:
      "Pasang ClawPro di platform kamu dalam hitungan menit. Berjalan di semua sistem operasi utama.",
    download: "Unduh",
    free: "Gratis",
    downloads: "unduhan",
    copiedToClipboard: "Disalin ke clipboard!",
    windows: {
      steps: [
        {
          title: "Unduh installer Windows",
          note: "Atau unduh installer .exe dari GitHub Releases",
        },
        {
          title: "Jalankan setup dan terima perintah UAC",
          note: "Installer akan memandu kamu melalui wizard setup",
        },
        { title: "Konfigurasi variabel lingkungan PATH" },
        { title: "Jalankan ClawPro" },
      ],
    },
    macos: {
      steps: [
        { title: "Pasang melalui Homebrew (disarankan)" },
        {
          title: "Atau unduh installer .dmg",
          note: "Seret ClawPro.app ke folder Applications",
        },
        { title: "Jalankan pengaturan awal" },
        {
          title: "Berikan izin yang diperlukan",
          note: "System Preferences → Security & Privacy → Allow ClawPro",
        },
      ],
    },
    linux: {
      steps: [
        { title: "Pasang melalui apt (Debian/Ubuntu)" },
        { title: "Atau pasang melalui Snap" },
        { title: "Atur izin executable" },
        { title: "Inisialisasi dan jalankan" },
      ],
    },
  },
  config: {
    sectionLabel: "Konfigurasi",
    sectionTitle: "Pembangun Konfigurasi",
    sectionDesc: "Buat konfigurasi secara interaktif dan simpan di blockchain.",
  },
  docs: {
    sectionLabel: "Referensi",
    sectionTitle: "Dokumentasi",
    sectionDesc:
      "Semua yang perlu kamu ketahui tentang ClawPro di satu tempat.",
    tabQuickStart: "Mulai Cepat",
    tabConfigRef: "Ref Konfigurasi",
    tabAdvanced: "Lanjutan",
    tabFAQ: "FAQ",
    copied: "Disalin!",
    configOptions: {
      title: "Opsi Konfigurasi",
      desc: "Semua properti konfigurasi ClawPro yang tersedia",
      colOption: "Opsi",
      colType: "Tipe",
      colDefault: "Default",
      colDescription: "Deskripsi",
    },
    quickStartSteps: [
      {
        title: "Pasang ClawPro",
        desc: "Pasang melalui manajer paket pilihan kamu",
      },
      {
        title: "Inisialisasi Konfigurasi Pertama",
        desc: "Jalankan wizard pengaturan interaktif",
      },
      {
        title: "Mulai ClawPro",
        desc: "Luncurkan daemon dan hubungkan ke hardware",
      },
      {
        title: "Kustomisasi Konfigurasi",
        desc: "Edit file konfigurasi atau gunakan web UI",
      },
    ],
    advancedSections: [
      { title: "Referensi Flag CLI" },
      {
        title: "Skripting & Otomatisasi",
        desc: "Gunakan ClawPro dalam pipeline CI/CD atau skrip otomatis:",
      },
      { title: "Pengembangan Plugin" },
    ],
    descriptions: {
      sensitivity: "Sensitivitas claw (1–100)",
      performanceMode: 'Mode: "normal" | "performance" | "ultra"',
      autoDetect: "Deteksi hardware otomatis saat startup",
      plugins: "Daftar plugin yang diaktifkan",
      theme: 'Tema UI: "dark" | "light" | "system" | "neon"',
      logLevel: 'Verbositas log: "debug" | "info" | "warn" | "error"',
      os: "Override sistem operasi target",
      cloudSync: "Aktifkan sinkronisasi cloud via ICP",
    },
  },
  changelog: {
    sectionLabel: "Yang Baru",
    sectionTitle: "Riwayat Perubahan",
    sectionDesc:
      "Lacak setiap peningkatan, perbaikan, dan fitur baru di ClawPro.",
    latest: "Terbaru",
    showLess: "Tampilkan Lebih Sedikit",
    viewAll: "Lihat Semua",
    releases: "Rilis",
    typeMajor: "Mayor",
    typeMinor: "Minor",
    typePatch: "Patch",
  },
  stats: {
    totalDownloads: "Total Unduhan",
    savedConfigs: "Konfigurasi Tersimpan",
    activeSessions: "Sesi Aktif",
    downloadsDesc: "Di semua platform",
    configsDesc: "Tersimpan on-chain",
    sessionsDesc: "Saat ini",
  },
  footer: {
    description:
      "Alat konfigurasi claw terbaik untuk developer dan power user. Multi-platform, extensible, berbasis blockchain.",
    resources: "Sumber Daya",
    documentation: "Dokumentasi",
    discordCommunity: "Komunitas Discord",
    bugReports: "Laporan Bug",
    platformStatus: "Status Platform",
    api: "API",
    cloudSync: "Sinkronisasi Cloud",
    pluginRegistry: "Registri Plugin",
    operational: "Beroperasi",
    copyright: "ClawPro. Sumber terbuka di bawah Lisensi MIT.",
    builtWith: "Dibangun dengan",
  },
  workWith: {
    sectionLabel: "Integrasi",
    sectionTitle: "Berfungsi dengan Semua Platform",
    sectionDesc:
      "ClawPro terintegrasi dengan mulus bersama platform dan aplikasi favoritmu",
    requestIntegration: "Minta Integrasi",
    requestIntegrationTitle: "Ajukan Permintaan Integrasi",
    platformName: "Nama Platform",
    websiteUrl: "URL Website (opsional)",
    useCase: "Bagaimana Anda akan menggunakan integrasi ini?",
    yourEmail: "Email Anda (opsional)",
    submitRequest: "Kirim Permintaan",
    requestSubmitted: "Permintaan terkirim! Kami akan segera meninjaunya.",
    getStarted: "Mulai Sekarang",
    keyFeatures: "Fitur Utama",
    useCases: "Kasus Penggunaan",
    availableNow: "Tersedia",
    viewDetails: "Lihat Detail",
  },
  partner: {
    stayUpdated: "Tetap Terkini",
    stayUpdatedDesc:
      "Dapatkan pembaruan, tips, dan rilis ClawPro terbaru langsung ke kotak masukmu.",
    emailPlaceholder: "Masukkan alamat email Anda",
    subscribe: "Berlangganan",
    successMsg: "Kamu sudah berlangganan! Selamat datang di pembaruan ClawPro.",
    errorMsg: "Masukkan alamat email yang valid.",
  },
  admin: {
    title: "Panel Admin",
    close: "Tutup",
  },
  dashboard: {
    title: "Dashboard Member",
    overview: "Ikhtisar",
    savedConfigs: "Konfigurasi Tersimpan",
    chatbotSetup: "Setup Chatbot",
    profileName: "Nama Tampilan",
    profileBio: "Bio",
    saveProfile: "Simpan Profil",
    savingProfile: "Menyimpan...",
    membershipTier: "Tier Keanggotaan",
    memberSince: "Anggota sejak",
    noConfigs: "Belum ada konfigurasi tersimpan.",
    deleteConfig: "Hapus",
    navButton: "Dashboard",
    profileSaved: "Profil berhasil disimpan!",
    profileError: "Gagal menyimpan profil.",
    noMembership: "Tidak ada keanggotaan aktif",
    principal: "Principal ID",
  },
  chatbot: {
    title: "Setup Chatbot WhatsApp",
    description:
      "Konfigurasi chatbot WhatsApp pribadimu. Setelah diatur, pelanggan dapat menghubungi botmu langsung melalui WhatsApp.",
    phoneLabel: "Nomor WhatsApp",
    phonePlaceholder: "+62 812 3456 7890",
    enableToggle: "Aktifkan Chatbot",
    saveConfig: "Simpan Konfigurasi",
    deleteConfig: "Hapus Chatbot",
    howItWorks: "Cara Kerja",
    step1: "Masukkan nomor WhatsApp dengan kode negara",
    step2: "Aktifkan switch chatbot",
    step3: "Klik Simpan Konfigurasi untuk menyimpan pengaturan",
    step4:
      "Kirim pesan ke bot resmi kami di wa.me/+6285781237934 untuk mengaktifkan",
    lockedTitle: "Fitur Khusus Member",
    lockedDesc:
      "Upgrade ke Silver, Gold, atau Platinum untuk membuka setup chatbot WhatsApp.",
    upgradeCta: "Lihat Paket",
    savedSuccess: "Konfigurasi chatbot berhasil disimpan!",
    deletedSuccess: "Konfigurasi chatbot berhasil dihapus.",
    error: "Gagal menyimpan. Silakan coba lagi.",
    currentNumber: "Nomor saat ini:",
    status: "Status:",
    active: "Aktif",
    inactive: "Tidak Aktif",
    saving: "Menyimpan...",
    deleting: "Menghapus...",
  },
};

const ar: TranslationKey = {
  nav: {
    home: "الرئيسية",
    features: "الميزات",
    pricing: "الأسعار",
    setup: "الإعداد",
    config: "الإعدادات",
    docs: "التوثيق",
    changelog: "سجل التغييرات",
    integrations: "التكاملات",
    login: "تسجيل الدخول",
    logout: "تسجيل الخروج",
    connecting: "جاري الاتصال...",
    admin: "المشرف",
    lightMode: "الوضع الفاتح",
    darkMode: "الوضع الداكن",
  },
  hero: {
    badge: "أحدث إصدار",
    subtitle: "أداة تكوين Claw المثالية.",
    downloads: "التنزيلات",
    downloadNow: "تنزيل الآن",
    viewDocs: "عرض التوثيق",
  },
  features: {
    sectionLabel: "لماذا ClawPro",
    sectionTitle1: "ميزات ",
    sectionTitle2: "قوية",
    sectionDesc: "كل ما تحتاجه لتكوين ونشر وإدارة أجهزة Claw على نطاق واسع.",
    autoDetect: {
      title: "الكشف التلقائي",
      desc: "يحدد ويكوّن تلقائياً الأجهزة المتصلة عند بدء التشغيل. لا يلزم إعداد يدوي.",
    },
    multiPlatform: {
      title: "متعدد المنصات",
      desc: "دعم سلس لـ Windows وmacOS وLinux. أداة واحدة، كل المنصات.",
    },
    realtimeConfig: {
      title: "تكوين في الوقت الفعلي",
      desc: "معاينة مباشرة لتغييرات التكوين أثناء إجرائها. لا حاجة لإعادة التشغيل.",
    },
    pluginSystem: {
      title: "نظام الإضافات",
      desc: "وسّع ClawPro مع نظام إضافات غني. صوت ومرئي ولمسي والمزيد.",
    },
    cloudSync: {
      title: "المزامنة السحابية",
      desc: "احفظ وزامن تكويناتك عبر جميع الأجهزة عبر تخزين ICP blockchain.",
    },
    community: {
      title: "المجتمع",
      desc: "انضم إلى أكثر من 100,000 مستخدم نشط يشاركون التكوينات والإضافات والنصائح.",
    },
    whatsappChatbot: {
      title: "روبوت WhatsApp",
      desc: "نشر روبوت WhatsApp الخاص بك مباشرة من لوحة التحكم. استجب للعملاء تلقائياً على مدار الساعة.",
    },
    openclawApi: {
      title: "واجهة API لـ ClawPro",
      desc: "ادمج ClawPro في أي سير عمل عبر REST API. الوصول لحالة الجهاز، ودفع التكوينات، والأتمتة على نطاق واسع.",
    },
  },
  pricing: {
    sectionLabel: "العضوية",
    sectionTitle1: "اختر ",
    sectionTitle2: "خطتك ",
    sectionTitle3: "",
    sectionDesc:
      "احصل على وصول كامل إلى ClawPro بخطة عضوية تناسب احتياجاتك. ادفع بـ ICP، مخزّن على blockchain.",
    mostPopular: "الأكثر شعبية",
    active: "نشط",
    activeLabel: "العضوية نشطة",
    activeSince: "نشطة منذ",
    perMonth: "/شهر",
    loginToBuy: "سجّل الدخول للشراء",
    upgradeTo: "ترقية إلى",
    downgradeTo: "تخفيض إلى",
    buyNow: "اشتر الآن",
    loading: "جاري التحميل...",
    processing: "جاري المعالجة...",
    bottomNote: "الأسعار بالدولار الأمريكي. ",
    bottomNoteHighlight: "لا رسوم خفية.",
    silver: { tagline: "ابدأ رحلتك" },
    gold: { tagline: "الأكثر شعبية" },
    platinum: { tagline: "وصول كامل وحصري" },
    silverFeatures: [
      "تنزيل ClawPro",
      "منشئ التكوين الأساسي",
      "دعم المجتمع",
      "5 تكوينات محفوظة",
    ],
    goldFeatures: [
      "جميع ميزات الفضة",
      "دعم ذو أولوية",
      "50 تكوين محفوظ",
      "وصول مبكر للتحديثات",
      "قوالب تكوين متقدمة",
    ],
    platinumFeatures: [
      "جميع ميزات الذهب",
      "تحديثات مدى الحياة",
      "تكوينات محفوظة غير محدودة",
      "دعم مباشر من المطورين",
      "ميزات بيتا حصرية",
      "إعدادات مسبقة مخصصة",
    ],
    toastLoginRequired: "يرجى تسجيل الدخول أولاً لشراء العضوية.",
    toastSuccess: "تم تفعيل العضوية بنجاح!",
    toastError: "فشل تفعيل العضوية. حاول مجدداً.",
    choosePayment: "اختر طريقة الدفع",
    confirmPayment: "تأكيد الدفع",
    acceptedPayments: "طرق الدفع",
    paymentProcessing: "جارٍ معالجة الدفع...",
    selectMethod: "اختر طريقة دفع للمتابعة",
    paymentStep1Label: "اختر طريقة الدفع",
    paymentStep2Label: "تفاصيل الدفع",
    cardNumber: "رقم البطاقة",
    cardName: "الاسم الكامل على البطاقة",
    expiryMonth: "الشهر",
    expiryYear: "السنة",
    cvv: "CVV",
    paypalUsername: "اسم مستخدم PayPal أو البريد الإلكتروني",
    bitcoinWallet: "عنوان محفظة البيتكوين",
    qrisTitle: "تحويل بنكي / QRIS",
    qrisInfo: "حوّل المبلغ بالضبط. اذكر اسم المستخدم كملاحظة التحويل.",
    iHaveTransferred: "لقد حوّلت",
    back: "رجوع",
    continue: "متابعة",
    cardError: "يرجى ملء جميع تفاصيل البطاقة بشكل صحيح",
  },
  setup: {
    sectionLabel: "ابدأ الآن",
    sectionTitle1: "الإعداد و",
    sectionTitle2: "التنزيل",
    sectionDesc:
      "ثبّت ClawPro على منصتك في دقائق. يعمل على جميع أنظمة التشغيل الرئيسية.",
    download: "تنزيل",
    free: "مجاني",
    downloads: "تنزيل",
    copiedToClipboard: "تم النسخ إلى الحافظة!",
    windows: {
      steps: [
        {
          title: "تنزيل مثبّت Windows",
          note: "أو تنزيل مثبّت .exe من GitHub Releases",
        },
        {
          title: "تشغيل الإعداد وقبول موجه UAC",
          note: "سيرشدك المثبّت خلال معالج الإعداد",
        },
        { title: "تكوين متغير بيئة PATH" },
        { title: "تشغيل ClawPro" },
      ],
    },
    macos: {
      steps: [
        { title: "التثبيت عبر Homebrew (موصى به)" },
        {
          title: "أو تنزيل مثبّت .dmg",
          note: "اسحب ClawPro.app إلى مجلد التطبيقات",
        },
        { title: "تشغيل الإعداد الأولي" },
        {
          title: "منح الأذونات المطلوبة",
          note: "تفضيلات النظام ← الأمان والخصوصية ← السماح لـ ClawPro",
        },
      ],
    },
    linux: {
      steps: [
        { title: "التثبيت عبر apt (Debian/Ubuntu)" },
        { title: "أو التثبيت عبر Snap" },
        { title: "تعيين أذونات التنفيذ" },
        { title: "التهيئة والتشغيل" },
      ],
    },
  },
  config: {
    sectionLabel: "التكوين",
    sectionTitle: "منشئ التكوين",
    sectionDesc: "أنشئ تكوينك بشكل تفاعلي واحفظه على السلسلة.",
  },
  docs: {
    sectionLabel: "مرجع",
    sectionTitle: "التوثيق",
    sectionDesc: "كل ما تحتاج معرفته عن ClawPro في مكان واحد.",
    tabQuickStart: "البداية السريعة",
    tabConfigRef: "مرجع التكوين",
    tabAdvanced: "متقدم",
    tabFAQ: "الأسئلة الشائعة",
    copied: "تم النسخ!",
    configOptions: {
      title: "خيارات التكوين",
      desc: "جميع خصائص تكوين ClawPro المتاحة",
      colOption: "الخيار",
      colType: "النوع",
      colDefault: "الافتراضي",
      colDescription: "الوصف",
    },
    quickStartSteps: [
      {
        title: "تثبيت ClawPro",
        desc: "ثبّت عبر مدير الحزم المفضل لديك",
      },
      {
        title: "تهيئة أول تكوين",
        desc: "شغّل معالج الإعداد التفاعلي",
      },
      {
        title: "تشغيل ClawPro",
        desc: "أطلق الخادم واتصل بالأجهزة",
      },
      {
        title: "تخصيص التكوين",
        desc: "حرّر ملف التكوين أو استخدم واجهة الويب",
      },
    ],
    advancedSections: [
      { title: "مرجع أعلام CLI" },
      {
        title: "البرمجة النصية والأتمتة",
        desc: "استخدم ClawPro في خطوط CI/CD أو السكريبتات الآلية:",
      },
      { title: "تطوير الإضافات" },
    ],
    descriptions: {
      sensitivity: "حساسية Claw (1–100)",
      performanceMode: 'الوضع: "normal" | "performance" | "ultra"',
      autoDetect: "الكشف التلقائي عن الأجهزة عند بدء التشغيل",
      plugins: "قائمة الإضافات المفعّلة",
      theme: 'سمة الواجهة: "dark" | "light" | "system" | "neon"',
      logLevel: 'مستوى السجل: "debug" | "info" | "warn" | "error"',
      os: "تجاوز نظام التشغيل المستهدف",
      cloudSync: "تفعيل المزامنة السحابية عبر ICP",
    },
  },
  changelog: {
    sectionLabel: "الجديد",
    sectionTitle: "سجل التغييرات",
    sectionDesc: "تتبع كل تحسين وإصلاح وميزة جديدة في ClawPro.",
    latest: "الأحدث",
    showLess: "عرض أقل",
    viewAll: "عرض الكل",
    releases: "إصدارات",
    typeMajor: "رئيسي",
    typeMinor: "ثانوي",
    typePatch: "تصحيح",
  },
  stats: {
    totalDownloads: "إجمالي التنزيلات",
    savedConfigs: "التكوينات المحفوظة",
    activeSessions: "الجلسات النشطة",
    downloadsDesc: "عبر جميع المنصات",
    configsDesc: "مخزّن على السلسلة",
    sessionsDesc: "الآن",
  },
  footer: {
    description:
      "أداة تكوين Claw المثالية للمطورين والمستخدمين المتقدمين. متعدد المنصات، قابل للتوسيع، مدعوم بـ blockchain.",
    resources: "الموارد",
    documentation: "التوثيق",
    discordCommunity: "مجتمع Discord",
    bugReports: "تقارير الأخطاء",
    platformStatus: "حالة المنصة",
    api: "واجهة برمجية",
    cloudSync: "المزامنة السحابية",
    pluginRegistry: "سجل الإضافات",
    operational: "يعمل",
    copyright: "ClawPro. مفتوح المصدر تحت رخصة MIT.",
    builtWith: "مبني بـ",
  },
  workWith: {
    sectionLabel: "التكاملات",
    sectionTitle: "يعمل مع كل شيء",
    sectionDesc: "يتكامل ClawPro بسلاسة مع منصاتك وتطبيقاتك المفضلة",
    requestIntegration: "طلب تكامل",
    requestIntegrationTitle: "طلب تكامل جديد",
    platformName: "اسم المنصة",
    websiteUrl: "رابط الموقع (اختياري)",
    useCase: "كيف ستستخدم هذا التكامل؟",
    yourEmail: "بريدك الإلكتروني (اختياري)",
    submitRequest: "إرسال الطلب",
    requestSubmitted: "تم إرسال الطلب! سنراجعه قريباً.",
    getStarted: "ابدأ الآن",
    keyFeatures: "الميزات الرئيسية",
    useCases: "حالات الاستخدام",
    availableNow: "متاح",
    viewDetails: "عرض التفاصيل",
  },
  partner: {
    stayUpdated: "ابقَ مطّلعاً",
    stayUpdatedDesc:
      "احصل على أحدث تحديثات ClawPro والنصائح والإصدارات مباشرة في بريدك الوارد.",
    emailPlaceholder: "أدخل عنوان بريدك الإلكتروني",
    subscribe: "اشتراك",
    successMsg: "أنت مشترك الآن! مرحباً بك في تحديثات ClawPro.",
    errorMsg: "يرجى إدخال عنوان بريد إلكتروني صحيح.",
  },
  admin: {
    title: "لوحة المشرف",
    close: "إغلاق",
  },
  dashboard: {
    title: "لوحة تحكم العضو",
    overview: "نظرة عامة",
    savedConfigs: "التكوينات المحفوظة",
    chatbotSetup: "إعداد الروبوت",
    profileName: "اسم العرض",
    profileBio: "السيرة الذاتية",
    saveProfile: "حفظ الملف الشخصي",
    savingProfile: "جاري الحفظ...",
    membershipTier: "مستوى العضوية",
    memberSince: "عضو منذ",
    noConfigs: "لا توجد تكوينات محفوظة بعد.",
    deleteConfig: "حذف",
    navButton: "لوحة التحكم",
    profileSaved: "تم حفظ الملف الشخصي بنجاح!",
    profileError: "فشل حفظ الملف الشخصي.",
    noMembership: "لا توجد عضوية نشطة",
    principal: "معرف Principal",
  },
  chatbot: {
    title: "إعداد روبوت WhatsApp",
    description:
      "كوّن روبوت WhatsApp الشخصي الخاص بك. بعد الإعداد، يمكن للعملاء التواصل مع روبوتك مباشرة عبر WhatsApp.",
    phoneLabel: "رقم WhatsApp",
    phonePlaceholder: "+966 50 123 4567",
    enableToggle: "تفعيل الروبوت",
    saveConfig: "حفظ الإعدادات",
    deleteConfig: "إزالة الروبوت",
    howItWorks: "كيف يعمل",
    step1: "أدخل رقم WhatsApp مع رمز البلد",
    step2: "فعّل مفتاح تشغيل الروبوت",
    step3: "انقر على حفظ الإعدادات لحفظ تكويناتك",
    step4: "أرسل رسالة إلى روبوتنا الرسمي على wa.me/+6285781237934 للتفعيل",
    lockedTitle: "ميزة خاصة بالأعضاء",
    lockedDesc:
      "قم بالترقية إلى فضية أو ذهبية أو بلاتينية لفتح إعداد روبوت WhatsApp.",
    upgradeCta: "عرض الخطط",
    savedSuccess: "تم حفظ إعدادات الروبوت بنجاح!",
    deletedSuccess: "تمت إزالة إعدادات الروبوت.",
    error: "فشل الحفظ. يرجى المحاولة مجدداً.",
    currentNumber: "الرقم الحالي:",
    status: "الحالة:",
    active: "نشط",
    inactive: "غير نشط",
    saving: "جاري الحفظ...",
    deleting: "جاري الإزالة...",
  },
};

const ru: TranslationKey = {
  nav: {
    home: "Главная",
    features: "Функции",
    pricing: "Цены",
    setup: "Установка",
    config: "Конфигурация",
    docs: "Документация",
    changelog: "История изменений",
    integrations: "Интеграции",
    login: "Войти",
    logout: "Выйти",
    connecting: "Подключение...",
    admin: "Админ",
    lightMode: "Светлый режим",
    darkMode: "Тёмный режим",
  },
  hero: {
    badge: "Последний выпуск",
    subtitle: "Лучший инструмент настройки Claw.",
    downloads: "Загрузки",
    downloadNow: "Скачать",
    viewDocs: "Документация",
  },
  features: {
    sectionLabel: "Почему ClawPro",
    sectionTitle1: "Мощные ",
    sectionTitle2: "Функции",
    sectionDesc:
      "Всё необходимое для настройки, развёртывания и управления оборудованием Claw.",
    autoDetect: {
      title: "Автоопределение",
      desc: "Автоматически определяет и настраивает подключённое оборудование при запуске. Ручная настройка не требуется.",
    },
    multiPlatform: {
      title: "Мультиплатформенность",
      desc: "Полная поддержка Windows, macOS и Linux. Один инструмент — все платформы.",
    },
    realtimeConfig: {
      title: "Конфигурация в реальном времени",
      desc: "Мгновенный предпросмотр изменений конфигурации. Перезапуск не нужен.",
    },
    pluginSystem: {
      title: "Система плагинов",
      desc: "Расширяйте ClawPro богатой экосистемой плагинов: аудио, визуальные, тактильные и другие.",
    },
    cloudSync: {
      title: "Облачная синхронизация",
      desc: "Храните и синхронизируйте конфигурации на всех устройствах через хранилище ICP blockchain.",
    },
    community: {
      title: "Сообщество",
      desc: "Присоединяйтесь к 100 000+ активных пользователей, делящихся конфигурациями, плагинами и советами.",
    },
    whatsappChatbot: {
      title: "Чат-бот WhatsApp",
      desc: "Разверните своего WhatsApp-бота прямо из панели участника. Отвечайте клиентам автоматически, 24/7.",
    },
    openclawApi: {
      title: "ClawPro API",
      desc: "Интегрируйте ClawPro в любой рабочий процесс через REST API. Доступ к статусу устройств, отправка конфигов и автоматизация.",
    },
  },
  pricing: {
    sectionLabel: "Членство",
    sectionTitle1: "Выберите ",
    sectionTitle2: "свой ",
    sectionTitle3: "план",
    sectionDesc:
      "Получите полный доступ к ClawPro с планом членства, подходящим для ваших нужд. Оплата ICP, хранение на blockchain.",
    mostPopular: "Самый популярный",
    active: "Активно",
    activeLabel: "Членство активно",
    activeSince: "Активно с",
    perMonth: "/мес",
    loginToBuy: "Войдите для покупки",
    upgradeTo: "Обновить до",
    downgradeTo: "Понизить до",
    buyNow: "Купить сейчас",
    loading: "Загрузка...",
    processing: "Обработка...",
    bottomNote: "Цены в долларах США. ",
    bottomNoteHighlight: "Никаких скрытых платежей.",
    silver: { tagline: "Начните свой путь" },
    gold: { tagline: "Самый популярный" },
    platinum: { tagline: "Полный и эксклюзивный доступ" },
    silverFeatures: [
      "Скачать ClawPro",
      "Базовый конфигуратор",
      "Поддержка сообщества",
      "5 сохранённых конфигураций",
    ],
    goldFeatures: [
      "Все функции Silver",
      "Приоритетная поддержка",
      "50 сохранённых конфигураций",
      "Ранний доступ к обновлениям",
      "Расширенные шаблоны конфигурации",
    ],
    platinumFeatures: [
      "Все функции Gold",
      "Пожизненные обновления",
      "Неограниченные сохранённые конфигурации",
      "Прямая поддержка разработчиков",
      "Эксклюзивные бета-функции",
      "Пользовательские пресеты конфигурации",
    ],
    toastLoginRequired: "Пожалуйста, войдите перед покупкой членства.",
    toastSuccess: "членство успешно активировано!",
    toastError: "Не удалось активировать членство. Попробуйте снова.",
    choosePayment: "Выберите способ оплаты",
    confirmPayment: "Подтвердить оплату",
    acceptedPayments: "Способы оплаты",
    paymentProcessing: "Обработка платежа...",
    selectMethod: "Выберите способ оплаты для продолжения",
    paymentStep1Label: "Выберите способ оплаты",
    paymentStep2Label: "Детали оплаты",
    cardNumber: "Номер карты",
    cardName: "Полное имя на карте",
    expiryMonth: "Месяц",
    expiryYear: "Год",
    cvv: "CVV",
    paypalUsername: "Имя пользователя или email PayPal",
    bitcoinWallet: "Адрес биткоин-кошелька",
    qrisTitle: "Банковский перевод / QRIS",
    qrisInfo: "Переведите точную сумму. Укажите имя пользователя в примечании.",
    iHaveTransferred: "Я перевёл",
    back: "Назад",
    continue: "Продолжить",
    cardError: "Пожалуйста, заполните все данные карты правильно",
  },
  setup: {
    sectionLabel: "Начало работы",
    sectionTitle1: "Установка и ",
    sectionTitle2: "загрузка",
    sectionDesc:
      "Установите ClawPro на вашей платформе за несколько минут. Работает на всех основных ОС.",
    download: "Скачать",
    free: "Бесплатно",
    downloads: "загрузок",
    copiedToClipboard: "Скопировано в буфер обмена!",
    windows: {
      steps: [
        {
          title: "Скачайте установщик Windows",
          note: "Или скачайте .exe установщик с GitHub Releases",
        },
        {
          title: "Запустите установку и примите запрос UAC",
          note: "Установщик проведёт вас через мастер настройки",
        },
        { title: "Настройте переменную среды PATH" },
        { title: "Запустите ClawPro" },
      ],
    },
    macos: {
      steps: [
        { title: "Установите через Homebrew (рекомендуется)" },
        {
          title: "Или скачайте .dmg установщик",
          note: "Перетащите ClawPro.app в папку Applications",
        },
        { title: "Запустите начальную настройку" },
        {
          title: "Предоставьте необходимые разрешения",
          note: "Системные настройки → Безопасность и конфиденциальность → Разрешить ClawPro",
        },
      ],
    },
    linux: {
      steps: [
        { title: "Установите через apt (Debian/Ubuntu)" },
        { title: "Или установите через Snap" },
        { title: "Установите права на выполнение" },
        { title: "Инициализируйте и запустите" },
      ],
    },
  },
  config: {
    sectionLabel: "Конфигурация",
    sectionTitle: "Конфигуратор",
    sectionDesc:
      "Создайте конфигурацию интерактивно и сохраните её в блокчейне.",
  },
  docs: {
    sectionLabel: "Справочник",
    sectionTitle: "Документация",
    sectionDesc: "Всё, что нужно знать о ClawPro, в одном месте.",
    tabQuickStart: "Быстрый старт",
    tabConfigRef: "Справ. по конфиг.",
    tabAdvanced: "Расширенно",
    tabFAQ: "FAQ",
    copied: "Скопировано!",
    configOptions: {
      title: "Параметры конфигурации",
      desc: "Все доступные параметры конфигурации ClawPro",
      colOption: "Параметр",
      colType: "Тип",
      colDefault: "Значение",
      colDescription: "Описание",
    },
    quickStartSteps: [
      {
        title: "Установите ClawPro",
        desc: "Установите через предпочитаемый менеджер пакетов",
      },
      {
        title: "Инициализируйте первую конфигурацию",
        desc: "Запустите интерактивный мастер настройки",
      },
      {
        title: "Запустите ClawPro",
        desc: "Запустите демон и подключитесь к оборудованию",
      },
      {
        title: "Настройте конфигурацию",
        desc: "Отредактируйте файл конфигурации или используйте веб-интерфейс",
      },
    ],
    advancedSections: [
      { title: "Справочник флагов CLI" },
      {
        title: "Скрипты и автоматизация",
        desc: "Используйте ClawPro в CI/CD конвейерах или автоматических скриптах:",
      },
      { title: "Разработка плагинов" },
    ],
    descriptions: {
      sensitivity: "Чувствительность Claw (1–100)",
      performanceMode: 'Режим: "normal" | "performance" | "ultra"',
      autoDetect: "Автоопределение оборудования при запуске",
      plugins: "Список включённых плагинов",
      theme: 'Тема интерфейса: "dark" | "light" | "system" | "neon"',
      logLevel: 'Уровень логов: "debug" | "info" | "warn" | "error"',
      os: "Переопределение целевой ОС",
      cloudSync: "Включить облачную синхронизацию через ICP",
    },
  },
  changelog: {
    sectionLabel: "Что нового",
    sectionTitle: "История изменений",
    sectionDesc:
      "Отслеживайте каждое улучшение, исправление и новую функцию в ClawPro.",
    latest: "Последнее",
    showLess: "Показать меньше",
    viewAll: "Посмотреть все",
    releases: "релиза",
    typeMajor: "Мажорный",
    typeMinor: "Минорный",
    typePatch: "Патч",
  },
  stats: {
    totalDownloads: "Всего загрузок",
    savedConfigs: "Сохранённые конфигурации",
    activeSessions: "Активные сессии",
    downloadsDesc: "На всех платформах",
    configsDesc: "Хранится on-chain",
    sessionsDesc: "Прямо сейчас",
  },
  footer: {
    description:
      "Лучший инструмент конфигурации Claw для разработчиков и опытных пользователей. Мультиплатформенный, расширяемый, на блокчейне.",
    resources: "Ресурсы",
    documentation: "Документация",
    discordCommunity: "Сообщество Discord",
    bugReports: "Отчёты об ошибках",
    platformStatus: "Статус платформы",
    api: "API",
    cloudSync: "Облачная синхронизация",
    pluginRegistry: "Реестр плагинов",
    operational: "Работает",
    copyright: "ClawPro. Открытый исходный код под лицензией MIT.",
    builtWith: "Создано с",
  },
  workWith: {
    sectionLabel: "Интеграции",
    sectionTitle: "Работает со всем",
    sectionDesc:
      "ClawPro легко интегрируется с вашими любимыми платформами и приложениями",
    requestIntegration: "Запросить интеграцию",
    requestIntegrationTitle: "Запрос интеграции",
    platformName: "Название платформы",
    websiteUrl: "URL сайта (необязательно)",
    useCase: "Как вы будете использовать эту интеграцию?",
    yourEmail: "Ваш email (необязательно)",
    submitRequest: "Отправить запрос",
    requestSubmitted: "Запрос отправлен! Мы скоро рассмотрим его.",
    getStarted: "Начать",
    keyFeatures: "Ключевые функции",
    useCases: "Варианты использования",
    availableNow: "Доступно",
    viewDetails: "Подробнее",
  },
  partner: {
    stayUpdated: "Будьте в курсе",
    stayUpdatedDesc:
      "Получайте последние обновления, советы и релизы ClawPro прямо на почту.",
    emailPlaceholder: "Введите адрес электронной почты",
    subscribe: "Подписаться",
    successMsg: "Вы подписались! Добро пожаловать в обновления ClawPro.",
    errorMsg: "Пожалуйста, введите корректный адрес электронной почты.",
  },
  admin: {
    title: "Панель администратора",
    close: "Закрыть",
  },
  dashboard: {
    title: "Панель участника",
    overview: "Обзор",
    savedConfigs: "Сохранённые конфиги",
    chatbotSetup: "Настройка бота",
    profileName: "Отображаемое имя",
    profileBio: "Биография",
    saveProfile: "Сохранить профиль",
    savingProfile: "Сохранение...",
    membershipTier: "Уровень членства",
    memberSince: "Участник с",
    noConfigs: "Нет сохранённых конфигураций.",
    deleteConfig: "Удалить",
    navButton: "Панель",
    profileSaved: "Профиль успешно сохранён!",
    profileError: "Не удалось сохранить профиль.",
    noMembership: "Нет активного членства",
    principal: "Principal ID",
  },
  chatbot: {
    title: "Настройка WhatsApp-бота",
    description:
      "Настройте своего личного WhatsApp-бота. После настройки клиенты смогут обращаться к нему напрямую через WhatsApp.",
    phoneLabel: "Номер WhatsApp",
    phonePlaceholder: "+7 999 123 4567",
    enableToggle: "Включить бота",
    saveConfig: "Сохранить настройки",
    deleteConfig: "Удалить бота",
    howItWorks: "Как это работает",
    step1: "Введите номер WhatsApp с кодом страны",
    step2: "Включите переключатель чат-бота",
    step3: "Нажмите «Сохранить настройки» для применения",
    step4:
      "Отправьте сообщение нашему официальному боту на wa.me/+6285781237934 для активации",
    lockedTitle: "Функция только для участников",
    lockedDesc:
      "Обновитесь до Silver, Gold или Platinum, чтобы настроить WhatsApp-бота.",
    upgradeCta: "Посмотреть тарифы",
    savedSuccess: "Настройки бота сохранены!",
    deletedSuccess: "Настройки бота удалены.",
    error: "Не удалось сохранить. Попробуйте ещё раз.",
    currentNumber: "Текущий номер:",
    status: "Статус:",
    active: "Активен",
    inactive: "Неактивен",
    saving: "Сохранение...",
    deleting: "Удаление...",
  },
};

const zh: TranslationKey = {
  nav: {
    home: "首页",
    features: "功能",
    pricing: "定价",
    setup: "安装",
    config: "配置",
    docs: "文档",
    changelog: "更新日志",
    integrations: "集成",
    login: "登录",
    logout: "退出",
    connecting: "连接中...",
    admin: "管理员",
    lightMode: "浅色模式",
    darkMode: "深色模式",
  },
  hero: {
    badge: "最新版本",
    subtitle: "终极爪形配置工具。",
    downloads: "下载量",
    downloadNow: "立即下载",
    viewDocs: "查看文档",
  },
  features: {
    sectionLabel: "为什么选择 ClawPro",
    sectionTitle1: "强大的 ",
    sectionTitle2: "功能",
    sectionDesc: "配置、部署和大规模管理爪形硬件所需的一切。",
    autoDetect: {
      title: "自动检测",
      desc: "启动时自动识别并配置已连接的硬件，无需手动设置。",
    },
    multiPlatform: {
      title: "多平台支持",
      desc: "完美支持 Windows、macOS 和 Linux。一个工具，所有平台。",
    },
    realtimeConfig: {
      title: "实时配置",
      desc: "实时预览配置更改，无需重启。",
    },
    pluginSystem: {
      title: "插件系统",
      desc: "通过丰富的插件生态系统扩展 ClawPro，支持音频、视觉、触觉等更多功能。",
    },
    cloudSync: {
      title: "云同步",
      desc: "通过 ICP 区块链存储在所有设备上保存和同步配置。",
    },
    community: {
      title: "社区",
      desc: "加入 100,000+ 活跃用户，共享配置、插件和技巧。",
    },
    whatsappChatbot: {
      title: "WhatsApp 聊天机器人",
      desc: "直接从会员仪表板部署您的 WhatsApp 聊天机器人，24/7 自动回复客户。",
    },
    openclawApi: {
      title: "ClawPro API",
      desc: "通过 REST API 将 ClawPro 集成到任何工作流程中，访问设备状态、推送配置并实现大规模自动化。",
    },
  },
  pricing: {
    sectionLabel: "会员资格",
    sectionTitle1: "选择 ",
    sectionTitle2: "您的 ",
    sectionTitle3: "方案",
    sectionDesc: "通过适合您需求的会员方案获得 ClawPro 的完整访问权限。",
    mostPopular: "最受欢迎",
    active: "已激活",
    activeLabel: "会员已激活",
    activeSince: "激活时间",
    perMonth: "/月",
    loginToBuy: "登录后购买",
    upgradeTo: "升级至",
    downgradeTo: "降级至",
    buyNow: "立即购买",
    loading: "加载中...",
    processing: "处理中...",
    bottomNote: "价格以美元计。",
    bottomNoteHighlight: "无隐藏费用。",
    silver: { tagline: "开启您的旅程" },
    gold: { tagline: "最受欢迎" },
    platinum: { tagline: "完整专属访问权限" },
    silverFeatures: [
      "下载 ClawPro",
      "基础配置构建器",
      "社区支持",
      "5 个保存的配置",
    ],
    goldFeatures: [
      "所有 Silver 功能",
      "优先支持",
      "50 个保存的配置",
      "早期访问更新",
      "高级配置模板",
    ],
    platinumFeatures: [
      "所有 Gold 功能",
      "终身更新",
      "无限保存配置",
      "直接开发者支持",
      "专属测试版功能",
      "自定义配置预设",
    ],
    toastLoginRequired: "请先登录后再购买会员资格。",
    toastSuccess: "会员资格激活成功！",
    toastError: "激活会员资格失败，请重试。",
    choosePayment: "选择支付方式",
    confirmPayment: "确认支付",
    acceptedPayments: "可用支付方式",
    paymentProcessing: "正在处理支付...",
    selectMethod: "请选择支付方式以继续",
    paymentStep1Label: "选择支付方式",
    paymentStep2Label: "支付详情",
    cardNumber: "卡号",
    cardName: "持卡人姓名",
    expiryMonth: "月份",
    expiryYear: "年份",
    cvv: "CVV",
    paypalUsername: "PayPal 用户名或邮箱",
    bitcoinWallet: "比特币钱包地址",
    qrisTitle: "银行转账 / QRIS",
    qrisInfo: "请转账准确金额，并在备注中注明您的用户名。",
    iHaveTransferred: "我已转账",
    back: "返回",
    continue: "继续",
    cardError: "请正确填写所有卡片信息",
  },
  setup: {
    sectionLabel: "开始使用",
    sectionTitle1: "安装与 ",
    sectionTitle2: "下载",
    sectionDesc: "几分钟内在您的平台上安装 ClawPro，支持所有主流操作系统。",
    download: "下载",
    free: "免费",
    downloads: "次下载",
    copiedToClipboard: "已复制到剪贴板！",
    windows: {
      steps: [
        {
          title: "下载 Windows 安装程序",
          note: "或从 GitHub Releases 下载 .exe 安装程序",
        },
        {
          title: "运行安装程序并接受 UAC 提示",
          note: "安装程序将引导您完成设置向导",
        },
        { title: "配置 PATH 环境变量" },
        { title: "启动 ClawPro" },
      ],
    },
    macos: {
      steps: [
        { title: "通过 Homebrew 安装（推荐）" },
        {
          title: "或下载 .dmg 安装程序",
          note: "将 ClawPro.app 拖到 Applications 文件夹",
        },
        { title: "运行初始设置" },
        {
          title: "授予所需权限",
          note: "系统偏好设置 → 安全性与隐私 → 允许 ClawPro",
        },
      ],
    },
    linux: {
      steps: [
        { title: "通过 apt 安装（Debian/Ubuntu）" },
        { title: "或通过 Snap 安装" },
        { title: "设置可执行权限" },
        { title: "初始化并运行" },
      ],
    },
  },
  config: {
    sectionLabel: "配置",
    sectionTitle: "配置构建器",
    sectionDesc: "以交互方式构建配置并保存到区块链。",
  },
  docs: {
    sectionLabel: "参考",
    sectionTitle: "文档",
    sectionDesc: "在一个地方了解有关 ClawPro 的一切。",
    tabQuickStart: "快速开始",
    tabConfigRef: "配置参考",
    tabAdvanced: "高级",
    tabFAQ: "常见问题",
    copied: "已复制！",
    configOptions: {
      title: "配置选项",
      desc: "所有可用的 ClawPro 配置属性",
      colOption: "选项",
      colType: "类型",
      colDefault: "默认值",
      colDescription: "描述",
    },
    quickStartSteps: [
      {
        title: "安装 ClawPro",
        desc: "通过您首选的包管理器安装",
      },
      {
        title: "初始化您的第一个配置",
        desc: "运行交互式设置向导",
      },
      {
        title: "启动 ClawPro",
        desc: "启动守护进程并连接到硬件",
      },
      {
        title: "自定义配置",
        desc: "编辑配置文件或使用 Web 界面",
      },
    ],
    advancedSections: [
      { title: "CLI 标志参考" },
      {
        title: "脚本与自动化",
        desc: "在 CI/CD 管道或自动化脚本中使用 ClawPro：",
      },
      { title: "插件开发" },
    ],
    descriptions: {
      sensitivity: "爪形灵敏度（1–100）",
      performanceMode: '模式: "normal" | "performance" | "ultra"',
      autoDetect: "启动时自动检测硬件",
      plugins: "已启用插件列表",
      theme: 'UI 主题: "dark" | "light" | "system" | "neon"',
      logLevel: '日志级别: "debug" | "info" | "warn" | "error"',
      os: "目标操作系统覆盖",
      cloudSync: "通过 ICP 启用云同步",
    },
  },
  changelog: {
    sectionLabel: "新内容",
    sectionTitle: "更新日志",
    sectionDesc: "跟踪 ClawPro 的每一项改进、修复和新功能。",
    latest: "最新",
    showLess: "显示更少",
    viewAll: "查看全部",
    releases: "个版本",
    typeMajor: "主要",
    typeMinor: "次要",
    typePatch: "补丁",
  },
  stats: {
    totalDownloads: "总下载量",
    savedConfigs: "保存的配置",
    activeSessions: "活跃会话",
    downloadsDesc: "跨所有平台",
    configsDesc: "链上存储",
    sessionsDesc: "当前",
  },
  footer: {
    description:
      "面向开发者和高级用户的终极爪形配置工具，多平台、可扩展、区块链驱动。",
    resources: "资源",
    documentation: "文档",
    discordCommunity: "Discord 社区",
    bugReports: "错误报告",
    platformStatus: "平台状态",
    api: "API",
    cloudSync: "云同步",
    pluginRegistry: "插件注册表",
    operational: "运行正常",
    copyright: "ClawPro。MIT 许可证下的开源软件。",
    builtWith: "构建于",
  },
  workWith: {
    sectionLabel: "集成",
    sectionTitle: "与一切兼容",
    sectionDesc: "ClawPro 与您喜爱的平台和应用程序无缝集成",
    requestIntegration: "申请集成",
    requestIntegrationTitle: "申请新集成",
    platformName: "平台名称",
    websiteUrl: "网站 URL（可选）",
    useCase: "您将如何使用此集成？",
    yourEmail: "您的邮箱（可选）",
    submitRequest: "提交申请",
    requestSubmitted: "申请已提交！我们将尽快审核。",
    getStarted: "开始使用",
    keyFeatures: "主要功能",
    useCases: "使用场景",
    availableNow: "可用",
    viewDetails: "查看详情",
  },
  partner: {
    stayUpdated: "保持更新",
    stayUpdatedDesc: "直接将 ClawPro 的最新更新、技巧和版本发送到您的收件箱。",
    emailPlaceholder: "输入您的电子邮件地址",
    subscribe: "订阅",
    successMsg: "您已成功订阅！欢迎加入 ClawPro 更新。",
    errorMsg: "请输入有效的电子邮件地址。",
  },
  admin: {
    title: "管理员面板",
    close: "关闭",
  },
  dashboard: {
    title: "会员仪表板",
    overview: "概览",
    savedConfigs: "保存的配置",
    chatbotSetup: "聊天机器人设置",
    profileName: "显示名称",
    profileBio: "个人简介",
    saveProfile: "保存个人资料",
    savingProfile: "保存中...",
    membershipTier: "会员等级",
    memberSince: "会员自",
    noConfigs: "暂无保存的配置。",
    deleteConfig: "删除",
    navButton: "仪表板",
    profileSaved: "个人资料保存成功！",
    profileError: "保存个人资料失败。",
    noMembership: "无活跃会员资格",
    principal: "主体 ID",
  },
  chatbot: {
    title: "WhatsApp 聊天机器人设置",
    description:
      "配置您的个人 WhatsApp 聊天机器人。设置完成后，客户可以直接通过 WhatsApp 联系您的机器人。",
    phoneLabel: "WhatsApp 号码",
    phonePlaceholder: "+86 138 0013 8000",
    enableToggle: "启用聊天机器人",
    saveConfig: "保存配置",
    deleteConfig: "删除机器人",
    howItWorks: "工作原理",
    step1: "输入带有国家/地区代码的 WhatsApp 号码",
    step2: "打开聊天机器人启用开关",
    step3: "点击保存配置以存储您的设置",
    step4: "发送消息至我们的官方机器人 wa.me/+6285781237934 以激活",
    lockedTitle: "仅限会员功能",
    lockedDesc:
      "升级至 Silver、Gold 或 Platinum 以解锁 WhatsApp 聊天机器人设置。",
    upgradeCta: "查看方案",
    savedSuccess: "聊天机器人配置保存成功！",
    deletedSuccess: "聊天机器人配置已删除。",
    error: "保存失败，请重试。",
    currentNumber: "当前号码：",
    status: "状态：",
    active: "已激活",
    inactive: "未激活",
    saving: "保存中...",
    deleting: "删除中...",
  },
};

export const translations: Record<Language, TranslationKey> = {
  en,
  id,
  ar,
  ru,
  zh,
};
