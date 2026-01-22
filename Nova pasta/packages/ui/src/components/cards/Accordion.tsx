import {
    Accordion as PrimeAccordion,
    AccordionProps as PrimeAccordionProps,
    AccordionTabProps,
    AccordionTabPassThroughMethodOptions
} from 'primereact/accordion';
import React from 'react';
import { Caption } from '../..';
import { CaretDownIcon, CaretUpIcon } from '@phosphor-icons/react';
import { classNames } from 'primereact/utils';


interface CustomAccordionTabProps extends AccordionTabProps {
    icon?: React.ReactNode;
    caption?: React.ReactNode;
}

const renderHeader = (
    header: AccordionTabProps['header']
) => {
    if (typeof header === 'function') {
        return header({} as AccordionTabProps);
    }
    return header;
};

const headerTemplate = (
    child: React.ReactElement<CustomAccordionTabProps>
) => {
    const { header, icon, caption } = child.props;

    return (
        <div className="flex flex-col gap-1 w-full">
            <div className="flex items-center gap-2">
                {icon && (
                    <span className="flex items-center text-inherit">
                        {icon}
                    </span>
                )}

                <span className="font-semibold text-inherit">
                    {renderHeader(header)}
                </span>
            </div>

            {caption && (
                <Caption className="text-xs text-muted">
                    {caption}
                </Caption>
            )}
        </div>
    );
};

const cloneAccordionTab = (
    child: React.ReactElement<CustomAccordionTabProps>,
    index: number
) =>
    React.cloneElement(child, {
        className: 'bg-transparent mb-4',
        headerTemplate: () => headerTemplate(child),
        pt: {
            root: { className: 'bg-transparent' },
            headerAction: ({ context }: AccordionTabPassThroughMethodOptions) => ({
                className: context.selected
                    ? '[&_*]:text-inherit rounded-xl gap-4 !text-turquoise bg-turquoise-faded-10'
                    : '[&_*]:text-inherit rounded-xl gap-4 !text-deep-teal bg-deep-teal-faded-10 hover:!text-turquoise hover:bg-turquoise-faded-10'
            }),
            headerIcon: { className: 'text-semibold' },
            content: { className: 'px-0 py-2' }
        },
        key: index
    });

export const Accordion = ({ className, ...props }: PrimeAccordionProps) => {
    return (
        <PrimeAccordion
            {...props}
            className={classNames(
                `
                opacity-0 -translate-x-4
                animate-card-fade-in
                `,
                className
            )}
            pt={{
                root: { className: 'overflow-hidden p-0' }
            }}
            expandIcon={<CaretDownIcon weight="bold" size={24} />}
            collapseIcon={<CaretUpIcon weight="bold" size={24} />}
        >
            {React.Children.map(
                props.children,
                (child, index) =>
                    cloneAccordionTab(
                        child as React.ReactElement<CustomAccordionTabProps>,
                        index
                    )
            )}
        </PrimeAccordion>
    );
};
