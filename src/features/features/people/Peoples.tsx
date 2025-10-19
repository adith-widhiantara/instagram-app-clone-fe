import CardPeople from '@/features/features/people/components/CardPeople';
import { useUsers } from '@/api/people';

export default function Peoples() {
  const {
    data: users,
  } = useUsers();

  return <>
    {users && users.content.map((user) => (
      <CardPeople name={user.name} id={user.id} />
    ))}
  </>;
}