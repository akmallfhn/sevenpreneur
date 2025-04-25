"use client"

export default function ButtonRestart25({ buttonTitle, Icon, buttonAltTitle, variant = "one liner" }) {
    return(
        <div className="button flex bg-primary w-fit items-center gap-1.5 px-4 py-2 transition transform rounded-full active:scale-95 active:bg-primary-strong hover:cursor-pointer">
            
            {variant === "one liner" && (
                <p className="text-white font-bodycopy font-bold text-sm">
                    {buttonTitle}
                </p>
            )}            

            {variant === "two liner" && (
                <div className="flex flex-col font-bodycopy text-white">
                    <p className="font-bold text-xs truncate">
                        {buttonTitle}
                    </p>
                    <p className="text-[10px] truncate">
                        {buttonAltTitle}
                    </p>
                </div>
            )}

            { Icon && (
                <div className="bg-secondary rounded-full">
                    <Icon
                    className="p-1 size-5"
                    color="#ffffff"
                    strokeWidth={3}/>
                </div>
            )}
        </div>
    )
}