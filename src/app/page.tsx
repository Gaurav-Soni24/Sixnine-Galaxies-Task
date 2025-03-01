"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dices, RotateCcw, DollarSign, History } from "lucide-react"
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
    }>
  >([])
  const [showHistory, setShowHistory] = useState(false)

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
          },
          ...prev,
        ])

        setRolling(false)

      }).catch((error) => { console.error(error) })


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

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 bg-black text-white">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-700 text-white">
        <CardHeader className="text-center border-b border-zinc-800">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Dices className="h-6 w-6 text-emerald-500" />
            Dice Betting
          </CardTitle>
          <CardDescription className="text-zinc-400">Roll 4-6 to win, 1-3 to lose</CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-sm text-zinc-400">Your Balance</p>
              <p className="text-2xl font-bold flex items-center">
                <DollarSign className="h-5 w-5 text-emerald-500" />
                {balance.toLocaleString()}
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="border-zinc-700 text-black hover:text-white hover:bg-zinc-800"
              onClick={() => setShowHistory(true)}
            >
              <History className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex justify-center mb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={diceValue + (rolling ? "-rolling" : "")}
                initial={{ rotateX: 0, scale: 1 }}
                animate={rolling ? { rotateX: [0, 360, 720, 1080], scale: [1, 1.1, 1] } : { rotateX: 0, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="relative"
              >
                <Die value={diceValue} result={result} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="bet-amount" className="block text-sm font-medium text-zinc-400 mb-1">
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
                  className="border-zinc-700 text-black hover:text-white hover:bg-zinc-800"
                  onClick={() => setBetAmount(Math.max(1, Math.floor(balance * 0.1)))}
                  disabled={rolling}
                >
                  10%
                </Button>
                <Button
                  variant="outline"
                  className="border-zinc-700 text-black hover:text-white hover:bg-zinc-800"
                  onClick={() => setBetAmount(Math.max(1, Math.floor(balance * 0.5)))}
                  disabled={rolling}
                >
                  50%
                </Button>
                <Button
                  variant="outline"
                  className="border-zinc-700 text-black hover:text-white hover:bg-zinc-800"
                  onClick={() => setBetAmount(balance)}
                  disabled={rolling}
                >
                  Max
                </Button>
              </div>
            </div>
          </div>

          {result && (
            <div
              className={`mt-4 p-3 rounded-md text-center ${result === "win" ? "bg-emerald-900/30 text-emerald-400" : "bg-red-900/30 text-red-400"
                }`}
            >
              {result === "win" ? `You won $${betAmount}! 🎉` : `You lost $${betAmount}. 😢`}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between border-t border-zinc-800 pt-4">
          <Button
            variant="outline"
            onClick={resetGame}
            className="border-zinc-700 text-black hover:text-white hover:bg-zinc-800"
            disabled={rolling || (balance === 1000 && gameHistory.length === 0)}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button
            onClick={rollDice}
            disabled={rolling || balance < betAmount}
            className={`relative overflow-hidden ${rolling ? "bg-zinc-700" : "bg-emerald-600 hover:bg-emerald-500"}`}
          >
            {rolling ? (
              <span className="animate-pulse">Rolling...</span>
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
        <DialogContent className="bg-zinc-900 border-zinc-700 text-white">
          <DialogHeader>
            <DialogTitle>Game History</DialogTitle>
            <DialogDescription className="text-zinc-400">Your recent dice rolls and outcomes</DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[300px] pr-4">
            {gameHistory.length > 0 ? (
              <div className="space-y-2">
                {gameHistory.map((game, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-md border ${game.outcome === "win" ? "border-emerald-800 bg-emerald-900/20" : "border-red-800 bg-red-900/20"
                      }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-md flex items-center justify-center font-bold ${game.outcome === "win" ? "bg-emerald-700" : "bg-red-700"
                            }`}
                        >
                          {game.roll}
                        </div>
                        <span>Bet: ${game.bet}</span>
                      </div>
                      <Badge variant={game.outcome === "win" ? "default" : "destructive"}>
                        {game.outcome === "win" ? `+$${game.balanceChange}` : `-$${-game.balanceChange}`}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-zinc-500">No game history yet. Start playing!</div>
            )}
          </ScrollArea>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowHistory(false)}
              className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
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
  let dieColor = "bg-zinc-800"
  let borderColor = "border-zinc-700"
  let dotColor = "bg-white"

  if (result === "win") {
    dieColor = "bg-zinc-800"
    borderColor = "border-emerald-500"
    dotColor = "bg-emerald-400"
  } else if (result === "lose") {
    dieColor = "bg-zinc-800"
    borderColor = "border-red-500"
    dotColor = "bg-red-400"
  }

  return (
    <div className={`w-24 h-24 ${dieColor} rounded-lg shadow-lg border-2 ${borderColor} relative`}>
      {dots.map((position, index) => (
        <div
          key={index}
          className={`absolute w-4 h-4 ${dotColor} rounded-full transform -translate-x-1/2 -translate-y-1/2`}
          style={{ top: position.top, left: position.left }}
        />
      ))}
    </div>
  )
}

