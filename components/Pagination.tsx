import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { useSearchParams, useRouter, usePathname } from "next/navigation"

type PaginateProps = {
    className?: string | undefined
    resultsCount: number
}

const pageSize = 30

export function Paginate({ className, resultsCount }: PaginateProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const currSearch = new URLSearchParams(searchParams)
    const currPage = Number(searchParams.get('page')) || 1
    const currResults = currPage * pageSize
    const pageCount = Math.floor(resultsCount / pageSize)

    const firstPageHandler = () => {
        currSearch.set('page', '1')
        router.push(`${pathname}?${currSearch.toString()}`);
    }

    const lastPageHandler = () => {
        currSearch.set('page', pageCount.toString())
        router.push(`${pathname}?${currSearch.toString()}`);
    }

    const nextPageHandler = () => {
        currSearch.set('page', (Number(currPage) + 1).toString())
        router.push(`${pathname}?${currSearch.toString()}`);
    }

    const prevPageHandler = () => {
        currSearch.set('page', (Number(currPage) - 1).toString())
        router.push(`${pathname}?${currSearch.toString()}`);
    }


    return (
        <Pagination className={`${className}`}>
            
                {currPage > 1 && (
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious href="#" onClick={prevPageHandler}/>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#" onClick={firstPageHandler}>1</PaginationLink>
                        </PaginationItem>
                        {currPage > 2 && (
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                        )}
                    </PaginationContent>
                )}
                <PaginationContent>
                    <PaginationItem>
                        <PaginationLink className='text-lg hover:bg-transparent hover:cursor-default'>{currPage}</PaginationLink>
                    </PaginationItem>
                </PaginationContent>
                {pageCount > 1 && currPage < pageCount && (
                    <PaginationContent>
                        {(pageCount - currPage) > 1 && (
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                        )}
                        <PaginationItem>
                            <PaginationLink href="#" onClick={lastPageHandler}>{pageCount}</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext href="#" onClick={nextPageHandler}/>
                        </PaginationItem>
                    </PaginationContent>
                )}
            
        </Pagination>
    )
}