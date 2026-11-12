import React, { useState } from 'react';
import { testGeminiConnection } from '../utils/aiScorer';
import { Bot, Key, Sparkles, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';

export default function AISettingsModal({ isOpen, onClose, onSaveConfig, currentConfig }) {
  const [apiKey, setApiKey] = useState(currentConfig?.apiKey || '');
  const [isTesting, setIsTesting] = useState(false);
  const [testStatus, setTestStatus] = useState(null);

  if (!isOpen) return null;

  const handleTest = async () => {
    if (!apiKey.trim()) {
      setTestStatus({ success: false, msg: "Please paste a Gemini API key first." });
      return;
    }
    setIsTesting(true);
    setTestStatus(null);
    const res = await testGeminiConnection(apiKey);
    setIsTesting(false);
    if (res.success) {
      setTestStatus({ 
        success: true, 
        msg: `Connection Verified! Auto-connected to ${res.detectedModel || "gemini-3.8-flash"} live.` 
      });
    } else {
      setTestStatus({ success: false, msg: res.error || "Failed to connect. Check your key." });
    }
  };

  const handleSave = () => {
    const trimmedKey = apiKey.trim();
    onSaveConfig({
      provider: trimmedKey ? 'gemini' : 'built-in',
      apiKey: trimmedKey
    });
    onClose();
  };

  const handleClear = () => {
    setApiKey('');
    onSaveConfig({ provider: 'built-in', apiKey: '' });
    setTestStatus(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-[#0D162B] border border-[#EADDC6]/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between border-b border-[#EADDC6]/15 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-[#111C35] border border-[#EADDC6]/25">
              <Bot className="w-6 h-6 text-[#C5A880]" />
            </div>
            <div>
              <h3 className="font-editorial text-2xl sm:text-3xl text-[#F4EFE6]">Connect Gemini 3.8 Flash</h3>
              <span className="text-[10px] tracking-widest uppercase text-[#8C857B] block">Live AI Reasoning & Grading</span>
            </div>
          </div>
          <button onClick={onClose} className="text-[#8C857B] hover:text-[#F4EFE6] text-sm p-1">✕</button>
        </div>

        <div className="p-4 bg-[#111C35]/80 rounded-2xl border border-[#EADDC6]/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[#C5A880] font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Targeting Gemini 3.8 Flash (Active)</span>
            </span>
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[#F4EFE6] hover:text-[#C5A880] flex items-center gap-1 underline underline-offset-2"
            >
              <span>Get Free Key</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <p className="text-xs text-[#C5BEB3] leading-relaxed">
            Updated to use Google's active model (<code className="text-[#EADDC6]">models/gemini-3.8-flash</code>).
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider text-[#F4EFE6] font-medium flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Google Gemini API Key:</span>
          </label>

          <input
            type="password"
            value={apiKey}
            onChange={(e) => {
              setApiKey(e.target.value);
              setTestStatus(null);
            }}
            placeholder="AIzaSy..."
            className="w-full bg-[#080D1A] border border-[#EADDC6]/25 rounded-xl px-4 py-3 text-sm text-[#F4EFE6] placeholder-[#5A554D] focus:outline-none focus:border-[#F4EFE6] shadow-inner font-mono"
          />

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handleTest}
              disabled={isTesting || !apiKey.trim()}
              className="px-4 py-1.5 rounded-lg border border-[#EADDC6]/30 hover:border-[#F4EFE6] text-xs font-semibold text-[#F4EFE6] transition-all disabled:opacity-40"
            >
              {isTesting ? "Connecting to 3.8 Flash..." : "Test Connection ➔"}
            </button>

            <span className="text-[10px] text-[#8C857B]">
              Saved privately in local storage only.
            </span>
          </div>
        </div>

        {testStatus && (
          <div className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
            testStatus.success 
              ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-200' 
              : 'bg-red-950/50 border-red-500/60 text-red-200'
          }`}>
            {testStatus.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
            <span>{testStatus.msg}</span>
          </div>
        )}

        <div className="pt-2 flex items-center gap-3 border-t border-[#EADDC6]/15">
          {currentConfig?.apiKey && (
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-3 rounded-xl border border-red-900/40 text-red-300 hover:bg-red-950/30 text-xs uppercase tracking-wider font-semibold transition-all"
            >
              Disconnect
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-[#EADDC6]/20 text-xs uppercase tracking-wider text-[#C5BEB3] hover:text-[#F4EFE6]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-3 rounded-xl bg-[#F4EFE6] hover:bg-[#EADDC6] text-[#0A1128] font-bold text-xs uppercase tracking-wider transition-all shadow-md"
          >
            Save & Activate
          </button>
        </div>

      </div>
    </div>
  );
}
