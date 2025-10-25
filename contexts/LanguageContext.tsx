'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'ar' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ar')

  useEffect(() => {
    // Load saved language preference
    const savedLang = localStorage.getItem('app-language') as Language
    if (savedLang && (savedLang === 'ar' || savedLang === 'en')) {
      setLanguageState(savedLang)
      // Apply direction immediately
      document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr'
      document.documentElement.lang = savedLang
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('app-language', lang)
    // Update document direction
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
  }

  const toggleLanguage = () => {
    const newLang = language === 'ar' ? 'en' : 'ar'
    setLanguage(newLang)
  }

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// Translation dictionaries
const translations: Record<Language, Record<string, string>> = {
  ar: {
    // Dashboard
    'greeting.morning': 'صباح الخير',
    'greeting.welcome': 'مرحباً بك في لِأهلك',
    'stats.totalSent': 'إجمالي المرسل',
    'stats.transactionCount': 'عدد المعاملات',
    'actions.send': 'إرسال أموال',
    'actions.beneficiaries': 'المستفيدون',
    'transactions.recent': 'المعاملات الأخيرة',
    'transactions.viewAll': 'عرض الكل',
    'transactions.none': 'لا توجد معاملات بعد',
    'transactions.sendFirst': 'إرسال أول معاملة',
    'loading.dashboard': 'جاري تحميل لوحة التحكم...',
    'loading.page': 'جاري تحميل الصفحة...',
    
    // Send Flow
    'send.title': 'إرسال',
    'send.selectBeneficiary': 'اختر المستفيد',
    'send.noBeneficiaries': 'لا يوجد مستفيدون',
    'send.addBeneficiary': 'إضافة مستفيد جديد',
    'send.amount': 'المبلغ المراد إرساله (يورو)',
    'send.minAmount': '5 يورو كحد أدنى',
    'send.maxAmount': '100 يورو كحد أقصى',
    'send.fee': 'الرسوم',
    'send.total': 'المجموع (يورو)',
    'send.jodAmount': 'المبلغ بالدينار الأردني',
    'send.exchangeRate': 'سعر الصرف: 1€ = 0.85 د.أ',
    'send.button': 'إرسال',
    'send.processing': 'جاري المعالجة...',
    'send.secure': 'سيتم التحويل بشكل آمن',
    'send.enterAmount': 'يرجى إدخال المبلغ',
    'send.selectBeneficiaryFirst': 'يرجى اختيار المستفيد',
    
    // Beneficiaries
    'beneficiaries.title': 'المستفيدون',
    'beneficiaries.add': 'إضافة مستفيد',
    'beneficiaries.none': 'لا يوجد مستفيدون',
    'beneficiaries.loading': 'جاري تحميل المستفيدين...',
    'beneficiaries.firstName': 'الاسم الأول',
    'beneficiaries.familyName': 'اسم العائلة',
    'beneficiaries.iban': 'IBAN (اختياري)',
    'beneficiaries.cliq': 'CliQ',
    'beneficiaries.phone': 'رقم الهاتف',
    'beneficiaries.save': 'حفظ المستفيد',
    'beneficiaries.cancel': 'إلغاء',
    
    // Settings
    'settings.title': 'الإعدادات',
    'settings.profile': 'الملف الشخصي',
    'settings.language': 'اللغة',
    'settings.notifications': 'الإشعارات',
    'settings.security': 'الأمان',
    'settings.logout': 'تسجيل الخروج',
    'settings.twoFactor': 'المصادقة الثنائية',
    'settings.account.title': 'الحساب',
    'settings.account.personalInfo': 'المعلومات الشخصية',
    'settings.account.personalInfoSub': 'تحديث تفاصيلك',
    'settings.account.security': 'الأمان',
    'settings.account.securitySub': 'كلمة المرور والمصادقة الثنائية',
    'settings.account.devices': 'الأجهزة',
    'settings.account.devicesSub': 'إدارة الأجهزة المتصلة',
    'settings.preferences.title': 'التفضيلات',
    'settings.preferences.notifications': 'الإشعارات',
    'settings.preferences.notificationsSub': 'إشعارات التطبيق والبريد الإلكتروني',
    'settings.preferences.biometric': 'تسجيل الدخول البيومتري',
    'settings.preferences.biometricSub': 'استخدام بصمة الإصبع أو التعرف على الوجه',
    'settings.preferences.darkMode': 'الوضع الداكن',
    'settings.preferences.darkModeSub': 'استخدام الثيم الداكن دائماً',
    'settings.support.title': 'الدعم',
    'settings.support.help': 'مركز المساعدة',
    'settings.support.helpSub': 'احصل على المساعدة والدعم',
    'settings.support.contact': 'اتصل بنا',
    'settings.support.contactSub': 'أرسل لنا رسالة',
    'settings.support.terms': 'الشروط والخصوصية',
    'settings.support.termsSub': 'المعلومات القانونية',
    'settings.support.about': 'حول',
    'settings.support.aboutSub': 'إصدار التطبيق ومعلومات',
    
    // Login
    'login.title': 'تسجيل الدخول',
    'login.welcomeBack': 'مرحباً بعودتك',
    'login.subtitle': 'سجل الدخول إلى حسابك',
    'login.email': 'البريد الإلكتروني',
    'login.emailPlaceholder': 'أدخل بريدك الإلكتروني',
    'login.password': 'كلمة المرور',
    'login.passwordPlaceholder': 'أدخل كلمة المرور',
    'login.button': 'تسجيل الدخول',
    'login.loggingIn': 'جاري تسجيل الدخول...',
    'login.error': 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
    'login.noAccount': 'ليس لديك حساب؟',
    'login.signupLink': 'إنشاء حساب جديد',
    'login.signup': 'إنشاء حساب جديد',
    'login.back': 'العودة',
    'login.rememberMe': 'تذكرني',
    'login.forgotPassword': 'نسيت كلمة المرور؟',
    
    // Signup
    'signup.title': 'إنشاء حساب جديد',
    'signup.subtitle': 'انضم إلى لِأهلك اليوم',
    'signup.fullName': 'الاسم الكامل',
    'signup.fullNamePlaceholder': 'أدخل اسمك الكامل',
    'signup.phone': 'رقم الهاتف',
    'signup.phonePlaceholder': '07XXXXXXXX',
    'signup.confirmPassword': 'تأكيد كلمة المرور',
    'signup.confirmPasswordPlaceholder': 'أعد إدخال كلمة المرور',
    'signup.button': 'إنشاء الحساب',
    'signup.creating': 'جاري إنشاء الحساب...',
    'signup.haveAccount': 'لديك حساب بالفعل؟',
    'signup.success': 'تم إنشاء الحساب بنجاح!',
    'signup.checkEmail': 'يرجى التحقق من بريدك الإلكتروني لتأكيد الحساب',
    'signup.passwordMismatch': 'كلمات المرور غير متطابقة',
    'signup.passwordTooShort': 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
    
    // Common
    'common.close': 'إغلاق',
    'common.back': 'العودة',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.confirm': 'تأكيد',
    'common.edit': 'تعديل',
    'common.delete': 'حذف',
    'common.loading': 'جاري التحميل...',
    'common.error': 'حدث خطأ',
    'common.success': 'تم بنجاح',
  },
  en: {
    // Dashboard
    'greeting.morning': 'Good Morning',
    'greeting.welcome': 'Welcome to لِأهلك',
    'stats.totalSent': 'Total Sent',
    'stats.transactionCount': 'Transaction Count',
    'actions.send': 'Send Money',
    'actions.beneficiaries': 'Beneficiaries',
    'transactions.recent': 'Recent Transactions',
    'transactions.viewAll': 'View All',
    'transactions.none': 'No transactions yet',
    'transactions.sendFirst': 'Send First Transaction',
    'loading.dashboard': 'Loading dashboard...',
    'loading.page': 'Loading page...',
    
    // Send Flow
    'send.title': 'Send',
    'send.selectBeneficiary': 'Select Beneficiary',
    'send.noBeneficiaries': 'No beneficiaries',
    'send.addBeneficiary': 'Add New Beneficiary',
    'send.amount': 'Amount to Send (Euro)',
    'send.minAmount': 'Minimum 5 Euro',
    'send.maxAmount': 'Maximum 100 Euro',
    'send.fee': 'Fee',
    'send.total': 'Total (Euro)',
    'send.jodAmount': 'Amount in Jordanian Dinar',
    'send.exchangeRate': 'Exchange Rate: 1€ = 0.85 JOD',
    'send.button': 'Send',
    'send.processing': 'Processing...',
    'send.secure': 'Secure transfer',
    'send.enterAmount': 'Please enter amount',
    'send.selectBeneficiaryFirst': 'Please select a beneficiary',
    
    // Beneficiaries
    'beneficiaries.title': 'Beneficiaries',
    'beneficiaries.add': 'Add Beneficiary',
    'beneficiaries.none': 'No beneficiaries',
    'beneficiaries.loading': 'Loading beneficiaries...',
    'beneficiaries.firstName': 'First Name',
    'beneficiaries.familyName': 'Family Name',
    'beneficiaries.iban': 'IBAN (Optional)',
    'beneficiaries.cliq': 'CliQ',
    'beneficiaries.phone': 'Phone Number',
    'beneficiaries.save': 'Save Beneficiary',
    'beneficiaries.cancel': 'Cancel',
    
    // Settings
    'settings.title': 'Settings',
    'settings.profile': 'Profile',
    'settings.language': 'Language',
    'settings.notifications': 'Notifications',
    'settings.security': 'Security',
    'settings.logout': 'Logout',
    'settings.twoFactor': 'Two-Factor Authentication',
    'settings.account.title': 'Account',
    'settings.account.personalInfo': 'Personal Information',
    'settings.account.personalInfoSub': 'Update your details',
    'settings.account.security': 'Security',
    'settings.account.securitySub': 'Password and two-factor authentication',
    'settings.account.devices': 'Devices',
    'settings.account.devicesSub': 'Manage connected devices',
    'settings.preferences.title': 'Preferences',
    'settings.preferences.notifications': 'Notifications',
    'settings.preferences.notificationsSub': 'Push and email notifications',
    'settings.preferences.biometric': 'Biometric Login',
    'settings.preferences.biometricSub': 'Use fingerprint or face ID',
    'settings.preferences.darkMode': 'Dark Mode',
    'settings.preferences.darkModeSub': 'Always use dark theme',
    'settings.support.title': 'Support',
    'settings.support.help': 'Help Center',
    'settings.support.helpSub': 'Get help and support',
    'settings.support.contact': 'Contact Us',
    'settings.support.contactSub': 'Send us a message',
    'settings.support.terms': 'Terms & Privacy',
    'settings.support.termsSub': 'Legal information',
    'settings.support.about': 'About',
    'settings.support.aboutSub': 'App version and info',
    
    // Login
    'login.title': 'Login',
    'login.welcomeBack': 'Welcome Back',
    'login.subtitle': 'Login to your account',
    'login.email': 'Email',
    'login.emailPlaceholder': 'Enter your email',
    'login.password': 'Password',
    'login.passwordPlaceholder': 'Enter your password',
    'login.button': 'Login',
    'login.loggingIn': 'Logging in...',
    'login.error': 'Incorrect email or password',
    'login.noAccount': 'Don\'t have an account?',
    'login.signupLink': 'Create New Account',
    'login.signup': 'Create New Account',
    'login.back': 'Back',
    'login.rememberMe': 'Remember Me',
    'login.forgotPassword': 'Forgot Password?',
    
    // Signup
    'signup.title': 'Create New Account',
    'signup.subtitle': 'Join لِأهلك today',
    'signup.fullName': 'Full Name',
    'signup.fullNamePlaceholder': 'Enter your full name',
    'signup.phone': 'Phone Number',
    'signup.phonePlaceholder': '07XXXXXXXX',
    'signup.confirmPassword': 'Confirm Password',
    'signup.confirmPasswordPlaceholder': 'Re-enter your password',
    'signup.button': 'Create Account',
    'signup.creating': 'Creating account...',
    'signup.haveAccount': 'Already have an account?',
    'signup.success': 'Account created successfully!',
    'signup.checkEmail': 'Please check your email to confirm your account',
    'signup.passwordMismatch': 'Passwords do not match',
    'signup.passwordTooShort': 'Password must be at least 6 characters',
    
    // Common
    'common.close': 'Close',
    'common.back': 'Back',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.success': 'Success',
  }
}

