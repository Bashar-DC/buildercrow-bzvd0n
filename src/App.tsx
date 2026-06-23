import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dumbbell,
  Compass,
  BookOpen,
  Flame,
  Calculator,
  Droplet,
  Trophy,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Search,
  CheckCircle,
  X,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Award,
  Calendar,
  Zap,
  HelpCircle,
  Play,
  Pause,
  TrendingUp,
  User,
  Heart,
  Timer,
  RefreshCw,
  Plus,
  Minus,
  Activity,
  Sparkles
} from 'lucide-react';

// ==========================================
// STATIC DATA & DATABASE DEFINITIONS
// ==========================================

const EXERCISE_DATABASE = [
  {
    id: 'squats',
    name: 'Bodyweight Squat',
    category: 'Legs',
    equipment: 'None',
    difficulty: 'Beginner',
    target: 'Quads, Glutes, Hamstrings',
    gifSim: '🏋️‍♂️',
    steps: [
      'Stand with feet shoulder-width apart, toes pointing slightly out.',
      'Hinge at your hips and bend your knees as if sitting in a chair.',
      'Keep your chest proud, spine neutral, and knees tracking over toes.',
      'Lower until thighs are parallel to floor (or as deep as comfortable).',
      'Push through your entire foot to stand back up to starting position.'
    ],
    mistakes: [
      'Letting knees cave inwards (keep them pushed out).',
      'Lifting heels off the ground.',
      'Rounding your lower back (butt wink).'
    ],
    tip: 'Imagine ripping the floor apart with your feet to activate your glutes.'
  },
  {
    id: 'pushups',
    name: 'Incline / Wall Push-Up',
    category: 'Chest',
    equipment: 'Bench or Wall',
    difficulty: 'Beginner',
    target: 'Chest, Shoulders, Triceps, Core',
    gifSim: '💪',
    steps: [
      'Place hands slightly wider than shoulder-width on an elevated surface (wall, counter, or bench).',
      'Step feet back so your body forms a straight line from head to heels.',
      'Lower your chest toward the surface, keeping elbows tucked at a 45-degree angle.',
      'Push back up forcefully while keeping your core tight.'
    ],
    mistakes: [
      'Flaring elbows out at 90 degrees (bad for shoulders).',
      'Sagging hips or arching your lower back.',
      'Not going through the full range of motion.'
    ],
    tip: 'Squeeze your glutes and abs to maintain a perfectly straight body.'
  },
  {
    id: 'glute_bridges',
    name: 'Glute Bridge',
    category: 'Glutes',
    equipment: 'None',
    difficulty: 'Beginner',
    target: 'Glutes, Hamstrings, Core',
    gifSim: '🍑',
    steps: [
      'Lie on your back with knees bent and feet flat on the floor, hip-width apart.',
      'Place arms at your sides, palms down.',
      'Drive through your heels to lift your hips toward the ceiling.',
      'Squeeze your glutes hard at the top for 1-2 seconds.',
      'Lower back down under control.'
    ],
    mistakes: [
      'Hyperextending the lower back at the top (keep ribs down).',
      'Pushing through the toes instead of the heels.'
    ],
    tip: 'Pretend you are squeezing a dollar bill between your butt cheeks.'
  },
  {
    id: 'dumbbell_rows',
    name: 'Supported Dumbbell Row',
    category: 'Back',
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    target: 'Lats, Rhomboids, Rear Delts, Biceps',
    gifSim: '🚣‍♂️',
    steps: [
      'Place one knee and same-side hand on a bench (or stand in a hip-hinge holding onto a sturdy surface).',
      'Hold a dumbbell in your free hand, arm hanging straight down.',
      'Pull your elbow up toward your hip, keeping it close to your side.',
      'Squeeze your shoulder blade inward at the top.',
      'Lower the weight back down slowly.'
    ],
    mistakes: [
      'Yanking the weight up with momentum.',
      'Rounding your upper back.',
      'Pulling with your biceps instead of driving with your elbow.'
    ],
    tip: 'Think of your hand as just a hook; pull with your elbow, not your fist.'
  },
  {
    id: 'plank',
    name: 'Forearm Plank',
    category: 'Core',
    equipment: 'None',
    difficulty: 'Beginner',
    target: 'Core, Shoulders, Glutes',
    gifSim: '🧘',
    steps: [
      'Place forearms on the floor, elbows directly under your shoulders.',
      'Extend legs straight back, resting on your toes.',
      'Create a straight line from your head to your feet.',
      'Hold this position while breathing deeply and bracing your abs.'
    ],
    mistakes: [
      'Hips sagging down or lifting too high in the air.',
      'Holding your breath.',
      'Letting your neck drop.'
    ],
    tip: 'Pull your elbows toward your toes and squeeze your glutes for maximum intensity.'
  },
  {
    id: 'lunges',
    name: 'Reverse Lunge',
    category: 'Legs',
    equipment: 'None',
    difficulty: 'Beginner',
    target: 'Quads, Hamstrings, Glutes, Balance',
    gifSim: '🚶‍♂️',
    steps: [
      'Stand tall with feet hip-width apart.',
      'Take a large step backward with your left foot.',
      'Lower your hips until your right thigh is parallel to the ground and back knee is hovering just off the floor.',
      'Push through your front heel to return to standing.'
    ],
    mistakes: [
      'Step is too narrow (makes balance hard; step back, not behind).',
      'Letting front knee cave inward.',
      'Leaning too far forward.'
    ],
    tip: 'Stepping backward is much friendlier on your knees than stepping forward!'
  },
  {
    id: 'overhead_press',
    name: 'Dumbbell Overhead Press',
    category: 'Shoulders',
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    target: 'Shoulders, Triceps, Upper Chest',
    gifSim: '🙌',
    steps: [
      'Stand with feet shoulder-width apart (or sit on a supported chair).',
      'Bring dumbbells up to shoulder height, elbows slightly tucked forward.',
      'Press the dumbbells straight up overhead until your arms are fully locked.',
      'Lower back down slowly to shoulder height.'
    ],
    mistakes: [
      'Arching the lower back excessively (keep core tight and glutes squeezed).',
      'Flaring elbows completely to the sides (keep them angled 30 degrees forward).'
    ],
    tip: 'Press your feet firmly into the ground to build a stable base.'
  },
  {
    id: 'birddog',
    name: 'Bird Dog',
    category: 'Core',
    equipment: 'None',
    difficulty: 'Beginner',
    target: 'Lower Back, Core, Glutes, Shoulders',
    gifSim: '🐕',
    steps: [
      'Start on your hands and knees (tabletop position) on a comfortable mat.',
      'Slowly extend your right arm straight forward and left leg straight backward simultaneously.',
      'Hold for 2 seconds at the top while maintaining a flat, level pelvis and neutral spine.',
      'Return to starting position and repeat with left arm and right leg.'
    ],
    mistakes: [
      'Arching the lower back excessively to reach higher (reach long, not high).',
      'Tilting your hips to the side.'
    ],
    tip: 'Imagine balancing a full cup of water flat on your lower back throughout the set.'
  },
  {
    id: 'wallsit',
    name: 'Wall Sit',
    category: 'Legs',
    equipment: 'Wall',
    difficulty: 'Beginner',
    target: 'Quads, Glutes, Calves',
    gifSim: '🧱',
    steps: [
      'Stand about 2 feet away from a wall, resting your back flat against it.',
      'Slide your back down until your knees are bent at a 90-degree angle.',
      'Your thighs should be parallel to the floor, with knees directly above ankles.',
      'Hold this position while pressing your back and head firmly against the wall.'
    ],
    mistakes: [
      'Letting knees slide past your toes (damaging to joints).',
      'Resting your hands heavily on your knees (keep arms crossed or at your sides).'
    ],
    tip: 'Push your heels into the ground to really feel your quads engage.'
  }
];

