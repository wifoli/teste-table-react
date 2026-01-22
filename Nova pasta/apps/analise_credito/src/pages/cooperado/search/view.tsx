import {
    AutoComplete,
    ButtonGradient,
    Caption,
    Container,
    Divider,
    FormActions,
    FormCol,
    FormLayout,
    Heading1,
    VStack
} from "@front-engine/ui";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { SearchCooperadoProps } from "./types";


export const ListCooperadoView: React.FC<SearchCooperadoProps> = ({
    onSearch,
    setSelectedPessoa,
    selectedPessoa,
    enabledSubmit,
    goToPessoaDetails,
}) => {

    return (
        <Container maxWidth="sm" >
            <VStack spacing={0} className="mb-4">
                <Heading1>Consulta de Cooperado</Heading1>
                <Caption>Pesquise cooperados pelo nome/razão social ou CPF/CNPJ para acessar rapidamente seus dados</Caption>
                <Divider className="my-4" />
            </VStack>

            <FormLayout responsive={false} columns={1} gap={0}>
                <FormCol>
                    <AutoComplete
                        placeholder="Selecione um cooperado"
                        emptyMessage="Nenhum cooperado encontrado"
                        fullWidth
                        required
                        onSearch={onSearch}
                        onSelect={setSelectedPessoa}
                        value={selectedPessoa}
                        searchDelay={350}
                        minLength={2}
                        helperText="Digite pelo menos 2 caracteres para buscar"
                        startAddon={<MagnifyingGlassIcon size={24} />}
                    />
                </FormCol>
            </FormLayout>

            <FormActions className="w-full">
                <ButtonGradient
                    icon={<MagnifyingGlassIcon size={20} />}
                    className="w-full"
                    label="Pesquisar"
                    type="button"
                    disabled={!enabledSubmit}
                    onClick={goToPessoaDetails}
                />
            </FormActions>
        </Container>
    );
}
