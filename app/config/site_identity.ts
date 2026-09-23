export const SITE_IDENTITY = {
  name: "Apply MBBS",
  shortName: "Apply MBBS",
  tagline: "Guiding you to a better future",
  website: "https://applymbbs.com",
  domain: "applymbbs.com",
  address: {
    building: "Iconic Tower",
    landmark: "12Th Floor, B1209, Block A",
    details: "Industrial Area, Sector 62",
    area: "Uttar Pradesh",
    city: "Noida",
    pincode: "201309",
    full: "12Th Floor, Iconic Tower, B1209, Block A, Industrial Area, Sector 62, Noida, Uttar Pradesh 201309",
  },
  offices: [
    {
      id: "noida",
      label: "Noida Office",
      city: "Noida",
      state: "Uttar Pradesh",
      pincode: "201309",
      full: "12Th Floor, Iconic Tower, B1209, Block A, Industrial Area, Sector 62, Noida, Uttar Pradesh 201309",
      mapQuery:
        "Iconic Tower, B1209, Block A, Industrial Area, Sector 62, Noida, Uttar Pradesh 201309",
      accent: "HQ",
    },
    {
      id: "bhopal",
      label: "Bhopal Office",
      city: "Bhopal",
      state: "Madhya Pradesh",
      pincode: "462026",
      full: "Office no.3, 3rd floor, Rishi Business park, Narmadapuram Rd, beside rajpal toyota, Misrod, Bhopal, Madhya Pradesh 462026",
      mapQuery:
        "Rishi Business park, Narmadapuram Rd, beside rajpal toyota, Misrod, Bhopal, Madhya Pradesh 462026",
      accent: "Central India",
    },
  ],
  contact: {
    phone: "+91 9907811114",
    email: "singh.rahul927@gmail.com",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=12Th%20Floor%2C%20Iconic%20Tower%2C%20B1209%2C%20Block%20A%2C%20Industrial%20Area%2C%20Sector%2062%2C%20Noida%2C%20Uttar%20Pradesh%20201309",
  },
  officeHours: {
    mondayToSaturday: "10:00 AM - 8:00 PM",
    sunday: "Closed",
  },
  statistics: {
    studentsCounselled: "5000+",
    yearsExperience: "15+",
    partnerColleges: "150+",
  },
  logo: {
    primary: "/apply-mbbs-logo.png",
    favicon: "/favicon.png",
  },
  social: {
    facebook: "https://www.facebook.com/share/19RBNMPDaV/",
    instagram: "https://www.instagram.com/applymbbs.in?stkn=b3lvNjFkOTM0anA0",
    linkedin: "https://linkedin.com/company/applymbbs",
    youtube: "https://youtube.com/@applymbbs",
    twitter: "https://x.com/applymbbs",
  },
} as const;

export default SITE_IDENTITY;
