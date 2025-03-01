"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dices, RotateCcw, DollarSign, History, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function DiceBettingGame() {
  const [balance, setBalance] = useState(1000)
  const [betAmount, setBetAmount] = useState(10)
  const [diceValue, setDiceValue] = useState(6)
  const [rolling, setRolling] = useState(false)
  const [result, setResult] = useState<"win" | "lose" | null>(null)
  const [gameHistory, setGameHistory] = useState<
    Array<{
      roll: number
      bet: number
      outcome: "win" | "lose"
      balanceChange: number
      timestamp: string
    }>
  >([])
  const [showHistory, setShowHistory] = useState(false)
  const [showStats, setShowStats] = useState(false)

  // Roll the dice
  const rollDice = () => {
    // Validate bet amount
    if (betAmount <= 0) {
      alert("Please enter a valid bet amount")
      return
    }

    if (betAmount > balance) {
      alert("Bet amount cannot exceed your balance")
      return
    }

    if (rolling) return

    setRolling(true)
    setResult(null)

    // Animate rolling for 1.5 seconds
    const rollInterval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1)
    }, 100)

    // Stop rolling after 1.5 seconds and determine outcome
    setTimeout(() => {
      clearInterval(rollInterval)

      //fetch data from api
      fetch("https://sixnine-galaxies-task-w2ss.vercel.app/roll-dice").then((response) => {
        if (response.ok) {
          return response.json()
        } else {
          throw new Error("Failed to fetch data")
        }
      }).then((data) => {

        console.log(data.dice)
        // Calculate final value
        const finalValue = data.dice
        setDiceValue(finalValue)

        // Determine outcome
        const isWin = finalValue >= 4 // Win on 4, 5, or 6
        const outcome = isWin ? "win" : "lose"
        const balanceChange = isWin ? betAmount : -betAmount

        // Update balance
        setBalance((prev) => prev + balanceChange)

        // Update result
        setResult(outcome)

        // Add to history
        setGameHistory((prev) => [
          {
            roll: finalValue,
            bet: betAmount,
            outcome,
            balanceChange,
            timestamp: new Date().toLocaleTimeString()
          },
          ...prev,
        ])

        setRolling(false)

      }).catch((error) => { 
        console.error(error) 
        setRolling(false)
      })
    }, 1500)
  }

  // Reset the game
  const resetGame = () => {
    setBalance(1000)
    setBetAmount(10)
    setDiceValue(6)
    setResult(null)
    setGameHistory([])
  }

  // Handle bet amount change
  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value)) {
      setBetAmount(value)
    } else {
      setBetAmount(0)
    }
  }

  // Calculate statistics
  const calculateStats = () => {
    if (gameHistory.length === 0) return { wins: 0, losses: 0, winRate: 0, totalWon: 0, totalLost: 0, netProfit: 0 }
    
    const wins = gameHistory.filter(game => game.outcome === "win").length
    const losses = gameHistory.filter(game => game.outcome === "lose").length
    const winRate = Math.round((wins / gameHistory.length) * 100)
    const totalWon = gameHistory.reduce((acc, game) => game.outcome === "win" ? acc + game.balanceChange : acc, 0)
    const totalLost = gameHistory.reduce((acc, game) => game.outcome === "lose" ? acc - game.balanceChange : acc, 0)
    const netProfit = totalWon - totalLost
    
    return { wins, losses, winRate, totalWon, totalLost, netProfit }
  }

  const stats = calculateStats()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-black text-white">
      <div className="mb-4 text-center">
        <h1 className="text-3xl font-bold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Casino Royal</h1>
        <p className="text-zinc-400">Test your luck with our dice game</p>
      </div>
      
      <Card className="w-full max-w-md bg-zinc-900/90 border-zinc-700 text-white backdrop-blur-sm shadow-xl">
        <CardHeader className="text-center border-b border-zinc-800 pb-4">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Dices className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
            Dice Betting
          </CardTitle>
          <CardDescription className="text-zinc-400">
            <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-md text-xs font-medium mr-2">Win: 4-6</span>
            <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-md text-xs font-medium">Lose: 1-3</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-6">
            <div className="bg-zinc-800/50 px-4 py-3 rounded-lg">
              <p className="text-sm text-zinc-400">Your Balance</p>
              <p className="text-2xl font-bold flex items-center">
                <DollarSign className="h-5 w-5 text-emerald-500" />
                <span className={balance > 1000 ? "text-emerald-400" : balance < 1000 ? "text-red-400" : "text-white"}>
                  {balance.toLocaleString()}
                </span>
              </p>
            </div>
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
                      onClick={() => setShowStats(!showStats)}
                    >
                      {showStats ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Game Statistics</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
                      onClick={() => setShowHistory(true)}
                    >
                      <History className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Game History</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {showStats && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 bg-zinc-800/30 rounded-lg p-4 border border-zinc-800"
            >
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xs text-zinc-400">Win Rate</p>
                  <p className="text-xl font-bold text-white">{stats.winRate}%</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Wins</p>
                  <p className="text-xl font-bold text-emerald-400">{stats.wins}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Losses</p>
                  <p className="text-xl font-bold text-red-400">{stats.losses}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Total Won</p>
                  <p className="text-lg font-bold text-emerald-400">${stats.totalWon}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Total Lost</p>
                  <p className="text-lg font-bold text-red-400">${stats.totalLost}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Net Profit</p>
                  <p className={`text-lg font-bold ${stats.netProfit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    ${stats.netProfit >= 0 ? stats.netProfit : Math.abs(stats.netProfit)}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="flex justify-center mb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={diceValue + (rolling ? "-rolling" : "")}
                initial={{ rotateX: 0, scale: 1 }}
                animate={rolling ? { 
                  rotateX: [0, 360, 720, 1080], 
                  rotateZ: [0, 180, 360], 
                  scale: [1, 1.2, 0.9, 1.1, 1] 
                } : { rotateX: 0, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="relative"
              >
                <Die value={diceValue} result={result} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="space-y-4">
            <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-800">
              <label htmlFor="bet-amount" className="block text-sm font-medium text-zinc-400 mb-2">
                Bet Amount
              </label>
              <div className="flex space-x-2">
                <Input
                  id="bet-amount"
                  type="number"
                  value={betAmount}
                  onChange={handleBetChange}
                  min={1}
                  max={balance}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  disabled={rolling}
                />
                <Button
                  variant="outline"
                  className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
                  onClick={() => setBetAmount(Math.max(1, Math.floor(balance * 0.1)))}
                  disabled={rolling}
                >
                  10%
                </Button>
                <Button
                  variant="outline"
                  className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
                  onClick={() => setBetAmount(Math.max(1, Math.floor(balance * 0.5)))}
                  disabled={rolling}
                >
                  50%
                </Button>
                <Button
                  variant="outline"
                  className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
                  onClick={() => setBetAmount(balance)}
                  disabled={rolling}
                >
                  Max
                </Button>
              </div>
            </div>
          </div>

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-4 rounded-lg text-center ${
                result === "win" 
                  ? "bg-gradient-to-r from-emerald-900/50 to-emerald-700/30 text-emerald-400 border border-emerald-700/50" 
                  : "bg-gradient-to-r from-red-900/50 to-red-700/30 text-red-400 border border-red-700/50"
              }`}
            >
              <p className="text-lg font-bold">
                {result === "win" 
                  ? `You won $${betAmount.toLocaleString()}! 🎉` 
                  : `You lost $${betAmount.toLocaleString()}. 😢`
                }
              </p>
              <p className="text-sm opacity-80 mt-1">
                {result === "win" 
                  ? "Congratulations on your win!" 
                  : "Better luck next time."
                }
              </p>
            </motion.div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between border-t border-zinc-800 pt-6 pb-6">
          <Button
            variant="outline"
            onClick={resetGame}
            className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
            disabled={rolling || (balance === 1000 && gameHistory.length === 0)}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button
            onClick={rollDice}
            disabled={rolling || balance < betAmount}
            className={`relative overflow-hidden ${
              rolling 
                ? "bg-zinc-700 cursor-not-allowed" 
                : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all"
            }`}
          >
            {rolling ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Rolling...</span>
              </div>
            ) : (
              <>
                <Dices className="mr-2 h-4 w-4" />
                Roll Dice
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* History Dialog */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="bg-zinc-900 border-zinc-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Game History</DialogTitle>
            <DialogDescription className="text-zinc-400">Your recent dice rolls and outcomes</DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-72 pr-4">
            {gameHistory.length > 0 ? (
              <div className="space-y-2">
                {gameHistory.map((game, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-md border ${
                      game.outcome === "win" 
                        ? "border-emerald-800/50 bg-gradient-to-r from-emerald-900/30 to-emerald-800/10" 
                        : "border-red-800/50 bg-gradient-to-r from-red-900/30 to-red-800/10"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-md flex items-center justify-center font-bold text-lg ${
                            game.outcome === "win" ? "bg-emerald-700/50 text-emerald-300" : "bg-red-700/50 text-red-300"
                          }`}
                        >
                          {game.roll}
                        </div>
                        <div>
                          <div className="text-sm font-medium">Bet: ${game.bet.toLocaleString()}</div>
                          <div className="text-xs text-zinc-500">{game.timestamp}</div>
                        </div>
                      </div>
                      <Badge 
                        variant={game.outcome === "win" ? "default" : "destructive"}
                        className={game.outcome === "win" ? "bg-emerald-800 hover:bg-emerald-700" : ""}
                      >
                        {game.outcome === "win" ? `+$${game.balanceChange.toLocaleString()}` : `-$${-game.balanceChange.toLocaleString()}`}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 px-4">
                <div className="mb-2 inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-800">
                  <History className="h-6 w-6 opacity-50" />
                </div>
                <p className="text-zinc-500 text-lg">No game history yet</p>
                <p className="text-zinc-600 text-sm">Start playing to see your results here!</p>
              </div>
            )}
          </ScrollArea>

          <DialogFooter>
            <Button
              onClick={() => setShowHistory(false)}
              className="w-full bg-gradient-to-r from-zinc-700 to-zinc-800 hover:from-zinc-600 hover:to-zinc-700 transition-all"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Die component to display dice face
function Die({ value, result }: { value: number; result: "win" | "lose" | null }) {
  // Map of dot positions for each die value
  const dotPositions = {
    1: [{ top: "50%", left: "50%" }],
    2: [
      { top: "25%", left: "25%" },
      { top: "75%", left: "75%" },
    ],
    3: [
      { top: "25%", left: "25%" },
      { top: "50%", left: "50%" },
      { top: "75%", left: "75%" },
    ],
    4: [
      { top: "25%", left: "25%" },
      { top: "25%", left: "75%" },
      { top: "75%", left: "25%" },
      { top: "75%", left: "75%" },
    ],
    5: [
      { top: "25%", left: "25%" },
      { top: "25%", left: "75%" },
      { top: "50%", left: "50%" },
      { top: "75%", left: "25%" },
      { top: "75%", left: "75%" },
    ],
    6: [
      { top: "25%", left: "25%" },
      { top: "25%", left: "50%" },
      { top: "25%", left: "75%" },
      { top: "75%", left: "25%" },
      { top: "75%", left: "50%" },
      { top: "75%", left: "75%" },
    ],
  }

  const dots = dotPositions[value as keyof typeof dotPositions] || []

  // Determine die background color based on result
  let dieColorClass = "from-zinc-800 to-zinc-700"
  let borderColorClass = "border-zinc-600"
  let shadowColorClass = "shadow-zinc-900/50"
  let dotColorClass = "bg-zinc-300"

  if (result === "win") {
    dieColorClass = "from-emerald-800/80 to-emerald-700/60"
    borderColorClass = "border-emerald-500"
    shadowColorClass = "shadow-emerald-900/50"
    dotColorClass = "bg-emerald-200"
  } else if (result === "lose") {
    dieColorClass = "from-red-800/80 to-red-700/60"
    borderColorClass = "border-red-500"
    shadowColorClass = "shadow-red-900/50"
    dotColorClass = "bg-red-200"
  }

  return (
    <div 
      className={`w-28 h-28 bg-gradient-to-br ${dieColorClass} rounded-xl shadow-lg border-2 ${borderColorClass} relative shadow-2xl ${shadowColorClass}`}
      style={{ 
        boxShadow: result ? `0 0 20px 5px ${result === "win" ? "rgba(16, 185, 129, 0.25)" : "rgba(239, 68, 68, 0.25)"}` : undefined 
      }}
    >
      {dots.map((position, index) => (
        <div
          key={index}
          className={`absolute w-5 h-5 ${dotColorClass} rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-inner`}
          style={{ top: position.top, left: position.left }}
        />
      ))}
    </div>
  )
}