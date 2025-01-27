'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { PlusCircle, Heart, Sparkles, Search, Plus, Trophy, Edit, Dumbbell, Scale } from 'lucide-react'
import { toast } from "@/components/ui/use-toast"

// Custom color palette
const colors = {
  hotPink: '#FF1F7D',
  orange: '#FF5C00',
  royalBlue: '#4B4AEF',
  navy: '#1F2261',
  green: '#00DC82',
}

interface Value {
  id: string
  name: string
  description: string
  image: string
  timestamp: number
  questions: string[]
}

interface Moment {
  id: string
  title: string
  description: string
  reflection: string
  imageUrl: string
  values: string[]
  strengths: string[]
  timestamp: number
  mood: number
  isDefault?: boolean
}

interface Strength {
  id: string
  name: string
  description: string
  color: string
  reflections: Reflection[]
  activities: string[]
}

interface Reflection {
  id: string
  moment: string
  question1: string
  question2: string
  answer1: string
  answer2: string
  usage: 'overuse' | 'underuse' | 'balanced'
  timestamp: number
}

interface Challenge {
  id: string
  strengthId: string
  description: string
  completed: boolean
  dueDate: number
}

interface Prompt {
  id: string
  title: string
  description: string
  image: string
  question: string
}

const initialValues: Value[] = [
  {
    id: '1',
    name: 'Growth 🌱',
    description: 'Continuously improving and developing oneself.',
    image: '/placeholder.svg?height=400&width=600',
    timestamp: Date.now(),
    questions: [
      "How have you challenged yourself to grow today?",
      "What new skill or knowledge have you acquired recently?",
      "In what areas of your life do you see the most potential for growth?"
    ]
  },
  {
    id: '2',
    name: 'Compassion 💖',
    description: 'Showing empathy and kindness towards others.',
    image: '/placeholder.svg?height=400&width=600',
    timestamp: Date.now(),
    questions: [
      "How have you shown compassion recently?",
      "What acts of kindness have you extended to others?",
      "How are you nurturing empathy in your interactions?"
    ]
  },
  {
    id: '3',
    name: 'Ambition 🚀',
    description: 'Striving to achieve high goals and succeed.',
    image: '/placeholder.svg?height=400&width=600',
    timestamp: Date.now(),
    questions: [
      "What steps did you take toward your goals today?",
      "How are you pushing yourself to reach new heights?",
      "What accomplishments are you aiming for in the near future?"
    ]
  },
  {
    id: '4',
    name: 'Safety 🛡️',
    description: 'Prioritizing security, stability, and a sense of protection.',
    image: '/placeholder.svg?height=400&width=600',
    timestamp: Date.now(),
    questions: [
      "How have you contributed to a safe environment?",
      "What steps have you taken to ensure your personal security?",
      "How are you creating stability in your life?"
    ]
  },
  {
    id: '5',
    name: 'Compassion 💖',
    description: 'Showing empathy and kindness towards others.',
    image: '/placeholder.svg?height=400&width=600',
    timestamp: Date.now(),
    questions: [
      "How have you shown compassion recently?",
      "What acts of kindness have you extended to others?",
      "How are you nurturing empathy in your interactions?"
    ]
  },
  {
    id: '6',
    name: 'Adventure 🌍',
    description: 'Seeking new and exciting experiences.',
    image: '/placeholder.svg?height=400&width=600',
    timestamp: Date.now(),
    questions: [
      "What new experience did you embrace today?",
      "How are you stepping outside of your comfort zone?",
      "What adventure do you want to pursue next?"
    ]
  },
  {
    id: '7',
    name: 'Pleasure 🎉',
    description: 'Enjoying life’s pleasures and savoring joyful moments.',
    image: '/placeholder.svg?height=400&width=600',
    timestamp: Date.now(),
    questions: [
      "How did you find joy in your day?",
      "What small pleasures have you embraced recently?",
      "How are you celebrating life’s moments?"
    ]
  },
  {
    id: '8',
    name: 'Equality ⚖️',
    description: 'Valuing fairness and equal treatment for all.',
    image: '/placeholder.svg?height=400&width=600',
    timestamp: Date.now(),
    questions: [
      "How did you promote fairness today?",
      "In what ways have you advocated for equality?",
      "What actions can you take to support equal treatment for all?"
    ]
  },
  {
    id: '9',
    name: 'Cooperation 🤝',
    description: 'Working collaboratively and fostering teamwork.',
    image: '/placeholder.svg?height=400&width=600',
    timestamp: Date.now(),
    questions: [
      "How did you collaborate effectively with others?",
      "What role did you play in a recent team effort?",
      "How are you supporting cooperation in your community?"
    ]
  },
  {
    id: '10',
    name: 'Self-direction 🧭',
    description: 'Guiding yourself and making autonomous decisions.',
    image: '/placeholder.svg?height=400&width=600',
    timestamp: Date.now(),
    questions: [
      "How have you taken control of your path?",
      "What decisions have you made independently?",
      "How are you staying true to your goals and values?"
    ]
  },
  {
    id: '11',
    name: 'Tradition 🎎',
    description: 'Respecting customs, heritage, and long-standing values.',
    image: '/placeholder.svg?height=400&width=600',
    timestamp: Date.now(),
    questions: [
      "How are you honoring tradition in your life?",
      "What customs or values are important to you?",
      "How do you celebrate your cultural heritage?"
    ]
  },
  {
    id: '12',
    name: 'Power 👑',
    description: 'Asserting authority and seeking influence over outcomes.',
    image: '/placeholder.svg?height=400&width=600',
    timestamp: Date.now(),
    questions: [
      "How did you assert yourself today?",
      "In what ways are you working to influence outcomes?",
      "How are you balancing authority with responsibility?"
    ]
  },
  {
    id: '13',
    name: 'Achievement 🏆',
    description: 'Striving to succeed and reach personal goals.',
    image: '/placeholder.svg?height=400&width=600',
    timestamp: Date.now(),
    questions: [
      "What accomplishments did you achieve today?",
      "How are you progressing toward your goals?",
      "What is your next major milestone?"
    ]
  },
]

