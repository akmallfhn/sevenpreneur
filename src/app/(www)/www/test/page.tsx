import AppButton from "@/components/buttons/AppButton";
import NotFoundComponent from "@/components/states/404NotFound";

export default function Page() {
  if (process.env.DOMAIN_MODE === "production") {
    return <NotFoundComponent />;
  }

  return (
    <div className="flex flex-col gap-2 my-80">
      <div className="flex items-center justify-center gap-2">
        <AppButton variant="primary">Primary</AppButton>
        <AppButton variant="primary" disabled>
          Primary
        </AppButton>
        <AppButton variant="secondary">Secondary</AppButton>
        <AppButton variant="secondary" disabled>
          Secondary
        </AppButton>
        <AppButton variant="tertiary">Tertiary</AppButton>
        <AppButton variant="tertiary" disabled>
          Tertiary
        </AppButton>
        <div className="size-10 bg-secondary-disabled"></div>
      </div>
      <div className="flex items-center justify-center gap-2">
        <AppButton variant="primarySoft">Primary</AppButton>
        <AppButton variant="primarySoft" disabled>
          Primary
        </AppButton>
        <AppButton variant="secondarySoft">Secondary</AppButton>
        <AppButton variant="secondarySoft" disabled>
          Secondary
        </AppButton>
        <AppButton variant="tertiary">Tertiary</AppButton>
        <AppButton variant="tertiary" disabled>
          Tertiary
        </AppButton>
        <div className="size-10 bg-secondary-disabled"></div>
      </div>
    </div>
  );
}
