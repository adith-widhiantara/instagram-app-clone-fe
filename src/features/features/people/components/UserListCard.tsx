import { FaMapPin, FaTrash, FaUserCheck, FaUserPlus } from 'react-icons/fa';


// --- Style ---
const styles = {
  card: {
    width: '300px',
    border: '1px solid #e0e0e0',
    borderRadius: '12px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
    padding: '15px',
    margin: '20px',
    backgroundColor: '#fff',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    borderBottom: '2px solid #3498db',
    paddingBottom: '10px',
    marginBottom: '15px',
    color: '#2c3e50',
    fontSize: '18px',
    fontWeight: '600',
  },
  headerIcon: {
    marginRight: '10px',
    color: '#3498db',
  },
  listContainer: {
    maxHeight: '400px', // Batasi tinggi untuk tampilan scroll
    overflowY: 'auto',
  },
  userItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px dashed #f0f0f0',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#3498db',
    color: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '16px',
    fontWeight: 'bold',
    marginRight: '10px',
  },
  userName: {
    margin: 0,
    fontSize: '15px',
    fontWeight: 'bold',
    color: '#333',
  },
  detailText: {
    margin: 0,
    fontSize: '11px',
    color: '#7f8c8d',
    display: 'flex',
    alignItems: 'center',
    marginTop: '2px',
  },
  actionButtonUnfollow: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    padding: '6px 10px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  actionButtonRemove: {
    backgroundColor: '#f1c40f',
    color: '#fff',
    border: 'none',
    padding: '6px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#7f8c8d',
    fontStyle: 'italic',
    padding: '20px 0',
  },
};

export default function UserListCard({ title, users, type, onAction }: any) {

  // Menentukan ikon utama berdasarkan tipe
  const HeaderIcon = type === 'followers' ? FaUserPlus : FaUserCheck;

  return (
    <div style={styles.card}>

      {/* Header Card */}
      <h3 style={styles.header}>
        <HeaderIcon size={20} style={styles.headerIcon} />
        {title} ({users.length})
      </h3>

      {/* Daftar Pengguna */}
      <div style={{
        maxHeight: '400px',
        overflowY: 'auto',
      }}>
        {users.length === 0 ? (
          <p style={{
            textAlign: 'center',
            color: '#7f8c8d',
            fontStyle: 'italic',
            padding: '20px 0',
          }}>Tidak ada pengguna dalam daftar ini.</p>
        ) : (
          users.map((user: any) => (
            <div key={user.id} style={styles.userItem}>

              {/* Info Pengguna */}
              <div style={styles.userInfo}>
                <div style={styles.avatar}>
                  {user.name[0]} {/* Inisial sebagai Avatar */}
                </div>
                <div>
                  <p style={styles.userName}>{user.name}</p>

                  {user.location && (
                    <p style={styles.detailText}>
                      <FaMapPin size={10} style={{ marginRight: '5px' }} /> {user.location}
                    </p>
                  )}
                </div>
              </div>

              {/* Tombol Aksi */}
              {type === 'followers' && (
                // Tombol "Remove" untuk Followers
                <button
                  onClick={() => onAction(user.id, 'remove')}
                  style={styles.actionButtonRemove}
                >
                  <FaTrash size={14} />
                </button>
              )}

              {type === 'following' && (
                // Tombol "Unfollow" untuk Following
                <button
                  onClick={() => onAction(user.id, 'unfollow')}
                  style={styles.actionButtonUnfollow}
                >
                  Unfollow
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}