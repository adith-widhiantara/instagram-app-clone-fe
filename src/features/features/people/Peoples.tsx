import CardPeople from '@/features/features/people/components/CardPeople';
import { useUsers } from '@/api/people';
import { useAuthStore } from '@/stores/auth.store';

export default function Peoples() {
  const {
    data: users,
  } = useUsers();
  const {
    currentUser,
  } = useAuthStore();

  return <>
    {users && users.content.map((user) => (
      <CardPeople
        name={user.name}
        id={user.id}
        is_followed={user.followers.map((follow) => {
          return follow.id;
        }).includes(currentUser?.id || 0)}
      />
    ))}
  </>;
}