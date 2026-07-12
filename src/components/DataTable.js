import React, { useMemo, useState } from "react";
import { HiOutlineSearch, HiChevronLeft, HiChevronRight } from "react-icons/hi";

const DataTable = ({
  columns,
  data,
  searchPlaceholder = "Search records",
  emptyMessage = "No records found.",
}) => {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState({ key: "", direction: "asc" });
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const rows = useMemo(() => {
    const term = query.toLowerCase();
    let result = data.filter(
      (row) =>
        !term ||
        columns.some((col) =>
          String(
            col.searchValue
              ? col.searchValue(row)
              : (typeof col.selector === "function"
                  ? col.selector(row)
                  : row[col.key]) || "",
          )
            .toLowerCase()
            .includes(term),
        ),
    );
    if (sort.key) {
      const col = columns.find((c) => c.key === sort.key);
      result = [...result].sort(
        (a, b) =>
          String(
            col.selector ? col.selector(a) : a[col.key] || "",
          ).localeCompare(
            String(col.selector ? col.selector(b) : b[col.key] || ""),
            undefined,
            { numeric: true },
          ) * (sort.direction === "asc" ? 1 : -1),
      );
    }
    return result;
  }, [data, columns, query, sort]);
  const pages = Math.max(1, Math.ceil(rows.length / perPage));
  const visible = rows.slice(
    (Math.min(page, pages) - 1) * perPage,
    Math.min(page, pages) * perPage,
  );
  const sortBy = (key) => {
    if (!key) return;
    setSort((s) => ({
      key,
      direction: s.key === key && s.direction === "asc" ? "desc" : "asc",
    }));
  };
  return (
    <div>
      <div className="p-5 border-b flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative">
          <HiOutlineSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            className="border rounded-lg pl-10 pr-4 py-2.5 w-full sm:w-72"
            placeholder={searchPlaceholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <select
          className="border rounded-lg px-3 py-2"
          value={perPage}
          onChange={(e) => {
            setPerPage(Number(e.target.value));
            setPage(1);
          }}
        >
          <option value="10">10 rows</option>
          <option value="25">25 rows</option>
          <option value="50">50 rows</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-gray-400 bg-gray-50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false && sortBy(col.key)}
                  className={`px-5 py-4 font-medium whitespace-nowrap ${col.sortable === false ? "" : "cursor-pointer hover:text-gray-700"}`}
                >
                  {col.name}
                  {sort.key === col.key &&
                    (sort.direction === "asc" ? " ↑" : " ↓")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((row, index) => (
              <tr
                key={row.id || index}
                className="border-t hover:bg-gray-50/70"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-5 py-4">
                    {col.cell
                      ? col.cell(row)
                      : col.selector
                        ? col.selector(row)
                        : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
            {!visible.length && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-12 text-center text-gray-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t flex items-center justify-between text-sm text-gray-500">
        <span>
          {rows.length
            ? `${(page - 1) * perPage + 1}–${Math.min(page * perPage, rows.length)} of ${rows.length}`
            : "0 records"}
        </span>
        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="border rounded p-2 disabled:opacity-30"
          >
            <HiChevronLeft />
          </button>
          <span>
            Page {Math.min(page, pages)} of {pages}
          </span>
          <button
            disabled={page >= pages}
            onClick={() => setPage((p) => p + 1)}
            className="border rounded p-2 disabled:opacity-30"
          >
            <HiChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};
export default DataTable;
