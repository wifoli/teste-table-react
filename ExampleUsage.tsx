import { useForm } from './useForm';
import { FormField } from './FormField';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { required, email } from '@front-engine/utils-ts/validations';

// Exemplo de tipagem do formulário
interface SubItem {
    id: string;
    name: string;
    quantity: number;
}

interface MyFormData {
    title: string;
    email: string;
    items: SubItem[];
}

export function ExampleForm() {
    const form = useForm<MyFormData>({
        title: {
            initialValue: '',
            validators: [required('Título é obrigatório')],
        },
        email: {
            initialValue: '',
            validators: [required('Email é obrigatório'), email('Email inválido')],
        },
        items: {
            initialValue: [
                { id: '1', name: 'Item 1', quantity: 1 },
                { id: '2', name: 'Item 2', quantity: 2 },
            ],
        },
    });

    const handleAddItem = () => {
        form.appendItem('items', {
            id: crypto.randomUUID(),
            name: '',
            quantity: 1,
        });
    };

    const handleRemoveItem = (index: number) => {
        form.removeItem('items', index);
    };

    const onSubmit = async (values: MyFormData) => {
        console.log('Form submitted:', values);
        // Sua lógica de submit aqui
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Campo simples - usando render props (recomendado) */}
            <FormField name="title" label="Título" required form={form}>
                {(props) => <InputText {...props} placeholder="Digite o título" />}
            </FormField>

            {/* Campo simples - usando cloneElement (compatível com versão anterior) */}
            <FormField name="email" label="Email" required form={form}>
                <InputText placeholder="Digite o email" />
            </FormField>

            {/* Array de items */}
            <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Items</h3>

                {form.getArrayField<SubItem>('items').map((item, index) => (
                    <div key={item.id} className="flex gap-2 mb-2 items-end">
                        {/* Campo do array usando path notation */}
                        <FormField
                            name={`items.${index}.name`}
                            label={index === 0 ? 'Nome' : undefined}
                            form={form}
                        >
                            {(props) => (
                                <InputText {...props} placeholder="Nome do item" />
                            )}
                        </FormField>

                        <FormField
                            name={`items.${index}.quantity`}
                            label={index === 0 ? 'Quantidade' : undefined}
                            form={form}
                        >
                            {(props) => (
                                <InputText
                                    {...props}
                                    type="number"
                                    placeholder="Qtd"
                                    className="w-20"
                                />
                            )}
                        </FormField>

                        <Button
                            type="button"
                            icon="pi pi-trash"
                            severity="danger"
                            onClick={() => handleRemoveItem(index)}
                        />
                    </div>
                ))}

                <Button
                    type="button"
                    label="Adicionar Item"
                    icon="pi pi-plus"
                    onClick={handleAddItem}
                    className="mt-2"
                />
            </div>

            {/* Também é possível usar setValue diretamente com path */}
            <Button
                type="button"
                label="Alterar primeiro item"
                onClick={() => form.setValue('items.0.name', 'Novo nome')}
                className="mt-2"
            />

            {/* Ou atualizar o item inteiro */}
            <Button
                type="button"
                label="Atualizar item completo"
                onClick={() =>
                    form.updateItem('items', 0, {
                        id: '1',
                        name: 'Item Atualizado',
                        quantity: 10,
                    })
                }
                className="mt-2 ml-2"
            />

            <div className="mt-4">
                <Button
                    type="submit"
                    label="Salvar"
                    loading={form.isSubmitting}
                    disabled={!form.isValid}
                />
            </div>

            {/* Debug - mostrar valores atuais */}
            <pre className="mt-4 p-2 bg-gray-100 rounded text-xs">
                {JSON.stringify(form.values, null, 2)}
            </pre>
        </form>
    );
}

/**
 * Exemplo de uso manual sem FormField (controle total)
 */
export function ManualArrayExample() {
    const form = useForm<MyFormData>({
        title: { initialValue: '' },
        email: { initialValue: '' },
        items: {
            initialValue: [{ id: '1', name: '', quantity: 1 }],
        },
    });

    return (
        <div>
            {form.getArrayField<SubItem>('items').map((item, index) => {
                // Obtém props para cada campo do array
                const nameProps = form.getFieldProps(`items.${index}.name`);
                const qtyProps = form.getFieldProps(`items.${index}.quantity`);

                return (
                    <div key={item.id} className="flex gap-2">
                        <InputText
                            value={nameProps.value}
                            onChange={nameProps.onChange}
                            onBlur={nameProps.onBlur}
                        />
                        <InputText
                            type="number"
                            value={qtyProps.value}
                            onChange={qtyProps.onChange}
                            onBlur={qtyProps.onBlur}
                        />
                    </div>
                );
            })}
        </div>
    );
}
