import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { User, Mail, Phone, Lock } from "lucide-react";

interface Props {
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  ownerPassword: string;
  onNameChange: (val: string) => void;
  onEmailChange: (val: string) => void;
  onPhoneChange: (val: string) => void;
  onPasswordChange: (val: string) => void;
}

const OwnerDetailsForm = ({
  ownerName, ownerEmail, ownerPhone, ownerPassword,
  onNameChange, onEmailChange, onPhoneChange, onPasswordChange,
}: Props) => {
  const { t } = useTranslation();

  return (
    <section className="p-5 rounded-xl border border-primary/10 bg-card space-y-4">
      <h2 className="text-sm font-mono uppercase tracking-widest text-primary/70">
        {t("configure.ownerDetails")}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-primary/60" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              {t("configure.ownerName")}
            </span>
          </div>
          <Input value={ownerName} onChange={(e) => onNameChange(e.target.value)} placeholder={t("configure.ownerName")} className="text-sm" />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-primary/60" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              {t("configure.ownerEmail")}
            </span>
          </div>
          <Input type="email" value={ownerEmail} onChange={(e) => onEmailChange(e.target.value)} placeholder={t("configure.ownerEmail")} className="text-sm" />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-primary/60" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              {t("configure.ownerPhone")}
            </span>
          </div>
          <Input type="tel" value={ownerPhone} onChange={(e) => onPhoneChange(e.target.value)} placeholder={t("configure.ownerPhone")} className="text-sm" />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-primary/60" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              {t("configure.ownerPassword")}
            </span>
          </div>
          <Input type="password" value={ownerPassword} onChange={(e) => onPasswordChange(e.target.value)} placeholder="••••••••" minLength={8} className="text-sm" />
        </div>
      </div>
    </section>
  );
};

export default OwnerDetailsForm;
