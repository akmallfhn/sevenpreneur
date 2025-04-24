"use client"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

export default function FAQButton({ questions, answer }) {
    // State untuk membuka tutup FAQ Button
    const [isOpen, setIsOpen] = useState(false)
    const handleOpen = () => setIsOpen(!isOpen)

    return(
        <div className="bg-[#2C2B2B] flex flex-col w-full max-w-[520px] mx-auto p-3 rounded-md transform transition duration-500" onClick={handleOpen}>
            <div className="question flex text-white justify-between items-center">
                <p className="font-semibold font-bodycopy text-sm">
                    {questions}
                </p>
                <div className="flex aspect-square size-6 items-center justify-center">
                    <ChevronDown className={`transition-transform size-5 ${isOpen ? "rotate-180" : ""}`}/>
                </div>
            </div>
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-[500px] opacity-100 mt-2" : "max-h-0 opacity-0"}`}>
                <p className="text-white text-sm font-bodycopy">
                    {answer}
                </p>
            </div>
        </div>
    )
}