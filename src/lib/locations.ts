export interface Region {
  id: string
  name: string
  districts: string[]
}

export const REGIONS: Region[] = [
  { id: "tashkent-city", name: "Toshkent shahri", districts: ["Bektemir","Chilonzor","Mirzo Ulug'bek","Mirobod","Olmazor","Sergeli","Shayxontohur","Uchtepa","Yakkasaroy","Yunusobod","Yashnobod","Yangihayot"] },
  { id: "tashkent-region", name: "Toshkent viloyati", districts: ["Ohangaron","Bekobod","Bo'stonliq","Bo'ka","Chinoz","Chirchiq","Oqqo'rg'on","O'rtachirchiq","Parkent","Piskent","Qibray","Quyichirchiq","Yuqorichirchiq","Yangiyo'l","Zangiota","Nurafshon","Angren","Olmaliq"] },
  { id: "andijan", name: "Andijon viloyati", districts: ["Andijon shahri","Asaka","Baliqchi","Bo'ston","Buloqboshi","Izboskan","Jalaquduq","Marhamat","Oltinko'l","Paxtaobod","Qo'rg'ontepa","Shahrixon","Xonobod","Ulug'nor"] },
  { id: "bukhara", name: "Buxoro viloyati", districts: ["Buxoro shahri","Kogon","G'ijduvon","Jondor","Olot","Peshku","Qorako'l","Qorovulbozor","Romitan","Shofirkon","Vobkent"] },
  { id: "fergana", name: "Farg'ona viloyati", districts: ["Farg'ona shahri","Qo'qon shahri","Marg'ilon shahri","Quvasoy","Oltiariq","Bag'dod","Beshariq","Buvayda","Dang'ara","Furqat","Qo'shtepa","Rishton","So'x","Toshloq","Uchko'prik","Yozovon","Quva"] },
  { id: "jizzakh", name: "Jizzax viloyati", districts: ["Jizzax shahri","Arnasoy","Baxmal","Do'stlik","Forish","G'allaorol","Mirzacho'l","Paxtakor","Sharof Rashidov","Yangiobod","Zafarobod","Zomin"] },
  { id: "khorezm", name: "Xorazm viloyati", districts: ["Urganch shahri","Xiva shahri","Bog'ot","Gurlan","Hazorasp","Qo'shko'pir","Shovot","Yangiariq","Yangibozor"] },
  { id: "namangan", name: "Namangan viloyati", districts: ["Namangan shahri","Chortoq","Chust","Kosonsoy","Mingbuloq","Norin","Pap","Pop","To'raqo'rg'on","Uchqo'rg'on","Uychi","Yangiqo'rg'on"] },
  { id: "navoi", name: "Navoiy viloyati", districts: ["Navoiy shahri","Zarafshon shahri","Konimex","Karmana","Nurota","Qiziltepa","Tamdi","Uchquduq","Xatirchi"] },
  { id: "kashkadarya", name: "Qashqadaryo viloyati", districts: ["Qarshi shahri","Shahrisabz shahri","Kitob","Chiroqchi","Dehqonobod","G'uzor","Kamashi","Kasbi","Koson","Muborak","Nishon","Yakkabog'","Mirishkor"] },
  { id: "samarkand", name: "Samarqand viloyati", districts: ["Samarqand shahri","Kattaqo'rg'on shahri","Bulung'ur","Ishtixon","Jomboy","Ko'shrabot","Narpay","Nurobod","Oqdaryo","Pastdarg'om","Payariq","Toyloq","Urgut"] },
  { id: "syrdarya", name: "Sirdaryo viloyati", districts: ["Guliston shahri","Shirin shahri","Yangier shahri","Oqoltin","Boyovut","Guliston tumani","Xovos","Mirzaobod","Sardoba","Sayxunobod","Sirdaryo tumani"] },
  { id: "surkhandarya", name: "Surxondaryo viloyati", districts: ["Termiz shahri","Boysun","Denov","Jarqo'rg'on","Muzrabot","Oltinsoy","Qiziliriq","Qumqo'rg'on","Sariosiyo","Sherobod","Sho'rchi","Uzun"] },
  { id: "karakalpakstan", name: "Qoraqalpog'iston Respublikasi", districts: ["Nukus shahri","Xo'jayli shahri","Amudaryo","Beruniy","Bo'zatov","Chimboy","Ellikqal'a","Kegeyli","Mo'ynoq","Nukus tumani","Qo'ng'irot","Qorao'zak","Shumanay","Taxiatosh","Taxtako'pir","To'rtko'l"] },
]

export function getRegionById(id: string): Region | undefined {
  return REGIONS.find((r) => r.id === id)
}

export function getRegionByName(name: string): Region | undefined {
  return REGIONS.find((r) => r.name === name)
}

export function getDistricts(regionNameOrId: string): string[] {
  const region = getRegionById(regionNameOrId) || getRegionByName(regionNameOrId)
  return region?.districts ?? []
}

export const PROPERTY_CATEGORIES = [
  { id: "APARTMENT", name: "Kvartira" },
  { id: "HOUSE", name: "Uy-joy" },
  { id: "OFFICE", name: "Ofis" },
  { id: "LAND", name: "Yer maydoni" },
  { id: "WAREHOUSE", name: "Ombor" },
]

export const DEAL_TYPES = [
  { id: "SALE", name: "Sotuv" },
  { id: "RENT", name: "Ijara" },
  { id: "NEW_BUILDING", name: "Yangi bino" },
]

export const ROOM_OPTIONS = [
  { id: "1", name: "1 xona" },
  { id: "2", name: "2 xona" },
  { id: "3", name: "3 xona" },
  { id: "4", name: "4 xona" },
  { id: "5", name: "5+ xona" },
]

export const SORT_OPTIONS = [
  { id: "newest", name: "Eng yangilari" },
  { id: "price-asc", name: "Narx: arzondan qimmatga" },
  { id: "price-desc", name: "Narx: qimmatdan arzonga" },
  { id: "area-desc", name: "Maydon: kattadan kichikka" },
]

export interface FilterState {
  region: string
  district: string
  category: string
  minPrice: string
  maxPrice: string
  rooms: string
  minArea: string
  maxArea: string
  sortBy: string
}

export const DEFAULT_FILTERS: FilterState = {
  region: "",
  district: "",
  category: "",
  minPrice: "",
  maxPrice: "",
  rooms: "",
  minArea: "",
  maxArea: "",
  sortBy: "newest",
}