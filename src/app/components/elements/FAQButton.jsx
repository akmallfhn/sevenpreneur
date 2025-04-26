"use client"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

export default function FAQButton({ questions, answer }) {
    // State untuk membuka tutup FAQ Button
    const [isOpen, setIsOpen] = useState(false)
    const handleOpen = () => setIsOpen(!isOpen)

    return(
        <div className="border-faq-item p-[1px] rounded-md bg-gradient-to-r from-0% from-[#727272]/80 via-50% via-[#333333] to-100% to-[#727272]/80">
            <div className="faq-item bg-[#191919] flex flex-col w-full max-w-[520px] mx-auto p-3 rounded-md transform transition duration-500 lg:max-w-[840px]" onClick={handleOpen}>
                <div className="question flex text-white justify-between items-center">
                    <p className="font-semibold font-bodycopy text-sm lg:text-lg">
                        {questions}
                    </p>
                    <div className="flex aspect-square size-6 items-center justify-center">
                        <ChevronDown className={`transition-transform size-5 ${isOpen ? "rotate-180" : ""}`}/>
                    </div>
                </div>
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-[500px] opacity-100 mt-2" : "max-h-0 opacity-0"}`}>
                    <p className="text-white/50 text-sm font-bodycopy lg:text-lg">
                        {answer}
                    </p>
                </div>
            </div>
        </div>
    )
}