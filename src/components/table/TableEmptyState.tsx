export default function TableEmptyState({ colSpan }: { colSpan: number }) {
  return (
    <tr>
      <td colSpan={colSpan} className="p-3 text-center text-gray-400">
        No records found
      </td>
    </tr>
  );
}
