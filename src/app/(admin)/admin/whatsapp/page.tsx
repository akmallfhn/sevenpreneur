import WhatsappChatsCMS from "@/app/components/indexes/WhatsappChatsCMS";
import UnderDevelopment from "@/app/components/states/UnderDevelopment";

export default function WhatsappPageCMS() {
  if (process.env.DOMAIN_MODE === "local") {
    return <WhatsappChatsCMS />;
  }

  return <UnderDevelopment />;
}
