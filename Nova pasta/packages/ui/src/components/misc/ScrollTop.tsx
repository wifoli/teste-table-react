import { ScrollTop as PrimeScrollTop, ScrollTopProps as PrimeScrollTopProps } from 'primereact/scrolltop';
import { classNames } from 'primereact/utils';

export interface ScrollTopProps extends PrimeScrollTopProps {
  target?: 'window' | 'parent';
  threshold?: number;
  icon?: string;
  behavior?: 'smooth' | 'auto';
  className?: string;
}

/**
 * ScrollTop - Botão para voltar ao topo
 * Use para permitir usuário voltar ao topo da página
 * 
 * @example
 * <ScrollTop />
 * <ScrollTop threshold={100} icon="pi pi-arrow-up" />
 * <ScrollTop target="parent" />
 */
export function ScrollTop({
  target = 'window',
  threshold = 400,
  icon = 'pi pi-chevron-up',
  behavior = 'smooth',
  className,
  ...props
}: ScrollTopProps) {
  return (
    <PrimeScrollTop
      target={target}
      threshold={threshold}
      icon={icon}
      behavior={behavior}
      className={classNames('scrolltop-wrapper', className)}
      {...props}
    />
  );
}
