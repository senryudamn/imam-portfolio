const initialProfile = {
  name: "Imam Akbari Majid",
  role: "S-1 Pendidikan Teknik Mekatronika",
  bio: "Mahasiswa di Universitas Negeri Yogyakarta. Terobsesi dengan otomasi, merakit sistem IoT, dan membangun arsitektur tertanam (embedded systems) yang menjembatani perangkat keras dan perangkat lunak secara fungsional.",
  avatar: "/gambar1.jpeg", // Pastikan gambar ini ada di folder public Anda
  email: "akbariimam8@gmail.com",
  linkedin: "https://www.linkedin.com/in/imam-akbari-majid-29a5b2270/",
  instagram: "https://www.instagram.com/imam_maajiid/",
  github: "https://github.com"
};

const initialProjects = [
  {
    id: 1, title: "ENZYRA: Eco-Enzyme Reactor", category: "Mechatronics", tech: "ESP32, C++, IoT Sensors",
    desc: "Automated reactor with pH monitoring and motor-driven agitation. Designed to optimize eco-enzyme production.",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 2, title: "Gambut Guardian", category: "IoT", tech: "Fuzzy Logic, Data Viz",
    desc: "Digital twin system for remote solar panel health monitoring in peatland environments.",
    image: "https://images.unsplash.com/photo-1509391366360-1f95972858bf?auto=format&fit=crop&q=80&w=600"
  }
];

const initialAchievements = [
  { id: 1, year: "2026", title: "Ketua Tim PKM-KC", desc: "Berperan sebagai ketua tim untuk pengembangan proyek inovasi karsa cipta di tingkat universitas." },
  { id: 2, year: "2026", title: "Build with TRAE X ASSETS UGM", desc: "Berpartisipasi aktif dalam workshop pengembangan AI dan teknologi inovatif." }
];

const initialGallery = [
  { id: 1, url: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&q=80&w=600", caption: "Proses soldering dan perakitan sirkuit utama." },
  { id: 2, url: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=600", caption: "Pengujian sensor pada prototipe awal." }
];

// Helper Function
const getLocalData = (key, initialData) => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(initialData));
    return initialData;
  }
  return JSON.parse(data);
};

export const getProfile = () => getLocalData('portfolio_profile', initialProfile);
export const saveProfile = (data) => localStorage.setItem('portfolio_profile', JSON.stringify(data));

export const getProjects = () => getLocalData('portfolio_projects', initialProjects);
export const saveProjects = (data) => localStorage.setItem('portfolio_projects', JSON.stringify(data));

export const getAchievements = () => getLocalData('portfolio_achievements', initialAchievements);
export const saveAchievements = (data) => localStorage.setItem('portfolio_achievements', JSON.stringify(data));

export const getGallery = () => getLocalData('portfolio_gallery', initialGallery);
export const saveGallery = (data) => localStorage.setItem('portfolio_gallery', JSON.stringify(data));