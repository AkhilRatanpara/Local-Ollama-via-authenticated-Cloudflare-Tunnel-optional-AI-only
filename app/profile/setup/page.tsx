"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { stateDistrictMap } from "@/lib/locationMap";
import { motion, AnimatePresence } from "framer-motion";
import { 
    User, Calendar, Heart, MapPin, ShieldCheck, Landmark, 
    ArrowRight, ArrowLeft, Check, Sparkles, FileText, AlertCircle
} from "lucide-react";

interface UserProfile {
    name: string;
    email: string;
    mobile: string;
    dob: string;
    gender: string;
    category: string;
    income: string;
    occupation: string;
    role: string;
    state: string;
    district: string;
    village: string;
    aadhar: string;
    pan: string;
    fatherName: string;
    fatherProfession: string;
    motherName: string;
    motherProfession: string;
    documents: string[];
    appliedSchemes: any[];
    savedSchemes: any[];
    caste: string;
    address: string;
}

const formatDob = (dobString: any): string => {
    if (!dobString) return "";
    try {
        const d = new Date(dobString);
        if (isNaN(d.getTime())) return "";
        const year = d.getUTCFullYear();
        const month = String(d.getUTCMonth() + 1).padStart(2, '0');
        const day = String(d.getUTCDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    } catch (e) {
        return "";
    }
};

const formatAadhar = (val: string): string => {
    const digits = val.replace(/\D/g, "");
    const parts = [];
    for (let i = 0; i < digits.length && i < 12; i += 4) {
        parts.push(digits.substring(i, i + 4));
    }
    return parts.join(" ");
};

const formatPan = (val: string): string => {
    return val.toUpperCase().replace(/[^A-Z0-9]/g, "").substring(0, 10);
};

const formatMobile = (val: string): string => {
    return val.replace(/\D/g, "").substring(0, 10);
};

function convertNumberToIndianWords(numStr: string): string {
    const num = parseInt(numStr.replace(/[^0-9]/g, ''), 10);
    if (isNaN(num) || num <= 0) return "";
    
    const a = [
        '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
        'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
    ];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    function numToWords(n: number): string {
        if (n < 20) return a[n];
        const digit = n % 10;
        return b[Math.floor(n / 10)] + (digit ? " " + a[digit] : "");
    }
    
    let words = "";
    let temp = num;
    
    const crore = Math.floor(temp / 10000000);
    temp %= 10000000;
    if (crore > 0) {
        words += numToWords(crore) + " Crore ";
    }
    
    const lakh = Math.floor(temp / 100000);
    temp %= 100000;
    if (lakh > 0) {
        words += numToWords(lakh) + " Lakh ";
    }
    
    const thousand = Math.floor(temp / 1000);
    temp %= 1000;
    if (thousand > 0) {
        words += numToWords(thousand) + " Thousand ";
    }
    
    const hundred = Math.floor(temp / 100);
    temp %= 100;
    if (hundred > 0) {
        words += numToWords(hundred) + " Hundred ";
    }
    
    if (temp > 0) {
        if (words !== "") words += "and ";
        words += numToWords(temp);
    }
    
    return words.trim() + " Rupees";
}

export default function ProfileSetupPage() {
    const router = useRouter();
    const { user: authUser, setUser: setAuthUser } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const [user, setUser] = useState<UserProfile>({
        name: "", email: "", mobile: "", dob: "", gender: "", category: "General",
        income: "", occupation: "", role: "User", state: "", district: "", village: "", aadhar: "", pan: "",
        fatherName: "", fatherProfession: "", motherName: "", motherProfession: "",
        documents: [], appliedSchemes: [], savedSchemes: [], caste: "", address: ""
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (authUser) {
            setUser(prev => ({
                ...prev,
                ...(authUser as any),
                mobile: (authUser as any).mobile ? formatMobile((authUser as any).mobile) : "",
                dob: (authUser as any).dob ? formatDob((authUser as any).dob) : "",
                gender: (authUser as any).gender || "",
                category: (authUser as any).category || "General",
                income: (authUser as any).income || "",
                occupation: (authUser as any).occupation || "",
                state: (authUser as any).state ? (authUser as any).state.toLowerCase() : "",
                district: (authUser as any).district ? (authUser as any).district.toLowerCase() : "",
                village: (authUser as any).village || "",
                aadhar: (authUser as any).aadhar ? formatAadhar((authUser as any).aadhar) : "",
                pan: (authUser as any).pan ? formatPan((authUser as any).pan) : "",
                fatherName: (authUser as any).fatherName || "",
                fatherProfession: (authUser as any).fatherProfession || "",
                motherName: (authUser as any).motherName || "",
                motherProfession: (authUser as any).motherProfession || "",
                role: (authUser as any).role || "User",
                documents: (authUser as any).documents || [],
                appliedSchemes: (authUser as any).appliedSchemes || [],
                savedSchemes: (authUser as any).savedSchemes || [],
                caste: (authUser as any).caste || "",
                address: (authUser as any).address || ""
            }));
        }
    }, [authUser]);

    // Scroll inner content to top on step changes
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
        }
    }, [currentStep]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === "aadhar") {
            formattedValue = formatAadhar(value);
        } else if (name === "pan") {
            formattedValue = formatPan(value);
        } else if (name === "mobile") {
            formattedValue = formatMobile(value);
        }

        setUser(prev => ({ ...prev, [name]: formattedValue }));
        
        // Clear field error on change
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validateStep = (step: number): boolean => {
        const newErrors: Record<string, string> = {};
        
        if (step === 1) {
            if (!user.name.trim()) newErrors.name = "Full name is required";
            else if (user.name.trim().length < 3) newErrors.name = "Name must be at least 3 characters";
            
            if (!user.dob) newErrors.dob = "Date of birth is required";
            else {
                const birthDate = new Date(user.dob);
                const today = new Date();
                if (birthDate > today) newErrors.dob = "Date of birth cannot be in the future";
            }
            
            if (!user.gender) newErrors.gender = "Please select your gender";
            if (!user.category) newErrors.category = "Please select your category";
        }
        
        if (step === 2) {
            if (!user.fatherName.trim()) newErrors.fatherName = "Father's name is required";
            if (!user.fatherProfession.trim()) newErrors.fatherProfession = "Father's occupation is required";
            if (!user.motherName.trim()) newErrors.motherName = "Mother's name is required";
            if (!user.motherProfession.trim()) newErrors.motherProfession = "Mother's occupation is required";
        }
        
        if (step === 3) {
            if (!user.email.trim()) newErrors.email = "Email address is required";
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email.trim())) newErrors.email = "Enter a valid email address";
            
            const rawMobile = user.mobile.replace(/\D/g, "");
            if (!rawMobile) newErrors.mobile = "Mobile number is required";
            else if (rawMobile.length !== 10) newErrors.mobile = "Mobile number must be exactly 10 digits";
            
            if (!user.state) newErrors.state = "Please select your state";
            if (!user.district) newErrors.district = "Please select your district";
            if (!user.village.trim()) newErrors.village = "Village / Town Area is required";
            if (!user.address.trim()) newErrors.address = "Postal address is required";
        }
        
        if (step === 4) {
            const rawAadhar = user.aadhar.replace(/\s/g, "");
            if (rawAadhar && rawAadhar.length !== 12) newErrors.aadhar = "Aadhaar number must be exactly 12 digits";
            
            if (user.pan) {
                const panClean = user.pan.trim().toUpperCase();
                if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panClean)) {
                    newErrors.pan = "Invalid PAN format (e.g. ABCDE1234F)";
                }
            }
        }
        
        if (step === 5) {
            if (!user.income.toString().trim()) newErrors.income = "Annual family income is required";
            else {
                const inc = parseFloat(user.income.toString().replace(/,/g, ''));
                if (isNaN(inc) || inc < 0) newErrors.income = "Income must be a valid positive number";
            }
            if (!user.occupation) newErrors.occupation = "Please select your occupation";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateStep(5)) return;

        setIsLoading(true);
        try {
            const cleanedUser = {
                ...user,
                aadhar: user.aadhar.replace(/\s/g, ""),
                pan: user.pan.trim().toUpperCase()
            };

            const res = await fetch("/api/user/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cleanedUser)
            });

            if (!res.ok) throw new Error("Failed to update profile");

            const data = await res.json();
            setAuthUser(data.user);
            router.push("/profile");
        } catch (error) {
            console.error(error);
            alert("Error saving profile. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 5));
        }
    };
    
    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const steps = [
        { title: "Personal Info", icon: User, desc: "Name, DOB & category" },
        { title: "Family Details", icon: Heart, desc: "Parents background" },
        { title: "Contact & Address", icon: MapPin, desc: "State, district & area" },
        { title: "Identity Proofs", icon: ShieldCheck, desc: "Optional documents" },
        { title: "Socio-Economic", icon: Landmark, desc: "Income & occupation" }
    ];

    const inputClasses = (fieldName: string) => {
        const base = "w-full h-12 px-4 rounded-xl bg-slate-50 border transition-all text-sm outline-none text-slate-800 focus:bg-white";
        const stateClass = errors[fieldName]
            ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/5 text-slate-900 bg-red-50/5"
            : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5";
        return `${base} ${stateClass}`;
    };

    const labelClasses = "block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-1";

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.22 }}
                        className="space-y-6"
                    >
                        <div>
                            <h3 className="text-2xl font-bold text-slate-950 tracking-tight font-heading">Personal Details</h3>
                            <p className="text-slate-500 text-sm mt-1">Enter your basic credentials to initiate your scheme eligibility matches.</p>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className={labelClasses}>Full Name <span className="text-red-500">*</span></label>
                                <input name="name" value={user.name} onChange={handleInputChange} placeholder="E.g. Ramesh Kumar" className={inputClasses("name")} />
                                {errors.name && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.name}</p>}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClasses}>Date of Birth <span className="text-red-500">*</span></label>
                                    <input type="date" name="dob" value={user.dob} onChange={handleInputChange} className={inputClasses("dob")} />
                                    {errors.dob && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.dob}</p>}
                                </div>
                                <div>
                                    <label className={labelClasses}>Gender <span className="text-red-500">*</span></label>
                                    <select name="gender" value={user.gender} onChange={handleInputChange} className={inputClasses("gender")}>
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    {errors.gender && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.gender}</p>}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClasses}>Social Category <span className="text-red-500">*</span></label>
                                    <select name="category" value={user.category} onChange={handleInputChange} className={inputClasses("category")}>
                                        <option value="General">General</option>
                                        <option value="OBC">OBC</option>
                                        <option value="SC">SC</option>
                                        <option value="ST">ST</option>
                                    </select>
                                    {errors.category && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.category}</p>}
                                </div>
                                <div>
                                    <label className={labelClasses}>Caste (Optional)</label>
                                    <input name="caste" value={user.caste} onChange={handleInputChange} placeholder="E.g. Yadav, Brahmin, etc." className={inputClasses("caste")} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.22 }}
                        className="space-y-6"
                    >
                        <div>
                            <h3 className="text-2xl font-bold text-slate-950 tracking-tight font-heading">Family Background</h3>
                            <p className="text-slate-500 text-sm mt-1">Provide parental details to check eligibility for family-based welfare schemes.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClasses}>Father's Name <span className="text-red-500">*</span></label>
                                    <input name="fatherName" value={user.fatherName} onChange={handleInputChange} placeholder="E.g. Suresh Kumar" className={inputClasses("fatherName")} />
                                    {errors.fatherName && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.fatherName}</p>}
                                </div>
                                <div>
                                    <label className={labelClasses}>Father's Occupation <span className="text-red-500">*</span></label>
                                    <input name="fatherProfession" value={user.fatherProfession} onChange={handleInputChange} placeholder="E.g. Farmer, Retired, Business" className={inputClasses("fatherProfession")} />
                                    {errors.fatherProfession && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.fatherProfession}</p>}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClasses}>Mother's Name <span className="text-red-500">*</span></label>
                                    <input name="motherName" value={user.motherName} onChange={handleInputChange} placeholder="E.g. Sunita Devi" className={inputClasses("motherName")} />
                                    {errors.motherName && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.motherName}</p>}
                                </div>
                                <div>
                                    <label className={labelClasses}>Mother's Occupation <span className="text-red-500">*</span></label>
                                    <input name="motherProfession" value={user.motherProfession} onChange={handleInputChange} placeholder="E.g. Homemaker, Teacher" className={inputClasses("motherProfession")} />
                                    {errors.motherProfession && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.motherProfession}</p>}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.22 }}
                        className="space-y-6"
                    >
                        <div>
                            <h3 className="text-2xl font-bold text-slate-950 tracking-tight font-heading">Contact & Location</h3>
                            <p className="text-slate-500 text-sm mt-1">Enter your localized address to match region-specific scheme benefits.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClasses}>Email Address <span className="text-red-500">*</span></label>
                                    <input type="email" name="email" value={user.email} readOnly title="Email is managed from your account and cannot be changed here." className={`${inputClasses("email")} cursor-not-allowed opacity-70`} />
                                    {errors.email && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.email}</p>}
                                </div>
                                <div>
                                    <label className={labelClasses}>Mobile Number <span className="text-red-500">*</span></label>
                                    <input type="tel" name="mobile" value={user.mobile} onChange={handleInputChange} placeholder="E.g. 9876543210" maxLength={10} className={inputClasses("mobile")} />
                                    {errors.mobile && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.mobile}</p>}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClasses}>State <span className="text-red-500">*</span></label>
                                    <select 
                                        name="state" 
                                        value={user.state} 
                                        onChange={(e) => {
                                            setUser(prev => ({ ...prev, state: e.target.value, district: "" }));
                                            if (errors.state) setErrors(prev => ({ ...prev, state: "", district: "" }));
                                        }} 
                                        className={inputClasses("state")}
                                    >
                                        <option value="">Select State</option>
                                        {Object.keys(stateDistrictMap).sort().map(state => (
                                            <option key={state} value={state}>{state.replace(/\b\w/g, c => c.toUpperCase())}</option>
                                        ))}
                                    </select>
                                    {errors.state && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.state}</p>}
                                </div>
                                <div>
                                    <label className={labelClasses}>District <span className="text-red-500">*</span></label>
                                    <select 
                                        name="district" 
                                        value={user.district} 
                                        disabled={!user.state} 
                                        onChange={handleInputChange} 
                                        className={inputClasses("district")}
                                    >
                                        <option value="">Select District</option>
                                        {user.state && stateDistrictMap[user.state.toLowerCase()] && Array.from(new Set(stateDistrictMap[user.state.toLowerCase()])).sort().map(dist => (
                                            <option key={dist} value={dist}>{dist.replace(/\b\w/g, c => c.toUpperCase())}</option>
                                        ))}
                                    </select>
                                    {errors.district && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.district}</p>}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClasses}>Village / Town / City Area <span className="text-red-500">*</span></label>
                                    <input name="village" value={user.village} onChange={handleInputChange} placeholder="E.g. Wadhwan" className={inputClasses("village")} />
                                    {errors.village && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.village}</p>}
                                </div>
                                <div>
                                    <label className={labelClasses}>Postal Address <span className="text-red-500">*</span></label>
                                    <input name="address" value={user.address} onChange={handleInputChange} placeholder="E.g. House No. 24, Near Temple" className={inputClasses("address")} />
                                    {errors.address && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.address}</p>}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            case 4:
                return (
                    <motion.div
                        key="step4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.22 }}
                        className="space-y-6"
                    >
                        <div>
                            <h3 className="text-2xl font-bold text-slate-950 tracking-tight font-heading">Verification Documents</h3>
                            <p className="text-slate-500 text-sm mt-1">Identity details are optional and are not used to calculate your scheme recommendations.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClasses}>Aadhaar Number (Optional)</label>
                                    <input name="aadhar" value={user.aadhar} onChange={handleInputChange} placeholder="E.g. 1234 5678 9012" maxLength={14} className={inputClasses("aadhar")} />
                                    {errors.aadhar && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.aadhar}</p>}
                                </div>
                                <div>
                                    <label className={labelClasses}>PAN Number (Optional)</label>
                                    <input name="pan" value={user.pan} onChange={handleInputChange} placeholder="E.g. ABCDE1234F" maxLength={10} className={`${inputClasses("pan")} uppercase`} />
                                    {errors.pan && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.pan}</p>}
                                </div>
                            </div>
                            <div className="border border-dashed border-slate-200 rounded-2xl p-6 text-center bg-slate-50/50 hover:bg-white hover:border-indigo-300 transition-all flex flex-col items-center justify-center">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
                                    <FileText className="w-5 h-5 text-slate-500" />
                                </div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1 px-1">Upload Supporting Certificates (Optional)</label>
                                <p className="text-xs text-slate-400 mb-4 max-w-xs leading-normal">Certificate uploads are not yet stored. Selected file names are shown only for this form session.</p>
                                <input 
                                    type="file" 
                                    multiple 
                                    onChange={(e) => {
                                        if (e.target.files) {
                                            const fileNames = Array.from(e.target.files).map(f => f.name);
                                            setUser(prev => ({ ...prev, documents: fileNames }));
                                        }
                                    }} 
                                    className="text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-black cursor-pointer transition-all" 
                                />
                                {user.documents.length > 0 && (
                                    <div className="mt-4 flex flex-wrap gap-2 justify-center">
                                        {user.documents.map((doc, i) => (
                                            <span key={i} className="text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/50 px-2.5 py-1 rounded-full flex items-center gap-1">
                                                <Check className="w-3.5 h-3.5" /> {doc}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                );
            case 5:
                const wordsRepresentation = convertNumberToIndianWords(user.income);
                return (
                    <motion.div
                        key="step5"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.22 }}
                        className="space-y-6"
                    >
                        <div>
                            <h3 className="text-2xl font-bold text-slate-950 tracking-tight font-heading">Socio-Economic Profile</h3>
                            <p className="text-slate-500 text-sm mt-1">Specify your current financial background to evaluate income limits on government benefits.</p>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className={labelClasses}>Annual Family Income (INR) <span className="text-red-500">*</span></label>
                                <input type="number" name="income" value={user.income} onChange={handleInputChange} placeholder="E.g. 250000" className={inputClasses("income")} />
                                {wordsRepresentation && (
                                    <p className="text-xs text-indigo-600 mt-1 font-semibold pl-1">
                                        In words: {wordsRepresentation}
                                    </p>
                                )}
                                {errors.income && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.income}</p>}
                            </div>
                            <div>
                                <label className={labelClasses}>Primary Occupation <span className="text-red-500">*</span></label>
                                <select name="occupation" value={user.occupation} onChange={handleInputChange} className={inputClasses("occupation")}>
                                    <option value="">Select Occupation</option>
                                    <option value="Farmer">Farmer</option>
                                    <option value="Student">Student</option>
                                    <option value="Business">Business Owner</option>
                                    <option value="Employed">Salaried / Self Employed</option>
                                    <option value="Unemployed">Unemployed / Pensioner</option>
                                    <option value="Housewife">Homemaker</option>
                                </select>
                                {errors.occupation && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.occupation}</p>}
                            </div>
                            <div className="p-5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl shadow-xl mt-6 relative overflow-hidden">
                                <div className="absolute -right-4 -top-4 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl" />
                                <div className="flex gap-4 items-center">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0 text-indigo-400">
                                        <Sparkles className="w-5 h-5 animate-pulse" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-white">Ready to match schemes</h4>
                                        <p className="text-slate-400 text-xs leading-relaxed mt-0.5">Sangam will map your profile details securely against available government welfare programs immediately.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <main className="min-h-screen pt-24 pb-8 bg-slate-50 flex justify-center items-center px-4 md:px-6">
            
            <div className="max-w-5xl w-full bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.03)] flex flex-col md:flex-row border border-slate-100 min-h-[550px] overflow-visible">
                
                {/* ── LEFT SIDEBAR (STEP PROGRESS) ── */}
                <div className="w-full md:w-1/3 bg-slate-900 text-white p-8 flex flex-col justify-between shrink-0 border-b md:border-b-0 md:border-r border-slate-800 relative rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none">
                    {/* Grid decoration */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:20px_20px] rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_400px_at_50%_-100px,#3b82f612,transparent)] rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none"></div>

                    <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
                        <div>
                            {/* Logo */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-extrabold tracking-tight leading-none font-heading">SANGAM</h1>
                                    <span className="text-[10px] text-indigo-400 font-extrabold uppercase tracking-wider">Profile Setup</span>
                                </div>
                            </div>

                            {/* Stepper Details on Desktop */}
                            <div className="hidden md:block">
                                <h2 className="text-lg font-bold mb-1 tracking-tight font-heading leading-snug">Verify Details</h2>
                                <p className="text-slate-400 text-xs mb-6 leading-relaxed font-medium">Complete your profile to unlock customized government schemes match.</p>
                            </div>

                            {/* Stepper Steps */}
                            <div className="hidden md:block space-y-5">
                                {steps.map((step, idx) => {
                                    const isActive = currentStep === idx + 1;
                                    const isPassed = currentStep > idx + 1;
                                    const StepIcon = step.icon;
                                    return (
                                        <div 
                                            key={idx} 
                                            className={`flex items-start gap-4 transition-all duration-300 ${
                                                isActive ? "opacity-100 translate-x-1" : "opacity-40 hover:opacity-60"
                                            }`}
                                        >
                                            <div className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center transition-all ${
                                                isActive 
                                                    ? "bg-indigo-600 text-white font-bold" 
                                                    : isPassed 
                                                    ? "bg-emerald-500 text-white" 
                                                    : "bg-slate-800 text-slate-400"
                                            }`}>
                                                {isPassed ? <Check className="w-4.5 h-4.5" /> : <StepIcon className="w-4 h-4" />}
                                            </div>
                                            <div className="min-w-0">
                                                <div className={`font-semibold text-xs ${isActive ? "text-white" : "text-slate-300"}`}>{step.title}</div>
                                                <div className="text-[9px] text-slate-500 mt-0.5 uppercase tracking-wider font-semibold">
                                                    {isPassed ? "Completed" : step.desc}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Progress Tracker */}
                        <div>
                            <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                                <span>Step Progress</span>
                                <span>{Math.round((currentStep / 5) * 100)}%</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div 
                                    className="bg-indigo-500 h-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                                    style={{ width: `${(currentStep / 5) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT CONTENT (DYNAMIC VIEWPORT) ── */}
                <div className="w-full md:w-2/3 flex flex-col bg-slate-50/10 relative rounded-b-3xl md:rounded-r-3xl md:rounded-bl-none">
                    {/* Content Area */}
                    <div className="flex-1 p-6 md:p-10">
                        <AnimatePresence mode="wait">
                            {renderStepContent()}
                        </AnimatePresence>
                    </div>

                    {/* Action controls at the bottom */}
                    <div className="bg-white border-t border-slate-100 p-6 flex justify-between items-center mt-auto rounded-b-3xl md:rounded-br-3xl md:rounded-bl-none">
                        <button
                            type="button"
                            onClick={prevStep}
                            disabled={currentStep === 1}
                            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-1.5 ${
                                currentStep === 1 
                                    ? "opacity-0 pointer-events-none" 
                                    : "text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 active:scale-95"
                            }`}
                        >
                            <ArrowLeft className="w-4 h-4" /> Previous
                        </button>

                        {currentStep < 5 ? (
                            <button 
                                type="button"
                                onClick={nextStep} 
                                className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
                            >
                                Continue <ArrowRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button 
                                type="button"
                                onClick={handleSave} 
                                disabled={isLoading} 
                                className="px-8 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl font-bold text-sm shadow-md shadow-slate-950/10 hover:shadow-slate-950/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
                            >
                                {isLoading ? (
                                    <>Saving Profile...</>
                                ) : (
                                    <>
                                        Finish Setup <Check className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>

            </div>
        </main>
    );
}
