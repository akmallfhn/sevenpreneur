import {
  Body,
  Column,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

const LOGO_URL =
  "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/logo-sevenpreneur-main.png";

const SOCIAL = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/sevenpreneur/",
    img: "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/logo-linkedin-white.svg",
    bg: "#0a66c2",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61576691453951",
    img: "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/logo-facebook-white.svg",
    bg: "#1877f2",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/7preneur/",
    img: "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/logo-instagram-white.svg",
    bg: "#e4405f",
  },
  {
    label: "Threads",
    href: "https://www.threads.com/@7preneur",
    img: "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/logo-threads-white.svg",
    bg: "#000000",
  },
];

export type InvoiceItemType = "cohort" | "event" | "playlist";

export interface InvoiceEmailProps {
  /** Buyer's full name */
  firstName: string;
  /** Product name (cohort name, event name, or playlist name) */
  itemName: string;
  /** Product thumbnail/banner image URL */
  itemImage: string;
  /** Product category */
  itemType: InvoiceItemType;
  /** Invoice / transaction number (e.g. "INV-2024-001") */
  invoiceNumber: string;
  /** ISO datetime string of when payment was confirmed */
  paidAt: string;
  /** Payment method (e.g. "BANK_TRANSFER", "EWALLET", "CREDIT_CARD") */
  paymentMethod: string;
  /** Payment channel (e.g. "BCA", "OVO", "DANA") */
  paymentChannel: string;
  /** Total amount paid in IDR (numeric) */
  amount: number;
  /** Deep-link to the purchased product on Agora LMS */
  itemUrl?: string;
}

const ITEM_TYPE_LABEL: Record<InvoiceItemType, string> = {
  cohort: "Program Cohort",
  event: "Event",
  playlist: "Learning Series",
};

const ITEM_TYPE_URL: Record<InvoiceItemType, string> = {
  cohort: "https://agora.sevenpreneur.com/cohorts",
  event: "https://agora.sevenpreneur.com/events",
  playlist: "https://agora.sevenpreneur.com/playlists",
};

function formatIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(isoDate: string): string {
  try {
    return (
      new Date(isoDate).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Jakarta",
      }) + " WIB"
    );
  } catch {
    return isoDate;
  }
}

