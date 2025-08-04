import SectorsOverview from '../../../components/frontend/SectorsOverview';
import Header from '../../../components/frontend/Header';
import Footer from '../../../components/frontend/Footer';

export default function SectorsDemoPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <SectorsOverview />
      </main>
      <Footer />
    </div>
  );
} 