// Indian district/city to state mapping for location-based eligibility matching
// This allows the system to recognize that a user in "Surendranagar" is in "Gujarat"

export const stateDistrictMap: Record<string, string[]> = {
    "gujarat": [
        "ahmedabad", "surat", "vadodara", "rajkot", "bhavnagar", "jamnagar", "junagadh",
        "gandhinagar", "anand", "nadiad", "morbi", "surendranagar", "bharuch", "mehsana",
        "bhuj", "kutch", "gandhidham", "navsari", "valsad", "patan", "dahod", "godhra",
        "palanpur", "amreli", "botad", "kheda", "panchmahal", "sabarkantha", "banaskantha",
        "tapi", "narmada", "porbandar", "dwarka", "somnath", "gir", "dang", "aravalli",
        "mahisagar", "chhota udaipur", "devbhumi dwarka", "kachchh"
    ],
    "maharashtra": [
        "mumbai", "pune", "nagpur", "thane", "nashik", "aurangabad", "solapur", "kolhapur",
        "sangli", "satara", "ratnagiri", "sindhudurg", "ahmednagar", "jalgaon", "dhule",
        "nandurbar", "wardha", "chandrapur", "gadchiroli", "gondia", "bhandara", "buldhana",
        "washim", "yavatmal", "amravati", "akola", "hingoli", "parbhani", "latur", "osmanabad",
        "beed", "nanded", "jalna", "raigad", "palghar", "navi mumbai", "panvel"
    ],
    "rajasthan": [
        "jaipur", "jodhpur", "udaipur", "kota", "bikaner", "ajmer", "bhilwara", "alwar",
        "bharatpur", "sikar", "pali", "nagaur", "tonk", "chittorgarh", "barmer", "jaisalmer",
        "jhunjhunu", "churu", "hanumangarh", "ganganagar", "banswara", "dungarpur", "bundi",
        "sawai madhopur", "jhalawar", "karauli", "dholpur", "pratapgarh", "rajsamand",
        "sirohi", "jalore", "dausa"
    ],
    "uttar pradesh": [
        "lucknow", "kanpur", "agra", "varanasi", "allahabad", "prayagraj", "meerut", "noida",
        "ghaziabad", "bareilly", "aligarh", "moradabad", "saharanpur", "gorakhpur", "faizabad",
        "ayodhya", "jhansi", "muzaffarnagar", "mathura", "firozabad", "rampur", "shahjahanpur",
        "farrukhabad", "bulandshahr", "hapur", "etawah", "mirzapur", "bijnor", "amroha",
        "sultanpur", "rae bareli", "unnao", "sitapur", "hardoi", "lakhimpur", "bahraich",
        "gonda", "azamgarh", "ballia", "deoria", "basti", "ambedkar nagar", "pratapgarh",
        "jaunpur", "sonbhadra", "chandauli", "fatehpur", "banda", "hamirpur", "mahoba",
        "lalitpur", "auraiya", "etah", "mainpuri", "budaun", "pilibhit", "barabanki",
        "greater noida"
    ],
    "madhya pradesh": [
        "bhopal", "indore", "jabalpur", "gwalior", "ujjain", "sagar", "dewas", "satna",
        "ratlam", "rewa", "murwara", "singrauli", "burhanpur", "khandwa", "morena",
        "bhind", "chhindwara", "shivpuri", "vidisha", "damoh", "mandsaur", "khargone",
        "neemuch", "hoshangabad", "itarsi", "sehore", "betul", "seoni", "datia", "nagda"
    ],
    "karnataka": [
        "bengaluru", "bangalore", "mysuru", "mysore", "hubli", "dharwad", "mangalore",
        "belgaum", "belagavi", "gulbarga", "kalaburagi", "davanagere", "bellary", "ballari",
        "bijapur", "vijayapura", "shimoga", "shivamogga", "tumkur", "tumakuru", "raichur",
        "bidar", "hassan", "mandya", "udupi", "chikmagalur", "chitradurga", "kolar",
        "ramanagara", "gadag", "haveri", "koppal", "yadgir", "chamarajanagar", "kodagu"
    ],
    "tamil nadu": [
        "chennai", "coimbatore", "madurai", "tiruchirappalli", "trichy", "salem", "tirunelveli",
        "erode", "vellore", "thoothukudi", "thanjavur", "dindigul", "ranipet", "sivakasi",
        "karur", "kanchipuram", "tiruvannamalai", "cuddalore", "villupuram", "nagapattinam",
        "nagercoil", "kanyakumari", "krishnagiri", "dharmapuri", "namakkal", "perambalur",
        "ariyalur", "tiruvarur", "nilgiris", "ramanathapuram", "sivaganga", "virudhunagar",
        "theni", "pudukottai", "kallakurichi", "chengalpattu", "tirupattur", "tenkasi",
        "mayiladuthurai"
    ],
    "kerala": [
        "thiruvananthapuram", "kochi", "kozhikode", "thrissur", "kollam", "palakkad",
        "alappuzha", "kannur", "malappuram", "kottayam", "kasaragod", "pathanamthitta",
        "idukki", "ernakulam", "wayanad"
    ],
    "west bengal": [
        "kolkata", "howrah", "durgapur", "asansol", "siliguri", "bardhaman", "burdwan",
        "malda", "baharampur", "habra", "kharagpur", "shantiniketan", "haldia", "medinipur",
        "bankura", "purulia", "hooghly", "nadia", "north 24 parganas", "south 24 parganas",
        "murshidabad", "birbhum", "jalpaiguri", "cooch behar", "darjeeling", "alipurduar",
        "kalimpong", "dinajpur"
    ],
    "telangana": [
        "hyderabad", "warangal", "nizamabad", "karimnagar", "khammam", "mahbubnagar",
        "nalgonda", "adilabad", "medak", "rangareddy", "sangareddy", "siddipet", "jangaon",
        "suryapet", "mancherial", "peddapalli", "kamareddy", "jagtial", "nirmal", "wanaparthy",
        "nagarkurnool", "medchal", "vikarabad", "yadadri", "narayanpet", "jogulamba",
        "jayashankar", "bhadradri", "mulugu", "secunderabad"
    ],
    "andhra pradesh": [
        "vijayawada", "visakhapatnam", "vizag", "guntur", "nellore", "kurnool", "tirupati",
        "rajahmundry", "kakinada", "eluru", "ongole", "anantapur", "kadapa", "srikakulam",
        "vizianagaram", "chittoor", "krishna", "prakasam", "west godavari", "east godavari"
    ],
    "punjab": [
        "chandigarh", "ludhiana", "amritsar", "jalandhar", "patiala", "bathinda", "mohali",
        "pathankot", "hoshiarpur", "batala", "moga", "malerkotla", "khanna", "phagwara",
        "muktsar", "barnala", "rajpura", "firozpur", "kapurthala", "faridkot", "sangrur",
        "fazilka", "gurdaspur", "mansa", "nawanshahr", "ropar", "tarn taran", "fatehgarh sahib"
    ],
    "haryana": [
        "gurugram", "gurgaon", "faridabad", "panipat", "ambala", "yamunanagar", "rohtak",
        "hisar", "karnal", "sonipat", "panchkula", "bhiwani", "sirsa", "jind", "thanesar",
        "kaithal", "palwal", "rewari", "mahendragarh", "fatehabad", "kurukshetra", "nuh"
    ],
    "bihar": [
        "patna", "gaya", "bhagalpur", "muzaffarpur", "purnia", "darbhanga", "arrah",
        "begusarai", "katihar", "munger", "chhapra", "samastipur", "sasaram", "hajipur",
        "siwan", "motihari", "nawada", "buxar", "sitamarhi", "madhubani", "supaul",
        "kishanganj", "araria", "jehanabad", "aurangabad", "nalanda", "sheikhpura",
        "lakhisarai", "jamui", "khagaria", "gopalganj", "vaishali", "saharsa"
    ],
    "odisha": [
        "bhubaneswar", "cuttack", "rourkela", "berhampur", "sambalpur", "puri", "balasore",
        "bhadrak", "baripada", "jeypore", "jharsuguda", "bargarh", "angul", "dhenkanal",
        "keonjhar", "koraput", "rayagada", "kalahandi", "bolangir", "sonepur", "nayagarh",
        "khordha", "jajpur", "kendrapara", "jagatsinghpur"
    ],
    "assam": [
        "guwahati", "silchar", "dibrugarh", "jorhat", "nagaon", "tinsukia", "tezpur",
        "karimganj", "hailakandi", "diphu", "goalpara", "bongaigaon", "barpeta", "mangaldoi",
        "nalbari", "kokrajhar", "dhubri", "golaghat", "sivasagar", "lakhimpur", "dhemaji",
        "morigaon", "darrang", "sonitpur", "kamrup"
    ],
    "jharkhand": [
        "ranchi", "jamshedpur", "dhanbad", "bokaro", "deoghar", "hazaribagh", "giridih",
        "ramgarh", "dumka", "phusro", "medininagar", "chatra", "chaibasa", "gumla",
        "lohardaga", "simdega", "latehar", "pakur", "godda", "sahibganj", "jamtara",
        "koderma", "khunti", "seraikela"
    ],
    "chhattisgarh": [
        "raipur", "bhilai", "bilaspur", "korba", "durg", "rajnandgaon", "jagdalpur",
        "ambikapur", "dhamtari", "mahasamund", "kanker", "kawardha", "mungeli", "bemetara",
        "balod", "gariaband", "janjgir", "raigarh", "jashpur", "surajpur", "balrampur",
        "surguja", "kondagaon", "narayanpur", "bijapur", "dantewada", "sukma"
    ],
    "uttarakhand": [
        "dehradun", "haridwar", "rishikesh", "haldwani", "roorkee", "kashipur", "rudrapur",
        "nainital", "almora", "pithoragarh", "chamoli", "champawat", "bageshwar", "tehri",
        "pauri", "uttarkashi", "udham singh nagar"
    ],
    "himachal pradesh": [
        "shimla", "dharamshala", "mandi", "solan", "palampur", "baddi", "nahan", "hamirpur",
        "una", "bilaspur", "kullu", "manali", "chamba", "kangra", "sirmaur", "kinnaur",
        "lahaul", "spiti"
    ],
    "goa": [
        "panaji", "margao", "vasco", "mapusa", "ponda", "bicholim", "curchorem",
        "north goa", "south goa"
    ],
    "delhi": [
        "new delhi", "delhi", "noida", "dwarka", "rohini", "saket", "connaught place",
        "karol bagh", "lajpat nagar", "nehru place", "janakpuri"
    ]
};

// Resolve a user location string to a state name
export function resolveState(location: string): string | null {
    const loc = location.toLowerCase().trim();
    
    // Direct state name match
    for (const state of Object.keys(stateDistrictMap)) {
        if (loc.includes(state)) return state;
    }
    
    // District/city match
    for (const [state, districts] of Object.entries(stateDistrictMap)) {
        for (const district of districts) {
            if (loc.includes(district)) return state;
        }
    }
    
    return null;
}

// Check if user location matches a scheme's state requirement
export function isLocationMatch(userLocation: string, schemeState: string): { match: boolean; resolvedState: string | null } {
    const schemeLow = schemeState.toLowerCase().trim();
    const userLow = userLocation.toLowerCase().trim();
    
    // Direct match
    if (userLow.includes(schemeLow)) return { match: true, resolvedState: schemeLow };
    
    // Resolve user location to state
    const resolved = resolveState(userLow);
    if (resolved && resolved === schemeLow) return { match: true, resolvedState: resolved };
    
    // Also try resolving scheme state (in case it's stored as a city)
    const schemeResolved = resolveState(schemeLow);
    if (resolved && schemeResolved && resolved === schemeResolved) return { match: true, resolvedState: resolved };
    
    return { match: false, resolvedState: resolved };
}