const initialStrengths: Strength[] = [
  {
    id: '1',
    name: 'Creativity 💡',
    description: 'Thinking of novel and productive ways to conceptualize and do things.',
    color: colors.navy,
    reflections: [],
    activities: [
      'Try a new hobby or artistic pursuit',
      'Brainstorm solutions to a problem',
      'Redesign your workspace'
    ]
  },
  {
    id: '2',
    name: 'Curiosity 🔍',
    description: 'Taking an interest in ongoing experience for its own sake.',
    color: colors.navy,
    reflections: [],
    activities: [
      'Learn about a new topic',
      'Ask thoughtful questions',
      'Explore a new place'
    ]
  },
  {
      id: '3',
      name: 'Judgment ⚖️',
      description: 'Making thoughtful and balanced decisions.',
      color: colors.navy,
      reflections: [],
      activities: [
          'Weigh pros and cons before making a decision',
          'Consider multiple perspectives',
          'Reflect on recent decisions for lessons learned'
      ]
  },
  {
      id: '4',
      name: 'Love of Learning 📚',
      description: 'Mastering new skills and knowledge.',
      color: colors.navy,
      reflections: [],
      activities: [
          'Take a course or workshop',
          'Read about a topic of interest',
          'Practice a skill you want to improve'
      ]
  },
  {
      id: '5',
      name: 'Perspective 🌄',
      description: 'Providing wise counsel to others.',
      color: colors.navy,
      reflections: [],
      activities: [
          'Share advice based on your experience',
          'Reflect on the bigger picture',
          'Help someone see a new point of view'
      ]
  },
  {
      id: '6',
      name: 'Bravery 🦁',
      description: 'Facing challenges with courage and determination.',
      color: colors.navy,
      reflections: [],
      activities: [
          'Do something outside your comfort zone',
          'Stand up for your beliefs',
          'Take on a challenging task'
      ]
  },
  {
      id: '7',
      name: 'Perseverance 🏃',
      description: 'Finishing what you start and overcoming obstacles.',
      color: colors.navy,
      reflections: [],
      activities: [
          'Set a challenging goal and stick to it',
          'Work through a difficult problem',
          'Celebrate progress towards long-term goals'
      ]
  },
  {
      id: '8',
      name: 'Honesty 🗣️',
      description: 'Speaking the truth and acting with integrity.',
      color: colors.navy,
      reflections: [],
      activities: [
          'Be open about your feelings',
          'Practice transparent communication',
          'Hold yourself accountable'
      ]
  },
  {
      id: '9',
      name: 'Zest ⚡',
      description: 'Approaching life with excitement and energy.',
      color: colors.navy,
      reflections: [],
      activities: [
          'Engage in a high-energy activity',
          'Start the day with enthusiasm',
          'Bring positivity to those around you'
      ]
  },
  {
      id: '10',
      name: 'Love 💖',
      description: 'Valuing close relationships with others.',
      color: colors.navy,
      reflections: [],
      activities: [
          'Spend quality time with a loved one',
          'Express appreciation for others',
          'Listen actively to someone you care about'
      ]
  },
  {
      id: '11',
      name: 'Kindness 🤲',
      description: 'Doing favors and good deeds for others.',
      color: colors.navy,
      reflections: [],
      activities: [
          'Help someone in need',
          'Perform a random act of kindness',
          'Volunteer your time or resources'
      ]
  },
  {
      id: '12',
      name: 'Social Intelligence 🧠',
      description: 'Being aware of the motives and feelings of others.',
      color: colors.navy,
      reflections: [],
      activities: [
          'Observe body language in conversations',
          'Practice active listening',
          'Show empathy in interactions'
      ]
  },
  {
      id: '13',
      name: 'Teamwork 🤝',
      description: 'Working well as a member of a group or team.',
      color: colors.navy,
      reflections: [],
      activities: [
          'Collaborate on a group project',
          'Encourage others to share their ideas',
          'Support teammates in reaching goals'
      ]
  },
  {
      id: '14',
      name: 'Fairness ⚖️',
      description: 'Treating all people equally and justly.',
      color: colors.navy,
      reflections: [],
      activities: [
          'Ensure everyone’s voice is heard',
          'Make impartial decisions',
          'Stand up for those who are treated unfairly'
      ]
  },
  {
      id: '15',
      name: 'Leadership 🌟',
      description: 'Encouraging a group to get things done and maintain good relations.',
      color: colors.navy,
      reflections: [],
      activities: [
          'Motivate others toward a common goal',
          'Lead by example in difficult situations',
          'Help resolve team conflicts'
      ]
  },
  {
      id: '16',
      name: 'Forgiveness 🤲',
      description: 'Forgiving those who have wronged you.',
      color: colors.navy,
      reflections: [],
      activities: [
          'Reflect on times you were forgiven',
          'Let go of resentment',
          'Extend understanding to someone who hurt you'
      ]
  },
  {
      id: '17',
      name: 'Humility 🙏',
      description: 'Letting accomplishments speak for themselves.',
      color: colors.navy,
      reflections: [],
      activities: [
          'Practice listening more than speaking',
          'Acknowledge others’ strengths',
          'Be open to learning from others'
      ]
  },
  {
      id: '18',
      name: 'Prudence 🛑',
      description: 'Being careful about one’s choices; not taking unnecessary risks.',
      color: colors.navy,
      reflections: [],
      activities: [
          'Consider the consequences before acting',
          'Plan ahead for potential challenges',
          'Take time to make thoughtful decisions'
      ]
  },
  {
      id: '19',
      name: 'Self-Regulation 🧘',
      description: 'Managing your emotions and behaviors effectively.',
      color: colors.navy,
      reflections: [],
      activities: [
          'Practice mindfulness and deep breathing',
          'Set boundaries to manage stress',
          'Reflect on emotional responses'
      ]
  },
  {
      id: '20',
      name: 'Appreciation of Beauty  🌅',
      description: 'Noticing and appreciating beauty, excellence, and skill in all domains.',
      color: colors.navy,
      reflections: [],
      activities: [
          'Spend time in nature and observe details',
          'Celebrate others’ achievements',
          'Attend an art or music event'
      ]
  },
  {
      id: '21',
      name: 'Gratitude 🙏',
      description: 'Being aware and thankful for the good things that happen.',
      color: colors.navy,
      reflections: [],
      activities: [
          'Write a daily gratitude list',
          'Express appreciation to someone',
          'Reflect on positive aspects of your life'
      ]
  },
  {
      id: '22',
      name: 'Hope 🌈',
      description: 'Expecting the best and working to achieve it.',
      color: colors.navy,
      reflections: [],
      activities: [
          'Set goals for the future',
          'Visualize positive outcomes',
          'Encourage others to stay optimistic'
      ]
  },
  {
      id: '23',
      name: 'Humor 😂',
      description: 'Liking to laugh and tease; bringing smiles to others.',
      color: colors.navy,
      reflections: [],
      activities: [
          'Share a funny story with a friend',
          'Look for humor in everyday situations',
          'Watch a comedy or read a humorous book'
      ]
  },
  {
      id: '24',
      name: 'Spirituality 🕊️',
      description: 'Having coherent beliefs about the higher purpose and meaning of life.',
      color: colors.navy,
      reflections: [],
      activities: [
          'Engage in a spiritual practice or ritual',
          'Reflect on life’s purpose',
          'Spend time in meditation or prayer'
      ]
  }
]

