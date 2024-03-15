'use client'

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col gap-5 w-full h-1/2 max-w-lg">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Find your next motorcycle.</h1>
        <Input type="keyword" placeholder="Search by keyword" />
        <div className="flex gap-5">
          <Input type="location" placeholder="ZIP or City, State " /> 
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="50 mi." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 mi.</SelectItem>
              <SelectItem value="25">25 mi.</SelectItem>
              <SelectItem value="50">50 mi.</SelectItem>
              <SelectItem value="75">75 mi.</SelectItem>
              <SelectItem value="100">100 mi.</SelectItem>
              <SelectItem value="200">200 mi.</SelectItem>
              <SelectItem value="500">500 mi.</SelectItem>
            </SelectContent>
          </Select>   
        </div>       
        <Button className="self-center" type="submit">Search</Button>    
      </div>
    </div>
    
  );
}
