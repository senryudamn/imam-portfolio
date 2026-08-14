import { db } from './firebase'; 
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

// Fallback data jika Firebase kosong / error
const DEFAULT_PROFILE = {
  name: "Imam Akbari Majid",
  role: "S-1 Pendidikan Teknik Mekatronika",
  bio: "Mahasiswa di Universitas Negeri Yogyakarta. Terobsesi dengan otomasi, merakit sistem IoT, dan membangun arsitektur tertanam (embedded systems) yang menjembatani perangkat keras dan perangkat lunak secara fungsional.",
  avatar: "https://res.cloudinary.com/aj1qdylv/image/upload/v1712345678/default_avatar.jpg",
  linkedin: "https://linkedin.com/in/imam-akbari-majid",
  github: "https://github.com/senryudamn",
  instagram: "https://instagram.com/imamakbarimajid",
  email: "akbariimam8@gmail.com"
};

// FUNGSI KUNCI: Membatasi waktu tunggu maksimal (Timeout) 3 detik
const withTimeout = (promise, ms = 3000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Firebase Timeout / Offline')), ms)
    )
  ]);
};

export const fetchProfile = async () => {
  try {
    const docRef = doc(db, "portfolio", "profile");
    // Gunakan withTimeout agar tidak terjebak loading abadi
    const docSnap = await withTimeout(getDoc(docRef));
    if (docSnap.exists()) return docSnap.data();
    return DEFAULT_PROFILE;
  } catch (error) {
    console.error("Gagal mengambil profil (Menggunakan Default):", error.message);
    return DEFAULT_PROFILE;
  }
};

export const fetchProjects = async () => {
  try {
    const querySnapshot = await withTimeout(getDocs(collection(db, "projects")));
    const projects = [];
    querySnapshot.forEach((doc) => {
      projects.push({ id: doc.id, ...doc.data() });
    });
    return projects;
  } catch (error) {
    console.error("Gagal mengambil projects:", error.message);
    return [];
  }
};

export const fetchAchievements = async () => {
    try {
      const querySnapshot = await withTimeout(getDocs(collection(db, "achievements")));
      const achievements = [];
      querySnapshot.forEach((doc) => {
        achievements.push({ id: doc.id, ...doc.data() });
      });
      return achievements;
    } catch (error) {
      console.error("Gagal mengambil achievements:", error.message);
      return [];
    }
  };

  export const fetchGallery = async () => {
    try {
      const querySnapshot = await withTimeout(getDocs(collection(db, "gallery")));
      const gallery = [];
      querySnapshot.forEach((doc) => {
        gallery.push({ id: doc.id, ...doc.data() });
      });
      return gallery;
    } catch (error) {
      console.error("Gagal mengambil gallery:", error.message);
      return [];
    }
  };