const initialMoments: Moment[] = [
  {
    id: 'welcome',
    title: "Beginning My Personal Growth Journey",
    description: "Today marks the start of my intentional journey towards personal growth and self-discovery. I'm excited to document my moments, explore my values, and develop my strengths.",
    reflection: "This moment is meaningful because it represents my commitment to becoming the best version of myself. By starting this journal, I'm taking an active step towards understanding my values and leveraging my strengths.",
    imageUrl: "/default-moment-image.jpeg",
    values: ['1'],
    strengths: ['1'],
    timestamp: Date.now(),
    mood: 5,
    isDefault: true
  }
]

const momentPrompts: Prompt[] = [
  {
    id: 'awe',
    title: 'Awe',
    description: 'Did something make you feel awe?',
    image: 'images/moments/1.png?height=600&width=400',
    question: 'What experience made you feel a sense of awe?'
  },
  {
    id: 'joy',
    title: 'Joy',
    description: 'Did something bring you joy?',
    image: 'images/moments/2.png?height=300&width=400',
    question: 'What experience made you feel a sense of joy?'
  },
  {
    id: 'uncertainty',
    title: 'Uncertainty',
    description: 'Did you feel uncertain about something?',
    image: 'images/moments/3.png?height=300&width=400',
    question: 'What experience made you feel a sense of uncertainty?'
  },
  {
    id: 'meaningful_moments',
    title: 'Meaningful Moments',
    description: 'Did you experience a meaningful moment?',
    image: 'images/moments/4.png?height=300&width=400',
    question: 'What experience felt particularly meaningful to you?'
  },
  {
    id: 'different_perspectives',
    title: 'Different Perspectives',
    description: 'Did you gain a new perspective?',
    image: 'images/moments/5.png?height=300&width=400',
    question: 'What experience helped you see things differently?'
  },
  {
    id: 'learning_about_yourself',
    title: 'Learning About Yourself',
    description: 'Did you learn something new about yourself?',
    image: 'images/moments/6.png?height=300&width=400',
    question: 'What experience taught you something new about yourself?'
  },
  {
    id: 'sharing_with_others',
    title: 'Sharing with Others',
    description: 'Did you share something meaningful with someone?',
    image: 'images/moments/7.png?height=300&width=400',
    question: 'What experience did you share with others?'
  },
  {
    id: 'supporting_others',
    title: 'Supporting Others',
    description: 'Did you support someone else?',
    image: 'images/moments/8.png?height=300&width=400',
    question: 'What experience allowed you to support others?'
  },
  {
    id: 'accomplishment',
    title: 'Accomplishment',
    description: 'Did you accomplish something important?',
    image: 'images/moments/9.png?height=300&width=400',
    question: 'What experience made you feel accomplished?'
  },
  {
    id: 'challenges',
    title: 'Challenges',
    description: 'Did you face a challenge?',
    image: 'images/moments/10.png?height=300&width=400',
    question: 'What challenge did you face?'
  },
  {
    id: 'interactions_with_others',
    title: 'Interactions with Others',
    description: 'Did you have a meaningful interaction?',
    image: 'images/moments/11.png?height=300&width=400',
    question: 'What interaction with others stood out to you?'
  },
  {
    id: 'insights',
    title: 'Insights',
    description: 'Did you gain a new insight?',
    image: 'images/moments/12.png?height=300&width=400',
    question: 'What insight did you gain?'
  },
  {
    id: 'proud_moments',
    title: 'Proud Moments',
    description: 'Did you feel proud of something?',
    image: 'images/moments/13.png?height=300&width=400',
    question: 'What moment made you feel proud?'
  }
]

