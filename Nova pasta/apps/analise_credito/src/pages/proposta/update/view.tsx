import { ButtonGradient, Caption, Container, Divider, FormActions, FormCol, FormLayout, Heading1, MultiSelect, VStack } from "@front-engine/ui";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";


export function UpdatePropostaView() {
    return (
        <div>
            <Container maxWidth="sm" >
                <VStack spacing={0} className="mb-4">
                    <Heading1>Atualização de Operações</Heading1>
                    <Caption>Atualize e acompanhe o andamento das propostas de crédito dos cooperados</Caption>
                    <Divider className="my-4" />
                </VStack>

                <FormLayout responsive={false} columns={1} gap={0}>
                    <FormCol>
                        <MultiSelect
                            placeholder="Selecione um proposta de crédito..."
                            options={[]}
                            searchable
                            startAddon={<MagnifyingGlassIcon size={24} />}
                        >
                        </MultiSelect>
                    </FormCol>
                </FormLayout>

                <FormActions className="w-full">
                    <ButtonGradient
                        icon={<MagnifyingGlassIcon size={20} />}
                        className="w-full"
                        label="Pesquisar"
                        type="submit"
                    />
                </FormActions>

          
            </Container>
        </div>
    );
}
