import { buildSearchIndex } from "@/lib/searchIndex"

export const dynamic = "force-static"

export const GET = () => Response.json(buildSearchIndex())
