export interface PaginationInfo {
  currentPage: number;
  maxElementsPerPage: number;
  totalElements: number;
  totalPages: number;
  currentElementsCount: number;
}

export class Pagination implements PaginationInfo {
  private readonly _currentPage: number;
  private readonly _totalPages: number;
  private readonly _currentElementsCount: number;
  private readonly _maxElementsPerPage: number;
  private readonly _totalElements: number;

  public constructor(private readonly pagination: PaginationInfo) {
    this._currentPage = pagination.currentPage;
    this._totalPages = pagination.totalPages;
    this._currentElementsCount = pagination.currentElementsCount;
    this._maxElementsPerPage = pagination.maxElementsPerPage;
    this._totalElements = pagination.totalElements;
  }

  public get currentPage(): number {
    return this._currentPage;
  }
  public get totalPages(): number {
    return this._totalPages;
  }
  public get currentElementsCount(): number {
    return this._currentElementsCount;
  }
  public get maxElementsPerPage(): number {
    return this._maxElementsPerPage;
  }
  public get totalElements(): number {
    return this._totalElements;
  }
  public get currentPageFirstElementIndex(): number {
    return 1 + Math.max(this.currentPage - 1, 0) * this.maxElementsPerPage;
  }
  public get currentPageLastElementIndex(): number {
    return this.currentPageFirstElementIndex + this.currentElementsCount - 1;
  }
  public get isFirstPage(): boolean {
    return this.currentPage <= 1;
  }
  public get isLastPage(): boolean {
    return this.totalPages === this.currentPage;
  }

  public nextPage(): Pagination {
    return Pagination.evalPagination(
      this.totalElements,
      this.maxElementsPerPage,
      this.currentPage < this.totalPages
        ? this.currentPage + 1
        : this.totalPages,
    );
  }

  public previousPage(): Pagination {
    return Pagination.evalPagination(
      this.totalElements,
      this.maxElementsPerPage,
      this.currentPage > 1 ? this.currentPage - 1 : 1,
    );
  }

  public lastPage(): Pagination {
    return Pagination.evalPagination(
      this.totalElements,
      this.maxElementsPerPage,
      this.totalPages,
    );
  }

  public firstPage(): Pagination {
    return Pagination.evalPagination(
      this.totalElements,
      this.maxElementsPerPage,
      1,
    );
  }

  public setPage(page: number): Pagination {
    return Pagination.evalPagination(
      this.totalElements,
      this.maxElementsPerPage,
      Math.min(Math.max(page, 1), this.totalPages),
    );
  }

  public setTotalElements(length: number): Pagination {
    return Pagination.evalPagination(
      length,
      this.maxElementsPerPage,
      this.currentPage,
    );
  }

  public setMaxElementsPerPage(max: number): Pagination {
    return Pagination.evalPagination(this.totalElements, max, this.currentPage);
  }

  public static evalPagination(
    totalElements: number,
    elementsPerPage: number,
    currentPage = 1,
  ): Pagination {
    const totalPages = Math.ceil(totalElements / elementsPerPage);
    currentPage = Math.min(Math.max(currentPage, 1), totalPages);
    const currentElementsCount = Math.min(
      totalElements -
        (Math.min(Math.max(currentPage, 1), totalPages) - 1) * elementsPerPage,
      elementsPerPage,
    );

    return new Pagination({
      totalPages: totalPages,
      currentPage: currentPage,
      currentElementsCount: currentElementsCount,
      maxElementsPerPage: elementsPerPage,
      totalElements: totalElements,
    });
  }
}