function humanize(str: string): string {
  return str
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function InvoiceEmail({
  firstName,
  itemName,
  itemImage,
  itemType,
  invoiceNumber,
  paidAt,
  paymentMethod,
  paymentChannel,
  amount,
  itemUrl,
}: InvoiceEmailProps) {
  const categoryLabel = ITEM_TYPE_LABEL[itemType];
  const ctaUrl = itemUrl ?? ITEM_TYPE_URL[itemType];

  return (
    <Html lang="id">
      <Head />
      <Preview>
        Invoice Pembelian #{invoiceNumber} — {itemName} | Sevenpreneur
      </Preview>

      <Body style={body}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Row>
              <Column>
                <Img src={LOGO_URL} alt="Sevenpreneur" height={28} />
              </Column>
              <Column style={{ textAlign: "right" }}>
                <Text style={invoiceLabel}>INVOICE</Text>
                <Text style={invoiceNum}>#{invoiceNumber}</Text>
              </Column>
            </Row>
          </Section>

          {/* Body */}
          <Section style={bodySection}>
            <Text style={greeting}>Hi, {firstName}! 🎉</Text>
            <Text style={intro}>
              Pembayaranmu telah kami terima. Berikut adalah detail invoice
              pembelianmu. Simpan email ini sebagai bukti transaksi yang sah.
            </Text>

            {/* Product thumbnail */}
            <Img
              src={itemImage}
              alt={itemName}
              width={544}
              style={bannerImg}
            />

            {/* Product info */}
            <Text style={categoryTag}>{categoryLabel}</Text>
            <Text style={productTitle}>{itemName}</Text>

            <Hr style={divider} />

            {/* Invoice detail table */}
            <Section style={detailCard}>
              <Row style={detailRow}>
                <Column style={detailLabelCol}>
                  <Text style={detailLabel}>No. Invoice</Text>
                </Column>
                <Column style={detailValueCol}>
                  <Text style={detailValue}>#{invoiceNumber}</Text>
                </Column>
              </Row>
              <Hr style={rowDivider} />
              <Row style={detailRow}>
                <Column style={detailLabelCol}>
                  <Text style={detailLabel}>Tanggal Bayar</Text>
                </Column>
                <Column style={detailValueCol}>
                  <Text style={detailValue}>{formatDate(paidAt)}</Text>
                </Column>
              </Row>
              <Hr style={rowDivider} />
              <Row style={detailRow}>
                <Column style={detailLabelCol}>
                  <Text style={detailLabel}>Metode Pembayaran</Text>
                </Column>
                <Column style={detailValueCol}>
                  <Text style={detailValue}>{humanize(paymentMethod)}</Text>
                </Column>
              </Row>
              <Hr style={rowDivider} />
              <Row style={detailRow}>
                <Column style={detailLabelCol}>
                  <Text style={detailLabel}>Channel</Text>
                </Column>
                <Column style={detailValueCol}>
                  <Text style={detailValue}>{humanize(paymentChannel)}</Text>
                </Column>
              </Row>
              <Hr style={rowDivider} />
              <Row style={detailRow}>
                <Column style={detailLabelCol}>
                  <Text style={totalLabel}>Total Dibayar</Text>
                </Column>
                <Column style={detailValueCol}>
                  <Text style={totalValue}>{formatIDR(amount)}</Text>
                </Column>
              </Row>
            </Section>

            {/* CTA */}
            <Section style={{ marginTop: 28, marginBottom: 10 }}>
              <Link href={ctaUrl} style={ctaButton}>
                Mulai Akses Sekarang →
              </Link>
            </Section>
            <Text style={ctaNote}>
              Gunakan email ini untuk login ke platform LMS Sevenpreneur.
            </Text>

            {/* Support */}
            <Section style={supportCard}>
              <Row>
                <Column style={{ width: 44, paddingRight: 14 }}>
                  <div style={supportIcon}>💬</div>
                </Column>
                <Column>
                  <Text style={supportTitle}>Ada pertanyaan?</Text>
                  <Text style={supportDesc}>
                    Tim kami siap membantu kamu kapan pun dibutuhkan.
                  </Text>
                  <Link href="https://wa.me/6282312492067" style={supportLink}>
                    Hubungi Customer Support
                  </Link>
                </Column>
              </Row>
            </Section>

            {/* Signature */}
            <Section style={signature}>
              <Text style={sigFrom}>Best regards,</Text>
              <Text style={sigName}>Sevenpreneur Team</Text>
            </Section>
          </Section>

          <Hr style={{ borderColor: "#e5e7eb", margin: 0 }} />

          {/* Footer */}
          <Section style={footer}>
            <Row>
              <Column style={{ width: "55%" }}>
                <Img
                  src={LOGO_URL}
                  alt="Sevenpreneur"
                  height={22}
                  style={{ marginBottom: 10 }}
                />
                <Text style={footerDesc}>
                  Sevenpreneur is a global launchpad empowering entrepreneurs to
                  scale their ventures and thrive on the world stage.
                </Text>
                <Row style={{ marginTop: 4 }}>
                  {SOCIAL.map((s) => (
                    <Column
                      key={s.label}
                      style={{ paddingRight: 4, width: "auto" }}
                    >
                      <Link href={s.href}>
                        <div style={socialIconWrap(s.bg)}>
                          <Img
                            src={s.img}
                            width={18}
                            height={18}
                            alt={s.label}
                            style={{ display: "block" }}
                          />
                        </div>
                      </Link>
                    </Column>
                  ))}
                </Row>
              </Column>
              <Column style={{ paddingLeft: 24 }}>
                <Text style={footerCompany}>PT Pengusaha Muda Indonesia</Text>
                <Text style={footerAddress}>
                  Soho Capital Floor 19, Podomoro City,{"\n"}
                  Jl. Letjend S. Parman Kav 28,{"\n"}
                  Jakarta Barat, DKI Jakarta, Indonesia
                </Text>
              </Column>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const body: React.CSSProperties = {
  backgroundColor: "#f0f0f5",
  fontFamily: "Arial, Helvetica, sans-serif",
  margin: 0,
  padding: "32px 0",
};
const container: React.CSSProperties = {
  backgroundColor: "#ffffff",
  borderRadius: 16,
  maxWidth: 600,
  margin: "0 auto",
  overflow: "hidden",
};
const header: React.CSSProperties = {
  padding: "20px 28px",
  borderBottom: "1px solid #f0f0f0",
};
const invoiceLabel: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  color: "#9ca3af",
  letterSpacing: "1.5px",
  margin: "0 0 2px",
  textAlign: "right",
};
const invoiceNum: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: "#4f46e5",
  margin: 0,
  textAlign: "right",
};
const bodySection: React.CSSProperties = { padding: "28px 28px 0" };
const greeting: React.CSSProperties = {
  fontSize: 26,
  fontWeight: 700,
  color: "#0f0f1a",
  margin: "0 0 12px",
};
const intro: React.CSSProperties = {
  fontSize: 14,
  color: "#6b7280",
  lineHeight: "1.7",
  margin: "0 0 24px",
};
const bannerImg: React.CSSProperties = {
  display: "block",
  width: "100%",
  borderRadius: 12,
  marginBottom: 16,
  objectFit: "cover",
};
const categoryTag: React.CSSProperties = {
  display: "inline-block",
  backgroundColor: "#ede9fe",
  color: "#4f46e5",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.5px",
  textTransform: "uppercase",
  borderRadius: 6,
  padding: "4px 10px",
  margin: "0 0 8px",
};
const productTitle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 700,
  color: "#0f0f1a",
  margin: "0 0 4px",
};
const divider: React.CSSProperties = {
  borderColor: "#e5e7eb",
  margin: "20px 0",
};
const detailCard: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  overflow: "hidden",
  marginBottom: 8,
};
const detailRow: React.CSSProperties = { padding: "14px 20px" };
const rowDivider: React.CSSProperties = { borderColor: "#f3f4f6", margin: 0 };
const detailLabelCol: React.CSSProperties = { width: "45%" };
const detailValueCol: React.CSSProperties = {
  width: "55%",
  textAlign: "right",
};
const detailLabel: React.CSSProperties = {
  fontSize: 13,
  color: "#6b7280",
  margin: 0,
};
const detailValue: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: "#0f0f1a",
  margin: 0,
  textAlign: "right",
};
const totalLabel: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 700,
  color: "#0f0f1a",
  margin: 0,
};
const totalValue: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 700,
  color: "#4f46e5",
  margin: 0,
  textAlign: "right",
};
const ctaButton: React.CSSProperties = {
  display: "block",
  backgroundColor: "#4f46e5",
  color: "#ffffff",
  textDecoration: "none",
  borderRadius: 12,
  padding: "14px 20px",
  fontSize: 15,
  fontWeight: 700,
  textAlign: "center",
};
const ctaNote: React.CSSProperties = {
  textAlign: "center",
  fontSize: 12,
  color: "#9ca3af",
  margin: "6px 0 24px",
};
const supportCard: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: "16px 20px",
  marginBottom: 28,
};
const supportIcon: React.CSSProperties = {
  backgroundColor: "#dcfce7",
  borderRadius: "50%",
  width: 44,
  height: 44,
  textAlign: "center",
  lineHeight: "44px",
  fontSize: 22,
};
const supportTitle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 700,
  color: "#0f0f1a",
  margin: "0 0 2px",
};
const supportDesc: React.CSSProperties = {
  fontSize: 13,
  color: "#6b7280",
  margin: "0 0 4px",
};
const supportLink: React.CSSProperties = {
  fontSize: 13,
  color: "#4f46e5",
  fontWeight: 700,
  textDecoration: "none",
};
const signature: React.CSSProperties = {
  borderLeft: "3px solid #4f46e5",
  paddingLeft: 14,
  marginBottom: 36,
};
const sigFrom: React.CSSProperties = {
  fontSize: 13,
  color: "#9ca3af",
  margin: 0,
};
const sigName: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 700,
  color: "#0f0f1a",
  margin: 0,
};
const socialIconWrap = (bg: string): React.CSSProperties => ({
  backgroundColor: bg,
  borderRadius: "50%",
  padding: 6,
  display: "inline-block",
  lineHeight: 0,
});
const footer: React.CSSProperties = {
  backgroundColor: "#f9fafb",
  padding: "24px 28px",
};
const footerDesc: React.CSSProperties = {
  fontSize: 12,
  color: "#9ca3af",
  lineHeight: "1.6",
  margin: "0 0 14px",
};
const footerCompany: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: "#4f46e5",
  margin: "0 0 8px",
};
const footerAddress: React.CSSProperties = {
  fontSize: 12,
  color: "#6b7280",
  lineHeight: "1.7",
  margin: 0,
  whiteSpace: "pre-line",
};
