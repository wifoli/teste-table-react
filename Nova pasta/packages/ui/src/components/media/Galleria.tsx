import { Galleria as PrimeGalleria, GalleriaProps as PrimeGalleriaProps } from 'primereact/galleria';
import { classNames } from 'primereact/utils';
import { ReactNode } from 'react';

export interface GalleriaItem {
  itemImageSrc: string;
  thumbnailImageSrc: string;
  alt?: string;
  title?: string;
  [key: string]: any;
}

export interface GalleriaProps extends Omit<PrimeGalleriaProps, 'value'> {
  value: GalleriaItem[];
  activeIndex?: number;
  onItemChange?: (e: { index: number }) => void;
  fullScreen?: boolean;
  onHide?: () => void;
  numVisible?: number;
  responsiveOptions?: any[];
  showItemNavigators?: boolean;
  showThumbnails?: boolean;
  showIndicators?: boolean;
  circular?: boolean;
  autoPlay?: boolean;
  transitionInterval?: number;
  item?: (item: GalleriaItem) => ReactNode;
  thumbnail?: (item: GalleriaItem) => ReactNode;
  className?: string;
}

/**
 * Galleria - Galeria de imagens
 * Use para exibir coleções de imagens com navegação e thumbnails
 */
export function Galleria({
  value,
  activeIndex = 0,
  onItemChange,
  fullScreen = false,
  onHide,
  numVisible = 5,
  responsiveOptions,
  showItemNavigators = true,
  showThumbnails = true,
  showIndicators = false,
  circular = false,
  autoPlay = false,
  transitionInterval = 4000,
  item,
  thumbnail,
  className,
  ...props
}: GalleriaProps) {
  const defaultItem = (item: GalleriaItem) => (
    <img src={item.itemImageSrc} alt={item.alt} style={{ width: '100%', display: 'block' }} />
  );

  const defaultThumbnail = (item: GalleriaItem) => (
    <img src={item.thumbnailImageSrc} alt={item.alt} style={{ display: 'block' }} />
  );

  return (
    <PrimeGalleria
      value={value}
      activeIndex={activeIndex}
      onItemChange={onItemChange}
      fullScreen={fullScreen}
      onHide={onHide}
      numVisible={numVisible}
      responsiveOptions={responsiveOptions}
      showItemNavigators={showItemNavigators}
      showThumbnails={showThumbnails}
      showIndicators={showIndicators}
      circular={circular}
      autoPlay={autoPlay}
      transitionInterval={transitionInterval}
      item={item || defaultItem}
      thumbnail={thumbnail || defaultThumbnail}
      className={classNames('galleria-wrapper', className)}
      {...props}
    />
  );
}
