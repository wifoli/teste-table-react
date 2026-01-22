import { ReactNode, HTMLAttributes } from 'react';
import { classNames } from 'primereact/utils';

export interface FlexProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  children: ReactNode;
  direction?: 'row' | 'row-reverse' | 'col' | 'col-reverse';
  wrap?: boolean | 'reverse';
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16;
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  grow?: boolean;
  shrink?: boolean;
  inline?: boolean;
  className?: string;
}

export function Flex({
  children,
  direction = 'row',
  wrap = false,
  gap = 0,
  align,
  justify,
  grow = false,
  shrink = true,
  inline = false,
  className,
  ...props
}: FlexProps) {
  const directionMap = {
    row: 'flex-row',
    'row-reverse': 'flex-row-reverse',
    col: 'flex-col',
    'col-reverse': 'flex-col-reverse',
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

  const alignMap = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline',
  };

  const justifyMap = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  const wrapClass =
    wrap === true ? 'flex-wrap' : wrap === 'reverse' ? 'flex-wrap-reverse' : '';

  return (
    <div
      className={classNames(
        inline ? 'inline-flex' : 'flex',
        directionMap[direction],
        wrapClass,
        gapMap[gap],
        align && alignMap[align],
        justify && justifyMap[justify],
        grow && 'flex-grow',
        shrink && 'flex-shrink',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * FlexItem - Item com controle de flex
 */
export interface FlexItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  children: ReactNode;
  grow?: boolean | number;
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16;
  shrink?: boolean | number;
  basis?: 'auto' | 'full' | '1/2' | '1/3' | '2/3' | '1/4' | '3/4';
  order?: number;
  className?: string;
}

export function FlexItem({
  children,
  grow,
  shrink,
  basis,
  order,
  className,
  ...props
}: FlexItemProps) {
  const basisMap = {
    auto: 'basis-auto',
    full: 'basis-full',
    '1/2': 'basis-1/2',
    '1/3': 'basis-1/3',
    '2/3': 'basis-2/3',
    '1/4': 'basis-1/4',
    '3/4': 'basis-3/4',
  };

  const getGrowClass = () => {
    if (grow === true) return 'flex-grow';
    if (grow === false) return 'flex-grow-0';
    if (typeof grow === 'number') return `flex-grow-[${grow}]`;
    return '';
  };

  const getShrinkClass = () => {
    if (shrink === true) return 'flex-shrink';
    if (shrink === false) return 'flex-shrink-0';
    if (typeof shrink === 'number') return `flex-shrink-[${shrink}]`;
    return '';
  };

  return (
    <div
      className={classNames(
        getGrowClass(),
        getShrinkClass(),
        basis && basisMap[basis],
        order && `order-${order}`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}