import { Button } from "@/components/ui/button";

interface SongItemProps {
  id: string;
  title: string;
  artists: string;
  handleSubmit: (id: string) => void;
  status: string | undefined;
}

export function SongItem({
  id,
  title,
  artists,
  handleSubmit,
  status,
}: SongItemProps) {
  return (
    <li
      key={id}
      className="flex flex-row items-center px-5 h-[100px] w-[300px] rounded-xl my-4 border hover:border-black justify-between"
    >
      <div className="flex flex-col pr-4">
        <p className="font-bold text-sm">{title}</p>
        <p className="text-gray-500 text-sm">{artists}</p>
      </div>
      {status === "unknown" ? (
        <Button onClick={() => handleSubmit(id)}>Submit</Button>
      ) : status === "pending" ? (
        <Button disabled>Pending</Button>
      ) : status === "queued" ? (
        <Button disabled>Queued</Button>
      ) : status === "rejected" ? (
        <Button disabled>Rejected</Button>
      ) : status === "passed" && (
        <Button disabled>Passed</Button>
      )}
    </li>
  );
}