const valuePrompts: Prompt[] = [
  {
    id: 'stand_up',
    title: 'Standing Up',
    description: 'A time when you stood up for something important',
    image: 'images/values/1.png?height=600&width=400',
    question: 'Was there a time when you chose to stand up for something important to you?'
  },
  {
    id: 'peace',
    title: 'Peace and Fulfillment',
    description: 'A moment of true peace or fulfillment',
    image: 'images/values/2.png?height=600&width=400',
    question: 'Was there a time you felt truly at peace or fulfilled?'
  },
  {
    id: 'engagement',
    title: 'Full Engagement',
    description: 'A time when you were fully engaged in something',
    image: 'images/values/3.png?height=600&width=400',
    question: 'Is there a time you were fully engaged in something, losing track of time?'
  },
  {
    id: 'assumptions',
    title: 'Challenging Assumptions',
    description: 'When your assumptions were proven wrong',
    image: 'images/values/4.png?height=600&width=400',
    question: 'Have your assumptions been proven wrong?'
  },
  {
    id: 'true_decision',
    title: 'True to Yourself',
    description: 'A decision that felt true to you',
    image: 'images/values/5.png?height=600&width=400',
    question: 'Is there a decision that you made because it felt true to you?'
  },
  {
    id: 'playful',
    title: 'Playfulness',
    description: 'Something that encouraged your playful side',
    image: 'images/values/6.png?height=600&width=400',
    question: 'Is there something that encouraged your playful side?'
  },
  {
    id: 'easier_option',
    title: 'Choosing the Easier Path',
    description: 'A time you chose the easier option',
    image: 'images/values/7.png?height=600&width=400',
    question: 'Is there a time you chose the easier option in life?'
  },
  {
    id: 'failure',
    title: 'Learning from Failure',
    description: 'Something you tried but failed to achieve',
    image: 'images/values/8.png?height=600&width=400',
    question: 'Is there something you tried to do but failed to achieve, but would do all over again?'
  },
  {
    id: 'resonance',
    title: 'Media Resonance',
    description: 'A film or media that particularly resonated with you',
    image: 'images/values/9.png?height=600&width=400',
    question: 'Have you watched a film or other media that you particularly resonated with?'
  },
  {
    id: 'collaboration',
    title: 'Collaborative Achievement',
    description: 'A project you worked on with others',
    image: 'images/values/10.png?height=600&width=400',
    question: 'Is there a project that you worked with others on to achieve?'
  },
  {
    id: 'curiosity',
    title: 'Spark of Curiosity',
    description: 'Something that sparked your curiosity',
    image: 'images/values/11.png?height=600&width=400',
    question: 'Did something spark your curiosity?'
  },
  {
    id: 'authenticity',
    title: 'Genuine Self',
    description: 'A time you felt genuinely yourself',
    image: 'images/values/12.png?height=600&width=400',
    question: 'Is there a time that you felt genuinely yourself?'
  }
]

