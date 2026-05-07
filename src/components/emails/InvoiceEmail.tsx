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
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/id";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("id");

const LOGO_URL =
  "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/logo-sevenpreneur-main.png";

const LMS_URL_LABEL = "agora.sevenpreneur.com";
const LMS_URL_HREF = "https://agora.sevenpreneur.com";

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
  /** Buyer's email — used as LMS username */
  userEmail: string;
  /** Product name (cohort name, event name, or playlist name) */
  itemName: string;
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
}

function formatIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(isoDate: string): string {
  const d = dayjs(isoDate);
  if (!d.isValid()) return isoDate;
  return `${d.tz("Asia/Jakarta").format("D MMMM YYYY, HH.mm")} WIB`;
}

function humanize(str: string): string {
  return str
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function InvoiceEmail({
  firstName,
  userEmail,
  itemName,
  invoiceNumber,
  paidAt,
  paymentMethod,
  paymentChannel,
  amount,
}: InvoiceEmailProps) {
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

            {/* Two-column: Detail Invoice + Detail Akses LMS */}
            <Row>
              <Column style={leftCol}>
                <Section style={infoCard}>
                  <Text style={cardTitle}>DETAIL INVOICE</Text>

                  <HRow
                    icon="📄"
                    label="No. Invoice"
                    value={`#${invoiceNumber}`}
                  />
                  <HRow
                    icon="📅"
                    label="Tanggal Bayar"
                    value={formatDate(paidAt)}
                  />
                  <HRow
                    icon="💳"
                    label="Metode Pembayaran"
                    value={humanize(paymentMethod)}
                  />
                  <HRow
                    icon="🏦"
                    label="Channel"
                    value={humanize(paymentChannel)}
                  />

                  <Section style={totalRowBox}>
                    <Row>
                      <Column style={iconCol}>
                        <div style={iconBox}>💰</div>
                      </Column>
                      <Column style={{ verticalAlign: "middle" }}>
                        <Text style={totalLabel}>Total Dibayar</Text>
                      </Column>
                      <Column
                        style={{ textAlign: "right", verticalAlign: "middle" }}
                      >
                        <Text style={totalValue}>{formatIDR(amount)}</Text>
                      </Column>
                    </Row>
                  </Section>
                </Section>
              </Column>

              <Column style={rightCol}>
                <Section style={infoCard}>
                  <Text style={cardTitle}>DETAIL AKSES LMS</Text>
                  <Text style={lmsSubtitle}>
                    Gunakan informasi berikut untuk mengakses program pada
                    Learning Management System (LMS) Sevenpreneur.
                  </Text>

                  <SRow
                    icon="🌐"
                    label="URL LMS"
                    valueNode={
                      <Link href={LMS_URL_HREF} style={lmsLink}>
                        {LMS_URL_LABEL}
                      </Link>
                    }
                  />
                  <SRow icon="👤" label="Email / Username" value={userEmail} />
                  <SRow
                    iconNode={<div style={googleIcon}>G</div>}
                    label="Metode Login"
                    value="Login melalui Google"
                    subText="Gunakan akun Google yang terhubung dengan email di atas."
                  />

                  <Section style={lmsNote}>
                    <Row>
                      <Column style={{ width: 24, verticalAlign: "top" }}>
                        <Text style={lmsNoteIcon}>ℹ️</Text>
                      </Column>
                      <Column>
                        <Text style={lmsNoteText}>
                          Pastikan kamu login dengan akun Google yang sama untuk
                          mengakses program.
                        </Text>
                      </Column>
                    </Row>
                  </Section>
                </Section>
              </Column>
            </Row>

            {/* Rincian Pembelian */}
            <Text style={sectionHeader}>RINCIAN PEMBELIAN</Text>
            <Section style={purchaseTable}>
              <Row style={tableHeadRow}>
                <Column style={tableHeadCellLeft}>DESKRIPSI</Column>
                <Column style={tableHeadCellRight}>JUMLAH</Column>
              </Row>
              <Hr style={tableDivider} />
              <Row>
                <Column style={tableBodyCellLeft}>{itemName}</Column>
                <Column style={tableBodyCellRight}>{formatIDR(amount)}</Column>
              </Row>
              <Hr style={tableDivider} />
              <Row>
                <Column style={tableTotalCellLeft}>TOTAL</Column>
                <Column style={tableTotalCellRight}>{formatIDR(amount)}</Column>
              </Row>
            </Section>

            {/* Two-column footer cards: confirmation + support */}
            <Row style={{ marginTop: 24 }}>
              <Column style={leftCol}>
                <Section style={confirmCard}>
                  <Row>
                    <Column style={{ width: 40, paddingRight: 12 }}>
                      <div style={checkIconWrap}>
                        <div style={checkIcon}>✓</div>
                      </div>
                    </Column>
                    <Column>
                      <Text style={confirmText}>
                        Pembayaran telah kami terima. Terima kasih atas
                        kepercayaanmu kepada Sevenpreneur.
                      </Text>
                    </Column>
                  </Row>
                </Section>
              </Column>
              <Column style={rightCol}>
                <Section style={supportCard}>
                  <Row>
                    <Column style={{ width: 40, paddingRight: 12 }}>
                      <div style={supportIcon}>💬</div>
                    </Column>
                    <Column>
                      <Text style={supportTitle}>Ada pertanyaan?</Text>
                      <Text style={supportDesc}>
                        Tim kami siap membantu kamu kapan pun dibutuhkan.
                      </Text>
                      <Link
                        href="https://wa.me/6282312492067"
                        style={supportLink}
                      >
                        Hubungi Customer Support →
                      </Link>
                    </Column>
                  </Row>
                </Section>
              </Column>
            </Row>

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

// ─── Sub-components ──────────────────────────────────────────────────────────

// Horizontal row: icon | label …………… value
function HRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <Row style={hRow}>
      <Column style={iconCol}>
        <div style={iconBox}>{icon}</div>
      </Column>
      <Column style={{ verticalAlign: "middle" }}>
        <Text style={hLabel}>{label}</Text>
      </Column>
      <Column style={{ textAlign: "right", verticalAlign: "middle" }}>
        <Text style={hValue}>{value}</Text>
      </Column>
    </Row>
  );
}

