import React from 'react';
import { classNames } from 'primereact/utils';
import { useEffect, useState } from 'react';


type ButtonLikeProps = {
    className?: string;
    size?: 'small' | 'medium' | 'large' | string;
};


interface ButtonGroupProps {
    children: React.ReactNode;
    className?: string;
}


const SMALL_RESOLUTION_QUERY = '(max-width: 1600px) and (max-height: 900px)';

const useIsSmallResolution = () => {
    const [isSmall, setIsSmall] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia(SMALL_RESOLUTION_QUERY);

        const handleChange = () => {
            setIsSmall(mediaQuery.matches);
        };

        handleChange();
        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, []);

    return isSmall;
};


export const ButtonGroup = ({ children, className }: ButtonGroupProps) => {
    const items = React.Children.toArray(children);
    const isSmallResolution = useIsSmallResolution();

    return (
        <div
            className={classNames(
                'inline-flex rounded-lg overflow-visible',
                className
            )}
        >
            {items.map((child, index) => {
                if (!React.isValidElement<ButtonLikeProps>(child)) {
                    return child;
                }

                const isFirst = index === 0;
                const isLast = index === items.length - 1;

                return React.cloneElement<ButtonLikeProps>(child, {
                    size: child.props.size ?? (isSmallResolution ? 'small' : undefined),
                    className: classNames(
                        child.props.className,
                        '!rounded-none',
                        isFirst && '!rounded-l-lg',
                        isLast && '!rounded-r-lg'
                    ),
                });
            })}
        </div>
    );
};