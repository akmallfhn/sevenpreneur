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

export interface SessionReminderEmailProps {
  firstName: string;
  cohortName: string;
  cohortImage: string;
  sessionName: string;
  sessionPlace: string;
  sessionDate: string;
  joinUrl?: string;
}

export function SessionReminderEmail({
  firstName,
  cohortName,
  cohortImage,
  sessionName,
  sessionPlace,
  sessionDate,
  joinUrl = "#",
}: SessionReminderEmailProps) {
  return (
    <Html lang="id">
      <Head />
      <Preview>
        Mulai Sebentar Lagi! {sessionName} – {cohortName} by MIFX
      </Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Row>
              <Column>
                <Img src={LOGO_URL} alt="Sevenpreneur" height={28} />
              </Column>
            </Row>
          </Section>

          {/* Body */}
          <Section style={bodySection}>
            <Text style={greeting}>Hi, {firstName}!</Text>
            <Text style={intro}>
              Sesi ini akan segera dimulai. Pastikan kamu sudah <em>ready</em>{" "}
              dan join tepat waktu supaya nggak ketinggalan insight penting dari
              sesi ini.
            </Text>

            {/* Banner — cohort image 16:9 */}
            <Img
              src={cohortImage}
              alt={cohortName}
              width={544}
              style={bannerImg}
            />

            {/* Session name */}
            <Text style={sessionTitle}>{sessionName}</Text>
            <Text style={sessionSub}>{cohortName} by MIFX</Text>

            {/* Time + Place */}
            <Section style={infoCard}>
              <Row>
                <Column style={infoCell}>
                  <Text style={infoLabel}>Waktu</Text>
                  <Text style={infoValue}>{sessionDate}</Text>
                </Column>
                <Column
                  style={{ ...infoCell, borderLeft: "1px solid #e5e7eb" }}
                >
                  <Text style={infoLabel}>Tempat</Text>
                  <Text style={infoValue}>{sessionPlace}</Text>
                </Column>
              </Row>
            </Section>

            {/* CTA */}
            <Section style={{ marginBottom: 10 }}>
              <Link href={joinUrl} style={ctaButton}>
                Join Meeting
              </Link>
            </Section>
            <Text style={ctaNote}>
              🛡 Akses aman dan hanya untuk peserta terdaftar.
            </Text>

            {/* WhatsApp Support */}
            <Section style={supportCard}>
              <Row>
                <Column style={{ width: 44, paddingRight: 14 }}>
                  <div style={waIcon}>💬</div>
                </Column>
                <Column>
                  <Text style={supportTitle}>Butuh bantuan?</Text>
                  <Text style={supportDesc}>
                    Kalau ada kendala saat join, feel free to reach out via
                    WhatsApp.
                  </Text>
                  <Link href="https://wa.me/6282312492067" style={supportLink}>
                    Customer Support
                  </Link>
                </Column>
              </Row>
            </Section>

            <Text style={closing}>
              👋 Kami sudah nggak sabar untuk ketemu kamu di sesi ini!
            </Text>
            <Text style={closingSub}>See you soon!</Text>

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

// Styles
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
  marginBottom: 24,
  aspectRatio: "16/9",
  objectFit: "cover",
};
const sessionTitle: React.CSSProperties = {
  fontSize: 21,
  fontWeight: 700,
  color: "#0f0f1a",
  margin: "0 0 2px",
};
const sessionSub: React.CSSProperties = {
  fontSize: 13,
  color: "#9ca3af",
  margin: "0 0 20px",
};
const infoCard: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  marginBottom: 20,
  overflow: "hidden",
};
const infoCell: React.CSSProperties = { padding: "16px 20px" };
const infoLabel: React.CSSProperties = {
  fontSize: 11,
  color: "#9ca3af",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  margin: "0 0 6px",
};
const infoValue: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
  color: "#0f0f1a",
  margin: 0,
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
  margin: "0 0 24px",
};
const supportCard: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: "16px 20px",
  marginBottom: 28,
};
const waIcon: React.CSSProperties = {
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
  margin: "0 0 2px",
};
const supportLink: React.CSSProperties = {
  fontSize: 13,
  color: "#4f46e5",
  fontWeight: 700,
  textDecoration: "none",
};
const closing: React.CSSProperties = {
  fontSize: 14,
  color: "#0f0f1a",
  margin: "0 0 4px",
};
const closingSub: React.CSSProperties = {
  fontSize: 14,
  color: "#9ca3af",
  margin: "0 0 20px",
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
