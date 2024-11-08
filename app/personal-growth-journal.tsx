'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { PlusCircle, Heart, Sparkles, Upload, Shuffle, Search, X, Calendar, Smile, ChevronRight, ChevronLeft, Star, BarChart2, RefreshCw, Plus, Trophy, Edit, Dumbbell, Scale } from 'lucide-react'
import { toast } from "@/components/ui/use-toast"

// Custom color palette
const colors = {
  hotPink: '#FF1F7D',
  orange: '#FF5C00',
  royalBlue: '#4B4AEF',
  navy: '#1F2261',
  green: '#00DC82',
  pink: '#FF3F9A',
  purple: '#800080',
  yellow: '#FFFF00',
  teal: '#008080',
}

interface Value {
  id: string
  name: string
  icon: string
  color: string
  description: string
  image: string
  category: string
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
  icon: string
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

const initialValues: Value[] = [
  {
    id: '1',
    name: 'Growth',
    icon: '🌱',
    color: 'bg-green-500',
    description: 'Continuously improving and developing oneself.',
    image: '/placeholder.svg?height=400&width=600',
    category: 'Personal Development',
    timestamp: Date.now(),
    questions: [
      "How have you challenged yourself to grow today?",
      "What new skill or knowledge have you acquired recently?",
      "In what areas of your life do you see the most potential for growth?"
    ]
  },
  {
    id: '2',
    name: 'Independence',
    icon: '🦅',
    color: 'bg-yellow-500',
    description: 'Valuing self-reliance and making your own decisions.',
    image: '/placeholder.svg?height=400&width=600',
    category: 'Personal Growth',
    timestamp: Date.now(),
    questions: [
      "How have you taken charge of your own decisions?",
      "What steps have you taken towards greater independence?",
      "How are you maintaining self-reliance in your life?"
    ]
  },
  {
    id: '3',
    name: 'Ambition',
    icon: '🚀',
    color: 'bg-red-500',
    description: 'Striving to achieve high goals and succeed.',
    image: '/placeholder.svg?height=400&width=600',
    category: 'Career and Success',
    timestamp: Date.now(),
    questions: [
      "What steps did you take toward your goals today?",
      "How are you pushing yourself to reach new heights?",
      "What accomplishments are you aiming for in the near future?"
    ]
  },
  {
    id: '4',
    name: 'Safety',
    icon: '🛡️',
    color: 'bg-gray-500',
    description: 'Prioritizing security, stability, and a sense of protection.',
    image: '/placeholder.svg?height=400&width=600',
    category: 'Well-being',
    timestamp: Date.now(),
    questions: [
      "How have you contributed to a safe environment?",
      "What steps have you taken to ensure your personal security?",
      "How are you creating stability in your life?"
    ]
  },
  {
    id: '5',
    name: 'Compassion',
    icon: '💖',
    color: 'bg-pink-500',
    description: 'Showing empathy and kindness towards others.',
    image: '/placeholder.svg?height=400&width=600',
    category: 'Relationships',
    timestamp: Date.now(),
    questions: [
      "How have you shown compassion recently?",
      "What acts of kindness have you extended to others?",
      "How are you nurturing empathy in your interactions?"
    ]
  },
  {
    id: '6',
    name: 'Adventure',
    icon: '🌍',
    color: 'bg-purple-500',
    description: 'Seeking new and exciting experiences.',
    image: '/placeholder.svg?height=400&width=600',
    category: 'Lifestyle',
    timestamp: Date.now(),
    questions: [
      "What new experience did you embrace today?",
      "How are you stepping outside of your comfort zone?",
      "What adventure do you want to pursue next?"
    ]
  },
  {
    id: '7',
    name: 'Pleasure',
    icon: '🎉',
    color: 'bg-orange-500',
    description: 'Enjoying life’s pleasures and savoring joyful moments.',
    image: '/placeholder.svg?height=400&width=600',
    category: 'Lifestyle',
    timestamp: Date.now(),
    questions: [
      "How did you find joy in your day?",
      "What small pleasures have you embraced recently?",
      "How are you celebrating life’s moments?"
    ]
  },
  {
    id: '8',
    name: 'Equality',
    icon: '⚖️',
    color: 'bg-teal-500',
    description: 'Valuing fairness and equal treatment for all.',
    image: '/placeholder.svg?height=400&width=600',
    category: 'Social Responsibility',
    timestamp: Date.now(),
    questions: [
      "How did you promote fairness today?",
      "In what ways have you advocated for equality?",
      "What actions can you take to support equal treatment for all?"
    ]
  },
  {
    id: '9',
    name: 'Cooperation',
    icon: '🤝',
    color: 'bg-blue-600',
    description: 'Working collaboratively and fostering teamwork.',
    image: '/placeholder.svg?height=400&width=600',
    category: 'Community',
    timestamp: Date.now(),
    questions: [
      "How did you collaborate effectively with others?",
      "What role did you play in a recent team effort?",
      "How are you supporting cooperation in your community?"
    ]
  },
  {
    id: '10',
    name: 'Self-direction',
    icon: '🧭',
    color: 'bg-indigo-500',
    description: 'Guiding yourself and making autonomous decisions.',
    image: '/placeholder.svg?height=400&width=600',
    category: 'Personal Growth',
    timestamp: Date.now(),
    questions: [
      "How have you taken control of your path?",
      "What decisions have you made independently?",
      "How are you staying true to your goals and values?"
    ]
  },
  {
    id: '11',
    name: 'Tradition',
    icon: '🎎',
    color: 'bg-brown-500',
    description: 'Respecting customs, heritage, and long-standing values.',
    image: '/placeholder.svg?height=400&width=600',
    category: 'Culture',
    timestamp: Date.now(),
    questions: [
      "How are you honoring tradition in your life?",
      "What customs or values are important to you?",
      "How do you celebrate your cultural heritage?"
    ]
  },
  {
    id: '12',
    name: 'Power',
    icon: '👑',
    color: 'bg-red-600',
    description: 'Asserting authority and seeking influence over outcomes.',
    image: '/placeholder.svg?height=400&width=600',
    category: 'Leadership',
    timestamp: Date.now(),
    questions: [
      "How did you assert yourself today?",
      "In what ways are you working to influence outcomes?",
      "How are you balancing authority with responsibility?"
    ]
  },
  {
    id: '13',
    name: 'Achievement',
    icon: '🏆',
    color: 'bg-gold-500',
    description: 'Striving to succeed and reach personal goals.',
    image: '/placeholder.svg?height=400&width=600',
    category: 'Personal Success',
    timestamp: Date.now(),
    questions: [
      "What accomplishments did you achieve today?",
      "How are you progressing toward your goals?",
      "What is your next major milestone?"
    ]
  },
  // Add more initial values here...
]

const initialStrengths: Strength[] = [
  {
    id: '1',
    name: 'Creativity',
    description: 'Thinking of novel and productive ways to conceptualize and do things.',
    icon: '💡',
    color: colors.orange,
    reflections: [],
    activities: [
      'Try a new hobby or artistic pursuit',
      'Brainstorm solutions to a problem',
      'Redesign your workspace'
    ]
  },
  {
    id: '2',
    name: 'Curiosity',
    description: 'Taking an interest in ongoing experience for its own sake.',
    icon: '🔍',
    color: colors.royalBlue,
    reflections: [],
    activities: [
      'Learn about a new topic',
      'Ask thoughtful questions',
      'Explore a new place'
    ]
  },
{
  id: '3',
  name: 'Judgment',
  description: 'Making thoughtful and balanced decisions.',
  icon: '⚖️',
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
  name: 'Love of Learning',
  description: 'Mastering new skills and knowledge.',
  icon: '📚',
  color: colors.royalBlue,
  reflections: [],
  activities: [
    'Take a course or workshop',
    'Read about a topic of interest',
    'Practice a skill you want to improve'
  ]
},
{
  id: '5',
  name: 'Perspective',
  description: 'Providing wise counsel to others.',
  icon: '🌄',
  color: colors.green,
  reflections: [],
  activities: [
    'Share advice based on your experience',
    'Reflect on the bigger picture',
    'Help someone see a new point of view'
  ]
},
{
  id: '6',
  name: 'Bravery',
  description: 'Facing challenges with courage and determination.',
  icon: '🦁',
  color: colors.orange,
  reflections: [],
  activities: [
    'Do something outside your comfort zone',
    'Stand up for your beliefs',
    'Take on a challenging task'
  ]
},
{
  id: '7',
  name: 'Perseverance',
  description: 'Finishing what you start and overcoming obstacles.',
  icon: '🏃',
  color: colors.hotPink,
  reflections: [],
  activities: [
    'Set a challenging goal and stick to it',
    'Work through a difficult problem',
    'Celebrate progress towards long-term goals'
  ]
},
{
  id: '8',
  name: 'Honesty',
  description: 'Speaking the truth and acting with integrity.',
  icon: '🗣️',
  color: colors.pink,
  reflections: [],
  activities: [
    'Be open about your feelings',
    'Practice transparent communication',
    'Hold yourself accountable'
  ]
},
{
  id: '9',
  name: 'Zest',
  description: 'Approaching life with excitement and energy.',
  icon: '⚡',
  color: colors.orange,
  reflections: [],
  activities: [
    'Engage in a high-energy activity',
    'Start the day with enthusiasm',
    'Bring positivity to those around you'
  ]
},
{
  id: '10',
  name: 'Love',
  description: 'Valuing close relationships with others.',
  icon: '💖',
  color: colors.royalBlue,
  reflections: [],
  activities: [
    'Spend quality time with a loved one',
    'Express appreciation for others',
    'Listen actively to someone you care about'
  ]
},
{
  id: '11',
  name: 'Kindness',
  description: 'Doing favors and good deeds for others.',
  icon: '🤲',
  color: colors.green,
  reflections: [],
  activities: [
    'Help someone in need',
    'Perform a random act of kindness',
    'Volunteer your time or resources'
  ]
},
{
  id: '12',
  name: 'Social Intelligence',
  description: 'Being aware of the motives and feelings of others.',
  icon: '🧠',
  color: colors.orange,
  reflections: [],
  activities: [
    'Observe body language in conversations',
    'Practice active listening',
    'Show empathy in interactions'
  ]
},
{
  id: '13',
  name: 'Teamwork',
  description: 'Working well as a member of a group or team.',
  icon: '🤝',
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
  name: 'Fairness',
  description: 'Treating all people equally and justly.',
  icon: '⚖️',
  color: colors.teal,
  reflections: [],
  activities: [
    'Ensure everyone’s voice is heard',
    'Make impartial decisions',
    'Stand up for those who are treated unfairly'
  ]
},
{
  id: '15',
  name: 'Leadership',
  description: 'Encouraging a group to get things done and maintain good relations.',
  icon: '🌟',
  color: colors.hotPink,
  reflections: [],
  activities: [
    'Motivate others toward a common goal',
    'Lead by example in difficult situations',
    'Help resolve team conflicts'
  ]
},
{
  id: '16',
  name: 'Forgiveness',
  description: 'Forgiving those who have wronged you.',
  icon: '🤲',
  color: colors.green,
  reflections: [],
  activities: [
    'Reflect on times you were forgiven',
    'Let go of resentment',
    'Extend understanding to someone who hurt you'
  ]
},
{
  id: '17',
  name: 'Humility',
  description: 'Letting accomplishments speak for themselves.',
  icon: '🙏',
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
  name: 'Prudence',
  description: 'Being careful about one’s choices; not taking unnecessary risks.',
  icon: '🛑',
  color: colors.teal,
  reflections: [],
  activities: [
    'Consider the consequences before acting',
    'Plan ahead for potential challenges',
    'Take time to make thoughtful decisions'
  ]
},
{
  id: '19',
  name: 'Self-Regulation',
  description: 'Managing your emotions and behaviors effectively.',
  icon: '🧘',
  color: colors.purple,
  reflections: [],
  activities: [
    'Practice mindfulness and deep breathing',
    'Set boundaries to manage stress',
    'Reflect on emotional responses'
  ]
},
{
  id: '20',
  name: 'Appreciation of Beauty and Excellence',
  description: 'Noticing and appreciating beauty, excellence, and skill in all domains.',
  icon: '🌅',
  color: colors.pink,
  reflections: [],
  activities: [
    'Spend time in nature and observe details',
    'Celebrate others’ achievements',
    'Attend an art or music event'
  ]
},
{
  id: '21',
  name: 'Gratitude',
  description: 'Being aware and thankful for the good things that happen.',
  icon: '🙏',
  color: colors.orange,
  reflections: [],
  activities: [
    'Write a daily gratitude list',
    'Express appreciation to someone',
    'Reflect on positive aspects of your life'
  ]
},
{
  id: '22',
  name: 'Hope',
  description: 'Expecting the best and working to achieve it.',
  icon: '🌈',
  color: colors.royalBlue,
  reflections: [],
  activities: [
    'Set goals for the future',
    'Visualize positive outcomes',
    'Encourage others to stay optimistic'
  ]
},
{
  id: '23',
  name: 'Humor',
  description: 'Liking to laugh and tease; bringing smiles to others.',
  icon: '😂',
  color: colors.yellow,
  reflections: [],
  activities: [
    'Share a funny story with a friend',
    'Look for humor in everyday situations',
    'Watch a comedy or read a humorous book'
  ]
},
{
  id: '24',
  name: 'Spirituality',
  description: 'Having coherent beliefs about the higher purpose and meaning of life.',
  icon: '🕊️',
  color: colors.purple,
  reflections: [],
  activities: [
    'Engage in a spiritual practice or ritual',
    'Reflect on life’s purpose',
    'Spend time in meditation or prayer'
  ]
},
  // Add more initial strengths here...
]

const initialMoments: Moment[] = [
  {
    id: 'welcome',
    title: "Beginning My Personal Growth Journey",
    description: "Today marks the start of my intentional journey towards personal growth and self-discovery. I'm excited to document my moments, explore my values, and develop my strengths.",
    reflection: "This moment is meaningful because it represents my commitment to becoming the best version of myself. By starting this journal, I'm taking an active step towards understanding my values and leveraging my strengths.",
    imageUrl: "/default-moment-image.jpeg", // This should be replaced with the actual default image path
    values: ['1'], // Reference to the Growth value
    strengths: ['1'], // Reference to the Creativity strength
    timestamp: Date.now(),
    mood: 5,
    isDefault: true
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
  const [showNewStrengthDialog, setShowNewStrengthDialog] = useState(false)
  const [selectedValue, setSelectedValue] = useState<Value | null>(null)
  const [selectedStrength, setSelectedStrength] = useState<Strength | null>(null)
  const [editingMoment, setEditingMoment] = useState<Moment | null>(null)
  const [editingValue, setEditingValue] = useState<Value | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showGuidedReflection, setShowGuidedReflection] = useState(false)
  const [reflectionStep, setReflectionStep] = useState(0)
  const [currentReflection, setCurrentReflection] = useState<Partial<Reflection>>({})
  const [showInsights, setShowInsights] = useState(false)
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [showNewChallengeDialog, setShowNewChallengeDialog] = useState(false)
  const [showMomentDetailDialog, setShowMomentDetailDialog] = useState(false)
  const [selectedMoment, setSelectedMoment] = useState<Moment | null>(null)
  const [showValueDetailDialog, setShowValueDetailDialog] = useState(false)
  const [selectedValues, setSelectedValues] = useState<string[]>([])

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

  // Get unique categories
  const categories = Array.from(new Set(values.map(value => value.category)))

  // Filter values based on search and category
  const filteredValues = values.filter(value => {
    const matchesSearch = value.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         value.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || value.category === selectedCategory
    return matchesSearch && matchesCategory
  })

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

  // Function to add or edit a value
  const addOrEditValue = async (data: { name: string; description: string; category: string; image: File | null; questions: string[] }) => {
    const imageUrl = data.image ? await handleImageUpload({ target: { files: [data.image] } } as any) : '';
    const newValue: Value = {
      id: editingValue ? editingValue.id : Date.now().toString(),
      name: data.name,
      icon: '✨', // You could implement a proper icon selector
      color: `bg-${['blue', 'green', 'purple', 'pink', 'yellow'][Math.floor(Math.random() * 5)]}-500`,
      description: data.description,
      image: imageUrl || (editingValue ? editingValue.image : '/placeholder.svg?height=400&width=600'),
      category: data.category,
      timestamp: editingValue ? editingValue.timestamp : Date.now(),
      questions: data.questions,
    }
    
    if (editingValue) {
      setValues(values.map(v => v.id === editingValue.id ? newValue : v));
      toast({
        title: "Value updated",
        description: "Your value has been successfully updated.",
      })
    } else {
      setValues([...values, newValue]);
      toast({
        title: "Value added",
        description: "Your new value has been successfully added.",
      })
    }
    setEditingValue(null);
    setShowNewValueDialog(false);
    setShowValueDetailDialog(false);
  }

  // Function to update value image
  const updateValueImage = async (id: string, image: File) => {
    const imageUrl = await handleImageUpload({ target: { files: [image] } } as any);
    setValues(values.map(value => 
      value.id === id ? { ...value, image: imageUrl || value.image } : value
    ));
    toast({
      title: "Image updated",
      description: "The value image has been successfully updated.",
    })
  }

  const handleEditMoment = (moment: Moment) => {
    setEditingMoment(moment);
    setShowNewMomentDialog(true);
    setShowMomentDetailDialog(false);
  };

  const handleEditValue = (value: Value) => {
    setEditingValue(value);
    setShowNewValueDialog(true);
    setShowValueDetailDialog(false);
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

  const handleAddNewStrength = (data: { name: string; description: string; icon: string }) => {
    const newStrength: Strength = {
      id: Date.now().toString(),
      name: data.name,
      description: data.description,
      icon: data.icon,
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

  const getQuestion1 = (strength: Strength) => ` How did you use your ${strength.name} in this situation?`

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
      date: new Date(reflection.timestamp).toLocaleDateString(),
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

  // Function to handle value selection
  const handleValueSelect = (valueId: string) => {
    setSelectedValues(prevSelected => {
      if (prevSelected.includes(valueId)) {
        // If already selected, remove it
        return prevSelected.filter(id => id !== valueId);
      } else {
        // Otherwise, add it
        return [...prevSelected, valueId];
      }
    });
  };

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
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="moments">Moments</TabsTrigger>
          <TabsTrigger value="values">Values</TabsTrigger>
          <TabsTrigger value="strengths">Strengths</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
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
                  <CardDescription className="text-sm">{new Date(moment.timestamp).toLocaleDateString()}</CardDescription>
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
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => setShowNewValueDialog(true)}
                  className="bg-gradient-to-r from-[#4B4AEF] to-[#FF1F7D] text-white hover:opacity-90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Value
                </Button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
                className="text-sm"
              >
                All
              </Button>
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="text-sm"
                >
                  {category}
                </Button>
              ))}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredValues.map((value) => (
                <Card 
                  key={value.id} 
                  className="group relative overflow-hidden cursor-pointer" 
                  onClick={() => {
                    setSelectedValue(value);
                    setShowValueDetailDialog(true);
                  }}
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
                    <span className="text-3xl mb-2">{value.icon}</span>
                    <h3 className="text-xl font-bold text-white text-center">{value.name}</h3>
                    <span className="text-sm text-white/80">{value.category}</span>
                  </CardContent>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Label htmlFor={`image-upload-${value.id}`} className="cursor-pointer">
                      <Upload className="w-6 h-6 text-white" />
                    </Label>
                    <Input
                      id={`image-upload-${value.id}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          updateValueImage(value.id, file);
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
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
                      <span className="text-2xl">{strength.icon}</span>
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

        <TabsContent value="challenges">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-[#FF5C00]" />
                  Weekly Strength Challenges
                </CardTitle>
                <CardDescription>
                  Complete these challenges to develop your strengths
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button
                    onClick={() => setShowNewChallengeDialog(true)}
                    className="w-full bg-gradient-to-r from-[#FF1F7D] to-[#4B4AEF] text-white hover:opacity-90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Challenge
                  </Button>
                  {challenges.map(challenge => {
                    const strength = strengths.find(s => s.id === challenge.strengthId)
                    if (!strength) return null
                    
                    return (
                      <div 
                        key={challenge.id}
                        className="flex items-center justify-between p-4 rounded-lg border"
                        style={{ borderColor: strength.color }}
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-2xl">{strength.icon}</span>
                          <div>
                            <h3 className="font-semibold">{strength.name}</h3>
                            <p className="text-sm text-gray-600">{challenge.description}</p>
                          </div>
                        </div>
                        <Button
                          variant={challenge.completed ? "outline" : "default"}
                          onClick={() => {
                            setChallenges(challenges.map(c => 
                              c.id === challenge.id ? { ...c, completed: !c.completed } : c
                            ))
                          }}
                          style={challenge.completed ? { borderColor: strength.color, color: strength.color } : { backgroundColor: strength.color }}
                        >
                          {challenge.completed ? 'Completed' : 'Mark Complete'}
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
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
                      <SelectItem 
                        key={value.id} 
                        value={value.id} 
                        onClick={() => handleValueSelect(value.id)}
                      >
                        {value.icon} {value.name}
                        {selectedValues.includes(value.id) && ' (Selected)'}
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
                        {strength.icon} {strength.name}
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

      <Dialog open={showNewValueDialog} onOpenChange={setShowNewValueDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingValue ? 'Edit Value' : 'Add New Value'}</DialogTitle>
            <DialogDescription>
              {editingValue ? 'Update your core value' : 'Define a new core value that guides your life'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            addOrEditValue({
              name: formData.get('name') as string,
              description: formData.get('description') as string,
              category: formData.get('category') as string,
              image: (formData.get('image') as File) || null,
              questions: [
                formData.get('question1') as string,
                formData.get('question2') as string,
                formData.get('question3') as string,
              ].filter(Boolean),
            })
          }}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Value Name</Label>
                <Input id="name" name="name" defaultValue={editingValue?.name} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">What does this value mean to you?</Label>
                <Textarea id="description" name="description" defaultValue={editingValue?.description} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" name="category" defaultValue={editingValue?.category} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">Add an Image</Label>
                <Input id="image" name="image" type="file" accept="image/*" />
                {editingValue && (
                  <img src={editingValue.image} alt="Current" className="w-full h-32 object-cover rounded-md" />
                )}
              </div>
              <div className="grid gap-2">
                <Label>Reflection Questions</Label>
                <Input name="question1" placeholder="Question 1" defaultValue={editingValue?.questions[0]} />
                <Input name="question2" placeholder="Question 2" defaultValue={editingValue?.questions[1]} />
                <Input name="question3" placeholder="Question 3" defaultValue={editingValue?.questions[2]} />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">{editingValue ? 'Update Value' : 'Save Value'}</Button>
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
              icon: formData.get('icon') as string,
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
              <div>
                <Label htmlFor="icon">Icon (emoji)</Label>
                <Input id="icon" name="icon" placeholder="📚" required />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit">Add Strength</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showNewChallengeDialog} onOpenChange={setShowNewChallengeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Challenge</DialogTitle>
            <DialogDescription>
              Define a new weekly challenge for one of your strengths
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            handleAddNewChallenge({
              strengthId: formData.get('strengthId') as string,
              description: formData.get('description') as string,
            })
          }}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="strengthId">Select Strength</Label>
                <Select name="strengthId" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a strength" />
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
              <div>
                <Label htmlFor="description">Challenge Description</Label>
                <Textarea id="description" name="description" required />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit">Create Challenge</Button>
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
            }}>
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
              {new Date(selectedMoment?.timestamp || 0).toLocaleDateString()}
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
            <div className="flex flex-wrap gap-2 mb-4">
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
              <Button onClick={() => handleEditMoment(selectedMoment!)}>
                Edit Moment
              </Button>
            )}
            <Button onClick={() => setShowMomentDetailDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showValueDetailDialog} onOpenChange={setShowValueDetailDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedValue?.name}</DialogTitle>
            <DialogDescription>
              {selectedValue?.category}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <img 
              src={selectedValue?.image} 
              alt={selectedValue?.name} 
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="font-semibold mb-2">Description:</h3>
            <p className="mb-4">{selectedValue?.description}</p>
            <h3 className="font-semibold mb-2">Reflection Questions:</h3>
            <ul className="list-disc pl-5 mb-4">
              {selectedValue?.questions.map((question, index) => (
                <li key={index}>{question}</li>
              ))}
            </ul>
          </div>
          <DialogFooter>
            <Button onClick={() => handleEditValue(selectedValue!)}>
              Edit Value
            </Button>
            <Button onClick={() => setShowValueDetailDialog(false)}>
              Close
            </Button>
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
                      <span className="text-2xl mb-1">{strength.icon}</span>
                      <span className="text-sm text-center">{strength.name}</span>
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
                  <Button onClick={() => setReflectionStep(reflectionStep + 1)}>
                    Next
                  </Button>
                ) : (
                  <Button onClick={handleReflectionSubmit}>
                    Finish Reflection
                  </Button>
                )}
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <motion.div
        className="fixed bottom-4 left-4 p-4 bg-white rounded-full shadow-lg cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          const randomStrength = strengths[Math.floor(Math.random() * strengths.length)]
          handleStrengthSelect(randomStrength)
        }}
      >
        <RefreshCw className="w-6 h-6 text-[#4B4AEF]" />
      </motion.div>
    </div>
  )
}