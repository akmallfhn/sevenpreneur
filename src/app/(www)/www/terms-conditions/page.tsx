import { Metadata } from "next";
import styles from "./style.module.css";

export const metadata: Metadata = {
  title: "Terms & Conditions | Sevenpreneur",
  description:
    "Baca Syarat & Ketentuan penggunaan layanan Sevenpreneur, platform LMS yang dimiliki oleh PT Pengusaha Muda Indonesia. Ketahui hak, kewajiban, dan batasan penggunaan platform kami.",
  keywords:
    "Sevenpreneur, Syarat dan Ketentuan, Terms and Conditions, Pembelajaran digital, Ketentuan penggunaan",
  authors: [{ name: "Sevenpreneur Team" }],
  publisher: "Sevenpreneur",
  referrer: "origin-when-cross-origin",
  alternates: {
    canonical: "/terms-conditions",
  },
  openGraph: {
    title: "Terms & Conditions | Sevenpreneur",
    description:
      "Pelajari ketentuan resmi dalam menggunakan platform pembelajaran Sevenpreneur, termasuk hak kekayaan intelektual, akun pengguna, konten, dan pembayaran.",
    url: "https://sevenpreneur.com/privacy-policy",
    siteName: "Sevenpreneur",
    images: [
      {
        url: "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/meta-og-image-sevenpreneur-1.webp",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms & Conditions | Sevenpreneur",
    description:
      "Baca peraturan resmi penggunaan platform Sevenpreneur. Ketentuan berlaku untuk pengguna akun, konten, pembayaran, dan kebijakan hukum.",
    images:
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/meta-og-image-sevenpreneur-1.webp",
  },
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
};

export default function TermsConditionsPage() {
  return (
    <div className={styles.terms_conditions}>
      <h1>Syarat & Ketentuan Penggunaan Layanan Sevenpreneur</h1>
      <p>
        Selamat datang di Sevenpreneur! Syarat & Ketentuan ini mengatur akses
        dan penggunaan Anda atas platform kami yang beralamat di{" "}
        <a href="https://sevenpreneur.com" target="_blank">
          https://sevenpreneur.com
        </a>
        , yang dimiliki dan dioperasikan oleh{" "}
        <strong>PT Pengusaha Muda Indonesia</strong>, beralamat di{" "}
        <em>
          SOHO Capital, Podomoro City, Lantai 19, Jl. Letjen S. Parman Kav 28,
          Jakarta Barat 11470, Indonesia
        </em>
        .
      </p>
      <p>
        Dengan mengakses atau menggunakan Platform ini, Anda menyatakan bahwa
        Anda telah membaca, memahami, dan menyetujui untuk terikat oleh Syarat &
        Ketentuan ini.
      </p>

      <hr />

      <h2>1. Definisi</h2>
      <p>
        <strong>“Kami”</strong>, <strong>“Sevenpreneur”</strong>, atau{" "}
        <strong>“Platform”</strong> merujuk pada PT Pengusaha Muda Indonesia dan
        semua layanan, konten, dan fitur yang disediakan melalui platform
        pembelajaran daring (Learning Management System – LMS).
      </p>
      <p>
        <strong>“Pengguna”</strong> adalah Anda sebagai individu atau badan
        hukum yang mengakses dan/atau menggunakan Platform ini.
      </p>
      <p>
        <strong>“Konten”</strong> mencakup semua materi dalam platform seperti
        video, modul pembelajaran, teks, gambar, grafik, logo, dan perangkat
        lunak.
      </p>
      <p>
        <strong>“Akun”</strong> merujuk pada akun yang dibuat oleh Pengguna
        untuk mengakses layanan tertentu.
      </p>

      <hr />

      <h2>2. Akses dan Pendaftaran Akun</h2>
      <p>
        Untuk mengakses beberapa fitur, Anda diharuskan membuat akun dengan
        informasi yang akurat dan terkini. Anda bertanggung jawab atas
        kerahasiaan akun Anda dan seluruh aktivitas di dalamnya. Kami berhak
        menangguhkan atau menutup akun jika ditemukan pelanggaran.
      </p>

      <hr />

      <h2>3. Konten Pengguna</h2>
      <p>
        Pengguna dapat membuat dan mengunggah konten. Anda bertanggung jawab
        penuh atas konten tersebut dan dilarang mengunggah materi ilegal atau
        melanggar hak pihak ketiga.
      </p>
      <p>
        Dengan mengunggah, Anda memberi kami hak untuk menggunakan dan
        menayangkan konten tersebut untuk keperluan layanan tanpa kompensasi.
      </p>

      <hr />

      <h2>4. Pembayaran dan Langganan</h2>
      <p>
        Kami menyediakan produk digital dan langganan berbayar. Semua pembayaran
        bersifat satu kali atau berulang sesuai periode langganan. Tidak
        tersedia pengembalian dana kecuali dinyatakan secara khusus.
      </p>

      <hr />

      <h2>5. Promosi dan Kontes</h2>
      <p>
        Kami dapat menyelenggarakan promosi atau kontes yang tunduk pada syarat
        tambahan. Dengan berpartisipasi, Anda menyetujui ketentuan tersebut.
      </p>

      <hr />

      <h2>6. Kekayaan Intelektual</h2>
      <p>
        Semua konten dan merek dagang dalam platform ini adalah milik eksklusif
        PT Pengusaha Muda Indonesia. Penggunaan tanpa izin tertulis dilarang.
      </p>

      <hr />

      <h2>7. Tanggung Jawab</h2>
      <p>
        Kami tidak menjamin bahwa layanan akan selalu bebas gangguan.
        Sevenpreneur tidak bertanggung jawab atas kerugian akibat penggunaan
        platform oleh pengguna.
      </p>

      <hr />

      <h2>8. Perubahan Syarat & Ketentuan</h2>
      <p>
        Kami berhak mengubah Syarat & Ketentuan ini kapan saja. Perubahan
        signifikan akan diberitahukan melalui situs atau email.
      </p>

      <hr />

      <h2>9. Hukum yang Berlaku</h2>
      <p>
        Syarat & Ketentuan ini diatur oleh hukum Republik Indonesia. Sengketa
        akan diselesaikan secara musyawarah atau melalui yurisdiksi di wilayah
        Jakarta Barat.
      </p>

      <hr />

      <h2>Kontak</h2>
      <p>
        Untuk pertanyaan atau klarifikasi lebih lanjut terkait Kebijakan Privasi
        ini, Anda dapat menghubungi:
      </p>
      <ul>
        <li>
          Email:{" "}
          <a href="mailto:info@sevenpreneur.com">info@sevenpreneur.com</a>
        </li>
        <li>
          Alamat: SOHO Capital, Podomoro City, 19th Floor, Jl. Letjen S. Parman
          Kav 28, Tanjung Duren Selatan, Grogol Petamburan, Jakarta Barat 11470
        </li>
        <li>
          WhatsApp: <a href="wa.me/6285117442167">+62-851-1744-2167</a>
        </li>
      </ul>
    </div>
  );
}
