import { useNavigate } from 'react-router-dom';
import { FaComment, FaHeart, FaPaperPlane, FaTrash, FaUserCircle } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { useAddComment, useAddLike, useRemoveComment } from '@/api/post';

interface ContentProps {
  id: number,
  caption: string,
  image_url: string,
  author: string,
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

  // --- STYLE BARU UNTUK KOMENTAR ---
  commentsSection: {
    marginTop: '15px',
  },
  commentsTitle: {
    fontSize: '16px',
    borderBottom: '1px solid #eee',
    paddingBottom: '5px',
    marginBottom: '10px',
    color: '#333',
    margin: '0 0 10px 0',
  },
  commentItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px dotted #eee',
  },
  commentAuthor: {
    fontWeight: 'bold',
    fontSize: '13px',
    margin: '0 5px 0 0',
    color: '#555',
    flexShrink: 0, // Agar nama penulis tidak menyusut
  },
  commentBody: {
    fontSize: '13px',
    margin: 0,
    flexGrow: 1, // Agar isi komentar mengisi ruang
  },
  deleteButton: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    marginLeft: '10px',
    padding: '0 5px',
    outline: 'none',
    flexShrink: 0, // Agar tombol tidak menyusut
  },
  // --- STYLE BARU UNTUK INPUT DAN SUBMIT ---
  newCommentForm: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 0',
  },
  commentInput: {
    flexGrow: 1, // Memungkinkan input mengisi ruang
    padding: '10px',
    marginRight: '10px',
    borderRadius: '20px',
    border: '1px solid #ccc',
    fontSize: '14px',
    outline: 'none',
  },
  submitButton: {
    backgroundColor: '#3498db', // Warna biru cerah
    color: 'white',
    border: 'none',
    borderRadius: '50%', // Bentuk bulat
    width: '38px',
    height: '38px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  submitButtonHover: {
    // Anda bisa tambahkan ini untuk efek hover jika menggunakan CSS Modules atau state
    // 'backgroundColor': '#2980b9'
  },
};

export default function Content(props: ContentProps) {
  const navigate = useNavigate();

  const initialLikes = props.data?.likes?.length ?? 0;
  const [likeCount, setLikeCount] = useState<number>(initialLikes);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [newCommentText, setNewCommentText] = useState('');
  const { currentUser } = useAuthStore();

  // hooks
  const {
    mutate: mutateLike,
  } = useAddLike();
  const {
    mutate: mutateComment,
  } = useAddComment();
  const {
    mutate: mutateRemoveComment,
  } = useRemoveComment();

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

  const handleDeleteComment = (commentId: number) => {
    mutateRemoveComment({
      id: commentId,
    });
  };

  // FUNGSI UNTUK SUBMIT KOMENTAR BARU
  const handleCommentSubmit = () => {
    if (newCommentText.trim() === '') {
      alert('Komentar tidak boleh kosong!');
      return;
    }
    mutateComment({
      post_id: props.data.id,
      user_id: currentUser?.id || 0,
      content: newCommentText,
    });

    setNewCommentText('');
  };

  useEffect(() => {
    setIsLiked(props.data?.likes?.map((like: any) => {
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
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            {props.author}
          </p>

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
                <p style={styles.text}>Posted By: {props.data.user.name}</p>
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
                  <p style={styles.text}>{props.data.comments.length} Comments</p>
                </div>
              </div>

              <div style={styles.divider}></div>

              <div style={styles.newCommentForm}>
                <input
                  type="text"
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Tulis komentar Anda..."
                  style={styles.commentInput}
                />
                <button
                  onClick={handleCommentSubmit}
                  style={styles.submitButton}
                >
                  <FaPaperPlane size={16} />
                </button>
              </div>

              <div style={styles.divider}></div>

              <div style={styles.commentsSection}>
                <h4 style={styles.commentsTitle}>Komentar ({props.data.comments.length})</h4>

                {/* Mapping setiap komentar dari props */}
                {props.data.comments.map((comment: any) => (
                  <div key={comment.id} style={styles.commentItem}>

                    {/* Isi Komentar */}
                    <p style={styles.commentAuthor}>
                      {comment.user.name}:
                    </p>
                    <p style={styles.commentBody}>
                      {comment.content}
                    </p>

                    {/* Tombol Hapus */}
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      style={styles.deleteButton}
                      title="Hapus Komentar"
                    >
                      <FaTrash size={14} color="#e74c3c" />
                    </button>
                  </div>
                ))}

                {props.data.comments.length === 0 && (
                  <p style={{ fontSize: '12px', color: '#777' }}>Belum ada komentar.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}