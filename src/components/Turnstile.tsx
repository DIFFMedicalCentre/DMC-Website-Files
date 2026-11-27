
import { Turnstile as CloudflareTurnstile } from "@marsidev/react-turnstile";

interface TurnstileProps {
  onVerify: (token: string) => void;
  resetKey: number;
}

export default function Turnstile({
  onVerify,
  resetKey,
}: TurnstileProps) {
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

  return (
    <section className="mx-5 mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:mx-8">
      <h3 className="text-sm font-extrabold text-[#092957]">
        Security Verification
      </h3>

      <p className="mb-4 mt-1 text-xs leading-6 text-slate-500">
        Please complete the security verification to
        protect your appointment request.
      </p>

      {siteKey ? (
        <CloudflareTurnstile
          key={resetKey}
          siteKey={siteKey}
          onSuccess={onVerify}
          onExpire={() => onVerify("")}
          onError={() => onVerify("")}
          onTimeout={() => onVerify("")}
          options={{
            theme: "light",
            size: "flexible",
            action: "dmc_physical_booking",
            retry: "auto",
            refreshExpired: "auto",
          }}
        />
      ) : (
        <p role="alert" className="text-sm text-red-600">
          Security verification is currently unavailable.
          Please contact DIFF Medical Centre.
        </p>
      )}
    </section>
  );
}