// Stacked row: icon | (label / value / optional subtext)
function SRow({
  icon,
  iconNode,
  label,
  value,
  valueNode,
  subText,
}: {
  icon?: string;
  iconNode?: React.ReactNode;
  label: string;
  value?: string;
  valueNode?: React.ReactNode;
  subText?: string;
}) {
  return (
    <Row style={sRow}>
      <Column style={iconCol}>
        {iconNode ?? <div style={iconBox}>{icon}</div>}
      </Column>
      <Column style={{ verticalAlign: "top" }}>
        <Text style={sLabel}>{label}</Text>
        {valueNode ? (
          <div style={sValueWrap}>{valueNode}</div>
        ) : (
          <Text style={sValue}>{value}</Text>
        )}
        {subText && <Text style={sSub}>{subText}</Text>}
      </Column>
    </Row>
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
  maxWidth: 720,
  margin: "0 auto",
  overflow: "hidden",
};
const header: React.CSSProperties = {
  padding: "20px 28px",
  borderBottom: "1px solid #f0f0f0",
};
const invoiceLabel: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 800,
  color: "#0f0f1a",
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
  margin: "0 0 20px",
};

// Two-column wrappers
const leftCol: React.CSSProperties = {
  width: "50%",
  paddingRight: 6,
  verticalAlign: "top",
};
const rightCol: React.CSSProperties = {
  width: "50%",
  paddingLeft: 6,
  verticalAlign: "top",
};

// Card
const infoCard: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: "16px 16px",
  backgroundColor: "#ffffff",
};
const cardTitle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: "#4f46e5",
  letterSpacing: "1px",
  margin: "0 0 12px",
};

// LMS subtitle (only on right card)
const lmsSubtitle: React.CSSProperties = {
  fontSize: 12,
  color: "#6b7280",
  lineHeight: "1.6",
  margin: "0 0 12px",
  paddingBottom: 12,
  borderBottom: "1px solid #f3f4f6",
};

// Icon
const iconCol: React.CSSProperties = {
  width: 40,
  paddingRight: 8,
  verticalAlign: "top",
};
const iconBox: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: 8,
  backgroundColor: "#eff6ff",
  textAlign: "center",
  lineHeight: "32px",
  fontSize: 16,
};
const googleIcon: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: 8,
  backgroundColor: "#ffffff",
  border: "1px solid #e5e7eb",
  textAlign: "center",
  lineHeight: "30px",
  fontSize: 16,
  fontWeight: 700,
  color: "#4285F4",
};

