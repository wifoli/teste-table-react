import { ConfirmPopup as PrimeConfirmPopup, ConfirmPopupProps as PrimeConfirmPopupProps, confirmPopup } from 'primereact/confirmpopup';

export interface ConfirmPopupProps extends PrimeConfirmPopupProps {
}

/**
 * ConfirmPopup - Popup de confirmação
 * Use para confirmações próximas ao elemento clicado
 * 
 * @example
 * // No root do app:
 * <ConfirmPopup />
 * 
 * // Para usar:
 * import { confirmPopup } from '@front-engine/ui';
 * 
 * const confirm = (event) => {
 *   confirmPopup({
 *     target: event.currentTarget,
 *     message: 'Are you sure you want to proceed?',
 *     icon: 'pi pi-exclamation-triangle',
 *     accept: () => handleDelete()
 *   });
 * };
 * 
 * <Button onClick={confirm} label="Delete" />
 */
export function ConfirmPopup(props: ConfirmPopupProps) {
  return <PrimeConfirmPopup {...props} />;
}

// Re-export confirmPopup service
export { confirmPopup };
