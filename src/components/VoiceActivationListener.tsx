import React, { useEffect, useState } from 'react';
import { Mic, Volume2, ShieldCheck, AlertCircle } from 'lucide-react';

interface VoiceActivationProps {
  secretCommand: string;
  onTriggerSOS: () => void;
  isListening: boolean;
  setIsListening: (val: boolean) => void;
}

export const VoiceActivationListener: React.FC<VoiceActivationProps> = ({
  secretCommand,
  onTriggerSOS,
  isListening,
  setIsListening,
}) => {
  const [transcript, setTranscript] = useState<string>('');
  const [showToast, setShowToast] = useState<boolean>(false);

  useEffect(() => {
    let recognition: any = null;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition && isListening) {
      try {
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);

          // Check if secret command was spoken
          if (currentTranscript.toLowerCase().includes(secretCommand.toLowerCase())) {
            setShowToast(true);
            setTimeout(() => {
              onTriggerSOS();
              setShowToast(false);
            }, 1000);
          }
        };

        recognition.onerror = (e: any) => {
          console.warn("Voice recognition error/pause:", e);
        };

        recognition.start();
      } catch (err) {
        console.warn("Speech recognition initialization failed:", err);
      }
    }

    return () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch (e) {}
      }
    };
  }, [isListening, secretCommand, onTriggerSOS]);

  return (
    <>
      {/* Toast Notification when voice trigger is detected */}
      {showToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-rose-600 text-white font-bold text-xs px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 border border-rose-300 animate-bounce">
          <AlertCircle className="w-4 h-4 text-white" />
          <span>SECRET COMMAND DETECTED ("{secretCommand}")! LAUNCHING SOS...</span>
        </div>
      )}
    </>
  );
};
