import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-4 text-center">
      <Compass size={48} className="text-teal-600" aria-hidden />
      <h1 className="text-4xl font-extrabold">Page not found</h1>
      <p className="text-slate-600">That page doesn't exist. Head back home to try the live demo.</p>
      <Link to="/"><Button>Back to home</Button></Link>
    </main>
  );
}
