"use client";

import React from "react";
import ReactPaginate from "react-paginate";

interface Props {
  page: number;
  totalProductCount: number;
  onPageChange: (e: { selected: number }) => void;
}

function Pagination({ page, totalProductCount, onPageChange }: Props) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <ReactPaginate
        previousLabel={
          <span className="flex items-center hover:text-gray-500 gap-2">
            Prev
          </span>
        }
        nextLabel={
          <span className="flex items-center hover:text-gray-500 gap-2">
            Next
          </span>
        }
        breakLabel={"..."}
        pageCount={Math.ceil(totalProductCount / 10)}
        marginPagesDisplayed={1}
        pageRangeDisplayed={3}
        onPageChange={onPageChange}
        forcePage={page - 1}
        containerClassName="flex items-center justify-center gap-1.5 select-none"
        pageClassName="
          min-w-[30px] h-7 
          flex items-center justify-center
          border border-gray-300 text-gray-700
          rounded-md bg-white
          hover:bg-gray-100 cursor-pointer transition text-sm
        "
        activeClassName="!bg-purple-600 !text-white !border-purple-600"
        disabledClassName="opacity-40 cursor-not-allowed"
      />
    </div>
  );
}

// ✔ props 얕은 비교로 재렌더 방지
export default React.memo(Pagination);
