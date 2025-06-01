import styles from "./style.module.css"

export const metadata = {
    title: "Privacy Policy | Sevenpreneur",
    description: "Kebijakan privasi Sevenpreneur menjelaskan bagaimana kami mengumpulkan, menyimpan, dan melindungi informasi pribadi Anda saat menggunakan layanan kami.",
    keywords: "Sevenpreneur, kebijakan privasi, privacy policy, data pribadi, keamanan data, informasi pengguna",
    authors: [{ name: "Sevenpreneur Team" }],
    publisher: "Sevenpreneur",
    referrer: "origin-when-cross-origin",
    alternates: {
      canonical: "/privacy-policy"
    },
    openGraph: {
      title: "Privacy Policy | Sevenpreneur",
      description: "Pelajari bagaimana Sevenpreneur menjaga dan melindungi informasi pribadi Anda saat menggunakan layanan kami.",
      url: "https://sevenpreneur.com/privacy-policy",
      siteName: "Sevenpreneur",
      images: [
        {
          url: "https://sevenpreneur.com/assets/og-image-privacy.png",
          width: 1200,
          height: 630,
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Privacy Policy | Sevenpreneur",
      description: "Baca kebijakan privasi Sevenpreneur untuk memahami bagaimana data Anda dikelola dan dilindungi.",
      images: "https://sevenpreneur.com/assets/og-image-privacy.png",
    },
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
};

export default function PrivacyPolicyPage () {
    return(
        <div className={styles.privacy_policy}>            
            <h1>Kebijakan Privasi</h1>
            <p>Dengan menggunakan layanan Sevenpreneur, Anda mempercayakan informasi pribadi Anda kepada kami. Oleh karena itu, Sevenpreneur berkomitmen untuk menjaga keamanan dan kerahasiaan data Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda dalam interaksi dengan kami, baik melalui situs web, platform digital, maupun interaksi lainnya.</p>
            
            <hr/>

            <h2>1. Informasi yang Kami Kumpulkan</h2>
            <p>Sevenpreneur mengumpulkan informasi agar kami dapat memberikan layanan terbaik sesuai kebutuhan pengguna. Jenis informasi yang kami kumpulkan meliputi:</p>

            <h3>a. Informasi yang Anda Berikan Secara Langsung</h3>
            <p>Misalnya saat Anda:</p>
            <ul>
                <li>Melakukan login dengan pihak ketiga seperti Google,</li>
                <li>Mendaftar untuk newsletter atau event,</li>
                <li>Mengisi formulir registrasi atau feedback,</li>
                <li>Menghubungi kami melalui email atau WhatsApp.</li>
            </ul>
            <p>Informasi ini dapat mencakup nama, email, nomor telepon, afiliasi usaha, dan informasi relevan lainnya.</p>

            <h3>b. Informasi Otomatis Saat Anda Mengakses Layanan</h3>
            <p>Kami secara otomatis mencatat informasi teknis saat Anda mengakses situs atau layanan kami, termasuk:</p>
            <ul>
                <li>Alamat IP,</li>
                <li>Jenis perangkat dan browser,</li>
                <li>Waktu dan durasi akses,</li>
                <li>Halaman yang diakses,</li>
                <li>Cookies atau teknologi pelacakan serupa.</li>
            </ul>

            <h3>c. Informasi Lokasi</h3>
            <p>Dengan persetujuan Anda, kami dapat mengakses data lokasi berbasis GPS atau lokasi jaringan saat Anda menggunakan layanan kami.</p>

            <hr/>

            <h2>2. Penggunaan Informasi</h2>
            <p>Informasi yang kami kumpulkan digunakan untuk:</p>
            <ul>
                <li>Memberikan layanan yang relevan dan personal,</li>
                <li>Meningkatkan pengalaman pengguna dan kualitas konten,</li>
                <li>Mengirimkan notifikasi, pengumuman, dan materi promosi yang sesuai,</li>
                <li>Melakukan analisis internal untuk pengembangan produk dan program,</li>
                <li>Menjaga keamanan dan performa layanan kami.</li>
            </ul>

            <hr/>

            <h2>3. Penyimpanan dan Perlindungan Data</h2>
            <p>Sevenpreneur menerapkan langkah-langkah teknis dan organisasi untuk melindungi data Anda dari akses tidak sah, pengubahan, pengungkapan, atau perusakan. Ini termasuk:</p>
            <ul>
                <li>Enkripsi data,</li>
                <li>Autentikasi pihak ketiga terpercaya,</li>
                <li>Review sistem keamanan secara berkala,</li>
                <li>Pembatasan akses internal terhadap data sensitif.</li>
            </ul>

            <hr/>

            <h2>4. Pembagian Informasi</h2>
            <p>Sevenpreneur tidak akan membagikan informasi pribadi Anda kepada pihak ketiga tanpa persetujuan Anda, kecuali dalam kondisi berikut:</p>
            <ul>
                <li><strong>Dengan Izin Anda</strong>: Misalnya saat mengikuti program kolaborasi dengan mitra.</li>
                <li><strong>Kepada Mitra Tepercaya</strong>: Untuk keperluan analisis, pengelolaan acara, atau pengembangan program, dengan syarat mereka mematuhi standar perlindungan data kami.</li>
                <li><strong>Penegakan Hukum</strong>: Jika diwajibkan secara hukum, kami dapat membagikan informasi kepada otoritas terkait.</li>
            </ul>
            <p>Kami dapat membagikan informasi tidak pribadi (non-personally identifiable information) secara agregat untuk keperluan riset atau promosi.</p>

            <hr/>

            <h2>5. Hak Anda atas Data</h2>
            <p>Anda memiliki hak untuk:</p>
            <ul>
                <li>Mengakses, mengubah, atau menghapus data pribadi Anda,</li>
                <li>Menolak menerima komunikasi pemasaran,</li>
                <li>Menarik kembali persetujuan Anda kapan saja.</li>
            </ul>
            <p>Permintaan dapat dikirimkan ke: <a href="mailto:info@sevenpreneur.com">info@sevenpreneur.com</a></p>

            <hr/>

            <h2>6. Perubahan Kebijakan Privasi</h2>
            <p>Sevenpreneur dapat memperbarui Kebijakan Privasi ini secara berkala. Perubahan signifikan akan diinformasikan melalui situs web atau email. Kami mendorong Anda untuk meninjau halaman ini secara berkala.</p>

            <hr/>

            <h2>7. Hak Cipta dan Kekayaan Intelektual</h2>
            <p>Seluruh desain, konten, grafik, audio, video, dan materi visual lainnya yang terdapat pada layanan Sevenpreneur merupakan milik eksklusif Sevenpreneur. Dilarang untuk menggandakan, memodifikasi, atau menggunakan tanpa izin tertulis.</p>

            <hr/>

            <h2>Kontak</h2>
            <p>Untuk pertanyaan atau klarifikasi lebih lanjut terkait Kebijakan Privasi ini, Anda dapat menghubungi:</p>
            <ul>
                <li>Email: <a href="mailto:info@sevenpreneur.com">info@sevenpreneur.com</a></li>
                <li>Alamat: SOHO Capital, Podomoro City, 19th Floor, Jl. Letjen S. Parman Kav 28, Tanjung Duren Selatan, Grogol Petamburan, Jakarta Barat 11470</li>
                <li>WhatsApp: <a href="wa.me/6285117442167">+62-851-1744-2167</a></li>
            </ul>
        </div>
    )
}