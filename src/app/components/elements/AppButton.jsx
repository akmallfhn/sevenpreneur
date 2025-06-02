"use client"

export default function AppButton({ onClick, disabled, children }) {
    return(
        <button disabled={disabled} onClick={onClick}
        className={`app-button flex py-2 px-3.5 gap-4 transition transform rounded-xl items-center justify-center border border-[#E3E3E3] ${disabled ? "bg-gray-400 cursor-not-allowed" : "hover:cursor-pointer bg-white active:scale-95 active:bg-[#F5F5F5]"}`}>
            {children}
        </button>
    )
}