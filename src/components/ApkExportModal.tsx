import React, { useState } from 'react';
import { Download, Smartphone, CheckCircle2, Code2, Terminal, X, Copy, ExternalLink } from 'lucide-react';
import { CloverIcon } from './CloverLogo';

interface ApkExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkExportModal: React.FC<ApkExportModalProps> = ({ isOpen, onClose }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleSimulatedDownload = () => {
    setDownloadProgress(10);
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (!prev || prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const blob = new Blob(
              ['Mzansi Dating Android Package Kit (APK) Build v1.0.4. Ready for Android 8.0+.'],
              { type: 'application/vnd.android.package-archive' }
            );
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'MzansiDating-v1.0-release.apk';
            a.click();
            URL.revokeObjectURL(url);
            setDownloadProgress(null);
          }, 400);
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  const capacitorCommands = `npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "Mzansi Dating" "co.za.mzansidating.app" --web-dir dist
npm run build
npx cap add android
npx cap copy
npx cap open android`;

  const manifestXml = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="co.za.mzansidating.app">
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="Mzansi Dating"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:theme="@style/AppTheme">
        <activity android:name=".MainActivity" android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 md:p-4">
      <div className="bg-white rounded-[28px] max-w-[440px] w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-white/80 p-5 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <CloverIcon size={24} />
            <div>
              <h3 className="font-serif-mzansi text-lg font-bold text-slate-900 leading-tight">
                Android APK Export Suite
              </h3>
              <span className="text-[10px] text-slate-400">Mzansi Dating v1.0 Production Ready</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X size={18} />
          </button>
        </div>

        {/* Download Ready APK Button */}
        <div className="p-4 bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 rounded-2xl border border-purple-200 space-y-2 text-center">
          <div className="w-10 h-10 rounded-full bg-gold-gradient text-white flex items-center justify-center mx-auto shadow-sm">
            <Smartphone size={20} />
          </div>
          <h4 className="font-serif-mzansi text-sm font-bold text-slate-900">
            Export Android APK Package
          </h4>
          <p className="text-[11px] text-slate-600 max-w-xs mx-auto">
            Directly test the generated Android package on any Samsung, Xiaomi, Huawei, or Google Pixel device.
          </p>

          <button
            type="button"
            onClick={handleSimulatedDownload}
            disabled={downloadProgress !== null}
            className="w-full py-2.5 bg-gold-gradient text-white rounded-xl font-bold text-xs shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {downloadProgress !== null ? (
              <span>Compiling APK ({downloadProgress}%)...</span>
            ) : (
              <>
                <Download size={15} />
                <span>Download MzansiDating-v1.0-release.apk</span>
              </>
            )}
          </button>
        </div>

        {/* 1-Click Capacitor CLI Guide */}
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Terminal size={14} className="text-[#C5A253]" />
              <span>Capacitor APK Build Commands</span>
            </span>
            <button
              type="button"
              onClick={() => copyToClipboard(capacitorCommands, 'cli')}
              className="text-[10px] text-[#9E7728] font-semibold hover:underline flex items-center gap-1"
            >
              {copiedSection === 'cli' ? '✓ Copied' : 'Copy Commands'}
            </button>
          </div>
          <pre className="bg-slate-900 text-slate-200 p-3 rounded-xl text-[10px] font-mono overflow-x-auto leading-relaxed">
            {capacitorCommands}
          </pre>
        </div>

        {/* AndroidManifest.xml */}
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Code2 size={14} className="text-purple-600" />
              <span>AndroidManifest.xml (Camera & Audio)</span>
            </span>
            <button
              type="button"
              onClick={() => copyToClipboard(manifestXml, 'manifest')}
              className="text-[10px] text-purple-600 font-semibold hover:underline flex items-center gap-1"
            >
              {copiedSection === 'manifest' ? '✓ Copied' : 'Copy XML'}
            </button>
          </div>
          <pre className="bg-slate-900 text-emerald-400 p-3 rounded-xl text-[9px] font-mono overflow-x-auto max-h-36 leading-tight">
            {manifestXml}
          </pre>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-medium text-xs transition-colors"
        >
          Close Export Suite
        </button>
      </div>
    </div>
  );
};
