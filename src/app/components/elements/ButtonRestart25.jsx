"use client"
import { sendGTMEvent } from "@next/third-parties/google"

export default function ButtonRestart25({ buttonTitle, Icon, buttonAltTitle, id, variant = "one liner", disabled, addCSS, addCSSIcon }) {

    const handleClick = () => {
        sendGTMEvent({
          event: 'testClick',
          clickId: id,
        })
    }
    
    return(
        <button 
        disabled={disabled}
        onClick={handleClick}
        id={id}
        className={`button flex px-4 py-2 transition transform rounded-full ${disabled ? "bg-gray-400 cursor-not-allowed" : "hover:cursor-pointer bg-primary active:scale-95 active:bg-primary-strong"}`}>
            
            <div className={`flex items-center gap-1.5 w-fit lg:gap-3 ${addCSS}`}>
                {variant === "one liner" && (
                    <p className="text-white font-bodycopy font-bold text-sm truncate lg:text-lg">
                        {buttonTitle}
                    </p>
                )}            

                {variant === "two liner" && (
                    <div className="flex flex-col font-bodycopy text-white items-start">
                        <p className="font-bold text-xs truncate">
                            {buttonTitle}
                        </p>
                        <p className="text-[10px] truncate">
                            {buttonAltTitle}
                        </p>
                    </div>
                )}

                { Icon && (
                    <div className={`rounded-full ${disabled ? "bg-gray-500" : "bg-secondary"}`}>
                        <Icon
                        className={`p-1 size-5 ${addCSSIcon}`}
                        color="#ffffff"
                        strokeWidth={2}/>
                    </div>
                )}
            </div>
        </button>
    )
}