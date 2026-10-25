import { Compass } from 'lucide-react';
import { EmptyState } from '@/components/editorial';
import { useSeo } from '@/hooks/use-seo';

export default function NotFound() {
  useSeo('الصفحة غير موجودة', 'الصفحة التي تبحثين عنها غير موجودة في لمسة شياكة.');
  return (
    <div className="px-5 py-24">
      <EmptyState
        testId="status-not-found"
        icon={<Compass className="h-7 w-7" strokeWidth={1.3} />}
        title="هذه الصفحة غير موجودة"
        body="ربما تغيّر الرابط أو كُتب بشكل غير صحيح."
        actions={[
          { href: '/', label: 'الرئيسية', primary: true },
          { href: '/shop', label: 'المتجر' },
        ]}
      />
    </div>
  );
}
