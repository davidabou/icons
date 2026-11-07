/**
 * Small interaction sounds, synthesized with the Web Audio API: no audio files to load.
 * On by default; the header button mutes them and the choice is kept in localStorage.
 *
 * To add a sound: add a recipe to `SOUNDS` (one or more notes) and call `play('name')`.
 */

interface Note {
  /** Start frequency, in Hz */
  from: number
  /** End frequency, for a glide (defaults to `from`) */
  to?: number
  /** Seconds after the sound starts */
  at?: number
  /** Seconds */
  duration: number
  /** Relative to the master volume */
  gain?: number
  type?: OscillatorType
}

const SOUNDS = {
  /** Grid hover: barely there */
  tick: [{ from: 1800, duration: 0.025, gain: 0.25, type: 'sine' }],
  /** Toggles, tabs, select options, reset */
  tap: [{ from: 900, to: 700, duration: 0.05, gain: 0.6, type: 'triangle' }],
  /** Dialog opens: rising */
  open: [{ from: 420, to: 760, duration: 0.11, gain: 0.55, type: 'sine' }],
  /** Dialog closes: falling */
  close: [{ from: 700, to: 380, duration: 0.1, gain: 0.5, type: 'sine' }],
  /** Copy or download done: two ascending notes */
  success: [
    { from: 880, duration: 0.07, gain: 0.5, type: 'sine' },
    { from: 1320, at: 0.06, duration: 0.12, gain: 0.45, type: 'sine' }
  ],
  /** Theme switch, sounds back on */
  toggle: [
    { from: 600, duration: 0.05, gain: 0.5, type: 'triangle' },
    { from: 800, at: 0.045, duration: 0.07, gain: 0.45, type: 'triangle' }
  ]
} satisfies Record<string, Note[]>

export type SoundName = keyof typeof SOUNDS

const MASTER_VOLUME = 0.15
/** Minimum gap between two ticks, so sweeping across the grid does not machine-gun */
const TICK_INTERVAL = 45
const STORAGE_KEY = 'sound'

/** Shared by every component */
const enabled = ref(true)
let loaded = false
let context: AudioContext | null = null
let master: GainNode | null = null
let lastTick = 0

function audio() {
  if (!context || !master) {
    context = new AudioContext()
    master = context.createGain()
    master.gain.value = MASTER_VOLUME
    master.connect(context.destination)
  }
  if (context.state === 'suspended') {
    void context.resume()
  }

  return { context, master }
}

function play(name: SoundName) {
  if (!import.meta.client || !enabled.value || typeof AudioContext === 'undefined') {
    return
  }
  if (name === 'tick') {
    const now = performance.now()

    if (now - lastTick < TICK_INTERVAL) {
      return
    }
    lastTick = now
  }
  const { context, master } = audio()
  const start = context.currentTime

  for (const note of SOUNDS[name] as Note[]) {
    const at = start + (note.at ?? 0)
    const end = at + note.duration
    const oscillator = context.createOscillator()
    const envelope = context.createGain()

    oscillator.type = note.type ?? 'sine'
    oscillator.frequency.setValueAtTime(note.from, at)
    if (note.to) {
      oscillator.frequency.exponentialRampToValueAtTime(note.to, end)
    }
    // Short attack and exponential decay: no click at either end
    envelope.gain.setValueAtTime(0.0001, at)
    envelope.gain.exponentialRampToValueAtTime(note.gain ?? 1, at + 0.005)
    envelope.gain.exponentialRampToValueAtTime(0.0001, end)

    oscillator.connect(envelope).connect(master)
    oscillator.start(at)
    oscillator.stop(end + 0.02)
  }
}

function toggle() {
  enabled.value = !enabled.value
  localStorage.setItem(STORAGE_KEY, enabled.value ? 'on' : 'off')
  // Let the user hear that sounds are back
  play('toggle')
}

export function useSound() {
  // Read the saved choice once, on the client (the site is prerendered)
  if (import.meta.client && !loaded) {
    loaded = true
    onMounted(() => {
      enabled.value = localStorage.getItem(STORAGE_KEY) !== 'off'
    })
  }

  return { play, enabled: readonly(enabled), toggle }
}
