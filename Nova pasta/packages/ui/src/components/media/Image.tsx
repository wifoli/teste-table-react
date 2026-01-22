import { Image as PrimeImage, ImageProps as PrimeImageProps } from 'primereact/image';
import { classNames } from 'primereact/utils';

export interface ImageProps extends PrimeImageProps {
  src: string;
  alt?: string;
  width?: string;
  height?: string;
  preview?: boolean;
  imageClassName?: string;
  className?: string;
}

/**
 * Image - Imagem com preview
 * Use para exibir imagens com opção de preview em tela cheia
 */
export function Image({
  src,
  alt,
  width,
  height,
  preview = false,
  imageClassName,
  className,
  ...props
}: ImageProps) {
  return (
    <PrimeImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      preview={preview}
      imageClassName={classNames(imageClassName)}
      className={classNames('image-wrapper', className)}
      {...props}
    />
  );
}
