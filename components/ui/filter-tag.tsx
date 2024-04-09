import { Badge } from '@/components/ui/badge'
import { X } from "lucide-react"
import { type MouseEvent } from 'react'

type FilterTagProps = { 
    title: string
    content: string
    unselectHandler: (content: string) => void
    className?: string
 }

export function FilterTag({ title, content, unselectHandler, className }: FilterTagProps ) {
    return (
        <div>
            <button
                className="ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        unselectHandler(content)
                    }
                }}
                onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                }}
                onClick={() => unselectHandler(content)}
            >
                <Badge className={`group py-1 bg-slate-300 rounded-2xl hover:bg-slate-400 ${className}`} variant='secondary'>
                    <span className='text-left'>
                        <p className='text-[0.65rem] font-bold'>{title}</p>
                        <p className='text-sm font-normal'>{content}</p>
                    </span> <X className="h-4 w-4 ml-1 text-muted-foreground group-hover:text-foreground" /> 
                </Badge>
            </button>
        </div>
    )
}

