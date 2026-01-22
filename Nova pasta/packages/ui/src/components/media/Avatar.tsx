import { Avatar as PrimeAvatar, AvatarProps as PrimeAvatarProps } from 'primereact/avatar';
import { classNames } from 'primereact/utils';

export interface AvatarProps extends PrimeAvatarProps {
  label?: string;
  icon?: string;
  image?: string;
  size?: 'normal' | 'large' | 'xlarge';
  shape?: 'square' | 'circle';
  className?: string;
}

/**
 * Avatar - Avatar de usuário (PrimeReact)
 * Use para exibir avatares de usuário com imagem, ícone ou iniciais
 */
export function Avatar({
  label,
  icon,
  image,
  size = 'normal',
  shape = 'circle',
  className,
  ...props
}: AvatarProps) {
  return (
    <PrimeAvatar
      label={label}
      icon={icon}
      image={image}
      size={size}
      shape={shape}
      className={classNames('avatar-wrapper', className)}
      {...props}
    />
  );
}
