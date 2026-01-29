import { Metadata } from "next";
import styles from "./style.module.css";

export const metadata: Metadata = {
  title: "Refund and Return Policy | Sevenpreneur",
  description:
    "Kebijakan Refund & Return Sevenpreneur menjelaskan ketentuan pengembalian dana, pengecualian tertentu, serta prosedur resmi sesuai kebijakan PT Pengusaha Muda Indonesia.",
  authors: [{ name: "Sevenpreneur Team" }],
  publisher: "Sevenpreneur",
  referrer: "origin-when-cross-origin",
  alternates: {
    canonical: "/refund-return-policy",
  },
  openGraph: {
    title: "Refund and Return Policy | Sevenpreneur",
    description:
      "Kebijakan Refund & Return Sevenpreneur menjelaskan ketentuan pengembalian dana, pengecualian tertentu, serta prosedur resmi sesuai kebijakan PT Pengusaha Muda Indonesia.",
    url: "https://sevenpreneur.com/refund-return-policy",
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
    title: "Refund and Return Policy | Sevenpreneur",
    description:
      "Kebijakan Refund & Return Sevenpreneur menjelaskan ketentuan pengembalian dana, pengecualian tertentu, serta prosedur resmi sesuai kebijakan PT Pengusaha Muda Indonesia.",
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

export default function RefundReturnPolicyPage() {
  return (
    <div className={styles.refund_return}>
      <h1>Refund & Return Policy</h1>
      <p>
        Dengan melakukan pembelian produk dan/atau layanan Sevenpreneur,
        pengguna dianggap telah membaca, memahami, dan menyetujui seluruh
        kebijakan Refund & Return berikut ini.
      </p>
      <hr />
      <h2>1. Ketentuan Umum</h2>
      <p>
        Sevenpreneur menyediakan produk dan layanan dalam bentuk digital maupun
        non-digital, termasuk namun tidak terbatas pada:
      </p>
      <ul>
        <li>Program kelas online dan offline</li>
        <li>Course digital dan video pembelajaran</li>
        <li>Event, workshop, seminar, dan mentoring</li>
        <li>Membership, subscription, dan layanan berbasis akses</li>
      </ul>
      <p>
        Karena sifat produk dan layanan tersebut, seluruh pembelian pada
        prinsipnya bersifat
        <strong> final dan tidak dapat dikembalikan (non-refundable)</strong>.
      </p>
      <hr />
      <h2>2. Kebijakan Tidak Dapat Refund</h2>
      <p>
        Refund <strong>tidak dapat dilakukan</strong> dalam kondisi berikut:
      </p>
      <ul>
        <li>Perubahan keputusan pribadi setelah pembayaran</li>
        <li>Tidak sempat mengikuti kelas atau event</li>
        <li>Ketidaksesuaian ekspektasi pribadi</li>
        <li>Kesalahan pembelian paket oleh pengguna</li>
        <li>Kendala perangkat pribadi (laptop, internet, software, dll)</li>
        <li>Produk digital telah diakses, diunduh, atau digunakan</li>
        <li>Kelas atau program telah dimulai</li>
      </ul>
      <hr />
      <h2>3. Pengecualian Refund (Kondisi Tertentu)</h2>
      <p>Refund hanya dapat dipertimbangkan dalam kondisi berikut:</p>
      <ul>
        <li>
          <strong>Duplikasi pembayaran</strong>
          <br />
          (contoh: pengguna melakukan pembayaran lebih dari satu kali untuk
          produk yang sama)
        </li>
        <li>
          <strong>Kesalahan sistem pembayaran</strong>
          <br />
          yang menyebabkan transaksi terdebit namun layanan tidak aktif
        </li>
        <li>
          <strong>Pembatalan event oleh pihak Sevenpreneur</strong>
        </li>
        <li>
          <strong>Produk atau layanan tidak tersedia</strong> akibat kesalahan
          internal
        </li>
      </ul>
      <p>
        Seluruh keputusan refund sepenuhnya berada di bawah kewenangan
        <strong> manajemen PT Pengusaha Muda Indonesia</strong>.
      </p>
      <hr />
      <h2>4. Mekanisme Pengajuan Refund</h2>
      <p>
        Apabila pengguna memenuhi kriteria pengecualian di atas, pengajuan
        refund dapat dilakukan dengan ketentuan berikut:
      </p>
      <ul>
        <li>
          Pengajuan maksimal <strong>3 x 24 jam</strong> setelah transaksi
        </li>
        <li>Disertai bukti pembayaran yang sah</li>
        <li>Melalui email resmi Sevenpreneur</li>
      </ul>
      <p>
        Sevenpreneur berhak melakukan verifikasi sebelum menyetujui atau menolak
        permohonan refund.
      </p>
      <hr />
      <h2>5. Proses Pengembalian Dana</h2>
      <ul>
        <li>Refund akan dikembalikan melalui metode pembayaran yang sama</li>
        <li>
          Waktu proses pengembalian dana berkisar antara{" "}
          <strong>7–14 hari kerja</strong>
        </li>
        <li>
          Biaya administrasi dan gateway payment dapat dipotong sesuai kebijakan
          penyedia pembayaran
        </li>
      </ul>
      <hr />
      <h2>6. Return Policy</h2>
      <p>
        Sevenpreneur tidak menerima pengembalian (return) untuk produk digital,
        akses kelas, membership, maupun layanan berbasis sistem.
      </p>
      <p>
        Untuk produk fisik (jika tersedia), pengembalian hanya dapat dilakukan
        apabila:
      </p>
      <ul>
        <li>Produk rusak saat diterima</li>
        <li>Produk tidak sesuai dengan pesanan</li>
      </ul>
      <p>
        Pengajuan return wajib dilakukan maksimal <strong>2 x 24 jam</strong>{" "}
        sejak produk diterima.
      </p>
      <hr />
      <h2>7. Perubahan Kebijakan</h2>
      <p>
        Sevenpreneur berhak mengubah kebijakan Refund & Return ini sewaktu-waktu
        tanpa pemberitahuan terlebih dahulu. Versi terbaru akan selalu
        ditampilkan pada website resmi Sevenpreneur.
      </p>
      <hr />
      <h2>8. Kontak Resmi</h2>
      <p>
        Untuk pertanyaan lebih lanjut terkait kebijakan ini, silakan
        menghubungi:
      </p>
      <p>
        <strong>PT Pengusaha Muda Indonesia</strong>
        <br />
        Email: event@sevenpreneur.com
      </p>
    </div>
  );
}
