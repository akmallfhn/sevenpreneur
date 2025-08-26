"use client";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface AppNumberPaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function AppNumberPagination({
  currentPage,
  totalPages,
}: AppNumberPaginationProps) {
  // React Hook
  const router = useRouter();
  const searchParams = useSearchParams();

  // Setter halaman
  const handlePageChange = (newPage: any) => {
    if (newPage === currentPage || newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage);
    router.push(`?${params.toString()}`, { scroll: true });
    router.refresh();
  };

  // Fungsi untuk Menentukan Nomor Halaman yang Ditampilkan
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    // Selalu menampilkan halaman pertama.
    pages.push(1);

    // Menentukan rentang halaman yang akan ditampilkan di sekitar halaman aktif.
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    // Jika halaman aktif mendekati awal, sesuaikan rentang halaman.
    if (currentPage <= 3) {
      endPage = Math.min(maxVisiblePages, totalPages - 1);
    }

    // Jika halaman aktif mendekati akhir, sesuaikan rentang halaman.
    if (currentPage >= totalPages - 2) {
      startPage = Math.max(2, totalPages - maxVisiblePages + 1);
    }

    // Menambahkan celah antara halaman pertama dan rentang halaman yang ditampilkan
    if (startPage > 2) {
      pages.push("ellipsis-start");
    }

    // Menambahkan nomor halaman yang berada di antara rentang startPage dan endPage
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Menambahkan celah antara halaman terakhir dan rentang halaman yang ditampilkan
    if (endPage < totalPages - 1) {
      pages.push("ellipsis-end");
    }

    // Selalu menampilkan halaman terakhir jika total halaman lebih dari 1
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous */}
        <PaginationItem>
          <PaginationPrevious
            onClick={() => handlePageChange(currentPage - 1)}
            className={
              currentPage <= 1
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer"
            }
            aria-disabled={currentPage <= 1}
          />
        </PaginationItem>

        {/* Number Pagination */}
        {getPageNumbers().map((page, index) =>
          page === "ellipsis-start" || page === "ellipsis-end" ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={`page-${page}`}>
              <PaginationLink
                isActive={currentPage === page}
                onClick={() => handlePageChange(page)}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        {/* Next */}
        <PaginationItem>
          <PaginationNext
            onClick={() => handlePageChange(currentPage + 1)}
            className={
              currentPage >= totalPages
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer"
            }
            aria-disabled={currentPage >= totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
