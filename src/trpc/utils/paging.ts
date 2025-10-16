export function calculatePage(
  input: { page?: number; page_size?: number },
  aggregation: { _count: number }
) {
  let pageSize: number | undefined;
  let totalPage: number | undefined;
  let currentPage: number | undefined;
  let prismaSkip: number | undefined;

  if (input.page_size) {
    pageSize = input.page_size || 1;
    totalPage = Math.ceil(aggregation._count / pageSize);
    currentPage = Math.max(input.page || 1, 1);
    prismaSkip = (currentPage - 1) * pageSize;
  }

  return {
    prisma: {
      skip: prismaSkip,
      take: pageSize,
    },
    metapaging: {
      total_data: aggregation._count,
      total_page: totalPage,
      current_page: currentPage,
      page_size: pageSize,
    },
  };
}
