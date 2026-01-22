import { ReactNode, HTMLAttributes } from 'react';
import { classNames } from 'primereact/utils';

export interface GridProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  colsSm?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  colsMd?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  colsLg?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  colsXl?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16;
  gapX?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16;
  gapY?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16;
  autoRows?: 'auto' | 'min' | 'max' | 'fr';
  autoCols?: 'auto' | 'min' | 'max' | 'fr';
  flow?: 'row' | 'col' | 'dense' | 'row-dense' | 'col-dense';
  className?: string;
}

export interface GridItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  children: ReactNode;
  colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'full';
  colSpanSm?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'full';
  colSpanMd?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'full';
  colSpanLg?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'full';
  colSpanXl?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'full';
  rowSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 'full';
  colStart?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 'auto';
  colEnd?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 'auto';
  rowStart?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 'auto';
  rowEnd?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 'auto';
  className?: string;
}

/**
 * Grid - Sistema de grid layout com responsividade completa
 */
export function Grid({
  children,
  cols = 1,
  colsSm,
  colsMd,
  colsLg,
  colsXl,
  gap = 4,
  gapX,
  gapY,
  autoRows,
  autoCols,
  flow,
  className,
  ...props
}: GridProps) {
  const colsMap = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    7: 'grid-cols-7',
    8: 'grid-cols-8',
    9: 'grid-cols-9',
    10: 'grid-cols-10',
    11: 'grid-cols-11',
    12: 'grid-cols-12',
  };

  const gapMap = {
    0: 'gap-0',
    1: 'gap-1',
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    5: 'gap-5',
    6: 'gap-6',
    8: 'gap-8',
    10: 'gap-10',
    12: 'gap-12',
    16: 'gap-16',
  };

  const gapXMap = {
    0: 'gap-x-0',
    1: 'gap-x-1',
    2: 'gap-x-2',
    3: 'gap-x-3',
    4: 'gap-x-4',
    5: 'gap-x-5',
    6: 'gap-x-6',
    8: 'gap-x-8',
    10: 'gap-x-10',
    12: 'gap-x-12',
    16: 'gap-x-16',
  };

  const gapYMap = {
    0: 'gap-y-0',
    1: 'gap-y-1',
    2: 'gap-y-2',
    3: 'gap-y-3',
    4: 'gap-y-4',
    5: 'gap-y-5',
    6: 'gap-y-6',
    8: 'gap-y-8',
    10: 'gap-y-10',
    12: 'gap-y-12',
    16: 'gap-y-16',
  };

  const autoRowsMap = {
    auto: 'auto-rows-auto',
    min: 'auto-rows-min',
    max: 'auto-rows-max',
    fr: 'auto-rows-fr',
  };

  const autoColsMap = {
    auto: 'auto-cols-auto',
    min: 'auto-cols-min',
    max: 'auto-cols-max',
    fr: 'auto-cols-fr',
  };

  const flowMap = {
    row: 'grid-flow-row',
    col: 'grid-flow-col',
    dense: 'grid-flow-dense',
    'row-dense': 'grid-flow-row-dense',
    'col-dense': 'grid-flow-col-dense',
  };

  return (
    <div
      className={classNames(
        'grid',
        colsMap[cols],
        colsSm && `sm:${colsMap[colsSm]}`,
        colsMd && `md:${colsMap[colsMd]}`,
        colsLg && `lg:${colsMap[colsLg]}`,
        colsXl && `xl:${colsMap[colsXl]}`,
        gapX ? gapXMap[gapX] : gapMap[gap],
        gapY && gapYMap[gapY],
        autoRows && autoRowsMap[autoRows],
        autoCols && autoColsMap[autoCols],
        flow && flowMap[flow],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * GridItem - Item de grid com controle de span e posicionamento
 */
export function GridItem({
  children,
  colSpan,
  colSpanSm,
  colSpanMd,
  colSpanLg,
  colSpanXl,
  rowSpan,
  colStart,
  colEnd,
  rowStart,
  rowEnd,
  className,
  ...props
}: GridItemProps) {
  const colSpanMap = {
    1: 'col-span-1',
    2: 'col-span-2',
    3: 'col-span-3',
    4: 'col-span-4',
    5: 'col-span-5',
    6: 'col-span-6',
    7: 'col-span-7',
    8: 'col-span-8',
    9: 'col-span-9',
    10: 'col-span-10',
    11: 'col-span-11',
    12: 'col-span-12',
    full: 'col-span-full',
  };

  const rowSpanMap = {
    1: 'row-span-1',
    2: 'row-span-2',
    3: 'row-span-3',
    4: 'row-span-4',
    5: 'row-span-5',
    6: 'row-span-6',
    full: 'row-span-full',
  };

  const colStartMap = {
    1: 'col-start-1',
    2: 'col-start-2',
    3: 'col-start-3',
    4: 'col-start-4',
    5: 'col-start-5',
    6: 'col-start-6',
    7: 'col-start-7',
    8: 'col-start-8',
    9: 'col-start-9',
    10: 'col-start-10',
    11: 'col-start-11',
    12: 'col-start-12',
    13: 'col-start-13',
    auto: 'col-start-auto',
  };

  const colEndMap = {
    1: 'col-end-1',
    2: 'col-end-2',
    3: 'col-end-3',
    4: 'col-end-4',
    5: 'col-end-5',
    6: 'col-end-6',
    7: 'col-end-7',
    8: 'col-end-8',
    9: 'col-end-9',
    10: 'col-end-10',
    11: 'col-end-11',
    12: 'col-end-12',
    13: 'col-end-13',
    auto: 'col-end-auto',
  };

  const rowStartMap = {
    1: 'row-start-1',
    2: 'row-start-2',
    3: 'row-start-3',
    4: 'row-start-4',
    5: 'row-start-5',
    6: 'row-start-6',
    7: 'row-start-7',
    auto: 'row-start-auto',
  };

  const rowEndMap = {
    1: 'row-end-1',
    2: 'row-end-2',
    3: 'row-end-3',
    4: 'row-end-4',
    5: 'row-end-5',
    6: 'row-end-6',
    7: 'row-end-7',
    auto: 'row-end-auto',
  };

  return (
    <div
      className={classNames(
        colSpan && colSpanMap[colSpan],
        colSpanSm && `sm:${colSpanMap[colSpanSm]}`,
        colSpanMd && `md:${colSpanMap[colSpanMd]}`,
        colSpanLg && `lg:${colSpanMap[colSpanLg]}`,
        colSpanXl && `xl:${colSpanMap[colSpanXl]}`,
        rowSpan && rowSpanMap[rowSpan],
        colStart && colStartMap[colStart],
        colEnd && colEndMap[colEnd],
        rowStart && rowStartMap[rowStart],
        rowEnd && rowEndMap[rowEnd],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
