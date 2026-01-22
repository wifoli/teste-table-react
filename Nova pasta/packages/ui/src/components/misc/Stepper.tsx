import { Stepper as PrimeStepper, StepperProps as PrimeStepperProps } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { classNames } from 'primereact/utils';
import { ReactNode, forwardRef } from 'react';

export interface StepperProps extends PrimeStepperProps {
  activeStep?: number;
  onChangeStep?: (e: { index: number }) => void;
  linear?: boolean;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  children: ReactNode;
}

export type StepperRef = InstanceType<typeof PrimeStepper>

/**
 * Stepper - Componente de steps/wizard
 * Use para processos em múltiplas etapas
 * 
 * @example
 * const stepperRef = useRef(null);
 * 
 * <Stepper ref={stepperRef}>
 *   <StepperPanel header="Personal Info">
 *     <div className="flex flex-col gap-2">
 *       <InputText placeholder="Name" />
 *       <Button label="Next" onClick={() => stepperRef.current.nextCallback()} />
 *     </div>
 *   </StepperPanel>
 *   <StepperPanel header="Address">
 *     <div className="flex flex-col gap-2">
 *       <InputText placeholder="Address" />
 *       <div className="flex gap-2">
 *         <Button label="Back" onClick={() => stepperRef.current.prevCallback()} />
 *         <Button label="Next" onClick={() => stepperRef.current.nextCallback()} />
 *       </div>
 *     </div>
 *   </StepperPanel>
 *   <StepperPanel header="Confirmation">
 *     <div className="flex flex-col gap-2">
 *       <p>Confirm your details</p>
 *       <Button label="Submit" />
 *     </div>
 *   </StepperPanel>
 * </Stepper>
 */
export const Stepper = forwardRef<StepperRef, StepperProps>(
  ({ activeStep, onChangeStep, linear = false, orientation = 'horizontal', className, children, ...props }, ref) => {
    return (
      <PrimeStepper
        ref={ref}
        activeStep={activeStep}
        onChangeStep={onChangeStep}
        linear={linear}
        orientation={orientation}
        className={classNames('stepper-wrapper', className)}
        {...props}
      >
        {children}
      </PrimeStepper>
    );
  }
);

Stepper.displayName = 'Stepper';

// Re-export StepperPanel
export { StepperPanel };
