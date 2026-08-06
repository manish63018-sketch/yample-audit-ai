'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

type RecordingState = 'idle' | 'recording' | 'processing' | 'done'

interface VoiceInputProps {
  onTranscript: (text: string, language: string) => void
  placeholder?: string
  className?: string
}

// Browser Speech API types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  isFinal: boolean
  length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  abort: () => void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: Event) => void) | null
  onend: (() => void) | null
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance
    webkitSpeechRecognition: new () => SpeechRecognitionInstance
  }
}

export function VoiceInput({ onTranscript, placeholder = 'Speak your requirements...', className = '' }: VoiceInputProps) {
  const [state, setState] = useState<RecordingState>('idle')
  const [transcript, setTranscript] = useState('')
  const [interimText, setInterimText] = useState('')
  const [detectedLang, setDetectedLang] = useState('')
  const [isSupported, setIsSupported] = useState(true)
  const [editedTranscript, setEditedTranscript] = useState('')
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) {
      setIsSupported(false)
      return
    }

    const recognition = new SR()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = navigator.language || 'en-US'

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalText = ''
      let interim = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalText += result[0].transcript + ' '
        } else {
          interim += result[0].transcript
        }
      }

      if (finalText) {
        setTranscript(prev => {
          const updated = prev + finalText
          setEditedTranscript(updated)
          return updated
        })
        // Detect language from browser recognition
        setDetectedLang(navigator.language || 'en-US')
      }
      setInterimText(interim)
    }

    recognition.onerror = () => {
      setState('idle')
      setInterimText('')
    }

    recognition.onend = () => {
      setInterimText('')
      if (state === 'recording') {
        setState('done')
      }
    }

    recognitionRef.current = recognition
  }, [state])

  const startRecording = useCallback(() => {
    if (!recognitionRef.current) return
    setTranscript('')
    setEditedTranscript('')
    setInterimText('')
    setState('recording')
    try {
      recognitionRef.current.start()
    } catch {}
  }, [])

  const stopRecording = useCallback(() => {
    if (!recognitionRef.current) return
    recognitionRef.current.stop()
    setState('processing')
    setTimeout(() => setState('done'), 500)
  }, [])

  const handleSubmitTranscript = useCallback(() => {
    const finalText = editedTranscript.trim()
    if (finalText) {
      onTranscript(finalText, detectedLang || navigator.language || 'en-US')
    }
  }, [editedTranscript, detectedLang, onTranscript])

  const handleReset = useCallback(() => {
    setState('idle')
    setTranscript('')
    setEditedTranscript('')
    setInterimText('')
    setDetectedLang('')
  }, [])

  if (!isSupported) {
    return (
      <div className={`flex items-center gap-2 p-3 rounded-xl border border-white/5 bg-white/3 text-white/30 text-sm ${className}`}>
        <span>🎙️</span>
        <span>Voice input not supported in this browser. Please use Chrome or Edge.</span>
      </div>
    )
  }

  const langLabel: Record<string, string> = {
    'hi': '🇮🇳 Hindi', 'hi-IN': '🇮🇳 Hindi',
    'en': '🇺🇸 English', 'en-US': '🇺🇸 English', 'en-GB': '🇬🇧 English',
    'fr': '🇫🇷 French', 'fr-FR': '🇫🇷 French',
    'es': '🇪🇸 Spanish', 'es-ES': '🇪🇸 Spanish',
    'ar': '🇸🇦 Arabic', 'ar-SA': '🇸🇦 Arabic',
    'ja': '🇯🇵 Japanese', 'ja-JP': '🇯🇵 Japanese',
    'de': '🇩🇪 German', 'de-DE': '🇩🇪 German',
  }
  const langDisplay = detectedLang ? (langLabel[detectedLang] || detectedLang) : ''

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Mic Button Row */}
      <div className="flex items-center gap-3">
        {state === 'idle' && (
          <button
            type="button"
            onClick={startRecording}
            id="voice-start-btn"
            className="group relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:border-violet-500/40 hover:bg-violet-500/10 transition-all text-sm text-white/60 hover:text-white"
          >
            <div className="w-7 h-7 rounded-full bg-violet-500/20 flex items-center justify-center text-base group-hover:bg-violet-500/30 transition-colors">
              🎤
            </div>
            <span>Speak Requirements</span>
            <span className="text-[10px] text-white/30 ml-1">Chrome/Edge</span>
          </button>
        )}

        {state === 'recording' && (
          <button
            type="button"
            onClick={stopRecording}
            id="voice-stop-btn"
            className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-red-500/50 bg-red-500/10 text-red-300 text-sm font-medium"
          >
            {/* Pulse rings */}
            <div className="relative w-7 h-7">
              <div className="absolute inset-0 rounded-full bg-red-500/30 animate-ping" />
              <div className="absolute inset-1 rounded-full bg-red-500/50 animate-ping" style={{ animationDelay: '0.3s' }} />
              <div className="relative w-7 h-7 rounded-full bg-red-500 flex items-center justify-center">
                <div className="w-3 h-3 rounded-sm bg-white" />
              </div>
            </div>
            <span>Recording... (click to stop)</span>
          </button>
        )}

        {state === 'processing' && (
          <div className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/50">
            <div className="w-7 h-7 rounded-full border-2 border-violet-500/50 border-t-violet-400 animate-spin" />
            <span>Processing...</span>
          </div>
        )}

        {state === 'done' && (
          <div className="flex items-center gap-2 text-sm text-green-400">
            <span>✓ Recording complete</span>
            {langDisplay && (
              <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/40">
                {langDisplay}
              </span>
            )}
            <button type="button" onClick={handleReset} className="ml-2 text-xs text-white/30 hover:text-white/60 transition-colors underline">
              Re-record
            </button>
          </div>
        )}
      </div>

      {/* Live transcript / interim text */}
      {state === 'recording' && (
        <div className="p-3 rounded-xl border border-red-500/20 bg-red-500/5 text-sm">
          {transcript && <span className="text-white/70">{transcript}</span>}
          {interimText && <span className="text-white/30 italic"> {interimText}</span>}
          {!transcript && !interimText && (
            <span className="text-white/30 italic">{placeholder}</span>
          )}
        </div>
      )}

      {/* Editable final transcript */}
      {(state === 'done' || (state === 'idle' && editedTranscript)) && editedTranscript && (
        <div className="space-y-2">
          <div className="text-xs text-white/40">Edit transcript if needed:</div>
          <textarea
            value={editedTranscript}
            onChange={e => setEditedTranscript(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-colors resize-none"
          />
          <button
            type="button"
            onClick={handleSubmitTranscript}
            id="voice-use-transcript-btn"
            className="px-4 py-2 rounded-lg bg-violet-500/20 border border-violet-500/30 text-violet-300 text-sm font-medium hover:bg-violet-500/30 transition-colors"
          >
            ✓ Use This Transcript
          </button>
        </div>
      )}
    </div>
  )
}
