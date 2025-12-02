export default function EmptyStateRow({
  colSpan,
  description,
}: {
  colSpan: number;
  description: string;
}) {
  return (
    <tr>
      <td colSpan={colSpan} className="py-10">
        <div className="flex flex-col items-center justify-center text-gray-500">
          <span className="text-sm">{description}</span>
        </div>
      </td>
    </tr>
  );
}
