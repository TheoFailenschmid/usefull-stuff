"use client"

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Input } from "../ui/input"
import { Separator } from "../ui/separator"
import { TypographyH3 } from "../ui/typography"

const SetOperationsTool = () => {
  const [setA, setSetA] = useState<string[]>([])
  const [setB, setSetB] = useState<string[]>([])

  return (
    <div>
      <Field>
        <FieldLabel htmlFor="set-a">Set A</FieldLabel>
        <Input
          id="set-a"
          placeholder="1,2,3"
          onChange={(e) =>
            setSetA(e.target.value.split(",").map((s) => s.trim()))
          }
        />
        <FieldDescription>
          Enter the elements of Set A separated by commas.
        </FieldDescription>
      </Field>
      <Field className="mt-4">
        <FieldLabel htmlFor="set-b">Set B</FieldLabel>
        <Input
          id="set-b"
          placeholder="1,2,3"
          onChange={(e) =>
            setSetB(e.target.value.split(",").map((s) => s.trim()))
          }
        />
        <FieldDescription>
          Enter the elements of Set B separated by commas.
        </FieldDescription>
      </Field>

      <Separator className="my-8" />

      <div className="mb-4 flex gap-2">
        <div>
          <TypographyH3>Subset of Defined Sets</TypographyH3>
          <table className="mt-4">
            <thead>
              <tr className="font-bold">
                <th className="p-3"></th>
                <th className="border p-3">ℕ</th>
                <th className="border p-3">ℤ</th>
                <th className="border p-3">ℚ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-3">A</td>

                <td
                  className={cn(
                    "aspect-square border text-center",
                    isInNN(setA)
                      ? "bg-green-100 dark:bg-green-900"
                      : "bg-red-100 dark:bg-red-900"
                  )}
                >
                  {isInNN(setA) ? "✓" : "✕"}
                </td>
                <td
                  className={cn(
                    "aspect-square border text-center",
                    isInZZ(setA)
                      ? "bg-green-100 dark:bg-green-900"
                      : "bg-red-100 dark:bg-red-900"
                  )}
                >
                  {isInZZ(setA) ? "✓" : "✕"}
                </td>
                <td
                  className={cn(
                    "aspect-square border text-center",
                    isInQQ(setA)
                      ? "bg-green-100 dark:bg-green-900"
                      : "bg-red-100 dark:bg-red-900"
                  )}
                >
                  {isInQQ(setA) ? "✓" : "✕"}
                </td>
              </tr>
              <tr>
                <td className="border p-3">B</td>
                <td
                  className={cn(
                    "aspect-square border text-center",
                    isInNN(setB)
                      ? "bg-green-100 dark:bg-green-900"
                      : "bg-red-100 dark:bg-red-900"
                  )}
                >
                  {isInNN(setB) ? "✓" : "✕"}
                </td>
                <td
                  className={cn(
                    "aspect-square border text-center",
                    isInZZ(setB)
                      ? "bg-green-100 dark:bg-green-900"
                      : "bg-red-100 dark:bg-red-900"
                  )}
                >
                  {isInZZ(setB) ? "✓" : "✕"}
                </td>
                <td
                  className={cn(
                    "aspect-square border text-center",
                    isInQQ(setB)
                      ? "bg-green-100 dark:bg-green-900"
                      : "bg-red-100 dark:bg-red-900"
                  )}
                >
                  {isInQQ(setB) ? "✓" : "✕"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="mb-4 flex gap-2">
        <div>
          <TypographyH3>Set Operations</TypographyH3>
          <table className="mt-4">
            <thead>
              <tr className="font-bold">
                <th className="p-3"></th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-3">A ∪ B</td>
                <td className="font-mon border bg-muted p-3">
                  {Array.from(new Set([...setA, ...setB])).join(", ") || "∅"}
                </td>
              </tr>
              <tr>
                <td className="border p-3">A ∩ B</td>
                <td className="font-mon border bg-muted p-3">
                  {setA.filter((x) => setB.includes(x)).join(", ") || "∅"}
                </td>
              </tr>
              <tr>
                <td className="border p-3">A \ B</td>
                <td className="font-mon border bg-muted p-3">
                  {setA.filter((x) => !setB.includes(x)).join(", ") || "∅"}
                </td>
              </tr>
              <tr>
                <td className="border p-3">B \ A</td>
                <td className="font-mon border bg-muted p-3">
                  {setB.filter((x) => !setA.includes(x)).join(", ") || "∅"}
                </td>
              </tr>
              <tr>
                <td className="border p-3">B Δ A</td>
                <td className="font-mon border bg-muted p-3">
                  {Array.from(
                    new Set(
                      [...setA, ...setB].filter(
                        (x) => !setA.includes(x) || !setB.includes(x)
                      )
                    )
                  ).join(", ") || "∅"}
                </td>
              </tr>
              <tr>
                <td className="border p-3">A × B</td>
                <td className="font-mon border bg-muted p-3">
                  {setA
                    .flatMap((a) => setB.map((b) => `(${a}, ${b})`))
                    .join(", ") || "∅"}
                </td>
              </tr>
              <tr>
                <td className="border p-3">B × A</td>
                <td className="font-mon border bg-muted p-3">
                  {setB
                    .flatMap((a) => setA.map((b) => `(${a}, ${b})`))
                    .join(", ") || "∅"}
                </td>
              </tr>
              <tr>
                <td className="border p-3">𝒫(A)</td>
                <td className="font-mon border bg-muted p-3">
                  {setA.length === 0
                    ? "∅"
                    : Array.from(
                        new Set(
                          setA.reduce(
                            (acc, val) => [
                              ...acc,
                              ...acc.map((subset) => [...subset, val]),
                            ],
                            [[]] as string[][]
                          )
                        )
                      )
                        .map((subset) => `{${subset.join(", ")}}`)
                        .join(", ")
                        .replace("{}", "∅")}
                </td>
              </tr>

              <tr>
                <td className="border p-3">𝒫(B)</td>
                <td className="font-mon border bg-muted p-3">
                  {setA.length === 0
                    ? "∅"
                    : Array.from(
                        new Set(
                          setB.reduce(
                            (acc, val) => [
                              ...acc,
                              ...acc.map((subset) => [...subset, val]),
                            ],
                            [[]] as string[][]
                          )
                        )
                      )
                        .map((subset) => `{${subset.join(", ")}}`)
                        .join(", ")
                        .replace("{}", "∅")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="mb-4 flex gap-2">
        <div>
          <TypographyH3>Subsets</TypographyH3>
          <table className="mt-4">
            <thead>
              <tr className="font-bold">
                <th className="p-3"></th>
                <th className="border p-3">A</th>
                <th className="border p-3">B</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-3 font-bold">A</td>
                <td className="border bg-muted p-3 text-center">✓</td>
                <td
                  className={cn(
                    "border p-3 text-center",
                    setA.every((a) => setB.includes(a))
                      ? "bg-green-100 dark:bg-green-900"
                      : "bg-red-100 dark:bg-red-900"
                  )}
                >
                  {setA.every((a) => setB.includes(a)) ? "✓" : "✕"}
                </td>
              </tr>
              <tr>
                <td className="border p-3 font-bold">B</td>
                <td
                  className={cn(
                    "border p-3 text-center",
                    setB.every((b) => setA.includes(b))
                      ? "bg-green-100 dark:bg-green-900"
                      : "bg-red-100 dark:bg-red-900"
                  )}
                >
                  {setB.every((b) => setA.includes(b)) ? "✓" : "✕"}
                </td>
                <td className="border bg-muted p-3 text-center">✓</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default SetOperationsTool

function isInNN(set: string[]) {
  if (set.length === 0) return false

  return set.every((s) => /^\d+$/.test(s))
}
function isInZZ(set: string[]) {
  if (set.length === 0) return false

  return set.every((s) => /^-?\d+$/.test(s))
}
function isInQQ(set: string[]) {
  if (set.length === 0) return false

  return set.every((s) => /^-?\d+(\.\d+)?$/.test(s))
}