export default function PersonalGrowthJournal() {
  const [showSplash, setShowSplash] = useState(true)
  const [values, setValues] = useState<Value[]>(initialValues)
  const [moments, setMoments] = useState<Moment[]>(initialMoments)
  const [userMoments, setUserMoments] = useState<Moment[]>([])
  const [strengths, setStrengths] = useState<Strength[]>(initialStrengths)
  const [showNewMomentDialog, setShowNewMomentDialog] = useState(false)
  const [showNewValueDialog, setShowNewValueDialog] = useState(false)
  const [showValuePromptDialog, setShowValuePromptDialog] = useState(false)
  const [showNewStrengthDialog, setShowNewStrengthDialog] = useState(false)
  const [selectedValue, setSelectedValue] = useState<Value | null>(null)
  const [selectedStrength, setSelectedStrength] = useState<Strength | null>(null)
  const [editingMoment, setEditingMoment] = useState<Moment | null>(null)
  const [editingValue, setEditingValue] = useState<Value | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showGuidedReflection, setShowGuidedReflection] = useState(false)
  const [reflectionStep, setReflectionStep] = useState(0)
  const [currentReflection, setCurrentReflection] = useState<Partial<Reflection>>({})
  const [showInsights, setShowInsights] = useState(false)
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [showNewChallengeDialog, setShowNewChallengeDialog] = useState(false)
  const [showMomentDetailDialog, setShowMomentDetailDialog] = useState(false)
  const [selectedMoment, setSelectedMoment] = useState<Moment | null>(null)
  const [showValueDetailDialog, setShowValueDetailDialog] = useState(false)
  const [showPromptDialog, setShowPromptDialog] = useState(false)
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null)

  useEffect(() => {
    // Generate weekly challenges
    const generateWeeklyChallenges = () => {
      const newChallenges = strengths.map(strength => ({
        id: Date.now().toString() + strength.id,
        strengthId: strength.id,
        description: `Practice ${strength.name} this week: ${strength.activities[0]}`,
        completed: false,
        dueDate: Date.now() + 7 * 24 * 60 * 60 * 1000 // 1 week from now
      }))
      setChallenges(newChallenges)
    }

    if (challenges.length === 0) {
      generateWeeklyChallenges()
    }
  }, [strengths, challenges.length])

  // Function to format date in British format (day-month-year)
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  // Function to handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you would upload to a server and get back a URL
      const imageUrl = URL.createObjectURL(file)
      return imageUrl
    }
    return null
  }

  // Function to add or edit a moment
  const addOrEditMoment = async (data: { 
    title: string; 
    description: string; 
    reflection: string; 
    image: File | null; 
    values: string[]; 
    strengths: string[]; 
    mood: number 
  }) => {
    let imageUrl = data.image ? await handleImageUpload({ target: { files: [data.image] } } as any) : '';

    if (!imageUrl && editingMoment) {
      imageUrl = editingMoment.imageUrl; // Keep the existing image if no new one is uploaded
    }

    const newMoment: Moment = {
      id: editingMoment ? editingMoment.id : Date.now().toString(),
      title: data.title,
      description: data.description,
      reflection: data.reflection,
      imageUrl: imageUrl || '/placeholder.svg?height=200&width=200',
      values: data.values,
      strengths: data.strengths,
      timestamp: editingMoment ? editingMoment.timestamp : Date.now(),
      mood: data.mood,
    };

    if (editingMoment) {
      setUserMoments(userMoments.map(m => m.id === editingMoment.id ? newMoment : m));
      toast({
        title: "Moment updated",
        description: "Your moment has been successfully updated.",
      })
    } else {
      setUserMoments([newMoment, ...userMoments]);
      toast({
        title: "Moment added",
        description: "Your new moment has been successfully added.",
      })
    }
    setEditingMoment(null);
    setShowNewMomentDialog(false);
  };

  const handleEditMoment = (moment: Moment) => {
    setEditingMoment(moment);
    setShowNewMomentDialog(true);
    setShowMomentDetailDialog(false);
  };

  const handleStrengthSelect = (strength: Strength) => {
    setSelectedStrength(strength)
    setReflectionStep(0)
    setCurrentReflection({})
  }

  const handleReflectionSubmit = () => {
    if (selectedStrength && currentReflection.moment && currentReflection.answer1 && currentReflection.answer2) {
      const usage = determineUsage(currentReflection.answer1)
      const newReflection: Reflection = {
        id: Date.now().toString(),
        moment: currentReflection.moment,
        question1: getQuestion1(selectedStrength),
        question2: getQuestion2(selectedStrength),
        answer1: currentReflection.answer1,
        answer2: currentReflection.answer2,
        usage,
        timestamp: Date.now()
      }
      setStrengths(strengths.map(s => 
        s.id === selectedStrength.id 
          ? { ...s, reflections: [...s.reflections, newReflection] }
          : s
      ))
      setShowInsights(true)
    }
  }

  const handleAddNewStrength = (data: { name: string; description: string }) => {
    const newStrength: Strength = {
      id: Date.now().toString(),
      name: data.name,
      description: data.description,
      color: colors[Object.keys(colors)[Math.floor(Math.random() * Object.keys(colors).length)] as keyof typeof colors],
      reflections: [],
      activities: ['Explore this strength', 'Practice in daily life', 'Reflect on your progress']
    }
    setStrengths([...strengths, newStrength])
    setShowNewStrengthDialog(false)
  }

  const handleAddNewChallenge = (data: { strengthId: string; description: string }) => {
    const newChallenge: Challenge = {
      id: Date.now().toString(),
      strengthId: data.strengthId,
      description: data.description,
      completed: false,
      dueDate: Date.now() + 7 * 24 * 60 * 60 * 1000 // 1 week from now
    }
    setChallenges([...challenges, newChallenge])
    setShowNewChallengeDialog(false)
  }

  const determineUsage = (answer: string): 'overuse' | 'underuse' | 'balanced' => {
    const lowerAnswer = answer.toLowerCase()
    if (lowerAnswer.includes('too much') || lowerAnswer.includes('overwhelmed')) return 'overuse'
    if (lowerAnswer.includes('not enough') || lowerAnswer.includes('could have done more')) return 'underuse'
    return 'balanced'
  }

  const getQuestion1 = (strength: Strength) => `How did you use your ${strength.name} in this situation?`

  const getQuestion2 = (strength: Strength) => `What might help you balance your use of ${strength.name} in the future?`

  const getInsightMessage = (usage: 'overuse' | 'underuse' | 'balanced') => {
    switch (usage) {
      case 'overuse':
        return "It seems you might be overusing this strength. Consider finding ways to moderate its use."
      case 'underuse':
        return "You might be underusing this strength. Try to find more opportunities to apply it."
      case 'balanced':
        return "Great job! You're using this strength in a balanced way. Keep it up!"
    }
  }

  const getChartData = (strength: Strength) => {
    return strength.reflections.map(reflection => ({
      date: formatDate(new Date(reflection.timestamp)),
      value: reflection.usage === 'balanced' ? 2 : reflection.usage === 'overuse' ? 3 : 1
    }))
  }

  const renderReflectionStep = () => {
    switch (reflectionStep) {
      case 0:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Recall a Moment</h3>
            <p>Think of a time when you used your {selectedStrength?.name} strength.</p>
            <Textarea 
              placeholder="Describe the situation..."
              value={currentReflection.moment || ''}
              onChange={(e) => setCurrentReflection({...currentReflection, moment: e.target.value})}
            />
          </div>
        )
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Reflect on Your Use</h3>
            <p>{getQuestion1(selectedStrength!)}</p>
            <Textarea 
              placeholder="Your answer..."
              value={currentReflection.answer1 || ''}
              onChange={(e) => setCurrentReflection({...currentReflection, answer1: e.target.value})}
            />
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Consider Future Balance</h3>
            <p>{getQuestion2(selectedStrength!)}</p>
            <Textarea 
              placeholder="Your thoughts..."
              value={currentReflection.answer2 || ''}
              onChange={(e) => setCurrentReflection({...currentReflection, answer2: e.target.value})}
            />
          </div>
        )
    }
  }

  const handlePromptSelect = (prompt: Prompt, isValuePrompt: boolean) => {
    setSelectedPrompt(prompt)
    if (isValuePrompt) {
      setShowValuePromptDialog(true)
    } else {
      setShowPromptDialog(true)
    }
  }

  const handleValueSelect = (value: Value) => {
    setSelectedValue(value)
    setShowValueDetailDialog(true)
  }

  if (showSplash) {
    return (
      <motion.div 
        className="min-h-screen bg-white flex flex-col items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="flex justify-center items-center mb-8">
          <motion.div
            className="w-24 h-24 mx-4"
            animate={{ 
              rotate: [0, 360],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <Heart className="w-full h-full" style={{ color: colors.hotPink }} />
          </motion.div>
          <motion.div
            className="w-24 h-24 mx-4"
            animate={{ 
              scale: [1, 1.2, 1],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Scale className="w-full h-full" style={{ color: colors.royalBlue }} />
          </motion.div>
          <motion.div
            className="w-24 h-24 mx-4"
            animate={{ 
              rotate: [0, -10, 10, -10, 10, 0],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Dumbbell className="w-full h-full" style={{ color: colors.green }} />
          </motion.div>
        </div>
        <motion.h1 
          className="text-4xl md:text-6xl font-bold mb-4 text-center bg-gradient-to-r from-[#FF1F7D] via-[#4B4AEF] to-[#00DC82] text-transparent bg-clip-text"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Personal Growth Journal
        </motion.h1>
        <motion.p 
          className="text-xl mb-8 text-center max-w-md text-[#1F2261]"
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.7 }}
        >
          Discover your moments, values, and strengths
        </motion.p>
        <motion.button
          className="px-8 py-3 bg-gradient-to-r from-[#FF1F7D] to-[#4B4AEF] text-white rounded-full font-semibold text-lg shadow-lg hover:opacity-90 transition duration-300"
          onClick={() => setShowSplash(false)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Begin Your Journey
        </motion.button>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4B4AEF]/5 to-[#FF1F7D]/5 p-4 md:p-8">
      <h1 className="text-3xl font-bold text-[#1F2261] mb-8 text-center">Personal Growth Journal</h1>
      
      <Tabs defaultValue="moments" className="max-w-7xl mx-auto">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="moments">Moments</TabsTrigger>
          <TabsTrigger value="values">Values</TabsTrigger>
          <TabsTrigger value="strengths">Strengths</TabsTrigger>
        </TabsList>

        <TabsContent value="moments">
          <div className="flex justify-end mb-6">
            <Button
              onClick={() => setShowNewMomentDialog(true)}
              className="bg-gradient-to-r from-[#FF1F7D] to-[#4B4AEF] text-white hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Moment
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {momentPrompts.map((prompt) => (
              <Card 
                key={prompt.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow flex flex-col"
                onClick={() => handlePromptSelect(prompt, false)}
              >
                <div className="relative pt-[100%] overflow-hidden">
                  <img 
                    src={prompt.image} 
                    alt={prompt.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="p-4 flex-grow">
                  <CardTitle className="text-lg">{prompt.title}</CardTitle>
                  <CardDescription>{prompt.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...moments, ...userMoments].map((moment) => (
              <Card 
                key={moment.id} 
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" 
                onClick={() => {
                  setSelectedMoment(moment);
                  setShowMomentDetailDialog(true);
                }}
              >
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={moment.imageUrl} 
                    alt={moment.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg sm:text-xl truncate">{moment.title}</CardTitle>
                  <CardDescription className="text-sm">{formatDate(new Date(moment.timestamp))}</CardDescription>
                </CardHeader>
                {moment.isDefault && (
                  <CardFooter>
                    <p className="text-sm text-muted-foreground">Default moment (view only)</p>
                  </CardFooter>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="values">
          <div className="grid gap-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold" style={{ color: colors.navy }}>Your Core Values</h2>
            </div>
            
            <div className="relative w-full mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search values..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {valuePrompts.map((prompt) => (
                <Card 
                  key={prompt.id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow flex flex-col"
                  onClick={() => handlePromptSelect(prompt, true)}
                >
                  <div className="relative pt-[100%] overflow-hidden">
                    <img 
                      src={prompt.image} 
                      alt={prompt.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader className="p-4 flex-grow">
                    <CardTitle className="text-lg">{prompt.title}</CardTitle>
                    <CardDescription>{prompt.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {values.filter(value => 
                value.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                value.description.toLowerCase().includes(searchQuery.toLowerCase())
              ).map((value) => (
                <Card 
                  key={value.id} 
                  className="group relative overflow-hidden cursor-pointer" 
                  onClick={() => handleValueSelect(value)}
                >
                  <div className="absolute inset-0">
                    <img 
                      src={value.image} 
                      alt={value.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
                  </div>
                  <CardContent className="relative p-4 flex flex-col items-center justify-end min-h-[200px]">
                    <h3 className="text-xl font-bold text-white text-center">{value.name}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="strengths">
          <div className="grid gap-6">
            <div className="flex justify-end mb-6">
              <Button
                onClick={() => setShowNewStrengthDialog(true)}
                className="bg-gradient-to-r from-[#FF1F7D] to-[#4B4AEF] text-white hover:opacity-90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Strength
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {strengths.map((strength) => (
                <Card key={strength.id} className="overflow-hidden">
                  <CardHeader style={{ backgroundColor: strength.color }} className="text-white">
                    <CardTitle className="flex items-center justify-between">
                      <span>{strength.name}</span>
                    </CardTitle>
                    <CardDescription className="text-white/80">
                      {strength.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="font-semibold mb-2">Reflections: {strength.reflections.length}</p>
                    <Progress value={strength.reflections.length * 10} className="mb-4" />
                    
                    {strength.reflections.length > 0 && (
                      <div className="h-32 mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={getChartData(strength)}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis domain={[0, 4]} ticks={[1, 2, 3]} />
                            <Tooltip />
                            <Line 
                              type="monotone" 
                              dataKey="value" 
                              stroke={strength.color} 
                              strokeWidth={2}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}

                    {strength.reflections.length > 0 && 
                      strength.reflections[strength.reflections.length - 1].usage === 'underuse' && (
                      <div className="mt-4 p-4 bg-[#4B4AEF]/10 rounded-lg">
                        <h4 className="font-semibold mb-2">Suggested Activities:</h4>
                        <ul className="list-disc pl-4 space-y-1">
                          {strength.activities.map((activity, index) => (
                            <li key={index}>{activity}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={showNewMomentDialog} onOpenChange={setShowNewMomentDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingMoment ? 'Edit Moment' : 'Add New Moment'}</DialogTitle>
            <DialogDescription>
              {editingMoment ? 'Update your moment' : 'Capture a meaningful moment in your journey'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            addOrEditMoment({
              title: formData.get('title') as string,
              description: formData.get('description') as string,
              reflection: formData.get('reflection') as string,
              image: (formData.get('image') as File) || null,
              values: formData.getAll('values') as string[],
              strengths: formData.getAll('strengths') as string[],
              mood: 3, // Default mood since we're removing the slider
            })
          }}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" required defaultValue={editingMoment?.title} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">What happened?</Label>
                <Textarea id="description" name="description" required defaultValue={editingMoment?.description} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reflection">Why was this meaningful?</Label>
                <Textarea id="reflection" name="reflection" required defaultValue={editingMoment?.reflection} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">Add an Image</Label>
                <Input id="image" name="image" type="file" accept="image/*" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="values">Associated Values</Label>
                <Select name="values">
                  <SelectTrigger>
                    <SelectValue placeholder="Select values" />
                  </SelectTrigger>
                  <SelectContent>
                    {values.map((value) => (
                      <SelectItem key={value.id} value={value.id}>
                        {value.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="strengths">Associated Strengths</Label>
                <Select name="strengths">
                  <SelectTrigger>
                    <SelectValue placeholder="Select strengths" />
                  </SelectTrigger>
                  <SelectContent>
                    {strengths.map((strength) => (
                      <SelectItem key={strength.id} value={strength.id}>
                        {strength.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full bg-gradient-to-r from-[#FF1F7D] to-[#4B4AEF] text-white hover:opacity-90">
                {editingMoment ? 'Update Moment' : 'Save Moment'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showNewStrengthDialog} onOpenChange={setShowNewStrengthDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Strength</DialogTitle>
            <DialogDescription>
              Define a new strength to track and develop
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            handleAddNewStrength({
              name: formData.get('name') as string,
              description: formData.get('description') as string,
            })
          }}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Strength Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" required />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit"
              className="bg-[#FF5C00] hover:bg-[#FF5C00]/90 text-white">Add Strength</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showInsights} onOpenChange={setShowInsights}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reflection Insights</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-lg font-semibold mb-4">
              {getInsightMessage(determineUsage(currentReflection.answer1 || ''))}
            </p>
            <div className="space-y-2">
              <p><strong>Your Moment:</strong> {currentReflection.moment}</p>
              <p><strong>Your Use:</strong> {currentReflection.answer1}</p>
              <p><strong>Future Balance:</strong> {currentReflection.answer2}</p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => {
              setShowInsights(false)
              setSelectedStrength(null)
              setReflectionStep(0)
              setCurrentReflection({})
            }}className="bg-[#FF5C00] hover:bg-[#FF5C00]/90 text-white">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showMomentDetailDialog} onOpenChange={setShowMomentDetailDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedMoment?.title}</DialogTitle>
            <DialogDescription>
              {formatDate(new Date(selectedMoment?.timestamp || 0))}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <img 
              src={selectedMoment?.imageUrl} 
              alt={selectedMoment?.title} 
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="font-semibold mb-2">What happened:</h3>
            <p className="mb-4">{selectedMoment?.description}</p>
            <h3 className="font-semibold mb-2">Why it was meaningful:</h3>
            <p className="mb-4">{selectedMoment?.reflection}</p>
            <h3 className="font-semibold mb-2">Associated Values:</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedMoment?.values.map(valueId => {
                const value = values.find(v => v.id === valueId)
                return value ? (
                  <span key={value.id} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {value.name}
                  </span>
                ) : null
              })}
            </div>
            <h3 className="font-semibold mb-2">Associated Strengths:</h3>
            <div className="flex flex-wrap gap-2">
              {selectedMoment?.strengths.map(strengthId => {
                const strength = strengths.find(s => s.id === strengthId)
                return strength ? (
                  <span key={strength.id} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {strength.name}
                  </span>
                ) : null
              })}
            </div>
          </div>
          <DialogFooter>
            {!selectedMoment?.isDefault && (
              <Button onClick={() => handleEditMoment(selectedMoment!)}
              className="bg-[#FF5C00] hover:bg-[#FF5C00]/90 text-white">Edit Moment</Button>
            )}
            <Button onClick={() => setShowMomentDetailDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showValueDetailDialog} onOpenChange={setShowValueDetailDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedValue?.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <img 
              src={selectedValue?.image} 
              alt={selectedValue?.name} 
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="font-semibold mb-2">What this value means:</h3>
            <p className="mb-4">{selectedValue?.description}</p>
            <h3 className="font-semibold mb-2">Reflection Questions:</h3>
            <ul className="list-disc pl-5 space-y-2">
              {selectedValue?.questions.map((question, index) => (
                <li key={index}>{question}</li>
              ))}
            </ul>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowValueDetailDialog(false)} className="bg-[#FF5C00] hover:bg-[#FF5C00]/90 text-white">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showValuePromptDialog} onOpenChange={setShowValuePromptDialog}>
  <DialogContent className="sm:max-w-[600px]">
    <DialogHeader>
      <DialogTitle>{selectedPrompt?.title}</DialogTitle>
      <DialogDescription>{selectedPrompt?.description}</DialogDescription>
    </DialogHeader>
    <div className="py-4">
      <div className="w-full h-[400px] mb-4 overflow-hidden rounded-md">
        <img 
          src={selectedPrompt?.image} 
          alt={selectedPrompt?.title} 
          className="object-contain w-full h-full"
        />
      </div>
      <h3 className="font-semibold mb-2">{selectedPrompt?.question}</h3>
      <Textarea 
        placeholder="What happened?"
        className="min-h-[100px] mb-4"
      />
      <Textarea 
        placeholder="Why was this valuable to you?"
        className="min-h-[100px]"
      />
    </div>
    <DialogFooter>
      <Button onClick={() => {
        setShowValuePromptDialog(false)
        // Here you would typically save the reflection and potentially update the values
        toast({
          title: "Reflection saved",
          description: "Your value reflection has been saved successfully.",
        })
      }} className="bg-[#FF5C00] hover:bg-[#FF5C00]/90 text-white">
        Save Reflection
      </Button>
      <Button onClick={() => setShowValuePromptDialog(false)} className="bg-[#FF5C00] hover:bg-[#FF5C00]/90 text-white">Close</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

<Dialog open={showPromptDialog} onOpenChange={setShowPromptDialog}>
  <DialogContent className="sm:max-w-[600px]">
    <DialogHeader>
      <DialogTitle>{selectedPrompt?.title}</DialogTitle>
      <DialogDescription>{selectedPrompt?.description}</DialogDescription>
    </DialogHeader>
    <div className="py-4">
      <div className="w-full h-[400px] mb-4 overflow-hidden rounded-md">
        <img 
          src={selectedPrompt?.image} 
          alt={selectedPrompt?.title} 
          className="object-contain w-full h-full"
        />
      </div>
      <h3 className="font-semibold mb-2">{selectedPrompt?.question}</h3>
      <Textarea 
        placeholder="What happened?"
        className="min-h-[100px] mb-4"
      />
    </div>
    <DialogFooter>
      <Button onClick={() => {
        setShowPromptDialog(false)
        setShowNewMomentDialog(true)
      }} className="bg-[#FF5C00] hover:bg-[#FF5C00]/90 text-white">
        Create Moment
      </Button>
      <Button onClick={() => setShowPromptDialog(false)} className="bg-[#FF5C00] hover:bg-[#FF5C00]/90 text-white">Close</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

      <Button
        className="fixed bottom-4 right-4 rounded-full w-12 h-12 shadow-lg"
        onClick={() => setShowGuidedReflection(true)}
      >
        <Sparkles className="w-6 h-6" />
      </Button>

      <Dialog open={showGuidedReflection} onOpenChange={setShowGuidedReflection}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Guided Reflection</DialogTitle>
            <DialogDescription>
              Take a moment to reflect on your day
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedStrength ? (
              renderReflectionStep()
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Select a Strength</h3>
                <div className="grid grid-cols-2 gap-2">
                  {strengths.map((strength) => (
                    <Button
                      key={strength.id}
                      onClick={() => handleStrengthSelect(strength)}
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center"
                    >
                      <span className="text-2xl mb-1">{strength.name.split(' ')[1]}</span>
                      <span className="text-sm text-center">{strength.name.split(' ')[0]}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            {selectedStrength && (
              <>
                {reflectionStep > 0 && (
                  <Button variant="outline" onClick={() => setReflectionStep(reflectionStep - 1)}>
                    Previous
                  </Button>
                )}
                {reflectionStep < 2 ? (
                  <Button onClick={() => setReflectionStep(reflectionStep + 1)}className="bg-[#FF5C00] hover:bg-[#FF5C00]/90 text-white">
                    Next
                  </Button>
                ) : (
                  <Button onClick={handleReflectionSubmit}className="bg-[#FF5C00] hover:bg-[#FF5C00]/90 text-white">
                    Finish Reflection
                  </Button>
                )}
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}