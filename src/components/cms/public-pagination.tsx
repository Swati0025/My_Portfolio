import Link from "next/link";

export function PublicPagination({ page, totalPages }: { page: number; totalPages: number }) {
  if (totalPages <= 1) return null;
  const previousPage = page - 1;
  const nextPage = page + 1;

  return (
    <nav aria-label="Pagination" className="public-pagination">
      {previousPage >= 1 ? <Link href={`?page=${previousPage}`}>← Previous</Link> : <span aria-disabled="true">← Previous</span>}
      <span aria-current="page">Page {page} of {totalPages}</span>
      {nextPage <= totalPages ? <Link href={`?page=${nextPage}`}>Next →</Link> : <span aria-disabled="true">Next →</span>}
    </nav>
  );
}