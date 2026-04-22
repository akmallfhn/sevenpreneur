import AppButton from "@/components/buttons/AppButton";
import AppPageState from "@/components/states/AppPageState";

export default function Page() {
  if (process.env.DOMAIN_MODE === "production") {
    return <AppPageState variant="NOT_FOUND" />;
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
        <AppButton variant="destructive">Destr</AppButton>
        <AppButton variant="destructive" disabled>
          Destr
        </AppButton>
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
        <AppButton variant="destructiveSoft">Destr</AppButton>
        <AppButton variant="destructiveSoft" disabled>
          Destr
        </AppButton>
      </div>
      <div className="flex items-center justify-center gap-2">
        <AppButton variant="dark">Dark</AppButton>
        <AppButton variant="dark" disabled>
          Dark
        </AppButton>
        <AppButton variant="light">Light</AppButton>
        <AppButton variant="light" disabled>
          Light
        </AppButton>
      </div>
      <div className="flex items-center justify-center gap-2">
        <p className="font-bodycopy">Lorem ipsum dolor sit amet</p>
      </div>
    </div>
  );
}
