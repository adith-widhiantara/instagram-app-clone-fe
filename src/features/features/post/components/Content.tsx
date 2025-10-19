import { useNavigate } from 'react-router-dom';
import { FaComment, FaHeart, FaUserCircle } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { useAddLike } from '@/api/post';

interface ContentProps {
  id: number,
  caption: string,
  image_url: string,
  is_detail?: boolean
  data?: any
}

const styles = {
  infoContainer: {
    // ... (Style yang sudah ada)
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    margin: '15px 0',
    backgroundColor: '#f9f9f9',
    fontFamily: 'Arial, sans-serif',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  divider: {
    borderBottom: '1px dashed #ccc',
    margin: '8px 0 12px 0',
  },
  statsSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '20px',
  },
  icon: {
    marginRight: '8px',
  },
  text: {
    margin: 0,
    fontSize: '14px',
    color: '#333',
  },

  // --- STYLE BARU UNTUK TOMBOL LIKE ---
  likeButton: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 12px',
    borderRadius: '20px', // Tombol kapsul
    border: '1px solid #e74c3c', // Border merah
    backgroundColor: 'transparent',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  likeButtonActive: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 12px',
    borderRadius: '20px',
    border: '1px solid #e74c3c',
    backgroundColor: '#e74c3c', // Latar belakang merah saat di-like
    color: '#fff', // Teks putih saat di-like
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  textButton: {
    margin: 0,
    fontSize: '14px',
    fontWeight: 'bold',
    color: 'inherit', // Mengikuti warna tombol (merah/putih)
  },
};

export default function Content(props: ContentProps) {
  const navigate = useNavigate();

  const initialLikes = props.data.likes.length;
  const [likeCount, setLikeCount] = useState<number>(initialLikes);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const { currentUser } = useAuthStore();

  // hooks
  const {
    mutate: mutateLike,
  } = useAddLike();

  const handleLike = () => {
    // Logika Like/Unlike
    if (isLiked) {
      // Jika sudah di-like, kurangi hitungan (Unlike)
      setLikeCount(prevCount => prevCount - 1);
    } else {
      // Jika belum di-like, tambahkan hitungan (Like)
      setLikeCount(prevCount => prevCount + 1);
    }

    // Balikkan status like
    setIsLiked(!isLiked);

    // Di sini Anda juga bisa menambahkan logika untuk memanggil API
    mutateLike({
      post_id: props.data.id,
      user_id: currentUser?.id || 0,
    });
  };

  useEffect(() => {
    setIsLiked(props.data.likes.map((like: any) => {
      return like.user_id;
    }).includes(currentUser?.id));
  }, [currentUser]);

  return (
    <>
      <div
        className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <a href="#">
          <img className="rounded-t-lg" src={props.image_url} alt="" />
        </a>
        <div className="p-5">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {props.caption}
          </h5>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Here are the biggest enterprise technology
            acquisitions of 2021 so far, in reverse chronological order.</p>

          {!props.is_detail && (
            <button onClick={() => navigate(`${props.id}`)}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Read more
              <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                   fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M1 5h12m0 0L9 1m4 4L9 9" />
              </svg>
            </button>
          )}

          {props.is_detail && (
            <div style={styles.infoContainer}>

              {/* Bagian Nama User */}
              <div style={styles.userSection}>
                <FaUserCircle size={20} style={styles.icon} />
                <p style={styles.text}>Posted By: **{props.data.user.name}**</p>
              </div>

              <div style={styles.divider}></div>

              {/* Bagian Statistik (Likes & Comments) */}
              <div style={styles.statsSection}>

                {/* Tombol Like Interaktif */}
                <button
                  onClick={handleLike}
                  style={isLiked ? styles.likeButtonActive : styles.likeButton}
                >
                  <FaHeart
                    color={isLiked ? '#fff' : '#e74c3c'} // Hati berubah warna
                    size={18}
                    style={{ marginRight: '5px' }}
                  />
                  <p style={styles.textButton}>
                    {likeCount} {isLiked ? 'Unlike' : 'Like'}
                  </p>
                </button>

                {/* Jumlah Comment (tetap statis dari props) */}
                <div style={styles.statItem}>
                  <FaComment color="#3498db" size={18} style={styles.icon} />
                  <p style={styles.text}>**{props.data.comments.length}** Comments</p>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}