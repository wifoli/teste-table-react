import { Carousel as PrimeCarousel, CarouselProps as PrimeCarouselProps } from 'primereact/carousel';
import { classNames } from 'primereact/utils';
import { ReactNode } from 'react';

export interface CarouselProps<T = any> extends Omit<PrimeCarouselProps, 'value'> {
  value: T[];
  itemTemplate: (item: T) => ReactNode;
  numVisible?: number;
  numScroll?: number;
  responsiveOptions?: any[];
  orientation?: 'horizontal' | 'vertical';
  verticalViewPortHeight?: string;
  autoplayInterval?: number;
  circular?: boolean;
  showNavigators?: boolean;
  showIndicators?: boolean;
  className?: string;
}

/**
 * Carousel - Carrossel de itens
 * Use para exibir itens em carrossel (produtos, imagens, etc)
 */
export function Carousel<T = any>({
  value,
  itemTemplate,
  numVisible = 1,
  numScroll = 1,
  responsiveOptions,
  orientation = 'horizontal',
  verticalViewPortHeight = '360px',
  autoplayInterval = 0,
  circular = false,
  showNavigators = true,
  showIndicators = true,
  className,
  ...props
}: CarouselProps<T>) {
  return (
    <PrimeCarousel
      value={value}
      itemTemplate={itemTemplate}
      numVisible={numVisible}
      numScroll={numScroll}
      responsiveOptions={responsiveOptions}
      orientation={orientation}
      verticalViewPortHeight={verticalViewPortHeight}
      autoplayInterval={autoplayInterval}
      circular={circular}
      showNavigators={showNavigators}
      showIndicators={showIndicators}
      className={classNames('carousel-wrapper', className)}
      {...props}
    />
  );
}
