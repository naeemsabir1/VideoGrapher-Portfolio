import { getAllVideos } from '@/lib/videos';
import { CATEGORIES } from '@/data/categories';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

export default function AdminDashboardPage() {
  const allVideos = getAllVideos();
  const totalVideos = allVideos.length;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="font-display font-bold text-[32px] text-[var(--text-primary)] mb-3 leading-tight">
          Welcome back.<br />Manage your reel.
        </h1>
        <p className="text-[var(--text-secondary)] font-body text-[16px]">
          You currently have <strong className="text-[var(--text-primary)] font-semibold">{totalVideos}</strong> videos across <strong className="text-[var(--text-primary)] font-semibold">{CATEGORIES.length}</strong> categories.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Videos Card */}
        <Card className="rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-[var(--border-subtle)] flex flex-col hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center gap-3 pb-2 space-y-0">
            <div className="w-10 h-10 rounded-full bg-[var(--bg-base)] flex items-center justify-center text-xl shrink-0">
              📽️
            </div>
            <CardTitle className="font-display font-semibold text-lg text-[var(--text-primary)]">
              All Videos
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pb-2">
            <p className="text-[40px] font-bold text-[var(--text-primary)] leading-none mb-2">{totalVideos}</p>
            <p className="text-[14px] text-[var(--text-secondary)] font-medium">Total portfolio items</p>
          </CardContent>
          <CardFooter className="pt-4 pb-6">
            <Link 
              href="/admin/category/all"
              className="text-[14px] font-semibold text-[var(--accent-terra)] hover:text-[#A95230] transition-colors flex items-center"
            >
              Manage all →
            </Link>
          </CardFooter>
        </Card>

        {/* Category Cards */}
        {CATEGORIES.map(category => {
          const count = allVideos.filter(v => v.category === category.slug).length;
          
          return (
            <Card 
              key={category.slug} 
              className="rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-[var(--border-subtle)] flex flex-col hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-shadow duration-300"
            >
              <CardHeader className="flex flex-row items-center gap-3 pb-2 space-y-0">
                <div className="w-10 h-10 rounded-full bg-[var(--bg-base)] flex items-center justify-center text-xl shrink-0">
                  {category.emoji}
                </div>
                <CardTitle className="font-display font-semibold text-lg text-[var(--text-primary)] line-clamp-1">
                  {category.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 pb-2">
                <p className="text-[40px] font-bold text-[var(--text-primary)] leading-none mb-2">{count}</p>
                <p className="text-[14px] text-[var(--text-secondary)] font-medium">Videos</p>
              </CardContent>
              <CardFooter className="pt-4 pb-6">
                <Link 
                  href={`/admin/category/${category.slug}`}
                  className="text-[14px] font-semibold text-[var(--accent-terra)] hover:text-[#A95230] transition-colors flex items-center opacity-90 hover:opacity-100"
                >
                  Manage category →
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
