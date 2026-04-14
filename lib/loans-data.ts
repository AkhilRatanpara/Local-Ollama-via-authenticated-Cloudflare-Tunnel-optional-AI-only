export interface Loan {
    id: string;
    title: string;
    description: string;
    category: string;
    maxAmount: string;
    interest: string;
    tags: string[];
    ministry: string;
    benefits: string[];
    eligibility: string[];
    documents: string[];
    applicationUrl: string;
}

export const LOANS_DATA: Loan[] = [
    {
        id: "mudra",
        title: "Mudra Loans (PMMY)",
        description: "Financial support for small businesses to grow. Categories: Shishu (up to 50k), Kishore (50k-5L), Tarun (5L-10L).",
        category: "Business",
        maxAmount: "₹10 Lakhs",
        interest: "8.5% - 12%",
        tags: ["Business", "Startup", "MSME"],
        ministry: "Ministry of Finance",
        benefits: [
            "No collateral required",
            "No processing fee for Shishu loans",
            "Term loans and working capital available",
            "Interest rates are very competitive"
        ],
        eligibility: [
            "Any Indian citizen with a business plan",
            "Proprietorship / Partnership firms",
            "Small manufacturing units",
            "Service sector units",
            "Shopkeepers / Fruit and Vegetable vendors"
        ],
        documents: [
            "Identity Proof (Aadhar/Voter ID)",
            "Address Proof",
            "Business Identity/Address Proof",
            "Balance sheet of last 2 years",
            "Income Tax Returns (if applicable)"
        ],
        applicationUrl: "https://www.mudra.org.in/"
    },
    {
        id: "kcc",
        title: "Kisan Credit Card (KCC)",
        description: "Affordable credit for farmers to purchase seeds, fertilizers, and equipment. Interest subvention available for timely repayment.",
        category: "Agriculture",
        maxAmount: "₹3 Lakhs",
        interest: "4% - 7%",
        tags: ["Agriculture", "Farmer", "Credit"],
        ministry: "Ministry of Agriculture & Farmers Welfare",
        benefits: [
            "Adequate and timely credit support",
            "Insurance coverage for crops",
            "Credit for diesel/electricity bills",
            "Flexible repayment options based on harvest"
        ],
        eligibility: [
            "All Farmers – individuals/Joint borrowers who are owner cultivators",
            "Tenant farmers, oral lessees & Sharecroppers",
            "Self Help Groups (SHGs) or Joint Liability Groups (JLGs)",
            "Engaged in crop production or allied activities"
        ],
        documents: [
            "Duly filled application form",
            "Identity proof like Voter ID card / PAN card / Aadhaar card / Driving license etc.",
            "Address proof like Voter ID card / Passport / Aadhaar card / Driving license etc.",
            "Land holding details"
        ],
        applicationUrl: "https://pmkisan.gov.in/"
    },
    {
        id: "edu",
        title: "Vidya Lakshmi Education Loan",
        description: "Low-interest loans for students pursuing higher education in India or abroad. Central Sector Interest Subsidy (CSIS) available.",
        category: "Education",
        maxAmount: "₹20 Lakhs",
        interest: "6.8% - 9.5%",
        tags: ["Student", "Higher Ed", "Subsidy"],
        ministry: "Department of Higher Education",
        benefits: [
            "Interest subsidy for economically weaker sections",
            "No collateral for loans up to ₹7.5 Lakhs",
            "Moratorium period (Study period + 1 year)",
            "Simplified single window application"
        ],
        eligibility: [
            "Indian National",
            "Secured admission to professional/technical courses",
            "Entrance exam qualified (if applicable)",
            "Family income limit for subsidy: ₹4.5 Lakhs per year"
        ],
        documents: [
            "Admission letter from College/University",
            "Fee structure",
            "Marksheets of last qualifying exam",
            "Parent's income proof",
            "Aadhar Card"
        ],
        applicationUrl: "https://www.vidyalakshmi.co.in/"
    },
    {
        id: "standup",
        title: "Stand-Up India Scheme",
        description: "Bank loans between ₹10 lakh and ₹1 Crore for SC/ST and Women entrepreneurs to set up greenfield enterprises.",
        category: "Entrepreneurship",
        maxAmount: "₹1 Crore",
        interest: "Bank's MCLR + 3% + Tenor Premium",
        tags: ["Women", "SC/ST", "Business"],
        ministry: "Ministry of Finance",
        benefits: [
            "Direct bank credit to underserved sectors",
            "Refinance window through SIDBI",
            "Handholding support for trainees",
            "Targeted to SC/ST and Women only"
        ],
        eligibility: [
            "SC/ST and/or women entrepreneurs, above 18 years of age",
            "Loans available only for greenfield projects",
            "Borrower should not be in default to any bank",
            "In case of non-individual enterprises, at least 51% of the shareholding should be held by SC/ST and/or women entrepreneur"
        ],
        documents: [
            "Identity Proof",
            "Address Proof",
            "Caste Certificate (for SC/ST)",
            "Business Address Proof",
            "Pollution clearance certificate (if required)"
        ],
        applicationUrl: "https://www.standupmitra.in/"
    },
    {
        id: "pmegp",
        title: "PMEGP (Employment Generation)",
        description: "Prime Minister's Employment Generation Programme. Credit-linked subsidy scheme for generating employment through micro-enterprises.",
        category: "Employment",
        maxAmount: "₹25 Lakhs (Mfg) / ₹10 Lakhs (Service)",
        interest: "Bank Rates with 15-35% Subsidy",
        tags: ["Employment", "Manufacturing", "Service"],
        ministry: "Ministry of MSME",
        benefits: [
            "Subsidy up to 35% of project cost",
            "Own contribution only 5-10%",
            "No collateral for loans up to ₹10 Lakhs",
            "Training provided under EDP"
        ],
        eligibility: [
            "Any individual, above 18 years of age",
            "At least VIII standard pass for projects above ₹10 lakh (Mfg) / ₹5 lakh (Service)",
            "Self Help Groups",
            "Institutions registered under Societies Registration Act"
        ],
        documents: [
            "Aadhar Card",
            "PAN Card",
            "Project Report",
            "Education Certificate",
            "Caste/Special Category Certificate"
        ],
        applicationUrl: "https://www.kviconline.gov.in/pmegpeportal/"
    },
    {
        id: "pmay",
        title: "PMAY Home Loan Subsidy",
        description: "Credit Linked Subsidy Scheme (CLSS) under Pradhan Mantri Awas Yojana for first-time home buyers from EWS, LIG, and MIG sections.",
        category: "Housing",
        maxAmount: "₹2.67 Lakh Subsidy",
        interest: "6.5% Net effective",
        tags: ["Housing", "Urban", "Family"],
        ministry: "Ministry of Housing and Urban Affairs",
        benefits: [
            "Interest subsidy up to 6.5%",
            "Longer tenure up to 20 years",
            "Preference to women and manual scavengers",
            "Applicable for new construction or enhancement"
        ],
        eligibility: [
            "The beneficiary family should not own a pucca house in India",
            "Must fall under EWS/LIG/MIG income category",
            "Adult female membership is mandatory in property ownership (for EWS/LIG)",
            "Location must be in a statutory town as per Census 2011"
        ],
        documents: [
            "Voter ID / Aadhar / Passport / Driving license",
            "Proof of income (ITR, Form 16)",
            "Valuation certificate from approved Valuer",
            "Affidavit stating the family doesn't own any other pucca house"
        ],
        applicationUrl: "https://pmaymis.gov.in/"
    }
];
