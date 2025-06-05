"use client"

export default function TitleRevealCMS({ titlePage, descPage }) {
    return(
        <div className="flex flex-col gap-2">
            <h1 className="flex font-brand font-bold text-lg lg:text-3xl">
                {titlePage}
            </h1>
            <p className="font-bodycopy text-sm text-alternative max-w-96">
                {descPage}
            </p>
        </div>
    )
}