const WARM_UP_GUIDE = [
  { name: 'Arm Circles', duration: '45 seconds', purpose: 'Lubricates shoulder joints and warm-ups rotator cuffs.', icon: '🔄' },
  { name: 'Hip Openers / Gates', duration: '45 seconds', purpose: 'Increases dynamic range of motion in the hips and groin.', icon: '🚪' },
  { name: 'High Knees / Marching', duration: '60 seconds', purpose: 'Gradually raises heart rate and increases deep muscle blood flow.', icon: '🏃‍♂️' }
];

const COOL_DOWN_GUIDE = [
  { name: 'Childs Pose', duration: '60 seconds', purpose: 'Relieves compression in lower back and shoulders.', icon: '🙇‍♂️' },
  { name: 'Knee-to-Chest Hug', duration: '60 seconds', purpose: 'Gently stretches hamstrings, glutes, and lower lumbar muscles.', icon: '🧘' },
  { name: 'Deep Diaphragmatic Breathing', duration: '90 seconds', purpose: 'Triggers parasympathetic nervous system for fast recovery.', icon: '🌬️' }
];

const MYTHS_AND_FACTS = [
  {
    id: 1,
    myth: "Lifting weights will make me bulky instantly.",
    fact: "Building bulky muscle requires massive caloric surpluses and years of intense training. Weight lifting helps beginners burn fat, build a toned shape, and boost bone density.",
    badge: "Strength Myth"
  },
  {
    id: 2,
    myth: "No pain, no gain. You must be sore to have a good workout.",
    fact: "Muscle soreness (DOMS) is just a reaction to unfamiliar movement. Progression and consistency matter far more than how sore you feel the next day.",
    badge: "Recovery Myth"
  },
  {
    id: 3,
    myth: "You can spot-reduce fat (e.g., sit-ups to burn belly fat).",
    fact: "You cannot choose where you lose fat. Fat loss occurs systematically across your entire body through a consistent caloric deficit and active lifestyle.",
    badge: "Fat Loss Myth"
  },
  {
    id: 4,
    myth: "Cardio is the only way to lose weight.",
    fact: "While cardio burns calories, resistance training builds muscle, which increases your resting metabolic rate. A combination of both yields the absolute best results.",
    badge: "Cardio Myth"
  }
];

// ==========================================
// COMPONENT MAIN
// ==========================================

