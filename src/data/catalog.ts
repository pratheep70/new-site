export interface ServiceSubcategory {
  title: string;
  description: string;
  items: string[];
}

export interface ServiceDefinition {
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  subcategories: ServiceSubcategory[];
  audience: string[];
  howWeHelp: string[];
  disclaimer: string;
  sortOrder: number;
}

export interface FaqDefinition {
  id?: number;
  serviceSlug: string;
  category: string;
  question: string;
  answer: string;
  sortOrder: number;
}

export const SERVICE_CATALOG: ServiceDefinition[] = [
  {
    slug: 'visa-services',
    title: 'Visa Services',
    shortDescription:
      'Employment, investor and partner, family and dependant, and freelance visa applications, renewals, cancellations, and status changes.',
    fullDescription:
      'Sign In Documents Clearing coordinates UAE visa paperwork across every stage—from initial document checks and entry permits to status changes, medical testing, Emirates ID coordination, renewals, and cancellations. We help companies, investors, families, and independent professionals navigate administrative steps clearly and accurately.',
    subcategories: [
      {
        title: 'Employment Visas',
        description: 'Work visa coordination for company staff and new hires in Abu Dhabi and across the UAE.',
        items: ['New employment visa applications', 'Visa renewals and amendments', 'Employment visa cancellations'],
      },
      {
        title: 'Investor & Partner Visas',
        description: 'Residency application coordination for company shareholders, founders, and partners.',
        items: ['New investor or partner visa preparation', 'Status change and residency stamping steps', 'Ongoing renewal reminders'],
      },
      {
        title: 'Family & Dependant Visas',
        description: 'Guided sponsorship paperwork for spouses, children, and eligible dependants.',
        items: ['Family sponsorship file preparation', 'Dependant visa renewals', 'Cancellations and status updates'],
      },
      {
        title: 'Freelance Visas & All Stages',
        description: 'Support for independent professionals alongside full lifecycle visa stage coordination.',
        items: ['Freelance visa application preparation', 'In-country status changes', 'Medical examination & Emirates ID process coordination'],
      },
    ],
    audience: ['Companies & SMEs', 'Investors & Partners', 'Families & Dependants', 'Freelancers & Professionals'],
    howWeHelp: [
      'Review your visa category and prepare a clear checklist of documents needed for your specific case.',
      'Check application details carefully before submission to minimize avoidable administrative delays.',
      'Coordinate medical fitness appointment scheduling, Emirates ID steps, and status changes.',
      'Provide regular status updates through one dedicated point of contact.',
    ],
    disclaimer:
      'Visa eligibility, required supporting documents, government fees, and final approval decisions or timelines are determined strictly by the relevant UAE immigration and labour authorities.',
    sortOrder: 1,
  },
  {
    slug: 'pro-services',
    title: 'PRO Services',
    shortDescription:
      'Labour, immigration, and government transactions with ongoing PRO support, expiry tracking, renewal reminders, and one point of contact.',
    fullDescription:
      'Our Public Relations Officer (PRO) services help Abu Dhabi businesses stay organized across labour, immigration, and licensing transactions. Instead of assigning internal staff to manage fragmented service-centre visits, your company works with one dedicated point of contact who tracks expiries and provides regular status updates.',
    subcategories: [
      {
        title: 'Labour Transactions',
        description: 'Day-to-day coordination for workforce paperwork and labour authority submissions.',
        items: ['Work permits', 'Labour contracts', 'Labour card renewals and cancellations'],
      },
      {
        title: 'Immigration Transactions',
        description: 'Structured processing for residency and entry administration.',
        items: ['Entry permits', 'Residence visa processing', 'Status changes and residency updates'],
      },
      {
        title: 'Government Transactions',
        description: 'Coordination and follow-up across relevant Abu Dhabi and UAE departments.',
        items: ['Trade licence renewals and approvals', 'Departmental clearances', 'Service-centre follow-up'],
      },
      {
        title: 'Ongoing PRO Support',
        description: 'Reliable continuity for growing teams and established UAE entities.',
        items: ['Expiry tracking and renewal reminders', 'One point of contact for your company file', 'Regular, transparent status updates'],
      },
    ],
    audience: ['Companies & SMEs', 'Investors & Partners'],
    howWeHelp: [
      'Assign one point of contact familiar with your company’s active files and renewal schedule.',
      'Track upcoming labour, visa, and licence expiries and send timely renewal reminders.',
      'Prepare applications, coordinate service-centre follow-up, and keep your management team informed.',
    ],
    disclaimer:
      'All government approvals, official charges, and processing durations depend on the specific transaction and the policies of the relevant UAE authority.',
    sortOrder: 2,
  },
  {
    slug: 'document-clearing',
    title: 'Document Clearing',
    shortDescription:
      'Certified legal translation, ministry and embassy attestation, and end-to-end collection and return for educational, commercial, personal, and legal documents.',
    fullDescription:
      'Cross-border personal and corporate matters often require documents to be translated, verified, and attested in a specific sequence. Sign In Documents Clearing manages end-to-end collection, certified legal translation, ministry and embassy attestation coordination, and secure return of your cleared documents.',
    subcategories: [
      {
        title: 'Educational Documents',
        description: 'Clearing and attestation coordination for academic records required for employment or residency.',
        items: ['University degrees and diplomas', 'School certificates and transcripts'],
      },
      {
        title: 'Commercial Documents',
        description: 'Documentation handling for corporate governance, banking, and commercial expansion.',
        items: ['Company formation and trade documents', 'Board resolutions and commercial certificates'],
      },
      {
        title: 'Personal Documents',
        description: 'Attestation and translation coordination for family sponsorship and civil matters.',
        items: ['Marriage certificates', 'Birth certificates and personal civil records'],
      },
      {
        title: 'Legal, Translation & Attestation',
        description: 'End-to-end clearing workflow tailored to the receiving authority’s format requirements.',
        items: ['Contracts and powers of attorney', 'Certified legal translation', 'Ministry and embassy attestation coordination', 'End-to-end collection, attestation, and return'],
      },
    ],
    audience: ['Companies & SMEs', 'Investors & Partners', 'Families & Dependants', 'Freelancers & Professionals'],
    howWeHelp: [
      'Confirm the exact attestation and translation sequence required for your destination authority.',
      'Coordinate collection of original documents, certified legal translation, and ministry/embassy submissions.',
      'Keep you updated at each milestone and arrange return delivery once clearing is complete.',
    ],
    disclaimer:
      'Attestation requirements, applicable stamp duties, and processing timeframes vary by issuing country, document type, and the relevant ministry or embassy.',
    sortOrder: 3,
  },
  {
    slug: 'business-setup',
    title: 'Business Setup',
    shortDescription:
      'Mainland and free zone company formation, trade licence renewals, and company amendments in Abu Dhabi and across the UAE.',
    fullDescription:
      'Whether you are launching a new venture in Abu Dhabi or updating an existing corporate structure, Sign In Documents Clearing guides founders and investors through mainland and free zone company formation paperwork, trade licence renewals, and company amendments.',
    subcategories: [
      {
        title: 'Company Formation',
        description: 'Structured administrative coordination for new UAE business entities.',
        items: ['Mainland company formation support', 'Free zone company formation coordination'],
      },
      {
        title: 'Licensing & Corporate Amendments',
        description: 'Keeping existing licences compliant and updated as your business evolves.',
        items: ['Trade licence renewals', 'Company amendments (activities, partners, or licence details)'],
      },
    ],
    audience: ['Investors & Partners', 'Companies & SMEs'],
    howWeHelp: [
      'Understand your proposed business activity and preferred jurisdiction (mainland or free zone).',
      'Organize initial name reservation, licence application paperwork, and supporting corporate documents.',
      'Handle annual trade licence renewal coordination and corporate amendment filings.',
    ],
    disclaimer:
      'Licensing eligibility, external departmental approvals, government fees, and formation timelines are set by the applicable economic department or free zone authority.',
    sortOrder: 4,
  },
  {
    slug: 'insurance',
    title: 'Insurance',
    shortDescription:
      'Coordination for medical insurance, company insurance, employee insurance, and timely policy renewals.',
    fullDescription:
      'Health and corporate coverage are essential parts of UAE residency and business compliance. Sign In Documents Clearing assists individuals and companies with coordinating medical, employee, and company insurance applications and renewals alongside your visa and PRO files.',
    subcategories: [
      {
        title: 'Medical & Employee Coverage',
        description: 'Insurance coordination aligned with residency and workforce requirements.',
        items: ['Individual and family medical insurance coordination', 'Employee group medical insurance coordination'],
      },
      {
        title: 'Company Policies & Renewals',
        description: 'Administrative support to keep business and staff policies active on schedule.',
        items: ['Company insurance coordination', 'Annual policy renewal tracking and paperwork'],
      },
    ],
    audience: ['Companies & SMEs', 'Investors & Partners', 'Families & Dependants', 'Freelancers & Professionals'],
    howWeHelp: [
      'Gather accurate applicant or employee details needed to request insurance quotations.',
      'Align medical insurance activation with your visa application or renewal timeline.',
      'Track renewal dates alongside visa and licence expiries for seamless continuity.',
    ],
    disclaimer:
      'Insurance terms, coverage benefits, underwriting eligibility, and premiums are determined solely by licensed insurance providers and applicable UAE regulations.',
    sortOrder: 5,
  },
  {
    slug: 'emirates-id',
    title: 'Emirates ID',
    shortDescription:
      'New Emirates ID applications, processing coordination, renewals, and lost ID replacement support.',
    fullDescription:
      'Emirates ID registration is required for UAE residents across personal, banking, and government interactions. We prepare and coordinate new applications, renewals, and lost ID replacements cleanly alongside your residency file.',
    subcategories: [
      {
        title: 'Applications & Renewals',
        description: 'Accurate form preparation and follow-up for resident identity cards.',
        items: ['New Emirates ID applications', 'Emirates ID renewals', 'Application status follow-up'],
      },
      {
        title: 'Processing & Replacement',
        description: 'Support for biometric scheduling coordination and card replacement.',
        items: ['Processing coordination with residency steps', 'Lost or damaged Emirates ID replacement applications'],
      },
    ],
    audience: ['Companies & SMEs', 'Investors & Partners', 'Families & Dependants', 'Freelancers & Professionals'],
    howWeHelp: [
      'Prepare accurate Emirates ID application forms linked with your visa status.',
      'Advise on biometric appointment steps and required identification details.',
      'Assist quickly with lost ID replacement filings and renewal tracking.',
    ],
    disclaimer:
      'Emirates ID issuance, biometric scheduling, card printing, and official fees are governed by the Federal Authority for Identity, Citizenship, Customs & Port Security (ICP).',
    sortOrder: 6,
  },
  {
    slug: 'traffic-department-services',
    title: 'Traffic Department Services',
    shortDescription:
      'Coordination and follow-up for Municipality, DED, Immigration, Labour, Police, and Civil Defence transactions.',
    fullDescription:
      'Sign In Documents Clearing coordinates departmental paperwork and follow-up across Abu Dhabi and UAE government departments. We help clients prepare required documents, submit applications or requests through the correct channel, and track progress through completion.',
    subcategories: [
      {
        title: 'Municipality',
        description: 'Coordination for municipal permits, approvals, and administrative transactions.',
        items: ['Municipal applications', 'Permit follow-up', 'Departmental clearances'],
      },
      {
        title: 'DED',
        description: 'Support for economic department licensing and trade-related transactions.',
        items: ['Trade licence transactions', 'Economic department approvals', 'Licence-related follow-up'],
      },
      {
        title: 'Immigration',
        description: 'Coordination for residency, entry, status, and identity-related transactions.',
        items: ['Entry and residency applications', 'Status changes', 'Government follow-up'],
      },
      {
        title: 'Labour',
        description: 'Administrative support for employment and labour authority transactions.',
        items: ['Work permits', 'Labour contracts', 'Employment transaction follow-up'],
      },
      {
        title: 'Police',
        description: 'Assistance with police-related certificates and departmental applications.',
        items: ['Police clearances', 'Certificate applications', 'Status follow-up'],
      },
      {
        title: 'Civil Defence',
        description: 'Coordination for civil defence approvals and safety-related certificates.',
        items: ['Civil Defence applications', 'Approval follow-up', 'Compliance document coordination'],
      },
    ],
    audience: ['Companies & SMEs', 'Investors & Partners', 'Families & Dependants', 'Freelancers & Professionals'],
    howWeHelp: [
      'Identify the relevant department and required transaction for your case.',
      'Prepare and review application documents before submission.',
      'Coordinate service-centre submissions and follow-up, then keep you updated on progress.',
    ],
    disclaimer:
      'Eligibility, required documents, official fees, approvals, and processing timelines are determined by the relevant UAE government department.',
    sortOrder: 7,
  },
  {
    slug: 'attestation',
    title: 'Attestation',
    shortDescription:
      'Document attestation and stamping coordination for educational, personal, commercial, and legal documents.',
    fullDescription:
      'Sign In Documents Clearing coordinates document attestation in the correct sequence, from initial verification and certified translation through ministry and embassy or consulate stamping. We help ensure documents are prepared for the receiving authority in the UAE or abroad.',
    subcategories: [
      {
        title: 'Educational Documents',
        description: 'Attestation coordination for degrees, diplomas, transcripts, and academic records.',
        items: ['Degree and diploma attestation', 'Transcript attestation', 'Educational certificate follow-up'],
      },
      {
        title: 'Personal Documents',
        description: 'Document stamping support for family, civil, and personal matters.',
        items: ['Marriage certificate attestation', 'Birth certificate attestation', 'Personal document clearing'],
      },
      {
        title: 'Commercial Documents',
        description: 'Attestation support for corporate and commercial paperwork.',
        items: ['Trade licence and company documents', 'Powers of attorney', 'Board resolutions and certificates'],
      },
      {
        title: 'Ministry & Embassy',
        description: 'Sequenced coordination with relevant ministries and embassies or consulates.',
        items: ['MOFA attestation coordination', 'Embassy or consulate stamping', 'Certified translation coordination'],
      },
    ],
    audience: ['Companies & SMEs', 'Investors & Partners', 'Families & Dependants', 'Freelancers & Professionals'],
    howWeHelp: [
      'Confirm the attestation sequence required by the issuing and receiving authorities.',
      'Check document format and prepare the file for translation or stamping.',
      'Coordinate submissions and follow-up, then arrange return after clearing.',
    ],
    disclaimer:
      'Attestation requirements, fees, issuing authority rules, and processing timelines vary by document type and destination country.',
    sortOrder: 8,
  },
  {
    slug: 'driving-license',
    title: 'Driving License',
    shortDescription:
      'Driving licence application, renewal, replacement, transfer, and status follow-up coordination.',
    fullDescription:
      'Sign In Documents Clearing assists residents and new UAE licence applicants with driving licence paperwork and authority follow-up. We help prepare required documents for new licences, renewals, replacements, eye tests, and eligible licence transfers.',
    subcategories: [
      {
        title: 'New & Renewals',
        description: 'Administrative coordination for new applications and licence renewals.',
        items: ['New driving licence applications', 'Licence renewal preparation', 'Eye test coordination'],
      },
      {
        title: 'Replacement & Transfer',
        description: 'Support for lost or damaged licences and eligible licence transfers.',
        items: ['Lost or damaged licence replacement', 'Foreign licence transfer documentation', 'Authority follow-up'],
      },
    ],
    audience: ['Individuals', 'Families & Dependants', 'Companies & SMEs', 'Freelancers & Professionals'],
    howWeHelp: [
      'Review eligibility and identify the documents required for your licence case.',
      'Prepare application details and coordinate eye test or file requirements.',
      'Follow up with the relevant authority and provide clear status updates.',
    ],
    disclaimer:
      'Driving licence eligibility, tests, approvals, fees, and processing are governed by the relevant UAE traffic authority.',
    sortOrder: 9,
  },
];

