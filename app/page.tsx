"use client"
import { tools } from "@/components/course-routing"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useState } from "react"

export default function Page() {
  const [search, setSearch] = useState("")

  return (
    <div className="flex min-h-screen flex-col">
      <header>
        <div className="mx-auto flex gap-4 px-4 py-3"></div>
      </header>

      <main className="w-full flex-1 p-6">
        <div className="mx-auto max-w-7xl px-4">
          <div className="min-h-screen">
            <div className="min-h-screen">
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="mt-4">
                {tools
                  .filter((tool) =>
                    tool.name.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((tool) => (
                    <Link key={tool.id} href={`/${tool.course}/${tool.id}`}>
                      <Card className="mb-4 cursor-pointer">
                        <CardHeader>
                          <CardAction>
                            <Badge>{tool.course}</Badge>
                          </CardAction>
                          <CardTitle>{tool.name}</CardTitle>
                          <CardDescription>{tool.description}</CardDescription>
                        </CardHeader>
                      </Card>
                    </Link>
                  ))}
              </div>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  )
}
