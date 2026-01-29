'use client';
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMenuData } from '@/services/menuService';
import { checkBusinessStatus } from '@/utils/dateUtils';
import Header from '@/components/ui/Header';
import ComboSlider from '@/components/menu/ComboSlider';
import StatusBanner from '@/components/ui/StatusBanner';
import ProductList from '@/components/menu/ProductList';
import ProductModal from '@/components/menu/ProductModal';
import Navbar from '@/components/ui/Navbar';
import FloatingCart from '@/components/ui/FloatingCart';
import { Loader2 } from 'lucide-react';

export default function MenuPage() {
  const [filter, setFilter] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['menuData'],
    queryFn: fetchMenuData,
    staleTime: 1000 * 60 * 5,
  });

  const isOpen = useMemo(() => {
    return data ? checkBusinessStatus(data.schedules) : false;
  }, [data]);

  if (isLoading) return (
    /* Uso de bg-white mantenido como fondo neutro base */
    <div className="min-h-screen flex items-center justify-center bg-(--color-background)">
      {/* El spinner ahora usa el color primario (Azul) */}
      <Loader2 className="animate-spin text-(--color-primary)" size={40} />
    </div>
  );

  if (isError) return (
    <div className="p-10 text-center font-bold text-(--color-accent)">
      Error al conectar con la base de datos.
    </div>
  );

  const { categories, products, combos } = data! ;

  return (
    /* Fondo principal usando nuestra variable de background */
    <div className="min-h-screen bg-(--color-background) text-(--color-primary-dark) font-sans pb-48">
      <Header isOpen={isOpen} categories={categories} filter={filter} setFilter={setFilter} />
      <ComboSlider combos={combos} filter={filter} isOpen={isOpen} />

      <main className="px-6 py-6">
        <StatusBanner isOpen={isOpen} />
        <ProductList 
          categories={categories}
          products={products}
          filter={filter}
          isOpen={isOpen}
          onOpenModal={(prod: any) => setSelectedProduct(prod)}
        />
      </main>

      <Navbar />
      <FloatingCart isOpenBusiness={isOpen} />

      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </div>
  );
}