export const FAQ_CATALOG: FaqDefinition[] = [
  {
    serviceSlug: 'general',
    category: 'General & Process',
    question: 'What services does Sign In Documents Clearing provide?',
    answer:
      'Sign In Transactions Follow Up Services LLC (operating as SIGN IN DOCUMENTS CLEARING) provides Visa Services, PRO Services, Document Clearing (including certified legal translation and attestation), Business Setup, Insurance coordination, and Emirates ID services from our office on Najda Street, Abu Dhabi.',
    sortOrder: 1,
  },
  {
    serviceSlug: 'general',
    category: 'General & Process',
    question: 'Do you guarantee visa approvals or fixed processing times?',
    answer:
      'No. While we carefully review every document and follow up diligently with relevant authorities, all visa approvals, attestations, licences, and processing timelines are determined solely by the competent UAE government authorities or service providers.',
    sortOrder: 2,
  },
  {
    serviceSlug: 'general',
    category: 'General & Process',
    question: 'Should I attach passport copies or Emirates ID scans in the online enquiry form?',
    answer:
      'Please do not upload or include passport numbers, Emirates ID copies, or confidential attachments in the initial website contact form. Share a brief overview of what you need, and our team will advise you on the appropriate and secure way to share documents once your consultation begins.',
    sortOrder: 3,
  },
  {
    serviceSlug: 'visa-services',
    category: 'Visa Services',
    question: 'Which types of UAE visas can you help coordinate?',
    answer:
      'We assist with employment visas, investor and partner visas, family and dependant visas, and freelance visas across new applications, renewals, cancellations, status changes, and medical/Emirates ID coordination.',
    sortOrder: 4,
  },
  {
    serviceSlug: 'visa-services',
    category: 'Visa Services',
    question: 'How do I find out the exact documents and fees required for my visa case?',
    answer:
      'Document checklists, eligibility criteria, and official fees depend on the visa category, sponsor profile, and current authority regulations. Submit a consultation request or call us on 0501022663 so we can review your specific situation and confirm the requirements.',
    sortOrder: 5,
  },
  {
    serviceSlug: 'pro-services',
    category: 'PRO Services',
    question: 'How does your ongoing PRO support work for companies in Abu Dhabi?',
    answer:
      'Your company is assigned one point of contact to coordinate labour, immigration, and government transactions. We also help track visa, labour card, and trade licence expiry dates, provide renewal reminders, and share regular status updates.',
    sortOrder: 6,
  },
  {
    serviceSlug: 'document-clearing',
    category: 'Document Clearing',
    question: 'What types of documents can you clear, translate, and attest?',
    answer:
      'We handle educational documents (degrees and school certificates), commercial documents (company and trade paperwork), personal documents (marriage and birth certificates), and legal documents (contracts and powers of attorney), including certified legal translation and ministry/embassy attestation coordination.',
    sortOrder: 7,
  },
  {
    serviceSlug: 'business-setup',
    category: 'Business Setup',
    question: 'Do you assist with both mainland and free zone business setup?',
    answer:
      'Yes. We support administrative coordination for both mainland and free zone company formation, as well as ongoing trade licence renewals and company amendments. Final licensing requirements and approvals depend on the chosen authority and business activity.',
    sortOrder: 8,
  },
  {
    serviceSlug: 'insurance',
    category: 'Insurance',
    question: 'Can you coordinate medical insurance alongside visa applications?',
    answer:
      'Yes. We coordinate individual medical insurance, employee insurance, company insurance, and policy renewals so your coverage aligns smoothly with your residency or company paperwork, subject to licensed insurer underwriting.',
    sortOrder: 9,
  },
  {
    serviceSlug: 'emirates-id',
    category: 'Emirates ID',
    question: 'Can you help if my Emirates ID is lost or due for renewal?',
    answer:
      'Yes. We assist with new Emirates ID applications, renewals, processing coordination, and lost ID replacement applications. Biometrics and final card issuance remain managed by the relevant UAE identity authority.',
    sortOrder: 10,
  },
];

export const ENQUIRY_SERVICE_OPTIONS = [
  ...SERVICE_CATALOG.map((s) => ({ slug: s.slug, title: s.title })),
  { slug: 'general-consultation', title: 'General Consultation' },
] as const;
