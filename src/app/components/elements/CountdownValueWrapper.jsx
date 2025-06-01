"use client"

export default function CountdownValueWrapper({ value, dimensions }) {
    return(
        <div className="container flex flex-col items-center gap-2">
            <div className="border-countdown p-[1px] rounded-lg bg-gradient-to-r from-0% from-[#727272] via-50% via-[#333333] to-100% to-[#727272]">
                <p className="value flex items-center justify-center bg-[#1B1B1B] w-16 rounded-lg aspect-square font-brand text-4xl font-bold lg:text-[72px] lg:w-[120px]">
                    {value}
                </p>
            </div>  
            <p className="font-bodycopy text-sm lg:text-xl">
                {dimensions}
            </p>  
        </div>
    )
}