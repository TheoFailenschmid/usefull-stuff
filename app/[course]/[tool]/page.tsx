import { courses } from "@/components/course-routing";

export default function Page({
  params,
}: {
  params: { tool: string; course: string }
}) {
  const { tool: toolId, course: courseId } = params
  const tool = courses
    .find((c) => c.course === courseId)
    ?.tools.find((t) => t.id === toolId)

  if (!tool) {
    return
  }

  return (
    <div className="min-h-screen">
      <h2>{tool.name}</h2>
      <div className="mt-4">
        <tool.commponent />
      </div>
    </div>
  )
}

export function generateStaticParams() {
  return courses.flatMap((course) =>
    course.tools.map((tool) => ({
      course: course.course,
      tool: tool.id,
    }))
  )
}
