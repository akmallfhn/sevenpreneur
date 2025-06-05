"use client"

const variantStyles = {
    main: {
        backgroundColor: "linear-gradient(to right, rgb(37, 98, 231) 0%, rgb(110, 0, 255) 100%)",
        labelColor: "text-white"
    },
    secondary: {
        backgroundColor: "#FAFAFA",
        labelColor: "text-alternative border border-[#D8D8D8]"
    },
}

export default function LabelAttributeCMS({ labelName, variants = "main" }) {

    // Menentukan varian
    const { backgroundColor, labelColor } = variantStyles[variants] || variantStyles.main;

    return(
        <div className={`label-container flex py-[2px] px-[10px] w-fit rounded-full items-center justify-center text-xs font-medium font-bodycopy truncate ${labelColor}`} style={{backgroundImage: backgroundColor}}>
            {labelName}
        </div>
    )
}