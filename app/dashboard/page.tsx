import { PendingSongs } from "./components/pending-component";
import { QueueSongs } from "./components/queue-component";

export default function Dashboard() {
  return (
    <div className="m-6 flex flex-col h-full">
      <h1 className="text-4xl font-bold text-center sm:text-left mb-8">
        Dashboard
      </h1>
      <div className="flex flex-row w-full justify-center items-start h-full gap-10">
        <PendingSongs className="flex flex-col"/>
        <hr className="xl:flex border-r-2 border-gray h-full hidden" />
        <QueueSongs className="hidden xl:flex flex-col" />
      </div>
    </div>
  );
}
