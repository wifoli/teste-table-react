import { ScrollPanel as PrimeScrollPanel, ScrollPanelProps as PrimeScrollPanelProps } from 'primereact/scrollpanel';
import { classNames } from "primereact/utils";

export interface ScrollPanelProps extends PrimeScrollPanelProps {}

export const ScrollPanel = ({ className, ...props }: PrimeScrollPanelProps) => {
    return (
        <PrimeScrollPanel
            {...props}
            className={classNames(
                "bg-white rounded-2xl card-shadow border-[0.5px] text-input-color p-6",
                className,
            )}
            pt={{
                barY: {
                    className: "bg-turquoise-faded-50 rounded-full w-2.5"
                }
            }}
        />
    );
};
