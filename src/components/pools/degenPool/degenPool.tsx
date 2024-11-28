import React, { useState, useEffect } from "react";
import { poolsFilterList, classicHeader } from "./config";
import styles from "./degenPool.module.css";
import { DownArrow, UpArrow, DownArrowSelect } from "../icon";
import StablePoolRow from "../stablePoolRow/poolRow";
import Pagination from "@/components/pagination/pagination";
import { usePoolSearch } from "@/hooks/usePools";
import PoolDocTips from "@/components/pools/poolDocTips/index";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import NoContent from "@/components/common/NoContent";
import { getAllTokenPrices } from "@/services/farm";

export default function Classic({
  searchValue,
  pureIdList,
  mobilePros,
}: {
  searchValue: string;
  pureIdList: any;
  mobilePros: any;
}) {
  const [isActive, setActive] = useState("");
  const [sortMap, setSortMap] = useState({ key: "tvl", sort: "desc" });
  const [isChecked, setIsChecked] = useState(false);
  const [tokenPriceList, setTokenPriceList] = useState({});
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);

  const handlePageChange = (newPage: number, newSize: number) => {
    setCurrentPage(newPage);
    !isLoading &&
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
  };
  const handleSizeChange = (newSize: number) => {
    setPageSize(newSize);
  };
  // pagination end

  const handleCheckboxChange = (event: any) => {
    setIsChecked(event.target.checked);
  };
  const [toFirst, setToFirst] = useState(false);
  const handleSort = (key: string) => {
    if (key === sortMap.key) {
      setSortMap((prevSortMap) => ({
        key: prevSortMap.key,
        sort: prevSortMap.sort === "desc" ? "asc" : "desc",
      }));
    } else {
      setSortMap({ key, sort: "desc" });
    }
    setToFirst(true);
  };

  // pools filter
  const [activePools, setActivePools] = useState("");

  const { poolList, totalItems, isLoading } = usePoolSearch({
    isChecked,
    sortKey: sortMap.key,
    sortOrder: sortMap.sort,
    currentPage,
    isActive,
    searchValue: activePools || searchValue,
    poolType: "degen",
  });

  // depency change init currentpage
  useEffect(() => {
    setCurrentPage(1);
  }, [sortMap.key, sortMap.sort, isChecked, isActive, searchValue]);

  // deal with activePools
  useEffect(() => {
    setActivePools("");
  }, [searchValue]);

  useEffect(() => {
    // value change
    if (mobilePros?.which == "degenTabSortChange") {
      setSortMap(mobilePros?.sortMap);
    }

    // sort arrow change
    if (mobilePros?.which == "degenTabSortArrowChange") {
      setSortMap({ key: sortMap.key, sort: mobilePros?.sort });
    }
  }, [mobilePros]);

  useEffect(() => {
    getAllTokenPrices().then((res) => {
      setTokenPriceList(res);
    });
  }, []);
  return (
    <>
      <div className="xsm:hidden">
        <PoolDocTips
          tips="Degen pools, which can contain two or more tokens, use Curve's StableSwap algorithm combined with Oracle for real-time price updates of trading pairs, allowing the creation of StablePools with any token."
          src=""
        />
      </div>
      <div className="flex flex-col items-center  w-full lg:mt-8">
        {/*  */}
        {/* head tab & hide low tvl pools*/}

        {/* <div className="frc w-276 justify-between">
          <div className="text-xs cursor-pointer frcc"></div>
          <div className="text-white text-xs cursor-default">
            <label className={styles.customCheckbox}>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => {
                  handleCheckboxChange(event);
                  setCurrentPage(1);
                }}
              />
              <span className={styles.checkmark}></span>
              <span className={styles.checkPlaceholder}>
                Hide low TVL pools
              </span>
            </label>
          </div>
        </div> */}

        {/* pool header */}
        <header className={styles.headDiv}>
          <div className="flex items-center xsm:w-full"></div>
          <div className="xsm:hidden">
            {classicHeader.map((item, index) => {
              return item.key ? (
                <div
                  key={item.key + Math.random() + index}
                  className="frcc select-none cursor-pointer"
                  onClick={() => handleSort(item.key)}
                >
                  <span>{item.value}</span>
                  <span className="ml-2">
                    {sortMap.key === item.key ? (
                      sortMap.sort === "desc" ? (
                        <DownArrowSelect />
                      ) : (
                        <UpArrow />
                      )
                    ) : (
                      <DownArrow />
                    )}
                  </span>
                </div>
              ) : (
                <div className="frcc select-none"></div>
              );
            })}
          </div>
        </header>

        {/* pool row */}

        {/* {isLoading ? (
          <SkeletonTheme
            baseColor="rgba(33, 43, 53, 0.3)"
            highlightColor="#2A3643"
          >
            <Skeleton width={1100} height={56} count={5} className="mt-4" />
          </SkeletonTheme>
        ) : (
          <StablePoolRow
            list={poolList}
            loading={isLoading}
            pureIdList={pureIdList}
          />
        )} */}
        {poolList.length > 0 && Object.keys(tokenPriceList).length > 0 ? (
          <StablePoolRow
            list={poolList}
            loading={isLoading}
            pureIdList={pureIdList}
            tokenPriceList={tokenPriceList}
          />
        ) : (
          <NoContent />
        )}

        {/* pagination */}
        <div className="lg:w-[1104px] xsm:w-full mt-4 mb-12">
          <Pagination
            totalItems={totalItems}
            itemsPerPage={20}
            onChangePage={handlePageChange}
            onPageSizeChange={handleSizeChange}
            toFirst={toFirst}
          />
        </div>
      </div>
    </>
  );
}
