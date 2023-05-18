import { ArrowPathIcon } from '@heroicons/react/24/outline';

export default function Loading() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <ArrowPathIcon className="w-20 h-20 animate-spin" />
    </div>
  );
}
