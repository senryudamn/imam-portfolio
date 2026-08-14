import { db } from './firebase'; // <-- FIX: Menyesuaikan dengan struktur file Anda yang sebenarnya
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

// Fallback data jika Firebase kosong
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

export const fetchProfile = async () => {
  try {
    const docRef = doc(db, "portfolio", "profile");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) return docSnap.data();
    return DEFAULT_PROFILE;
  } catch (error) {
    console.error("Gagal mengambil profil:", error);
    return DEFAULT_PROFILE;
  }
};

export const fetchProjects = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "projects"));
    const projects = [];
    querySnapshot.forEach((doc) => {
      projects.push({ id: doc.id, ...doc.data() });
    });
    return projects;
  } catch (error) {
    console.error("Gagal mengambil projects:", error);
    return [];
  }
};

export const fetchAchievements = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "achievements"));
      const achievements = [];
      querySnapshot.forEach((doc) => {
        achievements.push({ id: doc.id, ...doc.data() });
      });
      return achievements;
    } catch (error) {
      console.error("Gagal mengambil achievements:", error);
      return [];
    }
  };

  export const fetchGallery = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "gallery"));
      const gallery = [];
      querySnapshot.forEach((doc) => {
        gallery.push({ id: doc.id, ...doc.data() });
      });
      return gallery;
    } catch (error) {
      console.error("Gagal mengambil gallery:", error);
      return [];
    }
  };