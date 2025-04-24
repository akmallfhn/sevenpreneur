"use client"
import SectionTitleRestart25 from "../elements/SectionTitleRestart25"
import FAQButton from "../elements/FAQButton"

export default function FAQEventRestart25() {
    const FAQData = [
        {
            "question": "What is RE:START Conference 2025?",
            "answer": "The RE:START Conference 2025 will be held inside Mall Kota Kasablanka, Jakarta Pusat. The distance between the building and the airport is only 34 km. There are also several hotels within a radius of 0,4 km - 2 km that you can stay in, such as Wyndham Casablanca Jakarta, The Westin Jakarta, Manhattan Hotel Jakarta, JW Marriott Hotel Jakarta, HARRIS Hotel Tebet Jakarta, Le Meridien Jakarta and many more."
        },
        {
            "question": "Will the conference conducted in Bahasa or English?",
            "answer": "The Finfolkcon 2023 will be held inside Mall Kota Kasablanka, Jakarta Pusat. The distance between the building and the airport is only 34 km. There are also several hotels within a radius of 0,4 km - 2 km that you can stay in, such as Wyndham Casablanca Jakarta, The Westin Jakarta, Manhattan Hotel Jakarta, JW Marriott Hotel Jakarta, HARRIS Hotel Tebet Jakarta, Le Meridien Jakarta and many more."
        },
        {
            "question": "Can I bring my food inside?",
            "answer": "The Finfolkcon 2023 will be held inside Mall Kota Kasablanka, Jakarta Pusat. The distance between the building and the airport is only 34 km. There are also several hotels within a radius of 0,4 km - 2 km that you can stay in, such as Wyndham Casablanca Jakarta, The Westin Jakarta, Manhattan Hotel Jakarta, JW Marriott Hotel Jakarta, HARRIS Hotel Tebet Jakarta, Le Meridien Jakarta and many more."
        },
        {
            "question": "I’m from another city, how do I get to the RE:START Conference 2025",
            "answer": "The Finfolkcon 2023 will be held inside Mall Kota Kasablanka, Jakarta Pusat. The distance between the building and the airport is only 34 km. There are also several hotels within a radius of 0,4 km - 2 km that you can stay in, such as Wyndham Casablanca Jakarta, The Westin Jakarta, Manhattan Hotel Jakarta, JW Marriott Hotel Jakarta, HARRIS Hotel Tebet Jakarta, Le Meridien Jakarta and many more."
        },
        {
            "question": "Can I buy ticket on the spot at venue?",
            "answer": "The Finfolkcon 2023 will be held inside Mall Kota Kasablanka, Jakarta Pusat. The distance between the building and the airport is only 34 km. There are also several hotels within a radius of 0,4 km - 2 km that you can stay in, such as Wyndham Casablanca Jakarta, The Westin Jakarta, Manhattan Hotel Jakarta, JW Marriott Hotel Jakarta, HARRIS Hotel Tebet Jakarta, Le Meridien Jakarta and many more."
        }
    ]

    return(
        <div className="faq flex flex-col gap-3 items-center">
            <SectionTitleRestart25 sectionTitle="Frequently Asked Questions"/>
            {FAQData.map((post, index) => (
                <FAQButton key={index}
                questions={post.question}
                answer={post.answer}
                />
            ))}
        </div>
    )
}