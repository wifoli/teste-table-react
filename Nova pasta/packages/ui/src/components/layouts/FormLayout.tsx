import { ReactNode, HTMLAttributes } from 'react';
import { classNames } from 'primereact/utils';

export interface FormLayoutProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
  responsive?: boolean;
  className?: string;
}

export interface FormRowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  children: ReactNode;
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
  align?: 'start' | 'center' | 'end' | 'stretch';
  className?: string;
}

export interface FormColProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  children: ReactNode;
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  spanSm?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  spanMd?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  spanLg?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  spanXl?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  offset?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
  className?: string;
}

/**
 * FormLayout - Container principal com grid automático
 */
export function FormLayout({
  children,
  columns = 12,
  gap = 4,
  responsive = true,
  className,
  ...props
}: FormLayoutProps) {
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
  };

  const columnsMap = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    6: 'grid-cols-6',
    12: 'grid-cols-12',
  };

  return (
    <div
      className={classNames(
        'grid',
        columnsMap[columns],
        gapMap[gap],
        responsive && 'sm:grid-cols-12',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}


export function FormRow({
  children,
  gap = 4,
  align,
  className,
  ...props
}: FormRowProps) {
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
  };

  const alignMap = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  return (
    <div
      className={classNames(
        'grid grid-cols-12',
        gapMap[gap],
        align && alignMap[align],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * FormCol - Coluna responsiva com span
 */
export function FormCol({
  children,
  span = 12,
  spanSm,
  spanMd,
  spanLg,
  spanXl,
  offset,
  className,
  ...props
}: FormColProps) {
  const spanMap = {
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
  };

  const offsetMap = {
    0: '',
    1: 'col-start-2',
    2: 'col-start-3',
    3: 'col-start-4',
    4: 'col-start-5',
    5: 'col-start-6',
    6: 'col-start-7',
    7: 'col-start-8',
    8: 'col-start-9',
    9: 'col-start-10',
    10: 'col-start-11',
    11: 'col-start-12',
  };

  return (
    <div
      className={classNames(
        spanMap[span],
        spanSm && `sm:${spanMap[spanSm]}`,
        spanMd && `md:${spanMap[spanMd]}`,
        spanLg && `lg:${spanMap[spanLg]}`,
        spanXl && `xl:${spanMap[spanXl]}`,
        offset && offsetMap[offset],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}


/**
 * FormActions - Container para ações do formulário (botões)
 */
export interface FormActionsProps {
  children: ReactNode;
  align?: 'left' | 'center' | 'right' | 'between';
  sticky?: boolean;
  className?: string;
}

export function FormActions({
  children,
  align = 'right',
  sticky = false,
  className,
}: FormActionsProps) {
  const alignMap = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between',
  };

  return (
    <div
      className={classNames(
        'flex items-center gap-3 pt-6 mt-6 border-t border-gray-200',
        alignMap[align],
        {
          'sticky bottom-0 bg-white shadow-lg -mx-6 px-6 -mb-6 pb-6': sticky,
        },
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * FormGroup - Agrupa múltiplos campos relacionados
 */
export interface FormGroupProps {
  children: ReactNode;
  label?: string;
  description?: string;
  className?: string;
}

export function FormGroup({
  children,
  label,
  description,
  className,
}: FormGroupProps) {
  return (
    <fieldset className={classNames('space-y-3', className)}>
      {(label || description) && (
        <legend className="space-y-1">
          {label && <div className="text-sm font-medium text-gray-700">{label}</div>}
          {description && <div className="text-sm text-gray-600">{description}</div>}
        </legend>
      )}
      <div className="space-y-3">{children}</div>
    </fieldset>
  );
}
