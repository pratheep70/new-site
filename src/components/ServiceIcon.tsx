import {
  Briefcase,
  Building2,
  CreditCard,
  FileCheck2,
  FileText,
  ShieldCheck,
} from 'lucide-react';

export function ServiceIcon({
  slug,
  className = 'w-5 h-5 text-[#008CD2]',
}: {
  slug: string;
  className?: string;
}) {
  switch (slug) {
    case 'visa-services':
      return <FileCheck2 className={className} aria-hidden="true" />;
    case 'pro-services':
      return <Briefcase className={className} aria-hidden="true" />;
    case 'document-clearing':
      return <FileText className={className} aria-hidden="true" />;
    case 'business-setup':
      return <Building2 className={className} aria-hidden="true" />;
    case 'insurance':
      return <ShieldCheck className={className} aria-hidden="true" />;
    case 'emirates-id':
      return <CreditCard className={className} aria-hidden="true" />;
    default:
      return <FileCheck2 className={className} aria-hidden="true" />;
  }
}