// Horizontal row (left card)
const hRow: React.CSSProperties = { marginBottom: 10 };
const hLabel: React.CSSProperties = {
  fontSize: 13,
  color: "#374151",
  margin: 0,
};
const hValue: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: "#0f0f1a",
  margin: 0,
  textAlign: "right",
};

// Total row
const totalRowBox: React.CSSProperties = {
  backgroundColor: "#eff6ff",
  borderRadius: 10,
  padding: "10px 12px",
  marginTop: 6,
};
const totalLabel: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: "#0f0f1a",
  margin: 0,
};
const totalValue: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 800,
  color: "#4f46e5",
  margin: 0,
  textAlign: "right",
};

// Stacked row (right card)
const sRow: React.CSSProperties = { marginBottom: 12 };
const sLabel: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: "#0f0f1a",
  margin: 0,
};
const sValue: React.CSSProperties = {
  fontSize: 13,
  color: "#374151",
  margin: "2px 0 0",
};
const sValueWrap: React.CSSProperties = {
  marginTop: 2,
};
const sSub: React.CSSProperties = {
  fontSize: 11,
  color: "#9ca3af",
  margin: "4px 0 0",
  lineHeight: "1.5",
};
const lmsLink: React.CSSProperties = {
  fontSize: 13,
  color: "#4f46e5",
  fontWeight: 600,
  textDecoration: "none",
};

// LMS info note
const lmsNote: React.CSSProperties = {
  backgroundColor: "#eff6ff",
  borderRadius: 8,
  padding: "10px 12px",
  marginTop: 4,
};
const lmsNoteIcon: React.CSSProperties = {
  fontSize: 12,
  margin: 0,
  lineHeight: "1.4",
};
const lmsNoteText: React.CSSProperties = {
  fontSize: 11,
  color: "#3b5b8b",
  lineHeight: "1.5",
  margin: 0,
};

// Rincian Pembelian section
const sectionHeader: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: "#4f46e5",
  letterSpacing: "1px",
  margin: "24px 0 8px",
};
const purchaseTable: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  overflow: "hidden",
};
const tableHeadRow: React.CSSProperties = {
  backgroundColor: "#f9fafb",
};
const tableHeadCellLeft: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: "#6b7280",
  letterSpacing: "0.5px",
  padding: "12px 16px",
};
const tableHeadCellRight: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: "#6b7280",
  letterSpacing: "0.5px",
  padding: "12px 16px",
  textAlign: "right",
};
const tableBodyCellLeft: React.CSSProperties = {
  fontSize: 13,
  color: "#0f0f1a",
  padding: "14px 16px",
};
const tableBodyCellRight: React.CSSProperties = {
  fontSize: 13,
  color: "#0f0f1a",
  padding: "14px 16px",
  textAlign: "right",
};
const tableTotalCellLeft: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: "#0f0f1a",
  letterSpacing: "0.5px",
  padding: "14px 16px",
};
const tableTotalCellRight: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 800,
  color: "#4f46e5",
  padding: "14px 16px",
  textAlign: "right",
};
const tableDivider: React.CSSProperties = {
  borderColor: "#e5e7eb",
  margin: 0,
};

// Confirmation card
const confirmCard: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: "16px 18px",
};
const checkIconWrap: React.CSSProperties = {
  paddingTop: 2,
};
const checkIcon: React.CSSProperties = {
  backgroundColor: "#22c55e",
  color: "#ffffff",
  borderRadius: "50%",
  width: 28,
  height: 28,
  textAlign: "center",
  lineHeight: "28px",
  fontSize: 14,
  fontWeight: 800,
};
const confirmText: React.CSSProperties = {
  fontSize: 13,
  color: "#0f0f1a",
  lineHeight: "1.6",
  margin: 0,
};

// Support card
const supportCard: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: "16px 18px",
};
const supportIcon: React.CSSProperties = {
  backgroundColor: "#dcfce7",
  borderRadius: "50%",
  width: 36,
  height: 36,
  textAlign: "center",
  lineHeight: "36px",
  fontSize: 18,
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

// Signature
const signature: React.CSSProperties = {
  borderLeft: "3px solid #4f46e5",
  paddingLeft: 14,
  marginTop: 28,
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

// Footer
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
