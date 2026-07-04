import { FurnitureCategory, Testimonial } from './types';

export const FURNITURE_CATEGORIES: FurnitureCategory[] = [
  {
    id: 'yotoqxona',
    title: 'Yotoqxona Mebellari',
    description: 'Yotoqxonangiz uchun hashamatli va qulay karavotlar, shkaflar va tumba to\'plamlari.',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80',
    details: 'Bizning yotoqxona to\'plamlarimiz shinamlik va tinchlantiruvchi muhit yaratish uchun maxsus loyihalashtirilgan. Har bir detal sizning to\'liq hordiq olishingizga xizmat qiladi.',
    items: [
      'Hashamatli ikki kishilik karavot (King Size, ortopedik matras bilan)',
      'Sig\'imli kiyim shkafi (kupe yoki ochiladigan eshikli)',
      '2 ta yon tumba (tumba)',
      'Katta ko\'zguli pardoz stoli (tryumo)',
      'Yumshoq pufik'
    ],
    material: 'Eman va yong\'oq tabiiy yog\'och qoplamasi, mustahkam metall karkas, Turkiyadan keltirilgan yuqori sifatli gipoallergen matolar, MDF.',
    guarantee: '5 yil rasmiy kafolat',
    duration: '10-15 ish kuni'
  },
  {
    id: 'oshxona',
    title: 'Oshxona Mebellari',
    description: 'Sizning uyingiz uchun zamonaviy dizayn va maksimal qulaylikka ega oshxona garniturlari.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    details: 'Oshxona — uyning yuragi. Biz har bir santimetrdan unumli foydalangan holda ergonomik, chidamli va ko\'zni quvontiradigan oshxona mebellarshini yaratamiz.',
    items: [
      'Oshxona garnituri (barcha ustki va pastki shkaflar)',
      'Blum (Avstriya) yumshoq yopiluvchi (dovochik) furnituralari',
      'Tabiiy yoki sun\'iy toshdan yasalgan mustahkam peshtaxta (stoleshnitsa)',
      'Oshxona stoli va 6 ta yumshoq stullar to\'plami',
      'Yashirin yukxona va idish-tovoq bo\'limlari'
    ],
    material: 'Namlikka va issiqlikka chidamli MDF, akril va shpon qoplamalar, sifatli Avstriya furnituralari, sun\'iy kvars tosh.',
    guarantee: '3 yil rasmiy kafolat',
    duration: '15-20 ish kuni'
  },
  {
    id: 'mehmonxona',
    title: 'Mehmonxona Mebellari',
    description: 'Mehmonlaringiz hayratda qoladigan darajadagi hashamatli devoriy shkaflar, TV stendlar va vitrinalar.',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
    details: 'Mehmonxona — uyingizning vizit kartochkasi. Biz uyingizning ushbu markaziy qismiga mos, zamonaviy va funksional garniturlar taqdim etamiz.',
    items: [
      'Zamonaviy televizor osti stendi (TV tumba)',
      'Yoritgichli hashamatli shisha vitrina',
      'Kitob va dekoratsiyalar uchun devoriy javonlar',
      'Premium jurnal stoli (kofe stoli)',
      'Konsol va ko\'zgu to\'plami'
    ],
    material: 'Laminatsiyalangan MDF, tabiiy daraxt detallari, temperli xavfsiz shisha, metall dekorativ qismlar, LED yoritish tizimi.',
    guarantee: '4 yil rasmiy kafolat',
    duration: '12-18 ish kuni'
  },
  {
    id: 'yumshoq',
    title: 'Yumshoq Mebellar',
    description: 'Maksimal qulay va sifatli divanlar, kreslolar va burchakli yumshoq mebellar to\'plami.',
    image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=800&q=80',
    details: 'Charchoqlarni chiqarish uchun eng yaxshi maskan. Bizning yumshoq mebellarimiz o\'ta chidamli prujinalar va deformatsiyalanmaydigan gubkalar bilan jihozlangan.',
    items: [
      'Premium burchakli divan (katta o\'lchamli, yotoq holatiga o\'tuvchi)',
      '2 ta ergonomic shinam kreslo',
      'Dekorativ va ortopedik yostiqlar to\'plami',
      'Yuviladigan va suv o\'tkazmaydigan material qoplamasi',
      'Keng saqlash qutisi (divan ostida)'
    ],
    material: 'Quruq qarag\'ay va chinor yog\'ochidan yasalgan baquvvat karkas, Rossiyaning 35-zichlikdagi ortopedik gubkasi (porolon), Turkiyadan keltirilgan "antivandal" suv va kir yuqmaydigan matolar.',
    guarantee: '3 yil rasmiy kafolat',
    duration: '7-12 ish kuni'
  }
];

