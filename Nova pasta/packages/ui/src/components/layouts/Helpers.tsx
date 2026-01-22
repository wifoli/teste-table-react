import { ReactNode, HTMLAttributes } from 'react';
import { classNames } from 'primereact/utils';

/**
 * Section - Seção de conteúdo com título, descrição e ações
 */
export interface SectionProps extends Omit<HTMLAttributes<HTMLElement>, 'className'> {
  children: ReactNode;
  title?: string;
  description?: string;
  actions?: ReactNode;
  divider?: boolean;
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

export function Section({
  children,
  title,
  description,
  actions,
  divider = false,
  spacing = 'md',
  className,
  ...props
}: SectionProps) {
  const spacingMap = {
    none: '',
    sm: 'space-y-2',
    md: 'space-y-4',
    lg: 'space-y-6',
  };

  return (
    <section className={classNames(spacingMap[spacing], className)} {...props}>
      {(title || description || actions) && (
        <div
          className={classNames('flex items-start justify-between gap-4', {
            'pb-4 mb-4 border-b border-gray-200': divider,
          })}
        >
          <div className="space-y-1 flex-1">
            {title && <h2 className="text-xl font-semibold text-gray-900">{title}</h2>}
            {description && <p className="text-sm text-gray-600">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

/**
 * Spacer - Espaçamento flexível ou fixo
 */
export interface SpacerProps {
  size?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24;
  axis?: 'horizontal' | 'vertical' | 'both';
  flexible?: boolean;
  className?: string;
}

export function Spacer({ size = 4, axis = 'vertical', flexible = false, className }: SpacerProps) {
  if (flexible) {
    return <div className={classNames('flex-grow', className)} />;
  }

  const sizeMap = {
    0: 'h-0 w-0',
    1: 'h-1 w-1',
    2: 'h-2 w-2',
    3: 'h-3 w-3',
    4: 'h-4 w-4',
    5: 'h-5 w-5',
    6: 'h-6 w-6',
    8: 'h-8 w-8',
    10: 'h-10 w-10',
    12: 'h-12 w-12',
    16: 'h-16 w-16',
    20: 'h-20 w-20',
    24: 'h-24 w-24',
  };

  const axisClass =
    axis === 'horizontal'
      ? sizeMap[size].split(' ')[1]
      : axis === 'vertical'
      ? sizeMap[size].split(' ')[0]
      : sizeMap[size];

  return <div className={classNames(axisClass, className)} aria-hidden="true" />;
}

/**
 * Center - Centraliza conteúdo
 */
export interface CenterProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  children: ReactNode;
  axis?: 'horizontal' | 'vertical' | 'both';
  inline?: boolean;
  className?: string;
}

export function Center({ children, axis = 'both', inline = false, className, ...props }: CenterProps) {
  const getClasses = () => {
    if (axis === 'both') {
      return 'flex items-center justify-center';
    }
    if (axis === 'horizontal') {
      return 'flex justify-center';
    }
    return 'flex items-center';
  };

  return (
    <div className={classNames(getClasses(), inline && 'inline-flex', className)} {...props}>
      {children}
    </div>
  );
}

/**
 * AspectRatio - Container com proporção fixa
 */
export interface AspectRatioProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  children: ReactNode;
  ratio?: '1/1' | '16/9' | '4/3' | '3/2' | '21/9' | number;
  className?: string;
}

export function AspectRatio({ children, ratio = '16/9', className, ...props }: AspectRatioProps) {
  const ratioMap = {
    '1/1': 'aspect-square',
    '16/9': 'aspect-video',
    '4/3': 'aspect-[4/3]',
    '3/2': 'aspect-[3/2]',
    '21/9': 'aspect-[21/9]',
  };

  const ratioClass = typeof ratio === 'string' ? ratioMap[ratio] : `aspect-[${ratio}]`;

  return (
    <div className={classNames('relative w-full', ratioClass, className)} {...props}>
      <div className="absolute inset-0">{children}</div>
    </div>
  );
}

export interface CircleRatioProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "className"> {
  children: ReactNode;
  size?: number | string;
  className?: string;
}

export function CircleRatio({
  children,
  size = "w-full aspect-square",
  className,
  ...props
}: CircleRatioProps) {
  return (
    <div
      className={classNames(
        "relative rounded-full overflow-hidden",
        size,
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

