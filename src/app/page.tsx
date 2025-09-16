"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Activity, 
  Trophy, 
  Target, 
  Calendar, 
  TrendingUp, 
  Award, 
  Zap, 
  MapPin,
  Clock,
  Flame,
  Star,
  Plus
} from 'lucide-react'

interface Run {
  id: string
  distance: number
  duration: number
  date: string
  pace: number
  calories: number
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  progress?: number
  target?: number
}

export default function RunningApp() {
  const [runs, setRuns] = useState<Run[]>([])
  const [newRun, setNewRun] = useState({
    distance: '',
    duration: '',
    date: new Date().toISOString().split('T')[0]
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [level, setLevel] = useState(1)
  const [xp, setXp] = useState(0)
  const [streak, setStreak] = useState(0)

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Primeiro Passo',
      description: 'Complete sua primeira corrida',
      icon: '🏃',
      unlocked: runs.length > 0
    },
    {
      id: '2',
      title: 'Maratonista Iniciante',
      description: 'Corra 10km em total',
      icon: '🎯',
      unlocked: getTotalDistance() >= 10,
      progress: Math.min(getTotalDistance(), 10),
      target: 10
    },
    {
      id: '3',
      title: 'Velocista',
      description: 'Mantenha pace abaixo de 5:00/km',
      icon: '⚡',
      unlocked: runs.some(run => run.pace < 5)
    },
    {
      id: '4',
      title: 'Consistência',
      description: 'Corra 7 dias seguidos',
      icon: '🔥',
      unlocked: streak >= 7,
      progress: Math.min(streak, 7),
      target: 7
    }
  ]

  function getTotalDistance() {
    return runs.reduce((total, run) => total + run.distance, 0)
  }

  function getTotalDuration() {
    return runs.reduce((total, run) => total + run.duration, 0)
  }

  function getAveragePace() {
    if (runs.length === 0) return 0
    const totalPace = runs.reduce((total, run) => total + run.pace, 0)
    return totalPace / runs.length
  }

  function calculateXP(distance: number, pace: number) {
    const baseXP = distance * 10
    const paceBonus = pace < 5 ? 20 : pace < 6 ? 10 : 0
    return Math.floor(baseXP + paceBonus)
  }

  function addRun() {
    if (!newRun.distance || !newRun.duration) return

    const distance = parseFloat(newRun.distance)
    const duration = parseFloat(newRun.duration)
    const pace = duration / distance

    const run: Run = {
      id: Date.now().toString(),
      distance,
      duration,
      date: newRun.date,
      pace,
      calories: Math.floor(distance * 65) // Estimativa simples
    }

    setRuns(prev => [run, ...prev])
    
    // Calcular XP e level
    const earnedXP = calculateXP(distance, pace)
    const newTotalXP = xp + earnedXP
    const newLevel = Math.floor(newTotalXP / 100) + 1
    
    setXp(newTotalXP)
    setLevel(newLevel)
    
    // Simular streak (simplificado)
    setStreak(prev => prev + 1)

    setNewRun({ distance: '', duration: '', date: new Date().toISOString().split('T')[0] })
    setIsDialogOpen(false)
  }

  function formatPace(pace: number) {
    const minutes = Math.floor(pace)
    const seconds = Math.floor((pace - minutes) * 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}/km`
  }

  function formatDuration(duration: number) {
    const hours = Math.floor(duration / 60)
    const minutes = Math.floor(duration % 60)
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  }

  const currentLevelXP = xp % 100
  const nextLevelXP = 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-600 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Activity className="w-8 h-8" />
                Corridinhas
              </h1>
              <p className="text-orange-100 mt-1">Sua jornada de corrida começa aqui</p>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-white text-orange-600 hover:bg-orange-50 font-semibold">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Corrida
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Registrar Nova Corrida</DialogTitle>
                  <DialogDescription>
                    Adicione os detalhes da sua corrida para ganhar XP e desbloquear conquistas.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="distance">Distância (km)</Label>
                    <Input
                      id="distance"
                      type="number"
                      step="0.1"
                      placeholder="5.0"
                      value={newRun.distance}
                      onChange={(e) => setNewRun(prev => ({ ...prev, distance: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Duração (minutos)</Label>
                    <Input
                      id="duration"
                      type="number"
                      placeholder="30"
                      value={newRun.duration}
                      onChange={(e) => setNewRun(prev => ({ ...prev, duration: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="date">Data</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newRun.date}
                      onChange={(e) => setNewRun(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                  <Button onClick={addRun} className="w-full bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700">
                    Registrar Corrida
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Distância Total</p>
                  <p className="text-3xl font-bold">{getTotalDistance().toFixed(1)}</p>
                  <p className="text-blue-100 text-sm">km</p>
                </div>
                <MapPin className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Tempo Total</p>
                  <p className="text-3xl font-bold">{formatDuration(getTotalDuration())}</p>
                  <p className="text-green-100 text-sm">correndo</p>
                </div>
                <Clock className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Pace Médio</p>
                  <p className="text-3xl font-bold">{getAveragePace() > 0 ? formatPace(getAveragePace()) : '--'}</p>
                  <p className="text-purple-100 text-sm">por km</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Sequência</p>
                  <p className="text-3xl font-bold">{streak}</p>
                  <p className="text-orange-100 text-sm">dias</p>
                </div>
                <Flame className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Level & XP */}
        <Card className="mb-8 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <Star className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Nível {level}</h3>
                  <p className="text-yellow-100">Corredor {level < 5 ? 'Iniciante' : level < 10 ? 'Intermediário' : 'Avançado'}</p>
                </div>
              </div>
              <div className="w-full sm:w-64">
                <div className="flex justify-between text-sm mb-2">
                  <span>{currentLevelXP} XP</span>
                  <span>{nextLevelXP} XP</span>
                </div>
                <Progress value={(currentLevelXP / nextLevelXP) * 100} className="bg-white/20" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="runs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2">
            <TabsTrigger value="runs" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Corridas
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Conquistas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="runs" className="space-y-4">
            {runs.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Activity className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhuma corrida registrada</h3>
                  <p className="text-gray-500 mb-6">Comece sua jornada registrando sua primeira corrida!</p>
                  <Button 
                    onClick={() => setIsDialogOpen(true)}
                    className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Registrar Primeira Corrida
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {runs.map((run) => (
                  <Card key={run.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="bg-gradient-to-br from-orange-500 to-pink-600 p-3 rounded-full text-white">
                            <Activity className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{run.distance}km</h3>
                            <p className="text-gray-600 flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(run.date).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-6 text-center">
                          <div>
                            <p className="text-sm text-gray-600">Duração</p>
                            <p className="font-semibold">{formatDuration(run.duration)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Pace</p>
                            <p className="font-semibold">{formatPace(run.pace)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Calorias</p>
                            <p className="font-semibold">{run.calories}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievements.map((achievement) => (
                <Card 
                  key={achievement.id} 
                  className={`transition-all ${
                    achievement.unlocked 
                      ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-lg' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`text-4xl ${achievement.unlocked ? 'grayscale-0' : 'grayscale'}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className={`font-semibold ${achievement.unlocked ? 'text-yellow-800' : 'text-gray-600'}`}>
                            {achievement.title}
                          </h3>
                          {achievement.unlocked && (
                            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                              <Award className="w-3 h-3 mr-1" />
                              Desbloqueado
                            </Badge>
                          )}
                        </div>
                        <p className={`text-sm ${achievement.unlocked ? 'text-yellow-700' : 'text-gray-500'}`}>
                          {achievement.description}
                        </p>
                        
                        {achievement.target && (
                          <div className="mt-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Progresso</span>
                              <span>{achievement.progress || 0}/{achievement.target}</span>
                            </div>
                            <Progress 
                              value={((achievement.progress || 0) / achievement.target) * 100} 
                              className="h-2"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}