export const ADVANTAGES = [
  {
    title: 'Sifat kafolati',
    description: 'Har bir ishlab chiqarilgan mebelga 3 yildan 5 yilgacha rasmiy kafolat beramiz. Faqat sinalgan va ekologik toza xomashyolardan foydalanamiz.',
    iconName: 'Award'
  },
  {
    title: 'O\'zbekiston bo\'ylab yetkazib berish',
    description: 'Toshkent shahri ichida yetkazib berish va o\'rnatish mutlaqo bepul! Viloyatlarga esa tezkor va xavfsiz transport xizmati yo\'lga qo' + 'yilgan.',
    iconName: 'Truck'
  },
  {
    title: 'Hamyonbop narxlar',
    description: 'Urtachilarsiz to\'g\'ridan-to\'g\'ri ishlab chiqaruvchining o\'zidan xarid qilasiz. Shuningdek, foizsiz muddatli to\'lov imkoniyatlari ham mavjud.',
    iconName: 'DollarSign'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Sardor Rahimov',
    role: 'Toshkent shahri, Yangihayot t.',
    comment: 'Bek Mebeli jamoasidan oshxona mebeli buyurtma bergan edik. Haqiqiy ustalarning ishi ekani ko\'rinib turibdi. Kelishilgan muddatdan 2 kun oldin kelib, juda tez va toza o\'rnatib berishdi. Blum furnituralari o\'ta yumshoq ishlayapti. Tavsiya qilaman!',
    rating: 5,
    date: '15-May, 2026'
  },
  {
    id: 2,
    name: 'Madina Usmonova',
    role: 'Toshkent shahri, Yunusobod t.',
    comment: 'Yotoqxona to\'plamini buyurtma qildik. Matolar sifati va rangi xuddi dizayn loyihadagidek chiqdi. Karavot o\'ta qulay va mustahkam ekan, g\'irchillagan ovozlar yo\'q. Ular bizga bepul konsul va ko\'zgu ham sovg\'a qilishdi. Katta rahmat!',
    rating: 5,
    date: '02-Iyun, 2026'
  },
  {
    id: 3,
    name: 'Dilshod To\'rayev',
    role: 'Toshkent shahri, Chilonzor t.',
    comment: 'Mehmonxonamiz uchun TV tumba va vitrina yasatdik. Minimalist uslubdagi dizayni mehmonxonaga juda mos tushdi. MDF sifati va chetlari juda tekis ishlangan. Narxi ham bozordagidan ancha arzon chiqdi.',
    rating: 5,
    date: '24-Iyun, 2026'
  }
];

export const CONTACT_INFO = {
  phones: ['+998 (99) 880-12-34', '+998 (90) 123-45-67'],
  email: 'info@bekmebeli.uz',
  address: 'O\'zbekiston, Toshkent shahri, Chilonzor tumani, Lutfiy ko\'chasi, 24-uy',
  workingHours: 'Har kuni: 09:00 - 19:00 (dam olish kunisiz)',
  instagram: 'https://instagram.com/bekmebeli_uz',
  telegram: 'https://t.me/bekmebeli_admin',
  mapsLink: 'https://www.google.com/maps/place//data=!4m2!3m1!1s0x3f4d1fb515ba3c83:0xe6f125efeeabac21'
};
