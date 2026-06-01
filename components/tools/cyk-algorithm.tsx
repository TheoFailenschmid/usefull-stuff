import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { useCallback, useEffect, useState } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { ButtonGroup } from "../ui/button-group"
import { Input } from "../ui/input"
import { Separator } from "../ui/separator"
import { Textarea } from "../ui/textarea"
import { TypographyInlineCode } from "../ui/typography"

type Cell = { row: number; col: number }

type CalculationStep = {
  row: number
  col: number
  addedSymbols: string[]
  rules: string[]
  sourceCells: Cell[]
}

const createEmptyTable = (size: number) =>
  Array.from({ length: size }, () =>
    Array.from({ length: size }, () => new Set<string>())
  )

const CYKAlgorithmTool = () => {
  const [grammar, setGrammar] = useState<{ input: string; output: string }[]>(
    []
  )
  const [startSymbol, setStartSymbol] = useState<string>("S")
  const [terminals, setTerminals] = useState<string[]>([])
  const [nonTerminals, setNonTerminals] = useState<string[]>([])
  const [string, setString] = useState<string>("")
  const [isRunning, setIsRunning] = useState(false)

  const [table, setTable] = useState<Set<string>[][]>([])
  const [visibleTable, setVisibleTable] = useState<Set<string>[][]>([])
  const [steps, setSteps] = useState<CalculationStep[]>([])
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [result, setResult] = useState<string | null>(null)
  const [highlightCell, setHighlightCell] = useState<Cell | null>(null)
  const [sourceCells, setSourceCells] = useState<Cell[]>([])

  const handleGrammarChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const lines = e.target.value.split("\n")
    const newGrammar: { input: string; output: string }[] = []

    lines.forEach((line) => {
      if (!line.includes("->")) {
        return
      }

      const [input, output] = line.split("->").map((part) => part.trim())

      output
        .split("|")
        .map((part) => part.trim())
        .forEach((rule) => {
          newGrammar.push({ input, output: rule })
        })
    })

    setGrammar(newGrammar)

    const newTerminals = new Set<string>()
    const newNonTerminals = new Set<string>()

    newGrammar.forEach(({ input, output }) => {
      newNonTerminals.add(input)
      output.split("").forEach((symbol) => {
        if (symbol.match(/^[a-z]$/)) {
          newTerminals.add(symbol)
        } else if (symbol.match(/^[A-Z]$/)) {
          newNonTerminals.add(symbol)
        }
      })
    })

    setTerminals(Array.from(newTerminals).sort((a, b) => a.localeCompare(b)))
    setNonTerminals(
      Array.from(newNonTerminals).sort((a, b) => a.localeCompare(b))
    )

    setTable([])
    setVisibleTable([])
    setSteps([])
    setCurrentStepIndex(0)
    setResult(null)
    setHighlightCell(null)
    setSourceCells([])
    setIsRunning(false)
  }

  const initializeCYK = useCallback(() => {
    if (!string || grammar.length === 0) {
      alert("Please enter a string and define grammar rules")
      return
    }

    const n = string.length
    const finalTable = createEmptyTable(n)
    const calculationSteps: CalculationStep[] = []

    for (let col = 0; col < n; col++) {
      const char = string[col]
      const addedSymbols = new Set<string>()
      const rules: string[] = []

      grammar.forEach(({ input, output }) => {
        if (output === char) {
          finalTable[0][col].add(input)
          addedSymbols.add(input)
          rules.push(`${input} -> ${output}`)
        }
      })

      if (addedSymbols.size > 0) {
        calculationSteps.push({
          row: 0,
          col,
          addedSymbols: Array.from(addedSymbols),
          rules,
          sourceCells: [],
        })
      }
    }

    for (let len = 2; len <= n; len++) {
      for (let col = 0; col <= n - len; col++) {
        const row = len - 1

        for (let split = 0; split < len - 1; split++) {
          const leftSet = finalTable[split][col]
          const rightSet = finalTable[row - split - 1][col + split + 1]
          const addedSymbols = new Set<string>()
          const rules: string[] = []

          for (const leftSymbol of leftSet) {
            for (const rightSymbol of rightSet) {
              grammar.forEach(({ input, output }) => {
                if (output === `${leftSymbol}${rightSymbol}`) {
                  finalTable[row][col].add(input)
                  addedSymbols.add(input)
                  rules.push(`${input} -> ${leftSymbol}${rightSymbol}`)
                }
              })
            }
          }

          if (addedSymbols.size > 0) {
            calculationSteps.push({
              row,
              col,
              addedSymbols: Array.from(addedSymbols),
              rules,
              sourceCells: [
                { row: split, col },
                { row: row - split - 1, col: col + split + 1 },
              ],
            })
          }
        }
      }
    }

    setTable(finalTable)
    setVisibleTable(createEmptyTable(n))
    setSteps(calculationSteps)
    setCurrentStepIndex(0)
    setHighlightCell(null)
    setSourceCells([])
    setIsRunning(false)

    const accepted = finalTable[n - 1][0].has(startSymbol)
    setResult(accepted ? "✓ Accepted" : "✗ Rejected")
  }, [string, grammar, startSymbol])

  const goToNextStep = () => {
    setCurrentStepIndex((current) => Math.min(current + 1, steps.length))
  }

  const goToPreviousStep = () => {
    setCurrentStepIndex((current) => Math.max(current - 1, 0))
  }

  useEffect(() => {
    if (currentStepIndex === 0 || steps.length === 0) {
      setHighlightCell(null)
      setSourceCells([])
      return
    }

    const step = steps[currentStepIndex - 1]
    if (!step) {
      return
    }

    setHighlightCell({ row: step.row, col: step.col })
    setSourceCells(step.sourceCells)
  }, [currentStepIndex, steps])

  useEffect(() => {
    if (table.length === 0) {
      setVisibleTable([])
      return
    }

    const progressTable = createEmptyTable(table.length)

    for (let index = 0; index < currentStepIndex; index++) {
      const step = steps[index]
      if (!step) {
        continue
      }

      step.addedSymbols.forEach((symbol) => {
        progressTable[step.row][step.col].add(symbol)
      })
    }

    setVisibleTable(progressTable)
  }, [table, steps, currentStepIndex])

  useEffect(() => {
    if (!isRunning) {
      return
    }

    if (currentStepIndex >= steps.length) {
      setIsRunning(false)
      return
    }

    const timer = setTimeout(() => {
      goToNextStep()
    }, 500)

    return () => clearTimeout(timer)
  }, [isRunning, currentStepIndex, steps.length])

  const isCandidatePathCell = (cellRow: number, cellCol: number) => {
    if (!highlightCell || highlightCell.row === 0) {
      return false
    }

    const row = highlightCell.row
    const col = highlightCell.col

    for (let split = 0; split < row; split++) {
      const leftCell = { row: split, col }
      const rightCell = { row: row - split - 1, col: col + split + 1 }

      if (
        (cellRow === leftCell.row && cellCol === leftCell.col) ||
        (cellRow === rightCell.row && cellCol === rightCell.col)
      ) {
        return true
      }
    }

    return false
  }

  return (
    <div>
      <Field>
        <FieldLabel htmlFor="input-string">String</FieldLabel>
        <Input
          id="input-string"
          placeholder="aabbbb"
          value={string}
          onChange={(e) => setString(e.target.value)}
        />
        <FieldDescription>
          The string you would like to check if it can be generated by the
          grammar
        </FieldDescription>
      </Field>

      <Field className="mt-4">
        <FieldLabel htmlFor="input-grammar">Production Rules</FieldLabel>
        <Textarea
          id="input-grammar"
          placeholder="S -> a | AB"
          onChange={(e) => handleGrammarChange(e)}
        />
        <FieldDescription>
          List all production rules of the grammar in CNF form:{" "}
          <TypographyInlineCode className="text-xs">
            A -&gt; a | AB
          </TypographyInlineCode>
        </FieldDescription>
      </Field>

      <Field className="mt-4">
        <FieldLabel htmlFor="input-starting">Starting Symbols</FieldLabel>
        <Input
          id="input-starting"
          placeholder="S"
          value={startSymbol}
          onChange={(e) => setStartSymbol(e.target.value)}
        />
        <FieldDescription>The starting symbol of your grammar</FieldDescription>
      </Field>

      <Accordion type="single" collapsible className="mt-4 border px-4">
        <AccordionItem value="terminals">
          <AccordionTrigger>Symbol Definitions</AccordionTrigger>
          <AccordionContent>
            <Alert variant="destructive">
              <AlertTitle>Automatic Symbol Extraction</AlertTitle>
              <AlertDescription>
                The tool will try to automatically extract terminal and
                non-terminal symbols from the production rules, but you can also
                specify them manually here if you want to. Make sure they are
                consistent with the production rules you provided.
              </AlertDescription>
            </Alert>
            <Field className="mt-4">
              <FieldLabel htmlFor="input-terminals">
                Terminal Symbols
              </FieldLabel>
              <Input
                id="input-terminals"
                placeholder="a,b,c"
                value={terminals.join(",")}
                onChange={(e) => setTerminals(e.target.value.split(","))}
              />
              <FieldDescription>
                List all terminal symbols of the grammar, separated by commas
              </FieldDescription>
            </Field>

            <Field className="mt-4">
              <FieldLabel htmlFor="input-nonterminals">
                Non Terminal Symbols
              </FieldLabel>
              <Input
                id="input-nonterminals"
                placeholder="A,B,C"
                value={nonTerminals.join(",")}
                onChange={(e) => setNonTerminals(e.target.value.split(","))}
              />
              <FieldDescription>
                List all non terminal symbols of the grammar, separated by
                commas
              </FieldDescription>
            </Field>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Separator className="my-8" />

      <div className="mb-4 flex gap-2">
        <ButtonGroup className="w-full gap-2">
          <Button onClick={initializeCYK} variant="default" className="grow">
            Initialize Algorithm
          </Button>
          <Button
            onClick={goToNextStep}
            variant="secondary"
            disabled={currentStepIndex >= steps.length}
            className="grow"
          >
            Next Step
          </Button>
          <Button
            onClick={goToPreviousStep}
            disabled={currentStepIndex === 0}
            variant="outline"
            className="grow"
          >
            Previous Step
          </Button>
          <Button
            onClick={() => setIsRunning(!isRunning)}
            disabled={steps.length === 0}
            variant="destructive"
            className="grow"
          >
            {isRunning ? "Pause" : "Auto Step"}
          </Button>
        </ButtonGroup>
      </div>

      <div className="m-2 text-sm text-gray-600 dark:text-gray-400">
        Steps: {currentStepIndex} / {steps.length}
      </div>
      {table.length > 0 && visibleTable.length > 0 && (
        <div className="flex flex-row gap-4 overflow-x-auto mb-4">
          {currentStepIndex > 0 && steps[currentStepIndex - 1] && (
            <Alert className="h-full flex-1" variant="default">
              <AlertTitle className="">
                Production Rules - Current Step
              </AlertTitle>
              <AlertDescription className="h-full">
                <div className="mt-2">
                  <div className="mt-3 flex flex-wrap gap-1">
                    <p className="leading-relaxed">
                      {grammar.map(({ input, output }, idx) => (
                        <span
                          key={`${input}-${output}-${idx}`}
                          className={
                            steps[currentStepIndex - 1].rules.includes(
                              `${input} -> ${output}`
                            )
                              ? "bg-yellow-800 p-1 font-bold text-white"
                              : "p-1"
                          }
                        >
                          {input} -&gt; {output}
                          <br />
                        </span>
                      ))}
                    </p>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    =&gt;{" "}
                    {steps[currentStepIndex - 1].addedSymbols.map((symbol) => (
                      <Badge key={symbol} className="rounded-xl bg-blue-400">
                        {symbol}
                      </Badge>
                    ))}
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="inline-block border">
            <table className="border-collapse">
              <thead>
                <tr>
                  <th className="border px-3 py-2"></th>
                  {string.split("").map((char, idx) => (
                    <th key={idx} className="border px-3 py-2 text-center">
                      <div className="">{char}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleTable.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td className="border px-3 py-2 font-semibold">
                      {rowIndex + 1}
                    </td>
                    {row.map((cell, colIndex) => {
                      const isHighlighted =
                        highlightCell &&
                        highlightCell.row === rowIndex &&
                        highlightCell.col === colIndex
                      const isSourceCell = sourceCells.some(
                        (sc) => sc.row === rowIndex && sc.col === colIndex
                      )
                      const isSourcePath =
                        isCandidatePathCell(rowIndex, colIndex) &&
                        !isSourceCell &&
                        !isHighlighted

                      const isUpperTriangle =
                        colIndex < string.split("").length - rowIndex

                      return (
                        <td
                          key={`${rowIndex}-${colIndex}`}
                          className={`aspect-square h-24 max-w-24 min-w-20 border px-3 py-2 text-center ${
                            isHighlighted
                              ? "border-2 border-yellow-500 bg-yellow-100 dark:border-yellow-400 dark:bg-yellow-900"
                              : isSourceCell
                                ? "border-2 border-pink-400 bg-pink-100 dark:border-pink-400 dark:bg-pink-900"
                                : isSourcePath
                                  ? "bg-pink-50 dark:bg-pink-950"
                                  : cell.size > 0
                                    ? ""
                                    : isUpperTriangle
                                      ? "bg-white opacity-25 dark:bg-gray-900"
                                      : "border-0 bg-[repeating-linear-gradient(45deg,_#f9f8f8_0,_#f9f8f8_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed dark:bg-[repeating-linear-gradient(45deg,_#241f1d_0,_#241f1d_1px,_transparent_0,_transparent_50%)]"
                          }`}
                        >
                          {cell.size > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {cell.size > 0
                                ? Array.from(cell).map((symbol) => (
                                    <Badge
                                      key={symbol}
                                      className="rounded-xl bg-blue-400"
                                    >
                                      {symbol}
                                    </Badge>
                                  ))
                                : "-"}
                            </div>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {result && (
        <div
          className={`mb-4 rounded p-4 ${result.includes("✓") ? "bg-green-50 dark:bg-green-950" : "bg-red-50 dark:bg-red-950"}`}
        >
          <p
            className={`text-lg font-semibold ${result.includes("✓") ? "text-green-700 dark:text-green-200" : "text-red-700 dark:text-red-200"}`}
          >
            {result}
          </p>
          {result.includes("✓") && (
            <p className="text-sm text-green-600 dark:text-green-300">
              The string can be generated by the grammar.
            </p>
          )}
          {result.includes("✗") && (
            <p className="text-sm text-red-600 dark:text-red-300">
              The string cannot be generated by the grammar.
            </p>
          )}
        </div>
      )}

      <Separator className="my-8" />
    </div>
  )
}

export default CYKAlgorithmTool
