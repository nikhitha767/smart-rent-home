export interface City {
    name: string;
    areas: string[];
}

export interface State {
    id: string;
    name: string;
    cities: City[];
}

export const locationData: State[] = [
    {
        id: "andhra-pradesh",
        name: "Andhra Pradesh",
        cities: [
            { name: "Vijayawada", areas: ["Benz Circle", "MG Road", "Patamata", "Bhavanipuram", "Gollapudi"] },
            { name: "Visakhapatnam", areas: ["Dwarka Nagar", "Gajuwaka", "MVP Colony", "Siripuram", "Madhurawada"] },
            { name: "Guntur", areas: ["Arundelpet", "Brodipet", "Vidyanagar", "Pattabhipuram"] },
            { name: "Tirupati", areas: ["Alipiri", "Renigunta Road", "Chandragiri", "Tirumala Bypass"] }
        ]
    },
    {
        id: "karnataka",
        name: "Karnataka",
        cities: [
            { name: "Bangalore", areas: ["Koramangala", "Indiranagar", "Whitefield", "HSR Layout", "Electronic City", "Jayanagar", "Malleswaram"] },
            { name: "Mysore", areas: ["Vijayanagar", "Kuvempunagar", "Saraswathipuram", "Gokulam"] },
            { name: "Mangalore", areas: ["Hampankatta", "Kadri", "Bejai", "Kankanady"] }
        ]
    },
    {
        id: "telangana",
        name: "Telangana",
        cities: [
            { name: "Hyderabad", areas: ["Hitech City", "Gachibowli", "Banjara Hills", "Jubilee Hills", "Kondapur", "Madhapur", "Kukatpally"] },
            { name: "Warangal", areas: ["Hanamkonda", "Kazipet", "Subedari", "Nakkalagutta"] },
            { name: "Nizamabad", areas: ["Armoor Road", "Vinayak Nagar", "Dichpally"] }
        ]
    },
    {
        id: "maharashtra",
        name: "Maharashtra",
        cities: [
            { name: "Mumbai", areas: ["Andheri", "Bandra", "Powai", "Juhu", "Thane", "Navi Mumbai", "Colaba"] },
            { name: "Pune", areas: ["Koregaon Park", "Hinjewadi", "Kothrud", "Viman Nagar", "Baner", "Wakad"] },
            { name: "Nagpur", areas: ["Dharampeth", "Sitabuldi", "Civil Lines", "Sadar"] }
        ]
    },
    {
        id: "tamil-nadu",
        name: "Tamil Nadu",
        cities: [
            { name: "Chennai", areas: ["T. Nagar", "Anna Nagar", "Adyar", "Velachery", "OMR", "Mylapore"] },
            { name: "Coimbatore", areas: ["RS Puram", "Gandhipuram", "Saibaba Colony", "Peelamedu"] },
            { name: "Madurai", areas: ["Anna Nagar", "KK Nagar", "Tallakulam", "Mattuthavani"] }
        ]
    },
    {
        id: "kerala",
        name: "Kerala",
        cities: [
            { name: "Kochi", areas: ["Edappally", "Kaloor", "Vyttila", "Fort Kochi", "Kakkanad"] },
            { name: "Thiruvananthapuram", areas: ["Kowdiar", "Pattom", "Kazhakkoottam", "Thampanoor"] },
            { name: "Kozhikode", areas: ["Mavoor Road", "Nadakkavu", "West Hill"] }
        ]
    },
    {
        id: "delhi",
        name: "Delhi NCR",
        cities: [
            { name: "New Delhi", areas: ["Connaught Place", "Karol Bagh", "Dwarka", "Saket", "Vasant Kunj"] },
            { name: "Noida", areas: ["Sector 18", "Sector 62", "Sector 137", "Sector 150"] },
            { name: "Gurgaon", areas: ["DLF Phase 1", "Cyber City", "Sohna Road", "Golf Course Road"] }
        ]
    },
    {
        id: "gujarat",
        name: "Gujarat",
        cities: [
            { name: "Ahmedabad", areas: ["Navrangpura", "Satellite", "Vastrapur", "Prahlad Nagar", "Gota"] },
            { name: "Surat", areas: ["Adajan", "Vesu", "Athwa", "Piplod"] },
            { name: "Vadodara", areas: ["Alkapuri", "Fatehgunj", "Manjalpur", "Vasna Road"] }
        ]
    },
    {
        id: "west-bengal",
        name: "West Bengal",
        cities: [
            { name: "Kolkata", areas: ["Salt Lake", "New Town", "Park Street", "Ballygunge", "Dum Dum"] },
            { name: "Howrah", areas: ["Shibpur", "Salkia", "Liluah"] }
        ]
    },
    {
        id: "rajasthan",
        name: "Rajasthan",
        cities: [
            { name: "Jaipur", areas: ["Vaishali Nagar", "Malviya Nagar", "C Scheme", "Raja Park"] },
            { name: "Udaipur", areas: ["Hiran Magri", "Fatehpura", "Sector 11"] },
            { name: "Jodhpur", areas: ["Sardarpura", "Shastri Nagar", "Ratanada"] }
        ]
    },
    {
        id: "uttar-pradesh",
        name: "Uttar Pradesh",
        cities: [
            { name: "Lucknow", areas: ["Gomti Nagar", "Hazratganj", "Indira Nagar", "Aliganj"] },
            { name: "Kanpur", areas: ["Swaroop Nagar", "Civil Lines", "Kakadeo"] },
            { name: "Varanasi", areas: ["Lanka", "Sigra", "Bhelupur"] }
        ]
    },
    {
        id: "punjab",
        name: "Punjab",
        cities: [
            { name: "Chandigarh", areas: ["Sector 17", "Sector 35", "Manimajra", "Mohali"] },
            { name: "Ludhiana", areas: ["Sarabha Nagar", "Model Town", "Civil Lines"] },
            { name: "Amritsar", areas: ["Ranjit Avenue", "Civil Lines", "Model Town"] }
        ]
    }
];