export default function App() {
  // Navigation & Page State
  const [activeSection, setActiveSection] = useState<'home' | 'quiz' | 'library' | 'trackers' | 'myths'>('home');

  // Exercise Library state
  const [selectedExercise, setSelectedExercise] = useState<typeof EXERCISE_DATABASE[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('All');
  const [selectedEquipment, setSelectedEquipment] = useState('All');

  // Interactive Quiz state
  const [quizStep, setQuizStep] = useState(0); // 0 = Intro, 1 = Goal, 2 = Experience, 3 = Location, 4 = Result
  const [quizAnswers, setQuizAnswers] = useState({
    goal: '',
    experience: '',
    location: ''
  });

  // TDEE/Calorie Calculator State
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('imperial');
  const [calcGender, setCalcGender] = useState<'male' | 'female'>('female');
  const [calcWeight, setCalcWeight] = useState(70); // kg
  const [calcHeight, setCalcHeight] = useState(170); // cm
  const [calcWeightLbs, setCalcWeightLbs] = useState(150); // lbs
  const [calcHeightFt, setCalcHeightFt] = useState(5); // ft
  const [calcHeightIn, setCalcHeightIn] = useState(7); // in
  const [calcAge, setCalcAge] = useState(25);
  const [calcActivity, setCalcActivity] = useState('1.375'); // Light exercise
  const [tdeeResult, setTdeeResult] = useState<number | null>(null);

  // Standalone Rest Timer State
  const [standaloneTime, setStandaloneTime] = useState(60);
  const [standaloneActive, setStandaloneActive] = useState(false);
  const standaloneTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Active Interactive Session Overlay State
  const [activeSessionRoutine, setActiveSessionRoutine] = useState<any | null>(null);
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0);
  const [currentSessionSet, setCurrentSessionSet] = useState(1);
  const [sessionRestTimer, setSessionRestTimer] = useState(0);
  const [sessionRestActive, setSessionRestActive] = useState(false);
  const [sessionFinished, setSessionFinished] = useState(false);
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Gamified Workout Tracker State
  const [waterIntake, setWaterIntake] = useState(0); // in glasses
  const [completedWorkoutsCount, setCompletedWorkoutsCount] = useState(0);
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [trackedExercises, setTrackedExercises] = useState<{ [key: string]: boolean }>({});
  const [customGoalNotes, setCustomGoalNotes] = useState('');
  const [savedNote, setSavedNote] = useState('');

  // Myth-busters state
  const [flippedMyth, setFlippedMyth] = useState<number | null>(null);

  // Synth Beep Generator for completing rest periods
  const triggerBeep = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime); 
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (e) {
      console.warn("Audio Context blocked or unsupported.", e);
    }
  };

  // Standalone Rest Timer Logic
  useEffect(() => {
    if (standaloneActive) {
      standaloneTimerRef.current = setInterval(() => {
        setStandaloneTime((prev) => {
          if (prev <= 1) {
            triggerBeep();
            setStandaloneActive(false);
            if (standaloneTimerRef.current) clearInterval(standaloneTimerRef.current);
            return 60; // reset
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (standaloneTimerRef.current) clearInterval(standaloneTimerRef.current);
    }
    return () => {
      if (standaloneTimerRef.current) clearInterval(standaloneTimerRef.current);
    };
  }, [standaloneActive]);

  // Session Interactive Rest Countdown Timer Logic
  useEffect(() => {
    if (sessionRestActive) {
      sessionTimerRef.current = setInterval(() => {
        setSessionRestTimer((prev) => {
          if (prev <= 1) {
            triggerBeep();
            setSessionRestActive(false);
            if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    }
    return () => {
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    };
  }, [sessionRestActive]);

  // Generate Personalized Routine based on Quiz Answers
  const generatedRoutine = useMemo(() => {
    const { goal, location } = quizAnswers;
    if (!goal || !location) return null;

    let routineName = "Your Custom Beginner Blueprint";
    let instructions = "";
    let exercises: string[] = [];

    if (location === 'home') {
      routineName = goal === 'muscle' ? "At-Home Bodyweight Sculpt" : "Home Metabolic Spark";
      instructions = "Perform this routine 3 times a week (e.g., Mon, Wed, Fri) with 1 day of rest between workouts. Focus on slow, controlled tempos.";
      exercises = ['squats', 'pushups', 'glute_bridges', 'plank', 'wallsit', 'birddog'];
    } else {
      routineName = goal === 'muscle' ? "Gym Strength Fundamentals" : "Gym Lean & Strong Guide";
      instructions = "Utilize your local gym's basic equipment. Perform 3 sets of 10-12 repetitions for each exercise. Rest 60-90 seconds between sets.";
      exercises = ['squats', 'pushups', 'dumbbell_rows', 'overhead_press', 'plank', 'wallsit'];
    }

    return {
      name: routineName,
      instructions,
      exercisesList: EXERCISE_DATABASE.filter(ex => exercises.includes(ex.id))
    };
  }, [quizAnswers]);

  // Handle Level Up Mechanics
  const addXp = (amount: number) => {
    let newXp = xp + amount;
    let newLevel = level;
    while (newXp >= 100) {
      newXp = newXp - 100;
      newLevel = newLevel + 1;
    }
    setXp(newXp);
    setLevel(newLevel);
  };

  const completeExerciseLog = (id: string) => {
    if (trackedExercises[id]) return; // Already completed today

    setTrackedExercises(prev => ({ ...prev, [id]: true }));
    addXp(25);
    setCompletedWorkoutsCount(prev => prev + 1);
  };

  const resetTodayProgress = () => {
    setTrackedExercises({});
    setXp(0);
    setLevel(1);
    setCompletedWorkoutsCount(0);
    setWaterIntake(0);
  };

  // TDEE Calculation (Mifflin-St Jeor Equation)
  const calculateTDEE = (e: React.FormEvent) => {
    e.preventDefault();
    let weightInKg = calcWeight;
    let heightInCm = calcHeight;

    if (unitSystem === 'imperial') {
      weightInKg = calcWeightLbs * 0.45359237;
      heightInCm = (calcHeightFt * 12 + calcHeightIn) * 2.54;
    }

    let bmr = 0;
    if (calcGender === 'male') {
      bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * calcAge + 5;
    } else {
      bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * calcAge - 161;
    }
    const tdee = Math.round(bmr * parseFloat(calcActivity));
    setTdeeResult(tdee);
  };

  // Filtering Logic for Exercises
  const filteredExercises = EXERCISE_DATABASE.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ex.target.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMuscle = selectedMuscle === 'All' || ex.category === selectedMuscle;
    const matchesEquipment = selectedEquipment === 'All' || 
      (selectedEquipment === 'None' && ex.equipment === 'None') ||
      (selectedEquipment === 'Dumbbell' && ex.equipment.includes('Dumbbell')) ||
      (selectedEquipment === 'Bench/Wall' && (ex.equipment.includes('Bench') || ex.equipment.includes('Wall'))) ||
      (selectedEquipment === 'Wall' && ex.equipment === 'Wall');

    return matchesSearch && matchesMuscle && matchesEquipment;
  });

  // Start Interactive Guided Session
  const launchInteractiveSession = (routine: any) => {
    setActiveSessionRoutine(routine);
    setCurrentSessionIndex(0);
    setCurrentSessionSet(1);
    setSessionRestTimer(0);
    setSessionRestActive(false);
    setSessionFinished(false);
  };

  // Advance interactive steps
  const handleSetCompleted = () => {
    // Standard Rest period of 60 seconds
    setSessionRestTimer(60);
    setSessionRestActive(true);

    if (currentSessionSet < 3) {
      setCurrentSessionSet(prev => prev + 1);
    } else {
      // Move to next exercise if sets done
      if (currentSessionIndex < activeSessionRoutine.exercisesList.length - 1) {
        setCurrentSessionIndex(prev => prev + 1);
        setCurrentSessionSet(1);
      } else {
        // Workout Finished!
        setSessionRestActive(false);
        setSessionFinished(true);
        addXp(100); // 100 XP bonus for completing whole routine
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* BACKGROUND DECORATIONS */}
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-indigo-900/20 via-slate-950/0 to-transparent pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[20%] left-[5%] w-[400px] h-[400px] bg-indigo-500/5 blur-[150px] rounded-full pointer-events-none" />

      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-45 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveSection('home')}>
            <div className="bg-gradient-to-br from-indigo-500 to-emerald-500 p-2.5 rounded-xl text-white shadow-lg shadow-indigo-500/10">
              <Dumbbell className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-wider bg-gradient-to-r from-white via-indigo-100 to-emerald-400 bg-clip-text text-transparent">
                FITSTART
              </span>
              <span className="block text-[10px] text-slate-400 font-medium uppercase tracking-widest">Beginner Fitness Hub</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveSection('home')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeSection === 'home' ? 'bg-slate-800 text-white shadow-inner' : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveSection('quiz')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeSection === 'quiz' ? 'bg-slate-800 text-white shadow-inner' : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              Custom Routine
            </button>
            <button
              onClick={() => setActiveSection('library')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeSection === 'library' ? 'bg-slate-800 text-white shadow-inner' : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              Exercise Guide
            </button>
            <button
              onClick={() => setActiveSection('trackers')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeSection === 'trackers' ? 'bg-slate-800 text-white shadow-inner' : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              Tools & Tracking
            </button>
            <button
              onClick={() => setActiveSection('myths')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeSection === 'myths' ? 'bg-slate-800 text-white shadow-inner' : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              Myth Busters
            </button>
          </nav>

          <div className="flex items-center gap-3">
            {/* Simple XP Badge */}
            <div className="bg-slate-900 border border-slate-800 rounded-full px-3 py-1.5 flex items-center gap-2 text-xs font-semibold">
              <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
              <span className="text-slate-300">Level {level}</span>
              <span className="text-indigo-400 font-bold">{xp}/100 XP</span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        
        {/* ==========================================
            TAB 1: HOME (HERO & CORE HUB)
            ========================================== */}
        {activeSection === 'home' && (
          <div className="space-y-16">
            
            {/* HERO SECTION */}
            <div className="text-center space-y-6 max-w-4xl mx-auto py-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-widest mx-auto mb-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Stop Guessing. Start Moving.
              </div>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none">
                Fitness Doesn't Have To Be{' '}
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                  Intimidating.
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
                Skip the complicated fitness jargon. Access zero-equipment starter routines, simple form guidelines, rest timers, and custom tools built especially for absolute beginners.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button
                  onClick={() => {
                    setActiveSection('quiz');
                    setQuizStep(1);
                  }}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
                >
                  Find Your Perfect Workout
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => setActiveSection('library')}
                  className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  Browse Simple Exercises
                </button>
              </div>

              {/* FLOATING TRUST STATS */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-10">
                {[
                  { label: "Level Required", val: "Absolute Zero" },
                  { label: "Video Demos", val: "Interactive Visuals" },
                  { label: "Cost", val: "100% Free" },
                  { label: "Goal Focus", val: "Form & Safety" }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-slate-900/60 backdrop-blur-sm border border-slate-900/80 p-4 rounded-xl text-center">
                    <span className="block text-slate-500 text-[10px] font-bold uppercase tracking-widest">{stat.label}</span>
                    <span className="text-sm font-semibold text-slate-200">{stat.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* TWO TRACKS PROMPT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Warm-Up Block */}
              <div className="bg-gradient-to-br from-slate-900 to-indigo-950/40 p-6 rounded-3xl border border-indigo-500/10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-3xl">🔥</span>
                  <div>
                    <h3 className="font-extrabold text-lg text-indigo-300">Beginner Safe Warm-Up</h3>
                    <p className="text-xs text-slate-400">Do this for 3 minutes before any physical exercise!</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {WARM_UP_GUIDE.map((warm, idx) => (
                    <div key={idx} className="bg-slate-950/60 p-3 rounded-xl flex items-center justify-between border border-slate-900">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{warm.icon}</span>
                        <div>
                          <p className="text-xs font-bold text-slate-200">{warm.name}</p>
                          <p className="text-[10px] text-slate-400">{warm.purpose}</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded whitespace-nowrap">{warm.duration}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cool-Down Block */}
              <div className="bg-gradient-to-br from-slate-900 to-emerald-950/40 p-6 rounded-3xl border border-emerald-500/10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-3xl">🧘‍♂️</span>
                  <div>
                    <h3 className="font-extrabold text-lg text-emerald-300">Cool-Down & Stretch</h3>
                    <p className="text-xs text-slate-400">Essential to reduce sore muscles and boost quick recovery.</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {COOL_DOWN_GUIDE.map((cool, idx) => (
                    <div key={idx} className="bg-slate-950/60 p-3 rounded-xl flex items-center justify-between border border-slate-900">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{cool.icon}</span>
                        <div>
                          <p className="text-xs font-bold text-slate-200">{cool.name}</p>
                          <p className="text-[10px] text-slate-400">{cool.purpose}</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded whitespace-nowrap">{cool.duration}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* THREE CORE FEATURES ROADMAP */}
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-extrabold tracking-tight">How FitStart Works</h2>
                <p className="text-slate-400">Your three-step path to starting a confident lifestyle today.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* CARD 1 */}
                <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-900 p-6 rounded-2xl relative group hover:border-indigo-500/30 transition-all">
                  <div className="absolute top-6 right-6 text-indigo-500/20 text-6xl font-black select-none pointer-events-none">01</div>
                  <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center mb-6">
                    <Compass className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-slate-100">Take the Easy Setup Quiz</h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-4">
                    Answer 3 basic questions to tell us your current strength level, fitness objective, and where you want to train.
                  </p>
                  <button 
                    onClick={() => { setActiveSection('quiz'); setQuizStep(1); }}
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group-hover:underline"
                  >
                    Start Quiz <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* CARD 2 */}
                <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-900 p-6 rounded-2xl relative group hover:border-emerald-500/30 transition-all">
                  <div className="absolute top-6 right-6 text-emerald-500/20 text-6xl font-black select-none pointer-events-none">02</div>
                  <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center mb-6">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-slate-100">Study Essential Form</h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-4">
                    Learn the foundational movements. Avoid standard beginner mistakes with clear step-by-step instructions.
                  </p>
                  <button 
                    onClick={() => setActiveSection('library')}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 group-hover:underline"
                  >
                    Explore Exercises <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* CARD 3 */}
                <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-900 p-6 rounded-2xl relative group hover:border-purple-500/30 transition-all">
                  <div className="absolute top-6 right-6 text-purple-500/20 text-6xl font-black select-none pointer-events-none">03</div>
                  <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center mb-6">
                    <Flame className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-slate-100">Track and Build Habits</h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-4">
                    Use our built-in interactive tools like the TDEE nutrition calculator and gamified tracker to earn XP daily.
                  </p>
                  <button 
                    onClick={() => setActiveSection('trackers')}
                    className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 group-hover:underline"
                  >
                    Open Tracker & Calculators <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* BEGINNER FAQS / QUICK ADVICE */}
            <div className="bg-slate-900/40 border border-slate-900 p-8 rounded-3xl space-y-8">
              <div className="max-w-xl">
                <h2 className="text-2xl font-bold">Absolute Beginner Golden Rules</h2>
                <p className="text-sm text-slate-400 mt-1">If you remember nothing else, keep these three fundamentals in mind:</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 text-indigo-400 font-semibold mb-2">
                    <span className="p-1 rounded bg-indigo-500/10 text-indigo-400 text-xs font-bold">Rule 1</span>
                    Consistency Over Intensity
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Working out at 60% effort 3 times every week is infinitely better than going at 100% effort once, hurting yourself, and quitting for a month. Keep it manageable!
                  </p>
                </div>
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-2">
                    <span className="p-1 rounded bg-emerald-500/10 text-emerald-400 text-xs font-bold">Rule 2</span>
                    Master Form First
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Leave your ego at the door. If you are doing bodyweight squats, do them through the full range with correct back alignment before you even think of holding heavy weights.
                  </p>
                </div>
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 text-purple-400 font-semibold mb-2">
                    <span className="p-1 rounded bg-purple-500/10 text-purple-400 text-xs font-bold">Rule 3</span>
                    Prioritize Sleep & Water
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Your body doesn't build muscle or burn fat during the actual workout—it happens while you rest and recover. Get 7-8 hours of sleep and drink water.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ==========================================
            TAB 2: INTERACTIVE ROUTINE GENERATOR / QUIZ
            ========================================== */}
        {activeSection === 'quiz' && (
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-extrabold tracking-tight">Personalized Routine Builder</h1>
              <p className="text-slate-400">Generate a custom schedule suited perfectly to your equipment, goals, and experience.</p>
            </div>

            {/* QUIZ INTERFACE */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              {/* Progress bar */}
              <div className="h-1 bg-slate-850 w-full relative">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300" 
                  style={{ width: `${(quizStep / 4) * 100}%` }}
                />
              </div>

              <div className="p-8">
                <AnimatePresence mode="wait">
                  
                  {/* STEP 0: INTRO */}
                  {quizStep === 0 && (
                    <motion.div 
                      key="step-0"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6 text-center"
                    >
                      <div className="w-16 h-16 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Compass className="w-8 h-8" />
                      </div>
                      <h2 className="text-2xl font-bold">Find Your Starting Line</h2>
                      <p className="text-slate-400 max-w-md mx-auto">
                        In just 3 quick multiple-choice questions, we will build a custom routine targeting your precise ambitions.
                      </p>
                      <button
                        onClick={() => setQuizStep(1)}
                        className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-all"
                      >
                        Let's Begin
                      </button>
                    </motion.div>
                  )}

                  {/* STEP 1: GOAL */}
                  {quizStep === 1 && (
                    <motion.div 
                      key="step-1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <span className="text-xs font-bold uppercase text-indigo-400 tracking-widest block">Question 1 of 3</span>
                      <h2 className="text-2xl font-bold">What is your main primary fitness goal?</h2>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <button
                          onClick={() => {
                            setQuizAnswers(prev => ({ ...prev, goal: 'muscle' }));
                            setQuizStep(2);
                          }}
                          className={`p-5 rounded-2xl border text-left transition-all flex items-start gap-4 ${
                            quizAnswers.goal === 'muscle' 
                              ? 'bg-indigo-500/10 border-indigo-500 text-indigo-200' 
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="p-2.5 rounded-xl bg-slate-900 text-indigo-400 mt-1">
                            <Flame className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="block font-bold text-base">Build Strength & Muscle</span>
                            <span className="block text-xs text-slate-400 mt-1">Tone up, strengthen bones, gain clean athletic mass.</span>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setQuizAnswers(prev => ({ ...prev, goal: 'health' }));
                            setQuizStep(2);
                          }}
                          className={`p-5 rounded-2xl border text-left transition-all flex items-start gap-4 ${
                            quizAnswers.goal === 'health' 
                              ? 'bg-indigo-500/10 border-indigo-500 text-indigo-200' 
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="p-2.5 rounded-xl bg-slate-900 text-emerald-400 mt-1">
                            <Heart className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="block font-bold text-base">Fat Loss & Vitality</span>
                            <span className="block text-xs text-slate-400 mt-1">Boost daily metabolic rate, burn calories, raise endurance.</span>
                          </div>
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: EXPERIENCE */}
                  {quizStep === 2 && (
                    <motion.div 
                      key="step-2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <span className="text-xs font-bold uppercase text-indigo-400 tracking-widest block">Question 2 of 3</span>
                      <h2 className="text-2xl font-bold">How would you describe your lifting experience?</h2>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <button
                          onClick={() => {
                            setQuizAnswers(prev => ({ ...prev, experience: 'none' }));
                            setQuizStep(3);
                          }}
                          className={`p-5 rounded-2xl border text-left transition-all flex items-start gap-4 ${
                            quizAnswers.experience === 'none' 
                              ? 'bg-indigo-500/10 border-indigo-500 text-indigo-200' 
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="p-2.5 rounded-xl bg-slate-900 text-indigo-400 mt-1">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="block font-bold text-base">Absolute Beginner</span>
                            <span className="block text-xs text-slate-400 mt-1">I have never touched dumbbells or followed a routine.</span>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setQuizAnswers(prev => ({ ...prev, experience: 'returning' }));
                            setQuizStep(3);
                          }}
                          className={`p-5 rounded-2xl border text-left transition-all flex items-start gap-4 ${
                            quizAnswers.experience === 'returning' 
                              ? 'bg-indigo-500/10 border-indigo-500 text-indigo-200' 
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="p-2.5 rounded-xl bg-slate-900 text-amber-400 mt-1">
                            <TrendingUp className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="block font-bold text-base">Returning to Fitness</span>
                            <span className="block text-xs text-slate-400 mt-1">I used to exercise but have taken several months or years off.</span>
                          </div>
                        </button>
                      </div>

                      <div className="pt-4 flex justify-between">
                        <button 
                          onClick={() => setQuizStep(1)}
                          className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                        >
                          Back to Goal
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: LOCATION / EQUIPMENT */}
                  {quizStep === 3 && (
                    <motion.div 
                      key="step-3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <span className="text-xs font-bold uppercase text-indigo-400 tracking-widest block">Question 3 of 3</span>
                      <h2 className="text-2xl font-bold">Where do you plan on working out?</h2>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <button
                          onClick={() => {
                            setQuizAnswers(prev => ({ ...prev, location: 'home' }));
                            setQuizStep(4);
                          }}
                          className={`p-5 rounded-2xl border text-left transition-all flex items-start gap-4 ${
                            quizAnswers.location === 'home' 
                              ? 'bg-indigo-500/10 border-indigo-500 text-indigo-200' 
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="p-2.5 rounded-xl bg-slate-900 text-cyan-400 mt-1">
                            <Dumbbell className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="block font-bold text-base">At Home (No Gym)</span>
                            <span className="block text-xs text-slate-400 mt-1">Only my bodyweight or basic objects at home.</span>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setQuizAnswers(prev => ({ ...prev, location: 'gym' }));
                            setQuizStep(4);
                          }}
                          className={`p-5 rounded-2xl border text-left transition-all flex items-start gap-4 ${
                            quizAnswers.location === 'gym' 
                              ? 'bg-indigo-500/10 border-indigo-500 text-indigo-200' 
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="p-2.5 rounded-xl bg-slate-900 text-indigo-400 mt-1">
                            <Award className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="block font-bold text-base">At the Gym</span>
                            <span className="block text-xs text-slate-400 mt-1">Access to basic dumbbells, benches, or machines.</span>
                          </div>
                        </button>
                      </div>

                      <div className="pt-4 flex justify-between">
                        <button 
                          onClick={() => setQuizStep(2)}
                          className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                        >
                          Back to Experience
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 4: RESULT */}
                  {quizStep === 4 && generatedRoutine && (
                    <motion.div 
                      key="step-4"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-6"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center">
                            <CheckCircle className="w-6 h-6" />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">Ready Blueprint</span>
                            <h2 className="text-xl sm:text-2xl font-bold">{generatedRoutine.name}</h2>
                          </div>
                        </div>

                        {/* Immersive Play Session Trigger */}
                        <button
                          onClick={() => launchInteractiveSession(generatedRoutine)}
                          className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2"
                        >
                          <Play className="w-4 h-4 fill-current text-white" /> Start Guided Workout Session
                        </button>
                      </div>

                      <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl">
                        <span className="text-xs font-bold text-slate-400 block mb-1">Coach Note:</span>
                        <p className="text-xs text-slate-300 leading-relaxed">{generatedRoutine.instructions}</p>
                      </div>

                      {/* EXERCISE LIST */}
                      <div className="space-y-3 pt-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Recommended Starter Movements:</span>
                        
                        {generatedRoutine.exercisesList.map((ex, index) => (
                          <div 
                            key={ex.id}
                            className="bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between cursor-pointer group transition-all"
                            onClick={() => setSelectedExercise(ex)}
                          >
                            <div className="flex items-center gap-3.5">
                              <span className="text-lg">{ex.gifSim}</span>
                              <div>
                                <h4 className="font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">{ex.name}</h4>
                                <span className="text-[11px] text-slate-400">Target: {ex.target}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-medium px-2 py-1 rounded bg-slate-800 text-slate-300 uppercase">{ex.category}</span>
                              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-200 transition-transform group-hover:translate-x-0.5" />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* ACTION CONTROLS */}
                      <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-3 justify-between">
                        <button 
                          onClick={() => {
                            setQuizAnswers({ goal: '', experience: '', location: '' });
                            setQuizStep(1);
                          }}
                          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Re-take Quiz
                        </button>

                        <button
                          onClick={() => {
                            setActiveSection('trackers');
                          }}
                          className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-500/10"
                        >
                          Manual Trackers & Hydration Engine
                        </button>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>
            </div>

            {/* QUICK FAQ BOX AT THE BOTTOM OF THE ROUTINE PAGE */}
            <div className="bg-slate-900/50 border border-slate-850 p-6 rounded-2xl flex items-start gap-4">
              <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
                <Info className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-slate-200">How do I know if I'm ready to advance?</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Stick with this generated routine for at least 4 to 6 weeks. Once you can comfortably execute all repetitions of every exercise with pristine technique and little to no struggle, you are ready to add slight weight (1-2kg) or increase reps!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 3: EXERCISE DIRECTORY / LIBRARY
            ========================================== */}
        {activeSection === 'library' && (
          <div className="space-y-8">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <h1 className="text-3xl font-extrabold tracking-tight">The No-Jargon Guide</h1>
              <p className="text-slate-400">Interactive demonstrations and straightforward breakdowns on basic compound fitness exercises.</p>
            </div>

            {/* FILTER CONTROLS BAR */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
              
              {/* Search */}
              <div className="relative w-full md:w-1/3">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="text"
                  placeholder="Search exercise or muscle..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-indigo-500 text-slate-200 placeholder:text-slate-500"
                />
              </div>

              {/* Muscle filter */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <span className="text-xs text-slate-500 font-bold mr-1 hidden lg:inline">Muscle:</span>
                {['All', 'Legs', 'Chest', 'Glutes', 'Back', 'Core', 'Shoulders'].map((mus) => (
                  <button
                    key={mus}
                    onClick={() => setSelectedMuscle(mus)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedMuscle === mus 
                        ? 'bg-indigo-500 text-white' 
                        : 'bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-850'
                    }`}
                  >
                    {mus}
                  </button>
                ))}
              </div>

              {/* Equipment filter */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto border-t md:border-t-0 border-slate-800 pt-3 md:pt-0">
                <span className="text-xs text-slate-500 font-bold mr-1 hidden lg:inline">Equipment:</span>
                {['All', 'None', 'Dumbbell', 'Bench/Wall', 'Wall'].map((equip) => (
                  <button
                    key={equip}
                    onClick={() => setSelectedEquipment(equip)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedEquipment === equip 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-850'
                    }`}
                  >
                    {equip}
                  </button>
                ))}
              </div>
            </div>

            {/* RESULTS LIST */}
            {filteredExercises.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExercises.map((ex) => (
                  <div 
                    key={ex.id}
                    onClick={() => setSelectedExercise(ex)}
                    className="bg-slate-900 border border-slate-850 rounded-2xl p-6 hover:border-indigo-500/45 transition-all cursor-pointer group hover:-translate-y-1 duration-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl bg-slate-950 p-2.5 rounded-xl border border-slate-800">{ex.gifSim}</span>
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2 py-1 rounded">
                        {ex.difficulty}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold group-hover:text-indigo-400 transition-colors mb-1">{ex.name}</h3>
                    <p className="text-xs text-slate-400 mb-4 line-clamp-2">Targets: <span className="text-slate-300">{ex.target}</span></p>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-850/80">
                      <span>Equip: <strong className="text-slate-300">{ex.equipment}</strong></span>
                      <span className="text-indigo-400 font-bold group-hover:underline flex items-center gap-0.5">
                        View Form <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-900 border border-slate-850 rounded-2xl">
                <HelpCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="font-bold text-lg text-slate-300">No exercises matched your filters</h3>
                <p className="text-xs text-slate-500 mt-1">Try resetting your search query or choosing 'All' filters.</p>
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            TAB 4: TRACKERS, CALCULATORS, & HABITS
            ========================================== */}
        {activeSection === 'trackers' && (
          <div className="space-y-12">
            
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <h1 className="text-3xl font-extrabold tracking-tight">Interactive Toolbox</h1>
              <p className="text-slate-400">Keep yourself accountable with real-time feedback. Estimate calorie needs and log simple goals.</p>
            </div>

            {/* TOP ROW GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* TDEE NUTRITION CALCULATOR */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl">
                      <Calculator className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">TDEE Calorie Calculator</h3>
                      <span className="text-xs text-slate-400">Calculate maintenance energy needs.</span>
                    </div>
                  </div>

                  {/* Metric / Imperial toggle */}
                  <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                    <button
                      onClick={() => setUnitSystem('metric')}
                      className={`px-2.5 py-1 rounded font-semibold ${unitSystem === 'metric' ? 'bg-indigo-500 text-white' : 'text-slate-400'}`}
                    >
                      Metric
                    </button>
                    <button
                      onClick={() => setUnitSystem('imperial')}
                      className={`px-2.5 py-1 rounded font-semibold ${unitSystem === 'imperial' ? 'bg-indigo-500 text-white' : 'text-slate-400'}`}
                    >
                      Imperial
                    </button>
                  </div>
                </div>

                <form onSubmit={calculateTDEE} className="space-y-4">
                  {/* Gender Selector */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setCalcGender('female')}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                        calcGender === 'female' 
                          ? 'bg-slate-950 border-indigo-500 text-indigo-300' 
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      Female / AFAB
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalcGender('male')}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                        calcGender === 'male' 
                          ? 'bg-slate-950 border-indigo-500 text-indigo-300' 
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      Male / AMAB
                    </button>
                  </div>

                  {/* Weight / Height / Age conditionally layout */}
                  {unitSystem === 'metric' ? (
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Weight (kg)</label>
                        <input 
                          type="number" 
                          value={calcWeight} 
                          onChange={(e) => setCalcWeight(Math.max(1, parseInt(e.target.value) || 0))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs focus:outline-none focus:border-indigo-500 text-slate-200 text-center"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Height (cm)</label>
                        <input 
                          type="number" 
                          value={calcHeight} 
                          onChange={(e) => setCalcHeight(Math.max(1, parseInt(e.target.value) || 0))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs focus:outline-none focus:border-indigo-500 text-slate-200 text-center"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Age (yrs)</label>
                        <input 
                          type="number" 
                          value={calcAge} 
                          onChange={(e) => setCalcAge(Math.max(1, parseInt(e.target.value) || 0))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs focus:outline-none focus:border-indigo-500 text-slate-200 text-center"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1 col-span-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Weight (lbs)</label>
                          <input 
                            type="number" 
                            value={calcWeightLbs} 
                            onChange={(e) => setCalcWeightLbs(Math.max(1, parseInt(e.target.value) || 0))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs focus:outline-none focus:border-indigo-500 text-slate-200 text-center"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Height (ft)</label>
                          <input 
                            type="number" 
                            value={calcHeightFt} 
                            onChange={(e) => setCalcHeightFt(Math.max(1, parseInt(e.target.value) || 0))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs focus:outline-none focus:border-indigo-500 text-slate-200 text-center"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Height (in)</label>
                          <input 
                            type="number" 
                            value={calcHeightIn} 
                            onChange={(e) => setCalcHeightIn(Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs focus:outline-none focus:border-indigo-500 text-slate-200 text-center"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Age (yrs)</label>
                        <input 
                          type="number" 
                          value={calcAge} 
                          onChange={(e) => setCalcAge(Math.max(1, parseInt(e.target.value) || 0))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs focus:outline-none focus:border-indigo-500 text-slate-200 text-center"
                        />
                      </div>
                    </div>
                  )}

                  {/* Activity Level Selector */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Activity Level</label>
                    <select
                      value={calcActivity}
                      onChange={(e) => setCalcActivity(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs focus:outline-none focus:border-indigo-500 text-slate-300 font-medium"
                    >
                      <option value="1.2">Sedentary (Little to no exercise)</option>
                      <option value="1.375">Lightly Active (1-3 days of exercise/week)</option>
                      <option value="1.55">Moderately Active (3-5 days of moderate exercise/week)</option>
                      <option value="1.725">Very Active (6-7 days of hard exercise/week)</option>
                    </select>
                  </div>

                  {/* Submit CTA */}
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-500/15"
                  >
                    Calculate Maintenance Calories
                  </button>
                </form>

                {/* CALCULATOR OUTPUT */}
                {tdeeResult && (
                  <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-3.5 text-center animate-fadeIn">
                    <span className="text-xs font-bold text-slate-400 block">Estimated TDEE Output</span>
                    <span className="text-3xl font-black text-indigo-400 tracking-tight block">{tdeeResult} Calories / day</span>
                    
                    <div className="grid grid-cols-2 gap-2 text-left pt-2 border-t border-slate-850">
                      <div className="p-2.5 bg-slate-900 rounded-lg">
                        <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Goal: Fat Loss</span>
                        <span className="text-sm font-semibold text-emerald-400">{Math.round(tdeeResult - 450)} kcal</span>
                      </div>
                      <div className="p-2.5 bg-slate-900 rounded-lg">
                        <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Goal: Build Muscle</span>
                        <span className="text-sm font-semibold text-indigo-300">{Math.round(tdeeResult + 300)} kcal</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* GAMIFIED PROGRESS TRACKER */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
                      <Trophy className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Interactive Habit Engine</h3>
                      <span className="text-xs text-slate-400">Complete daily drills to gain XP & level up.</span>
                    </div>
                  </div>
                  <button 
                    onClick={resetTodayProgress} 
                    className="text-[10px] text-slate-500 hover:text-red-400 transition-all font-semibold uppercase tracking-wider"
                  >
                    Reset Engine
                  </button>
                </div>

                {/* WATER TRACKER WIDGET */}
                <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Droplet className="w-4 h-4 text-cyan-400" /> Daily Water Target (8 Glasses)
                    </span>
                    <span className="text-xs font-semibold text-cyan-400">{waterIntake}/8 glasses</span>
                  </div>

                  <div className="grid grid-cols-8 gap-2">
                    {Array.from({ length: 8 }).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          if (idx < waterIntake) {
                            setWaterIntake(idx);
                          } else {
                            setWaterIntake(idx + 1);
                            addXp(5); // Squeezing water logs gives 5 XP
                          }
                        }}
                        className={`h-8 rounded-lg transition-all border ${
                          idx < waterIntake 
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' 
                            : 'bg-slate-900 border-slate-800 text-slate-600 hover:border-slate-700'
                        }`}
                      >
                        💧
                      </button>
                    ))}
                  </div>
                </div>

                {/* QUICK COMPLETED LOGGER */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Log Todays Completed Routine:</span>
                  
                  <div className="space-y-2">
                    {EXERCISE_DATABASE.slice(0, 4).map((ex) => {
                      const isDone = !!trackedExercises[ex.id];
                      return (
                        <div 
                          key={ex.id}
                          className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                            isDone 
                              ? 'bg-indigo-500/10 border-indigo-500/30' 
                              : 'bg-slate-950 border-slate-850'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{ex.gifSim}</span>
                            <div>
                              <span className="block text-xs font-semibold text-slate-200">{ex.name}</span>
                              <span className="block text-[10px] text-slate-500">Earn +25 XP</span>
                            </div>
                          </div>

                          <button
                            onClick={() => completeExerciseLog(ex.id)}
                            disabled={isDone}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              isDone 
                                ? 'bg-indigo-500/20 text-indigo-300 pointer-events-none' 
                                : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800'
                            }`}
                          >
                            {isDone ? 'Completed! ✔' : 'Log Done'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>

            {/* INTEGRATED REST TIMER BOX */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl">
                    <Timer className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Standard Workout Rest Timer</h3>
                    <p className="text-xs text-slate-400">Keep rest periods strictly monitored. Form, recovery and efficiency skyrocket!</p>
                  </div>
                </div>

                {/* Rest Timer Visual Counter */}
                <div className="flex items-center gap-4 bg-slate-950 px-4 py-2 rounded-xl border border-slate-850">
                  <span className="text-2xl font-black text-indigo-400 tracking-wider">
                    {Math.floor(standaloneTime / 60)}:{(standaloneTime % 60).toString().padStart(2, '0')}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setStandaloneActive(!standaloneActive)}
                      className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all"
                    >
                      {standaloneActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    </button>
                    <button
                      onClick={() => {
                        setStandaloneActive(false);
                        setStandaloneTime(60);
                      }}
                      className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-slate-200 transition-all"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick preset triggers */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-850/60">
                <span className="text-xs text-slate-500 font-bold mr-2">Quick Presets:</span>
                {[30, 45, 60, 90].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => {
                      setStandaloneActive(false);
                      setStandaloneTime(preset);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                      standaloneTime === preset 
                        ? 'bg-indigo-500 text-white border-indigo-500' 
                        : 'bg-slate-950 hover:bg-slate-850 text-slate-400 border-slate-800'
                    }`}
                  >
                    {preset} Seconds
                  </button>
                ))}
              </div>
            </div>

            {/* CUSTOM NOTES SECTION */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-yellow-500/10 text-yellow-400 rounded-xl">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Write Down Your Fitness Commitment</h3>
                  <span className="text-xs text-slate-400">Commit in writing to keep yourself focused and on target.</span>
                </div>
              </div>

              <div className="space-y-2">
                <textarea
                  placeholder="Example: I commit to doing 3 workouts a week on Mon, Wed, Fri at 7:00 AM. I want to build strength so I feel more confident."
                  value={customGoalNotes}
                  onChange={(e) => setCustomGoalNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs focus:outline-none focus:border-indigo-500 text-slate-300 min-h-[80px]"
                />
                
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-500">Saved dynamically to memory.</span>
                  <button
                    onClick={() => {
                      setSavedNote(customGoalNotes);
                    }}
                    className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold rounded-lg transition-all"
                  >
                    Save Commitment
                  </button>
                </div>

                {savedNote && (
                  <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg mt-2">
                    <span className="text-[10px] text-emerald-400 font-bold block mb-1">Active Commitment:</span>
                    <p className="text-xs text-slate-300 italic">"{savedNote}"</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* ==========================================
            TAB 5: MYTHS VS FACTS ACCORDION
            ========================================== */}
        {activeSection === 'myths' && (
          <div className="space-y-8 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-extrabold tracking-tight">Fitness Myth Busters</h1>
              <p className="text-slate-400">De-clutter your brain from toxic social media fitness culture with straight scientific truths.</p>
            </div>

            {/* MYTH FLIP BOARD */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {MYTHS_AND_FACTS.map((myth) => {
                const isFlipped = flippedMyth === myth.id;
                return (
                  <div 
                    key={myth.id}
                    onClick={() => setFlippedMyth(isFlipped ? null : myth.id)}
                    className="cursor-pointer group relative text-left"
                  >
                    <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 hover:border-indigo-500/40 transition-all min-h-[180px] flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest bg-red-500/10 px-2 py-0.5 rounded">
                            {myth.badge}
                          </span>
                          <span className="text-xs text-slate-500 font-semibold group-hover:text-slate-300">
                            {isFlipped ? 'Hide Fact ✖' : 'Reveal Fact 🔍'}
                          </span>
                        </div>

                        <h3 className="text-base font-extrabold text-slate-200">
                          "{myth.myth}"
                        </h3>
                      </div>

                      {/* Revealed Fact */}
                      <AnimatePresence>
                        {isFlipped && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden pt-4 border-t border-slate-800/80 mt-4 text-left"
                          >
                            <span className="text-xs font-bold text-emerald-400 block mb-1">Scientific Fact:</span>
                            <p className="text-xs text-slate-400 leading-relaxed">
                              {myth.fact}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ENCOURAGING SUMMARY */}
            <div className="bg-gradient-to-r from-indigo-900/20 to-slate-900 border border-slate-850 p-8 rounded-3xl flex flex-col md:flex-row items-center gap-6">
              <div className="text-6xl">💡</div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-100">The Ultimate Fitness Cheat Code</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Don't follow complex, unsustainable trends. The best program is simply the one you can stick to happily for 6 months without burning out or experiencing joint pain. Focus on sleep, lift a little bit weight or do a few more reps over time, and drink plenty of water. Keep fitness simple!
                </p>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* INTERACTIVE IMMERSIVE GUIDED WORKOUT SCREEN overlay */}
      <AnimatePresence>
        {activeSessionRoutine && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/95 flex items-center justify-center p-4 sm:p-6 md:p-8">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl"
            >
              
              {/* TOP HEADER STATUS */}
              <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
                    <Activity className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider block">Live Workout Player</span>
                    <h2 className="text-sm font-bold text-slate-300">{activeSessionRoutine.name}</h2>
                  </div>
                </div>

                <button
                  onClick={() => setActiveSessionRoutine(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white text-xs font-semibold border border-slate-800 flex items-center gap-1.5"
                >
                  <X className="w-4 h-4" /> Cancel Session
                </button>
              </div>

              {/* OVERALL TIMERS & REST PANEL */}
              {sessionRestActive && (
                <div className="bg-indigo-500/20 text-center py-3.5 px-4 text-xs font-bold border-b border-indigo-500/30 flex items-center justify-center gap-2 text-indigo-300 animate-pulse">
                  <span>💧 Take a Rest! Next set starts in </span>
                  <span className="text-sm font-black bg-slate-950 px-2 py-0.5 rounded text-indigo-400">
                    {sessionRestTimer}s
                  </span>
                  <button 
                    onClick={() => {
                      setSessionRestTimer(0);
                      setSessionRestActive(false);
                    }}
                    className="ml-3 px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[10px]"
                  >
                    Skip Rest ➜
                  </button>
                </div>
              )}

              {/* MAIN CONTENT WORKSPACE */}
              {!sessionFinished ? (
                <div className="p-6 sm:p-8 space-y-6">
                  {/* Progress tracker */}
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Exercise {currentSessionIndex + 1} of {activeSessionRoutine.exercisesList.length}</span>
                    <span className="text-indigo-400 font-bold">Set {currentSessionSet} of 3</span>
                  </div>

                  <div className="flex items-start gap-4">
                    <span className="text-5xl p-4 bg-slate-950 rounded-2xl border border-slate-800 shadow-inner">
                      {activeSessionRoutine.exercisesList[currentSessionIndex].gifSim}
                    </span>
                    <div>
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">CURRENTLY FOCUSING ON:</span>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-100 leading-tight">
                        {activeSessionRoutine.exercisesList[currentSessionIndex].name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">Target Muscles: <span className="text-slate-300">{activeSessionRoutine.exercisesList[currentSessionIndex].target}</span></p>
                    </div>
                  </div>

                  {/* Dynamic checklist / Steps */}
                  <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-850 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-400" /> Real-time Form Checklist:
                    </h4>
                    <ol className="space-y-2.5">
                      {activeSessionRoutine.exercisesList[currentSessionIndex].steps.slice(0, 3).map((st: string, idx: number) => (
                        <li key={idx} className="text-xs text-slate-300 flex items-start gap-2.5 leading-relaxed">
                          <span className="w-4 h-4 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-black flex items-center justify-center mt-0.5">{idx + 1}</span>
                          <span>{st}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* PRO-COACH TIP */}
                  <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl">
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-indigo-400 block mb-0.5">FORM PRO-TIP:</span>
                    <p className="text-xs text-slate-300 italic">"{activeSessionRoutine.exercisesList[currentSessionIndex].tip}"</p>
                  </div>

                  {/* ACTION FOOTER */}
                  <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-3 justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Rest Timer Preset: 60 Seconds</span>
                    </div>

                    <button
                      onClick={handleSetCompleted}
                      className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2"
                    >
                      ✔ Completed Set {currentSessionSet} / 3
                    </button>
                  </div>
                </div>
              ) : (
                /* CELEBRATION COMPLETED VIEW */
                <div className="p-8 text-center space-y-6">
                  <span className="text-7xl block animate-bounce">🏆</span>
                  <div className="space-y-2">
                    <h3 className="text-2xl sm:text-3xl font-black text-emerald-400 leading-tight">Session Cleared!</h3>
                    <p className="text-sm text-slate-300 max-w-md mx-auto">
                      Fantastic work! You successfully accomplished every single recommended set of your routine with pristine posture.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl max-w-xs mx-auto space-y-1">
                    <span className="text-[10px] text-indigo-400 font-extrabold uppercase tracking-wider block">LEVEL ADVANCEMENT REWARD</span>
                    <p className="text-lg font-black text-white">+100 Fitness XP Gained</p>
                    <span className="block text-slate-500 text-[10px]">Level increased smoothly. Keep up the habit!</span>
                  </div>

                  <button
                    onClick={() => {
                      setActiveSessionRoutine(null);
                      // Update main checklists
                      activeSessionRoutine.exercisesList.forEach((e: any) => {
                        setTrackedExercises(prev => ({ ...prev, [e.id]: true }));
                      });
                    }}
                    className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl transition-all"
                  >
                    Collect Rewards & Close HUD
                  </button>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EXERCISE DETAIL MODAL */}
      <AnimatePresence>
        {selectedExercise && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
            >
              {/* Header block with color splash */}
              <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-slate-900 p-6 border-b border-slate-800 relative">
                <button 
                  onClick={() => setSelectedExercise(null)}
                  className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-4">
                  <span className="text-4xl bg-slate-950 p-3 rounded-2xl border border-slate-800 shadow-inner">
                    {selectedExercise.gifSim}
                  </span>
                  <div>
                    <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest block mb-1">
                      {selectedExercise.category} Exercise
                    </span>
                    <h2 className="text-2xl font-black text-slate-100 tracking-tight">{selectedExercise.name}</h2>
                  </div>
                </div>
              </div>

              {/* Core Body Info */}
              <div className="p-6 lg:p-8 space-y-6">
                
                {/* Meta details */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-center">
                    <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">Target Group</span>
                    <span className="text-xs font-semibold text-slate-300 block mt-0.5 truncate">{selectedExercise.target}</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-center">
                    <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">Required Equipment</span>
                    <span className="text-xs font-semibold text-slate-300 block mt-0.5 truncate">{selectedExercise.equipment}</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-center col-span-2 sm:col-span-1">
                    <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">Difficulty Rating</span>
                    <span className="text-xs font-semibold text-emerald-400 block mt-0.5">{selectedExercise.difficulty}</span>
                  </div>
                </div>

                {/* STEPS LIST */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-400 block uppercase tracking-widest flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400" /> Step-by-Step Instructions
                  </span>
                  <ol className="space-y-2.5">
                    {selectedExercise.steps.map((st, i) => (
                      <li key={i} className="text-xs text-slate-300 leading-relaxed flex items-start gap-3">
                        <span className="flex-none w-5 h-5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-black flex items-center justify-center mt-0.5">
                          {i + 1}
                        </span>
                        <span>{st}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* COMMON MISTAKES */}
                <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-red-400 flex items-center gap-1.5 uppercase tracking-widest">
                    <AlertCircle className="w-4 h-4" /> Common Mistakes To Avoid
                  </span>
                  <ul className="space-y-1.5">
                    {selectedExercise.mistakes.map((mist, i) => (
                      <li key={i} className="text-xs text-slate-400 leading-relaxed flex items-start gap-2">
                        <span className="text-red-500 text-xs mt-0.5">❌</span>
                        <span>{mist}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* TIP HERO BOX */}
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-start gap-3.5">
                  <span className="text-2xl mt-0.5">💡</span>
                  <div>
                    <span className="text-[10px] text-emerald-400 font-bold block uppercase tracking-wider">Pro-Tip for Beginners</span>
                    <p className="text-xs text-slate-300 leading-relaxed mt-0.5 italic">
                      "{selectedExercise.tip}"
                    </p>
                  </div>
                </div>

              </div>

              {/* Close Button Footer */}
              <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex justify-end">
                <button
                  onClick={() => setSelectedExercise(null)}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-all"
                >
                  Close Guide
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-12 mt-20 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-indigo-400">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-300 block tracking-wider uppercase text-[10px]">FitStart Fitness Inc.</span>
              <span className="text-[10px] block">Unlocking physical potential simply and stress-free.</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => setActiveSection('home')} className="hover:text-slate-300 transition-all">Home</button>
            <button onClick={() => setActiveSection('quiz')} className="hover:text-slate-300 transition-all">Custom Routine</button>
            <button onClick={() => setActiveSection('library')} className="hover:text-slate-300 transition-all">Exercise Library</button>
            <button onClick={() => setActiveSection('trackers')} className="hover:text-slate-300 transition-all">Calculators</button>
          </div>

          <div>
            <span className="block text-right text-[10px]">Built for absolute beginners worldwide.</span>
            <span className="block text-right text-[9px] text-slate-600 mt-0.5">© {new Date().getFullYear()} FitStart. Free and open source.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}