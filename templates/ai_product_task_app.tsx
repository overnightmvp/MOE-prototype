import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle2, Clock, Target, Lightbulb, FileText, Users, Rocket } from 'lucide-react';

const TaskManager = () => {
  const [completedTasks, setCompletedTasks] = useState(new Set());
  const [currentPhase, setCurrentPhase] = useState('phase1');
  
  const toggleTask = (taskId) => {
    const newCompleted = new Set(completedTasks);
    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId);
    } else {
      newCompleted.add(taskId);
    }
    setCompletedTasks(newCompleted);
  };

  const phases = {
    phase1: {
      title: "Discovery & Core Definition",
      description: "Validate your market and solidify your foundation",
      icon: <Target className="w-5 h-5" />,
      color: "bg-blue-500",
      prds: [
        {
          id: "prd001",
          title: "PRD-001: Product Assessment Interview",
          tasks: [
            {
              id: "prd001_task1",
              title: "Create Gumroad Product Draft",
              description: "Set up a new digital product listing with placeholder name 'AI Product Strategist Suite'",
              insight: "Getting the sales platform ready early creates momentum and a concrete goal",
              timeEstimate: "15 min"
            },
            {
              id: "prd001_task2", 
              title: "Define Success Metrics",
              description: "Write down your primary goal: 'Achieve [X] sales by [Date]' and secondary goal",
              insight: "Specific, measurable goals prevent feature creep and maintain focus",
              timeEstimate: "10 min"
            },
            {
              id: "prd001_task3",
              title: "Identify Core AI Feature", 
              description: "Choose the single most crucial document your AI must generate first",
              insight: "Focusing on absolute core functionality speeds MVP delivery",
              timeEstimate: "15 min"
            }
          ]
        },
        {
          id: "prd002",
          title: "PRD-002: Lean Canvas",
          tasks: [
            {
              id: "prd002_task1",
              title: "Test AI Prompt for Core Value",
              description: "Draft a simple prompt for generating 'Problem' and 'Solution' sections of Lean Canvas",
              insight: "Early AI testing validates technical feasibility of your core concept",
              timeEstimate: "15 min"
            },
            {
              id: "prd002_task2",
              title: "Set Up Tracking Dashboard", 
              description: "Create simple spreadsheet with columns: 'Productized Sales,' 'Upsell Conversions,' 'Date'",
              insight: "Tracking from day one enables data-driven decision making",
              timeEstimate: "10 min"
            },
            {
              id: "prd002_task3",
              title: "Craft Unfair Advantage Phrases",
              description: "Write 2-3 short, memorable phrases highlighting your 'sequential AI generation' advantage",
              insight: "Clear differentiation makes your unique value stick in customers' minds",
              timeEstimate: "15 min"
            }
          ]
        },
        {
          id: "prd003",
          title: "PRD-003: Persona Map",
          tasks: [
            {
              id: "prd003_task1",
              title: "Draft Outreach Message Template",
              description: "Write 2-3 sentence email template targeting 'Visionary Solo Founders' (Alex Chen persona)",
              insight: "Persona-specific messaging dramatically improves response rates",
              timeEstimate: "15 min"
            },
            {
              id: "prd003_task2",
              title: "Define Visual/Tone Elements",
              description: "Choose one visual element for 'Resourceful Lean Startup Lead': clean UI or progress indicators",
              insight: "Early design decisions aligned with personas enhance user experience",
              timeEstimate: "10 min"
            }
          ]
        },
        {
          id: "prd004",
          title: "PRD-004: Competitor Analysis",
          tasks: [
            {
              id: "prd004_task1", 
              title: "Articulate Key Differentiator",
              description: "Write one clear sentence explaining your advantage over traditional consultants",
              insight: "Sharp competitive positioning guides all marketing messaging",
              timeEstimate: "15 min"
            },
            {
              id: "prd004_task2",
              title: "Create AI Structure Statement",
              description: "Draft explanation of how your 'structured, sequential AI flow' beats generic AI tools",
              insight: "Overcoming AI skepticism requires clear process differentiation", 
              timeEstimate: "15 min"
            }
          ]
        },
        {
          id: "prd005",
          title: "PRD-005: Service Blueprint",
          tasks: [
            {
              id: "prd005_task1",
              title: "Create Basic Landing Page",
              description: "Write simple text file with headline, value prop, and email waitlist CTA",
              insight: "Early landing page captures interest before full product launch",
              timeEstimate: "15 min"
            },
            {
              id: "prd005_task2",
              title: "Map Post-Purchase Flow",
              description: "Document exact steps: 'User purchases → Email sent → Access link clicked → Input provided'",
              insight: "Smooth onboarding reduces support burden and improves satisfaction",
              timeEstimate: "15 min"
            }
          ]
        },
        {
          id: "prd006",
          title: "PRD-006: Offer Creation",
          tasks: [
            {
              id: "prd006_task1",
              title: "Finalize Gumroad Listing",
              description: "Update product with 'Full Product Development & Validation Suite' title and $299-$499 pricing",
              insight: "Complete offer presentation drives immediate purchase decisions",
              timeEstimate: "15 min"
            },
            {
              id: "prd006_task2",
              title: "Write Primary CTA",
              description: "Use exact text: 'Get Your Product Roadmap Now! Buy the Full PRD Suite and launch with confidence'",
              insight: "Strong CTAs directly impact conversion rates",
              timeEstimate: "10 min"
            }
          ]
        }
      ]
    },
    phase2: {
      title: "MVP Design & Prioritization", 
      description: "Build the core experience and validate with users",
      icon: <Users className="w-5 h-5" />,
      color: "bg-green-500",
      prds: [
        {
          id: "prd012",
          title: "PRD-012: Feature Overview",
          tasks: [
            {
              id: "prd012_task1",
              title: "Map Sequential AI Flow",
              description: "Document step-by-step flow: PRD-001 → PRD-002 → PRD-003 → PRD-006",
              insight: "Clear sequential logic is fundamental to your product's core value",
              timeEstimate: "15 min"
            },
            {
              id: "prd012_task2",
              title: "Define Minimal User Inputs",
              description: "List 2-3 essential inputs users provide to start the process",
              insight: "Lower input barriers increase user completion rates",
              timeEstimate: "10 min"
            }
          ]
        },
        {
          id: "prd017",
          title: "PRD-017: MVP Userflow",
          tasks: [
            {
              id: "prd017_task1",
              title: "Write Acceptance Criteria",
              description: "Define exact success criteria for User Story 1 (Define Core Product Idea)",
              insight: "Clear acceptance criteria define what 'done' looks like",
              timeEstimate: "15 min"
            },
            {
              id: "prd017_task2",
              title: "Map Data Dependencies",
              description: "Document which previous PRD data feeds into each new PRD generation",
              insight: "Understanding dependencies prevents technical architecture problems",
              timeEstimate: "15 min"
            }
          ]
        },
        {
          id: "prd019",
          title: "PRD-019: Lean Prototype Specification",
          tasks: [
            {
              id: "prd019_task1",
              title: "Choose Prototyping Tool",
              description: "Select Figma for high-fidelity or Balsamiq for speed",
              insight: "Tool selection early accelerates prototype development",
              timeEstimate: "5 min"
            },
            {
              id: "prd019_task2",
              title: "Build Core Screens",
              description: "Create SC-001 (Welcome), SC-002 (Input), SC-003 (First PRD Display)",
              insight: "Core flow demonstration validates primary value proposition",
              timeEstimate: "45 min"
            }
          ]
        },
        {
          id: "prd020",
          title: "PRD-020: Prototype User Testing Guide",
          tasks: [
            {
              id: "prd020_task1",
              title: "Practice Introduction Script",
              description: "Read introduction aloud, time it, adjust for natural delivery",
              insight: "Smooth introductions put testers at ease and improve feedback quality",
              timeEstimate: "10 min"
            },
            {
              id: "prd020_task2",
              title: "Set Up Note-Taking System",
              description: "Create spreadsheet with columns: Task, Action, Quote, Issue, Opportunity",
              insight: "Systematic note-taking ensures consistent, actionable feedback capture",
              timeEstimate: "15 min"
            }
          ]
        }
      ]
    },
    phase3: {
      title: "Pre-Launch & Development Planning",
      description: "Finalize your product and prepare for market",
      icon: <Rocket className="w-5 h-5" />,
      color: "bg-purple-500",
      prds: [
        {
          id: "prd021",
          title: "PRD-021: Core Messaging & Content Hooks",
          tasks: [
            {
              id: "prd021_task1",
              title: "Select Primary Message",
              description: "Choose strongest core messaging statement for all marketing materials",
              insight: "Consistent primary messaging improves brand recognition and conversion",
              timeEstimate: "15 min"
            },
            {
              id: "prd021_task2",
              title: "Choose Content Hook",
              description: "Pick one attention-grabbing headline and its CTA for first marketing push",
              insight: "Focused hook testing provides data on what resonates with your audience",
              timeEstimate: "10 min"
            }
          ]
        },
        {
          id: "prd025",
          title: "PRD-025: Minimal Viable Launch Plan",
          tasks: [
            {
              id: "prd025_task1",
              title: "Draft Launch Announcement",
              description: "Write opening sentence for community announcements: 'Exciting news for solo founders!'",
              insight: "Compelling launch messaging maximizes initial traction",
              timeEstimate: "15 min"
            },
            {
              id: "prd025_task2",
              title: "Establish Feedback Channels",
              description: "Set up feedback@yourdomain.com or simple feedback form",
              insight: "Immediate feedback capture enables rapid issue resolution",
              timeEstimate: "10 min"
            }
          ]
        },
        {
          id: "prd026",
          title: "PRD-026: Landing Page Structure",
          tasks: [
            {
              id: "prd026_task1",
              title: "Write Hero Section",
              description: "Craft exact headline and primary CTA using best messaging from PRD-021",
              insight: "Hero section directly impacts bounce rate and conversion",
              timeEstimate: "15 min"
            },
            {
              id: "prd026_task2",
              title: "Draft Problem Statement",
              description: "Write compelling problem headline and 2-3 specific pain point bullets",
              insight: "Problem resonance immediately creates connection with target users",
              timeEstimate: "15 min"
            }
          ]
        },
        {
          id: "prd029",
          title: "PRD-029: Post-Launch Feedback Loop",
          tasks: [
            {
              id: "prd029_task1",
              title: "Write Feedback Email",
              description: "Compose open-ended email for user milestones: 'How are you finding [Product]?'",
              insight: "Well-crafted feedback requests generate genuine, actionable insights",
              timeEstimate: "10 min"
            },
            {
              id: "prd029_task2",
              title: "Set Up Feedback Infrastructure",
              description: "Create dedicated feedback email and plan daily monitoring",
              insight: "Systematic feedback processing ensures user needs drive product evolution",
              timeEstimate: "15 min"
            }
          ]
        }
      ]
    }
  };

  const calculateProgress = (phaseKey) => {
    const phase = phases[phaseKey];
    const totalTasks = phase.prds.reduce((sum, prd) => sum + prd.tasks.length, 0);
    const completedCount = phase.prds.reduce((sum, prd) => 
      sum + prd.tasks.filter(task => completedTasks.has(task.id)).length, 0
    );
    return totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;
  };

  const getTotalProgress = () => {
    const allTasks = Object.values(phases).reduce((total, phase) => 
      total + phase.prds.reduce((sum, prd) => sum + prd.tasks.length, 0), 0
    );
    const completedCount = completedTasks.size;
    return allTasks > 0 ? (completedCount / allTasks) * 100 : 0;
  };

  const nextActions = [
    { title: "Complete Gumroad product setup", prd: "PRD-006", urgent: true },
    { title: "Build basic prototype", prd: "PRD-019", urgent: true },
    { title: "Set up feedback systems", prd: "PRD-029", urgent: true },
    { title: "Create waitlist landing page", prd: "PRD-022", urgent: false }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI Product Strategy Task Manager
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            From Strategy to Launch: Execute Your 31 PRDs with Confidence
          </p>
          
          {/* Overall Progress */}
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  Overall Progress
                </CardTitle>
                <Badge variant="secondary">
                  {completedTasks.size} tasks completed
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={getTotalProgress()} className="w-full h-3" />
              <p className="text-sm text-gray-600 mt-2">
                {Math.round(getTotalProgress())}% complete
              </p>
            </CardContent>
          </Card>

          {/* Next Immediate Actions */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-red-500" />
                🚀 Next Immediate Actions
              </CardTitle>
              <CardDescription>
                Week 1 Priority Tasks - Start Here!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nextActions.map((action, index) => (
                  <div key={index} className={`p-4 rounded-lg border-2 ${action.urgent ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {action.urgent && <Clock className="w-4 h-4 text-red-500" />}
                      <span className="font-medium">{action.title}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {action.prd}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Phase Tabs */}
        <Tabs value={currentPhase} onValueChange={setCurrentPhase} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            {Object.entries(phases).map(([key, phase]) => (
              <TabsTrigger key={key} value={key} className="flex items-center gap-2">
                {phase.icon}
                {phase.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(phases).map(([phaseKey, phase]) => (
            <TabsContent key={phaseKey} value={phaseKey}>
              {/* Phase Header */}
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${phase.color} text-white`}>
                      {phase.icon}
                    </div>
                    <div>
                      <CardTitle>{phase.title}</CardTitle>
                      <CardDescription>{phase.description}</CardDescription>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Progress value={calculateProgress(phaseKey)} className="w-full h-2" />
                    <p className="text-sm text-gray-600 mt-1">
                      {Math.round(calculateProgress(phaseKey))}% complete
                    </p>
                  </div>
                </CardHeader>
              </Card>

              {/* PRD Cards */}
              <div className="space-y-6">
                {phase.prds.map((prd) => (
                  <Card key={prd.id} className="overflow-hidden">
                    <CardHeader className="bg-gray-50">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="w-5 h-5" />
                          {prd.title}
                        </CardTitle>
                        <Badge variant="outline">
                          {prd.tasks.filter(task => completedTasks.has(task.id)).length}/{prd.tasks.length}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        {prd.tasks.map((task) => (
                          <div
                            key={task.id}
                            className={`p-4 rounded-lg border transition-all duration-200 ${
                              completedTasks.has(task.id)
                                ? 'bg-green-50 border-green-200'
                                : 'bg-white border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <Checkbox
                                checked={completedTasks.has(task.id)}
                                onCheckedChange={() => toggleTask(task.id)}
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className={`font-semibold ${
                                    completedTasks.has(task.id) ? 'line-through text-gray-500' : ''
                                  }`}>
                                    {task.title}
                                  </h4>
                                  <Badge variant="secondary" className="text-xs">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {task.timeEstimate}
                                  </Badge>
                                </div>
                                <p className="text-gray-600 text-sm mb-3">
                                  {task.description}
                                </p>
                                <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                                  <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                  <p className="text-blue-700 text-sm">
                                    <strong>💡 Insight:</strong> {task.insight}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Success Metrics Footer */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>📊 Success Metrics to Track</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">0</div>
                <div className="text-sm text-gray-600">Waitlist Signups</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">0</div>
                <div className="text-sm text-gray-600">User Tests</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">0</div>
                <div className="text-sm text-gray-600">Dev Milestones</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">0</div>
                <div className="text-sm text-gray-600">Community Engagements</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaskManager;